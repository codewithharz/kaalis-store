const Product = require("../models/productModels");
const User = require("../models/userModels");
const Review = require("../models/reviewRatingModels");
const Seller = require("../models/sellerModels");
const ShippingRule = require("../models/shippingRulesModel");
const Order = require("../models/orderModels");
const ProductRating = require("../models/productRatingModel");
const Category = require("../models/categoryModels");
const mongoose = require("mongoose");

const { bucket } = require("../utils/firebaseConfig");
const { v4: uuidv4 } = require("uuid");

// Add multiple products (bulk addition)
exports.addProducts = async (req, res) => {
  try {
    const products = req.body;
    const userId = req.user._id; // Assuming you have user authentication middleware

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid input: expected an array of products" });
    }
    if (products.length > 100) {
      return res
        .status(400)
        .json({ error: "Cannot add more than 100 products at once" });
    }

    const processedProducts = await Promise.all(
      products.map(async (product) => {
        // Find or create category
        let category;
        if (mongoose.Types.ObjectId.isValid(product.category)) {
          category = await Category.findById(product.category);
          if (!category) {
            throw new Error(`Category with id ${product.category} not found`);
          }
        } else {
          // If category is not an ObjectId, assume it's a name and create a new category
          const categorySlug = product.category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");
          category = await Category.findOne({ slug: categorySlug });
          if (!category) {
            category = new Category({
              name: product.category,
              slug: categorySlug,
            });
            await category.save();
          }
        }

        // Generate slug for product
        const productSlug = `${product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

        return {
          ...product,
          user: userId,
          category: category._id,
          slug: productSlug,
        };
      })
    );

    const savedProducts = await Product.insertMany(processedProducts);
    res.status(201).json(savedProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    console.log("getAllProducts - req.query:", req.query);

    const {
      page = 1,
      limit = 20, // Default higher for infinite scroll
      sort = "-createdAt",
      random,
      excludeId,
      unitCategory,
      unitRange,
      minPrice,
      maxPrice,
      color,
      search,
      ...otherFilters
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { tags: new RegExp(search, "i") },
      ];
    }

    if (color) {
      const colorQuery = {
        $or: [
          { color: new RegExp(color, "i") },
          { "availableColors.name": new RegExp(color, "i") },
          { "variants.color.name": new RegExp(color, "i") },
        ],
      };
      if (query.$or) {
        query.$and = [{ $or: query.$or }, colorQuery];
        delete query.$or;
      } else {
        query.$or = colorQuery.$or;
      }
    }

    // Apply filters
    if (unitCategory) {
      query.unitCategory = unitCategory;
    }

    if (unitRange) {
      const [min, max] = unitRange.split("-");
      query["unit.value"] = { $gte: Number(min), $lte: Number(max) };
    }

    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }

    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }

    // Add other filters
    Object.keys(otherFilters).forEach((key) => {
      query[key] = otherFilters[key];
    });

    if (excludeId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
    }

    let products;
    let totalProducts;

    if (random === "true") {
      products = await Product.aggregate([
        { $match: query },
        { $sample: { size: parseInt(limit) } },
      ]);

      // After aggregation, populate the necessary fields
      products = await Product.populate(products, {
        path: "category",
        select: "_id name",
      });

      totalProducts = await Product.countDocuments(query);
    } else {
      const skip = (parseInt(page) - 1) * parseInt(limit);

      products = await Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("user", "username");

      totalProducts = await Product.countDocuments(query);
    }

    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        // Get ratings from both Review and ProductRating models
        const reviews = await Review.find({ product: product._id });
        const ratings = await ProductRating.find({ product: product._id });

        // Combine ratings from both sources
        const allRatings = [...ratings, ...reviews];

        // Calculate combined average rating
        const totalRatings = allRatings.reduce(
          (acc, curr) => acc + curr.rating,
          0
        );
        const averageRating =
          allRatings.length > 0 ? totalRatings / allRatings.length : 0;
        const numberOfRatings = allRatings.length;

        return {
          ...(product.toObject ? product.toObject() : product),
          averageRating,
          numberOfRatings,
        };
      })
    );

    const shippingRules = await ShippingRule.findOne({ isDefault: true });

    // Define default shipping rules in case no default rule is found
    const defaultShippingRules = {
      baseShippingFee: 5.99,
      freeShippingThreshold: 50,
      categoryFees: new Map(),
      perWeightUnitFee: 0.1,
    };

    const productsWithShipping = productsWithRatings.map((product) => {
      let shippingFee = shippingRules
        ? shippingRules.baseShippingFee
        : defaultShippingRules.baseShippingFee;

      if (
        product.price >
        (shippingRules
          ? shippingRules.freeShippingThreshold
          : defaultShippingRules.freeShippingThreshold)
      ) {
        shippingFee = 0;
      } else {
        // Safely handle category fee calculation
        const categoryId = product.category
          ? product.category.toString()
          : null;
        const categoryFee = categoryId
          ? shippingRules?.categoryFees?.get(categoryId) ||
          defaultShippingRules.categoryFees?.get(categoryId) ||
          0
          : 0;
        shippingFee += categoryFee;

        const weightFee =
          (product.unit?.value || 0) *
          (shippingRules
            ? shippingRules.perWeightUnitFee
            : defaultShippingRules.perWeightUnitFee);
        shippingFee += weightFee;
      }

      return {
        ...product,
        estimatedShippingFee: Number(shippingFee.toFixed(2)),
      };
    });

    res.status(200).json({
      products: productsWithShipping,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts: totalProducts,
      shippingRules: shippingRules || defaultShippingRules,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all products by category
exports.getAllProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, color } = req.query;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const descendantCategories = await Category.find({ ancestors: categoryId });
    const allCategoryIds = [
      category._id,
      ...descendantCategories.map((c) => c._id),
    ];

    let query = { category: { $in: allCategoryIds } };

    if (color) {
      query.$and = [
        { category: { $in: allCategoryIds } },
        {
          $or: [
            { color: new RegExp(color, "i") },
            { "availableColors.name": new RegExp(color, "i") },
            { "variants.color.name": new RegExp(color, "i") },
          ],
        },
      ];
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "username");

    const count = await Product.countDocuments(query);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId)
//       .populate({
//         path: "user",
//         select: "username isSeller sellerProfile",
//         populate: {
//           path: "addresses",
//           model: "Address",
//           select: "city country",
//         },
//       })
//       .populate({
//         path: "user",
//         populate: {
//           path: "sellerProfile",
//           model: "Seller",
//         },
//       });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const reviews = await Review.find({ product: product._id });
//     const averageRating =
//       reviews.length > 0
//         ? reviews.reduce((acc, review) => acc + review.rating, 0) /
//           reviews.length
//         : 0;
//     const numberOfRatings = reviews.length;

//     const productResponse = {
//       ...product.toObject(),
//       averageRating,
//       numberOfRatings,
//       seller: {
//         username: product.user.username,
//         isSeller: product.user.isSeller,
//         sellerProfile: product.user.sellerProfile,
//         address:
//           product.user.addresses.length > 0
//             ? {
//                 city: product.user.addresses[0].city,
//                 country: product.user.addresses[0].country,
//               }
//             : null,
//       },
//     };

//     res.status(200).json(productResponse);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getProductById = async (req, res) => {
  try {
    // Add ObjectId validation
    const productId = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(productId)
      .populate({
        path: "user",
        select: "username isSeller sellerProfile",
        populate: {
          path: "addresses",
          model: "Address",
          select: "city country",
        },
      })
      .populate({
        path: "user",
        populate: {
          path: "sellerProfile",
          model: "Seller",
        },
      });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Make sure to define ProductRating at the top of your file
    const ratings = await ProductRating.find({ product: productId });
    const reviews = await Review.find({ product: productId });

    // Combine ratings from both sources
    const allRatings = [...ratings, ...reviews];

    // Calculate ratings
    const totalRatings = allRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating =
      allRatings.length > 0 ? totalRatings / allRatings.length : 0;
    const numberOfRatings = allRatings.length;

    const productResponse = {
      ...product.toObject(),
      averageRating,
      numberOfRatings,
      seller: {
        username: product.user.username,
        isSeller: product.user.isSeller,
        sellerProfile: product.user.sellerProfile,
        address:
          product.user.addresses && product.user.addresses.length > 0
            ? {
              city: product.user.addresses[0].city,
              country: product.user.addresses[0].country,
            }
            : null,
      },
    };

    res.status(200).json(productResponse);
  } catch (error) {
    console.error("Error in getProductById:", error); // Add better error logging
    res.status(500).json({ error: error.message });
  }
};

// Rate a product
// exports.rateProduct = async (req, res) => {
//   const { productId } = req.params;
//   const { rating, review } = req.body;
//   const userId = req.user._id;

//   try {
//     const order = await Order.findOne({
//       user: userId,
//       "products.product": productId,
//       status: "Delivered",
//     });

//     if (!order) {
//       return res
//         .status(403)
//         .json({ message: "You can only rate products you have purchased" });
//     }

//     const existingRating = await ProductRating.findOne({
//       user: userId,
//       product: productId,
//     });
//     if (existingRating) {
//       return res
//         .status(400)
//         .json({ message: "You have already rated this product" });
//     }

//     const newRating = new ProductRating({
//       user: userId,
//       product: productId,
//       rating,
//       review,
//     });
//     await newRating.save();

//     const allRatings = await ProductRating.find({ product: productId });
//     const averageRating =
//       allRatings.reduce((acc, curr) => acc + curr.rating, 0) /
//       allRatings.length;

//     await Product.findByIdAndUpdate(
//       productId,
//       {
//         $set: {
//           averageRating: averageRating,
//           numberOfRatings: allRatings.length,
//         },
//       },
//       { new: true, runValidators: false }
//     );

//     await Order.findOneAndUpdate(
//       { _id: order._id, "products.product": productId },
//       {
//         $set: { "products.$.rated": true },
//         $push: { ratedProducts: { product: productId, rated: true } },
//       },
//       { new: true }
//     );

//     res
//       .status(201)
//       .json({ message: "Product rated successfully", rating: newRating });
//   } catch (error) {
//     console.error("Error rating product:", error);
//     res
//       .status(500)
//       .json({ message: "Error rating product", error: error.message });
//   }
// };

exports.rateProduct = async (req, res) => {
  const { productId } = req.params;
  const { rating, review } = req.body;
  const userId = req.user._id;

  try {
    // First verify the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Finding order for:", { userId, productId }); // Add debug log

    // Find order where this product was purchased and delivered
    const order = await Order.findOne({
      user: userId,
      "products.product": new mongoose.Types.ObjectId(productId), // Convert to ObjectId
      status: "Delivered",
    });

    console.log("Found order:", order); // Add debug log

    if (!order) {
      return res.status(403).json({
        message: "You can only rate products you have purchased and received",
      });
    }

    // Check for existing rating
    const existingRating = await ProductRating.findOne({
      user: userId,
      product: productId,
    });

    if (existingRating) {
      return res
        .status(400)
        .json({ message: "You have already rated this product" });
    }

    // Create new rating
    const newRating = new ProductRating({
      user: userId,
      product: productId,
      rating,
      review,
    });

    await newRating.save();

    // Update product's average rating
    const allRatings = await ProductRating.find({ product: productId });
    const averageRating =
      allRatings.reduce((acc, curr) => acc + curr.rating, 0) /
      allRatings.length;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          averageRating: averageRating,
          numberOfRatings: allRatings.length,
        },
      },
      { new: true }
    );

    // Mark the product as rated in the order
    // await Order.findOneAndUpdate(
    //   {
    //     _id: order._id,
    //     "products.product": productId,
    //   },
    //   {
    //     $set: {
    //       "products.$.rated": true,
    //       "ratedProducts.$.rated": true,
    //     },
    //   }
    // );

    await Order.findOneAndUpdate(
      {
        _id: order._id,
        "products.product": productId,
      },
      {
        $set: {
          "products.$.rated": true,
        },
        $push: {
          ratedProducts: { product: productId, rated: true },
        },
      }
    );

    res.status(201).json({
      message: "Product rated successfully",
      rating: newRating,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error rating product:", error);
    res.status(500).json({
      message: "Error rating product",
      error: error.message,
    });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await ProductRating.find()
      .populate("user", "username")
      .populate("product", "name images")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await ProductRating.find({ user: userId })
      .populate("user", "username")
      .populate("product", "name images")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
};

// Get user's pending reviews (products they can still review)
exports.getUserPendingReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all delivered orders for this user
    const deliveredOrders = await Order.find({
      user: userId,
      status: "Delivered",
    }).populate("products.product", "name images _id");

    // Get all products this user has already rated
    const ratedProductIds = await ProductRating.find({ user: userId }).distinct(
      "product"
    );

    const ratedProductSet = new Set(ratedProductIds.map((id) => id.toString()));

    // Find products from delivered orders that haven't been rated
    const pendingReviews = [];

    deliveredOrders.forEach((order) => {
      order.products.forEach((productItem) => {
        if (
          productItem.product &&
          !ratedProductSet.has(productItem.product._id.toString())
        ) {
          pendingReviews.push({
            orderId: order.orderId,
            deliveryDate: order.updatedAt,
            product: productItem.product,
          });
        }
      });
    });

    res.json(pendingReviews);
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ error: "Failed to fetch pending reviews" });
  }
};

exports.markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await ProductRating.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if user already marked this review as helpful
    if (!review.helpfulBy.includes(userId)) {
      review.helpfulCount = (review.helpfulCount || 0) + 1;
      review.helpfulBy.push(userId);
      await review.save();
    }

    res.json(review);
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    res.status(500).json({ error: "Failed to mark review as helpful" });
  }
};

// Get product ratings
exports.getProductRatings = async (req, res) => {
  const { productId } = req.params;

  try {
    const ratings = await ProductRating.find({ product: productId })
      .populate("user", "username")
      .sort("-createdAt");

    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    res.status(500).json({
      message: "Error fetching product ratings",
      error: error.message,
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { userId, productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const updateData = { ...req.body };

    // Add color validation
    if (updateData.color && typeof updateData.color === "string") {
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(updateData.color)) {
        throw new Error("Invalid main color hex code");
      }
    }

    if (updateData.availableColors) {
      if (typeof updateData.availableColors === "string") {
        updateData.availableColors = JSON.parse(updateData.availableColors);
      }
      updateData.availableColors.forEach((color) => {
        if (!color.name || !color.hexCode) {
          throw new Error("Each color must have both name and hex code");
        }
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hexCode)) {
          throw new Error(`Invalid hex code for color: ${color.name}`);
        }
      });
    }

    // Handle nested objects and arrays
    ["variants", "tags", "bulkPricing"].forEach((field) => {
      if (typeof updateData[field] === "string") {
        updateData[field] = JSON.parse(updateData[field]);
      }
    });

    // Validate variant colors if present
    if (updateData.variants) {
      updateData.variants.forEach((variant) => {
        if (variant.color) {
          if (!variant.color.name || !variant.color.hexCode) {
            throw new Error(
              "Each variant color must have both name and hex code"
            );
          }
          if (
            !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(variant.color.hexCode)
          ) {
            throw new Error(
              `Invalid hex code for variant color: ${variant.color.name}`
            );
          }
        }
      });
    }

    if (updateData.unit) {
      updateData.unit = {
        category: updateData.unit.category,
        baseUnit: updateData.unit.baseUnit,
        conversionFactor: updateData.unit.conversionFactor,
        value: updateData.unit.value,
        displayUnit: updateData.unit.displayUnit,
        packagingUnit: updateData.unit.packagingUnit,
        precision: updateData.unit.precision,
        compoundUnit: updateData.unit.compoundUnit,
        regionSpecificDisplay: updateData.unit.regionSpecificDisplay,
      };
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res
        .status(403)
        .json({ error: "Unauthorized or product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload a new product
exports.uploadProduct = async (req, res) => {
  const { userId } = req.params;
  const productData = req.body;

  try {
    console.log("Received product data:", JSON.stringify(productData, null, 2));

    // Validate images array
    if (!productData.images || !Array.isArray(productData.images)) {
      throw new Error("Product images array is required and must be an array");
    }

    if (productData.images.length === 0) {
      throw new Error("At least one product image is required");
    }

    // Validate image URLs
    productData.images = productData.images
      .filter((url) => url && typeof url === "string" && url.trim() !== "")
      .map((url) => url.trim());

    // Add color validation
    if (productData.color && typeof productData.color === "string") {
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(productData.color)) {
        throw new Error("Invalid main color hex code");
      }
    }

    if (
      productData.availableColors &&
      Array.isArray(productData.availableColors)
    ) {
      productData.availableColors.forEach((color) => {
        if (!color.name || !color.hexCode) {
          throw new Error("Each color must have both name and hex code");
        }
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hexCode)) {
          throw new Error(`Invalid hex code for color: ${color.name}`);
        }
      });
    }

    // Validate variant colors if present
    if (productData.variants && Array.isArray(productData.variants)) {
      productData.variants.forEach((variant) => {
        if (variant.color) {
          if (!variant.color.name || !variant.color.hexCode) {
            throw new Error(
              "Each variant color must have both name and hex code"
            );
          }
          if (
            !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(variant.color.hexCode)
          ) {
            throw new Error(
              `Invalid hex code for variant color: ${variant.color.name}`
            );
          }
        }
      });
    }

    // Generate slug
    const slug = `${productData.name
      .toLowerCase()
      .replace(/ /g, "-")}-${Date.now()}`;

    // Handle category
    let categoryId;
    if (mongoose.Types.ObjectId.isValid(productData.category)) {
      categoryId = new mongoose.Types.ObjectId(productData.category);
    } else {
      let existingCategory = await Category.findOne({
        name: productData.category,
      });
      if (!existingCategory) {
        const newCategory = new Category({
          name: productData.category,
          slug: productData.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        });
        existingCategory = await newCategory.save();
      }
      categoryId = existingCategory._id;
    }

    // Create new product with explicit images array
    const newProduct = new Product({
      ...productData,
      slug,
      user: userId,
      category: categoryId,
      // images: req.files ? req.files.map((file) => file.path) : [],
      images: productData.images, // Use the validated images array from request body
    });

    console.log("Saving product with images:", newProduct.images);

    const savedProduct = await newProduct.save();

    // Verify images were saved
    if (!savedProduct.images || savedProduct.images.length === 0) {
      console.warn("Warning: Saved product has no images:", savedProduct);
    }

    // Update user and seller references
    await User.findByIdAndUpdate(userId, {
      $push: { products: newProduct._id },
    });

    const user = await User.findById(userId);
    if (user.isSeller && user.sellerProfile) {
      await Seller.findByIdAndUpdate(user.sellerProfile, {
        $push: { products: newProduct._id },
      });
    }

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error uploading product:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: productId,
      user: userId,
    });
    if (!deletedProduct) {
      return res
        .status(403)
        .json({ error: "Unauthorized or product not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { products: productId },
    });

    const user = await User.findById(userId);
    if (user.isSeller && user.sellerProfile) {
      await Seller.findByIdAndUpdate(user.sellerProfile, {
        $pull: { products: productId },
      });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's products
exports.getUserProducts = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default to 12 for user products
  try {
    const products = await Product.find({ user: userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort("-createdAt") // check this on what product needs to show first
      .populate("user", "username"); // Keep populate to match existing patterns

    const count = await Product.countDocuments({ user: userId });

    res.status(200).json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      totalProducts: count,
    });
  } catch (error) {
    console.error("Error in getUserProducts:", error); // Added error logging
    res.status(500).json({ error: error.message });
  }
};

// Get related products
exports.getRelatedProducts = async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, includeColor = false } = req.query;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let query = {
      _id: { $ne: productId },
      tags: { $in: product.tags },
    };

    // If includeColor is true, add color matching to the query
    if (includeColor === "true" && product.color) {
      query.$or = [
        { color: product.color },
        {
          "availableColors.name": {
            $in: product.availableColors.map((c) => c.name),
          },
        },
      ];
    }

    const relatedProducts = await Product.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      relatedProducts,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

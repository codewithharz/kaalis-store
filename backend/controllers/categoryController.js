const mongoose = require("mongoose");
const Category = require("../models/categoryModels");
const Product = require("../models/productModels");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    console.log("Fetching categories...");

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error(
        "Database not connected. State:",
        mongoose.connection.readyState
      );
      throw new Error("Database connection not ready");
    }

    const categories = await Category.find().lean();

    console.log(`Successfully fetched ${categories?.length || 0} categories`);

    res.json(categories);
  } catch (error) {
    console.error("Error in getAllCategories:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return res.status(500).json({
      error: {
        message: "Failed to fetch categories",
        details: error.message,
        code: error.code || "UNKNOWN_ERROR",
      },
    });
  }
};

// Get a specific category
exports.getCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        error: {
          message: "Invalid category ID format",
          code: "INVALID_ID",
        },
      });
    }

    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res.status(404).json({
        error: {
          message: "Category not found",
          code: "NOT_FOUND",
        },
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a test endpoint to verify database connection
exports.testConnection = async (req, res) => {
  try {
    console.log("Testing database connection...");

    // Check connection state
    const dbState = mongoose.connection.readyState;
    const stateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    // Try to run a simple query to verify database access
    const count = await Category.countDocuments();

    return res.status(200).json({
      status: "success",
      message: "Database connection successful",
      details: {
        connectionState: stateMap[dbState],
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        categoriesCount: count,
      },
    });
  } catch (error) {
    console.error("Database connection test failed:", error);

    return res.status(500).json({
      error: {
        message: "Database connection test failed",
        details: error.message,
        code: "DB_TEST_FAILED",
        state: mongoose.connection.readyState,
      },
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    // Find the category by slug
    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find products with this category and populate seller information
    const products = await Product.find({ category: category._id })
      .populate("seller", "name") // Assuming you want to include seller name
      .select(
        "name description price images discount averageRating numberOfRatings"
      ); // Select the fields you want to return

    res.json({
      categoryName: category.name,
      products: products,
    });
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    // Find the category by slug
    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Helper to recursively get all descendant IDs
    const getDescendantIds = async (parentId) => {
      const children = await Category.find({ parent: parentId }).select("_id");
      let ids = children.map((c) => c._id);
      for (const child of children) {
        ids = ids.concat(await getDescendantIds(child._id));
      }
      return ids;
    };

    // Get all category IDs (current + descendants)
    const descendantIds = await getDescendantIds(category._id);
    const allCategoryIds = [category._id, ...descendantIds];

    console.log(
      `Fetching products for category: ${category.name} (${allCategoryIds.length} categories included)`
    );

    // Find products with this category OR any subcategory
    const products = await Product.find({ category: { $in: allCategoryIds } })
      .populate("seller", "name")
      .select(
        "name description price images discount averageRating numberOfRatings brand"
      );

    // Get the full category path
    const categoryPath = await getCategoryPath(category);

    res.json({
      categoryName: category.name,
      categoryPath: categoryPath,
      products: products,
    });
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to get the full category path
const getCategoryPath = async (category) => {
  const path = [];
  let currentCategory = category;

  while (currentCategory) {
    path.unshift({ name: currentCategory.name, slug: currentCategory.slug });
    if (currentCategory.parent) {
      currentCategory = await Category.findById(currentCategory.parent);
    } else {
      break;
    }
  }

  return path;
};

exports.createCategory = async (req, res) => {
  const { categories } = req.body;

  try {
    const newCategory = await Category.createCategoryPath(categories);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.suggestNewCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Check if a category with the same name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.json(existingCategory);
    }

    // Create a new category
    const newCategory = new Category({
      name,
      slug,
      description: `Suggested category: ${name}`,
    });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      {
        new: true,
      }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get subcategories of a specific category
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Category.find({
      parent: req.params.categoryId,
    });
    if (!subcategories) {
      return res.status(404).json({ message: "No subcategories found" });
    }
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Helper function to recursively fetch subcategories
const fetchAllDescendants = async (parentId) => {
  const subcategories = await Category.find({ parent: parentId });
  const result = [];

  for (const subcategory of subcategories) {
    const descendants = await fetchAllDescendants(subcategory._id);
    result.push({ ...subcategory.toObject(), children: descendants });
  }

  return result;
};

// Get all descendants of a specific category
exports.getAllDescendants = async (req, res) => {
  try {
    const descendants = await fetchAllDescendants(req.params.categoryId);
    res.json(descendants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

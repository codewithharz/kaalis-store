const Wishlist = require("../models/wishlistModels");
const User = require("../models/userModels");

// Create a wishlist
const createWishlist = async (req, res) => {
  const {
    name,
    visibility,
    description,
    priority,
    categories,
    notificationsEnabled,
  } = req.body;
  try {
    const wishlist = new Wishlist({
      user: req.user.id,
      name,
      visibility,
      description,
      priority,
      categories,
      notificationsEnabled,
    });
    await wishlist.save();
    res.status(201).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all wishlists of a user
const getUserWishlists = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  try {
    const total = await Wishlist.countDocuments({ user: req.params.userId });
    const wishlists = await Wishlist.find({ user: req.params.userId })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      wishlists,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalWishlists: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// new
const getProductsInWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;

    // Add these pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const wishlist = await Wishlist.findById(wishlistId).populate("products"); // Adjust to match your schema
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Add pagination logic
    const total = wishlist.products.length;
    const paginatedProducts = wishlist.products.slice(skip, skip + limit);

    res.json({
      products: paginatedProducts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist products", error });
  }
};

// Get wishlist by ID
const getWishlistById = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId)
      .populate("user")
      .populate("products");
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (
      wishlist.user._id.toString() !== req.user.id &&
      !wishlist.sharedWith.includes(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this wishlist",
      });
    }
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update wishlist
const updateWishlist = async (req, res) => {
  const {
    name,
    visibility,
    description,
    priority,
    categories,
    notificationsEnabled,
  } = req.body;
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this wishlist",
      });
    }

    wishlist.name = name || wishlist.name;
    wishlist.visibility = visibility || wishlist.visibility;
    wishlist.description = description || wishlist.description;
    wishlist.priority = priority || wishlist.priority;
    wishlist.categories = categories || wishlist.categories;
    wishlist.notificationsEnabled =
      notificationsEnabled !== undefined
        ? notificationsEnabled
        : wishlist.notificationsEnabled;

    await wishlist.save();
    res.json({
      success: true,
      message: "Wishlist updated successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete wishlist
const deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this wishlist",
      });
    }
    await wishlist.deleteOne();
    res.json({ success: true, message: "Wishlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Share wishlist
const shareWishlist = async (req, res) => {
  const { sharedWith, products } = req.body;
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to share this wishlist",
      });
    }

    if (sharedWith && !Array.isArray(sharedWith)) {
      return res
        .status(400)
        .json({ success: false, message: "sharedWith must be an array" });
    }

    if (products && !Array.isArray(products)) {
      return res
        .status(400)
        .json({ success: false, message: "products must be an array" });
    }

    if (sharedWith) {
      wishlist.sharedWith = [
        ...new Set([...wishlist.sharedWith, ...sharedWith]),
      ];
    }

    if (products) {
      wishlist.products = [...new Set([...wishlist.products, ...products])];
    }

    await wishlist.save();

    res.json({
      success: true,
      message: "Wishlist shared successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle wishlist notifications
const toggleWishlistNotifications = async (req, res) => {
  const { notificationsEnabled } = req.body;
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this wishlist",
      });
    }
    wishlist.notificationsEnabled = notificationsEnabled;
    await wishlist.save();
    res.json({
      success: true,
      message: "Wishlist notifications toggled successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a category to a wishlist
const addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this wishlist",
      });
    }
    wishlist.categories.push({ name, description });
    await wishlist.save();
    res.json({
      success: true,
      message: "Category added successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a category from a wishlist
const removeCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this wishlist",
      });
    }
    wishlist.categories = wishlist.categories.filter(
      (category) => category._id.toString() !== categoryId
    );
    await wishlist.save();
    res.json({
      success: true,
      message: "Category removed successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a product to a wishlist
const addProductToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this wishlist",
      });
    }
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    res.json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a product from a wishlist
const removeProductFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this wishlist",
      });
    }
    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== req.params.productId
    );
    await wishlist.save();
    res.json({
      success: true,
      message: "Product removed from wishlist successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get public wishlists
const getPublicWishlists = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  try {
    const total = await Wishlist.countDocuments({ visibility: "public" });
    const wishlists = await Wishlist.find({ visibility: "public" })
      .skip(startIndex)
      .limit(limit)
      .populate("user", "username");

    res.json({
      success: true,
      wishlists,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalWishlists: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createWishlist,
  getWishlistById,
  updateWishlist,
  deleteWishlist,
  getUserWishlists,
  shareWishlist,
  toggleWishlistNotifications,
  addCategory,
  removeCategory,
  addProductToWishlist,
  removeProductFromWishlist,
  getPublicWishlists,
  getProductsInWishlist,
};

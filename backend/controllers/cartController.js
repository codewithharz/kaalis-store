const Cart = require("../models/cartModels");
const Product = require("../models/productModels");

// Helper to determine the available stock for a product or its variant
const getAvailableStock = (product, variantIdOrObj) => {
  if (variantIdOrObj) {
    const targetId = typeof variantIdOrObj === "object" ? (variantIdOrObj._id || variantIdOrObj) : variantIdOrObj;
    const variant = product.variants.find((v) => v._id.toString() === targetId.toString());
    return variant ? (variant.stock || 0) : 0;
  }
  return product.stock || 0;
};

// Get the cart for a specific user
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "products.product",
      populate: {
        path: "user",
        select: "username isSeller",
        populate: {
          path: "sellerProfile",
          model: "Seller",
          select: "storeName fulfillmentType",
        },
      },
    });
    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a product to the cart
exports.addToCart = async (req, res) => {
  const { productId, quantity, variant } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variantId = variant ? (typeof variant === "object" ? variant._id : variant) : null;
    const maxStock = getAvailableStock(product, variantId);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(
      (p) =>
        p.product.toString() === productId &&
        ((!p.variant && !variantId) ||
          (p.variant && variantId && p.variant._id.toString() === variantId.toString()))
    );

    const existingQty = existingProductIndex > -1 ? cart.products[existingProductIndex].quantity : 0;
    if (existingQty + quantity > maxStock) {
      return res.status(400).json({
        message: `Cannot add requested quantity. Available stock is ${maxStock}. You already have ${existingQty} in your cart.`,
      });
    }

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity, variant });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a product's quantity in the cart
exports.updateCart = async (req, res) => {
  const { productId } = req.params;
  const { quantity, variantId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const maxStock = getAvailableStock(product, variantId);
    if (quantity > maxStock) {
      return res.status(400).json({
        message: `Requested quantity exceeds available stock of ${maxStock}.`,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.product.toString() === productId &&
        ((!p.variant && !variantId) ||
          (p.variant && p.variant._id.toString() === variantId.toString()))
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { variantId } = req.query;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (p) =>
        !(
          p.product.toString() === productId &&
          ((!p.variant && !variantId) ||
            (p.variant && p.variant._id === variantId))
        )
    );
    await cart.save();
    res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// // Clear the entire cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = [];
    await cart.save();
    res.json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

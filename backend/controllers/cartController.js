const Cart = require("../models/cartModels");
const Product = require("../models/productModels");

// Get the cart for a specific user
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );
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
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
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
  const { quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
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

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
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

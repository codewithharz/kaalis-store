const express = require("express");
const {
  getCart,
  addToCart,
  clearCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

const router = express.Router();

// Get the cart for a specific user
//productId has to match in controller
router.get("/", userAuthMiddleware, getCart); // GET /api/cart/

// Add a product to the cart
router.post("/", userAuthMiddleware, addToCart); // POST /api/cart/

router.delete("/", userAuthMiddleware, clearCart); // DELETE /api/cart

// Update a product's quantity in the cart
router.put("/:productId", userAuthMiddleware, updateCart); // PUT /api/cart/:productId

// Remove a product from the cart
router.delete("/:productId", userAuthMiddleware, removeFromCart); // DELETE /api/cart/:productId

module.exports = router;

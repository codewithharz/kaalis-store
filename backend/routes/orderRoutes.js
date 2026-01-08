// backend/routes/orderRoutes.js
const express = require("express");

const {
  createOrder,
  getOrderById,
  getOrderByOrderId,
  updateOrderDetails,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStatuses,
  updateFulfillmentStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");

const router = express.Router();

// Public routes
router.get("/statuses", getOrderStatuses);

// Admin routes
router.get("/", adminAuthMiddleware, getAllOrders);
router.delete("/:orderId", adminAuthMiddleware, deleteOrder);

// User routes
router.get("/user/:userId", userAuthMiddleware, getOrdersByUser);
router.post("/", userAuthMiddleware, createOrder);

// Important: More specific routes must come before general ones
router.get("/by-order-id/:orderId", userAuthMiddleware, getOrderByOrderId);
router.get("/:orderId", userAuthMiddleware, getOrderById);

router.patch("/:orderId", userAuthMiddleware, updateOrderDetails);
router.patch("/:orderId/cancel", userAuthMiddleware, cancelOrder);

// Order fulfillment status updates (Seller)
router.patch(
  "/:orderId/fulfillment-status",
  [userAuthMiddleware, sellerAuthMiddleware],
  updateFulfillmentStatus
);

// Payment status updates (User & System)
router.patch(
  "/:orderId/payment-status",
  userAuthMiddleware,
  updatePaymentStatus
);

// Updated to use PATCH for status updates
router.patch("/:orderId/status", userAuthMiddleware, updateOrderStatus);

module.exports = router;

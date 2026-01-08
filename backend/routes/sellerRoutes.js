// backend/routes/sellerRoutes.js
const express = require("express");
const {
  registerSeller,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerById,
  deleteSellerAccount,
  getDashboardData,
  getSellerOrders,
  addSellerReview,
  getAllSellerOrders,
  toggleVacationMode,
  updateOrderStatus,
  getFavoriteStores,
  generateReport,
  followSeller,
  unfollowSeller,
  getFollowStatus,
  sendMessageToSeller,
  requestVerification,
  updateVerificationStatus,
  getPendingVerifications,
  cancelVerificationRequest,
} = require("../controllers/sellerController");
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const router = express.Router();

// General routes first (no parameters)
router.get("/user-favorites", userAuthMiddleware, getFavoriteStores);
router.get("/pending-verifications", adminAuthMiddleware, getPendingVerifications);
router.post("/register", sellerAuthMiddleware, registerSeller);

// Parameterized routes
router.get("/:sellerId/profile", sellerAuthMiddleware, getSellerProfile);
router.put("/:sellerId/profile", sellerAuthMiddleware, updateSellerProfile);
router.get("/:sellerId/products", userAuthMiddleware, getSellerProducts);
router.get("/:sellerId/dashboard", sellerAuthMiddleware, getDashboardData);
router.get("/:sellerId/orders", sellerAuthMiddleware, getSellerOrders);
router.get("/:sellerId/all-orders", sellerAuthMiddleware, getAllSellerOrders);
router.get("/:sellerId/reports/:type", sellerAuthMiddleware, generateReport);
router.get("/:sellerId/follow-status", userAuthMiddleware, getFollowStatus);
router.post('/:sellerId/message', userAuthMiddleware, sendMessageToSeller);

// POST routes with parameters
router.post("/:sellerId/reviews", userAuthMiddleware, addSellerReview);
router.post("/:sellerId/follow", userAuthMiddleware, followSeller);
router.post("/:sellerId/unfollow", userAuthMiddleware, unfollowSeller);
router.post("/:sellerId/toggle-vacation-mode", sellerAuthMiddleware, toggleVacationMode);
router.post("/:sellerId/request-verification", sellerAuthMiddleware, requestVerification);
router.post("/:sellerId/cancel-verification", sellerAuthMiddleware, cancelVerificationRequest);

// PUT/PATCH/DELETE routes
router.put("/:sellerId/verify", adminAuthMiddleware, updateVerificationStatus);
router.patch("/:orderId/status", sellerAuthMiddleware, updateOrderStatus);
router.delete("/:sellerId", sellerAuthMiddleware, deleteSellerAccount);

// Generic seller route should be last
router.get("/:sellerId", getSellerById);

module.exports = router;
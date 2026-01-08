// backend/routes/couponRoutes.js
const express = require("express");
const {
  createCoupon,
  getSellerCoupons,
  validateCoupon,
  applyCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  removeCoupon,
  invalidateCoupon,
} = require("../controllers/couponController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

const couponRoutes = express.Router();

// Seller operations
couponRoutes.post("/create", userAuthMiddleware, createCoupon); // Sellers can create coupons
couponRoutes.get("/seller", userAuthMiddleware, getSellerCoupons); // Sellers can view their own coupons
couponRoutes.get("/:couponId", userAuthMiddleware, getCouponById);
couponRoutes.put("/:couponId", userAuthMiddleware, updateCoupon);
couponRoutes.delete("/:couponId", userAuthMiddleware, deleteCoupon);

// Public operations
couponRoutes.post("/validate", validateCoupon); // Public e.g {"code": "SAVE20"}
couponRoutes.post("/apply", applyCoupon); // Public e.g {"code": "SAVE20"}
couponRoutes.post("/remove", userAuthMiddleware, removeCoupon);
couponRoutes.post("/invalidate", userAuthMiddleware, invalidateCoupon);

// Admin operations (if needed)
couponRoutes.get("/admin/all", adminAuthMiddleware, getAllCoupons); // Admin can view all coupons

module.exports = couponRoutes;

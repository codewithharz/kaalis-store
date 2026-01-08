// backend/routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  completeUserProfile,
  clearUserProfile,
  getUserProducts,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
  becomeSeller,
} = require("../controllers/userController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

const router = express.Router();

//userId has to match in controller

// Auth routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login user
router.get("/verify-email/:token", verifyEmail); // Verify email
router.post("/resend-verification", resendVerificationEmail);

// Password routes
router.post("/request-password-reset", requestPasswordReset); // Request password reset
router.post("/reset-password/:token", resetPassword); // Reset password
router.post("/change-password", userAuthMiddleware, changePassword); // Change password

// User profile routes
router.get("/:userId/profile", userAuthMiddleware, getUserProfile); // Get user profile
router.put("/:userId/profile", userAuthMiddleware, completeUserProfile); // Complete user profile
router.put("/:userId/clear-profile", userAuthMiddleware, clearUserProfile); // Clear user profile
router.get("/:userId/products", userAuthMiddleware, getUserProducts); // Get user's products

// Seller routes
router.post("/become-seller/:userId", userAuthMiddleware, becomeSeller); // Become a seller
module.exports = router;

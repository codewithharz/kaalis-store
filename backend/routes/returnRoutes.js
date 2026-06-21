// backend/routes/returnRoutes.js
const express = require("express");
const {
  createReturnRequest,
  getUserReturns,
  getAdminReturns,
  updateReturnStatus,
} = require("../controllers/returnController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// User routes (Buyers)
router.post("/", userAuthMiddleware, createReturnRequest);
router.get("/user", userAuthMiddleware, getUserReturns);

// Admin routes (Managers)
router.get("/admin", adminAuthMiddleware, getAdminReturns);
router.patch("/admin/:returnId/status", adminAuthMiddleware, updateReturnStatus);

module.exports = router;

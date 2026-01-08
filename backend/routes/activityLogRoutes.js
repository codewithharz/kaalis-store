// activityLogRoutes.js
const express = require("express");
const {
  addActivityLogs,
  getAllActivityLogs,
  getUserActivityLogs,
  updateActivityLog,
  deleteActivityLog,
} = require("../controllers/activityLogController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

const router = express.Router();

//userId, activityLogId has to match in controller
router.post("/", userAuthMiddleware, addActivityLogs); // Add multiple activity logs
router.get("/", userAuthMiddleware, getAllActivityLogs); // Get all activity logs
router.get("/:userId", userAuthMiddleware, getUserActivityLogs); // Get user's activity logs
router.put("/:userId/:activityLogId", userAuthMiddleware, updateActivityLog); // Update activity log
router.delete("/:activityLogId", userAuthMiddleware, deleteActivityLog);

module.exports = router;

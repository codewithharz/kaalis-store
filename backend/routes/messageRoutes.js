// backend/routes/messageRoutes.js
const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const {
  getMessageDetails,
  markAsRead,
  replyToMessage,
} = require("../controllers/messageController");

const router = express.Router();

// Get message details
router.get("/:messageId", userAuthMiddleware, getMessageDetails);

// Mark message as read
router.patch("/:messageId/read", userAuthMiddleware, markAsRead);

// Reply to message
router.post("/reply", userAuthMiddleware, replyToMessage);

module.exports = router;

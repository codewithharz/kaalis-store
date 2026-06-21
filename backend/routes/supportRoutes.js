const express = require("express");
const {
  createSupportMessage,
  getSupportMessages,
  resolveSupportMessage,
} = require("../controllers/supportController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Public route to submit support ticket
router.post("/contact", createSupportMessage);

// Admin-only routes to get and resolve tickets
router.get("/", adminAuthMiddleware, getSupportMessages);
router.patch("/:id/resolve", adminAuthMiddleware, resolveSupportMessage);

module.exports = router;

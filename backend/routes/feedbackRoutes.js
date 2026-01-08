const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const {
  createFeedback,
  deleteFeedback,
  getFeedbackByUser,
  getAllFeedback,
} = require("../controllers/feedbackControllers");

const router = express.Router();

// Routes for feedback
router.post("/", userAuthMiddleware, createFeedback);
router.delete("/:feedbackId", userAuthMiddleware, deleteFeedback);
router.get("/user/:userId", userAuthMiddleware, getFeedbackByUser);
router.get("/", userAuthMiddleware, getAllFeedback);

module.exports = router;

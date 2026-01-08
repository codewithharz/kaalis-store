// routes/interactionRoutes.js
const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const {
  createInteraction,
  deleteInteraction,
  getInteractionsByUser,
  getInteractionsByProduct,
} = require("../controllers/interactionController");

const router = express.Router();

// Routes for interactions
router.post("/", userAuthMiddleware, createInteraction);
router.get("/user/:userId", userAuthMiddleware, getInteractionsByUser); // Updated route to get interactions by user ID
router.get("/product/:productId", userAuthMiddleware, getInteractionsByProduct); // New route to get interactions by product
router.delete("/:interactionId", userAuthMiddleware, deleteInteraction);

module.exports = router;

const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const {
  getAllReviews,
  createOrUpdateRating,
  getRatingsByProduct,
  getRatingsByUser,
  deleteRating,
} = require("../controllers/reviewRatingControllers");

const router = express.Router();

// Routes for ratings
router.get("/", getAllReviews);
router.post("/", userAuthMiddleware, createOrUpdateRating);
router.get("/product/:productId", getRatingsByProduct);
router.get("/user/:userId", userAuthMiddleware, getRatingsByUser);
router.delete("/:ratingId", userAuthMiddleware, deleteRating);

module.exports = router;

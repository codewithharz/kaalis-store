const express = require("express");
const multer = require("multer");
const {
  addProducts,
  getAllProducts,
  getAllProductsByCategory,
  getProductById,
  rateProduct,
  getProductRatings,
  getAllReviews,
  getUserReviews,
  getUserPendingReviews,
  markReviewHelpful,
  updateProduct,
  uploadProduct,
  deleteProduct,
  getUserProducts,
  getRelatedProducts,
} = require("../controllers/productController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

// Routes that don't use product ID should come first
router.post("/bulk", userAuthMiddleware, addProducts);
router.get("/", getAllProducts);
router.get("/reviews", getAllReviews); // Move this BEFORE /:productId routes
router.get("/user/reviews", userAuthMiddleware, getUserReviews);
router.get("/user/pending-reviews", userAuthMiddleware, getUserPendingReviews);
router.get("/category/:categoryId", getAllProductsByCategory);

// Routes with :reviewId parameter
router.post(
  "/reviews/:reviewId/helpful",
  userAuthMiddleware,
  markReviewHelpful
);

// Routes with :productId parameter
router.get("/:productId", getProductById);
router.post("/:productId/rate", userAuthMiddleware, rateProduct);
router.get("/:productId/ratings", getProductRatings);
router.get("/:productId/related", getRelatedProducts);

// Routes with both :userId and :productId
router.put("/:userId/products/:productId", userAuthMiddleware, updateProduct);
router.post(
  "/:userId/products",
  userAuthMiddleware,
  upload.array("images", 5),
  uploadProduct
);
router.delete(
  "/:userId/products/:productId",
  userAuthMiddleware,
  deleteProduct
);
router.get("/:userId/products", userAuthMiddleware, getUserProducts);

module.exports = router;

// backend/routes/specialOfferRoutes.js
const express = require("express");
const router = express.Router();
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  createOffer,
  updateOffer,
  deleteOffer,
  getOffers,
  getOffer,
  useOffer,
  getOffersByCategory,
  validateOffer,
} = require("../controllers/specialOfferController");

// Public routes
router.get("/", userAuthMiddleware, getOffers);
router.get("/:id", userAuthMiddleware, getOffer);
router.get("/category/:categoryId", userAuthMiddleware, getOffersByCategory);

// Admin only routes
router.use(adminAuthMiddleware);
router.post("/", createOffer);
router.patch("/:id", updateOffer);
router.delete("/:id", deleteOffer);

// Validation route
router.post("/validate", userAuthMiddleware, validateOffer);

// Route for recording offer usage
router.post("/:id/use", userAuthMiddleware, useOffer);

module.exports = router;

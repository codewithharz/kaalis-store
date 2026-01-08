// backend/routes/cluesBucksRoutes.js
const express = require("express");
const router = express.Router();
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const {
  getCluesBucksStats,
  getCluesBucksTransactions,
  redeemPoints,
  earnPoints,
  checkOfferAccess,
  getSpecialOffers,
} = require("../controllers/cluesBucksController");

router.get("/stats", userAuthMiddleware, getCluesBucksStats);
router.get("/transactions", userAuthMiddleware, getCluesBucksTransactions);
router.post("/redeem", userAuthMiddleware, redeemPoints);
router.post("/earn", userAuthMiddleware, earnPoints);
router.get("/check-offer-access", userAuthMiddleware, checkOfferAccess);
router.get("/special-offers", userAuthMiddleware, getSpecialOffers);

module.exports = router;

// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { validatePaymentRequest } = require("../utils/validators");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

// Payment initialization route (supports Paystack and PayDunya)
router.post(
  "/initialize",
  userAuthMiddleware,
  validatePaymentRequest,
  paymentController.initializePayment
);

// Payment verification route (supports Paystack and PayDunya)
router.get(
  "/verify/:paymentMethod/:reference",
  userAuthMiddleware,
  paymentController.verifyPayment
);

// PayDunya callback route
router.get("/paydunya/callback", paymentController.handlePayDunyaCallback);

// Payment history and details
router.get(
  "/user/history",
  userAuthMiddleware,
  paymentController.getUserPaymentHistory
);

router.get(
  "/user/details/:paymentId",
  userAuthMiddleware,
  paymentController.getPaymentDetails
);

// Bank account management routes
router.post(
  "/verify-account",
  userAuthMiddleware,
  paymentController.verifyBankAccount
);

router.post(
  "/bank-details",
  userAuthMiddleware,
  paymentController.updateBankDetails
);

router.delete(
  "/bank-details",
  userAuthMiddleware,
  paymentController.deleteBankDetails
);

// Card management routes
router.get("/user/cards", userAuthMiddleware, paymentController.getUserCards);
router.post("/user/cards", userAuthMiddleware, paymentController.addCard);
router.delete(
  "/user/cards/:cardId",
  userAuthMiddleware,
  paymentController.deleteCard
);
router.put(
  "/user/cards/:cardId/default",
  userAuthMiddleware,
  paymentController.setDefaultCard
);

module.exports = router;

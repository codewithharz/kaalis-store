// backend/routes/paystackRoutes.js
const express = require("express");
const router = express.Router();
const paystackController = require("../controllers/paystackController");
const { validatePaymentRequest } = require("../utils/validators");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Customer payment routes
router.post(
  "/initialize",
  userAuthMiddleware,
  validatePaymentRequest,
  paystackController.initializePayment.bind(paystackController)
);

router.get(
  "/verify/:reference",
  userAuthMiddleware,
  paystackController.verifyPayment.bind(paystackController)
);

// Seller routes
router.get(
  "/seller/payouts",
  sellerAuthMiddleware,
  paystackController.getSellerPayouts.bind(paystackController)
);

router.post(
  "/seller/bank-account",
  sellerAuthMiddleware,
  paystackController.addSellerBankAccount.bind(paystackController)
);

// Admin routes
router.get(
  "/admin/payouts",
  adminAuthMiddleware,
  isAdmin,
  paystackController.getAllPayouts.bind(paystackController)
);

router.post(
  "/admin/process-payouts",
  adminAuthMiddleware,
  isAdmin,
  paystackController.processScheduledPayouts.bind(paystackController)
);

router.get(
  "/admin/transactions",
  adminAuthMiddleware,
  isAdmin,
  paystackController.getAllTransactions.bind(paystackController)
);

// Bank list route
router.get(
  "/banks",
  userAuthMiddleware,
  paystackController.getBankList.bind(paystackController)
);

// Webhook (no auth needed as it's verified by signature)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  require("../middleware/paystackWebhook"),
  paystackController.handleWebhook.bind(paystackController)
);

module.exports = router;

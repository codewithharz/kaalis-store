// backend/routes/vendorPayoutRoutes.js
const express = require("express");
const router = express.Router();
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");
const vendorController = require("../controllers/vendorController");

// Common payout routes - work for all payment gateways
router.get("/payouts", sellerAuthMiddleware, vendorController.getPayouts);
router.get(
  "/payout-stats",
  sellerAuthMiddleware,
  vendorController.getPayoutStats
);
router.get(
  "/transactions",
  sellerAuthMiddleware,
  vendorController.getPayoutTransactions
);

// Paystack-specific routes
router.post(
  "/paystack/setup",
  sellerAuthMiddleware,
  vendorController.setupPaystackRecipient
);
router.post(
  "/bank/validate",
  sellerAuthMiddleware,
  vendorController.validateBankAccount
);

// PayDunya and Orange Money routes
router.post(
  "/mobile/setup",
  sellerAuthMiddleware,
  vendorController.setupMobileWallet
);
router.post(
  "/mobile/validate",
  sellerAuthMiddleware,
  vendorController.validateMobileNumber
);

// Get provider options based on vendor country/currency
router.get(
  "/providers",
  sellerAuthMiddleware,
  vendorController.getPaymentProviders
);

// Get payment setup status for all methods
router.get(
  "/setup-status",
  sellerAuthMiddleware,
  vendorController.getPaymentSetupStatus
);

// Payment preferences
router.post(
  "/preferences",
  sellerAuthMiddleware,
  vendorController.updatePaymentPreferences
);

// Test routes (for development only)
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  router.post(
    "/test/mock-payout",
    sellerAuthMiddleware,
    vendorController.createMockPayout
  );
}

module.exports = router;

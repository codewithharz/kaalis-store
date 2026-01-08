// backend/routes/opayRoutes.js
const express = require("express");
const router = express.Router();
const opayController = require("../controllers/opayController");
const { validatePaymentRequest } = require("../utils/validators");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Customer payment routes
router.post(
  "/initialize",
  userAuthMiddleware,
  validatePaymentRequest,
  opayController.initializePayment.bind(opayController)
);

router.get(
  "/verify/:reference",
  userAuthMiddleware,
  opayController.verifyPayment.bind(opayController)
);

// Opay callback (no auth required)
router.post(
  "/callback",
  express.json(),
  opayController.handleCallback.bind(opayController)
);

// Bank account validation
router.post(
  "/validate-account",
  userAuthMiddleware,
  opayController.validateBankAccount.bind(opayController)
);

// Get bank list
router.get(
  "/banks",
  userAuthMiddleware,
  opayController.getBankList.bind(opayController)
);

// Admin routes
router.get(
  "/admin/transactions",
  adminAuthMiddleware,
  isAdmin,
  opayController.getAllTransactions.bind(opayController)
);

router.get(
  "/admin/balance",
  adminAuthMiddleware,
  isAdmin,
  opayController.getBalance.bind(opayController)
);

module.exports = router;

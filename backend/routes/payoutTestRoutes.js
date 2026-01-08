// backend/routes/payoutTestRoutes.js
const express = require("express");
const router = express.Router();
const mockPayoutServices = require("../services/mockPayoutServices");
const payoutService = require("../services/payoutService");
const VendorPayout = require("../models/vendorPayoutModels");
const User = require("../models/userModels");
const Order = require("../models/orderModels");
// const { isAdmin } = require("../middleware/isAdmin"); // Commented out for now
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");
const mongoose = require("mongoose");

// Make sure we only use these routes in development or test environment
router.use((req, res, next) => {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    return res.status(403).json({
      error:
        "These testing endpoints are only available in development or test environment",
    });
  }
  next();
});

/**
 * Create mock vendor with payment settings
 * POST /api/payout-test/vendor/create
 */
router.post(
  "/vendor/create",
  adminAuthMiddleware,
  // isAdmin, // Temporarily commented out
  async (req, res) => {
    try {
      const {
        email,
        firstName,
        lastName,
        currency,
        paymentMethod,
        countryCode,
        mobileNumber,
        bankName,
        accountNumber,
        bankCode,
      } = req.body;

      // Validate required fields
      if (!email || !firstName || !currency) {
        return res
          .status(400)
          .json({ error: "Email, firstName, and currency are required" });
      }

      // Generate a username based on email or firstName+lastName
      const username =
        req.body.username ||
        `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Date.now()
          .toString()
          .slice(-6)}`;

      // Create a mock user for testing
      const mockUser = new User({
        username,
        email,
        firstName,
        lastName,
        countryCode: countryCode || (currency === "XOF" ? "SN" : "NG"),
        currency,
        isSeller: true,
        password: "mockpassword123", // Not a real password, just for testing
        paymentMethod:
          paymentMethod || (currency === "XOF" ? "PayDunya" : "Paystack"),
        bankDetails: {
          mobileNumber,
          bankName,
          accountNumber,
          bankCode,
        },
      });

      // Set payment specific details
      if (currency === "NGN" || paymentMethod === "Paystack") {
        mockUser.paystack = {
          accountName: `${firstName} ${lastName}`,
          accountNumber: accountNumber || "1234567890",
          bankCode: bankCode || "058",
          bankName: bankName || "GTBank",
          recipientCode: `RC-${Date.now()}`, // Mock recipient code
        };
      }

      await mockUser.save();

      res.status(201).json({
        message: "Mock vendor created successfully",
        vendor: mockUser,
      });
    } catch (error) {
      console.error("Error creating mock vendor:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Create mock order for payout testing
 * POST /api/payout-test/order/create
 */
// router.post("/order/create", sellerAuthMiddleware, async (req, res) => {
//   try {
//     const { totalAmount, vendorId, currency, paymentMethod } = req.body;

//     // Validate required fields
//     if (!totalAmount || !vendorId) {
//       return res
//         .status(400)
//         .json({ error: "totalAmount and vendorId are required" });
//     }

//     // Create a mock order for testing
//     const mockOrder = new Order({
//       user: req.user._id,
//       seller: vendorId,
//       totalAmount,
//       status: "Delivered",
//       paymentMethod:
//         paymentMethod || (currency === "XOF" ? "PayDunya" : "Paystack"),
//       currency: currency || "NGN",
//       transactionId: `TXN-${Date.now()}`,
//       payoutStatus: "pending",
//     });

//     await mockOrder.save();

//     // Schedule a payout for this order
//     const vendorAmount = payoutService.calculateVendorAmount(mockOrder);
//     const payout = await payoutService.scheduleVendorPayout(
//       vendorId,
//       vendorAmount,
//       {
//         orderId: mockOrder._id,
//         customerEmail: req.user.email,
//       }
//     );

//     res.status(201).json({
//       message: "Mock order created and payout scheduled",
//       order: mockOrder,
//       payout,
//     });
//   } catch (error) {
//     console.error("Error creating mock order:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/order/create", sellerAuthMiddleware, async (req, res) => {
  try {
    const { totalAmount, vendorId, currency, paymentMethod } = req.body;

    // Validate required fields
    if (!totalAmount || !vendorId) {
      return res
        .status(400)
        .json({ error: "totalAmount and vendorId are required" });
    }

    // Calculate the vendor amount (92%) and platform fee (8%)
    const vendorAmount = Math.round(totalAmount * 0.92);
    const platformFee = totalAmount - vendorAmount;

    // Create a mock order for testing
    const order = new Order({
      user: req.user._id,
      seller: vendorId,
      totalAmount,
      subtotal: totalAmount,
      vendorAmount,
      platformFee,
      status: "Delivered",
      paymentMethod,
      currency: currency || "NGN",
      transactionId: `TXN-${Date.now()}`,
      address: {
        street: "123 Test Street",
        city: "Test City",
        state: "Test State",
        country: "Nigeria",
        postalCode: "12345",
      },
      products: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: totalAmount,
          vendorAmount: vendorAmount,
          platformFee: platformFee,
        },
      ],
    });

    await order.save();

    // Create a VendorPayout directly with the corrected field names
    const vendorPayout = new VendorPayout({
      vendorId: vendorId, // Changed from vendor to vendorId
      amount: vendorAmount,
      currency: currency || "NGN",
      orderId: order._id.toString(),
      status: "pending",
      paymentMethod: "bank_transfer",
      gateway: paymentMethod,
      scheduledDate: new Date(), // Added scheduledDate field
      metadata: {
        orderTotal: totalAmount,
        customerEmail: req.user.email,
        transactionId: order.transactionId,
      },
    });

    await vendorPayout.save();

    res.status(201).json({
      message: "Mock order created and payout scheduled",
      order: order,
      payout: vendorPayout,
    });
  } catch (error) {
    console.error("Error creating mock order:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Trigger processing of all pending payouts
 * POST /api/payout-test/process-all
 */
router.post(
  "/process-all",
  adminAuthMiddleware,
  /* isAdmin, */ async (req, res) => {
    try {
      // Force mock service mode for testing
      process.env.USE_MOCK_PAYMENTS = "true";

      await payoutService.processVendorPayouts();

      // Reset the env var (optional)
      process.env.USE_MOCK_PAYMENTS =
        process.env.NODE_ENV === "test" ? "true" : "false";

      res.json({
        message: "Payout processing triggered successfully",
      });
    } catch (error) {
      console.error("Error processing payouts:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Test a specific payment gateway
 * POST /api/payout-test/gateway/:gateway
 */
router.post("/gateway/:gateway", sellerAuthMiddleware, async (req, res) => {
  try {
    const { gateway } = req.params;
    const { amount, currency, mobileNumber } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Get the vendor
    const vendor = await User.findById(req.user._id);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Override mobile number if provided
    if (mobileNumber) {
      vendor.bankDetails = {
        ...(vendor.bankDetails || {}),
        mobileNumber,
      };
    }

    let result;

    switch (gateway.toLowerCase()) {
      case "paystack":
        result = await mockPayoutServices.mockPaystackTransfer({
          amount,
          recipientCode: vendor.paystack?.recipientCode || "TEST_RECIPIENT",
          reference: `TEST-${Date.now()}`,
          currency: currency || "NGN",
        });
        break;

      case "paydunya":
        result = await mockPayoutServices.mockPayDunyaWithdrawal({
          amount,
          vendorPhone: vendor.bankDetails?.mobileNumber || mobileNumber,
          vendorEmail: vendor.email,
          currency: currency || "XOF",
        });
        break;

      case "orangemoney":
        result = await mockPayoutServices.mockOrangeMoneyTransfer({
          amount,
          vendorPhone: vendor.bankDetails?.mobileNumber || mobileNumber,
          currency: currency || "XOF",
        });
        break;

      default:
        return res
          .status(400)
          .json({ error: `Unsupported gateway: ${gateway}` });
    }

    res.json({
      message: `Test payment via ${gateway} initiated`,
      result,
    });
  } catch (error) {
    console.error(`Error testing ${req.params.gateway} gateway:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Check status of a test payment
 * GET /api/payout-test/status/:gateway/:reference
 */
router.get(
  "/status/:gateway/:reference",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const { gateway, reference } = req.params;

      let result;

      switch (gateway.toLowerCase()) {
        case "paystack":
          result = await mockPayoutServices.checkPaystackTransferStatus(
            reference
          );
          break;

        case "paydunya":
          result = await mockPayoutServices.checkPayDunyaWithdrawalStatus(
            reference
          );
          break;

        case "orangemoney":
          result = await mockPayoutServices.checkOrangeMoneyTransferStatus(
            reference
          );
          break;

        default:
          return res
            .status(400)
            .json({ error: `Unsupported gateway: ${gateway}` });
      }

      res.json(result);
    } catch (error) {
      console.error(
        `Error checking ${req.params.gateway} payment status:`,
        error
      );
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Get all mock transactions
 * GET /api/payout-test/transactions
 */
router.get(
  "/transactions",
  adminAuthMiddleware,
  /* isAdmin, */ (req, res) => {
    try {
      const transactions = mockPayoutServices.getAllMockTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching mock transactions:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Reset all mock data
 * POST /api/payout-test/reset
 */
router.post(
  "/reset",
  adminAuthMiddleware,
  /* isAdmin, */ (req, res) => {
    try {
      mockPayoutServices.resetMockData();
      res.json({ message: "Mock data reset successfully" });
    } catch (error) {
      console.error("Error resetting mock data:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Get test account balances
 * GET /api/payout-test/balances
 */
router.get(
  "/balances",
  adminAuthMiddleware,
  /* isAdmin, */ async (req, res) => {
    try {
      const balances = {
        paystack: await mockPayoutServices.getMockBalance("Paystack"),
        paydunya: await mockPayoutServices.getMockBalance("PayDunya"),
        orangemoney: await mockPayoutServices.getMockBalance("OrangeMoney"),
      };

      res.json(balances);
    } catch (error) {
      console.error("Error fetching mock balances:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

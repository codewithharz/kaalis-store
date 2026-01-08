// backend/controllers/vendorController.js
const VendorPayout = require("../models/vendorPayoutModels");
const Order = require("../models/orderModels");
const User = require("../models/userModels");
const PaystackService = require("../services/paystackService");
const PayDunyaPayoutService = require("../services/payDunyaPayoutService");
const OrangeMoneyPayoutService = require("../services/orangeMoneyPayoutService");
const CurrencyService = require("../services/currencyService");
const payoutConfig = require("../config/payoutConfig");
const logger = require("../utils/logger");

// Helper function to validate phone number
const validatePhoneNumber = (phoneNumber, countryCode) => {
  if (!phoneNumber) return false;

  // Basic phone validation patterns by country
  const patterns = {
    // Nigeria (e.g., +2348012345678)
    NG: /^\+?234[0-9]{10}$/,
    // Senegal (e.g., +221771234567)
    SN: /^\+?221[0-9]{9}$/,
    // Ivory Coast (e.g., +22501234567)
    CI: /^\+?225[0-9]{8}$/,
    // Default pattern (at least 10 digits with optional + prefix)
    DEFAULT: /^\+?[0-9]{10,}$/,
  };

  const pattern = patterns[countryCode] || patterns.DEFAULT;
  return pattern.test(phoneNumber);
};

const vendorController = {
  // Get vendor's payout history
  async getPayouts(req, res) {
    try {
      const payouts = await VendorPayout.find({
        vendorId: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(50);

      // Aggregate pending amount
      const pendingAmount = await VendorPayout.aggregate([
        {
          $match: {
            vendorId: req.user._id,
            status: { $in: ["pending", "aggregating"] },
          },
        },
        {
          $group: {
            _id: "$currency",
            total: { $sum: "$amount" },
          },
        },
      ]);

      // Find next scheduled payout
      const nextPayout = await VendorPayout.findOne({
        vendorId: req.user._id,
        status: "pending",
      }).sort({ scheduledDate: 1 });

      // Format the pending amounts by currency
      const pendingAmounts = {};
      pendingAmount.forEach((item) => {
        pendingAmounts[item._id || "NGN"] = item.total;
      });

      res.json({
        payouts,
        stats: {
          pendingAmounts,
          nextPayoutDate: nextPayout?.scheduledDate || null,
          platformFee: payoutConfig.fees.default.platformFee * 100,
        },
      });
    } catch (error) {
      logger.error("Error fetching payouts:", error);
      res
        .status(500)
        .json({
          message: "Failed to fetch payout history",
          error: error.message,
        });
    }
  },

  // Setup Paystack recipient for Nigerian vendors
  async setupPaystackRecipient(req, res) {
    try {
      const { bankCode, accountNumber } = req.body;

      if (!bankCode || !accountNumber) {
        return res.status(400).json({
          message: "Bank code and account number are required",
        });
      }

      // Validate account number format (10 digits for Nigerian banks)
      if (!/^\d{10}$/.test(accountNumber)) {
        return res.status(400).json({
          message: "Invalid account number format. Must be 10 digits.",
        });
      }

      const response = await PaystackService.createTransferRecipient({
        bankCode,
        accountNumber,
        sellerId: req.user._id,
        name: `${req.user.firstName} ${req.user.lastName}`,
      });

      // Update user payment method preference
      await User.findByIdAndUpdate(req.user._id, {
        paymentMethod: "Paystack",
        currency: "NGN",
      });

      res.json({
        message: "Bank account setup successful",
        data: response.data,
      });
    } catch (error) {
      logger.error("Error setting up Paystack recipient:", error);
      res.status(500).json({
        message:
          error.response?.data?.message || "Failed to setup bank account",
        error: error.message,
      });
    }
  },

  // Setup mobile wallet for PayDunya or Orange Money
  async setupMobileWallet(req, res) {
    try {
      const { mobileNumber, provider, countryCode } = req.body;

      if (!mobileNumber || !provider) {
        return res.status(400).json({
          message: "Mobile number and provider are required",
        });
      }

      // Validate mobile number format
      if (
        !validatePhoneNumber(mobileNumber, countryCode || req.user.countryCode)
      ) {
        return res.status(400).json({
          message: "Invalid mobile number format for your region",
        });
      }

      // Validate provider
      if (!["PayDunya", "OrangeMoney"].includes(provider)) {
        return res.status(400).json({
          message: "Invalid provider. Must be PayDunya or OrangeMoney",
        });
      }

      // Update user's mobile wallet information
      await User.findByIdAndUpdate(req.user._id, {
        "bankDetails.mobileNumber": mobileNumber,
        "bankDetails.mobileProvider": provider,
        paymentMethod: provider,
        currency: "XOF",
        countryCode: countryCode || req.user.countryCode || "SN",
      });

      res.json({
        message: "Mobile wallet setup successful",
        data: {
          mobileNumber,
          provider,
          countryCode: countryCode || req.user.countryCode || "SN",
        },
      });
    } catch (error) {
      logger.error("Error setting up mobile wallet:", error);
      res.status(500).json({
        message: "Failed to setup mobile wallet",
        error: error.message,
      });
    }
  },

  // Validate bank account with Paystack
  async validateBankAccount(req, res) {
    try {
      const { bankCode, accountNumber } = req.body;

      if (!bankCode || !accountNumber) {
        return res.status(400).json({
          message: "Bank code and account number are required",
        });
      }

      // Validate account number format
      if (!/^\d{10}$/.test(accountNumber)) {
        return res.status(400).json({
          message: "Invalid account number format. Must be 10 digits.",
        });
      }

      const response = await PaystackService.verifyBankAccount({
        accountNumber,
        bankCode,
      });

      res.json({
        message: "Bank account verification successful",
        data: {
          accountName: response.data?.account_name,
          accountNumber: response.data?.account_number,
          bankCode: response.data?.bank_code,
        },
      });
    } catch (error) {
      logger.error("Error validating bank account:", error);
      res.status(500).json({
        message:
          error.response?.data?.message || "Failed to validate bank account",
        error: error.message,
      });
    }
  },

  // Validate mobile number for PayDunya or Orange Money
  async validateMobileNumber(req, res) {
    try {
      const { mobileNumber, provider, countryCode } = req.body;

      if (!mobileNumber || !provider) {
        return res.status(400).json({
          message: "Mobile number and provider are required",
        });
      }

      // Validate mobile number format
      if (
        !validatePhoneNumber(mobileNumber, countryCode || req.user.countryCode)
      ) {
        return res.status(400).json({
          message: "Invalid mobile number format for your region",
        });
      }

      // For mobile validations, we just check format as there's often no API to validate
      // For a real implementation, you might want to try a test API call if available

      res.json({
        message: "Mobile number validation successful",
        data: {
          isValid: true,
          mobileNumber,
          provider,
        },
      });
    } catch (error) {
      logger.error("Error validating mobile number:", error);
      res.status(500).json({
        message: "Failed to validate mobile number",
        error: error.message,
      });
    }
  },

  // Get payout stats
  async getPayoutStats(req, res) {
    try {
      // Get pending amounts by currency
      const pendingByStatus = await VendorPayout.aggregate([
        {
          $match: {
            vendorId: req.user._id,
          },
        },
        {
          $group: {
            _id: {
              status: "$status",
              currency: "$currency",
            },
            total: { $sum: "$amount" },
          },
        },
      ]);

      // Format the results
      const stats = {
        pendingAmount: {},
        processingAmount: {},
        processedAmount: {},
        failedAmount: {},
        aggregatingAmount: {},
      };

      pendingByStatus.forEach((item) => {
        const status = item._id.status;
        const currency = item._id.currency || "NGN";

        switch (status) {
          case "pending":
            stats.pendingAmount[currency] =
              (stats.pendingAmount[currency] || 0) + item.total;
            break;
          case "processing":
            stats.processingAmount[currency] =
              (stats.processingAmount[currency] || 0) + item.total;
            break;
          case "processed":
            stats.processedAmount[currency] =
              (stats.processedAmount[currency] || 0) + item.total;
            break;
          case "failed":
            stats.failedAmount[currency] =
              (stats.failedAmount[currency] || 0) + item.total;
            break;
          case "aggregating":
            stats.aggregatingAmount[currency] =
              (stats.aggregatingAmount[currency] || 0) + item.total;
            break;
        }
      });

      // Find next scheduled payout
      const nextPayout = await VendorPayout.findOne({
        vendorId: req.user._id,
        status: "pending",
      }).sort({ scheduledDate: 1 });

      // Get payment preferences
      const vendor = await User.findById(req.user._id).select(
        "paymentMethod currency bankDetails paystack"
      );

      res.json({
        stats,
        nextPayoutDate: nextPayout?.scheduledDate || null,
        platformFee: payoutConfig.fees.default.platformFee * 100,
        paymentMethod: vendor?.paymentMethod || "Paystack",
        currency: vendor?.currency || "NGN",
      });
    } catch (error) {
      logger.error("Error fetching payout stats:", error);
      res
        .status(500)
        .json({
          message: "Failed to fetch payout stats",
          error: error.message,
        });
    }
  },

  // Get payout transactions with order details
  async getPayoutTransactions(req, res) {
    try {
      const transactions = await VendorPayout.aggregate([
        {
          $match: { vendorId: req.user._id },
        },
        {
          $lookup: {
            from: "orders",
            localField: "orderId",
            foreignField: "_id",
            as: "order",
          },
        },
        {
          $unwind: {
            path: "$order",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 50,
        },
      ]);

      res.json(transactions);
    } catch (error) {
      logger.error("Error fetching transactions:", error);
      res
        .status(500)
        .json({
          message: "Failed to fetch transactions",
          error: error.message,
        });
    }
  },

  // Get available payment providers based on vendor's country/currency
  async getPaymentProviders(req, res) {
    try {
      const vendor = await User.findById(req.user._id).select(
        "countryCode currency"
      );
      const countryCode = vendor?.countryCode || "NG";

      // Determine available providers by country
      let providers = [];

      switch (countryCode) {
        case "NG": // Nigeria
          providers = [
            {
              id: "Paystack",
              name: "Paystack",
              description: "Direct bank transfers in Nigeria",
              currency: "NGN",
              setupRequired: ["bankCode", "accountNumber"],
            },
          ];
          break;

        case "SN": // Senegal
        case "CI": // Ivory Coast
        case "BF": // Burkina Faso
        case "ML": // Mali
        case "TG": // Togo
          providers = [
            {
              id: "PayDunya",
              name: "PayDunya",
              description: "Mobile money transfers in West Africa",
              currency: "XOF",
              setupRequired: ["mobileNumber"],
            },
            {
              id: "OrangeMoney",
              name: "Orange Money",
              description: "Orange mobile money platform",
              currency: "XOF",
              setupRequired: ["mobileNumber"],
            },
          ];
          break;

        default:
          // Default to Paystack for unknown countries
          providers = [
            {
              id: "Paystack",
              name: "Paystack",
              description: "Direct bank transfers",
              currency: "NGN",
              setupRequired: ["bankCode", "accountNumber"],
            },
          ];
      }

      // Add bank list for Paystack if needed
      if (providers.some((p) => p.id === "Paystack")) {
        try {
          // Note: In a real implementation, you'd fetch this from Paystack API
          // This is a simplified version with just a few banks
          const banks = [
            { code: "058", name: "Guaranty Trust Bank" },
            { code: "033", name: "United Bank for Africa" },
            { code: "044", name: "Access Bank" },
            { code: "063", name: "Access Bank (Diamond)" },
            { code: "050", name: "EcoBank" },
            { code: "011", name: "First Bank of Nigeria" },
            { code: "214", name: "First City Monument Bank" },
            { code: "070", name: "Fidelity Bank" },
            { code: "076", name: "Polaris Bank" },
          ];

          // Add banks to Paystack provider
          providers.find((p) => p.id === "Paystack").banks = banks;
        } catch (bankError) {
          logger.error("Error fetching bank list:", bankError);
        }
      }

      res.json({
        providers,
        preferredCurrency: vendor?.currency || "NGN",
        countryCode,
      });
    } catch (error) {
      logger.error("Error fetching payment providers:", error);
      res
        .status(500)
        .json({
          message: "Failed to fetch payment providers",
          error: error.message,
        });
    }
  },

  // Get vendor's payment setup status for all methods
  async getPaymentSetupStatus(req, res) {
    try {
      const vendor = await User.findById(req.user._id).select(
        "paymentMethod currency bankDetails paystack countryCode"
      );

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const paymentMethod = vendor.paymentMethod || "Paystack";
      const currency = vendor.currency || "NGN";

      // Determine setup status for each method
      const setupStatus = {
        Paystack: {
          isSetup: !!(vendor.paystack && vendor.paystack.recipientCode),
          details: vendor.paystack
            ? {
                accountName: vendor.paystack.accountName,
                accountNumber: vendor.paystack.accountNumber
                  ? `****${vendor.paystack.accountNumber.slice(-4)}`
                  : null,
                bankName: vendor.paystack.bankName,
              }
            : null,
        },
        PayDunya: {
          isSetup: !!(
            vendor.bankDetails &&
            vendor.bankDetails.mobileNumber &&
            vendor.bankDetails.mobileProvider === "PayDunya"
          ),
          details:
            vendor.bankDetails &&
            vendor.bankDetails.mobileProvider === "PayDunya"
              ? {
                  mobileNumber: `****${vendor.bankDetails.mobileNumber.slice(
                    -4
                  )}`,
                  provider: "PayDunya",
                }
              : null,
        },
        OrangeMoney: {
          isSetup: !!(
            vendor.bankDetails &&
            vendor.bankDetails.mobileNumber &&
            vendor.bankDetails.mobileProvider === "OrangeMoney"
          ),
          details:
            vendor.bankDetails &&
            vendor.bankDetails.mobileProvider === "OrangeMoney"
              ? {
                  mobileNumber: `****${vendor.bankDetails.mobileNumber.slice(
                    -4
                  )}`,
                  provider: "Orange Money",
                }
              : null,
        },
      };

      // Determine the preferred method based on vendor's country and existing setup
      let recommendedMethod = paymentMethod;

      // If nothing is set up yet, recommend based on country
      if (
        !setupStatus.Paystack.isSetup &&
        !setupStatus.PayDunya.isSetup &&
        !setupStatus.OrangeMoney.isSetup
      ) {
        if (["SN", "CI", "BF", "ML", "TG"].includes(vendor.countryCode)) {
          recommendedMethod = "PayDunya";
        } else {
          recommendedMethod = "Paystack";
        }
      }

      res.json({
        currentMethod: paymentMethod,
        currency: currency,
        setupStatus,
        recommendedMethod,
      });
    } catch (error) {
      logger.error("Error fetching payment setup status:", error);
      res
        .status(500)
        .json({
          message: "Failed to fetch payment setup status",
          error: error.message,
        });
    }
  },

  // Update payment preferences
  async updatePaymentPreferences(req, res) {
    try {
      const { paymentMethod, currency } = req.body;

      if (!paymentMethod) {
        return res.status(400).json({ message: "Payment method is required" });
      }

      // Validate payment method
      if (!["Paystack", "PayDunya", "OrangeMoney"].includes(paymentMethod)) {
        return res.status(400).json({ message: "Invalid payment method" });
      }

      // Validate currency
      const validCurrencyForMethod = (method, curr) => {
        if (method === "Paystack" && curr !== "NGN") return false;
        if (["PayDunya", "OrangeMoney"].includes(method) && curr !== "XOF")
          return false;
        return true;
      };

      const currencyToUse =
        currency || (paymentMethod === "Paystack" ? "NGN" : "XOF");

      if (!validCurrencyForMethod(paymentMethod, currencyToUse)) {
        return res.status(400).json({
          message: `Invalid currency for ${paymentMethod}. Expected ${
            paymentMethod === "Paystack" ? "NGN" : "XOF"
          }`,
        });
      }

      // Get vendor to check if this method is set up
      const vendor = await User.findById(req.user._id);

      if (
        paymentMethod === "Paystack" &&
        (!vendor.paystack || !vendor.paystack.recipientCode)
      ) {
        return res
          .status(400)
          .json({
            message:
              "Paystack is not set up. Please set up your bank account first.",
          });
      }

      if (
        ["PayDunya", "OrangeMoney"].includes(paymentMethod) &&
        (!vendor.bankDetails ||
          !vendor.bankDetails.mobileNumber ||
          vendor.bankDetails.mobileProvider !== paymentMethod)
      ) {
        return res
          .status(400)
          .json({
            message: `${paymentMethod} is not set up. Please set up your mobile wallet first.`,
          });
      }

      // Update payment preferences
      await User.findByIdAndUpdate(req.user._id, {
        paymentMethod,
        currency: currencyToUse,
      });

      res.json({
        message: "Payment preferences updated successfully",
        data: {
          paymentMethod,
          currency: currencyToUse,
        },
      });
    } catch (error) {
      logger.error("Error updating payment preferences:", error);
      res
        .status(500)
        .json({
          message: "Failed to update payment preferences",
          error: error.message,
        });
    }
  },

  // Create mock payout (for testing)
  async createMockPayout(req, res) {
    if (
      process.env.NODE_ENV !== "development" &&
      process.env.NODE_ENV !== "test"
    ) {
      return res.status(403).json({ message: "Not allowed in production" });
    }

    try {
      const { amount, currency, status } = req.body;

      if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
      }

      const mockPayout = new VendorPayout({
        vendorId: req.user._id,
        amount: amount || 1000,
        status: status || "pending",
        scheduledDate: new Date(),
        paymentMethod: req.user.paymentMethod || "paystack",
        currency: currency || req.user.currency || "NGN",
      });

      await mockPayout.save();
      res.json({
        message: "Mock payout created successfully",
        payout: mockPayout,
      });
    } catch (error) {
      logger.error("Error creating mock payout:", error);
      res
        .status(500)
        .json({
          message: "Failed to create mock payout",
          error: error.message,
        });
    }
  },
};

module.exports = vendorController;

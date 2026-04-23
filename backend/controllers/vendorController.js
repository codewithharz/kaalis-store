// backend/controllers/vendorController.js
const VendorPayout = require("../models/vendorPayoutModels");
const Order = require("../models/orderModels");
const User = require("../models/userModels");
const PaystackService = require("../services/paystackService");
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

      const payoutTotals = await VendorPayout.aggregate([
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
            count: { $sum: 1 },
          },
        },
      ]);

      const salesTotals = await Order.aggregate([
        {
          $match: {
            seller: req.user._id,
            $or: [
              { status: { $in: ["Processing", "Shipped", "Delivered"] } },
              { transactionId: { $exists: true, $nin: [null, ""] } },
            ],
          },
        },
        {
          $group: {
            _id: "$currency",
            totalSales: { $sum: "$totalAmount" },
            vendorEarnings: { $sum: "$vendorAmount" },
            platformFees: { $sum: "$platformFee" },
            orderCount: { $sum: 1 },
          },
        },
      ]);

      // Find next scheduled payout
      const nextPayout = await VendorPayout.findOne({
        vendorId: req.user._id,
        status: "pending",
      }).sort({ scheduledDate: 1 });

      const pendingAmounts = {};
      const processingAmounts = {};
      const processedAmounts = {};
      const failedAmounts = {};

      payoutTotals.forEach((item) => {
        const status = item._id.status;
        const currency = item._id.currency || "NGN";

        if (["pending", "aggregating"].includes(status)) {
          pendingAmounts[currency] = (pendingAmounts[currency] || 0) + item.total;
        } else if (status === "processing") {
          processingAmounts[currency] =
            (processingAmounts[currency] || 0) + item.total;
        } else if (status === "processed") {
          processedAmounts[currency] =
            (processedAmounts[currency] || 0) + item.total;
        } else if (status === "failed") {
          failedAmounts[currency] = (failedAmounts[currency] || 0) + item.total;
        }
      });

      const salesAmounts = {};
      const vendorEarnings = {};
      const platformFeeAmounts = {};
      const orderCounts = {};

      salesTotals.forEach((item) => {
        const currency = item._id || "NGN";
        salesAmounts[currency] = item.totalSales;
        vendorEarnings[currency] = item.vendorEarnings;
        platformFeeAmounts[currency] = item.platformFees;
        orderCounts[currency] = item.orderCount;
      });

      res.json({
        payouts,
        stats: {
          pendingAmounts,
          processingAmounts,
          processedAmounts,
          failedAmounts,
          salesAmounts,
          vendorEarnings,
          platformFeeAmounts,
          orderCounts,
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

  // Link vendor to an AfriExchange account for XOF settlement
  async setupAfriExchangeAccount(req, res) {
    try {
      const { afriExchangeUserId, walletAddress, accountEmail, countryCode } =
        req.body;

      if (!afriExchangeUserId && !walletAddress && !accountEmail) {
        return res.status(400).json({
          message:
            "Provide an AfriExchange user ID, wallet address, or account email",
        });
      }

      await User.findByIdAndUpdate(req.user._id, {
        afriExchange: {
          userId: afriExchangeUserId,
          walletAddress,
          accountEmail,
          linkedAt: new Date(),
        },
        paymentMethod: "AfriExchange",
        currency: "XOF",
        countryCode: countryCode || req.user.countryCode || "SN",
      });

      res.json({
        message: "AfriExchange account linked successfully",
        data: {
          afriExchangeUserId,
          walletAddress,
          accountEmail,
          countryCode: countryCode || req.user.countryCode || "SN",
        },
      });
    } catch (error) {
      logger.error("Error linking AfriExchange account:", error);
      res.status(500).json({
        message: "Failed to link AfriExchange account",
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

  // Deprecated: XOF settlement now uses AfriExchange account linking.
  async validateMobileNumber(req, res) {
    return res.status(410).json({
      message: "Mobile wallet validation is inactive. Use AfriExchange setup.",
    });
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
            {
              id: "OPay",
              name: "OPay",
              description: "NGN bank transfers through OPay",
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
              id: "AfriExchange",
              name: "AfriExchange",
              description: "CT wallet settlement for XOF countries",
              currency: "XOF",
              setupRequired: ["afriExchangeUserId"],
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
            {
              id: "OPay",
              name: "OPay",
              description: "NGN bank transfers through OPay",
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
        "paymentMethod currency bankDetails paystack afriExchange countryCode"
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
        OPay: {
          isSetup: !!(
            vendor.bankDetails?.accountNumber && vendor.bankDetails?.bankCode
          ),
          details: vendor.bankDetails?.accountNumber
            ? {
                accountNumber: `****${vendor.bankDetails.accountNumber.slice(
                  -4
                )}`,
                bankName: vendor.bankDetails.bankName,
              }
            : null,
        },
        AfriExchange: {
          isSetup: !!(
            vendor.afriExchange?.userId ||
            vendor.afriExchange?.walletAddress ||
            vendor.afriExchange?.accountEmail
          ),
          details: vendor.afriExchange
            ? {
                userId: vendor.afriExchange.userId,
                accountEmail: vendor.afriExchange.accountEmail,
                walletAddress: vendor.afriExchange.walletAddress
                  ? `${vendor.afriExchange.walletAddress.slice(
                      0,
                      6
                    )}...${vendor.afriExchange.walletAddress.slice(-4)}`
                  : null,
              }
            : null,
        },
      };

      // Determine the preferred method based on vendor's country and existing setup
      let recommendedMethod = paymentMethod;

      // If nothing is set up yet, recommend based on country
      if (
        !setupStatus.Paystack.isSetup &&
        !setupStatus.OPay.isSetup &&
        !setupStatus.AfriExchange.isSetup
      ) {
        if (["SN", "CI", "BF", "ML", "TG"].includes(vendor.countryCode)) {
          recommendedMethod = "AfriExchange";
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
      if (!["Paystack", "OPay", "AfriExchange"].includes(paymentMethod)) {
        return res.status(400).json({ message: "Invalid payment method" });
      }

      // Validate currency
      const validCurrencyForMethod = (method, curr) => {
        if (["Paystack", "OPay"].includes(method) && curr !== "NGN")
          return false;
        if (method === "AfriExchange" && curr !== "XOF") return false;
        return true;
      };

      const currencyToUse =
        currency || (paymentMethod === "AfriExchange" ? "XOF" : "NGN");

      if (!validCurrencyForMethod(paymentMethod, currencyToUse)) {
        return res.status(400).json({
          message: `Invalid currency for ${paymentMethod}. Expected ${
            paymentMethod === "AfriExchange" ? "XOF" : "NGN"
          }`,
        });
      }

      // Get vendor to check if this method is set up
      const vendor = await User.findById(req.user._id);

      if (
        ["Paystack", "OPay"].includes(paymentMethod) &&
        (!vendor.paystack || !vendor.paystack.recipientCode)
      ) {
        return res
          .status(400)
          .json({
            message:
              `${paymentMethod} is not set up. Please set up your bank account first.`,
          });
      }

      if (
        paymentMethod === "AfriExchange" &&
        !(
          vendor.afriExchange?.userId ||
          vendor.afriExchange?.walletAddress ||
          vendor.afriExchange?.accountEmail
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "AfriExchange is not set up. Please link your AfriExchange account first.",
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

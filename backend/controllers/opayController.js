// backend/controllers/opayController.js
const Payment = require("../models/paymentModels");
const VendorPayout = require("../models/vendorPayoutModels");
const OpayService = require("../services/opayService");
const Order = require("../models/orderModels");
const logger = require("../utils/logger");

class OpayController {
  constructor() {
    this.opayService = new OpayService();
  }

  /**
   * Initialize payment with Opay
   */
  async initializePayment(req, res) {
    let payment = null;

    try {
      const { email, amount, vendorAmount, platformFee, metadata, userPhone } =
        req.body;

      logger.info("Opay payment initialization request:", {
        email,
        amount,
        orderId: metadata?.orderId,
      });

      // Validate required fields
      if (!email || !amount || !vendorAmount || !platformFee || !metadata) {
        return res.status(400).json({
          status: false,
          message: "Missing required fields",
        });
      }

      // Validate metadata.items
      if (
        !metadata.items ||
        !Array.isArray(metadata.items) ||
        metadata.items.length === 0
      ) {
        return res.status(400).json({
          status: false,
          message: "Items array is required in metadata",
        });
      }

      // Log the items array for debugging
      logger.info("Validating items array:", {
        itemCount: metadata.items.length,
        items: metadata.items.map((item) => ({
          hasProduct: !!item.product,
          hasProductId: !!item.productId,
          keys: Object.keys(item),
        })),
      });

      // Validate each item has required fields
      for (let i = 0; i < metadata.items.length; i++) {
        const item = metadata.items[i];
        // Accept both 'product' and 'productId' field names
        const productId = item.product || item.productId;

        if (!productId) {
          logger.error(`Invalid item at index ${i}:`, {
            item: item,
            keys: Object.keys(item),
          });
          return res.status(400).json({
            status: false,
            message: `Item at index ${i} must have a product or productId field`,
            itemKeys: Object.keys(item),
          });
        }

        // Normalize the item to use productId
        if (item.product && !item.productId) {
          item.productId = item.product;
        }
      }

      logger.info("Items validation passed");

      //  // Convert amounts to numbers
      //  const totalAmount = Math.round(parseFloat(amount) * 100);
      //  const vendorShare = Math.round(parseFloat(vendorAmount) * 100);
      //  const platformShare = Math.round(parseFloat(platformFee) * 100);

      // Convert amounts to numbers
      const totalAmount = parseFloat(amount);
      const vendorShare = parseFloat(vendorAmount);
      const platformShare = parseFloat(platformFee);

      // Validate amounts
      if (
        isNaN(totalAmount) ||
        isNaN(vendorShare) ||
        isNaN(platformShare) ||
        totalAmount <= 0
      ) {
        return res.status(400).json({
          status: false,
          message: "Invalid amount values",
        });
      }

      // Verify amount calculations (allow small rounding differences)
      const calculationDifference = Math.abs(
        vendorShare + platformShare - totalAmount
      );
      if (calculationDifference > 1) {
        // Allow 1 unit difference for rounding
        logger.error("Amount mismatch:", {
          totalAmount,
          vendorShare,
          platformShare,
          difference: calculationDifference,
        });
        return res.status(400).json({
          status: false,
          message: "Amount mismatch in calculation",
        });
      }

      // Find order
      const order = await Order.findById(metadata.orderId);
      if (!order) {
        return res.status(404).json({
          status: false,
          message: "Order not found",
        });
      }

      // Generate unique reference
      const reference = `OPAY-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`;

      // Create payment record
      payment = new Payment({
        orderId: metadata.orderId,
        reference: reference,
        amount: totalAmount,
        email,
        vendorAmount: vendorShare,
        platformFee: platformShare,
        status: "pending",
        paymentMethod: "OPay",
        metadata: {
          userId: req.user._id,
          userEmail: email,
          customerName: metadata.customerName,
          customerPhone: metadata.customerPhone || userPhone,
          items: metadata.items.map((item) => ({
            productId: item.productId || item.product, // Handle both field names
            quantity: item.quantity,
            price: item.price,
            vendorAmount: item.vendorAmount,
            platformFee: item.platformFee,
            vendorId: item.vendorId,
          })),
          shipping: {
            ...metadata.shipping,
            user: req.user._id,
          },
          shippingFee: metadata.shippingFee || 0,
          totalBeforeShipping: metadata.totalBeforeShipping || totalAmount,
          totalAfterShipping: metadata.totalAfterShipping || totalAmount,
        },
      });

      await payment.validate();
      await payment.save();
      logger.info("Payment record created:", { paymentId: payment._id });

      // Initialize Opay transaction
      const opayData = {
        email,
        userPhone: userPhone || metadata.customerPhone,
        userIp: req.ip,
        metadata: {
          orderId: order._id.toString(),
          paymentId: payment._id.toString(),
          userId: req.user._id.toString(),
        },
      };

      const response = await this.opayService.initializeTransaction(opayData);

      if (!response?.status || !response?.data?.authorization_url) {
        throw new Error("Invalid response from Opay");
      }

      // Update payment with Opay reference
      payment.reference = response.data.reference;
      payment.metadata.opayOrderNo = response.data.orderNo;
      await payment.save();

      logger.info("Opay transaction initialized:", {
        reference: response.data.reference,
        authorization_url: response.data.authorization_url,
      });

      return res.status(200).json({
        status: true,
        data: response.data,
      });
    } catch (error) {
      logger.error("Opay payment initialization error:", {
        error: error.message,
        stack: error.stack,
      });

      // Rollback payment record if it exists
      if (payment?._id) {
        try {
          await Payment.findByIdAndUpdate(payment._id, {
            status: "failed",
            errorMessage: error.message,
          });
        } catch (rollbackError) {
          logger.error("Error rolling back payment:", rollbackError);
        }
      }

      return res.status(500).json({
        status: false,
        message: error.message || "Could not initialize payment",
        code: error.code || "PAYMENT_INIT_ERROR",
      });
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(req, res) {
    try {
      const { reference } = req.params;

      if (!reference) {
        return res.status(400).json({
          status: false,
          message: "Payment reference is required",
        });
      }

      // Find existing payment record
      const payment = await Payment.findOne({ reference });
      if (!payment) {
        return res.status(404).json({
          status: false,
          message: "Payment record not found",
        });
      }

      // Verify with Opay
      const verificationResult = await this.opayService.verifyTransaction(
        reference
      );

      if (!verificationResult.status) {
        payment.status = "failed";
        await payment.save();
        return res.status(400).json({
          status: false,
          message: "Payment verification failed",
        });
      }

      // Update payment status
      payment.status = "success";
      payment.verificationData = verificationResult.data;
      await payment.save();

      // Create vendor payouts
      const vendorPayouts = [];
      if (payment.metadata.items && Array.isArray(payment.metadata.items)) {
        for (const item of payment.metadata.items) {
          if (item.vendorId) {
            const payout = new VendorPayout({
              vendorId: item.vendorId,
              paymentId: payment._id,
              amount: item.vendorAmount,
              status: "pending",
            });
            vendorPayouts.push(await payout.save());
          }
        }
      }

      return res.status(200).json({
        status: true,
        data: {
          payment,
          orderId: payment.orderId,
          vendorPayouts,
          verificationId: verificationResult.data.reference,
        },
      });
    } catch (error) {
      logger.error("Opay payment verification error:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not verify payment",
      });
    }
  }

  /**
   * Handle Opay callback
   */
  async handleCallback(req, res) {
    try {
      const { reference, status } = req.body;

      logger.info("Received Opay callback:", { reference, status });

      if (!reference) {
        return res.status(400).json({
          status: false,
          message: "Reference is required",
        });
      }

      // Find payment
      const payment = await Payment.findOne({ reference });
      if (!payment) {
        logger.warn(`Payment not found for reference: ${reference}`);
        return res.status(404).json({
          status: false,
          message: "Payment not found",
        });
      }

      // Update payment status based on callback
      if (status === "SUCCESS") {
        payment.status = "success";
      } else if (status === "FAILED") {
        payment.status = "failed";
      }

      await payment.save();

      logger.info(`Payment ${reference} status updated to ${payment.status}`);

      return res.status(200).json({
        status: true,
        message: "Callback processed successfully",
      });
    } catch (error) {
      logger.error("Error in Opay callback:", error);
      return res.status(500).json({
        status: false,
        message: "Failed to process callback",
      });
    }
  }

  /**
   * Get all transactions (Admin only)
   */
  async getAllTransactions(req, res) {
    try {
      const transactions = await Payment.find({ paymentMethod: "OPay" })
        .populate("orderId")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        data: transactions,
      });
    } catch (error) {
      logger.error("Error fetching Opay transactions:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch transactions",
      });
    }
  }

  /**
   * Validate bank account
   */
  async validateBankAccount(req, res) {
    try {
      const { accountNumber, bankCode } = req.body;

      if (!accountNumber || !bankCode) {
        return res.status(400).json({
          status: false,
          message: "Account number and bank code are required",
        });
      }

      const response = await this.opayService.validateBankAccount({
        accountNumber,
        bankCode,
      });

      return res.status(200).json(response);
    } catch (error) {
      logger.error("Opay account validation error:", error);
      return res.status(400).json({
        status: false,
        message: error.message || "Could not validate bank account",
      });
    }
  }

  /**
   * Get bank list
   */
  async getBankList(req, res) {
    try {
      const response = await this.opayService.getBankList();

      return res.status(200).json(response);
    } catch (error) {
      logger.error("Error fetching Opay bank list:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch bank list",
      });
    }
  }

  /**
   * Get account balance (Admin only)
   */
  async getBalance(req, res) {
    try {
      const response = await this.opayService.getBalance();

      return res.status(200).json(response);
    } catch (error) {
      logger.error("Error fetching Opay balance:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch balance",
      });
    }
  }
}

module.exports = new OpayController();

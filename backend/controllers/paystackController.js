// backend/controllers/paystackController.js
const Payment = require("../models/paymentModels");
const VendorPayout = require("../models/vendorPayoutModels");
const PaystackService = require("../services/paystackService");
const { calculateFees } = require("../utils/paymentUtils");
const logger = require("../utils/logger");

class PaystackController {
  constructor() {
    this.paystackService = new PaystackService();
  }

  async initializePayment(req, res) {
    let payment = null;

    try {
      const { email, amount, vendorAmount, platformFee, metadata } = req.body;

      logger.info("Payment initialization request:", {
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

      // Convert all amounts to numbers and validate
      const totalAmount = Math.round(parseFloat(amount) * 100); // Convert NGN to kobo
      const vendorShare = Math.round(parseFloat(vendorAmount) * 100);
      const platformShare = Math.round(parseFloat(platformFee) * 100);

      // Validate amounts are positive numbers
      if (
        isNaN(totalAmount) ||
        isNaN(vendorShare) ||
        isNaN(platformShare) ||
        totalAmount <= 0 ||
        vendorShare <= 0 ||
        platformShare <= 0
      ) {
        return res.status(400).json({
          status: false,
          message: "Invalid amount values",
        });
      }

      // Verify amount calculations with small decimal tolerance
      const calculationDifference = Math.abs(
        vendorShare + platformShare - totalAmount
      );
      if (calculationDifference > 0.01) {
        logger.error("Amount mismatch:", {
          totalAmount,
          vendorShare,
          platformShare,
        });
        return res.status(400).json({
          status: false,
          message: "Amount mismatch in calculation",
        });
      }

      // Convert amounts to kobo for Paystack
      const amountInKobo = Math.round(totalAmount * 100);

      // Ensure shipping metadata includes user ID
      const shippingData = {
        ...metadata.shipping,
        user: req.user._id, // Add user ID to shipping data
      };

      // Create payment record
      payment = new Payment({
        orderId: metadata.orderId,
        reference: `PAY-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        amount: totalAmount,
        email,
        vendorAmount: vendorShare,
        platformFee: platformShare,
        status: "pending",
        metadata: {
          userId: req.user._id,
          userEmail: email,
          customerName: metadata.customerName,
          //   items: metadata.items,
          items: metadata.items.map((item) => ({
            ...item,
            amountInKobo: Math.round(item.price), // Remove *100
            vendorAmountInKobo: Math.round(item.vendorAmount),
            platformFeeInKobo: Math.round(item.platformFee),
          })),
          shipping: shippingData,
          shippingFee: metadata.shippingFee,
          totalBeforeShipping: metadata.totalBeforeShipping,
          totalAfterShipping: metadata.totalAfterShipping,
          custom_fields: metadata.custom_fields || [],
        },
      });

      // Validate payment record before saving
      await payment.validate();
      await payment.save();
      logger.info("Payment record created:", { paymentId: payment._id });

      // Initialize Paystack transaction
      const paystackData = {
        email,
        amount: amountInKobo,
        reference: payment.reference,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
        metadata: {
          orderId: payment.orderId.toString(),
          paymentId: payment._id.toString(),
          userId: req.user._id.toString(),
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: payment.orderId.toString(),
            },
            {
              display_name: "Payment ID",
              variable_name: "payment_id",
              value: payment._id.toString(),
            },
          ],
        },
      };

      // Add split payment if vendor subaccount exists
      if (metadata.vendorSubaccountCode) {
        paystackData.split = {
          type: "percentage",
          bearer_type: "account",
          subaccounts: [
            {
              subaccount: metadata.vendorSubaccountCode,
              share: 92,
            },
          ],
        };
      }

      // Initialize transaction with Paystack
      const response = await this.paystackService.initializeTransaction(
        paystackData
      );

      // Validate Paystack response
      if (!response?.status || !response?.data?.authorization_url) {
        throw new Error("Invalid response from Paystack");
      }

      logger.info("Transaction initialized:", {
        reference: response.data.reference,
        authorization_url: response.data.authorization_url,
      });

      // Send success response
      return res.status(200).json({
        status: true,
        data: response.data,
      });
    } catch (error) {
      logger.error("Payment initialization error:", {
        error: error.message,
        stack: error.stack,
        metadata: req.body.metadata,
      });

      // Attempt to rollback payment record if it exists
      if (payment?._id) {
        try {
          await Payment.findByIdAndUpdate(payment._id, {
            status: "failed",
            errorMessage: error.message,
          });
          logger.info("Payment record rolled back:", {
            paymentId: payment._id,
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

  // Add verification endpoint
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

      // Verify with Paystack
      const verificationResult = await this.paystackService.verifyTransaction(
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
      for (const item of payment.metadata.items) {
        const payout = new VendorPayout({
          vendorId: item.vendorId,
          paymentId: payment._id,
          amount: item.vendorAmount,
          status: "pending",
        });
        vendorPayouts.push(await payout.save());
      }

      return res.status(200).json({
        status: true,
        data: {
          payment,
          vendorPayouts,
        },
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not verify payment",
      });
    }
  }

  // Seller methods
  async getSellerPayouts(req, res) {
    try {
      const sellerId = req.user._id;
      const payouts = await VendorPayout.find({ vendorId: sellerId }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        status: true,
        data: payouts,
      });
    } catch (error) {
      console.error("Error fetching seller payouts:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch payouts",
      });
    }
  }

  async addSellerBankAccount(req, res) {
    try {
      const { accountNumber, bankCode } = req.body;
      const sellerId = req.user._id;

      const response = await this.paystackService.createTransferRecipient({
        accountNumber,
        bankCode,
        sellerId,
        name: `${req.user.firstName} ${req.user.lastName}`,
      });

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error adding bank account:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not add bank account",
      });
    }
  }

  // Admin methods
  async getAllPayouts(req, res) {
    try {
      const payouts = await VendorPayout.find()
        .populate("vendorId", "firstName lastName email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        data: payouts,
      });
    } catch (error) {
      console.error("Error fetching all payouts:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch payouts",
      });
    }
  }

  // Add payout processing endpoint
  async processScheduledPayouts(req, res) {
    try {
      // Ensure the user is admin (additional security check)
      if (req.user.role !== "admin") {
        return res.status(403).json({
          status: false,
          message: "Unauthorized access",
        });
      }

      const results = await this.paystackService.processPayouts();

      return res.status(200).json({
        status: true,
        data: results,
        message: `Successfully processed ${results.length} payouts`,
      });
    } catch (error) {
      console.error("Error processing scheduled payouts:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not process scheduled payouts",
      });
    }
  }

  async getAllTransactions(req, res) {
    try {
      const transactions = await Payment.find()
        .populate("orderId")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        data: transactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch transactions",
      });
    }
  }

  // Webhook handler
  async handleWebhook(req, res) {
    try {
      const event = req.body;
      console.log("Received webhook event:", event.event);

      switch (event.event) {
        case "charge.success":
          await this.paystackService.verifyTransaction(event.data.reference);
          break;
        case "transfer.success":
          await this.paystackService.handleSuccessfulTransfer(event.data);
          break;
        case "transfer.failed":
          await this.paystackService.handleFailedTransfer(event.data);
          break;
        default:
          console.log(`Unhandled webhook event: ${event.event}`);
      }

      return res.sendStatus(200);
    } catch (error) {
      console.error("Webhook processing error:", error);
      // Log the full error details
      console.error({
        message: error.message,
        stack: error.stack,
        eventType: req.body?.event,
        reference: req.body?.data?.reference,
      });

      return res.sendStatus(500);
    }
  }

  async getBankList(req, res) {
    try {
      const response = await this.paystackService.getBankList();
      return res.status(200).json(response);
    } catch (error) {
      logger.error("Error getting bank list:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not fetch bank list",
      });
    }
  }
}

module.exports = new PaystackController();

// backend/controllers/paymentController.js - Updated with Opay support
const axios = require("axios");
const mongoose = require("mongoose");
const Payment = require("../models/paymentModels");
const Order = require("../models/orderModels");
const PaystackService = require("../services/paystackService");
const DemoPaystackService = require("../services/demoPaystackService");
const OpayService = require("../services/opayService");
const DemoOpayService = require("../services/demoOpayService");
const Card = require("../models/cardModel");
const User = require("../models/userModels");
const payoutService = require("../services/payoutService");
const logger = require("../utils/logger");

// Initialize services based on environment
const paystackService =
  process.env.NODE_ENV === "development"
    ? new DemoPaystackService()
    : new PaystackService();

// Use Demo Opay service if no credentials or in development mode
let opayService;
try {
  if (
    process.env.NODE_ENV === "development" &&
    (!process.env.OPAY_MERCHANT_ID || !process.env.OPAY_PUBLIC_KEY)
  ) {
    logger.info("Using Demo Opay Service (no credentials found)");
    opayService = new DemoOpayService();
  } else {
    opayService = new OpayService();
  }
} catch (error) {
  logger.warn(
    "Failed to initialize Opay Service, using Demo Service:",
    error.message
  );
  opayService = new DemoOpayService();
}

class PaymentController {
  // Initialize payment with Paystack or OPay
  async initializePayment(req, res) {
    try {
      const {
        orderId,
        email,
        paymentMethod,
        customerPhone,
        amount,
        metadata,
        userPhone,
      } = req.body;
      const normalizedPaymentMethod =
        paymentMethod === "Opay" ? "OPay" : paymentMethod;

      // Validate required fields
      if (!orderId || !email || !amount) {
        return res.status(400).json({
          status: false,
          message: "Order ID, email, and amount are required",
        });
      }

      // Find the order in the Order model
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          status: false,
          message: "Order not found",
        });
      }

      // Validate order state
      if (order.status !== "Pending") {
        return res.status(400).json({
          status: false,
          message: "Order is not in a payable state",
        });
      }

      // Validate the amount matches the order total
      if (Math.abs(order.totalAmount - amount) > 0.01) {
        return res.status(400).json({
          status: false,
          message: "Amount does not match order total",
        });
      }

      // Create a new Payment document to track the payment
      const payment = new Payment({
        orderId: order._id,
        email,
        amount,
        currency: order.currency || metadata?.checkoutCurrency || "NGN",
        paymentMethod: normalizedPaymentMethod,
        metadata: {
          ...metadata,
          userId: req.user._id,
          userEmail: email,
          customerName: `${req.user.firstName} ${req.user.lastName}`,
          customerPhone: customerPhone || userPhone,
        },
        status: "pending",
      });

      let paymentResponse;

      if (normalizedPaymentMethod === "Paystack") {
        paymentResponse = await paystackService.initializeTransaction({
          email,
          amount: amount * 100, // Convert to kobo for Paystack
          metadata: {
            orderId: order._id.toString(),
            userId: req.user._id,
            userEmail: email,
            customerName: `${req.user.firstName} ${req.user.lastName}`,
          },
        });

        // Update payment document with Paystack reference
        payment.reference = paymentResponse.data.reference;
        await payment.save();

        return res.status(200).json({
          status: true,
          data: {
            authorization_url: paymentResponse.data.authorization_url,
            reference: paymentResponse.data.reference,
          },
        });
      } else if (normalizedPaymentMethod === "OPay") {
        paymentResponse = await opayService.initializeTransaction({
          email,
          userPhone: customerPhone || userPhone,
          userIp: req.ip,
          metadata: {
            orderId: order._id.toString(),
            userId: req.user._id,
            userEmail: email,
            customerName: `${req.user.firstName} ${req.user.lastName}`,
          },
        });

        // Update payment document with Opay reference
        payment.reference = paymentResponse.data.reference;
        payment.metadata.opayOrderNo = paymentResponse.data.orderNo;
        await payment.save();

        return res.status(200).json({
          status: true,
          data: {
            authorization_url: paymentResponse.data.authorization_url,
            reference: paymentResponse.data.reference,
            orderNo: paymentResponse.data.orderNo,
          },
        });
      } else if (normalizedPaymentMethod === "AfriExchange") {
        const baseUrl = process.env.AFRIEXCHANGE_API_URL;
        const apiKey = process.env.AFRIEXCHANGE_KAALIS_API_KEY;

        if (!baseUrl || !apiKey) {
          return res.status(503).json({
            status: false,
            message:
              "AfriExchange checkout is not configured. Set AFRIEXCHANGE_API_URL and AFRIEXCHANGE_KAALIS_API_KEY.",
          });
        }

        const user = await User.findById(req.user._id).select("afriExchange");
        if (
          !user?.afriExchange?.userId &&
          !user?.afriExchange?.walletAddress &&
          !user?.afriExchange?.accountEmail
        ) {
          return res.status(400).json({
            status: false,
            message:
              "Please link your AfriExchange account before paying with AfriExchange.",
          });
        }

        const response = await axios.post(
          `${baseUrl.replace(/\/$/, "")}/integrations/kaalis/collections`,
          {
            idempotencyKey: `kaalis-order-${order._id}`,
            kaalisOrderId: order._id.toString(),
            kaalisBuyerId: req.user._id.toString(),
            buyerAfriExchangeUserId: user.afriExchange?.userId,
            buyerWalletAddress: user.afriExchange?.walletAddress,
            buyerAccountEmail: user.afriExchange?.accountEmail,
            amount,
            tokenType: "CT",
            description: `Kaalis checkout payment for order ${order.orderId}`,
            metadata: {
              orderId: order._id.toString(),
              userEmail: email,
              customerName: `${req.user.firstName || ""} ${
                req.user.lastName || ""
              }`.trim(),
              ...metadata,
            },
          },
          {
            headers: {
              "x-kaalis-api-key": apiKey,
            },
            timeout: 15000,
          }
        );

        const collection = response.data?.data;
        if (!response.data?.success || !collection?.reference) {
          throw new Error("AfriExchange collection failed");
        }

        payment.reference = collection.reference;
        payment.status = "success";
        payment.afriExchangeData = collection;
        await payment.save();

        const updatedOrder = await Order.findByIdAndUpdate(
          order._id,
          {
            $set: {
              status: "Processing",
              transactionId: collection.reference,
            },
          },
          { new: true, runValidators: true }
        );

        if (!updatedOrder || updatedOrder.status !== "Processing") {
          logger.error("AfriExchange payment succeeded but order status update did not persist", {
            orderId: order._id,
            reference: collection.reference,
            observedStatus: updatedOrder?.status,
          });
        }

        let vendorPayout = null;
        try {
          vendorPayout = await payoutService.scheduleVendorPayout(
            order.seller,
            order.vendorAmount,
            {
              orderId: order._id,
              kaalisOrderId: order.orderId,
              paymentId: payment._id,
              customerEmail: email,
              currency: order.currency || payment.currency || "XOF",
              paymentMethod: "AfriExchange",
              reference: collection.reference,
            }
          );
        } catch (payoutError) {
          logger.error("AfriExchange payment succeeded but vendor payout scheduling failed", {
            orderId: order._id,
            reference: collection.reference,
            error: payoutError.message,
          });
        }

        return res.status(200).json({
          status: true,
          data: {
            reference: collection.reference,
            collectionId: collection.collectionId,
            provider: "AfriExchange",
            paymentStatus: collection.status,
            orderStatus: updatedOrder?.status,
            payoutStatus: vendorPayout?.status,
            payoutId: vendorPayout?._id,
          },
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Unsupported payment method",
        });
      }
    } catch (error) {
      logger.error("Payment initialization error:", error);
      return res.status(500).json({
        message: error.message || "Could not initialize payment",
      });
    }
  }

  // Verify payment with Paystack or OPay
  async verifyPayment(req, res) {
    try {
      const { reference, paymentMethod } = req.params;
      const normalizedPaymentMethod =
        paymentMethod === "Opay" ? "OPay" : paymentMethod;

      if (!normalizedPaymentMethod) {
        return res.status(400).json({
          status: false,
          message: "Payment method is required",
        });
      }

      let verification;

      if (normalizedPaymentMethod === "Paystack") {
        verification = await paystackService.verifyTransaction(reference);
        return res.status(200).json({
          status: true,
          data: verification.data,
        });
      } else if (normalizedPaymentMethod === "OPay") {
        verification = await opayService.verifyTransaction(reference);
        return res.status(200).json({
          status: true,
          data: verification.data,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Unsupported payment method",
        });
      }
    } catch (error) {
      logger.error("Payment verification error:", error);
      return res.status(500).json({
        message: error.message || "Could not verify payment",
      });
    }
  }

  // Get user payment history
  async getUserPaymentHistory(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const payments = await Payment.find({ "metadata.userId": req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "orderId",
          select: "orderId totalAmount status vendorAmount platformFee currency paymentMethod",
        });

      const total = await Payment.countDocuments({
        "metadata.userId": req.user._id,
      });

      return res.status(200).json({
        status: true,
        data: payments.map((payment) => ({
          id: payment._id,
          reference: payment.reference,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          orderId: payment.orderId?.orderId,
          vendorAmount: payment.orderId?.vendorAmount,
          platformFee: payment.orderId?.platformFee,
          createdAt: payment.createdAt,
          email: payment.email,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error("Error fetching payment history:", error);
      return res.status(500).json({
        message: "Could not fetch payment history",
      });
    }
  }

  // Get payment details
  async getPaymentDetails(req, res) {
    try {
      const payment = await Payment.findOne({
        _id: req.params.paymentId,
        "metadata.userId": req.user._id,
      }).populate("orderId");

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      return res.status(200).json({
        status: true,
        data: payment,
      });
    } catch (error) {
      logger.error("Error fetching payment details:", error);
      return res.status(500).json({
        message: "Could not fetch payment details",
      });
    }
  }

  // ================== Bank Account Management ==================
  async verifyBankAccount(req, res) {
    try {
      const { accountNumber, bankCode, isDemoMode, paymentMethod } = req.body;

      if (!accountNumber || !bankCode) {
        return res.status(400).json({
          status: false,
          message: "Account number and bank code are required",
        });
      }

      let response;
      const method = paymentMethod || "Paystack"; // Default to Paystack

      if (method === "OPay" || method === "Opay") {
        response = await opayService.validateBankAccount({
          accountNumber,
          bankCode,
        });
      } else {
        // Paystack (both demo and real services use the same interface)
        response = await paystackService.verifyBankAccount({
          accountNumber,
          bankCode,
        });
      }

      return res.status(200).json({
        status: true,
        data: response.data,
      });
    } catch (error) {
      logger.error("Error verifying bank account:", error);
      return res.status(400).json({
        status: false,
        message: error.message || "Could not verify bank account",
      });
    }
  }

  async updateBankDetails(req, res) {
    try {
      const { accountName, accountNumber, bankCode, bankName, payoutSchedule } =
        req.body;

      if (!accountName || !accountNumber || !bankCode || !bankName) {
        return res.status(400).json({
          status: false,
          message: "All bank details are required",
        });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      user.paystack = {
        accountName,
        accountNumber,
        bankCode,
        bankName,
        payoutSchedule: payoutSchedule || "weekly",
        lastVerified: new Date(),
      };

      await user.save();

      return res.status(200).json({
        status: true,
        message: "Bank details updated successfully",
        data: user.paystack,
      });
    } catch (error) {
      logger.error("Error updating bank details:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not update bank details",
      });
    }
  }

  async deleteBankDetails(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      user.paystack = undefined;
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Bank details deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting bank details:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not delete bank details",
      });
    }
  }

  // ================== Card Management ==================
  async getUserCards(req, res) {
    try {
      const cards = await Card.find({ userId: req.user._id })
        .select("-token")
        .sort({ isDefault: -1, createdAt: -1 });

      return res.status(200).json({
        status: true,
        data: cards.map((card) => ({
          id: card._id,
          last4: card.last4,
          cardType: card.cardType,
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
          holderName: card.holderName,
          isDefault: card.isDefault,
        })),
      });
    } catch (error) {
      logger.error("Error fetching user cards:", error);
      return res.status(500).json({
        message: "Could not fetch cards",
      });
    }
  }

  async addCard(req, res) {
    try {
      const { number, holderName, expiryMonth, expiryYear, cvv, setAsDefault } =
        req.body;

      const existingCardsCount = await Card.countDocuments({
        userId: req.user._id,
      });

      if (existingCardsCount >= 5) {
        return res.status(400).json({
          status: false,
          message:
            "Maximum limit of 5 cards reached. Please delete an existing card to add a new one.",
        });
      }

      if (!number || !holderName || !expiryMonth || !expiryYear || !cvv) {
        return res.status(400).json({
          status: false,
          message: "All card fields are required",
        });
      }

      const cleanNumber = number.replace(/\s/g, "");
      const last4 = cleanNumber.slice(-4);

      try {
        const tokenizationResult = await paystackService.tokenizeCard({
          number: cleanNumber,
          cvv,
          expiryMonth,
          expiryYear,
          email: req.user.email,
        });

        const isDefault = setAsDefault || existingCardsCount === 0;

        const card = new Card({
          userId: req.user._id,
          token: tokenizationResult.token,
          last4,
          cardType: tokenizationResult.card_type,
          expiryMonth,
          expiryYear,
          holderName,
          isDefault,
        });

        if (isDefault) {
          await Card.updateMany(
            { userId: req.user._id, _id: { $ne: card._id } },
            { $set: { isDefault: false } }
          );
        }

        await card.save();

        return res.status(201).json({
          status: true,
          message: "Card added successfully",
          data: {
            id: card._id,
            last4: card.last4,
            cardType: card.cardType,
            expiryMonth: card.expiryMonth,
            expiryYear: card.expiryYear,
            holderName: card.holderName,
            isDefault: card.isDefault,
          },
        });
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: "Invalid card details",
        });
      }
    } catch (error) {
      logger.error("Error adding card:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not add card",
      });
    }
  }

  async deleteCard(req, res) {
    try {
      const { cardId } = req.params;

      if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).json({
          status: false,
          message: "Invalid card ID",
        });
      }

      const card = await Card.findOne({
        _id: cardId,
        userId: req.user._id,
      });

      if (!card) {
        return res.status(404).json({
          status: false,
          message: "Card not found",
        });
      }

      if (card.isDefault) {
        const otherCard = await Card.findOne({
          userId: req.user._id,
          _id: { $ne: cardId },
        }).sort({ createdAt: -1 });

        if (otherCard) {
          otherCard.isDefault = true;
          await otherCard.save();
        }
      }

      await Card.deleteOne({ _id: cardId });

      return res.status(200).json({
        status: true,
        message: "Card deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting card:", error);
      return res.status(500).json({
        status: false,
        message: "Could not delete card",
        error: error.message,
      });
    }
  }

  async setDefaultCard(req, res) {
    try {
      const { cardId } = req.params;

      const card = await Card.findOne({
        _id: cardId,
        userId: req.user._id,
      });

      if (!card) {
        return res.status(404).json({
          status: false,
          message: "Card not found",
        });
      }

      await Card.updateMany(
        { userId: req.user._id },
        { $set: { isDefault: false } }
      );

      card.isDefault = true;
      await card.save();

      logger.info("Default card updated:", {
        userId: req.user._id,
        cardId,
      });

      return res.status(200).json({
        status: true,
        message: "Default card updated successfully",
      });
    } catch (error) {
      logger.error("Error setting default card:", error);
      return res.status(500).json({
        status: false,
        message: "Could not update default card",
      });
    }
  }
}

module.exports = new PaymentController();

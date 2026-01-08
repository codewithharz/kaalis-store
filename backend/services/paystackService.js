// backend/utils/paystackService.js
const axios = require("axios");
const logger = require("../utils/logger");
const Payment = require("../models/paymentModels");
const Order = require("../models/orderModels");
const User = require("../models/userModels");
require("dotenv").config();

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!this.secretKey) {
      logger.error("PAYSTACK_SECRET_KEY not found in environment variables");
      throw new Error("Paystack secret key not configured");
    }

    this.baseUrl = "https://api.paystack.co";
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
      maxRetries: 3,
    });

    // Log initialization (but not the secret key)
    logger.info("PaystackService initialized");
  }

  async initializeTransaction(paymentData) {
    try {
      const order = await Order.findById(paymentData.metadata.orderId);
      if (!order) throw new Error("Order not found");

      logger.info("Initializing Paystack transaction", {
        email: paymentData.email,
        amount: order.totalAmount,
        orderId: order._id,
      });

      // Ensure amount is in kobo and is an integer
      const amountInKobo = Math.round(order.totalAmount * 100); // Convert to kobo

      const payload = {
        email: paymentData.email,
        amount: amountInKobo,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
        metadata: {
          orderId: order._id,
          userId: paymentData.metadata.userId,
          userEmail: paymentData.email,
          customerName: paymentData.metadata.customerName,
          custom_fields: paymentData.metadata.custom_fields,
        },
      };

      // Only add split if vendor Sub-account Code is provided
      if (paymentData.metadata?.vendorSubaccountCode) {
        payload.split = {
          type: "percentage",
          bearer_type: "account",
          subaccounts: [
            {
              subaccount: paymentData.metadata.vendorSubaccountCode,
              share: 92,
            },
          ],
        };
      }

      return await this.retryRequest(() =>
        this.axios.post("/transaction/initialize", payload)
      );
    } catch (error) {
      logger.error("Transaction initialization failed:", error);
      throw error;
    }
  }

  async tokenizeCard(data) {
    try {
      logger.info("Tokenizing card data:", {
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        email: data.email,
        last4: data.number.slice(-4),
      });

      // First attempt card validation
      const payload = {
        email: data.email,
        card: {
          number: data.number,
          cvv: data.cvv,
          expiry_month: data.expiryMonth,
          expiry_year: data.expiryYear,
        },
      };

      logger.info("Sending payload to Paystack:", {
        ...payload,
        card: { ...payload.card, number: "****" + data.number.slice(-4) },
      });

      // First attempt card validation
      const response = await this.axios.post("/charge/tokenize", payload);

      if (!response.data.status) {
        logger.error("Paystack tokenization failed:", response.data);
        throw new Error(response.data.message || "Card tokenization failed");
      }

      logger.info("Card tokenized successfully:", {
        card_type: response.data.data.card_type,
        last4: response.data.data.last4,
      });

      return {
        token: response.data.data.authorization_code,
        card_type: response.data.data.card_type,
        bin: response.data.data.bin,
        last4: response.data.data.last4,
        exp_month: response.data.data.exp_month,
        exp_year: response.data.data.exp_year,
        channel: response.data.data.channel,
        // card_type: response.data.data.card_type,
        bank: response.data.data.bank,
        country_code: response.data.data.country_code,
      };
    } catch (error) {
      logger.error("Error in tokenizeCard:", {
        error: error.message,
        response: error.response?.data, // Log full Paystack error response
        stack: error.stack,
      });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Could not tokenize card");
    }
  }

  async verifyTransaction(reference) {
    try {
      const response = await this.axios.get(`/transaction/verify/${reference}`);
      const transactionData = response.data.data;

      if (response.data.status && transactionData.status === "success") {
        const order = await Order.findById(transactionData.metadata.orderId);
        if (!order) throw new Error("Order not found");

        // This is where payment should be recorded
        const payment = await this.recordPayment(transactionData, order);
        await this.updateOrderStatus(order, reference);

        logger.info("Transaction verified successfully", { reference });
        return { success: true, data: payment };
      }

      return { success: false };
    } catch (error) {
      logger.error("Transaction verification error:", {
        reference,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async recordPayment(transactionData, order) {
    const payment = new Payment({
      orderId: order._id,
      reference: transactionData.reference,
      amount: order.totalAmount,
      email: transactionData.customer.email,
      status: "success",
      paymentMethod: order.paymentMethod,
      metadata: {
        userId: order.user,
        userEmail: transactionData.customer.email,
      },
      currency: "NGN",
      paystackData: transactionData,
    });

    return payment.save();
  }

  async updateOrderStatus(order, reference) {
    order.status = "Processing";
    order.transactionId = reference;
    return order.save();
  }

  async retryRequest(requestFn, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await requestFn();
        if (response.data?.status) return response.data;
        throw new Error(response.data?.message || "Request failed");
      } catch (error) {
        lastError = error;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
    throw lastError;
  }

  async verifyBankAccount(data) {
    try {
      logger.info("Verifying bank account:", {
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
      });

      const response = await this.axios.get(
        `/bank/resolve?account_number=${data.accountNumber}&bank_code=${data.bankCode}`
      );

      if (!response.data.status) {
        throw new Error(response.data.message || "Could not verify account");
      }

      logger.info("Bank account verified successfully:", {
        accountName: response.data.data.account_name,
      });

      return response.data;
    } catch (error) {
      logger.error("Error verifying bank account:", {
        error: error.message,
        response: error.response?.data,
        stack: error.stack,
      });

      // Handle specific Paystack error messages
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error("Could not verify bank account");
    }
  }

  async createTransferRecipient(data) {
    try {
      // Input validation
      if (
        !data.name ||
        !data.accountNumber ||
        !data.bankCode ||
        !data.sellerId
      ) {
        throw new Error("Missing required fields");
      }

      // Validate account number format
      if (!/^\d{10}$/.test(data.accountNumber)) {
        throw new Error("Invalid account number format");
      }

      // Validate bank code format
      if (!/^\d{3}$/.test(data.bankCode)) {
        throw new Error("Invalid bank code format");
      }

      logger.info("Verifying account details:", {
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
      });

      // First verify account number with better error handling
      try {
        const verifyResponse = await this.axios.get(
          `/bank/resolve?account_number=${data.accountNumber}&bank_code=${data.bankCode}`
        );

        if (!verifyResponse.data.status) {
          throw new Error(
            verifyResponse.data.message || "Could not verify account"
          );
        }

        // Log successful verification
        logger.info("Account verified successfully:", {
          accountName: verifyResponse.data.data.account_name,
          accountNumber: data.accountNumber,
        });

        // Create transfer recipient with verified account name
        const response = await this.axios.post("/transferrecipient", {
          type: "nuban",
          name: verifyResponse.data.data.account_name,
          account_number: data.accountNumber,
          bank_code: data.bankCode,
          currency: "NGN",
          metadata: {
            sellerId: data.sellerId,
          },
        });

        if (!response.data.status) {
          throw new Error(
            response.data.message || "Failed to create transfer recipient"
          );
        }

        // Update user model with recipient code and verified details
        await User.findByIdAndUpdate(data.sellerId, {
          "paystack.recipientCode": response.data.data.recipient_code,
          "paystack.accountNumber": data.accountNumber,
          "paystack.bankCode": data.bankCode,
          "paystack.accountName": verifyResponse.data.data.account_name,
        });

        return response.data;
      } catch (error) {
        // Handle Paystack API specific errors
        if (error.response?.data?.message) {
          logger.error("Paystack API error:", {
            message: error.response.data.message,
            code: error.response.data.code,
            accountNumber: data.accountNumber,
            bankCode: data.bankCode,
          });
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    } catch (error) {
      logger.error("Error in createTransferRecipient:", {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async initiateTransfer({ amount, recipient, reason }) {
    try {
      logger.info(
        `Initiating transfer: Amount=${amount}, Recipient=${recipient}, Reason=${reason}`
      );

      const response = await this.axios.post("/transfer", {
        source: "balance",
        amount,
        recipient,
        reason,
      });

      if (!response.data.status) {
        throw new Error(response.data.message || "Transfer initiation failed");
      }

      logger.info(
        `Transfer initiated successfully: ${response.data.data.reference}`
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Paystack transfer initiation failed:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  // Get list of banks from Paystack
  async getBankList() {
    try {
      logger.info("Fetching bank list from Paystack");
      const response = await this.axios.get("/bank?currency=NGN");

      if (!response.data.status) {
        throw new Error(response.data.message || "Could not fetch bank list");
      }

      logger.info(`Successfully fetched ${response.data.data.length} banks`);
      return response.data;
    } catch (error) {
      logger.error("Error fetching bank list:", {
        error: error.message,
        response: error.response?.data,
      });
      throw new Error(error.response?.data?.message || "Could not fetch bank list");
    }
  }

  // Mock method for testing without real API calls
  async mockInitiateTransfer({ amount, recipient, reason }) {
    try {
      logger.info(
        `Mock transfer: Amount=${amount}, Recipient=${recipient}, Reason=${reason}`
      );

      // Validate input
      if (!amount || !recipient || !reason) {
        throw new Error("Missing required transfer parameters");
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        status: true,
        data: {
          reference: `mock_transfer_${Date.now()}`,
          integration: 100073,
          domain: "test",
          amount: amount,
          currency: "NGN",
          source: "balance",
          reason: reason,
          recipient: recipient,
          status: "success",
          transfer_code: `TRF_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          id: Date.now(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    } catch (error) {
      logger.error("Mock transfer failed:", error.message);
      throw error;
    }
  }
}

module.exports = PaystackService;

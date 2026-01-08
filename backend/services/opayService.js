// backend/services/opayService.js
const axios = require("axios");
const crypto = require("crypto");
const logger = require("../utils/logger");
const Payment = require("../models/paymentModels");
const Order = require("../models/orderModels");
require("dotenv").config();

class OpayService {
  constructor() {
    // Opay credentials from environment variables
    this.merchantId = process.env.OPAY_MERCHANT_ID;
    this.publicKey = process.env.OPAY_PUBLIC_KEY;
    this.privateKey = process.env.OPAY_PRIVATE_KEY;

    // Check if we should use test mode
    this.isTestMode =
      process.env.NODE_ENV === "development" ||
      process.env.OPAY_TEST_MODE === "true";

    if (!this.merchantId || !this.publicKey || !this.privateKey) {
      logger.error("Opay credentials not found in environment variables");
      logger.error(
        "Required: OPAY_MERCHANT_ID, OPAY_PUBLIC_KEY, OPAY_PRIVATE_KEY"
      );
      throw new Error("Opay credentials not configured");
    }

    // Opay API URLs - use test URLs in development
    if (this.isTestMode) {
      this.baseUrl =
        process.env.OPAY_BASE_URL || "https://testapi.opaycheckout.com";
      this.cashoutUrl =
        process.env.OPAY_CASHOUT_URL ||
        "https://testapi-cashout.opaycheckout.com";
      logger.info("OpayService initialized in TEST mode");
    } else {
      this.baseUrl =
        process.env.OPAY_BASE_URL || "https://api.opaycheckout.com";
      this.cashoutUrl =
        process.env.OPAY_CASHOUT_URL || "https://api-cashout.opaycheckout.com";
      logger.info("OpayService initialized in PRODUCTION mode");
    }

    this.axios = axios.create({
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    logger.info("OpayService initialized", {
      merchantId: this.merchantId,
      baseUrl: this.baseUrl,
      testMode: this.isTestMode,
    });
  }

  /**
   * Generate HMAC SHA512 signature for Opay requests
   * @param {Object} data - Request data
   * @returns {string} Signature
   */
  generateSignature(data) {
    const payload = JSON.stringify(data);
    return crypto
      .createHmac("sha512", this.privateKey)
      .update(payload)
      .digest("hex")
      .toUpperCase();
  }

  /**
   * Initialize transaction with Opay
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Opay response
   */
  async initializeTransaction(paymentData) {
    try {
      const order = await Order.findById(paymentData.metadata.orderId);
      if (!order) throw new Error("Order not found");

      logger.info("Initializing Opay transaction", {
        email: paymentData.email,
        amount: order.totalAmount,
        orderId: order._id,
        testMode: this.isTestMode,
      });

      // Generate unique reference
      const reference = `OPAY-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`;

      // ✅ FIX: Use the same URL format as Paystack
      // This will redirect to /payment/success/:reference/:orderId
      const returnUrl = `${process.env.FRONTEND_URL}/payment/success/${reference}/${order._id}`;

      logger.info("OPay return URL:", { returnUrl });

      // Use v1 API format
      const requestData = {
        reference,
        country: "NG",
        amount: {
          total: Math.round(order.totalAmount * 100), // Convert to kobo
          currency: "NGN",
        },
        returnUrl: returnUrl, // ✅ Updated to match Paystack format
        callbackUrl: `${process.env.BACKEND_URL}/api/opay/callback`,
        product: {
          name: `Order ${order.orderId}`,
          description: `Payment for order ${order.orderId}`,
        },
        userInfo: {
          userEmail: paymentData.email,
          userId: paymentData.metadata.userId,
          userMobile: paymentData.userPhone || "",
          userName: order.shippingAddress?.name || "Customer",
        },
        expireAt: 300, // 5 minutes in seconds
      };

      logger.info("Opay API Request:", {
        url: `${this.baseUrl}/api/v1/international/cashier/create`,
        reference: requestData.reference,
        amount: requestData.amount.total,
        returnUrl: requestData.returnUrl,
      });

      // Use v1 endpoint
      const response = await this.axios.post(
        `${this.baseUrl}/api/v1/international/cashier/create`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            MerchantId: this.merchantId,
            "Content-Type": "application/json",
          },
        }
      );

      logger.info("Opay API Response:", {
        status: response.status,
        code: response.data?.code,
        message: response.data?.message,
      });

      if (!response.data || response.data.code !== "00000") {
        const errorMsg =
          response.data?.message || "Transaction initialization failed";
        logger.error("Opay returned error:", {
          code: response.data?.code,
          message: errorMsg,
        });
        throw new Error(errorMsg);
      }

      return {
        status: true,
        data: {
          authorization_url: response.data.data.cashierUrl,
          reference: reference,
          orderNo: response.data.data.orderNo,
        },
      };
    } catch (error) {
      if (error.response) {
        logger.error("Opay API Error:", {
          status: error.response.status,
          data: error.response.data,
        });
      }
      throw error;
    }
  }

  /**
   * Verify transaction status
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} Transaction status
   */
  async verifyTransaction(reference) {
    try {
      logger.info(`Verifying Opay transaction: ${reference}`);

      const requestData = { reference };

      const response = await this.axios.post(
        `${this.baseUrl}/api/v1/international/transaction/query`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            MerchantId: this.merchantId,
          },
        }
      );

      if (response.data.code !== "00000") {
        throw new Error(response.data.message || "Verification failed");
      }

      const transactionData = response.data.data;

      // ✅ Return orderId in verification response
      return {
        status: transactionData.status === "SUCCESS",
        data: {
          reference: transactionData.reference,
          orderId: transactionData.metadata?.orderId, // Include orderId
          status: transactionData.status,
          amount: transactionData.amount.total / 100,
        },
      };
    } catch (error) {
      logger.error("Verification error:", error.message);
      throw error;
    }
  }

  /**
   * Record payment in database
   * @param {Object} transactionData - Transaction data from Opay
   * @param {Object} order - Order object
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} Payment record
   */
  async recordPayment(transactionData, order, reference) {
    const payment = new Payment({
      orderId: order._id,
      reference: reference,
      amount: transactionData.amount.total / 100,
      email: order.user.email || transactionData.userInfo?.userEmail,
      status: "success",
      paymentMethod: "OPay",
      metadata: {
        userId: order.user,
        userEmail: order.user.email,
      },
      currency: "NGN",
      opayData: transactionData,
    });

    return payment.save();
  }

  /**
   * Update order status after successful payment
   * @param {Object} order - Order object
   * @param {string} reference - Transaction reference
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(order, reference) {
    order.status = "Processing";
    order.transactionId = reference;
    return order.save();
  }

  /**
   * Initiate transfer/payout to vendor
   * @param {Object} transferData - Transfer data
   * @returns {Promise<Object>} Transfer response
   */
  async initiateTransfer(transferData) {
    try {
      logger.info("Initiating Opay transfer:", {
        amount: transferData.amount,
        receiver: transferData.receiver,
      });

      const reference = `TRF-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}`;

      const requestData = {
        reference,
        amount: {
          total: Math.round(transferData.amount * 100),
          currency: "NGN",
        },
        receiver: {
          name: transferData.receiver.name,
          bankAccountNumber: transferData.receiver.accountNumber,
          bankCode: transferData.receiver.bankCode,
        },
        reason: transferData.reason || "Vendor payout",
      };

      const response = await this.axios.post(
        `${this.cashoutUrl}/api/v3/transfer/toBank`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            MerchantId: this.merchantId,
          },
        }
      );

      if (response.data.code !== "00000") {
        throw new Error(response.data.message || "Transfer failed");
      }

      logger.info("Opay transfer initiated successfully", {
        reference,
        orderNo: response.data.data.orderNo,
      });

      return {
        status: true,
        data: {
          reference: reference,
          orderNo: response.data.data.orderNo,
          amount: transferData.amount,
          status: response.data.data.status,
        },
      };
    } catch (error) {
      logger.error("Opay transfer failed:", {
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  }

  /**
   * Check transfer status
   * @param {string} reference - Transfer reference
   * @returns {Promise<Object>} Transfer status
   */
  async checkTransferStatus(reference) {
    try {
      logger.info(`Checking Opay transfer status: ${reference}`);

      const requestData = { reference };

      const response = await this.axios.post(
        `${this.cashoutUrl}/api/v3/transfer/status/toBank`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            MerchantId: this.merchantId,
          },
        }
      );

      if (response.data.code !== "00000") {
        throw new Error(response.data.message || "Status check failed");
      }

      return {
        status: true,
        data: response.data.data,
      };
    } catch (error) {
      logger.error("Opay transfer status check failed:", {
        reference,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get account balance
   * @returns {Promise<Object>} Balance information
   */
  async getBalance() {
    try {
      logger.info("Fetching Opay account balance");

      const response = await this.axios.get(
        `${this.cashoutUrl}/api/v3/balances`,
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            MerchantId: this.merchantId,
          },
        }
      );

      if (response.data.code !== "00000") {
        throw new Error(response.data.message || "Balance fetch failed");
      }

      return {
        status: true,
        data: response.data.data,
      };
    } catch (error) {
      logger.error("Opay balance fetch failed:", error.message);
      throw error;
    }
  }

  /**
   * Validate bank account
   * @param {Object} accountData - Account data to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateBankAccount(accountData) {
    try {
      logger.info("Validating bank account with Opay:", {
        accountNumber: accountData.accountNumber,
        bankCode: accountData.bankCode,
      });

      const requestData = {
        bankAccountNumber: accountData.accountNumber,
        bankCode: accountData.bankCode,
      };

      const response = await this.axios.post(
        `${this.cashoutUrl}/api/v3/info/bankAccount`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            MerchantId: this.merchantId,
          },
        }
      );

      if (response.data.code !== "00000") {
        throw new Error(response.data.message || "Account validation failed");
      }

      logger.info("Bank account validated successfully:", {
        accountName: response.data.data.accountName,
      });

      return {
        status: true,
        data: {
          account_name: response.data.data.accountName,
          account_number: accountData.accountNumber,
          bank_code: accountData.bankCode,
        },
      };
    } catch (error) {
      logger.error("Opay account validation failed:", {
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  }

  /**
   * Get list of supported banks
   * @returns {Promise<Object>} Banks list
   */
  async getBankList() {
    try {
      logger.info("Fetching Opay supported banks");

      const response = await this.axios.get(`${this.cashoutUrl}/api/v3/banks`, {
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          MerchantId: this.merchantId,
        },
      });

      if (response.data.code !== "00000") {
        throw new Error(response.data.message || "Banks fetch failed");
      }

      return {
        status: true,
        data: response.data.data,
      };
    } catch (error) {
      logger.error("Opay banks fetch failed:", error.message);
      throw error;
    }
  }
}

module.exports = OpayService;

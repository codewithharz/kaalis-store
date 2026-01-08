const axios = require("axios");
const Order = require("../models/orderModels");
const {
  calculateTransactionAmounts,
  validateOrangeMoneyAmounts,
  convertNGNToXOF,
  generatePaymentReference,
} = require("../utils/paymentUtils");
const logger = require("../utils/logger");
const { URLSearchParams } = require("url");

class OrangeMoneyService {
  // Cache for the access token
  #accessToken = null;
  #tokenExpiresAt = null;

  // Fetch a new access token if the current one is expired or not set
  async #fetchAccessToken() {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        if (this.#accessToken && this.#tokenExpiresAt > Date.now()) {
          return this.#accessToken;
        }

        const body = new URLSearchParams();
        body.append("grant_type", "client_credentials");

        // Get the pre-encoded authorization header
        const authHeader = process.env.AUTHORIZATION_HEADER;

        // Log auth header length (for debugging, don't log the actual value)
        console.log("Auth header length:", authHeader ? authHeader.length : 0);

        const response = await axios.post(
          "https://api.orange.com/oauth/v3/token",
          body,
          {
            headers: {
              // Use the full Authorization header with the Basic prefix
              Authorization: `Basic ${authHeader}`,
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
          }
        );

        this.#accessToken = response.data.access_token;
        this.#tokenExpiresAt =
          Date.now() + response.data.expires_in * 1000 - 60000;

        logger.info("Fetched new Orange Money access token", {
          expiresIn: response.data.expires_in,
        });

        return this.#accessToken;
      } catch (error) {
        // Log more detailed error information
        logger.error("Error fetching Orange Money access token:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
          // Don't log the full config as it may contain sensitive information
          requestURL: error.config?.url,
          requestMethod: error.config?.method,
        });

        if (error.response?.status === 429 && retryCount < maxRetries - 1) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          logger.info(`Rate limit hit, retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          retryCount++;
          continue;
        }

        throw new Error("Failed to fetch Orange Money access token");
      }
    }

    throw new Error("Failed to fetch Orange Money access token after retries");
  }

  async initializeTransaction(paymentData) {
    try {
      const {
        email,
        orderId,
        amount,
        shippingFee,
        customerPhone,
        userId,
        userEmail,
        customerName,
      } = paymentData;

      const order = await Order.findOne({ orderId });
      if (!order) {
        throw new Error("Order not found");
      }

      // Calculate amounts in XOF for Orange Money
      const amounts = calculateTransactionAmounts(
        amount,
        shippingFee,
        "OrangeMoney"
      );
      if (
        !validateOrangeMoneyAmounts({
          amount: order.totalAmount,
          vendorAmount: order.vendorAmount,
          platformFee: order.platformFee,
          shippingFee: order.shippingFee,
        })
      ) {
        throw new Error("Invalid payment amounts");
      }

      // Fetch the access token
      const accessToken = await this.#fetchAccessToken();

      const transactionData = {
        merchant_key: process.env.ORANGE_MONEY_MERCHANT_KEY,
        currency: "XOF",
        order_id: orderId,
        amount: amounts.totalInXOF,
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        notif_url: `${process.env.API_URL}/api/orange-money/callback`,
        lang: "en",
        reference: generatePaymentReference("OM"),
        customer_phone: customerPhone,
      };

      const response = await axios.post(
        "https://api.orange.com/orange-money-webpay/dev/v1/webpayment",
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data || !response.data.payment_url) {
        throw new Error("Failed to initialize Orange Money payment");
      }

      // Update order with transaction ID
      order.transactionId = response.data.payment_id;
      await order.save();

      return {
        payment_url: response.data.payment_url,
        payment_id: response.data.payment_id,
      };
    } catch (error) {
      logger.error(
        "Error initializing Orange Money transaction:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async recordPayment(paymentResponse, order) {
    return {
      reference: paymentResponse.payment_id,
      orderId: order._id,
    };
  }

  async updateOrderStatus(order, reference) {
    order.transactionId = reference;
    order.status = "Processing";
    await order.save();
  }
}

module.exports = new OrangeMoneyService();

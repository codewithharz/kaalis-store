// backend/services/PayDunyaService.js
const axios = require("axios");
const logger = require("../utils/logger");
const { convertNGNToXOF } = require("../utils/paymentUtils");

class PayDunyaService {
  #apiBaseUrl = "https://app.paydunya.com/api/v1";
  #masterKey = process.env.PAYDUNYA_MASTER_KEY;
  #publicKey = process.env.PAYDUNYA_PUBLIC_KEY_TEST;
  #privateKey = process.env.PAYDUNYA_PRIVATE_KEY_TEST;
  #token = process.env.PAYDUNYA_TOKEN_TEST;
  #isConfigured = false;
  #redirectUrl =
    process.env.PAYDUNYA_REDIRECT_URL ||
    "http://localhost:7788/api/paydunya/callback";

  constructor() {
    // Validate API keys are present
    if (
      !this.#masterKey ||
      !this.#publicKey ||
      !this.#privateKey ||
      !this.#token
    ) {
      logger.warn("⚠️  PayDunya API keys are missing - PayDunya payment features will be disabled");
      logger.warn("   This is normal for Vercel deployments without PayDunya configured");
      this.#isConfigured = false;
      return;
    }

    this.#isConfigured = true;
    logger.info("PayDunyaService initialized with test keys", {
      masterKey: this.#masterKey ? "****" : "missing",
      publicKey: this.#publicKey ? "****" : "missing",
      privateKey: this.#privateKey ? "****" : "missing",
      token: this.#token ? "****" : "missing",
    });
  }

  // Initialize a payment
  async initializePayment(order, customerEmail, customerPhone) {
    if (!this.#isConfigured) {
      throw new Error("PayDunya is not configured. Please add API keys to environment variables.");
    }

    try {
      // Convert amount from NGN to XOF
      const amountInXOF = convertNGNToXOF(order.totalAmount);

      // Log key data before constructing payload
      logger.info("Preparing PayDunya payment request", {
        orderId: order._id,
        orderTotalNGN: order.totalAmount,
        convertedAmountXOF: amountInXOF,
        customerEmail,
        customerPhone,
      });

      // Build PayDunya invoice payload according to docs
      const payload = {
        invoice: {
          total_amount: amountInXOF,
          description: `Payment for order ${order.orderId}`,
          items: {
            // Format items as required by PayDunya
            item_0: {
              name: "Bruthol Store Order",
              quantity: 1,
              unit_price: amountInXOF,
              total_price: amountInXOF,
              description: `Order ${order.orderId}`,
            },
          },
        },
        store: {
          name: "Bruthol Store",
          tagline: "Your Trusted E-commerce Platform",
          phone: process.env.STORE_PHONE || "+221000000000", // Required field
          postal_address: process.env.STORE_ADDRESS || "Dakar, Senegal", // Required field
          website_url:
            "https://kaalis-store-git-master-harzjuniors-projects.vercel.app",
        },
        custom_data: {
          order_id: order._id.toString(),
          customer_email: customerEmail,
          customer_phone: customerPhone,
          order_reference: order.orderId,
        },
        actions: {
          cancel_url: "http://localhost:5173/checkout/cancel",
          return_url: "http://localhost:5173/checkout/success",
          callback_url: this.#redirectUrl,
        },
      };

      // Log the complete API request
      logger.info("Sending PayDunya payment initialization request:", {
        url: `${this.#apiBaseUrl}/checkout-invoice/create`,
        payload: JSON.stringify(payload),
        headers: {
          "PAYDUNYA-MASTER-KEY": "***",
          "PAYDUNYA-PUBLIC-KEY": "***",
          "PAYDUNYA-PRIVATE-KEY": "***",
          "PAYDUNYA-TOKEN": "***",
        },
      });

      // Make the API request
      const response = await axios.post(
        `${this.#apiBaseUrl}/checkout-invoice/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "PAYDUNYA-MASTER-KEY": this.#masterKey,
            "PAYDUNYA-PUBLIC-KEY": this.#publicKey,
            "PAYDUNYA-PRIVATE-KEY": this.#privateKey,
            "PAYDUNYA-TOKEN": this.#token,
          },
        }
      );

      // Log the full response (successful)
      logger.info("PayDunya API response:", {
        status: response.status,
        statusText: response.statusText,
        data: JSON.stringify(response.data),
      });

      // Check response format based on PayDunya docs
      if (response.data.response_code === "00" && response.data.token) {
        const paymentUrl = response.data.response_text;
        return {
          payment_url: paymentUrl,
          payment_token: response.data.token,
        };
      } else {
        // Handle error response from API
        logger.error("PayDunya API returned an error response:", {
          response_code: response.data.response_code,
          response_text: response.data.response_text,
          description: response.data.description,
        });

        throw new Error(
          response.data.description ||
          response.data.response_text ||
          "Failed to initialize PayDunya payment"
        );
      }
    } catch (error) {
      // Enhanced error logging
      if (error.response) {
        // The API responded with an error status
        logger.error("PayDunya API error response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
            ? JSON.stringify(error.response.data)
            : "No data",
          headers: error.response.headers
            ? JSON.stringify(error.response.headers)
            : "No headers",
        });
      } else if (error.request) {
        // No response received
        logger.error("No response received from PayDunya API:", {
          request: error.request
            ? "Request was made but no response received"
            : "Unknown request error",
        });
      } else {
        // Error before making request
        logger.error("Error initializing PayDunya payment:", {
          message: error.message,
          stack: error.stack,
        });
      }

      // Throw a more informative error
      throw new Error(
        error.response?.data?.description ||
        error.response?.data?.message ||
        error.message ||
        "Failed to initialize PayDunya payment"
      );
    }
  }

  // Verify payment status (to be called via callback)
  async verifyPayment(paymentToken) {
    try {
      logger.info("Verifying PayDunya payment", { token: paymentToken });

      const response = await axios.get(
        `${this.#apiBaseUrl}/checkout-invoice/confirm/${paymentToken}`,
        {
          headers: {
            "PAYDUNYA-MASTER-KEY": this.#masterKey,
            "PAYDUNYA-PUBLIC-KEY": this.#publicKey,
            "PAYDUNYA-PRIVATE-KEY": this.#privateKey,
            "PAYDUNYA-TOKEN": this.#token,
          },
        }
      );

      logger.info("PayDunya payment verification response:", {
        status: response.status,
        data: JSON.stringify(response.data),
      });

      if (response.data.status === "completed") {
        return {
          status: "completed",
          amount: response.data.total_amount,
          order_id: response.data.custom_data.order_id,
          customer_email: response.data.custom_data.customer_email,
          customer_phone: response.data.custom_data.customer_phone,
        };
      } else {
        return { status: response.data.status };
      }
    } catch (error) {
      // Enhanced error logging
      if (error.response) {
        logger.error("PayDunya payment verification error:", {
          status: error.response.status,
          data: error.response.data
            ? JSON.stringify(error.response.data)
            : "No data",
        });
      } else {
        logger.error("Error verifying PayDunya payment:", {
          message: error.message,
          stack: error.stack,
        });
      }

      throw new Error(
        error.response?.data?.description ||
        error.message ||
        "Failed to verify PayDunya payment"
      );
    }
  }
}

module.exports = PayDunyaService;

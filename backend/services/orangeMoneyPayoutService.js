// backend/services/orangeMoneyPayoutService.js
const axios = require("axios");
const { URLSearchParams } = require("url");
const logger = require("../utils/logger");
const currencyService = require("./currencyService");

class OrangeMoneyPayoutService {
  constructor() {
    // Access token management
    this.accessToken = null;
    this.tokenExpiresAt = null;

    // API configuration
    this.baseUrl = process.env.ORANGE_MONEY_API_URL || "https://api.orange.com";
    this.merchantKey = process.env.ORANGE_MONEY_MERCHANT_KEY;
    this.clientId = process.env.ORANGE_MONEY_CLIENT_ID;
    this.clientSecret = process.env.ORANGE_MONEY_CLIENT_SECRET;

    // Check if required API keys are missing
    if (!this.merchantKey || !this.clientId || !this.clientSecret) {
      this.isDisabled = true;
      logger.warn("Orange Money API keys missing - service will be disabled");
    } else {
      logger.info("OrangeMoneyPayoutService initialized");
    }
  }

  /**
   * Fetch and manage OAuth token for Orange Money API
   * @returns {Promise<string>} Valid access token
   */
  async getAccessToken() {
    try {
      if (this.isDisabled) {
        logger.warn("Attempted to use disabled Orange Money service");
        throw new Error(
          "Orange Money service is disabled due to missing API keys"
        );
      }

      // Return cached token if still valid
      if (this.accessToken && this.tokenExpiresAt > Date.now()) {
        return this.accessToken;
      }

      logger.info("Fetching new Orange Money access token");

      const body = new URLSearchParams();
      body.append("grant_type", "client_credentials");

      const auth = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString("base64");

      const response = await axios.post(
        `${this.baseUrl}/oauth/v3/token`,
        body,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.access_token) {
        this.accessToken = response.data.access_token;
        this.tokenExpiresAt =
          Date.now() + response.data.expires_in * 1000 - 60000; // 1 minute buffer

        logger.info("Orange Money access token obtained successfully", {
          expiresIn: response.data.expires_in,
          tokenType: response.data.token_type,
        });

        return this.accessToken;
      } else {
        throw new Error("Invalid response from Orange Money token endpoint");
      }
    } catch (error) {
      logger.error("Error fetching Orange Money access token:", error);
      throw new Error(`Orange Money authentication failed: ${error.message}`);
    }
  }

  /**
   * Initiate a transfer to vendor's Orange Money account
   * @param {Object} payoutData - Payout details
   * @returns {Promise<Object>} Transfer response
   */
  async initiateTransfer(payoutData) {
    try {
      const { amount, vendorPhone, reference, description, currency } =
        payoutData;

      if (this.isDisabled) {
        logger.warn("Attempted to use disabled Orange Money service");
        throw new Error(
          "Orange Money service is disabled due to missing API keys"
        );
      }

      if (!amount || !vendorPhone) {
        throw new Error(
          "Amount and vendor phone are required for Orange Money transfers"
        );
      }

      // Orange Money expects amounts in XOF
      let amountInXOF = amount;
      if (currency === "NGN") {
        amountInXOF = currencyService.convertNGNtoXOF(amount);
      }

      // Round to whole number - Orange Money doesn't support decimals for XOF
      amountInXOF = Math.round(amountInXOF);

      // Get valid access token
      const accessToken = await this.getAccessToken();

      logger.info(
        `Initiating Orange Money transfer of ${amountInXOF} XOF to ${vendorPhone}`
      );

      const payload = {
        merchant_key: this.merchantKey,
        amount: amountInXOF,
        phone_number: vendorPhone,
        reference: reference || `OM-PAYOUT-${Date.now()}`,
        description: description || `Vendor payout - ${reference}`,
        currency: "XOF",
      };

      const response = await axios.post(
        `${this.baseUrl}/orange-money-webpay/dev/v1/payout`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.status === "SUCCESS") {
        logger.info("Orange Money transfer initiated successfully:", {
          payoutId: response.data.payout_id,
          reference: payload.reference,
        });

        return {
          success: true,
          payoutId: response.data.payout_id,
          reference: payload.reference,
          status: "processing",
          message: response.data.message || "Transfer initiated",
        };
      } else {
        logger.error("Orange Money transfer failed:", response.data);
        throw new Error(
          response.data.message || "Orange Money transfer failed"
        );
      }
    } catch (error) {
      logger.error("Error initiating Orange Money transfer:", error);
      throw error;
    }
  }

  /**
   * Check status of a transfer
   * @param {string} payoutId - Payout ID from initiateTransfer response
   * @returns {Promise<Object>} Status response
   */
  async checkTransferStatus(payoutId) {
    try {
      if (!payoutId) {
        throw new Error("Payout ID is required");
      }

      logger.info(
        `Checking Orange Money transfer status for payout ID: ${payoutId}`
      );

      // Get valid access token
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/orange-money-webpay/dev/v1/payout/${payoutId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        const status = response.data.status || "UNKNOWN";
        logger.info(`Orange Money transfer status: ${status}`);

        return {
          success: true,
          payoutId: payoutId,
          status: status,
          data: response.data,
        };
      } else {
        throw new Error("Invalid response from Orange Money status check");
      }
    } catch (error) {
      logger.error("Error checking Orange Money transfer status:", error);
      throw error;
    }
  }

  /**
   * Get account balance
   * @returns {Promise<Object>} Balance information
   */
  async getAccountBalance() {
    try {
      logger.info("Fetching Orange Money account balance");

      // Get valid access token
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/orange-money-webpay/dev/v1/merchant/balance`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            merchant_key: this.merchantKey,
          },
        }
      );

      if (response.data && response.data.status === "SUCCESS") {
        const balance = response.data.balance || 0;
        logger.info(`Orange Money account balance: ${balance} XOF`);

        return {
          success: true,
          balance: balance,
          currency: "XOF",
        };
      } else {
        logger.error("Failed to fetch Orange Money balance:", response.data);
        throw new Error(response.data.message || "Could not fetch balance");
      }
    } catch (error) {
      logger.error("Error getting Orange Money account balance:", error);
      throw error;
    }
  }

  /**
   * Validate phone number format for Orange Money
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} Is valid phone number
   */
  validatePhoneNumber(phoneNumber) {
    // Basic validation for phone numbers in Senegal and other West African countries
    // Formats: +221XXXXXXXX, +225XXXXXXXX, etc.
    const regex = /^\+(?:221|225|226|227|228|229|233|234)\d{8,9}$/;
    return regex.test(phoneNumber);
  }
}

module.exports = new OrangeMoneyPayoutService();

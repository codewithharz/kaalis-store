// backend/services/payDunyaPayoutService.js
const axios = require("axios");
const logger = require("../utils/logger");
const currencyService = require("./currencyService");

class PayDunyaPayoutService {
  constructor() {
    this.apiBaseUrl =
      process.env.PAYDUNYA_API_URL || "https://app.paydunya.com/api/v1";
    this.masterKey = process.env.PAYDUNYA_MASTER_KEY;
    this.privateKey = process.env.PAYDUNYA_PRIVATE_KEY_TEST;
    this.publicKey = process.env.PAYDUNYA_PUBLIC_KEY_TEST;
    this.token = process.env.PAYDUNYA_TOKEN_TEST;

    // Set environment - default to test if not specified
    this.environment = process.env.PAYDUNYA_ENVIRONMENT || "test";

    // Validate required API keys
    if (!this.masterKey || !this.privateKey || !this.publicKey || !this.token) {
      const errorMsg =
        "Missing required PayDunya API keys in environment variables";
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    logger.info(
      `PayDunyaPayoutService initialized in ${this.environment} environment`
    );
  }

  /**
   * Get authorization headers for PayDunya API requests
   * @returns {Object} Headers object with API keys
   */
  getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      "PAYDUNYA-MASTER-KEY": this.masterKey,
      "PAYDUNYA-PRIVATE-KEY": this.privateKey,
      "PAYDUNYA-PUBLIC-KEY": this.publicKey,
      "PAYDUNYA-TOKEN": this.token,
    };
  }

  /**
   * Initiate a direct withdrawal to vendor account
   * @param {Object} payoutData - Payout data including amount, vendor details
   * @returns {Promise<Object>} Payout response
   */
  async initiateWithdrawal(payoutData) {
    try {
      const { amount, vendorPhone, vendorEmail, reference, description } =
        payoutData;

      if (!amount || !vendorPhone) {
        throw new Error(
          "Amount and vendor phone are required for PayDunya withdrawals"
        );
      }

      // PayDunya expects amounts in XOF
      let amountInXOF = amount;
      if (payoutData.currency === "NGN") {
        amountInXOF = currencyService.convertNGNtoXOF(amount);
      }

      logger.info(
        `Initiating PayDunya withdrawal of ${amountInXOF} XOF to ${vendorPhone}`
      );

      const payload = {
        account_alias: vendorPhone,
        amount: Math.round(amountInXOF), // PayDunya requires integer amounts
        withdraw_mode: "mobile_money", // or 'bank_transfer' depending on your setup
        customer_phone: vendorPhone,
        customer_email: vendorEmail || "",
        customer_name: payoutData.vendorName || "Vendor",
        reference: reference || `PD-PAYOUT-${Date.now()}`,
        description: description || `Payout for reference ${reference}`,
      };

      // Log the request payload (excluding sensitive info)
      logger.info("PayDunya withdrawal request payload:", {
        ...payload,
        customer_phone: `${vendorPhone.substring(
          0,
          4
        )}...${vendorPhone.substring(vendorPhone.length - 2)}`,
      });

      const response = await axios.post(
        `${this.apiBaseUrl}/disburse/submit`,
        payload,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.response_code === "00") {
        logger.info("PayDunya withdrawal successful:", {
          token: response.data.disburse_token,
          reference: payload.reference,
        });

        return {
          success: true,
          token: response.data.disburse_token,
          reference: payload.reference,
          status: "processing", // PayDunya disburse initially returns processing status
          message: response.data.response_text,
        };
      } else {
        logger.error("PayDunya withdrawal failed:", response.data);
        throw new Error(
          response.data.response_text || "PayDunya withdrawal failed"
        );
      }
    } catch (error) {
      logger.error("Error initiating PayDunya withdrawal:", error);
      throw error;
    }
  }

  /**
   * Check the status of a withdrawal
   * @param {string} token - Disburse token from initiateWithdrawal response
   * @returns {Promise<Object>} Status response
   */
  async checkWithdrawalStatus(token) {
    try {
      if (!token) {
        throw new Error("Disburse token is required");
      }

      logger.info(`Checking PayDunya withdrawal status for token: ${token}`);

      const response = await axios.get(
        `${this.apiBaseUrl}/disburse/status/${token}`,
        { headers: this.getAuthHeaders() }
      );

      if (response.data) {
        const status = response.data.status || "unknown";
        logger.info(`PayDunya withdrawal status: ${status}`);

        return {
          success: true,
          token: token,
          status: status,
          data: response.data,
        };
      } else {
        throw new Error("Invalid response from PayDunya status check");
      }
    } catch (error) {
      logger.error("Error checking PayDunya withdrawal status:", error);
      throw error;
    }
  }

  /**
   * Cancel a pending withdrawal
   * @param {string} token - Disburse token from initiateWithdrawal response
   * @returns {Promise<Object>} Cancellation response
   */
  async cancelWithdrawal(token) {
    try {
      if (!token) {
        throw new Error("Disburse token is required");
      }

      logger.info(`Cancelling PayDunya withdrawal with token: ${token}`);

      const response = await axios.post(
        `${this.apiBaseUrl}/disburse/cancel/${token}`,
        {},
        { headers: this.getAuthHeaders() }
      );

      if (response.data.response_code === "00") {
        logger.info("PayDunya withdrawal cancelled successfully");
        return {
          success: true,
          token: token,
          message: response.data.response_text,
        };
      } else {
        logger.error("PayDunya withdrawal cancellation failed:", response.data);
        throw new Error(response.data.response_text || "Cancellation failed");
      }
    } catch (error) {
      logger.error("Error cancelling PayDunya withdrawal:", error);
      throw error;
    }
  }

  /**
   * Get balance of PayDunya merchant account
   * @returns {Promise<Object>} Balance information
   */
  async getAccountBalance() {
    try {
      logger.info("Fetching PayDunya account balance");

      const response = await axios.get(`${this.apiBaseUrl}/merchant/balance`, {
        headers: this.getAuthHeaders(),
      });

      if (response.data.response_code === "00") {
        const balance = response.data.balance || 0;
        logger.info(`PayDunya account balance: ${balance} XOF`);

        return {
          success: true,
          balance: balance,
          currency: "XOF",
        };
      } else {
        logger.error("Failed to fetch PayDunya balance:", response.data);
        throw new Error(
          response.data.response_text || "Could not fetch balance"
        );
      }
    } catch (error) {
      logger.error("Error getting PayDunya account balance:", error);
      throw error;
    }
  }
}

module.exports = new PayDunyaPayoutService();

// backend/services/mockPayoutServices.js
const logger = require("../utils/logger");
const currencyService = require("./currencyService");

/**
 * Mock service for testing payouts across all payment gateways
 * This allows for testing without making actual API calls
 */
class MockPayoutServices {
  constructor() {
    // Mock database for tracking test payouts
    this.mockPayouts = [];
    this.mockWithdrawals = [];
    this.mockTransfers = [];

    // Mock account balances
    this.accountBalances = {
      Paystack: 1000000, // NGN
      PayDunya: 500000, // XOF
      OrangeMoney: 750000, // XOF
    };

    // Simulated processing time in milliseconds (for async operations)
    this.processingDelay = 1000;

    // Transaction success rate (0.0 to 1.0) - for simulating failures
    this.successRate = 0.9;

    // ID counter for mock transactions
    this.idCounter = 1000;

    logger.info("MockPayoutServices initialized");
  }

  /**
   * Generate a unique mock transaction ID
   * @returns {string} Generated transaction ID
   */
  generateId(prefix = "MOCK") {
    return `${prefix}-${this.idCounter++}-${Date.now().toString(36)}`;
  }

  /**
   * Simulate processing delay with random success/failure
   * @returns {Promise<boolean>} Success or failure
   */
  async simulateProcessing() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate success/failure based on success rate
        const isSuccessful = Math.random() < this.successRate;
        resolve(isSuccessful);
      }, this.processingDelay);
    });
  }

  /**
   * Mock Paystack transfer
   * @param {Object} payoutData - Payout data
   * @returns {Promise<Object>} Transfer response
   */
  async mockPaystackTransfer(payoutData) {
    try {
      logger.info("Mocking Paystack transfer:", {
        amount: payoutData.amount,
        recipient: payoutData.recipientCode || "N/A",
      });

      const isSuccessful = await this.simulateProcessing();

      if (!isSuccessful) {
        logger.warn("Simulated Paystack transfer failure");
        throw new Error("Simulated transaction failure");
      }

      // Create mock transfer record
      const transfer = {
        id: this.generateId("PST"),
        amount: payoutData.amount,
        recipient: payoutData.recipientCode || "MOCK_RECIPIENT",
        reference: payoutData.reference || `ref-${Date.now()}`,
        currency: "NGN",
        status: "processing",
        createdAt: new Date(),
        resolveAfter: new Date(Date.now() + 60000), // Resolve after 1 minute
        metadata: payoutData.metadata || {},
      };

      // Update mock database
      this.mockTransfers.push(transfer);
      this.accountBalances.Paystack -= payoutData.amount;

      logger.info(`Mock Paystack transfer created: ${transfer.id}`);

      return {
        status: true,
        data: {
          id: transfer.id,
          reference: transfer.reference,
          amount: transfer.amount,
          currency: transfer.currency,
          source: "balance",
          recipient: transfer.recipient,
          status: transfer.status,
          transfer_code: transfer.id,
          createdAt: transfer.createdAt,
        },
      };
    } catch (error) {
      logger.error("Mock Paystack transfer error:", error);
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  /**
   * Mock PayDunya withdrawal
   * @param {Object} payoutData - Payout data
   * @returns {Promise<Object>} Withdrawal response
   */
  async mockPayDunyaWithdrawal(payoutData) {
    try {
      let amount = payoutData.amount;

      // Convert from NGN to XOF if needed
      if (payoutData.currency === "NGN") {
        amount = currencyService.convertNGNtoXOF(amount);
      }

      logger.info("Mocking PayDunya withdrawal:", {
        amount: amount,
        phone: payoutData.vendorPhone,
      });

      const isSuccessful = await this.simulateProcessing();

      if (!isSuccessful) {
        logger.warn("Simulated PayDunya withdrawal failure");
        throw new Error("Simulated transaction failure");
      }

      // Create mock withdrawal record
      const withdrawal = {
        id: this.generateId("PDW"),
        token: `disburse-${Date.now()}`,
        amount: amount,
        phone: payoutData.vendorPhone,
        reference: payoutData.reference || `ref-${Date.now()}`,
        currency: "XOF",
        status: "processing",
        createdAt: new Date(),
        resolveAfter: new Date(Date.now() + 60000), // Resolve after 1 minute
        metadata: payoutData.metadata || {},
      };

      // Update mock database
      this.mockWithdrawals.push(withdrawal);
      this.accountBalances.PayDunya -= amount;

      logger.info(`Mock PayDunya withdrawal created: ${withdrawal.id}`);

      return {
        success: true,
        token: withdrawal.token,
        reference: withdrawal.reference,
        status: withdrawal.status,
        message: "Withdrawal initiated successfully",
      };
    } catch (error) {
      logger.error("Mock PayDunya withdrawal error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Mock Orange Money transfer
   * @param {Object} payoutData - Payout data
   * @returns {Promise<Object>} Transfer response
   */
  async mockOrangeMoneyTransfer(payoutData) {
    try {
      let amount = payoutData.amount;

      // Convert from NGN to XOF if needed
      if (payoutData.currency === "NGN") {
        amount = currencyService.convertNGNtoXOF(amount);
      }

      logger.info("Mocking Orange Money transfer:", {
        amount: amount,
        phone: payoutData.vendorPhone,
      });

      const isSuccessful = await this.simulateProcessing();

      if (!isSuccessful) {
        logger.warn("Simulated Orange Money transfer failure");
        throw new Error("Simulated transaction failure");
      }

      // Create mock payout record
      const payout = {
        id: this.generateId("OMT"),
        payoutId: `payout-${Date.now()}`,
        amount: amount,
        phone: payoutData.vendorPhone,
        reference: payoutData.reference || `ref-${Date.now()}`,
        currency: "XOF",
        status: "processing",
        createdAt: new Date(),
        resolveAfter: new Date(Date.now() + 60000), // Resolve after 1 minute
        metadata: payoutData.metadata || {},
      };

      // Update mock database
      this.mockPayouts.push(payout);
      this.accountBalances.OrangeMoney -= amount;

      logger.info(`Mock Orange Money transfer created: ${payout.id}`);

      return {
        success: true,
        payoutId: payout.payoutId,
        reference: payout.reference,
        status: payout.status,
        message: "Transfer initiated successfully",
      };
    } catch (error) {
      logger.error("Mock Orange Money transfer error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Check status of a Paystack transfer
   * @param {string} reference - Transfer reference
   * @returns {Promise<Object>} Status response
   */
  async checkPaystackTransferStatus(reference) {
    try {
      logger.info(`Checking mock Paystack transfer status: ${reference}`);

      const transfer = this.mockTransfers.find(
        (t) => t.reference === reference
      );

      if (!transfer) {
        return {
          status: false,
          message: "Transfer not found",
        };
      }

      // Check if transfer should be marked as successful based on resolveAfter time
      if (
        transfer.status === "processing" &&
        new Date() >= transfer.resolveAfter
      ) {
        transfer.status = "success";
        logger.info(`Mock Paystack transfer ${reference} marked as successful`);
      }

      return {
        status: true,
        data: {
          reference: transfer.reference,
          amount: transfer.amount,
          currency: transfer.currency,
          status: transfer.status,
          recipient: transfer.recipient,
          transfer_code: transfer.id,
          createdAt: transfer.createdAt,
        },
      };
    } catch (error) {
      logger.error("Error checking mock Paystack transfer status:", error);
      return {
        status: false,
        message: error.message,
      };
    }
  }

  /**
   * Check status of a PayDunya withdrawal
   * @param {string} token - Withdrawal token
   * @returns {Promise<Object>} Status response
   */
  async checkPayDunyaWithdrawalStatus(token) {
    try {
      logger.info(`Checking mock PayDunya withdrawal status: ${token}`);

      const withdrawal = this.mockWithdrawals.find((w) => w.token === token);

      if (!withdrawal) {
        return {
          success: false,
          message: "Withdrawal not found",
        };
      }

      // Check if withdrawal should be marked as successful based on resolveAfter time
      if (
        withdrawal.status === "processing" &&
        new Date() >= withdrawal.resolveAfter
      ) {
        withdrawal.status = "completed";
        logger.info(`Mock PayDunya withdrawal ${token} marked as completed`);
      }

      return {
        success: true,
        token: withdrawal.token,
        status: withdrawal.status,
        data: {
          reference: withdrawal.reference,
          amount: withdrawal.amount,
          currency: withdrawal.currency,
          account_alias: withdrawal.phone,
          status: withdrawal.status,
          created_at: withdrawal.createdAt,
        },
      };
    } catch (error) {
      logger.error("Error checking mock PayDunya withdrawal status:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Check status of an Orange Money transfer
   * @param {string} payoutId - Payout ID
   * @returns {Promise<Object>} Status response
   */
  async checkOrangeMoneyTransferStatus(payoutId) {
    try {
      logger.info(`Checking mock Orange Money transfer status: ${payoutId}`);

      const payout = this.mockPayouts.find((p) => p.payoutId === payoutId);

      if (!payout) {
        return {
          success: false,
          message: "Transfer not found",
        };
      }

      // Check if payout should be marked as successful based on resolveAfter time
      if (payout.status === "processing" && new Date() >= payout.resolveAfter) {
        payout.status = "SUCCESS";
        logger.info(
          `Mock Orange Money transfer ${payoutId} marked as successful`
        );
      }

      return {
        success: true,
        payoutId: payout.payoutId,
        status: payout.status,
        data: {
          reference: payout.reference,
          amount: payout.amount,
          currency: payout.currency,
          phone_number: payout.phone,
          status: payout.status,
          created_at: payout.createdAt,
        },
      };
    } catch (error) {
      logger.error("Error checking mock Orange Money transfer status:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get mock account balance
   * @param {string} provider - Payment provider (Paystack, PayDunya, OrangeMoney)
   * @returns {Promise<Object>} Balance info
   */
  async getMockBalance(provider) {
    try {
      if (!this.accountBalances[provider]) {
        throw new Error(`Unknown provider: ${provider}`);
      }

      const balance = this.accountBalances[provider];
      const currency = provider === "Paystack" ? "NGN" : "XOF";

      logger.info(`Mock balance for ${provider}: ${balance} ${currency}`);

      return {
        success: true,
        balance: balance,
        currency: currency,
        provider: provider,
      };
    } catch (error) {
      logger.error(`Error getting mock balance for ${provider}:`, error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Reset all mock data (for testing)
   */
  resetMockData() {
    this.mockPayouts = [];
    this.mockWithdrawals = [];
    this.mockTransfers = [];

    this.accountBalances = {
      Paystack: 1000000,
      PayDunya: 500000,
      OrangeMoney: 750000,
    };

    this.idCounter = 1000;

    logger.info("Mock payout data reset");
  }

  /**
   * Get all mock transactions (for testing and verification)
   * @returns {Object} All mock transaction data
   */
  getAllMockTransactions() {
    return {
      paystack: this.mockTransfers,
      paydunya: this.mockWithdrawals,
      orangemoney: this.mockPayouts,
      balances: this.accountBalances,
    };
  }
}

module.exports = new MockPayoutServices();

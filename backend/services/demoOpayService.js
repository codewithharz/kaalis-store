// backend/services/demoOpayService.js
const logger = require("../utils/logger");
const Order = require("../models/orderModels");

class DemoOpayService {
  constructor() {
    this.mockTransactions = new Map();
    this.mockTransfers = new Map();

    logger.info("DemoOpayService initialized - All requests will be simulated");
  }

  /**
   * Simulate Opay transaction initialization
   */
  async initializeTransaction(paymentData) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const order = await Order.findById(paymentData.metadata.orderId);
          if (!order) throw new Error("Order not found");

          const reference = `DEMO-OPAY-${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}`;

          const orderNo = `ORD-${Date.now()}`;

          // Store mock transaction
          this.mockTransactions.set(reference, {
            reference,
            orderNo,
            status: "PENDING",
            amount: order.totalAmount,
            email: paymentData.email || order.user?.email,
            createdAt: new Date(),
            orderId: order._id,
          });

          logger.info("Demo Opay transaction initialized:", {
            reference,
            orderNo,
            amount: order.totalAmount,
          });

          resolve({
            status: true,
            data: {
              authorization_url: `http://localhost:7788/demo/opay/pay?reference=${reference}`,
              reference: reference,
              orderNo: orderNo,
            },
          });
        } catch (error) {
          logger.error("Demo Opay initialization error:", error);
          resolve({
            status: false,
            message: error.message,
          });
        }
      }, 500); // Simulate network delay
    });
  }

  /**
   * Simulate payment verification
   */
  async verifyTransaction(reference) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = this.mockTransactions.get(reference);

        if (!transaction) {
          resolve({
            status: false,
            message: "Transaction not found",
          });
          return;
        }

        // Auto-succeed after 2 seconds for demo
        const timeSinceCreation = Date.now() - transaction.createdAt.getTime();
        if (timeSinceCreation > 2000) {
          transaction.status = "SUCCESS";
        }

        logger.info("Demo Opay transaction verified:", {
          reference,
          status: transaction.status,
        });

        resolve({
          status: true,
          data: {
            reference: transaction.reference,
            status: transaction.status,
            amount: transaction.amount,
            paid_at:
              transaction.status === "SUCCESS"
                ? new Date().toISOString()
                : null,
          },
        });
      }, 500);
    });
  }

  /**
   * Simulate transfer initiation
   */
  async initiateTransfer(transferData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reference = `DEMO-TRF-${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}`;

        const orderNo = `TRF-ORD-${Date.now()}`;

        const transfer = {
          reference,
          orderNo,
          status: "SUCCESS",
          amount: transferData.amount,
          receiver: transferData.receiver,
          createdAt: new Date(),
        };

        this.mockTransfers.set(reference, transfer);

        logger.info("Demo Opay transfer initiated:", {
          reference,
          amount: transferData.amount,
          receiver: transferData.receiver.name,
        });

        resolve({
          status: true,
          data: transfer,
        });
      }, 800);
    });
  }

  /**
   * Simulate transfer status check
   */
  async checkTransferStatus(reference) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transfer = this.mockTransfers.get(reference);

        if (!transfer) {
          resolve({
            status: false,
            message: "Transfer not found",
          });
          return;
        }

        logger.info("Demo Opay transfer status checked:", {
          reference,
          status: transfer.status,
        });

        resolve({
          status: true,
          data: transfer,
        });
      }, 500);
    });
  }

  /**
   * Simulate bank account validation
   */
  async validateBankAccount(accountData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!/^\d{10}$/.test(accountData.accountNumber)) {
          resolve({
            status: false,
            message: "Account number must be 10 digits",
          });
          return;
        }

        const accountName = `DEMO ${accountData.accountNumber.slice(
          -4
        )} ACCOUNT`;

        logger.info("Demo Opay account validated:", {
          accountNumber: accountData.accountNumber,
          accountName,
        });

        resolve({
          status: true,
          data: {
            account_name: accountName,
            account_number: accountData.accountNumber,
            bank_code: accountData.bankCode,
          },
        });
      }, 800);
    });
  }

  /**
   * Simulate get balance
   */
  async getBalance() {
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info("Demo Opay balance fetched");

        resolve({
          status: true,
          data: {
            availableBalance: 1000000, // 10,000 NGN
            ledgerBalance: 1000000,
            currency: "NGN",
          },
        });
      }, 500);
    });
  }

  /**
   * Simulate get bank list
   */
  async getBankList() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const banks = [
          { code: "058", name: "Guaranty Trust Bank" },
          { code: "033", name: "United Bank for Africa" },
          { code: "044", name: "Access Bank" },
          { code: "050", name: "EcoBank" },
          { code: "011", name: "First Bank of Nigeria" },
          { code: "214", name: "First City Monument Bank" },
          { code: "070", name: "Fidelity Bank" },
          { code: "076", name: "Polaris Bank" },
          { code: "221", name: "Stanbic IBTC Bank" },
          { code: "232", name: "Sterling Bank" },
          { code: "035", name: "Wema Bank" },
          { code: "057", name: "Zenith Bank" },
        ];

        logger.info("Demo Opay bank list fetched:", { count: banks.length });

        resolve({
          status: true,
          data: banks,
        });
      }, 500);
    });
  }

  /**
   * Manually mark a transaction as successful (for testing)
   */
  markTransactionSuccess(reference) {
    const transaction = this.mockTransactions.get(reference);
    if (transaction) {
      transaction.status = "SUCCESS";
      logger.info(`Demo transaction ${reference} marked as SUCCESS`);
      return true;
    }
    return false;
  }

  /**
   * Get all mock data (for debugging)
   */
  getAllMockData() {
    return {
      transactions: Array.from(this.mockTransactions.values()),
      transfers: Array.from(this.mockTransfers.values()),
    };
  }

  /**
   * Reset all mock data
   */
  reset() {
    this.mockTransactions.clear();
    this.mockTransfers.clear();
    logger.info("Demo Opay service reset");
  }
}

module.exports = DemoOpayService;

// backend/services/payoutService.js
const logger = require("../utils/logger");
const PaystackService = require("./paystackService");
const OpayService = require("./opayService");
const PayDunyaPayoutService = require("./payDunyaPayoutService");
const OrangeMoneyPayoutService = require("./orangeMoneyPayoutService");
const MockPayoutServices = require("./mockPayoutServices");
const CurrencyService = require("./currencyService");

const VendorPayout = require("../models/vendorPayoutModels");
const User = require("../models/userModels");
const Order = require("../models/orderModels");
const payoutConfig = require("../config/payoutConfig");
const NotificationService = require("../services/notificationService");

class PayoutService {
  constructor() {
    // Initialize all payment gateway services
    this.paystackService = new PaystackService();
    this.opayService = new OpayService();
    this.payDunyaService = PayDunyaPayoutService;
    this.orangeMoneyService = OrangeMoneyPayoutService;
    this.mockService = MockPayoutServices;
    this.currencyService = CurrencyService;
    this.notificationService = new NotificationService();

    // Use mock services in test/development mode
    this.useMockServices =
      process.env.USE_MOCK_PAYMENTS === "true" ||
      process.env.NODE_ENV === "test";

    logger.info(
      `PayoutService initialized. Using mock services: ${this.useMockServices}`
    );
  }

  /**
   * Process all pending vendor payouts across all payment gateways
   */
  async processVendorPayouts() {
    logger.info("Starting automated payout processing");

    try {
      const pendingPayouts = await this.getPendingPayouts();
      const vendorPayouts = this.groupPayoutsByVendor(pendingPayouts);
      await this.processBatchPayouts(vendorPayouts);
      await this.cleanupOldPayouts();

      logger.info("Completed payout processing");
    } catch (error) {
      logger.error("Error in payout processing:", error);
      await this.sendAdminAlert("Payout Processing Error", error.message);
    }
  }

  /**
   * Get all pending payouts that are scheduled to be processed
   */
  async getPendingPayouts() {
    const payouts = await VendorPayout.find({
      status: "pending",
      scheduledDate: { $lte: new Date() },
    }).populate(
      "vendorId",
      "email paystack bankDetails currency paymentMethod"
    );

    logger.info(`Found ${payouts.length} pending payouts to process`);
    return payouts;
  }

  /**
   * Schedule a vendor payout based on order data and configured rules
   */
  async scheduleVendorPayout(vendorId, amount, orderData) {
    try {
      // Get vendor details
      const vendor = await User.findById(vendorId).select(
        "email paystack bankDetails currency paymentMethod countryCode"
      );

      if (!vendor) {
        throw new Error(`Vendor with ID ${vendorId} not found`);
      }

      const vendorTier = await this.getVendorTier(vendorId);
      const tierConfig = payoutConfig.schedules[vendorTier];

      // Determine currency and payment method
      const currency = vendor.currency || "NGN";
      const paymentMethod =
        vendor.paymentMethod || this.determinePaymentMethod(vendor);

      // Calculate scheduled date based on tier and holding period
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + tierConfig.holdingPeriod);

      // Check if there's an existing small payout to aggregate
      const existingPayout = await this.findExistingSmallPayout(vendorId);

      if (existingPayout) {
        return await this.aggregateWithExistingPayout(existingPayout, amount);
      }

      // Check if amount meets minimum threshold
      if (amount >= tierConfig.minimumAmount) {
        const payout = new VendorPayout({
          vendorId,
          amount,
          scheduledDate,
          status: "pending",
          tier: vendorTier,
          currency: currency,
          paymentMethod: paymentMethod,
          feeStructure: payoutConfig.fees[vendorTier],
          metadata: {
            orderId: orderData.orderId,
            customerEmail: orderData.customerEmail,
          },
        });

        await payout.save();

        // Send notification if enabled
        if (payoutConfig.notifications.notifyBeforePayout) {
          await this.notificationService.sendPayoutScheduledNotification(
            vendorId,
            {
              amount,
              scheduledDate,
              tier: vendorTier,
              currency: currency,
            }
          );
        }

        return payout;
      } else {
        // For small amounts, create aggregating payout
        return await this.createSmallPayout(
          vendorId,
          amount,
          tierConfig,
          currency,
          paymentMethod
        );
      }
    } catch (error) {
      logger.error("Error scheduling vendor payout:", error);
      throw error;
    }
  }

  /**
   * Find existing small payout for aggregation
   */
  async findExistingSmallPayout(vendorId) {
    return await VendorPayout.findOne({
      vendorId,
      status: "aggregating",
      amount: { $lt: payoutConfig.schedules.default.minimumAmount },
    });
  }

  /**
   * Aggregate new amount with existing small payout
   */
  async aggregateWithExistingPayout(existingPayout, newAmount) {
    const vendorTier = await this.getVendorTier(existingPayout.vendorId);
    const tierConfig = payoutConfig.schedules[vendorTier];

    existingPayout.amount += newAmount;

    // If total reaches minimum amount, schedule for payout
    if (existingPayout.amount >= tierConfig.minimumAmount) {
      existingPayout.status = "pending";
      existingPayout.scheduledDate = new Date();
      existingPayout.scheduledDate.setDate(
        existingPayout.scheduledDate.getDate() + tierConfig.holdingPeriod
      );
    }

    return await existingPayout.save();
  }

  /**
   * Create a small payout for later aggregation
   */
  async createSmallPayout(
    vendorId,
    amount,
    tierConfig,
    currency,
    paymentMethod
  ) {
    const payout = new VendorPayout({
      vendorId,
      amount,
      status: "aggregating",
      scheduledDate: new Date(),
      tier: await this.getVendorTier(vendorId),
      currency: currency || "NGN",
      paymentMethod: paymentMethod || "paystack",
      feeStructure: payoutConfig.fees[tierConfig],
    });

    return await payout.save();
  }

  /**
   * Group payouts by vendor for batch processing
   */
  groupPayoutsByVendor(payouts) {
    return payouts.reduce((acc, payout) => {
      const vendorId = payout.vendorId._id.toString();

      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendor: payout.vendorId,
          payouts: [],
          tier: payout.tier,
          currency: payout.currency || "NGN",
          paymentMethod: payout.paymentMethod || "paystack",
        };
      }

      acc[vendorId].payouts.push(payout);
      return acc;
    }, {});
  }

  /**
   * Process batches of payouts for all vendors
   */
  async processBatchPayouts(vendorPayouts) {
    for (const vendorId in vendorPayouts) {
      const vendorBatch = vendorPayouts[vendorId];
      const batchSize = payoutConfig.schedules[vendorBatch.tier].batchSize;

      // Split into smaller batches if needed
      for (let i = 0; i < vendorBatch.payouts.length; i += batchSize) {
        const batchPayouts = vendorBatch.payouts.slice(i, i + batchSize);
        await this.processVendorBatch(vendorId, {
          vendor: vendorBatch.vendor,
          payouts: batchPayouts,
          currency: vendorBatch.currency,
          paymentMethod: vendorBatch.paymentMethod,
        });
      }
    }
  }

  /**
   * Process a batch of payouts for a single vendor
   */
  async processVendorBatch(
    vendorId,
    { vendor, payouts, currency, paymentMethod }
  ) {
    // Determine payment method if not provided
    if (!paymentMethod) {
      paymentMethod = this.determinePaymentMethod(vendor);
    }

    // Check if vendor has required payment setup
    if (!this.hasValidPaymentSetup(vendor, paymentMethod)) {
      logger.warn(
        `Vendor ${vendorId} has no valid payment setup for ${paymentMethod}. Skipping payouts.`
      );
      await this.notifyVendorForPaymentSetup(vendorId, paymentMethod);
      return;
    }

    try {
      const results = {
        processed: 0,
        failed: 0,
        skipped: 0,
      };

      for (const payout of payouts) {
        try {
          // Process payout with appropriate service based on payment method
          const payoutResult = await this.processPayoutWithMethod(
            vendor,
            payout,
            paymentMethod,
            currency
          );

          if (payoutResult.success) {
            await this.updateSuccessfulPayout(payout, payoutResult);
            results.processed++;
          } else {
            await this.handleFailedPayout(
              payout,
              new Error(payoutResult.message || "Transfer failed")
            );
            results.failed++;
          }
        } catch (error) {
          await this.handleFailedPayout(payout, error);
          results.failed++;
        }
      }

      logger.info(`Batch processing results for vendor ${vendorId}:`, results);
      return results;
    } catch (error) {
      logger.error(`Error processing batch for vendor ${vendorId}:`, error);
      throw error;
    }
  }

  /**
   * Process payout with the appropriate payment method
   */
  async processPayoutWithMethod(vendor, payout, paymentMethod, currency) {
    try {
      switch (paymentMethod.toLowerCase()) {
        case "paystack":
          return await this.processPaystackPayout(vendor, payout);

        case "opay":
          return await this.processOpayPayout(vendor, payout);

        case "paydunya":
          return await this.processPayDunyaPayout(vendor, payout, currency);

        case "orangemoney":
          // Check if orange money service is disabled
          if (this.orangeMoneyService.isDisabled) {
            logger.warn(
              "Orange Money service is disabled, falling back to mock service"
            );
            // Force using mock service for Orange Money
            return await this.mockService.mockOrangeMoneyTransfer({
              amount: payout.amount,
              vendorPhone:
                vendor.bankDetails?.mobileNumber ||
                vendor.paystack?.phoneNumber,
              reference: `OM-${payout._id}`,
              currency: currency || "XOF",
            });
          }
          return await this.processOrangeMoneyPayout(vendor, payout, currency);

        default:
          throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }
    } catch (error) {
      logger.error(
        `Error processing payout with method ${paymentMethod}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Process payout via Paystack
   */
  async processPaystackPayout(vendor, payout) {
    try {
      if (!vendor.paystack?.recipientCode) {
        throw new Error(
          `No valid Paystack recipient code for vendor ${vendor._id}`
        );
      }

      const payoutData = {
        amount: Math.floor(payout.amount * 100), // Convert to kobo
        recipientCode: vendor.paystack.recipientCode,
        reference: `PAY-${payout._id}`,
        metadata: {
          payoutId: payout._id.toString(),
          vendorId: vendor._id.toString(),
        },
      };

      // Use mock or real service based on configuration
      const service = this.useMockServices
        ? this.mockService
        : this.paystackService;
      const method = this.useMockServices
        ? "mockPaystackTransfer"
        : "initiateTransfer";

      const transfer = await service[method](payoutData);

      if (!transfer || !transfer.status) {
        throw new Error("Paystack transfer failed");
      }

      return {
        success: true,
        reference: transfer.data.reference,
        transferCode: transfer.data.transfer_code,
        status: transfer.data.status,
        amount: payout.amount,
      };
    } catch (error) {
      logger.error(`Paystack transfer failed for payout ${payout._id}:`, error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Process payout via Opay
   */
  async processOpayPayout(vendor, payout) {
    try {
      if (!vendor.bankDetails?.accountNumber || !vendor.bankDetails?.bankCode) {
        throw new Error(`No valid bank details for vendor ${vendor._id}`);
      }

      const transferData = {
        amount: payout.amount,
        receiver: {
          name: `${vendor.firstName} ${vendor.lastName}`,
          accountNumber: vendor.bankDetails.accountNumber,
          bankCode: vendor.bankDetails.bankCode,
        },
        reason: `Vendor payout for order`,
      };

      // Use mock or real service based on configuration
      const service = this.useMockServices
        ? this.mockService
        : this.opayService;

      let transfer;

      if (this.useMockServices) {
        // Create a mock Opay transfer
        transfer = {
          status: true,
          data: {
            reference: `OPAY-MOCK-${Date.now()}`,
            orderNo: `ORD-${Date.now()}`,
            status: "SUCCESS",
            amount: payout.amount,
          },
        };

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        transfer = await service.initiateTransfer(transferData);
      }

      if (!transfer || !transfer.status) {
        throw new Error("Opay transfer failed");
      }

      return {
        success: true,
        reference: transfer.data.reference,
        orderNo: transfer.data.orderNo,
        status: transfer.data.status,
        amount: payout.amount,
      };
    } catch (error) {
      logger.error(`Opay transfer failed for payout ${payout._id}:`, error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Process payout via PayDunya
   */
  async processPayDunyaPayout(vendor, payout, currency) {
    try {
      // Validate vendor has phone number for PayDunya
      if (!vendor.bankDetails?.mobileNumber && !vendor.paystack?.phoneNumber) {
        throw new Error(`No valid phone number for vendor ${vendor._id}`);
      }

      const vendorPhone =
        vendor.bankDetails?.mobileNumber || vendor.paystack?.phoneNumber;

      // Convert amount if needed
      let amount = payout.amount;
      if (currency === "NGN") {
        amount = this.currencyService.convertNGNtoXOF(amount);
      }

      const payoutData = {
        amount: amount,
        vendorPhone: vendorPhone,
        vendorEmail: vendor.email,
        reference: `PDW-${payout._id}`,
        vendorName: `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim(),
        currency: "XOF",
        description: `Vendor payout for ${payout._id}`,
      };

      // Use mock or real service based on configuration
      const service = this.useMockServices
        ? this.mockService
        : this.payDunyaService;
      const method = this.useMockServices
        ? "mockPayDunyaWithdrawal"
        : "initiateWithdrawal";

      const withdrawal = await service[method](payoutData);

      if (!withdrawal || !withdrawal.success) {
        throw new Error(withdrawal?.message || "PayDunya withdrawal failed");
      }

      return {
        success: true,
        token: withdrawal.token,
        reference: withdrawal.reference,
        status: withdrawal.status,
        amount: payout.amount,
      };
    } catch (error) {
      logger.error(
        `PayDunya withdrawal failed for payout ${payout._id}:`,
        error
      );
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Process payout via Orange Money
   */
  async processOrangeMoneyPayout(vendor, payout, currency) {
    try {
      // Validate vendor has phone number for Orange Money
      if (!vendor.bankDetails?.mobileNumber && !vendor.paystack?.phoneNumber) {
        throw new Error(`No valid phone number for vendor ${vendor._id}`);
      }

      const vendorPhone =
        vendor.bankDetails?.mobileNumber || vendor.paystack?.phoneNumber;

      // Convert amount if needed
      let amount = payout.amount;
      if (currency === "NGN") {
        amount = this.currencyService.convertNGNtoXOF(amount);
      }

      const payoutData = {
        amount: amount,
        vendorPhone: vendorPhone,
        reference: `OM-${payout._id}`,
        currency: "XOF",
        description: `Vendor payout for ${payout._id}`,
      };

      // Use mock or real service based on configuration
      const service = this.useMockServices
        ? this.mockService
        : this.orangeMoneyService;
      const method = this.useMockServices
        ? "mockOrangeMoneyTransfer"
        : "initiateTransfer";

      const transfer = await service[method](payoutData);

      if (!transfer || !transfer.success) {
        throw new Error(transfer?.message || "Orange Money transfer failed");
      }

      return {
        success: true,
        payoutId: transfer.payoutId,
        reference: transfer.reference,
        status: transfer.status,
        amount: payout.amount,
      };
    } catch (error) {
      logger.error(
        `Orange Money transfer failed for payout ${payout._id}:`,
        error
      );
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Determine payment method based on vendor info
   * Updated to include Opay
   */
  determinePaymentMethod(vendor) {
    // Use explicit setting if available
    if (vendor.paymentMethod) {
      return vendor.paymentMethod;
    }

    // Determine by currency and available payment setup
    if (vendor.currency === "XOF") {
      // For XOF, prefer PayDunya if vendor has mobile money
      if (vendor.bankDetails?.mobileNumber) {
        return "PayDunya";
      }
      return "OrangeMoney";
    }

    // For NGN currency, check which setup is available
    if (vendor.paystack?.recipientCode) {
      return "Paystack";
    }

    if (vendor.bankDetails?.accountNumber && vendor.bankDetails?.bankCode) {
      return "Opay";
    }

    // Default to Paystack
    return "Paystack";
  }

  /**
   * Check Opay transfer status
   */
  async checkOpayStatus(reference) {
    const service = this.useMockServices ? this.mockService : this.opayService;

    try {
      let result;

      if (this.useMockServices) {
        // Mock status check
        result = {
          status: true,
          data: {
            status: "SUCCESS",
            reference: reference,
          },
        };
      } else {
        result = await service.checkTransferStatus(reference);
      }

      if (result.status && result.data) {
        // Map Opay status to our internal status
        let status = "processing";
        if (
          result.data.status === "SUCCESS" ||
          result.data.status === "SUCCESSFUL"
        ) {
          status = "processed";
        } else if (result.data.status === "FAILED") {
          status = "failed";
        }

        return {
          success: true,
          status: status,
          reference: reference,
          details: result.data,
        };
      } else {
        return {
          success: false,
          message: "Failed to verify transfer status",
        };
      }
    } catch (error) {
      logger.error(`Error checking Opay status for ${reference}:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Check if vendor has valid payment setup for the specified method
   * Updated to include Opay
   */
  hasValidPaymentSetup(vendor, paymentMethod) {
    switch (paymentMethod.toLowerCase()) {
      case "paystack":
        return !!(vendor.paystack && vendor.paystack.recipientCode);

      case "opay":
        return !!(
          vendor.bankDetails?.accountNumber && vendor.bankDetails?.bankCode
        );

      case "paydunya":
      case "orangemoney":
        return !!(
          vendor.bankDetails?.mobileNumber || vendor.paystack?.phoneNumber
        );

      default:
        return false;
    }
  }

  /**
   * Update payout record after successful transfer initiation
   */
  async updateSuccessfulPayout(payout, payoutResult) {
    try {
      const updateData = {
        status: "processing",
        transferReference:
          payoutResult.reference || payoutResult.token || payoutResult.payoutId,
        lastProcessedAt: new Date(),
      };

      if (payoutResult.transferCode) {
        updateData.transactionReference = payoutResult.transferCode;
      }

      await VendorPayout.findByIdAndUpdate(payout._id, updateData);

      // Update order payment status if orderId exists
      if (payout.orderId) {
        await Order.findByIdAndUpdate(payout.orderId, {
          payoutStatus: "processed",
          lastPayoutDate: new Date(),
          lastPayoutId: payout._id,
        });
      }

      // Update vendor stats
      await this.updateVendorStats(payout.vendorId);

      logger.info(`Successfully updated payout record ${payout._id}`);
    } catch (error) {
      logger.error(`Error updating payout record ${payout._id}:`, error);
      throw error;
    }
  }

  /**
   * Update vendor stats after successful payout
   */
  async updateVendorStats(vendorId) {
    await User.findByIdAndUpdate(vendorId, {
      $inc: {
        "paystack.totalPayouts": 1,
        monthlyPayoutCount: 1,
      },
      $set: { "paystack.lastPayout": new Date() },
    });
  }

  /**
   * Handle failed payouts with retry logic
   */
  async handleFailedPayout(payout, error) {
    try {
      const retryConfig = payoutConfig.retryStrategy;
      const shouldRetry = payout.retriesCount < retryConfig.maxAttempts;

      const update = {
        status: shouldRetry ? "pending" : "failed",
        errorMessage: error.message,
        $inc: { retriesCount: 1 },
      };

      if (shouldRetry) {
        const delayHours = retryConfig.delays[payout.retriesCount];
        update.scheduledDate = new Date(
          Date.now() + delayHours * 60 * 60 * 1000
        );
      }

      await VendorPayout.findByIdAndUpdate(payout._id, update);

      if (shouldRetry && payoutConfig.notifications.notifyOnFailure) {
        await this.notificationService.sendPayoutFailureNotification(
          payout.vendorId,
          {
            amount: payout.amount,
            nextRetry: update.scheduledDate,
            error: error.message,
          }
        );
      }

      logger.info(`Updated failed payout ${payout._id}, retry: ${shouldRetry}`);
    } catch (updateError) {
      logger.error(`Error updating failed payout ${payout._id}:`, updateError);
    }
  }

  /**
   * Send notification to vendor about missing payment setup
   */
  async notifyVendorForPaymentSetup(vendorId, paymentMethod) {
    try {
      await this.notificationService.sendPaymentSetupReminder(
        vendorId,
        paymentMethod
      );
      logger.info(
        `Sent ${paymentMethod} payment setup reminder to vendor ${vendorId}`
      );
    } catch (error) {
      logger.error(
        `Failed to send payment setup reminder to vendor ${vendorId}:`,
        error
      );
    }
  }

  /**
   * Generate payout summary report
   */
  async generatePayoutSummary(results) {
    const summary = {
      totalProcessed: results.length,
      successful: results.filter((r) => r.status === "fulfilled").length,
      failed: results.filter((r) => r.status === "rejected").length,
      totalAmount: results.reduce(
        (sum, r) => (r.status === "fulfilled" ? sum + r.value.amount : sum),
        0
      ),
    };

    logger.info("Payout processing summary:", summary);
    return summary;
  }

  /**
   * Clean up old processed payouts (data retention)
   */
  async cleanupOldPayouts() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await VendorPayout.deleteMany({
      status: "processed",
      processedAt: { $lt: thirtyDaysAgo },
    });

    logger.info(`Cleaned up ${result.deletedCount} old processed payouts`);
  }

  /**
   * Send alert to admin about payout errors
   */
  async sendAdminAlert(subject, message) {
    try {
      logger.error(`Admin Alert - ${subject}: ${message}`);
      await this.notificationService.sendAdminAlert(subject, message);
    } catch (error) {
      logger.error("Failed to send admin alert:", error);
    }
  }

  /**
   * Helper method for calculating vendor amounts
   */
  calculateVendorAmount(order, vendorTier = "default") {
    try {
      const totalAmount = order.totalAmount || 0;
      const vendorShare = payoutConfig.fees[vendorTier].vendorShare;
      const vendorAmount = totalAmount * vendorShare;

      return Math.floor(vendorAmount);
    } catch (error) {
      logger.error(
        `Error calculating vendor amount for order ${order._id}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Determine vendor tier based on volume and history
   */
  async getVendorTier(vendorId) {
    const vendor = await User.findById(vendorId).select(
      "monthlyVolume lastPayout"
    );

    // Calculate monthly volume and determine tier
    if (vendor?.monthlyVolume >= 1000000) {
      // 1 million threshold for premium
      return "premium";
    }
    return "default";
  }

  /**
   * Check status of a payout by ID and update if needed
   * Updated to include Opay
   */
  async checkPayoutStatus(payoutId) {
    try {
      const payout = await VendorPayout.findById(payoutId);
      if (!payout) {
        throw new Error(`Payout with ID ${payoutId} not found`);
      }

      if (payout.status !== "processing") {
        logger.info(
          `Payout ${payoutId} status is ${payout.status}, no status check needed`
        );
        return { status: payout.status };
      }

      // Get vendor details
      const vendor = await User.findById(payout.vendorId);
      if (!vendor) {
        throw new Error(`Vendor for payout ${payoutId} not found`);
      }

      const paymentMethod =
        payout.paymentMethod || this.determinePaymentMethod(vendor);
      let statusResult;

      // Check status with appropriate service
      switch (paymentMethod.toLowerCase()) {
        case "paystack":
          statusResult = await this.checkPaystackStatus(
            payout.transferReference
          );
          break;

        case "paydunya":
          statusResult = await this.checkPayDunyaStatus(
            payout.transferReference
          );
          break;

        case "orangemoney":
          statusResult = await this.checkOrangeMoneyStatus(
            payout.transferReference
          );
          break;

        case "opay":
          statusResult = await this.checkOpayStatus(payout.transferReference);
          break;

        default:
          throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }

      // Update status if necessary
      if (statusResult.success && statusResult.status !== payout.status) {
        await VendorPayout.findByIdAndUpdate(payoutId, {
          status:
            statusResult.status === "success" ||
              statusResult.status === "processed"
              ? "processed"
              : statusResult.status,
          processedAt:
            statusResult.status === "success" ||
              statusResult.status === "processed"
              ? new Date()
              : undefined,
        });

        logger.info(
          `Updated payout ${payoutId} status to ${statusResult.status}`
        );
      }

      return statusResult;
    } catch (error) {
      logger.error(`Error checking payout status for ${payoutId}:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Check Paystack transfer status
   */
  async checkPaystackStatus(reference) {
    const service = this.useMockServices
      ? this.mockService
      : this.paystackService;
    const method = this.useMockServices
      ? "checkPaystackTransferStatus"
      : "verifyTransaction";

    try {
      const result = await service[method](reference);

      if (result.status && result.data) {
        return {
          success: true,
          status: result.data.status,
          reference: reference,
          details: result.data,
        };
      } else {
        return {
          success: false,
          message: "Failed to verify transfer status",
        };
      }
    } catch (error) {
      logger.error(`Error checking Paystack status for ${reference}:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Check PayDunya withdrawal status
   */
  async checkPayDunyaStatus(token) {
    const service = this.useMockServices
      ? this.mockService
      : this.payDunyaService;
    const method = this.useMockServices
      ? "checkPayDunyaWithdrawalStatus"
      : "checkWithdrawalStatus";

    try {
      const result = await service[method](token);

      if (result.success) {
        // Map PayDunya status to our internal status
        let status = "processing";
        if (result.status === "completed") {
          status = "processed";
        } else if (result.status === "failed") {
          status = "failed";
        }

        return {
          success: true,
          status: status,
          reference: token,
          details: result.data,
        };
      } else {
        return {
          success: false,
          message: "Failed to verify withdrawal status",
        };
      }
    } catch (error) {
      logger.error(`Error checking PayDunya status for ${token}:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Check Orange Money transfer status
   */
  async checkOrangeMoneyStatus(payoutId) {
    const service = this.useMockServices
      ? this.mockService
      : this.orangeMoneyService;
    const method = this.useMockServices
      ? "checkOrangeMoneyTransferStatus"
      : "checkTransferStatus";

    try {
      const result = await service[method](payoutId);

      if (result.success) {
        // Map Orange Money status to our internal status
        let status = "processing";
        if (result.status === "SUCCESS") {
          status = "processed";
        } else if (result.status === "FAILED") {
          status = "failed";
        }

        return {
          success: true,
          status: status,
          reference: payoutId,
          details: result.data,
        };
      } else {
        return {
          success: false,
          message: "Failed to verify transfer status",
        };
      }
    } catch (error) {
      logger.error(
        `Error checking Orange Money status for ${payoutId}:`,
        error
      );
      return { success: false, message: error.message };
    }
  }

  /**
   * Get account balance for all payment methods
   * Updated to include Opay
   */
  async getAllBalances() {
    const balances = {};

    // Get Paystack balance
    try {
      const paystackService = this.useMockServices
        ? this.mockService
        : this.paystackService;
      const paystackBalance = await (this.useMockServices
        ? paystackService.getMockBalance("Paystack")
        : paystackService.getBalance());
      balances.paystack = paystackBalance;
    } catch (error) {
      logger.error("Error getting Paystack balance:", error);
      balances.paystack = { error: error.message };
    }

    // Get PayDunya balance
    try {
      const payDunyaService = this.useMockServices
        ? this.mockService
        : this.payDunyaService;
      const payDunyaBalance = await (this.useMockServices
        ? payDunyaService.getMockBalance("PayDunya")
        : payDunyaService.getAccountBalance());
      balances.paydunya = payDunyaBalance;
    } catch (error) {
      logger.error("Error getting PayDunya balance:", error);
      balances.paydunya = { error: error.message };
    }

    // Get Orange Money balance
    try {
      const orangeMoneyService = this.useMockServices
        ? this.mockService
        : this.orangeMoneyService;
      const orangeMoneyBalance = await (this.useMockServices
        ? orangeMoneyService.getMockBalance("OrangeMoney")
        : orangeMoneyService.getAccountBalance());
      balances.orangemoney = orangeMoneyBalance;
    } catch (error) {
      logger.error("Error getting Orange Money balance:", error);
      balances.orangemoney = { error: error.message };
    }

    // Get Opay balance
    try {
      const opayService = this.useMockServices
        ? this.mockService
        : this.opayService;

      if (this.useMockServices) {
        balances.opay = {
          success: true,
          balance: 1000000,
          currency: "NGN",
          provider: "Opay",
        };
      } else {
        const opayBalance = await opayService.getBalance();
        balances.opay = opayBalance;
      }
    } catch (error) {
      logger.error("Error getting Opay balance:", error);
      balances.opay = { error: error.message };
    }

    return balances;
  }
}

module.exports = new PayoutService();

// backend/services/payoutService.js
const axios = require("axios");
const logger = require("../utils/logger");
// Lazy load services to save resources
// const PaystackService = require("./paystackService");
// const OpayService = require("./opayService");
// const MockPayoutServices = require("./mockPayoutServices");
const CurrencyService = require("./currencyService");

const VendorPayout = require("../models/vendorPayoutModels");
const User = require("../models/userModels");
const Order = require("../models/orderModels");
const payoutConfig = require("../config/payoutConfig");
const NotificationService = require("../services/notificationService");

class PayoutService {
  constructor() {
    // Services are now lazy-loaded on demand
    this._paystackService = null;
    this._opayService = null;
    this._mockService = null;

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

  // Lazy getters for services
  get paystackService() {
    if (!this._paystackService) {
      const PaystackService = require("./paystackService");
      this._paystackService = new PaystackService();
    }
    return this._paystackService;
  }

  get opayService() {
    if (!this._opayService) {
      const OpayService = require("./opayService");
      this._opayService = new OpayService();
    }
    return this._opayService;
  }

  get mockService() {
    if (!this._mockService) {
      this._mockService = require("./mockPayoutServices");
    }
    return this._mockService;
  }

  /**
   * Process all pending vendor payouts across all payment gateways
   */
  async processVendorPayouts() {
    logger.info("Starting manual payout processing");

    try {
      const pendingPayouts = await this.getPendingPayouts();
      const vendorPayouts = this.groupPayoutsByVendor(pendingPayouts);
      const results = await this.processBatchPayouts(vendorPayouts);
      await this.cleanupOldPayouts();

      const summary = {
        readyPayouts: pendingPayouts.length,
        vendors: Object.keys(vendorPayouts).length,
        processed: results.reduce((sum, item) => sum + item.processed, 0),
        failed: results.reduce((sum, item) => sum + item.failed, 0),
        skipped: results.reduce((sum, item) => sum + item.skipped, 0),
        batches: results,
      };

      logger.info("Completed payout processing", summary);
      return summary;
    } catch (error) {
      logger.error("Error in payout processing:", error);
      await this.sendAdminAlert("Payout Processing Error", error.message);
      throw error;
    }
  }

  /**
   * Get all pending payouts that are scheduled to be processed
   */
  async getPendingPayouts() {
    const payouts = await VendorPayout.find({
      status: "pending",
      scheduledDate: { $lte: new Date() },
      paymentMethod: { $in: ["Paystack", "paystack", "OPay", "Opay", "opay", "AfriExchange", "afriexchange"] },
    }).populate(
      "vendorId",
      "email paystack bankDetails afriExchange currency paymentMethod"
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
        "email paystack bankDetails afriExchange currency paymentMethod countryCode"
      );

      if (!vendor) {
        throw new Error(`Vendor with ID ${vendorId} not found`);
      }

      const vendorTier = await this.getVendorTier(vendorId);
      const tierConfig = payoutConfig.schedules[vendorTier];

      // Determine currency and payment method
      const currency = orderData.currency || vendor.currency || "NGN";
      const paymentMethod =
        orderData.paymentMethod ||
        vendor.paymentMethod ||
        this.determinePaymentMethod(vendor);

      // Calculate scheduled date based on tier and holding period
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + tierConfig.holdingPeriod);

      // Check if there's an existing small payout to aggregate
      const existingPayout = await this.findExistingSmallPayout(
        vendorId,
        currency,
        paymentMethod
      );

      if (existingPayout) {
        return await this.aggregateWithExistingPayout(existingPayout, amount);
      }

      // Check if amount meets minimum threshold
      if (amount >= tierConfig.minimumAmount) {
        const payout = new VendorPayout({
          vendorId,
          orderId: orderData.orderId,
          paymentId: orderData.paymentId,
          amount,
          scheduledDate,
          status: "pending",
          tier: vendorTier,
          currency: currency,
          paymentMethod: paymentMethod,
          feeStructure: payoutConfig.fees[vendorTier],
          metadata: {
            orderId: orderData.orderId,
            kaalisOrderId: orderData.kaalisOrderId,
            customerEmail: orderData.customerEmail,
            reference: orderData.reference,
          },
        });

        await payout.save();

        // Send notification if enabled
        if (
          payoutConfig.notifications.notifyBeforePayout &&
          typeof this.notificationService.sendPayoutScheduledNotification ===
            "function"
        ) {
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
          paymentMethod,
          orderData
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
  async findExistingSmallPayout(vendorId, currency, paymentMethod) {
    return await VendorPayout.findOne({
      vendorId,
      currency,
      paymentMethod,
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
    paymentMethod,
    orderData = {}
  ) {
    const payout = new VendorPayout({
      vendorId,
      orderId: orderData.orderId,
      paymentId: orderData.paymentId,
      amount,
      status: "aggregating",
      scheduledDate: new Date(),
      tier: await this.getVendorTier(vendorId),
      currency: currency || "NGN",
      paymentMethod: paymentMethod || "paystack",
      feeStructure: payoutConfig.fees[await this.getVendorTier(vendorId)],
      metadata: {
        orderId: orderData.orderId,
        kaalisOrderId: orderData.kaalisOrderId,
        customerEmail: orderData.customerEmail,
        reference: orderData.reference,
      },
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
          tier: payout.tier || "default",
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
    const results = [];

    for (const vendorId in vendorPayouts) {
      const vendorBatch = vendorPayouts[vendorId];
      const resolvedTier =
        vendorBatch.tier && payoutConfig.schedules[vendorBatch.tier]
          ? vendorBatch.tier
          : await this.getVendorTier(vendorId);
      const tierConfig =
        payoutConfig.schedules[resolvedTier] || payoutConfig.schedules.default;
      const batchSize =
        tierConfig.batchSize || payoutConfig.schedules.default.batchSize;

      // Split into smaller batches if needed
      for (let i = 0; i < vendorBatch.payouts.length; i += batchSize) {
        const batchPayouts = vendorBatch.payouts.slice(i, i + batchSize);
        const result = await this.processVendorBatch(vendorId, {
          vendor: vendorBatch.vendor,
          payouts: batchPayouts,
          currency: vendorBatch.currency,
          paymentMethod: vendorBatch.paymentMethod,
        });

        results.push({
          vendorId,
          tier: resolvedTier,
          currency: vendorBatch.currency,
          paymentMethod: vendorBatch.paymentMethod,
          payoutCount: batchPayouts.length,
          ...result,
        });
      }
    }

    return results;
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
      return {
        processed: 0,
        failed: 0,
        skipped: payouts.length,
      };
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

        case "afriexchange":
          return await this.processAfriExchangePayout(vendor, payout, currency);

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
   * Process payout via AfriExchange.
   * The actual API call is added in the AfriExchange integration phase.
   */
  async processAfriExchangePayout(vendor, payout, currency) {
    try {
      if (
        !vendor.afriExchange?.userId &&
        !vendor.afriExchange?.walletAddress &&
        !vendor.afriExchange?.accountEmail
      ) {
        throw new Error(`No linked AfriExchange account for vendor ${vendor._id}`);
      }

      const baseUrl = process.env.AFRIEXCHANGE_API_URL;
      const apiKey = process.env.AFRIEXCHANGE_KAALIS_API_KEY;

      if (!baseUrl || !apiKey) {
        return {
          success: false,
          message:
            "AfriExchange payout API is not configured. Set AFRIEXCHANGE_API_URL and AFRIEXCHANGE_KAALIS_API_KEY.",
        };
      }

      const idempotencyKey = `kaalis-payout-${payout._id}`;
      const response = await axios.post(
        `${baseUrl.replace(/\/$/, "")}/integrations/kaalis/payouts`,
        {
          idempotencyKey,
          kaalisPayoutId: payout._id.toString(),
          kaalisVendorId: vendor._id.toString(),
          vendorAfriExchangeUserId: vendor.afriExchange?.userId,
          vendorWalletAddress: vendor.afriExchange?.walletAddress,
          vendorAccountEmail: vendor.afriExchange?.accountEmail,
          amount: payout.amount,
          tokenType: "CT",
          country: vendor.countryCode,
          description: `Kaalis vendor settlement for payout ${payout._id}`,
          metadata: {
            orderId: payout.orderId?.toString(),
            currency: currency || payout.currency || "XOF",
          },
        },
        {
          headers: {
            "x-kaalis-api-key": apiKey,
          },
          timeout: 15000,
        }
      );

      const data = response.data?.data;

      return {
        success: !!response.data?.success,
        reference: data?.reference,
        payoutId: data?.payoutId,
        status: data?.status,
        amount: payout.amount,
      };
    } catch (error) {
      logger.error(
        `AfriExchange payout failed for payout ${payout._id}:`,
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
      return "AfriExchange";
    }

    // For NGN currency, check which setup is available
    if (vendor.paystack?.recipientCode) {
      return "Paystack";
    }

    if (vendor.bankDetails?.accountNumber && vendor.bankDetails?.bankCode) {
      return "OPay";
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

      case "afriexchange":
        return !!(
          vendor.afriExchange?.userId ||
          vendor.afriExchange?.walletAddress ||
          vendor.afriExchange?.accountEmail
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
        status:
          payoutResult.status === "completed" ||
          payoutResult.status === "processed"
            ? "processed"
            : "processing",
        transferReference:
          payoutResult.reference || payoutResult.token || payoutResult.payoutId,
        providerPayoutId: payoutResult.payoutId,
        providerStatus: payoutResult.status,
        lastProcessedAt: new Date(),
        lastStatusCheckedAt: new Date(),
      };

      if (updateData.status === "processed") {
        updateData.processedAt = new Date();
      }

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

  mapProviderPayoutStatus(providerStatus) {
    const normalized = String(providerStatus || "").toLowerCase();

    if (["success", "successful", "completed", "complete", "processed"].includes(normalized)) {
      return "processed";
    }

    if (["failed", "failure", "cancelled", "canceled", "reversed"].includes(normalized)) {
      return "failed";
    }

    if (["processing", "in_progress", "pending_provider", "queued"].includes(normalized)) {
      return "processing";
    }

    if (normalized === "pending") {
      return "pending";
    }

    return normalized || "processing";
  }

  async applyAfriExchangePayoutUpdate(payload = {}) {
    const data = payload.data || payload;
    const eventId = payload.eventId || payload.id || data.eventId || data.id;
    const providerStatus = data.status || payload.status;
    const mappedStatus = this.mapProviderPayoutStatus(providerStatus);
    const reference = data.reference || data.transferReference || data.providerReference;
    const providerPayoutId = data.payoutId || data.providerPayoutId || data.afriExchangePayoutId;
    const kaalisPayoutId = data.kaalisPayoutId || data.payout_id || payload.kaalisPayoutId;

    const query = {};
    if (kaalisPayoutId && VendorPayout.db.base.Types.ObjectId.isValid(kaalisPayoutId)) {
      query._id = kaalisPayoutId;
    } else if (reference || providerPayoutId) {
      query.$or = [
        reference ? { transferReference: reference } : null,
        reference ? { transactionReference: reference } : null,
        providerPayoutId ? { providerPayoutId } : null,
        providerPayoutId ? { transferReference: providerPayoutId } : null,
      ].filter(Boolean);
    }

    if (!Object.keys(query).length) {
      return {
        success: false,
        message: "Webhook payload did not include a Kaalis payout id, provider reference, or provider payout id",
      };
    }

    const payout = await VendorPayout.findOne(query);
    if (!payout) {
      return {
        success: false,
        message: "Matching Kaalis payout not found",
      };
    }

    const seenEvents = payout.metadata?.afriExchangeWebhookEvents || [];
    if (eventId && seenEvents.includes(eventId)) {
      return {
        success: true,
        duplicate: true,
        payoutId: payout._id,
        status: payout.status,
      };
    }

    const update = {
      status: mappedStatus,
      providerStatus,
      lastStatusCheckedAt: new Date(),
      metadata: {
        ...(payout.metadata || {}),
        lastAfriExchangeWebhook: {
          event: payload.event || payload.type,
          eventId,
          receivedAt: new Date(),
          status: providerStatus,
          reference,
          providerPayoutId,
        },
        afriExchangeWebhookEvents: eventId
          ? [...seenEvents.slice(-19), eventId]
          : seenEvents,
      },
    };

    if (reference) {
      update.transferReference = reference;
    }

    if (providerPayoutId) {
      update.providerPayoutId = providerPayoutId;
    }

    if (mappedStatus === "processed") {
      update.processedAt = payout.processedAt || new Date();
      update.errorMessage = undefined;
    }

    if (mappedStatus === "failed") {
      update.errorMessage =
        data.errorMessage || data.failureReason || payload.errorMessage || "AfriExchange payout failed";
    }

    const updated = await VendorPayout.findByIdAndUpdate(payout._id, update, {
      new: true,
    });

    if (updated.orderId && mappedStatus === "processed") {
      await Order.findByIdAndUpdate(updated.orderId, {
        payoutStatus: "processed",
        lastPayoutDate: updated.processedAt || new Date(),
        lastPayoutId: updated._id,
      });
    }

    if (mappedStatus === "processed" && payout.status !== "processed") {
      await this.updateVendorStats(updated.vendorId);
    }

    return {
      success: true,
      payoutId: updated._id,
      status: updated.status,
      providerStatus: updated.providerStatus,
    };
  }

  async reconcileAfriExchangePayouts({ limit = 50 } = {}) {
    const payouts = await VendorPayout.find({
      paymentMethod: { $in: ["AfriExchange", "afriexchange"] },
      status: { $in: ["processing"] },
      transferReference: { $exists: true, $ne: "" },
    })
      .sort({ lastStatusCheckedAt: 1, updatedAt: 1 })
      .limit(limit);

    const results = [];

    for (const payout of payouts) {
      const statusResult = await this.checkPayoutStatus(payout._id);
      results.push({
        payoutId: payout._id,
        reference: payout.transferReference,
        success: !!statusResult.success,
        status: statusResult.status || payout.status,
        message: statusResult.message,
      });
    }

    return {
      checked: payouts.length,
      updated: results.filter((item) => item.success).length,
      failed: results.filter((item) => !item.success).length,
      results,
    };
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
        if (
          typeof this.notificationService.sendPayoutFailureNotification ===
          "function"
        ) {
          await this.notificationService.sendPayoutFailureNotification(
            payout.vendorId,
            {
              amount: payout.amount,
              nextRetry: update.scheduledDate,
              error: error.message,
            }
          );
        } else {
          logger.warn(
            "Payout failure notification skipped: NotificationService.sendPayoutFailureNotification is not implemented"
          );
        }
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
      if (
        typeof this.notificationService.sendPaymentSetupReminder === "function"
      ) {
        await this.notificationService.sendPaymentSetupReminder(
          vendorId,
          paymentMethod
        );
        logger.info(
          `Sent ${paymentMethod} payment setup reminder to vendor ${vendorId}`
        );
      } else {
        logger.warn(
          `Payment setup reminder skipped for vendor ${vendorId}: NotificationService.sendPaymentSetupReminder is not implemented`
        );
      }
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
      if (typeof this.notificationService.sendAdminAlert === "function") {
        await this.notificationService.sendAdminAlert(subject, message);
      } else {
        logger.warn(
          "Admin alert skipped: NotificationService.sendAdminAlert is not implemented"
        );
      }
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

        case "afriexchange":
          statusResult = await this.checkAfriExchangeStatus(
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
      if (statusResult.success) {
        const mappedStatus = this.mapProviderPayoutStatus(statusResult.status);
        const update = {
          providerStatus: statusResult.status,
          lastStatusCheckedAt: new Date(),
          metadata: {
            ...(payout.metadata || {}),
            lastStatusCheck: {
              checkedAt: new Date(),
              provider: paymentMethod,
              status: statusResult.status,
              reference: statusResult.reference,
            },
          },
        };

        if (mappedStatus !== payout.status) {
          update.status = mappedStatus;
        }

        if (mappedStatus === "processed") {
          update.processedAt = payout.processedAt || new Date();
          update.errorMessage = undefined;
        }

        if (mappedStatus === "failed") {
          update.errorMessage = statusResult.message || "Provider payout failed";
        }

        await VendorPayout.findByIdAndUpdate(payoutId, update);

        if (mappedStatus === "processed" && payout.orderId) {
          await Order.findByIdAndUpdate(payout.orderId, {
            payoutStatus: "processed",
            lastPayoutDate: update.processedAt || new Date(),
            lastPayoutId: payout._id,
          });
        }

        if (mappedStatus === "processed" && payout.status !== "processed") {
          await this.updateVendorStats(payout.vendorId);
        }

        logger.info(
          `Checked payout ${payoutId} status: ${statusResult.status}`
        );
      } else {
        await VendorPayout.findByIdAndUpdate(payoutId, {
          lastStatusCheckedAt: new Date(),
          errorMessage: statusResult.message,
        });
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
   * Check AfriExchange payout status
   */
  async checkAfriExchangeStatus(reference) {
    const baseUrl = process.env.AFRIEXCHANGE_API_URL;
    const apiKey = process.env.AFRIEXCHANGE_KAALIS_API_KEY;

    if (!baseUrl || !apiKey) {
      return {
        success: false,
        message:
          "AfriExchange payout API is not configured. Set AFRIEXCHANGE_API_URL and AFRIEXCHANGE_KAALIS_API_KEY.",
      };
    }

    try {
      const response = await axios.get(
        `${baseUrl.replace(/\/$/, "")}/integrations/kaalis/payouts/${reference}`,
        {
          headers: {
            "x-kaalis-api-key": apiKey,
          },
          timeout: 15000,
        }
      );

      const data = response.data?.data;
      return {
        success: !!response.data?.success,
        status: data?.status === "completed" ? "processed" : data?.status,
        reference,
        details: data,
      };
    } catch (error) {
      logger.error(`Error checking AfriExchange status for ${reference}:`, error);
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

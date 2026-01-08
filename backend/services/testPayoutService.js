// services/testPayoutService.js
const mongoose = require("mongoose");

const logger = require("../utils/logger");
const Order = require("../models/orderModels");
const User = require("../models/userModels"); // Added User model import
const VendorPayout = require("../models/vendorPayoutModels");
const payoutConfig = require("../config/devPayoutConfig");
const PaystackService = require("./paystackService");

class TestPayoutService {
  constructor() {
    this.paystackService = new PaystackService();
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  async connectToDatabase() {
    try {
      // Set connection options with proper timeouts
      const options = {
        serverSelectionTimeoutMS: 5000, // Timeout for server selection
        connectTimeoutMS: 10000, // Timeout for initial connection
        socketTimeoutMS: 45000, // Timeout for operations
      };

      logger.info("Attempting database connection...");

      // Only connect if not already connected
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(
          process.env.MONGODB_URI || "mongodb://localhost:27017/kaalis",
          options
        );

        // Add connection event listeners
        mongoose.connection.on("connected", () => {
          logger.info("Successfully connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
          logger.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
          logger.warn("MongoDB disconnected");
        });
      }

      // Verify connection
      await mongoose.connection.db.admin().ping();
      logger.info("Database connection verified");

      return true;
    } catch (error) {
      logger.error("Failed to connect to database:", error.message);
      return false;
    }
  }

  // Function to check for eligible payouts every minute
  async startPayoutMonitoring() {
    try {
      // Attempt database connection first
      const connected = await this.connectToDatabase();
      if (!connected) {
        throw new Error("Unable to establish database connection");
      }

      // Add this line right here, after connection is verified
      await this.checkCurrentEligibleOrders();

      if (this.isMonitoring) {
        logger.warn("Payout monitoring is already running");
        return;
      }

      logger.info("Starting test payout monitoring");
      this.isMonitoring = true;

      // Initial check
      await this.checkForEligiblePayouts();

      // Set up interval
      this.monitoringInterval = setInterval(async () => {
        try {
          await this.checkForEligiblePayouts();
        } catch (error) {
          logger.error("Error in payout check:", error);
        }
      }, 60000);
    } catch (error) {
      this.isMonitoring = false;
      logger.error("Failed to start payout monitoring:", error);
      throw error;
    }
  }

  // Add this method inside your TestPayoutService class, right before the last closing brace
  async checkCurrentEligibleOrders() {
    try {
      // Find all delivered orders first
      const deliveredOrders = await Order.find({
        status: "Delivered",
      }).lean();

      logger.info(`Total delivered orders: ${deliveredOrders.length}`);

      // Find orders with Paystack payments
      const paystackOrders = await Order.find({
        status: "Delivered",
        transactionId: { $exists: true },
        paymentMethod: "Paystack",
      }).lean();

      logger.info(
        `Delivered orders with Paystack payments: ${paystackOrders.length}`
      );

      // Check orders within the wait time
      const minDeliveryTime = new Date();
      minDeliveryTime.setMinutes(
        minDeliveryTime.getMinutes() -
          payoutConfig.triggers.conditions.minWaitTime
      );

      const ordersWithinWaitTime = await Order.find({
        status: "Delivered",
        updatedAt: { $lte: minDeliveryTime },
      }).lean();

      logger.info(`Orders within wait time: ${ordersWithinWaitTime.length}`);

      // Log detailed info about each delivered order
      logger.info("Sample of delivered orders with calculations:");
      for (const order of deliveredOrders.slice(0, 3)) {
        const vendorAmount = this.calculateVendorAmount(order);
        logger.info(`
Order ID: ${order._id}
Status: ${order.status}
Updated At: ${order.updatedAt}
Transaction ID: ${order.transactionId || "Not set"}
Payment Method: ${order.paymentMethod}
Total Amount: ${order.totalAmount}
Calculated Vendor Amount: ${vendorAmount}
Payout Status: ${order.payoutStatus || "Not set"}
        `);
      }
    } catch (error) {
      logger.error("Error checking current eligible orders:", error);
    }
  }

  async stopPayoutMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    logger.info("Payout monitoring stopped");
  }

  async findEligibleOrders() {
    const minDeliveryTime = new Date();
    minDeliveryTime.setMinutes(
      minDeliveryTime.getMinutes() -
        payoutConfig.triggers.conditions.minWaitTime
    );

    // Updated query to match actual data structure
    const query = {
      status: "Delivered",
      payoutStatus: { $ne: "processed" },
      updatedAt: { $lte: minDeliveryTime },
      transactionId: { $exists: true },
      paymentMethod: "Paystack",
    };

    try {
      logger.info("Finding orders with query:", JSON.stringify(query, null, 2));

      const orders = await Order.find(query).lean();

      // Calculate vendor amount for each order using class method
      const processedOrders = orders.map((order) => ({
        ...order,
        vendorAmount: this.calculateVendorAmount(order),
      }));

      const eligibleOrders = processedOrders.filter(
        (order) => order.vendorAmount > 0
      );

      logger.info(
        `Found ${eligibleOrders.length} eligible orders with valid vendor amounts`
      );
      if (eligibleOrders.length > 0) {
        logger.info(
          "First eligible order example:",
          JSON.stringify(eligibleOrders[0], null, 2)
        );
      }
      return eligibleOrders;
    } catch (error) {
      logger.error("Error finding eligible orders:", error);
      if (mongoose.connection.readyState !== 1) {
        logger.warn("Database connection lost, attempting to reconnect...");
        const connected = await this.connectToDatabase();
        if (connected) {
          return this.findEligibleOrders();
        }
      }
      throw error;
    }
  }

  // Helper function to calculate vendor amount
  calculateVendorAmount(order) {
    try {
      const totalAmount = order.totalAmount || 0;
      const vendorTier = "default"; // Using default tier for now
      const vendorShare = payoutConfig.fees[vendorTier].vendorShare;

      // Calculate vendor amount (total minus platform fee)
      const vendorAmount = totalAmount * vendorShare;

      logger.info(
        `Calculated vendor amount for order ${order._id}: ${Math.floor(
          vendorAmount
        )}`
      );
      return Math.floor(vendorAmount); // Round down to ensure whole numbers
    } catch (error) {
      logger.error(
        `Error calculating vendor amount for order ${order._id}:`,
        error
      );
      return 0;
    }
  }

  async processEligibleOrders(orders) {
    const vendorPayouts = {};
    const vendorDetails = {};

    try {
      // First, get all unique vendor IDs
      const vendorIds = [...new Set(orders.map((order) => order.seller))];

      // Fetch all vendor details in one query
      const vendors = await User.find({
        _id: { $in: vendorIds },
      })
        .select("paystack bankDetails")
        .lean();

      // Create lookup map
      vendors.forEach((vendor) => {
        vendorDetails[vendor._id] = vendor;
      });

      // Group orders by vendor and validate vendor payment setup
      for (const order of orders) {
        const vendor = vendorDetails[order.seller];

        // Skip if vendor doesn't have valid payment setup
        if (!vendor?.paystack?.recipientCode) {
          logger.warn(
            `Skipping order ${order._id} - Vendor ${order.seller} has no valid payment setup`
          );
          continue;
        }

        if (!vendorPayouts[order.seller]) {
          vendorPayouts[order.seller] = {
            amount: 0,
            orders: [],
            vendor: vendor,
          };
        }
        vendorPayouts[order.seller].amount += order.vendorAmount;
        vendorPayouts[order.seller].orders.push(order);
      }

      // Log vendor payout summary
      Object.entries(vendorPayouts).forEach(([vendorId, data]) => {
        logger.info(`Vendor ${vendorId} payout summary:
          Orders: ${data.orders.length}
          Total Amount: ${data.amount}
          Recipient Code: ${data.vendor.paystack.recipientCode}
        `);
      });

      // Process payouts for each vendor
      const processResults = await Promise.allSettled(
        Object.entries(vendorPayouts).map(([vendorId, payout]) =>
          this.processVendorPayout(vendorId, payout)
        )
      );

      // Handle results
      const results = {
        successful: 0,
        failed: 0,
        total: processResults.length,
      };

      processResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          results.successful++;
        } else {
          results.failed++;
          logger.error(
            `Failed to process vendor payout ${index}:`,
            result.reason
          );
        }
      });

      logger.info(`Payout processing complete. Results:
        Total Processed: ${results.total}
        Successful: ${results.successful}
        Failed: ${results.failed}
      `);
    } catch (error) {
      logger.error("Error in processEligibleOrders:", error);
      throw error;
    }
  }

  async checkForEligiblePayouts() {
    try {
      // Verify connection before querying
      if (mongoose.connection.readyState !== 1) {
        logger.warn("Database connection lost, attempting to reconnect...");
        const connected = await this.connectToDatabase();
        if (!connected) {
          throw new Error("Database reconnection failed");
        }
      }

      const eligibleOrders = await this.findEligibleOrders();

      if (eligibleOrders.length > 0) {
        logger.info(
          `Found ${eligibleOrders.length} eligible orders for payout`
        );
        await this.processEligibleOrders(eligibleOrders);
      } else {
        logger.info("No eligible orders found for payout");
      }
    } catch (error) {
      logger.error("Error in payout monitoring:", error);
    }
  }

  async processVendorPayout(vendorId, payoutData) {
    try {
      // Create individual payouts for each order
      const payouts = [];
      for (const order of payoutData.orders) {
        try {
          const payout = new VendorPayout({
            vendorId,
            orderId: order._id,
            amount: order.vendorAmount,
            status: "pending",
            scheduledDate: new Date(),
            paymentMethod: "paystack",
            bankDetails: payoutData.vendor.bankDetails,
            currency: "NGN",
            metadata: {
              orderTotal: order.totalAmount,
              orderDate: order.createdAt,
              platformFee: order.platformFee,
            },
          });

          await payout.save();
          logger.info(
            `Created payout record ${payout._id} for order ${order._id}`
          );

          // Initiate transfer if amount meets minimum
          const vendorTier = await this.getVendorTier(vendorId);
          const minAmount = payoutConfig.schedules[vendorTier].minimumAmount;

          if (order.vendorAmount >= minAmount) {
            try {
              await this.initiateVendorTransfer(
                payoutData.vendor,
                order.vendorAmount,
                payout._id
              );

              // Update order payout status after successful transfer
              await Order.findByIdAndUpdate(order._id, {
                payoutStatus: "processed",
                lastPayoutDate: new Date(),
                lastPayoutId: payout._id,
              });

              payouts.push(payout);
            } catch (transferError) {
              logger.error(
                `Transfer failed for order ${order._id}:`,
                transferError
              );
              // Update payout status to failed
              await VendorPayout.findByIdAndUpdate(payout._id, {
                status: "failed",
                errorMessage: transferError.message,
              });
            }
          } else {
            logger.info(
              `Payout amount ${order.vendorAmount} below minimum ${minAmount} for vendor ${vendorId}`
            );
          }
        } catch (orderError) {
          logger.error(`Failed to process order ${order._id}:`, orderError);
        }
      }

      return payouts;
    } catch (error) {
      logger.error(`Error creating payouts for vendor ${vendorId}:`, error);
      throw error;
    }
  }

  async getVendorTier(vendorId) {
    // Simplified tier check for testing
    return "default";
  }

  async initiateVendorTransfer(vendor, amount, payoutId) {
    try {
      if (!vendor.paystack?.recipientCode) {
        throw new Error(
          `No valid Paystack recipient code for vendor ${vendor._id}`
        );
      }

      // Use mock transfer for testing
      const transfer = await this.paystackService.mockInitiateTransfer({
        amount: Math.floor(amount * 100), // Convert to kobo
        recipient: vendor.paystack.recipientCode,
        reason: `Payout ${payoutId}`,
      });

      if (transfer && transfer.status) {
        await VendorPayout.findByIdAndUpdate(payoutId, {
          status: "processing",
          transferReference: transfer.data.reference,
          transactionReference: transfer.data.transfer_code,
          $inc: { retriesCount: 1 },
        });

        logger.info(
          `Initiated transfer for vendor ${vendor._id}, amount: ${amount}, reference: ${transfer.data.reference}`
        );
      } else {
        await VendorPayout.findByIdAndUpdate(payoutId, {
          status: "failed",
          errorMessage: "Transfer failed - no valid response from Paystack",
          $inc: { retriesCount: 1 },
        });

        throw new Error("Transfer failed - no valid response from Paystack");
      }

      return transfer;
    } catch (error) {
      logger.error(
        `Transfer initiation failed for vendor ${vendor._id}:`,
        error
      );

      await VendorPayout.findByIdAndUpdate(payoutId, {
        status: "failed",
        errorMessage: error.message,
        $inc: { retriesCount: 1 },
      });

      throw error;
    }
  }
}

module.exports = new TestPayoutService();

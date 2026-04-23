// backend/models/vendorPayoutModels.js
const mongoose = require("mongoose");

const vendorPayoutSchema = new mongoose.Schema(
  {
    // Core payout information
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    amount: {
      type: Number,
      required: true,
    },
    // Status and scheduling
    status: {
      type: String,
      enum: ["aggregating", "pending", "processing", "processed", "failed"],
      default: "pending",
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    processedAt: Date,
    // Transaction references
    transactionReference: String,
    transferReference: String,
    providerPayoutId: String,
    providerStatus: String,
    lastStatusCheckedAt: Date,
    // Error handling
    errorMessage: String,
    retriesCount: {
      type: Number,
      default: 0,
    },
    // Payment details
    paymentMethod: {
      type: String,
      enum: [
        "paystack",
        "opay",
        "afriexchange",
        "Paystack",
        "OPay",
        "Opay",
        "AfriExchange",
      ],
      default: "paystack",
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String,
      bankCode: String,
    },
    paystack: {
      recipientCode: String,
    },
    // Additional metadata
    metadata: {
      type: Object,
    },
    // Batch processing information
    batchId: String,
    batchProcessedAt: Date,
    // Currency
    currency: {
      type: String,
      default: "NGN",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vendorPayoutSchema.index({ vendorId: 1 });
vendorPayoutSchema.index({ status: 1 });
vendorPayoutSchema.index({ scheduledDate: 1 });
vendorPayoutSchema.index({ transactionReference: 1 });
vendorPayoutSchema.index({ transferReference: 1 });

const vendorPayout = mongoose.model("VendorPayout", vendorPayoutSchema);
module.exports = vendorPayout;

// backend/scripts/migratePaymentModels.js
// Migration script (backend/scripts/migratePaymentModels.js)
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const VendorPayout = require("../models/VendorPayout");

async function migratePayments() {
  try {
    const payments = await Payment.find({});

    for (const payment of payments) {
      // Add new fields with default values
      payment.vendorAmount = payment.amount * 0.92; // 92% for vendor
      payment.platformFee = payment.amount * 0.08; // 8% platform fee
      payment.reference = payment.transactionId || `MIGRATED_${payment._id}`;
      payment.metadata = {
        migratedAt: new Date(),
        originalPaymentMethod: payment.paymentMethod,
      };

      await payment.save();
    }

    console.log("Payment migration completed");
  } catch (error) {
    console.error("Migration error:", error);
  }
}

// Run migration
migratePayments();

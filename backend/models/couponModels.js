const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expiryDate: { type: Date, required: true },
    maxUsage: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    signature: { type: String, required: true },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Method to check if the coupon is still valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  const isExpired = this.expiryDate < now;
  const isOverused = this.usedCount >= this.maxUsage;
  return !isExpired && !isOverused && this.active;
};

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;

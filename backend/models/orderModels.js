// backend/models/orderModels.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    vendorAmount: {
      type: Number,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: {
          type: Number,
          required: true,
        },
        vendorAmount: {
          type: Number,
          required: true,
        },
        platformFee: {
          type: Number,
          required: true,
        },
      },
    ],
    ratedProducts: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        rated: { type: Boolean, default: false },
      },
    ],
    cluesBucks: {
      pointsEarned: { type: Number, default: 0 },
      pointsUsed: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: [
        "Credit Card",
        "PayPal",
        "Bank Transfer",
        "Paystack",
        "OPay",
        "OrangeMoney",
        "PayDunya",
      ],
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    transactionId: { type: String },
    appliedCoupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    discount: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // Add metadata field
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("validate", async function (next) {
  try {
    // Generate orderId if not present
    if (!this.orderId) {
      const timestamp = Date.now().toString(36);
      const counter = (await Order.countDocuments()) + 1;
      this.orderId = `${counter.toString(36).padStart(6, "0")}-${timestamp}`;
    }

    // Validate amounts
    if (this.totalAmount) {
      // Calculate subtotal from products
      const calculatedSubtotal = this.products.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      // Verify subtotal matches
      if (Math.abs(calculatedSubtotal - this.subtotal) > 0.01) {
        throw new Error("Subtotal mismatch with products");
      }

      // Calculate total amount
      const calculatedTotal =
        this.subtotal -
        (this.discount || 0) -
        (this.cluesBucks?.discount || 0) +
        (this.shippingFee || 0);

      // Verify total amount
      if (Math.abs(calculatedTotal - this.totalAmount) > 0.01) {
        throw new Error("Total amount mismatch");
      }

      // Validate vendor and platform fee splits
      const vendorAmountTotal = this.products.reduce((sum, item) => {
        return sum + item.vendorAmount;
      }, 0);

      // Validate platform fee
      const platformFeeTotal = this.products.reduce((sum, item) => {
        return sum + item.platformFee;
      }, 0);

      // Add shipping fee to expected platform fee
      const expectedPlatformFee = platformFeeTotal + (this.shippingFee || 0);

      // Verify platform fee
      if (Math.abs(expectedPlatformFee - this.platformFee) > 0.01) {
        throw new Error("Platform fee mismatch");
      }
      // Verify vendor and platform fee splits
      if (Math.abs(vendorAmountTotal - this.vendorAmount) > 0.01) {
        throw new Error("Vendor amount mismatch");
      }

      // Verify total split
      if (
        Math.abs(this.vendorAmount + this.platformFee - calculatedTotal) > 0.01
      ) {
        throw new Error("Fee split mismatch with total amount");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

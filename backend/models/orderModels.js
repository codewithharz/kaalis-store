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
        variant: { type: Object },
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
    discountBreakdown: {
      coupon: { type: Number, default: 0 },
      specialOffer: { type: Number, default: 0 },
      cluesBucks: { type: Number, default: 0 },
      storeCredit: { type: Number, default: 0 },
    },
    storeCredit: {
      amountUsed: { type: Number, default: 0 },
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
        "AfriExchange",
      ],
      required: true,
    },
    currency: {
      type: String,
      enum: ["NGN", "XOF"],
      default: "NGN",
    },
    exchangeRate: {
      type: Number,
      default: 1,
    },
    originalCurrency: {
      type: String,
      enum: ["NGN", "XOF"],
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    transactionId: { type: String },
    appliedCoupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    discount: { type: Number, default: 0 },
    cancelReason: { type: String },
    cancelledAt: { type: Date },
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

    // Validate amounts - only run on initial creation or if financials were modified
    const isFinancialModified = 
      this.isNew || 
      this.isModified("products") || 
      this.isModified("subtotal") || 
      this.isModified("totalAmount") || 
      this.isModified("shippingFee") || 
      this.isModified("vendorAmount") || 
      this.isModified("platformFee") ||
      this.isModified("discount") ||
      this.isModified("discountBreakdown") ||
      this.isModified("cluesBucks") ||
      this.isModified("storeCredit");

    if (this.totalAmount && isFinancialModified) {
      // Calculate subtotal from products
      const calculatedSubtotal = this.products.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      // Verify subtotal matches
      if (Math.abs(calculatedSubtotal - this.subtotal) > 0.01) {
        throw new Error("Subtotal mismatch with products");
      }

      // Calculate total amount
      const couponDiscount = this.discountBreakdown?.coupon ?? this.discount ?? 0;
      const specialOfferDiscount =
        this.discountBreakdown?.specialOffer ??
        this.metadata?.specialOfferDiscount ??
        0;
      const cluesBucksDiscount =
        this.discountBreakdown?.cluesBucks ?? this.cluesBucks?.discount ?? 0;
      const storeCreditDiscount =
        this.discountBreakdown?.storeCredit ??
        this.storeCredit?.amountUsed ??
        0;

      const calculatedTotal =
        this.subtotal -
        couponDiscount -
        specialOfferDiscount -
        cluesBucksDiscount -
        storeCreditDiscount +
        (this.shippingFee || 0);

      // Verify total amount
      if (Math.abs(calculatedTotal - this.totalAmount) > 0.01) {
        throw new Error("Total amount mismatch");
      }

      // Fetch seller fulfillment type
      const User = mongoose.model("User");
      const sellerUser = await User.findById(this.seller).populate("sellerProfile");
      const fulfillmentType = sellerUser?.sellerProfile?.fulfillmentType || "platform";

      // Validate vendor and platform fee splits
      const vendorAmountTotal = this.products.reduce((sum, item) => {
        return sum + item.vendorAmount;
      }, 0);

      // Validate platform fee
      const platformFeeTotal = this.products.reduce((sum, item) => {
        return sum + item.platformFee;
      }, 0);

      // Expected platform and vendor shares vary by fulfillment type
      const expectedPlatformFee =
        fulfillmentType === "vendor"
          ? platformFeeTotal
          : platformFeeTotal + (this.shippingFee || 0);

      const expectedVendorAmount =
        fulfillmentType === "vendor"
          ? vendorAmountTotal + (this.shippingFee || 0)
          : vendorAmountTotal;

      // Verify platform fee
      if (Math.abs(expectedPlatformFee - this.platformFee) > 0.01) {
        throw new Error("Platform fee mismatch");
      }
      // Verify vendor amount
      if (Math.abs(expectedVendorAmount - this.vendorAmount) > 0.01) {
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

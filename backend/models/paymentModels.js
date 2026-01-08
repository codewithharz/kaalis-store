// backend/models/paymentModels.js
const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema(
  {
    accountName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    bankCode: String,
    bankName: { type: String, trim: true },
    recipientCode: String,
    lastVerified: Date,
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    reference: {
      type: String,
      sparse: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      get: (v) => parseFloat(v.toFixed(2)),
      set: (v) => parseFloat(v.toFixed(2)),
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        "Paystack",
        "Bank_transfer",
        "Cash",
        "OrangeMoney",
        "PayDunya",
        "OPay",
      ],
      required: true,
    },
    orangeMoneyData: {
      type: Object,
      select: false, // Only load when explicitly requested
    },
    payDunyaData: {
      // Added PayDunya-specific data field
      type: Object,
      select: false,
    },
    opayData: {
      type: Object,
      select: false,
    },
    metadata: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      customerPhone: {
        // Added for PayDunya and Orange Money
        type: String,
        trim: true,
      },
      opayOrderNo: {
        type: String,
      },
      custom_fields: [
        {
          display_name: String,
          variable_name: String,
          value: String,
        },
      ],
    },
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },
    bankDetails: bankDetailsSchema,
    paystackData: {
      type: Object,
      select: false, // Only load when explicitly requested
    },
    verificationData: {
      type: Object,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Indexes
paymentSchema.index({ "metadata.userId": 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ reference: 1 });
paymentSchema.index({ paymentMethod: 1 });

// Validation middleware
paymentSchema.pre("save", function (next) {
  if (this.status !== "pending" && !this.reference) {
    throw new Error("Payment reference required for non-pending status");
  }
  if (
    ["OrangeMoney", "PayDunya"].includes(this.paymentMethod) &&
    !this.metadata.customerPhone
  ) {
    throw new Error(
      `${this.paymentMethod} payments require a customer phone number`
    );
  }
  next();
});

// Query helpers
paymentSchema.query.byUser = function (userId) {
  return this.where({ "metadata.userId": userId });
};

paymentSchema.query.successful = function () {
  return this.where({ status: "success" });
};

paymentSchema.query.byPaymentMethod = function (method) {
  return this.where({ paymentMethod: method });
};

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;

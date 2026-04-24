// backend/models/cluesBucksModel.js
const mongoose = require("mongoose");

const cluesBucksSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    storeCreditBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["earned", "spent"],
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        source: {
          type: String,
          required: true,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        expiryDate: Date,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        metadata: {
          type: {
            type: String,
            enum: ["coupon", "offer", "credit", "points"],
            required: function () {
              // Only require for new transactions
              return this.isNew && this.type === "spent";
            },
          },
          validUntil: Date,
          offerAccess: Boolean,
          amount: Number,
          action: {
            type: String,
            enum: ["redeemed", "used"],
          },
          balanceAfter: Number,
        },
      },
    ],
    lifetimePoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CluesBucks", cluesBucksSchema);

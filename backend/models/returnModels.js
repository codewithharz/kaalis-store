// backend/models/returnModels.js
const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    returnId: {
      type: String,
      unique: true,
      required: true,
    },
    reason: {
      type: String,
      enum: ["defective", "wrong_item", "not_as_described", "size_issue", "changed_mind"],
      required: true,
    },
    comments: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Processing", "Completed"],
      default: "Pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          default: "",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

returnSchema.pre("validate", async function (next) {
  try {
    if (!this.returnId) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const counter = (await Return.countDocuments()) + 1;
      this.returnId = `RET-${counter.toString(36).toUpperCase().padStart(4, "0")}-${timestamp}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Return = mongoose.model("Return", returnSchema);
module.exports = Return;

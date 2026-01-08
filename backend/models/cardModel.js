const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
    last4: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      required: true,
    },
    expiryMonth: {
      type: String,
      required: true,
      match: /^(0[1-9]|1[0-2])$/,
    },
    expiryYear: {
      type: String,
      required: true,
      match: /^[0-9]{2}$/,
    },
    holderName: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure user can't see more than 5 cards
cardSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({
      userId: this.userId,
    });
    if (count >= 5) {
      throw new Error("Maximum number of cards (5) reached");
    }
  }
  next();
});

// Index for faster queries
cardSchema.index({ userId: 1, isDefault: 1 });

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;

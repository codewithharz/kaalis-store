const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "dislike", "favorite"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure user can only have one interaction type per product
interactionSchema.index({ user: 1, product: 1, type: 1 }, { unique: true });

const Interaction = mongoose.model("Interaction", interactionSchema);
module.exports = Interaction;

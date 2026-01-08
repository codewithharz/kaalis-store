const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    description: { type: String },
    priority: { type: Number, default: 1, min: 1, max: 5 },
    categories: [
      {
        name: { type: String, required: true },
        description: { type: String },
      },
    ],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notificationsEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;

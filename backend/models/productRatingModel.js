// const mongoose = require("mongoose");

// const productRatingSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   review: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// const ProductRating = mongoose.model("ProductRating", productRatingSchema);
// module.exports = ProductRating;

const mongoose = require("mongoose");
const productRatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  helpfulCount: { type: Number, default: 0 },
  helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  images: [
    {
      type: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

productRatingSchema.index({ user: 1, product: 1 }, { unique: true });

const ProductRating = mongoose.model("ProductRating", productRatingSchema);
module.exports = ProductRating;

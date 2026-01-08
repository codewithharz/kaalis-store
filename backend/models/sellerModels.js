// backend/models/sellerModels.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    storeName: { type: String, required: true, unique: true },
    storeDescription: { type: String },
    ratings: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    profileImage: { type: String },
    backgroundImage: { type: String },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    isVacationMode: { type: Boolean, default: false },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // New field for followers

    isVerified: { type: Boolean, default: false },
    verificationStatus: { 
      type: String, 
      enum: ['not_submitted', 'submitted', 'under_review', 'approved', 'rejected'],
      default: 'not_submitted'
    },
    lastVerificationRequest: { type: Date },
    verificationDate: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;

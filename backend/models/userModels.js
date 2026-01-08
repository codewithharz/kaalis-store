//backend/models/userModels.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isSeller: { type: Boolean, default: false },
    sellerProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    profileCompleted: { type: Boolean, default: false },
    gender: { type: String, enum: ["male", "female"], default: null },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
    roles: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Role", default: "User" },
    ],
    permissions: [{ type: String }],
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    // Session management
    isOnline: { type: Boolean, default: false },
    sessionId: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    lastFailedLogin: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },

    // Activity logging
    actions: [
      {
        action: { type: String },
        timestamp: { type: Date, default: Date.now },
        details: { type: Object },
        ip: { type: String },
      },
    ],

    socialAuth: {
      provider: { type: String },
      providerId: { type: String },
    },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    paystack: {
      recipientCode: String,
      accountNumber: String,
      bankCode: String,
      accountName: String,
      subaccountCode: String,
      lastPayout: Date,
      totalPayouts: Number,
      payoutSchedule: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Check if the password field is new or has been modified
  if (this.isModified("password") || this.isNew) {
    // Only hash the password if it has not already been hashed
    if (!this.isModified("password") || !this.password.startsWith("$2b$")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

// backend/models/adminUserModels.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "Moderator"],
      default: "Moderator",
    },
    createdAt: { type: Date, default: Date.now },
    failedLoginAttempts: { type: Number, default: 0 },
    lastFailedLogin: Date,
    isBlocked: { type: Boolean, default: false },
    lastLoginIP: String,
    sessionId: String,
    isOnline: { type: Boolean, default: false },
    twoFactorSecret: String,
    twoFactorEnabled: { type: Boolean, default: false },
    lastLogin: Date,
    lastLoginIP: String,
    allowedIPs: [String],
    sessionTimeout: { type: Number, default: 3600 }, // 1 hour in seconds
    actions: [
      {
        action: String,
        timestamp: Date,
        details: Object,
        ip: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
adminUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const AdminUser = mongoose.model("AdminUser", adminUserSchema);
module.exports = AdminUser;

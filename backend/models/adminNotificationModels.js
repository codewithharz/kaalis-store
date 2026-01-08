const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const AdminNotification = mongoose.model(
  "AdminNotification",
  adminNotificationSchema
);
module.exports = AdminNotification;

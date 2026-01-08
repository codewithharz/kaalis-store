// Handles notifications about messages (and other events)
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["Order", "Product", "System", "Promotion", "Feedback", "Message"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    expiresAt: { type: Date },
    actionUrl: { type: String },
    // Updated sender field to handle both User and AdminUser senders
    sender: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "sender.model",
      },
      model: {
        type: String,
        enum: ["User", "AdminUser"],
        default: "User",
      },
      username: String,
      role: {
        type: String,
        enum: ["user", "seller", "admin", "system"],
        default: "user",
      },
    },
    readAt: { type: Date },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    }, // For referencing related content
    relatedModel: {
      type: String,
      enum: ["Message", "Order", "Product"],
    },
    batchId: { type: String }, // Optional: for batch processing or grouping notifications
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ relatedId: 1 });
notificationSchema.index({ "sender.id": 1 });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;

// backend/models/messageModel.js
// Stores the actual message content, conversation history, and message metadata

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedSeller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    // Add parentMessage reference for replies
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

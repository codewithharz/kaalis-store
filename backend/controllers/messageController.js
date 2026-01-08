// backend/controllers/messageController.js
const Message = require("../models/messageModel");
const { createMessageNotification } = require("../utils/notificationUtils");

// Get message details
const getMessageDetails = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // First, get the requested message
    const message = await Message.findOne({
      _id: messageId,
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "username profileImage userType")
      .populate("receiver", "username profileImage userType")
      .populate("relatedSeller", "storeName sellerId userId");

    if (!message) {
      return res
        .status(404)
        .json({ error: "Message not found or access denied" });
    }

    // Initialize rootMessage as current message
    let rootMessage = message;

    // Only try to find parent if parentMessage exists
    if (message.parentMessage) {
      const parentMessage = await Message.findOne({
        _id: message.parentMessage,
      });
      if (parentMessage) {
        // If parent exists and has no parent itself, it's the root
        if (!parentMessage.parentMessage) {
          rootMessage = parentMessage;
        } else {
          // If parent has a parent, find the ultimate root
          let currentMsg = parentMessage;
          while (currentMsg.parentMessage) {
            currentMsg = await Message.findById(currentMsg.parentMessage);
            if (!currentMsg) break;
            rootMessage = currentMsg;
          }
        }
      }
    }

    // Safety check before querying thread
    if (!rootMessage || !rootMessage._id) {
      return res.status(404).json({ error: "Root message not found" });
    }

    // Get all messages in the thread
    const threadMessages = await Message.find({
      $or: [{ _id: rootMessage._id }, { parentMessage: rootMessage._id }],
    })
      .populate("sender", "username profileImage userType")
      .populate("receiver", "username profileImage userType")
      .populate("relatedSeller", "storeName sellerId userId")
      .sort({ createdAt: "asc" });

    // Mark as read if necessary
    if (message.receiver.equals(userId) && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    // Sanitize dates before sending response
    const sanitizeDate = (message) => {
      const msg = message.toObject();
      // Ensure dates are valid
      msg.createdAt = msg.createdAt
        ? new Date(msg.createdAt).toISOString()
        : null;
      msg.readAt = msg.readAt ? new Date(msg.readAt).toISOString() : null;
      return msg;
    };

    // Add isSellerMessage flag and organize thread
    const messageThread = threadMessages.map((msg) => {
      const msgObj = sanitizeDate(msg);
      msgObj.isSellerMessage =
        msg.relatedSeller &&
        (msg.sender.equals(msg.relatedSeller.userId) ||
          msg.receiver.equals(msg.relatedSeller.userId));
      return msgObj;
    });

    res.status(200).json({
      message: sanitizeDate(message),
      thread: messageThread,
    });
  } catch (error) {
    console.error("Error fetching message details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOneAndUpdate(
      {
        _id: messageId,
        receiver: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    ).populate("sender", "username profileImage");

    if (!message) {
      return res
        .status(404)
        .json({ error: "Message not found or already read" });
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: error.message });
  }
};

const replyToMessage = async (req, res) => {
  try {
    const { recipientId, subject, message, originalMessageId } = req.body;
    const senderId = req.user._id;

    // Get the original message to copy relatedSeller if it exists
    const originalMessage = originalMessageId
      ? await Message.findById(originalMessageId)
      : null;

    const newMessage = await Message.create({
      sender: senderId,
      receiver: recipientId,
      subject,
      message,
      parentMessage: originalMessageId,
      // Copy relatedSeller from original message if it exists
      ...(originalMessage?.relatedSeller && {
        relatedSeller: originalMessage.relatedSeller,
      }),
    });

    // Create notification for the recipient
    await createMessageNotification({
      userId: recipientId,
      senderId,
      messageId: newMessage._id,
      subject,
    });

    // Populate the new message with sender details
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "username profileImage")
      .populate("receiver", "username profileImage")
      .populate("relatedSeller", "storeName");

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Error replying to message:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMessageDetails,
  markAsRead,
  replyToMessage,
};

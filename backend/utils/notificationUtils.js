// backend/utils/notificationUtils.js
const Notification = require("../models/notificationModels");
const AdminUser = require("../models/adminUserModels");
const User = require("../models/userModels");
const Message = require("../models/messageModel");

// Create system notification
const createSystemNotification = async ({
  userId,
  title,
  message,
  priority = "medium",
  actionUrl = null,
  relatedId = null,
  relatedModel = null,
}) => {
  try {
    // Find the system admin user
    const systemAdmin = await AdminUser.findOne({ role: "SuperAdmin" });

    const notification = new Notification({
      user: userId,
      title,
      message,
      type: "System",
      priority,
      actionUrl,
      sender: {
        id: systemAdmin?._id,
        model: "AdminUser",
        username: systemAdmin?.username || "System",
        role: "system",
      },
      relatedId,
      relatedModel,
      read: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating system notification:", error);
    throw error;
  }
};

const createUserNotification = async ({
  userId, // recipient
  senderId, // sender
  title,
  message,
  type,
  priority = "medium",
  actionUrl = null,
  relatedId = null,
  relatedModel = null,
  senderRole = "user", // can be 'user' or 'seller'
}) => {
  try {
    // Get sender details
    const sender = await User.findById(senderId).select(
      "username role isSeller"
    );
    if (!sender) {
      throw new Error("Sender not found");
    }

    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      priority,
      actionUrl,
      sender: {
        id: senderId,
        model: "User",
        username: sender.username,
        role: sender.isSeller ? "seller" : "user",
      },
      relatedId,
      relatedModel,
      read: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating user notification:", error);
    throw error;
  }
};

// Create seller to user notification
const createSellerNotification = async ({
  userId, // buyer/customer ID
  sellerId, // seller ID
  title,
  message,
  type,
  priority = "medium",
  actionUrl = null,
  relatedId = null,
  relatedModel = null,
}) => {
  try {
    // Get seller details
    const seller = await User.findById(sellerId).select("username");
    if (!seller) {
      throw new Error("Seller not found");
    }

    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      priority,
      actionUrl,
      sender: {
        id: sellerId,
        model: "User",
        username: seller.username,
        role: "seller",
      },
      relatedId,
      relatedModel,
      read: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating seller notification:", error);
    throw error;
  }
};

// Helper function to create notifications for message threads
const createMessageNotification = async ({
  userId, // recipient
  senderId, // sender
  messageId, // ID of the message
  subject, // message subject
}) => {
  try {
    const message = await Message.findById(messageId)
      .populate("sender", "username isSeller")
      .populate("relatedSeller", "storeName userId");

    if (!message) {
      throw new Error("Message not found");
    }

    // Determine if this is a seller message
    const isSeller =
      message.relatedSeller &&
      message.sender._id.equals(message.relatedSeller.userId);

    return await createUserNotification({
      userId,
      senderId,
      title: `New Message: ${subject}`,
      message:
        message.message.substring(0, 100) +
        (message.message.length > 100 ? "..." : ""),
      type: "Message",
      priority: "medium",
      actionUrl: `/messages/${messageId}`,
      relatedId: messageId,
      relatedModel: "Message",
      senderRole: isSeller ? "seller" : "user",
    });
  } catch (error) {
    console.error("Error creating message notification:", error);
    throw error;
  }
};

module.exports = {
  createSystemNotification,
  createUserNotification,
  createSellerNotification,
  createMessageNotification,
};

// backend/utils/messageUtils.js
const Message = require("../models/messageModel");
const { createMessageNotification } = require("./notificationUtils");

const createMessage = async ({
  senderId,
  receiverId,
  subject,
  message,
  relatedSeller,
}) => {
  try {
    // Create the message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      subject,
      message,
      relatedSeller,
    });

    // Save the message
    await newMessage.save();

    // Create notification for the receiver
    await createMessageNotification({
      userId: receiverId,
      senderId,
      messageId: newMessage._id,
      subject,
    });

    return newMessage;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

const markMessageAsRead = async (messageId, userId) => {
  try {
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

    return message;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

const getMessageThread = async (messageId, userId) => {
  try {
    const message = await Message.findOne({
      _id: messageId,
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "username profileImage")
      .populate("receiver", "username profileImage")
      .populate("relatedSeller", "storeName");

    if (!message) {
      throw new Error("Message not found or access denied");
    }

    return message;
  } catch (error) {
    console.error("Error fetching message thread:", error);
    throw error;
  }
};

module.exports = {
  createMessage,
  markMessageAsRead,
  getMessageThread,
};

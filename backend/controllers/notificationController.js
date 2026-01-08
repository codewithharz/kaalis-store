// backend/controllers/notificationController.js
const Notification = require("../models/notificationModels");
const {
  createSystemNotification,
  createUserNotification,
} = require("../utils/notificationUtils");

// Get notifications by user
const getNotificationsByUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-__v") // Exclude version key
      .populate("sender", "username profileImage") // Only populate necessary fields
      .lean();

    return notifications;
  } catch (error) {
    console.error("Error in getNotificationsByUser:", error);
    throw error;
  }
};

// Get notification by ID
const getNotificationById = async (notificationId) => {
  try {
    if (!notificationId) {
      throw new Error("Notification ID is required");
    }

    const notification = await Notification.findById(notificationId)
      .populate("sender", "username")
      .lean();

    return notification;
  } catch (error) {
    console.error("Error in getNotificationById:", error);
    throw error;
  }
};

// Create notification wrapper that uses our utils
const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, priority, actionUrl } = req.body;

    let notification;

    // If it's a system notification
    if (type === "System") {
      notification = await createSystemNotification({
        userId,
        title,
        message,
        priority,
        actionUrl,
      });
    } else {
      // For user-to-user notifications
      notification = await createUserNotification({
        userId,
        senderId: req.user._id,
        title,
        message,
        type,
        priority,
        actionUrl,
      });
    }

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all notifications (admin)
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate("user", "username")
      .populate("sender", "username")
      .lean();

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    res.status(500).json({ error: error.message });
  }
};

// Mark as read
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: userId,
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      },
      {
        new: true,
        select: "-__v", // Exclude version key
      }
    ).lean();

    return notification;
  } catch (error) {
    console.error("Error in markAsRead:", error);
    throw error;
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.deleteOne();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  getNotificationById,
  getAllNotifications,
  markAsRead,
  deleteNotification,
};

// const Notification = require("../models/notificationModels");

// // Create a new notification
// const createNotification = async (req, res) => {
//   const {
//     user,
//     title,
//     message,
//     type,
//     priority,
//     expiresAt,
//     actionUrl,
//     batchId,
//   } = req.body;
//   const sender = req.user._id; // Assign the authenticated admin's ID as the sender

//   try {
//     const notification = new Notification({
//       user,
//       title,
//       message,
//       type,
//       priority,
//       expiresAt,
//       actionUrl,
//       sender,
//       batchId, // Include batchId if provided
//     });
//     await notification.save();
//     res
//       .status(201)
//       .json({ message: "Notification created successfully", notification });
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get notifications by user
// const getNotificationsByUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const notifications = await Notification.find({ user: userId });
//     res.status(200).json({ notifications });
//   } catch (error) {
//     console.error("Error fetching notifications by user:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get notification by ID
// const getNotificationById = async (req, res) => {
//   const { notificationId } = req.params;

//   try {
//     const notification = await Notification.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }
//     res.status(200).json({ notification });
//   } catch (error) {
//     console.error("Error fetching notification by ID:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get all notifications
// const getAllNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find();
//     res.status(200).json({ notifications });
//   } catch (error) {
//     console.error("Error fetching all notifications:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Mark a notification as read
// const markAsRead = async (req, res) => {
//   const { notificationId } = req.params;

//   try {
//     const notification = await Notification.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }

//     notification.read = true;
//     await notification.save();
//     res
//       .status(200)
//       .json({ message: "Notification marked as read", notification });
//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Delete a notification
// const deleteNotification = async (req, res) => {
//   const { notificationId } = req.params;

//   try {
//     const notification = await Notification.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }

//     await notification.deleteOne();
//     res.status(200).json({ message: "Notification deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting notification:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = {
//   createNotification,
//   getNotificationsByUser,
//   getNotificationById,
//   getAllNotifications,
//   markAsRead,
//   deleteNotification,
// };

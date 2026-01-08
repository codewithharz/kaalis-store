const AdminNotification = require("../models/adminNotificationModels");

// Get all notifications for a specific admin
exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await AdminNotification.find({
      admin: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new notification
exports.createAdminNotification = async (req, res) => {
  const { message } = req.body;
  try {
    const notification = new AdminNotification({
      admin: req.user._id,
      message,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await AdminNotification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a notification
exports.deleteAdminNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await AdminNotification.findByIdAndDelete(
      notificationId
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

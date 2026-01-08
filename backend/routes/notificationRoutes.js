// backend/routes/notificationRoutes.js
const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const isAdmin = require("../middleware/isAdmin");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  createNotification,
  getNotificationsByUser,
  getNotificationById,
  getAllNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// Admin routes
router.post("/", adminAuthMiddleware, isAdmin, createNotification);
router.get("/admin/all", adminAuthMiddleware, isAdmin, getAllNotifications);

// User routes
router.get("/my-notifications", userAuthMiddleware, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const notifications = await getNotificationsByUser(req.user._id);
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error in my-notifications route:", error);
    res.status(500).json({ error: error.message });
  }
});

router.patch(
  "/mark-read/:notificationId",
  userAuthMiddleware,
  async (req, res) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const notification = await markAsRead(
        req.params.notificationId,
        req.user._id
      );

      if (!notification) {
        return res
          .status(404)
          .json({ error: "Notification not found or already read" });
      }

      res.status(200).json({
        message: "Notification marked as read",
        notification,
      });
    } catch (error) {
      console.error("Error in mark-read route:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/:notificationId", userAuthMiddleware, deleteNotification);

module.exports = router;

const express = require("express");
const {
  getAdminNotifications,
  createAdminNotification,
  markNotificationAsRead,
  deleteAdminNotification,
} = require("../controllers/adminNotificationController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

//notificationId has to match in controller
router.get("/", adminAuthMiddleware, getAdminNotifications);
router.post("/", adminAuthMiddleware, createAdminNotification);
router.put(
  "/:notificationId/read",
  adminAuthMiddleware,
  markNotificationAsRead
);
router.delete("/:notificationId", adminAuthMiddleware, deleteAdminNotification);

module.exports = router;

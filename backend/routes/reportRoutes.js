const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  createReport,
  getReportById,
  getAllReports,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

const router = express.Router();

// Create a new report (authenticated user)
router.post("/", userAuthMiddleware, createReport);

// Get report by ID (authenticated user)
router.get("/:reportId", userAuthMiddleware, getReportById);

// Get all reports (admin only)
router.get("/", adminAuthMiddleware, getAllReports);

// Update report status (admin only)
router.patch("/:reportId/status", adminAuthMiddleware, updateReportStatus);

// Delete a report (admin only)
router.delete("/:reportId", adminAuthMiddleware, deleteReport);

module.exports = router;

// backend/routes/auditLogRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllAuditLogs,
  createAuditLog,
  getAuditLogById,
  deleteAuditLog,
  getAdminActivitySummary,
  rollbackAction,
  exportAuditLogs,
  getSystemChangesHistory,
} = require("../controllers/auditLogController");

// Get all audit logs
router.get("/", getAllAuditLogs);

// Create a new audit log
router.post("/", createAuditLog);

// Get a specific audit log by ID
router.get("/:id", getAuditLogById);

// Delete an audit log by ID
router.delete("/:id", deleteAuditLog);

// Get admin activity summary
router.get("/admin/:adminId/summary", getAdminActivitySummary);

// Rollback action
router.post("/:id/rollback", rollbackAction);

// Export audit logs
router.get("/export", exportAuditLogs);

// Get system changes history
router.get("/changes", getSystemChangesHistory);

module.exports = router;

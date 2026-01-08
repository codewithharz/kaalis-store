// backend/controllers/auditLogController.js
const AuditLog = require("../models/auditLogModels");

const auditLogController = {
  // Get all audit logs with pagination and filters
  getAllAuditLogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(0);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      // Build filter conditions
      const filter = {
        timestamp: { $gte: startDate, $lte: endDate },
      };

      if (req.query.adminId) {
        filter.adminId = req.query.adminId;
      }

      if (req.query.action) {
        filter.action = req.query.action;
      }

      if (req.query.status) {
        filter.status = req.query.status;
      }

      // Execute query with pagination
      const logs = await AuditLog.find(filter)
        .populate("adminId", "username email role")
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await AuditLog.countDocuments(filter);

      res.json({
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching audit logs", error: error.message });
    }
  },

  // Create a new audit log
  createAuditLog: async (req, res) => {
    try {
      const newLog = new AuditLog(req.body);
      const savedLog = await newLog.save();
      res.status(201).json(savedLog);
    } catch (error) {
      res.status(500).json({
        message: "Error creating audit log",
        error: error.message,
      });
    }
  },

  // Get audit log details by ID
  getAuditLogById: async (req, res) => {
    try {
      const log = await AuditLog.findById(req.params.id).populate(
        "adminId",
        "username email role"
      );

      if (!log) {
        return res.status(404).json({ message: "Audit log not found" });
      }

      res.json(log);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching audit log", error: error.message });
    }
  },

  // Delete an audit log
  deleteAuditLog: async (req, res) => {
    try {
      const log = await AuditLog.findByIdAndDelete(req.params.id);
      if (!log) {
        return res.status(404).json({ message: "Audit log not found" });
      }
      res.json({ message: "Audit log deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting audit log",
        error: error.message,
      });
    }
  },

  // Get admin activity summary
  getAdminActivitySummary: async (req, res) => {
    try {
      const { adminId } = req.params;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const summary = await AuditLog.getAdminActivitySummary(
        adminId,
        startDate,
        endDate
      );

      res.json({
        adminId,
        period: { startDate, endDate },
        summary,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error generating activity summary",
        error: error.message,
      });
    }
  },

  // Perform rollback of an action
  rollbackAction: async (req, res) => {
    try {
      const log = await AuditLog.findById(req.params.id);

      if (!log) {
        return res.status(404).json({ message: "Audit log not found" });
      }

      if (
        log.rollbackStatus !== "not_required" &&
        log.rollbackStatus !== "failed"
      ) {
        return res
          .status(400)
          .json({ message: "Action already rolled back or pending rollback" });
      }

      if (!log.previousState) {
        return res
          .status(400)
          .json({ message: "No previous state available for rollback" });
      }

      // Create rollback entry
      const rollbackEntry = await log.createRollbackEntry();

      // Update original log status
      log.rollbackStatus = "completed";
      await log.save();

      res.json({
        message: "Rollback completed successfully",
        originalLog: log,
        rollbackLog: rollbackEntry,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error performing rollback", error: error.message });
    }
  },

  // Export audit logs
  exportAuditLogs: async (req, res) => {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(0);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const logs = await AuditLog.find({
        timestamp: { $gte: startDate, $lte: endDate },
      })
        .populate("adminId", "username email role")
        .sort({ timestamp: -1 });

      // Format logs for export
      const formattedLogs = logs.map((log) => ({
        timestamp: log.timestamp,
        admin: log.adminId
          ? `${log.adminId.username} (${log.adminId.email})`
          : "Unknown",
        action: log.action,
        status: log.status,
        ip: log.ip,
        details: log.details || "",
        affectedResource: log.affectedResource || "",
        rollbackStatus: log.rollbackStatus,
      }));

      res.json({
        data: formattedLogs,
        metadata: {
          exportedAt: new Date(),
          period: { startDate, endDate },
          totalRecords: logs.length,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error exporting audit logs", error: error.message });
    }
  },

  // Get system changes history
  getSystemChangesHistory: async (req, res) => {
    try {
      const { resourceType } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};
      if (resourceType) {
        filter.affectedResource = resourceType;
      }

      const changes = await AuditLog.find(filter)
        .where("previousState")
        .exists(true)
        .populate("adminId", "username email")
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await AuditLog.countDocuments(filter);

      res.json({
        changes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching system changes",
        error: error.message,
      });
    }
  },
};

module.exports = auditLogController;

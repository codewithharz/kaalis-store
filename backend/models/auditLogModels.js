// backend/models/auditLogModels.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    requestData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    responseData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["success", "failure"],
      required: true,
      default: "success",
    },
    details: {
      type: String,
    },
    affectedResource: {
      type: String,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    previousState: {
      type: mongoose.Schema.Types.Mixed,
    },
    newState: {
      type: mongoose.Schema.Types.Mixed,
    },
    userAgent: {
      type: String,
    },
    rollbackStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "not_required"],
      default: "not_required",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
auditLogSchema.index({ adminId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

// Method to create rollback entry
auditLogSchema.methods.createRollbackEntry = async function () {
  if (!this.previousState) {
    return null;
  }

  return await this.model("AuditLog").create({
    adminId: this.adminId,
    action: `ROLLBACK_${this.action}`,
    ip: this.ip,
    requestData: this.newState,
    responseData: this.previousState,
    timestamp: new Date(),
    status: "success",
    details: `Rollback of action ${this._id}`,
    affectedResource: this.affectedResource,
    resourceId: this.resourceId,
    previousState: this.newState,
    newState: this.previousState,
    rollbackStatus: "completed",
  });
};

// Static method to get admin activity summary
auditLogSchema.statics.getAdminActivitySummary = async function (
  adminId,
  startDate,
  endDate
) {
  return await this.aggregate([
    {
      $match: {
        adminId: new mongoose.Types.ObjectId(adminId),
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$action",
        count: { $sum: 1 },
        successCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "success"] }, 1, 0],
          },
        },
        failureCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "failure"] }, 1, 0],
          },
        },
      },
    },
  ]);
};

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;

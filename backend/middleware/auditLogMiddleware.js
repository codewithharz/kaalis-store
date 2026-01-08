// backend/middleware/auditLogMiddleware.js
const AuditLog = require("../models/auditLogModels");

const auditLogMiddleware = async (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    const adminId = req.admin?._id;
    const action = `${req.method} ${req.path}`;
    const ip = req.ip;

    // Log the action
    AuditLog.create({
      adminId,
      action,
      ip,
      requestData: req.body,
      responseData: data,
      timestamp: new Date(),
    }).catch((err) => console.error("Audit log error:", err));

    originalSend.apply(res, arguments);
  };

  next();
};

module.exports = auditLogMiddleware;

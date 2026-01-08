// backend/middleware/roleAuthMiddleware.js
const ROLE_PERMISSIONS = require("../constants/rolePermissions");

const roleAuthMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "No admin user found" });
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ message: "Insufficient privileges" });
    }

    next();
  };
};

const hasPermission = (role, requiredPermission) => {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes("*") || permissions.includes(requiredPermission);
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "No admin user found" });
    }

    if (!hasPermission(req.admin.role, requiredPermission)) {
      return res.status(403).json({ message: "Insufficient privileges" });
    }

    next();
  };
};

module.exports = { roleAuthMiddleware, checkPermission };

// backend/middleware/sessionManagementMiddleware.js
const sessionManagementMiddleware = async (req, res, next) => {
  try {
    const admin = req.admin;
    if (!admin) return next();

    // Check session timeout
    const lastActivity = admin.lastLogin;
    const timeoutDuration = admin.sessionTimeout * 1000; // Convert to milliseconds
    const now = new Date();

    if (lastActivity && now - lastActivity > timeoutDuration) {
      return res.status(440).json({ message: "Session expired" });
    }

    // Check IP whitelist
    if (admin.allowedIPs && admin.allowedIPs.length > 0) {
      if (!admin.allowedIPs.includes(req.ip)) {
        return res.status(403).json({ message: "Access denied from this IP" });
      }
    }

    // Update last activity
    admin.lastLogin = now;
    await admin.save();

    next();
  } catch (error) {
    next(error);
  }
};

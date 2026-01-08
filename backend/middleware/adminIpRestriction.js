// If you don't need IP restrictions: You can safely remove the adminIpRestriction.js file

// backend/middleware/adminIpRestriction.js
const restrictAdminIPs = (req, res, next) => {
  const allowedIPs = process.env.ALLOWED_ADMIN_IPS?.split(",") || [];
  const clientIP = req.ip;

  if (!allowedIPs.includes(clientIP) && !allowedIPs.includes("*")) {
    return res.status(403).json({ message: "Access denied from this IP" });
  }
  next();
};

// Use in routes
app.use("/api/admin", restrictAdminIPs, adminUserRoutes);

// backend/middleware/adminAuthMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Import dotenv to access environment variables
const AdminUser = require("../models/adminUserModels"); // Change to AdminUser

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminUser = await AdminUser.findById(decoded.userId)
      .select("-password")
      .lean();

    if (!adminUser) {
      return res.status(401).json({ message: "Admin user not found" });
    }

    // Check if user's role is still valid
    if (!["Admin", "SuperAdmin", "Moderator"].includes(adminUser.role)) {
      return res.status(403).json({ message: "Invalid admin role" });
    }

    // Add user info to request
    req.adminUser = adminUser;

    // Log admin action
    console.log(
      `Admin action by ${adminUser.username} (${adminUser.role}): ${req.method} ${req.originalUrl}`
    );

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error("Admin authorization error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = adminAuthMiddleware;

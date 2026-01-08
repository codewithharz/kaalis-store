const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to handle temporary 2FA tokens
 * This middleware allows requests with temporary tokens for specific 2FA routes only
 */
const twoFactorAuthMiddleware = async (req, res, next) => {
  try {
    // Check if there's a token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if this is a temporary 2FA token
    if (decoded.requiresTwoFactor) {
      // Only allow access for specific 2FA verification routes
      const allowedPaths = [
        /\/api\/users\/2fa\/verify-login/, // Login verification endpoint
      ];

      // Check if the current path is in the allowed list
      const isAllowedPath = allowedPaths.some((path) => path.test(req.path));

      if (!isAllowedPath) {
        return res.status(403).json({
          message: "Access denied. Complete two-factor authentication first.",
        });
      }

      // Verify the user exists and the token is still valid
      const user = await User.findById(decoded.userId);
      if (!user || user.twoFactorTemp !== token) {
        return res.status(401).json({
          message: "Invalid or expired verification session.",
        });
      }

      // Attach the user to the request object
      req.user = user;
      req.tempToken = true;
      next();
    } else {
      // For regular tokens, continue with normal flow
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    }
  } catch (error) {
    console.error("Error in 2FA middleware:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please login again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token. Please login again." });
    }

    res.status(500).json({ message: "Server error in authentication" });
  }
};

module.exports = twoFactorAuthMiddleware;

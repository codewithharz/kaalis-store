const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const userAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("=== AUTH DEBUG ===");
    console.log("Auth Header:", authHeader ? "Present" : "Missing");

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
        debug: "No Authorization header found in request",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token ? "Yes" : "No");
    console.log(
      "Token preview:",
      token ? token.substring(0, 20) + "..." : "N/A"
    );

    if (!token) {
      return res.status(401).json({
        message: "Token missing in authorization header",
        debug: "Authorization header format should be: Bearer <token>",
      });
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({
        message: "Authorization failed",
        debug: "User not found in database",
      });
    }

    req.user = user;
    console.log("Auth successful for user:", user.email);
    console.log("=== AUTH DEBUG END ===");

    next();
  } catch (error) {
    console.error("=== AUTH ERROR ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        debug: error.message,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        debug: "Please login again",
      });
    }

    res.status(401).json({
      message: "Authorization failed",
      debug: error.message,
    });
  }
};

module.exports = userAuthMiddleware;

// // original
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModels");

// const userAuthMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       console.log("Authorization header missing");
//       return res.status(401).json({ message: "Authorization header missing" });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       console.log("Token missing in authorization header");
//       return res
//         .status(401)
//         .json({ message: "Token missing in authorization header" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded token:", decoded);

//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       console.log("User not found");
//       return res.status(401).json({ message: "Authorization failed" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Authorization error:", error.message);
//     res.status(401).json({ message: "Authorization failed" });
//   }
// };

// module.exports = userAuthMiddleware;

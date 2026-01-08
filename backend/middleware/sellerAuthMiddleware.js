// backend/middleware/sellerAuthMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const sellerAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("Authorization header missing");
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Token missing in authorization header");
      return res
        .status(401)
        .json({ message: "Token missing in authorization header" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isSeller) {
      console.log("Seller not found or user is not a seller");
      return res.status(401).json({ message: "Authorization failed" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    res.status(401).json({ message: "Authorization failed" });
  }
};

module.exports = sellerAuthMiddleware;

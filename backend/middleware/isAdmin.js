// backend/middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  // Allow requests in development mode for testing
  if (
    process.env.NODE_ENV === "development" &&
    process.env.BYPASS_ADMIN_CHECK === "true"
  ) {
    return next();
  }

  // Check for adminUser (from adminAuthMiddleware) or user (from userAuthMiddleware)
  const user = req.adminUser || req.user;

  if (!user) {
    return res.status(403).json({
      message: "Access denied: Authentication required",
    });
  }

  if (user.role !== "Admin" && user.role !== "SuperAdmin") {
    return res.status(403).json({
      message: "Access denied: Requires Admin or SuperAdmin privileges",
    });
  }

  next();
};

module.exports = isAdmin;

// const isAdmin = (req, res, next) => {
//   const user = req.user;
//   if (user.role !== "Admin" && user.role !== "SuperAdmin") {
//     console.log("Access denied: User is not an admin");
//     return res.status(403).json({ message: "Access denied" });
//   }
//   next();
// };

// module.exports = isAdmin;

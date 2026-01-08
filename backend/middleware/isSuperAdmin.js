// backend/middleware/isSuperAdmin.js
const isSuperAdmin = (req, res, next) => {
  const { role } = req.adminUser;
  if (!role || role !== "SuperAdmin") {
    return res.status(403).json({
      message: "Access denied: Requires SuperAdmin privileges",
    });
  }
  next();
};

module.exports = isSuperAdmin;

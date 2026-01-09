// backend/routes/adminRoutes.js
const express = require("express");
const AdminUser = require("../models/adminUserModels");
const adminUserController = require("../controllers/adminUserController");
const adminDashboardController = require("../controllers/adminDashboardController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const isAdmin = require("../middleware/isAdmin");
const isSuperAdmin = require("../middleware/isSuperAdmin");

const router = express.Router();

// Admin Initialization
router.post("/init", async (req, res) => {
  try {
    // Verify deployment key from environment
    const deploymentKey = req.headers["x-deployment-key"];
    if (deploymentKey !== process.env.ADMIN_DEPLOYMENT_KEY) {
      return res.status(403).json({ message: "Invalid deployment key" });
    }

    const existingAdmin = await AdminUser.findOne({ role: "SuperAdmin" });
    if (existingAdmin) {
      return res.json({ message: "Super admin already exists" });
    }

    // Create initial admin user
    const adminUser = new AdminUser({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "SuperAdmin",
      lastLogin: new Date(),
      sessionTimeout: 3600,
    });

    await adminUser.save();
    res.json({ message: "Super admin created successfully" });
  } catch (error) {
    console.error("Admin initialization error:", error);
    res
      .status(500)
      .json({ message: "Failed to initialize admin", error: error.message });
  }
});

// Auth routes (no auth required)
router.post("/register", adminAuthMiddleware, isSuperAdmin, adminUserController.createAdminUser);
router.post("/login", adminUserController.loginAdminUser);
// router.post("/reset-admin-password/:userId", adminUserController.resetAdminPasswordWithKey);
router.post("/change-password", adminAuthMiddleware, adminUserController.changePassword);

// Admin User Management Routes
router.get("/users", adminAuthMiddleware, isAdmin, adminUserController.getAdminUsers);
router.get("/users/:id", adminAuthMiddleware, isAdmin, adminUserController.getAdminUserById);
router.put("/users/:id", adminAuthMiddleware, isAdmin, adminUserController.updateAdminUser);
router.delete("/users/:id", adminAuthMiddleware, isSuperAdmin, adminUserController.deleteAdminUser);

// Admin User Actions
router.post("/users/:id/reset-password", adminAuthMiddleware, isSuperAdmin, adminUserController.resetPassword);
router.get("/users/:id/activity", adminAuthMiddleware, isAdmin, adminUserController.getUserActivity);
router.post("/users/:id/toggle-block", adminAuthMiddleware, isSuperAdmin, adminUserController.toggleBlockStatus);
router.post("/users/:id/toggle-2fa", adminAuthMiddleware, isAdmin, adminUserController.toggle2FA);
router.post("/users/:id/force-logout", adminAuthMiddleware, isAdmin, adminUserController.forceLogout);

// Regular User Management Routes
router.get("/regular-users", adminAuthMiddleware, isAdmin, adminDashboardController.getRegularUsers);
router.put("/regular-users/:id", adminAuthMiddleware, isAdmin, adminDashboardController.updateRegularUser);
router.delete("/regular-users/:id", adminAuthMiddleware, isSuperAdmin, adminDashboardController.deleteRegularUser);

// Regular User Actions
router.post("/regular-users/:id/reset-password", adminAuthMiddleware, isSuperAdmin, adminDashboardController.resetPassword);
router.get("/regular-users/:id/activity", adminAuthMiddleware, isAdmin, adminDashboardController.getUserActivity);
router.post("/regular-users/:id/toggle-block", adminAuthMiddleware, isSuperAdmin, adminDashboardController.toggleBlockUser);
router.post("/regular-users/:id/toggle-2fa", adminAuthMiddleware, isAdmin, adminDashboardController.toggle2FAUser);
router.post("/regular-users/:id/force-logout", adminAuthMiddleware, isAdmin, adminDashboardController.forceLogoutUser);
router.put("/regular-users/:id/permissions", adminAuthMiddleware, isAdmin, adminDashboardController.updateUserPermissions);

// Dashboard Routes
router.get("/dashboard/stats", adminAuthMiddleware, adminDashboardController.getDashboardStats);
router.get("/products", adminAuthMiddleware, adminDashboardController.getAdminProducts);
router.get("/orders", adminAuthMiddleware, adminDashboardController.getAdminOrders);
router.get("/categories", adminAuthMiddleware, adminDashboardController.getAdminCategories);
router.get("/revenue-stats", adminAuthMiddleware, adminDashboardController.getRevenueStats);

// Product Management Routes
router.put("/products/:id", adminAuthMiddleware, adminDashboardController.updateProduct);
router.delete("/products/:id", adminAuthMiddleware, adminDashboardController.deleteProduct);

// Category Management Routes
router.put("/categories/:id", adminAuthMiddleware, adminDashboardController.updateCategory);
router.delete("/categories/:id", adminAuthMiddleware, adminDashboardController.deleteCategory);

// Order Management Routes
router.put("/orders/:id/status", adminAuthMiddleware, adminDashboardController.updateOrderStatus);

// Manual Payout Processing (replaces automatic cron job)
router.post("/process-payouts", adminAuthMiddleware, isSuperAdmin, async (req, res) => {
  try {
    const payoutService = require("../services/payoutService");
    const logger = require("../utils/logger");

    logger.info(`Manual payout processing initiated by admin: ${req.adminUser.email}`);

    // Process all pending payouts
    const results = await payoutService.processVendorPayouts();

    logger.info("Manual payout processing completed", { results });

    res.json({
      success: true,
      message: "Payout processing completed successfully",
      results: results
    });
  } catch (error) {
    console.error("Error in manual payout processing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payouts",
      error: error.message
    });
  }
});

// Seller Management Routes
router.post("/sellers/:id/reset-password", adminAuthMiddleware, isSuperAdmin, adminDashboardController.resetSellerPassword);
router.post("/sellers/:id/toggle-2fa", adminAuthMiddleware, isAdmin, adminDashboardController.toggleSeller2FA);
router.post("/sellers/:id/toggle-block", adminAuthMiddleware, isSuperAdmin, adminDashboardController.toggleSellerBlockStatus);
router.get("/sellers/:id/activity", adminAuthMiddleware, isAdmin, adminDashboardController.getSellerActivity);
router.post("/sellers/:id/force-logout", adminAuthMiddleware, isAdmin, adminDashboardController.forceSellerLogout);


// In your adminRoutes.js, add/update these routes under your admin dashboard routes section
router.get('/sellers', adminAuthMiddleware, isAdmin, adminDashboardController.getAdminSellers);
router.get('/sellers/:id', adminAuthMiddleware, isAdmin, adminDashboardController.getSellerById);
router.put('/sellers/:id/status', adminAuthMiddleware, isAdmin, adminDashboardController.updateSellerStatus);
router.get('/sellers/:id/reviews', adminAuthMiddleware, isAdmin, adminDashboardController.getSellerReviews);

module.exports = router;

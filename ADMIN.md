<!-- curl ifconfig.me -->
Based on your seller dashboard and e-commerce system, I can help design comprehensive admin privileges. The admin dashboard should have more extensive controls and oversight capabilities than the seller dashboard. Here are the key admin privileges that should be implemented:

1. User Management:
- View all users (customers and sellers)
- Ban/suspend users
- Reset user passwords
- Manage user roles and permissions
- View user activity logs

2. Seller Management:
- Approve/reject seller applications
- Monitor seller performance metrics
- Suspend/revoke seller privileges
- Review seller verification documents
- Set seller commission rates

3. Product Management:
- Review and approve/reject product listings
- Remove prohibited products
- Manage product categories
- Set featured products
- Monitor product quality and compliance

4. Order Management:
- View all orders across the platform
- Handle order disputes
- Process refunds
- Monitor order fulfillment
- Track delivery issues

5. Financial Controls:
- Monitor all transactions
- Manage payout schedules
- Set platform fees
- Handle refund policies
- Generate financial reports

6. Content Management:
- Manage homepage content
- Control promotional banners
- Edit platform policies
- Manage email templates
- Control system notifications

7. System Configuration:
- Configure payment gateways
- Set shipping rules
- Manage platform settings
- Configure API integrations
- Set platform-wide discounts

8. Analytics & Reporting:
- View platform-wide analytics
- Generate custom reports
- Monitor system performance
- Track user engagement
- Analyze sales metrics

Let me create a base admin dashboard component that incorporates these privileges:

This admin dashboard provides a comprehensive interface for managing all aspects of your e-commerce platform. Each section can be further developed with detailed functionality. Would you like me to create any specific section in more detail, such as the user management interface or the product approval system?

A few key points to consider for implementation:

1. Role-based access control (RBAC):
- SuperAdmin: Full access to all features
- Admin: Limited administrative access
- Moderator: Content and user management only

2. Audit logging:
- Track all admin actions
- Maintain change history
- Enable action rollback

3. Security measures:
- Two-factor authentication for admin accounts
- IP whitelisting for admin panel access
- Session management and timeout controls

4. Performance monitoring:
- System health metrics
- Server resource utilization
- API performance tracking





For your current e-commerce project, I recommend sticking with the admin implementation I provided earlier and gradually adding these advanced features as your needs grow. Here's why:

Start Simple, Scale Later:


The basic admin implementation I provided covers all essential functionality
It's easier to test and debug
You can get it up and running quickly
It matches your current user/auth system



backend/routes/adminRoutes.js
// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const { roleAuthMiddleware, checkPermission } = require("../middleware/roleAuthMiddleware");
const adminController = require("../controllers/adminController");

// User Management Routes
router.post('/users', adminAuthMiddleware, roleAuthMiddleware(["SuperAdmin", "Admin"]), adminController.createUser);
router.get('/users', adminAuthMiddleware, roleAuthMiddleware(["SuperAdmin", "Admin", "Moderator"]), adminController.getAllUsers);
router.get('/users/:id', adminAuthMiddleware, roleAuthMiddleware(["SuperAdmin", "Admin", "Moderator"]), adminController.getUserById);
router.put('/users/:id', adminAuthMiddleware, roleAuthMiddleware(["SuperAdmin", "Admin"]), adminController.updateUser);
router.delete('/users/:id', adminAuthMiddleware, roleAuthMiddleware(["SuperAdmin"]), adminController.deleteUser);

// Product Management Routes
router.post('/products', adminAuthMiddleware, checkPermission("manage_products"), adminController.createProduct);
router.get('/products', adminAuthMiddleware, checkPermission("manage_products"), adminController.getAllProducts);
router.get('/products/:id', adminAuthMiddleware, checkPermission("manage_products"), adminController.getProductById);
router.put('/products/:id', adminAuthMiddleware, checkPermission("manage_products"), adminController.updateProduct);
router.delete('/products/:id', adminAuthMiddleware, checkPermission("manage_products"), adminController.deleteProduct);

// Order Management Routes
router.get('/orders', adminAuthMiddleware, checkPermission("manage_orders"), adminController.getAllOrders);
router.get('/orders/:id', adminAuthMiddleware, checkPermission("manage_orders"), adminController.getOrderById);
router.put('/orders/:id', adminAuthMiddleware, checkPermission("manage_orders"), adminController.updateOrderStatus);

// Content Management Routes
router.post('/content', adminAuthMiddleware, checkPermission("manage_content"), adminController.createContent);
router.get('/content', adminAuthMiddleware, checkPermission("manage_content"), adminController.getAllContent);
router.put('/content/:id', adminAuthMiddleware, checkPermission("manage_content"), adminController.updateContent);
router.delete('/content/:id', adminAuthMiddleware, checkPermission("manage_content"), adminController.deleteContent);

// Reports Routes
router.get('/reports', adminAuthMiddleware, checkPermission("view_reports"), adminController.getAllReports);
router.get('/reports/:id', adminAuthMiddleware, checkPermission("view_reports"), adminController.getReportById);
router.put('/reports/:id/resolve', adminAuthMiddleware, checkPermission("view_reports"), adminController.resolveReport);

// Audit Log Routes
router.get('/audit-logs', adminAuthMiddleware, roleAuthMiddleware(["SuperAdmin"]), adminController.getAuditLogs);

// System Settings Routes
router.put('/settings', adminAuthMiddleware, roleAuthMiddleware(["SuperAdmin"]), adminController.updateSettings);

// Dashboard Routes
router.get('/dashboard/stats', adminAuthMiddleware, adminController.getDashboardStats);

module.exports = router;



backend/routes/adminUserRoutes.js
const express = require("express");
const {
  createAdminUser,
  loginAdminUser,
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
} = require("../controllers/adminUserController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const isAdmin = require("../middleware/isAdmin");

const adminUserRoutes = express.Router();

//id has to match in controller
adminUserRoutes.post("/register", createAdminUser); // No auth needed
adminUserRoutes.post("/login", loginAdminUser); // No auth needed
adminUserRoutes.get("/", adminAuthMiddleware, isAdmin, getAdminUsers); // Requires admin
adminUserRoutes.get("/:id", adminAuthMiddleware, isAdmin, getAdminUserById); // Requires admin
adminUserRoutes.put("/:id", adminAuthMiddleware, isAdmin, updateAdminUser); // Requires admin
adminUserRoutes.delete("/:id", adminAuthMiddleware, isAdmin, deleteAdminUser); // Requires admin

module.exports = adminUserRoutes;


backend/routes/adminNotificationRoutes.js
const express = require("express");
const {
  getAdminNotifications,
  createAdminNotification,
  markNotificationAsRead,
  deleteAdminNotification,
} = require("../controllers/adminNotificationController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

//notificationId has to match in controller
router.get("/", adminAuthMiddleware, getAdminNotifications);
router.post("/", adminAuthMiddleware, createAdminNotification);
router.put(
  "/:notificationId/read",
  adminAuthMiddleware,
  markNotificationAsRead
);
router.delete("/:notificationId", adminAuthMiddleware, deleteAdminNotification);

module.exports = router;



backend/routes/activityLogRoutes.js
// activityLogRoutes.js
const express = require("express");
const {
  addActivityLogs,
  getAllActivityLogs,
  getUserActivityLogs,
  updateActivityLog,
  deleteActivityLog,
} = require("../controllers/activityLogController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

const router = express.Router();

//userId, activityLogId has to match in controller
router.post("/", userAuthMiddleware, addActivityLogs); // Add multiple activity logs
router.get("/", userAuthMiddleware, getAllActivityLogs); // Get all activity logs
router.get("/:userId", userAuthMiddleware, getUserActivityLogs); // Get user's activity logs
router.put("/:userId/:activityLogId", userAuthMiddleware, updateActivityLog); // Update activity log
router.delete("/:activityLogId", userAuthMiddleware, deleteActivityLog);

module.exports = router;



backend/routes/roleRoutes.js
const express = require("express");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  createRole,
  assignRoleToUser,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

const router = express.Router();

// Create a new role (admin only)
router.post("/", adminAuthMiddleware, createRole);

// Assign role to user
router.post("/assign", adminAuthMiddleware, assignRoleToUser);

// Get role by ID (admin only)
router.get("/:roleId", adminAuthMiddleware, getRoleById);

// Get all roles (admin only)
router.get("/", adminAuthMiddleware, getAllRoles);

// Update a role (admin only)
router.patch("/:roleId", adminAuthMiddleware, updateRole);

// Delete a role (admin only)
router.delete("/:roleId", adminAuthMiddleware, deleteRole);

module.exports = router;



backend/routes/reportRoutes.js
const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  createReport,
  getReportById,
  getAllReports,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

const router = express.Router();

// Create a new report (authenticated user)
router.post("/", userAuthMiddleware, createReport);

// Get report by ID (authenticated user)
router.get("/:reportId", userAuthMiddleware, getReportById);

// Get all reports (admin only)
router.get("/", adminAuthMiddleware, getAllReports);

// Update report status (admin only)
router.patch("/:reportId/status", adminAuthMiddleware, updateReportStatus);

// Delete a report (admin only)
router.delete("/:reportId", adminAuthMiddleware, deleteReport);

module.exports = router;


backend/models/settingsModels.js
// backend/models/settingsModels.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    // Platform Settings
    platformName: { type: String, required: true, default: "Kaalis Store" },
    platformLogo: { type: String },
    theme: {
      primaryColor: { type: String, default: "#ff934b" },
      secondaryColor: { type: String, default: "#ff5e62" },
      darkMode: { type: Boolean, default: false },
    },

    // Business Settings
    platformFeePercentage: {
      type: Number,
      required: true,
      default: 5,
      min: 0,
      max: 100,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Payment Settings
    supportedPaymentMethods: [
      {
        name: { type: String },
        isActive: { type: Boolean, default: true },
      },
    ],
    paystackSettings: {
      publicKey: String,
      secretKey: String,
      isLive: { type: Boolean, default: false },
    },

    // Shipping Settings
    shippingZones: [
      {
        name: String,
        regions: [String],
        fee: Number,
      },
    ],
    freeShippingThreshold: { type: Number, default: 0 },

    // Notifications
    emailNotifications: {
      orderConfirmation: { type: Boolean, default: true },
      shipping: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true },
    },

    // Maintenance Mode
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: String,

    // SEO Settings
    seoSettings: {
      defaultTitle: String,
      defaultDescription: String,
      googleAnalyticsId: String,
    },

    // Social Media Links
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },

    // Contact Information
    contactInfo: {
      email: String,
      phone: String,
      address: String,
    },

    // Last Updated By
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.pre("save", async function (next) {
  const count = await this.constructor.countDocuments();
  if (count > 0 && !this.isModified()) {
    throw new Error("Only one settings document can exist");
  }
  next();
});

const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;


backend/models/roleModels.js
// backend/models/roleModel.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String }, // Optional description for the role
    permissions: [{ type: String }],
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;


backend/models/reportModels.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    details: { type: String },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
    type: {
      type: String,
      enum: ["Product", "User", "Order", "Other"],
      required: true,
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId, refPath: "type" }, // reference to the reported entity
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // reference to the admin who resolved it
    resolutionNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;


backend/models/performanceMetricModels.js
// backend/models/performanceMetricModels.js
const mongoose = require("mongoose");

const performanceMetricSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in milliseconds
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    userAgent: {
      type: String,
    },
    memoryUsage: {
      type: Map,
      of: Number,
      default: () => {
        const memory = process.memoryUsage();
        return {
          heapTotal: memory.heapTotal,
          heapUsed: memory.heapUsed,
          external: memory.external,
          rss: memory.rss,
        };
      },
    },
    cpuUsage: {
      type: Number,
      default: process.cpuUsage().user,
    },
    requestSize: {
      type: Number, // in bytes
    },
    responseSize: {
      type: Number, // in bytes
    },
    serverLoad: {
      type: Map,
      of: Number,
      default: () => ({
        activeConnections: 0,
        activeRequests: 0,
      }),
    },
    cacheHit: {
      type: Boolean,
      default: false,
    },
    errorCount: {
      type: Number,
      default: 0,
    },
    warnings: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
performanceMetricSchema.index({ endpoint: 1, timestamp: -1 });
performanceMetricSchema.index({ duration: 1 });
performanceMetricSchema.index({ statusCode: 1 });
performanceMetricSchema.index({ timestamp: -1 });

// Method to check if performance threshold is exceeded
performanceMetricSchema.methods.isThresholdExceeded = function (
  threshold = 1000
) {
  return this.duration > threshold;
};

// Static method to get endpoint performance summary
performanceMetricSchema.statics.getEndpointSummary = async function (
  endpoint,
  startDate,
  endDate
) {
  return await this.aggregate([
    {
      $match: {
        endpoint,
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        avgDuration: { $avg: "$duration" },
        maxDuration: { $max: "$duration" },
        minDuration: { $min: "$duration" },
        requestCount: { $sum: 1 },
        errorCount: { $sum: "$errorCount" },
        successRate: {
          $avg: {
            $cond: [{ $eq: ["$statusCode", 200] }, 1, 0],
          },
        },
      },
    },
  ]);
};

// Static method to get performance alerts
performanceMetricSchema.statics.getPerformanceAlerts = async function (
  threshold = 1000,
  timeframe = 3600000
) {
  const startTime = new Date(Date.now() - timeframe);

  return await this.aggregate([
    {
      $match: {
        timestamp: { $gte: startTime },
        duration: { $gt: threshold },
      },
    },
    {
      $group: {
        _id: "$endpoint",
        averageDuration: { $avg: "$duration" },
        occurrences: { $sum: 1 },
        lastOccurrence: { $max: "$timestamp" },
      },
    },
    {
      $match: {
        occurrences: { $gt: 5 }, // Alert only if multiple occurrences
      },
    },
  ]);
};

// Method to get resource utilization
performanceMetricSchema.methods.getResourceUtilization = function () {
  return {
    memory: {
      total: this.memoryUsage.get("heapTotal"),
      used: this.memoryUsage.get("heapUsed"),
      utilization: (
        (this.memoryUsage.get("heapUsed") / this.memoryUsage.get("heapTotal")) *
        100
      ).toFixed(2),
    },
    cpu: this.cpuUsage,
    server: {
      connections: this.serverLoad.get("activeConnections"),
      requests: this.serverLoad.get("activeRequests"),
    },
  };
};

const PerformanceMetric = mongoose.model(
  "PerformanceMetric",
  performanceMetricSchema
);

module.exports = PerformanceMetric;


backend/models/contentModels.js
// backend/models/contentModels.js
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["banner", "announcement", "page", "email_template", "policy"],
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    metadata: {
      description: String,
      keywords: [String],
      author: String,
    },
    placement: {
      location: {
        type: String,
        enum: ["home", "header", "footer", "sidebar", "popup"],
      },
      priority: {
        type: Number,
        default: 0,
      },
    },
    visibility: {
      startDate: Date,
      endDate: Date,
      isVisible: {
        type: Boolean,
        default: true,
      },
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "document"],
        },
        url: String,
        altText: String,
      },
    ],
    version: {
      type: Number,
      default: 1,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    revisions: [
      {
        content: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AdminUser",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        version: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug
contentSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

// Index for better search performance
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ slug: 1 }, { unique: true });

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;


backend/models/auditLogModels.js
// backend/models/auditLogModels.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    requestData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    responseData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["success", "failure"],
      required: true,
      default: "success",
    },
    details: {
      type: String,
    },
    affectedResource: {
      type: String,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    previousState: {
      type: mongoose.Schema.Types.Mixed,
    },
    newState: {
      type: mongoose.Schema.Types.Mixed,
    },
    userAgent: {
      type: String,
    },
    rollbackStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "not_required"],
      default: "not_required",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
auditLogSchema.index({ adminId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

// Method to create rollback entry
auditLogSchema.methods.createRollbackEntry = async function () {
  if (!this.previousState) {
    return null;
  }

  return await this.model("AuditLog").create({
    adminId: this.adminId,
    action: `ROLLBACK_${this.action}`,
    ip: this.ip,
    requestData: this.newState,
    responseData: this.previousState,
    timestamp: new Date(),
    status: "success",
    details: `Rollback of action ${this._id}`,
    affectedResource: this.affectedResource,
    resourceId: this.resourceId,
    previousState: this.newState,
    newState: this.previousState,
    rollbackStatus: "completed",
  });
};

// Static method to get admin activity summary
auditLogSchema.statics.getAdminActivitySummary = async function (
  adminId,
  startDate,
  endDate
) {
  return await this.aggregate([
    {
      $match: {
        adminId: new mongoose.Types.ObjectId(adminId),
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$action",
        count: { $sum: 1 },
        successCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "success"] }, 1, 0],
          },
        },
        failureCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "failure"] }, 1, 0],
          },
        },
      },
    },
  ]);
};

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;


backend/models/adminUserModels.js
// backend/models/adminUserModels.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "Moderator"],
      default: "Moderator",
    },
    twoFactorSecret: String,
    twoFactorEnabled: { type: Boolean, default: false },
    lastLogin: Date,
    lastLoginIP: String,
    allowedIPs: [String],
    sessionTimeout: { type: Number, default: 3600 }, // 1 hour in seconds
    actions: [
      {
        action: String,
        timestamp: Date,
        details: Object,
        ip: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
adminUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const AdminUser = mongoose.model("AdminUser", adminUserSchema);
module.exports = AdminUser;


backend/models/adminNotificationModels.js
const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const AdminNotification = mongoose.model(
  "AdminNotification",
  adminNotificationSchema
);
module.exports = AdminNotification;


backend/models/activityLogModels.js
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activity: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;


backend/controllers/roleController.js
const Role = require("../models/roleModels");
const User = require("../models/userModels");

// Create a new role
const createRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// assign a role to a user
const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findById(userId);
    const role = await Role.findById(roleId);

    if (!user || !role) {
      return res.status(404).json({ message: "User or Role not found" });
    }

    user.roles.push(role._id);
    await user.save();

    res.status(200).json({ message: "Role assigned successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a role
const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.roleId, req.body, {
      new: true,
    });
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRole,
  assignRoleToUser,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
};



backend/controllers/reportController.js
const Report = require("../models/reportModels");
const mongoose = require("mongoose");

// Create a new report
const createReport = async (req, res) => {
  try {
    // Validate ObjectId for referenceId
    if (!mongoose.Types.ObjectId.isValid(req.body.referenceId)) {
      return res.status(400).json({ error: "Invalid reference ID" });
    }

    // Check for rate limiting (e.g., only allow 5 reports per user per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const reportCount = await Report.countDocuments({
      user: req.user._id,
      createdAt: { $gte: oneHourAgo },
    });

    if (reportCount >= 3) {
      return res
        .status(429)
        .json({ error: "Too many reports. Please try again later." });
    }

    const report = new Report({
      user: req.user._id,
      reason: req.body.reason,
      details: req.body.details,
      type: req.body.type,
      referenceId: req.body.referenceId,
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId)
      .populate("user")
      .populate("resolvedBy");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reports (admin only)
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user").populate("resolvedBy");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update report status (admin only)
const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    report.status = req.body.status;
    report.resolvedBy = req.user._id;
    report.resolutionNotes = req.body.resolutionNotes;
    await report.save();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a report (admin only)
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    await report.deleteOne();
    res.status(200).json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport,
  getReportById,
  getAllReports,
  updateReportStatus,
  deleteReport,
};


backend/controllers/performanceMetricController.js
// backend/controllers/performanceMetricController.js
const PerformanceMetric = require("../models/performanceMetricModels");

const performanceMetricController = {
  // Get performance metrics with filtering and pagination
  getPerformanceMetrics: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      // Build filter conditions
      const filter = {
        timestamp: { $gte: startDate, $lte: endDate },
      };

      if (req.query.endpoint) {
        filter.endpoint = req.query.endpoint;
      }

      if (req.query.method) {
        filter.method = req.query.method;
      }

      if (req.query.statusCode) {
        filter.statusCode = parseInt(req.query.statusCode);
      }

      // Execute query with pagination
      const metrics = await PerformanceMetric.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await PerformanceMetric.countDocuments(filter);

      res.json({
        metrics,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching performance metrics",
        error: error.message,
      });
    }
  },

  // Get endpoint performance summary
  getEndpointSummary: async (req, res) => {
    try {
      const { endpoint } = req.params;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const summary = await PerformanceMetric.getEndpointSummary(
        endpoint,
        startDate,
        endDate
      );

      if (summary.length === 0) {
        return res
          .status(404)
          .json({ message: "No metrics found for this endpoint" });
      }

      res.json({
        endpoint,
        period: { startDate, endDate },
        metrics: summary[0],
      });
    } catch (error) {
      res.status(500).json({
        message: "Error generating endpoint summary",
        error: error.message,
      });
    }
  },

  // Get performance alerts
  getPerformanceAlerts: async (req, res) => {
    try {
      const threshold = parseInt(req.query.threshold) || 1000; // Default 1 second
      const timeframe = parseInt(req.query.timeframe) || 3600000; // Default 1 hour

      const alerts = await PerformanceMetric.getPerformanceAlerts(
        threshold,
        timeframe
      );

      res.json({
        timestamp: new Date(),
        threshold,
        timeframe,
        alerts,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching performance alerts",
        error: error.message,
      });
    }
  },

  // Get system resource utilization
  getResourceUtilization: async (req, res) => {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const metrics = await PerformanceMetric.find({
        timestamp: { $gte: startDate, $lte: endDate },
      }).select("memoryUsage cpuUsage serverLoad timestamp");

      // Calculate averages
      const utilization = metrics.reduce(
        (acc, metric) => {
          const resourceUtil = metric.getResourceUtilization();
          acc.memory.push({
            timestamp: metric.timestamp,
            ...resourceUtil.memory,
          });
          acc.cpu.push({
            timestamp: metric.timestamp,
            usage: resourceUtil.cpu,
          });
          acc.server.push({
            timestamp: metric.timestamp,
            ...resourceUtil.server,
          });
          return acc;
        },
        { memory: [], cpu: [], server: [] }
      );

      res.json({
        period: { startDate, endDate },
        utilization,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching resource utilization",
        error: error.message,
      });
    }
  },

  // Get slow endpoints report
  getSlowEndpointsReport: async (req, res) => {
    try {
      const threshold = parseInt(req.query.threshold) || 1000;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const slowEndpoints = await PerformanceMetric.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate },
            duration: { $gt: threshold },
          },
        },
        {
          $group: {
            _id: {
              endpoint: "$endpoint",
              method: "$method",
            },
            avgDuration: { $avg: "$duration" },
            maxDuration: { $max: "$duration" },
            count: { $sum: 1 },
            lastOccurrence: { $max: "$timestamp" },
          },
        },
        {
          $sort: { avgDuration: -1 },
        },
      ]);

      res.json({
        threshold,
        period: { startDate, endDate },
        endpoints: slowEndpoints,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error generating slow endpoints report",
        error: error.message,
      });
    }
  },

  // Get error rate analysis
  getErrorRateAnalysis: async (req, res) => {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const errorAnalysis = await PerformanceMetric.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$endpoint",
            totalRequests: { $sum: 1 },
            errorCount: {
              $sum: {
                $cond: [{ $gte: ["$statusCode", 400] }, 1, 0],
              },
            },
            distinctErrors: { $addToSet: "$statusCode" },
          },
        },
        {
          $project: {
            endpoint: "$_id",
            totalRequests: 1,
            errorCount: 1,
            errorRate: {
              $multiply: [{ $divide: ["$errorCount", "$totalRequests"] }, 100],
            },
            distinctErrors: {
              $filter: {
                input: "$distinctErrors",
                as: "code",
                cond: { $gte: ["$$code", 400] },
              },
            },
          },
        },
        {
          $sort: { errorRate: -1 },
        },
      ]);

      res.json({
        period: { startDate, endDate },
        analysis: errorAnalysis,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error generating error rate analysis",
        error: error.message,
      });
    }
  },

  // Get real-time monitoring data
  getRealTimeMetrics: async (req, res) => {
    try {
      const timeWindow = parseInt(req.query.timeWindow) || 300000; // Default 5 minutes
      const startTime = new Date(Date.now() - timeWindow);

      const realtimeMetrics = await PerformanceMetric.find({
        timestamp: { $gte: startTime },
      })
        .sort({ timestamp: 1 })
        .select(
          "endpoint duration statusCode timestamp memoryUsage cpuUsage serverLoad"
        );

      const metrics = {
        requestCount: realtimeMetrics.length,
        avgResponseTime:
          realtimeMetrics.reduce((acc, curr) => acc + curr.duration, 0) /
            realtimeMetrics.length || 0,
        errorCount: realtimeMetrics.filter((m) => m.statusCode >= 400).length,
        timeline: realtimeMetrics.map((m) => ({
          timestamp: m.timestamp,
          duration: m.duration,
          statusCode: m.statusCode,
          memory: m.memoryUsage,
          cpu: m.cpuUsage,
          load: m.serverLoad,
        })),
      };

      res.json({
        timestamp: new Date(),
        timeWindow,
        metrics,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching real-time metrics",
        error: error.message,
      });
    }
  },

  // Get cache performance metrics
  getCachePerformance: async (req, res) => {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const cacheMetrics = await PerformanceMetric.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$endpoint",
            totalRequests: { $sum: 1 },
            cacheHits: {
              $sum: { $cond: ["$cacheHit", 1, 0] },
            },
            avgDurationWithCache: {
              $avg: {
                $cond: ["$cacheHit", "$duration", null],
              },
            },
            avgDurationWithoutCache: {
              $avg: {
                $cond: ["$cacheHit", null, "$duration"],
              },
            },
          },
        },
        {
          $project: {
            endpoint: "$_id",
            totalRequests: 1,
            cacheHits: 1,
            cacheHitRate: {
              $multiply: [{ $divide: ["$cacheHits", "$totalRequests"] }, 100],
            },
            avgDurationWithCache: 1,
            avgDurationWithoutCache: 1,
            performanceImprovement: {
              $subtract: ["$avgDurationWithoutCache", "$avgDurationWithCache"],
            },
          },
        },
        {
          $sort: { cacheHitRate: -1 },
        },
      ]);

      res.json({
        period: { startDate, endDate },
        cacheMetrics,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching cache performance metrics",
        error: error.message,
      });
    }
  },

  // Generate performance report
  generatePerformanceReport: async (req, res) => {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      // Collect all relevant metrics
      const [
        overallMetrics,
        slowEndpoints,
        errorRates,
        resourceUtilization,
        cachePerformance,
      ] = await Promise.all([
        PerformanceMetric.getEndpointSummary("all", startDate, endDate),
        PerformanceMetric.getPerformanceAlerts(),
        PerformanceMetric.aggregate([
          {
            $match: {
              timestamp: { $gte: startDate, $lte: endDate },
              statusCode: { $gte: 400 },
            },
          },
          {
            $group: {
              _id: "$statusCode",
              count: { $sum: 1 },
            },
          },
        ]),
        PerformanceMetric.aggregate([
          {
            $match: {
              timestamp: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              avgCpuUsage: { $avg: "$cpuUsage" },
              maxCpuUsage: { $max: "$cpuUsage" },
              avgMemoryUsage: { $avg: { $arrayElemAt: ["$memoryUsage", 0] } },
              maxMemoryUsage: { $max: { $arrayElemAt: ["$memoryUsage", 0] } },
            },
          },
        ]),
        PerformanceMetric.aggregate([
          {
            $match: {
              timestamp: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              totalRequests: { $sum: 1 },
              cacheHits: { $sum: { $cond: ["$cacheHit", 1, 0] } },
            },
          },
        ]),
      ]);

      const report = {
        period: { startDate, endDate },
        overview: {
          totalRequests: overallMetrics[0]?.requestCount || 0,
          averageResponseTime: overallMetrics[0]?.avgDuration || 0,
          successRate: overallMetrics[0]?.successRate || 0,
        },
        performance: {
          slowEndpoints,
          errorRates,
          resourceUtilization: resourceUtilization[0] || {},
          cachePerformance: cachePerformance[0] || {},
        },
        recommendations: generateRecommendations(
          overallMetrics[0],
          slowEndpoints,
          errorRates
        ),
      };

      res.json(report);
    } catch (error) {
      res.status(500).json({
        message: "Error generating performance report",
        error: error.message,
      });
    }
  },
};

// Helper function to generate recommendations based on metrics
function generateRecommendations(metrics, slowEndpoints, errorRates) {
  const recommendations = [];

  if (metrics?.avgDuration > 1000) {
    recommendations.push({
      type: "performance",
      severity: "high",
      message:
        "Average response time is above 1 second. Consider implementing caching or optimizing database queries.",
    });
  }

  if (slowEndpoints.length > 0) {
    recommendations.push({
      type: "performance",
      severity: "medium",
      message:
        "Multiple slow endpoints detected. Review and optimize the identified endpoints.",
    });
  }

  if (errorRates.some((rate) => rate.count > 100)) {
    recommendations.push({
      type: "reliability",
      severity: "high",
      message:
        "High error rate detected. Review error logs and implement error handling.",
    });
  }

  return recommendations;
}

module.exports = performanceMetricController;


backend/controllers/auditLogController.js
// backend/controllers/auditLogController.js
const AuditLog = require("../models/auditLogModels");

const auditLogController = {
  // Get all audit logs with pagination and filters
  getAllAuditLogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(0);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      // Build filter conditions
      const filter = {
        timestamp: { $gte: startDate, $lte: endDate },
      };

      if (req.query.adminId) {
        filter.adminId = req.query.adminId;
      }

      if (req.query.action) {
        filter.action = req.query.action;
      }

      if (req.query.status) {
        filter.status = req.query.status;
      }

      // Execute query with pagination
      const logs = await AuditLog.find(filter)
        .populate("adminId", "username email role")
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await AuditLog.countDocuments(filter);

      res.json({
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching audit logs", error: error.message });
    }
  },

  // Create a new audit log
  createAuditLog: async (req, res) => {
    try {
      const newLog = new AuditLog(req.body);
      const savedLog = await newLog.save();
      res.status(201).json(savedLog);
    } catch (error) {
      res.status(500).json({
        message: "Error creating audit log",
        error: error.message,
      });
    }
  },

  // Get audit log details by ID
  getAuditLogById: async (req, res) => {
    try {
      const log = await AuditLog.findById(req.params.id).populate(
        "adminId",
        "username email role"
      );

      if (!log) {
        return res.status(404).json({ message: "Audit log not found" });
      }

      res.json(log);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching audit log", error: error.message });
    }
  },

  // Delete an audit log
  deleteAuditLog: async (req, res) => {
    try {
      const log = await AuditLog.findByIdAndDelete(req.params.id);
      if (!log) {
        return res.status(404).json({ message: "Audit log not found" });
      }
      res.json({ message: "Audit log deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting audit log",
        error: error.message,
      });
    }
  },

  // Get admin activity summary
  getAdminActivitySummary: async (req, res) => {
    try {
      const { adminId } = req.params;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const summary = await AuditLog.getAdminActivitySummary(
        adminId,
        startDate,
        endDate
      );

      res.json({
        adminId,
        period: { startDate, endDate },
        summary,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error generating activity summary",
        error: error.message,
      });
    }
  },

  // Perform rollback of an action
  rollbackAction: async (req, res) => {
    try {
      const log = await AuditLog.findById(req.params.id);

      if (!log) {
        return res.status(404).json({ message: "Audit log not found" });
      }

      if (
        log.rollbackStatus !== "not_required" &&
        log.rollbackStatus !== "failed"
      ) {
        return res
          .status(400)
          .json({ message: "Action already rolled back or pending rollback" });
      }

      if (!log.previousState) {
        return res
          .status(400)
          .json({ message: "No previous state available for rollback" });
      }

      // Create rollback entry
      const rollbackEntry = await log.createRollbackEntry();

      // Update original log status
      log.rollbackStatus = "completed";
      await log.save();

      res.json({
        message: "Rollback completed successfully",
        originalLog: log,
        rollbackLog: rollbackEntry,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error performing rollback", error: error.message });
    }
  },

  // Export audit logs
  exportAuditLogs: async (req, res) => {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(0);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();

      const logs = await AuditLog.find({
        timestamp: { $gte: startDate, $lte: endDate },
      })
        .populate("adminId", "username email role")
        .sort({ timestamp: -1 });

      // Format logs for export
      const formattedLogs = logs.map((log) => ({
        timestamp: log.timestamp,
        admin: log.adminId
          ? `${log.adminId.username} (${log.adminId.email})`
          : "Unknown",
        action: log.action,
        status: log.status,
        ip: log.ip,
        details: log.details || "",
        affectedResource: log.affectedResource || "",
        rollbackStatus: log.rollbackStatus,
      }));

      res.json({
        data: formattedLogs,
        metadata: {
          exportedAt: new Date(),
          period: { startDate, endDate },
          totalRecords: logs.length,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error exporting audit logs", error: error.message });
    }
  },

  // Get system changes history
  getSystemChangesHistory: async (req, res) => {
    try {
      const { resourceType } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};
      if (resourceType) {
        filter.affectedResource = resourceType;
      }

      const changes = await AuditLog.find(filter)
        .where("previousState")
        .exists(true)
        .populate("adminId", "username email")
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await AuditLog.countDocuments(filter);

      res.json({
        changes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching system changes",
        error: error.message,
      });
    }
  },
};

module.exports = auditLogController;


backend/controllers/adminUserController.js
const AdminUser = require("../models/adminUserModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create Admin User
const createAdminUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    const existingUser = await AdminUser.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    const newAdminUser = new AdminUser({ username, password, email, role });
    await newAdminUser.save();
    res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    console.error("Error creating admin user:", error); // Log the error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin User Login
const loginAdminUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const adminUser = await AdminUser.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    res.status(200).json({
      token,
      adminUser: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Admin Users
const getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await AdminUser.find();
    res.status(200).json(adminUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Admin User by ID
const getAdminUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const adminUser = await AdminUser.findById(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    res.status(200).json(adminUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Admin User
const updateAdminUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  try {
    const adminUser = await AdminUser.findById(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    adminUser.username = username || adminUser.username;
    adminUser.email = email || adminUser.email;
    adminUser.role = role || adminUser.role;

    if (req.body.password) {
      adminUser.password = await bcrypt.hash(req.body.password, 10);
    }

    await adminUser.save();
    res.status(200).json({ message: "Admin user updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Admin User
const deleteAdminUser = async (req, res) => {
  const { id } = req.params;

  try {
    const adminUser = await AdminUser.findByIdAndDelete(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    res.status(200).json({ message: "Admin user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createAdminUser,
  loginAdminUser,
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
};



backend/controllers/adminController.js
// backend/controllers/adminController.js
const User = require("../models/userModels");
const Product = require("../models/productModels");
const Order = require("../models/orderModels");
const AuditLog = require("../models/auditLogModels");
const Settings = require("../models/settingsModels");
const Content = require("../models/contentModels");
const Report = require("../models/reportModels");

const adminController = {
  // User Management
  createUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      const user = new User({ username, email, password, role });
      await user.save();
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const product = new Product({
        ...req.body,
        user: req.admin._id,
      });
      await product.save();
      res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating product", error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { username, email, role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { username, email, role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  },

  // Product Management
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find()
        .populate("user", "username email")
        .populate("category", "name")
        .sort({ createdAt: -1 });
      res.json(products);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching products", error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate("user", "username email")
        .populate("category", "name");

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching product", error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product updated successfully", product });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting product", error: error.message });
    }
  },

  // Order Management
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "username email")
        .populate("seller", "username email")
        .populate("products.product", "name price")
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching orders", error: error.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "username email")
        .populate("seller", "username email")
        .populate("products.product", "name price");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching order", error: error.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Order status updated successfully", order });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating order status", error: error.message });
    }
  },

  // Content Management
  createContent: async (req, res) => {
    try {
      const content = new Content({
        ...req.body,
        lastUpdatedBy: req.admin._id,
      });
      await content.save();
      res
        .status(201)
        .json({ message: "Content created successfully", content });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating content", error: error.message });
    }
  },

  getAllContent: async (req, res) => {
    try {
      const content = await Content.find()
        .populate("lastUpdatedBy", "username")
        .sort({ createdAt: -1 });
      res.json(content);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching content", error: error.message });
    }
  },

  updateContent: async (req, res) => {
    try {
      const content = await Content.findById(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      // Store the current version as a revision
      content.revisions.push({
        content: content.content,
        updatedBy: content.lastUpdatedBy,
        updatedAt: content.updatedAt,
        version: content.version,
      });

      // Update the content
      content.set({
        ...req.body,
        lastUpdatedBy: req.admin._id,
        version: content.version + 1,
      });

      await content.save();
      res.json({ message: "Content updated successfully", content });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating content", error: error.message });
    }
  },

  deleteContent: async (req, res) => {
    try {
      const content = await Content.findByIdAndDelete(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting content", error: error.message });
    }
  },

  // Reports Management
  getAllReports: async (req, res) => {
    try {
      const reports = await Report.find()
        .populate("user", "username email")
        .populate("resolvedBy", "username email")
        .sort({ createdAt: -1 });
      res.json(reports);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching reports", error: error.message });
    }
  },

  getReportById: async (req, res) => {
    try {
      const report = await Report.findById(req.params.id)
        .populate("user", "username email")
        .populate("resolvedBy", "username email");

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching report", error: error.message });
    }
  },

  // Audit Logs
  getAuditLogs: async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .populate("adminId", "username email")
        .sort({ timestamp: -1 });
      res.json(logs);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching audit logs", error: error.message });
    }
  },

  // System Settings
  updateSettings: async (req, res) => {
    try {
      const settings = await Settings.findOneAndUpdate({}, req.body, {
        new: true,
        upsert: true,
      });
      res.json({ message: "Settings updated successfully", settings });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating settings", error: error.message });
    }
  },

  resolveReport: async (req, res) => {
    try {
      const { resolutionNotes } = req.body;
      const report = await Report.findByIdAndUpdate(
        req.params.id,
        {
          status: "Resolved",
          resolvedBy: req.admin._id,
          resolutionNotes,
        },
        { new: true }
      );

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json({ message: "Report resolved successfully", report });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error resolving report", error: error.message });
    }
  },

  getDashboardStats: async (req, res) => {
    try {
      const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingReports,
        recentOrders,
      ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: "Delivered" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Report.countDocuments({ status: "Pending" }),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("user", "username"),
      ]);

      res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingReports,
        recentOrders,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching dashboard stats",
        error: error.message,
      });
    }
  },
};

module.exports = adminController;



backend/controllers/adminAuthController.js
// backend/controllers/adminAuthController.js
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const AdminUser = require("../models/adminUserModels");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if 2FA is enabled
    if (admin.twoFactorEnabled) {
      return res.json({
        requiresTwoFactor: true,
        tempToken: jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
          expiresIn: "5m",
        }),
      });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Update last login
    admin.lastLogin = new Date();
    admin.lastLoginIP = req.ip;
    await admin.save();

    res.json({ token, admin: { ...admin.toJSON(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const setup2FA = async (req, res) => {
  const secret = speakeasy.generateSecret();
  const admin = await AdminUser.findById(req.admin._id);

  admin.twoFactorSecret = secret.base32;
  await admin.save();

  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
  res.json({ qrCodeUrl });
};

const verify2FA = async (req, res) => {
  const { token } = req.body;
  const admin = await AdminUser.findById(req.admin._id);

  const verified = speakeasy.totp.verify({
    secret: admin.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (verified) {
    admin.twoFactorEnabled = true;
    await admin.save();
    res.json({ message: "2FA enabled successfully" });
  } else {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = {
  loginAdmin,
  setup2FA,
  verify2FA,
};

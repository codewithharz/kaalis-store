// backend/controllers/adminDashboardController.js

// Admin dashboard features and managing other users/entities
const User = require("../models/userModels");
const Seller = require("../models/sellerModels");
const { createSystemNotification } = require("../utils/notificationUtils");
const Product = require("../models/productModels");
const Order = require("../models/orderModels");
const Category = require("../models/categoryModels");
const Payment = require("../models/paymentModels");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// backend/controllers/adminDashboardController.js
exports.getDashboardStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    // Get current period counts
    const [currentUsers, currentProducts, currentOrders, currentRevenue] =
      await Promise.all([
        User.countDocuments({
          createdAt: { $gte: previousStartDate, $lte: endDate },
        }),
        Product.countDocuments({
          createdAt: { $gte: previousStartDate, $lte: endDate },
        }),
        Order.countDocuments({
          createdAt: { $gte: previousStartDate, $lte: endDate },
        }),
        Payment.aggregate([
          {
            $match: {
              status: "success",
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),
      ]);

    // Get previous period counts
    const previousPeriodStart = new Date(previousStartDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

    const [prevUsers, prevProducts, prevOrders, prevRevenue] =
      await Promise.all([
        User.countDocuments({
          createdAt: {
            $gte: previousPeriodStart,
            $lt: previousStartDate,
          },
        }),
        Product.countDocuments({
          createdAt: {
            $gte: previousPeriodStart,
            $lt: previousStartDate,
          },
        }),
        Order.countDocuments({
          createdAt: {
            $gte: previousPeriodStart,
            $lt: previousStartDate,
          },
        }),
        Payment.aggregate([
          {
            $match: {
              status: "success",
              createdAt: {
                $gte: previousPeriodStart,
                $lt: previousStartDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),
      ]);

    // Calculate growth rates
    const calculateGrowth = (current, previous) => {
      return previous === 0
        ? current > 0
          ? 100
          : 0
        : ((current - previous) / previous) * 100;
    };

    // Calculate total counts
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    // Get daily stats for the period
    const [userStats, orderStats, productStats, revenueStats] =
      await Promise.all([
        // User stats by day
        User.aggregate([
          {
            $match: {
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              value: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        // Order stats by day
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              value: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        // Product stats by day
        Product.aggregate([
          {
            $match: {
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              value: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        // Revenue stats by day
        Payment.aggregate([
          {
            $match: {
              status: "success",
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              value: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    // Format the response
    const formatStats = (stats) =>
      stats.map((stat) => ({
        date: stat._id,
        value: stat.value,
      }));

    // Calculate growth percentages
    const currentPeriodStats = {
      users: userStats.reduce((sum, stat) => sum + stat.value, 0),
      orders: orderStats.reduce((sum, stat) => sum + stat.value, 0),
      products: productStats.reduce((sum, stat) => sum + stat.value, 0),
      revenue: revenueStats.reduce((sum, stat) => sum + stat.value, 0),
    };

    const previousPeriod = await Promise.all([
      User.countDocuments({
        createdAt: {
          $lt: previousStartDate,
          $gte: new Date(
            previousStartDate.getTime() - days * 24 * 60 * 60 * 1000
          ),
        },
      }),
      Order.countDocuments({
        createdAt: {
          $lt: previousStartDate,
          $gte: new Date(
            previousStartDate.getTime() - days * 24 * 60 * 60 * 1000
          ),
        },
      }),
      Product.countDocuments({
        createdAt: {
          $lt: previousStartDate,
          $gte: new Date(
            previousStartDate.getTime() - days * 24 * 60 * 60 * 1000
          ),
        },
      }),
      Payment.aggregate([
        {
          $match: {
            status: "success",
            createdAt: {
              $lt: previousStartDate,
              $gte: new Date(
                previousStartDate.getTime() - days * 24 * 60 * 60 * 1000
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const growth = {
      users: calculateGrowth(currentPeriodStats.users, previousPeriod[0]),
      orders: calculateGrowth(currentPeriodStats.orders, previousPeriod[1]),
      products: calculateGrowth(currentPeriodStats.products, previousPeriod[2]),
      revenue: calculateGrowth(
        currentPeriodStats.revenue,
        previousPeriod[3][0]?.total || 0
      ),
    };

    res.json({
      stats: {
        totalUsers: currentUsers,
        totalProducts: currentProducts,
        totalOrders: currentOrders,
        totalRevenue: currentRevenue[0]?.total || 0,
        userGrowth: parseFloat(
          calculateGrowth(currentUsers, prevUsers).toFixed(2)
        ),
        productGrowth: parseFloat(
          calculateGrowth(currentProducts, prevProducts).toFixed(2)
        ),
        orderGrowth: parseFloat(
          calculateGrowth(currentOrders, prevOrders).toFixed(2)
        ),
        revenueGrowth: parseFloat(
          calculateGrowth(
            currentRevenue[0]?.total || 0,
            prevRevenue[0]?.total || 0
          ).toFixed(2)
        ),
        avgUsers: parseFloat((currentUsers / days).toFixed(2)),
        avgOrders: parseFloat((currentOrders / days).toFixed(2)),
        avgProducts: parseFloat((currentProducts / days).toFixed(2)),
        avgRevenue: parseFloat(
          ((currentRevenue[0]?.total || 0) / days).toFixed(2)
        ),
      },
      userStats: formatStats(userStats),
      orderStats: formatStats(orderStats),
      productStats: formatStats(productStats),
      revenueStats: formatStats(revenueStats),
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

exports.getAdminProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;

    const products = await Product.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// Category Management
exports.getAdminCategories = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.find(query).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if category has associated products
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({
        message: "Cannot delete category with associated products",
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

// Order Management
exports.getAdminOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      dateFrom,
      dateTo,
    } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Add filters if they exist
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "user.username": { $regex: search, $options: "i" } },
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // You might want to send notifications here
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

// Regular User Management
exports.getRegularUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

exports.updateRegularUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

exports.deleteRegularUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Regular User Actions
exports.toggleBlockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    if (!user.isBlocked) {
      user.failedLoginAttempts = 0;
      user.lastFailedLogin = null;
    }

    if (user.isBlocked) {
      // Force logout when blocking
      user.isOnline = false;
      user.sessionId = null;
    }

    await user.save();

    // Log this admin action
    await logUserActivity(
      id,
      user.isBlocked ? "account_blocked" : "account_unblocked",
      {
        adminId: req.adminUser._id,
        adminUsername: req.adminUser.username,
      }
    );

    res.json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error toggling user block status",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tempPassword = crypto.randomBytes(8).toString("hex");
    user.password = await bcrypt.hash(tempPassword, 10);
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send email with temp password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset by Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 20px; border-radius: 8px;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 20px;">
            <p style="font-size: 16px;">Dear ${user.username},</p>
            
            <p style="font-size: 16px;">Your account password has been reset by an administrator.</p>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 15px;">Your temporary password is:</p>
              <p style="font-family: monospace; font-size: 20px; margin: 10px 0; color: #ff5e62;">${tempPassword}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">⚠️ For security reasons, please change your password immediately after logging in.</p>
            </div>
    
            <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
              If you did not request this password reset or have any concerns, please contact our support team immediately.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6c757d;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; font-weight: bold;">Bruthol Admin Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Log password reset
    await logUserActivity(id, "password_reset", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
    });

    res.json({
      success: true,
      message: "Password reset successful. Email sent to user.",
      tempPassword, // Keep this for UI display
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

exports.getUserActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedActivities = (user.actions || []).map((activity) => ({
      id: activity._id,
      action: activity.action,
      timestamp: activity.timestamp,
      details: activity.details,
      ip: activity.ip,
      formattedDate: new Date(activity.timestamp).toLocaleString(),
    }));

    res.json({
      success: true,
      activities: formattedActivities.sort((a, b) => b.timestamp - a.timestamp),
    });
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({
      message: "Error fetching activity log",
      error: error.message,
    });
  }
};

exports.toggle2FAUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.twoFactorEnabled = !user.twoFactorEnabled;
    if (user.twoFactorEnabled) {
      user.twoFactorSecret = crypto.randomBytes(32).toString("hex");
    } else {
      user.twoFactorSecret = null;
    }

    await user.save();

    // Log this admin action
    await logUserActivity(
      id,
      user.twoFactorEnabled ? "2fa_enabled" : "2fa_disabled",
      {
        adminId: req.adminUser._id,
        adminUsername: req.adminUser.username,
      }
    );

    res.json({
      success: true,
      message: `2FA ${user.twoFactorEnabled ? "enabled" : "disabled"
        } successfully`,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error toggling 2FA",
      error: error.message,
    });
  }
};

exports.forceLogoutUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isOnline = false;
    user.sessionId = null;
    await user.save();

    // Log the forced logout
    await logUserActivity(id, "forced_logout", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
      reason: req.body.reason || "Admin action",
    });

    res.json({
      success: true,
      message: "User forced to logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error forcing user logout",
      error: error.message,
    });
  }
};

exports.updateUserPermissions = async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.permissions = permissions;
    await user.save();

    res.json({
      success: true,
      message: "User permissions updated successfully",
      permissions: user.permissions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user permissions",
      error: error.message,
    });
  }
};

// In adminDashboardController.js

exports.getRevenueStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30; // Default to 30 days

    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    console.log("Date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days,
    });

    // Get all payments within the date range
    const payments = await Payment.find({
      status: "success",
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: 1 });

    console.log(`Found ${payments.length} payments in date range`);

    // Group payments by date
    const dailyRevenue = payments.reduce((acc, payment) => {
      const date = new Date(payment.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {});

    // Fill in the data array with amounts for each date
    const revenueData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      revenueData.push({
        date: dateStr,
        amount: dailyRevenue[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate summary statistics
    const totalRevenue = revenueData.reduce((sum, day) => sum + day.amount, 0);
    const averageDaily = totalRevenue / revenueData.length;

    // Calculate previous period for growth comparison
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);

    const previousPeriodRevenue = await Payment.aggregate([
      {
        $match: {
          status: "success",
          createdAt: {
            $gte: previousStartDate,
            $lte: previousEndDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const previousTotal = previousPeriodRevenue[0]?.total || 0;
    const growth =
      previousTotal !== 0
        ? ((totalRevenue - previousTotal) / previousTotal) * 100
        : 0;

    console.log("Revenue summary:", {
      totalRevenue,
      averageDaily,
      growth,
      dataPoints: revenueData.length,
      firstDay: revenueData[0]?.date,
      lastDay: revenueData[revenueData.length - 1]?.date,
    });

    res.json({
      success: true,
      revenueData,
      summary: {
        totalRevenue,
        averageDaily,
        growth: parseFloat(growth.toFixed(2)),
        daysAnalyzed: days,
      },
    });
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching revenue statistics",
      error: error.message,
    });
  }
};

// Helper Functions
const logUserActivity = async (userId, action, details = {}, ip = "") => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.actions.push({
      action,
      timestamp: new Date(),
      details,
      ip,
    });

    await user.save();
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};

// Reset seller's password
exports.resetSellerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const tempPassword = crypto.randomBytes(8).toString("hex");
    // Don't hash here - let the pre-save middleware handle it
    seller.user.password = tempPassword;
    seller.user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    seller.user.resetPasswordExpires = Date.now() + 3600000;

    await seller.user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: seller.user.email,
      from: process.env.EMAIL,
      subject: "Password Reset by Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 20px; border-radius: 8px;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 20px;">
            <p style="font-size: 16px;">Dear ${seller.user.username},</p>
            
            <p style="font-size: 16px;">Your seller account password has been reset by an administrator.</p>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 15px;">Your temporary password is:</p>
              <p style="font-family: monospace; font-size: 20px; margin: 10px 0; color: #ff5e62;">${tempPassword}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">⚠️ For security reasons, please change your password immediately after logging in.</p>
            </div>
    
            <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
              If you did not request this password reset or have any concerns, please contact our support team immediately.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6c757d;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; font-weight: bold;">Bruthol Admin Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Log password reset
    await logUserActivity(seller.user._id, "password_reset", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
    });

    res.json({
      success: true,
      message: "Password reset successful. Email sent to seller.",
      tempPassword,
    });
  } catch (error) {
    console.error("Reset seller password error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

// Toggle seller's 2FA status
exports.toggleSeller2FA = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.user.twoFactorEnabled = !seller.user.twoFactorEnabled;
    if (seller.user.twoFactorEnabled) {
      seller.user.twoFactorSecret = crypto.randomBytes(32).toString("hex");
    } else {
      seller.user.twoFactorSecret = null;
    }

    await seller.user.save();

    // Log 2FA toggle
    await logUserActivity(
      seller.user._id,
      seller.user.twoFactorEnabled ? "2fa_enabled" : "2fa_disabled",
      {
        adminId: req.adminUser._id,
        adminUsername: req.adminUser.username,
      }
    );

    res.json({
      success: true,
      message: `2FA ${seller.user.twoFactorEnabled ? "enabled" : "disabled"
        } successfully`,
      twoFactorEnabled: seller.user.twoFactorEnabled,
    });
  } catch (error) {
    console.error("Toggle seller 2FA error:", error);
    res
      .status(500)
      .json({ message: "Error toggling 2FA status", error: error.message });
  }
};

// Toggle seller's block status
exports.toggleSellerBlockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.user.isBlocked = !seller.user.isBlocked;
    if (!seller.user.isBlocked) {
      seller.user.failedLoginAttempts = 0;
      seller.user.lastFailedLogin = null;
    }

    // Force logout when blocking
    if (seller.user.isBlocked) {
      seller.user.isOnline = false;
      seller.user.sessionId = null;
    }

    await seller.user.save();

    // Log block status change
    await logUserActivity(
      seller.user._id,
      seller.user.isBlocked ? "account_blocked" : "account_unblocked",
      {
        adminId: req.adminUser._id,
        adminUsername: req.adminUser.username,
      }
    );

    res.json({
      success: true,
      message: `Seller ${seller.user.isBlocked ? "blocked" : "unblocked"
        } successfully`,
      isBlocked: seller.user.isBlocked,
    });
  } catch (error) {
    console.error("Toggle seller block status error:", error);
    res
      .status(500)
      .json({ message: "Error toggling block status", error: error.message });
  }
};

// Get seller's activity log
exports.getSellerActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const formattedActivities = (seller.user.actions || []).map((activity) => ({
      id: activity._id,
      action: activity.action,
      timestamp: activity.timestamp,
      details: activity.details,
      ip: activity.ip,
      formattedDate: new Date(activity.timestamp).toLocaleString(),
    }));

    res.json({
      success: true,
      activities: formattedActivities.sort((a, b) => b.timestamp - a.timestamp),
    });
  } catch (error) {
    console.error("Get seller activity error:", error);
    res.status(500).json({
      message: "Error fetching activity log",
      error: error.message,
    });
  }
};

// Force logout seller
exports.forceSellerLogout = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.user.isOnline = false;
    seller.user.sessionId = null;
    await seller.user.save();

    // Log forced logout
    await logUserActivity(seller.user._id, "forced_logout", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
      reason: req.body.reason || "Admin action",
    });

    res.json({
      success: true,
      message: "Seller forced to logout successfully",
    });
  } catch (error) {
    console.error("Force seller logout error:", error);
    res
      .status(500)
      .json({ message: "Error forcing seller logout", error: error.message });
  }
};

exports.getAdminSellers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    let query = {};

    // Add status filter if provided
    if (req.query.verificationStatus) {
      query.verificationStatus = req.query.verificationStatus;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { storeName: { $regex: search, $options: "i" } },
        { "user.username": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
      ];
    }

    const sellers = await Seller.find(query)
      .populate("user", "username email twoFactorEnabled isBlocked lastLogin")
      .populate("products")
      .select(
        "storeName storeDescription verificationStatus isVacationMode totalSales averageRating products reviews"
      )
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ [sortBy]: order === "desc" ? -1 : 1 });

    const total = await Seller.countDocuments(query);

    res.json({
      sellers,
      pagination: {
        total,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res
      .status(500)
      .json({ message: "Error fetching sellers", error: error.message });
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id)
      .populate("user", "username email")
      .populate("products");

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json(seller);
  } catch (error) {
    console.error("Error fetching seller details:", error);
    res
      .status(500)
      .json({ message: "Error fetching seller details", error: error.message });
  }
};

exports.updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus, isVerified, note } = req.body;

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Update the verification status and verified flag
    seller.verificationStatus = verificationStatus;
    seller.isVerified = isVerified;
    if (note) {
      seller.statusNote = note;
    }

    await seller.save();

    // Create system notification for the seller
    await createSystemNotification({
      userId: seller.user, // user ID of the seller
      title: "Seller Status Update",
      message: `Your seller account status has been updated to ${verificationStatus}${note ? `: ${note}` : ""
        }`,
      type: "System",
      priority: "high",
      actionUrl: "/seller/dashboard", // They can check their dashboard for more details
    });

    // Return the updated seller object
    res.json({
      success: true,
      seller: await Seller.findById(id).populate("user", "username email"),
    });
  } catch (error) {
    console.error("Error updating seller status:", error);
    res
      .status(500)
      .json({ message: "Error updating seller status", error: error.message });
  }
};

exports.getSellerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "username",
      },
    });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({ reviews: seller.reviews });
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    res
      .status(500)
      .json({ message: "Error fetching seller reviews", error: error.message });
  }
};

// Manual Payout Processing (replaces automatic cron job)
exports.processPayouts = async (req, res) => {
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
};

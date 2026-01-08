// backend/controllers/adminUserController.js

// Admin user account management
const AdminUser = require("../models/adminUserModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.createAdminUser = async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    const existingUser = await AdminUser.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    const newAdminUser = new AdminUser({
      username,
      password,
      email,
      role,
      createdAt: new Date(),
      lastLogin: null,
      failedLoginAttempts: 0,
      isBlocked: false,
      isOnline: false,
      twoFactorEnabled: false,
    });

    await newAdminUser.save();
    res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.loginAdminUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const adminUser = await AdminUser.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Check if account is blocked
    if (adminUser.isBlocked) {
      return res.status(403).json({
        message: "Account is blocked. Please contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);

    if (!isMatch) {
      // Increment failed login attempts
      adminUser.failedLoginAttempts += 1;
      adminUser.lastFailedLogin = new Date();

      // Block account if failed attempts exceed 5
      if (adminUser.failedLoginAttempts >= 5) {
        adminUser.isBlocked = true;
        await adminUser.save();
        return res.status(403).json({
          message: "Account blocked due to too many failed attempts.",
        });
      }

      await adminUser.save();
      return res.status(400).json({
        message: "Invalid credentials",
        attemptsLeft: 5 - adminUser.failedLoginAttempts,
      });
    }

    // Reset counters on successful login
    adminUser.failedLoginAttempts = 0;
    adminUser.lastFailedLogin = null;
    adminUser.lastLogin = new Date();
    adminUser.lastLoginIP = req.ip;
    adminUser.isOnline = true;
    adminUser.sessionId = crypto.randomUUID();

    await adminUser.save();

    const token = jwt.sign(
      {
        userId: adminUser._id,
        role: adminUser.role,
        sessionId: adminUser.sessionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Log the login action
    adminUser.actions.push({
      action: "login",
      timestamp: new Date(),
      ip: req.ip,
      details: { userAgent: req.headers["user-agent"] },
    });
    await adminUser.save();

    res.status(200).json({
      token,
      adminUser: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        isOnline: adminUser.isOnline,
        lastLogin: adminUser.lastLogin,
        twoFactorEnabled: adminUser.twoFactorEnabled,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await AdminUser.findById(req.adminUser._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    await logAdminActivity(admin._id, "password_changed", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

// // reset with postman, http://localhost:7788/api/admin/reset-admin-password/mongoId
// exports.resetAdminPasswordWithKey = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const deploymentKey = req.headers["x-deployment-key"];

//     // console.log("Deployment key comparison:", {
//     //   received: deploymentKey,
//     //   expected: process.env.ADMIN_DEPLOYMENT_KEY,
//     //   headers: req.headers,
//     //   userId,
//     // });

//     if (deploymentKey !== process.env.ADMIN_DEPLOYMENT_KEY) {
//       return res.status(403).json({ message: "Invalid deployment key" });
//     }

//     const admin = await AdminUser.findById(userId);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin user not found" });
//     }

//     admin.failedLoginAttempts = 0;
//     admin.lastFailedLogin = null;
//     admin.isBlocked = false;

//     const tempPassword = "Admin@123456";
//     admin.password = await bcrypt.hash(tempPassword, 10);

//     await admin.save();

//     res.json({
//       success: true,
//       message: "Admin password reset successful",
//       tempPassword,
//     });
//   } catch (error) {
//     console.error("Admin password reset error:", error);
//     res.status(500).json({
//       message: "Failed to reset admin password",
//       error: error.message,
//     });
//   }
// };

exports.getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await AdminUser.find()
      .select("-password -twoFactorSecret")
      .sort({ createdAt: -1 });

    const formattedUsers = adminUsers.map((user) => ({
      ...user.toObject(),
      lastLoginFormatted: user.lastLogin
        ? new Date(user.lastLogin).toLocaleString()
        : "Never",
      status: user.isBlocked ? "Blocked" : user.isOnline ? "Online" : "Offline",
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.toggle2FA = async (req, res) => {
  const { id } = req.params;
  try {
    const adminUser = await AdminUser.findById(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    adminUser.twoFactorEnabled = !adminUser.twoFactorEnabled;
    if (adminUser.twoFactorEnabled) {
      adminUser.twoFactorSecret = crypto.randomBytes(32).toString("hex");
    } else {
      adminUser.twoFactorSecret = null;
    }

    // Log the 2FA toggle action
    await logAdminActivity(
      id,
      adminUser.twoFactorEnabled ? "2fa_enabled" : "2fa_disabled",
      {
        performedBy: req.adminUser?._id,
        performedByUsername: req.adminUser?.username,
      },
      req.ip
    );

    await adminUser.save();
    res.json({
      success: true,
      message: `2FA ${
        adminUser.twoFactorEnabled ? "enabled" : "disabled"
      } successfully`,
      twoFactorEnabled: adminUser.twoFactorEnabled,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.toggleBlockStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const adminUser = await AdminUser.findById(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    adminUser.isBlocked = !adminUser.isBlocked;
    if (!adminUser.isBlocked) {
      adminUser.failedLoginAttempts = 0;
      adminUser.lastFailedLogin = null;
    }

    // Log the block status change
    await logAdminActivity(
      id,
      adminUser.isBlocked ? "account_blocked" : "account_unblocked",
      {
        performedBy: req.adminUser?._id,
        performedByUsername: req.adminUser?.username,
      },
      req.ip
    );

    await adminUser.save();
    res.json({
      success: true,
      message: `User ${
        adminUser.isBlocked ? "blocked" : "unblocked"
      } successfully`,
      isBlocked: adminUser.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.forceLogout = async (req, res) => {
  const { id } = req.params;
  try {
    const adminUser = await AdminUser.findById(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    adminUser.isOnline = false;
    adminUser.sessionId = null;
    await adminUser.save();

    res.json({ message: "User forced to logout successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAdminUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const adminUser = await AdminUser.findById(id).select("-password");
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    res.status(200).json(adminUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateAdminUser = async (req, res) => {
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

exports.deleteAdminUser = async (req, res) => {
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

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await AdminUser.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const tempPassword = crypto.randomBytes(8).toString("hex");
    // Don't hash here - let the pre-save middleware handle it
    admin.password = tempPassword;
    admin.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    admin.resetPasswordExpires = Date.now() + 3600000;

    await admin.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: admin.email,
      from: process.env.EMAIL,
      subject: "Admin Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 20px; border-radius: 8px;">
            <h1 style="color: white; margin: 0;">Admin Password Reset</h1>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 20px;">
            <p style="font-size: 16px;">Dear ${admin.username},</p>
            
            <p style="font-size: 16px;">Your admin account password has been reset.</p>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 15px;">Your temporary password is:</p>
              <p style="font-family: monospace; font-size: 20px; margin: 10px 0; color: #ff5e62;">${tempPassword}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">⚠️ For security reasons, please change your password immediately after logging in.</p>
            </div>
    
            <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
              If you did not request this password reset, contact the super admin immediately.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6c757d;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; font-weight: bold;">Bruthol Super Admin Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Log activity
    await logAdminActivity(id, "password_reset", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
    });

    res.json({
      success: true,
      message: "Password reset successful. Email sent to admin.",
      tempPassword,
    });
  } catch (error) {
    console.error("Reset admin password error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

exports.getUserActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const adminUser = await AdminUser.findById(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const formattedActivities = (adminUser.actions || []).map((activity) => ({
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

const logAdminActivity = async (adminUserId, action, details = {}, ip = "") => {
  try {
    const adminUser = await AdminUser.findById(adminUserId);
    if (!adminUser) return;

    adminUser.actions.push({
      action,
      timestamp: new Date(),
      details,
      ip,
    });

    await adminUser.save();
  } catch (error) {
    console.error("Error logging admin activity:", error);
  }
};

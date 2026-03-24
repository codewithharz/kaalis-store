// backend/controllers/userController.js
const User = require("../models/userModels");
const Seller = require("../models/sellerModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const {
  normalizeLocale,
  sendPasswordResetRequestEmail,
  sendVerificationEmail: sendVerificationEmailMessage,
  sendWelcomeEmail: sendWelcomeEmailMessage,
} = require("../services/emailService");

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable

exports.registerUser = async (req, res) => {
  const { username, email, password, gender, locale } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.email === email && !existingUser.emailVerified) {
        // Resend verification if unverified
        await sendVerificationEmail(existingUser, req);
        return res.status(200).json({
          success: true,
          message: "Verification email resent. Please check your inbox.",
          userId: existingUser._id,
        });
      }
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      gender,
      preferredLanguage: normalizeLocale(locale),
      emailVerified: false,
    });

    await user.save();

    // Send verification email
    await sendVerificationEmail(user, req);

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      userId: user._id,
      emailSent: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { identifier, email, password, locale } = req.body;
    const loginIdentifier = identifier || email;

    if (!loginIdentifier) {
      return res.status(400).json({ message: "Email/username is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    });

    // FIX: Check if user exists BEFORE checking emailVerified
    if (!user) {
      console.log("ERROR: User not found for identifier:", loginIdentifier);
      return res.status(400).json({ message: "User not found" });
    }

    // NOW check email verification
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in. Check your inbox!",
        resendVerification: true,
        userId: user._id,
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Account is blocked due to multiple failed login attempts",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      user.lastFailedLogin = new Date();

      if (user.failedLoginAttempts >= 5) {
        user.isBlocked = true;
      }

      await user.save();
      return res.status(400).json({
        message: "Invalid credentials",
        remainingAttempts: 5 - user.failedLoginAttempts,
      });
    }

    // Reset security counters on successful login
    user.failedLoginAttempts = 0;
    user.lastFailedLogin = null;
    user.lastLogin = new Date();
    user.isOnline = true;
    if (locale) {
      user.preferredLanguage = normalizeLocale(locale);
    }
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      message: "Authentication successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Login error:", error);
    const message =
      process.env.NODE_ENV === "production"
        ? "Authentication failed"
        : error.message;

    res.status(500).json({
      message: "Server error",
      error: message,
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Complete user profile
exports.completeUserProfile = async (req, res) => {
  const { userId } = req.params;
  const {
    username,
    email,
    firstName,
    lastName,
    gender,
    address,
    profileCompleted,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        firstName,
        lastName,
        gender,
        address,
        profileCompleted,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear user profile fields
exports.clearUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName: "",
        lastName: "",
        gender: null, // Set gender field to null
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile fields cleared successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's products
exports.getUserProducts = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("products");
    res.json(user.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email, locale } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message:
          "If a user with that email exists, a password reset link has been sent.",
      });
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    user.preferredLanguage = normalizeLocale(locale || user.preferredLanguage);
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${token}`;
    await sendPasswordResetRequestEmail({
      to: user.email,
      username: user.username,
      resetLink,
      locale: user.preferredLanguage,
    });
    res
      .status(200)
      .json({ message: "Password reset instructions sent to email" });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    // Find user by reset token and check if the token is expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration date

    await user.save();

    res.status(200).json({ message: "Password has been successfully reset" });
  } catch (error) {
    console.error("Server error during password reset:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// helper function to send verification email
const sendVerificationEmail = async (user, req) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpires = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationLink = `${frontendUrl}/verify-email/${token}`;

  await sendVerificationEmailMessage({
    to: user.email,
    username: user.username,
    verificationLink,
    locale: user.preferredLanguage,
  });
};

// Helper function to send welcome email after successful verification
const sendWelcomeEmail = async (user) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    await sendWelcomeEmailMessage({
      to: user.email,
      username: user.username,
      frontendUrl,
      locale: user.preferredLanguage,
    });
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error - welcome email is nice to have, not critical
  }
};

// FIX: Return JSON instead of HTML redirect
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(user).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return JSON response instead of redirect
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token: jwtToken,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  const { email, locale } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists for security
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a verification link has been sent.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "This email is already verified. You can log in now.",
      });
    }

    user.preferredLanguage = normalizeLocale(locale || user.preferredLanguage);
    await user.save();

    // Send new verification email
    await sendVerificationEmail(user, req);

    res.status(200).json({
      success: true,
      message: "Verification email sent! Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification email. Please try again.",
    });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id; // Assuming your auth middleware attaches the user to the request

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.becomeSeller = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { storeName, storeDescription } = req.body;

    // Verify that the authenticated user matches the userId in the route
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot perform this action on another user",
      });
    }

    const user = await User.findById(userId);
    console.log("User:", user); // Log user details for debugging

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isSeller) {
      return res
        .status(400)
        .json({ success: false, message: "User is already a seller" });
    }

    // Check if the store name already exists
    const existingStore = await Seller.findOne({ storeName: storeName });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "Store name already exists. Please choose a different name.",
      });
    }

    const newSeller = new Seller({
      user: userId,
      storeName,
      storeDescription,
    });

    await newSeller.save();

    user.isSeller = true;
    user.sellerProfile = newSeller._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Successfully became a seller",
      user: {
        ...user.toObject(),
        sellerProfile: newSeller,
      },
    });
  } catch (error) {
    console.error("Server error in becomeSeller:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Store name already exists. Please choose a different name.",
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// backend/controllers/userController.js
const User = require("../models/userModels");
const Seller = require("../models/sellerModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable

exports.registerUser = async (req, res) => {
  const { username, email, password, gender } = req.body;

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
    const { identifier, email, password } = req.body;
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
  const { email } = req.body;
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
    await user.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    // Mail options
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 20px; border-radius: 8px;">
            <h1 style="color: white; margin: 0;">Password Reset Request</h1>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 20px;">
            <p style="font-size: 16px;">Dear ${user.username},</p>
            
            <p style="font-size: 16px;">You have requested to reset your password.</p>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 15px;">Click the button below to reset your password:</p>
              <a href="${resetLink}" 
                 style="display: inline-block; margin-top: 15px; background: linear-gradient(to right, #ff934b, #ff5e62); 
                        color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
              <p style="margin-top: 15px; font-size: 13px;">Or copy this link: ${resetLink}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">⚠️ This link will expire in 1 hour for security reasons.</p>
            </div>
    
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #721c24; font-size: 14px;">
                🔒 Security Notes:
                <ul style="margin: 10px 0;">
                  <li>If you did not request this reset, please ignore this email.</li>
                  <li>Never share this link with anyone.</li>
                  <li>Our team will never ask for your password.</li>
                  <li>Always ensure you're on our official website.</li>
                </ul>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6c757d;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0; font-weight: bold;">Bruthol Team</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
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
    subject: "Verify Your Email - Bruthol",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 30px; border-radius: 12px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Bruthol!</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa; border-radius: 12px; margin-top: 20px;">
          <p style="font-size: 18px; color: #333;">Hey <strong>${user.username}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            You're one click away from activating your account!
          </p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationLink}"
               style="background: linear-gradient(to right, #ff934b, #ff5e62); color: white; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 94, 98, 0.4);">
              Verify Email Now
            </a>
          </div>
          <p style="font-size: 14px; color: #888;">
            Or copy this link: <br/>
            <a href="${verificationLink}" style="color: #ff5e62;">${verificationLink}</a>
          </p>
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              This link expires in <strong>15 minutes</strong> for security.
            </p>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #aaa; font-size: 13px;">
          <p>© 2025 Bruthol. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Helper function to send welcome email after successful verification
const sendWelcomeEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL,
    subject: "Welcome to Bruthol! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 30px; border-radius: 12px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 Welcome to Bruthol!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 12px; margin-top: 20px;">
          <p style="font-size: 18px; color: #333;">Hey <strong>${user.username}</strong>,</p>
          
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Your email has been successfully verified and you're now logged into your Bruthol account! 🚀
          </p>

          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #155724; font-size: 15px;">
              ✅ <strong>What's Next?</strong>
            </p>
            <ul style="color: #155724; margin: 10px 0; padding-left: 20px;">
              <li>Complete your profile to get personalized recommendations</li>
              <li>Browse our amazing products and deals</li>
              <li>Add items to your wishlist</li>
              <li>Become a seller and start your business journey</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}"
               style="background: linear-gradient(to right, #ff934b, #ff5e62); color: white; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 94, 98, 0.4); display: inline-block;">
              Start Shopping
            </a>
          </div>

          <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2196F3;">
            <p style="margin: 0; color: #0c5460; font-size: 14px;">
              <strong>💡 Quick Tip:</strong> Add your delivery address now to checkout faster later!
            </p>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>🔒 Security Note:</strong> You were automatically logged in after verifying your email. If this wasn't you, please contact our support team immediately.
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
            <p style="font-size: 14px; color: #6c757d; margin-bottom: 10px;">
              Need help? We're here for you!
            </p>
            <p style="font-size: 13px; color: #6c757d; margin: 5px 0;">
              📧 Email: support@bruthol.com<br/>
              💬 Live Chat: Available 24/7 on our website<br/>
              📱 Help Center: <a href="${frontendUrl}/page/help/frequently-asked-questions" style="color: #ff5e62;">FAQ</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #aaa; font-size: 13px;">
          <p style="margin: 5px 0;">Happy Shopping! 🛍️</p>
          <p style="margin: 5px 0; font-weight: bold; color: #666;">The Bruthol Team</p>
          <p style="margin: 15px 0 5px 0;">© 2025 Bruthol. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
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
  const { email } = req.body;

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

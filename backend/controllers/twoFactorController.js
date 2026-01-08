// backend/controllers/twoFactorController.js
const User = require("../models/userModels");
const { client, serviceSid } = require("../config/twilioConfig");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;

// Send verification code
exports.sendVerificationCode = async (req, res) => {
  const { phoneNumber } = req.body;
  const { userId } = req.params;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format phone number to E.164 format if needed
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith("+")) {
      formattedPhoneNumber = `+${phoneNumber}`;
    }

    // Send the verification code via Twilio
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: formattedPhoneNumber,
        channel: "sms", // Can also use "call" for voice
      });

    // Update user's phone number if not already set
    if (user.phoneNumber !== formattedPhoneNumber) {
      user.phoneNumber = formattedPhoneNumber;
      user.phoneVerified = false;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
      sid: verification.sid,
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
      error: error.message,
    });
  }
};

// Verify the code and enable 2FA
exports.verifyCode = async (req, res) => {
  const { phoneNumber, code } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format phone number if needed
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith("+")) {
      formattedPhoneNumber = `+${phoneNumber}`;
    }

    // Verify the code with Twilio
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: formattedPhoneNumber,
        code: code,
      });

    if (verificationCheck.status === "approved") {
      // Update user's phone verification status and enable 2FA
      user.phoneVerified = true;
      user.twoFactorEnabled = true;
      // Generate a random secret for future verifications
      user.twoFactorSecret = crypto.randomBytes(16).toString("hex");
      await user.save();

      res.status(200).json({
        success: true,
        message: "Phone verified and 2FA enabled",
        phoneVerified: true,
        twoFactorEnabled: true,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid verification code",
        status: verificationCheck.status,
      });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify code",
      error: error.message,
    });
  }
};

// Disable 2FA for a user
exports.disableTwoFactor = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Two-factor authentication disabled",
    });
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Failed to disable two-factor authentication",
      error: error.message,
    });
  }
};

// Login verification for 2FA
exports.loginVerification = async (req, res) => {
  const { userId, phoneNumber, code } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format phone number if needed
    let formattedPhoneNumber = phoneNumber || user.phoneNumber;
    if (!formattedPhoneNumber.startsWith("+")) {
      formattedPhoneNumber = `+${formattedPhoneNumber}`;
    }

    // Verify the code with Twilio
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: formattedPhoneNumber,
        code: code,
      });

    if (verificationCheck.status === "approved") {
      // Generate full token for authenticated user
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1d",
      });

      // Reset security counters on successful login
      user.failedLoginAttempts = 0;
      user.lastFailedLogin = null;
      user.lastLogin = new Date();
      user.isOnline = true;
      user.twoFactorTemp = undefined; // Clear temporary token
      await user.save();

      res.json({
        success: true,
        message: "Two-factor authentication successful",
        token,
        userId: user._id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid verification code",
        status: verificationCheck.status,
      });
    }
  } catch (error) {
    console.error("Error during 2FA login verification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify code",
      error: error.message,
    });
  }
};

// Initialize 2FA during login process
exports.initLogin2FA = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.phoneNumber || !user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Two-factor authentication not enabled for this user",
      });
    }

    // Generate a temporary token that only gives limited access
    const tempToken = jwt.sign(
      { userId: user._id, requiresTwoFactor: true },
      JWT_SECRET,
      { expiresIn: "10m" } // Short expiration for security
    );

    // Store the temporary token
    user.twoFactorTemp = tempToken;
    await user.save();

    // Send the verification code
    await client.verify.v2.services(serviceSid).verifications.create({
      to: user.phoneNumber,
      channel: "sms",
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent",
      requiresTwoFactor: true,
      userId: user._id,
      tempToken,
    });
  } catch (error) {
    console.error("Error initializing 2FA login:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize two-factor authentication",
      error: error.message,
    });
  }
};

const SupportMessage = require("../models/supportMessageModel");
const { getPlatformSettings } = require("../services/platformSettingsService");
const { sendSupportContactEmail } = require("../services/emailService");

// Create support message (Public contact form)
const createSupportMessage = async (req, res) => {
  const { name, email, subject, message, locale } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Create and save the support message in database
    const supportMessage = new SupportMessage({ name, email, subject, message });
    await supportMessage.save();

    // 2. Dispatch email notification to support team
    try {
      const settings = await getPlatformSettings();
      const supportEmail = settings?.general?.supportEmail?.trim() || process.env.EMAIL;

      if (supportEmail) {
        await sendSupportContactEmail({
          to: supportEmail,
          name,
          email,
          subject,
          message,
          locale: locale || "en",
        });
      } else {
        console.warn("No support email configured or found in environment variables.");
      }
    } catch (emailError) {
      // Log email error, but do not fail the request since database write was successful
      console.error("Failed to send support email notification:", emailError);
    }

    res.status(201).json({
      message: "Your message has been sent successfully. We will get back to you soon.",
      supportMessage,
    });
  } catch (error) {
    console.error("Error creating support message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all support messages (Admin only)
const getSupportMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching support messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resolve support message (Admin only)
const resolveSupportMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const supportMessage = await SupportMessage.findById(id);
    if (!supportMessage) {
      return res.status(404).json({ message: "Support message not found" });
    }

    supportMessage.isResolved = true;
    await supportMessage.save();

    res.status(200).json({
      message: "Support message resolved successfully",
      supportMessage,
    });
  } catch (error) {
    console.error("Error resolving support message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createSupportMessage,
  getSupportMessages,
  resolveSupportMessage,
};

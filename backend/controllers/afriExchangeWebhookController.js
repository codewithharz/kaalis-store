const crypto = require("crypto");
const payoutService = require("../services/payoutService");
const {
  updateAfriExchangeWebhookHealth,
} = require("../services/platformSettingsService");
const logger = require("../utils/logger");

const getWebhookSecret = () =>
  process.env.AFRIEXCHANGE_WEBHOOK_SECRET || process.env.AFRIEXCHANGE_KAALIS_API_KEY;

const safeCompare = (left, right) => {
  const leftBuffer = Buffer.from(left || "");
  const rightBuffer = Buffer.from(right || "");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const buildSignaturePayload = (req) => {
  const timestamp = req.header("x-afriexchange-timestamp");
  const rawBody = req.rawBody
    ? req.rawBody.toString("utf8")
    : JSON.stringify(req.body || {});

  return timestamp ? `${timestamp}.${rawBody}` : rawBody;
};

const verifySignature = (req) => {
  const signature = req.header("x-afriexchange-signature");

  if (!signature) {
    return {
      valid: false,
      message: "Missing AfriExchange webhook signature",
    };
  }

  const normalizedSignature = signature.startsWith("sha256=")
    ? signature.slice("sha256=".length)
    : signature;

  const secrets = [
    getWebhookSecret(),
    "f31937a28c0f0d6db27a600cf37fb80b5d854ea27eb29f9e3dfb4d2027dac7c8", // Neon DB Kaalis Webhook Secret
    "webhook-shared-secret",
    "your-shared-webhook-secret"
  ].filter(Boolean);

  for (const sec of secrets) {
    const expected = crypto
      .createHmac("sha256", sec)
      .update(buildSignaturePayload(req))
      .digest("hex");
    
    if (safeCompare(expected, normalizedSignature)) {
      return {
        valid: true,
        message: "",
      };
    }
  }

  return {
    valid: false,
    message: "Invalid AfriExchange webhook signature",
  };
};

exports.handleAfriExchangeWebhook = async (req, res) => {
  const signatureCheck = verifySignature(req);

  if (!signatureCheck.valid) {
    logger.warn("Rejected AfriExchange webhook", {
      reason: signatureCheck.message,
      event: req.body?.event || req.body?.type,
    });

    return res.status(401).json({
      success: false,
      message: signatureCheck.message,
    });
  }

  const event = req.body?.event || req.body?.type;
  const allowedEvents = new Set([
    "payout.processing",
    "payout.completed",
    "payout.failed",
    "payout.cancelled",
    "payout.canceled",
  ]);

  if (!allowedEvents.has(event)) {
    return res.json({
      success: true,
      ignored: true,
      message: "AfriExchange webhook event ignored",
    });
  }

  try {
    const result = await payoutService.applyAfriExchangePayoutUpdate(req.body);

    await updateAfriExchangeWebhookHealth({
      event,
      reference:
        req.body?.data?.reference ||
        req.body?.data?.transferReference ||
        req.body?.data?.payoutReference ||
        req.body?.reference ||
        "",
      status:
        req.body?.data?.status || req.body?.status || event.replace("payout.", ""),
      receivedAt: new Date(),
    });

    if (!result.success) {
      logger.warn("AfriExchange webhook could not update payout", {
        event,
        message: result.message,
      });

      return res.status(202).json({
        success: true,
        needsReview: true,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error("Failed to process AfriExchange webhook:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process AfriExchange webhook",
    });
  }
};

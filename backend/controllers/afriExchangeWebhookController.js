const crypto = require("crypto");
const payoutService = require("../services/payoutService");
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
  const secret = getWebhookSecret();
  const signature = req.header("x-afriexchange-signature");

  if (!secret) {
    return {
      valid: false,
      message: "AfriExchange webhook secret is not configured",
    };
  }

  if (!signature) {
    return {
      valid: false,
      message: "Missing AfriExchange webhook signature",
    };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(buildSignaturePayload(req))
    .digest("hex");
  const normalizedSignature = signature.startsWith("sha256=")
    ? signature.slice("sha256=".length)
    : signature;

  return {
    valid: safeCompare(expected, normalizedSignature),
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

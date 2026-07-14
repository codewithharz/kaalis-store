const crypto = require("crypto");
const mongoose = require("mongoose");
const payoutService = require("../services/payoutService");
const {
  updateAfriExchangeWebhookHealth,
} = require("../services/platformSettingsService");
const logger = require("../utils/logger");

// ── Secret resolution ────────────────────────────────────────────────────────
// Only use the value from environment variables — never hardcode fallback
// secrets in source code. The old hardcoded strings have been removed because:
//   - "f31937a28…" appeared in git history and should be considered compromised.
//   - "webhook-shared-secret" / "your-shared-webhook-secret" are trivially guessable.
// Set AFRIEXCHANGE_WEBHOOK_SECRET in your .env to a strong, randomly-generated
// secret that you obtain from the AfriExchange merchant dashboard.
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

  const secret = getWebhookSecret();

  if (!secret) {
    logger.error(
      "AfriExchange webhook secret is not configured. Set AFRIEXCHANGE_WEBHOOK_SECRET in your environment."
    );
    return {
      valid: false,
      message: "Webhook secret not configured on server",
    };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(buildSignaturePayload(req))
    .digest("hex");

  if (safeCompare(expected, normalizedSignature)) {
    return { valid: true, message: "" };
  }

  return {
    valid: false,
    message: "Invalid AfriExchange webhook signature",
  };
};

// ── Collection event handler ─────────────────────────────────────────────────
// Handles buyer-side collection events (charge confirmations, failures, reversals).
// Previously these were silently ignored, which meant the system never learned
// about failed or reversed charges and could not update payment records.
const handleCollectionEvent = async (event, body) => {
  const Payment = require("../models/paymentModels");
  const Order = require("../models/orderModels");

  const reference =
    body?.data?.reference ||
    body?.data?.collectionReference ||
    body?.reference ||
    "";

  if (!reference) {
    logger.warn("AfriExchange collection webhook missing reference", { event, body });
    return { success: false, message: "Missing collection reference" };
  }

  const payment = await Payment.findOne({ reference });

  if (!payment) {
    logger.warn("AfriExchange collection webhook: payment record not found", {
      event,
      reference,
    });
    return { success: false, message: `Payment record not found for reference: ${reference}` };
  }

  if (event === "collection.completed") {
    // Confirm the payment now that AfriExchange has verified the charge.
    payment.status = "success";
    await payment.save();

    // Ensure the linked order reflects the confirmed payment.
    await Order.findByIdAndUpdate(payment.orderId, {
      $set: { status: "Processing", transactionId: reference },
    });

    logger.info("AfriExchange collection confirmed via webhook", {
      reference,
      paymentId: payment._id,
    });
    return { success: true, message: "Collection confirmed" };
  }

  if (
    event === "collection.failed" ||
    event === "collection.reversed" ||
    event === "collection.cancelled" ||
    event === "collection.canceled"
  ) {
    // Mark the payment as failed so the duplicate-charge guard in
    // paymentController won't block a legitimate retry after a reversal.
    payment.status = "failed";
    await payment.save();

    logger.warn("AfriExchange collection failed/reversed via webhook", {
      event,
      reference,
      paymentId: payment._id,
    });

    return {
      success: true,
      message: `Collection marked as failed (event: ${event})`,
    };
  }

  return { success: true, message: "Collection event acknowledged" };
};

// ── Main webhook handler ─────────────────────────────────────────────────────
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

  const payoutEvents = new Set([
    "payout.processing",
    "payout.completed",
    "payout.failed",
    "payout.cancelled",
    "payout.canceled",
  ]);

  const collectionEvents = new Set([
    "collection.completed",
    "collection.failed",
    "collection.reversed",
    "collection.cancelled",
    "collection.canceled",
  ]);

  // ── Ignore any event type we don't handle ──────────────────────────────────
  if (!payoutEvents.has(event) && !collectionEvents.has(event)) {
    return res.json({
      success: true,
      ignored: true,
      message: "AfriExchange webhook event ignored",
    });
  }

  try {
    let result;

    if (collectionEvents.has(event)) {
      // ── Buyer collection events ────────────────────────────────────────────
      result = await handleCollectionEvent(event, req.body);
    } else {
      // ── Vendor payout events ───────────────────────────────────────────────
      result = await payoutService.applyAfriExchangePayoutUpdate(req.body);
    }

    // Always update the webhook health heartbeat regardless of event type.
    await updateAfriExchangeWebhookHealth({
      event,
      reference:
        req.body?.data?.reference ||
        req.body?.data?.transferReference ||
        req.body?.data?.payoutReference ||
        req.body?.data?.collectionReference ||
        req.body?.reference ||
        "",
      status:
        req.body?.data?.status ||
        req.body?.status ||
        event.split(".")[1] ||
        "",
      receivedAt: new Date(),
    });

    if (!result.success) {
      logger.warn("AfriExchange webhook could not update record", {
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

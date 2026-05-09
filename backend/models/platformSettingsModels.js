const mongoose = require("mongoose");

const shippingZoneSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    regions: { type: String, trim: true, default: "" },
    rate: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const tierSettingsSchema = new mongoose.Schema(
  {
    holdingPeriod: { type: Number, default: 3, min: 0 },
    minimumAmount: { type: Number, default: 1000, min: 0 },
    batchSize: { type: Number, default: 100, min: 1 },
    vendorSharePercent: { type: Number, default: 92, min: 0, max: 100 },
  },
  { _id: false }
);

const platformSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "default",
      immutable: true,
    },
    general: {
      platformName: { type: String, trim: true, default: "Kaalis" },
      supportEmail: { type: String, trim: true, default: "" },
      currency: { type: String, trim: true, default: "NGN" },
      timezone: { type: String, trim: true, default: "WAT" },
      maintenanceMode: { type: Boolean, default: false },
    },
    payment: {
      checkoutPlatformFeePercent: {
        type: Number,
        default: 8,
        min: 0,
        max: 100,
      },
    },
    payouts: {
      defaultTier: {
        type: tierSettingsSchema,
        default: () => ({}),
      },
      premiumTier: {
        type: tierSettingsSchema,
        default: () => ({
          holdingPeriod: 1,
          minimumAmount: 500,
          batchSize: 200,
          vendorSharePercent: 95,
        }),
      },
      notifications: {
        sendVendorNotifications: { type: Boolean, default: true },
        notifyOnFailure: { type: Boolean, default: true },
        notifyBeforePayout: { type: Boolean, default: true },
        reminderHours: { type: Number, default: 24, min: 0 },
      },
      retryStrategy: {
        maxAttempts: { type: Number, default: 3, min: 0 },
        delays: { type: [Number], default: [24, 48, 72] },
      },
    },
    shipping: {
      baseCost: { type: Number, default: 10, min: 0 },
      freeThreshold: { type: Number, default: 100, min: 0 },
      zones: { type: [shippingZoneSchema], default: [] },
    },
    afriExchange: {
      linkedMerchantId: { type: String, trim: true, default: "" },
      linkedMerchantName: { type: String, trim: true, default: "Kaalis Store" },
      webAppUrl: { type: String, trim: true, default: "" },
      webhookCallbackUrl: { type: String, trim: true, default: "" },
      defaultToken: { type: String, trim: true, default: "CT" },
      allowedTokens: { type: [String], default: ["CT"] },
      rails: {
        afriExchangeEnabled: { type: Boolean, default: true },
        paystackEnabled: { type: Boolean, default: true },
        opayEnabled: { type: Boolean, default: true },
      },
      notes: {
        settlementReason: {
          type: String,
          trim: true,
          default: "CT currently solves Kaalis XOF settlement needs.",
        },
        operatorNote: { type: String, trim: true, default: "" },
      },
      health: {
        lastWebhookReceivedAt: { type: Date, default: null },
        lastWebhookEvent: { type: String, trim: true, default: "" },
        lastWebhookReference: { type: String, trim: true, default: "" },
        lastWebhookStatus: { type: String, trim: true, default: "" },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PlatformSettings", platformSettingsSchema);

const PlatformSettings = require("../models/platformSettingsModels");

const DEFAULT_AFRIEXCHANGE_WEB_APP_URL =
  process.env.AFRIEXCHANGE_WEB_APP_URL ||
  process.env.VITE_AFRIEXCHANGE_WEB_URL ||
  "https://afri-x.vercel.app/";
const DEFAULT_AFRIEXCHANGE_LINKED_MERCHANT_ID =
  process.env.AFRIEXCHANGE_LINKED_MERCHANT_ID ||
  "04b76353-6d94-419d-9b10-4e84161575c1";
const DEFAULT_AFRIEXCHANGE_LINKED_MERCHANT_NAME =
  process.env.AFRIEXCHANGE_LINKED_MERCHANT_NAME || "Kaalis Store";
const DEFAULT_AFRIEXCHANGE_WEBHOOK_CALLBACK_URL =
  process.env.AFRIEXCHANGE_WEBHOOK_CALLBACK_URL ||
  "http://localhost:7788/api/afriexchange/webhooks";

const DEFAULT_PLATFORM_SETTINGS = {
  general: {
    platformName: "Kaalis",
    supportEmail: "",
    currency: "NGN",
    timezone: "WAT",
    maintenanceMode: false,
  },
  payment: {
    checkoutPlatformFeePercent: 8,
  },
  payouts: {
    defaultTier: {
      holdingPeriod: 3,
      minimumAmount: 1000,
      batchSize: 100,
      vendorSharePercent: 92,
    },
    premiumTier: {
      holdingPeriod: 1,
      minimumAmount: 500,
      batchSize: 200,
      vendorSharePercent: 95,
    },
    notifications: {
      sendVendorNotifications: true,
      notifyOnFailure: true,
      notifyBeforePayout: true,
      reminderHours: 24,
    },
    retryStrategy: {
      maxAttempts: 3,
      delays: [24, 48, 72],
    },
  },
  shipping: {
    baseCost: 10,
    freeThreshold: 100,
    zones: [],
  },
  afriExchange: {
    linkedMerchantId: DEFAULT_AFRIEXCHANGE_LINKED_MERCHANT_ID,
    linkedMerchantName: DEFAULT_AFRIEXCHANGE_LINKED_MERCHANT_NAME,
    webAppUrl: DEFAULT_AFRIEXCHANGE_WEB_APP_URL,
    webhookCallbackUrl: DEFAULT_AFRIEXCHANGE_WEBHOOK_CALLBACK_URL,
    defaultToken: "CT",
    allowedTokens: ["CT"],
    rails: {
      afriExchangeEnabled: true,
      paystackEnabled: true,
      opayEnabled: true,
    },
    notes: {
      settlementReason: "CT currently solves Kaalis XOF settlement needs.",
      operatorNote: "",
    },
    health: {
      lastWebhookReceivedAt: null,
      lastWebhookEvent: "",
      lastWebhookReference: "",
      lastWebhookStatus: "",
    },
  },
};

const deepMerge = (base, overrides) => {
  if (Array.isArray(base)) {
    return Array.isArray(overrides) ? overrides : base;
  }

  if (
    base &&
    typeof base === "object" &&
    overrides &&
    typeof overrides === "object"
  ) {
    const result = { ...base };
    for (const key of Object.keys(overrides)) {
      result[key] =
        key in base ? deepMerge(base[key], overrides[key]) : overrides[key];
    }
    return result;
  }

  return overrides ?? base;
};

const sanitizeForPersistence = (payload = {}) => ({
  general: {
    platformName: payload.general?.platformName?.trim() || "Kaalis",
    supportEmail: payload.general?.supportEmail?.trim() || "",
    currency: payload.general?.currency || "NGN",
    timezone: payload.general?.timezone || "WAT",
    maintenanceMode: Boolean(payload.general?.maintenanceMode),
  },
  payment: {
    checkoutPlatformFeePercent: Number(
      payload.payment?.checkoutPlatformFeePercent ?? 8
    ),
  },
  payouts: {
    defaultTier: {
      holdingPeriod: Number(payload.payouts?.defaultTier?.holdingPeriod ?? 3),
      minimumAmount: Number(payload.payouts?.defaultTier?.minimumAmount ?? 1000),
      batchSize: Number(payload.payouts?.defaultTier?.batchSize ?? 100),
      vendorSharePercent: Number(
        payload.payouts?.defaultTier?.vendorSharePercent ?? 92
      ),
    },
    premiumTier: {
      holdingPeriod: Number(payload.payouts?.premiumTier?.holdingPeriod ?? 1),
      minimumAmount: Number(payload.payouts?.premiumTier?.minimumAmount ?? 500),
      batchSize: Number(payload.payouts?.premiumTier?.batchSize ?? 200),
      vendorSharePercent: Number(
        payload.payouts?.premiumTier?.vendorSharePercent ?? 95
      ),
    },
    notifications: {
      sendVendorNotifications:
        payload.payouts?.notifications?.sendVendorNotifications ?? true,
      notifyOnFailure: payload.payouts?.notifications?.notifyOnFailure ?? true,
      notifyBeforePayout:
        payload.payouts?.notifications?.notifyBeforePayout ?? true,
      reminderHours: Number(
        payload.payouts?.notifications?.reminderHours ?? 24
      ),
    },
    retryStrategy: {
      maxAttempts: Number(payload.payouts?.retryStrategy?.maxAttempts ?? 3),
      delays: Array.isArray(payload.payouts?.retryStrategy?.delays)
        ? payload.payouts.retryStrategy.delays.map((value) => Number(value))
        : [24, 48, 72],
    },
  },
  shipping: {
    baseCost: Number(payload.shipping?.baseCost ?? 10),
    freeThreshold: Number(payload.shipping?.freeThreshold ?? 100),
    zones: Array.isArray(payload.shipping?.zones)
      ? payload.shipping.zones.map((zone) => ({
          name: zone?.name?.trim?.() || "",
          regions: zone?.regions?.trim?.() || "",
          rate: Number(zone?.rate ?? 0),
        }))
      : [],
  },
  afriExchange: {
    linkedMerchantId: payload.afriExchange?.linkedMerchantId?.trim() || "",
    linkedMerchantName:
      payload.afriExchange?.linkedMerchantName?.trim() || "Kaalis Store",
    webAppUrl: payload.afriExchange?.webAppUrl?.trim() || "",
    webhookCallbackUrl: payload.afriExchange?.webhookCallbackUrl?.trim() || "",
    defaultToken: payload.afriExchange?.defaultToken || "CT",
    allowedTokens: Array.isArray(payload.afriExchange?.allowedTokens)
      ? payload.afriExchange.allowedTokens
          .map((value) => String(value || "").trim().toUpperCase())
          .filter(Boolean)
      : ["CT"],
    rails: {
      afriExchangeEnabled:
        payload.afriExchange?.rails?.afriExchangeEnabled ?? true,
      paystackEnabled: payload.afriExchange?.rails?.paystackEnabled ?? true,
      opayEnabled: payload.afriExchange?.rails?.opayEnabled ?? true,
    },
    notes: {
      settlementReason:
        payload.afriExchange?.notes?.settlementReason?.trim() ||
        "CT currently solves Kaalis XOF settlement needs.",
      operatorNote: payload.afriExchange?.notes?.operatorNote?.trim() || "",
    },
    health: {
      lastWebhookReceivedAt:
        payload.afriExchange?.health?.lastWebhookReceivedAt || null,
      lastWebhookEvent:
        payload.afriExchange?.health?.lastWebhookEvent?.trim() || "",
      lastWebhookReference:
        payload.afriExchange?.health?.lastWebhookReference?.trim() || "",
      lastWebhookStatus:
        payload.afriExchange?.health?.lastWebhookStatus?.trim() || "",
    },
  },
});

const buildRuntimeInfo = (settings) => {
  const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY || "";
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || "";
  const afriExchangeApiUrl = process.env.AFRIEXCHANGE_API_URL || "";
  const afriExchangeApiKey = process.env.AFRIEXCHANGE_KAALIS_API_KEY || "";
  const afriExchangeWebhookSecret = process.env.AFRIEXCHANGE_WEBHOOK_SECRET || "";
  const afriExchangeConfigured = Boolean(
    afriExchangeApiUrl && afriExchangeWebhookSecret && afriExchangeApiKey
  );

  return {
    integrations: {
      paystack: {
        enabled: Boolean(paystackPublicKey && paystackSecretKey),
        publicKeyConfigured: Boolean(paystackPublicKey),
        secretKeyConfigured: Boolean(paystackSecretKey),
      },
      opay: {
        enabled: Boolean(
          process.env.OPAY_MERCHANT_ID && process.env.OPAY_PRIVATE_KEY
        ),
      },
      afriExchange: {
        enabled: afriExchangeConfigured,
        apiBaseUrl: afriExchangeApiUrl,
        apiKeyConfigured: Boolean(afriExchangeApiKey),
        webhookSecretConfigured: Boolean(afriExchangeWebhookSecret),
      },
    },
    notes: {
      checkoutFee:
        "Checkout fee percent is used for order split creation. Payout tiers are applied later during vendor settlement.",
      payoutFees:
        "Vendor payout tiers can differ from checkout fee splits. Premium vendors may receive a higher settlement share.",
      afriExchange:
        "AfriExchange secrets remain env-backed. Merchant linkage, token strategy, and callback expectations can be managed from platform settings.",
    },
  };
};

const getStoredSettings = async () => {
  const doc = await PlatformSettings.findOne({ key: "default" }).lean();
  return doc || null;
};

const getPlatformSettings = async () => {
  const stored = await getStoredSettings();
  const merged = deepMerge(DEFAULT_PLATFORM_SETTINGS, stored || {});
  return {
    ...merged,
    runtime: buildRuntimeInfo(merged),
  };
};

const upsertPlatformSettings = async (payload) => {
  const sanitized = sanitizeForPersistence(payload);
  await PlatformSettings.findOneAndUpdate(
    { key: "default" },
    { $set: sanitized, $setOnInsert: { key: "default" } },
    { new: true, upsert: true, runValidators: true }
  );
  return getPlatformSettings();
};

const updateAfriExchangeWebhookHealth = async ({
  event = "",
  reference = "",
  status = "",
  receivedAt = new Date(),
} = {}) => {
  await PlatformSettings.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        "afriExchange.health.lastWebhookReceivedAt": receivedAt,
        "afriExchange.health.lastWebhookEvent": String(event || "").trim(),
        "afriExchange.health.lastWebhookReference": String(reference || "").trim(),
        "afriExchange.health.lastWebhookStatus": String(status || "").trim(),
      },
      $setOnInsert: { key: "default" },
    },
    { upsert: true, runValidators: true }
  );
};

const getCheckoutFeeRate = async () => {
  const settings = await getPlatformSettings();
  return Number(settings.payment.checkoutPlatformFeePercent || 8) / 100;
};

const getPayoutConfigSnapshot = async () => {
  const settings = await getPlatformSettings();
  const defaultTier = settings.payouts.defaultTier;
  const premiumTier = settings.payouts.premiumTier;

  return {
    schedules: {
      default: {
        holdingPeriod: defaultTier.holdingPeriod,
        minimumAmount: defaultTier.minimumAmount,
        batchSize: defaultTier.batchSize,
      },
      premium: {
        holdingPeriod: premiumTier.holdingPeriod,
        minimumAmount: premiumTier.minimumAmount,
        batchSize: premiumTier.batchSize,
      },
    },
    retryStrategy: settings.payouts.retryStrategy,
    fees: {
      default: {
        vendorShare: defaultTier.vendorSharePercent / 100,
        platformFee: (100 - defaultTier.vendorSharePercent) / 100,
      },
      premium: {
        vendorShare: premiumTier.vendorSharePercent / 100,
        platformFee: (100 - premiumTier.vendorSharePercent) / 100,
      },
    },
    notifications: settings.payouts.notifications,
  };
};

module.exports = {
  DEFAULT_PLATFORM_SETTINGS,
  getPlatformSettings,
  upsertPlatformSettings,
  getCheckoutFeeRate,
  getPayoutConfigSnapshot,
  updateAfriExchangeWebhookHealth,
};

import apiClient from "@/api/axios";

const STORAGE_KEY = "kaalisPlatformRuntimeSettings";

const DEFAULT_SETTINGS = {
  general: {
    platformName: "Kaalis",
    currency: "NGN",
    timezone: "WAT",
    maintenanceMode: false,
  },
  payment: {
    checkoutPlatformFeePercent: 8,
  },
  runtime: {
    integrations: {
      paystack: { enabled: false },
      opay: { enabled: false },
      afriExchange: { enabled: false },
    },
    notes: {},
  },
};

const normalizeSettings = (data = {}) => ({
  ...DEFAULT_SETTINGS,
  ...data,
  general: {
    ...DEFAULT_SETTINGS.general,
    ...(data.general || {}),
  },
  payment: {
    ...DEFAULT_SETTINGS.payment,
    ...(data.payment || {}),
  },
  runtime: {
    ...DEFAULT_SETTINGS.runtime,
    ...(data.runtime || {}),
  },
});

export const getCachedPlatformRuntimeSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return normalizeSettings(JSON.parse(stored));
  } catch (error) {
    console.warn("Failed to read cached platform settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const fetchPlatformRuntimeSettings = async () => {
  const response = await apiClient.get("/platform-settings/runtime");
  const normalized = normalizeSettings(response.data || {});
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const getCheckoutPlatformFeeRate = () =>
  Number(
    getCachedPlatformRuntimeSettings().payment.checkoutPlatformFeePercent || 8
  ) / 100;

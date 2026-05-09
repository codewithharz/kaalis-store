const {
  getPlatformSettings,
  upsertPlatformSettings,
} = require("../services/platformSettingsService");

exports.getAdminPlatformSettings = async (req, res) => {
  try {
    const settings = await getPlatformSettings();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching admin platform settings:", error);
    res.status(500).json({
      message: "Failed to fetch platform settings",
      error: error.message,
    });
  }
};

exports.updateAdminPlatformSettings = async (req, res) => {
  try {
    const settings = await upsertPlatformSettings(req.body || {});
    res.json({
      message: "Platform settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating admin platform settings:", error);
    res.status(500).json({
      message: "Failed to update platform settings",
      error: error.message,
    });
  }
};

exports.getPublicRuntimeSettings = async (req, res) => {
  try {
    const settings = await getPlatformSettings();
    res.json({
      general: {
        platformName: settings.general.platformName,
        currency: settings.general.currency,
        timezone: settings.general.timezone,
        maintenanceMode: settings.general.maintenanceMode,
      },
      payment: {
        checkoutPlatformFeePercent: settings.payment.checkoutPlatformFeePercent,
      },
      runtime: settings.runtime,
    });
  } catch (error) {
    console.error("Error fetching runtime platform settings:", error);
    res.status(500).json({
      message: "Failed to fetch runtime settings",
      error: error.message,
    });
  }
};

// config/payoutConfig.js
module.exports = {
  schedules: {
    default: {
      holdingPeriod: 3,
      minimumAmount: 1000,
      batchSize: 100,
    },
    premium: {
      holdingPeriod: 1,
      minimumAmount: 500,
      batchSize: 200,
    },
  },
  retryStrategy: {
    maxAttempts: 3,
    delays: [24, 48, 72],
  },
  fees: {
    default: {
      platformFee: 0.08,
      vendorShare: 0.92,
    },
    premium: {
      platformFee: 0.05,
      vendorShare: 0.95,
    },
  },
  notifications: {
    sendVendorNotifications: true,
    notifyOnFailure: true,
    notifyBeforePayout: true,
    reminderHours: 24,
  },
};

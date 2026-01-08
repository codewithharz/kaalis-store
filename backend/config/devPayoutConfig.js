// For testing vendor's payment system logics in minutes instead of days

// config/devPayoutConfig.js
module.exports = {
  schedules: {
    default: {
      holdingPeriod: 5, // 5 minutes instead of 3 days
      minimumAmount: 100, // Lower minimum amount for testing
      batchSize: 100,
    },
    premium: {
      holdingPeriod: 2, // 2 minutes instead of 1 day
      minimumAmount: 50,
      batchSize: 200,
    },
  },
  retryStrategy: {
    maxAttempts: 3,
    delays: [1, 2, 3], // Minutes instead of days
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
    reminderHours: 0.1, // 6 minutes instead of 24 hours
  },
  triggers: {
    autoPayoutEnabled: true,
    conditions: {
      orderStatus: ["Delivered"],
      minWaitTime: 2, // 2 minutes after delivery
      maxWaitTime: 10, // 10 minutes maximum
    },
  },
};

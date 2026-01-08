// backend/config/cronJobs.js
require("dotenv").config();
const cron = require("node-cron");
const logger = require("../utils/logger");
const payoutService = require("../services/payoutService");

const initPayoutCron = () => {
  const cronSchedule = process.env.PAYOUT_CRON_SCHEDULE || "0 0 * * *";

  if (!cron.validate(cronSchedule)) {
    logger.error(`Invalid cron schedule: ${cronSchedule}`);
    return;
  }

  cron.schedule(cronSchedule, async () => {
    logger.info(`Starting scheduled payout processing at ${new Date()}`);
    await payoutService.processVendorPayouts();
  });

  logger.info("Payout cron job initialized successfully");
};

module.exports = {
  initPayoutCron,
  processPayouts: () => payoutService.processVendorPayouts(),
};

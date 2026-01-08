// scripts/testPayout.js
const testPayoutService = require("../services/testPayoutService");
const logger = require("../utils/logger");

async function runPayoutTest() {
  try {
    logger.info("Starting payout test");

    // Set a timeout for the entire process (30 minutes)
    const timeout = setTimeout(() => {
      logger.error("Test timeout reached - forcing shutdown");
      process.exit(1);
    }, 30 * 60 * 1000);

    await testPayoutService.startPayoutMonitoring();

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      logger.info("Received shutdown signal");
      clearTimeout(timeout);
      await testPayoutService.stopPayoutMonitoring();
      process.exit(0);
    });
  } catch (error) {
    logger.error("Error in payout test:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runPayoutTest().catch((error) => {
    logger.error("Fatal error in payout test:", error);
    process.exit(1);
  });
}

module.exports = runPayoutTest;

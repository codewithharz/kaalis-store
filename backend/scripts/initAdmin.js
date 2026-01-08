// backend/scripts/initAdmin.js
const axios = require("axios");

const initializeAdmin = async () => {
  const VERCEL_URL = process.env.VERCEL_URL || "your-app-url.vercel.app";

  try {
    const response = await axios.post(
      `https://${VERCEL_URL}/api/admin/init`,
      {},
      {
        headers: {
          "x-deployment-key": process.env.ADMIN_DEPLOYMENT_KEY,
        },
      }
    );

    console.log("Admin initialization response:", response.data);
  } catch (error) {
    console.error(
      "Failed to initialize admin:",
      error.response?.data || error.message
    );
  }
};

// Run if called directly
if (require.main === module) {
  initializeAdmin();
}

module.exports = initializeAdmin;

// Test script for PayDunya integration
// Save as test-paydunya.js in your project root

require("dotenv").config();
const axios = require("axios");

// Correct the path to the PayDunyaService based on where you're running the script from
// If running from project root:
const PayDunyaService = require("./services/PayDunyaService");

// If running from backend directory:
// const PayDunyaService = require('./services/PayDunyaService');

// Mock the logger if it's not available
if (!global.logger) {
  global.logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
  };
}

// Create a mock payment utils if needed
if (!global.convertNGNToXOF) {
  global.convertNGNToXOF = (amount) => {
    const rate = 0.98;
    return Math.round(parseFloat(amount) * rate);
  };
}

// Create a mock order object
const mockOrder = {
  _id: "67f50eb72b12c9d990a6dc81",
  orderId: "00009y-m98g1qjo",
  totalAmount: 100, // Use a smaller amount for testing
  user: "6696945dabbb289ecc6c2d15",
};

const testEmail = "testuser@example.com";
const testPhone = "+221700000000"; // Use a valid Senegal phone number format

async function testPayDunyaIntegration() {
  try {
    console.log("🔍 Testing PayDunya integration with test environment keys");
    console.log("--------------------------------");

    // Check if environment variables are set
    const requiredVars = [
      "PAYDUNYA_MASTER_KEY",
      "PAYDUNYA_PUBLIC_KEY_TEST",
      "PAYDUNYA_PRIVATE_KEY_TEST",
      "PAYDUNYA_TOKEN_TEST",
    ];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error(
        "❌ Missing required environment variables:",
        missingVars.join(", ")
      );
      console.log(
        "Please set these variables in your .env file and try again."
      );
      return;
    }

    console.log("✅ All required environment variables are set");

    // Initialize the PayDunya service
    const payDunyaService = new PayDunyaService();
    console.log("✅ PayDunya service initialized");

    // Test the payment initialization
    console.log("\nTesting payment initialization...");
    console.log(`Order ID: ${mockOrder._id}`);
    console.log(`Amount: ${mockOrder.totalAmount} NGN`);
    console.log(`Customer Email: ${testEmail}`);
    console.log(`Customer Phone: ${testPhone}`);

    const result = await payDunyaService.initializePayment(
      mockOrder,
      testEmail,
      testPhone
    );

    console.log("\n✅ PayDunya payment initialized successfully!");
    console.log("--------------------------------");
    console.log("Payment URL:", result.payment_url);
    console.log("Payment Token:", result.payment_token);
  } catch (error) {
    console.error("\n❌ Error testing PayDunya integration:");
    console.error("--------------------------------");

    if (error.response) {
      // The server responded with an error status
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      // No response received
      console.error("No response received from API");
      console.error("Request:", error.request);
    } else {
      // Error before request was made
      console.error("Error message:", error.message);
    }

    console.error("\nCheck your API keys and network connection.");
  }
}

// Run the test
testPayDunyaIntegration();

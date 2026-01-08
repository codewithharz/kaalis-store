// opay-routes-test.js
// Comprehensive test suite for OPay integration

const axios = require("axios");

// Configuration
const config = {
  baseUrl: "http://localhost:7788",
  authToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2OTQ1ZGFiYmIyODllY2M2YzJkMTUiLCJpYXQiOjE3NjM1NjIxMDcsImV4cCI6MTc2MzY0ODUwN30.HENvUJJZT7Bf-6kvaIIEGGT9UHNmL-c_1lCulDtYWM8", // Get this from login response
  adminToken: "YOUR_ADMIN_AUTH_TOKEN_HERE", // Optional for admin tests
};

// Test data
const testData = {
  validPayment: {
    orderId: "691b21ca60b9a96033cd3a34",
    email: "testuser@example.com",
    amount: 350,
    vendorAmount: 322,
    platformFee: 28,
    userPhone: "+2348012345678",
    metadata: {
      orderId: "691b21ca60b9a96033cd3a34",
      userId: "6696945dabbb289ecc6c2d15",
      customerName: "Test User",
      userPhone: "+2348012345678",
      items: [
        {
          productId: "673006261dfbc28ac6ac7abf",
          quantity: 1,
          price: 350,
          vendorAmount: 322,
          platformFee: 28,
          vendorId: "669c5b4da1ab8805ef5bbfb7",
        },
      ],
      shipping: {
        street: "123 Test Street",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
      },
      shippingFee: 0,
      totalBeforeShipping: 350,
      totalAfterShipping: 350,
    },
  },
  bankAccount: {
    accountNumber: "0123456789",
    bankCode: "058",
  },
};

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const axiosConfig = {
      method,
      url: `${config.baseUrl}${endpoint}`,
      headers,
      timeout: 30000,
    };

    if (data) {
      axiosConfig.data = data;
    }

    console.log(`\n📤 ${method.toUpperCase()} ${endpoint}`);
    if (data) {
      console.log("Request Body:", JSON.stringify(data, null, 2));
    }

    const response = await axios(axiosConfig);

    console.log(`✅ Status: ${response.status}`);
    console.log("Response:", JSON.stringify(response.data, null, 2));

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log("Response:", JSON.stringify(error.response.data, null, 2));
      return {
        success: false,
        status: error.response.status,
        data: error.response.data,
      };
    } else {
      console.log("No response received:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Test functions
const tests = {
  // Test 1: Initialize Payment
  async testInitializePayment() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 1: Initialize OPay Payment");
    console.log("=".repeat(60));

    const result = await makeRequest(
      "POST",
      "/api/opay/initialize",
      testData.validPayment,
      config.authToken
    );

    if (result.success && result.data.status) {
      console.log("\n✅ Payment initialization successful!");
      console.log("Authorization URL:", result.data.data?.authorization_url);
      console.log("Reference:", result.data.data?.reference);
      return result.data.data?.reference; // Return reference for next test
    } else {
      console.log("\n❌ Payment initialization failed!");
      return null;
    }
  },

  // Test 2: Initialize with missing fields
  async testInitializeWithMissingFields() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 2: Initialize with Missing Fields (Should Fail)");
    console.log("=".repeat(60));

    const incompleteData = {
      email: "test@email.com",
      amount: 500,
      // Missing required fields
    };

    const result = await makeRequest(
      "POST",
      "/api/opay/initialize",
      incompleteData,
      config.authToken
    );

    if (!result.success || !result.data.status) {
      console.log("\n✅ Correctly rejected incomplete data!");
    } else {
      console.log("\n⚠️ Warning: Should have rejected incomplete data!");
    }
  },

  // Test 3: Initialize with invalid amounts
  async testInitializeWithInvalidAmounts() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 3: Initialize with Invalid Amounts (Should Fail)");
    console.log("=".repeat(60));

    const invalidData = {
      ...testData.validPayment,
      amount: 500,
      vendorAmount: 300,
      platformFee: 100, // These don't add up (400 vs 500)
    };

    const result = await makeRequest(
      "POST",
      "/api/opay/initialize",
      invalidData,
      config.authToken
    );

    if (!result.success || !result.data.status) {
      console.log("\n✅ Correctly rejected mismatched amounts!");
    } else {
      console.log("\n⚠️ Warning: Should have rejected mismatched amounts!");
    }
  },

  // Test 4: Verify Payment
  async testVerifyPayment(reference) {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 4: Verify Payment");
    console.log("=".repeat(60));

    if (!reference) {
      console.log("⏭️  Skipping: No reference from initialization");
      return;
    }

    const result = await makeRequest(
      "GET",
      `/api/opay/verify/${reference}`,
      null,
      config.authToken
    );

    if (result.success) {
      console.log("\n✅ Payment verification request successful!");
      console.log("Status:", result.data.data?.payment?.status);
    } else {
      console.log("\n❌ Payment verification failed!");
    }
  },

  // Test 5: Get Bank List
  async testGetBankList() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 5: Get Bank List");
    console.log("=".repeat(60));

    const result = await makeRequest(
      "GET",
      "/api/opay/banks",
      null,
      config.authToken
    );

    if (result.success && result.data.status) {
      console.log("\n✅ Bank list retrieved successfully!");
      console.log(`Found ${result.data.data?.length || 0} banks`);
      if (result.data.data?.length > 0) {
        console.log("Sample bank:", result.data.data[0]);
      }
    } else {
      console.log("\n❌ Failed to get bank list!");
    }
  },

  // Test 6: Validate Bank Account
  async testValidateBankAccount() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 6: Validate Bank Account");
    console.log("=".repeat(60));

    const result = await makeRequest(
      "POST",
      "/api/opay/validate-account",
      testData.bankAccount,
      config.authToken
    );

    if (result.success && result.data.status) {
      console.log("\n✅ Bank account validation successful!");
      console.log("Account Name:", result.data.data?.account_name);
    } else {
      console.log("\n❌ Bank account validation failed!");
      console.log("Note: This might fail if using test account numbers");
    }
  },

  // Test 7: Test Callback (without auth)
  async testCallback() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 7: Test Callback Endpoint");
    console.log("=".repeat(60));

    const callbackData = {
      reference: "TEST_CALLBACK_REF",
      status: "SUCCESS",
      orderNo: "TEST_ORDER_123",
    };

    const result = await makeRequest(
      "POST",
      "/api/opay/callback",
      callbackData
      // No auth token - callback should work without auth
    );

    console.log(
      "\n" +
        (result.success
          ? "✅ Callback endpoint accessible"
          : "❌ Callback endpoint failed")
    );
  },

  // Test 8: Admin - Get All Transactions (requires admin token)
  async testGetAllTransactions() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 8: Get All Transactions (Admin)");
    console.log("=".repeat(60));

    if (!config.adminToken) {
      console.log("⏭️  Skipping: No admin token provided");
      return;
    }

    const result = await makeRequest(
      "GET",
      "/api/opay/admin/transactions",
      null,
      config.adminToken
    );

    if (result.success && result.data.status) {
      console.log("\n✅ Transactions retrieved successfully!");
      console.log(`Found ${result.data.data?.length || 0} transactions`);
    } else {
      console.log("\n❌ Failed to get transactions!");
    }
  },

  // Test 9: Admin - Get Balance (requires admin token)
  async testGetBalance() {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 9: Get Account Balance (Admin)");
    console.log("=".repeat(60));

    if (!config.adminToken) {
      console.log("⏭️  Skipping: No admin token provided");
      return;
    }

    const result = await makeRequest(
      "GET",
      "/api/opay/admin/balance",
      null,
      config.adminToken
    );

    if (result.success && result.data.status) {
      console.log("\n✅ Balance retrieved successfully!");
      console.log("Balance:", result.data.data);
    } else {
      console.log("\n❌ Failed to get balance!");
    }
  },
};

// Main test runner
async function runAllTests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         OPay Integration Test Suite                       ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  // Check configuration
  if (config.authToken === "YOUR_USER_AUTH_TOKEN_HERE") {
    console.log(
      "\n⚠️  WARNING: Please update config.authToken with a real token!"
    );
    console.log("You can get this by logging in to your app first.\n");
  }

  const startTime = Date.now();
  let reference = null;

  try {
    // Run tests in sequence
    reference = await tests.testInitializePayment();
    await tests.testInitializeWithMissingFields();
    await tests.testInitializeWithInvalidAmounts();
    await tests.testVerifyPayment(reference);
    await tests.testGetBankList();
    await tests.testValidateBankAccount();
    await tests.testCallback();
    await tests.testGetAllTransactions();
    await tests.testGetBalance();
  } catch (error) {
    console.error("\n❌ Test suite error:", error.message);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("\n" + "=".repeat(60));
  console.log(`Test suite completed in ${duration}s`);
  console.log("=".repeat(60));
  console.log("\n✨ Next steps:");
  console.log("1. If initialization works, visit the cashierUrl in a browser");
  console.log("2. Complete a test payment");
  console.log("3. Check if callback is received");
  console.log("4. Verify payment status updates in your database");
  console.log("\n");
}

// Export for use in other scripts
module.exports = { tests, runAllTests, makeRequest };

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

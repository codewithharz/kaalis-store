// docs-compliant-opay-test.js
const axios = require("axios");

// Your creds
const merchantId = "256625111460372";
const publicKey = "OPAYPUB17633738304920.9305603742730466";

const baseURL = "https://testapi.opaycheckout.com";
const endpoint = "/api/v1/international/cashier/create";

const payload = {
  reference: `TEST_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
  country: "NG",
  amount: {
    total: 1000, // 10.00 NGN
    currency: "NGN",
  },
  returnUrl: "https://google.com", // Required; any valid HTTPS
  callbackUrl: "https://webhook.site/#!/your-unique-id-here", // Optional; get from webhook.site
  product: {
    name: "Docs Test Product",
    description: "OPay cashier create test",
  },
  expireAt: 30, // Optional
};

(async () => {
  try {
    const headers = {
      "Content-Type": "application/json",
      MerchantId: merchantId,
      Authorization: `Bearer ${publicKey}`,
      // NO Signature -- that's the fix!
    };

    console.log("→ Hitting OPay sandbox (docs style)...");
    console.log("Reference:", payload.reference);

    const response = await axios.post(`${baseURL}${endpoint}`, payload, {
      headers,
      timeout: 30000,
    });

    console.log("\nRaw response:", JSON.stringify(response.data, null, 2));

    if (response.data.code === "00000") {
      console.log("\n🎉 KEYS VALIDATED! Full success.");
      console.log("Cashier URL:", response.data.data.cashierUrl);
      console.log("Click it to test the payment flow.");
    } else {
      console.log(
        "\nStill failing →",
        response.data.code,
        response.data.message
      );
      console.log(
        'Likely: Merchant not sandbox-activated. Contact OPay with: "Activate sandbox for Merchant ID 256625111460372"'
      );
    }
  } catch (error) {
    console.log("\nNetwork/HTTP error");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Body:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error:", error.message);
    }
  }
})();

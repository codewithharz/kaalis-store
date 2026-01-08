// services/demoPaystackService.js
class DemoPaystackService {
  constructor() {
    this.mockResponses = {
      "044": { account_name: "DEMO ACCESS ACCOUNT" },
      "063": { account_name: "DEMO ACCESS (DIAMOND) ACCOUNT" },
      "050": { account_name: "DEMO ECOBANK ACCOUNT" },
      "070": { account_name: "DEMO FIDELITY ACCOUNT" },
      "011": { account_name: "DEMO FIRST BANK ACCOUNT" },
      "058": { account_name: "DEMO GTB ACCOUNT" },
      "030": { account_name: "DEMO HERITAGE ACCOUNT" },
      "082": { account_name: "DEMO KEYSTONE ACCOUNT" },
      "076": { account_name: "DEMO POLARIS ACCOUNT" },
      "039": { account_name: "DEMO STANBIC IBTC ACCOUNT" },
      232: { account_name: "DEMO STERLING ACCOUNT" },
      "032": { account_name: "DEMO UNION ACCOUNT" },
      "033": { account_name: "DEMO UBA ACCOUNT" },
      "035": { account_name: "DEMO WEMA ACCOUNT" },
      "057": { account_name: "DEMO ZENITH ACCOUNT" },
    };
  }

  async tokenizeCard({ number, cvv, expiryMonth, expiryYear, email }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log("Demo tokenization attempt:", {
            numberLength: number?.length,
            hasEmail: !!email,
            expiryMonth,
            expiryYear,
          });

          // Validate input
          if (!number || !cvv || !expiryMonth || !expiryYear || !email) {
            throw new Error("All card fields are required");
          }

          // Basic card number validation
          const cleanNumber = number.replace(/\s/g, "");

          // Determine card type and validate format
          let cardType;
          if (cleanNumber.startsWith("4")) {
            if (cleanNumber.length !== 16) {
              throw new Error("Invalid Visa card number length");
            }
            cardType = "visa debit";
          } else if (/^5[1-5]/.test(cleanNumber)) {
            if (cleanNumber.length !== 16) {
              throw new Error("Invalid Mastercard number length");
            }
            cardType = "mastercard credit";
          } else if (cleanNumber.startsWith("506")) {
            if (cleanNumber.length < 16 || cleanNumber.length > 19) {
              throw new Error("Invalid Verve card number length");
            }
            cardType = "verve";
          } else {
            throw new Error("Unsupported card type");
          }

          // Generate a demo token
          const timestamp = Date.now().toString(36);
          const last4 = cleanNumber.slice(-4);
          const token = `demo_${timestamp}_${last4}`;

          resolve({
            status: true,
            token,
            card_type: cardType,
            last4,
          });
        } catch (error) {
          reject(error);
        }
      }, 1000); // Simulate network delay
    });
  }

  async verifyBankAccount(accountDetails) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const { accountNumber, bankCode } = accountDetails;
          if (!/^\d{10}$/.test(accountNumber)) {
            throw new Error("Account number must be 10 digits");
          }

          // In demo mode, provide a name for any bank code, using the mock list if available
          const accountName = this.mockResponses[bankCode]?.account_name || `DEMO ACCOUNT (${bankCode})`;

          resolve({
            status: true,
            data: {
              account_name: accountName,
              account_number: accountNumber,
              bank_code: bankCode,
            },
          });
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }

  async initializeTransaction(paymentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reference = `demo_${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}`;
        resolve({
          status: true,
          data: {
            authorization_url: `https://demo-paystack.com/verify/${reference}`,
            reference,
          },
        });
      }, 1000);
    });
  }

  async verifyTransaction(reference) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          data: {
            reference,
            status: "success",
            amount: 5000, // Demo amount
            paid_at: new Date().toISOString(),
          },
        });
      }, 1000);
    });
  }
}

module.exports = DemoPaystackService;

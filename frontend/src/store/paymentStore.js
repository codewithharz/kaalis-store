// frontend/src/store/paymentStore.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { useCartStore } from "./cart";
import { useOrderStore } from "./orderStore";
import { useUserStore } from "./user";
import { toast } from "vue-sonner";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    isDemoMode: process.env.NODE_ENV === "development",
    isInitializing: false,
    isProcessing: false,
    paymentError: null,
    currentTransaction: null,
    paymentHistory: [],
    orders: [],
    paystackConfig: {
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      currency: "NGN",
    },
    savedCards: [],
    isLoadingCards: false,
    cardError: null,
  }),

  getters: {
    hasActivePayment: (state) => !!state.currentTransaction,
  },

  actions: {
    async initializePayment(paymentData) {
      this.isInitializing = true;
      this.paymentError = null;

      try {
        const userStore = useUserStore();

        // Determine the endpoint based on payment method
        const paymentMethod = paymentData.paymentMethod || "Paystack";
        const endpoint =
          paymentMethod === "OrangeMoney"
            ? "/orange-money/initialize"
            : paymentMethod === "OPay"
              ? "/opay/initialize" // OPay endpoint
              : paymentMethod === "PayDunya"
                ? "/payment/initialize"
                : "/payment/initialize";
        // Send request
        const response = await apiClient.post(endpoint, requestBody, {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        console.log(`${paymentMethod} initialization response:`, response.data);

        if (response?.data?.status) {
          this.currentTransaction = {
            reference:
              response.data.data.reference || response.data.data.payment_token,
            authorizationUrl:
              response.data.data.authorization_url ||
              response.data.data.payment_url,
            orderId: paymentData.orderId,
            paymentMethod,
            ...(paymentMethod === "OPay" && {
              orderNo: response.data.data.orderNo,
            }),
          };

          return response.data.data;
        }

        throw new Error(
          response.data.message || "Payment initialization failed"
        );
      } catch (error) {
        console.error("Payment initialization error:", error);
        this.paymentError = error.response?.data?.message || error.message;
        toast.error(this.paymentError);
        throw error;
      } finally {
        this.isInitializing = false;
      }
    },

    // Update verifyPayment to handle OPay
    async verifyPayment(reference, paymentMethod = "Paystack") {
      this.isProcessing = true;

      try {
        console.log(`Verifying ${paymentMethod} payment:`, reference);

        // 1. Check if payment was already verified (prevent double processing)
        const existingVerification = await this.checkExistingVerification(
          reference
        );
        if (existingVerification) {
          console.log("Found existing verification for:", reference);
          return existingVerification;
        }

        // 2. Verify with backend
        const userStore = useUserStore();

        // Use appropriate endpoint for verification
        const endpoint =
          paymentMethod === "OPay"
            ? `/opay/verify/${reference}`
            : `/payment/verify/${paymentMethod}/${reference}`;

        const response = await apiClient.get(endpoint, {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        console.log(`${paymentMethod} verification response:`, response.data);

        // 3. Process successful verification
        if (response.data.status) {
          const verificationResult = {
            status: true,
            data: {
              ...response.data.data,
              paymentMethod,
            },
            verifiedAt: new Date().toISOString(),
          };

          // Store verification result
          await this.storeVerificationResult(reference, verificationResult);

          // Clear current transaction
          this.currentTransaction = null;

          // Log successful verification
          console.log(`${paymentMethod} payment verified successfully:`, {
            reference,
            orderId: response.data.data.orderId,
            timestamp: new Date().toISOString(),
          });

          return verificationResult;
        }

        // 4. Handle verification failure
        throw new Error(response.data.message || "Payment verification failed");
      } catch (error) {
        // 5. Enhanced error handling
        console.error("Payment verification error:", {
          reference,
          paymentMethod,
          error: error.message,
          response: error.response?.data,
        });

        this.paymentError = error.response?.data?.message || error.message;
        toast.error(this.paymentError);

        throw error;
      } finally {
        this.isProcessing = false;
      }
    },

    async verifyOpayPayment(reference) {
      this.isProcessing = true;
      try {
        const userStore = useUserStore();
        const response = await apiClient.get(`/opay/verify/${reference}`, {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.data.status) {
          const verificationResult = {
            status: true,
            data: response.data.data,
            verifiedAt: new Date().toISOString(),
          };
          await this.storeVerificationResult(reference, verificationResult);
          this.currentTransaction = null;
          return verificationResult;
        }

        throw new Error(response.data.message || "OPay verification failed");
      } catch (error) {
        console.error("OPay verification error:", error);
        toast.error(error.response?.data?.message || error.message);
        throw error;
      } finally {
        this.isProcessing = false;
      }
    },

    // Helper method to check existing verification
    async checkExistingVerification(reference) {
      try {
        const stored = localStorage.getItem(
          `payment_verification_${reference}`
        );
        if (stored) {
          const verification = JSON.parse(stored);
          if (verification.status) {
            console.log("Found existing verification:", reference);
            return verification;
          }
        }
        return null;
      } catch (error) {
        console.error("Error checking existing verification:", error);
        return null;
      }
    },

    // Helper method to store verification result
    async storeVerificationResult(reference, result) {
      try {
        localStorage.setItem(
          `payment_verification_${reference}`,
          JSON.stringify({
            ...result,
            storedAt: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.error("Error storing verification result:", error);
      }
    },

    // Optional: Method to clear stored verification
    async clearStoredVerification(reference) {
      try {
        localStorage.removeItem(`payment_verification_${reference}`);
      } catch (error) {
        console.error("Error clearing stored verification:", error);
      }
    },

    async getPaymentHistory(page = 1, limit = 10) {
      try {
        const userStore = useUserStore();
        const response = await apiClient.get(
          `/payment/user/history?page=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        if (response.data?.status) {
          this.paymentHistory = response.data.data;
          return {
            payments: this.paymentHistory,
            pagination: response.data.pagination,
          };
        }
        throw new Error("Failed to fetch payment history");
      } catch (error) {
        toast.error("Failed to fetch payment history");
        throw error;
      }
    },

    // Get payment details
    async getPaymentDetails(paymentId) {
      try {
        const userStore = useUserStore();
        const response = await apiClient.get(
          `/payment/user/details/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        return response.data.data;
      } catch (error) {
        console.error("Error fetching payment details:", error);
        toast.error("Failed to fetch payment details");
        throw error;
      }
    },

    // Add specific OPay bank validation
    async verifyBankAccount({
      accountNumber,
      bankCode,
      paymentMethod = "Paystack",
    }) {
      try {
        const userStore = useUserStore();

        // Determine endpoint based on payment method
        const endpoint =
          paymentMethod === "OPay"
            ? "/opay/validate-account"
            : "/payment/verify-account";

        const response = await apiClient.post(
          endpoint,
          {
            accountNumber: accountNumber.trim(),
            bankCode,
            isDemoMode: this.isDemoMode,
          },
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        if (response.data?.status) {
          return {
            status: true,
            data: response.data.data,
          };
        }
        throw new Error(response.data.message || "Account verification failed");
      } catch (error) {
        console.error("Bank account verification error:", error);
        throw new Error(
          error.response?.data?.message || "Failed to verify account"
        );
      }
    },

    // Add method to get OPay banks
    async getOpayBanks() {
      try {
        const userStore = useUserStore();
        const response = await apiClient.get("/opay/banks", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.data?.status) {
          return response.data.data;
        }
        throw new Error("Failed to fetch banks");
      } catch (error) {
        console.error("Error fetching OPay banks:", error);
        toast.error("Failed to fetch bank list");
        throw error;
      }
    },

    // Get Paystack bank list
    async fetchPaystackBanks() {
      try {
        const userStore = useUserStore();
        const response = await apiClient.get("/paystack/banks", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.data?.status) {
          return response.data.data;
        }
        throw new Error("Failed to fetch Paystack banks");
      } catch (error) {
        console.error("Error fetching Paystack banks:", error);
        toast.error("Failed to fetch bank list");
        throw error;
      }
    },

    async updateBankDetails(bankDetails) {
      try {
        const userStore = useUserStore();
        const response = await apiClient.post(
          "/payment/bank-details",
          bankDetails,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        if (response.data?.status) {
          return response.data;
        }
        throw new Error(
          response.data.message || "Failed to update bank details"
        );
      } catch (error) {
        console.error("Error updating bank details:", error);
        throw new Error(
          error.response?.data?.message || "Failed to save bank details"
        );
      }
    },

    async deleteBankDetails() {
      try {
        const userStore = useUserStore();
        const response = await apiClient.delete("/payment/bank-details", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.data?.status) {
          return response.data;
        }
        throw new Error(
          response.data.message || "Failed to delete bank details"
        );
      } catch (error) {
        console.error("Error deleting bank details:", error);
        throw new Error(
          error.response?.data?.message || "Failed to delete bank details"
        );
      }
    },

    async loadSavedCards() {
      try {
        const userStore = useUserStore();
        const response = await apiClient.get("/payment/user/cards", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.data.status) {
          this.savedCards = response.data.data;
          return this.savedCards;
        }
        throw new Error("Failed to load cards");
      } catch (error) {
        toast.error("Failed to load saved cards");
        throw error;
      }
    },

    async addCard(cardData) {
      try {
        const userStore = useUserStore();

        // Enhanced logging to debug request
        console.log("Card validation before request:", {
          numberValid: /^\d{15,19}$/.test(cardData.number),
          monthValid: /^(0[1-9]|1[0-2])$/.test(cardData.expiryMonth),
          yearValid: /^\d{2}$/.test(cardData.expiryYear),
          cvvValid: /^\d{3}$/.test(cardData.cvv),
          number: cardData.number.slice(-4), // Only log last 4 digits
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          holderName: cardData.holderName,
          email: userStore.user.email,
        });

        // Log the sanitized card data (excluding sensitive info)
        console.log("Adding card with details:", {
          holderName: cardData.holderName,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          setAsDefault: cardData.setAsDefault,
          numberLength: cardData.number.length,
          cvvLength: cardData.cvv.length,
        });

        const response = await apiClient.post(
          "/payment/user/cards",
          {
            number: cardData.number.replace(/\s/g, ""),
            holderName: cardData.holderName,
            expiryMonth: cardData.expiryMonth,
            expiryYear: cardData.expiryYear,
            cvv: cardData.cvv,
            setAsDefault: cardData.setAsDefault,
          },
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        if (response.data.status) {
          await this.loadSavedCards();
          toast.success("Card added successfully");
          return response.data.data;
        }
        throw new Error("Failed to add card");
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        throw error;
      }
    },

    async deleteCard(cardId) {
      if (!cardId) throw new Error("Invalid card ID");

      try {
        const userStore = useUserStore();
        const response = await apiClient.delete(
          `/payment/user/cards/${cardId}`,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        if (response.data?.status) {
          await this.loadSavedCards();
          return true;
        }
        throw new Error("Failed to delete card");
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        throw error;
      }
    },

    async setDefaultCard(cardId) {
      if (!cardId) throw new Error("Invalid card ID");

      try {
        const userStore = useUserStore();
        const response = await apiClient.put(
          `/payment/user/cards/${cardId}/default`,
          {},
          { headers: { Authorization: `Bearer ${userStore.token}` } }
        );

        if (response.data?.status) {
          await this.loadSavedCards();
          toast.success("Default card updated");
          return true;
        }
        throw new Error("Failed to update default card");
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        throw error;
      }
    },

    clearPaymentError() {
      this.paymentError = null;
    },

    resetPaymentState() {
      this.isInitializing = false;
      this.isProcessing = false;
      this.paymentError = null;
      this.currentTransaction = null;
    },
  },
});

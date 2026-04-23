// frontend/src/store/vendorPayoutStore.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { useUserStore } from "./user";
import { toast } from "vue-sonner";

export const useVendorPayoutStore = defineStore("vendorPayout", {
  state: () => ({
    isLoading: false,
    isProcessing: false,
    payouts: [],
    currentPayout: null,
    stats: {
      pendingAmount: 0,
      pendingAmounts: {},
      processingAmounts: {},
      processedAmounts: {},
      failedAmounts: {},
      salesAmounts: {},
      vendorEarnings: {},
      platformFeeAmounts: {},
      orderCounts: {},
      nextPayoutDate: null,
      platformFee: 8, // Default platform fee percentage
    },
    error: null,
  }),

  getters: {
    pendingAmount: (state) => state.stats.pendingAmount,
    pendingAmounts: (state) => state.stats.pendingAmounts,
    processingAmounts: (state) => state.stats.processingAmounts,
    processedAmounts: (state) => state.stats.processedAmounts,
    failedAmounts: (state) => state.stats.failedAmounts,
    salesAmounts: (state) => state.stats.salesAmounts,
    vendorEarnings: (state) => state.stats.vendorEarnings,
    platformFeeAmounts: (state) => state.stats.platformFeeAmounts,
    orderCounts: (state) => state.stats.orderCounts,
    nextPayoutDate: (state) => state.stats.nextPayoutDate,
    platformFee: (state) => state.stats.platformFee,
  },

  actions: {
    async fetchPayoutHistory() {
      this.isLoading = true;
      const userStore = useUserStore();
      try {
        const response = await apiClient.get("/vendor-payout/payouts", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        const pendingAmounts =
          response.data.stats?.pendingAmounts ||
          response.data.stats?.pendingAmount ||
          {};
        const activeCurrency = userStore.user?.currency || response.data.stats?.currency || "NGN";
        const pendingAmount =
          typeof response.data.stats?.pendingAmount === "number"
            ? response.data.stats.pendingAmount
            : pendingAmounts[activeCurrency] || 0;

        // Update both payouts and stats
        this.payouts = response.data.payouts;
        this.stats = {
          pendingAmount,
          pendingAmounts,
          processingAmounts: response.data.stats?.processingAmounts || {},
          processedAmounts: response.data.stats?.processedAmounts || {},
          failedAmounts: response.data.stats?.failedAmounts || {},
          salesAmounts: response.data.stats?.salesAmounts || {},
          vendorEarnings: response.data.stats?.vendorEarnings || {},
          platformFeeAmounts: response.data.stats?.platformFeeAmounts || {},
          orderCounts: response.data.stats?.orderCounts || {},
          nextPayoutDate: response.data.stats?.nextPayoutDate || null,
          platformFee: response.data.stats?.platformFee || 8,
        };

        console.log("Fetched payout data:", response.data); // Debug log
      } catch (error) {
        console.error("Failed to fetch payout history:", error);
        toast.error("Failed to fetch payout history");
      } finally {
        this.isLoading = false;
      }
    },

    async setupBankAccount(bankDetails) {
      const userStore = useUserStore();
      this.isProcessing = true;
      try {
        // First validate the bank account
        const validationResponse = await this.validateBankAccount(
          bankDetails.accountNumber,
          bankDetails.bankCode
        );

        if (!validationResponse.status) {
          throw new Error(validationResponse.message || "Invalid bank account");
        }

        // Then setup the recipient
        // const response = await apiClient.post(
        //   "/vendor-payout/paystack/setup",
        //   bankDetails,
        //   {
        //     headers: { Authorization: `Bearer ${userStore.token}` },
        //   }
        // );

        // Determine payout provider
        const provider = bankDetails.provider || "Paystack"; // Default Paystack
        const endpoint =
          provider === "OPay"
            ? "/vendor-payout/opay/setup"
            : "/vendor-payout/paystack/setup";

        const response = await apiClient.post(endpoint, bankDetails, {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        // Update user's paystack info if setup was successful
        if (response.data.status) {
          await userStore.updateUser({
            "paystack.recipientCode": response.data.data.recipient_code,
            "paystack.bankName": response.data.data.bank_name,
            "paystack.accountNumber": bankDetails.accountNumber,
          });

          toast.success("Bank account setup successful");
        }

        return response.data;
      } catch (error) {
        console.error("Failed to setup bank account:", error);
        toast.error(
          error.response?.data?.message || "Failed to setup bank account"
        );
        throw error;
      } finally {
        this.isProcessing = false;
      }
    },

    async validateBankAccount(accountNumber, bankCode) {
      const userStore = useUserStore();
      try {
        const response = await apiClient.post(
          "/vendor-payout/bank/validate",
          {
            accountNumber,
            bankCode,
          },
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Failed to validate bank account:", error);
        toast.error(
          error.response?.data?.message || "Failed to validate bank account"
        );
        throw error;
      }
    },

    async getPayoutStats() {
      const userStore = useUserStore();
      try {
        const response = await apiClient.get("/vendor-payout/payout-stats", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        const pendingAmounts = response.data.stats?.pendingAmount || {};
        const activeCurrency = userStore.user?.currency || response.data.currency || "NGN";

        this.stats = {
          pendingAmount: pendingAmounts[activeCurrency] || 0,
          pendingAmounts,
          processingAmounts: response.data.stats?.processingAmount || {},
          processedAmounts: response.data.stats?.processedAmount || {},
          failedAmounts: response.data.stats?.failedAmount || {},
          salesAmounts: response.data.stats?.salesAmounts || {},
          vendorEarnings: response.data.stats?.vendorEarnings || {},
          platformFeeAmounts: response.data.stats?.platformFeeAmounts || {},
          orderCounts: response.data.stats?.orderCounts || {},
          nextPayoutDate: response.data.nextPayoutDate,
          platformFee: response.data.platformFee || 8,
        };

        return response.data;
      } catch (error) {
        console.error("Failed to fetch payout stats:", error);
        toast.error("Failed to fetch payout statistics");
        throw error;
      }
    },

    async getPayoutTransactions() {
      const userStore = useUserStore();
      try {
        const response = await apiClient.get("/vendor-payout/transactions", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });
        return response.data;
      } catch (error) {
        console.error("Failed to fetch payout transactions:", error);
        toast.error("Failed to fetch payout transactions");
        throw error;
      }
    },

    // Development only - create mock payout
    async createMockPayout(amount) {
      if (process.env.NODE_ENV !== "development") return;

      const userStore = useUserStore();
      try {
        const response = await apiClient.post(
          "/vendor-payout/test/mock-payout",
          { amount },
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );
        await this.fetchPayoutHistory(); // Refresh payout history
        return response.data;
      } catch (error) {
        console.error("Failed to create mock payout:", error);
        toast.error("Failed to create test payout");
        throw error;
      }
    },

    // In vendorPayoutStore.js
    async setupPaystackRecipient(bankDetails) {
      const userStore = useUserStore();
      this.isProcessing = true;
      try {
        console.log("Setting up recipient with details:", bankDetails);
        const response = await apiClient.post(
          "/vendor-payout/paystack/setup",
          bankDetails,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );
        console.log("Setup response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Setup error:", error);
        throw error;
      } finally {
        this.isProcessing = false;
      }
    },

    async setupOpayRecipient(bankDetails) {
      const userStore = useUserStore();
      this.isProcessing = true;
      try {
        console.log("Setting up OPay recipient with details:", bankDetails);
        const response = await apiClient.post(
          "/vendor-payout/opay/setup",
          bankDetails,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );
        console.log("OPay setup response:", response.data);
        return response.data;
      } catch (error) {
        console.error("OPay setup error:", error);
        toast.error(error.response?.data?.message || error.message);
        throw error;
      } finally {
        this.isProcessing = false;
      }
    },
  },
});

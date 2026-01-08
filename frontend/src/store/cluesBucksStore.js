// frontend/src/store/cluesBucksStore.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { toast } from "vue-sonner";

export const useCluesBucksStore = defineStore("cluesBucks", {
  state: () => ({
    stats: {
      currentBalance: 0,
      lifetimePoints: 0,
      pointsExpiringSoon: 0,
    },
    transactions: [],
    redemptionOptions: [
      {
        id: 1,
        title: "Discount Coupon",
        description: "Get ₦1000 off your next purchase",
        points: 1000,
        type: "coupon",
      },
      {
        id: 2,
        title: "Store Credit",
        description: "Convert points to store credit",
        points: 2000,
        type: "credit",
      },
      {
        id: 3,
        title: "Special Offer Access",
        description: "Unlock exclusive deals",
        points: 500,
        type: "offer",
      },
    ],
    isLoading: false,
    error: null,
    appliedPoints: 0,
    pointsDiscount: 0,

    specialOffers: [],
    offerAccess: null,
  }),

  getters: {
    hasEnoughPoints: (state) => (points) => {
      return state.stats.currentBalance >= points;
    },
    sortedTransactions: (state) => {
      return [...state.transactions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    totalDiscount: (state) => {
      return state.pointsDiscount;
    },

    hasValidOfferAccess: (state) => {
      return state.transactions.some(
        (t) =>
          t.type === "spent" &&
          ((t.metadata?.type === "offer" &&
            t.metadata.validUntil &&
            new Date(t.metadata.validUntil) > new Date()) ||
            (t.metadata?.type === "credit" &&
              t.description.includes("Convert points to store credit")))
      );
    },

    activeSpecialOffers: (state) => {
      return state.specialOffers.filter(
        (offer) =>
          new Date(offer.endDate) > new Date() && offer.status === "active"
      );
    },

    couponStats: (state) => {
      const couponTransactions = state.transactions.filter(
        (t) => t.type === "spent" && t.description.includes("discount coupon")
      );

      return {
        totalUsed: couponTransactions.length,
        lastCoupon:
          couponTransactions[0]?.description.match(/\(([^)]+)\)/)?.[1] || null,
        totalSpent: couponTransactions.reduce(
          (acc, t) => acc + Math.abs(t.points),
          0
        ),
      };
    },
  },

  actions: {
    async initialize() {
      console.log("Initializing CluesBucks store...");
      if (this.stats.currentBalance !== 0) return; // Already initialized

      try {
        await Promise.all([
          this.fetchStats(),
          this.fetchTransactions(),
          this.fetchSpecialOffers(),
          this.checkOfferAccess(),
        ]);
      } catch (error) {
        console.error("Failed to initialize CluesBucks store:", error);
        // Set default state
        this.stats = {
          currentBalance: 0,
          lifetimePoints: 0,
          pointsExpiringSoon: 0,
        };
      }
    },

    async fetchStats() {
      try {
        this.isLoading = true;
        const response = await apiClient.get("/cluesbucks/stats");
        if (response.data) {
          this.stats = {
            currentBalance: response.data.currentBalance,
            lifetimePoints: response.data.lifetimePoints,
            pointsExpiringSoon: response.data.pointsExpiringSoon,
          };
        }
      } catch (error) {
        console.error("Error fetching CluesBucks stats:", error);
        toast.error("Failed to load CluesBucks statistics");
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTransactions() {
      try {
        this.isLoading = true;
        const response = await apiClient.get("/cluesbucks/transactions");
        if (response.data.success) {
          this.transactions = response.data.transactions;
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        toast.error("Failed to load transaction history");
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async applyPoints(points) {
      if (!this.hasEnoughPoints(points)) {
        toast.error("Insufficient points balance");
        return false;
      }

      try {
        this.appliedPoints = points;
        this.pointsDiscount = points; // 1 point = ₦1 discount
        return true;
      } catch (error) {
        console.error("Error applying points:", error);
        toast.error("Failed to apply points");
        return false;
      }
    },

    async removePoints() {
      this.appliedPoints = 0;
      this.pointsDiscount = 0;
    },

    // async redeemPoints(optionId) {
    //   try {
    //     this.isLoading = true;
    //     const option = this.redemptionOptions.find(
    //       (opt) => opt.id === optionId
    //     );

    //     if (!option) {
    //       throw new Error("Invalid redemption option");
    //     }

    //     const response = await apiClient.post("/cluesbucks/redeem", {
    //       optionId: option.id,
    //       points: option.points,
    //       type: option.type,
    //     });

    //     if (response.data.success) {
    //       this.stats.currentBalance = response.data.newBalance;
    //       this.lastRedeemedCoupon = response.data.coupon;

    //       await this.fetchTransactions();

    //       localStorage.setItem(
    //         "cluesBucksCoupon",
    //         JSON.stringify({
    //           code: response.data.coupon.code,
    //           expiryDate: response.data.coupon.expiryDate,
    //         })
    //       );

    //       // toast.success(response.data.message);
    //       toast.success(
    //         `Redemption successful! Your coupon code is: ${response.data.coupon.code}`
    //       );

    //       return true;
    //     }
    //     return false;
    //   } catch (error) {
    //     console.error("Error redeeming points:", error);
    //     toast.error(error.response?.data?.message || "Failed to redeem points");
    //     return false;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    async redeemPoints(optionId) {
      try {
        this.isLoading = true;
        const option = this.redemptionOptions.find(
          (opt) => opt.id === optionId
        );

        if (!option) {
          throw new Error("Invalid redemption option");
        }

        const response = await apiClient.post("/cluesbucks/redeem", {
          optionId: option.id,
          points: option.points,
          type: option.type,
        });

        if (response.data.success) {
          this.stats.currentBalance = response.data.newBalance;

          // Handle different redemption types
          if (option.type === "credit") {
            // Handle store credit response
            toast.success("Points converted to store credit successfully!");
          } else if (option.type === "offer") {
            // Handle special offer access response
            toast.success("Special Offer Access unlocked successfully!");
          } else {
            // Handle coupon response
            this.lastRedeemedCoupon = response.data.coupon;
            localStorage.setItem(
              "cluesBucksCoupon",
              JSON.stringify({
                code: response.data.coupon.code,
                expiryDate: response.data.coupon.expiryDate,
              })
            );
            toast.success(
              `Redemption successful! Your coupon code is: ${response.data.coupon.code}`
            );
          }

          await this.fetchTransactions();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error redeeming points:", error);
        toast.error(error.response?.data?.message || "Failed to redeem points");
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // async fetchSpecialOffers() {
    //   try {
    //     const response = await apiClient.get("/cluesbucks/special-offers");
    //     this.specialOffers = response.data.offers;
    //   } catch (error) {
    //     console.error("Error fetching special offers:", error);
    //   }
    // },

    async fetchSpecialOffers() {
      try {
        console.log("Fetching special offers...");
        // Call both endpoints to ensure we get all offers
        const [cluesBucksResponse, specialOffersResponse] = await Promise.all([
          apiClient.get("/cluesbucks/special-offers"),
          apiClient.get("/special-offers"),
        ]);

        console.log("CluesBucks Offers response:", cluesBucksResponse.data);
        console.log("Special Offers response:", specialOffersResponse.data);

        // Combine offers from both endpoints, removing duplicates by _id
        const allOffers = [
          ...(cluesBucksResponse.data?.offers || []),
          ...(specialOffersResponse.data?.offers || []),
        ];

        // Remove duplicates by _id
        this.specialOffers = Array.from(
          new Map(allOffers.map((offer) => [offer._id, offer])).values()
        );

        console.log("Combined special offers:", this.specialOffers);
        return this.specialOffers;
      } catch (error) {
        console.error("Error fetching special offers:", error);
        // Don't reset specialOffers to [] if there's an error, keep existing data
        return this.specialOffers || [];
      }
    },

    async checkOfferAccess() {
      try {
        const response = await apiClient.get("/cluesbucks/check-offer-access");
        this.offerAccess = response.data.hasAccess
          ? {
              validUntil: response.data.validUntil,
            }
          : null;
      } catch (error) {
        console.error("Error checking offer access:", error);
      }
    },

    resetState() {
      this.stats = {
        currentBalance: 0,
        lifetimePoints: 0,
        pointsExpiringSoon: 0,
      };
      this.transactions = [];
      this.isLoading = false;
      this.error = null;
      this.appliedPoints = 0;
      this.pointsDiscount = 0;
      this.lastRedeemedCoupon = null;
    },
  },
});

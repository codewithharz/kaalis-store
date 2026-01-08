// frontend/src/store/sellerStore.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { toast } from "vue-sonner";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "./user";
import { useOrderStore } from "./orderStore";

export const useSellerStore = defineStore("seller", {
  state: () => ({
    sellerProfile: JSON.parse(localStorage.getItem("sellerProfile")) || null,
    token: localStorage.getItem("token") || null,
    errorMessage: "",
    isFollowing: false,
    followersCount: 0,
    pendingVerifications: [],
    cooldownEndTime: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.sellerProfile,
    isSellerProfileLoaded: (state) => !!state.sellerProfile,
  },
  actions: {
    async fetchSellerProfile(sellerId) {
      console.log("fetchSellerProfile called with sellerId:", sellerId);

      const userStore = useUserStore();
      const orderStore = useOrderStore();

      try {
        if (!userStore.token) throw new Error("No token available");

        // First, get the base seller profile
        let response = await apiClient.get(`/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        if (response.data) {
          // Get all orders for this seller
          const allOrders = await orderStore.fetchUserOrders();

          // Count delivered orders
          const deliveredOrders = allOrders.filter(
            (order) =>
              order.seller === response.data.user._id &&
              (order.status?.toLowerCase() === "delivered" ||
                order.status?.toLowerCase() === "completed")
          );

          // Calculate average rating if there are reviews
          let averageRating = 0;
          if (response.data.reviews && response.data.reviews.length > 0) {
            const totalRating = response.data.reviews.reduce(
              (sum, review) => sum + review.rating,
              0
            );
            averageRating = totalRating / response.data.reviews.length;
          }

          // Update seller profile with correct stats
          const updatedProfile = {
            ...response.data,
            totalSales: deliveredOrders.length, // Set totalSales to match delivered orders
            totalProducts: response.data.products?.length || 0, // Set total products from products array
            averageRating: Number(averageRating.toFixed(1)), // Set properly calculated average rating
          };

          console.log("Fetched seller profile:", updatedProfile);
          this.sellerProfile = updatedProfile;
          localStorage.setItem("sellerProfile", JSON.stringify(updatedProfile));
          return updatedProfile;
        }
      } catch (error) {
        console.error("Error fetching seller profile:", error);
        toast.error("Failed to load seller profile. Please try again.");
        throw error;
      }
    },

    async fetchSellerByUserId(userId) {
      console.log("fetchSellerByUserId called with userId:", userId);

      const userStore = useUserStore();
      try {
        if (!userStore.token) throw new Error("No token available");

        const userResponse = await this.fetchUserProfile(userId);
        if (userResponse && userResponse.sellerProfile) {
          return this.fetchSellerProfile(userResponse.sellerProfile);
        } else {
          console.log("User is not a seller");
          return null;
        }
      } catch (error) {
        console.error("Error fetching seller by user ID:", error);
        toast.error("Failed to load seller information. Please try again.");
        throw error;
      }
    },

    async fetchDashboardData() {
      try {
        if (!this.token) throw new Error("No token available");
        if (!this.sellerProfile) throw new Error("Seller profile not loaded");

        const sellerId = this.sellerProfile._id;
        console.log("Fetching dashboard data for seller:", sellerId);

        const response = await apiClient.get(`/seller/${sellerId}/dashboard`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        console.log("Dashboard data response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.message === "Seller profile not loaded") {
          toast.error(
            "Please complete your seller profile before accessing the dashboard."
          );
        } else {
          toast.error("Failed to load dashboard data. Please try again.");
        }
        throw error;
      }
    },

    async addSellerReview(sellerId, reviewData) {
      try {
        const userStore = useUserStore();
        if (!userStore.token) throw new Error("No token available");

        const response = await apiClient.post(
          `/seller/${sellerId}/reviews`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        console.log("Review submitted:", response.data);

        // Update the local seller profile with the new review
        if (this.sellerProfile && this.sellerProfile._id === sellerId) {
          if (!this.sellerProfile.reviews) {
            this.sellerProfile.reviews = [];
          }
          this.sellerProfile.reviews.push(response.data);

          // Recalculate average rating
          const totalRating = this.sellerProfile.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          this.sellerProfile.averageRating =
            totalRating / this.sellerProfile.reviews.length;

          localStorage.setItem(
            "sellerProfile",
            JSON.stringify(this.sellerProfile)
          );
        }

        toast.success("Review submitted successfully.");
        return response.data;
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review. Please try again.");
        throw error;
      }
    },

    async fetchSellerReviews(sellerId, page = 1, itemsPerPage = 5) {
      try {
        const response = await apiClient.get(`/seller/${sellerId}/reviews`, {
          params: { page, itemsPerPage },
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching seller reviews:", error);
        throw error;
      }
    },

    //function for loadSellerProfile
    async loadSellerProfile() {
      console.log("loadSellerProfile called");
      console.log("Current token:", this.token);
      console.log("Current sellerProfile:", this.sellerProfile);

      const userStore = useUserStore();
      if (!userStore.user) {
        console.log("User not logged in");
        this.sellerProfile = null;
        return;
      }

      if (!userStore.user.isSeller) {
        console.log("User is not a seller");
        this.sellerProfile = null;
        localStorage.removeItem("sellerProfile");
        return;
      }

      if (!userStore.user.sellerProfile) {
        console.log("User does not have a seller profile");
        this.sellerProfile = null;
        localStorage.removeItem("sellerProfile");
        return;
      }

      try {
        const sellerId = userStore.user.sellerProfile;
        console.log("Fetching seller profile for ID:", sellerId);

        if (!sellerId) {
          throw new Error("User marked as seller but has no seller profile ID");
        }

        const response = await apiClient.get(`/seller/${sellerId}/profile`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        this.sellerProfile = response.data;
        localStorage.setItem("sellerProfile", JSON.stringify(response.data));
        console.log("Seller profile loaded successfully:", this.sellerProfile);
      } catch (error) {
        console.error("Error loading seller profile:", error);
        this.sellerProfile = null;
        localStorage.removeItem("sellerProfile");

        // Consider updating user's isSeller status to false if no profile found
        userStore.updateUserSellerStatus(false);

        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        this.errorMessage = "Failed to load seller profile. Please try again.";
        toast.error(this.errorMessage);
        throw error;
      }
    },

    //function for loadSellerProfile
    async fetchUserProfile(userId) {
      const response = await apiClient.get(`/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.data;
    },

    async fetchAllSellerOrders() {
      try {
        if (!this.token) throw new Error("No token available");
        const sellerId = this.sellerProfile._id;
        const response = await apiClient.get(`/seller/${sellerId}/all-orders`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        console.error(
          "Error fetching all seller orders:",
          error.response || error
        );
        this.errorMessage = "Failed to load all orders.";
        toast.error(this.errorMessage);
        throw error;
      }
    },

    async fetchSellerOrders() {
      try {
        if (!this.token) throw new Error("No token available");

        const sellerId = this.sellerProfile._id;
        console.log("Fetching orders for seller:", sellerId);

        const response = await apiClient.get(`/seller/${sellerId}/orders`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        console.log("Fetched orders:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching seller orders:", error.response || error);
        this.errorMessage = "Failed to load orders. Please try again.";
        throw error; // Re-throw the error so it can be caught in the component
      }
    },

    async updateSellerProfile(sellerId, updatedData) {
      try {
        if (!this.token) throw new Error("No token available");

        const response = await apiClient.put(
          `/seller/${sellerId}/profile`,
          updatedData,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.sellerProfile = response.data;
        localStorage.setItem("sellerProfile", JSON.stringify(response.data));
        toast.success("Profile updated successfully.");
      } catch (error) {
        console.error("Error updating seller profile:", error);
        this.errorMessage = "Failed to update seller profile.";
        toast.error(this.errorMessage);
      }
    },

    async deleteSellerAccount(sellerId) {
      try {
        if (!this.token) throw new Error("No token available");

        await apiClient.delete(`/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.sellerProfile = null;
        localStorage.removeItem("sellerProfile");
        toast.success("Seller account deleted successfully.");
      } catch (error) {
        console.error("Error deleting seller account:", error);
        this.errorMessage = "Failed to delete seller account.";
        toast.error(this.errorMessage);
      }
    },

    async fetchSellerProducts(sellerId) {
      try {
        const userStore = useUserStore();
        if (!userStore.token) throw new Error("No token available");

        // Use provided sellerId or fallback to current seller's ID
        const targetSellerId = sellerId || this.sellerProfile?._id;

        if (!targetSellerId) {
          throw new Error("Seller ID not available");
        }

        console.log("Fetching products for seller:", targetSellerId);

        const response = await apiClient.get(
          `/seller/${targetSellerId}/products`,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        return response.data;
      } catch (error) {
        console.error("Error fetching seller products:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        toast.error("Failed to load seller products");
        throw error;
      }
    },

    async fetchSellerCoupons() {
      try {
        const response = await apiClient.get("/coupons/seller", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching seller coupons:", error);
        throw error;
      }
    },

    async createCoupon(couponData) {
      try {
        const response = await apiClient.post("/coupons/create", couponData, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        console.error("Error creating coupon:", error);
        if (error.response && error.response.status === 400) {
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    },

    async downloadReport(reportType, dateParams) {
      console.log("[Report] Starting download:", { reportType, dateParams });

      try {
        if (!this.token) throw new Error("No token available");
        if (!this.sellerProfile?._id)
          throw new Error("Seller ID not available");

        // Remove responseType: 'blob' since we're expecting JSON
        const response = await apiClient.get(
          `/seller/${this.sellerProfile._id}/reports/${reportType}`,
          {
            params: dateParams,
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

        console.log("[Report] Server response:", response.data);

        if (!response.data) {
          throw new Error("No data received from server");
        }

        // Return the JSON response directly
        return response;
      } catch (error) {
        console.error(
          `[Report] Error downloading ${reportType} report:`,
          error
        );
        console.error("[Report] Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.error(
          `Failed to download ${reportType} report. Please try again.`
        );
        throw error;
      }
    },

    async updateCoupon(couponId, couponData) {
      try {
        const response = await apiClient.put(
          `/coupons/${couponId}`,
          couponData,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error updating coupon:", error);
        throw error;
      }
    },

    async deleteCoupon(couponId) {
      try {
        await apiClient.delete(`/coupons/${couponId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
      } catch (error) {
        console.error("Error deleting coupon:", error);
        throw error;
      }
    },

    // async getFavoriteStores() {
    //   const userStore = useUserStore();
    //   try {
    //     if (!userStore.token) throw new Error("No token available");

    //     const response = await apiClient.get("/seller/user-favorites", {
    //       headers: { Authorization: `Bearer ${userStore.token}` },
    //     });

    //     return response.data;
    //   } catch (error) {
    //     console.error("Error fetching favorite stores:", error);
    //     toast.error("Failed to load favorite stores");
    //     return [];
    //   }
    // },

    async getFavoriteStores() {
      const userStore = useUserStore();
      const orderStore = useOrderStore();
      try {
        if (!userStore.token) throw new Error("No token available");

        console.log("Fetching favorite stores...");
        const response = await apiClient.get("/seller/user-favorites", {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        const favoriteStores = response.data;
        console.log("Favorite stores data:", favoriteStores);

        // Get seller profiles with user data
        const storesWithProfiles = await Promise.all(
          favoriteStores.map(async (store) => {
            try {
              const profileResponse = await apiClient.get(
                `/seller/${store._id}`,
                {
                  headers: { Authorization: `Bearer ${userStore.token}` },
                }
              );
              return { ...store, userData: profileResponse.data };
            } catch (error) {
              console.error(
                `Error fetching profile for store ${store._id}:`,
                error
              );
              return store;
            }
          })
        );

        // Get all orders
        console.log("Fetching all orders...");
        const allOrders = await orderStore.fetchUserOrders();
        console.log("All orders:", allOrders);

        const formattedStores = storesWithProfiles.map((store) => {
          // Get delivered orders for this store
          const deliveredOrders = allOrders.filter((order) => {
            const isDelivered =
              order.status?.toLowerCase() === "delivered" ||
              order.status?.toLowerCase() === "completed";
            // Match using the seller field from Orders model
            const isStoreSeller = store.userData?.user?._id === order.seller;

            console.log(
              `Checking order ${order._id} for store ${store.storeName}:`,
              {
                orderId: order._id,
                orderSeller: order.seller,
                storeUserId: store.userData?.user?._id,
                sellersMatch: isStoreSeller,
                orderStatus: order.status,
                isDelivered,
              }
            );

            return isDelivered && isStoreSeller;
          });

          console.log(`\nAnalyzing store ${store.storeName}:`, {
            storeId: store._id,
            storeUserId: store.userData?.user?._id,
            deliveredCount: deliveredOrders.length,
            orders: deliveredOrders.map((o) => ({
              id: o._id,
              seller: o.seller,
              status: o.status,
            })),
          });

          return {
            _id: store._id,
            storeName: store.storeName,
            storeDescription: store.storeDescription,
            profileImage: store.profileImage,
            backgroundImage: store.backgroundImage,
            totalProducts: store.totalProducts || 0,
            averageRating: store.averageRating || 0,
            deliveredOrders: deliveredOrders.length,
            totalReviews: store.totalReviews || 0,
            followers: store.followers?.length || 0,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt,
            isVacationMode: store.isVacationMode,
          };
        });

        console.log("Formatted stores:", formattedStores);
        return formattedStores;
      } catch (error) {
        console.error("Error fetching favorite stores:", error);
        toast.error("Failed to load favorite stores");
        return [];
      }
    },

    async unfollowStore(sellerId) {
      try {
        const userStore = useUserStore();
        if (!userStore.token) throw new Error("No token available");

        await apiClient.post(
          `/seller/${sellerId}/unfollow`,
          {},
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );
        toast.success("Store unfollowed successfully");
      } catch (error) {
        console.error("Error unfollowing store:", error);
        toast.error("Failed to unfollow store");
        throw error;
      }
    },

    async toggleVacationMode() {
      try {
        if (!this.token) throw new Error("No token available");
        if (!this.sellerProfile) throw new Error("Seller profile not loaded");

        const sellerId = this.sellerProfile._id;
        const response = await apiClient.post(
          `/seller/${sellerId}/toggle-vacation-mode`,
          {},
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

        this.sellerProfile.isVacationMode = response.data.isVacationMode;
        localStorage.setItem(
          "sellerProfile",
          JSON.stringify(this.sellerProfile)
        );

        return response.data.isVacationMode;
      } catch (error) {
        console.error("Error toggling vacation mode:", error);
        toast.error("Failed to toggle vacation mode. Please try again.");
        throw error;
      }
    },

    async updateOrderStatus(orderId, newStatus) {
      const userStore = useUserStore();

      console.log("updateOrderStatus called with:", orderId, newStatus);

      if (!orderId) {
        console.error("Order ID is undefined");
        throw new Error("Order ID is required to update status");
      }

      // If orderId is an object, extract the _id
      if (typeof orderId === "object" && orderId._id) {
        orderId = orderId._id;
      }

      try {
        if (!userStore.token) throw new Error("No token available");

        console.log(`Updating order ${orderId} to status: ${newStatus}`);
        const response = await apiClient.patch(
          `/orders/${orderId}/status`,
          { status: newStatus },
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        console.log("Update order status response:", response.data);
        toast.success("Order status updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating order status:", error);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);

          if (error.response.status === 401) {
            console.log("Token expired. Attempting to refresh...");
            try {
              await userStore.refreshToken();
              console.log("Token refreshed. Retrying update...");
              return this.updateOrderStatus(orderId, newStatus);
            } catch (refreshError) {
              console.error("Failed to refresh token:", refreshError);
              userStore.logoutUser();
              throw new Error("Session expired. Please log in again.");
            }
          } else if (error.response.status === 403) {
            toast.error(
              "You don't have permission to update this order status."
            );
          } else {
            toast.error("Failed to update order status. Please try again.");
          }
        }
        throw error;
      }
    },

    // ===================================
    async fetchFollowStatus(sellerId) {
      try {
        const userStore = useUserStore();
        if (!userStore.token) throw new Error("No token available");

        const response = await apiClient.get(
          `/seller/${sellerId}/follow-status`,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        this.isFollowing = response.data.isFollowing;
        this.followersCount = response.data.followersCount;
        return response.data;
      } catch (error) {
        console.error("Error fetching follow status:", error);
        toast.error("Failed to load follow status. Please try again.");
      }
    },

    async toggleFollow(sellerId) {
      try {
        const userStore = useUserStore();
        if (!userStore.token) throw new Error("No token available");

        const endpoint = this.isFollowing ? "unfollow" : "follow";
        const response = await apiClient.post(
          `/seller/${sellerId}/${endpoint}`,
          {},
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        this.isFollowing = !this.isFollowing;
        this.followersCount = response.data.followersCount;

        toast.success(
          this.isFollowing ? "Followed successfully" : "Unfollowed successfully"
        );

        return {
          isFollowing: this.isFollowing,
          followersCount: this.followersCount,
        };
      } catch (error) {
        console.error("Error toggling follow:", error);
        toast.error("Failed to update follow status. Please try again.");
      }
    },

    async sendMessageToSeller(sellerId, messageData) {
      const userStore = useUserStore();
      try {
        if (!userStore.token) throw new Error("No token available");

        const response = await apiClient.post(
          `/seller/${sellerId}/message`,
          messageData,
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        return response.data;
      } catch (error) {
        console.error("Error sending message to seller:", error);
        toast.error("Failed to send message to seller");
        throw error;
      }
    },

    // =================================

    // for 24 hours cooldown
    // async requestVerification() {
    //   try {
    //     if (!this.token) throw new Error("No token available");
    //     if (!this.sellerProfile) throw new Error("Seller profile not loaded");

    //     const sellerId = this.sellerProfile._id;

    //     const response = await apiClient.post(
    //       `/seller/${sellerId}/request-verification`,
    //       {},
    //       {
    //         headers: { Authorization: `Bearer ${this.token}` },
    //       }
    //     );

    //     // Update the verification status based on the server response
    //     this.sellerProfile.verificationStatus =
    //       response.data.verificationStatus;

    //     this.cooldownEndTime = response.data.cooldownEndTime;

    //     localStorage.setItem(
    //       "sellerProfile",
    //       JSON.stringify(this.sellerProfile)
    //     );

    //     toast.success("Verification request submitted successfully.");
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error requesting verification:", error);
    //     if (error.response && error.response.status === 400) {
    //       toast.error(
    //         error.response.data.error ||
    //           "Failed to submit verification request. Please try again."
    //       );
    //     } else {
    //       toast.error(
    //         "Failed to submit verification request. Please try again."
    //       );
    //     }
    //     throw error;
    //   }
    // },

    // for 5 minutes cooldown
    async requestVerification() {
      try {
        if (!this.token) throw new Error("No token available");
        if (!this.sellerProfile) throw new Error("Seller profile not loaded");

        const sellerId = this.sellerProfile._id;
        console.log("Requesting verification for seller:", sellerId);

        // First check if cooldown is active
        if (
          this.cooldownEndTime &&
          new Date(this.cooldownEndTime) > new Date()
        ) {
          const remainingTime = Math.ceil(
            (new Date(this.cooldownEndTime) - new Date()) / 1000
          );
          throw new Error(
            `Please wait ${remainingTime} seconds before requesting verification again`
          );
        }

        const response = await apiClient.post(
          `/seller/${sellerId}/request-verification`,
          {},
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

        // Update verification status and cooldown time
        this.sellerProfile.verificationStatus =
          response.data.verificationStatus;

        // Set cooldown time to 5 minutes from now
        this.cooldownEndTime = new Date(
          Date.now() + 5 * 60 * 1000
        ).toISOString();

        // Update localStorage
        localStorage.setItem(
          "sellerProfile",
          JSON.stringify(this.sellerProfile)
        );

        console.log("Verification request completed:", {
          status: response.data.verificationStatus,
          cooldownEndTime: this.cooldownEndTime,
        });

        toast.success("Verification request submitted successfully.");
        return response.data;
      } catch (error) {
        console.error("Error requesting verification:", error);
        toast.error(
          error.message ||
          "Failed to submit verification request. Please try again."
        );
        throw error;
      }
    },

    async fetchVerificationStatus(sellerId) {
      try {
        if (!this.token) throw new Error("No token available");

        const response = await apiClient.get(`/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        // Update verification status and last request time in 24 hours cooldown
        if (response.data) {
          // Update verification status and last request time
          this.sellerProfile.verificationStatus =
            response.data.verificationStatus;

          // Set cooldown time to 24 hours from lastVerificationRequest
          // this.cooldownEndTime = response.data.lastVerificationRequest
          //   ? new Date(
          //       new Date(response.data.lastVerificationRequest).getTime() +
          //         24 * 60 * 60 * 1000 // Add 24 hours to last request time
          //     )
          //   : null;

          // Set cooldown time to 5 minutes from lastVerificationRequest
          if (response.data.lastVerificationRequest) {
            this.cooldownEndTime = new Date(
              new Date(response.data.lastVerificationRequest).getTime() +
              5 * 60 * 1000
            ).toISOString();

            console.log("Debug - Cooldown Setup:", {
              lastRequest: response.data.lastVerificationRequest,
              cooldownEndTime: this.cooldownEndTime,
              currentTime: new Date(),
              status: response.data.verificationStatus,
            });
          } else {
            this.cooldownEndTime = null;
          }

          // Update localStorage
          localStorage.setItem(
            "sellerProfile",
            JSON.stringify(this.sellerProfile)
          );
        }

        return {
          verificationStatus: response.data.verificationStatus,
          lastVerificationRequest: response.data.lastVerificationRequest,
        };
      } catch (error) {
        console.error("Error fetching verification status:", error);
        toast.error("Failed to fetch verification status");
        throw error;
      }
    },

    async updateVerificationStatus(sellerId, status) {
      try {
        if (!this.token) throw new Error("No token available");

        const response = await apiClient.put(
          `/seller/${sellerId}/verify`,
          { status },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

        if (this.sellerProfile && this.sellerProfile._id === sellerId) {
          this.sellerProfile.verificationStatus = status;
          localStorage.setItem(
            "sellerProfile",
            JSON.stringify(this.sellerProfile)
          );
        }

        toast.success(
          `Seller verification status updated to ${status} successfully.`
        );
        return response.data;
      } catch (error) {
        console.error("Error updating verification status:", error);
        toast.error("Failed to update verification status. Please try again.");
        throw error;
      }
    },

    async fetchPendingVerifications() {
      try {
        if (!this.token) throw new Error("No token available");

        const response = await apiClient.get("/seller/pending-verifications", {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        this.pendingVerifications = response.data;
        return response.data;
      } catch (error) {
        console.error("Error fetching pending verifications:", error);
        toast.error("Failed to load pending verifications. Please try again.");
        throw error;
      }
    },

    async cancelVerificationRequest() {
      try {
        if (!this.token) throw new Error("No token available");
        if (!this.sellerProfile) throw new Error("Seller profile not loaded");

        const sellerId = this.sellerProfile._id;
        const response = await apiClient.post(
          `/seller/${sellerId}/cancel-verification`,
          {},
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

        this.sellerProfile.verificationStatus = "not_submitted";
        localStorage.setItem(
          "sellerProfile",
          JSON.stringify(this.sellerProfile)
        );
        toast.success("Verification request cancelled successfully.");
        return response.data;
      } catch (error) {
        console.error("Error cancelling verification request:", error);
        toast.error("Failed to cancel verification request. Please try again.");
        throw error;
      }
    },

    // ================================================

    checkTokenExpiration() {
      try {
        if (this.token) {
          const decodedToken = jwtDecode(this.token);
          const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();

          if (expirationTime - currentTime <= 10000) {
            // Less than 10 seconds remaining
            this.initiateLogoutCountdown();
          }
        }
      } catch (error) {
        console.error("Error checking token expiration:", error);
        this.logoutUser();
      }
    },

    initiateLogoutCountdown() {
      toast.warning("Session expired. Logging out in 10 seconds...", {
        duration: 10000,
      });

      setTimeout(() => {
        this.logoutUser();
      }, 10000);
    },

    logoutUser() {
      this.sellerProfile = null;
      this.token = null;
      localStorage.removeItem("sellerProfile");
      localStorage.removeItem("token");
      toast.error("Your session has expired. Please log in again.");
    },

    setSeller(seller, token) {
      this.sellerProfile = seller;
      this.token = token;
      localStorage.setItem("sellerProfile", JSON.stringify(seller));
      localStorage.setItem(
        "user",
        JSON.stringify({ token, userId: seller._id })
      );
    },

    clearSeller() {
      this.sellerProfile = null;
      this.token = null;
      localStorage.removeItem("sellerProfile");
      localStorage.removeItem("token");
    },
  },
});

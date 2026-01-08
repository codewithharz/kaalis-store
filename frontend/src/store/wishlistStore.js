// src/store/wishlistStore.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { useUserStore } from "./user";
import { toast } from "vue-sonner";

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    wishlists: [],
    currentWishlist: null,
    token: localStorage.getItem("token") || null,
    errorMessage: "",
    currentPage: 1,
    totalPages: 1,
    limit: 12,
  }),
  getters: {
    hasWishlists: (state) => state.wishlists.length > 0,

    totalWishlistProducts: (state) => {
      return state.wishlists.reduce((total, wishlist) => {
        return total + (wishlist.products?.length || 0);
      }, 0);
    },
  },
  actions: {
    async fetchUserWishlists() {
      return this.handleRequest(async () => {
        const userStore = useUserStore();
        const userId = userStore.user._id;

        // Ensure token is set before making request
        if (!this.token) {
          this.token = userStore.token || localStorage.getItem("token");
        }

        if (!this.token) {
          throw new Error("No token available");
        }

        const response = await apiClient.get(`/wishlists/user/${userId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.wishlists = response.data.wishlists;
        console.log("Fetched wishlists in store:", this.wishlists);
      }, "Failed to load wishlists.");
    },

    async createWishlist(wishlistData) {
      return this.handleRequest(async () => {
        const response = await apiClient.post("/wishlists", wishlistData, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.wishlists.push(response.data.wishlist);
        toast.success("Wishlist created successfully.");
      }, "Failed to create wishlist.");
    },

    async getProductsInWishlist(wishlistId, page = 1) {
      try {
        const response = await apiClient.get(
          `/wishlists/${wishlistId}/products`,
          {
            headers: { Authorization: `Bearer ${this.token}` },

            params: {
              page,
              limit: this.limit,
            },
          }
        );
        console.log("API response:", response.data);
        const products = response.data.products || [];
        this.currentPage = response.data.currentPage || 1;
        this.totalPages = response.data.totalPages || 1;
        return {
          products,
          currentPage: this.currentPage,
          totalPages: this.totalPages,
        };
      } catch (error) {
        console.error("Failed to load products in wishlist:", error);
        throw error;
      }
    },

    async getWishlistById(wishlistId) {
      return this.handleRequest(async () => {
        const response = await apiClient.get(`/wishlists/${wishlistId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.currentWishlist = response.data.wishlist;
      }, "Failed to load wishlist.");
    },

    async updateWishlistItem(wishlistId, productId, updateData) {
      return this.handleRequest(async () => {
        const response = await apiClient.patch(
          `/wishlists/${wishlistId}/products/${productId}`,
          updateData,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

        // Update the local state
        const wishlistIndex = this.wishlists.findIndex(
          (w) => w._id === wishlistId
        );
        if (wishlistIndex !== -1) {
          const productIndex = this.wishlists[wishlistIndex].products.findIndex(
            (p) => p._id === productId
          );
          if (productIndex !== -1) {
            this.wishlists[wishlistIndex].products[productIndex] = {
              ...this.wishlists[wishlistIndex].products[productIndex],
              ...updateData,
            };
          }
        }

        toast.success("Wishlist item updated successfully.");
        return response.data;
      }, "Failed to update wishlist item.");
    },

    async deleteWishlist(wishlistId) {
      return this.handleRequest(async () => {
        await apiClient.delete(`/wishlists/${wishlistId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.wishlists = this.wishlists.filter((w) => w._id !== wishlistId);
        toast.success("Wishlist deleted successfully.");
      }, "Failed to delete wishlist.");
    },

    async shareWishlist(wishlistId, sharedWith, products) {
      return this.handleRequest(async () => {
        const response = await apiClient.post(
          `/wishlists/${wishlistId}/share`,
          { sharedWith, products },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        const index = this.wishlists.findIndex((w) => w._id === wishlistId);
        if (index !== -1) {
          this.wishlists[index] = response.data.wishlist;
        }
        toast.success("Wishlist shared successfully.");
      }, "Failed to share wishlist.");
    },

    async toggleWishlistNotifications(wishlistId, notificationsEnabled) {
      return this.handleRequest(async () => {
        const response = await apiClient.patch(
          `/wishlists/${wishlistId}/notifications`,
          { notificationsEnabled },
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        const index = this.wishlists.findIndex((w) => w._id === wishlistId);
        if (index !== -1) {
          this.wishlists[index] = response.data.wishlist;
        }
        toast.success("Wishlist notifications updated successfully.");
      }, "Failed to update wishlist notifications.");
    },

    async addCategory(wishlistId, category) {
      return this.handleRequest(async () => {
        const response = await apiClient.post(
          `/wishlists/${wishlistId}/categories`,
          category,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        const index = this.wishlists.findIndex((w) => w._id === wishlistId);
        if (index !== -1) {
          this.wishlists[index] = response.data.wishlist;
        }
        toast.success("Category added to wishlist successfully.");
      }, "Failed to add category to wishlist.");
    },

    async removeCategory(wishlistId, categoryId) {
      return this.handleRequest(async () => {
        const response = await apiClient.delete(
          `/wishlists/${wishlistId}/categories/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        const index = this.wishlists.findIndex((w) => w._id === wishlistId);
        if (index !== -1) {
          this.wishlists[index] = response.data.wishlist;
        }
        toast.success("Category removed from wishlist successfully.");
      }, "Failed to remove category from wishlist.");
    },

    async addToWishlist(wishlistId, productId) {
      return this.handleRequest(async () => {
        const response = await apiClient.post(
          `/wishlists/${wishlistId}/products`,
          { productId },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        const index = this.wishlists.findIndex((w) => w._id === wishlistId);
        if (index !== -1) {
          this.wishlists[index] = response.data.wishlist;
        }
        toast.success("Product added to wishlist successfully.");
      }, "Failed to add product to wishlist.");
    },

    async removeFromWishlist(wishlistId, productId) {
      return this.handleRequest(async () => {
        const response = await apiClient.delete(
          `/wishlists/${wishlistId}/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        const index = this.wishlists.findIndex((w) => w._id === wishlistId);
        if (index !== -1) {
          this.wishlists[index] = response.data.wishlist;
        }
        toast.success("Product removed from wishlist successfully.");
      }, "Failed to remove product from wishlist.");
    },

    // async initWishlist() {
    //   const userStore = useUserStore();
    //   if (userStore.isLoggedIn) {
    //     await this.fetchUserWishlists();
    //   }
    // },
    async initWishlist() {
      const userStore = useUserStore();
      if (userStore.isLoggedIn) {
        // Get fresh token from user store or localStorage
        this.token = userStore.token || localStorage.getItem("token");
        if (this.token) {
          try {
            await this.fetchUserWishlists();
          } catch (error) {
            console.error("Error initializing wishlist:", error);
            // Only show error toast if it's not a token-related error
            if (!error.message.includes("No token available")) {
              toast.error("Failed to load wishlists");
            }
          }
        }
      }
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    clearToken() {
      this.token = null;
      localStorage.removeItem("token");
    },

    async handleRequest(requestFunction, errorMessage) {
      try {
        if (!this.token) throw new Error("No token available");
        await requestFunction();
        localStorage.setItem("userWishlists", JSON.stringify(this.wishlists));
      } catch (error) {
        console.error(errorMessage, error);
        this.errorMessage = errorMessage;
        toast.error(this.errorMessage);
        throw error;
      }
    },
  },
});

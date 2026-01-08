import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { useUserStore } from "./user";
import { toast } from "vue-sonner";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    isLoading: false,
    error: null,
    coupon: JSON.parse(localStorage.getItem("cartCoupon")) || null,
    discount: 0,
    _cartTotal: 0, // New mutable property for cart total
  }),

  getters: {
    cartCount: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),
    cartTotal: (state) => state._cartTotal, // Keep cartTotal instead of total for consistency
    totalAfterDiscount: (state) => state.cartTotal - state.discount,
    appliedCouponCode: (state) => state.coupon?.code || null,
  },

  actions: {
    async initialize() {
      if (this.$state) return; // Already initialized

      try {
        await this.fetchCart();
      } catch (error) {
        console.error("Failed to initialize cart store:", error);
        // Set default state
        this.items = [];
        this._cartTotal = 0;
        this.discount = 0;
      }
    },

    calculateCartTotal() {
      this._cartTotal = this.items.reduce((total, item) => {
        const price = item.variant?.price || item.product?.price || 0;
        return total + price * item.quantity;
      }, 0);
    },

    calculateDiscount() {
      // if (this.coupon && this.coupon.discountPercentage) {
      //   this.discount = (this.cartTotal * this.coupon.discountPercentage) / 100;
      // } else {
      //   this.discount = 0;
      // }

      if (!this.coupon) {
        this.discount = 0;
        return;
      }

      // Handle CluesBucks fixed amount coupons
      if (this.coupon.code.startsWith("CB")) {
        this.discount = 1000; // Fixed ₦1000 discount for CluesBucks
      }
      // Handle percentage-based coupons
      else if (this.coupon.discountPercentage) {
        this.discount = (this.cartTotal * this.coupon.discountPercentage) / 100;
      } else {
        this.discount = 0;
      }
    },

    // In cart.js
    async addToCart(product, quantity, options = {}) {
      const userStore = useUserStore();
      this.isLoading = true;
      this.error = null;

      try {
        // Log the incoming options and variant
        console.log("Add to cart options:", options);
        console.log("Add to cart variant:", options.variant);

        const payload = {
          productId: product._id,
          quantity,
          variant: options.variant,
        };

        console.log("Final payload to server:", payload);

        const response = await apiClient.post("/cart", payload, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });

        // Log the response from the server
        console.log("Server response:", response.data);

        if (response.data?.products) {
          // Map the response data, ensuring variant information is preserved
          this.items = response.data.products
            .filter((item) => item.product != null)
            .map((item) => {
              console.log("Mapping cart item:", item);
              return {
                ...item,
                variant: item.variant || null, // Ensure variant is included
                product: {
                  ...item.product,
                  price: item.variant?.price || item.product.price,
                },
              };
            });

          console.log("Mapped items:", this.items);
        }

        await this.fetchCart();
        this.calculateCartTotal();
        this.calculateDiscount();
      } catch (error) {
        console.error("Error adding to cart:", error);
        this.error = "Failed to add item to cart";
        toast.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCart() {
      const userStore = useUserStore();
      if (!userStore.checkTokenExpiration()) return;

      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiClient.get("/cart", {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });

        console.log("Cart fetch response:", response.data);

        this.items = (response.data.products || [])
          .filter((item) => item.product != null)
          .map((item) => {
            console.log("Processing cart item:", item);

            // Find matching variant from product variants using the variant info from the server
            let matchingVariant;
            if (item.product.variants && item.variant?._id) {
              // Find the variant using the ID returned from the server
              matchingVariant = item.product.variants.find(
                (v) => v._id === item.variant._id
              );
            }

            console.log("Found matching variant:", matchingVariant);

            const mappedItem = {
              ...item,
              variant: matchingVariant || null,
              product: item.product,
            };

            console.log("Mapped item with variant:", mappedItem);
            return mappedItem;
          });

        console.log("Final cart items:", this.items);
        this.calculateCartTotal();
        this.calculateDiscount();
      } catch (error) {
        console.error("Error fetching cart:", error);
        this.error = "Failed to load cart";
        if (error.response?.status === 404) {
          this.items = [];
        }
        toast.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateQuantity(productId, newQuantity) {
      const userStore = useUserStore();
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiClient.put(
          `/cart/${productId}`,
          {
            quantity: newQuantity,
          },
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        if (response.data && response.data.products) {
          this.items = response.data.products.filter(
            (item) => item.product != null
          );
        } else {
          await this.fetchCart();
        }

        this.calculateDiscount();
        toast.success("Cart updated");
      } catch (error) {
        console.error("Error updating cart:", error);
        this.error = "Failed to update cart";
        toast.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async removeFromCart(productId) {
      const userStore = useUserStore();
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiClient.delete(`/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });

        if (
          response.data &&
          response.data.cart &&
          response.data.cart.products
        ) {
          this.items = response.data.cart.products.filter(
            (item) => item.product != null
          );
        } else {
          await this.fetchCart();
        }

        this.calculateDiscount();
        toast.success("Item removed from cart");
      } catch (error) {
        console.error("Error removing from cart:", error);
        this.error = "Failed to remove item from cart";
        toast.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async applyCoupon(code) {
      const userStore = useUserStore();
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiClient.post(
          "/coupons/apply",
          { code },
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        this.coupon = response.data.coupon;
        localStorage.setItem("cartCoupon", JSON.stringify(this.coupon));
        this.calculateDiscount();

        // Adjust success message based on discount type
        const discountMessage = this.coupon.code.startsWith("CB")
          ? `₦${this.discount.toFixed(2)}`
          : `${this.coupon.discountPercentage}%`;

        toast.success(
          `Coupon applied successfully! You saved $${this.discount.toFixed(2)}`
        );

        return response.data;
      } catch (error) {
        console.error("Error applying coupon:", error);
        this.error = "Failed to apply coupon";
        toast.error(error.response?.data?.message || this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // In useCartStore.js
    async invalidateCoupon(code) {
      try {
        await apiClient.post(
          "/coupons/invalidate",
          { code },
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        this.coupon = null;
        this.discount = 0;
        localStorage.removeItem("cartCoupon");
      } catch (error) {
        console.error("Error invalidating coupon:", error);
        throw error;
      }
    },

    async removeCoupon() {
      const userStore = useUserStore();
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiClient.post(
          "/coupons/remove",
          {},
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        this.coupon = null;
        this.discount = 0;
        localStorage.removeItem("cartCoupon");

        // Update the cart total if the response includes it
        if (
          response.data &&
          response.data.cart &&
          typeof response.data.cart.totalAmount === "number"
        ) {
          this._cartTotal = response.data.cart.totalAmount;
        } else {
          this.calculateCartTotal();
        }

        this.calculateDiscount();

        toast.success("Coupon removed successfully");
        return response.data;
      } catch (error) {
        console.error("Error removing coupon:", error);
        this.error = "Failed to remove coupon";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            "An error occurred while removing the coupon. Please try again."
          );
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // calculateCartTotal() {
    //   const subtotal = this.items.reduce(
    //     (total, item) => total + item.total,
    //     0
    //   );
    //   const totalAfterDiscount = subtotal - this.discount;
    //   return Math.max(0, totalAfterDiscount); // Ensure the total is not negative
    // },
    calculateCartTotal() {
      this._cartTotal = this.items.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0
      );
    },

    // async clearCart() {
    //   this.items = [];
    //   this.coupon = null;
    //   this.discount = 0;
    //   localStorage.removeItem("cartCoupon");

    //   const userStore = useUserStore();
    //   try {
    //     await apiClient.delete("/cart", {
    //       headers: {
    //         Authorization: `Bearer ${userStore.token}`,
    //       },
    //     });
    //   } catch (error) {
    //     console.error("Error clearing cart on server:", error);
    //   }
    // },

    async clearCart() {
      const userStore = useUserStore();
      this.isLoading = true;
      this.error = null;
      try {
        await apiClient.delete("/cart", {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        // Clear local state
        this.items = [];
        this.coupon = null;
        this.discount = 0;
        this._cartTotal = 0;
        localStorage.removeItem("cartCoupon");
        this.calculateCartTotal();
        this.calculateDiscount();
        toast.success("Cart cleared successfully");
      } catch (error) {
        console.error("Error clearing cart on server:", error);
        this.error = "Failed to clear cart on server";
        toast.error(this.error);
        // Even if the server request fails, clear the local cart
        this.items = [];
        this.coupon = null;
        this.discount = 0;
        this._cartTotal = 0;
        localStorage.removeItem("cartCoupon");
      } finally {
        this.isLoading = false;
      }
    },

    getOrderData() {
      return {
        items: this.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        couponCode: this.appliedCouponCode,
        totalAmount: this.totalAfterDiscount,
      };
    },
  },
});

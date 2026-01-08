// frontend/src/store/orderStore.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { useUserStore } from "./user";
import { useCartStore } from "./cart";
import { toast } from "vue-sonner";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    async createOrder(orderData) {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const cartStore = useCartStore();

        const cartData = cartStore.getOrderData();
        const subtotal = cartStore.cartTotal;
        const couponDiscount = cartStore.discount || 0;
        const couponCode = cartStore.coupon?.code;

        // Calculate fees
        const platformFeePercentage = 0.08; // 8%
        const platformFeeFactor =
          platformFeePercentage / (1 - platformFeePercentage);

        // Calculate base platform fee (8% of subtotal)
        const basePlatformFee = Math.round(subtotal * platformFeePercentage);

        // Calculate vendor amount (92% of subtotal)
        const baseVendorAmount = Math.round(
          subtotal * (1 - platformFeePercentage)
        );

        // Add shipping fee to platform fee if applicable
        const totalPlatformFee = basePlatformFee + (orderData.shippingFee || 0);

        // Calculate final vendor amount after discounts
        const totalDiscount =
          (couponDiscount || 0) + (orderData.cluesBucks?.discount || 0);
        const finalVendorAmount = Math.max(
          0,
          baseVendorAmount - totalDiscount * (1 - platformFeePercentage)
        );

        const completeOrderData = {
          ...orderData,
          ...cartData,
          items: cartStore.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            vendorAmount: Math.round(
              item.product.price * item.quantity * (1 - platformFeePercentage)
            ),
            platformFee: Math.round(
              item.product.price * item.quantity * platformFeePercentage
            ),
          })),
          subtotal,
          totalAmount: subtotal - totalDiscount, // Base amount before fees
          total: subtotal - totalDiscount + (orderData.shippingFee || 0), // Final total including shipping
          vendorAmount: finalVendorAmount,
          platformFee: totalPlatformFee,
          couponCode,
          couponDiscount,
          cluesBucks: {
            ...orderData.cluesBucks,
            pointsEarned: Math.floor(
              (subtotal -
                couponDiscount -
                (orderData.cluesBucks?.discount || 0)) /
                100
            ),
          },
        };

        const response = await apiClient.post("/orders", completeOrderData, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        this.currentOrder = response.data.order;

        await cartStore.clearCart();

        toast.success("Order placed successfully");
        return response.data.order;
      } catch (error) {
        console.error("Error creating order:", error);
        this.error = error.response?.data?.message || "Failed to create order";
        toast.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUserOrders() {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.get(
          `/orders/user/${userStore.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );
        console.log("User orders response:", response.data);
        this.orders = response.data.orders || [];
        return this.orders; // Add this line to return the fetched orders
      } catch (error) {
        console.error("Error fetching user orders:", error);
        this.error = error.response?.data?.message || "Failed to fetch orders";
        toast.error(this.error);
        return []; // Return an empty array in case of error
      } finally {
        this.isLoading = false;
      }
    },

    // async fetchOrder(orderId) {
    //   this.isLoading = true;
    //   this.error = null;
    //   try {
    //     const userStore = useUserStore();
    //     const response = await apiClient.get(`/orders/${orderId}`, {
    //       headers: {
    //         Authorization: `Bearer ${userStore.token}`,
    //       },
    //     });
    //     return response.data.order;
    //   } catch (error) {
    //     console.error("Error fetching order:", error);
    //     this.error = error.response?.data?.message || "Failed to fetch order";
    //     toast.error(this.error);
    //     throw error;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    async fetchOrder(orderId) {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.get(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });

        // Ensure all required fields exist with fallbacks
        const orderData = response.data.order || {};
        return {
          ...orderData,
          subtotal: orderData.subtotal || orderData.totalAmount || 0,
          total: orderData.total || orderData.totalAmount || 0,
          discount: orderData.discount || 0,
          couponDiscount: orderData.couponDiscount || 0,
          shippingFee: orderData.shippingFee || 0,
          cluesBucks: {
            ...(orderData.cluesBucks || {}),
            discount: orderData.cluesBucks?.discount || 0,
            pointsEarned: orderData.cluesBucks?.pointsEarned || 0,
            pointsUsed: orderData.cluesBucks?.pointsUsed || 0,
          },
        };
      } catch (error) {
        console.error("Error fetching order:", error);
        this.error = error.response?.data?.message || "Failed to fetch order";
        toast.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async getOrderById(orderId) {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.get(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        this.currentOrder = response.data.order;
        return response.data.order;
      } catch (error) {
        console.error("Error fetching order:", error);
        this.error = error.response?.data?.message || "Failed to fetch order";
        toast.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    // fee calculation helper
    calculateFees(subtotal, shippingFee = 0) {
      const platformFeePercentage = 0.08;
      const basePlatformFee = Math.round(subtotal * platformFeePercentage);
      const totalPlatformFee = basePlatformFee + shippingFee;
      const vendorAmount = Math.round(subtotal * (1 - platformFeePercentage));

      return {
        platformFee: totalPlatformFee,
        vendorAmount,
      };
    },

    async getOrderByOrderId(orderId) {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.get(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });

        // Log the response to debug
        console.log("Order API response:", response.data);

        // Ensure all required fields exist with fallbacks
        const orderData = response.data.order || {};
        const subtotal = orderData.subtotal || orderData.totalAmount || 0;

        // Validate the products data
        if (orderData.products) {
          console.log(
            "Product data received:",
            orderData.products.map((p) => ({
              id: p.product?._id,
              name: p.product?.name,
              hasImages: p.product?.images?.length > 0,
            }))
          );
        }

        // Calculate fees if they're not present
        let { platformFee, vendorAmount } = orderData;
        if (!platformFee || !vendorAmount) {
          const calculatedFees = this.calculateFees(
            subtotal,
            orderData.shippingFee || 0
          );
          platformFee = calculatedFees.platformFee;
          vendorAmount = calculatedFees.vendorAmount;
        }

        return {
          ...orderData,
          subtotal,
          total: orderData.total || orderData.totalAmount || 0,
          discount: orderData.discount || 0,
          couponDiscount: orderData.couponDiscount || 0,
          vendorAmount,
          platformFee,
          // platformFee: orderData.platformFee || 0,
          products: orderData.products || [],
          cluesBucks: {
            ...(orderData.cluesBucks || {}),
            discount: orderData.cluesBucks?.discount || 0,
            pointsEarned: orderData.cluesBucks?.pointsEarned || 0,
            pointsUsed: orderData.cluesBucks?.pointsUsed || 0,
          },
        };
      } catch (error) {
        console.error(`Error fetching order by orderId ${orderId}:`, error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Add this new method
    async updateOrderStatus(orderId, updateData) {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.patch(
          `/orders/${orderId}/status`,
          // updateData,
          {
            status: updateData.status,
            transactionId: updateData.transactionId, // Map to your model field
          },
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        if (response.data.status) {
          const updatedOrder = response.data.order;
          this._updateLocalOrder(orderId, updatedOrder);
          return updatedOrder;
        }

        throw new Error(
          response.data.message || "Failed to update order status"
        );
      } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateOrder(orderData) {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.patch(
          `/orders/${orderData.orderId}`,
          {
            products: orderData.products,
            address: orderData.address,
          },
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        const updatedOrder = response.data.order;
        this._updateLocalOrder(orderData.orderId, updatedOrder);

        toast.success("Order updated successfully");
        return updatedOrder;
      } catch (error) {
        console.error("Error updating order:", error);
        this.error = error.response?.data?.message || "Failed to update order";
        toast.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // async cancelOrder(orderId) {
    //   this.isLoading = true;
    //   this.error = null;
    //   try {
    //     const userStore = useUserStore();
    //     const response = await apiClient.patch(
    //       `/orders/${orderId}/cancel`,
    //       {
    //         status: "Cancelled",
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${userStore.token}`,
    //         },
    //       }
    //     );
    //     const updatedOrder = response.data.order;
    //     this._updateLocalOrder(orderId, updatedOrder);

    //     toast.success("Order cancelled successfully");
    //     return updatedOrder;
    //   } catch (error) {
    //     console.error("Error cancelling order:", error);
    //     this.error = error.response?.data?.message || "Failed to cancel order";
    //     toast.error(this.error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    // Helper method to update local state

    // In orderStore.js, update the cancelOrder method:

    async cancelOrder(orderId, reason = null) {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.patch(
          `/orders/${orderId}/cancel`,
          {
            status: "Cancelled",
            reason: reason || "Cancelled by user",
          },
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        // If it's a payment cancellation and the order was pending, delete from local state
        if (reason === "Payment cancelled by user") {
          this.orders = this.orders.filter((order) => order._id !== orderId);
          this.currentOrder =
            this.currentOrder?._id === orderId ? null : this.currentOrder;

          // Clean up any stored data
          localStorage.removeItem("currentTransaction");
          localStorage.removeItem(`payment_verification_${orderId}`);

          toast.info("Payment cancelled. You can try again when ready.");
        } else {
          // Otherwise update the order status
          const updatedOrder = response.data.order;
          this._updateLocalOrder(orderId, updatedOrder);
          toast.success("Order cancelled successfully");
        }

        return response.data.order;
      } catch (error) {
        console.error("Error cancelling order:", error);
        this.error = error.response?.data?.message || "Failed to cancel order";
        toast.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    _updateLocalOrder(orderId, updatedOrder) {
      const index = this.orders.findIndex((order) => order._id === orderId);
      if (index !== -1) {
        this.orders[index] = updatedOrder;
      }
      if (this.currentOrder?._id === orderId) {
        this.currentOrder = updatedOrder;
      }
    },

    async deletePendingOrder(orderId) {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.delete(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });

        // Remove from local state
        this.orders = this.orders.filter((order) => order._id !== orderId);
        this.currentOrder =
          this.currentOrder?._id === orderId ? null : this.currentOrder;

        return response.data;
      } catch (error) {
        console.error("Error deleting pending order:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async handlePaymentCancellation(orderId) {
      try {
        const order = this.orders.find((o) => o._id === orderId);

        // If order is pending, try to delete it
        if (order?.status === "Pending") {
          await this.deletePendingOrder(orderId);
        } else {
          // Otherwise just cancel it
          await this.cancelOrder(orderId, "Payment cancelled by user");
        }

        // Clean up stored data
        localStorage.removeItem("currentTransaction");
        localStorage.removeItem(`payment_verification_${orderId}`);
      } catch (error) {
        console.error("Error handling payment cancellation:", error);
        // Still try to clean up local storage even if request fails
        localStorage.removeItem("currentTransaction");
        localStorage.removeItem(`payment_verification_${orderId}`);
        throw error;
      }
    },

    async fetchOrderStatuses() {
      try {
        const response = await apiClient.get("/orders/statuses");
        return response.data.statuses;
      } catch (error) {
        console.error("Error fetching order statuses:", error);
        throw error;
      }
    },

    // async fetchUserOrdersWithProducts() {
    //   this.isLoading = true;
    //   this.error = null;
    //   try {
    //     const userStore = useUserStore();
    //     const response = await apiClient.get(
    //       `/orders/user/${userStore.user._id}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${userStore.token}`,
    //         },
    //       }
    //     );
    //     this.orders = response.data.orders.map((order) => ({
    //       ...order,
    //       products: order.products.map((product) => ({
    //         ...product,
    //         rated: product.rated || false,
    //       })),
    //     }));
    //     return this.orders;
    //   } catch (error) {
    //     console.error("Error fetching user orders with products:", error);
    //     this.error = error.response?.data?.message || "Failed to fetch orders";
    //     toast.error(this.error);
    //     throw error;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

    async fetchUserOrdersWithProducts() {
      this.isLoading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const response = await apiClient.get(
          `/orders/user/${userStore.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        if (!response.data?.orders) {
          console.error("Invalid response format:", response.data);
          throw new Error("Invalid response format from server");
        }

        this.orders = response.data.orders;
        return response.data.orders;
      } catch (error) {
        console.error("Error fetching user orders with products:", error);
        this.error = error.response?.data?.message || "Failed to fetch orders";
        toast.error(this.error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    updateProductRatedStatus(productId) {
      this.orders.forEach((order) => {
        order.products.forEach((product) => {
          if (product.product._id === productId) {
            product.rated = true;
          }
        });
      });
    },
  },
});

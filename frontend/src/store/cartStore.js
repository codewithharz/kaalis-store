import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [],
  }),
  actions: {
    addToCart(item) {
      this.cartItems.push(item);
    },
    removeFromCart(itemId) {
      this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    },
  },
});

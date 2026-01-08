import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { toast } from "vue-sonner";
import { useUserStore } from "../store/user"; // Import the user store

export const useAddressStore = defineStore("address", {
  state: () => ({
    addresses: JSON.parse(localStorage.getItem("userAddresses")) || [], // Changed to 'addresses' to handle multiple addresses
    token: localStorage.getItem("token") || null,
    errorMessage: "",
  }),
  getters: {
    hasAddresses: (state) => state.addresses.length > 0, // Changed to check if there are addresses
  },
  actions: {
    async fetchUserAddresses() {
      const userStore = useUserStore(); // Access the user store
      const userId = userStore.user._id; // Get the userId from the user store
      const token = userStore.token;

      console.log("userId: in fetchUser: ", userId);

      try {
        if (!this.token) {
          throw new Error("No token available");
        }

        const response = await apiClient.get(`/addresses/${userId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        console.log("Fetched addresses:", response.data);
        this.addresses = response.data;
        localStorage.setItem("userAddresses", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching addresses:", error);
        this.errorMessage = "Failed to load addresses.";
        toast.error(this.errorMessage);
      }
    },
    async addOrUpdateAddress(addressData) {
      const userStore = useUserStore();
      const userId = userStore.user._id;
      const token = userStore.token;

      try {
        if (!token) {
          throw new Error("No token available");
        }

        let response;
        if (addressData._id) {
          // If the address has an ID, update it
          response = await apiClient.put(
            `/addresses/${userId}/${addressData._id}`,
            addressData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const index = this.addresses.findIndex(
            (a) => a._id === addressData._id
          );
          if (index !== -1) {
            this.addresses[index] = response.data;
          }
          toast.success("Address updated successfully.");
        } else {
          // If the address doesn't have an ID, add it as a new address
          response = await apiClient.post(
            `/addresses/`,
            {
              ...addressData,
              userId,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          this.addresses.push(response.data);
          toast.success("Address added successfully.");
        }

        localStorage.setItem("userAddresses", JSON.stringify(this.addresses));
        return response.data;
      } catch (error) {
        console.error("Error adding/updating address:", error);
        this.errorMessage = "Failed to add/update address.";
        toast.error(this.errorMessage);
        throw error;
      }
    },
    async addAddress(addressData) {
      const userStore = useUserStore(); // Access the user store
      const userId = userStore.user._id; // Get the userId from the user store
      const token = userStore.token;

      try {
        if (!token) {
          throw new Error("No token available");
        }

        // Send the POST request with address data and userId
        const response = await apiClient.post(
          `/addresses/`,
          {
            ...addressData,
            userId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        this.addresses.push(response.data); // Assumes API returns the new address
        localStorage.setItem("userAddresses", JSON.stringify(this.addresses));
        toast.success("Address added successfully.");
      } catch (error) {
        // More detailed error handling
        if (error.response) {
          this.errorMessage =
            error.response.data.message || "Failed to add address.";
        } else if (error.request) {
          this.errorMessage = "No response from the server.";
        } else {
          this.errorMessage = error.message;
        }
        toast.error(this.errorMessage);
      }
    },

    async updateAddress(addressId, addressData) {
      const userStore = useUserStore(); // Access the user store
      const userId = userStore.user._id; // Get the userId from the user store
      const token = userStore.token;

      try {
        if (!this.token) {
          throw new Error("No token available");
        }

        const response = await apiClient.put(
          `/addresses/${userId}/${addressId}`,
          // `/addresses/${addressId}`, // Remove userId from URL here
          addressData,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        console.log("Updated address:", response.data);
        // Update address in the addresses array
        this.addresses = this.addresses.map((address) =>
          address._id === addressId ? response.data : address
        );
        localStorage.setItem("userAddresses", JSON.stringify(this.addresses));
        toast.success("Address updated successfully.");
      } catch (error) {
        console.error("Error updating address:", error);
        this.errorMessage = "Failed to update address.";
        toast.error(this.errorMessage);
      }
    },
    async deleteAddress(addressId) {
      const userStore = useUserStore(); // Access the user store
      const token = userStore.token;

      try {
        if (!this.token) {
          throw new Error("No token available");
        }

        await apiClient.delete(`/addresses/${addressId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        console.log("Deleted address:", addressId);
        // Remove address from the addresses array
        this.addresses = this.addresses.filter(
          (address) => address._id !== addressId
        );
        localStorage.setItem("userAddresses", JSON.stringify(this.addresses));
        toast.success("Address deleted successfully.");
      } catch (error) {
        console.error("Error deleting address:", error);
        this.errorMessage = "Failed to delete address.";
        toast.error(this.errorMessage);
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
  },
});

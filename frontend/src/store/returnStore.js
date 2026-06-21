// frontend/src/store/returnStore.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { toast } from "vue-sonner";
import { useUserStore } from "./user";

export const useReturnStore = defineStore("return", {
  state: () => ({
    returns: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserReturns() {
      const userStore = useUserStore();
      const token = userStore.token;
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.get("/returns/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.returns = response.data.returns || [];
        return this.returns;
      } catch (error) {
        console.error("Error fetching user returns:", error);
        this.error = error.response?.data?.message || "Failed to load return requests.";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createReturnRequest(returnData) {
      const userStore = useUserStore();
      const token = userStore.token;
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.post("/returns", returnData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(response.data.message || "Return request submitted successfully!");
        return response.data;
      } catch (error) {
        console.error("Error creating return request:", error);
        this.error = error.response?.data?.message || "Failed to submit return request.";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAdminReturns(params = {}) {
      const token = localStorage.getItem("adminToken");
      this.loading = true;
      this.error = null;

      try {
        const queryParams = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status || "",
          search: params.search || "",
        });

        const response = await apiClient.get(`/returns/admin?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        return {
          returns: response.data.returns || [],
          pagination: response.data.pagination || { total: 0, page: 1, pages: 1 },
        };
      } catch (error) {
        console.error("Error fetching admin returns:", error);
        this.error = error.response?.data?.message || "Failed to load admin returns.";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateReturnStatus(returnId, status, comment) {
      const token = localStorage.getItem("adminToken");
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.patch(
          `/returns/admin/${returnId}/status`,
          { status, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Return status updated successfully.");
        return response.data;
      } catch (error) {
        console.error("Error updating return status:", error);
        this.error = error.response?.data?.message || "Failed to update return status.";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

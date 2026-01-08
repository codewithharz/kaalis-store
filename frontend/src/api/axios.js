// frontend/src/api/axios.js - Fixed version with better error handling
import axios from "axios";
import { useUserStore } from "../store/user";

// Helper to get the base URL based on environment
const getBaseUrl = () => {
  // Since your custom domain API is working, let's use it for all deployments
  // This is a temporary fix until we identify why newer deployments fail

  if (import.meta.env.DEV) {
    // Development - use local backend
    return import.meta.env.VITE_API_URL || "http://localhost:7788/api";
  }

  // Production - use relative path so each deployment uses its own backend
  return "/api";
};

// Create axios instance
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    try {
      console.log("Making request to:", `${config.baseURL}${config.url}`);

      // Handle admin routes first
      if (config.url.startsWith("/admin")) {
        const adminToken = localStorage.getItem("adminToken");
        if (adminToken) {
          config.headers.Authorization = `Bearer ${adminToken}`;
          console.log("Admin request authenticated");
        } else {
          console.log("Unauthenticated admin request");
          delete config.headers.Authorization;
        }
      } else {
        // Handle regular user routes
        let token = localStorage.getItem("token");

        if (!token) {
          try {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            token = storedUser?.token || null;
          } catch (e) {
            console.warn("Failed to parse user from localStorage:", e);
          }
        }

        // Get from Pinia store as last resort
        if (!token) {
          try {
            const userStore = useUserStore();
            token = userStore.token;
          } catch (e) {
            console.warn("Failed to get token from store:", e);
          }
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("User request authenticated");
        } else {
          console.log("Unauthenticated user request");
          delete config.headers.Authorization;
        }
      }

      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Request setup error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `${response.config.method.toUpperCase()} ${response.config.url}: ${
        response.status
      }`
    );
    return response;
  },
  async (error) => {
    const errorDetails = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };

    console.error("API Error:", errorDetails);

    // Handle different error types
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // // Only logout for admin routes or if user is actually logged in
          // if (error.config.url.startsWith("/admin")) {
          //   console.error("Admin authentication error");
          //   localStorage.removeItem("adminToken");
          //   localStorage.removeItem("adminUser");
          //   if (!window.location.pathname.includes("/admin/login")) {
          //     window.location.href = "/admin/login";
          //   }
          // } else {
          //   // For user routes, only logout if there was a token present
          //   const hasToken =
          //     localStorage.getItem("token") || localStorage.getItem("user");

          //   if (hasToken) {
          //     console.warn("Authentication expired, logging out");
          //     await handleUnauthorizedError();
          //   } else {
          //     console.log("401 on public endpoint, ignoring");
          //   }
          // }

          // DO NOT logout automatically
          // 401 can mean: token expired OR user is not a seller
          // Let the component/store handle it
          console.warn(
            "401 received – not logging out globally:",
            error.config?.url
          );
          break;
        case 403:
          console.error("Forbidden access:", errorDetails);
          break;
        case 404:
          console.error("Resource not found:", errorDetails);
          break;
        case 500:
          console.error("Server error:", error.response.data);
          break;
        default:
          console.error("API Error:", errorDetails);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error - check CORS configuration");

      // Don't logout on network errors - might be temporary
      console.log("Network error detected, not logging out user");
    } else {
      console.error("Unhandled error:", error.message);
    }

    return Promise.reject(error);
  }
);
// DO NOT logout automatically
// // Enhanced unauthorized error handler
// async function handleUnauthorizedError() {
//   try {
//     // Clear all stored data
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     sessionStorage.clear();

//     // Redirect to login if not already there
//     if (window.location.pathname !== "/login") {
//       const returnUrl = encodeURIComponent(window.location.pathname);
//       window.location.href = `/login?returnUrl=${returnUrl}`;
//     }
//   } catch (error) {
//     console.error("Error during logout:", error);
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/login";
//   }
// }

export default apiClient;

// frontend/src/store/product.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import axios from "axios";
import { useUserStore } from "./user";
import { toast } from "vue-sonner";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    product: null,
    shippingRules: null,
    categories: [],
    filters: {
      unitCategory: null,
      unitRange: { min: null, max: null },
      color: null, // Add color to filters
    },
  }),

  getters: {
    flattenedCategories: (state) => {
      // Add a safety check
      if (!state.categories || state.categories.length === 0) {
        return [];
      }
      const flatten = (cats, prefix = "") =>
        cats.reduce((acc, cat) => {
          const newCat = { ...cat, name: prefix + cat.name };
          return acc.concat(
            newCat,
            flatten(cat.children || [], prefix + "-- ")
          );
        }, []);
      return flatten(state.categories);
    },
  },
  actions: {
    async fetchProducts({ page = 1, limit = 20 } = {}) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");
        const response = await axios.get("/products", {
          params: {
            page,
            limit,
            sort: "-createdAt", // Keep the sort parameter as it's used in the controller
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // this.products = response.data;

        this.shippingRules = response.data.shippingRules;
        return response.data; // Return the data instead of setting state directly
        // This allows ProductList.vue to handle the data for infinite scroll
      } catch (error) {
        console.error("Error fetching products:", error);
        // this.products = []; // Ensure it's an empty array if fetch fails
        this.shippingRules = null;
        return {
          // Return empty data structure matching the controller response
          products: [],
          currentPage: page,
          totalPages: 0,
          totalProducts: 0,
          shippingRules: null,
        };
      }
    },

    async fetchProductById(id) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");
        const response = await apiClient.get(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (
          typeof response.data === "string" &&
          response.data.includes("<!doctype html>")
        ) {
          console.error("Received HTML instead of JSON:", response.data);
          throw new Error("Invalid response format");
        }

        console.log("Fetched product:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching product:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
        throw error;
      }
    },

    async fetchCategories() {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");
        const response = await apiClient.get("/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.categories = this.buildCategoryTree(response.data);
        return this.categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.categories = []; // Ensure categories is an empty array if fetch fails
        throw error;
      }
    },

    async fetchRelatedProducts(
      productId,
      limit = 4,
      includeColorMatch = false
    ) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");
        const response = await apiClient.get(`/products/${productId}/related`, {
          params: { limit, includeColor: includeColorMatch },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.relatedProducts;
      } catch (error) {
        console.error("Error fetching related products:", error);
        toast.error("Failed to load related products");
        return [];
      }
    },

    async fetchProductsWithFilters(filters) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");

        // Combine with existing filters
        const allFilters = {
          ...filters,
          color: filters.color || this.filters.color,
        };

        const response = await apiClient.get("/products", {
          params: filters,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // this.products = response.data;
        this.products = response.data.products;

        return response.data;
      } catch (error) {
        console.error("Error fetching products with filters:", error);
        this.products = [];
        throw error;
      }
    },

    async rateProduct(productId, rating, review) {
      try {
        const userStore = useUserStore();
        console.log("Submitting rating:", { productId, rating, review }); // Add debug log

        const response = await apiClient.post(
          `/products/${productId}/rate`,
          {
            productId, // Add this
            rating,
            review,
          },
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

        // Update the product in the local state if it exists
        const productIndex = this.products.findIndex(
          (p) => p._id === productId
        );
        if (productIndex !== -1) {
          this.products[productIndex] = {
            ...this.products[productIndex],
            ...response.data.product,
          };
        }

        toast.success("Product rated successfully");
        return response.data;
      } catch (error) {
        console.error("Error rating product:", error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to rate product");
        }
        throw error;
      }
    },

    // For user-specific reviews
    async fetchUserReviews() {
      try {
        const userStore = useUserStore();
        const response = await apiClient.get("/products/user/reviews", {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching user reviews:", error);
        toast.error("Failed to load your reviews");
        throw error;
      }
    },

    // For user's pending reviews (products they can still review)
    async fetchUserPendingReviews() {
      try {
        const userStore = useUserStore();
        const response = await apiClient.get("/products/user/pending-reviews", {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching pending reviews:", error);
        toast.error("Failed to load pending reviews");
        throw error;
      }
    },

    async fetchProductReviews(productId) {
      try {
        const response = await apiClient.get(`/products/${productId}/ratings`);
        return response.data;
      } catch (error) {
        console.error("Error fetching product reviews:", error);
        toast.error("Failed to load product reviews");
        throw error;
      }
    },

    // For all reviews
    async fetchAllReviews() {
      try {
        const userStore = useUserStore();
        const response = await apiClient.get("/products/reviews", {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching all reviews:", error);
        toast.error("Failed to load reviews");
        throw error;
      }
    },

    async markReviewHelpful(reviewId) {
      try {
        const userStore = useUserStore();
        const response = await apiClient.post(
          `/products/reviews/${reviewId}/helpful`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error marking review as helpful:", error);
        throw error;
      }
    },

    async fetchRandomProducts(limit = 4, excludeId = null) {
      try {
        console.log(
          "Fetching random products with limit:",
          limit,
          "excludeId:",
          excludeId
        );
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");
        const response = await apiClient.get("/products", {
          params: {
            random: true,
            limit,
            excludeId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Received response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching random products:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
        toast.error("Failed to load random products");
        return [];
      }
    },

    async fetchProductsByCategory(categorySlug) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");
        console.log(`Fetching products for category slug: ${categorySlug}`);
        const response = await apiClient.get(
          `/categories/slug/${categorySlug}/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching products by category:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        throw error;
      }
    },

    buildCategoryTree(categories) {
      const categoryMap = {};
      const rootCategories = [];

      // First pass: create a map of categories
      categories.forEach((category) => {
        categoryMap[category._id] = { ...category, children: [] };
      });

      // Second pass: build the tree structure
      categories.forEach((category) => {
        if (category.parent) {
          const parent = categoryMap[category.parent];
          if (parent) {
            parent.children.push(categoryMap[category._id]);
          }
        } else {
          rootCategories.push(categoryMap[category._id]);
        }
      });

      return rootCategories;
    },
    async suggestNewCategory(categoryName) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");

        const response = await apiClient.post(
          "/categories/suggest",
          { name: categoryName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Suggested new category:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error suggesting new category:", error);
        throw error;
      }
    },

    async createProduct(productData) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");
        const userId = userStore.user._id;

        // Create a deep copy of the product data
        let plainProductData = JSON.parse(JSON.stringify(productData));

        // Ensure images array exists and is properly formatted
        plainProductData.images = Array.isArray(productData.images)
          ? productData.images
              .flat()
              .filter((url) => typeof url === "string" && url.trim() !== "")
              .map((url) => url.trim())
          : [];

        console.log("Sanitized images array:", plainProductData.images);
        console.log("Initial product data:", plainProductData);

        // Ensure images array exists
        if (!plainProductData.images) {
          plainProductData.images = [];
        }

        // Convert images to array if it's somehow not an array
        if (!Array.isArray(plainProductData.images)) {
          plainProductData.images = [plainProductData.images].filter(Boolean);
        }

        // Ensure images are properly formatted as an array of strings
        plainProductData.images = plainProductData.images
          .flat() // Flatten in case of nested arrays
          .filter((url) => typeof url === "string" && url.trim() !== "");

        console.log("Processed images array:", plainProductData.images);

        // Validate image URLs
        const validImageUrls = plainProductData.images.every((url) => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        });

        if (!validImageUrls) {
          throw new Error("Invalid image URLs detected");
        }

        // Color validation
        if (
          plainProductData.color &&
          typeof plainProductData.color === "string"
        ) {
          if (
            !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(plainProductData.color)
          ) {
            throw new Error("Invalid main color hex code");
          }
        }

        if (plainProductData.availableColors?.length > 0) {
          plainProductData.availableColors =
            plainProductData.availableColors.filter(
              (color) =>
                color.name &&
                color.hexCode &&
                /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hexCode)
            );
        }

        // Handle category
        if (
          typeof plainProductData.category === "string" &&
          !plainProductData.category.match(/^[0-9a-fA-F]{24}$/)
        ) {
          const suggestedCategory = await this.suggestNewCategory(
            plainProductData.category
          );
          plainProductData.category = suggestedCategory._id;
        }

        // Handle unit
        if (
          plainProductData.unit &&
          typeof plainProductData.unit === "object"
        ) {
          plainProductData.unit = this.formatUnitData(plainProductData.unit);
        }

        // Log the final data being sent
        console.log("Final data being sent to API:", {
          ...plainProductData,
          images: plainProductData.images,
        });

        const response = await apiClient.post(
          `/products/${userId}/products`,
          plainProductData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Validate the response
        if (!response.data) {
          throw new Error("No data received from the server");
        }

        // Ensure the response contains the images
        if (!response.data.images || !Array.isArray(response.data.images)) {
          console.warn("API response missing images array:", response.data);
          // Add the images to the response data if they're missing
          response.data.images = plainProductData.images;
        } else {
          console.log("API response images:", response.data.images);
        }

        // Update the local state
        this.products.push(response.data);
        toast.success("Product created successfully");

        return response.data;
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          request: error.request,
          config: error.config,
        });
        // Improved error handling
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Error creating product";
        toast.error(errorMessage);
        throw error;
      }
    },

    async createCategory(categoryData) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");

        const response = await apiClient.post("/categories", categoryData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Created category:", response.data);

        // Update the local categories state
        if (this.categories) {
          this.categories = this.buildCategoryTree([
            ...this.categories,
            response.data,
          ]);
        } else {
          this.categories = [response.data];
        }

        return response.data;
      } catch (error) {
        console.error("Error creating category:", error);
        throw error;
      }
    },

    // Update updateProduct to handle color validation
    async updateProduct(productId, productData) {
      try {
        const userStore = useUserStore();
        const userId = userStore.user._id;
        const token = userStore.token;

        if (!token) {
          throw new Error("No token available");
        }

        const updatedProductData = { ...productData };

        // Color validation
        if (
          updatedProductData.color &&
          typeof updatedProductData.color === "string"
        ) {
          if (
            !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(updatedProductData.color)
          ) {
            throw new Error("Invalid main color hex code");
          }
        }

        if (updatedProductData.availableColors) {
          if (typeof updatedProductData.availableColors === "string") {
            updatedProductData.availableColors = JSON.parse(
              updatedProductData.availableColors
            );
          }
          updatedProductData.availableColors =
            updatedProductData.availableColors.filter(
              (color) =>
                color.name &&
                color.hexCode &&
                /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hexCode)
            );
        }

        // Validate variant colors
        if (updatedProductData.variants) {
          updatedProductData.variants.forEach((variant) => {
            if (
              variant.color &&
              (!variant.color.name || !variant.color.hexCode)
            ) {
              throw new Error(
                "All variant colors must have both name and color code"
              );
            }
            if (
              variant.color &&
              !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(variant.color.hexCode)
            ) {
              throw new Error(
                `Invalid hex code for variant color: ${variant.color.name}`
              );
            }
          });
        }

        // Handle unit with regionSpecificDisplay safety
        if (
          updatedProductData.unit &&
          typeof updatedProductData.unit === "object"
        ) {
          // Ensure regionSpecificDisplay is properly structured before formatting
          if (updatedProductData.unit.regionSpecificDisplay) {
            if (Array.isArray(updatedProductData.unit.regionSpecificDisplay)) {
              const converted = {};
              updatedProductData.unit.regionSpecificDisplay.forEach((item) => {
                if (
                  item &&
                  typeof item === "object" &&
                  item.key &&
                  item.value
                ) {
                  converted[item.key] = item.value;
                }
              });
              updatedProductData.unit.regionSpecificDisplay = converted;
            } else if (
              typeof updatedProductData.unit.regionSpecificDisplay !== "object"
            ) {
              updatedProductData.unit.regionSpecificDisplay = {};
            }
          }

          updatedProductData.unit = this.formatUnitData(
            updatedProductData.unit
          );
        }

        // Truncate metaTitle if it's too long
        if (
          updatedProductData.metaTitle &&
          updatedProductData.metaTitle.length > 60
        ) {
          updatedProductData.metaTitle = updatedProductData.metaTitle.substring(
            0,
            60
          );
          console.warn("MetaTitle was truncated to 60 characters");
        }

        const response = await apiClient.put(
          `/products/${userId}/products/${productId}`,
          updatedProductData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Initialize products array if it's undefined
        if (!Array.isArray(this.products)) {
          this.products = [];
        }

        // Update the local state
        const index = this.products.findIndex(
          (product) => product._id === productId
        );

        // Update the product in the local state
        if (index !== -1) {
          this.products[index] = response.data;
        } else {
          this.products.push(response.data);
        }

        return response.data;
      } catch (error) {
        console.error("Error creating product:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config,
        });
        this.handleProductError(error, "Error updating product");
      }
    },

    // Add new methods for color management
    setColorFilter(color) {
      this.filters.color = color;
    },

    clearFilters() {
      this.filters = {
        unitCategory: null,
        unitRange: { min: null, max: null },
        color: null,
      };
    },

    // Add method to fetch products by color
    async searchProductsByColor(colorName) {
      try {
        return await this.fetchProductsWithFilters({ color: colorName });
      } catch (error) {
        console.error("Error searching products by color:", error);
        toast.error("Failed to search products by color");
        throw error;
      }
    },

    async addBulkProducts(productsData) {
      try {
        const userStore = useUserStore();
        const token = userStore.token || localStorage.getItem("token");

        const response = await apiClient.post("/products/bulk", productsData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        this.products.push(...response.data);
        return response.data;
      } catch (error) {
        this.handleProductError(error, "Error adding bulk products");
      }
    },

    formatUnitData(unit) {
      return {
        base: String(unit.base),
        value: Number(unit.value),
        display: unit.display || `${unit.value}${unit.base}`,
        category: unit.category,
        baseUnit: unit.baseUnit,
        conversionFactor: Number(unit.conversionFactor),
        displayUnit: unit.displayUnit,
        packagingUnit: unit.packagingUnit,
        precision: Number(unit.precision),
        compoundUnit: unit.compoundUnit,
        regionSpecificDisplay: unit.regionSpecificDisplay,
      };
    },

    handleProductError(error, defaultMessage) {
      console.error(defaultMessage, error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(defaultMessage);
      }
      throw error;
    },

    async deleteProduct(productId) {
      try {
        const userStore = useUserStore();
        if (!userStore || !userStore.user || !userStore.user._id) {
          throw new Error("User information is not available");
        }
        const userId = userStore.user._id;

        const url = `/products/${userId}/products/${productId}`;
        console.log("Delete URL:", url);

        const response = await apiClient.delete(url);
        console.log("Delete response:", response);

        this.products = this.products.filter(
          (product) => product._id !== productId
        );
        return response.data;
      } catch (error) {
        console.error("Error deleting product:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
        console.error("Error config:", error.config);
        throw error;
      }
    },
  },
});

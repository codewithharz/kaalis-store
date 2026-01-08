<template>
  <div class="w-full max-w-7xl mx-auto pb-6 sm:pb-9 bg-white px-2 sm:px-4 lg:px-8">
    <!-- Breadcrumb replacement -->
    <div class="mb-4 sm:mb-6 mt-4">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-gray-700 text-sm">Home</router-link>
          </li>
          <li class="flex items-center space-x-2">
            <ChevronRight class="w-4 h-4 text-gray-400" />
            <span class="text-gray-900 font-medium text-sm">Search results for "{{ searchQuery }}"</span>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 sm:py-12">
      <div class="spinner mx-auto"></div>
      <p class="mt-4 text-sm sm:text-base text-gray-600">Searching for products...</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <div class="mb-6">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
          Search Results
        </h1>
        <p class="text-sm sm:text-base text-gray-600">
          Showing results for "{{ searchQuery }}" ({{ products.length }} found)
        </p>
      </div>

      <!-- Product Grid -->
      <div v-if="products.length" class="space-y-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          <ProductCard 
            v-for="product in products" 
            :key="product._id" 
            :product="product"
            @click="viewProduct(product._id)"
            class="hover:shadow-lg transition-all duration-300 hover:-translate-y-1" 
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 sm:py-16">
        <div class="text-gray-400 mb-6 font-light">
          <Search class="w-16 h-16 sm:w-20 sm:h-20 mx-auto opacity-20" />
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No matching products</h3>
        <p class="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
          We couldn't find any products matching your search. Try checking for typos or using more general terms.
        </p>
        <router-link 
          to="/" 
          class="inline-block bg-[#24a3b5] text-white px-8 py-3 rounded-lg hover:bg-[#1f8f9e] transition-colors font-medium shadow-md"
        >
          Return to Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, ChevronRight } from 'lucide-vue-next';
import ProductCard from './ProductCard.vue';
import apiClient from '../api/axios';

export default {
  name: 'Search',
  components: { 
    Search, 
    ChevronRight,
    ProductCard 
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(true);
    const products = ref([]);
    const searchQuery = ref('');

    const fetchResults = async () => {
      searchQuery.value = route.query.q || '';
      if (!searchQuery.value) {
        products.value = [];
        loading.value = false;
        return;
      }

      try {
        loading.value = true;
        const response = await apiClient.get('/products', {
          params: {
            search: searchQuery.value,
            limit: 50 // Load more for search
          }
        });
        
        // Handle different response formats
        products.value = response.data.products || response.data || [];
      } catch (err) {
        console.error('Search error:', err);
        products.value = [];
      } finally {
        loading.value = false;
      }
    };

    const viewProduct = (productId) => {
      router.push({ name: 'ProductDetails', params: { id: productId } });
    };

    onMounted(fetchResults);

    watch(() => route.query.q, fetchResults);

    return {
      loading,
      products,
      searchQuery,
      viewProduct
    };
  }
};
</script>

<style scoped>
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #24a3b5;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

* {
  transition: all 0.2s ease-in-out;
}
</style>

<template>
    <div class="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-6">
        <!-- Mobile-optimized grid with better responsive breakpoints -->
        <div
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            <ProductCard v-for="product in products" :key="product._id" :product="product"
                @productDeleted="handleProductDeleted" class="w-full min-w-0" />
        </div>

        <!-- Enhanced loading indicator with responsive design -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-6 sm:py-8">
            <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-500 mb-2 sm:mb-3">
            </div>
            <p class="text-xs sm:text-sm text-gray-500 animate-pulse">
                <span class="hidden sm:inline">Loading more products...</span>
                <span class="sm:hidden">Loading...</span>
            </p>
        </div>

        <!-- No more products indicator -->
        <div v-if="!hasMore && products.length > 0 && !loading" class="text-center py-6 sm:py-8">
            <p class="text-sm sm:text-base text-gray-500">
                <span class="hidden sm:inline">You've reached the end of our product catalog</span>
                <span class="sm:hidden">No more products</span>
            </p>
        </div>

        <!-- Empty state for when no products are found -->
        <div v-if="!loading && products.length === 0" class="flex flex-col items-center justify-center py-12 sm:py-16">
            <div class="text-center">
                <svg class="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 class="text-lg sm:text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p class="text-sm sm:text-base text-gray-500 max-w-sm mx-auto">
                    <span class="hidden sm:inline">We couldn't find any products at the moment. Please try again
                        later.</span>
                    <span class="sm:hidden">No products available right now.</span>
                </p>
            </div>
        </div>

        <!-- Mobile pull-to-refresh hint (visual only) -->
        <div class="sm:hidden text-center py-4 border-t border-gray-100 mt-4" v-if="products.length > 0">
            <p class="text-xs text-gray-400">Scroll down for more products</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import ProductCard from './ProductCard.vue';
import apiClient from '../api/axios';

export default {
    name: 'ProductList',
    components: {
        ProductCard,
    },
    setup() {
        const products = ref([]);
        const loading = ref(false);
        const page = ref(1);
        const hasMore = ref(true);
        const limit = 20; // Fetch 20 products at a time

        const fetchProducts = async () => {
            if (loading.value || !hasMore.value) return;

            try {
                loading.value = true;
                const response = await apiClient.get('/products', {
                    params: {
                        page: page.value,
                        limit: limit
                    }
                });

                const newProducts = Array.isArray(response.data.products)
                    ? response.data.products
                    : Array.isArray(response.data)
                        ? response.data
                        : [];

                products.value = [...products.value, ...newProducts];

                // Check if we have more products to load
                hasMore.value = newProducts.length === limit;
                page.value++;
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                loading.value = false;
            }
        };

        // Enhanced scroll handler with better mobile performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollHeight = document.documentElement.scrollHeight;
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const clientHeight = window.innerHeight;

                    // Trigger loading when user is 200px from bottom for better UX
                    const threshold = 200;
                    const bottomOfWindow = scrollTop + clientHeight >= scrollHeight - threshold;

                    if (bottomOfWindow && !loading.value && hasMore.value) {
                        fetchProducts();
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        onMounted(() => {
            fetchProducts();
            // Use passive event listener for better mobile performance
            window.addEventListener('scroll', handleScroll, { passive: true });
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
        });

        const handleProductDeleted = (deletedProductId) => {
            products.value = products.value.filter(p => p._id !== deletedProductId);
        };

        return {
            products,
            loading,
            hasMore,
            handleProductDeleted
        };
    }
}
</script>

<style scoped>
/* Ensure smooth scrolling on mobile devices */
@media (max-width: 768px) {
    .grid {
        scroll-behavior: smooth;
    }
}

/* Optimize grid gap for very small screens */
@media (max-width: 375px) {
    .grid {
        gap: 0.375rem;
        /* Even smaller gap for tiny screens */
    }
}

/* Prevent layout shift during loading */
.grid>* {
    min-height: 200px;
    /* Ensure consistent card heights */
}

@media (min-width: 640px) {
    .grid>* {
        min-height: 250px;
    }
}

@media (min-width: 1024px) {
    .grid>* {
        min-height: 300px;
    }
}

/* Loading animation optimizations */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Touch-friendly spacing */
@media (max-width: 639px) {
    .grid {
        padding-bottom: 1rem;
        /* Extra space at bottom for easier scrolling */
    }
}

/* Optimize for very wide screens */
@media (min-width: 1536px) {
    .max-w-\[1280px\] {
        max-width: 1400px;
    }
}
</style>
<template>
    <div class="w-full max-w-7xl mx-auto pb-6 sm:pb-9 bg-white px-2 sm:px-4 lg:px-8">
        <!-- Breadcrumb -->
        <div class="mb-4 sm:mb-6">
            <Breadcrumb :breadcrumbs="breadcrumbs" />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8 sm:py-12">
            <div class="spinner mx-auto"></div>
            <p class="mt-4 text-sm sm:text-base text-gray-600">Loading products...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8 sm:py-12">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
                <div class="text-red-400 mb-4">
                    <svg class="w-10 h-10 sm:w-12 sm:h-12 mx-auto" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                        </path>
                    </svg>
                </div>
                <p class="text-sm sm:text-base text-red-600 font-semibold">{{ error }}</p>
                <button @click="fetchProducts"
                    class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm">
                    Try Again
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else class="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <!-- Mobile Filter Toggle -->
            <div class="lg:hidden">
                <button @click="toggleFilters"
                    class="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                    <span class="flex items-center text-gray-700">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                            </path>
                        </svg>
                        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
                    </span>
                    <svg class="w-4 h-4 transform transition-transform text-gray-500"
                        :class="{ 'rotate-180': showFilters }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>

            <!-- Sidebar Filter -->
            <div :class="[
                'lg:w-1/5 transition-all duration-300',
                { 'hidden lg:block': !showFilters },
                { 'block': showFilters }
            ]">
                <ProductFilters :price-counts="priceCounts" :discount-counts="discountCounts"
                    @update:filters="handleFilterUpdate" class="bg-gray-50 rounded-lg p-3 sm:p-4" />
            </div>

            <!-- Product Listing -->
            <div class="flex-1 lg:w-4/5">
                <!-- Header Section -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                    <div>
                        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{{ categoryName }}</h1>
                        <p class="text-sm sm:text-base text-gray-600">
                            {{ filteredProducts.length }}
                            {{ filteredProducts.length === 1 ? 'product' : 'products' }} found
                        </p>
                    </div>
                </div>

                <!-- Search and Sort Controls -->
                <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 sm:mb-6 gap-3">
                    <!-- Search Field -->
                    <div class="flex-1 sm:max-w-md relative">
                        <input v-model="searchQuery" type="text" placeholder="Search products..."
                            class="w-full text-sm border border-gray-300 rounded-lg py-2.5 sm:py-3 px-4 pr-10 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm">
                        <Search
                            class="absolute w-4 h-4 sm:w-5 sm:h-5 right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <!-- Sort Options -->
                    <div class="sm:w-48">
                        <select v-model="sortOption"
                            class="w-full border border-gray-300 rounded-lg py-2.5 sm:py-3 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm">
                            <option value="">Sort By</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="name-a-z">Name: A to Z</option>
                            <option value="name-z-a">Name: Z to A</option>
                            <option value="discount">Discount: High to Low</option>
                        </select>
                    </div>
                </div>

                <!-- Product Grid -->
                <div v-if="filteredProducts.length" class="space-y-4">
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                        <ProductCard v-for="product in filteredProducts" :key="product._id" :product="product"
                            @click="viewProduct(product._id)"
                            class="hover:shadow-lg transition-all duration-300 hover:-translate-y-1" />
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12 sm:py-16">
                    <div class="text-gray-400 mb-6">
                        <svg class="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                    <p class="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
                        {{ searchQuery ?
                            'Try adjusting your search terms or filters to find what you\'re looking for.' :
                            'No products are available in this category at the moment.'
                        }}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <button v-if="searchQuery" @click="searchQuery = ''"
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                            Clear Search
                        </button>
                        <button v-if="Object.values(selectedFilters).some(filter => filter.length > 0)"
                            @click="clearAllFilters"
                            class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../store/productStore.js';
import { Search } from 'lucide-vue-next';
import CustomImage from './CustomImage.vue';
import Breadcrumb from './Breadcrumb.vue';
import ProductFilters from './ProductFilters.vue';
import ProductCard from './ProductCard.vue';

export default {
    name: 'CategoryProducts',
    components: { Search, CustomImage, Breadcrumb, ProductFilters, ProductCard },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const productStore = useProductStore();

        const loading = ref(true);
        const error = ref(null);
        const products = ref([]);
        const categoryName = ref('');
        const searchQuery = ref('');
        const sortOption = ref('');
        const showFilters = ref(false);

        const category = ref(null);
        const breadcrumbs = ref([]);

        const brands = ref([]);
        const relatedCategories = ref([]);

        const selectedFilters = ref({
            price: [],
            discount: [],
            brand: [],
            // Add other filter keys as needed
        });

        const handleFilterUpdate = (filters) => {
            selectedFilters.value = filters;
        };

        const clearAllFilters = () => {
            selectedFilters.value = {
                price: [],
                discount: [],
                brand: [],
            };
            searchQuery.value = '';
            sortOption.value = '';
        };

        const truncateDescription = (description, maxLength = 100) => {
            return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
        };

        const fetchProducts = async () => {
            try {
                loading.value = true;
                error.value = null;
                const categorySlug = route.params.categorySlug;
                const result = await productStore.fetchProductsByCategory(categorySlug);
                products.value = result.products;
                categoryName.value = result.categoryName;
                category.value = { name: result.categoryName, slug: categorySlug };

                // Update breadcrumbs
                breadcrumbs.value = [
                    { name: 'Home', path: '/' },
                    ...result.categoryPath.map(cat => ({
                        name: cat.name,
                        path: `/category/${cat.slug}`
                    }))
                ];

                // Populate brands
                brands.value = [...new Set(result.products.map(product => product.brand))].filter(Boolean);

                // Populate related categories (this is just an example, adjust as needed)
                relatedCategories.value = result.relatedCategories || [
                    'Sneaker',
                    'Running & Training Shoes',
                    'Walking Shoes',
                    'Outdoor Shoes',
                    'Fitness Shoes',
                    'Crampon',
                    'Carpet Field Shoes'
                ];
            } catch (err) {
                console.error('Error fetching products:', err);
                error.value = 'Failed to load products. Please try again.';
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            fetchProducts().catch(err => {
                console.error('Error in onMounted:', err);
                error.value = 'An unexpected error occurred. Please try again.';
            });
        });

        watch(() => route.params.categorySlug, (newSlug, oldSlug) => {
            if (newSlug !== oldSlug) {
                fetchProducts().catch(err => {
                    console.error('Error in route watcher:', err);
                    error.value = 'An error occurred while updating products. Please refresh the page.';
                });
            }
        });

        const filteredProducts = computed(() => {
            let result = products.value;

            // Apply filters
            Object.entries(selectedFilters.value).forEach(([filterName, filterValue]) => {
                if (Array.isArray(filterValue) && filterValue.length > 0) {
                    if (filterName === 'price') {
                        result = result.filter(product => {
                            return filterValue.some(range => {
                                const [min, max] = range.split('-').map(Number);
                                return product.price >= min && (max === 0 || product.price <= max);
                            });
                        });
                    } else if (filterName === 'discount') {
                        result = result.filter(product => {
                            return filterValue.some(range => {
                                const minDiscount = parseInt(range);
                                return product.discount >= minDiscount;
                            });
                        });
                    } else {
                        result = result.filter(product => filterValue.includes(String(product[filterName])));
                    }
                }
            });

            // Apply search query
            if (searchQuery.value) {
                result = result.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
                );
            }

            // Apply sorting
            switch (sortOption.value) {
                case 'price-low-high':
                    result.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high-low':
                    result.sort((a, b) => b.price - a.price);
                    break;
                case 'name-a-z':
                    result.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-z-a':
                    result.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'discount':
                    result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                    break;
            }

            return result;
        });

        const priceCounts = computed(() => {
            const ranges = [
                { label: '₦0 - ₦1,000', value: '0-1000' },
                { label: '₦1,000 - ₦5,000', value: '1000-5000' },
                { label: '₦5,000 - ₦10,000', value: '5000-10000' },
                { label: '₦10,000 - ₦50,000', value: '10000-50000' },
                { label: 'Above ₦50,000', value: '50000-0' }
            ];

            return ranges.map(range => {
                const [min, max] = range.value.split('-').map(Number);
                const count = products.value.filter(product =>
                    product.price >= min && (max === 0 || product.price <= max)
                ).length;
                return { ...range, count };
            });
        });

        const discountCounts = computed(() => {
            const ranges = [
                { label: '5% and above', value: '5' },
                { label: '10% and above', value: '10' },
                { label: '20% and above', value: '20' },
                { label: '30% and above', value: '30' },
                { label: '40% and above', value: '40' },
                { label: '50% and above', value: '50' }
            ];

            return ranges.map(range => {
                const count = products.value.filter(product =>
                    product.discount >= parseInt(range.value)
                ).length;
                return { ...range, count };
            });
        });

        const viewProduct = (productId) => {
            router.push({ name: 'ProductDetails', params: { id: productId } });
        };

        const toggleFilters = () => {
            showFilters.value = !showFilters.value;
        };

        return {
            loading,
            error,
            categoryName,
            products,
            filteredProducts,
            searchQuery,
            sortOption,
            priceCounts,
            discountCounts,
            viewProduct,
            breadcrumbs,
            showFilters,
            toggleFilters,
            handleFilterUpdate,
            clearAllFilters,
            truncateDescription,
            selectedFilters,
            brands,
            relatedCategories,
            fetchProducts,
        };
    }
};
</script>

<style scoped>
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Smooth transitions for all interactive elements */
* {
    transition: all 0.2s ease-in-out;
}

/* Enhanced mobile interactions */
@media (max-width: 640px) {

    /* Custom scrollbar for mobile */
    ::-webkit-scrollbar {
        width: 3px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }
}

/* Focus states for accessibility */
input:focus,
select:focus,
button:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
}

/* Enhanced hover effects */
.hover\:shadow-lg:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:-translate-y-1:hover {
    transform: translateY(-0.25rem);
}

/* Filter toggle animation */
.rotate-180 {
    transform: rotate(180deg);
}
</style>
<template>
    <div class="w-full max-w-7xl mx-auto pb-6 sm:pb-9 bg-white px-2 sm:px-4 lg:px-8">
        <!-- Loading State -->
        <div v-if="sellerStore.loading" class="text-center py-8">
            <div class="spinner mx-auto"></div>
            <p class="mt-4 text-sm sm:text-base text-gray-600">Loading products...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="sellerStore.errorMessage" class="text-center text-red-500 py-8">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <div class="text-red-400 mb-2">
                    <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                        </path>
                    </svg>
                </div>
                <p class="text-sm sm:text-base">{{ sellerStore.errorMessage }}</p>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else class="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <!-- Mobile Filter Toggle -->
            <div class="lg:hidden">
                <button @click="toggleFilters"
                    class="w-full flex items-center justify-between bg-blue-50 text-blue-600 font-semibold p-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                            </path>
                        </svg>
                        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
                    </span>
                    <svg class="w-4 h-4 transform transition-transform" :class="{ 'rotate-180': showFilters }"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>

            <!-- Sidebar Filter -->
            <div :class="[
                'lg:w-1/5 xl:w-1/6 bg-gray-50 rounded-lg p-3 sm:p-4 transition-all duration-300',
                { 'hidden lg:block': !showFilters },
                { 'block': showFilters }
            ]">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-bold text-sm sm:text-base text-gray-800">Filters</h2>
                    <button @click="clearFilters"
                        class="text-blue-500 hover:text-blue-700 text-xs sm:text-sm transition duration-300 font-medium">
                        Clear All
                    </button>
                </div>

                <!-- Price Filter -->
                <div class="mb-6">
                    <h3 class="font-semibold mb-3 text-sm text-gray-700 flex items-center">
                        <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                            </path>
                        </svg>
                        Price Range
                    </h3>
                    <div class="space-y-2">
                        <div v-for="(range, index) in priceCounts" :key="index"
                            class="flex items-center text-xs sm:text-sm hover:bg-white p-2 rounded transition-colors">
                            <input type="checkbox" :id="'price-' + index" v-model="selectedPriceRanges"
                                :value="range.value"
                                class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label :for="'price-' + index" class="flex-1 cursor-pointer text-gray-700">
                                {{ range.label }}
                                <span class="text-gray-500 font-medium">({{ range.count }})</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Discount Filter -->
                <div class="mb-4">
                    <h3 class="font-semibold mb-3 text-sm text-gray-700 flex items-center">
                        <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                            </path>
                        </svg>
                        Discount
                    </h3>
                    <div class="space-y-2">
                        <div v-for="(range, index) in discountCounts" :key="index"
                            class="flex items-center text-xs sm:text-sm hover:bg-white p-2 rounded transition-colors">
                            <input type="checkbox" :id="'discount-' + index" v-model="selectedDiscountRanges"
                                :value="range.value"
                                class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label :for="'discount-' + index" class="flex-1 cursor-pointer text-gray-700">
                                {{ range.label }}
                                <span class="text-gray-500 font-medium">({{ range.count }})</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Listing -->
            <div class="flex-1">
                <!-- Results Header -->
                <div class="mb-4 sm:mb-6">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        Products Found
                        <span class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-sm ml-2">
                            {{ filteredAndSortedProducts.length }}
                        </span>
                    </h3>
                </div>

                <!-- Search and Sort Controls -->
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <!-- Search Field -->
                    <div class="flex-1 relative">
                        <input v-model="searchQuery" type="text" placeholder="Search products..."
                            class="w-full text-sm border border-gray-300 rounded-lg py-2.5 sm:py-3 px-4 pr-10 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <Search
                            class="absolute size-4 sm:size-5 right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <!-- Sort Options -->
                    <div class="sm:w-48">
                        <select v-model="sortOption"
                            class="w-full border border-gray-300 rounded-lg py-2.5 sm:py-3 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
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
                <div v-if="filteredAndSortedProducts.length" class="space-y-4">
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                        <ProductCard v-for="product in filteredAndSortedProducts" :key="product._id" :product="product"
                            @click="viewProduct(product._id)" class="hover:shadow-lg transition-shadow duration-300" />
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12 sm:py-16">
                    <div class="text-gray-400 mb-6">
                        <svg class="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                    <p class="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
                        {{ searchQuery ? `Try adjusting your search terms or filters` : `This seller hasn\'t added any
                        products yet.` }}
                    </p>
                    <button v-if="searchQuery || selectedPriceRanges.length || selectedDiscountRanges.length"
                        @click="clearFilters"
                        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Clear All Filters
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
// import { useRoute } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { useSellerStore } from '../store/sellerStore.js';
import { Shirt, ShoppingCart, Heart, Star, Search, Camera } from 'lucide-vue-next';
import CustomImage from './CustomImage.vue';
import ProductCard from './ProductCard.vue';

export default {
    name: 'SellerProducts',
    components: {
        Shirt, ShoppingCart, Heart, Star, Search, Camera,
        CustomImage, ProductCard
    },
    props: ['sellerId'],
    methods: {
        formatRating(rating) {
            return rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);
        }
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const sellerStore = useSellerStore();
        const products = ref([]);
        const sortOption = ref('');
        const searchQuery = ref('');
        const selectedPriceRanges = ref([]);
        const selectedDiscountRanges = ref([]);

        const fetchProducts = async () => {
            try {
                const sellerId = route.params.id;
                console.log('Fetching products for seller ID:', sellerId);
                const fetchedProducts = await sellerStore.fetchSellerProducts(sellerId);
                console.log('Fetched products:', fetchedProducts);
                products.value = Array.isArray(fetchedProducts) ? fetchedProducts : [];
            } catch (error) {
                console.error('Failed to fetch products:', error);
                // Remove the setErrorMessage call as it's not defined
            }
        };

        const truncateDescription = (description, maxLength = 100) => {
            return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
        };

        onMounted(() => {
            fetchProducts();
        });

        const viewProduct = (productId) => {
            router.push({ name: 'ProductDetails', params: { id: productId } });
        };

        const filteredAndSortedProducts = computed(() => {
            if (!Array.isArray(products.value)) return [];

            let filteredProducts = products.value.filter(product => {
                if (!product) return false;

                let priceMatch = selectedPriceRanges.value.length === 0 || selectedPriceRanges.value.some(range => {
                    const price = product.price;
                    switch (range) {
                        case '0-1000': return price < 1000;
                        case '1000-5000': return price >= 1000 && price <= 5000;
                        case '5000-10000': return price >= 5000 && price <= 10000;
                        case '10000-50000': return price >= 10000 && price <= 50000;
                        case '50000-100000': return price >= 50000 && price <= 100000;
                        case 'above-100000': return price > 100000;
                        default: return true;
                    }
                });

                let discountMatch = selectedDiscountRanges.value.length === 0 || selectedDiscountRanges.value.some(range => {
                    switch (range) {
                        case '10-above': return product.discount >= 10;
                        case '20-above': return product.discount >= 20;
                        case '30-above': return product.discount >= 30;
                        case '40-above': return product.discount >= 40;
                        case '50-above': return product.discount >= 50;
                        default: return true;
                    }
                });

                let searchMatch = product.name && product.name.toLowerCase().includes(searchQuery.value.toLowerCase());

                return priceMatch && discountMatch && searchMatch;

            }).map(product => ({
                ...product,
                originalPrice: product.originalPrice || (product.discount ? Math.round(product.price / (1 - product.discount / 100)) : product.price)
            }));

            switch (sortOption.value) {
                case 'price-low-high':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high-low':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name-a-z':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-z-a':
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'discount':
                    filteredProducts.sort((a, b) => b.discount - a.discount);
                    break;
            }

            return filteredProducts;
        });

        const clearFilters = () => {
            selectedPriceRanges.value = [];
            selectedDiscountRanges.value = [];
            searchQuery.value = '';
            sortOption.value = '';
        };

        // Count the number of products in each price range
        const priceCounts = computed(() => {
            const priceRanges = [
                { label: '₦ 0 - ₦ 1,000', value: '0-1000' },
                { label: '₦ 1,000 - ₦ 5,000', value: '1000-5000' },
                { label: '₦ 5,000 - ₦ 10,000', value: '5000-10000' },
                { label: '₦ 10,000 - ₦ 50,000', value: '10000-50000' },
                { label: '₦ 50,000 - ₦ 100,000', value: '50000-100000' },
                { label: 'Above ₦ 100,000', value: 'above-100000' },
            ];

            return priceRanges.map(range => {
                const count = products.value.filter(product => {
                    const price = product.price;
                    switch (range.value) {
                        case '0-1000': return price < 1000;
                        case '1000-5000': return price >= 1000 && price <= 5000;
                        case '5000-10000': return price >= 5000 && price <= 10000;
                        case '10000-50000': return price >= 10000 && price <= 50000;
                        case '50000-100000': return price >= 50000 && price <= 100000;
                        case 'above-100000': return price > 100000;
                        default: return false;
                    }
                }).length;

                return { ...range, count };
            });
        });

        // Count the number of products in each discount range
        const discountCounts = computed(() => {
            const discountRanges = [
                { label: '10% and above', value: '10-above' },
                { label: '20% and above', value: '20-above' },
                { label: '30% and above', value: '30-above' },
                { label: '40% and above', value: '40-above' },
                { label: '50% and above', value: '50-above' },
            ];

            return discountRanges.map(range => {
                const count = products.value.filter(product => {
                    switch (range.value) {
                        case '10-above': return product.discount >= 10;
                        case '20-above': return product.discount >= 20;
                        case '30-above': return product.discount >= 30;
                        case '40-above': return product.discount >= 40;
                        case '50-above': return product.discount >= 50;
                        default: return false;
                    }
                }).length;

                return { ...range, count };
            });
        });

        const showFilters = ref(false);

        const toggleFilters = () => {
            showFilters.value = !showFilters.value;
        };


        return {
            products,
            truncateDescription,
            filteredAndSortedProducts,
            sortOption,
            searchQuery,
            selectedPriceRanges,
            selectedDiscountRanges,
            clearFilters,
            priceCounts,
            discountCounts,
            sellerStore,
            viewProduct,
            showFilters,
            toggleFilters
        };
    }
};
</script>

<style scoped>
.social-proof-transition-enter-active,
.social-proof-transition-leave-active {
    transition: opacity 0.5s, transform 0.5s;
    color: #f47a24;
}

.social-proof-transition-enter,
.social-proof-transition-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

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

/* Smooth transitions */
* {
    transition: all 0.2s ease-in-out;
}

/* Focus states for accessibility */
input:focus,
select:focus,
button:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
}

/* Enhanced hover states */
.hover\:shadow-lg:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
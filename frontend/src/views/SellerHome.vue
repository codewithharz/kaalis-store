<template>
    <div class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <!-- Seller Header -->
            <header class="bg-white shadow rounded-lg p-3 sm:p-6 mb-4 sm:mb-6">
                <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                    <!-- Seller Info Section -->
                    <div class="flex items-start sm:items-center space-x-3 sm:space-x-4">
                        <img :src="sellerProfile.profileImage" alt="Seller Avatar"
                            class="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0">
                        <div class="min-w-0 flex-1">
                            <h1 class="text-lg sm:text-2xl font-bold text-gray-800 truncate">{{ sellerProfile.storeName
                            }}</h1>
                            <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-1">{{
                                sellerProfile.storeDescription }}</p>
                        </div>
                    </div>

                    <!-- Actions Section -->
                    <div
                        class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <span class="text-sm text-gray-600 text-center sm:text-left">{{ sellerProfile.ratings }}
                            ⭐</span>
                        <button @click="contactSeller"
                            class="bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-blue-600 transition duration-300 w-full sm:w-auto">
                            Contact Seller
                        </button>
                    </div>
                </div>
            </header>

            <!-- Featured Products -->
            <section class="mb-8 sm:mb-12">
                <h2 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 px-1">Featured Products</h2>
                <div class="flex justify-center">
                    <div class="w-full max-w-7xl">
                        <!-- Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns -->
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                            <ProductCard v-for="product in featuredProducts" :key="product._id" :product="product"
                                @click="viewProduct(product._id)" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- About the Seller -->
            <section class="bg-white rounded-lg shadow p-4 sm:p-6 mb-8 sm:mb-12">
                <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">About {{ sellerProfile.storeName }}</h2>
                <p class="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">{{ sellerProfile.storeDescription }}
                </p>

                <!-- Stats Grid -->
                <div class="grid grid-cols-3 gap-2 sm:gap-4">
                    <div class="text-center p-2 sm:p-4 bg-gray-50 rounded-lg">
                        <p class="font-semibold text-base sm:text-lg text-gray-800">{{ sellerProfile.products?.length ||
                            0 }}</p>
                        <p class="text-gray-600 text-xs sm:text-sm">Products</p>
                    </div>
                    <div class="text-center p-2 sm:p-4 bg-gray-50 rounded-lg">
                        <p class="font-semibold text-base sm:text-lg text-gray-800">{{ sellerProfile.totalSales || 0 }}
                        </p>
                        <p class="text-gray-600 text-xs sm:text-sm">Sales</p>
                    </div>
                    <div class="text-center p-2 sm:p-4 bg-gray-50 rounded-lg">
                        <p class="font-semibold text-base sm:text-lg text-gray-800">{{ joinDate }}</p>
                        <p class="text-gray-600 text-xs sm:text-sm">Joined</p>
                    </div>
                </div>
            </section>

            <!-- All Products -->
            <section>
                <h2 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 px-1">All Products</h2>
                <div class="flex justify-center">
                    <div class="w-full max-w-7xl">
                        <!-- Responsive Grid: Mobile 2 cols, Small 3 cols, Large 5 cols -->
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
                            <ProductCard v-for="product in allProducts" :key="product._id" :product="product"
                                @click="viewProduct(product._id)" />
                        </div>

                        <!-- Empty State -->
                        <div v-if="allProducts.length === 0" class="text-center py-8 sm:py-12">
                            <div class="text-gray-400 mb-4">
                                <svg class="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Products Yet</h3>
                            <p class="text-sm sm:text-base text-gray-500">This seller hasn't added any products yet.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSellerStore } from '../store/sellerStore.js';
import { useProductStore } from '../store/productStore.js';
import CustomImage from './CustomImage.vue';
import { Star, ShoppingCart } from 'lucide-vue-next';
import ProductCard from './ProductCard.vue';

export default {
    name: 'SellerHome',
    components: {
        CustomImage, Star, ShoppingCart, ProductCard
    },
    methods: {
        formatRating(rating) {
            return rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);
        }
    },
    setup() {
        const router = useRouter();
        const sellerStore = useSellerStore();
        const productStore = useProductStore();

        const sellerProfile = computed(() => sellerStore.sellerProfile);
        const joinDate = computed(() => {
            if (sellerProfile.value && sellerProfile.value.createdAt) {
                return new Date(sellerProfile.value.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            }
            return 'N/A';
        });

        const featuredProducts = ref([]);
        const allProducts = ref([]);

        onMounted(async () => {
            await loadSellerData();
        });

        const loadSellerData = async () => {
            try {
                if (!sellerProfile.value) {
                    // Assuming you have the seller ID available, replace 'sellerId' with the actual ID
                    await sellerStore.fetchSellerProfile('sellerId');
                }

                const products = await sellerStore.fetchSellerProducts(sellerProfile.value._id);
                allProducts.value = products;
                featuredProducts.value = products.slice(0, 4); // Show first 4 products as featured
            } catch (error) {
                console.error('Error loading seller data:', error);
            }
        };

        const contactSeller = () => {
            router.push(`/seller/${sellerProfile.value._id}/contact`);
        };

        const viewProduct = (productId) => {
            router.push({ name: 'ProductDetails', params: { id: productId } });
        };

        const truncateDescription = (description, maxLength = 100) => {
            return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
        };

        const calculateOriginalPrice = (product) => {
            return product.originalPrice || (product.discount ? Math.round(product.price / (1 - product.discount / 100)) : product.price);
        };

        const navigateToProduct = (productId) => {
            router.push({ name: 'ProductDetails', params: { id: productId } });
        };

        return {
            sellerProfile,
            joinDate,
            featuredProducts,
            allProducts,
            contactSeller,
            viewProduct,
            truncateDescription,
            calculateOriginalPrice,
            navigateToProduct
        };
    }
};
</script>

<style scoped>
/* Text clamping for better mobile display */
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Ensure proper spacing on mobile */
@media (max-width: 640px) {
    .container {
        max-width: 100%;
    }
}

/* Smooth transitions for responsive elements */
* {
    transition: all 0.2s ease-in-out;
}

/* Custom grid gap adjustments */
@media (min-width: 1280px) {
    .xl\:grid-cols-5 {
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }
}
</style>
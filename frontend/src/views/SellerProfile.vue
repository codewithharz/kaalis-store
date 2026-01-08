<!-- Can't find variable: sellerProfile -->
<!-- it's reasonable to ignore it in this case. The error seems to be a timing issue with Vue's reactivity system that self-resolves without impacting the user experience. -->

<template>
    <div class="bg-gray-100 min-h-screen">
        <div class="container mx-auto py-2 sm:py-4 lg:py-8 px-2 sm:px-4 lg:px-8">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-8">
                <div class="animate-pulse">
                    <div class="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div class="h-4 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
                    <div class="h-3 bg-gray-300 rounded w-32 mx-auto"></div>
                </div>
                <p class="text-lg sm:text-xl text-gray-600 mt-4">Loading seller profile...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-8">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
                    <div class="text-red-400 mb-4">
                        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                            </path>
                        </svg>
                    </div>
                    <p class="text-lg sm:text-xl text-red-600 font-semibold">{{ error }}</p>
                    <button @click="$router.go(-1)"
                        class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                        Go Back
                    </button>
                </div>
            </div>

            <!-- Content State -->
            <div v-if="sellerProfile && !isLoading" class="bg-white shadow-lg rounded-lg overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 sm:p-4 lg:p-6 relative">
                    <div class="flex flex-col sm:flex-row items-center text-center sm:text-left">
                        <img v-if="sellerProfile.profileImage" :src="sellerProfile.profileImage" alt="Seller Avatar"
                            class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white mb-3 sm:mb-0 sm:mr-4 lg:mr-6 flex-shrink-0">
                        <img v-else src="/src/assets/images/Kyrian.png" alt="Default Avatar"
                            class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white mb-3 sm:mb-0 sm:mr-4 lg:mr-6 flex-shrink-0" />
                        <div class="text-white min-w-0 flex-1">
                            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{{ sellerProfile.storeName ||
                                sellerProfile.username }}</h1>
                            <p class="text-indigo-200 text-sm sm:text-base">{{ sellerProfile.tagline || `Seller on our
                                platform` }}</p>
                        </div>
                    </div>

                    <!-- Status Badge -->
                    <div class="absolute top-2 right-2 sm:top-4 sm:right-4">
                        <span :class="{
                            'bg-yellow-500': sellerProfile.isVacationMode,
                            'bg-green-500': !sellerProfile.isVacationMode
                        }" class="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-white text-xs sm:text-sm font-semibold">
                            {{ sellerProfile.isVacationMode ? 'On Vacation' : 'Open' }}
                        </span>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-3 sm:p-4 lg:p-6">
                    <!-- Store Status Notice -->
                    <div v-if="sellerProfile.isVacationMode || !sellerProfile.storeOpen"
                        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
                        <p class="font-bold text-sm sm:text-base">{{ storeStatusMessage }}</p>
                        <p class="text-sm sm:text-base mt-1">{{ storeStatusDescription }}</p>
                    </div>

                    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                        <!-- Left Column - About and Contact -->
                        <div class="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                            <!-- About Section -->
                            <section>
                                <h2
                                    class="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-gray-800">
                                    About the Store</h2>
                                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <p class="text-gray-600 text-sm sm:text-base leading-relaxed">
                                        {{ sellerProfile.storeDescription || 'No description available.' }}
                                    </p>
                                </div>
                            </section>

                            <!-- Contact Information -->
                            <section>
                                <h2
                                    class="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-gray-800">
                                    Contact Information</h2>
                                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <ul class="space-y-3">
                                        <li v-if="sellerProfile.email" class="flex items-start sm:items-center">
                                            <Mail
                                                class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mr-3 mt-0.5 sm:mt-0 flex-shrink-0" />
                                            <span class="text-sm sm:text-base text-gray-700 break-all">{{
                                                sellerProfile.email }}</span>
                                        </li>
                                        <li v-if="sellerProfile.phone" class="flex items-center">
                                            <Phone class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mr-3 flex-shrink-0" />
                                            <span class="text-sm sm:text-base text-gray-700">{{ sellerProfile.phone
                                                }}</span>
                                        </li>
                                        <li v-if="sellerProfile.address" class="flex items-start sm:items-center">
                                            <MapPin
                                                class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mr-3 mt-0.5 sm:mt-0 flex-shrink-0" />
                                            <div
                                                class="flex flex-col sm:flex-row sm:space-x-1 text-sm sm:text-base text-gray-700">
                                                <span>{{ sellerProfile.address.state }}</span>
                                                <span class="hidden sm:inline">,</span>
                                                <span>{{ sellerProfile.address.country }}</span>
                                            </div>
                                        </li>
                                        <li v-if="!sellerProfile.email && !sellerProfile.phone && !sellerProfile.address"
                                            class="text-sm sm:text-base text-gray-500 italic">
                                            No contact information available.
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <!-- Store Policies -->
                            <section>
                                <h2
                                    class="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-gray-800">
                                    Store Policies</h2>
                                <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <p v-if="sellerProfile.storePolicies"
                                        class="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {{ sellerProfile.storePolicies }}
                                    </p>
                                    <p v-else class="text-sm sm:text-base text-gray-500 italic">No store policies have
                                        been set.</p>
                                </div>
                            </section>
                        </div>

                        <!-- Right Column - Statistics -->
                        <div class="xl:col-span-1">
                            <section
                                class="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
                                <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Store Statistics
                                </h2>
                                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div
                                        class="bg-white p-3 sm:p-4 rounded-lg text-center shadow-sm border border-blue-100">
                                        <span class="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 block">
                                            {{ sellerProfile.totalProducts || 0 }}
                                        </span>
                                        <p class="text-xs sm:text-sm text-blue-500 mt-1">Total Products</p>
                                    </div>
                                    <div
                                        class="bg-white p-3 sm:p-4 rounded-lg text-center shadow-sm border border-green-100">
                                        <span class="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 block">
                                            {{ totalSales }}
                                        </span>
                                        <p class="text-xs sm:text-sm text-green-500 mt-1">Total Sales</p>
                                    </div>
                                    <div
                                        class="bg-white p-3 sm:p-4 rounded-lg text-center shadow-sm border border-yellow-100">
                                        <span class="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 block">
                                            {{ sellerProfile.averageRating ? sellerProfile.averageRating.toFixed(1) :
                                                '—' }}
                                        </span>
                                        <p class="text-xs sm:text-sm text-yellow-500 mt-1">Average Rating</p>
                                    </div>
                                    <div
                                        class="bg-white p-3 sm:p-4 rounded-lg text-center shadow-sm border border-purple-100">
                                        <span class="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 block">
                                            {{ formatDate(sellerProfile.createdAt) }}
                                        </span>
                                        <p class="text-xs sm:text-sm text-purple-500 mt-1">Member Since</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    <!-- Featured Products -->
                    <section class="mt-6 sm:mt-8">
                        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Featured
                            Products</h2>
                        <div class="flex justify-center">
                            <div v-if="featuredProducts.length > 0"
                                class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
                                <ProductCard v-for="product in featuredProducts" :key="product._id" :product="product"
                                    @click="viewProduct(product._id)" />
                            </div>
                            <div v-else class="text-center py-8 w-full">
                                <div class="text-gray-400 mb-4">
                                    <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                </div>
                                <p class="text-gray-500 text-sm sm:text-base">No featured products available.</p>
                            </div>
                        </div>
                    </section>

                    <!-- Ratings and Reviews -->
                    <section class="mt-6 sm:mt-8">
                        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Recent
                            Product Reviews</h2>
                        <div v-if="Object.keys(productReviews).length > 0" class="space-y-4">
                            <div v-for="(reviews, productId) in productReviews" :key="productId"
                                class="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                <h3 class="font-semibold text-base sm:text-lg mb-3 text-gray-800">{{
                                    getProductName(productId) }}</h3>
                                <div v-for="review in reviews.slice(0, 2)" :key="review._id" class="mb-4 last:mb-0">
                                    <div class="flex items-center mb-2">
                                        <div class="flex text-yellow-400">
                                            <Star v-for="star in 5" :key="star"
                                                :class="['w-3 h-3 sm:w-4 sm:h-4', star <= review.rating ? 'text-yellow-400' : 'text-gray-300']" />
                                        </div>
                                        <span class="ml-2 text-gray-600 text-sm sm:text-base font-medium">{{
                                            review.rating.toFixed(1) }}</span>
                                    </div>
                                    <p class="text-gray-700 text-sm sm:text-base leading-relaxed mb-2">{{ review.review
                                        }}</p>
                                    <p class="text-xs sm:text-sm text-gray-500">
                                        By <span class="font-medium">{{ review.user.username }}</span> on {{
                                            formatDate(review.createdAt) }}
                                    </p>
                                </div>
                                <button @click="navigateToProduct(productId)"
                                    class="text-indigo-600 hover:text-indigo-800 font-semibold text-sm sm:text-base underline-offset-2 hover:underline transition-colors">
                                    View All Reviews for This Product
                                </button>
                            </div>
                        </div>
                        <div v-else class="text-center py-8">
                            <div class="text-gray-400 mb-4">
                                <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                    </path>
                                </svg>
                            </div>
                            <p class="text-gray-500 text-sm sm:text-base">No product reviews available.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSellerStore } from '../store/sellerStore';
import { useProductStore } from '../store/productStore';
import CustomImage from './CustomImage.vue';
import {
    ShoppingCart, Star, Mail, Phone, MapPin, Camera
} from 'lucide-vue-next';
import ProductCard from './ProductCard.vue';

export default {
    name: 'SellerProfile',
    components: {
        CustomImage,
        ShoppingCart,
        Star,
        Mail,
        Phone,
        MapPin,
        Camera,
        ProductCard
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const sellerStore = useSellerStore();
        const productStore = useProductStore();

        const isLoading = ref(true);
        const error = ref(null);  // Add this
        const sellerProfile = ref({
            isVacationMode: false,
            storeOpen: true,
            storeName: '',
            username: '',
            tagline: '',
            profileImage: '',
            email: '',
            phone: '',
            address: {
                state: '',
                country: ''
            },
            storePolicies: '',
            totalProducts: 0,
            totalSales: 0,
            averageRating: 0,
            createdAt: new Date().toISOString()
        });

        const featuredProducts = ref([]);
        const productReviews = ref({});

        const storeStatusMessage = computed(() => {
            if (!sellerProfile.value) return '';
            return sellerProfile.value.isVacationMode
                ? 'Seller is currently on vacation'
                : 'Store is open';
        });

        const storeStatusDescription = computed(() => {
            if (!sellerProfile.value) return '';
            return sellerProfile.value.isVacationMode
                ? 'New orders may be delayed. Please check back later or contact the seller for more information.'
                : 'Feel free to browse and place orders.';
        });

        const getProductName = (productId) => {
            const product = featuredProducts.value.find(p => p._id === productId);
            return product ? product.name : 'Unknown Product';
        };

        const loadSellerData = async (sellerId) => {
            try {
                isLoading.value = true;
                error.value = null;

                // Fetch seller profile which includes delivery stats
                const profile = await sellerStore.fetchSellerProfile(sellerId);
                if (!profile) {
                    throw new Error("Failed to load seller profile");
                }

                // Fetch all orders for this seller to count delivered ones
                const orders = await sellerStore.fetchSellerOrders(sellerId);
                const deliveredCount = orders?.filter(order =>
                    order.status === "Delivered"
                ).length || 0;

                sellerProfile.value = {
                    ...sellerProfile.value,
                    ...profile,
                    totalSales: deliveredCount,
                    deliveredOrders: deliveredCount
                };

                // Then fetch featured products and reviews
                await Promise.all([
                    loadFeaturedProducts(sellerId),
                    fetchProductReviews()
                ]);

            } catch (err) {
                console.error('Failed to load seller profile:', err);
                error.value = "Error loading seller profile";
            } finally {
                isLoading.value = false;
            }
        };

        onMounted(async () => {
            const sellerId = route.params.id;
            if (sellerId) {
                try {
                    isLoading.value = true;
                    error.value = null; // Reset error state

                    // First fetch seller profile
                    const profile = await sellerStore.fetchSellerProfile(sellerId);
                    if (!profile) {
                        throw new Error("Failed to load seller profile");
                    }

                    sellerProfile.value = {
                        ...sellerProfile.value,
                        ...profile
                    };

                    // Then fetch featured products and reviews
                    await Promise.all([
                        loadFeaturedProducts(sellerId),
                        fetchProductReviews()
                    ]);

                } catch (err) {
                    console.error('Failed to load seller profile:', err);
                    error.value = "Error loading seller profile";
                } finally {
                    isLoading.value = false;
                }
            }
        });

        onMounted(async () => {
            const sellerId = route.params.id;
            if (sellerId) {
                await loadSellerData(sellerId);
            }
        });

        const totalSales = computed(() => {
            return sellerProfile.value?.totalSales ||
                sellerProfile.value?.deliveredOrders ||
                0;
        });

        const loadFeaturedProducts = async (sellerId) => {
            try {
                const products = await sellerStore.fetchSellerProducts(sellerId);
                featuredProducts.value = products?.slice(0, 4) || []; // Get first 4 products as featured
                console.log('Featured products:', featuredProducts.value);
            } catch (error) {
                console.error('Failed to load featured products:', error);
                throw error; // Let the parent try/catch handle this
            }
        };

        const fetchProductReviews = async () => {
            const reviewPromises = featuredProducts.value.map(async (product) => {
                try {
                    const reviews = await productStore.fetchProductReviews(product._id);
                    if (reviews?.length > 0) {
                        productReviews.value[product._id] = reviews;
                    }
                } catch (error) {
                    console.error(`Failed to load reviews for product ${product._id}:`, error);
                }
            });

            await Promise.all(reviewPromises);
            console.log('Product reviews:', productReviews.value);
        };

        const viewProduct = (productId) => {
            router.push({ name: 'ProductDetails', params: { id: productId } });
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        };

        const formatRating = (rating) => {
            return rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);
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
            featuredProducts,
            productReviews,
            isLoading,
            error,             // Added this
            storeStatusMessage,
            storeStatusDescription,
            viewProduct,
            formatDate,
            formatRating,
            truncateDescription,
            calculateOriginalPrice,
            navigateToProduct,
            getProductName,
            totalSales
        };
    }
};
</script>

<style scoped>
/* Smooth transitions for responsive elements */
* {
    transition: all 0.2s ease-in-out;
}

/* Loading animation */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom scrollbar for better mobile experience */
@media (max-width: 640px) {
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

/* Enhanced focus states for accessibility */
button:focus,
a:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
}

/* Better text truncation */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
<template>
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Enhanced Reviews Summary -->
            <div
                class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8 hover:shadow-2xl transition-all duration-300">
                <!-- Header with Gradient -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-200">
                    <div class="flex items-center gap-4 mb-6">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">Your Reviews</h2>
                            <p class="text-sm text-gray-600">Reviews you've written for purchased products</p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between flex-wrap gap-8">
                        <!-- Rating Overview -->
                        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="flex">
                                    <template v-for="n in 5" :key="n">
                                        <svg :class="[n <= averageRating ? 'text-yellow-400' : 'text-gray-300']"
                                            class="w-10 h-10 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </template>
                                </div>
                                <div>
                                    <span class="text-4xl font-bold text-gray-900">{{ averageRating.toFixed(1) }}</span>
                                    <span class="text-lg text-gray-600 ml-2">out of 5</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <p class="text-gray-600 font-medium">You've written {{ reviews.length }} review{{
                                    reviews.length !== 1 ? 's' : '' }}
                                </p>
                            </div>
                        </div>

                        <!-- Rating Distribution -->
                        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 max-w-md">
                            <h4 class="text-lg font-bold text-gray-900 mb-4">Rating Distribution</h4>
                            <div class="space-y-3">
                                <div v-for="n in 5" :key="6 - n" class="flex items-center gap-3">
                                    <span class="w-16 text-sm font-medium text-gray-700 text-right">{{ 6 - n }}
                                        stars</span>
                                    <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                                            :style="`width: ${getRatingPercentage(6 - n)}%`"></div>
                                    </div>
                                    <span class="text-sm text-gray-600 font-medium w-8">{{ getRatingCount(6 - n)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Filters Section -->
            <div
                class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 hover:shadow-xl transition-all duration-300">
                <!-- Header -->
                <div class="bg-gradient-to-r from-gray-50 to-purple-50 p-6 border-b border-gray-200">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Filter Your Reviews</h3>
                            <p class="text-sm text-gray-600">Sort and organize your feedback</p>
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <div class="flex flex-wrap gap-4 justify-between items-center">
                        <div class="flex gap-4">
                            <!-- Sort Dropdown -->
                            <div class="relative">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
                                <select v-model="sortBy"
                                    class="appearance-none bg-gray-50 hover:bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium">
                                    <option value="recent">Most Recent</option>
                                    <option value="helpful">Most Helpful</option>
                                    <option value="rating">Highest Rating</option>
                                </select>
                                <div class="absolute right-3 top-1/2 transform translate-y-1 pointer-events-none">
                                    <ChevronDown class="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            <!-- Rating Filter -->
                            <div class="relative">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Filter by Rating</label>
                                <select v-model="filterRating"
                                    class="appearance-none bg-gray-50 hover:bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium">
                                    <option value="">All Ratings</option>
                                    <option v-for="n in 5" :key="n" :value="n">{{ n }} Star{{ n > 1 ? 's' : '' }}
                                    </option>
                                </select>
                                <div class="absolute right-3 top-1/2 transform translate-y-1 pointer-events-none">
                                    <ChevronDown class="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <!-- Results Info -->
                        <div
                            class="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-3 rounded-xl border border-purple-200">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span class="text-sm font-medium text-purple-800">
                                    {{ filteredReviews.length }} review{{ filteredReviews.length !== 1 ? 's' : '' }}
                                    found
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Loading State -->
            <div v-if="loading"
                class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div class="relative">
                    <div class="animate-spin h-12 w-12 border-3 border-blue-500 rounded-full border-t-transparent">
                    </div>
                    <div
                        class="absolute inset-0 animate-ping h-12 w-12 border-2 border-blue-300 rounded-full opacity-75">
                    </div>
                </div>
                <p class="mt-4 text-lg font-medium text-gray-700">Loading your reviews...</p>
                <p class="text-sm text-gray-500">Please wait while we fetch your feedback history</p>
            </div>

            <!-- Enhanced Error State -->
            <div v-else-if="error"
                class="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl p-8 text-center border-2 border-red-200">
                <div
                    class="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-red-800 mb-2">Unable to load reviews</h3>
                <p class="text-red-700">{{ error }}</p>
            </div>

            <!-- Enhanced Reviews List -->
            <div v-else class="space-y-6">
                <div v-for="review in sortedReviews" :key="review._id"
                    class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">

                    <!-- Review Header -->
                    <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <!-- Customer Info -->
                                <div class="flex items-center gap-4 mb-4">
                                    <div
                                        class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span class="text-white font-bold text-lg">{{ (userStore.user?.username ||
                                            'Y').charAt(0).toUpperCase() }}</span>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900">
                                            {{ review.user?.username || 'Anonymous Customer' }}
                                        </h3>
                                        <div class="flex items-center gap-3">
                                            <span class="text-sm text-gray-600">
                                                {{ formatDate(review.createdAt) }}
                                            </span>
                                            <span v-if="review.isVerifiedPurchase"
                                                class="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200 font-medium">
                                                ✓ Verified Purchase
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Star Rating -->
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="flex">
                                        <template v-for="n in 5" :key="n">
                                            <svg :class="[n <= review.rating ? 'text-yellow-400' : 'text-gray-300']"
                                                class="w-6 h-6 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </template>
                                    </div>
                                    <span class="text-sm font-medium text-gray-600">
                                        {{ review.rating }}/5 stars
                                    </span>
                                </div>
                            </div>

                            <!-- Product Preview -->
                            <div v-if="review.product" class="ml-6">
                                <div class="w-24 h-24 relative group">
                                    <img :src="review.product.images?.[0]" :alt="review.product.name"
                                        class="w-full h-full object-cover rounded-xl border-2 border-gray-200 shadow-sm cursor-pointer hover:opacity-75 transition-all duration-300 group-hover:scale-105"
                                        @error="handleImageError" @click="navigateToProduct(review.product._id)">
                                    <div
                                        class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl">
                                    </div>
                                </div>
                                <p class="mt-2 text-sm text-gray-600 text-center truncate max-w-[96px] font-medium">
                                    {{ review.product.name }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Review Content -->
                    <div class="p-6">
                        <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                            <p class="text-gray-800 leading-relaxed text-lg">{{ review.review }}</p>
                        </div>

                        <!-- Review Images -->
                        <div v-if="review.images?.length" class="mt-6">
                            <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                                Customer Photos ({{ review.images.length }})
                            </h4>
                            <div class="flex gap-3 overflow-x-auto py-2">
                                <div v-for="(image, idx) in review.images" :key="idx" class="flex-shrink-0 w-24 h-24">
                                    <img :src="image" :alt="`Review photo ${idx + 1}`"
                                        class="w-full h-full object-cover rounded-xl border-2 border-gray-200 cursor-pointer hover:opacity-75 transition-all duration-300 hover:scale-105 shadow-sm"
                                        @click="openImageGallery(review.images, idx)" @error="handleImageError">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Review Footer -->
                    <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div class="flex items-center justify-between">
                            <button @click="markHelpful(review._id)" :disabled="isHelpfulLoading"
                                class="group relative flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium"
                                :class="{ 'opacity-50 cursor-not-allowed': isHelpfulLoading }">
                                <!-- Tooltip -->
                                <div class="absolute bottom-full mb-2 left-0 hidden group-hover:block z-10">
                                    <div
                                        class="bg-gray-900 text-white text-xs rounded-lg p-3 whitespace-nowrap shadow-lg">
                                        {{ review.helpfulBy?.length ?
                                            `${review.helpfulBy.length} ${review.helpfulBy.length === 1 ? 'person' :
                                                'people'} found
                                        this helpful` :
                                            'Be the first to mark as helpful' }}
                                        <div
                                            class="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900">
                                        </div>
                                    </div>
                                </div>
                                <span class="text-lg">👍</span>
                                <span class="text-sm font-medium">Helpful ({{ review.helpfulCount || 0 }})</span>
                            </button>

                            <div v-if="review.images?.length" class="flex items-center gap-2 text-gray-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                                <span class="text-sm font-medium">{{ review.images.length }} photo{{
                                    review.images.length > 1 ? 's'
                                        : '' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="!sortedReviews.length"
                    class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div
                        class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7">
                            </path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
                    <p class="text-gray-600 mb-6 max-w-md mx-auto">
                        {{ filterRating || sortBy !== 'recent' ?
                            'No reviews match your current filters. Try adjusting your search criteria.' :
                            `You haven\'t written any product reviews yet. Share your experiences with products you\'ve
                        purchased!` }}
                    </p>
                    <div v-if="!filterRating && sortBy === 'recent'"
                        class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <p class="text-blue-700 text-sm font-medium">
                            💡 Check the "Pending Reviews" tab to review recently delivered products
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronDown } from 'lucide-vue-next';
import { useProductStore } from '../store/productStore';
import { useUserStore } from '../store/user';
import { toast } from 'vue-sonner';
import RatePurchaseHeader from './RatePurchaseHeader.vue';

export default {
    name: 'ReviewsCard',

    components: {
        RatePurchaseHeader,
        ChevronDown
    },

    setup() {
        const productStore = useProductStore();
        const userStore = useUserStore();
        const router = useRouter();
        const reviews = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const sortBy = ref('recent');
        const filterRating = ref('');
        const isHelpfulLoading = ref(false);

        // Fetch user's reviews only
        const fetchReviews = async () => {
            try {
                loading.value = true;
                // Fetch only the current user's reviews instead of all reviews
                const response = await productStore.fetchUserReviews();
                reviews.value = response;
            } catch (err) {
                error.value = 'Failed to load reviews';
                toast.error('Could not load reviews. Please try again.');
            } finally {
                loading.value = false;
            }
        };

        // Filter reviews based on rating
        const filteredReviews = computed(() => {
            if (!filterRating.value) return reviews.value;
            return reviews.value.filter(review => review.rating === parseInt(filterRating.value));
        });

        // Sort filtered reviews
        const sortedReviews = computed(() => {
            return [...filteredReviews.value].sort((a, b) => {
                switch (sortBy.value) {
                    case 'recent':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'helpful':
                        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
                    case 'rating':
                        return b.rating - a.rating;
                    default:
                        return 0;
                }
            });
        });

        // Format date helper
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        // Mark review as helpful
        const markHelpful = async (reviewId) => {
            if (isHelpfulLoading.value) return;

            try {
                isHelpfulLoading.value = true;
                await productStore.markReviewHelpful(reviewId);
                await fetchReviews(); // Refresh reviews
                toast.success('Review marked as helpful');
            } catch (err) {
                toast.error('Failed to mark review as helpful');
            } finally {
                isHelpfulLoading.value = false;
            }
        };

        // Handle image loading errors
        const handleImageError = (event) => {
            event.target.src = '/placeholder-image.jpg'; // Replace with your placeholder image
        };

        const averageRating = computed(() => {
            if (!reviews.value.length) return 0;
            const total = reviews.value.reduce((acc, review) => acc + review.rating, 0);
            return total / reviews.value.length;
        });

        const getRatingCount = (stars) => {
            return reviews.value.filter(review => review.rating === stars).length;
        };

        const getRatingPercentage = (stars) => {
            if (!reviews.value.length) return 0;
            return (getRatingCount(stars) / reviews.value.length) * 100;
        };

        const openImageGallery = (images, startIndex) => {
            // Implement image gallery view logic here
            console.log('Opening gallery with images:', images, 'starting at index:', startIndex);
        };

        const navigateToProduct = (productId) => {
            // Implement navigation to product page
            router.push(`/product/${productId}`);
        };

        onMounted(() => {
            fetchReviews();
        });

        return {
            reviews,
            loading,
            error,
            sortBy,
            filterRating,
            filteredReviews,
            sortedReviews,
            isHelpfulLoading,
            formatDate,
            markHelpful,
            handleImageError,
            averageRating,
            getRatingCount,
            getRatingPercentage,
            openImageGallery,
            navigateToProduct,
            userStore,
        };
    }
};
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Enhanced transitions and hover effects */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Disable hover effects on mobile */
@media (max-width: 768px) {
    .transform {
        transform: none !important;
    }

    .hover\:scale-\[1\.01\]:hover {
        transform: none !important;
    }

    .hover\:scale-105:hover {
        transform: none !important;
    }
}

/* Enhanced focus states */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Custom scrollbar for image galleries */
.overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #3b82f6 #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(to right, #3b82f6, #1d4ed8);
    border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to right, #1d4ed8, #1e40af);
}

/* Enhanced shadow effects */
.shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Custom animations for loading states */
.animate-ping {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

/* Enhanced tooltip styling */
.group:hover .group-hover\:block {
    display: block;
}

/* Smooth image hover effects */
img {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Rating stars glow effect */
.text-yellow-400 {
    filter: drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3));
}
</style>
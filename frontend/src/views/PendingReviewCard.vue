<template>
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Enhanced Header -->
            <div
                class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8 hover:shadow-2xl transition-all duration-300">
                <div class="bg-gradient-to-r from-orange-50 to-amber-50 p-8 border-b border-gray-200">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">Pending Reviews</h2>
                            <p class="text-sm text-gray-600">Share your experience with recently delivered products</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Loading State -->
            <div v-if="loading"
                class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div class="relative">
                    <div class="animate-spin h-12 w-12 border-3 border-orange-500 rounded-full border-t-transparent">
                    </div>
                    <div
                        class="absolute inset-0 animate-ping h-12 w-12 border-2 border-orange-300 rounded-full opacity-75">
                    </div>
                </div>
                <p class="mt-4 text-lg font-medium text-gray-700">Loading pending reviews...</p>
                <p class="text-sm text-gray-500">Finding products awaiting your feedback</p>
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

            <!-- Enhanced Empty State -->
            <div v-else-if="pendingReviews.length === 0"
                class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div
                    class="w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                <p class="text-gray-600 mb-6 max-w-md mx-auto">
                    You've reviewed all your delivered products. Thank you for sharing your valuable feedback!
                </p>
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <p class="text-green-700 text-sm font-medium">
                        🎉 Your reviews help other customers make informed decisions
                    </p>
                </div>
            </div>

            <!-- Enhanced Reviews List -->
            <div v-else class="space-y-6">
                <div v-for="item in pendingReviews" :key="item.orderId + item.product._id"
                    class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">

                    <!-- Product Header -->
                    <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                        <div class="flex justify-between items-start">
                            <!-- Product Info -->
                            <div class="flex items-start gap-6 flex-1">
                                <!-- Product Image -->
                                <div class="relative group">
                                    <img :src="getProductImage(item.product)" :alt="item.product?.name || 'Product'"
                                        class="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover:scale-105 transition-all duration-300"
                                        @error="handleImageError">
                                    <div
                                        class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-xl">
                                    </div>
                                </div>

                                <!-- Product Details -->
                                <div class="flex-1">
                                    <h3 class="text-xl font-bold text-gray-900 mb-3">
                                        {{ item.product?.name || 'Unknown Product' }}
                                    </h3>

                                    <div class="space-y-2">
                                        <div class="flex items-center gap-2">
                                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span class="text-sm font-medium text-gray-600">Order ID:</span>
                                            <span class="text-sm font-bold text-gray-900">{{ item.orderId }}</span>
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span class="text-sm font-medium text-gray-600">Delivered on:</span>
                                            <span class="text-sm font-bold text-gray-900">{{
                                                formatDate(item.deliveryDate) }}</span>
                                        </div>
                                    </div>

                                    <!-- Delivery Status Badge -->
                                    <div class="mt-4">
                                        <span
                                            class="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs rounded-full border border-green-200 font-medium">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Delivered Successfully
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Review Button -->
                            <button @click="openReviewModal(item)"
                                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                    </path>
                                </svg>
                                Write Review
                            </button>
                        </div>
                    </div>

                    <!-- Review Prompt -->
                    <div class="p-6">
                        <div
                            class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                            <div class="flex items-start gap-3">
                                <div
                                    class="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-orange-800 mb-1">Help Other Customers</h4>
                                    <p class="text-sm text-orange-700">
                                        Share your experience with this product to help fellow shoppers make informed
                                        decisions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Review Modal -->
        <div v-if="showReviewModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden" @click.stop>
                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">Write a Review</h3>
                                <p class="text-orange-100 text-sm mt-1">Share your honest feedback</p>
                            </div>
                        </div>
                        <button @click="closeReviewModal" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Modal Content -->
                <div class="p-6">
                    <!-- Product Info -->
                    <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 mb-6">
                        <div class="flex items-center gap-4">
                            <img :src="getProductImage(selectedProduct)" :alt="selectedProduct?.name || 'Product'"
                                class="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                @error="handleImageError">
                            <div>
                                <h4 class="text-lg font-bold text-gray-900 mb-1">
                                    {{ selectedProduct?.name || 'Unknown Product' }}
                                </h4>
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span class="text-sm text-gray-600">Order ID: <span class="font-medium">{{
                                        selectedOrderId }}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Rating Section -->
                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-3">Your Rating *</label>
                        <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="flex gap-1">
                                    <button v-for="star in 5" :key="star" @click="rating = star"
                                        class="focus:outline-none transition-transform hover:scale-110">
                                        <svg class="w-10 h-10 drop-shadow-sm"
                                            :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </button>
                                </div>
                                <div v-if="rating > 0" class="text-lg font-bold text-gray-900">
                                    {{ rating }}/5 stars
                                </div>
                            </div>
                            <p class="text-sm text-gray-600">
                                {{ rating === 0 ? 'Click to rate this product' :
                                    rating === 1 ? 'Poor - Disappointed with this product' :
                                        rating === 2 ? 'Fair - Below expectations' :
                                            rating === 3 ? 'Good - Meets expectations' :
                                                rating === 4 ? 'Very Good - Exceeds expectations' :
                                                    'Excellent - Outstanding product!' }}
                            </p>
                        </div>
                    </div>

                    <!-- Review Text -->
                    <div class="mb-6">
                        <label for="review" class="block text-sm font-bold text-gray-700 mb-3">
                            Your Review *
                        </label>
                        <div class="relative">
                            <textarea id="review" v-model="reviewText" rows="5"
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                                placeholder="Tell others about your experience with this product. What did you like or dislike? Would you recommend it?"></textarea>
                            <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                                {{ reviewText.length }}/500
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-2">
                            Minimum 3 characters required. Be honest and helpful to other customers.
                        </p>
                    </div>

                    <!-- Tips Section -->
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mb-6">
                        <h5 class="text-sm font-bold text-blue-800 mb-2">💡 Review Tips</h5>
                        <ul class="text-xs text-blue-700 space-y-1">
                            <li>• Share specific details about the product quality</li>
                            <li>• Mention if it met your expectations</li>
                            <li>• Include any pros and cons you noticed</li>
                            <li>• Be honest and constructive</li>
                        </ul>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button @click="closeReviewModal"
                        class="px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-all">
                        Cancel
                    </button>
                    <button @click="submitReview" :disabled="!isValidReview || isSubmitting"
                        class="px-8 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all transform hover:scale-105 shadow-lg"
                        :class="{ 'animate-pulse': isSubmitting }">
                        <span v-if="isSubmitting" class="flex items-center gap-2">
                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                            </div>
                            Submitting...
                        </span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                            Submit Review
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { toast } from 'vue-sonner';

export default {
    name: 'PendingReviewCard',

    setup() {
        const orderStore = useOrderStore();
        const productStore = useProductStore();
        const loading = ref(true);
        const error = ref(null);
        const pendingReviews = ref([]);
        const showReviewModal = ref(false);
        const selectedProduct = ref(null);
        const selectedOrderId = ref(null);
        const rating = ref(0);
        const reviewText = ref('');
        const isSubmitting = ref(false);

        const isValidReview = computed(() => {
            return rating.value > 0 && reviewText.value.trim().length >= 3;
        });

        // Add helper function for getting product image
        const getProductImage = (product) => {
            if (!product) return '/placeholder-image.jpg';
            if (!product.images || !product.images.length) return '/placeholder-image.jpg';
            return product.images[0];
        };

        // const fetchPendingReviews = async () => {
        //     try {
        //         loading.value = true;
        //         const orders = await orderStore.fetchUserOrdersWithProducts();
        //         console.log('Fetched orders:', orders); // Debug log

        //         // Filter for delivered orders and products that haven't been rated
        //         const pending = orders.reduce((acc, order) => {
        //             if (order.status === 'Delivered') {
        //                 order.products.forEach(productItem => {
        //                     const isRated = order.ratedProducts?.some(
        //                         rp => rp.product?._id?.toString() === productItem.product?._id?.toString() && rp.rated
        //                     );

        //                     if (!isRated && productItem.product && typeof productItem.product === 'object') {
        //                         acc.push({
        //                             orderId: order.orderId,
        //                             deliveryDate: order.updatedAt,
        //                             product: productItem.product
        //                         });
        //                     } else {
        //                         console.log('Skipping product:', {
        //                             productId: productItem.product?._id,
        //                             isRated,
        //                             hasProduct: !!productItem.product,
        //                             productType: typeof productItem.product
        //                         });
        //                     }
        //                 });
        //             }
        //             return acc;
        //         }, []);

        //         console.log('Found pending reviews:', pending);
        //         pendingReviews.value = pending;
        //     } catch (err) {
        //         console.error('Error fetching pending reviews:', err);
        //         error.value = 'Failed to load pending reviews';
        //         toast.error('Could not load pending reviews. Please try again.');
        //     } finally {
        //         loading.value = false;
        //     }
        // };


        // Replace the fetchPendingReviews function in your PendingReviewCard.vue

        const fetchPendingReviews = async () => {
            try {
                loading.value = true;

                // Use the new backend endpoint that properly filters out rated products
                const pending = await productStore.fetchUserPendingReviews();

                console.log('Found pending reviews:', pending);
                pendingReviews.value = pending;
            } catch (err) {
                console.error('Error fetching pending reviews:', err);
                error.value = 'Failed to load pending reviews';
                toast.error('Could not load pending reviews. Please try again.');
            } finally {
                loading.value = false;
            }
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const handleImageError = (event) => {
            event.target.src = '/placeholder-image.jpg';
        };

        const openReviewModal = (item) => {
            selectedProduct.value = item.product;
            selectedOrderId.value = item.orderId;
            rating.value = 0;
            reviewText.value = '';
            showReviewModal.value = true;
        };

        const closeReviewModal = () => {
            showReviewModal.value = false;
            selectedProduct.value = null;
            selectedOrderId.value = null;
            rating.value = 0;
            reviewText.value = '';
        };

        const submitReview = async () => {
            if (!isValidReview.value || !selectedProduct.value?._id) {
                console.error('Invalid review data:', {
                    productId: selectedProduct.value?._id,
                    rating: rating.value,
                    review: reviewText.value
                });
                return;
            }

            try {
                isSubmitting.value = true;
                console.log('Submitting review:', {
                    productId: selectedProduct.value._id,
                    rating: rating.value,
                    review: reviewText.value
                });

                await productStore.rateProduct(
                    selectedProduct.value._id,
                    rating.value,
                    reviewText.value
                );

                // Refetch orders to get the updated ratedProducts array
                await orderStore.fetchUserOrdersWithProducts();

                // Update local state
                pendingReviews.value = pendingReviews.value.filter(
                    item => item.product._id !== selectedProduct.value._id
                );

                // Update order store
                orderStore.updateProductRatedStatus(selectedProduct.value._id);

                toast.success('Review submitted successfully! Thank you for your feedback.');
                closeReviewModal();
            } catch (err) {
                console.error('Review submission error:', err);
                if (err.response?.data?.message === 'You have already rated this product') {
                    // Remove the item from pendingReviews if the user has already rated it
                    pendingReviews.value = pendingReviews.value.filter(
                        item => item.product._id !== selectedProduct.value._id
                    );
                    toast.error('You have already rated this product');
                } else {
                    toast.error('Failed to submit review. Please try again.');
                }
            } finally {
                isSubmitting.value = false;
            }
        };

        onMounted(() => {
            fetchPendingReviews();
        });

        return {
            loading,
            error,
            pendingReviews,
            showReviewModal,
            selectedProduct,
            selectedOrderId,
            rating,
            reviewText,
            isSubmitting,
            isValidReview,
            getProductImage,
            formatDate,
            handleImageError,
            openReviewModal,
            closeReviewModal,
            submitReview
        };
    }
};
</script>

<style scoped>
/* Enhanced animations and transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Disable hover effects on mobile */
@media (max-width: 768px) {
    .transform {
        transform: none !important;
    }

    .hover\:scale-105:hover {
        transform: none !important;
    }

    .hover\:scale-\[1\.01\]:hover {
        transform: none !important;
    }

    .hover\:scale-110:hover {
        transform: none !important;
    }
}

/* Enhanced focus states */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Custom animations */
.animate-spin {
    animation: spin 1s linear infinite;
}

.animate-ping {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}

/* Rating stars glow effect */
.text-yellow-400 {
    filter: drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3));
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

/* Modal backdrop blur */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #f97316, #d97706);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #ea580c, #c2410c);
}

/* Smooth transitions for all interactive elements */
button,
input,
textarea,
select {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced textarea resize handling */
textarea {
    resize: none;
    field-sizing: content;
}

/* Loading spinner styling */
.border-3 {
    border-width: 3px;
}
</style>
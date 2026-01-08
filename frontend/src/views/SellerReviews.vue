<template>
    <div class="bg-gray-100 min-h-screen py-8">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                    <h1 class="text-3xl font-bold text-white">Reviews for {{ sellerName }}</h1>
                    <div class="flex items-center mt-4">
                        <div class="flex items-center">
                            <Star v-for="star in 5" :key="star"
                                :class="star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'"
                                class="w-6 h-6" />
                        </div>
                        <p class="ml-2 text-xl font-semibold text-white">{{ averageRating.toFixed(1) }} out of 5</p>
                    </div>
                    <p class="text-indigo-100 mt-1">Based on {{ totalReviews }} reviews</p>
                </div>

                <!-- Review List -->
                <div class="p-6">
                    <div v-if="reviews.length === 0" class="text-center py-8">
                        <p class="text-gray-500 text-xl">No reviews yet.</p>
                    </div>
                    <div v-else class="space-y-6">
                        <div v-for="review in reviews" :key="review._id"
                            class="border-b border-gray-200 pb-6 last:border-b-0">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <img :src="review.user.avatar || '/default-avatar.png'" alt="User Avatar"
                                        class="w-12 h-12 rounded-full mr-4">
                                    <div>
                                        <h3 class="font-semibold text-lg">{{ review.user.username }}</h3>
                                        <p class="text-gray-500">{{ formatDate(review.createdAt) }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <Star v-for="star in 5" :key="star"
                                        :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                                        class="w-5 h-5" />
                                    <span class="ml-2 text-gray-600 font-semibold">{{ review.rating }}.0</span>
                                </div>
                            </div>
                            <p class="mt-4 text-gray-700">{{ review.comment }}</p>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div class="mt-8 flex justify-center">
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                Previous
                            </button>
                            <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                                :class="['relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium', currentPage === page ? 'text-indigo-600 border-indigo-500' : 'text-gray-700 hover:bg-gray-50']">
                                {{ page }}
                            </button>
                            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSellerStore } from '../store/sellerStore';
import { Star } from 'lucide-vue-next';

export default {
    name: 'SellerReviews',
    components: { Star },
    setup() {
        const route = useRoute();
        const sellerStore = useSellerStore();
        const sellerId = route.params.id;

        const sellerName = ref('');
        const reviews = ref([]);
        const averageRating = ref(0);
        const totalReviews = ref(0);
        const currentPage = ref(1);
        const totalPages = ref(1);
        const itemsPerPage = 10;

        const fetchReviews = async (page) => {
            try {
                const data = await sellerStore.fetchSellerReviews(sellerId, page, itemsPerPage);
                reviews.value = data.reviews;
                averageRating.value = data.averageRating;
                totalReviews.value = data.totalReviews;
                sellerName.value = data.sellerName;
                totalPages.value = Math.ceil(data.totalReviews / itemsPerPage);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                // Handle error (e.g., show error message to user)
            }
        };

        const changePage = (newPage) => {
            if (newPage >= 1 && newPage <= totalPages.value) {
                currentPage.value = newPage;
                fetchReviews(newPage);
            }
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        onMounted(() => {
            fetchReviews(1);
        });

        return {
            sellerName,
            reviews,
            averageRating,
            totalReviews,
            currentPage,
            totalPages,
            changePage,
            formatDate
        };
    }
};
</script>
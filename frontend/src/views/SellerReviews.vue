<template>
    <div class="bg-gray-100 min-h-screen py-8">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-white">{{ t('sellerReviewsPage.title', { seller: sellerName }) }}</h1>
                            <div class="flex items-center mt-4">
                                <div class="flex items-center">
                                    <Star v-for="star in 5" :key="star"
                                        :class="star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'"
                                        class="w-6 h-6" />
                                </div>
                                <p class="ml-2 text-xl font-semibold text-white">{{ t('sellerReviewsPage.outOfFive', { rating: averageRating.toFixed(1) }) }}</p>
                            </div>
                            <p class="text-indigo-100 mt-1">{{ t('sellerReviewsPage.basedOnReviews', { count: totalReviews }) }}</p>
                        </div>
                        <button
                            @click="goBackToSeller"
                            class="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
                        >
                            <ArrowLeft class="h-4 w-4" />
                            {{ t('sellerReviewsPage.backToStore') }}
                        </button>
                    </div>
                </div>

                <!-- Review List -->
                <div class="p-6">
                    <div v-if="sellerProfile" class="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div class="flex items-center gap-4 min-w-0">
                                <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700 shrink-0">
                                    <img
                                        v-if="sellerProfile.profileImage"
                                        :src="sellerProfile.profileImage"
                                        :alt="sellerProfile.storeName || sellerName"
                                        class="h-16 w-16 rounded-full object-cover"
                                    >
                                    <span v-else>{{ getUserInitials(sellerProfile.storeName || sellerName) }}</span>
                                </div>
                                <div class="min-w-0">
                                    <h2 class="text-lg font-semibold text-gray-900 break-words">
                                        {{ sellerProfile.storeName || sellerName }}
                                    </h2>
                                    <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                                        {{ sellerProfile.storeDescription || t('sellerReviewsPage.noStoreDescription') }}
                                    </p>
                                    <div class="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                        <span>{{ t('sellerReviewsPage.productsCount', { count: sellerProfile.totalProducts || sellerProfile.products?.length || 0 }) }}</span>
                                        <span>{{ t('sellerReviewsPage.memberSince', { date: formatDate(sellerProfile.createdAt) }) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    @click="goBackToSeller"
                                    class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    {{ t('sellerReviewsPage.viewStoreProfile') }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="reviews.length === 0" class="text-center py-8">
                        <p class="text-gray-500 text-xl">{{ t('sellerReviewsPage.noReviewsYet') }}</p>
                    </div>
                    <div v-else class="space-y-6">
                        <div v-for="review in reviews" :key="review._id"
                            class="border-b border-gray-200 pb-6 last:border-b-0">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                                        <img
                                            v-if="review.user?.avatar"
                                            :src="review.user.avatar"
                                            :alt="t('sellerReviewsPage.userAvatar')"
                                            class="h-12 w-12 rounded-full object-cover"
                                        >
                                        <span v-else>{{ getUserInitials(review.user?.username) }}</span>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-lg">{{ review.user?.username || t('sellerReviewsPage.anonymousUser') }}</h3>
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
                                {{ t('sellerReviewsPage.previous') }}
                            </button>
                            <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                                :class="['relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium', currentPage === page ? 'text-indigo-600 border-indigo-500' : 'text-gray-700 hover:bg-gray-50']">
                                {{ page }}
                            </button>
                            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                {{ t('sellerReviewsPage.next') }}
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
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useSellerStore } from '../store/sellerStore';
import { ArrowLeft, Star } from 'lucide-vue-next';

export default {
    name: 'SellerReviews',
    components: { ArrowLeft, Star },
    setup() {
        const { t } = useI18n();
        const route = useRoute();
        const router = useRouter();
        const sellerStore = useSellerStore();
        const sellerId = route.params.sellerId;

        const sellerName = ref('');
        const sellerProfile = ref(null);
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

        const loadSellerProfile = async () => {
            try {
                sellerProfile.value = await sellerStore.fetchSellerProfile(sellerId);
            } catch (error) {
                console.error('Failed to fetch seller profile for reviews page:', error);
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

        const getUserInitials = (username) => {
            if (!username) return '?';
            return username
                .split(' ')
                .map(part => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
        };

        const goBackToSeller = () => {
            router.push({
                name: 'SellerProfile',
                params: { id: sellerId }
            });
        };

        onMounted(() => {
            loadSellerProfile();
            fetchReviews(1);
        });

        return {
            t,
            sellerName,
            sellerProfile,
            reviews,
            averageRating,
            totalReviews,
            currentPage,
            totalPages,
            changePage,
            formatDate,
            getUserInitials,
            goBackToSeller
        };
    }
};
</script>

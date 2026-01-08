<!-- ReviewSection.vue -->
<template>
    <div class="reviews-container">
        <!-- Header Section -->
        <div class="reviews-header">
            <div class="rating-summary">
                <span class="total-reviews">{{ totalReviews }} reviews</span>
                <span class="separator hidden sm:inline">|</span>
                <div class="star-rating">
                    <span class="hidden sm:inline">{{ averageRating }}</span>
                    <span v-for="i in 5" :key="i" class="star">
                        ★
                    </span>
                    <span class="sm:hidden ml-1">{{ averageRating }}</span>
                </div>
            </div>
            <div
                class="verified-badge font-semibold flex items-center gap-1 sm:gap-1.5 bg-[#f6ffed] px-2 sm:px-3 py-1 sm:py-1.5 rounded">
                <ShieldPlus class="w-4 h-4 sm:w-6 sm:h-6 bg-gray-800 verified-badge rounded-l-sm"
                    title="Buyer Review" />
                <p class="text-green-700 text-xs sm:text-sm">
                    <span class="hidden sm:inline">All reviews are from verified purchases</span>
                    <span class="sm:hidden">Verified purchases</span>
                </p>
            </div>
        </div>

        <!-- Review Tabs -->
        <div class="review-tabs">
            <button class="tab-button" :class="{ active: activeTab === 'item' }" @click="activeTab = 'item'">
                <span class="hidden sm:inline">Item reviews ({{ itemReviewsCount }})</span>
                <span class="sm:hidden">Item ({{ itemReviewsCount }})</span>
            </button>
            <button class="tab-button" :class="{ active: activeTab === 'store' }" @click="activeTab = 'store'">
                <span class="hidden sm:inline">Store reviews ({{ storeReviewsCount }})</span>
                <span class="sm:hidden">Store ({{ storeReviewsCount }})</span>
            </button>
        </div>

        <!-- Size Fit Section -->
        <div class="size-fit-section w-full sm:w-2/3" v-if="showSizeFit">
            <div class="fit-row">
                <span class="fit-label">Small</span>
                <div class="fit-bar-container">
                    <div class="fit-bar" :style="{ width: smallPercentage + '%' }"></div>
                </div>
                <span class="fit-percentage">{{ smallPercentage }}%</span>
            </div>
            <div class="fit-row">
                <span class="fit-label">True to size</span>
                <div class="fit-bar-container">
                    <div class="fit-bar" :style="{ width: trueToSizePercentage + '%' }"></div>
                </div>
                <span class="fit-percentage">{{ trueToSizePercentage }}%</span>
            </div>
            <div class="fit-row">
                <span class="fit-label">Large</span>
                <div class="fit-bar-container">
                    <div class="fit-bar" :style="{ width: largePercentage + '%' }"></div>
                </div>
                <span class="fit-percentage">{{ largePercentage }}%</span>
            </div>
        </div>

        <!-- Feature Tags -->
        <div class="feature-tags flex flex-wrap gap-1.5 sm:gap-2 my-3 sm:my-4">
            <span v-for="(count, feature) in featureCounts" :key="feature"
                class="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-full whitespace-nowrap">
                {{ formatFeatureTag(feature) }}({{ count }})
            </span>
        </div>

        <!-- Review List -->
        <div class="review-list">
            <div v-for="(review, index) in displayedReviews" :key="review.id" class="review-item">
                <div class="review-header flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-2">
                    <div class="reviewer-info flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <img :src="review.avatar || getRandomAvatarUrl(review.user?._id || review.id)"
                            class="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-100 flex-shrink-0"
                            alt="reviewer avatar" />
                        <div class="flex flex-col gap-0.5 min-w-0 flex-1 sm:flex-initial">
                            <span class="text-sm sm:text-[15px] font-medium text-gray-900 truncate sm:text-clip">{{
                                review.username }}</span>
                            <span class="text-xs sm:text-sm text-gray-500 truncate sm:text-clip">{{
                                formatDate(review.createdAt) }}</span>
                        </div>
                    </div>
                    <div v-if="review.purchaseCount > 1"
                        class="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#fff3e0] text-[#ff6b00] text-xs font-medium rounded-full border border-[#ffd591] flex-shrink-0 self-start sm:self-center">
                        <span class="hidden sm:inline">Bought {{ review.purchaseCount }} times</span>
                        <span class="sm:hidden">{{ review.purchaseCount }}x buyer</span>
                    </div>
                </div>

                <div class="review-stars my-1 sm:my-1.5">
                    <span v-for="i in 5" :key="i" class="text-sm sm:text-base"
                        :class="i <= review.rating ? 'text-[#ffd700]' : 'text-[#eee]'">
                        ★
                    </span>
                </div>

                <div class="mt-2">
                    <p class="line-clamp-2 text-gray-800 leading-5 sm:leading-6 text-sm sm:text-base"
                        v-if="!isReviewExpanded(review.id)">
                        {{ review.truncatedReview }}
                    </p>
                    <p class="text-gray-800 leading-5 sm:leading-6 text-sm sm:text-base" v-else>
                        {{ review.review }}
                    </p>
                    <button v-if="review.isTruncated" @click="toggleReview(review.id)"
                        class="text-[#40a9ff] text-xs sm:text-sm font-medium hover:underline mt-1">
                        {{ isReviewExpanded(review.id) ? 'Read less' : 'Read more' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- See All Reviews Button -->
        <button v-if="hasMoreReviews" @click="handleSeeAll"
            class="w-full sm:w-1/2 py-2.5 sm:py-3 px-4 mt-4 sm:mt-6 mb-2 mx-auto border border-gray-200 rounded-[20px] text-gray-800 hover:bg-gray-50 text-center font-medium flex items-center justify-center text-sm sm:text-base">
            <span class="hidden sm:inline">See all reviews</span>
            <span class="sm:hidden">See all ({{ totalReviews }})</span>
        </button>
    </div>
</template>

<script>
import {
    ShieldPlus
} from 'lucide-vue-next';

export default {
    name: 'ReviewSection',
    components: { ShieldPlus },
    props: {
        reviews: {
            type: Array,
            required: true
        },
        itemReviewsCount: {
            type: Number,
            default: 0
        },
        storeReviewsCount: {
            type: Number,
            default: 0
        },
        showSizeFit: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            activeTab: 'item',
            smallPercentage: 3,
            trueToSizePercentage: 94,
            largePercentage: 3,
            expandedReviews: new Set(),
            displayCount: 3, // Initial number of reviews to show
            totalCount: 0, // Total number of reviews
            showAllReviews: false, // Toggle for showing all reviews
            featureCounts: {
                'Good Quality': 4,
                'Good': 6,
                'Fast Shipping': 1,
                'Fit Well': 1
            }
        }
    },
    computed: {
        totalReviews() {
            return this.reviews.length
        },
        averageRating() {
            if (this.reviews.length === 0) return 0
            const sum = this.reviews.reduce((acc, review) => acc + (review.rating || 5), 0)
            return (sum / this.reviews.length).toFixed(1)
        },
        processedReviews() {
            return this.reviews.map(review => {
                const reviewText = review.review || review.content;
                const { isTruncated, text } = this.truncateContent(reviewText);

                return {
                    ...review,
                    id: review._id || review.id,
                    username: review.user?.username || review.userName || 'Anonymous',
                    review: reviewText,
                    truncatedReview: text,
                    isTruncated,
                    createdAt: review.createdAt || review.date,
                    rating: review.rating || 5,
                    purchaseCount: review.purchaseCount || 1
                };
            });
        },
        displayedReviews() {
            if (this.showAllReviews) {
                return this.processedReviews;
            }
            return this.processedReviews.slice(0, this.displayCount);
        },

        hasMoreReviews() {
            return !this.showAllReviews && this.processedReviews.length > this.displayCount;
        }
    },
    methods: {
        formatDate(date) {
            if (!date) return 'From abroad';

            try {
                const parsedDate = new Date(date);
                if (isNaN(parsedDate.getTime())) {
                    return 'From abroad';
                }

                return `From abroad on ${parsedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })}`;
            } catch (error) {
                console.error('Date parsing error:', error);
                return 'From abroad';
            }
        },
        formatFeatureTag(feature) {
            return feature.replace(/([A-Z])/g, ' $1').trim()
        },
        handleSeeAll() {
            this.showAllReviews = true;
        },
        getRandomAvatarUrl(userId) {
            const seed = `${userId}-${userId?.slice(-6) || Math.random().toString(36).substring(7)}`;
            return `https://api.dicebear.com/6.x/identicon/svg?seed=${seed}`;
        },
        truncateContent(text, lines = 2) {
            const words = text.split(' ');
            const truncated = words.slice(0, 30).join(' '); // Approximate 2 lines
            return {
                isTruncated: words.length > 30,
                text: truncated + (words.length > 30 ? '...' : '')
            };
        },
        isReviewExpanded(reviewId) {
            return this.expandedReviews.has(reviewId);
        },
        toggleReview(reviewId) {
            if (this.expandedReviews.has(reviewId)) {
                this.expandedReviews.delete(reviewId);
            } else {
                this.expandedReviews.add(reviewId);
            }
            this.expandedReviews = new Set(this.expandedReviews); // Trigger reactivity
        }
    }
}
</script>

<style scoped>
.reviews-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    padding: 0.75rem;
}

/* Mobile-first responsive adjustments */
@media (min-width: 640px) {
    .reviews-container {
        padding: 1rem;
    }
}

.reviews-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

/* Desktop layout for header */
@media (min-width: 640px) {
    .reviews-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
}

.rating-summary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
}

.total-reviews {
    font-weight: 600;
    font-size: 0.875rem;
}

@media (min-width: 640px) {
    .total-reviews {
        font-size: 1rem;
    }
}

.separator {
    color: #666;
}

.star-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.star-rating .star {
    color: #ffd700;
    font-size: 1rem;
}

@media (min-width: 640px) {
    .star-rating .star {
        font-size: 1.2rem;
    }
}

.verified-badge {
    display: flex;
    align-items: center;
    align-self: flex-start;
}

@media (min-width: 640px) {
    .verified-badge {
        align-self: center;
    }
}

.review-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

@media (min-width: 640px) {
    .review-tabs {
        gap: 1rem;
        overflow-x: visible;
    }
}

.tab-button {
    padding: 0.5rem 0.75rem;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 500;
    color: #666;
    white-space: nowrap;
    font-size: 0.875rem;
    flex-shrink: 0;
}

@media (min-width: 640px) {
    .tab-button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
    }
}

.tab-button.active {
    color: #000;
    border-bottom: 2px solid #000;
}

.size-fit-section {
    margin: 1rem 0;
}

@media (min-width: 640px) {
    .size-fit-section {
        margin: 1.5rem 0;
    }
}

.fit-row {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    gap: 0.5rem;
}

@media (min-width: 640px) {
    .fit-row {
        gap: 1rem;
    }
}

.fit-label {
    width: 80px;
    font-size: 0.875rem;
    flex-shrink: 0;
}

@media (min-width: 640px) {
    .fit-label {
        width: 100px;
        font-size: 1rem;
    }
}

.fit-bar-container {
    flex-grow: 1;
    height: 3px;
    background: #eee;
    border-radius: 2px;
}

@media (min-width: 640px) {
    .fit-bar-container {
        height: 4px;
    }
}

.fit-bar {
    height: 100%;
    background: #000;
    border-radius: 2px;
}

.fit-percentage {
    width: 40px;
    text-align: right;
    font-size: 0.875rem;
    flex-shrink: 0;
}

@media (min-width: 640px) {
    .fit-percentage {
        width: 50px;
        font-size: 1rem;
    }
}

.feature-tags {
    margin: 0.75rem 0;
    /* Hide horizontal scrollbar but allow scrolling */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.feature-tags::-webkit-scrollbar {
    display: none;
}

@media (min-width: 640px) {
    .feature-tags {
        margin: 1rem 0;
        overflow-x: visible;
    }
}

.review-list {
    margin: 1rem 0;
}

@media (min-width: 640px) {
    .review-list {
        margin: 1.5rem 0;
    }
}

.review-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid #eee;
}

@media (min-width: 640px) {
    .review-item {
        padding: 1rem 0;
    }
}

.reviewer-info {
    min-width: 0;
    /* Allows flex items to shrink below their content size */
}

.review-stars {
    margin: 0.375rem 0;
}

@media (min-width: 640px) {
    .review-stars {
        margin: 0.5rem 0;
    }
}

.star {
    color: #ddd;
    font-size: 1rem;
}

@media (min-width: 640px) {
    .star {
        font-size: 1.1rem;
    }
}

.star.filled {
    color: #ffd700;
}

.review-content {
    margin: 0.5rem 0;
    line-height: 1.5;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.see-all-button {
    display: block;
    padding: 0.75rem 1rem;
    margin: 1rem 0;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background: none;
    cursor: pointer;
    font-weight: 500;
    text-align: center;
    font-size: 0.875rem;
}

@media (min-width: 640px) {
    .see-all-button {
        padding: 1rem;
        font-size: 1rem;
    }
}

.see-all-button:hover {
    background: #f5f5f5;
}

/* Utility classes for responsive text truncation */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (min-width: 640px) {
    .sm\\:text-clip {
        white-space: normal;
        text-overflow: clip;
    }
}

/* Touch-friendly tap targets on mobile */
@media (max-width: 639px) {
    .tab-button {
        min-height: 44px;
        display: flex;
        align-items: center;
    }

    button {
        min-height: 44px;
    }
}
</style>
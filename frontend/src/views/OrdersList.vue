<template>
    <div class="mx-auto px-2 sm:px-4 lg:px-0">
        <!-- Analytics Dashboard -->
        <OrderAnalytics :orders="orders" class="mb-4 sm:mb-6" />

        <!-- Enhanced Statistics Cards -->
        <div class="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-5">
            <div
                class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-amber-100 text-xs sm:text-sm font-medium">Total Orders</p>
                        <p class="text-lg sm:text-2xl font-bold">{{ statistics.totalOrders }}</p>
                    </div>
                    <div
                        class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <ShoppingBag class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                </div>
                <p class="text-xs text-amber-100 mt-1 sm:mt-2 hidden sm:block">From {{ statistics.firstOrderDate }}</p>
            </div>

            <div
                class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100 text-xs sm:text-sm font-medium">Total Spent</p>
                        <p class="text-lg sm:text-2xl font-bold">₦{{ formatAmount(statistics.totalSpent) }}</p>
                    </div>
                    <div
                        class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Wallet class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                </div>
                <p class="text-xs text-green-100 mt-1 sm:mt-2 hidden sm:block">Lifetime spending</p>
            </div>

            <div
                class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-blue-100 text-xs sm:text-sm font-medium">Average Order</p>
                        <p class="text-lg sm:text-2xl font-bold">₦{{ formatAmount(statistics.averageOrder) }}</p>
                    </div>
                    <div
                        class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Calculator class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                </div>
                <p class="text-xs text-blue-100 mt-1 sm:mt-2 hidden sm:block">Per order average</p>
            </div>

            <div
                class="bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 col-span-2 lg:col-span-1">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-purple-100 text-xs sm:text-sm font-medium">Active Orders</p>
                        <p class="text-lg sm:text-2xl font-bold">{{ statistics.activeOrders }}</p>
                    </div>
                    <div
                        class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <PackageCheck class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                </div>
                <p class="text-xs text-purple-100 mt-1 sm:mt-2 hidden sm:block">In progress</p>
            </div>
        </div>

        <!-- Modern Filters Section -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6 hover:shadow-xl transition-all duration-300">
            <!-- Header -->
            <div class="flex items-center gap-3 mb-4 sm:mb-6">
                <div
                    class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-slate-700 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Search class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                    <h3 class="text-base sm:text-lg font-bold text-gray-900">Filter & Search</h3>
                    <p class="text-xs sm:text-sm text-gray-600">Find and organize your orders</p>
                </div>
            </div>

            <!-- Mobile-First Filter Layout -->
            <div class="space-y-4">
                <!-- Search - Full width on mobile -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Search Orders</label>
                    <div class="relative">
                        <input v-model="filters.search" type="text" placeholder="Search by Order ID or product name"
                            class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white text-sm sm:text-base" />
                        <Search
                            class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

                <!-- Status and Date Range - 2 columns on mobile, maintain on larger screens -->
                <div class="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
                    <!-- Status Filter -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <div class="relative">
                            <select v-model="filters.status"
                                class="appearance-none w-full bg-gray-50 hover:bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-xs sm:text-sm">
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <div
                                class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <!-- Date Range -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
                        <div class="relative">
                            <select v-model="filters.dateRange"
                                class="appearance-none w-full bg-gray-50 hover:bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-xs sm:text-sm">
                                <option value="all">All Time</option>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 3 Months</option>
                                <option value="180">Last 6 Months</option>
                                <option value="365">Last Year</option>
                            </select>
                            <div
                                class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <!-- Sort and Reset - Combined on mobile -->
                    <div class="col-span-2 lg:col-span-1">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                        <div class="flex gap-2">
                            <div class="relative flex-1">
                                <select v-model="filters.sort"
                                    class="appearance-none w-full bg-gray-50 hover:bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-xs sm:text-sm">
                                    <option value="date-desc">Newest First</option>
                                    <option value="date-asc">Oldest First</option>
                                    <option value="amount-desc">Amount: High to Low</option>
                                    <option value="amount-asc">Amount: Low to High</option>
                                </select>
                                <div
                                    class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDown class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                </div>
                            </div>

                            <!-- Reset Filters -->
                            <button @click="resetFilters"
                                class="px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-lg sm:rounded-xl hover:from-gray-600 hover:to-slate-700 transition-all duration-200 transform hover:scale-105 shadow-sm">
                                <RefreshCw class="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Summary -->
            <div
                class="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl border border-gray-200">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span class="text-xs sm:text-sm font-medium text-gray-700">
                            Showing {{ paginatedOrders.length }} of {{ filteredOrders.length }} orders
                        </span>
                    </div>
                    <div v-if="filters.search || filters.status !== 'all' || filters.dateRange !== 'all'"
                        class="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium self-start sm:self-auto">
                        Filtered
                    </div>
                </div>
            </div>
        </div>

        <!-- Orders List with Enhanced Loading States -->
        <div v-if="isLoading"
            class="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
            <div class="relative">
                <div
                    class="animate-spin h-10 w-10 sm:h-12 sm:w-12 border-3 border-blue-500 rounded-full border-t-transparent">
                </div>
                <div
                    class="absolute inset-0 animate-ping h-10 w-10 sm:h-12 sm:w-12 border-2 border-blue-300 rounded-full opacity-75">
                </div>
            </div>
            <p class="mt-4 text-base sm:text-lg font-medium text-gray-700">Loading your orders...</p>
            <p class="text-xs sm:text-sm text-gray-500">Please wait while we fetch your order history</p>
        </div>

        <div v-else-if="error"
            class="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border-2 border-red-200">
            <div
                class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-red-800 mb-2">Something went wrong</h3>
            <p class="text-sm sm:text-base text-red-700">{{ error }}</p>
            <button @click="loadOrders"
                class="mt-4 px-4 sm:px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all text-sm sm:text-base">
                Try Again
            </button>
        </div>

        <div v-else-if="!filteredOrders.length"
            class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border-2 border-gray-200">
            <div
                class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingBag class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-3">No orders found</h3>
            <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{{ filters.search || filters.status !== 'all' ||
                filters.dateRange !== 'all'
                ? 'Try adjusting your filters to see more results'
                : 'You haven\'t placed any orders yet. Start shopping to see your orders here!' }}</p>
            <div class="flex flex-col sm:flex-row justify-center gap-3">
                <button v-if="filters.search || filters.status !== 'all' || filters.dateRange !== 'all'"
                    @click="resetFilters"
                    class="px-4 sm:px-6 py-2 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-lg hover:from-gray-600 hover:to-slate-700 transition-all text-sm sm:text-base">
                    Clear Filters
                </button>
                <button
                    class="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-sm sm:text-base">
                    Start Shopping
                </button>
            </div>
        </div>

        <div v-else class="space-y-2 sm:space-y-3">
            <ProfileOrderCard v-for="order in paginatedOrders" :key="order._id" :order="order"
                @order-updated="loadOrders" />

            <!-- Enhanced Mobile-Responsive Pagination -->
            <div v-if="totalPages > 1"
                class="bg-white rounded-t-xl sm:rounded-t-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div class="flex flex-col gap-4">
                    <!-- Mobile-first pagination info -->
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <span class="font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span>{{ filteredOrders.length }} total orders</span>
                        </div>
                    </div>

                    <!-- Mobile-optimized navigation -->
                    <nav class="flex items-center justify-between sm:justify-center gap-2">
                        <!-- Previous Button -->
                        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                            class="flex items-center px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 font-medium transition-all text-xs sm:text-sm"
                            :class="currentPage === 1
                                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'">
                            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7"></path>
                            </svg>
                            <span class="hidden sm:inline">Previous</span>
                        </button>

                        <!-- Page Numbers - Mobile optimized -->
                        <div class="flex items-center gap-1">
                            <!-- Show fewer pages on mobile -->
                            <template v-for="page in getVisiblePagesMobile()" :key="page">
                                <button v-if="page !== '...'" @click="currentPage = page"
                                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm"
                                    :class="page === currentPage
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'">
                                    {{ page }}
                                </button>
                                <span v-else class="px-1 text-gray-400 text-xs sm:text-sm">...</span>
                            </template>
                        </div>

                        <!-- Next Button -->
                        <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                            :disabled="currentPage === totalPages"
                            class="flex items-center px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 font-medium transition-all text-xs sm:text-sm"
                            :class="currentPage === totalPages
                                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'">
                            <span class="hidden sm:inline">Next</span>
                            <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
                                </path>
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useOrderStore } from '../store/orderStore';
import ProfileOrderCard from './ProfileOrderCard.vue';
import OrderAnalytics from './OrderAnalytics.vue';

import { Search, RefreshCw, ShoppingBag, Wallet, Calculator, PackageCheck, ChevronDown } from 'lucide-vue-next';

export default {
    name: 'OrdersList',
    components: {
        ProfileOrderCard,
        Search,
        RefreshCw,
        ShoppingBag,
        Wallet,
        Calculator,
        PackageCheck,
        ChevronDown,
        OrderAnalytics,
    },
    setup() {
        const orderStore = useOrderStore();
        const orders = ref([]);
        const isLoading = ref(true);
        const error = ref(null);

        // Filters
        const filters = ref({
            search: '',
            status: 'all',
            dateRange: 'all',
            sort: 'date-desc'
        });

        // Pagination
        const currentPage = ref(1);
        const itemsPerPage = ref(10);

        // Statistics
        const statistics = computed(() => {
            const activeStatuses = ['pending', 'processing', 'shipped'];
            const activeOrders = orders.value.filter(order =>
                activeStatuses.includes(order.status.toLowerCase())
            ).length;

            const totalSpent = orders.value.reduce((sum, order) => sum + order.totalAmount, 0);
            const averageOrder = orders.value.length ? totalSpent / orders.value.length : 0;

            const dates = orders.value.map(order => new Date(order.createdAt));
            const firstOrderDate = dates.length ?
                new Date(Math.min(...dates)).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                }) : 'N/A';

            return {
                totalOrders: orders.value.length,
                totalSpent,
                averageOrder,
                activeOrders,
                firstOrderDate
            };
        });

        // Filtered and sorted orders
        const filteredOrders = computed(() => {
            let result = [...orders.value];

            // Search filter
            if (filters.value.search) {
                const searchTerm = filters.value.search.toLowerCase();
                result = result.filter(order =>
                    order.orderId.toLowerCase().includes(searchTerm) ||
                    order.products.some(product =>
                        product.product?.name?.toLowerCase().includes(searchTerm)
                    )
                );
            }

            // Status filter
            if (filters.value.status !== 'all') {
                result = result.filter(order =>
                    order.status.toLowerCase() === filters.value.status
                );
            }

            // Date range filter
            if (filters.value.dateRange !== 'all') {
                const days = parseInt(filters.value.dateRange);
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);
                result = result.filter(order => new Date(order.createdAt) >= cutoff);
            }

            // Sorting
            result.sort((a, b) => {
                switch (filters.value.sort) {
                    case 'date-asc':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'date-desc':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'amount-asc':
                        return a.totalAmount - b.totalAmount;
                    case 'amount-desc':
                        return b.totalAmount - a.totalAmount;
                    default:
                        return 0;
                }
            });

            return result;
        });

        // Paginated orders
        const paginatedOrders = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return filteredOrders.value.slice(start, end);
        });

        const totalPages = computed(() =>
            Math.ceil(filteredOrders.value.length / itemsPerPage.value)
        );

        // Enhanced pagination with visible page numbers
        const getVisiblePages = () => {
            const total = totalPages.value;
            const current = currentPage.value;
            const pages = [];

            if (total <= 7) {
                // Show all pages if 7 or fewer
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                // Always show first page
                pages.push(1);

                if (current > 4) {
                    pages.push('...');
                }

                // Show pages around current page
                const start = Math.max(2, current - 1);
                const end = Math.min(total - 1, current + 1);

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                if (current < total - 3) {
                    pages.push('...');
                }

                // Always show last page
                if (total > 1) {
                    pages.push(total);
                }
            }

            return pages;
        };

        // Mobile-optimized pagination - shows fewer pages
        const getVisiblePagesMobile = () => {
            const total = totalPages.value;
            const current = currentPage.value;
            const pages = [];

            if (total <= 5) {
                // Show all pages if 5 or fewer
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                // Always show first page
                pages.push(1);

                if (current > 3) {
                    pages.push('...');
                }

                // Show current page and neighbors
                const start = Math.max(2, current - 1);
                const end = Math.min(total - 1, current + 1);

                for (let i = start; i <= end; i++) {
                    if (i !== 1 && i !== total) {
                        pages.push(i);
                    }
                }

                if (current < total - 2) {
                    pages.push('...');
                }

                // Always show last page
                if (total > 1) {
                    pages.push(total);
                }
            }

            return pages;
        };

        // Methods
        const loadOrders = async () => {
            try {
                isLoading.value = true;
                error.value = null;
                const response = await orderStore.fetchUserOrders();
                orders.value = Array.isArray(response) ? response : response?.orders || [];
            } catch (err) {
                console.error('Error loading orders:', err);
                error.value = 'Failed to load orders. Please try again.';
            } finally {
                isLoading.value = false;
            }
        };

        const resetFilters = () => {
            filters.value = {
                search: '',
                status: 'all',
                dateRange: 'all',
                sort: 'date-desc'
            };
            currentPage.value = 1;
        };

        const formatAmount = (amount) => {
            return amount.toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        // Watch for filter changes to reset pagination
        watch([filters], () => {
            currentPage.value = 1;
        }, { deep: true });

        // Initial load
        onMounted(loadOrders);

        return {
            orders,
            isLoading,
            error,
            filters,
            statistics,
            currentPage,
            totalPages,
            filteredOrders,
            paginatedOrders,
            loadOrders,
            resetFilters,
            formatAmount,
            getVisiblePages,
            getVisiblePagesMobile
        };
    }
};
</script>

<style scoped>
/* Mobile-first responsive design */

/* Base mobile styles */
@media (max-width: 640px) {

    /* Disable hover effects on mobile for better performance */
    .transform {
        transform: none !important;
    }

    .hover\:scale-105:hover {
        transform: none !important;
    }

    /* Ensure text doesn't get too small on mobile */
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    /* Better touch targets */
    button,
    select,
    input {
        min-height: 44px;
    }

    /* Prevent horizontal scrolling */
    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
    }
}

/* Tablet styles */
@media (min-width: 641px) and (max-width: 1024px) {

    /* Re-enable some hover effects for tablets */
    .hover\:scale-105:hover {
        transform: scale(1.02) !important;
    }
}

/* Desktop styles */
@media (min-width: 1025px) {

    /* Full hover effects for desktop */
    .hover\:scale-105:hover {
        transform: scale(1.05) !important;
    }
}

/* Enhanced focus states for accessibility */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for better mobile experience */
::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Improve button spacing on mobile */
@media (max-width: 640px) {
    .space-y-2> :not([hidden])~ :not([hidden]) {
        margin-top: 0.5rem;
    }

    /* Better grid gaps on mobile */
    .gap-2 {
        gap: 0.5rem;
    }

    /* Ensure adequate padding on containers */
    .p-3 {
        padding: 0.75rem;
    }

    .p-4 {
        padding: 1rem;
    }
}

/* Loading animation improvements */
@keyframes spin {
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

.animate-spin {
    animation: spin 1s linear infinite;
}

.animate-ping {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Gradient text support */
.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Shadow utilities */
.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Form input improvements */
input:focus,
select:focus {
    outline: none;
}

/* Better select dropdown styling */
select {
    background-image: none;
}

/* Ensure proper spacing for mobile layouts */
@media (max-width: 640px) {
    .space-y-4> :not([hidden])~ :not([hidden]) {
        margin-top: 1rem;
    }

    .mb-4 {
        margin-bottom: 1rem;
    }

    .mb-6 {
        margin-bottom: 1rem;
    }

    .mt-4 {
        margin-top: 1rem;
    }

    .mt-6 {
        margin-top: 1rem;
    }
}

/* Responsive grid improvements */
@media (max-width: 640px) {
    .grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .col-span-2 {
        grid-column: span 2 / span 2;
    }
}

/* Better touch targets for mobile */
@media (max-width: 640px) {

    button,
    select,
    input[type="text"] {
        min-height: 44px;
        padding: 0.75rem;
    }

    /* Ensure buttons have adequate spacing */
    button {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
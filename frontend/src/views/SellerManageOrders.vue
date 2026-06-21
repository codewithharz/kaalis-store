<!-- frontend/src/views/ManageOrders.vue -->
<template>
    <div class="min-h-screen bg-slate-50/50 py-6 sm:py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- Header with Back Button and Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <button @click="router.back()"
                    class="flex items-center text-slate-600 hover:text-[#ff934b] hover:bg-[#ff934b]/5 px-3 py-2 rounded-xl transition-all duration-200 w-fit active:scale-95"
                >
                    <ArrowLeft class="w-4 h-4 mr-2" />
                    <span class="text-sm font-bold">{{ t('sellerManageOrdersPage.backToDashboard') }}</span>
                </button>
                
                <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <!-- Order Status Filter -->
                    <div class="relative">
                        <select v-model="statusFilter"
                            class="appearance-none w-full sm:w-48 bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all cursor-pointer shadow-sm hover:bg-slate-50/50"
                        >
                            <option value="all">{{ t('sellerManageOrdersPage.allOrders') }}</option>
                            <option v-for="status in availableStatuses" :key="status" :value="status.toLowerCase()">
                                {{ translateStatus(status) }}
                            </option>
                        </select>
                        <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown class="w-4 h-4" />
                        </div>
                    </div>

                    <!-- Date Range Filter -->
                    <div class="relative">
                        <select v-model="dateRange"
                            class="appearance-none w-full sm:w-40 bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all cursor-pointer shadow-sm hover:bg-slate-50/50"
                        >
                            <option value="today">{{ t('sellerManageOrdersPage.dateRanges.today') }}</option>
                            <option value="week">{{ t('sellerManageOrdersPage.dateRanges.thisWeek') }}</option>
                            <option value="month">{{ t('sellerManageOrdersPage.dateRanges.thisMonth') }}</option>
                            <option value="year">{{ t('sellerManageOrdersPage.dateRanges.thisYear') }}</option>
                        </select>
                        <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown class="w-4 h-4" />
                        </div>
                    </div>

                    <!-- Refresh Button -->
                    <button @click="refreshOrders"
                        class="flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 hover:border-[#ff934b]/30 rounded-xl text-slate-600 hover:text-[#ff934b] hover:bg-[#ff934b]/5 shadow-sm transition-all duration-200 active:scale-95"
                    >
                        <RefreshCcw class="w-4 h-4 mr-2" />
                        <span class="text-sm font-bold">{{ t('sellerManageOrdersPage.refresh') }}</span>
                    </button>
                </div>
            </div>

            <!-- Orders Overview Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div v-for="stat in orderStats" :key="stat.title"
                    class="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between"
                >
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-slate-500 text-xs sm:text-sm font-bold tracking-wide uppercase">{{ stat.title }}</span>
                        <div class="p-2.5 bg-[#ff934b]/10 text-[#ff934b] group-hover:bg-gradient-to-r group-hover:from-[#ff934b] group-hover:to-[#ff5e62] group-hover:text-white rounded-xl transition-all duration-300 shadow-sm">
                            <component :is="getStatIconComponent(stat.icon)" class="w-4.5 h-4.5" />
                        </div>
                    </div>
                    <div class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{{ stat.value }}</div>
                </div>
            </div>

            <!-- Orders Table Container -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                
                <!-- Table Header with Search -->
                <div class="p-5 border-b border-slate-50 bg-slate-50/30">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-2.5">
                            <h2 class="text-lg font-black text-slate-800 tracking-tight">{{ t('sellerManageOrdersPage.orders') }}</h2>
                            <span class="px-2 py-0.5 bg-[#ff934b]/10 text-[#ff934b] text-[10px] font-bold rounded-lg">{{ totalOrders }} total</span>
                        </div>
                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-white transition-all duration-300">
                            <input type="text" v-model="searchQuery" :placeholder="t('sellerManageOrdersPage.searchOrders')"
                                class="w-full sm:w-64 pl-11 pr-4 py-2.5 text-xs font-bold text-slate-700 bg-transparent border-none focus:outline-none"
                            />
                            <Search class="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>
                </div>

                <!-- Table Content -->
                <div class="overflow-x-auto">

                    <!-- Loading State -->
                    <div v-if="isLoading" class="p-16 text-center">
                        <div class="animate-spin h-8 w-8 border-b-2 border-[#ff934b] rounded-full mx-auto mb-3"></div>
                        <p class="text-sm font-semibold text-slate-500">{{ t('sellerManageOrdersPage.loadingOrders') }}</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="p-16 text-center text-rose-500 font-semibold">
                        {{ error }}
                        <button @click="refreshOrders" class="text-blue-600 hover:text-blue-800 underline ml-2">{{ t('sellerManageOrdersPage.tryAgain') }}</button>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!filteredOrders.length" class="p-16 text-center text-slate-400 font-semibold">
                        {{ t('sellerManageOrdersPage.noOrdersFound') }}
                    </div>

                    <table v-else class="min-w-full divide-y divide-slate-100">
                        <thead class="bg-slate-50/50">
                            <tr class="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th @click="toggleSort('rowNumber')"
                                    class="px-6 py-4 text-left cursor-pointer hover:bg-slate-100/60 transition-colors"
                                >
                                    <div class="flex items-center gap-1.5">
                                        <span>{{ t('sellerManageOrdersPage.columns.number') }}</span>
                                    </div>
                                </th>
                                <th class="px-6 py-4 text-left">
                                    <div class="flex items-center gap-1">
                                        <span>{{ t('sellerManageOrdersPage.columns.orderId') }}</span>
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="id" />
                                    </div>
                                </th>
                                <th @click="toggleSort('customer')"
                                    class="px-6 py-4 text-left cursor-pointer hover:bg-slate-100/60 transition-colors"
                                >
                                    <div class="flex items-center gap-1">
                                        <span>{{ t('sellerManageOrdersPage.columns.customer') }}</span>
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="customer" />
                                    </div>
                                </th>
                                <th @click="toggleSort('date')"
                                    class="px-6 py-4 text-left cursor-pointer hover:bg-slate-100/60 transition-colors"
                                >
                                    <div class="flex items-center gap-1">
                                        <span>{{ t('sellerManageOrdersPage.columns.date') }}</span>
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="date" />
                                    </div>
                                </th>
                                <th @click="toggleSort('status')"
                                    class="px-6 py-4 text-left cursor-pointer hover:bg-slate-100/60 transition-colors"
                                >
                                    <div class="flex items-center gap-1">
                                        <span>{{ t('sellerManageOrdersPage.columns.status') }}</span>
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="status" />
                                    </div>
                                </th>
                                <th @click="toggleSort('total')"
                                    class="px-6 py-4 text-left cursor-pointer hover:bg-slate-100/60 transition-colors"
                                >
                                    <div class="flex items-center gap-1">
                                        <span>{{ t('sellerManageOrdersPage.columns.total') }}</span>
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="total" />
                                    </div>
                                </th>
                                <th class="px-6 py-4 text-right">
                                    {{ t('sellerManageOrdersPage.columns.actions') }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-slate-100 text-xs font-bold text-slate-700">
                            <tr v-for="(order, index) in paginatedOrders" :key="`${order.id}-${index}`"
                                class="hover:bg-slate-50/50 transition-colors"
                            >
                                <td class="px-6 py-4 whitespace-nowrap text-slate-400 font-semibold">
                                    {{ getRowNumber(index) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-slate-800 font-extrabold select-all">{{ order.id }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-slate-800 font-bold">{{ order.customer.name }}</div>
                                    <div class="text-slate-400 text-[10px] font-semibold">{{ order.customer.email }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-slate-500 font-semibold">{{ formatDate(order.date) }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="[
                                        'px-3 py-1 text-[10px] font-black rounded-full border select-none',
                                        getStatusBadgeClass(order.status)
                                    ]">
                                        {{ translateStatus(order.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-slate-800 font-black">₦{{ formatAmount(order.total) }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                                    <button @click="viewOrder(order.id)"
                                        class="text-[#ff934b] hover:text-[#ff5e62] transition-colors font-bold active:scale-95"
                                    >
                                        {{ t('sellerManageOrdersPage.view') }}
                                    </button>
                                    <button @click="updateStatus(order.id, order.status)"
                                        class="text-slate-800 hover:text-[#ff934b] transition-colors font-bold active:scale-95"
                                    >
                                        {{ t('sellerManageOrdersPage.update') }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="flex items-center justify-between px-4 py-4 border-t border-slate-100 sm:px-6">
                    <!-- Mobile view -->
                    <div class="flex-1 flex justify-between sm:hidden">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-4 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            {{ t('sellerManageOrdersPage.previous') }}
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            {{ t('sellerManageOrdersPage.next') }}
                        </button>
                    </div>

                    <!-- Desktop view -->
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between gap-4">
                        <!-- Items per page selector -->
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-450">{{ t('sellerManageOrdersPage.show') }}</span>
                            <div class="relative">
                                <select v-model="itemsPerPage"
                                    class="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#ff934b] cursor-pointer"
                                    @change="handleItemsPerPageChange"
                                >
                                    <option v-for="size in pageSizes" :key="size" :value="size">
                                        {{ size }}
                                    </option>
                                </select>
                                <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                            <span class="text-xs font-bold text-slate-450">{{ t('sellerManageOrdersPage.entries') }}</span>
                        </div>

                        <!-- Pagination info & controls -->
                        <div class="flex items-center gap-6">
                            <p class="text-xs font-bold text-slate-500">
                                {{ t('sellerManageOrdersPage.showing') }}
                                <span class="font-black text-slate-800">{{ paginationStart }}</span>
                                {{ t('sellerManageOrdersPage.to') }}
                                <span class="font-black text-slate-800">{{ paginationEnd }}</span>
                                {{ t('sellerManageOrdersPage.of') }}
                                <span class="font-black text-slate-800">{{ totalOrders }}</span>
                                {{ t('sellerManageOrdersPage.results') }}
                            </p>

                            <!-- Page navigation -->
                            <nav class="relative z-0 inline-flex rounded-xl shadow-sm gap-1">
                                <!-- First page -->
                                <button @click="goToPage(1)" :disabled="currentPage === 1"
                                    class="relative inline-flex items-center px-2 py-2 rounded-xl border border-slate-200/80 bg-white text-slate-500 hover:text-[#ff934b] hover:border-[#ff934b]/30 hover:bg-[#ff934b]/5 disabled:text-slate-350 disabled:border-slate-100 disabled:bg-white active:scale-95 transition-all"
                                >
                                    <span class="sr-only">{{ t('sellerManageOrdersPage.first') }}</span>
                                    <ChevronsLeft class="h-4.5 w-4.5" />
                                </button>

                                <!-- Previous page -->
                                <button @click="prevPage" :disabled="currentPage === 1"
                                    class="relative inline-flex items-center px-2 py-2 rounded-xl border border-slate-200/80 bg-white text-slate-500 hover:text-[#ff934b] hover:border-[#ff934b]/30 hover:bg-[#ff934b]/5 disabled:text-slate-350 disabled:border-slate-100 disabled:bg-white active:scale-95 transition-all"
                                >
                                    <span class="sr-only">{{ t('sellerManageOrdersPage.previous') }}</span>
                                    <ChevronLeft class="h-4.5 w-4.5" />
                                </button>

                                <!-- Page numbers -->
                                <template v-for="pageNum in displayedPages" :key="pageNum">
                                    <button v-if="pageNum !== '...'" @click="goToPage(pageNum)"
                                        class="relative inline-flex items-center w-8.5 h-8.5 justify-center rounded-xl border font-bold text-xs transition-all duration-200 active:scale-95"
                                        :class="[
                                            currentPage === pageNum
                                                ? 'bg-gradient-to-r from-[#ff934b] to-[#ff5e62] border-transparent text-white shadow-sm'
                                                : 'bg-white border-slate-200/80 text-slate-550 hover:bg-[#ff934b]/5 hover:text-[#ff934b] hover:border-[#ff934b]/30'
                                        ]"
                                    >
                                        {{ pageNum }}
                                    </button>
                                    <span v-else
                                        class="relative inline-flex items-center px-2.5 text-slate-350 text-xs font-bold"
                                    >
                                        ...
                                    </span>
                                </template>

                                <!-- Next page -->
                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="relative inline-flex items-center px-2 py-2 rounded-xl border border-slate-200/80 bg-white text-slate-500 hover:text-[#ff934b] hover:border-[#ff934b]/30 hover:bg-[#ff934b]/5 disabled:text-slate-350 disabled:border-slate-100 disabled:bg-white active:scale-95 transition-all"
                                >
                                    <span class="sr-only">{{ t('sellerManageOrdersPage.next') }}</span>
                                    <ChevronRight class="h-4.5 w-4.5" />
                                </button>

                                <!-- Last page -->
                                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                                    class="relative inline-flex items-center px-2 py-2 rounded-xl border border-slate-200/80 bg-white text-slate-500 hover:text-[#ff934b] hover:border-[#ff934b]/30 hover:bg-[#ff934b]/5 disabled:text-slate-350 disabled:border-slate-100 disabled:bg-white active:scale-95 transition-all"
                                >
                                    <span class="sr-only">{{ t('sellerManageOrdersPage.last') }}</span>
                                    <ChevronsRight class="h-4.5 w-4.5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-3 shadow-2xl">
                <div class="animate-spin h-5 w-5 border-2 border-[#ff934b] border-t-transparent rounded-full"></div>
                <span class="text-slate-700 font-bold text-sm">{{ t('sellerManageOrdersPage.loading') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import SortIcon from './SortIcon.vue';
import {
    ArrowLeft,
    RefreshCcw,
    Search,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Clock,
    Truck,
    Ban,
    ChevronsRight,
    ChevronsLeft,
    Package,
    ChevronDown
} from 'lucide-vue-next';
import { useSellerStore } from '../store/sellerStore';
import { toast } from 'vue-sonner';

export default {
    components: {
        ArrowLeft,
        RefreshCcw,
        Search,
        ChevronLeft,
        ChevronRight,
        ShoppingBag,
        Clock,
        Truck,
        Ban,
        ChevronsRight,
        ChevronsLeft,
        Package,
        SortIcon,
        ChevronDown
    },

    setup() {
        const { t, locale } = useI18n();
        const router = useRouter();
        const sellerStore = useSellerStore();
        const isLoading = ref(true);
        const statusFilter = ref('all');
        const dateRange = ref('year');
        const searchQuery = ref('');
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const pageSizes = [10, 15, 25, 50, 100, 150];

        const availableStatuses = ref([]);
        const error = ref(null);

        // Sorting state
        const sortKey = ref('date');
        const sortOrder = ref('desc');

        const toggleSort = (key) => {
            if (sortKey.value === key) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortKey.value = key;
                sortOrder.value = 'asc';
            }
        };

        const orders = ref([]);
        const orderStats = ref([
            { title: t('sellerManageOrdersPage.stats.totalOrders'), value: '0', icon: 'ShoppingBag' },
            { title: t('sellerManageOrdersPage.statuses.pending'), value: '0', icon: 'Clock' },
            { title: t('sellerManageOrdersPage.statuses.shipped'), value: '0', icon: 'Truck' },
            { title: t('sellerManageOrdersPage.statuses.cancelled'), value: '0', icon: 'Ban' }
        ]);

        const loadOrdersData = async () => {
            try {
                isLoading.value = true;
                error.value = null;

                const response = await sellerStore.fetchAllSellerOrders();

                if (!response || (!Array.isArray(response) && !Array.isArray(response.data))) {
                    console.error('Invalid API response:', response);
                    error.value = t('sellerManageOrdersPage.toasts.invalidApiResponse');
                    return;
                }

                const ordersData = Array.isArray(response) ? response : response.data;

                orders.value = ordersData.filter(order => order && order._id).map(order => ({
                    id: order.orderNumber,
                    _id: order._id,
                    orderId: order.orderId,
                    customer: {
                        name: order.user?.username || order.user?.name || order.customerName || t('sellerManageOrdersPage.notAvailable'),
                        email: order.user?.email || order.customerEmail || t('sellerManageOrdersPage.notAvailable')
                    },
                    date: order.createdAt || order.date,
                    status: order.status || 'Pending',
                    total: order.totalAmount || order.total || 0,
                    products: Array.isArray(order.products) ? order.products.map(prod => ({
                        id: prod.product?._id || prod.id,
                        name: prod.product?.name || t('sellerManageOrdersPage.product'),
                        quantity: prod.quantity || 0,
                        price: prod.price || 0
                    })) : []
                }));

                availableStatuses.value = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

                if (orders.value.length > 0) {
                    const stats = {
                        total: orders.value.length,
                        pending: orders.value.filter(o => o.status.toLowerCase() === 'pending').length,
                        processing: orders.value.filter(o => o.status.toLowerCase() === 'processing').length,
                        shipped: orders.value.filter(o => o.status.toLowerCase() === 'shipped').length,
                        delivered: orders.value.filter(o => o.status.toLowerCase() === 'delivered').length,
                        cancelled: orders.value.filter(o => o.status.toLowerCase() === 'cancelled').length
                    };

                    orderStats.value = [
                        { title: t('sellerManageOrdersPage.stats.totalOrders'), value: stats.total.toString(), icon: 'ShoppingBag' },
                        { title: t('sellerManageOrdersPage.statuses.pending'), value: stats.pending.toString(), icon: 'Clock' },
                        { title: t('sellerManageOrdersPage.statuses.processing'), value: stats.processing.toString(), icon: 'RefreshCcw' },
                        { title: t('sellerManageOrdersPage.statuses.shipped'), value: stats.shipped.toString(), icon: 'Truck' },
                        { title: t('sellerManageOrdersPage.statuses.delivered'), value: stats.delivered.toString(), icon: 'Package' },
                        { title: t('sellerManageOrdersPage.statuses.cancelled'), value: stats.cancelled.toString(), icon: 'Ban' }
                    ];
                }

            } catch (err) {
                console.error('Error loading orders:', err);
                error.value = err.message || t('sellerManageOrdersPage.toasts.loadOrdersFailed');
                toast.error(t('sellerManageOrdersPage.toasts.loadOrdersFailed'));
            } finally {
                isLoading.value = false;
            }
        };

        const translateStatus = (status) => {
            const key = {
                Pending: 'pending',
                Processing: 'processing',
                Shipped: 'shipped',
                Delivered: 'delivered',
                Cancelled: 'cancelled'
            }[status];

            return key ? t(`sellerManageOrdersPage.statuses.${key}`) : status;
        };

        const getStatIconComponent = (iconName) => {
            const icons = {
                'ShoppingBag': ShoppingBag,
                'Clock': Clock,
                'RefreshCcw': RefreshCcw,
                'Truck': Truck,
                'Package': Package,
                'Ban': Ban
            };
            return icons[iconName] || ShoppingBag;
        };

        const getStatusBadgeClass = (status) => {
            const classes = {
                'pending': 'bg-amber-50 text-amber-600 border-amber-100',
                'processing': 'bg-blue-50 text-blue-600 border-blue-100',
                'shipped': 'bg-teal-50 text-teal-600 border-teal-100',
                'delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
                'cancelled': 'bg-rose-50 text-rose-600 border-rose-100'
            };
            return classes[status.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-100';
        };

        const displayedPages = computed(() => {
            const total = totalPages.value;
            const current = currentPage.value;
            const pages = [];

            if (total <= 7) {
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                if (current > 3) {
                    pages.push('...');
                }
                for (let i = Math.max(2, current - 1); i <= Math.min(current + 1, total - 1); i++) {
                    pages.push(i);
                }
                if (current < total - 2) {
                    pages.push('...');
                }
                if (total > 1) {
                    pages.push(total);
                }
            }
            return pages;
        });

        const goToPage = (page) => {
            currentPage.value = Number(page);
        };

        const handleItemsPerPageChange = () => {
            itemsPerPage.value = Number(itemsPerPage.value);
            currentPage.value = 1;
        };

        const filteredOrders = computed(() => {
            if (!Array.isArray(orders.value)) return [];

            let filtered = [...orders.value];

            // Status filtering
            if (statusFilter.value !== 'all') {
                filtered = filtered.filter(order => order?.status?.toLowerCase() === statusFilter.value.toLowerCase());
            }

            // Search filtering
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                filtered = filtered.filter(order => (
                    (order?.id || '').toLowerCase().includes(query) ||
                    (order?.customer?.name || '').toLowerCase().includes(query) ||
                    (order?.customer?.email || '').toLowerCase().includes(query)
                ));
            }

            // Date filtering
            if (dateRange.value && dateRange.value !== 'all') {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                filtered = filtered.filter(order => {
                    if (!order.date) return false;
                    const orderDate = new Date(order.date);
                    if (isNaN(orderDate.getTime())) return false;

                    let isInRange = false;
                    switch (dateRange.value) {
                        case 'today':
                            isInRange = orderDate.toDateString() === today.toDateString();
                            break;
                        case 'week': {
                            const weekAgo = new Date(today);
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            isInRange = orderDate >= weekAgo;
                            break;
                        }
                        case 'month': {
                            const monthAgo = new Date(today);
                            monthAgo.setMonth(monthAgo.getMonth() - 1);
                            isInRange = orderDate >= monthAgo;
                            break;
                        }
                        case 'year': {
                            const yearAgo = new Date(today);
                            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                            isInRange = orderDate >= yearAgo;
                            break;
                        }
                        default:
                            isInRange = true;
                    }
                    return isInRange;
                });
            }

            // Sorting
            if (sortKey.value) {
                filtered.sort((a, b) => {
                    let compareA, compareB;

                    switch (sortKey.value) {
                        case 'rowNumber':
                            compareA = a.id;
                            compareB = b.id;
                            break;
                        case 'id':
                            compareA = a.id;
                            compareB = b.id;
                            break;
                        case 'customer':
                            compareA = a.customer?.name?.toLowerCase() || '';
                            compareB = b.customer?.name?.toLowerCase() || '';
                            break;
                        case 'date':
                            compareA = new Date(a.date).getTime();
                            compareB = new Date(b.date).getTime();
                            break;
                        case 'status':
                            compareA = a.status?.toLowerCase() || '';
                            compareB = b.status?.toLowerCase() || '';
                            break;
                        case 'total':
                            compareA = parseFloat(a.total) || 0;
                            compareB = parseFloat(b.total) || 0;
                            break;
                        default:
                            return 0;
                    }

                    if (sortKey.value === 'date' && (isNaN(compareA) || isNaN(compareB))) {
                        return 0;
                    }

                    const sortMultiplier = sortOrder.value === 'asc' ? 1 : -1;
                    if (compareA < compareB) return -1 * sortMultiplier;
                    if (compareA > compareB) return 1 * sortMultiplier;
                    return 0;
                });
            }

            return filtered;
        });

        const getRowNumber = (index) => {
            const page = Number(currentPage.value) || 1;
            const items = Number(itemsPerPage.value) || 10;
            const rowIndex = Number(index) || 0;
            return ((page - 1) * items) + rowIndex + 1;
        };

        const paginatedOrders = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return filteredOrders.value.slice(start, end);
        });

        const totalOrders = computed(() => filteredOrders.value.length);

        const totalPages = computed(() =>
            Math.max(1, Math.ceil(totalOrders.value / Number(itemsPerPage.value)))
        );

        const paginationStart = computed(() => {
            if (totalOrders.value === 0) return 0;
            return ((Number(currentPage.value) - 1) * Number(itemsPerPage.value)) + 1;
        });

        const paginationEnd = computed(() => {
            if (totalOrders.value === 0) return 0;
            return Math.min(currentPage.value * Number(itemsPerPage.value), totalOrders.value);
        });

        const formatDate = (date) => {
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-NG';
            return new Date(date).toLocaleDateString(activeLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatAmount = (amount) => {
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-NG';
            return amount.toLocaleString(activeLocale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        const refreshOrders = async () => {
            try {
                isLoading.value = true;
                error.value = null;
                await loadOrdersData();
                await nextTick();
                toast.success(t('sellerManageOrdersPage.toasts.ordersRefreshed'));
            } catch (error) {
                console.error('Refresh error:', error);
                toast.error(t('sellerManageOrdersPage.toasts.refreshFailed'));
            } finally {
                isLoading.value = false;
            }
        };

        const viewOrder = (orderId) => {
            const order = orders.value.find(o => o.id === orderId || o._id === orderId);
            if (!order) {
                toast.error(t('sellerManageOrdersPage.toasts.orderNotFound'));
                return;
            }
            router.push({
                name: 'ManageOrderDetails',
                params: { id: order._id }
            });
        };

        const updateStatus = async (orderId) => {
            try {
                const order = orders.value.find(o => o.id === orderId || o._id === orderId);
                if (!order) throw new Error(t('sellerManageOrdersPage.toasts.orderNotFound'));

                const currentStatus = order.status.toLowerCase();

                const statusFlow = {
                    'pending': 'Processing',
                    'processing': 'Shipped',
                    'shipped': 'Delivered',
                    'delivered': 'Delivered',
                    'cancelled': 'Pending'
                };

                const nextStatus = statusFlow[currentStatus];

                if (!nextStatus) {
                    toast.info(t('sellerManageOrdersPage.toasts.noStatusChange'));
                    return;
                }

                if (currentStatus === 'cancelled') {
                    if (!window.confirm(t('sellerManageOrdersPage.confirmReactivate'))) {
                        return;
                    }
                }

                isLoading.value = true;
                await sellerStore.updateOrderStatus(order._id, nextStatus);
                await loadOrdersData();

                const message = currentStatus === 'cancelled'
                    ? t('sellerManageOrdersPage.toasts.orderReactivated', { status: translateStatus(nextStatus) })
                    : t('sellerManageOrdersPage.toasts.orderStatusUpdated', { status: translateStatus(nextStatus) });

                toast.success(message);
            } catch (error) {
                console.error('Error updating order status:', error);
                toast.error(t('sellerManageOrdersPage.toasts.updateStatusFailed'));
            } finally {
                isLoading.value = false;
            }
        };

        const handleError = (error) => {
            console.error('Component Error:', error);
            toast.error(t('sellerManageOrdersPage.toasts.genericError'));
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value = Math.max(1, Number(currentPage.value) - 1);
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value = Math.min(
                    totalPages.value,
                    Number(currentPage.value) + 1
                );
            }
        };

        watch([statusFilter, dateRange, searchQuery, itemsPerPage], () => {
            currentPage.value = 1;
        }, { immediate: true });

        watch(orders, (newOrders) => {
            if (!Array.isArray(newOrders) || newOrders.length === 0) return;
            currentPage.value = 1;
        }, { deep: true, immediate: true });

        onMounted(loadOrdersData);

        return {
            router,
            t,
            isLoading,
            statusFilter,
            dateRange,
            searchQuery,
            currentPage,
            itemsPerPage,
            pageSizes,
            orders,
            orderStats,
            error,
            sortKey,
            sortOrder,
            toggleSort,
            filteredOrders,
            paginatedOrders,
            totalOrders,
            totalPages,
            paginationStart,
            paginationEnd,
            displayedPages,
            refreshOrders,
            updateStatus,
            viewOrder,
            prevPage,
            nextPage,
            goToPage,
            handleItemsPerPageChange,
            getRowNumber,
            availableStatuses,
            translateStatus,
            getStatIconComponent,
            getStatusBadgeClass,
            formatDate,
            formatAmount,
            handleError
        };
    }
};
</script>

<style scoped>
/* Custom scrollbar hiding for horizontal scroll tabs */
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
.scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

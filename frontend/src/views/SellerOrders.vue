<template>
    <div class="min-h-screen bg-slate-50/50 p-3 sm:p-6 md:p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Enhanced Header -->
            <div class="mb-6 sm:mb-8">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="bg-gradient-to-r from-[#ff934b] to-[#ff5e62] p-5 sm:p-6 lg:p-8">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0 shadow-sm">
                                <ShoppingBag class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div class="text-white min-w-0">
                                <h1 class="text-2xl sm:text-3xl font-black mb-1 sm:mb-2 tracking-tight">{{ t('sellerOrdersPage.title') }}</h1>
                                <p class="text-white/85 text-xs sm:text-sm font-medium">{{ t('sellerOrdersPage.subtitle') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Order Status Summary Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
                <div v-for="status in ['Pending', 'Shipped', 'Delivered', 'Cancelled']" :key="status"
                    class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                >
                    <div class="flex items-start gap-3 sm:gap-4">
                        <div class="shrink-0">
                            <div :class="[
                                'p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm text-white',
                                getStatusGradientClass(status)
                            ]">
                                <component :is="getStatusIcon(status)" class="w-4 h-4 sm:w-6 sm:h-6" />
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-slate-400 mb-1 leading-none">
                                {{ t('sellerOrdersPage.statusOrders', { status: translateStatus(status) }) }}
                            </p>
                            <p class="text-lg sm:text-2xl font-black text-slate-800 break-words leading-none mb-1.5">
                                {{ getOrderCountByStatus(status) }}
                            </p>
                            <p class="text-xs sm:text-sm font-black text-[#ff934b]">
                                ₦{{ formatCurrency(getOrderTotalByStatus(status)) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Filtering and Sorting -->
            <div class="mb-6 sm:mb-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="bg-slate-50/50 p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
                    <div class="w-8 h-8 sm:w-9 sm:h-9 bg-[#ff934b]/10 text-[#ff934b] rounded-xl flex items-center justify-center">
                        <Filter class="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h2 class="text-base font-bold text-slate-850 tracking-tight">{{ t('sellerOrdersPage.filterTitle') }}</h2>
                        <p class="text-xs text-slate-400 font-semibold mt-0.5">{{ t('sellerOrdersPage.filterSubtitle') }}</p>
                    </div>
                </div>

                <div class="p-5 sm:p-6 space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <!-- Status Filter -->
                        <div class="space-y-1.5">
                            <label for="status-filter" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t('sellerOrdersPage.filterByStatus') }}</label>
                            <div class="relative">
                                <select id="status-filter" v-model="statusFilter" @change="resetPagination"
                                    class="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all text-xs font-bold text-slate-700 cursor-pointer"
                                >
                                    <option value="">{{ t('sellerOrdersPage.allStatuses') }}</option>
                                    <option v-for="status in orderStatuses" :key="status" :value="status">
                                        {{ translateStatus(status) }}
                                    </option>
                                </select>
                                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronDown class="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <!-- Sort By -->
                        <div class="space-y-1.5">
                            <label for="sort-by" class="block text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t('sellerOrdersPage.sortBy') }}</label>
                            <div class="relative">
                                <select id="sort-by" v-model="sortBy" @change="resetPagination"
                                    class="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all text-xs font-bold text-slate-700 cursor-pointer"
                                >
                                    <option value="date">📅 {{ t('sellerOrdersPage.sortOptions.date') }}</option>
                                    <option value="total">💰 {{ t('sellerOrdersPage.sortOptions.total') }}</option>
                                    <option value="status">🏷️ {{ t('sellerOrdersPage.sortOptions.status') }}</option>
                                </select>
                                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronDown class="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <!-- Results Summary -->
                        <div class="space-y-1.5">
                            <p class="block text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t('sellerOrdersPage.results') }}</p>
                            <div class="p-2.5 bg-[#ff934b]/5 rounded-xl border border-[#ff934b]/10 flex items-center justify-between">
                                <span class="text-xs font-bold text-[#ff934b]">{{ t('sellerOrdersPage.ordersFound', { count: filteredOrders.length }) }}</span>
                                <span class="text-sm font-black text-[#ff934b]">{{ filteredOrders.length }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Order List -->
            <div v-if="loading" class="flex justify-center items-center py-16">
                <div class="text-center">
                    <div class="relative flex justify-center mb-4">
                        <div class="animate-spin h-10 w-10 border-4 border-[#ff934b] rounded-full border-t-transparent"></div>
                    </div>
                    <p class="text-sm font-bold text-slate-700">{{ t('sellerOrdersPage.loading') }}</p>
                </div>
            </div>

            <div v-else-if="paginatedOrders.length > 0" class="space-y-6">
                <div v-for="order in paginatedOrders" :key="order._id"
                    class="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                    <!-- Enhanced Order Header -->
                    <div class="bg-slate-50/50 p-5 border-b border-slate-100">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <div class="w-10 h-10 bg-[#ff934b]/10 text-[#ff934b] rounded-xl flex items-center justify-center shrink-0">
                                    <Package class="w-5 h-5" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="text-base font-black text-slate-800 truncate">
                                        {{ t('sellerOrdersPage.orderNumber', { number: order.orderNumber }) }}
                                    </p>
                                    <p class="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                                        <Calendar class="w-3.5 h-3.5" />
                                        {{ formatDate(order.date) }}
                                    </p>
                                </div>
                            </div>
                            <span :class="[
                                'px-3 py-1.5 rounded-full text-xs font-bold border select-none',
                                getStatusBadgeClass(order.status)
                            ]">
                                {{ translateStatus(order.status) }}
                            </span>
                        </div>
                    </div>

                    <!-- Enhanced Order Content -->
                    <div class="p-5 sm:p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                            <!-- Enhanced Order Details Card -->
                            <div class="bg-white rounded-xl p-4 border border-slate-100 hover:border-[#ff934b]/10 shadow-sm transition-all duration-300">
                                <h3 class="font-bold text-slate-850 mb-3 flex items-center gap-2 text-sm">
                                    <div class="w-7 h-7 bg-[#ff934b]/10 text-[#ff934b] rounded-lg flex items-center justify-center shrink-0">
                                        <FileText class="w-4 h-4" />
                                    </div>
                                    {{ t('sellerOrdersPage.orderDetails') }}
                                </h3>
                                <div class="space-y-2">
                                    <div class="flex justify-between items-center p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                                        <span class="text-xs font-bold text-slate-500">{{ t('sellerOrdersPage.totalAmount') }}</span>
                                        <span class="text-base font-black text-emerald-600">₦{{ formatCurrency(order.total) }}</span>
                                    </div>
                                    <div class="flex justify-between items-center p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                                        <span class="text-xs font-bold text-slate-500">{{ t('sellerOrdersPage.paymentMethod') }}</span>
                                        <span class="text-xs font-bold text-slate-850">{{ order.paymentMethod }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Enhanced Customer Card -->
                            <div class="bg-white rounded-xl p-4 border border-slate-100 hover:border-[#ff934b]/10 shadow-sm transition-all duration-300">
                                <h3 class="font-bold text-slate-850 mb-3 flex items-center gap-2 text-sm">
                                    <div class="w-7 h-7 bg-[#ff934b]/10 text-[#ff934b] rounded-lg flex items-center justify-center shrink-0">
                                        <User class="w-4 h-4" />
                                    </div>
                                    {{ t('sellerOrdersPage.customerInformation') }}
                                </h3>
                                <div class="space-y-2">
                                    <div class="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 space-y-1">
                                        <p class="font-bold text-slate-850 text-xs sm:text-sm">{{ order.customerName }}</p>
                                        <p class="text-xs text-slate-500 font-semibold flex items-center gap-1.5 break-all">
                                            <Mail class="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                            {{ order.customerEmail }}
                                        </p>
                                        <p class="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                                            <Phone class="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                            {{ order.customerPhone }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Enhanced Shipping Address Card -->
                            <div class="bg-white rounded-xl p-4 border border-slate-100 hover:border-[#ff934b]/10 shadow-sm transition-all duration-300">
                                <h3 class="font-bold text-slate-850 mb-3 flex items-center gap-2 text-sm">
                                    <div class="w-7 h-7 bg-[#ff934b]/10 text-[#ff934b] rounded-lg flex items-center justify-center shrink-0">
                                        <MapPin class="w-4 h-4" />
                                    </div>
                                    {{ t('sellerOrdersPage.shippingAddress') }}
                                </h3>
                                <div class="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 text-xs font-semibold text-slate-650 space-y-1">
                                    <p class="font-bold text-slate-850">{{ order.address.street }}</p>
                                    <p>{{ order.address.city }}, {{ order.address.state }} {{ order.address.postalCode }}</p>
                                    <p class="text-slate-450">{{ order.address.country }}</p>
                                </div>
                            </div>

                            <!-- Enhanced Products Card -->
                            <div class="bg-white rounded-xl p-4 border border-slate-100 hover:border-[#ff934b]/10 shadow-sm transition-all duration-300">
                                <h3 class="font-bold text-slate-850 mb-3 flex items-center gap-2 text-sm">
                                    <div class="w-7 h-7 bg-[#ff934b]/10 text-[#ff934b] rounded-lg flex items-center justify-center shrink-0">
                                        <ShoppingBag class="w-4 h-4" />
                                    </div>
                                    {{ t('sellerOrdersPage.productsCount', { count: order.products?.length || 0 }) }}
                                </h3>
                                <div class="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    <div v-if="order.products && order.products.length > 0" class="space-y-2">
                                        <div v-for="product in order.products" :key="product.name"
                                            class="flex justify-between items-center p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-slate-55 transition-colors gap-2"
                                        >
                                            <div class="flex-1 min-w-0">
                                                <span class="font-bold text-slate-800 text-xs sm:text-sm block truncate">{{ product.name }}</span>
                                                <div v-if="product.variant" class="text-[10px] text-slate-400 font-semibold mt-0.5 flex flex-wrap gap-x-2">
                                                    <span v-if="product.variant.color">
                                                        {{ t('sellerOrdersPage.color') }}: {{ typeof product.variant.color === 'object' ? product.variant.color.name : product.variant.color }}
                                                    </span>
                                                    <span v-for="(attr, attrIdx) in product.variant.attributes" :key="attrIdx">
                                                        {{ attr.name }}: {{ attr.value }}
                                                    </span>
                                                    <span v-if="product.variant.size && (!product.variant.attributes || !product.variant.attributes.some(a => a.name.toLowerCase() === 'size'))">
                                                        {{ t('sellerOrdersPage.size') }}: {{ product.variant.size }}
                                                    </span>
                                                </div>
                                                <span class="text-[11px] text-slate-500 font-semibold">{{ t('sellerOrdersPage.quantity') }}: {{ product.quantity }}</span>
                                            </div>
                                            <span class="font-black text-emerald-600 text-xs sm:text-sm shrink-0">₦{{ formatCurrency(product.subtotal) }}</span>
                                        </div>
                                    </div>
                                    <div v-else class="text-center py-4">
                                        <p class="text-slate-400 text-xs font-semibold">{{ t('sellerOrdersPage.noProductInformation') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Enhanced Action Buttons -->
                        <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-50 pt-5">
                            <button @click="openUpdateStatusModal(order)"
                                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-200 text-xs"
                            >
                                <RefreshCw class="w-3.5 h-3.5" />
                                <span>{{ t('sellerOrdersPage.updateStatus') }}</span>
                            </button>
                            <button @click="viewOrderDetails(order)"
                                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-bold shadow-sm active:scale-95 transition-all duration-200 text-xs"
                            >
                                <Eye class="w-3.5 h-3.5" />
                                <span>{{ t('sellerOrdersPage.viewDetails') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Empty State -->
            <div v-else-if="!loading" class="text-center py-16">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12 max-w-lg mx-auto">
                    <div class="w-16 h-16 bg-[#ff934b]/10 text-[#ff934b] rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <ShoppingBag class="w-8 h-8" />
                    </div>
                    <h3 class="text-lg font-bold text-slate-850 mb-2">{{ t('sellerOrdersPage.noOrdersFound') }}</h3>
                    <p class="text-slate-400 text-xs font-semibold mb-6">{{ errorMessage || t('sellerOrdersPage.noOrdersMatchFilters') }}</p>
                    <button @click="statusFilter = ''; sortBy = 'date'; resetPagination()"
                        class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-md hover:shadow active:scale-95 transition-all duration-200 text-xs"
                    >
                        <RefreshCw class="w-3.5 h-3.5" />
                        <span>{{ t('sellerOrdersPage.resetFilters') }}</span>
                    </button>
                </div>
            </div>

            <!-- Enhanced Pagination -->
            <div v-if="filteredOrders.length > 0" class="mt-6 sm:mt-8">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
                    <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center gap-4">
                        <!-- Page Navigation -->
                        <div class="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                            <button @click="goToPage(1)" :disabled="currentPage === 1"
                                class="px-2.5 py-1.5 rounded-lg border border-slate-200/80 font-bold transition-all text-xs"
                                :class="currentPage === 1 ? 'text-slate-300 border-slate-100 cursor-not-allowed' : 'text-slate-600 hover:border-[#ff934b] hover:text-[#ff934b] hover:bg-[#ff934b]/5'"
                            >
                                {{ t('sellerOrdersPage.first') }}
                            </button>
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-2.5 py-1.5 rounded-lg border border-slate-200/80 font-bold transition-all text-xs"
                                :class="currentPage === 1 ? 'text-slate-300 border-slate-100 cursor-not-allowed' : 'text-slate-600 hover:border-[#ff934b] hover:text-[#ff934b] hover:bg-[#ff934b]/5'"
                            >
                                {{ t('sellerOrdersPage.previous') }}
                            </button>

                            <!-- Page Numbers -->
                            <div class="flex items-center gap-1">
                                <template v-for="pageNumber in visiblePageNumbers" :key="pageNumber">
                                    <button v-if="pageNumber !== '...'" @click="goToPage(pageNumber)"
                                        class="w-8 h-8 rounded-lg font-bold transition-all text-xs"
                                        :class="pageNumber === currentPage ? 'bg-gradient-to-r from-[#ff934b] to-[#ff5e62] text-white shadow-sm' : 'text-slate-600 hover:bg-[#ff934b]/5 hover:text-[#ff934b]'"
                                    >
                                        {{ pageNumber }}
                                    </button>
                                    <span v-else class="px-1 text-slate-300 text-xs">...</span>
                                </template>
                            </div>

                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-2.5 py-1.5 rounded-lg border border-slate-200/80 font-bold transition-all text-xs"
                                :class="currentPage === totalPages ? 'text-slate-300 border-slate-100 cursor-not-allowed' : 'text-slate-600 hover:border-[#ff934b] hover:text-[#ff934b] hover:bg-[#ff934b]/5'"
                            >
                                {{ t('sellerOrdersPage.next') }}
                            </button>
                            <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                                class="px-2.5 py-1.5 rounded-lg border border-slate-200/80 font-bold transition-all text-xs"
                                :class="currentPage === totalPages ? 'text-slate-300 border-slate-100 cursor-not-allowed' : 'text-slate-600 hover:border-[#ff934b] hover:text-[#ff934b] hover:bg-[#ff934b]/5'"
                            >
                                {{ t('sellerOrdersPage.last') }}
                            </button>
                        </div>

                        <!-- Page Info and Jump -->
                        <div class="flex flex-col sm:flex-row items-center gap-3">
                            <span class="text-xs font-bold text-slate-500">{{ t('sellerOrdersPage.pageOf', { page: currentPage, total: totalPages }) }}</span>
                            <div class="flex items-center gap-2">
                                <input v-model.number="jumpToPage" type="number" min="1" :max="totalPages"
                                    class="w-16 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all text-center"
                                />
                                <button @click="goToPage(jumpToPage)"
                                    class="px-4 py-1.5 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-all text-xs active:scale-95"
                                >
                                    {{ t('sellerOrdersPage.go') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Order Details Modal -->
    <OrderDetails v-if="selectedOrder" :order="selectedOrder" @close="closeOrderDetails"
        @open-update-status-modal="openUpdateStatusModal" />

    <!-- Update Status Modal -->
    <UpdateOrderStatus v-if="orderToUpdate" :order="orderToUpdate" @close="closeUpdateStatusModal"
        @update="confirmUpdateStatus" />
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSellerStore } from '../store/sellerStore';
import { useOrderStore } from '../store/orderStore.js';
import OrderDetails from './OrderDetails.vue';
import UpdateOrderStatus from './UpdateOrderStatus.vue';
import {
    Clock, TruckIcon as Truck, CheckCircle, XCircle, ShoppingBag, Package,
    Calendar, Filter, ChevronDown, FileText, User, Mail, Phone, MapPin,
    RefreshCw, Eye
} from 'lucide-vue-next';

export default {
    name: 'SellerOrders',
    components: {
        OrderDetails,
        UpdateOrderStatus,
        Clock,
        Truck,
        CheckCircle,
        XCircle,
        ShoppingBag,
        Package,
        Calendar,
        Filter,
        ChevronDown,
        FileText,
        User,
        Mail,
        Phone,
        MapPin,
        RefreshCw,
        Eye
    },

    setup() {
        const { t, locale } = useI18n();
        const sellerStore = useSellerStore();
        const orderStore = useOrderStore();
        const orders = ref([]);
        const selectedOrder = ref(null);
        const orderToUpdate = ref(null);
        const loading = ref(true);
        const errorMessage = ref('');
        const orderStatuses = ref([]);
        const statusFilter = ref('');
        const sortBy = ref('date');
        const currentPage = ref(1);
        const ordersPerPage = 1;
        const jumpToPage = ref(1);

        const filteredOrders = computed(() => {
            let result = orders.value;
            if (statusFilter.value) {
                result = result.filter(order => order.status === statusFilter.value);
            }
            result.sort((a, b) => {
                if (sortBy.value === 'date') return new Date(b.date) - new Date(a.date);
                if (sortBy.value === 'total') return b.total - a.total;
                if (sortBy.value === 'status') return a.status.localeCompare(b.status);
                return 0;
            });
            return result;
        });

        const totalPages = computed(() => Math.ceil(filteredOrders.value.length / ordersPerPage));

        const paginatedOrders = computed(() => {
            const start = (currentPage.value - 1) * ordersPerPage;
            const end = start + ordersPerPage;
            return filteredOrders.value.slice(start, end);
        });

        const visiblePageNumbers = computed(() => {
            const delta = 2;
            const range = [];
            const rangeWithDots = [];
            let l;

            range.push(1);

            if (totalPages.value <= 1) {
                return range;
            }

            for (let i = currentPage.value - delta; i <= currentPage.value + delta; i++) {
                if (i < totalPages.value && i > 1) {
                    range.push(i);
                }
            }
            range.push(totalPages.value);

            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }

            return rangeWithDots;
        });

        onMounted(async () => {
            try {
                orders.value = await sellerStore.fetchSellerOrders();
                orderStatuses.value = await orderStore.fetchOrderStatuses();
                console.log('Fetched orders:', orders.value);
                console.log('Fetched Statuses:', orderStatuses.value);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                errorMessage.value = t('sellerOrdersPage.loadFailed');
            } finally {
                loading.value = false;
            }
        });

        const getOrderCountByStatus = (status) => {
            return orders.value.filter(order => order.status === status).length;
        };

        const getOrderTotalByStatus = (status) => {
            return orders.value
                .filter(order => order.status === status)
                .reduce((total, order) => total + order.total, 0);
        };

        const getStatusGradientClass = (status) => {
            const classes = {
                'Pending': 'bg-gradient-to-br from-amber-400 to-amber-500 text-white',
                'Shipped': 'bg-gradient-to-br from-[#ff934b] to-[#ff5e62] text-white',
                'Delivered': 'bg-gradient-to-br from-emerald-400 to-emerald-550 text-white',
                'Cancelled': 'bg-gradient-to-br from-rose-450 to-rose-500 text-white',
                'Processing': 'bg-gradient-to-br from-blue-400 to-blue-550 text-white'
            };
            return classes[status] || 'bg-gradient-to-br from-slate-400 to-slate-500 text-white';
        };

        const getStatusIcon = (status) => {
            const icons = {
                'Pending': Clock,
                'Shipped': Truck,
                'Delivered': CheckCircle,
                'Cancelled': XCircle
            };
            return icons[status] || Clock;
        };

        const getStatusBadgeClass = (status) => {
            const classes = {
                'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
                'Shipped': 'bg-[#ff934b]/10 text-[#ff934b] border-[#ff934b]/20',
                'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
                'Cancelled': 'bg-rose-50 text-rose-600 border-rose-100',
                'Processing': 'bg-blue-50 text-blue-600 border-blue-100'
            };
            return classes[status] || 'bg-slate-50 text-slate-650 border-slate-100';
        };

        const translateStatus = (status) => {
            const key = {
                Pending: 'pending',
                Shipped: 'shipped',
                Delivered: 'delivered',
                Cancelled: 'cancelled',
                Processing: 'processing',
            }[status];

            return key ? t(`sellerOrdersPage.statuses.${key}`) : status;
        };

        function numberToWords(num) {
            if (locale.value === 'fr') {
                const formatted = new Intl.NumberFormat('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(Math.round(num * 100) / 100);
                return t('sellerOrdersPage.amountInNaira', { amount: formatted });
            }

            if (num === 0) return "Zero Naira";
            num = Math.round(num);

            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

            function convertGroup(n) {
                let result = '';
                if (n >= 100) {
                    result += ones[Math.floor(n / 100)] + ' Hundred';
                    n %= 100;
                    if (n > 0) result += ' and ';
                }
                if (n >= 20) {
                    result += tens[Math.floor(n / 10)];
                    if (n % 10 > 0) result += '-' + ones[n % 10];
                } else if (n >= 10) {
                    result += teens[n - 10];
                } else if (n > 0) {
                    result += ones[n];
                }
                return result;
            }

            let result = '';
            let scaleIndex = 0;

            while (num > 0) {
                if (num % 1000 !== 0) {
                    let groupResult = convertGroup(num % 1000);
                    if (scaleIndex > 0) groupResult += ' ' + scales[scaleIndex];
                    if (result) groupResult += ', ' + result;
                    result = groupResult;
                }
                num = Math.floor(num / 1000);
                scaleIndex++;
            }

            return result + ' Naira';
        }

        const formatDate = (dateString) => {
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US';
            return new Date(dateString).toLocaleDateString(activeLocale, { year: 'numeric', month: 'long', day: 'numeric' });
        };

        const formatCurrency = (amount) => {
            return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        };

        const viewOrderDetails = (order) => {
            selectedOrder.value = order;
        };

        const closeOrderDetails = () => {
            selectedOrder.value = null;
        };

        const openUpdateStatusModal = (order) => {
            orderToUpdate.value = order;
            selectedOrder.value = null;
        };

        const closeUpdateStatusModal = () => {
            orderToUpdate.value = null;
        };

        const confirmUpdateStatus = async (orderId, newStatus) => {
            try {
                await sellerStore.updateOrderStatus(orderId, newStatus);
                const updatedOrderIndex = orders.value.findIndex(order => order._id === orderId);
                if (updatedOrderIndex !== -1) {
                    orders.value[updatedOrderIndex].status = newStatus;
                }
                closeUpdateStatusModal();
            } catch (error) {
                console.error('Failed to update order status:', error);
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) currentPage.value--;
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) currentPage.value++;
        };

        const goToPage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        const resetPagination = () => {
            currentPage.value = 1;
        };

        watch([statusFilter, sortBy], () => {
            resetPagination();
        });

        return {
            t,
            filteredOrders,
            paginatedOrders,
            loading,
            errorMessage,
            orderStatuses,
            statusFilter,
            sortBy,
            currentPage,
            totalPages,
            visiblePageNumbers,
            jumpToPage,
            selectedOrder,
            orderToUpdate,
            getStatusColor,
            formatDate,
            formatCurrency,
            viewOrderDetails,
            closeOrderDetails,
            openUpdateStatusModal,
            closeUpdateStatusModal,
            confirmUpdateStatus,
            prevPage,
            nextPage,
            goToPage,
            resetPagination,
            getOrderCountByStatus,
            getOrderTotalByStatus,
            getStatusGradientClass,
            getStatusIcon,
            getStatusBadgeClass,
            translateStatus,
            numberToWords,
        };
    }
};
</script>

<style scoped>
/* Custom animations and scrollbar */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #ff934b #f8fafc;
}
.overflow-y-auto::-webkit-scrollbar {
    width: 5px;
}
.overflow-y-auto::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #ff934b;
    border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #e8803c;
}
</style>

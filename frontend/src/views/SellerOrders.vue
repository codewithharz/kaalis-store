<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Enhanced Header -->
            <div class="mb-6 sm:mb-8">
                <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6 lg:p-8">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div
                                class="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                                <ShoppingBag class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div class="text-white min-w-0">
                                <h1 class="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">All Orders</h1>
                                <p class="text-blue-100 text-sm sm:text-base">Manage and track all your customer orders
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Order Status Summary Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <div v-for="status in ['Pending', 'Shipped', 'Delivered', 'Cancelled']" :key="status"
                    class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div class="flex items-start gap-2 sm:gap-4">
                        <div class="flex-shrink-0">
                            <div
                                :class="`bg-gradient-to-br from-${getStatusColor(status)}-400 to-${getStatusColor(status)}-600 p-2 sm:p-4 rounded-lg sm:rounded-2xl shadow-lg`">
                                <component :is="getStatusIcon(status)" class="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">{{ status }} Orders</p>
                            <p class="text-lg sm:text-2xl font-bold text-gray-900 break-words">{{
                                getOrderCountByStatus(status) }}</p>
                            <p class="text-xs sm:text-sm font-medium text-green-600 mt-1 sm:mt-2">
                                ₦{{ formatCurrency(getOrderTotalByStatus(status)) }}
                            </p>
                            <p class="text-xs text-gray-500 mt-1 sm:mt-2 leading-relaxed hidden sm:block">
                                {{ numberToWords(getOrderTotalByStatus(status)) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Filtering and Sorting -->
            <div
                class="mb-6 sm:mb-8 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-gray-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <Filter class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <h2 class="text-lg sm:text-xl font-bold text-gray-900">Filter & Sort Orders</h2>
                            <p class="text-xs sm:text-sm text-gray-600">Organize your orders efficiently</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 sm:p-6 space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- Status Filter -->
                        <div>
                            <label for="status-filter" class="block text-sm font-semibold text-gray-700 mb-2">Filter by
                                Status</label>
                            <div class="relative">
                                <select id="status-filter" v-model="statusFilter" @change="resetPagination"
                                    class="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base">
                                    <option value="">All Statuses</option>
                                    <option v-for="status in orderStatuses" :key="status" :value="status">
                                        {{ status }}
                                    </option>
                                </select>
                                <div
                                    class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDown class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <!-- Sort By -->
                        <div>
                            <label for="sort-by" class="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
                            <div class="relative">
                                <select id="sort-by" v-model="sortBy" @change="resetPagination"
                                    class="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base">
                                    <option value="date">📅 Date</option>
                                    <option value="total">💰 Total Amount</option>
                                    <option value="status">🏷️ Status</option>
                                </select>
                                <div
                                    class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDown class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <!-- Results Summary -->
                        <div>
                            <p class="text-sm font-medium text-gray-600 mb-2">Results</p>
                            <div
                                class="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200">
                                <p class="text-lg sm:text-xl font-bold text-blue-900">{{ filteredOrders.length }}</p>
                                <p class="text-xs text-blue-600">orders found</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Order List -->
            <div v-if="loading" class="flex justify-center items-center py-12 sm:py-16">
                <div class="text-center">
                    <div class="relative">
                        <div
                            class="animate-spin h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4">
                        </div>
                        <div
                            class="absolute inset-0 animate-ping h-12 w-12 sm:h-16 sm:w-16 border-2 border-blue-300 rounded-full opacity-75">
                        </div>
                    </div>
                    <p class="text-lg sm:text-xl font-medium text-gray-700">Loading orders...</p>
                    <p class="text-xs sm:text-sm text-gray-500 mt-2">Please wait while we fetch your orders</p>
                </div>
            </div>

            <div v-else-if="paginatedOrders.length > 0" class="space-y-4 sm:space-y-6">
                <div v-for="order in paginatedOrders" :key="order._id"
                    class="bg-white shadow-xl rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">

                    <!-- Enhanced Order Header -->
                    <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-6 border-b border-gray-200">
                        <div
                            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                <div
                                    class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Package class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="text-lg sm:text-xl font-bold text-gray-900 truncate">Order #{{
                                        order.orderNumber }}</p>
                                    <p class="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                        <Calendar class="w-3 h-3 sm:w-4 sm:h-4" />
                                        {{ formatDate(order.date) }}
                                    </p>
                                </div>
                            </div>
                            <span
                                :class="`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 border border-${getStatusColor(order.status)}-200 flex-shrink-0`">
                                {{ order.status }}
                            </span>
                        </div>
                    </div>

                    <!-- Enhanced Order Content -->
                    <div class="p-4 sm:p-6">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <!-- Enhanced Order Details Card -->
                            <div
                                class="bg-gradient-to-br from-white to-blue-50 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                                <h3 class="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <FileText class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    Order Details
                                </h3>
                                <div class="space-y-2 sm:space-y-3">
                                    <div
                                        class="flex justify-between items-center p-2 sm:p-3 bg-white rounded-lg border border-gray-100">
                                        <span class="text-sm sm:text-base text-gray-600">Total Amount:</span>
                                        <span class="text-lg sm:text-xl font-bold text-green-600">₦{{
                                            formatCurrency(order.total) }}</span>
                                    </div>
                                    <div
                                        class="flex justify-between items-center p-2 sm:p-3 bg-white rounded-lg border border-gray-100">
                                        <span class="text-sm sm:text-base text-gray-600">Payment Method:</span>
                                        <span class="font-medium text-gray-900 text-sm sm:text-base">{{
                                            order.paymentMethod }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Enhanced Customer Card -->
                            <div
                                class="bg-gradient-to-br from-white to-green-50 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                                <h3 class="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                        <User class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    Customer Information
                                </h3>
                                <div class="space-y-2 sm:space-y-3">
                                    <div class="p-2 sm:p-3 bg-white rounded-lg border border-gray-100">
                                        <p class="font-semibold text-gray-900 text-sm sm:text-base">{{
                                            order.customerName }}</p>
                                        <p
                                            class="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1 break-all">
                                            <Mail class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            {{ order.customerEmail }}
                                        </p>
                                        <p class="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1">
                                            <Phone class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            {{ order.customerPhone }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Enhanced Shipping Address Card -->
                            <div
                                class="bg-gradient-to-br from-white to-purple-50 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                                <h3 class="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <MapPin class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    Shipping Address
                                </h3>
                                <div class="p-2 sm:p-3 bg-white rounded-lg border border-gray-100">
                                    <p class="font-medium text-gray-900 text-sm sm:text-base">{{ order.address.street }}
                                    </p>
                                    <p class="text-xs sm:text-sm text-gray-600 mt-1">{{ order.address.city }}, {{
                                        order.address.state }} {{ order.address.postalCode }}</p>
                                    <p class="text-xs sm:text-sm text-gray-600">{{ order.address.country }}</p>
                                </div>
                            </div>

                            <!-- Enhanced Products Card -->
                            <div
                                class="bg-gradient-to-br from-white to-orange-50 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                                <h3 class="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <ShoppingBag class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    Products ({{ order.products?.length || 0 }})
                                </h3>
                                <div class="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                                    <div v-if="order.products && order.products.length > 0">
                                        <div v-for="product in order.products" :key="product.name"
                                            class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors gap-1 sm:gap-0">
                                            <div class="flex-1 min-w-0">
                                                <span
                                                    class="font-medium text-gray-900 text-sm sm:text-base block truncate">{{
                                                        product.name }}</span>
                                                <span class="text-xs sm:text-sm text-gray-600">Qty: {{ product.quantity
                                                }}</span>
                                            </div>
                                            <span
                                                class="font-bold text-green-600 text-sm sm:text-base flex-shrink-0">₦{{
                                                    formatCurrency(product.subtotal) }}</span>
                                        </div>
                                    </div>
                                    <div v-else class="text-center py-4">
                                        <p class="text-gray-500 text-sm">No product information available</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Enhanced Action Buttons -->
                        <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
                            <button @click="openUpdateStatusModal(order)"
                                class="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                                <RefreshCw class="w-4 h-4" />
                                Update Status
                            </button>
                            <button @click="viewOrderDetails(order)"
                                class="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                                <Eye class="w-4 h-4" />
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Empty State -->
            <div v-else-if="!loading" class="text-center py-12 sm:py-16">
                <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12">
                    <div
                        class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <ShoppingBag class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
                    <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{{ errorMessage || `No orders match your
                        current filters.` }}</p>
                    <button @click="statusFilter = ''; sortBy = 'date'; resetPagination()"
                        class="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                        <RefreshCw class="w-4 h-4" />
                        Reset Filters
                    </button>
                </div>
            </div>

            <!-- Enhanced Pagination -->
            <div v-if="filteredOrders.length > 0" class="mt-6 sm:mt-8">
                <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                        <!-- Page Navigation -->
                        <div class="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                            <button @click="goToPage(1)" :disabled="currentPage === 1"
                                class="px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 font-medium transition-all text-xs sm:text-sm"
                                :class="currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'">
                                First
                            </button>
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 font-medium transition-all text-xs sm:text-sm"
                                :class="currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'">
                                Previous
                            </button>

                            <!-- Page Numbers -->
                            <div class="flex items-center gap-1">
                                <template v-for="pageNumber in visiblePageNumbers" :key="pageNumber">
                                    <button v-if="pageNumber !== '...'" @click="goToPage(pageNumber)"
                                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm"
                                        :class="pageNumber === currentPage ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'">
                                        {{ pageNumber }}
                                    </button>
                                    <span v-else class="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm">...</span>
                                </template>
                            </div>

                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 font-medium transition-all text-xs sm:text-sm"
                                :class="currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'">
                                Next
                            </button>
                            <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                                class="px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 font-medium transition-all text-xs sm:text-sm"
                                :class="currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'">
                                Last
                            </button>
                        </div>

                        <!-- Page Info and Jump -->
                        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                            <span class="text-xs sm:text-sm font-medium text-gray-600">Page {{ currentPage }} of {{
                                totalPages }}</span>
                            <div class="flex items-center gap-2">
                                <input v-model.number="jumpToPage" type="number" min="1" :max="totalPages"
                                    class="w-16 sm:w-20 px-2 sm:px-3 py-2 border-2 border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                                <button @click="goToPage(jumpToPage)"
                                    class="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all text-xs sm:text-sm">
                                    Go
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
import { useSellerStore } from '../store/sellerStore';
import { useOrderStore } from '../store/orderStore.js'
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
                errorMessage.value = 'Failed to load orders. Please try again later.';
            } finally {
                loading.value = false;
            }
        });

        // New computed properties for order summaries
        const getOrderCountByStatus = (status) => {
            return orders.value.filter(order => order.status === status).length;
        };

        const getOrderTotalByStatus = (status) => {
            return orders.value
                .filter(order => order.status === status)
                .reduce((total, order) => total + order.total, 0);
        };

        const getStatusColor = (status) => {
            const colors = {
                'Pending': 'yellow',
                'Shipped': 'blue',
                'Delivered': 'green',
                'Cancelled': 'red'
            };
            return colors[status] || 'gray';
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

        // Add this function to convert numbers to words
        function numberToWords(num) {
            if (num === 0) return "Zero Naira";

            // Round to the nearest whole number
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
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
            selectedOrder.value = null; // Close the order details modal
        };

        const closeUpdateStatusModal = () => {
            orderToUpdate.value = null;
        };

        const confirmUpdateStatus = async (orderId, newStatus) => {
            try {
                await sellerStore.updateOrderStatus(orderId, newStatus);
                // Update the order in the local state
                const updatedOrderIndex = orders.value.findIndex(order => order._id === orderId);
                if (updatedOrderIndex !== -1) {
                    orders.value[updatedOrderIndex].status = newStatus;
                }
                closeUpdateStatusModal();
            } catch (error) {
                console.error('Failed to update order status:', error);
                // Handle error (e.g., show error message to user)
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
            getStatusIcon,
            numberToWords,
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

/* Mobile-first approach: Disable hover effects and transforms on mobile */
@media (max-width: 768px) {

    .transform,
    .hover\:scale-105:hover,
    .hover\:scale-\[1\.01\]:hover {
        transform: none !important;
        transition: none !important;
    }

    /* Better touch targets for mobile */
    button {
        min-height: 44px;
        min-width: 44px;
    }

    /* Prevent zoom on input focus for iOS */
    input,
    select,
    textarea {
        font-size: 16px;
    }

    /* Optimize text handling */
    .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .break-all {
        word-break: break-all;
    }

    /* Reduce motion for better mobile performance */
    * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
    }
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Enhanced scrollbar for products list - Mobile optimized */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
    /* Thinner on mobile */
}

@media (min-width: 768px) {
    .overflow-y-auto::-webkit-scrollbar {
        width: 6px;
        /* Slightly wider on desktop */
    }
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f7fafc;
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #1d4ed8, #1e40af);
}

/* Custom shadow effects - Responsive */
.shadow-xl {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
    .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
}

.shadow-2xl {
    box-shadow: 0 15px 30px -6px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
    .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
}

/* Enhanced focus states for accessibility */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Focus states for better accessibility */
button:focus,
input:focus,
select:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
}

/* Smooth page transitions - Desktop only */
@media (min-width: 769px) {
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeInUp {
        animation: fadeInUp 0.3s ease-out;
    }
}

/* Loading animation enhancements */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Button hover effects - Desktop only */
@media (min-width: 769px) {
    button:hover {
        transition: all 0.2s ease-in-out;
        transform: translateY(-1px);
    }

    .hover\:bg-blue-50:hover {
        background-color: #eff6ff;
    }

    .hover\:bg-gray-50:hover {
        background-color: #f9fafb;
    }

    .hover\:scale-105:hover {
        transform: scale(1.05);
    }

    .hover\:scale-\[1\.01\]:hover {
        transform: scale(1.01);
    }
}

/* Status badge animations - Desktop only */
@media (min-width: 769px) {
    .status-badge {
        position: relative;
        overflow: hidden;
    }

    .status-badge::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    .status-badge:hover::before {
        left: 100%;
    }
}

/* Card hover animations - Desktop only */
@media (min-width: 769px) {
    .order-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .order-card:hover {
        transform: translateY(-2px);
    }
}

/* Responsive text sizing */
@media (max-width: 640px) {
    .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }

    .text-2xl {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }

    .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}

/* Mobile-specific improvements */
@media (max-width: 640px) {

    /* Better spacing for small screens */
    .space-y-6>*+* {
        margin-top: 1rem;
    }

    .space-y-4>*+* {
        margin-top: 0.75rem;
    }

    /* Ensure proper container spacing */
    .container {
        max-width: 100%;
    }

    /* Better mobile scrolling */
    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
    }

    /* Prevent horizontal overflow */
    .min-w-0 {
        min-width: 0;
    }
}

/* Loading spinner optimizations */
@media (max-width: 640px) {
    .animate-spin {
        width: 3rem !important;
        height: 3rem !important;
    }
}

@media (min-width: 641px) {
    .animate-spin {
        width: 4rem !important;
        height: 4rem !important;
    }
}

/* Print styles */
@media print {

    .shadow-xl,
    .shadow-2xl {
        box-shadow: none !important;
    }

    .bg-gradient-to-br,
    .bg-gradient-to-r {
        background: #ffffff !important;
    }

    .text-white {
        color: #000000 !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .border-gray-200 {
        border-color: #000000;
    }

    .text-gray-600 {
        color: #000000;
    }

    .bg-gray-50 {
        background-color: #ffffff;
    }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Dark mode support preparation */
@media (prefers-color-scheme: dark) {
    /* You can add dark mode styles here if needed */
}

/* Better selection styles */
::selection {
    background-color: #3B82F6;
    color: #ffffff;
}

::-moz-selection {
    background-color: #3B82F6;
    color: #ffffff;
}

/* Ensure proper stacking context */
.relative {
    position: relative;
    z-index: 1;
}

/* Better mobile table/card layouts */
@media (max-width: 768px) {
    .grid {
        gap: 0.75rem;
    }

    .rounded-2xl {
        border-radius: 0.75rem;
    }

    .p-6 {
        padding: 1rem;
    }

    .p-8 {
        padding: 1.5rem;
    }
}
</style>
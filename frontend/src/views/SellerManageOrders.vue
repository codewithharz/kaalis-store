<!-- frontend/src/views/ManageOrders.vue -->
<template>
    <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header with Back Button and Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <button @click="router.back()"
                    class="flex items-center text-gray-600 hover:text-gray-800 transition duration-150">
                    <ArrowLeft class="w-5 h-5 mr-2" />
                    <span class="text-sm sm:text-base">Back to Dashboard</span>
                </button>
                <div class="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                    <!-- Order Status Filter -->
                    <div class="relative">
                        <select v-model="statusFilter"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                            <option value="all">All Orders</option>
                            <option v-for="status in availableStatuses" :key="status" :value="status.toLowerCase()">
                                {{ status }}
                            </option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <!-- Date Range Filter -->
                    <div class="relative">
                        <select v-model="dateRange"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                            >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <!-- Refresh Button -->
                    <button @click="refreshOrders"
                        class="flex items-center justify-center px-4 py-2 bg-white border rounded-md text-gray-600 hover:bg-gray-50">
                        <RefreshCcw class="w-4 h-4 mr-2" />
                        <span class="text-sm sm:text-base">Refresh</span>
                    </button>
                </div>
            </div>

            <!-- Orders Overview Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div v-for="stat in orderStats" :key="stat.title"
                    class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm">{{ stat.title }}</span>
                        <component :is="stat.icon" class="w-5 h-5 text-amber-500" />
                    </div>
                    <div class="text-2xl font-bold">{{ stat.value }}</div>
                </div>
            </div>

            <!-- Orders Table -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <!-- Table Header with Search -->
                <div class="p-4 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 class="text-lg font-semibold">Orders</h2>
                        <div class="relative">
                            <input type="text" v-model="searchQuery" placeholder="Search orders..."
                                class="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>
                </div>

                <!-- Table Content -->
                <div class="overflow-x-auto">

                    <!-- Loading State -->
                    <div v-if="isLoading" class="p-8 text-center">
                        <div class="animate-spin h-8 w-8 border-b-2 border-amber-500 rounded-full mx-auto"></div>
                        <p class="mt-2 text-gray-600">Loading orders...</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="p-8 text-center text-red-600">
                        {{ error }}
                        <button @click="refreshOrders" class="text-blue-600 underline ml-2">Try again</button>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!filteredOrders.length" class="p-8 text-center text-gray-600">
                        No orders found
                    </div>

                    <table v-else class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th @click="toggleSort('rowNumber')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    <div class="flex items-center">
                                        No.
                                    </div>
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100">
                                    <div class="flex items-center">
                                        Order ID
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="id" />
                                    </div>
                                </th>
                                <th @click="toggleSort('customer')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    <div class="flex items-center">
                                        Customer
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="customer" />
                                    </div>
                                </th>
                                <th @click="toggleSort('date')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    <div class="flex items-center">
                                        Date
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="date" />
                                    </div>
                                </th>
                                <th @click="toggleSort('status')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    <div class="flex items-center">
                                        Status
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="status" />
                                    </div>
                                </th>
                                <th @click="toggleSort('total')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    <div class="flex items-center">
                                        Total
                                        <SortIcon :sort-key="sortKey" :sort-order="sortOrder" field="total" />
                                    </div>
                                </th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(order, index) in paginatedOrders" :key="`${order.id}-${index}`"
                                class="hover:bg-gray-50 transition duration-150">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ getRowNumber(index) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm font-medium text-gray-900">{{ order.id }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ order.customer.name }}</div>
                                    <div class="text-sm text-gray-500">{{ order.customer.email }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-500">{{ formatDate(order.date) }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="[
                                        'px-2 py-1 text-xs font-semibold rounded-full',
                                        getStatusClass(order.status.toLowerCase())
                                    ]">
                                        {{ order.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm text-gray-900">₦{{ formatAmount(order.total) }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button @click="viewOrder(order.id)"
                                        class="text-amber-600 hover:text-amber-900">View</button>
                                    <button @click="updateStatus(order.id, order.status)"
                                        class="text-blue-600 hover:text-blue-900">Update</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
                    <!-- Mobile view -->
                    <div class="flex-1 flex justify-between sm:hidden">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>

                    <!-- Desktop view -->
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <!-- Items per page selector -->
                        <div class="flex items-center gap-4">
                            <span class="text-sm text-gray-700">Show</span>
                            <select v-model="itemsPerPage"
                                class="border-gray-300 rounded-md text-sm focus:ring-amber-500 focus:border-amber-500"
                                @change="handleItemsPerPageChange">
                                <option v-for="size in pageSizes" :key="size" :value="size">
                                    {{ size }}
                                </option>
                            </select>
                            <span class="text-sm text-gray-700">entries</span>
                        </div>

                        <!-- Pagination info -->
                        <div class="flex items-center gap-4">
                            <p class="text-sm text-gray-700">
                                Showing
                                <span class="font-medium">{{ paginationStart }}</span>
                                to
                                <span class="font-medium">{{ paginationEnd }}</span>
                                of
                                <span class="font-medium">{{ totalOrders }}</span>
                                results
                            </p>

                            <!-- Page navigation -->
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <!-- First page -->
                                <button @click="goToPage(1)" :disabled="currentPage === 1"
                                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span class="sr-only">First</span>
                                    <ChevronsLeft class="h-5 w-5" />
                                </button>

                                <!-- Previous page -->
                                <button @click="prevPage" :disabled="currentPage === 1"
                                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span class="sr-only">Previous</span>
                                    <ChevronLeft class="h-5 w-5" />
                                </button>

                                <!-- Page numbers -->
                                <template v-for="pageNum in displayedPages" :key="pageNum">
                                    <button v-if="pageNum !== '...'" @click="goToPage(pageNum)" :class="[
                                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                        currentPage === pageNum
                                            ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    ]">
                                        {{ pageNum }}
                                    </button>
                                    <span v-else
                                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                </template>

                                <!-- Next page -->
                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span class="sr-only">Next</span>
                                    <ChevronRight class="h-5 w-5" />
                                </button>

                                <!-- Last page -->
                                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span class="sr-only">Last</span>
                                    <ChevronsRight class="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>


                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-4 rounded-lg flex items-center space-x-3">
                <svg class="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                    </circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <span class="text-gray-700">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
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

        // Add sorting state
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

        // Refs for storing API data
        const orders = ref([]);
        const orderStats = ref([
            { title: 'Total Orders', value: '0', icon: 'ShoppingBag' },
            { title: 'Pending', value: '0', icon: 'Clock' },
            { title: 'Shipped', value: '0', icon: 'Truck' },
            { title: 'Cancelled', value: '0', icon: 'Ban' }
        ]);

        // Load orders data
        const loadOrdersData = async () => {
            try {
                isLoading.value = true;
                error.value = null;

                console.log('Starting to fetch orders...');
                const response = await sellerStore.fetchAllSellerOrders();

                // Better response validation
                if (!response || (!Array.isArray(response) && !Array.isArray(response.data))) {
                    console.error('Invalid API response:', response);
                    error.value = 'Invalid response from API';
                    return;
                }

                const ordersData = Array.isArray(response) ? response : response.data;
                console.log('Parsed orders data:', ordersData);

                // Validate individual order data
                orders.value = ordersData.filter(order => order && order._id).map(order => ({
                    id: order.orderNumber, // Use orderNumber for display in the table
                    _id: order._id,       // Keep the MongoDB ID for backend operations
                    orderId: order.orderId, // Store the generated orderId for reference if needed
                    customer: {
                        name: order.user?.username || order.user?.name || order.customerName || 'N/A',
                        email: order.user?.email || order.customerEmail || 'N/A'
                    },
                    date: order.createdAt || order.date,
                    status: order.status || 'Pending',
                    total: order.totalAmount || order.total || 0,
                    products: Array.isArray(order.products) ? order.products.map(prod => ({
                        id: prod.product?._id || prod.id,
                        name: prod.product?.name || 'Product',
                        quantity: prod.quantity || 0,
                        price: prod.price || 0
                    })) : []
                }));

                await nextTick();
                console.log('Processed orders:', orders.value);

                if (orders.value.length === 0) {
                    console.warn('No orders found in response');
                }

                // Set available statuses
                availableStatuses.value = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

                // Update stats after successful data load
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
                        { title: 'Total Orders', value: stats.total.toString(), icon: 'ShoppingBag' },
                        { title: 'Pending', value: stats.pending.toString(), icon: 'Clock' },
                        { title: 'Processing', value: stats.processing.toString(), icon: 'RefreshCcw' },
                        { title: 'Shipped', value: stats.shipped.toString(), icon: 'Truck' },
                        { title: 'Delivered', value: stats.delivered.toString(), icon: 'Package' },
                        { title: 'Cancelled', value: stats.cancelled.toString(), icon: 'Ban' }
                    ];
                }

            } catch (err) {
                console.error('Error loading orders:', err);
                error.value = err.message || 'Failed to load orders';
                toast.error('Failed to load orders');
            } finally {
                isLoading.value = false;
            }
        };

        // Computed property for displayed page numbers
        const displayedPages = computed(() => {
            const total = totalPages.value;
            const current = currentPage.value;
            const pages = [];

            if (total <= 7) {
                // If total pages are 7 or less, show all pages
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                // Always show first page
                pages.push(1);

                if (current > 3) {
                    pages.push('...');
                }

                // Show pages around current page
                for (let i = Math.max(2, current - 1); i <= Math.min(current + 1, total - 1); i++) {
                    pages.push(i);
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
        });

        // Methods for pagination
        const goToPage = (page) => {
            currentPage.value = Number(page);
        };

        const handleItemsPerPageChange = () => {
            // Ensure itemsPerPage is treated as a number
            itemsPerPage.value = Number(itemsPerPage.value);
            currentPage.value = 1; // Reset to first page
        };

        // Computed properties for filtering and pagination
        const filteredOrders = computed(() => {
            console.log('Computing filtered orders, current orders:', orders.value);

            // Ensure orders is an array
            if (!Array.isArray(orders.value)) {
                console.warn('Orders is not an array');
                return [];
            }

            let filtered = [...orders.value]; // Create a copy of the array

            // Status filtering
            if (statusFilter.value !== 'all') {
                console.log('Filtering by status:', statusFilter.value);
                filtered = filtered.filter(order => {
                    const orderStatus = order?.status?.toLowerCase() || '';
                    const targetStatus = statusFilter.value.toLowerCase();
                    console.log(`Order ${order.id} status: ${orderStatus}, target: ${targetStatus}`);
                    return orderStatus === targetStatus;
                });
            }

            // Search filtering
            if (searchQuery.value) {
                console.log('Filtering by search:', searchQuery.value);
                const query = searchQuery.value.toLowerCase();
                filtered = filtered.filter(order => {
                    const matches = (
                        (order?.id || '').toLowerCase().includes(query) ||
                        (order?.customer?.name || '').toLowerCase().includes(query) ||
                        (order?.customer?.email || '').toLowerCase().includes(query)
                    );
                    console.log(`Order ${order.id} matches search: ${matches}`);
                    return matches;
                });
            }

            // Date filtering
            if (dateRange.value && dateRange.value !== 'all') {
                console.log('Filtering by date range:', dateRange.value);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                filtered = filtered.filter(order => {
                    if (!order.date) {
                        console.warn(`Order ${order.id} has no date`);
                        return false;
                    }

                    const orderDate = new Date(order.date);
                    if (isNaN(orderDate.getTime())) {
                        console.warn(`Order ${order.id} has invalid date: ${order.date}`);
                        return false;
                    }

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
                    console.log(`Order ${order.id} date ${order.date} in range: ${isInRange}`);
                    return isInRange;
                });
            }

            // Apply sorting
            if (sortKey.value) {
                console.log('Sorting by:', sortKey.value, 'in order:', sortOrder.value);
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

                    // Handle invalid dates
                    if (sortKey.value === 'date' && (isNaN(compareA) || isNaN(compareB))) {
                        return 0;
                    }

                    // Determine sort direction
                    const sortMultiplier = sortOrder.value === 'asc' ? 1 : -1;

                    if (compareA < compareB) return -1 * sortMultiplier;
                    if (compareA > compareB) return 1 * sortMultiplier;
                    return 0;
                });
            }

            console.log('Final filtered and sorted orders:', filtered);
            return filtered;
        });

        // Add computed property for row numbers
        const getRowNumber = (index) => {
            const page = Number(currentPage.value) || 1;
            const items = Number(itemsPerPage.value) || 10;
            const rowIndex = Number(index) || 0;
            return ((page - 1) * items) + rowIndex + 1;
        };

        // Pagination computed properties
        const paginatedOrders = computed(() => {
            console.log('Computing paginated orders from:', filteredOrders.value.length, 'orders');
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            console.log(`Pagination range: ${start} to ${end}`);
            const result = filteredOrders.value.slice(start, end);
            console.log('Final paginated orders:', result);
            return result;
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

        // Methods
        const getStatusClass = (status) => {
            const classes = {
                pending: 'bg-yellow-100 text-yellow-800',
                processing: 'bg-blue-100 text-blue-800',
                shipped: 'bg-green-100 text-green-800',
                delivered: 'bg-purple-100 text-purple-800',
                cancelled: 'bg-red-100 text-red-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatAmount = (amount) => {
            return amount.toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        // Actions
        const refreshOrders = async () => {
            try {
                isLoading.value = true;
                error.value = null;
                await loadOrdersData();
                await nextTick(); // Wait for reactivity updates
                toast.success('Orders refreshed successfully');
            } catch (error) {
                console.error('Refresh error:', error);
                toast.error('Failed to refresh orders');
            } finally {
                isLoading.value = false;
            }
        };

        const viewOrder = (orderId) => {
            // Find the full order object using the ID
            const order = orders.value.find(o => o.id === orderId || o._id === orderId);

            if (!order) {
                toast.error('Order not found');
                return;
            }

            // Use the full MongoDB _id for navigation
            router.push({
                name: 'ManageOrderDetails',
                params: { id: order._id }  // Use the full _id instead of the shortened ID
            });
        };

        // Updated status update method
        const updateStatus = async (orderId) => {
            try {
                const order = orders.value.find(o => o.id === orderId || o._id === orderId);
                if (!order) throw new Error('Order not found');

                const currentStatus = order.status.toLowerCase();

                // Define status flow including recovery from cancelled
                const statusFlow = {
                    'pending': 'Processing',
                    'processing': 'Shipped',
                    'shipped': 'Delivered',
                    'delivered': 'Delivered', // Final state
                    'cancelled': 'Pending'  // Allow reactivation to Pending
                };

                const nextStatus = statusFlow[currentStatus];

                if (!nextStatus) {
                    toast.info('No status change available for this order');
                    return;
                }

                // If moving from cancelled to pending, show confirmation
                if (currentStatus === 'cancelled') {
                    if (!window.confirm('Are you sure you want to reactivate this cancelled order?')) {
                        return;
                    }
                }

                isLoading.value = true;
                await sellerStore.updateOrderStatus(order._id, nextStatus);
                await loadOrdersData();

                const message = currentStatus === 'cancelled'
                    ? `Order reactivated and set to ${nextStatus}`
                    : `Order status updated to ${nextStatus}`;

                toast.success(message);
            } catch (error) {
                console.error('Error updating order status:', error);
                toast.error('Failed to update order status');
            } finally {
                isLoading.value = false;
            }
        };

        // Add error boundary component
        const handleError = (error) => {
            console.error('Component Error:', error);
            toast.error('Something went wrong. Please try again.');
        };

        // Update pagination navigation methods
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

        // Watch for changes that affect pagination
        watch([statusFilter, dateRange, searchQuery, itemsPerPage], () => {
            currentPage.value = 1;
        }, { immediate: true });

        // watch(orders, () => {
        //     console.log('Orders updated:', orders.value);
        //     currentPage.value = 1; // Reset to first page when orders change
        // }, { deep: true });

        watch(orders, (newOrders) => {
            console.log('Orders updated:', newOrders?.length, 'orders');
            if (!Array.isArray(newOrders)) {
                console.warn('Orders is not an array');
                return;
            }

            if (newOrders.length === 0) {
                console.warn('Orders array is empty');
                return;
            }

            // Reset page only when we get new orders successfully
            console.log('Resetting to page 1 due to new orders');
            currentPage.value = 1;
        }, { deep: true, immediate: true });

        // Initial data load
        onMounted(loadOrdersData);

        return {
            router,

            // State
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

            // Computed
            filteredOrders,
            paginatedOrders,
            totalOrders,
            totalPages,
            paginationStart,
            paginationEnd,
            displayedPages,

            // Methods
            refreshOrders,
            updateStatus,
            viewOrder,
            prevPage,
            nextPage,
            goToPage,
            handleItemsPerPageChange,
            getRowNumber,
            availableStatuses,
            getStatusClass,
            formatDate,
            formatAmount,
            handleError
        };
    }
};
</script>

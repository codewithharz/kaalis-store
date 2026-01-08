<!-- // frontend/src/views/admin/AdminOrders.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="flex justify-between mb-3 px-8 py-4 bg-white">
            <h2 class="text-2xl font-bold text-gray-800">Orders Management</h2>
            <!-- Time Period Toggle -->
            <div class="flex space-x-2">
                <button v-for="period in ['Today', 'Week', 'Month', 'Year']" :key="period"
                    @click="selectedPeriod = period" :class="[
                        'px-4 py-2 rounded-md text-sm font-medium',
                        selectedPeriod === period
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]">
                    {{ period }}
                </button>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">

            <!-- Total Revenue -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100">
                        <DollarSign class="h-6 w-6 text-green-600" />
                    </div>
                    <!-- <div class="ml-4">
                        <p class="text-gray-500 text-sm">Total Revenue</p>
                        <p class="text-2xl font-semibold">{{ totalRevenueFormatted }}</p>
                    </div> -->

                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">
                            {{ filters.status ? `${filters.status} Revenue` : 'Total Revenue' }}
                        </p>
                        <p class="text-2xl font-semibold">{{ totalRevenueFormatted }}</p>
                    </div>
                </div>
            </div>

            <!-- timeline Revenue -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100">
                        <DollarSign class="h-6 w-6 text-green-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">{{ selectedPeriod }} Revenue</p>
                        <p class="text-2xl font-semibold">{{ filteredRevenue }}</p>
                    </div>
                </div>
            </div>

            <!-- Orders Today -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-purple-100">
                        <CalendarClock class="h-6 w-6 text-purple-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Orders Today</p>
                        <p class="text-2xl font-semibold">{{ todayOrders }}</p>
                    </div>
                </div>
            </div>

            <!-- Total Orders -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100">
                        <ShoppingCartIcon class="h-6 w-6 text-blue-600" />
                    </div>
                    <div class="ml-4">
                        <!-- <p class="text-gray-500 text-sm">Total Orders</p> -->
                        <p class="text-gray-500 text-sm">
                            {{ filters.status ? `${filters.status} Orders` : 'Total Orders' }}
                        </p>
                        <p class="text-2xl font-semibold">{{ orderSummary.total }}</p>
                    </div>
                </div>
            </div>

            <!-- timeline Orders -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100">
                        <ShoppingCartIcon class="h-6 w-6 text-blue-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">
                            {{ selectedPeriod }} Orders
                        </p>
                        <p class="text-2xl font-semibold">{{ filteredOrders }}</p>
                    </div>
                </div>
            </div>

            <!-- Processing Orders -->
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100">
                        <Clock class="h-6 w-6 text-blue-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Processing Today</p>
                        <p class="text-2xl font-semibold">{{ processingToday }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <!-- Payment Methods Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Methods Distribution</h3>
                <div class="h-44">
                    <Doughnut v-if="paymentMethodChartData.labels.length" :data="paymentMethodChartData"
                        :options="chartOptions" />
                </div>
            </div>

            <!-- Platform Fee Summary -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Platform Performance</h3>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Total Platform Fees</span>
                        <span class="font-semibold">{{ totalPlatformFeesFormatted }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Average Order Value</span>
                        <span class="font-semibold">{{ totalAverageOrderValue }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Total Shipping Fees</span>
                        <span class="font-semibold">{{ totalShippingFees }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-3">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Search -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input type="text" v-model="filters.search" placeholder="Order ID, Customer..."
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchOrders">
                            <option value="">All Status</option>
                            <option v-for="status in orderStatuses" :key="status" :value="status">
                                {{ formatStatus(status) }}
                            </option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Date Range -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input type="date" v-model="filters.dateFrom" class="w-full p-2 border rounded-md"
                        @change="fetchOrders">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input type="date" v-model="filters.dateTo" class="w-full p-2 border rounded-md"
                        @change="fetchOrders">
                </div>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="min-w-full">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Order ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Customer</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Payment Method</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Platform Fee</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Vendor Amount</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Date</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Total
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <template v-if="loading">
                            <tr>
                                <td colspan="6" class="px-6 py-4 text-center">
                                    <div class="flex justify-center">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="order in orders" :key="order._id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        #{{ order.orderId }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">
                                        {{ order.user?.username || 'Unknown' }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ order.user?.email }}
                                    </div>
                                </td>


                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.paymentMethod }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                    formatCurrency(order.platformFee) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                    formatCurrency(order.vendorAmount) }}</td>


                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(order.createdAt) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ formatCurrency(order.totalAmount) }}
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="[
                                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                        getStatusClass(order.status)
                                    ]">
                                        {{ order.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button @click="viewOrderDetails(order)"
                                        class="text-blue-600 hover:text-blue-900 mr-3">
                                        View
                                    </button>
                                    <button @click="showUpdateStatus(order)"
                                        class="text-indigo-600 hover:text-indigo-900">
                                        Update
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                        Previous
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Showing
                            <span class="font-medium">{{ startItem }}</span>
                            to
                            <span class="font-medium">{{ endItem }}</span>
                            of
                            <span class="font-medium">{{ totalItems }}</span>
                            results
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                Previous
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Update Status Modal -->
        <div v-if="showStatusModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    Update Order Status
                </h3>
                <form @submit.prevent="updateOrderStatus">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            New Status
                        </label>
                        <div class="relative">
                            <select v-model="newStatus"
                                class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                                <option v-for="status in availableStatuses" :key="status" :value="status">
                                    {{ formatStatus(status) }}
                                </option>
                            </select>
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown class="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Note (optional)
                        </label>
                        <textarea v-model="statusNote" rows="3" class="w-full p-2 border rounded-md"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeStatusModal"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Update Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <OrderDetailsModal v-if="showDetailsModal" :order="selectedOrder" @close="showDetailsModal = false" />
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/store/admin';
import { useProductStore } from '@/store/productStore';
import OrderDetailsModal from './components/OrderDetailsModal.vue'
import {
    XIcon,
    ShoppingCartIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronDown,
    DollarSign,
    Clock,
    CheckCircle,
    CalendarClock
} from 'lucide-vue-next';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';

// Register Chart.js components // Not sure if it is gonna be in here
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title
);

import { Doughnut } from 'vue-chartjs';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

export default {
    name: 'AdminOrders',
    components: {
        XIcon,
        ShoppingCartIcon,
        TruckIcon,
        CheckCircleIcon,
        XCircleIcon,
        ChevronDown,
        DollarSign,
        Clock,
        CheckCircle,
        Doughnut,
        OrderDetailsModal,
        CalendarClock,
    },

    setup() {
        // State
        const adminStore = useAdminStore();
        const productStore = useProductStore();
        const orders = ref([]);
        const selectedOrder = ref(null);
        const loading = ref(false);
        const showStatusModal = ref(false);
        const newStatus = ref('');
        const statusNote = ref('');
        const showDetailsModal = ref(false)
        const totalOrdersCount = ref(0);
        const selectedPeriod = ref('Today');

        // Pagination
        const currentPage = ref(1);
        const totalItems = ref(0);
        const itemsPerPage = ref(10);

        // Filters
        const filters = ref({
            search: '',
            status: '',
            dateFrom: '',
            dateTo: ''
        });

        const orderSummary = ref({
            total: 0,
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        });


        // Constants
        const orderStatuses = [
            'Pending',    // Note the capital first letter to match schema
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
        ];

        // Computed
        const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
        const startItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1);
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

        const availableStatuses = computed(() => {
            const currentStatus = selectedOrder.value?.status;
            switch (currentStatus) {
                case 'pending':
                    return ['processing', 'cancelled'];
                case 'processing':
                    return ['shipped', 'cancelled'];
                case 'shipped':
                    return ['delivered', 'returned'];
                case 'delivered':
                    return ['returned'];
                default:
                    return orderStatuses;
            }
        });

        // const totalRevenue = computed(() => {
        //     return orders.value?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
        // });

        const totalRevenue = computed(() => {
            if (filters.value.status) {
                // Show filtered revenue when status filter is active
                return orders.value?.reduce((sum, order) =>
                    order.status.toLowerCase() === filters.value.status.toLowerCase() ?
                        sum + order.totalAmount : sum, 0) || 0;
            }
            return orders.value?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
        });

        const totalRevenueFormatted = computed(() => formatCurrency(totalRevenue.value));


        const paymentMethodStats = computed(() => {
            const stats = orders.value?.reduce((acc, order) => {
                acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
                return acc;
            }, {});

            return Object.entries(stats || {}).map(([name, value]) => ({
                name,
                value
            }));
        });

        const totalPlatformFees = computed(() => {
            return orders.value?.reduce((sum, order) => sum + order.platformFee, 0) || 0;
        });

        const totalPlatformFeesFormatted = computed(() => formatCurrency(totalPlatformFees.value));

        const averageOrderValue = computed(() => {
            if (!orders.value?.length) return 0;
            return totalRevenue.value / orders.value.length;
        });

        const totalAverageOrderValue = computed(() => formatCurrency(averageOrderValue.value));

        const shippingFees = computed(() => {
            return orders.value?.reduce((sum, order) => sum + order.shippingFee, 0) || 0;
        });

        const totalShippingFees = computed(() => formatCurrency(shippingFees.value));

        const todayOrders = computed(() => {
            const today = new Date().toISOString().split('T')[0];
            return orders.value.filter(order =>
                order.createdAt.split('T')[0] === today
            ).length;
        });

        // const processingToday = computed(() => {
        //     const today = new Date().toISOString().split('T')[0];
        //     return orders.value.filter(order =>
        //         order.createdAt.split('T')[0] === today &&
        //         order.status === 'Processing'
        //     ).length;
        // });

        const processingToday = computed(() => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            return orders.value.filter(order => {
                // Parse the order date
                const orderDate = new Date(order.createdAt);
                const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());

                // Compare dates and check status with proper capitalization
                return orderDay.getTime() === today.getTime() &&
                    order.status === 'Processing';
            }).length;
        });

        const paymentMethodChartData = computed(() => {
            const stats = orders.value?.reduce((acc, order) => {
                acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
                return acc;
            }, {});

            const labels = Object.keys(stats || {});
            const data = Object.values(stats || {});

            return {
                labels,
                datasets: [{
                    data,
                    backgroundColor: [
                        '#3b82f6', // blue
                        '#10b981', // green
                        '#f59e0b', // yellow
                        '#8b5cf6', // purple
                        '#ef4444'  // red
                    ],
                    borderWidth: 1
                }]
            };
        });

        const getDateRange = () => {
            const now = new Date();
            const startDate = new Date();

            switch (selectedPeriod.value) {
                case 'Week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'Month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'Year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    startDate.setHours(0, 0, 0, 0);
            }
            return { startDate, endDate: now };
        };

        const filteredOrders = computed(() => {
            const { startDate } = getDateRange();
            return orders.value.filter(order => new Date(order.createdAt) >= startDate).length;
        });

        const filteredRevenue = computed(() => {
            const { startDate } = getDateRange();
            const total = orders.value
                .filter(order => new Date(order.createdAt) >= startDate)
                .reduce((sum, order) => sum + order.totalAmount, 0);
            return formatCurrency(total);
        });

        // const viewOrderDetails = async (order) => {
        //     try {
        //         selectedOrder.value = order
        //         showDetailsModal.value = true
        //     } catch (error) {
        //         console.error('Error showing order details:', error)
        //         toast.error('Failed to show order details')
        //     }
        // }

        const viewOrderDetails = async (order) => {
            try {
                loading.value = true;

                // Load full product details for each product in the order
                const productsWithDetails = await Promise.all(
                    order.products.map(async (item) => {
                        // Get the product ID correctly - it might be either a string or an object
                        const productId = typeof item.product === 'string' ?
                            item.product :
                            item.product?._id;

                        if (productId) {
                            try {
                                const details = await productStore.fetchProductById(productId);
                                return {
                                    ...item,
                                    product: details || {
                                        name: 'Product not found',
                                        images: []
                                    }
                                };
                            } catch (error) {
                                console.error(`Error fetching product ${productId}:`, error);
                                return {
                                    ...item,
                                    product: {
                                        name: 'Product not found',
                                        images: []
                                    }
                                };
                            }
                        }
                        return item;
                    })
                );

                // Transform the order data with loaded product details
                selectedOrder.value = {
                    ...order,
                    products: productsWithDetails
                };

                showDetailsModal.value = true;
            } catch (error) {
                console.error('Error showing order details:', error);
                toast.error('Failed to load order details');
            } finally {
                loading.value = false;
            }
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#4b5563',
                    bodyColor: '#111827',
                    titleFont: {
                        size: 14,
                        weight: 'normal'
                    },
                    bodyFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: 12,
                    cornerRadius: 6,
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        };

        // Helper function to format numbers with commas
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2
            }).format(amount);
        };

        const fetchOrders = async () => {
            loading.value = true;
            try {
                const result = await adminStore.fetchOrders({
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    status: filters.value.status,
                    search: filters.value.search,
                    dateFrom: filters.value.dateFrom,
                    dateTo: filters.value.dateTo
                });

                if (result.orders) {
                    // Update order summary with totals from API
                    orderSummary.value = {
                        total: result.pagination.total,
                        pending: filters.value.status.toLowerCase() === 'pending' ? result.pagination.total : 0,
                        processing: filters.value.status.toLowerCase() === 'processing' ? result.pagination.total : 0,
                        shipped: filters.value.status.toLowerCase() === 'shipped' ? result.pagination.total : 0,
                        delivered: filters.value.status.toLowerCase() === 'delivered' ? result.pagination.total : 0,
                        cancelled: filters.value.status.toLowerCase() === 'cancelled' ? result.pagination.total : 0
                    };

                    orders.value = result.orders;
                    totalItems.value = result.pagination.total;
                }
            } catch (error) {
                console.error('Error in fetchOrders:', error);
                toast.error('Failed to fetch orders');
            } finally {
                loading.value = false;
            }
        };

        const handleSearch = debounce(() => {
            currentPage.value = 1;
            fetchOrders();
        }, 300);

        const showUpdateStatus = (order) => {
            selectedOrder.value = order;
            newStatus.value = order.status;
            showStatusModal.value = true;
        };

        // In AdminOrders.vue
        const updateOrderStatus = async () => {
            try {
                await adminStore.updateOrderStatus(selectedOrder.value._id, {
                    status: newStatus.value,
                    note: statusNote.value
                });
                closeStatusModal();
                fetchOrders();
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        };

        // const closeStatusModal = () => {
        //     showStatusModal.value = false;
        //     newStatus.value = '';
        //     statusNote.value = '';
        //     selectedOrder.value = null;
        // };

        const closeStatusModal = () => {
            showStatusModal.value = false
            showDetailsModal.value = false
            selectedOrder.value = null
            newStatus.value = ''
            statusNote.value = ''
        }

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchOrders();
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                fetchOrders();
            }
        };

        // Helper functions
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const formatStatus = (status) => {
            return status.charAt(0).toUpperCase() + status.slice(1);
        };

        const getStatusClass = (status) => {
            const classes = {
                Pending: 'bg-yellow-100 text-yellow-800',
                Processing: 'bg-blue-100 text-blue-800',
                Shipped: 'bg-purple-100 text-purple-800',
                Delivered: 'bg-green-100 text-green-800',
                Cancelled: 'bg-red-100 text-red-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        };

        const getTimelineIcon = (type) => {
            const icons = {
                'order_placed': ShoppingCartIcon,
                'processing': TruckIcon,
                'completed': CheckCircleIcon,
                'cancelled': XCircleIcon
            };
            return icons[type] || CheckCircleIcon;
        };

        const getTimelineItemClass = (type) => {
            const classes = {
                'order_placed': 'bg-blue-500',
                'processing': 'bg-yellow-500',
                'completed': 'bg-green-500',
                'cancelled': 'bg-red-500'
            };
            return classes[type] || 'bg-gray-500';
        };

        // Lifecycle hooks
        onMounted(() => {
            fetchOrders();
        });

        return {
            orders,
            selectedOrder,
            loading,
            showStatusModal,
            newStatus,
            statusNote,
            currentPage,
            totalItems,
            totalPages,
            startItem,
            endItem,
            orderSummary,
            formatCurrency,
            totalRevenueFormatted,
            paymentMethodStats,
            totalPlatformFeesFormatted,
            totalAverageOrderValue,
            totalShippingFees,
            todayOrders,
            processingToday,
            filters,
            orderStatuses,
            availableStatuses,
            handleSearch,
            viewOrderDetails,
            showUpdateStatus,
            updateOrderStatus,
            closeStatusModal,
            prevPage,
            nextPage,
            formatDate,
            formatStatus,
            getStatusClass,
            getTimelineIcon,
            getTimelineItemClass,
            fetchOrders,
            paymentMethodChartData,
            chartOptions,
            showDetailsModal,
            selectedPeriod,
            filteredOrders,
            filteredRevenue
        };
    }
};
</script>

<style scoped>
.timeline-line {
    @apply absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200;
}
</style>
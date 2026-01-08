<!-- frontend/src/views/SellerAnalytics.vue -->
<template>
    <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header with Back Button - Mobile Friendly -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <button @click="router.back()"
                    class="flex items-center text-gray-600 hover:text-gray-800 transition duration-150">
                    <ArrowLeft class="w-5 h-5 mr-2" />
                    <span class="text-sm sm:text-base">Back to Dashboard</span>
                </button>
                <div class="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                    <!-- Date Range Selector - Full Width on Mobile -->
                    <div class="relative">
                        <select
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            v-model="dateRange">
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                        </select>
                        <div class="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <button @click="refreshData"
                        class="flex items-center justify-center px-4 py-2 bg-white border rounded-md text-gray-600 hover:bg-gray-50">
                        <RefreshCcw class="w-4 h-4 mr-2" />
                        <span class="text-sm sm:text-base">Refresh</span>
                    </button>
                </div>
            </div>

            <!-- Analytics Content -->
            <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
                <h2 class="text-xl sm:text-2xl font-bold mb-6">Analytics Dashboard</h2>

                <!-- Key Metrics Cards - Scrollable on Mobile -->
                <div class="overflow-x-auto pb-2 -mx-4 px-4 sm:overflow-x-visible sm:pb-0 sm:px-0">
                    <div class="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-max sm:min-w-0">
                        <div v-for="metric in keyMetrics" :key="metric.title"
                            class="w-72 sm:w-auto p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-sm sm:text-base">{{ metric.title }}</span>
                                <component :is="metric.icon" class="w-5 h-5 text-purple-500" />
                            </div>
                            <div class="flex items-baseline">
                                <span class="text-xl sm:text-2xl font-bold">{{ metric.value }}</span>
                                <span :class="[
                                    'ml-2 text-xs sm:text-sm',
                                    metric.trend > 0 ? 'text-green-500' : 'text-red-500'
                                ]">
                                    {{ metric.trend > 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}%
                                </span>
                            </div>
                            <p class="text-xs sm:text-sm text-gray-500 mt-1">vs last period</p>
                        </div>
                    </div>
                </div>

                <!-- Sales Chart - Adjusted Height for Mobile -->
                <div class="mb-6 sm:mb-8 p-4 border rounded-lg mt-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h3 class="text-lg sm:text-xl font-semibold">Sales Overview</h3>
                        <div class="flex space-x-2">
                            <button v-for="view in ['Daily', 'Weekly', 'Monthly']" :key="view"
                                @click="changeTimeView(view.toLowerCase())" :class="[
                                    'px-3 py-1 rounded-md text-xs sm:text-sm',
                                    timeView === view.toLowerCase()
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                ]">
                                {{ view }}
                            </button>
                        </div>
                    </div>
                    <div class="h-60 sm:h-80">
                        <LineChart :data="salesData" :options="chartOptions" />
                    </div>
                </div>

                <!-- Two Column Layout - Stack on Mobile -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Top Products -->
                    <div class="border rounded-lg p-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <h3 class="text-lg sm:text-xl font-semibold">Top Products</h3>
                            <div class="relative">
                                <select
                                    class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                                    v-model="productSort">
                                    <option value="sales">By Sales</option>
                                    <option value="revenue">By Revenue</option>
                                    <option value="growth">By Growth</option>
                                </select>
                                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDown class="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div v-if="sortedProducts && sortedProducts.length === 0"
                                class="text-center text-gray-500 py-4">
                                No product data available
                            </div>
                            <template v-else>
                                <div v-for="product in sortedProducts" :key="product.id"
                                    class="flex flex-col sm:flex-row sm:items-center justify-between p-2 hover:bg-gray-50 rounded gap-2">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: product.color }">
                                        </div>
                                        <span class="text-sm sm:text-base">{{ product.name }}</span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                                        <span class="text-gray-600 text-sm">
                                            {{ formatCurrency(product.revenue) }}
                                        </span>
                                        <span class="text-xs sm:text-sm"
                                            :class="product.growth >= 0 ? 'text-green-500' : 'text-red-500'">
                                            {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Orders Status -->
                    <div class="border rounded-lg p-4">
                        <h3 class="text-lg sm:text-xl font-semibold mb-4">Orders by Status</h3>
                        <div class="h-48 sm:h-64">
                            <DoughnutChart :data="orderStatusData" :options="doughnutOptions" />
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <div v-for="status in orderStatusData.labels" :key="status"
                                class="flex items-center space-x-2">
                                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getStatusColor(status) }">
                                </div>
                                <span class="text-xs sm:text-sm text-gray-600">{{ status }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-4 rounded-lg flex items-center space-x-3">
                <svg class="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Line as LineChart, Doughnut as DoughnutChart } from 'vue-chartjs';
import { ArrowLeft, RefreshCcw, TrendingUp, ShoppingBag, Users, CreditCard, ChevronDown } from 'lucide-vue-next';
import { useSellerStore } from '../store/sellerStore';
import { toast } from 'vue-sonner';

export default {
    components: {
        LineChart,
        DoughnutChart,
        ArrowLeft,
        RefreshCcw,
        TrendingUp,
        ShoppingBag,
        Users,
        CreditCard,
        ChevronDown
    },

    setup() {
        const router = useRouter();
        const sellerStore = useSellerStore();
        const dateRange = ref('90');
        const timeView = ref('daily');
        const productSort = ref('sales');
        const isLoading = ref(false);
        const sellerId = ref(null);

        // Reactive refs for analytics data
        const analyticsData = ref({
            orders: [],
            products: []
        });

        // Computed metrics based on real data
        const keyMetrics = computed(() => {
            const currentOrders = filterOrdersByDateRange(analyticsData.value.orders, dateRange.value);
            const previousOrders = filterOrdersByDateRange(
                analyticsData.value.orders,
                dateRange.value,
                true
            );

            const currentRevenue = calculateTotalRevenue(currentOrders);
            const previousRevenue = calculateTotalRevenue(previousOrders);
            const revenueTrend = calculateTrend(currentRevenue, previousRevenue);

            const currentOrderCount = currentOrders.length;
            const previousOrderCount = previousOrders.length;
            const orderTrend = calculateTrend(currentOrderCount, previousOrderCount);

            const currentCustomers = new Set(currentOrders.map(order => order.customerEmail)).size;
            const previousCustomers = new Set(previousOrders.map(order => order.customerEmail)).size;
            const customerTrend = calculateTrend(currentCustomers, previousCustomers);

            const currentAOV = currentOrderCount ? currentRevenue / currentOrderCount : 0;
            const previousAOV = previousOrderCount ? previousRevenue / previousOrderCount : 0;
            const aovTrend = calculateTrend(currentAOV, previousAOV);

            return [
                {
                    title: 'Total Revenue',
                    value: formatCurrency(currentRevenue),
                    trend: revenueTrend,
                    icon: 'TrendingUp'
                },
                {
                    title: 'Total Orders',
                    value: currentOrderCount.toString(),
                    trend: orderTrend,
                    icon: 'ShoppingBag'
                },
                {
                    title: 'Active Customers',
                    value: currentCustomers.toString(),
                    trend: customerTrend,
                    icon: 'Users'
                },
                {
                    title: 'Average Order Value',
                    value: formatCurrency(currentAOV),
                    trend: aovTrend,
                    icon: 'CreditCard'
                }
            ];
        });

        // Computed sales data for chart
        const salesData = computed(() => {
            const data = processOrdersForChart(
                analyticsData.value.orders,
                timeView.value,
                dateRange.value
            );

            return {
                labels: data.labels,
                datasets: [{
                    label: 'Sales',
                    data: data.values,
                    fill: true,
                    borderColor: '#7C3AED',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4
                }]
            };
        });

        // Computed top products
        const topProducts = computed(() => {
            if (!analyticsData.value.orders || !analyticsData.value.orders.length) {
                return [];
            }
            return processTopProducts(
                analyticsData.value.orders,
                analyticsData.value.products,
                dateRange.value
            );
        });

        // Computed order status data
        const orderStatusData = computed(() => {
            const statusCounts = countOrderStatuses(
                filterOrdersByDateRange(analyticsData.value.orders, dateRange.value)
            );

            return {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#F59E0B', // Pending
                        '#7C3AED', // Processing
                        '#10B981', // Shipped
                        '#6366F1'  // Delivered
                    ]
                }]
            };
        });

        // Helper functions
        const filterOrdersByDateRange = (orders, range, isPrevious = false) => {
            const now = new Date();
            const rangeInDays = parseInt(range);
            const start = isPrevious
                ? new Date(now.getTime() - (rangeInDays * 2 * 24 * 60 * 60 * 1000))
                : new Date(now.getTime() - (rangeInDays * 24 * 60 * 60 * 1000));
            const end = isPrevious
                ? new Date(now.getTime() - (rangeInDays * 24 * 60 * 60 * 1000))
                : now;

            return orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= start && orderDate <= end;
            });
        };

        const calculateTotalRevenue = (orders) => {
            return orders.reduce((sum, order) => sum + (order.total || 0), 0);
        };

        const calculateTrend = (current, previous) => {
            if (!previous) return 0;
            return Number(((current - previous) / previous * 100).toFixed(1));
        };

        const formatCurrency = (amount) => {
            if (amount >= 1000000) {
                return `₦${(amount / 1000000).toFixed(1)}M`;
            } else if (amount >= 1000) {
                return `₦${(amount / 1000).toFixed(1)}K`;
            }
            return `₦${amount.toFixed(2)}`;
        };

        const processOrdersForChart = (orders, view, range) => {
            const rangeInDays = parseInt(range);
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (rangeInDays * 24 * 60 * 60 * 1000));

            let dateFormat;
            let groupingFunction;

            switch (view) {
                case 'daily':
                    dateFormat = { day: 'numeric' };
                    groupingFunction = date => date.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    dateFormat = { week: 'numeric' };
                    groupingFunction = date => {
                        const week = Math.ceil((date.getDate() + date.getDay()) / 7);
                        return `Week ${week}`;
                    };
                    break;
                case 'monthly':
                    dateFormat = { month: 'short' };
                    groupingFunction = date => date.toISOString().slice(0, 7);
                    break;
            }

            const groupedData = new Map();
            orders.forEach(order => {
                const date = new Date(order.date); // Changed from createdAt to date
                if (date >= startDate && date <= endDate) {
                    const key = groupingFunction(date);
                    groupedData.set(key, (groupedData.get(key) || 0) + order.total); // Changed from totalAmount to total
                }
            });

            return {
                labels: Array.from(groupedData.keys()),
                values: Array.from(groupedData.values())
            };
        };

        const processTopProducts = (orders, products, range) => {
            try {
                const currentOrders = filterOrdersByDateRange(orders, range);
                const previousOrders = filterOrdersByDateRange(orders, range, true);

                const productStats = new Map();

                // Process current period
                currentOrders.forEach(order => {
                    if (!Array.isArray(order?.products)) return;

                    order.products.forEach(item => {
                        if (!item?.name) return;

                        const productName = item.name;
                        const stats = productStats.get(productName) || {
                            name: productName,
                            currentSales: 0,
                            currentRevenue: 0,
                            previousSales: 0,
                            previousRevenue: 0
                        };

                        const quantity = parseInt(item.quantity) || 0;
                        const price = parseFloat(item.price) || 0;

                        stats.currentSales += quantity;
                        stats.currentRevenue += item.subtotal || (price * quantity);
                        productStats.set(productName, stats);
                    });
                });

                // Process previous period
                previousOrders.forEach(order => {
                    if (!Array.isArray(order?.products)) return;

                    order.products.forEach(item => {
                        if (!item?.name) return;

                        const productName = item.name;
                        const stats = productStats.get(productName) || {
                            name: productName,
                            currentSales: 0,
                            currentRevenue: 0,
                            previousSales: 0,
                            previousRevenue: 0
                        };

                        const quantity = parseInt(item.quantity) || 0;
                        const price = parseFloat(item.price) || 0;

                        stats.previousSales += quantity;
                        stats.previousRevenue += item.subtotal || (price * quantity);
                        productStats.set(productName, stats);
                    });
                });

                const colors = ['#7C3AED', '#10B981', '#F59E0B', '#6366F1'];

                return Array.from(productStats.values())
                    .map((stats, index) => ({
                        id: index.toString(),
                        name: stats.name,
                        sales: stats.currentSales,
                        revenue: stats.currentRevenue,
                        growth: calculateTrend(stats.currentSales, stats.previousSales),
                        color: colors[index % colors.length]
                    }))
                    .filter(product => product.sales > 0 || product.revenue > 0)
                    .sort((a, b) => {
                        if (productSort.value === 'sales') return b.sales - a.sales;
                        if (productSort.value === 'revenue') return b.revenue - a.revenue;
                        return b.growth - a.growth;
                    })
                    .slice(0, 4);
            } catch (error) {
                console.error('Error processing top products:', error);
                return [];
            }
        };

        const countOrderStatuses = (orders) => {
            const counts = {
                'Pending': 0,
                'Processing': 0,
                'Shipped': 0,
                'Delivered': 0
            };

            orders.forEach(order => {
                const status = order.status || 'Pending';
                if (counts.hasOwnProperty(status)) {
                    counts[status]++;
                }
            });

            return counts;
        };

        // Fetch data
        // In SellerAnalytics.vue
        const fetchAnalytics = async () => {
            isLoading.value = true;
            try {
                // Ensure we have the seller profile
                if (!sellerStore.sellerProfile || !sellerStore.sellerProfile._id) {
                    await sellerStore.loadSellerProfile();
                }

                if (!sellerStore.sellerProfile?._id) {
                    throw new Error('Seller profile not available');
                }

                console.log('Fetching analytics for seller:', sellerStore.sellerProfile._id);

                // Fetch orders and products
                const [orders, products] = await Promise.all([
                    sellerStore.fetchAllSellerOrders(),
                    sellerStore.fetchSellerProducts() // No need to pass sellerId, it will use from store
                ]);

                // Process orders
                const orderData = Array.isArray(orders) ? orders : orders?.data || [];
                const productData = Array.isArray(products) ? products : products?.data || [];

                console.log('Processed orders:', orderData);
                console.log('Processed products:', productData);

                analyticsData.value = {
                    orders: orderData,
                    products: productData
                };

                toast.success('Analytics data updated');
            } catch (error) {
                console.error('Error fetching analytics:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                }
                toast.error(error.message || 'Failed to fetch analytics data');
            } finally {
                isLoading.value = false;
            }
        };

        const changeTimeView = (view) => {
            timeView.value = view;
        };

        const refreshData = () => {
            fetchAnalytics();
        };

        // Chart options
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };

        const doughnutOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            cutout: '70%'
        };

        const getStatusColor = (status) => {
            const colors = {
                'Pending': '#F59E0B',
                'Processing': '#7C3AED',
                'Shipped': '#10B981',
                'Delivered': '#6366F1'
            };
            return colors[status] || '#CBD5E1';
        };

        onMounted(() => {
            fetchAnalytics();
        });

        return {
            router,
            dateRange,
            timeView,
            productSort,
            isLoading,
            keyMetrics,
            salesData,
            chartOptions,
            doughnutOptions,
            topProducts,
            orderStatusData,
            getStatusColor,
            changeTimeView,
            refreshData,
            sortedProducts: computed(() => {
                const products = topProducts.value;
                if (!products || !Array.isArray(products)) return [];
                return products;
            }),
            formatCurrency,  // Add this to be used in template
        };
    }
};
</script>
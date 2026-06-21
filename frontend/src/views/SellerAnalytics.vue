<!-- frontend/src/views/SellerAnalytics.vue -->
<template>
    <div class="min-h-screen bg-slate-50/50 py-6 sm:py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- Header with Back Button - Mobile Friendly -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <button @click="router.back()"
                    class="flex items-center text-slate-600 hover:text-[#ff934b] hover:bg-[#ff934b]/5 px-3 py-2 rounded-xl transition-all duration-200 w-fit active:scale-95"
                >
                    <ArrowLeft class="w-4 h-4 mr-2" />
                    <span class="text-sm font-bold">{{ t('sellerAnalyticsPage.backToDashboard') }}</span>
                </button>
                
                <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <!-- Date Range Selector -->
                    <div class="relative">
                        <select
                            class="appearance-none w-full sm:w-48 bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all cursor-pointer shadow-sm hover:bg-slate-50/50"
                            v-model="dateRange"
                        >
                            <option value="7">{{ t('sellerAnalyticsPage.dateRanges.last7Days') }}</option>
                            <option value="30">{{ t('sellerAnalyticsPage.dateRanges.last30Days') }}</option>
                            <option value="90">{{ t('sellerAnalyticsPage.dateRanges.last90Days') }}</option>
                            <option value="365">{{ t('sellerAnalyticsPage.dateRanges.lastYear') }}</option>
                        </select>
                        <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown class="w-4 h-4" />
                        </div>
                    </div>
                    
                    <!-- Refresh Button -->
                    <button @click="refreshData"
                        class="flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 hover:border-[#ff934b]/30 rounded-xl text-slate-600 hover:text-[#ff934b] hover:bg-[#ff934b]/5 shadow-sm transition-all duration-200 active:scale-95"
                    >
                        <RefreshCcw class="w-4 h-4 mr-2" />
                        <span class="text-sm font-bold">{{ t('sellerAnalyticsPage.refresh') }}</span>
                    </button>
                </div>
            </div>

            <!-- Analytics Content Card -->
            <div class="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-8">
                
                <!-- Page Title -->
                <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] text-white rounded-xl shadow-md">
                        <TrendingUp class="w-5 h-5" />
                    </div>
                    <div>
                        <h2 class="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{{ t('sellerAnalyticsPage.title') }}</h2>
                        <p class="text-xs text-slate-400 font-semibold mt-0.5">{{ t('sellerAnalyticsPage.subtitle', 'Real-time performance metrics and business overview') }}</p>
                    </div>
                </div>

                <!-- Key Metrics Cards - Scrollable on Mobile -->
                <div class="overflow-x-auto pb-2 -mx-6 px-6 sm:overflow-x-visible sm:pb-0 sm:px-0 scrollbar-none">
                    <div class="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 min-w-max sm:min-w-0">
                        <div v-for="metric in keyMetrics" :key="metric.title"
                            class="w-72 sm:w-auto p-5 rounded-2xl border border-slate-100 bg-white hover:border-[#ff934b]/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                        >
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-slate-500 text-xs sm:text-sm font-bold tracking-wide uppercase">{{ metric.title }}</span>
                                <div class="p-2.5 bg-[#ff934b]/10 text-[#ff934b] group-hover:bg-gradient-to-r group-hover:from-[#ff934b] group-hover:to-[#ff5e62] group-hover:text-white rounded-xl transition-all duration-300 shadow-sm">
                                    <component :is="metric.icon" class="w-4.5 h-4.5" />
                                </div>
                            </div>
                            <div class="space-y-1">
                                <div class="flex items-baseline gap-2">
                                    <span class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{{ metric.value }}</span>
                                    <span :class="[
                                        'text-[10px] font-black px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 select-none',
                                        metric.trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    ]">
                                        <span>{{ metric.trend >= 0 ? '↑' : '↓' }}</span>
                                        <span>{{ Math.abs(metric.trend) }}%</span>
                                    </span>
                                </div>
                                <p class="text-[11px] font-semibold text-slate-400">{{ t('sellerAnalyticsPage.vsLastPeriod') }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sales Chart -->
                <div class="p-5 sm:p-6 border border-slate-100 rounded-2xl bg-slate-50/20 shadow-inner-soft">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">{{ t('sellerAnalyticsPage.salesOverview') }}</h3>
                            <p class="text-xs text-slate-400 font-semibold mt-0.5">{{ t('sellerAnalyticsPage.salesOverviewSubtitle', 'Revenue tracking over the selected range') }}</p>
                        </div>
                        <div class="flex items-center gap-1.5 bg-slate-100/60 p-1 rounded-xl self-start sm:self-center">
                            <button v-for="view in timeViewOptions" :key="view.value"
                                @click="changeTimeView(view.value)" :class="[
                                    'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95',
                                    timeView === view.value
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                ]"
                            >
                                {{ view.label }}
                            </button>
                        </div>
                    </div>
                    <div class="h-64 sm:h-80 w-full">
                        <LineChart :data="salesData" :options="chartOptions" />
                    </div>
                </div>

                <!-- Two Column Layout - Stack on Mobile -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Top Products -->
                    <div class="border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight">{{ t('sellerAnalyticsPage.topProducts') }}</h3>
                                    <p class="text-xs text-slate-400 font-semibold mt-0.5">{{ t('sellerAnalyticsPage.topProductsSubtitle', 'Best performing items') }}</p>
                                </div>
                                <div class="relative">
                                    <select
                                        class="appearance-none w-full sm:w-40 bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all cursor-pointer shadow-sm hover:bg-slate-50/50"
                                        v-model="productSort"
                                    >
                                        <option value="sales">{{ t('sellerAnalyticsPage.productSort.bySales') }}</option>
                                        <option value="revenue">{{ t('sellerAnalyticsPage.productSort.byRevenue') }}</option>
                                        <option value="growth">{{ t('sellerAnalyticsPage.productSort.byGrowth') }}</option>
                                    </select>
                                    <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown class="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-3.5">
                                <div v-if="sortedProducts && sortedProducts.length === 0"
                                    class="text-center text-slate-400 font-semibold py-8"
                                >
                                    {{ t('sellerAnalyticsPage.noProductData') }}
                                </div>
                                <template v-else>
                                    <div v-for="product in sortedProducts" :key="product.id"
                                        class="flex items-center justify-between p-3 border border-slate-50 hover:border-[#ff934b]/10 hover:bg-[#ff934b]/5 rounded-xl transition-all duration-200 group gap-3"
                                    >
                                        <div class="flex items-center space-x-3 truncate">
                                            <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" :style="{ backgroundColor: product.color }"></div>
                                            <span class="text-sm font-bold text-slate-700 truncate">{{ product.name }}</span>
                                        </div>
                                        <div class="flex items-center justify-end gap-4 shrink-0">
                                            <span class="text-slate-800 font-black text-sm">
                                                {{ formatCurrency(product.revenue) }}
                                            </span>
                                            <span class="text-xs font-bold px-1.5 py-0.5 rounded-lg select-none"
                                                :class="product.growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
                                            >
                                                {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
                                            </span>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Orders Status -->
                    <div class="border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-1">{{ t('sellerAnalyticsPage.ordersByStatus') }}</h3>
                            <p class="text-xs text-slate-400 font-semibold mb-6">{{ t('sellerAnalyticsPage.ordersByStatusSubtitle', 'Status distribution of all current period orders') }}</p>
                            <div class="h-48 sm:h-56 relative flex items-center justify-center">
                                <DoughnutChart :data="orderStatusData" :options="doughnutOptions" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-50">
                            <div v-for="status in orderStatusData.labels" :key="status"
                                class="flex items-center space-x-2.5"
                            >
                                <div class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" :style="{ backgroundColor: getStatusColor(status) }"></div>
                                <span class="text-xs font-bold text-slate-500 truncate">{{ translateStatus(status) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
            <div class="bg-white border border-slate-100 p-5 rounded-2xl flex items-center space-x-3 shadow-2xl scale-in duration-200">
                <svg class="animate-spin h-5 w-5 text-[#ff934b]" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    >
                    </path>
                </svg>
                <span class="text-slate-700 font-bold text-sm">{{ t('sellerAnalyticsPage.loading') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Line as LineChart, Doughnut as DoughnutChart } from 'vue-chartjs';
import { 
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement 
} from 'chart.js';
import { ArrowLeft, RefreshCcw, TrendingUp, ShoppingBag, Users, CreditCard, ChevronDown } from 'lucide-vue-next';
import { useSellerStore } from '../store/sellerStore';
import { toast } from 'vue-sonner';

// Register Chart.js core elements globally for components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

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
        const { t, locale } = useI18n();
        const router = useRouter();
        const sellerStore = useSellerStore();
        const dateRange = ref('90');
        const timeView = ref('daily');
        const productSort = ref('sales');
        const isLoading = ref(false);

        // Reactive refs for analytics data
        const analyticsData = ref({
            orders: [],
            products: []
        });

        const timeViewOptions = computed(() => ([
            { value: 'daily', label: t('sellerAnalyticsPage.timeViews.daily') },
            { value: 'weekly', label: t('sellerAnalyticsPage.timeViews.weekly') },
            { value: 'monthly', label: t('sellerAnalyticsPage.timeViews.monthly') }
        ]));

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
                    title: t('sellerAnalyticsPage.metrics.totalRevenue'),
                    value: formatCurrency(currentRevenue),
                    trend: revenueTrend,
                    icon: 'TrendingUp'
                },
                {
                    title: t('sellerAnalyticsPage.metrics.totalOrders'),
                    value: currentOrderCount.toString(),
                    trend: orderTrend,
                    icon: 'ShoppingBag'
                },
                {
                    title: t('sellerAnalyticsPage.metrics.activeCustomers'),
                    value: currentCustomers.toString(),
                    trend: customerTrend,
                    icon: 'Users'
                },
                {
                    title: t('sellerAnalyticsPage.metrics.averageOrderValue'),
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
                    label: t('sellerAnalyticsPage.salesDataset', 'Sales'),
                    data: data.values,
                    fill: true,
                    borderColor: '#ff934b',
                    backgroundColor: 'rgba(255, 147, 75, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: '#ff934b',
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#ff5e62',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
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
                    backgroundColor: Object.keys(statusCounts).map(status => getStatusColor(status)),
                    borderWidth: 2,
                    borderColor: '#ffffff'
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
            const currencySymbol = t('sellerAnalyticsPage.currencySymbol', '₦');
            if (amount >= 1000000) {
                return `${currencySymbol}${(amount / 1000000).toFixed(1)}M`;
            } else if (amount >= 1000) {
                return `${currencySymbol}${(amount / 1000).toFixed(1)}K`;
            }
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-NG';
            return `${currencySymbol}${amount.toLocaleString(activeLocale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        };

        const processOrdersForChart = (orders, view, range) => {
            const rangeInDays = parseInt(range);
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - (rangeInDays * 24 * 60 * 60 * 1000));

            let groupingFunction;

            switch (view) {
                case 'daily':
                    groupingFunction = date => date.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    groupingFunction = date => {
                        const week = Math.ceil((date.getDate() + date.getDay()) / 7);
                        return t('sellerAnalyticsPage.weekLabel', { week });
                    };
                    break;
                case 'monthly':
                    groupingFunction = date => date.toISOString().slice(0, 7);
                    break;
            }

            const groupedData = new Map();
            orders.forEach(order => {
                const date = new Date(order.date);
                if (date >= startDate && date <= endDate) {
                    const key = groupingFunction(date);
                    groupedData.set(key, (groupedData.get(key) || 0) + order.total);
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

                const colors = ['#ff934b', '#f59e0b', '#0d9488', '#10b981', '#f43f5e'];

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
                    .slice(0, 5);
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

        const translateStatus = (status) => {
            const key = {
                Pending: 'pending',
                Processing: 'processing',
                Shipped: 'shipped',
                Delivered: 'delivered'
            }[status];

            return key ? t(`sellerAnalyticsPage.statuses.${key}`) : status;
        };

        // Fetch data
        const fetchAnalytics = async () => {
            isLoading.value = true;
            try {
                // Ensure we have the seller profile
                if (!sellerStore.sellerProfile || !sellerStore.sellerProfile._id) {
                    await sellerStore.loadSellerProfile();
                }

                if (!sellerStore.sellerProfile?._id) {
                    throw new Error(t('sellerAnalyticsPage.toasts.sellerProfileUnavailable', 'Seller profile not available'));
                }

                console.log('Fetching analytics for seller:', sellerStore.sellerProfile._id);

                // Fetch orders and products
                const [orders, products] = await Promise.all([
                    sellerStore.fetchAllSellerOrders(),
                    sellerStore.fetchSellerProducts()
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

                toast.success(t('sellerAnalyticsPage.toasts.updated'));
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast.error(error.message || t('sellerAnalyticsPage.toasts.fetchFailed'));
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
                    backgroundColor: 'white',
                    titleColor: '#475569',
                    bodyColor: '#1e293b',
                    titleFont: {
                        size: 12,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12,
                        weight: 'bold'
                    },
                    padding: 12,
                    cornerRadius: 10,
                    borderColor: '#f1f5f9',
                    borderWidth: 1,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: (context) => {
                            return ` ${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        callback: (value) => formatCurrency(value),
                        font: {
                            size: 11
                        },
                        color: '#64748b'
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#64748b'
                    },
                    border: {
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
                },
                tooltip: {
                    backgroundColor: 'white',
                    bodyColor: '#1e293b',
                    bodyFont: {
                        size: 12,
                        weight: 'bold'
                    },
                    padding: 12,
                    cornerRadius: 10,
                    borderColor: '#f1f5f9',
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return ` ${translateStatus(label)}: ${value} ${t('sellerAnalyticsPage.ordersCount', 'orders')}`;
                        }
                    }
                }
            },
            cutout: '75%'
        };

        const getStatusColor = (status) => {
            const colors = {
                'Pending': '#ff934b',      // Brand Coral
                'Processing': '#f59e0b',   // Amber
                'Shipped': '#0d9488',      // Teal
                'Delivered': '#10b981',    // Emerald
                'Cancelled': '#f43f5e'     // Rose
            };
            return colors[status] || '#cbd5e1';
        };

        onMounted(() => {
            fetchAnalytics();
        });

        return {
            router,
            t,
            dateRange,
            timeView,
            timeViewOptions,
            productSort,
            isLoading,
            keyMetrics,
            salesData,
            chartOptions,
            doughnutOptions,
            topProducts,
            orderStatusData,
            getStatusColor,
            translateStatus,
            changeTimeView,
            refreshData,
            sortedProducts: computed(() => {
                const products = topProducts.value;
                if (!products || !Array.isArray(products)) return [];
                return products;
            }),
            formatCurrency
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

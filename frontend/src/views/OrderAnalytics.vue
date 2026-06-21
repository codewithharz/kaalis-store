<template>
    <!-- Modern Chart Grid with Kaali Coral-Orange Branding -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <!-- Revenue Trend -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div class="bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-6 border-b border-orange-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#ff934b] to-[#ff5e62] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp class="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">{{ t('orderAnalyticsPage.revenueTrend.title') }}</h3>
                            <p class="text-xs sm:text-sm text-gray-600">{{ t('orderAnalyticsPage.revenueTrend.subtitle') }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-start sm:self-auto">
                        <div class="px-2 sm:px-3 py-1 bg-orange-100 text-[#ff934b] rounded-full text-xs font-medium">
                            {{ t('orderAnalyticsPage.revenueTrend.monthsCount', { count: Object.keys(monthlyData).length }) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-3 sm:p-6 bg-gradient-to-br from-white to-orange-50/20">
                <div class="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-orange-100/60">
                    <apexchart type="line" :height="chartHeight" :options="revenueChartOptions"
                        :series="revenueSeries" />
                </div>
            </div>
        </div>

        <!-- Order Volume -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div class="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 sm:p-6 border-b border-amber-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <BarChart class="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">{{ t('orderAnalyticsPage.orderVolume.title') }}</h3>
                            <p class="text-xs sm:text-sm text-gray-600">{{ t('orderAnalyticsPage.orderVolume.subtitle') }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-start sm:self-auto">
                        <div class="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            {{ t('orderAnalyticsPage.orderVolume.badge') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-3 sm:p-6 bg-gradient-to-br from-white to-amber-50/20">
                <div class="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-amber-100/60">
                    <apexchart type="line" :height="chartHeight" :options="orderVolumeOptions"
                        :series="orderVolumeSeries" />
                </div>
            </div>
        </div>

        <!-- Popular Products -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div class="bg-gradient-to-r from-rose-50 to-orange-50 p-4 sm:p-6 border-b border-rose-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#ff5e62] to-[#ff934b] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <ShoppingBag class="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">{{ t('orderAnalyticsPage.popularProducts.title') }}</h3>
                            <p class="text-xs sm:text-sm text-gray-600">{{ t('orderAnalyticsPage.popularProducts.subtitle') }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-start sm:self-auto">
                        <div class="px-2 sm:px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
                            {{ t('orderAnalyticsPage.popularProducts.badge') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-3 sm:p-6 bg-gradient-to-br from-white to-rose-50/20">
                <div class="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-rose-100/60">
                    <apexchart type="bar" :height="chartHeight" :options="productsChartOptions"
                        :series="productsSeries" />
                </div>
            </div>
        </div>

        <!-- Order Status Distribution -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div class="bg-gradient-to-r from-orange-50 to-red-50 p-4 sm:p-6 border-b border-orange-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <BarChart2 class="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">{{ t('orderAnalyticsPage.orderStatus.title') }}</h3>
                            <p class="text-xs sm:text-sm text-gray-600">{{ t('orderAnalyticsPage.orderStatus.subtitle') }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-start sm:self-auto">
                        <div class="px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            {{ t('orderAnalyticsPage.orderStatus.badge') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-3 sm:p-6 bg-gradient-to-br from-white to-orange-50/20">
                <div class="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-orange-100/60">
                    <apexchart type="bar" :height="chartHeight" :options="statusChartOptions" :series="statusSeries" />
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useI18n } from 'vue-i18n';
import {
    TrendingUp,
    ShoppingBag,
    BarChart,
    BarChart2,
} from 'lucide-vue-next';

// Kaali brand palette
const BRAND_PRIMARY   = '#ff934b'; // coral-orange
const BRAND_SECONDARY = '#ff5e62'; // coral-red
const BRAND_AMBER     = '#f59e0b';
const BRAND_DARK      = '#c05621'; // darker shade for gradients

export default {
    name: 'OrderAnalytics',
    components: {
        apexchart: VueApexCharts,
        TrendingUp,
        ShoppingBag,
        BarChart,
        BarChart2,
    },
    props: {
        orders: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const { t, locale } = useI18n();

        // Responsive chart height
        const chartHeight = ref(220);
        const updateChartHeight = () => {
            chartHeight.value = window.innerWidth < 640 ? 180 : 220;
        };
        onMounted(() => {
            updateChartHeight();
            window.addEventListener('resize', updateChartHeight);
        });
        onUnmounted(() => window.removeEventListener('resize', updateChartHeight));

        // Process monthly data with proper sorting and validation
        const monthlyData = computed(() => {
            if (!props.orders || !Array.isArray(props.orders) || props.orders.length === 0) {
                return {};
            }

            const data = {};

            props.orders.forEach(order => {
                if (!order || !order.createdAt || !order.totalAmount) return;

                try {
                    const date = new Date(order.createdAt);
                    if (isNaN(date.getTime())) return;

                    const monthYear = `${date.toLocaleString(locale.value, { month: 'short' })} ${date.getFullYear()}`;
                    const sortKey = date.getFullYear() * 12 + date.getMonth();

                    if (!data[monthYear]) {
                        data[monthYear] = { revenue: 0, orders: 0, avgOrderValue: 0, sortKey };
                    }

                    data[monthYear].revenue += parseFloat(order.totalAmount) || 0;
                    data[monthYear].orders += 1;
                } catch (error) {
                    console.error('Error processing order:', error);
                }
            });

            // Calculate averages
            Object.keys(data).forEach(month => {
                data[month].avgOrderValue = data[month].orders > 0
                    ? data[month].revenue / data[month].orders
                    : 0;
            });

            // Sort chronologically
            const sorted = Object.entries(data).sort(([, a], [, b]) => a.sortKey - b.sortKey);
            return Object.fromEntries(sorted);
        });

        const formatLargeNumber = (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toFixed(0);
        };

        const formatCurrency = (value) => {
            return `${t('orderAnalyticsPage.currencySymbol')}${formatLargeNumber(value)}`;
        };

        // ─── Base chart options (Kaali brand) ───────────────────────────────
        const chartDefaultOptions = {
            chart: {
                toolbar: { show: false },
                zoom: { enabled: false },
                fontFamily: 'Inter, sans-serif',
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 600,
                }
            },
            grid: {
                borderColor: '#f3e8e0',
                strokeDashArray: 3,
                xaxis: { lines: { show: false } }
            },
            tooltip: {
                theme: 'light',
                shared: true,
                style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                markers: { radius: 4 }
            },
            stroke: { curve: 'smooth', width: 3 },
            colors: [BRAND_PRIMARY, BRAND_AMBER, BRAND_SECONDARY, BRAND_DARK],
        };

        // ─── Revenue Chart ───────────────────────────────────────────────────
        const revenueSeries = computed(() => [{
            name: t('orderAnalyticsPage.datasets.revenue'),
            data: Object.values(monthlyData.value).map(d => d.revenue || 0)
        }]);

        const revenueChartOptions = computed(() => {
            const categories = Object.keys(monthlyData.value);
            return {
                ...chartDefaultOptions,
                colors: [BRAND_PRIMARY],
                chart: { ...chartDefaultOptions.chart, type: 'line' },
                xaxis: {
                    categories,
                    tickAmount: Math.min(6, categories.length),
                    labels: {
                        style: { colors: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
                        rotate: categories.length > 4 ? -45 : 0,
                        maxHeight: 80
                    },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                yaxis: {
                    labels: {
                        formatter: (v) => formatCurrency(v),
                        style: { colors: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif' }
                    },
                    tickAmount: 5,
                    min: 0,
                    forceNiceScale: true
                },
                tooltip: {
                    ...chartDefaultOptions.tooltip,
                    y: { formatter: (v) => `${t('orderAnalyticsPage.currencySymbol')}${v.toLocaleString(locale.value)}` }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.4,
                        gradientToColors: [BRAND_SECONDARY],
                        inverseColors: false,
                        opacityFrom: 0.85,
                        opacityTo: 0.05
                    }
                },
                markers: { size: 4, colors: [BRAND_PRIMARY], strokeColors: '#fff', strokeWidth: 2 }
            };
        });

        // ─── Order Volume Chart ──────────────────────────────────────────────
        const orderVolumeSeries = computed(() => {
            const monthData = monthlyData.value;
            return [
                {
                    name: t('orderAnalyticsPage.datasets.orders'),
                    data: Object.values(monthData).map(d => d.orders || 0)
                },
                {
                    name: t('orderAnalyticsPage.datasets.averageOrderValue'),
                    data: Object.values(monthData).map(d => d.avgOrderValue || 0)
                }
            ];
        });

        const orderVolumeOptions = computed(() => {
            const categories = Object.keys(monthlyData.value);
            return {
                ...chartDefaultOptions,
                colors: [BRAND_AMBER, BRAND_PRIMARY],
                chart: { ...chartDefaultOptions.chart, type: 'line' },
                xaxis: {
                    categories,
                    tickAmount: Math.min(6, categories.length),
                    labels: {
                        style: { colors: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
                        rotate: categories.length > 4 ? -45 : 0,
                        maxHeight: 80
                    },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                yaxis: [
                    {
                        title: {
                            text: t('orderAnalyticsPage.axes.numberOfOrders'),
                            style: { color: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif' }
                        },
                        tickAmount: 5, min: 0, forceNiceScale: true,
                        labels: {
                            formatter: (v) => Math.round(v),
                            style: { colors: '#9ca3af', fontSize: '11px' }
                        }
                    },
                    {
                        opposite: true,
                        title: {
                            text: t('orderAnalyticsPage.axes.averageOrderValue'),
                            style: { color: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif' }
                        },
                        tickAmount: 5, min: 0, forceNiceScale: true,
                        labels: {
                            formatter: (v) => formatCurrency(v),
                            style: { colors: '#9ca3af', fontSize: '11px' }
                        }
                    }
                ],
                tooltip: {
                    ...chartDefaultOptions.tooltip,
                    y: [
                        { formatter: (v) => Math.round(v) },
                        { formatter: (v) => formatCurrency(v) }
                    ]
                },
                markers: { size: 4, strokeColors: '#fff', strokeWidth: 2 }
            };
        });

        // ─── Popular Products Chart ──────────────────────────────────────────
        const productPopularity = computed(() => {
            if (!props.orders || props.orders.length === 0) return [];

            const popularity = {};
            props.orders.forEach(order => {
                if (order.products && Array.isArray(order.products)) {
                    order.products.forEach(item => {
                        const name = item.product?.name || t('orderAnalyticsPage.unknownProduct');
                        popularity[name] = (popularity[name] || 0) + (item.quantity || 0);
                    });
                }
            });

            return Object.entries(popularity)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);
        });

        const productsSeries = computed(() => [{
            name: t('orderAnalyticsPage.datasets.unitsSold'),
            data: productPopularity.value.map(([, count]) => count)
        }]);

        const productsChartOptions = computed(() => {
            const categories = productPopularity.value.map(([name]) =>
                name.length > 15 ? name.substring(0, 15) + '…' : name
            );
            return {
                ...chartDefaultOptions,
                colors: [BRAND_PRIMARY],
                chart: { ...chartDefaultOptions.chart, type: 'bar' },
                xaxis: {
                    categories,
                    labels: { style: { colors: '#9ca3af', fontSize: '10px', fontFamily: 'Inter, sans-serif' } },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                yaxis: {
                    labels: {
                        formatter: (v) => Math.round(v),
                        style: { colors: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif' }
                    },
                    tickAmount: 5, min: 0, forceNiceScale: true
                },
                tooltip: {
                    ...chartDefaultOptions.tooltip,
                    y: { formatter: (v) => Math.round(v) }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light', type: 'vertical', shadeIntensity: 0.4,
                        gradientToColors: [BRAND_SECONDARY],
                        inverseColors: false, opacityFrom: 1, opacityTo: 0.6
                    }
                },
                plotOptions: { bar: { borderRadius: 6, borderRadiusApplication: 'end', columnWidth: '55%' } }
            };
        });

        // ─── Status Distribution Chart ───────────────────────────────────────
        const statusDistribution = computed(() => {
            const statuses = [
                t('orderAnalyticsPage.statuses.pending'),
                t('orderAnalyticsPage.statuses.processing'),
                t('orderAnalyticsPage.statuses.shipped'),
                t('orderAnalyticsPage.statuses.delivered'),
                t('orderAnalyticsPage.statuses.cancelled'),
            ];
            return statuses.map(status => ({
                status,
                count: props.orders.filter(order => {
                    const normalizedStatus = String(order.status || '').toLowerCase();
                    const localizedStatus = {
                        pending:    t('orderAnalyticsPage.statuses.pending'),
                        processing: t('orderAnalyticsPage.statuses.processing'),
                        shipped:    t('orderAnalyticsPage.statuses.shipped'),
                        delivered:  t('orderAnalyticsPage.statuses.delivered'),
                        cancelled:  t('orderAnalyticsPage.statuses.cancelled'),
                    }[normalizedStatus];
                    return localizedStatus === status;
                }).length
            }));
        });

        const statusSeries = computed(() => [{
            name: t('orderAnalyticsPage.datasets.orders'),
            data: statusDistribution.value.map(item => item.count)
        }]);

        const statusChartOptions = computed(() => {
            const categories = statusDistribution.value.map(item => item.status);
            return {
                ...chartDefaultOptions,
                // Per-bar colors matching status semantics but in brand palette
                colors: [BRAND_AMBER, BRAND_PRIMARY, '#3b82f6', '#22c55e', '#94a3b8'],
                chart: { ...chartDefaultOptions.chart, type: 'bar' },
                xaxis: {
                    categories,
                    labels: { style: { colors: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif' } },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                yaxis: {
                    labels: {
                        formatter: (v) => Math.round(v),
                        style: { colors: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif' }
                    },
                    tickAmount: 5, min: 0, forceNiceScale: true
                },
                tooltip: {
                    ...chartDefaultOptions.tooltip,
                    y: { formatter: (v) => Math.round(v) }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light', type: 'vertical', shadeIntensity: 0.3,
                        inverseColors: false, opacityFrom: 1, opacityTo: 0.7
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 6,
                        borderRadiusApplication: 'end',
                        columnWidth: '55%',
                        distributed: true   // each bar gets its own colour from the array
                    }
                },
                legend: { show: false }
            };
        });

        return {
            monthlyData,
            chartHeight,
            revenueChartOptions,
            revenueSeries,
            orderVolumeOptions,
            orderVolumeSeries,
            productsChartOptions,
            productsSeries,
            statusChartOptions,
            statusSeries,
            t,
            locale
        };
    }
};
</script>

<style scoped>
/* Disable hover scale on mobile */
@media (max-width: 640px) {
    .hover\:scale-\[1\.02\]:hover { transform: none !important; }
}

/* Hide ApexCharts default toolbar */
.apexcharts-toolbar { display: none !important; }

/* Brand-coloured tooltip accents */
:deep(.apexcharts-tooltip) {
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
    border: 1px solid #ffe8d6 !important;
    box-shadow: 0 8px 24px rgba(255, 147, 75, 0.12) !important;
}

:deep(.apexcharts-tooltip-title) {
    background: linear-gradient(135deg, #ff934b, #ff5e62) !important;
    color: white !important;
    border-bottom: none !important;
}

:deep(.apexcharts-active-filters-bar) { background: #ff934b !important; }

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom thin scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: #fef3ec; border-radius: 2px; }
::-webkit-scrollbar-thumb { background: #ffb87a; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #ff934b; }
</style>

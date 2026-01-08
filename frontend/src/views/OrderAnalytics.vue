<template>
    <!-- Modern Chart Grid with Enhanced Mobile Styling -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <!-- Revenue Trend -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <!-- Enhanced Header with Gradient -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 border-b border-gray-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp class="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">Revenue Trend</h3>
                            <p class="text-xs sm:text-sm text-gray-600">Monthly revenue performance</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-start sm:self-auto">
                        <div class="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {{ Object.keys(monthlyData).length }} Months
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chart Container with Modern Styling -->
            <div class="p-3 sm:p-6 bg-gradient-to-br from-white to-blue-50/30">
                <div class="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100">
                    <apexchart type="line" :height="chartHeight" :options="revenueChartOptions"
                        :series="revenueSeries" />
                </div>
            </div>
        </div>

        <!-- Order Volume -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <!-- Enhanced Header with Gradient -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 border-b border-gray-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <BarChart class="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">Order Volume</h3>
                            <p class="text-xs sm:text-sm text-gray-600">Orders and average value</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-start sm:self-auto">
                        <div class="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Dual Axis
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chart Container with Modern Styling -->
            <div class="p-3 sm:p-6 bg-gradient-to-br from-white to-green-50/30">
                <div class="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100">
                    <apexchart type="line" :height="chartHeight" :options="orderVolumeOptions"
                        :series="orderVolumeSeries" />
                </div>
            </div>
        </div>

        <!-- Popular Products -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <!-- Enhanced Header with Gradient -->
            <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-4 sm:p-6 border-b border-gray-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <ShoppingBag class="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">Popular Products</h3>
                            <p class="text-xs sm:text-sm text-gray-600">Top 5 bestselling items</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-start sm:self-auto">
                        <div class="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            Top 5
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chart Container with Modern Styling -->
            <div class="p-3 sm:p-6 bg-gradient-to-br from-white to-purple-50/30">
                <div class="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100">
                    <apexchart type="bar" :height="chartHeight" :options="productsChartOptions"
                        :series="productsSeries" />
                </div>
            </div>
        </div>

        <!-- Order Status Distribution -->
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <!-- Enhanced Header with Gradient -->
            <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-6 border-b border-gray-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <BarChart2 class="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-gray-900">Order Status</h3>
                            <p class="text-xs sm:text-sm text-gray-600">Distribution by status</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-start sm:self-auto">
                        <div class="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            All Status
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chart Container with Modern Styling -->
            <div class="p-3 sm:p-6 bg-gradient-to-br from-white to-amber-50/30">
                <div class="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100">
                    <apexchart type="bar" :height="chartHeight" :options="statusChartOptions" :series="statusSeries" />
                </div>
            </div>
        </div>
    </div>

    <!-- Enhanced Statistics Cards with Mobile-First Design -->
    <div class="mt-4 sm:mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <!-- Total Revenue Card -->
        <div
            class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div class="flex-1">
                    <p class="text-blue-100 text-xs sm:text-sm font-medium">Total Revenue</p>
                    <p class="text-lg sm:text-2xl font-bold">{{ formatCurrency(totalRevenue) }}</p>
                </div>
                <div
                    class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center self-end sm:self-auto">
                    <Wallet class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
            </div>
        </div>

        <!-- Total Orders Card -->
        <div
            class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div class="flex-1">
                    <p class="text-green-100 text-xs sm:text-sm font-medium">Total Orders</p>
                    <p class="text-lg sm:text-2xl font-bold">{{ totalOrders.toLocaleString() }}</p>
                </div>
                <div
                    class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center self-end sm:self-auto">
                    <ShoppingBag class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
            </div>
        </div>

        <!-- Average Order Value Card -->
        <div
            class="bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div class="flex-1">
                    <p class="text-purple-100 text-xs sm:text-sm font-medium">Avg Order Value</p>
                    <p class="text-lg sm:text-2xl font-bold">{{ formatCurrency(averageOrderValue) }}</p>
                </div>
                <div
                    class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center self-end sm:self-auto">
                    <TrendingUp class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
            </div>
        </div>

        <!-- Growth Rate Card -->
        <div
            class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 col-span-2 lg:col-span-1">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div class="flex-1">
                    <p class="text-amber-100 text-xs sm:text-sm font-medium">Growth Rate</p>
                    <p class="text-lg sm:text-2xl font-bold">+{{ growthRate.toFixed(1) }}%</p>
                </div>
                <div
                    class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center self-end sm:self-auto">
                    <BarChart2 class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import {
    Wallet,
    TrendingUp,
    ShoppingBag,
    BarChart,
    BarChart2,
    ZoomIn,
    Download
} from 'lucide-vue-next';

export default {
    name: 'OrderAnalytics',
    components: {
        apexchart: VueApexCharts,
        Wallet,
        TrendingUp,
        ShoppingBag,
        BarChart,
        BarChart2,
        ZoomIn,
        Download
    },
    props: {
        orders: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        // Process monthly data with proper sorting and validation
        const monthlyData = computed(() => {
            if (!props.orders || !Array.isArray(props.orders) || props.orders.length === 0) {
                console.log('No valid orders data available');
                return {};
            }

            const data = {};
            const monthsSet = new Set();

            props.orders.forEach(order => {
                // Validate order data
                if (!order || !order.createdAt || !order.totalAmount) {
                    console.warn('Invalid order data:', order);
                    return;
                }

                try {
                    const date = new Date(order.createdAt);

                    // Validate date
                    if (isNaN(date.getTime())) {
                        console.warn('Invalid date in order:', order.createdAt);
                        return;
                    }

                    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                    const sortKey = date.getFullYear() * 12 + date.getMonth();

                    if (!data[monthYear]) {
                        data[monthYear] = {
                            revenue: 0,
                            orders: 0,
                            avgOrderValue: 0,
                            sortKey: sortKey
                        };
                    }

                    data[monthYear].revenue += parseFloat(order.totalAmount) || 0;
                    data[monthYear].orders += 1;
                    monthsSet.add(monthYear);
                } catch (error) {
                    console.error('Error processing order:', error, order);
                }
            });

            // Calculate average order value
            Object.entries(data).forEach(([month, values]) => {
                data[month].avgOrderValue = values.orders > 0 ? values.revenue / values.orders : 0;
            });

            // Sort by date
            const sortedEntries = Object.entries(data).sort(([, a], [, b]) => a.sortKey - b.sortKey);
            const sortedData = {};
            sortedEntries.forEach(([monthYear, values]) => {
                sortedData[monthYear] = values;
            });

            console.log('Processed monthly data:', sortedData);
            return sortedData;
        });

        const formatLargeNumber = (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toFixed(0);
        };

        const formatCurrency = (value) => {
            return `₦${formatLargeNumber(value)}`;
        };

        // Enhanced computed statistics
        const totalRevenue = computed(() => {
            return props.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        });

        const totalOrders = computed(() => {
            return props.orders.length;
        });

        const averageOrderValue = computed(() => {
            return totalOrders.value > 0 ? totalRevenue.value / totalOrders.value : 0;
        });

        const growthRate = computed(() => {
            const monthlyValues = Object.values(monthlyData.value);
            if (monthlyValues.length < 2) return 0;

            const lastMonth = monthlyValues[monthlyValues.length - 1].revenue;
            const previousMonth = monthlyValues[monthlyValues.length - 2].revenue;

            return previousMonth > 0 ? ((lastMonth - previousMonth) / previousMonth) * 100 : 0;
        });

        const chartDefaultOptions = {
            chart: {
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                fontFamily: 'Inter, sans-serif'
            },
            grid: {
                borderColor: '#e5e7eb',
                strokeDashArray: 3,
                xaxis: {
                    lines: {
                        show: false
                    }
                }
            },
            tooltip: {
                theme: 'light',
                shared: true,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px'
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            colors: ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b']
        };

        // Revenue Chart with enhanced debugging
        const revenueSeries = computed(() => {
            const monthData = monthlyData.value;
            const series = [{
                name: 'Revenue',
                data: Object.values(monthData).map(data => data.revenue || 0)
            }];
            console.log('Revenue series data:', series);
            return series;
        });

        const revenueChartOptions = computed(() => {
            const categories = Object.keys(monthlyData.value);
            console.log('Revenue chart categories:', categories);

            return {
                ...chartDefaultOptions,
                chart: {
                    ...chartDefaultOptions.chart,
                    type: 'line',
                    height: 220
                },
                xaxis: {
                    categories: categories,
                    tickAmount: Math.min(6, categories.length),
                    labels: {
                        style: {
                            colors: '#6b7280',
                            fontSize: '11px',
                            fontFamily: 'Inter, sans-serif'
                        },
                        rotate: categories.length > 4 ? -45 : 0,
                        maxHeight: 80
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        formatter: (value) => formatCurrency(value),
                        style: {
                            colors: '#6b7280',
                            fontSize: '11px',
                            fontFamily: 'Inter, sans-serif'
                        }
                    },
                    tickAmount: 5,
                    min: 0,
                    forceNiceScale: true
                },
                tooltip: {
                    y: {
                        formatter: (value) => `₦${value.toLocaleString()}`
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#6366f1'],
                        inverseColors: false,
                        opacityFrom: 0.8,
                        opacityTo: 0.1
                    }
                }
            };
        });

        // Order Volume Chart with enhanced handling
        const orderVolumeSeries = computed(() => {
            const monthData = monthlyData.value;
            const series = [
                {
                    name: 'Orders',
                    data: Object.values(monthData).map(data => data.orders || 0)
                },
                {
                    name: 'Average Order Value',
                    data: Object.values(monthData).map(data => data.avgOrderValue || 0)
                }
            ];
            console.log('Order volume series data:', series);
            return series;
        });

        const orderVolumeOptions = computed(() => {
            const categories = Object.keys(monthlyData.value);
            console.log('Order volume chart categories:', categories);

            return {
                ...chartDefaultOptions,
                chart: {
                    ...chartDefaultOptions.chart,
                    type: 'line',
                    height: 220
                },
                xaxis: {
                    categories: categories,
                    tickAmount: Math.min(6, categories.length),
                    labels: {
                        style: {
                            colors: '#6b7280',
                            fontSize: '11px',
                            fontFamily: 'Inter, sans-serif'
                        },
                        rotate: categories.length > 4 ? -45 : 0,
                        maxHeight: 80
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: [
                    {
                        title: {
                            text: 'Number of Orders',
                            style: {
                                color: '#6b7280',
                                fontSize: '11px',
                                fontFamily: 'Inter, sans-serif'
                            }
                        },
                        tickAmount: 5,
                        min: 0,
                        labels: {
                            formatter: (value) => Math.round(value),
                            style: {
                                colors: '#6b7280',
                                fontSize: '11px',
                                fontFamily: 'Inter, sans-serif'
                            }
                        },
                        forceNiceScale: true
                    },
                    {
                        opposite: true,
                        title: {
                            text: 'Average Order Value (₦)',
                            style: {
                                color: '#6b7280',
                                fontSize: '11px',
                                fontFamily: 'Inter, sans-serif'
                            }
                        },
                        tickAmount: 5,
                        min: 0,
                        labels: {
                            formatter: (value) => formatCurrency(value),
                            style: {
                                colors: '#6b7280',
                                fontSize: '11px',
                                fontFamily: 'Inter, sans-serif'
                            }
                        },
                        forceNiceScale: true
                    }
                ],
                tooltip: {
                    y: [{
                        formatter: (value) => Math.round(value)
                    }, {
                        formatter: (value) => formatCurrency(value)
                    }]
                }
            };
        });

        // Popular Products Chart with improved data handling
        const productPopularity = computed(() => {
            if (!props.orders || props.orders.length === 0) {
                return [];
            }

            const popularity = {};
            props.orders.forEach(order => {
                if (order.products && Array.isArray(order.products)) {
                    order.products.forEach(item => {
                        const productName = item.product?.name || 'Unknown Product';
                        popularity[productName] = (popularity[productName] || 0) + (item.quantity || 0);
                    });
                }
            });

            return Object.entries(popularity)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);
        });

        const productsSeries = computed(() => [{
            name: 'Units Sold',
            data: productPopularity.value.map(([, count]) => count)
        }]);

        const productsChartOptions = computed(() => {
            const categories = productPopularity.value.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name);
            console.log('Products chart categories:', categories);

            return {
                ...chartDefaultOptions,
                chart: {
                    ...chartDefaultOptions.chart,
                    type: 'bar',
                    height: 220
                },
                xaxis: {
                    categories: categories,
                    labels: {
                        style: {
                            colors: '#6b7280',
                            fontSize: '10px',
                            fontFamily: 'Inter, sans-serif'
                        }
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        formatter: (value) => Math.round(value),
                        style: {
                            colors: '#6b7280',
                            fontSize: '11px',
                            fontFamily: 'Inter, sans-serif'
                        }
                    },
                    tickAmount: 5,
                    min: 0,
                    forceNiceScale: true
                },
                tooltip: {
                    y: {
                        formatter: (value) => Math.round(value)
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#8b5cf6'],
                        inverseColors: false,
                        opacityFrom: 0.8,
                        opacityTo: 0.3
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        borderRadiusApplication: 'end'
                    }
                }
            };
        });

        // Status Distribution Chart
        const statusDistribution = computed(() => {
            const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
            return statuses.map(status => ({
                status,
                count: props.orders.filter(order => order.status === status).length
            }));
        });

        const statusSeries = computed(() => [{
            name: 'Orders',
            data: statusDistribution.value.map(item => item.count)
        }]);

        const statusChartOptions = computed(() => {
            const categories = statusDistribution.value.map(item => item.status);
            console.log('Status chart categories:', categories);

            return {
                ...chartDefaultOptions,
                chart: {
                    ...chartDefaultOptions.chart,
                    type: 'bar',
                    height: 220
                },
                xaxis: {
                    categories: categories,
                    labels: {
                        style: {
                            colors: '#6b7280',
                            fontSize: '11px',
                            fontFamily: 'Inter, sans-serif'
                        }
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        formatter: (value) => Math.round(value),
                        style: {
                            colors: '#6b7280',
                            fontSize: '11px',
                            fontFamily: 'Inter, sans-serif'
                        }
                    },
                    tickAmount: 5,
                    min: 0,
                    forceNiceScale: true
                },
                tooltip: {
                    y: {
                        formatter: (value) => Math.round(value)
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#f97316'],
                        inverseColors: false,
                        opacityFrom: 0.8,
                        opacityTo: 0.3
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        borderRadiusApplication: 'end'
                    }
                },
                colors: ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#6b7280']
            };
        });

        return {
            monthlyData,
            revenueChartOptions,
            revenueSeries,
            orderVolumeOptions,
            orderVolumeSeries,
            productsChartOptions,
            productsSeries,
            statusChartOptions,
            statusSeries,
            formatCurrency,
            totalRevenue,
            totalOrders,
            averageOrderValue,
            growthRate
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

    .hover\:scale-\[1\.02\]:hover,
    .hover\:scale-105:hover {
        transform: none !important;
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

    /* Better grid spacing */
    .gap-3 {
        gap: 0.75rem;
    }

    /* Improved text sizing */
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .text-base {
        font-size: 1rem;
        line-height: 1.5rem;
    }
}

/* Tablet styles */
@media (min-width: 641px) and (max-width: 1024px) {

    /* Re-enable some hover effects for tablets */
    .hover\:scale-\[1\.02\]:hover {
        transform: scale(1.01) !important;
    }

    .hover\:scale-105:hover {
        transform: scale(1.02) !important;
    }

    /* Adjust chart spacing for tablets */
    .gap-4 {
        gap: 1rem;
    }
}

/* Desktop styles */
@media (min-width: 1025px) {

    /* Full hover effects for desktop */
    .hover\:scale-\[1\.02\]:hover {
        transform: scale(1.02) !important;
    }

    .hover\:scale-105:hover {
        transform: scale(1.05) !important;
    }
}

/* Hide ApexCharts toolbar */
.apexcharts-toolbar {
    display: none !important;
}

/* Enhanced responsive grid design */
@media (max-width: 1024px) {
    .grid.grid-cols-1.lg\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 1024px) {
    .grid.grid-cols-1.lg\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* Responsive statistics cards */
@media (max-width: 640px) {
    .grid.grid-cols-2.lg\:grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    /* Better card layout on mobile */
    .bg-gradient-to-br {
        background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
    }

    /* Improved icon positioning */
    .self-end {
        align-self: flex-end;
    }
}

@media (min-width: 1024px) {
    .grid.grid-cols-2.lg\:grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

/* Custom scrollbar for charts */
.apexcharts-canvas {
    border-radius: 8px;
}

/* Enhanced typography */
.apexcharts-text {
    font-family: 'Inter', sans-serif !important;
}

/* Smooth animations */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced focus states for accessibility */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
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

/* Better chart container styling */
.chart-container {
    position: relative;
    background: white;
    border-radius: 0.5rem;
    padding: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}

@media (min-width: 640px) {
    .chart-container {
        border-radius: 0.75rem;
        padding: 1rem;
    }
}

/* Responsive chart headers */
.chart-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: linear-gradient(to right, var(--tw-gradient-stops));
    border-bottom: 1px solid #e5e7eb;
}

@media (min-width: 640px) {
    .chart-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
    }
}

/* Statistics card improvements */
.stats-card {
    background: linear-gradient(to bottom right, var(--tw-gradient-stops));
    border-radius: 0.5rem;
    padding: 0.75rem;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 640px) {
    .stats-card {
        border-radius: 0.75rem;
        padding: 1.5rem;
    }
}

/* Better mobile grid layout for statistics */
@media (max-width: 640px) {
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
    }

    .stats-grid> :nth-child(4) {
        grid-column: span 2;
    }
}

@media (min-width: 1024px) {
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1.5rem;
    }

    .stats-grid> :nth-child(4) {
        grid-column: span 1;
    }
}

/* ApexCharts responsive overrides */
.apexcharts-svg {
    font-family: 'Inter', sans-serif !important;
}

.apexcharts-tooltip {
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
}

@media (max-width: 640px) {
    .apexcharts-tooltip {
        font-size: 10px !important;
    }

    .apexcharts-xaxistooltip {
        font-size: 9px !important;
    }

    .apexcharts-yaxistooltip {
        font-size: 9px !important;
    }
}

/* Loading states for charts */
.chart-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
    background: #f9fafb;
    border-radius: 0.5rem;
}

@media (min-width: 640px) {
    .chart-loading {
        height: 220px;
    }
}

/* Enhanced mobile typography */
@media (max-width: 640px) {
    .mobile-text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .mobile-text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }

    .mobile-text-base {
        font-size: 1rem;
        line-height: 1.5rem;
    }

    .mobile-text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}
</style>
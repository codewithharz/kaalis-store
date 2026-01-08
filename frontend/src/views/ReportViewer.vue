<template>
    <div class="p-6 space-y-8">
        <!-- Report Header -->
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">{{ reportType.charAt(0).toUpperCase() + reportType.slice(1) }}
                Report</h2>
            <div class="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-600">
                {{ formatDateRange(reportData.dateRange) }}
            </div>
        </div>

        <!-- Sales Report Section -->
        <div v-if="reportType === 'sales'" class="space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Total Revenue</h4>
                    <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(reportData.summary.totalRevenue) }}
                    </p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Total Orders</h4>
                    <p class="text-2xl font-bold text-gray-900">{{ reportData.summary.totalOrders }}</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Average Order Value</h4>
                    <p class="text-2xl font-bold text-gray-900">
                        {{ formatCurrency(reportData.summary.totalRevenue / reportData.summary.totalOrders) }}
                    </p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Daily Average</h4>
                    <p class="text-2xl font-bold text-gray-900">
                        {{ formatCurrency(reportData.summary.totalRevenue / reportData.data.length) }}
                    </p>
                </div>
            </div>

            <!-- Sales Chart -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-semibold mb-4">Sales Trend</h3>
                <div class="h-96">
                    <canvas ref="salesChart"></canvas>
                </div>
            </div>

            <!-- Daily Breakdown Table -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="text-lg font-semibold">Daily Breakdown</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date</th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Revenue</th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Orders</th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Order Value</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="item in reportData.data" :key="item._id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ formatDate(item._id) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {{ formatCurrency(item.totalSales) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {{ item.ordersCount }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {{ formatCurrency(item.totalSales / item.ordersCount) }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="bg-gray-50">
                            <tr>
                                <td class="px-6 py-3 text-left text-sm font-medium text-gray-900">Total</td>
                                <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                    {{ formatCurrency(reportData.summary.totalRevenue) }}
                                </td>
                                <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                    {{ reportData.summary.totalOrders }}
                                </td>
                                <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                    {{ formatCurrency(reportData.summary.totalRevenue / reportData.summary.totalOrders)
                                    }}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <!-- Customer Report Section -->
        <div v-if="reportType === 'customers'" class="space-y-6">
            <!-- Customer Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Total Customers</h4>
                    <p class="text-2xl font-bold text-gray-900">{{ reportData.summary.totalCustomers }}</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Average Spend per Customer</h4>
                    <p class="text-2xl font-bold text-gray-900">
                        {{ formatCurrency(getTotalSpent() / reportData.summary.totalCustomers) }}
                    </p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Total Revenue</h4>
                    <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(getTotalSpent()) }}</p>
                </div>
            </div>

            <!-- Customer Table -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="text-lg font-semibold">Customer Details</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer</th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Orders</th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Spent</th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Order Value</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Purchase</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="customer in reportData.data" :key="customer._id"
                                class="hover:bg-gray-50 transition-colors duration-150">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span class="text-sm font-medium text-gray-600">
                                                {{ customer.userDetails.username.charAt(0).toUpperCase() }}
                                            </span>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ customer.userDetails.username }}
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                {{ customer.userDetails.email }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {{ customer.orderCount }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {{ formatCurrency(customer.totalSpent) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                    {{ formatCurrency(customer.totalSpent / customer.orderCount) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ formatDate(customer.lastPurchase) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Report Metadata -->
        <div class="mt-8 text-sm text-gray-500 space-y-1">
            <p class="flex items-center gap-2">
                <span class="font-medium">Generated:</span>
                {{ formatDate(reportData.generatedAt) }}
            </p>
            <p class="flex items-center gap-2">
                <span class="font-medium">Store:</span>
                {{ reportData.seller.storeName }}
            </p>
            <p class="flex items-center gap-2">
                <span class="font-medium">Generation Time:</span>
                {{ reportData.generationTimeMs }}ms
            </p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
    name: 'ReportViewer',
    props: {
        reportData: {
            type: Object,
            required: true
        },
        reportType: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const salesChart = ref(null);
        let chartInstance = null;

        const formatCurrency = (value) => {
            if (!value || isNaN(value)) return '₦0';
            return `₦${new Intl.NumberFormat('en-NG', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value)}`;
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const formatDateRange = (range) => {  // Add this function
            if (!range) return '';  // Handle null/undefined case

            if (typeof range === 'string') {
                return range;
            }

            // Handle invalid dates
            try {
                const startDate = range.startDate ? formatDate(range.startDate) : '';
                const endDate = range.endDate ? formatDate(range.endDate) : '';
                return startDate && endDate ? `${startDate} - ${endDate}` : range;
            } catch (error) {
                console.error('Error formatting date range:', error);
                return range;
            }
        };

        const getTotalSpent = () => {
            if (!props.reportData?.data) return 0;
            return props.reportData.data.reduce((total, customer) => total + customer.totalSpent, 0);
        };

        const initSalesChart = () => {
            if (props.reportType !== 'sales' || !props.reportData?.data) return;

            const ctx = salesChart.value?.getContext('2d');
            if (!ctx) return;

            if (chartInstance) {
                chartInstance.destroy();
            }

            const data = props.reportData.data;
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => new Date(item._id).toLocaleDateString('en-NG', {
                        month: 'short',
                        day: 'numeric'
                    })),
                    datasets: [
                        {
                            label: 'Revenue',
                            data: data.map(item => item.totalSales),
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'revenue'
                        },
                        {
                            label: 'Orders',
                            data: data.map(item => item.ordersCount),
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'orders'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y;
                                    if (context.dataset.yAxisID === 'revenue') {
                                        return `${label}: ${formatCurrency(value)}`;
                                    }
                                    return `${label}: ${value} orders`;
                                }
                            }
                        }
                    },
                    scales: {
                        revenue: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Revenue (₦)',
                                color: '#8b5cf6'
                            },
                            ticks: {
                                callback: value => formatCurrency(value),
                                color: '#8b5cf6'
                            },
                            grid: {
                                drawOnChartArea: true,
                                borderDash: [2, 2]
                            }
                        },
                        orders: {
                            type: 'linear',
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Number of Orders',
                                color: '#10b981'
                            },
                            ticks: {
                                stepSize: 1,
                                color: '#10b981'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        };

        onMounted(() => {
            initSalesChart();
        });

        watch(() => props.reportData, () => {
            initSalesChart();
        }, { deep: true });

        return {
            salesChart,
            formatCurrency,
            formatDate,
            formatDateRange,
            getTotalSpent
        };
    }
};
</script>

<style scoped>
/* Optional: Add custom transitions and animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Enhanced table styles */
table {
    @apply w-full;
}

th {
    @apply font-semibold text-gray-600 uppercase tracking-wider text-xs;
}

td {
    @apply align-middle;
}

tbody tr:hover {
    @apply bg-gray-50;
}

/* Enhanced card styles */
.card {
    @apply bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200;
}

.card:hover {
    @apply shadow-md;
}

/* Custom scrollbar for tables */
.overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #E5E7EB transparent;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    @apply bg-transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    @apply bg-gray-200 rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-300;
}
</style>
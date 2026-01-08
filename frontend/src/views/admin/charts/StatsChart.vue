<!-- frontend/src/views/admin/charts/StatsChart.vue -->
<template>
    <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
            <div class="relative">
                <select v-model="selectedMetric"
                    class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                    <option value="users">Users</option>
                    <option value="orders">Orders</option>
                    <option value="products">Products</option>
                    <option value="revenue">Revenue</option>
                </select>
                <div class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown class="w-5 h-5 text-gray-400" />
                </div>
            </div>
        </div>

        <!-- Chart -->
        <div v-if="chartError" class="h-64 flex items-center justify-center text-red-500">
            {{ chartError }}
        </div>
        <div v-else-if="isLoading" class="h-64 flex items-center justify-center text-gray-500">
            Loading chart data...
        </div>
        <div v-else class="h-64 relative">
            <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
        </div>

        <!-- Stats Summary -->
        <div class="mt-6 grid grid-cols-3 gap-4">
            <div class="text-center">
                <p class="text-sm text-gray-500">Total</p>
                <p class="text-xl font-semibold">{{ formatValue(totals[selectedMetric]) }}</p>
            </div>
            <div class="text-center">
                <p class="text-sm text-gray-500">Average</p>
                <p class="text-xl font-semibold">{{ formatValue(averages[selectedMetric]) }}</p>
            </div>
            <div class="text-center">
                <p class="text-sm text-gray-500">Growth</p>
                <p class="text-xl font-semibold" :class="growthColor">
                    {{ growth[selectedMetric] }}%
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { ChevronDown } from 'lucide-vue-next';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        default: 'Stats Overview'
    }
})

const selectedMetric = ref('revenue')
const isLoading = ref(false)
const chartError = ref('')

const getMetricColor = computed(() => {
    const colors = {
        users: '#3B82F6',    // blue-500
        orders: '#10B981',   // green-500
        products: '#8B5CF6', // purple-500
        revenue: '#F59E0B'   // yellow-500
    }
    return colors[selectedMetric.value]
})

const formatAmount = (value) => {
    if (!Number.isFinite(value) || isNaN(value)) return '₦0.00';
    if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₦${(value / 1000).toFixed(1)}K`;
    return `₦${value.toFixed(2)}`;
};

const chartData = computed(() => {
    try {
        const data = props.data[selectedMetric.value] || []
        return {
            labels: data.map(item =>
                new Date(item.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                })
            ),
            datasets: [
                {
                    label: selectedMetric.value.charAt(0).toUpperCase() + selectedMetric.value.slice(1),
                    data: data.map(item => item.value),
                    borderColor: getMetricColor.value,
                    backgroundColor: `${getMetricColor.value}20`,
                    fill: true,
                    tension: 0.4,
                    pointStyle: false
                }
            ]
        }
    } catch (error) {
        console.error('Error processing chart data:', error)
        chartError.value = 'Error processing chart data'
        return { labels: [], datasets: [] }
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 300
    },
    interaction: {
        mode: 'index',
        intersect: false
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                maxTicksLimit: 7,
                maxRotation: 0,
                font: {
                    size: 12
                },
                color: '#6b7280'
            },
            border: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            border: {
                display: false
            },
            grid: {
                color: '#e2e8f0'
            },
            ticks: {
                maxTicksLimit: 6,
                callback: value => selectedMetric.value === 'revenue' ? formatAmount(value) : value.toLocaleString(),
                font: {
                    size: 12
                },
                color: '#6b7280'
            }
        }
    },
    plugins: {
        legend: {
            display: false
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
                    const value = context.raw
                    if (selectedMetric.value === 'revenue') {
                        return `${selectedMetric.value}: ${formatAmount(value)}`
                    }
                    return `${selectedMetric.value}: ${value.toLocaleString()}`
                }
            }
        }
    }
}

const totals = computed(() => ({
    users: props.data?.totals?.users || 0,
    orders: props.data?.totals?.orders || 0,
    products: props.data?.totals?.products || 0,
    revenue: props.data?.totals?.revenue || 0
}))

const averages = computed(() => ({
    users: props.data?.averages?.users || 0,
    orders: props.data?.averages?.orders || 0,
    products: props.data?.averages?.products || 0,
    revenue: props.data?.averages?.revenue || 0
}))

const growth = computed(() => ({
    users: props.data?.growth?.users || 0,
    orders: props.data?.growth?.orders || 0,
    products: props.data?.growth?.products || 0,
    revenue: props.data?.growth?.revenue || 0
}))

const growthColor = computed(() => {
    const value = growth.value[selectedMetric.value]
    return value >= 0 ? 'text-green-500' : 'text-red-500'
})

const formatValue = (value) => {
    if (selectedMetric.value === 'revenue') {
        return formatAmount(value)
    }
    return value.toLocaleString()
}
</script>
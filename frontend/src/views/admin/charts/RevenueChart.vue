# frontend/src/views/admin/charts/RevenueChart.vue
<template>
    <div class="w-full">
        <div class="flex justify-between items-center mb-4">
            <div class="flex justify-end">
                <div class="relative">
                    <select v-model="selectedPeriod"
                        class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                        :disabled="isLoading">
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                    <div class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown class="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="chartError" class="h-64 flex items-center justify-center text-red-500">
            {{ chartError }}
        </div>
        <div v-else-if="isLoading" class="h-64 flex items-center justify-center text-gray-500">
            Loading chart data...
        </div>
        <div v-else class="h-64 relative">
            <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useAdminStore } from '@/store/admin';
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
} from 'chart.js';
import { Line } from 'vue-chartjs';

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
);

export default {
    name: 'RevenueChart',
    components: { Line, ChevronDown },
    setup() {
        const adminStore = useAdminStore();
        const selectedPeriod = ref('30');
        const isLoading = ref(false);
        const chartError = ref('');
        const chartData = ref({
            labels: [],
            datasets: [{
                label: 'Revenue',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f680',
                fill: true,
                tension: 0.4,
                pointStyle: false
            }]
        });

        const formatAmount = (value) => {
            if (!Number.isFinite(value) || isNaN(value)) return '₦0.00';
            if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `₦${(value / 1000).toFixed(1)}K`;
            return `₦${value.toFixed(2)}`;
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0 // Disable animations
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
                        callback: formatAmount,
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
                        label: (context) => `Revenue: ${formatAmount(context.raw)}`
                    }
                }
            }
        };

        const processData = (revenueData) => {
            if (!Array.isArray(revenueData) || revenueData.length === 0) {
                return { labels: [], values: [] };
            }

            const processedData = revenueData
                .map(item => {
                    try {
                        const date = new Date(item.date);
                        if (isNaN(date.getTime())) return null;

                        return {
                            date,
                            amount: Number(item.amount) || 0
                        };
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean)
                .sort((a, b) => a.date - b.date);

            return {
                labels: processedData.map(item =>
                    item.date.toLocaleDateString('en-NG', {
                        month: 'short',
                        day: 'numeric'
                    })
                ),
                values: processedData.map(item => item.amount)
            };
        };

        const fetchData = async () => {
            if (isLoading.value) return;

            try {
                isLoading.value = true;
                chartError.value = '';

                const response = await adminStore.fetchRevenueStats(Number(selectedPeriod.value));

                if (response?.revenueData?.length) {
                    const { labels, values } = processData(response.revenueData);

                    if (labels.length === 0) {
                        chartError.value = 'No valid revenue data available';
                        return;
                    }

                    chartData.value = {
                        labels,
                        datasets: [{
                            ...chartData.value.datasets[0],
                            data: values
                        }]
                    };
                } else {
                    chartError.value = 'No revenue data available for the selected period';
                }
            } catch (error) {
                console.error('Error fetching revenue data:', error);
                chartError.value = 'Failed to load revenue data';
            } finally {
                isLoading.value = false;
            }
        };

        watch(selectedPeriod, () => {
            fetchData();
        });

        onMounted(() => {
            fetchData();
        });

        return {
            selectedPeriod,
            chartData,
            chartOptions,
            isLoading,
            chartError
        };
    }
};
</script>
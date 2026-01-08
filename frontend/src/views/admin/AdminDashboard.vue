<!-- frontend/src/views/admin/AdminDashboard.vue -->
<template>
    <div>
        <!-- Time Period Selector -->
        <TimePeriodSelector v-model="selectedPeriod" :current-date="periodStartDate"
            :is-current-period="isCurrentPeriod" :is-loading="adminStore.isLoading" @prev="handlePrevPeriod"
            @next="handleNextPeriod" />

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
            <div v-for="stat in stats" :key="stat.title"
                class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center">
                    <div class="p-3 rounded-full" :class="stat.bgColor">
                        <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">{{ stat.title }}</p>
                        <p class="text-2xl font-semibold">
                            <template v-if="adminStore.isLoading">
                                <span class="text-gray-400">Loading...</span>
                            </template>
                            <template v-else>
                                {{ stat.value }}
                            </template>
                        </p>
                        <p class="text-sm" :class="stat.changeColor">
                            {{ stat.change }}% from last period
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Chart -->
        <StatsChart :data="chartData" title="Performance Overview" class="mb-3" />

        <!-- Quick Actions & Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-3">
            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div class="grid grid-cols-2 gap-4">
                    <button @click="router.push('/admin/products/')"
                        class="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center">
                        <Package class="w-6 h-6 text-blue-500 mb-2" />
                        <span class="text-sm">Add Product</span>
                    </button>
                    <button @click="router.push('/admin/orders')"
                        class="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center">
                        <ShoppingCart class="w-6 h-6 text-green-500 mb-2" />
                        <span class="text-sm">View Orders</span>
                    </button>
                    <button @click="router.push('/admin/users')"
                        class="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center">
                        <Users class="w-6 h-6 text-purple-500 mb-2" />
                        <span class="text-sm">Manage Users</span>
                    </button>
                    <button @click="router.push('/admin/settings')"
                        class="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center">
                        <Settings class="w-6 h-6 text-gray-500 mb-2" />
                        <span class="text-sm">Settings</span>
                    </button>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div class="space-y-4">
                    <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
                        <div class="p-2 rounded-full" :class="activity.bgColor">
                            <component :is="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
                        </div>
                        <div>
                            <p class="text-sm font-medium">{{ activity.message }}</p>
                            <p class="text-xs text-gray-500">{{ activity.time }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Revenue & Popular Products -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Revenue Chart -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
                <RevenueChart />
            </div>

            <!-- Popular Products -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Popular Products</h3>
                <div class="space-y-4">
                    <div v-for="product in popularProducts" :key="product.id" class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <img :src="product.image" :alt="product.name" class="w-10 h-10 rounded object-cover">
                            <div>
                                <p class="font-medium">{{ product.name }}</p>
                                <p class="text-sm text-gray-500">{{ product.category }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-medium">₦{{ product.price }}</p>
                            <p class="text-sm text-gray-500">{{ product.sales }} sales</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/store/admin'
import TimePeriodSelector from './components/TimePeriodSelector.vue'
import StatsChart from './charts/StatsChart.vue'
import RevenueChart from './charts/RevenueChart.vue'
import {
    Users,
    Package,
    ShoppingCart,
    Settings,
    AlertCircle,
    DollarSign,
} from 'lucide-vue-next'

const router = useRouter()
const adminStore = useAdminStore()

// Time period management
const selectedPeriod = ref('30d')
const periodStartDate = ref(new Date())
const isCurrentPeriod = ref(true)

// Initialize with default activities
const recentActivities = ref([
    {
        id: 1,
        message: 'New order #1234 received',
        time: '5 minutes ago',
        icon: ShoppingCart,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        id: 2,
        message: 'User John Doe registered',
        time: '10 minutes ago',
        icon: Users,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
    },
    {
        id: 3,
        message: 'Product "iPhone 13" out of stock',
        time: '15 minutes ago',
        icon: AlertCircle,
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600'
    }
])

// Initialize with default products
const popularProducts = ref([
    {
        id: 1,
        name: 'iPhone 13',
        category: 'Electronics',
        price: 999.99,
        sales: 150,
        image: '/placeholder.jpg'
    },
    {
        id: 2,
        name: 'Samsung TV',
        category: 'Electronics',
        price: 799.99,
        sales: 120,
        image: '/placeholder.jpg'
    },
    {
        id: 3,
        name: 'Nike Shoes',
        category: 'Fashion',
        price: 89.99,
        sales: 200,
        image: '/placeholder.jpg'
    }
])

const stats = computed(() => [
    {
        title: 'Total Users',
        value: adminStore.dashboardStats.totalUsers,
        change: adminStore.dashboardStats.userGrowth || 0,
        icon: Users,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        changeColor: adminStore.dashboardStats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'
    },
    {
        title: 'Total Products',
        value: adminStore.dashboardStats.totalProducts,
        change: adminStore.dashboardStats.productGrowth || 0,
        icon: Package,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        changeColor: adminStore.dashboardStats.productGrowth >= 0 ? 'text-green-500' : 'text-red-500'
    },
    {
        title: 'Total Orders',
        value: adminStore.dashboardStats.totalOrders,
        change: adminStore.dashboardStats.orderGrowth || 0,
        icon: ShoppingCart,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        changeColor: adminStore.dashboardStats.orderGrowth >= 0 ? 'text-green-500' : 'text-red-500'
    },
    {
        title: 'Revenue',
        value: `₦${adminStore.dashboardStats.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`,
        change: adminStore.dashboardStats.revenueGrowth || 0,
        icon: DollarSign,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        changeColor: adminStore.dashboardStats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'
    }
])

const chartData = computed(() => ({
    users: adminStore.dashboardStats.userStats || [],
    orders: adminStore.dashboardStats.orderStats || [],
    products: adminStore.dashboardStats.productStats || [],
    revenue: adminStore.dashboardStats.revenueStats || [],
    totals: {
        users: adminStore.dashboardStats.totalUsers,
        orders: adminStore.dashboardStats.totalOrders,
        products: adminStore.dashboardStats.totalProducts,
        revenue: adminStore.dashboardStats.totalRevenue
    },
    averages: {
        users: adminStore.dashboardStats.avgUsers,
        orders: adminStore.dashboardStats.avgOrders,
        products: adminStore.dashboardStats.avgProducts,
        revenue: adminStore.dashboardStats.avgRevenue
    },
    growth: {
        users: adminStore.dashboardStats.userGrowth,
        orders: adminStore.dashboardStats.orderGrowth,
        products: adminStore.dashboardStats.productGrowth,
        revenue: adminStore.dashboardStats.revenueGrowth
    }
}))

const handlePrevPeriod = () => {
    const date = new Date(periodStartDate.value)
    switch (selectedPeriod.value) {
        case '7d':
            date.setDate(date.getDate() - 7)
            break
        case '30d':
            date.setMonth(date.getMonth() - 1)
            break
        case '90d':
            date.setMonth(date.getMonth() - 3)
            break
        case '1y':
            date.setFullYear(date.getFullYear() - 1)
            break
    }
    periodStartDate.value = date
    isCurrentPeriod.value = false
    fetchData()
}

const handleNextPeriod = () => {
    const date = new Date(periodStartDate.value)
    const now = new Date()
    switch (selectedPeriod.value) {
        case '7d':
            date.setDate(date.getDate() + 7)
            break
        case '30d':
            date.setMonth(date.getMonth() + 1)
            break
        case '90d':
            date.setMonth(date.getMonth() + 3)
            break
        case '1y':
            date.setFullYear(date.getFullYear() + 1)
            break
    }
    if (date > now) {
        periodStartDate.value = now
        isCurrentPeriod.value = true
    } else {
        periodStartDate.value = date
        isCurrentPeriod.value = false
    }
    fetchData()
}

const fetchData = async () => {
    try {
        const response = await adminStore.fetchDashboardStats({
            period: selectedPeriod.value,
            startDate: periodStartDate.value
        })
        console.log('Dashboard response:', response)

        // Update activities and products if available
        if (response?.recentActivities?.length) {
            recentActivities.value = response.recentActivities
        }
        if (response?.popularProducts?.length) {
            popularProducts.value = response.popularProducts
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    }
}

// Watch period changes
watch(selectedPeriod, () => {
    periodStartDate.value = new Date()
    isCurrentPeriod.value = true
    fetchData()
})

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.stat-card {
    @apply bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow;
}
</style>
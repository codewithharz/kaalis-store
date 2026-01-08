<!-- frontend/src/views/admin/layout/AdminLayout.vue -->
<template>
    <div class="flex flex-col min-h-screen bg-gray-300">
        <!-- Breadcrumb Navigation -->
        <div class=" shadow-sm">
            <div class="px-8 py-4">
                <div class="flex justify-between items-center">
                    <p class="py- text-gray-600 text-sm ml-4">
                        Admin > {{ currentSection }}
                    </p>
                    <!-- Admin Header Actions -->
                    <div class="flex items-center space-x-6">
                        <!-- Notifications -->
                        <div class="relative">
                            <Bell
                                class="w-6 h-6 text-gray-500 hover:text-[#24a3b5] cursor-pointer transition-colors duration-300"
                                @click="toggleNotifications" />
                            <span v-if="unreadNotifications > 0"
                                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {{ unreadNotifications }}
                            </span>
                        </div>

                        <!-- Admin Profile -->
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full bg-[#24a3b5] text-white flex items-center justify-center">
                                <span class="text-sm font-medium">{{ adminInitials }}</span>
                            </div>
                            <span class="text-gray-700 font-medium">{{ adminName }}</span>
                        </div>

                        <!-- Logout Button -->
                        <button @click="handleLogout"
                            class="text-red-600 hover:text-red-800 flex items-center space-x-1">
                            <LogOut class="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex flex-col lg:flex-row lg:flex-1 overflow-hidden">
            <!-- Sidebar Navigation -->
            <nav class="w-full lg:w-64 bg-white shadow-sm">
                <div class="px-5 pt-5 pb-0 mb-2 border-b-0 border-gray-100">
                    <h1 class="text-2xl font-semibold">Admin Panel</h1>
                </div>
                <div class="p-4">
                    <ul class="flex flex-col space-y-4">
                        <!-- Dashboard -->
                        <li>
                            <router-link to="/admin/dashboard"
                                class="flex items-center space-x-2 px-2 py-1.5 rounded-md text-gray-500 hover:text-white hover:bg-[#24a3b5] transition-all duration-300 ease-in-out"
                                :class="{ 'bg-[#24a3b5] text-white': isCurrentRoute('AdminDashboard') }">
                                <LayoutDashboard class="w-5 h-5" />
                                <span class="font-medium text-sm">Dashboard</span>
                            </router-link>
                        </li>

                        <!-- User Management -->
                        <li class="space-y-2">
                            <div class="relative">
                                <div class="flex items-center space-x-2 px-2 py-1.5">
                                    <Users class="w-5 h-5 text-gray-500" />
                                    <span class="font-medium text-sm text-gray-500">User Management</span>
                                </div>
                                <div class="absolute left-4 h-full w-px bg-[#24a3b5]"></div>
                            </div>
                            <div class="relative ml-7">
                                <div class="absolute left-0 top-0 h-full w-px bg-[#24a3b5]"></div>
                                <ul class="space-y-1">
                                    <li class="relative pl-1">
                                        <div class="absolute -left-3 top-1/2 w-3 h-1 bg-[#24a3b5]"></div>
                                        <router-link to="/admin/users"
                                            class="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-500 hover:text-[#24a3b5] transition-colors duration-300 rounded-md hover:bg-gray-50"
                                            :class="{ 'text-[#24a3b5] bg-gray-50': isCurrentRoute('AdminUsers') }">
                                            <UserCircle class="w-4 h-4" />
                                            <span>All Users</span>
                                        </router-link>
                                    </li>
                                    <li class="relative pl-1">
                                        <div class="absolute left-0 top-1/2 w-2 h-1 bg-[#24a3b5]"></div>
                                        <router-link to="/admin/sellers"
                                            class="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-500 hover:text-[#24a3b5] transition-colors duration-300 rounded-md hover:bg-gray-50"
                                            :class="{ 'text-[#24a3b5] bg-gray-50': isCurrentRoute('AdminSellers') }">
                                            <Store class="w-4 h-4" />
                                            <span>Sellers</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <!-- Product Management -->
                        <li class="space-y-2">
                            <div class="relative">
                                <div class="flex items-center space-x-2 px-2 py-1.5">
                                    <Package class="w-5 h-5 text-gray-500" />
                                    <span class="font-medium text-sm text-gray-500">Products</span>
                                </div>
                                <div class="absolute left-4 h-full w-px bg-[#24a3b5]"></div>
                            </div>
                            <div class="relative ml-7">
                                <div class="absolute left-0 top-0 h-full w-px bg-[#24a3b5]"></div>
                                <ul class="space-y-1">
                                    <li class="relative pl-1">
                                        <div class="absolute -left-3 top-1/2 w-3 h-1 bg-[#24a3b5]"></div>
                                        <router-link to="/admin/products"
                                            class="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-500 hover:text-[#24a3b5] transition-colors duration-300 rounded-md hover:bg-gray-50"
                                            :class="{ 'text-[#24a3b5] bg-gray-50': isCurrentRoute('AdminProducts') }">
                                            <Boxes class="w-4 h-4" />
                                            <span>All Products</span>
                                        </router-link>
                                    </li>
                                    <li class="relative pl-1">
                                        <div class="absolute left-0 top-1/2 w-2 h-1 bg-[#24a3b5]"></div>
                                        <router-link to="/admin/categories"
                                            class="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-500 hover:text-[#24a3b5] transition-colors duration-300 rounded-md hover:bg-gray-50"
                                            :class="{ 'text-[#24a3b5] bg-gray-50': isCurrentRoute('AdminCategories') }">
                                            <FolderTree class="w-4 h-4" />
                                            <span>Categories</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <!-- Orders -->
                        <li class="space-y-2">
                            <div class="relative">
                                <div class="flex items-center space-x-2 px-2 py-1.5">
                                    <ShoppingCart class="w-5 h-5 text-gray-500" />
                                    <span class="font-medium text-sm text-gray-500">Orders</span>
                                </div>
                                <div class="absolute left-4 h-full w-px bg-[#24a3b5]"></div>
                            </div>
                            <div class="relative ml-7">
                                <div class="absolute left-0 top-0 h-full w-px bg-[#24a3b5]"></div>
                                <ul class="space-y-1">
                                    <li class="relative pl-1">
                                        <div class="absolute -left-3 top-1/2 w-3 h-1 bg-[#24a3b5]"></div>
                                        <router-link to="/admin/orders"
                                            class="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-500 hover:text-[#24a3b5] transition-colors duration-300 rounded-md hover:bg-gray-50"
                                            :class="{ 'text-[#24a3b5] bg-gray-50': isCurrentRoute('AdminOrders') }">
                                            <ScrollText class="w-4 h-4" />
                                            <span>All Orders</span>
                                        </router-link>
                                    </li>
                                    <li class="relative pl-1">
                                        <div class="absolute left-0 top-1/2 w-2 h-1 bg-[#24a3b5]"></div>
                                        <router-link to="/admin/payments"
                                            class="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-500 hover:text-[#24a3b5] transition-colors duration-300 rounded-md hover:bg-gray-50"
                                            :class="{ 'text-[#24a3b5] bg-gray-50': isCurrentRoute('AdminPayments') }">
                                            <CreditCard class="w-4 h-4" />
                                            <span>Payments</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <!-- Settings -->
                        <li class="space-y-2">
                            <div class="relative">
                                <div class="flex items-center space-x-2 px-2 py-1.5">
                                    <Settings class="w-5 h-5 text-gray-500" />
                                    <span class="font-medium text-sm text-gray-500">Settings</span>
                                </div>
                                <div class="absolute left-4 h-full w-px bg-[#24a3b5]"></div>
                            </div>
                            <div class="relative ml-7">
                                <div class="absolute left-0 top-0 h-full w-px bg-[#24a3b5]"></div>
                                <ul class="space-y-1">
                                    <li class="relative pl-1">
                                        <div class="absolute -left-3 top-1/2 w-3 h-1 bg-[#24a3b5]"></div>
                                        <router-link to="/admin/settings"
                                            class="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-500 hover:text-[#24a3b5] transition-colors duration-300 rounded-md hover:bg-gray-50"
                                            :class="{ 'text-[#24a3b5] bg-gray-50': isCurrentRoute('AdminSettings') }">
                                            <Sliders class="w-4 h-4" />
                                            <span>Platform Settings</span>
                                        </router-link>
                                    </li>

                                    <li class="relative pl-1">
                                        <div class="absolute left-0 top-1/2 w-2 h-1 bg-[#24a3b5]"></div>
                                        <router-link to="/admin/password-reset"
                                            class="flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-500 hover:text-[#24a3b5] transition-colors duration-300 rounded-md hover:bg-gray-50"
                                            :class="{ 'text-[#24a3b5] bg-gray-50': isCurrentRoute('AdminPayments') }">
                                            <CreditCard class="w-4 h-4" />
                                            <span>Change Password</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col">
                <main class="flex-1 overflow-y-auto px-4 pb-4">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '../../../store/admin'
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Settings,
    Bell,
    LogOut,
    UserCircle,
    Store,
    Boxes,
    FolderTree,
    ScrollText,
    CreditCard,
    Sliders,
} from 'lucide-vue-next'

export default {
    name: 'AdminLayout',
    components: {
        LayoutDashboard,
        Users,
        Package,
        ShoppingCart,
        Settings,
        Bell,
        LogOut,
        UserCircle,
        Store,
        Boxes,
        FolderTree,
        ScrollText,
        CreditCard,
        Sliders,
    },
    setup() {
        const router = useRouter()
        const route = useRoute()
        const adminStore = useAdminStore()
        const unreadNotifications = ref(0)

        onMounted(async () => {
            if (!adminStore.isAdminLoggedIn) {
                router.push({
                    name: 'AdminLogin',
                    query: { redirect: route.fullPath }
                })
                return
            }
        })

        const currentSection = computed(() => {
            return route.name?.replace('Admin', '') || 'Dashboard'
        })

        const adminName = computed(() => {
            return adminStore.adminUser?.username || 'Admin'
        })

        const adminInitials = computed(() => {
            const name = adminStore.adminUser?.username || 'A'
            return name.charAt(0).toUpperCase()
        })

        const handleLogout = () => {
            adminStore.logoutAdmin()
                .then(() => {
                    router.push('/admin/login')
                })
                .catch((error) => {
                    console.error('Logout failed:', error)
                })
        }

        const toggleNotifications = () => {
            // Implement notifications panel toggle
            console.log('Toggle notifications')
        }

        const isCurrentRoute = (routeName) => {
            return route.name === routeName
        }

        watch(
            () => adminStore.isAdminLoggedIn,
            (isLoggedIn) => {
                if (!isLoggedIn) {
                    router.push('/admin/login')
                }
            }
        )

        return {
            currentSection,
            unreadNotifications,
            adminName,
            adminInitials,
            handleLogout,
            toggleNotifications,
            isCurrentRoute
        }
    }
}
</script>

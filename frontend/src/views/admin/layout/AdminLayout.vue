<!-- frontend/src/views/admin/layout/AdminLayout.vue -->
<template>
    <div class="h-screen w-screen overflow-hidden bg-slate-100">
        <div class="flex h-full w-full overflow-hidden">
            <Transition name="admin-fade">
                <div v-if="isMobileNavOpen" class="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
                    @click="closeMobileNav"></div>
            </Transition>

            <aside
                class="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-72 lg:max-w-none lg:translate-x-0 lg:shadow-none"
                :class="isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'" @click.stop>
                <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4 lg:px-6">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#24a3b5]">
                            {{ t('adminLayout.breadcrumbPrefix') }}
                        </p>
                        <h1 class="mt-0 text-xl font-semibold text-slate-900">
                            {{ t('adminLayout.panelTitle') }}
                        </h1>
                    </div>
                    <button type="button"
                        class="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                        @click.stop="closeMobileNav">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto px-4 py-5 lg:px-5">
                    <ul class="space-y-5">
                        <li>
                            <router-link to="/admin/dashboard"
                                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                                :class="linkClass('AdminDashboard')" @click="closeMobileNav">
                                <LayoutDashboard class="h-5 w-5" />
                                <span>{{ t('adminLayout.dashboard') }}</span>
                            </router-link>
                        </li>

                        <li v-for="group in navGroups" :key="group.titleKey" class="space-y-2">
                            <div
                                class="flex items-center gap-3 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                <component :is="group.icon" class="h-4 w-4" />
                                <span>{{ t(group.titleKey) }}</span>
                            </div>
                            <ul class="space-y-1">
                                <li v-for="item in group.items" :key="item.routeName">
                                    <router-link :to="item.to"
                                        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                                        :class="linkClass(item.routeName)" @click="closeMobileNav">
                                        <component :is="item.icon" class="h-4 w-4" />
                                        <span>{{ t(item.labelKey) }}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </aside>

            <div class="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
                <header class="z-30 flex-shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                        <div class="flex min-w-0 items-center gap-3">
                            <button type="button"
                                class="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                                @click="toggleMobileNav">
                                <Menu class="h-5 w-5" />
                            </button>
                            <div class="min-w-0">
                                <p class="truncate text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                    {{ t('adminLayout.breadcrumbPrefix') }}
                                </p>
                                <p class="truncate text-base font-semibold text-slate-900 sm:text-lg">
                                    {{ currentSection }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 sm:gap-4">
                            <button type="button"
                                class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#24a3b5]"
                                @click="toggleNotifications">
                                <Bell class="h-5 w-5" />
                                <span v-if="unreadNotifications > 0"
                                    class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                    {{ unreadNotifications }}
                                </span>
                            </button>

                            <div
                                class="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
                                <div
                                    class="flex h-8 w-8 items-center justify-center rounded-full bg-[#24a3b5] text-white">
                                    <span class="text-sm font-medium">{{ adminInitials }}</span>
                                </div>
                                <span class="max-w-[140px] truncate text-sm font-medium text-slate-700">
                                    {{ adminName }}
                                </span>
                            </div>

                            <button type="button" @click="handleLogout"
                                class="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">
                                <LogOut class="h-4 w-4" />
                                <span class="hidden sm:inline">{{ t('adminLayout.logout') }}</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main class="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
    Banknote,
    Sliders,
    Menu,
    X,
    KeyRound,
    RotateCcw,
    Headphones,
    MessageSquare,
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
        Banknote,
        Sliders,
        Menu,
        X,
        KeyRound,
        RotateCcw,
        Headphones,
        MessageSquare,
    },
    setup() {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n()
        const adminStore = useAdminStore()
        const unreadNotifications = ref(0)
        const isMobileNavOpen = ref(false)

        const navGroups = [
            {
                titleKey: 'adminLayout.userManagement',
                icon: Users,
                items: [
                    { routeName: 'AdminUsers', to: '/admin/users', icon: UserCircle, labelKey: 'adminLayout.allUsers' },
                    { routeName: 'AdminSellers', to: '/admin/sellers', icon: Store, labelKey: 'adminLayout.sellers' },
                ],
            },
            {
                titleKey: 'adminLayout.products',
                icon: Package,
                items: [
                    { routeName: 'AdminProducts', to: '/admin/products', icon: Boxes, labelKey: 'adminLayout.allProducts' },
                    { routeName: 'AdminCategories', to: '/admin/categories', icon: FolderTree, labelKey: 'adminLayout.categories' },
                ],
            },
            {
                titleKey: 'adminLayout.orders',
                icon: ShoppingCart,
                items: [
                    { routeName: 'AdminOrders', to: '/admin/orders', icon: ScrollText, labelKey: 'adminLayout.allOrders' },
                    { routeName: 'AdminPayments', to: '/admin/payments', icon: CreditCard, labelKey: 'adminLayout.payments' },
                    { routeName: 'AdminPayouts', to: '/admin/payouts', icon: Banknote, labelKey: 'adminLayout.payouts' },
                    { routeName: 'AdminReturns', to: '/admin/returns', icon: RotateCcw, labelKey: 'adminLayout.returns' },
                ],
            },
            {
                titleKey: 'adminLayout.support',
                icon: Headphones,
                items: [
                    { routeName: 'AdminSupport', to: '/admin/support', icon: MessageSquare, labelKey: 'adminLayout.supportMessages' },
                ],
            },
            {
                titleKey: 'adminLayout.settings',
                icon: Settings,
                items: [
                    { routeName: 'AdminSettings', to: '/admin/settings', icon: Sliders, labelKey: 'adminLayout.platformSettings' },
                    { routeName: 'AdminPasswordReset', to: '/admin/password-reset', icon: KeyRound, labelKey: 'adminLayout.changePassword' },
                ],
            },
        ]

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
            console.log('Toggle notifications')
        }

        const isCurrentRoute = (routeName) => {
            return route.name === routeName
        }

        const linkClass = (routeName) => {
            return isCurrentRoute(routeName)
                ? 'bg-[#24a3b5] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }

        const closeMobileNav = () => {
            isMobileNavOpen.value = false
        }

        const toggleMobileNav = () => {
            isMobileNavOpen.value = !isMobileNavOpen.value
        }

        watch(
            () => adminStore.isAdminLoggedIn,
            (isLoggedIn) => {
                if (!isLoggedIn) {
                    router.push('/admin/login')
                }
            }
        )

        watch(
            () => route.fullPath,
            () => {
                closeMobileNav()
            }
        )

        return {
            currentSection,
            unreadNotifications,
            adminName,
            adminInitials,
            handleLogout,
            toggleNotifications,
            isCurrentRoute,
            navGroups,
            linkClass,
            isMobileNavOpen,
            toggleMobileNav,
            closeMobileNav,
            t
        }
    }
}
</script>

<style scoped>
.admin-fade-enter-active,
.admin-fade-leave-active {
    transition: opacity 0.2s ease;
}

.admin-fade-enter-from,
.admin-fade-leave-to {
    opacity: 0;
}
</style>

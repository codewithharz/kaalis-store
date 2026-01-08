<template>
    <header class="flex flex-col w-full bg-white shadow-sm">
        <!-- Mobile country selection -->
        <div class="lg:hidden px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100">
            <div class="flex items-center justify-between">
                <span class="text-xs sm:text-sm text-gray-500 truncate">
                    {{ selectedCountry ? `Country: ${selectedCountry}` : 'Select Country' }}
                </span>
                <button @click="openCountryModal"
                    class="text-[#24a6bb] text-xs sm:text-sm font-semibold whitespace-nowrap ml-2">
                    {{ selectedCountry ? 'Change' : 'Select' }}
                </button>
            </div>
        </div>

        <!-- Top bar (desktop) -->
        <div class="hidden lg:block w-full py-2 bg-gray-100">
            <div class="flex justify-between max-w-7xl mx-auto px-4 text-gray-500 text-xs">
                <div class="flex items-center">
                    <span v-if="selectedCountry" class="text-[#24a6bb] font-semibold mr-2">{{ selectedCountry }}</span>
                    <button @click="openCountryModal" class="text-[#374141] hover:text-gray-700 cursor-pointer">
                        Change Country
                    </button>
                </div>
                <div class="flex space-x-2 md:space-x-4">
                    <a href="#" class="hover:text-gray-700 text-[#374141]">My Discount</a>
                    <span class="hidden sm:inline">|</span>
                    <a href="#" class="hover:text-gray-700 text-[#374141]">Coupons</a>
                    <span class="hidden sm:inline">|</span>
                    <router-link to="/become-seller" class="hover:text-gray-700 text-[#374141] cursor-pointer">
                        Sell on Bruthol
                    </router-link>
                    <span class="hidden sm:inline">|</span>
                    <router-link to="/page/help/live-help" class="hover:text-gray-700 text-[#374141] cursor-pointer">
                        Help & Support
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Main navbar -->
        <div class="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 lg:px-8">
            <!-- Hamburger menu (mobile only) -->
            <button @click="toggleMenu" class="lg:hidden text-[#363636] p-1 touch-manipulation">
                <Menu class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <!-- Logo -->
            <div class="flex-shrink-0">
                <router-link to="/" class="inline-block">
                    <img src="../assets/images/logo.png" alt="Bruthol" class="h-12 sm:h-16 lg:h-20 cursor-pointer">
                </router-link>
            </div>

            <!-- Search Bar (Desktop) -->
            <div class="hidden lg:block flex-1 mx-4 max-w-2xl">
                <div class="relative flex items-center">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input v-model="searchQuery" type="text" @keyup.enter="handleSearch"
                        placeholder="Write the product, category or brand you are looking for"
                        class="w-full text-[#363636] bg-[#f3f3f3] pl-10 pr-10 py-2 rounded-l-full focus:outline-none focus:ring-1 focus:ring-[#ff2f62] focus:border-transparent" />
                    <button v-if="searchQuery" @click="clearSearch"
                        class="absolute right-[100px] top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X class="w-4 h-4" />
                    </button>
                    <button @click="handleSearch"
                        class="bg-gradient-to-t from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white font-light py-2 px-4 rounded-r-full focus:outline-none transition duration-300 ease-in-out">
                        Search
                    </button>
                </div>
            </div>

            <!-- User Links -->
            <div class="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <!-- User Dropdown -->
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline"
                            class="flex items-center text-[#363636] hover:text-[#24a6bb] transition duration-300 p-1 sm:p-2 touch-manipulation">
                            <UserRound class="hover:fill-[#24a6bb] w-4 h-4 sm:w-5 sm:h-5" />
                            <span class="text-xs font-medium ml-1 hidden lg:inline">{{ isLoggedIn ? `Hi
                                ${user.username}` : 'Login' }}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-48 sm:w-56">
                        <DropdownMenuLabel>
                            <div
                                class="flex items-center justify-between bg-[#24a3b5] py-2 sm:py-3 px-3 sm:px-4 rounded-t-sm">
                                <div class="flex items-center gap-3 sm:gap-5">
                                    <div
                                        class="bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                                        <CircleUserRound
                                            class="text-[#24a3b5] w-5 h-5 sm:w-7 sm:h-7 rounded-full text-gray-200" />
                                        <img src="../assets/images/Kyrian.png" alt="profile"
                                            class="hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer">
                                    </div>
                                    <div>
                                        <DropdownMenuItem v-if="!isLoggedIn"
                                            class="text-xs hover:text-[#363636] font-medium px-2 py-0">
                                            <router-link to="/login" class="text-white py-1 hover:text-[#24a3b5]">
                                                Login/Register
                                            </router-link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem v-else
                                            class="text-xs hover:text-[#363636] font-medium py-0 hover:text-[#24a3b5]">
                                            <router-link to="/orders" class="text-white py-1 hover:text-[#24a3b5]">
                                                {{ user.username }}
                                            </router-link>
                                        </DropdownMenuItem>
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup v-if="isLoggedIn">
                            <DropdownMenuItem class="flex flex-col items-start space-y-1">
                                <span v-for="item in menuItems" :key="item.label" class="w-full p-1">
                                    <router-link active-class="active-link" :to="item.link"
                                        class="flex items-center text-gray-700 hover:text-[#24a3b5] transition-colors duration-300">
                                        <component :is="item.icon" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                                        <span class="text-xs whitespace-nowrap">{{ item.label }}</span>
                                    </router-link>
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <div v-if="isLoggedIn">
                            <DropdownMenuItem @click="logout">
                                <span class="text-sm">Log out</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <!-- Wishlist Button -->
                <button @click="navigateToWishlist"
                    class="relative text-[#363636] hover:text-[#24a6bb] transition duration-300 p-1 sm:p-2 touch-manipulation">
                    <Heart class="hover:fill-[#24a6bb] w-4 h-4 sm:w-5 sm:h-5" />
                    <span v-if="wishlistCount > 0"
                        class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-[#24a6bb] text-white rounded-full text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                        {{ wishlistCount > 99 ? '99+' : wishlistCount }}
                    </span>
                </button>

                <!-- Cart Button -->
                <button @click="navigateToCart"
                    class="text-[#363636] hover:text-[#24a6bb] transition duration-300 relative p-1 sm:p-2 touch-manipulation">
                    <ShoppingCart class="hover:fill-[#24a6bb] w-4 h-4 sm:w-5 sm:h-5" />
                    <span v-if="cartCount > 0"
                        class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-[#24a6bb] text-white rounded-full text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                        {{ cartCount > 99 ? '99+' : cartCount }}
                    </span>
                </button>

                <!-- Notification Bell -->
                <div class="relative" ref="notificationsRef" v-click-outside="closeNotifications">
                    <button @click="toggleNotifications"
                        class="text-[#363636] hover:text-[#24a6bb] transition duration-300 relative p-1 sm:p-2 touch-manipulation">
                        <Bell class="hover:fill-[#24a6bb] w-4 h-4 sm:w-5 sm:h-5" />
                        <span v-if="unreadCount > 0"
                            class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-[#24a6bb] text-white rounded-full text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                            {{ unreadCount > 99 ? '99+' : unreadCount }}
                        </span>
                    </button>

                    <!-- Notification Dropdown -->
                    <div v-if="showNotifications"
                        class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-200">
                        <div class="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-500">
                            <h3 class="text-base sm:text-lg font-semibold text-white">Notifications</h3>
                        </div>

                        <div class="max-h-80 sm:max-h-[480px] overflow-y-auto">
                            <div v-if="notificationStore.isLoading"
                                class="p-6 sm:p-8 text-center text-gray-500 flex items-center justify-center">
                                <Loader2 class="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                <span class="ml-2 text-sm">Loading notifications...</span>
                            </div>

                            <div v-else-if="notificationStore.notifications.length === 0"
                                class="p-6 sm:p-8 text-center text-gray-500">
                                <InboxIcon class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                                <p class="text-sm">No notifications yet</p>
                            </div>

                            <div v-else class="divide-y divide-gray-100">
                                <div v-for="notification in notificationStore.notifications" :key="notification._id"
                                    class="group hover:bg-gray-50 transition-colors">
                                    <div class="p-3 sm:p-4 flex gap-3 sm:gap-4"
                                        :class="{ 'bg-blue-50/50': !notification.read }">
                                        <!-- Icon based on notification type -->
                                        <div :class="[
                                            'rounded-full p-1.5 sm:p-2 flex-shrink-0',
                                            getNotificationTypeClasses(notification.type)
                                        ]">
                                            <component :is="getNotificationIcon(notification.type)"
                                                class="w-3 h-3 sm:w-5 sm:h-5" />
                                        </div>

                                        <!-- Content -->
                                        <div class="flex-1 min-w-0" @click="handleNotificationClick(notification)">
                                            <p class="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                                                {{ notification.title }}
                                            </p>
                                            <p class="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                                {{ notification.message }}
                                            </p>
                                            <p class="text-xs text-gray-400 mt-1 sm:mt-2">
                                                {{ formatDate(notification.createdAt) }}
                                            </p>
                                        </div>

                                        <!-- Action buttons -->
                                        <div
                                            class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button v-if="!notification.read" @click="markAsRead(notification._id)"
                                                class="text-indigo-600 hover:text-indigo-800 p-1 touch-manipulation">
                                                <CheckCircle class="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search Bar (mobile) -->
        <div class="lg:hidden mx-3 sm:mx-4 mb-2 sm:mb-3">
            <div class="relative flex items-center">
                <Search
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                <input v-model="searchQuery" type="text" @keyup.enter="handleSearch"
                    placeholder="What is on your mind today?"
                    class="w-full text-[#363636] bg-[#f3f3f3] pl-8 sm:pl-10 pr-10 py-2 sm:py-2.5 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#ff2f62] focus:border-transparent" />
                <button v-if="searchQuery" @click="clearSearch"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Mobile menu (slides from left) -->
        <transition name="slide">
            <div v-if="isMenuOpen"
                class="fixed inset-y-0 left-0 w-64 sm:w-72 bg-white shadow-lg z-50 lg:hidden overflow-y-auto"
                v-click-outside="handleClickOutside">
                <div class="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
                    <button @click="toggleMenu" class="text-[#363636] p-1 touch-manipulation">
                        <X class="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <nav class="px-3 sm:px-4 py-4">
                    <!-- User Section (if logged in) -->
                    <div v-if="isLoggedIn" class="mb-6 p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center gap-3">
                            <div class="bg-[#24a3b5] rounded-full w-10 h-10 flex items-center justify-center">
                                <CircleUserRound class="text-white w-6 h-6" />
                            </div>
                            <div>
                                <p class="font-medium text-gray-900 text-sm">{{ user.username }}</p>
                                <p class="text-xs text-gray-500">Welcome back!</p>
                            </div>
                        </div>
                    </div>

                    <!-- Menu Items -->
                    <div v-if="isLoggedIn" class="mb-6">
                        <h3 class="font-semibold text-base mb-3 text-gray-900">My Account</h3>
                        <ul class="space-y-1">
                            <li v-for="item in menuItems" :key="item.label">
                                <router-link :to="item.link" @click="closeMenu"
                                    class="flex items-center text-gray-700 hover:text-[#24a6bb] hover:bg-gray-50 py-2.5 px-3 rounded-lg transition-all duration-200">
                                    <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
                                    <span class="text-sm">{{ item.label }}</span>
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <!-- Categories -->
                    <div class="mb-6">
                        <h3 class="font-semibold text-base mb-3 text-gray-900">Categories</h3>
                        <ul class="space-y-1">
                            <!-- <li v-for="category in mainCategories.slice(0, 8)" :key="category._id"> -->
                            <li v-for="category in mainCategories.slice(7, 16)" :key="category._id">
                                <router-link :to="`/category/${category.slug}`" @click="closeMenu"
                                    class="flex items-center text-gray-700 hover:text-[#24a6bb] hover:bg-gray-50 py-2.5 px-3 rounded-lg transition-all duration-200">
                                    <span class="text-sm">{{ category.name }}</span>
                                </router-link>
                            </li>
                            <!-- when we have above 8 categories -->
                            <!-- <li v-if="mainCategories.length > 8">
                                <button
                                    class="flex items-center text-[#24a6bb] hover:bg-gray-50 py-2.5 px-3 rounded-lg transition-all duration-200 w-full text-left">
                                    <span class="text-sm">View All Categories</span>
                                </button>
                            </li> -->
                        </ul>
                    </div>

                    <!-- Quick Links -->
                    <div class="mb-6">
                        <h3 class="font-semibold text-base mb-3 text-gray-900">Quick Links</h3>
                        <ul class="space-y-1">
                            <li>
                                <router-link to="/become-seller" @click="closeMenu"
                                    class="flex items-center text-gray-700 hover:text-[#24a6bb] hover:bg-gray-50 py-2.5 px-3 rounded-lg transition-all duration-200">
                                    <Store class="w-5 h-5 mr-3" />
                                    <span class="text-sm">Sell on Bruthol</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/page/help/live-help" @click="closeMenu"
                                    class="flex items-center text-gray-700 hover:text-[#24a6bb] hover:bg-gray-50 py-2.5 px-3 rounded-lg transition-all duration-200">
                                    <HelpCircle class="w-5 h-5 mr-3" />
                                    <span class="text-sm">Help & Support</span>
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <!-- Auth Section -->
                    <div class="border-t border-gray-200 pt-4">
                        <div v-if="!isLoggedIn">
                            <router-link to="/login" @click="closeMenu"
                                class="flex items-center justify-center bg-[#24a3b5] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1f8f9e] transition-colors duration-200">
                                <UserRound class="w-5 h-5 mr-2" />
                                <span>Login / Register</span>
                            </router-link>
                        </div>
                        <div v-else>
                            <button @click="logout"
                                class="flex items-center justify-center w-full text-red-600 hover:bg-red-50 py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </transition>

        <!-- Mobile menu overlay -->
        <div v-if="isMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" @click="closeMenu"></div>

        <!-- Country Selection Modal -->
        <CountrySelectionModal :is-open="isCountryModalOpen" @close="closeCountryModal"
            @country-selected="onCountrySelected" />
    </header>
</template>

<script>
import { useNotificationStore } from '../store/notificationStore';
import { format } from 'date-fns';
import { onClickOutside } from '@vueuse/core';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    UserRound, CircleUserRound, Heart, Bell, InboxIcon, Loader2, CheckCircle, ShoppingCart, Search, ChevronRight, Menu, X, PackageOpen,
    Wallet, ShoppingBag, Tag, Bell as SystemBell, Gift, MessageSquare,
    User,
    Box,
    Star,
    Store,
    HelpCircle,
    ChevronDown
} from 'lucide-vue-next';

import { menuItems } from '../utils/menuItems.js';
import { useUserStore } from '../store/user';
import { useCartStore } from '../store/cart';
import { useWishlistStore } from '../store/wishlistStore';
import { toast } from 'vue-sonner';
import { useProductStore } from '../store/productStore.js';
// import Categories from './Categories.vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useCountryStore } from '../store/countryStore';
import CountrySelectionModal from './CountrySelectionModal.vue';
import { useRouter, useRoute } from 'vue-router';
import { clickOutside } from '../utils/clickOutside.js';

export default {
    name: 'Navbar',
    components: {
        // Categories,
        Input,
        Label,
        Popover,
        PopoverContent,
        PopoverTrigger,
        UserRound,
        CircleUserRound,
        Heart,
        Bell, InboxIcon, Loader2, CheckCircle, ShoppingCart, Search, ChevronRight, Menu, X, PackageOpen,
        ShoppingCart, ShoppingBag, Tag, SystemBell, Gift, MessageSquare,
        Search,
        ChevronRight,
        PackageOpen,
        Wallet,
        User,
        Box,
        Star,
        Store,
        HelpCircle,
        ChevronDown,
        Button,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuGroup,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuPortal,
        DropdownMenuSeparator,
        DropdownMenuShortcut,
        DropdownMenuSub,
        DropdownMenuSubContent,
        DropdownMenuSubTrigger,
        DropdownMenuTrigger,
        Menu,
        X,
        CountrySelectionModal
    },

    props: {
        isMenuOpen: Boolean
    },

    emits: ['toggleSidebar', 'closeMenu'],

    directives: {
        clickOutside
    },

    setup(props, { emit }) {
        const userStore = useUserStore();
        const cartStore = useCartStore();
        const wishlistStore = useWishlistStore();
        const router = useRouter();
        const route = useRoute();

        const isLoggedIn = computed(() => userStore.isLoggedIn);
        const user = computed(() => userStore.user || { username: 'Guest' });
        const cartCount = computed(() => cartStore.cartCount);

        const productStore = useProductStore();
        const { categories } = storeToRefs(productStore);

        console.log('categories: ', categories)

        const mainCategories = computed(() => {
            return categories.value ? categories.value.filter(category => !category.parent) : [];
        });

        const isLoading = ref(true);

        const rootCategories = computed(() => {
            return categories.value ? categories.value.filter(category => !category.parent) : [];
        });

        const isCategoryMenuOpen = ref(false);
        const selectedCategory = ref(null);
        let closeTimeout = null;

        const countryStore = useCountryStore();
        const isCountryModalOpen = ref(false);

        const notificationStore = useNotificationStore();
        const showNotifications = ref(false);
        const notificationsRef = ref(null);

        const selectedCountry = computed(() => countryStore.selectedCountry);

        const unreadCount = computed(() => notificationStore.unreadCount);

        // Get total wishlist count using the new getter
        const wishlistCount = computed(() => wishlistStore.totalWishlistProducts);

        const toggleNotifications = async () => {
            showNotifications.value = !showNotifications.value;
            if (showNotifications.value) {
                try {
                    await notificationStore.fetchMyNotifications();
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                    toast.error('Failed to load notifications');
                    showNotifications.value = false;
                }
            }
        };

        const handleNotificationClick = async (notification) => {
            try {
                if (notification.type === 'Message') {
                    const messageId = await notificationStore.handleMessageNotification(notification);
                    if (messageId) {
                        router.push({
                            name: 'MessageDetails',
                            params: { messageId }
                        });
                    }
                } else {
                    // Handle other notification types
                    if (!notification.read) {
                        await notificationStore.markAsRead(notification._id);
                    }

                    if (notification.actionUrl) {
                        router.push(notification.actionUrl);
                    }
                }

                showNotifications.value = false;
            } catch (error) {
                console.error('Error handling notification click:', error);
                toast.error('Failed to process notification');
            }
        };

        const markAsRead = async (notificationId) => {
            try {
                await notificationStore.markAsRead(notificationId);
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        };

        const getNotificationIcon = (type) => {
            const icons = {
                'Order': ShoppingBag,
                'Product': Tag,
                'System': SystemBell,
                'Promotion': Gift,
                'Feedback': MessageSquare
            };
            return icons[type] || SystemBell;
        };

        const getNotificationTypeClasses = (type) => {
            const classes = {
                'Order': 'bg-blue-100 text-blue-600',
                'Product': 'bg-green-100 text-green-600',
                'System': 'bg-purple-100 text-purple-600',
                'Promotion': 'bg-yellow-100 text-yellow-600',
                'Feedback': 'bg-pink-100 text-pink-600'
            };
            return classes[type] || 'bg-gray-100 text-gray-600';
        };

        const formatDate = (date) => {
            return format(new Date(date), 'MMM d, yyyy h:mm a');
        };

        const openCountryModal = () => {
            isCountryModalOpen.value = true;
        };

        const closeCountryModal = () => {
            isCountryModalOpen.value = false;
        };

        const onCountrySelected = (country) => {
            countryStore.setCountry(country);
            closeCountryModal();
        };

        const toggleCategoryMenu = () => {
            isCategoryMenuOpen.value = !isCategoryMenuOpen.value;
            if (isCategoryMenuOpen.value && rootCategories.value.length > 0) {
                showSubcategories(rootCategories.value[11]); //default category
            }
        };

        const showSubcategories = (category) => {
            selectedCategory.value = category;
            isCategoryMenuOpen.value = true;
            cancelHideSubcategories();
        };


        const hideSubcategories = () => {
            closeTimeout = setTimeout(() => {
                isCategoryMenuOpen.value = false;
                selectedCategory.value = null; // Reset selected category
            }, 300); // 300ms delay before closing
        };

        const cancelHideSubcategories = () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        };

        const closeCategoryMenu = () => {
            isCategoryMenuOpen.value = false;
        };

        onMounted(async () => {
            if (categories.value.length === 0) {
                await productStore.fetchCategories();
            }
        });

        onMounted(async () => {
            if (userStore.isLoggedIn) {
                try {
                    await cartStore.fetchCart();
                    await productStore.fetchCategories();
                    await notificationStore.fetchMyNotifications();
                    wishlistStore.initWishlist() // Initialize wishlist
                } catch (error) {
                    console.error('Failed to fetch data:', error);
                    if (error.response && error.response.status === 401) {
                        handleUnauthorized();
                    }
                } finally {
                    isLoading.value = false;
                }
            } else {
                try {
                    console.log('await productStore.fetchPublicCategories();')
                    await productStore.fetchCategories();
                } catch (error) {
                    console.error('Failed to fetch public categories:', error);
                } finally {
                    isLoading.value = false;
                }
            }

            document.addEventListener('click', handleClickOutside);
        });

        watch(() => route.path, (newPath) => {
            if (newPath === '/') {
                searchQuery.value = '';
            }
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        const handleUnauthorized = () => {
            userStore.clearUser();
            cartStore.$reset();
            productStore.$reset();
            router.push('/login');
        };

        const logout = () => {
            userStore.clearUser(); // This should remove the token
            cartStore.$reset(); // Reset cart state
            productStore.$reset(); // Reset product state
            router.push('/');
            toast.success("Logged Out Successfully");
        };

        const toggleMenu = (event) => {
            event.stopPropagation();
            emit('toggleSidebar');
        };

        const closeMenu = () => {
            console.log('Closing menu');  // Add this line for debugging
            emit('closeMenu');
        };

        // Close category menu when clicking outside or hovering horizontal categories
        const handleClickOutside = (event) => {
            // setTimeout(closeMenu, 0);  check on my later

            const categoryMenu = document.querySelector('.category-menu');
            const dropdownMenu = document.querySelector('.category-dropdown');

            if (!categoryMenu?.contains(event.target) && !dropdownMenu?.contains(event.target)) {
                hideSubcategories();
            }

            // Only close the mobile menu if it's open (you might need to add a prop or ref for this)
            if (props.isMenuOpen && !event.target.closest('.mobile-menu')) {
                closeMenu();
            }
        };

        // Add navigation function for wishlist
        const navigateToWishlist = () => {
            if (userStore.isLoggedIn) {
                router.push('/account/wishlist');
            } else {
                router.push('/login');
                toast.info('Please login to view your wishlist');
            }
        };

        const searchQuery = ref(route.query.q || '');
        const handleSearch = () => {
            const trimmedQuery = searchQuery.value.trim();
            if (trimmedQuery) {
                router.push({
                    name: 'Search',
                    query: { q: trimmedQuery }
                });
                // Close mobile menu if open
                if (props.isMenuOpen) {
                    closeMenu();
                }
            } else if (route.name === 'Search') {
                // If on search page and clear, go home
                router.push('/');
                if (props.isMenuOpen) {
                    closeMenu();
                }
            }
        };
        const clearSearch = () => {
            searchQuery.value = '';
            if (route.name === 'Search') {
                router.push('/');
            }
        };

        // Sync search bar with URL changes
        watch(() => route.query.q, (newQ) => {
            searchQuery.value = newQ || '';
        });

        onMounted(() => {
            document.addEventListener('click', handleClickOutside);
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
            if (closeTimeout) {
                clearTimeout(closeTimeout);
            }
        });

        const navigateToCart = () => {
            router.push({ name: 'Cart' });
        };

        // Add closeNotifications method
        const closeNotifications = () => {
            showNotifications.value = false;
        };

        return {
            isLoggedIn,
            user,
            logout,
            toggleMenu,
            closeMenu,
            menuItems,
            handleClickOutside,
            cartCount,
            navigateToCart,
            mainCategories,
            isLoading,
            categories,
            isCategoryMenuOpen,
            toggleCategoryMenu,
            selectedCategory,
            showSubcategories,
            rootCategories,
            hideSubcategories,
            cancelHideSubcategories,
            selectedCountry,
            isCountryModalOpen,
            openCountryModal,
            closeCountryModal,
            onCountrySelected,
            unreadCount,
            notificationStore,
            showNotifications,
            toggleNotifications,
            handleNotificationClick,
            markAsRead,
            getNotificationIcon,
            getNotificationTypeClasses,
            formatDate,
            notificationsRef,
            closeNotifications,
            wishlistCount,
            navigateToWishlist,
            searchQuery,
            handleSearch,
            clearSearch,
        };
    }
}
</script>

<style scoped>
body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f7f7f7;
}

@media (max-width: 640px) {
    .w-full>* {
        margin-bottom: 0.5rem;
    }
}

.button-hover {
    transition: all 0.3s ease;
}

.button-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.active-link {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    background-color: #24a3b5;
    color: white !important;
    display: block;
    width: 100%;
    padding: 4px;
    border-radius: 4px;
    margin-top: -10px;
}

.active-link>*,
.router-link-active>* {
    flex-shrink: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.5s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
}

/* Smooth scrolling for category nav */
.overflow-x-auto {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-x-auto::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-x-auto {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.category-menu {
    position: relative;
}

.category-menu-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 50;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@media (max-width: 640px) {
    /* Add mobile-specific styles here */
}
</style>
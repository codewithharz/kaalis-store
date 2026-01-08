<!-- // frontend/src/views/MyFavorites.vue -->

<template>
    <div class="bg-gray-100 min-h-screen mx-auto p-4">
        <!-- Header with Search and Sort -->
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold">My Favourite Stores</h1>
            <div class="flex gap-4">
                <div class="relative">
                    <input type="text" placeholder="Search stores..." v-model="searchQuery"
                        class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-[#ff934b] focus:border-transparent" />
                    <Search class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div class="relative">
                    <select v-model="sortOption"
                        class="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#ff934b] focus:border-transparent">
                        <option value="">Recently Added</option>
                        <option value="rating">Highest Rated</option>
                        <option value="products">Most Products</option>
                    </select>
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown class="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>


        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <!-- Total Favorite Stores -->
            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                <div class="flex items-start">
                    <div class="text-blue-500 rounded-full p-2 sm:p-3 bg-blue-100 mr-3 sm:mr-4 flex-shrink-0">
                        <Store class="size-6 sm:size-7" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-700">Total Favorite Stores</p>
                        <p class="text-lg sm:text-xl font-semibold break-words">{{ totalStores }}</p>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            Active stores you follow
                        </p>
                    </div>
                </div>
            </div>

            <!-- Active Orders -->
            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                <div class="flex items-start">
                    <div class="text-green-500 rounded-full p-2 sm:p-3 bg-green-100 mr-3 sm:mr-4 flex-shrink-0">
                        <Box class="size-6 sm:size-7" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-700">Active Orders</p>
                        <p class="text-lg sm:text-xl font-semibold break-words">{{ activeOrders }}</p>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            Currently processing
                        </p>
                    </div>
                </div>
            </div>

            <!-- New Updates -->
            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                <div class="flex items-start">
                    <div class="text-orange-500 rounded-full p-2 sm:p-3 bg-orange-100 mr-3 sm:mr-4 flex-shrink-0">
                        <Bell class="size-6 sm:size-7" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-700">New Updates</p>
                        <p class="text-lg sm:text-xl font-semibold break-words">{{ newUpdates }}</p>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            In the last 7 days
                        </p>
                    </div>
                </div>
            </div>

            <!-- Total Products -->
            <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                <div class="flex items-start">
                    <div class="text-purple-500 rounded-full p-2 sm:p-3 bg-purple-100 mr-3 sm:mr-4 flex-shrink-0">
                        <Package class="size-6 sm:size-7" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-700">Total Products</p>
                        <p class="text-lg sm:text-xl font-semibold break-words">{{ totalProducts }}</p>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            From all stores
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Store Card Design -->
        <div v-if="stores.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="store in filteredStores" :key="store._id"
                class="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 group">
                <!-- Store Cover & Profile -->
                <div class="relative h-48">
                    <!-- Cover Image with Gradient Overlay -->
                    <div class="absolute inset-0">
                        <img :src="store.backgroundImage || bgImage || getRandomAvatarUrl(store._id)"
                            :alt="store.storeName"
                            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"></div>
                    </div>

                    <!-- Following Button -->
                    <button @click.stop="unfollowStore(store._id)" class="absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm 
                       bg-white/95 hover:bg-white text-[#ff934b] font-medium 
                       shadow-sm transition-all duration-300 hover:shadow">
                        Following
                    </button>

                    <!-- Store Profile -->
                    <div class="absolute -bottom-8 left-4">
                        <div class="relative">
                            <img :src="store.profileImage || getRandomAvatarUrl(store._id)" :alt="store.storeName"
                                class="w-16 h-16 rounded-xl shadow-md border-2 border-white bg-white object-cover" />
                        </div>
                    </div>
                </div>

                <!-- Store Info -->
                <div class="p-5 pt-12 flex flex-col min-h-[320px]">
                    <!-- Store Header -->
                    <div class="space-y-2">
                        <h3 class="font-semibold text-gray-900">{{ store.storeName }}</h3>
                        <div class="flex items-center text-sm text-gray-600 space-x-3">
                            <div class="flex items-center bg-yellow-50 px-2 py-0.5 rounded-full">
                                <Star class="w-4 h-4 text-yellow-400 mr-1" />
                                <span class="font-medium">{{ formatRating(store.averageRating) }}</span>
                            </div>
                            <div class="px-2 py-0.5 bg-blue-50 rounded-full text-blue-700">
                                {{ store.totalProducts }} Products
                            </div>
                        </div>
                        <p class="text-sm text-gray-500">{{ truncateText(store.storeDescription
                            || store.storeName + ' Store', 30) }}</p>
                    </div>

                    <!-- Store Status -->
                    <div class="h-[60px]"> <!-- This ensures consistent spacing -->
                        <div v-if="store.isVacationMode" class="mt-4 bg-amber-50 px-3 py-2 rounded-lg">
                            <div class="flex items-center text-sm text-amber-800">
                                <Clock class="w-4 h-4 mr-2" />
                                <span>On Vacation Mode</span>
                            </div>
                        </div>
                    </div>

                    <!-- Store Stats -->
                    <div class="mt-4 grid grid-cols-2 gap-3">
                        <div class="bg-gray-50 px-3 py-2 rounded-lg">
                            <p class="text-xs text-gray-500">Orders</p>
                            <p class="text-lg font-semibold text-gray-900">{{ store.deliveredOrders || 0 }}</p>
                        </div>
                        <div class="bg-gray-50 px-3 py-2 rounded-lg">
                            <p class="text-xs text-gray-500">Reviews</p>
                            <p class="text-lg font-semibold text-gray-900">{{ store.totalReviews || 0 }}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-auto pt-6 flex gap-3">
                        <button @click="viewStore(store._id)" class="flex-1 px-4 py-2 bg-[#ff934b] text-white rounded-lg 
                   hover:bg-[#ff8331] hover:shadow-md transition-all duration-300">
                            Visit Store
                        </button>
                        <button @click="viewStoreProducts(store._id)" class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700
                   hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                            Products
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff934b] mx-auto mb-4"></div>
            <p class="text-gray-600">Loading your favorite stores...</p>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Store, Box, Bell, Star, Search, Clock, ChevronDown, Package } from 'lucide-vue-next';
import { useSellerStore } from '../store/sellerStore';
import { useOrderStore } from '../store/orderStore';
import { toast } from 'vue-sonner';
import bgImage from '../assets/images/Kyrian.png';

export default {
    name: 'MyFavorites',
    components: {
        Store,
        Box,
        Bell,
        Star,
        Search,
        Clock,
        ChevronDown,
        Package
    },
    setup() {
        const router = useRouter();
        const sellerStore = useSellerStore();
        const orderStore = useOrderStore();
        const loading = ref(true);
        const stores = ref([]);
        const searchQuery = ref('');
        const sortOption = ref('');

        // Stats
        const totalStores = ref(0);
        const activeOrders = ref(0);
        const newUpdates = ref(0);

        // const randomAvatarUrl = computed(() => {
        //     const randomSeed = Math.random().toString(36).substring(7);
        //     return `https://api.dicebear.com/6.x/identicon/svg?seed=${randomSeed}`;
        // });

        const getRandomAvatarUrl = (storeId) => {
            // Use store ID + random string to create a unique but consistent seed
            const seed = `${storeId}-${Math.random().toString(36).substring(7)}`;
            return `https://api.dicebear.com/6.x/identicon/svg?seed=${seed}`;
        };

        const filteredStores = computed(() => {
            let result = stores.value;

            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(store =>
                    store.storeName.toLowerCase().includes(query) ||
                    store.storeDescription?.toLowerCase().includes(query)
                );
            }

            switch (sortOption.value) {
                case 'rating':
                    result.sort((a, b) => b.averageRating - a.averageRating);
                    break;
                case 'products':
                    result.sort((a, b) => b.totalProducts - a.totalProducts);
                    break;
                default:
                    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            return result;
        });

        const fetchData = async () => {
            try {
                loading.value = true;

                // Fetch favorite stores
                const favoriteStores = await sellerStore.getFavoriteStores();
                stores.value = favoriteStores;

                // Update stats
                totalStores.value = favoriteStores.length;

                // Get active orders
                const orders = await orderStore.fetchUserOrders();
                activeOrders.value = orders.filter(order =>
                    ['Processing', 'Pending'].includes(order.status)
                ).length;

                // Calculate new updates (stores updated in last 7 days)
                const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                newUpdates.value = favoriteStores.filter(store =>
                    new Date(store.updatedAt) > oneWeekAgo
                ).length;

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load favorite stores');
            } finally {
                loading.value = false;
            }
        };

        const unfollowStore = async (storeId) => {
            try {
                await sellerStore.unfollowStore(storeId);
                stores.value = stores.value.filter(store => store._id !== storeId);
                totalStores.value = stores.value.length;
                toast.success('Store unfollowed successfully');
            } catch (error) {
                console.error('Error unfollowing store:', error);
                toast.error('Failed to unfollow store');
            }
        };

        const formatRating = (rating) => {
            return rating ? parseFloat(rating).toFixed(1) : '0.0';
        };

        const truncateText = (text, limit = 100) => {
            if (!text) return '';
            return text.length > limit ? text.slice(0, limit) + '...' : text;
        };

        const viewStore = (storeId) => {
            router.push({ name: 'SellerProfile', params: { id: storeId } });
        };

        const viewStoreProducts = (storeId) => {
            router.push({ name: 'SellerProducts', params: { id: storeId } });
        };

        const goToHome = () => {
            router.push({ name: 'Home' });
        };

        const totalProducts = computed(() => {
            return stores.value.reduce((total, store) => total + (store.totalProducts || 0), 0);
        });


        onMounted(() => {
            fetchData();
        });

        return {
            bgImage,
            // randomAvatarUrl,
            getRandomAvatarUrl,

            loading,
            stores,
            searchQuery,
            sortOption,
            filteredStores,
            totalStores,
            activeOrders,
            newUpdates,
            unfollowStore,
            formatRating,
            truncateText,
            viewStore,
            viewStoreProducts,
            goToHome,
            totalProducts
        };
    }
};
</script>

<style scoped>
.group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
}
</style>
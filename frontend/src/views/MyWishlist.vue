<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <!-- Modern Hero Header -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-4xl font-bold mb-4">My Wishlist</h1>
                    <p class="text-lg mb-8 text-white/90">Manage your favorite products</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 -mt-20 relative z-10">
            <div class="max-w-7xl mx-auto space-y-6">
                <!-- Main Card -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div class="p-6">
                        <!-- Search and View Controls -->
                        <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                            <!-- Search Bar -->
                            <div class="relative">
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input v-model="searchQuery" placeholder="Search wishlist..."
                                        class="w-full sm:w-64 pl-11 pr-4 py-2.5 text-gray-700 bg-transparent border-none focus:outline-none" />
                                </div>
                            </div>

                            <!-- View Controls -->
                            <div class="flex items-center gap-2">
                                <button @click="viewMode = 'grid'" :class="[
                                    'px-4 py-2 rounded-lg font-medium transition-all',
                                    viewMode === 'grid'
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-500 hover:bg-gray-50'
                                ]">
                                    Grid
                                </button>
                                <button @click="viewMode = 'list'" :class="[
                                    'px-4 py-2 rounded-lg font-medium transition-all',
                                    viewMode === 'list'
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-500 hover:bg-gray-50'
                                ]">
                                    List
                                </button>
                            </div>
                        </div>

                        <!-- Loading State -->
                        <div v-if="loading" class="flex items-center justify-center py-12">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        </div>

                        <!-- Error State -->
                        <div v-else-if="error" class="bg-red-50 text-red-600 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle class="w-5 h-5 flex-shrink-0" />
                            <p>{{ error }}</p>
                        </div>

                        <!-- Products Grid/List -->
                        <transition-group :name="viewMode" tag="div"
                            class="grid gap-6 transition-all duration-500 ease-in-out" :class="{
                                'grid-cols-1': viewMode === 'list',
                                'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5': viewMode === 'grid'
                            }">
                            <ProductCard v-for="product in products" :key="product._id" :product="product"
                                :view-mode="viewMode" :show-heart-button="false" :custom-class="[
                                    'product-card bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300',
                                    viewMode === 'list' ? 'sm:flex sm:h-48' : ''
                                ]" class="group relative" @click="viewProduct(product._id)">
                                <!-- Update the actions slot in ProductCard -->
                                <template #actions>
                                    <div
                                        class="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div class="flex gap-2">
                                            <button @click.stop="removeFromWishlist(product._id)" type="button"
                                                class="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all">
                                                <Trash2 class="w-4 h-4 text-red-500" />
                                            </button>
                                            <button @click.stop="shareWishlist(product._id)" type="button"
                                                class="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all">
                                                <Share class="w-4 h-4 text-indigo-500" />
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </ProductCard>
                        </transition-group>

                        <!-- pagination -->
                        <div v-if="!loading && products.length > 0" class="mt-6 flex justify-center">
                            <nav class="flex items-center gap-2">
                                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                                    class="px-3 py-2 rounded-lg border font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                                    Previous
                                </button>

                                <div class="flex items-center gap-1">
                                    <button v-for="pageNum in totalPages" :key="pageNum" @click="changePage(pageNum)"
                                        :class="[
                                            'px-3 py-2 rounded-lg font-medium transition-all',
                                            currentPage === pageNum
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'hover:bg-gray-50'
                                        ]">
                                        {{ pageNum }}
                                    </button>
                                </div>

                                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                                    class="px-3 py-2 rounded-lg border font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                                    Next
                                </button>
                            </nav>
                        </div>

                        <!-- Empty State -->
                        <div v-if="products.length === 0 && !loading" class="text-center py-12">
                            <div
                                class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HeartOff class="w-8 h-8 text-indigo-500" />
                            </div>
                            <h2 class="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p class="text-gray-500 mb-6">
                                Start adding products to your wishlist to keep track of items you love.
                            </p>
                            <button @click="goToProducts"
                                class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 inline-flex items-center gap-2">
                                <ShoppingBag class="w-5 h-5" />
                                <span>Explore Products</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWishlistStore } from '../store/wishlistStore.js';
import { toast } from 'vue-sonner';
import { Trash2, Share, Search, AlertCircle, HeartOff, ShoppingBag } from 'lucide-vue-next';
import ProductCard from './ProductCard.vue';

export default {
    name: 'MyWishlist',
    components: {
        ProductCard,
        Trash2,
        Share,
        Search,
        AlertCircle,
        HeartOff,
        ShoppingBag
    },
    // Update the setup function in MyWishlist.vue

    setup() {
        const router = useRouter();
        const wishlistStore = useWishlistStore();

        // Initialize all refs first
        const products = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const searchQuery = ref('');
        const viewMode = ref('grid');
        const currentPage = ref(1);
        const totalPages = ref(1);

        // Move fetchWishlistProducts function definition before it's used
        const fetchWishlistProducts = async (page = 1) => {
            try {
                loading.value = true;
                error.value = null;
                await wishlistStore.fetchUserWishlists();

                if (wishlistStore.wishlists.length > 0) {
                    const wishlist = wishlistStore.wishlists[0];
                    const result = await wishlistStore.getProductsInWishlist(wishlist._id, page);
                    products.value = Array.isArray(result.products) ? result.products : [];
                    currentPage.value = result.currentPage || 1;
                    totalPages.value = result.totalPages || 1;
                } else {
                    products.value = [];
                    currentPage.value = 1;
                    totalPages.value = 1;
                }
            } catch (err) {
                console.error('Error fetching wishlist products:', err);
                error.value = 'Failed to load wishlist products';
                toast.error(error.value);
                products.value = [];
                currentPage.value = 1;
                totalPages.value = 1;
            } finally {
                loading.value = false;
            }
        };

        // Then define other functions that depend on fetchWishlistProducts
        const changePage = async (newPage) => {
            if (newPage >= 1 && newPage <= totalPages.value) {
                await fetchWishlistProducts(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const removeFromWishlist = async (productId) => {
            try {
                if (wishlistStore.wishlists.length > 0) {
                    const wishlist = wishlistStore.wishlists[0];
                    await wishlistStore.removeFromWishlist(wishlist._id, productId);
                    await fetchWishlistProducts(currentPage.value);
                    toast.success('Removed from wishlist');
                }
            } catch (err) {
                console.error('Error removing product from wishlist:', err);
                toast.error('Failed to remove product from wishlist');
            }
        };

        const shareWishlist = (productId) => {
            const shareUrl = `${window.location.origin}/product/${productId}`;
            navigator.clipboard.writeText(shareUrl)
                .then(() => toast.success('Product link copied to clipboard'))
                .catch(() => toast.error('Failed to copy link'));
        };

        const viewProduct = (productId) => {
            router.push({ name: 'ProductDetails', params: { id: productId } });
        };

        const goToProducts = () => {
            router.push({ name: 'Products' });
        };

        // Define filteredProducts after products ref is initialized
        const filteredProducts = computed(() => {
            if (!products.value) return [];
            return products.value.filter(product =>
                product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        // Initialize on mount
        onMounted(() => {
            fetchWishlistProducts(1);
        });

        // Return all needed refs and functions
        return {
            products: filteredProducts,
            loading,
            error,
            searchQuery,
            viewMode,
            currentPage,
            totalPages,
            removeFromWishlist,
            shareWishlist,
            viewProduct,
            goToProducts,
            changePage,
        };
    }
};
</script>

<style scoped>
.grid-enter-active,
.grid-leave-active,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.grid-enter-from,
.grid-leave-to,
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.grid-move,
.list-move {
    transition: all 0.5s ease-in-out;
}

/* Stagger children animations */
.grid-enter-active,
.list-enter-active {
    transition-delay: calc(var(--i) * 0.1s);
}

/* Optional: Add smooth transition for the container itself */
.grid {
    transition: all 0.5s ease-in-out;
}

.group:hover .group-hover\:opacity-100 {
    opacity: 1;
}

.group .opacity-0 {
    opacity: 0;
}

.group-hover\:opacity-100 {
    transition: opacity 0.3s ease;
}
</style>
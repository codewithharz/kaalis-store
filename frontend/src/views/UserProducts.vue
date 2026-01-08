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

            <div class="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">My Products</h1>
                    <p class="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-white/90">Manage and organize your
                        product listings</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 -mt-12 sm:-mt-16 lg:-mt-20 relative z-10">
            <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                <!-- Main Card -->
                <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div class="p-4 sm:p-6">
                        <!-- Search and View Controls -->
                        <div class="flex flex-col gap-4 mb-4 sm:mb-6">
                            <!-- Search Bar -->
                            <div class="relative">
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <Search
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input v-model="searchQuery" placeholder="Search products..."
                                        class="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 text-gray-700 bg-transparent border-none focus:outline-none text-sm sm:text-base" />
                                </div>
                            </div>

                            <!-- View Controls -->
                            <div
                                class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2">
                                <div class="flex items-center gap-2">
                                    <button @click="viewMode = 'grid'" :class="[
                                        'flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base',
                                        viewMode === 'grid'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    ]">
                                        Grid
                                    </button>
                                    <button @click="viewMode = 'list'" :class="[
                                        'flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base',
                                        viewMode === 'list'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    ]">
                                        List
                                    </button>
                                </div>
                                <button @click="createNewProduct"
                                    class="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
                                    <PlusCircle class="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span class="hidden sm:inline">Add Product</span>
                                    <span class="sm:hidden">Add</span>
                                </button>
                            </div>
                        </div>

                        <!-- Loading State -->
                        <div v-if="loading" class="flex items-center justify-center py-8 sm:py-12">
                            <div
                                class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-500">
                            </div>
                        </div>

                        <!-- Error State -->
                        <div v-else-if="error"
                            class="bg-red-50 text-red-600 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3">
                            <AlertCircle class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                            <p class="text-sm sm:text-base">{{ error }}</p>
                        </div>

                        <!-- Products Grid/List -->
                        <transition-group :name="viewMode" tag="div"
                            class="grid gap-3 sm:gap-4 lg:gap-6 transition-all duration-500 ease-in-out" :class="{
                                'grid-cols-1': viewMode === 'list',
                                'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5': viewMode === 'grid'
                            }">
                            <ProductCard v-for="(product, index) in filteredProducts" :key="product._id"
                                :product="product" :isUserProduct="true" @edit="handleEditProduct"
                                @delete="handleDeleteProduct" :custom-class="[
                                    'product-card bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300',
                                    viewMode === 'list' ? 'sm:flex sm:h-40 lg:h-48' : ''
                                ]" :view-mode="viewMode" :style="{ '--i': index }" />
                        </transition-group>

                        <!-- Pagination controls -->
                        <div v-if="!loading && filteredProducts.length > 0" class="mt-4 sm:mt-6 flex justify-center">
                            <nav class="flex items-center gap-1 sm:gap-2">
                                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                                    class="px-2 sm:px-3 py-2 rounded-lg border font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm">
                                    <span class="hidden sm:inline">Previous</span>
                                    <span class="sm:hidden">Prev</span>
                                </button>

                                <div class="flex items-center gap-1">
                                    <button v-for="pageNum in totalPages" :key="pageNum" @click="changePage(pageNum)"
                                        :class="[
                                            'px-2 sm:px-3 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm',
                                            currentPage === pageNum
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'hover:bg-gray-50'
                                        ]">
                                        {{ pageNum }}
                                    </button>
                                </div>

                                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                                    class="px-2 sm:px-3 py-2 rounded-lg border font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm">
                                    <span class="hidden sm:inline">Next</span>
                                    <span class="sm:hidden">Next</span>
                                </button>
                            </nav>
                        </div>

                        <!-- Empty State -->
                        <div v-if="filteredProducts.length === 0 && !loading" class="text-center py-8 sm:py-12">
                            <div
                                class="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Package class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
                            </div>
                            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h2>
                            <p v-if="searchQuery" class="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                                Try adjusting your search to find what you're looking for.
                            </p>
                            <p v-else class="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                                You haven't added any products yet. Start building your inventory!
                            </p>
                            <button @click="createNewProduct"
                                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base">
                                <PlusCircle class="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Add New Product</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <EditWishlistProductModal v-if="isEditModalOpen && localEditingProduct" :isEditModalOpen="isEditModalOpen"
            :localEditingProduct="localEditingProduct" :userId="userStore.user._id"
            @update:isEditModalOpen="isEditModalOpen = $event" @product-updated="handleProductUpdated" />
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search, PlusCircle } from 'lucide-vue-next';
import { useProductStore } from '../store/productStore';
import { useUserStore } from '../store/user';
import { toast } from 'vue-sonner';
import ProductCard from './ProductCard.vue';
import EditWishlistProductModal from './EditWishlistProductModal.vue';
import apiClient from '../api/axios';

export default {
    name: 'UserProducts',
    components: {
        ProductCard,
        EditWishlistProductModal,
        Search,
        PlusCircle
    },
    setup() {
        const router = useRouter();
        const productStore = useProductStore();
        const userStore = useUserStore();
        const userProducts = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const searchQuery = ref('');
        const viewMode = ref('grid');
        const isEditModalOpen = ref(false);
        const localEditingProduct = ref(null);

        const currentPage = ref(1);
        const totalPages = ref(1);

        const fetchUserProducts = async () => {
            try {
                loading.value = true;
                error.value = null;

                // API call to include pagination params
                const response = await apiClient.get(`/products/${userStore.user._id}/products`, {
                    params: {
                        page: currentPage.value,
                        limit: 10  // Fixed to 12 products per page
                    }
                });

                console.log('API response:', response.data);

                // Update how we handle the response ⬇️
                if (response.data?.products) {
                    userProducts.value = response.data.products;
                    totalPages.value = response.data.totalPages;
                    currentPage.value = response.data.currentPage;
                } else if (Array.isArray(response.data)) {
                    userProducts.value = response.data;
                } else {
                    console.error('Unexpected API response format:', response.data);
                    userProducts.value = [];
                }
            } catch (err) {
                console.error('Error fetching user products:', err);
                error.value = 'Failed to load products. Please try again.';
                toast.error(error.value);
            } finally {
                loading.value = false;
            }
        };

        // Function to change the current page
        const changePage = async (newPage) => {
            if (newPage >= 1 && newPage <= totalPages.value) {
                currentPage.value = newPage;
                await fetchUserProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const filteredProducts = computed(() => {
            return userProducts.value.filter(product =>
                product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        const handleEditProduct = (productId) => {
            const productToEdit = userProducts.value.find(product => product._id === productId);
            if (productToEdit) {
                localEditingProduct.value = JSON.parse(JSON.stringify(productToEdit));
                isEditModalOpen.value = true;
            } else {
                console.error('Product not found:', productId);
                toast.error('Error: Product not found');
            }
        };

        const handleDeleteProduct = async (productId) => {
            try {
                console.log('Deleting product:', productId);

                // First delete from the server
                await productStore.deleteProduct(productId);

                // Then update local state immediately
                userProducts.value = userProducts.value.filter(product => product._id !== productId);
                toast.success('Product deleted successfully');

                // If this was the last item on the current page and we're not on page 1,
                // go to the previous page
                if (filteredProducts.value.length === 0 && currentPage.value > 1) {
                    await changePage(currentPage.value - 1);
                } else {
                    // Refresh the current page
                    await fetchUserProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product. Please try again.');
            }
        };

        const handleProductUpdated = async (updatedProduct) => {
            try {
                const result = await productStore.updateProduct(updatedProduct._id, updatedProduct);
                const index = userProducts.value.findIndex(p => p._id === result._id);
                if (index !== -1) {
                    userProducts.value[index] = result;
                } else {
                    userProducts.value.push(result);
                }
                isEditModalOpen.value = false;
                localEditingProduct.value = null;
                toast.success('Product updated successfully');
            } catch (error) {
                console.error('Error updating product:', error);
                toast.error('Failed to update product');
            }
        };

        const createNewProduct = () => {
            router.push('/account/profile/add-product');
        };

        // event listener for product creation
        const handleProductCreated = async () => {
            await fetchUserProducts();
        };

        onMounted(() => {
            if (userStore.isLoggedIn) {
                fetchUserProducts();
            }
            window.addEventListener('product-created', handleProductCreated);
        });

        onUnmounted(() => {
            window.removeEventListener('product-created', handleProductCreated);
        });

        return {
            userProducts,
            loading,
            error,
            searchQuery,
            viewMode,
            filteredProducts,
            isEditModalOpen,
            localEditingProduct,
            handleEditProduct,
            handleDeleteProduct,
            handleProductUpdated,
            createNewProduct,
            userStore,

            currentPage,
            totalPages,
            changePage,
        };
    }
}
</script>

<style scoped>
/* Enhanced animations and transitions */
.my-user-products-page {
    min-height: calc(100vh - 64px);
}

.product-card {
    transition: all 0.5s ease;
}

/* Mobile-first approach: Disable hover effects and transforms on mobile */
@media (max-width: 768px) {

    .transform,
    .hover\:scale-105:hover {
        transform: none !important;
        transition: none !important;
    }

    /* Better touch targets for mobile */
    button {
        min-height: 44px;
    }

    /* Prevent zoom on input focus for iOS */
    input,
    select {
        font-size: 16px;
    }

    /* Reduce motion for better mobile performance */
    * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
    }
}

/* Enhanced focus states for accessibility */
button:focus,
input:focus {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
}

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

.grid-enter-from,
.grid-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: scale(0.9) translateX(-30px);
}

/* Stagger children animations */
.grid-move,
.list-move {
    transition: all 0.5s ease-in-out;
}

.grid-enter-active,
.list-enter-active {
    transition-delay: calc(var(--i) * 0.1s);
}

/* Optional: Add smooth transition for the container itself */
.grid {
    transition: all 0.5s ease-in-out;
}

/* Enhanced shadow effects - Mobile optimized */
.shadow-xl {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
    .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
}

.shadow-lg {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@media (min-width: 768px) {
    .shadow-lg {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
}

/* Gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-b {
    background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

/* Loading animation */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Mobile-specific improvements */
@media (max-width: 640px) {

    /* Better spacing for small screens */
    .space-y-6>*+* {
        margin-top: 1rem;
    }

    .space-y-4>*+* {
        margin-top: 0.75rem;
    }

    /* Better mobile scrolling */
    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
    }

    /* Prevent horizontal overflow */
    .min-w-0 {
        min-width: 0;
    }

    /* Better text wrapping */
    .break-words {
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
    }
}

/* Responsive text sizing */
@media (max-width: 640px) {
    .text-4xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }

    .text-3xl {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .text-2xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }

    .text-xl {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }

    .text-lg {
        font-size: 1rem;
        line-height: 1.5rem;
    }
}

/* Better mobile input styling */
@media (max-width: 640px) {
    .pl-9 {
        padding-left: 2.25rem;
    }

    .pl-11 {
        padding-left: 2.25rem;
    }

    /* Better icon positioning for mobile */
    .absolute.left-3 {
        left: 0.75rem;
    }
}

/* Better mobile touch interactions */
@media (max-width: 768px) {

    /* Larger touch targets */
    button {
        min-height: 44px;
        min-width: 44px;
    }

    /* Better tap highlighting */
    button,
    input {
        -webkit-tap-highlight-color: rgba(99, 102, 241, 0.1);
    }

    /* Better focus indicators for mobile */
    button:focus,
    input:focus {
        outline: 3px solid #6366f1;
        outline-offset: 2px;
    }

    /* Ensure readable font sizes */
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
}

/* Ensure consistent button heights on mobile */
@media (max-width: 640px) {
    .py-2\.5 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
}

/* Mobile-specific grid improvements */
@media (max-width: 640px) {
    .sm\:grid-cols-3 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .lg\:grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .xl\:grid-cols-5 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* Better mobile card layouts */
@media (max-width: 640px) {
    .rounded-2xl {
        border-radius: 0.75rem;
    }

    .rounded-xl {
        border-radius: 0.5rem;
    }

    .p-6 {
        padding: 1rem;
    }

    /* Better spacing */
    .gap-6 {
        gap: 0.75rem;
    }

    .gap-4 {
        gap: 0.75rem;
    }

    .gap-3 {
        gap: 0.5rem;
    }
}

/* View mode buttons mobile optimization */
@media (max-width: 640px) {
    .view-controls {
        display: flex;
        width: 100%;
    }

    .view-controls button {
        flex: 1;
        text-align: center;
    }
}

/* Enhanced mobile accessibility */
@media (max-width: 768px) {

    /* Better contrast for mobile */
    .text-gray-400 {
        color: #6b7280;
    }

    .text-gray-600 {
        color: #4b5563;
    }

    .text-gray-500 {
        color: #6b7280;
    }
}

/* Pagination mobile improvements */
@media (max-width: 640px) {
    .pagination-controls {
        font-size: 0.75rem;
    }

    .pagination-button {
        padding: 0.5rem;
        min-width: 2rem;
    }
}

/* Print styles */
@media print {

    .shadow-xl,
    .shadow-lg {
        box-shadow: none !important;
    }

    .bg-gradient-to-br,
    .bg-gradient-to-r,
    .bg-gradient-to-b {
        background: #ffffff !important;
    }

    .text-white {
        color: #000000 !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .border-gray-200 {
        border-color: #000000;
    }

    .text-gray-600 {
        color: #000000;
    }

    .bg-gray-50 {
        background-color: #ffffff;
    }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Better selection styles */
::selection {
    background-color: #6366f1;
    color: #ffffff;
}

::-moz-selection {
    background-color: #6366f1;
    color: #ffffff;
}

/* Ensure proper stacking context */
.relative {
    position: relative;
    z-index: 1;
}

/* Mobile product grid optimization */
@media (max-width: 640px) {
    .product-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
    }

    .product-card {
        border-radius: 0.5rem;
    }
}

/* Mobile list view optimization */
@media (max-width: 640px) {
    .sm\:flex {
        display: block !important;
    }

    .sm\:h-40,
    .sm\:h-48 {
        height: auto !important;
    }
}
</style>
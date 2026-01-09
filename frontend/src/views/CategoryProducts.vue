<template>
    <div class="w-full max-w-7xl mx-auto pb-6 sm:pb-9 bg-white px-2 sm:px-4 lg:px-8">
        <!-- Breadcrumb -->
        <div class="mb-4 sm:mb-6">
            <Breadcrumb :breadcrumbs="breadcrumbs" />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8 sm:py-12">
            <div class="spinner mx-auto"></div>
            <p class="mt-4 text-sm sm:text-base text-gray-600">Loading products...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8 sm:py-12">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
                <div class="text-red-400 mb-4">
                    <svg class="w-10 h-10 sm:w-12 sm:h-12 mx-auto" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                        </path>
                    </svg>
                </div>
                <p class="text-sm sm:text-base text-red-600 font-semibold">{{ error }}</p>
                <button @click="fetchProducts"
                    class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm">
                    Try Again
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else class="flex flex-col lg:flex-row gap-6">
            <!-- Mobile Filter Toggle -->
            <div class="lg:hidden">
                <button @click="toggleFilters"
                    class="w-full flex items-center justify-between bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <span class="flex items-center">
                        <Filter class="w-4 h-4 mr-2" />
                        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
                    </span>
                    <ChevronDown class="w-4 h-4 transform transition-transform text-gray-500"
                        :class="{ 'rotate-180': showFilters }" />
                </button>
            </div>

            <!-- Sidebar Filter -->
            <div :class="[
                'lg:w-64 flex-shrink-0 transition-all duration-300',
                { 'hidden lg:block': !showFilters },
                { 'block': showFilters }
            ]">
                <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-6 sticky top-24">
                   <!-- Header with Clear All -->
                    <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                        <h3 class="font-bold text-gray-900">Filters</h3>
                         <button v-if="hasActiveFilters" @click="clearAllFilters"
                            class="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                            Clear All
                        </button>
                    </div>

                    <!-- Subcategories Navigation -->
                    <div v-if="subCategories && subCategories.length > 0">
                         <h4 class="font-semibold text-sm text-gray-800 mb-3">Subcategories</h4>
                         <ul class="space-y-2">
                             <li v-for="sub in subCategories" :key="sub._id">
                                 <router-link :to="{ name: 'CategoryProducts', params: { categorySlug: sub.slug } }"
                                     class="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-2 py-1.5 rounded transition-colors flex items-center justify-between group">
                                     <span>{{ sub.name }}</span>
                                      <ChevronRight class="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400" />
                                 </router-link>
                             </li>
                         </ul>
                         <div class="my-4 border-b border-gray-100"></div>
                    </div>


                    <!-- Price Filter -->
                    <details class="group" open>
                        <summary class="flex justify-between items-center cursor-pointer list-none py-2 text-sm font-semibold text-gray-800">
                             Price Range
                             <ChevronDown class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180"/>
                        </summary>
                        <div class="mt-3 space-y-2">
                             <label v-for="(range, index) in priceCounts" :key="index"
                                class="flex items-center group/item cursor-pointer">
                                <div class="relative flex items-center">
                                    <input type="checkbox" :value="range.value" v-model="selectedFilters.price"
                                        class="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer">
                                </div>
                                <span class="ml-2 text-sm text-gray-600 group-hover/item:text-gray-900 flex-1">
                                    {{ range.label }}
                                </span>
                                <span class="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{{ range.count }}</span>
                            </label>
                        </div>
                    </details>

                    <div class="border-t border-gray-100"></div>

                    <!-- Discount Filter -->
                    <details class="group" open>
                         <summary class="flex justify-between items-center cursor-pointer list-none py-2 text-sm font-semibold text-gray-800">
                             Discount
                             <ChevronDown class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180"/>
                        </summary>
                        <div class="mt-3 space-y-2">
                            <label v-for="(range, index) in discountCounts" :key="index"
                                class="flex items-center group/item cursor-pointer">
                                <div class="relative flex items-center">
                                    <input type="checkbox" :value="range.value" v-model="selectedFilters.discount"
                                        class="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer">
                                </div>
                                <span class="ml-2 text-sm text-gray-600 group-hover/item:text-gray-900 flex-1">
                                    {{ range.label }}
                                </span>
                                <span class="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{{ range.count }}</span>
                            </label>
                        </div>
                    </details>

                    <div class="border-t border-gray-100"></div>

                     <!-- Brand Filter -->
                     <details class="group" open v-if="brandCounts.length > 0">
                        <summary class="flex justify-between items-center cursor-pointer list-none py-2 text-sm font-semibold text-gray-800">
                             Brand
                             <ChevronDown class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180"/>
                        </summary>
                        <div class="mt-3">
                            <div class="relative mb-3">
                                <input type="text" v-model="brandSearch" placeholder="Search brands..."
                                    class="w-full text-xs border border-gray-200 rounded-md py-1.5 pl-2 pr-7 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <Search class="w-3 h-3 text-gray-400 absolute right-2 top-2" />
                            </div>
                             <div class="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                <label v-for="brand in filteredBrandCounts" :key="brand.name"
                                    class="flex items-center group/item cursor-pointer">
                                    <div class="relative flex items-center">
                                        <input type="checkbox" :value="brand.name" v-model="selectedFilters.brand"
                                            class="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer">
                                    </div>
                                    <span class="ml-2 text-sm text-gray-600 group-hover/item:text-gray-900 flex-1 truncate">
                                        {{ brand.name }}
                                    </span>
                                    <span class="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{{ brand.count }}</span>
                                </label>
                            </div>
                        </div>
                    </details>

                     <div v-if="brandCounts.length > 0" class="border-t border-gray-100"></div>

                    <!-- Rating Filter -->
                    <details class="group" open>
                        <summary class="flex justify-between items-center cursor-pointer list-none py-2 text-sm font-semibold text-gray-800">
                             Rating
                             <ChevronDown class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180"/>
                        </summary>
                         <div class="mt-3 space-y-2">
                            <label v-for="rating in [4, 3, 2, 1]" :key="rating"
                                class="flex items-center group/item cursor-pointer">
                                <div class="relative flex items-center">
                                    <input type="checkbox" :value="rating" v-model="selectedFilters.rating"
                                        class="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer">
                                </div>
                                <div class="ml-2 flex items-center flex-1">
                                    <div class="flex text-yellow-400 text-xs">
                                        <Star v-for="i in 5" :key="i" class="w-3.5 h-3.5"
                                            :class="i <= rating ? 'fill-current' : 'text-gray-200'" />
                                    </div>
                                    <span class="ml-2 text-xs text-gray-500">& Up</span>
                                </div>
                            </label>
                        </div>
                    </details>
                </div>
            </div>

            <!-- Product Listing -->
            <div class="flex-1 w-full lg:min-w-0">
                <!-- Header Section -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 mb-1 leading-tight">{{ categoryName }}</h1>
                        <p class="text-sm text-gray-500">
                            Showing {{ filteredProducts.length }} results
                        </p>
                    </div>

                      <!-- Sort Options -->
                    <div class="w-full sm:w-auto">
                        <select v-model="sortOption"
                            class="w-full sm:w-48 appearance-none border border-gray-200 rounded-lg py-2.5 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer hover:border-gray-300">
                            <option value="">Sort By: Featured</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="name-a-z">Name: A to Z</option>
                            <option value="name-z-a">Name: Z to A</option>
                            <option value="discount">Discount: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                 <!-- Active Filters Badges -->
                <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-6">
                    <template v-for="(value, key) in selectedFilters" :key="key">
                        <template v-if="key === 'price' || key === 'discount' || key === 'brand' || key === 'rating'">
                            <span v-for="item in value" :key="item"
                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {{ formatFilterLabel(key, item) }}
                                <button @click="removeFilter(key, item)" class="ml-1.5 hover:text-blue-900 focus:outline-none">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </span>
                        </template>
                    </template>
                     <button @click="clearAllFilters" class="text-xs text-gray-500 hover:text-gray-900 underline ml-2">
                        Clear all
                    </button>
                </div>

                <!-- Search Field (Mobile only mostly, or secondary) -->
                 <div class="mb-6 relative w-full sm:max-w-md" v-if="searchQuery">
                        <input v-model="searchQuery" type="text" placeholder="Search within this category..."
                            class="w-full text-sm border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        <Search class="absolute w-4 h-4 left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                 </div>


                <!-- Product Grid -->
                <div v-if="filteredProducts.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    <ProductCard v-for="product in filteredProducts" :key="product._id" :product="product"
                        @click="viewProduct(product._id)"
                        class="h-full" />
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                        <Search class="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">No matches found</h3>
                    <p class="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                        We couldn't find any products matching your selected filters.
                    </p>
                    <button @click="clearAllFilters"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Clear all filters
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../store/productStore.js';
import { Search, Filter, ChevronDown, ChevronRight, Star } from 'lucide-vue-next';
import Breadcrumb from './Breadcrumb.vue';
import ProductCard from './ProductCard.vue';

export default {
    name: 'CategoryProducts',
    components: { Search, Filter, ChevronDown, ChevronRight, Star, Breadcrumb, ProductCard },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const productStore = useProductStore();

        const loading = ref(true);
        const error = ref(null);
        const products = ref([]);
        const categoryName = ref('');
        const searchQuery = ref('');
        const sortOption = ref('');
        const showFilters = ref(false);
        const brandSearch = ref('');

        const category = ref(null);
        const breadcrumbs = ref([]);

        // Filter State
        const selectedFilters = ref({
            price: [],
            discount: [],
            brand: [],
            rating: []
        });

        // Computed: Find current category node and children (subcategories)
        const subCategories = computed(() => {
             if (!productStore.categories.length) return [];
             const slug = route.params.categorySlug;

             // Recursive helper to find node by slug
             const findNode = (nodes) => {
                 for (const node of nodes) {
                     if (node.slug === slug) return node;
                     if (node.children && node.children.length) {
                         const found = findNode(node.children);
                         if (found) return found;
                     }
                 }
                 return null;
             };

             const currentNode = findNode(productStore.categories);
             return currentNode?.children || [];
        });

        const fetchProducts = async () => {
             console.log("Fetching products for", route.params.categorySlug);
            try {
                loading.value = true;
                error.value = null;
                const categorySlug = route.params.categorySlug;

                // Create a promise for fetching products
                const productsPromise = productStore.fetchProductsByCategory(categorySlug);

                // Create a promise for fetching categories if empty
                 const categoriesPromise = productStore.categories.length === 0
                    ? productStore.fetchCategories()
                    : Promise.resolve();

                const [result] = await Promise.all([productsPromise, categoriesPromise]);

                products.value = result.products || [];
                categoryName.value = result.categoryName;
                category.value = { name: result.categoryName, slug: categorySlug };

                // Update breadcrumbs
                breadcrumbs.value = [
                    { name: 'Home', path: '/' },
                    ...(result.categoryPath || []).map(cat => ({
                        name: cat.name,
                        path: `/category/${cat.slug}`
                    }))
                ];

                // Clear filters when changing category (optional, usually good UX)
                // We keep them if the user is just navigating back/forth?
                // Let's clear to avoid stale filters
               // clearAllFilters(); // Careful, this might trigger before mounted

            } catch (err) {
                console.error('Error fetching products:', err);
                error.value = 'Failed to load products. Please try again.';
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            fetchProducts();
        });

        watch(() => route.params.categorySlug, (newSlug, oldSlug) => {
            if (newSlug !== oldSlug) {
                clearAllFilters();
                fetchProducts();
            }
        });

        // Filter Logic
        const filteredProducts = computed(() => {
            let result = products.value;

            // Price Filter
            if (selectedFilters.value.price.length > 0) {
                 result = result.filter(product => {
                    return selectedFilters.value.price.some(range => {
                        const [min, max] = range.split('-').map(Number);
                        return product.price >= min && (max === 0 || product.price <= max);
                    });
                });
            }

            // Discount Filter
            if (selectedFilters.value.discount.length > 0) {
                 result = result.filter(product => {
                    return selectedFilters.value.discount.some(min =>
                        (product.discount || 0) >= parseInt(min)
                    );
                });
            }

            // Brand Filter
            if (selectedFilters.value.brand.length > 0) {
                result = result.filter(product =>
                    selectedFilters.value.brand.includes(product.brand)
                );
            }

            // Rating Filter
             if (selectedFilters.value.rating.length > 0) {
                 result = result.filter(product => {
                     // Check if product matches ANY selected rating (>=)
                     return selectedFilters.value.rating.some(r => (product.averageRating || 0) >= r);
                 });
            }

            // Search
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    (product.description && product.description.toLowerCase().includes(query))
                );
            }

            // Sorting
            switch (sortOption.value) {
                case 'price-low-high':
                    result.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high-low':
                    result.sort((a, b) => b.price - a.price);
                    break;
                case 'name-a-z':
                    result.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-z-a':
                    result.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'discount':
                    result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                    break;
                 case 'rating':
                     result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                     break;
            }

            return result;
        });

        // Computed Counts
        const priceCounts = computed(() => {
             const ranges = [
                { label: 'Under ₦1,000', value: '0-1000' },
                { label: '₦1,000 - ₦5,000', value: '1000-5000' },
                { label: '₦5,000 - ₦10,000', value: '5000-10000' },
                { label: '₦10,000 - ₦50,000', value: '10000-50000' },
                { label: 'Above ₦50,000', value: '50000-0' }
            ];
             return ranges.map(range => {
                const [min, max] = range.value.split('-').map(Number);
                const count = products.value.filter(product =>
                    product.price >= min && (max === 0 || product.price <= max)
                ).length;
                return { ...range, count };
            });
        });

        const discountCounts = computed(() => {
             const ranges = [
                { label: '50% or more', value: '50' },
                { label: '40% or more', value: '40' },
                { label: '30% or more', value: '30' },
                { label: '20% or more', value: '20' },
                { label: '10% or more', value: '10' } // Fixed order to logical descending
            ];
            return ranges.map(range => {
                 const count = products.value.filter(product =>
                    (product.discount || 0) >= parseInt(range.value)
                ).length;
                return { ...range, count };
            });
        });


        const brandCounts = computed(() => {
             // Extract all brands
             const brands = products.value.map(p => p.brand).filter(Boolean);
             const counts = {};
             brands.forEach(b => { counts[b] = (counts[b] || 0) + 1; });
             return Object.entries(counts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count); // Sort by popularity
        });

        const filteredBrandCounts = computed(() => {
            if (!brandSearch.value) return brandCounts.value;
            return brandCounts.value.filter(b => b.name.toLowerCase().includes(brandSearch.value.toLowerCase()));
        });

        // Helpers
        const toggleFilters = () => { showFilters.value = !showFilters.value; };

        const clearAllFilters = () => {
             selectedFilters.value = {
                price: [],
                discount: [],
                brand: [],
                rating: []
            };
            searchQuery.value = '';
            sortOption.value = '';
            brandSearch.value = '';
        };

        const hasActiveFilters = computed(() => {
             return selectedFilters.value.price.length > 0 ||
                    selectedFilters.value.discount.length > 0 ||
                    selectedFilters.value.brand.length > 0 ||
                    selectedFilters.value.rating.length > 0;
        });

        const removeFilter = (type, value) => {
             const index = selectedFilters.value[type].indexOf(value);
             if (index > -1) {
                 selectedFilters.value[type].splice(index, 1);
             }
        };

        const formatFilterLabel = (type, value) => {
             if (type === 'price') {
                 // Simple mapping for display
                  if(value === '0-1000') return 'Under ₦1,000';
                  if(value === '50000-0') return 'Above ₦50,000';
                  const [min, max] = value.split('-');
                  return `₦${Number(min).toLocaleString()} - ₦${Number(max).toLocaleString()}`;
             }
             if (type === 'discount') return `${value}%+ Off`;
             if (type === 'rating') return `${value} Stars & Up`;
             return value;
        };

        const viewProduct = (productId) => {
            router.push({ name: 'ProductDetails', params: { id: productId } });
        };

        return {
            loading,
            error,
            categoryName,
            products,
            filteredProducts,
            searchQuery,
            sortOption,
            showFilters,
            breadcrumbs,
            selectedFilters,
            priceCounts,
            discountCounts,
            brandCounts,
            filteredBrandCounts,
            brandSearch,
            subCategories,
            hasActiveFilters,
            // Methods
            toggleFilters,
            fetchProducts,
            clearAllFilters,
            removeFilter,
            formatFilterLabel,
            viewProduct
        };
    }
};
</script>

<style scoped>
.spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3b82f6; /* Blue-500 */
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Custom scrollbar for brand list */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
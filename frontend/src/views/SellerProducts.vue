<template>
    <div class="w-full max-w-7xl mx-auto pb-6 sm:pb-9 bg-white px-2 sm:px-4 lg:px-8">
        <!-- Loading State -->
        <div v-if="sellerStore.loading" class="text-center py-8">
            <div class="spinner mx-auto"></div>
            <p class="mt-4 text-sm sm:text-base text-gray-600">Loading products...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="sellerStore.errorMessage" class="text-center text-red-500 py-8">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <div class="text-red-400 mb-2">
                    <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                        </path>
                    </svg>
                </div>
                <p class="text-sm sm:text-base">{{ sellerStore.errorMessage }}</p>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else class="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <!-- Mobile Filter Toggle -->
            <div class="lg:hidden">
                <button @click="toggleFilters"
                    class="w-full flex items-center justify-between bg-blue-50 text-blue-600 font-semibold p-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                            </path>
                        </svg>
                        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
                    </span>
                    <svg class="w-4 h-4 transform transition-transform" :class="{ 'rotate-180': showFilters }"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>

            <!-- Sidebar Filter -->
            <div :class="[
                'lg:w-1/5 xl:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-xl shadow-sm h-fit p-5 transition-all duration-300',
                { 'hidden lg:block': !showFilters },
                { 'block': showFilters }
            ]">
                <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 class="font-bold text-gray-900">Filters</h2>
                    <button @click="clearFilters" v-if="selectedPriceRanges.length || selectedDiscountRanges.length || selectedCategories.length || selectedBrands.length || selectedRatings.length"
                        class="text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors">
                        Clear All
                    </button>
                </div>

                <!-- Price Filter -->
                <div class="mb-5 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <details open class="group">
                        <summary class="flex justify-between items-center font-semibold text-sm text-gray-800 cursor-pointer list-none mb-3">
                            <span>Price Range</span>
                            <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                        </summary>
                        <div class="space-y-2.5 pt-1">
                            <div v-for="(range, index) in priceCounts" :key="index"
                                class="flex items-center text-sm group/item">
                                <input type="checkbox" :id="'price-' + index" v-model="selectedPriceRanges"
                                    :value="range.value"
                                    class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
                                <label :for="'price-' + index" class="flex-1 cursor-pointer text-gray-600 group-hover/item:text-gray-900 transition-colors">
                                    {{ range.label }}
                                    <span class="text-gray-400 text-xs ml-1">({{ range.count }})</span>
                                </label>
                            </div>
                        </div>
                    </details>
                </div>

                <!-- Discount Filter -->
                <div class="mb-5 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <details open class="group">
                        <summary class="flex justify-between items-center font-semibold text-sm text-gray-800 cursor-pointer list-none mb-3">
                             <span>Discount</span>
                             <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                        </summary>
                        <div class="space-y-2.5 pt-1">
                            <div v-for="(range, index) in discountCounts" :key="index"
                                class="flex items-center text-sm group/item">
                                <input type="checkbox" :id="'discount-' + index" v-model="selectedDiscountRanges"
                                    :value="range.value"
                                    class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
                                <label :for="'discount-' + index" class="flex-1 cursor-pointer text-gray-600 group-hover/item:text-gray-900 transition-colors">
                                    {{ range.label }}
                                    <span class="text-gray-400 text-xs ml-1">({{ range.count }})</span>
                                </label>
                            </div>
                        </div>
                    </details>
                </div>

                <!-- Category Filter (Hierarchical) -->
                <div v-if="relevantCategoryTree.length > 0" class="mb-5 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <details open class="group">
                        <summary class="flex justify-between items-center font-semibold text-sm text-gray-800 cursor-pointer list-none mb-3">
                             <span>Categories</span>
                             <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                        </summary>
                        <div class="space-y-3 pt-1">
                             <div v-for="cat in relevantCategoryTree" :key="cat._id">
                                 <!-- Level 1 -->
                                 <div class="flex items-center text-sm group/item mb-1">
                                     <input type="checkbox" :id="'cat-' + cat._id" :value="cat._id" v-model="selectedCategories"
                                         class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
                                     <label :for="'cat-' + cat._id" class="flex-1 cursor-pointer text-gray-700 font-medium group-hover/item:text-gray-900">
                                         {{ cat.name }} <span class="text-gray-400 text-xs">({{ cat.count }})</span>
                                     </label>
                                 </div>
                                 
                                 <!-- Level 2 -->
                                 <div v-if="cat.children && cat.children.length" class="ml-5 border-l border-gray-200 pl-3 space-y-2 mt-1">
                                     <div v-for="sub in cat.children" :key="sub._id">
                                         <div class="flex items-center text-sm group/sub">
                                             <input type="checkbox" :id="'cat-' + sub._id" :value="sub._id" v-model="selectedCategories"
                                                  class="mr-2 h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
                                             <label :for="'cat-' + sub._id" class="flex-1 cursor-pointer text-gray-600 group-hover/sub:text-gray-900">
                                                 {{ sub.name }} <span class="text-gray-400 text-xs">({{ sub.count }})</span>
                                             </label>
                                         </div>

                                         <!-- Level 3 -->
                                         <div v-if="sub.children && sub.children.length" class="ml-5 border-l border-gray-200 pl-3 space-y-1 mt-1">
                                              <div v-for="leaf in sub.children" :key="leaf._id" class="flex items-center text-xs text-gray-500 group/leaf py-0.5">
                                                   <input type="checkbox" :id="'cat-' + leaf._id" :value="leaf._id" v-model="selectedCategories"
                                                        class="mr-2 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
                                                   <label :for="'cat-' + leaf._id" class="flex-1 cursor-pointer group-hover/leaf:text-gray-800 transition-colors">
                                                       {{ leaf.name }} <span class="text-gray-300 text-[10px]">({{ leaf.count }})</span>
                                                   </label>
                                              </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </details>
                </div>

                <!-- Brand Filter -->
                <div v-if="brandCounts.length > 0" class="mb-5 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                     <details open class="group">
                         <summary class="flex justify-between items-center font-semibold text-sm text-gray-800 cursor-pointer list-none mb-3">
                              <span>Brand</span>
                              <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                         </summary>
                         <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                             <div v-for="(brand, index) in brandCounts" :key="index"
                                 class="flex items-center text-sm group/item">
                                 <input type="checkbox" :id="'brand-' + index" v-model="selectedBrands"
                                     :value="brand.name"
                                     class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
                                 <label :for="'brand-' + index" class="flex-1 cursor-pointer text-gray-600 group-hover/item:text-gray-900 transition-colors">
                                     {{ brand.name }}
                                     <span class="text-gray-400 text-xs ml-1">({{ brand.count }})</span>
                                 </label>
                             </div>
                         </div>
                     </details>
                </div>

                <!-- Rating Filter -->
                <div class="mb-5 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                     <details open class="group">
                         <summary class="flex justify-between items-center font-semibold text-sm text-gray-800 cursor-pointer list-none mb-3">
                              <span>Rating</span>
                              <ChevronDown class="w-4 h-4 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                         </summary>
                         <div class="space-y-2">
                             <div v-for="rating in [4, 3, 2, 1]" :key="rating"
                                 class="flex items-center text-sm group/item">
                                 <input type="checkbox" :id="'rating-' + rating" v-model="selectedRatings"
                                     :value="rating"
                                     class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
                                 <label :for="'rating-' + rating" class="flex-1 cursor-pointer text-gray-600 group-hover/item:text-gray-900 flex items-center">
                                     <div class="flex text-yellow-400 mr-2">
                                         <Star v-for="i in 5" :key="i" class="w-3.5 h-3.5" :class="i <= rating ? 'fill-current' : 'text-gray-300'" />
                                     </div>
                                     <span class="text-xs">& Up</span>
                                 </label>
                             </div>
                         </div>
                     </details>
                </div>
            </div>

            <!-- Product Listing -->
            <div class="flex-1">
                <!-- Results Header -->
                <div class="mb-4 sm:mb-6">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        Products Found
                        <span class="text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-sm ml-2">
                            {{ filteredAndSortedProducts.length }}
                        </span>
                    </h3>
                </div>

                <!-- Search and Sort Controls -->
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <!-- Search Field -->
                    <div class="flex-1 relative">
                        <input v-model="searchQuery" type="text" placeholder="Search products..."
                            class="w-full text-sm border border-gray-300 rounded-lg py-2.5 sm:py-3 px-4 pr-10 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <Search
                            class="absolute size-4 sm:size-5 right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <!-- Sort Options -->
                    <div class="sm:w-48">
                        <select v-model="sortOption"
                            class="w-full border border-gray-300 rounded-lg py-2.5 sm:py-3 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            <option value="">Sort By</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="name-a-z">Name: A to Z</option>
                            <option value="name-z-a">Name: Z to A</option>
                            <option value="discount">Discount: High to Low</option>
                        </select>
                    </div>
                </div>

                <!-- Product Grid -->
                <div v-if="filteredAndSortedProducts.length" class="space-y-4">
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                        <ProductCard v-for="product in filteredAndSortedProducts" :key="product._id" :product="product"
                            @click="viewProduct(product._id)" class="hover:shadow-lg transition-shadow duration-300" />
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12 sm:py-16">
                    <div class="text-gray-400 mb-6">
                        <svg class="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                    <p class="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
                        {{ searchQuery ? `Try adjusting your search terms or filters` : `This seller hasn\'t added any
                        products yet.` }}
                    </p>
                    <button v-if="searchQuery || selectedPriceRanges.length || selectedDiscountRanges.length"
                        @click="clearFilters"
                        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Clear All Filters
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
// import { useRoute } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { useSellerStore } from '../store/sellerStore.js';
import { useProductStore } from '../store/productStore.js';
import { Shirt, ShoppingCart, Heart, Star, Search, Camera, ChevronDown } from 'lucide-vue-next';
import CustomImage from './CustomImage.vue';
import ProductCard from './ProductCard.vue';

export default {
    name: 'SellerProducts',
    components: {
        Shirt, ShoppingCart, Heart, Star, Search, Camera, ChevronDown,
        CustomImage, ProductCard
    },
    props: ['sellerId'],
    methods: {
        formatRating(rating) {
            return rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);
        }
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const sellerStore = useSellerStore();
        const productStore = useProductStore();
        const products = ref([]);
        const sortOption = ref('');
        const searchQuery = ref('');
        const selectedPriceRanges = ref([]);
        const selectedDiscountRanges = ref([]);
        const selectedCategories = ref([]);
        const selectedBrands = ref([]);
        const selectedRatings = ref([]);

        const fetchProducts = async () => {
            try {
                const sellerId = route.params.id;
                console.log('Fetching products for seller ID:', sellerId);
                const fetchedProducts = await sellerStore.fetchSellerProducts(sellerId);
                console.log('Fetched products:', fetchedProducts);
                products.value = Array.isArray(fetchedProducts) ? fetchedProducts : [];
            } catch (error) {
                console.error('Failed to fetch products:', error);
                // Remove the setErrorMessage call as it's not defined
            }
        };

        const truncateDescription = (description, maxLength = 100) => {
            return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
        };

        onMounted(async () => {
            await Promise.all([
                fetchProducts(),
                productStore.fetchCategories()
            ]);
        });

        const viewProduct = (productId) => {
            router.push({ name: 'ProductDetails', params: { id: productId } });
        };

        const filteredAndSortedProducts = computed(() => {
            if (!Array.isArray(products.value)) return [];

            // Helper to get all descendant IDs for a given category ID from the store tree
            const getDescendantIds = (rootId, nodes) => {
                let ids = [];
                for (const node of nodes) {
                    if (node._id === rootId) {
                         // Found the node, collect all its children recursively
                         const collect = (n) => {
                             let cIds = [];
                             if (n.children) {
                                 for (const child of n.children) {
                                     cIds.push(child._id);
                                     cIds = cIds.concat(collect(child));
                                 }
                             }
                             return cIds;
                         };
                         return collect(node);
                    }
                    if (node.children) {
                        const found = getDescendantIds(rootId, node.children);
                        if (found.length) return found;
                    }
                }
                return ids;
            };
            
            // Pre-calculate valid IDs for selected categories (including their descendants)
            let validCategoryIds = new Set();
            if (selectedCategories.value.length > 0 && productStore.categories) {
                selectedCategories.value.forEach(selId => {
                    validCategoryIds.add(selId);
                    const descendants = getDescendantIds(selId, productStore.categories);
                    descendants.forEach(d => validCategoryIds.add(d));
                });
            }

            let filteredProducts = products.value.filter(product => {
                if (!product) return false;

                let priceMatch = selectedPriceRanges.value.length === 0 || selectedPriceRanges.value.some(range => {
                    const price = product.price;
                    switch (range) {
                        case '0-1000': return price < 1000;
                        case '1000-5000': return price >= 1000 && price <= 5000;
                        case '5000-10000': return price >= 5000 && price <= 10000;
                        case '10000-50000': return price >= 10000 && price <= 50000;
                        case '50000-100000': return price >= 50000 && price <= 100000;
                        case 'above-100000': return price > 100000;
                        default: return true;
                    }
                });

                let discountMatch = selectedDiscountRanges.value.length === 0 || selectedDiscountRanges.value.some(range => {
                    switch (range) {
                        case '10-above': return product.discount >= 10;
                        case '20-above': return product.discount >= 20;
                        case '30-above': return product.discount >= 30;
                        case '40-above': return product.discount >= 40;
                        case '50-above': return product.discount >= 50;
                        default: return true;
                    }
                });

                let searchMatch = product.name && product.name.toLowerCase().includes(searchQuery.value.toLowerCase());

                // Category Filter (Recursive)
                let categoryMatch = true;
                if (selectedCategories.value.length > 0) {
                     const productCatId = typeof product.category === 'object' ? product.category._id : product.category;
                     categoryMatch = validCategoryIds.has(productCatId);
                }

                // Brand Filter
                let brandMatch = true;
                if (selectedBrands.value.length > 0) {
                    brandMatch = selectedBrands.value.includes(product.brand);
                }

                // Rating Filter
                let ratingMatch = true;
                if (selectedRatings.value.length > 0) {
                    const rating = product.averageRating || 0;
                    ratingMatch = selectedRatings.value.some(r => rating >= r);
                }

                return priceMatch && discountMatch && searchMatch && categoryMatch && brandMatch && ratingMatch;

            }).map(product => ({
                ...product,
                originalPrice: product.originalPrice || (product.discount ? Math.round(product.price / (1 - product.discount / 100)) : product.price)
            }));

            switch (sortOption.value) {
                case 'price-low-high':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high-low':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name-a-z':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-z-a':
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'discount':
                    filteredProducts.sort((a, b) => b.discount - a.discount);
                    break;
            }

            return filteredProducts;
        });

        const clearFilters = () => {
            selectedPriceRanges.value = [];
            selectedDiscountRanges.value = [];
            selectedCategories.value = [];
            selectedBrands.value = [];
            selectedRatings.value = [];
            searchQuery.value = '';
            sortOption.value = '';
        };

        // Count the number of products in each price range
        const priceCounts = computed(() => {
            const priceRanges = [
                { label: '₦ 0 - ₦ 1,000', value: '0-1000' },
                { label: '₦ 1,000 - ₦ 5,000', value: '1000-5000' },
                { label: '₦ 5,000 - ₦ 10,000', value: '5000-10000' },
                { label: '₦ 10,000 - ₦ 50,000', value: '10000-50000' },
                { label: '₦ 50,000 - ₦ 100,000', value: '50000-100000' },
                { label: 'Above ₦ 100,000', value: 'above-100000' },
            ];

            return priceRanges.map(range => {
                const count = products.value.filter(product => {
                    const price = product.price;
                    switch (range.value) {
                        case '0-1000': return price < 1000;
                        case '1000-5000': return price >= 1000 && price <= 5000;
                        case '5000-10000': return price >= 5000 && price <= 10000;
                        case '10000-50000': return price >= 10000 && price <= 50000;
                        case '50000-100000': return price >= 50000 && price <= 100000;
                        case 'above-100000': return price > 100000;
                        default: return false;
                    }
                }).length;

                return { ...range, count };
            });
        });

        // Count the number of products in each discount range
        const discountCounts = computed(() => {
            const discountRanges = [
                { label: '10% and above', value: '10-above' },
                { label: '20% and above', value: '20-above' },
                { label: '30% and above', value: '30-above' },
                { label: '40% and above', value: '40-above' },
                { label: '50% and above', value: '50-above' },
            ];

            return discountRanges.map(range => {
                const count = products.value.filter(product => {
                    switch (range.value) {
                        case '10-above': return product.discount >= 10;
                        case '20-above': return product.discount >= 20;
                        case '30-above': return product.discount >= 30;
                        case '40-above': return product.discount >= 40;
                        case '50-above': return product.discount >= 50;
                        default: return false;
                    }
                }).length;

                return { ...range, count };
            });
        });

        const brandCounts = computed(() => {
            const counts = {};
            products.value.forEach(p => {
                if (p.brand) {
                    counts[p.brand] = (counts[p.brand] || 0) + 1;
                }
            });
            return Object.keys(counts).map(brand => ({
                name: brand,
                count: counts[brand]
            })).sort((a, b) => b.count - a.count);
        });

        // Build Relevant Category Tree
        // Filter global tree to only include nodes that have products (or children with products)
        const relevantCategoryTree = computed(() => {
            if (!productStore.categories || productStore.categories.length === 0) return [];
            
            // Map product counts by category ID
            const counts = {};
            products.value.forEach(p => {
                const catId = typeof p.category === 'object' ? p.category._id : p.category;
                if (catId) counts[catId] = (counts[catId] || 0) + 1;
            });

            // Recursive function to filter tree and attach counts
            const filterTree = (nodes) => {
                return nodes.map(node => {
                     const children = node.children ? filterTree(node.children) : [];
                     const selfCount = counts[node._id] || 0;
                     const childrenCount = children.reduce((sum, c) => sum + c.totalCount, 0);
                     const totalCount = selfCount + childrenCount; // Cumulative count? Or just self?
                     // Usually filters show count of items in that specific category, OR items in that branch.
                     // Let's use selfCount for checkbox.
                     
                     // Actually, if I select a parent, I expect to see its children.
                     // The checkbox logic in `filteredAndSortedProducts` expects `includes(productCatId)`.
                     // If I select a parent, I should probably select all children? Or the filter logic should handle "descendants".
                     // For 3-level deep, let's keep it simple: Exact match for now.
                     // But we only show the node if it (or children) has products.
                     
                     if (totalCount === 0) return null;

                     return {
                         ...node,
                         children,
                         count: selfCount, // displayed count
                         totalCount // used for pruning
                     };
                }).filter(n => n !== null);
            };

            return filterTree(productStore.categories);
        });
        
        const isCategorySelected = (id) => selectedCategories.value.includes(id);

        const showFilters = ref(false);

        const toggleFilters = () => {
            showFilters.value = !showFilters.value;
        };


        return {
            products,
            truncateDescription,
            filteredAndSortedProducts,
            sortOption,
            searchQuery,
            selectedPriceRanges,
            selectedDiscountRanges,
            clearFilters,
            priceCounts,
            discountCounts,
            brandCounts,
            relevantCategoryTree,
            selectedCategories,
            selectedBrands,
            selectedRatings,
            isCategorySelected,
            sellerStore,
            viewProduct,
            showFilters,
            toggleFilters
        };
    }
};
</script>

<style scoped>
.social-proof-transition-enter-active,
.social-proof-transition-leave-active {
    transition: opacity 0.5s, transform 0.5s;
    color: #f47a24;
}

.social-proof-transition-enter,
.social-proof-transition-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Enhanced mobile interactions */
@media (max-width: 640px) {

/* Custom scrollbar for mobile */
    .custom-scrollbar::-webkit-scrollbar,
    ::-webkit-scrollbar {
        width: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-track,
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb,
    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
}

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

/* Smooth transitions */
* {
    transition: all 0.2s ease-in-out;
}

/* Focus states for accessibility */
input:focus,
select:focus,
button:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
}

/* Enhanced hover states */
.hover\:shadow-lg:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
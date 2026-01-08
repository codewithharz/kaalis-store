<template>
    <div :class="[
        'group bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 transform',
        viewMode === 'list' ? 'sm:flex sm:h-48' : '',
        'border border-gray-100 hover:border-gray-200'
    ]">
        <!-- Image Container -->
        <div class="relative transition-all duration-500 ease-in-out" :class="{
            'aspect-[1/1]': viewMode !== 'list',
            'w-full sm:w-60 md:w-72 h-48 sm:h-full': viewMode === 'list'
        }">
            <router-link :to="productLink" class="block w-full h-full">
                <img :src="product.images[0]" :alt="product.name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </router-link>

            <!-- actions slot here -->
            <slot name="actions"></slot>

            <!-- Edit/Delete Buttons - Mobile optimized -->
            <div v-if="isUserProduct"
                class="absolute top-1 sm:top-2 left-1 sm:left-2 flex space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button @click="handleEditProduct"
                    class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 touch-manipulation">
                    <Edit class="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button @click="handleDeleteProduct"
                    class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 touch-manipulation">
                    <Trash class="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>

            <!-- Favorite Button - Mobile optimized -->
            <button v-if="showHeartButton" @click="toggleHeart"
                class="absolute top-1 sm:top-2 right-1 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white z-10 touch-manipulation">
                <Heart :class="isHeartFilled ? 'text-red-500' : 'text-gray-300'" class="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            <!-- Discount Badge - Mobile positioned -->
            <div v-if="product.discount"
                class="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500 text-white text-xs font-medium rounded z-10">
                -{{ product.discount }}%
            </div>
        </div>

        <!-- Product Info -->
        <div class="p-2 sm:p-3 md:p-4 flex-1 transition-all duration-500 ease-in-out" :class="{
            'flex flex-col justify-between gap-2 sm:gap-4': viewMode === 'list'
        }">
            <!-- Title and Description Section -->
            <div>
                <h3 class="text-sm sm:text-[16px] font-medium text-gray-900 leading-[1.3] mb-1 sm:mb-2" :class="{
                    'line-clamp-2': viewMode !== 'list',
                    'line-clamp-1 sm:line-clamp-2': viewMode === 'list'
                }">
                    {{ product.name }}
                </h3>

                <!-- Description - Only show in list view -->
                <p v-if="viewMode === 'list'"
                    class="text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-3 mb-1 sm:mb-2">
                    {{ product.description }}
                </p>
            </div>

            <!-- Price and Info Section -->
            <div :class="{
                'flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2': viewMode === 'list',
                'space-y-2': viewMode !== 'list'
            }">
                <div class="flex-1">
                    <!-- Price and Discount Row -->
                    <div class="flex items-baseline gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <!-- Current Price -->
                        <div class="flex items-baseline">
                            <span class="text-[10px] sm:text-[12px] font-normal text-black">₦</span>
                            <span class="text-sm sm:text-[18px] font-bold text-black">{{ formatPrice(product.price)
                                }}</span>
                        </div>

                        <!-- Original Price -->
                        <div v-if="product.originalPrice" class="flex items-baseline text-gray-400">
                            <span class="text-[8px] sm:text-[10px] mr-0.5">₦</span>
                            <span class="text-[10px] sm:text-xs line-through">{{ formatPrice(product.originalPrice)
                                }}</span>
                        </div>

                        <!-- Discount Tag - Hidden on mobile when in image badge -->
                        <span v-if="product.discount && viewMode === 'list'"
                            class="px-1 sm:px-1.5 py-0.5 rounded border border-red-500 text-[10px] sm:text-xs text-red-500 font-medium">
                            -{{ product.discount }}%
                        </span>
                    </div>

                    <!-- Additional Info for Grid View -->
                    <div v-if="viewMode !== 'list'" class="space-y-1 sm:space-y-2">
                        <!-- Ratings and Sold Count Row -->
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-500">{{ formatSoldCount(product.soldCount) }} sold</span>

                            <!-- Ratings -->
                            <div class="flex items-center gap-1">
                                <div class="flex">
                                    <Star v-for="i in 5" :key="i"
                                        :class="[i <= displayRating ? 'text-yellow-400' : 'text-gray-200']"
                                        class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </div>
                                <span class="text-[10px] sm:text-[11px] text-gray-500">{{ ratingCount }}</span>
                            </div>
                        </div>

                        <!-- Stock and Cart Row -->
                        <div class="flex items-center justify-between">
                            <span v-if="product.isAvailable" class="text-[10px] sm:text-[11px] text-gray-600">
                                <span class="hidden sm:inline">In stock: </span>{{ product.stock }}
                            </span>

                            <!-- Cart Button -->
                            <button
                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 touch-manipulation"
                                @click="addToCart">
                                <ShoppingCart class="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                            </button>
                        </div>

                        <!-- Additional Product Info - Mobile condensed -->
                        <div class="flex flex-wrap items-center gap-1 sm:gap-2">
                            <span v-if="product.bulkPricing?.length"
                                class="text-[10px] sm:text-[11px] text-gray-600 bg-gray-100 px-1 rounded">
                                Bulk
                            </span>
                            <span v-if="product.variants?.length"
                                class="text-[10px] sm:text-[11px] text-gray-600 bg-gray-100 px-1 rounded">
                                {{ product.variants.length }} variants
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Right side info for List View -->
                <div v-if="viewMode === 'list'"
                    class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
                    <span class="text-xs sm:text-sm text-gray-500">{{ formatSoldCount(product.soldCount) }} sold</span>

                    <!-- Ratings -->
                    <div class="flex items-center gap-1 sm:gap-2">
                        <div class="flex">
                            <Star v-for="i in 5" :key="i"
                                :class="[i <= displayRating ? 'text-yellow-400' : 'text-gray-200']"
                                class="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <span class="text-xs sm:text-sm text-gray-500">({{ ratingCount }})</span>
                    </div>

                    <!-- Stock -->
                    <span v-if="product.isAvailable" class="text-xs sm:text-sm text-gray-600">
                        <span class="hidden sm:inline">Stock: </span>{{ product.stock }}
                    </span>

                    <!-- Cart Button -->
                    <button
                        class="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 touch-manipulation self-end sm:self-center"
                        @click="addToCart">
                        <ShoppingCart class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal - Mobile optimized -->
    <div v-if="showDeleteModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 transform transition-all">
            <div class="text-center">
                <AlertCircle class="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 sm:mb-4" />
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Delete Product</h3>
                <p class="text-sm sm:text-base text-gray-500">Are you sure you want to delete this product? This action
                    cannot be undone.</p>
            </div>

            <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button @click="closeDeleteModal"
                    class="px-4 sm:px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors order-2 sm:order-1">
                    Cancel
                </button>
                <button @click="confirmDelete" :disabled="isDeleting"
                    class="px-4 sm:px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2">
                    <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
                    <span class="text-sm sm:text-base">{{ isDeleting ? 'Deleting...' : 'Delete Product' }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { useProductStore } from '../store/productStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUserStore } from '../store/user';
import { useCartStore } from '../store/cart';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Star, Heart, ShoppingCart, Edit, Trash, AlertCircle, Loader2 } from 'lucide-vue-next';

export default {
    name: 'ProductCard',
    components: {
        Star,
        Heart,
        ShoppingCart,
        Edit,
        Trash,
        AlertCircle,
        Loader2
    },
    props: {
        product: {
            type: Object,
            required: true,
            validator: (value) => {
                // Add rating validation
                if (!value || !value._id) {
                    console.error('Invalid product prop:', value);
                    return false;
                }

                // Ensure rating props have default values if not provided
                value.averageRating = value.averageRating || 0;
                value.numberOfRatings = value.numberOfRatings || 0;
                return true;
            }
        },
        isUserProduct: {
            type: Boolean,
            default: false
        },
        // used in ProductList.vue
        customClass: {
            type: String,
            default: ''
        },
        tagsButtonClass: {
            type: String,
            default: ''
        },
        viewMode: {
            type: String,
            default: 'grid',
            validator: value => ['grid', 'list'].includes(value)
        },
        showHeartButton: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        console.log('Product in ProductCard:', this.product);
    },

    computed: {
        // truncate words
        truncatedDescription() {
            if (!this.product || !this.product.description) {
                return 'No description available';
            }
            const words = this.product.description.split(' ');
            return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : this.product.description;
        },

        availableStock() {
            if (!this.product || typeof this.product.stock !== 'number') {
                return 0;
            }
            return this.product.stock - (this.product.reservedStock || 0);
        },

        productTags() {
            return this.product.tags || [];
        },

        displayRating() {
            return Math.round(this.product?.averageRating || 0);
        },

        ratingCount() {
            return this.formatSoldCount(this.product?.numberOfRatings || 0);
        },

        isUserProductsPage() {
            return this.$route.name === 'UserProducts';
        },
        layoutClasses() {
            if (!this.isUserProductsPage) {
                return 'aspect-[1/1]'; // Always grid layout for home page
            }
            return this.viewMode === 'list' ? 'w-48 h-full' : 'aspect-[1/1]';
        }
    },

    setup(props, { emit }) {
        const productStore = useProductStore();
        const wishlistStore = useWishlistStore();
        const userStore = useUserStore();
        const cartStore = useCartStore();
        const router = useRouter();
        const showDeleteModal = ref(false);
        const isDeleting = ref(false);
        const isHeartFilled = ref(false);

        const handleDeleteProduct = () => {
            showDeleteModal.value = true;
        };

        const closeDeleteModal = () => {
            showDeleteModal.value = false;
        };

        console.log('Product Props:', props.product);
        console.log('Is User Product:', props.isUserProduct);
        console.log('Custom Class:', props.customClass);
        console.log('Tags Button Class:', props.tagsButtonClass);

        // Initialize wishlist status
        const checkWishlistStatus = async () => {
            try {
                await wishlistStore.initWishlist();
                if (wishlistStore.wishlists.length > 0) {
                    const wishlist = wishlistStore.wishlists[0];
                    const result = await wishlistStore.getProductsInWishlist(wishlist._id);

                    // Access the products directly from result (not result.products)
                    const products = result.products;

                    // Make sure we have products and they're in an array
                    if (Array.isArray(products)) {
                        isHeartFilled.value = products.some(p => p._id === props.product._id);
                    }

                }
            } catch (error) {
                console.error('Error checking wishlist status:', error);
                isHeartFilled.value = false;
            }
        };

        const toggleHeart = async () => {
            try {
                if (!isHeartFilled.value) {  // Use .value since it's a ref
                    // Add to wishlist
                    if (wishlistStore.wishlists.length > 0) {
                        const wishlist = wishlistStore.wishlists[0];
                        await wishlistStore.addToWishlist(wishlist._id, props.product._id);  // Use props.product._id
                        isHeartFilled.value = true;  // Use .value
                        toast.success('Added to wishlist');
                    } else {
                        // Create new wishlist if none exists
                        const newWishlist = await wishlistStore.createWishlist({
                            name: 'My Wishlist',
                            visibility: 'private'
                        });
                        await wishlistStore.addToWishlist(newWishlist._id, props.product._id);  // Use props.product._id
                        isHeartFilled.value = true;  // Use .value
                        toast.success('Added to wishlist');
                    }
                } else {
                    // Remove from wishlist
                    if (wishlistStore.wishlists.length > 0) {
                        const wishlist = wishlistStore.wishlists[0];
                        await wishlistStore.removeFromWishlist(wishlist._id, props.product._id);  // Use props.product._id
                        isHeartFilled.value = false;  // Use .value
                        toast.success('Removed from wishlist');
                    }
                }
            } catch (err) {
                console.error('Error toggling wishlist:', err);
                toast.error('Failed to update wishlist');
            }
        };

        // Check wishlist status on mount
        onMounted(() => {
            checkWishlistStatus();
        });

        const formatPrice = (price) => {
            return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        const formatSoldCount = (count) => {
            if (!count || isNaN(count)) return '0';
            if (count >= 1000) {
                return (count / 1000).toFixed(1) + 'K';
            }
            return count.toString();
        }

        const formatNumberToK = (number) => {
            if (!number) return '0';
            if (number >= 1000000) {
                return (number / 1000000).toFixed(1) + 'M';
            }
            if (number >= 1000) {
                return (number / 1000).toFixed(1) + 'K';
            }
            return number.toString();
        }

        const addToCart = async () => {
            try {
                if (!userStore.isLoggedIn) {
                    toast.error('Please log in to add items to cart');
                    return;
                }

                // Find the default/first available variant if product has variants
                let selectedVariant = null;
                if (props.product.variants?.length > 0) {
                    selectedVariant = props.product.variants.find(v => v.stock > 0);
                }

                // If product has variants but none are available, show error
                if (props.product.variants?.length > 0 && !selectedVariant) {
                    toast.error('No variants available');
                    return;
                }

                // Check if product is already in cart
                const isInCart = cartStore.items.some(item => item.product._id === props.product._id);
                if (isInCart) {
                    // Update quantity if already in cart
                    const cartItem = cartStore.items.find(item => item.product._id === props.product._id);
                    await cartStore.updateQuantity(props.product._id, cartItem.quantity + 1);
                    toast.success('Updated quantity in cart');
                } else {
                    // Create payload for adding to cart
                    const payload = {
                        _id: props.product._id,
                        name: props.product.name,
                        price: selectedVariant ? selectedVariant.price : props.product.price,
                        selectedVariant: selectedVariant,
                        quantity: 1
                    };

                    // Add variant details if available
                    const variantDetails = selectedVariant ? {
                        variant: {
                            _id: selectedVariant._id,
                            color: selectedVariant.color?.hexCode,
                            size: selectedVariant.attributes?.find(attr =>
                                ['size', 'shape'].includes(attr.name.toLowerCase())
                            )?.value,
                            price: selectedVariant.price,
                            attributes: selectedVariant.attributes
                        }
                    } : {};

                    await cartStore.addToCart(payload, 1, variantDetails);
                    await cartStore.fetchCart();
                    toast.success('Added to cart');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                toast.error('Failed to add item to cart');
            }
        }

        const editProduct = () => {
            // Implement edit functionality
            console.log('Edit product:', this.product._id);
            // You might want to emit an event to the parent component
            this.$emit('edit', this.product._id);
        }

        const formatRating = (rating) => {
            return rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);
        }

        const formatUnitDisplay = (unit) => {
            if (!unit) return '';
            return unit.displayUnit || `${unit.value || ''} ${unit.baseUnit || ''}`.trim();
        }

        const productLink = computed(() => {
            // Get current route
            const currentRoute = router.currentRoute.value;
            const isInUserProducts = currentRoute.path.includes('/account/profile/my-products');

            // Always use the same route, but keep the origin context
            return {
                name: 'ProductDetails',
                params: { id: props.product._id },
                query: isInUserProducts ? { from: 'my-products' } : undefined
            };
        });

        const handleEditProduct = () => {
            // Instead of navigating, emit an event for editing
            emit('edit', props.product._id);
        };

        const confirmDelete = async () => {
            try {
                isDeleting.value = true;

                // Emit 'delete' instead of 'productDeleted' to match the parent's listener
                emit('delete', props.product._id);
                showDeleteModal.value = false;
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product. Please try again.');
            } finally {
                isDeleting.value = false;
            }
        };

        const fetchProductDetails = async () => {
            await productStore.fetchProductById(props.product._id);
            router.push({ name: 'ProductDetails', params: { id: props.product._id } });
        };

        const calculateOriginalPrice = (product) => {
            return product.originalPrice || (product.discount ? Math.round(product.price / (1 - product.discount / 100)) : product.price);
        };

        onMounted(async () => {
            const wishlistStore = useWishlistStore();
            await wishlistStore.initWishlist();

            if (wishlistStore.wishlists.length > 0) {
                const wishlist = wishlistStore.wishlists[0];
                // const products = await wishlistStore.getProductsInWishlist(wishlist._id);
                // isHeartFilled.value = products.some(p => p._id === props.product._id);
            }
        });

        return {
            productLink,
            handleDeleteProduct,
            fetchProductDetails,
            calculateOriginalPrice,
            handleEditProduct,
            isHeartFilled,
            toggleHeart,
            showDeleteModal,
            isDeleting,
            closeDeleteModal,
            confirmDelete,

            formatPrice,
            formatSoldCount,
            formatNumberToK,
            addToCart,
            editProduct,
            formatRating,
            formatUnitDisplay
        };
    },
};
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Ensure proper text rendering */
:deep(*) {
    font-family: miui, system-ui, -apple-system, BlinkMacSystemFont, '.SFNSText-Regular', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Touch-friendly buttons */
.touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

/* Mobile-specific adjustments */
@media (max-width: 640px) {

    /* Ensure minimum touch targets of 44px */
    button {
        min-height: 24px;
        min-width: 24px;
    }

    /* Improve text readability on small screens */
    .group:hover .group-hover\:scale-105 {
        transform: scale(1.02);
        /* Reduce hover scale on mobile */
    }

    /* Optimize spacing for small screens */
    .space-y-1>*+* {
        margin-top: 0.25rem;
    }
}

/* Improved responsive design for very small screens */
@media (max-width: 375px) {
    .group {
        border-radius: 0.5rem;
        /* Slightly smaller border radius */
    }

    /* Reduce padding on very small screens */
    .p-2 {
        padding: 0.375rem;
    }
}

/* Enhanced hover effects for larger screens */
@media (min-width: 768px) {
    .group:hover {
        transform: translateY(-2px);
    }
}

/* Optimize modal for mobile */
@media (max-width: 640px) {
    .fixed.inset-0>div {
        margin: 1rem;
        max-height: calc(100vh - 2rem);
        overflow-y: auto;
    }
}

/* Improve button accessibility */
button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Smooth transitions for better UX */
* {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}
</style>
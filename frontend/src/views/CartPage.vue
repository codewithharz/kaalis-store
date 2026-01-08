<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Shopping Cart ({{ cartStore.cartCount }})</h1>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">{{ error }}</span>
            <button @click="retryLoading"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2">
                Retry
            </button>
        </div>

        <div v-else class="flex flex-col lg:flex-row gap-4 cart-container">
            <!-- Product List -->
            <div class="w-full lg:w-2/3 product-list-container">
                <div class="bg-white shadow-md rounded-lg p-4">
                    <div class="flex flex-wrap items-center mb-4">
                        <div class="flex items-center mr-4 mb-2 sm:mb-0">
                            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"
                                class="mr-2 custom-checkbox">
                            <span class="mr-4">Select all items</span>
                        </div>
                        <button @click="deleteSelectedItems" class="text-blue-500">
                            Delete selected items
                        </button>
                    </div>

                    <!-- Shipping info -->
                    <div class="bg-yellow-50 p-4 mb-4 rounded-lg">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div class="mb-2 sm:mb-0">
                                <div class="flex items-center space-x-2">
                                    <span class="font-semibold">Shipped by Bruthol</span>
                                    <span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger class="flex items-center">
                                                    <ShieldQuestion class="w-4 h-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p class="text-sm w-72">Choice items are curated, selected and
                                                        shipped directly by Bruthol. This includes a delivery guarantee
                                                        and free returns on all items.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600 font-bold">
                                    To save <span class="text-red-500">US ₦{{ shippingCost.toFixed(2) }}</span> shipping
                                    fee shop <span class="text-red-500">US ₦{{ minimumForFreeShipping.toFixed(2)
                                    }}</span> more
                                </p>
                                <p class="text-sm text-gray-600">Lower carbon footprint with reduced packaging</p>
                            </div>
                            <ChevronRight class="w-5 h-5 text-gray-400 mt-2 sm:mt-0" />
                        </div>
                    </div>

                    <!-- Product Items -->
                    <div v-if="cartStore.items.length === 0" class="text-center py-4">
                        <p class="text-gray-600">Your cart is empty.</p>
                    </div>
                    <div v-else v-for="item in cartStore.items" :key="item.product?._id"
                        class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                        <div class="flex items-center mb-2 sm:mb-0">
                            <img v-if="item.product?.images?.length > 0" :src="item.product.images[0]"
                                :alt="item.product?.name || 'Product image'" class="w-16 h-16 object-cover mr-4">
                            <div v-else class="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                                <span class="text-gray-400">No image</span>
                            </div>
                            <div>
                                <h3 class="font-semibold" :title="item.product?.name || 'Product name unavailable'">
                                    {{ formatTitle(item.product?.name || 'Product name unavailable') }}
                                </h3>

                                <!-- Add variant details -->
                                <div v-if="item.variant" class="text-sm text-gray-600">
                                    <span v-if="item.variant.size">Size: {{ item.variant.size }}</span>
                                    <span v-if="item.variant.color" class="ml-2">Color: {{ item.variant.color
                                    }}</span>jh
                                </div>

                                <div class="description-container">
                                    <p class="text-gray-600 text-sm" :class="{ 'expanded': item.showFullDescription }">
                                        <span v-html="formatDescription(item.product)"></span>
                                    </p>
                                    <span v-if="item.product?.description && item.product.description.length > 100"
                                        @click="toggleDescription(item)" class="text-blue-500 cursor-pointer text-sm">
                                        {{ item.showFullDescription ? 'Read less' : 'Read more' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center mt-2 sm:mt-0">
                            <div class="flex items-center mr-4">
                                <button @click="decrementQuantity(item)" class="bg-gray-200 p-1 rounded-full"
                                    :disabled="loadingItems[item.product?._id]">
                                    <Minus class="w-3 h-3" />
                                </button>
                                <span class="mx-2">{{ item.quantity }}</span>
                                <button @click="incrementQuantity(item)" class="bg-gray-200 p-1 rounded-full"
                                    :disabled="loadingItems[item.product?._id]">
                                    <Plus class="w-3 h-3" />
                                </button>
                            </div>
                            <span class="font-semibold">
                                <!-- ₦{{ item.product?.price ? (item.product.price * item.quantity).toFixed(2) : '0.00' }} -->
                                ₦{{ getItemPrice(item) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div class="w-full lg:w-1/3 mt-4 lg:mt-0 summary-container">
                <div class="bg-white shadow-md rounded-lg p-4">
                    <h2 class="text-xl font-semibold mb-4">Summary</h2>
                    <div>
                        <div class="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>₦ {{ cartSubtotal.toFixed(2) }}</span>
                        </div>
                        <div v-if="cartStore.items.length > 0" class="flex justify-between mb-2">
                            <span>Shipping fee</span>
                            <span>₦ {{ shippingCost.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between mb-4">
                            <span>Promo codes</span>
                            <div v-if="cartStore.coupon">
                                <span>{{ cartStore.coupon.code }} applied</span>
                                <button @click="removeCoupon" class="text-red-500 ml-2">Remove</button>
                            </div>
                            <div v-else class="flex items-center justify-end">
                                <input v-model="couponCode" type="text" placeholder="Enter code"
                                    class="w-1/2 rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <button @click="applyPromoCode"
                                    class="bg-blue-500 text-white px-4 py-[0.35em] rounded-r hover:bg-blue-600 transition duration-300 border border-blue-500">
                                    Apply
                                </button>
                            </div>
                        </div>
                        <div v-if="cartStore.discount > 0" class="flex justify-between mb-4 text-green-600">
                            <span>Discount</span>
                            <span>-₦{{ cartStore.discount.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg mb-4">
                            <span>Total</span>
                            <span>₦ {{ total.toFixed(2) }}</span>
                        </div>
                        <div class="text-right mb-4">
                            <!-- 0.6% for the platform (1.01)-->
                            <span class="text-gray-600">US $ {{ ((Math.floor(total * exchangeRate) +
                                Math.ceil((total *
                                    exchangeRate % 1) * 100) / 100) * 1.01).toFixed(2) }}</span>
                        </div>
                        <button @click="proceedToCheckout"
                            class="w-full bg-[#24a6bb] text-white py-2 rounded-lg hover:bg-[#1c8a9e] transition duration-300"
                            :disabled="cartStore.items.length === 0">
                            Checkout ({{ cartStore.cartCount }})
                        </button>
                    </div>

                    <!-- Payment Methods and Buyer Protection -->
                    <div class="mt-4">
                        <h3 class="font-semibold mb-2">Pay with</h3>
                        <div class="flex flex-wrap gap-2">
                            <img :src="paymentImages.visaLogo" alt="Visa" class="h-8">
                            <img :src="paymentImages.mastercardLogo" alt="Mastercard" class="h-8">
                            <img :src="paymentImages.googlePay" alt="Google Pay" class="h-8">
                            <img :src="paymentImages.applePay" alt="Apple Pay" class="h-8">
                            <img :src="paymentImages.paypalLogo" alt="PayPal" class="h-8">
                            <img :src="paymentImages.orangeMoney" alt="Orange Money" class="h-8">
                        </div>
                    </div>

                    <div class="mt-4">
                        <h3 class="font-semibold mb-2">Buyer protection</h3>
                        <p class="text-sm text-gray-600 flex items-center">
                            <ShieldCheck class="w-6 h-6 mr-2 text-green-500" />
                            Get full refund if the item is not as described or if is not delivered
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- vue 3 doesn't require explicit export default -->
<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { useCartStore } from '../store/cart.js';
import { useProductStore } from '../store/productStore.js';

import { ChevronRight, Trash2, Heart, ShieldCheck, Plus, Minus, ShieldQuestion } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

// Import images
import visaLogo from '../assets/images/visa-pay.png';
import mastercardLogo from '../assets/images/mastercard-pay.webp';
import googlePay from '../assets/images/google-pay.png';
import applePay from '../assets/images/apple-pay.webp';
import paypalLogo from '../assets/images/paypal-pay.webp';
import orangeMoney from '../assets/images/orange-p.jpeg';

const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore();
const selectAll = ref(false);
// const shippingCost = computed(() => cartStore.items.length > 0 ? 1.99 : 0);
const total = computed(() => cartStore.totalAfterDiscount + shippingCost.value);

const minimumForFreeShipping = ref(4.99);
const exchangeRate = ref(0.0006); // NGN to USD exchange rate
const loadingItems = reactive({});
const error = ref(null);
const couponCode = ref('');

// Make imported images available to the template
const paymentImages = {
    visaLogo,
    mastercardLogo,
    googlePay,
    applePay,
    paypalLogo,
    orangeMoney
};

const toggleSelectAll = () => {
    cartStore.items.forEach(item => item.selected = selectAll.value);
};

const deleteSelectedItems = async () => {
    for (const item of cartStore.items) {
        if (item.selected && item.product && item.product._id) {
            await cartStore.removeFromCart(item.product._id);
        }
    }
    await refreshCart();
};

const decrementQuantity = async (item) => {
    if (loadingItems[item.product._id]) return;
    loadingItems[item.product._id] = true;
    try {
        if (item.quantity > 1) {
            await cartStore.updateQuantity(item.product._id, item.quantity - 1);
        } else {
            await cartStore.removeFromCart(item.product._id);
        }
        await refreshCart();
    } catch (error) {
        console.error('Error decrementing quantity:', error);
        toast.error('Failed to update quantity');
    } finally {
        loadingItems[item.product._id] = false;
    }
};

const incrementQuantity = async (item) => {
    if (loadingItems[item.product._id]) return;
    loadingItems[item.product._id] = true;
    try {
        await cartStore.updateQuantity(item.product._id, item.quantity + 1);
        await refreshCart();
    } catch (error) {
        console.error('Error incrementing quantity:', error);
        toast.error('Failed to update quantity');
    } finally {
        loadingItems[item.product._id] = false;
    }
};

const getItemPrice = (item) => {
    let price = 0;
    if (item.variant) {
        price = item.variant.price;
    } else if (item.product) {
        price = item.product.price;
    }
    const total = price * item.quantity;
    return total.toFixed(2);
};

const formatTitle = (title) => {
    if (!title) return '';
    const capitalizedTitle = title.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    return capitalizedTitle.length <= 50 ? capitalizedTitle : capitalizedTitle.slice(0, 47) + '...';
};

const formatDescription = (product) => {
    if (!product || !product.description) return '';
    let description = product.description;
    description = description.replace(/<\/?[^>]+(>|$)/g, "");
    return description.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
};

const toggleDescription = (item) => {
    if (item) {
        item.showFullDescription = !item.showFullDescription;
    }
};

const refreshCart = async () => {
    error.value = null;
    try {
        await cartStore.fetchCart();
        cartStore.calculateDiscount();
        console.log('Cart items details:', cartStore.items.map(item => ({
            name: item.product?.name,
            basePrice: item.product?.price,
            variantPrice: item.variant?.price,
            finalPrice: getItemPrice(item)
        })));

        const invalidItems = cartStore.items.filter(item => !item.product || !item.product.price);
        if (invalidItems.length > 0) {
            console.error('Invalid items found:', invalidItems);
            error.value = 'Some items in your cart are no longer available.';
            toast.error('Some items in your cart are no longer available and have been removed.');

            await Promise.all(invalidItems.map(item => cartStore.removeFromCart(item._id)));
            await cartStore.fetchCart();
        }
    } catch (err) {
        console.error('Error refreshing cart:', err);
        error.value = 'Failed to load cart. Please try again.';
        toast.error('Failed to refresh cart. Please try again.');
    }
};

const cartSubtotal = computed(() => {
    return cartStore.items.reduce((total, item) => {
        const itemTotal = parseFloat(getItemPrice(item));
        return total + itemTotal;
    }, 0);
});

const applyPromoCode = async () => {
    if (!couponCode.value) {
        toast.error('Please enter a coupon code');
        return;
    }
    const code = couponCode.value; // Store the code in a local variable
    couponCode.value = ''; // Clear the input field immediately
    try {
        // await cartStore.applyCoupon(couponCode.value);
        await cartStore.applyCoupon(code);
        couponCode.value = ''; // Clear the input field
        toast.success(`Coupon applied successfully! You saved $${cartStore.discount.toFixed(2)}`);
    } catch (error) {
        console.error('Error applying coupon:', error);
        toast.error(error.response?.data?.message || 'Failed to apply coupon');
    }
};

const removeCoupon = async () => {
    try {
        await cartStore.removeCoupon();
        // The success message is now handled in the cart store
        await refreshCart();
    } catch (error) {
        console.error('Error removing coupon:', error);
        // The error message is already displayed by the cart store
    }
};

const proceedToCheckout = () => {
    if (cartStore.items.length === 0) {
        toast.error('Your cart is empty. Add some items before checking out.');
        return;
    }
    router.push({ name: 'Checkout' });
};

const retryLoading = () => {
    refreshCart();
};

const shippingCost = computed(() => {
    if (!productStore.shippingRules) {
        console.warn('Shipping rules not available, using default fee');
        return 5.99; // Return a default value instead of setting shippingFee.value
    }

    let fee = productStore.shippingRules.baseShippingFee || 0;

    if (cartStore.cartTotal > (productStore.shippingRules.freeShippingThreshold || 0)) {
        fee = 0;
    } else if (cartStore.items) {
        cartStore.items.forEach(item => {
            if (item && item.product) {
                const categoryFee = (productStore.shippingRules.categoryFees && item.product.category)
                    ? (productStore.shippingRules.categoryFees.get(item.product.category.toString()) || 0)
                    : 0;
                fee += categoryFee;

                const weightFee = ((item.product.unit && item.product.unit.value) || 0)
                    * item.quantity
                    * (productStore.shippingRules.perWeightUnitFee || 0);
                fee += weightFee;
            }
        });

        if (productStore.shippingRules.currentPromotion) {
            const now = new Date();
            const startDate = new Date(productStore.shippingRules.currentPromotion.startDate);
            const endDate = new Date(productStore.shippingRules.currentPromotion.endDate);
            if (now >= startDate && now <= endDate) {
                fee = Math.max(fee - (productStore.shippingRules.currentPromotion.discount || 0), 0);
            }
        }
    }

    return Number(fee.toFixed(2));
});

onMounted(async () => {
    await Promise.all([
        refreshCart(),
        productStore.fetchProducts() // This should fetch shipping rules as well
    ]);
});

// This function is not needed in <script setup>, but keeping it for clarity
// const setup = () => {
//     return {
//         paymentImages,
//         // ... other returned values ...
//     };
// };

</script>

<style scoped>
/* Custom checkbox styling */
/* .custom-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #ccc;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
} */

.custom-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #ccc;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    flex-shrink: 0;
    /* Prevent shrinking */
    margin-right: 0.5rem;
    /* Add some margin to the right */
}

.custom-checkbox:checked {
    background-color: #24a6bb;
    border-color: #24a6bb;
}

.custom-checkbox:checked::before {
    content: '\2714';
    display: block;
    text-align: center;
    color: white;
    font-size: 0.8rem;
    line-height: 1.25rem;
}

.custom-checkbox:hover {
    border-color: #24a6bb;
}

/* Add any additional styles here */
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-spinner {
    -moz-appearance: textfield;
}

@media (min-width: 1024px) {
    .cart-container {
        height: calc(100vh - 130px);
        /* Adjust 100px based on your header height */
        overflow: hidden;
    }

    .product-list-container {
        overflow-y: auto;
        max-height: 100%;
    }

    .summary-container {
        position: sticky;
        top: 1rem;
        /* Adjust based on your needs */
        max-height: calc(100vh - 120px);
        /* Adjust 120px based on your header height plus some padding */
        overflow-y: auto;
    }
}

/* Optional: Add this if you want to hide scrollbars on all elements */
* {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

*::-webkit-scrollbar {
    display: none;
}

@media (min-width: 640px) {

    /* sm breakpoint */
    .description-container {
        max-width: calc(100% - 5rem);
        /* Adjust based on the width of your icons */
    }
}

.description-container {
    position: relative;
    width: 100%;
    max-width: 100%;
}

.description-container p {
    max-height: 3em;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.description-container p.expanded {
    max-height: none;
    overflow: visible;
}

@media (min-width: 640px) {
    .description-container {
        max-width: calc(100% - 4rem);
        /* Adjust based on the width of your icons */
    }
}
</style>

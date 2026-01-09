<!-- frontend/src/views/CheckoutPage.vue -->
<template>
    <div class="container mx-auto p-4 checkout-container">
        <h1 class="text-2xl font-bold mb-6">Checkout</h1>
        <div v-if="isLoading" class="text-center py-8">
            <p class="text-xl text-gray-600">Loading checkout information...</p>
        </div>
        <div v-else-if="error" class="text-center py-8">
            <p class="text-xl text-red-600">{{ error }}</p>
            <button @click="retryLoading" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Retry</button>
        </div>
        <div v-else class="flex flex-col lg:flex-row gap-8 checkout-content">
            <!-- Left Column (Scrollable Content) -->
            <div class="w-full lg:w-2/3 checkout-main-content">
                <!-- Shipping Address -->
                <div class="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
                    <h2 class="text-xl font-semibold mb-4">Shipping address</h2>
                    <div v-if="selectedAddress">
                        <p>{{ selectedAddress.firstName }} {{ selectedAddress.lastName }}</p>
                        <p>{{ selectedAddress.phone }}</p>
                        <p>{{ selectedAddress.email }}</p>
                        <p>{{ selectedAddress.street }}, {{ selectedAddress.houseNo }}, {{ selectedAddress.postalCode }}
                        </p>
                        <p>{{ selectedAddress.city }}, {{ selectedAddress.state }}, {{ selectedAddress.country }}</p>
                        <button @click="editAddress" class="text-blue-500 mt-2">Edit</button>
                    </div>
                    <form v-else @submit.prevent="saveAddress" class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input v-model="addressForm.firstName" placeholder="First Name" required
                                class="input-field">
                            <input v-model="addressForm.lastName" placeholder="Last Name" required class="input-field">
                            <input v-model="addressForm.phone" placeholder="Phone" required class="input-field">
                            <input v-model="addressForm.email" placeholder="Email" type="email" class="input-field">
                            <input v-model="addressForm.street" placeholder="Street" required class="input-field">
                            <input v-model="addressForm.houseNo" placeholder="House Number" required
                                class="input-field">
                            <input v-model="addressForm.city" placeholder="City" required class="input-field">
                            <input v-model="addressForm.state" placeholder="State" required class="input-field">
                            <input v-model="addressForm.country" placeholder="Country" required class="input-field">
                            <input v-model="addressForm.postalCode" placeholder="Postal Code" required
                                class="input-field">
                        </div>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                            {{ addressForm._id ? 'Update Address' : 'Add New Address' }}
                        </button>
                    </form>
                </div>

                <!-- Payment Methods -->
                <!-- Payment Methods moved to Summary -->

                <!-- Order Items -->
                <div class="bg-white shadow-md rounded-lg p-4 sm:p-6">
                    <h2 class="text-xl font-semibold mb-4">Order Items</h2>
                    <div v-if="cartStore.items.length === 0" class="text-center py-4">
                        <p class="text-gray-600">Your cart is empty.</p>
                    </div>
                    <div v-else v-for="item in cartStore.items" :key="item.product?._id || index"
                        class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                        <div class="flex items-center mb-2 sm:mb-0">
                            <img v-if="item.product?.images?.length > 0" :src="item.product.images[0]"
                                :alt="item.product?.name || 'Product image'" class="w-16 h-16 object-cover mr-4">
                            <div v-else class="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                                <span class="text-gray-400">Loading...</span>
                            </div>
                            <div>
                                <h3 class="font-semibold"
                                    :title="item.product ? item.product.name : 'Product name unavailable'">
                                    {{ formatTitle(item.product ? item.product.name : 'Product name unavailable') }}
                                </h3>
                                <div class="description-container">
                                    <p class="text-gray-600 text-sm"
                                        :class="{ 'expanded': item.product?.showFullDescription }">
                                        <span v-html="formatDescription(item.product)"></span>
                                    </p>
                                    <span v-if="item.product?.description && item.product.description.length > 100"
                                        @click="toggleDescription(item.product)"
                                        class="text-blue-500 cursor-pointer text-sm">
                                        {{ item.product?.showFullDescription ? 'Read less' : 'Read more' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center mt-2 sm:mt-0">
                            <div class="flex items-center mr-4">
                                <button @click="decrementQuantity(item)" class="bg-gray-200 p-1 rounded-full"
                                    :disabled="loadingItems[item.product?._id] || !item.product?._id">
                                    <Minus class="w-3 h-3" />
                                </button>
                                <span class="mx-2">{{ item.quantity }}</span>
                                <button @click="incrementQuantity(item)" class="bg-gray-200 p-1 rounded-full"
                                    :disabled="loadingItems[item.product?._id] || !item.product?._id">
                                    <Plus class="w-3 h-3" />
                                </button>
                            </div>
                            <span class="font-semibold">US ${{ item.product && item.product?.price ?
                                (item.product?.price * item.quantity).toFixed(2) : '0.00' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column (Summary) -->
            <div class="w-full lg:w-1/3 checkout-summary mt-6 lg:mt-0">
                <div class="bg-white shadow-md rounded-lg p-4 sm:p-6 sticky-summary">
                    <h2 class="text-xl font-semibold mb-4">Summary</h2>
                    <div class="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>{{ subtotal.toFixed(2) }} ₦</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Shipping fee</span>
                        <span>{{ shippingFee === 0 ? 'Free' : ` ₦ ${shippingFee.toFixed(2)}` }}</span>
                    </div>

                    <!-- Coupons -->
                    <div class="border-t my-4 pt-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium">Coupon</span>
                            <span v-if="cartStore.coupon" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Applied</span>
                        </div>
                         <div v-if="cartStore.coupon" class="bg-green-50 p-2 rounded text-sm">
                             <div class="flex justify-between items-center">
                                 <span class="font-medium text-green-700">{{ cartStore.coupon.code }}</span>
                                 <button @click="removeCoupon" class="text-red-500 text-xs hover:underline">Remove</button>
                             </div>
                             <div v-if="discount > 0" class="flex justify-between mt-1 text-green-600">
                                 <span>Savings</span>
                                 <span>-₦{{ discount.toFixed(2) }}</span>
                             </div>
                         </div>
                         <div v-else>
                             <div class="flex items-center gap-2">
                                 <input v-model="promoCode" type="text" placeholder="Code"
                                     class="w-full rounded border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#24a6bb]">
                                 <button @click="applyPromoCode(promoCode)"
                                     class="bg-[#24a6bb] text-white px-3 py-1 rounded text-sm hover:bg-[#1c8a9e]">
                                     Apply
                                 </button>
                             </div>
                             <p class="text-xs text-gray-500 mt-1">Redeem 1000 points for ₦1000 off</p>
                         </div>
                    </div>

                    <!-- CluesBucks -->
                    <div class="border-t my-4 pt-4">
                        <div class="flex justify-between mb-2 items-center">
                            <span class="font-medium">CluesBucks</span>
                            <span class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{{ availableCluesBucks }} pts</span>
                        </div>
                        <div class="flex items-center justify-between gap-2">
                             <input v-model="cluesBucksToUse" type="number" :max="cluesBucksBalance"
                                 class="w-20 px-2 py-1 border rounded text-sm" :disabled="!cluesBucksBalance" placeholder="0" />
                             <button @click="applyCluesBucks"
                                 :disabled="!cluesBucksToUse || cluesBucksToUse > cluesBucksBalance"
                                 class="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600 disabled:opacity-50">
                                 Apply
                             </button>
                        </div>
                        <div v-if="cluesBucksDiscount > 0" class="flex justify-between mt-2 text-green-600 text-sm">
                            <span>Points Discount</span>
                            <span>-₦{{ cluesBucksDiscount }}</span>
                        </div>
                    </div>

                    <!-- Special Offers -->
                    <div class="border-t my-4 pt-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium">Special Offers</span>
                            <span v-if="hasValidOfferAccess" class="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Active</span>
                            <button v-else-if="cluesBucksBalance >= 500" @click="handleSpecialOfferRedeem" class="text-xs text-[#24a6bb] hover:underline">Unlock (500pts)</button>
                        </div>
                        
                        <div v-if="hasValidOfferAccess && availableOffers.length">
                            <div v-for="offer in availableOffers" :key="offer._id" class="text-sm text-gray-600 flex justify-between py-1">
                                <span>{{ offer.title }}</span>
                                <span class="text-amber-600 font-medium">{{ offer.discount }}% off</span>
                            </div>
                            <div v-if="specialOfferDiscount > 0" class="flex justify-between mt-1 text-green-600 font-medium text-sm">
                                <span>Offer Savings</span>
                                <span>-₦{{ specialOfferDiscount.toFixed(2) }}</span>
                            </div>
                        </div>
                        <p v-else-if="hasValidOfferAccess" class="text-xs text-gray-500">No offers for cart items</p>
                        <p v-else class="text-xs text-gray-500">Unlock exclusive deals on tech & fashion</p>
                    </div>

                    <!-- Payment Methods -->
                    <div class="border-t my-4 pt-4">
                         <h3 class="font-semibold mb-3">Payment Method</h3>
                         <div class="space-y-3">
                             <label class="flex items-center cursor-pointer p-2 border rounded-lg hover:border-[#24a6bb] transition" :class="{'border-[#24a6bb] bg-cyan-50': paymentMethod === 'Paystack'}">
                                 <input type="radio" value="Paystack" v-model="paymentMethod" class="w-4 h-4 text-[#24a6bb] focus:ring-[#24a6bb]">
                                 <div class="ml-3 flex items-center gap-2">
                                     <img :src="paymentImages.paystackLogo" alt="Paystack" class="h-4">
                                     <span class="text-sm font-medium">Paystack</span>
                                 </div>
                             </label>

                             <label class="flex items-center cursor-pointer p-2 border rounded-lg hover:border-[#24a6bb] transition" :class="{'border-[#24a6bb] bg-cyan-50': paymentMethod === 'OPay'}">
                                 <input type="radio" value="OPay" v-model="paymentMethod" class="w-4 h-4 text-[#24a6bb] focus:ring-[#24a6bb]">
                                 <div class="ml-3 flex items-center gap-2">
                                     <img :src="paymentImages.opayLogo" alt="OPay" class="h-4">
                                     <span class="text-sm font-medium">OPay</span>
                                 </div>
                             </label>
                             
                             <!-- Disabled options compacted -->
                             <div class="flex gap-2 opacity-50 text-xs">
                                 <div class="flex items-center gap-1 border px-2 py-1 rounded">
                                     <img :src="paymentImages.orangeMoney" class="h-3 grayscale"> Orange Money
                                 </div>
                                 <div class="flex items-center gap-1 border px-2 py-1 rounded">
                                      <img :src="paymentImages.payDunyaLogo" class="h-3 grayscale"> PayDunya
                                 </div>
                             </div>
                         </div>
                    </div>

                    <div class="border-t pt-4 flex justify-between font-bold text-lg mb-4">
                        <span>Total</span>
                        <span>{{ total.toFixed(2) }} ₦</span>
                    </div>
                    <div class="text-right mb-4">
                        <span class="text-gray-600">US $ {{ ((Math.floor(total * exchangeRate) + Math.ceil((total *
                            exchangeRate % 1) * 100) / 100) * 1.01).toFixed(2) }}</span>
                    </div>
                    <button @click="placeOrder" :disabled="isProcessingPayment"
                        class="w-full bg-[#24a6bb] text-white py-3 rounded-lg hover:bg-[#1c8a9e] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md">
                        {{ isProcessingPayment ? 'Processing...' : 'Place Order' }}
                    </button>
                    <p class="text-xs text-gray-500 mt-4 text-center">
                        By placing order, you agree to our terms.
                    </p>
                    <div class="mt-4 flex justify-center opacity-70">
                        <div class="flex space-x-2">
                            <img :src="paymentImages.paystackLogo" alt="Paystack" class="h-5">
                            <img :src="paymentImages.opayLogo" alt="OPay" class="h-5">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useCluesBucksStore } from '../store/cluesBucksStore.js';
import { useRouter } from 'vue-router';
import { useAddressStore } from '../store/addressStore.js';
import { useCartStore } from '../store/cart';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore.js';
import { usePaymentStore } from '../store/paymentStore.js';
import { useUserStore } from '../store/user.js';
import { toast } from 'vue-sonner';
import { CreditCard, Minus, Plus } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import apiClient from '../api/axios';
import axios from 'axios';

// Import images
import paystackLogo from '../assets/images/paystack-p.svg';
import opayLogo from '../assets/images/opay-logo.jpeg';
import visaLogo from '../assets/images/visa-pay.png';
import mastercardLogo from '../assets/images/mastercard-pay.webp';
import applePay from '../assets/images/apple-pay.webp';
import googlePay from '../assets/images/google-pay.png';
import paypalLogo from '../assets/images/paypal-pay.webp';
import orangeMoney from '../assets/images/orange-p.jpeg';
import payDunyaLogo from '../assets/images/paydunya-logo.png'; // Add PayDunya logo (ensure this file exists)

const router = useRouter();
const addressStore = useAddressStore();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const productStore = useProductStore();
const userStore = useUserStore();

const selectedAddress = ref(null);
const paymentMethod = ref('Paystack');
const customerPhone = ref(''); // Customer phone for Orange Money and PayDunya
const isLoading = ref(true);
const error = ref(null);
const shippingFee = ref(0);
const exchangeRate = ref(0.0006);
const loadingItems = reactive({});
const promoCode = ref('');

const paymentStore = usePaymentStore();
const isProcessingPayment = ref(false);

const cluesBucksStore = useCluesBucksStore();
const { stats, isLoading: cluesBucksLoading } = storeToRefs(cluesBucksStore);

const cluesBucksToUse = ref(0);
const appliedCluesBucks = ref(0);

const total = computed(() => {
    const baseTotal = cartStore.totalAfterDiscount + shippingFee.value;
    const withCluesBucks = baseTotal - cluesBucksDiscount.value;
    return withCluesBucks - specialOfferDiscount.value;
});

const cluesBucksDiscount = computed(() => appliedCluesBucks.value);
const subtotal = computed(() => cartStore.cartTotal);
const discount = computed(() => cartStore.discount);
const cluesBucksBalance = computed(() => stats.value?.currentBalance || 0);
const availableCluesBucks = computed(() => stats.value?.currentBalance || 0);

const pointsEarned = computed(() => {
    const calculatedTotal = total.value;
    return Math.floor(calculatedTotal / 100);
});

const hasValidOfferAccess = computed(() => cluesBucksStore.hasValidOfferAccess);

const availableOffers = computed(() => {
    if (!hasValidOfferAccess.value || !cluesBucksStore.activeSpecialOffers) {
        return [];
    }
    const cartCategories = new Set(
        cartStore.items.map(item => item.product?.category).filter(Boolean)
    );
    return cluesBucksStore.activeSpecialOffers.filter(offer => {
        if (!offer?.categoryPath) return false;
        return Array.from(cartCategories).some(category =>
            offer.categoryPath.includes(category)
        );
    });
});

const bestSpecialOffer = computed(() => {
    const offers = cluesBucksStore.activeSpecialOffers;
    if (!offers || !offers.length) {
        return { discount: 0 };
    }
    return offers.reduce((max, offer) =>
        (offer?.discount || 0) > (max?.discount || 0) ? offer : max,
        { discount: 0 }
    );
});

const specialOfferDiscount = computed(() => {
    if (!bestSpecialOffer.value) return 0;
    const eligibleTotal = cartStore.items.reduce((sum, item) => {
        const isEligible = bestSpecialOffer.value.categoryPath?.includes(item.product?.category);
        return sum + (isEligible ? item.product.price * item.quantity : 0);
    }, 0);
    return (eligibleTotal * bestSpecialOffer.value.discount) / 100;
});

const offerValidUntil = computed(() => {
    const latestTransaction = cluesBucksStore.transactions
        .filter(t =>
            t.type === 'spent' &&
            t.metadata?.type === 'offer' &&
            t.metadata.validUntil &&
            new Date(t.metadata.validUntil) > new Date()
        )
        .sort((a, b) => new Date(b.metadata.validUntil) - new Date(a.metadata.validUntil))[0];
    return latestTransaction?.metadata.validUntil;
});

const handleSpecialOfferRedeem = async () => {
    if (cluesBucksBalance.value >= 500) {
        try {
            const success = await cluesBucksStore.redeemPoints(3);
            if (success) {
                await cluesBucksStore.fetchSpecialOffers();
                toast.success('Special Offer Access unlocked successfully!');
            }
        } catch (error) {
            console.error('Error redeeming points for Special Offer Access:', error);
            toast.error('Failed to unlock Special Offer Access');
        }
    } else {
        toast.error('Insufficient points balance');
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const addressForm = reactive({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    houseNo: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
});

const loadCheckoutData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        await Promise.all([
            addressStore.fetchUserAddresses(),
            cartStore.fetchCart(),
            productStore.fetchProducts(),
            cluesBucksStore.initialize()
        ]);
        if (addressStore.addresses.length > 0) {
            selectedAddress.value = addressStore.addresses[0];
        }
        updateShippingFee();
    } catch (err) {
        console.error('Error loading checkout data:', err);
        error.value = 'Failed to load checkout information. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

const saveAddress = async () => {
    try {
        const savedAddress = await addressStore.addOrUpdateAddress(addressForm);
        selectedAddress.value = savedAddress;
        addressForm._id = savedAddress._id;
        toast.success(addressForm._id ? 'Address updated successfully.' : 'Address added successfully.');
    } catch (error) {
        console.error('Error saving address:', error);
        toast.error('Failed to save address. Please try again.');
    }
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
    description = description.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    return description;
};

const toggleDescription = (product) => {
    if (product) {
        product.showFullDescription = !product.showFullDescription;
    }
};

watch(() => cartStore?.items, (newItems) => {
    if (newItems) {
        updateShippingFee();
    }
}, { deep: true });

watch(() => stats.value?.currentBalance, (newBalance) => {
    if (newBalance < appliedCluesBucks.value) {
        appliedCluesBucks.value = 0;
        cluesBucksToUse.value = 0;
        toast.warning('Applied CluesBucks have been reset due to balance change');
    }
});

onMounted(async () => {
    try {
        if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
            console.error('Paystack public key not found in environment variables');
            toast.error('Payment configuration error');
            return;
        }
        if (typeof PaystackPop === 'undefined') {
            console.error('Paystack script not loaded');
            toast.error('Payment system not initialized');
            return;
        }
        await loadCheckoutData();
        if (productStore && cartStore) {
            updateShippingFee();
        }
    } catch (error) {
        console.error('Error initializing checkout:', error);
        toast.error('Failed to initialize checkout. Please refresh the page.');
    }
});

const retryLoading = () => {
    loadCheckoutData();
};

const updateShippingFee = () => {
    if (!productStore || !productStore.shippingRules) {
        console.warn('Shipping rules not available, using default fee');
        shippingFee.value = 5.99;
        return;
    }
    let fee = productStore.shippingRules.baseShippingFee || 0;
    if (cartStore && cartStore.cartTotal > (productStore.shippingRules.freeShippingThreshold || 0)) {
        fee = 0;
    } else if (cartStore && cartStore.items) {
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
    shippingFee.value = Number(fee.toFixed(2));
};

const incrementQuantity = async (item) => {
    if (loadingItems[item.product._id] || !item.product._id) return;
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

const decrementQuantity = async (item) => {
    if (loadingItems[item.product._id] || !item.product._id) return;
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

const refreshCart = async () => {
    try {
        await cartStore.fetchCart();
        updateShippingFee();
        subtotal.value = cartStore.cartTotal;
        total.value = cartStore.totalAfterDiscount + shippingFee.value;
    } catch (error) {
        console.error('Error refreshing cart:', error);
        toast.error('Failed to refresh cart');
    }
};

const applyPromoCode = async () => {
    if (!promoCode.value) {
        toast.error('Please enter a coupon code');
        return;
    }
    const code = promoCode.value;
    promoCode.value = '';
    try {
        await cartStore.applyCoupon(code);
        toast.success(`Coupon applied successfully! You saved $${cartStore.discount.toFixed(2)}`);
    } catch (error) {
        console.error('Error applying coupon:', error);
        toast.error(error.response?.data?.message || 'Failed to apply coupon');
    }
};

const removeCoupon = async () => {
    try {
        await cartStore.removeCoupon();
        await refreshCart();
        toast.success('Coupon removed successfully');
    } catch (error) {
        console.error('Error removing coupon:', error);
        toast.error('Failed to remove coupon');
    }
};

const prepareItemsForPayload = (items, totalDiscount, subtotalAmount) => {
    if (!subtotalAmount) return [];
    const discountRatio = totalDiscount / subtotalAmount;
    return items.map(item => {
        const itemTotal = item.product.price * item.quantity;
        const itemDiscount = Math.round(itemTotal * discountRatio);
        const discountedItemTotal = itemTotal - itemDiscount;
        const vendorAmount = Math.floor(discountedItemTotal * 0.92);
        const platformFee = discountedItemTotal - vendorAmount;
        return {
            productId: item.product._id,  // Changed from 'product' to 'productId'
            product: item.product._id,     // Keep both for compatibility
            quantity: item.quantity,
            price: item.product.price,
            vendorAmount,
            platformFee,
            vendorId: item.product.user    // Add vendorId
        };
    });
};

const applyCluesBucks = () => {
    const points = Number(cluesBucksToUse.value);
    if (!points) return;
    if (points > cluesBucksBalance.value) {
        toast.error('Not enough CluesBucks available');
        return;
    }
    if (points > total.value) {
        toast.error('Cannot apply more CluesBucks than order total');
        return;
    }
    appliedCluesBucks.value = points;
    toast.success(`Applied ${points} CluesBucks`);
    updateTotal();
};

const updateTotal = () => {
    const subtotalWithCoupon = subtotal.value - discount.value;
    const totalWithCluesBucks = subtotalWithCoupon - cluesBucksDiscount.value;
    total.value = totalWithCluesBucks + shippingFee.value;
};

const placeOrder = async () => {
    let createdOrder = null;

    // Initial validations
    if (!selectedAddress.value || !validateAddress(selectedAddress.value) || !cartStore.items?.length) {
        if (!selectedAddress.value) {
            toast.error('Please select a shipping address');
        } else if (!validateAddress(selectedAddress.value)) {
            // validateAddress function already shows a toast
        } else if (!cartStore.items?.length) {
            toast.error('Your cart is empty');
        }
        return;
    }

    // Validate phone number for Orange Money and PayDunya
    if (['OrangeMoney', 'PayDunya'].includes(paymentMethod.value)) {
        if (!customerPhone.value || !validatePhoneNumber(customerPhone.value)) {
            toast.error(`Please enter a valid phone number for ${paymentMethod.value} (e.g., ${paymentMethod.value === 'OrangeMoney' ? '+221xxxxxxxxx' : '+234xxxxxxxxx'})`);
            return;
        }
    }

    isProcessingPayment.value = true;

    try {
        // Calculate amounts
        const subtotalAmount = cartStore.cartTotal;
        const currentShippingFee = shippingFee.value;
        const couponDiscount = cartStore.discount || 0;
        const cluesBucksDiscount = appliedCluesBucks.value || 0;
        const totalDiscount = couponDiscount + cluesBucksDiscount;
        const amountAfterDiscount = Math.max(0, subtotalAmount - totalDiscount);
        const preparedItems = prepareItemsForPayload(cartStore.items, totalDiscount, subtotalAmount);
        const totalVendorAmount = preparedItems.reduce((sum, item) => sum + item.vendorAmount, 0);
        const basePlatformFee = preparedItems.reduce((sum, item) => sum + item.platformFee, 0);
        const totalPlatformFee = basePlatformFee + currentShippingFee;
        const totalWithShipping = amountAfterDiscount + currentShippingFee;
        const pointsEarned = Math.floor(amountAfterDiscount / 100);

        // Create order
        const orderData = {
            address: selectedAddress.value,
            paymentMethod: paymentMethod.value,
            seller: cartStore.items[0].product.user,
            products: preparedItems,
            subtotal: subtotalAmount,
            shippingFee: currentShippingFee,
            totalAmount: amountAfterDiscount,
            total: totalWithShipping,
            vendorAmount: totalVendorAmount,
            platformFee: totalPlatformFee,
            status: 'pending',
            discount: totalDiscount,
            cluesBucks: {
                pointsUsed: appliedCluesBucks.value,
                discount: cluesBucksDiscount,
                pointsEarned: pointsEarned
            },
            couponDiscount: cartStore.discount || 0,
            ...(cartStore.coupon && { couponCode: cartStore.coupon.code }),
            ...(['OrangeMoney', 'PayDunya'].includes(paymentMethod.value) && { metadata: { customerPhone: customerPhone.value } })
        };

        console.log('Creating order with data:', orderData);
        createdOrder = await orderStore.createOrder(orderData);
        console.log('Order created:', createdOrder);

        // Handle different payment methods
        if (paymentMethod.value === 'Paystack') {
            if (!validatePaystackScript()) {
                toast.error('Payment system not initialized');
                throw new Error('Paystack script not loaded');
            }

            const handler = window.PaystackPop.setup({
                key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
                email: selectedAddress.value.email,
                amount: Math.round(totalWithShipping * 100), // Paystack expects amount in kobo
                currency: 'NGN',
                ref: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                callback_url: `${window.location.origin}/payment/callback`,
                metadata: {
                    orderId: createdOrder._id,
                    userEmail: selectedAddress.value.email,
                    customerName: `${selectedAddress.value.firstName} ${selectedAddress.value.lastName}`,
                    items: preparedItems,
                    vendorAmount: totalVendorAmount,
                    platformFee: totalPlatformFee,
                    cluesBucks: {
                        pointsUsed: appliedCluesBucks.value || 0,
                        pointsEarned: pointsEarned
                    },
                    custom_fields: [
                        {
                            display_name: "Order ID",
                            variable_name: "order_id",
                            value: createdOrder._id
                        }
                    ]
                },
                callback: function (response) {
                    handlePaymentSuccess(response, createdOrder._id, 'Paystack');
                },
                onClose: function () {
                    handlePaymentClose(createdOrder._id);
                }
            });

            handler.openIframe();
        } else if (paymentMethod.value === 'OPay') {
            // Handle OPay payment
            const paymentData = {
                orderId: createdOrder._id,
                email: selectedAddress.value.email,
                amount: totalWithShipping,
                vendorAmount: totalVendorAmount,
                platformFee: totalPlatformFee,
                paymentMethod: 'OPay',
                userPhone: selectedAddress.value.phone || customerPhone.value,
                metadata: {
                    orderId: createdOrder._id,
                    userId: userStore.user._id,
                    userEmail: selectedAddress.value.email,
                    customerName: `${selectedAddress.value.firstName} ${selectedAddress.value.lastName}`,
                    customerPhone: selectedAddress.value.phone || customerPhone.value,
                    // items: preparedItems,
                    items: preparedItems.map(item => ({
                        productId: item.productId || item.product,  // Ensure productId is set
                        quantity: item.quantity,
                        price: item.price,
                        vendorAmount: item.vendorAmount,
                        platformFee: item.platformFee,
                        vendorId: item.vendorId
                    })),
                    shipping: {
                        address: selectedAddress.value.street,
                        city: selectedAddress.value.city,
                        state: selectedAddress.value.state,
                        country: selectedAddress.value.country,
                        postalCode: selectedAddress.value.postalCode
                    },
                    shippingFee: currentShippingFee,
                    totalBeforeShipping: amountAfterDiscount,
                    totalAfterShipping: totalWithShipping,
                }
            };

            console.log('Initializing OPay payment:', paymentData);
            const opayResponse = await paymentStore.initializePayment(paymentData);

            if (opayResponse.authorization_url) {
                // Redirect to OPay payment page
                window.location.href = opayResponse.authorization_url;
            } else {
                throw new Error('OPay payment initialization failed');
            }
        } else if (['PayDunya', 'OrangeMoney'].includes(paymentMethod.value)) {
            const paymentData = {
                orderId: createdOrder._id,
                paymentMethod: paymentMethod.value,
                customerPhone: customerPhone.value,
                amount: totalWithShipping, // Pass the amount in NGN
                metadata: {
                    orderId: createdOrder._id,
                    userId: userStore.user._id,
                    customerName: `${selectedAddress.value.firstName} ${selectedAddress.value.lastName}`,
                    customerPhone: customerPhone.value,
                    items: preparedItems.map(item => ({
                        productId: item.product,
                        quantity: item.quantity,
                    })),
                },
            };
            const paymentResponse = await paymentStore.initializePayment(paymentData);

            const redirectUrl = paymentResponse.payment_url || paymentResponse.authorization_url;
            window.location.href = redirectUrl;
        } else {
            toast.error('Please select a valid payment method');
            throw new Error('Invalid payment method');
        }
    } catch (error) {
        console.error('Payment initialization error:', error);
        toast.error(error.message || 'Payment initialization failed. Please try again.');

        if (createdOrder?._id) {
            try {
                await orderStore.cancelOrder(createdOrder._id, { reason: "Payment cancelled by user" });
                toast.info('Order cancelled due to payment failure');
            } catch (cancelError) {
                console.error('Error cancelling order:', cancelError);
            }
        }
    } finally {
        isProcessingPayment.value = false;
    }
};

// Update handlePaymentSuccess to support OPay
const handlePaymentSuccess = async (response, orderId, paymentMethod) => {
    try {
        isProcessingPayment.value = true;
        const verificationResult = await paymentStore.verifyPayment(response.reference, paymentMethod);
        if (!verificationResult.status) {
            throw new Error('Payment verification failed');
        }
        await orderStore.updateOrderStatus(orderId, {
            status: "Processing",
            transactionId: response.reference
        });

        await cluesBucksStore.initialize();

        const transactionDetails = {
            orderId,
            reference: response.reference,
            timestamp: new Date().toISOString(),
            verificationId: verificationResult.data.verificationId,
            paymentMethod
        };

        localStorage.setItem('currentTransaction', JSON.stringify(transactionDetails));

        await Promise.all([
            cartStore.clearCart(),
            cartStore.coupon ? cartStore.invalidateCoupon(cartStore.coupon.code) : Promise.resolve()
        ]);

        toast.success('Payment successful!');

        await router.push({
            name: 'PaymentSuccess',
            params: {
                reference: response.reference,
                orderId
            }
        });
    } catch (error) {
        console.error('Error processing successful payment:', error);
        toast.error(error.response?.data?.message || 'Error completing payment');
        try {
            await orderStore.cancelOrder(orderId, "Payment verification failed");
            toast.error('Order cancelled due to payment verification failure');
        } catch (cancelError) {
            console.error('Error cancelling order:', cancelError);
        }
    } finally {
        isProcessingPayment.value = false;
    }
};

const handlePaymentClose = async (orderId) => {
    try {
        isProcessingPayment.value = false;
        if (orderId) {
            await orderStore.cancelOrder(orderId, "Payment cancelled by user");
            localStorage.removeItem('currentTransaction');
            localStorage.removeItem(`payment_verification_${orderId}`);
            toast.error('Payment cancelled. Please try again if you wish to complete your purchase.');
        }
    } catch (error) {
        console.error('Error handling payment cancellation:', error);
        toast.error('Error processing cancellation. Please contact support.');
    }
};

const validatePaystackScript = () => {
    if (typeof window.PaystackPop === 'undefined') {
        console.error('Paystack script not loaded');
        return false;
    }
    return true;
};

const validateAddress = (address) => {
    const requiredFields = [
        'firstName', 'lastName', 'email', 'phone',
        'street', 'city', 'state', 'country', 'postalCode'
    ];
    const missingFields = requiredFields.filter(field =>
        !address[field] || !address[field].toString().trim()
    );
    if (missingFields.length > 0) {
        toast.error(`Please complete the following fields: ${missingFields.join(', ')}`);
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
        toast.error('Please enter a valid email address');
        return false;
    }
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(address.phone)) {
        toast.error('Please enter a valid phone number');
        return false;
    }
    return true;
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+\d{1,3}\d{9,}$/;
    return phoneRegex.test(phone);
};

const editAddress = () => {
    Object.assign(addressForm, selectedAddress.value);
    selectedAddress.value = null;
};

// Make imported images available to the template
const paymentImages = {
    paystackLogo,
    visaLogo,
    mastercardLogo,
    applePay,
    googlePay,
    paypalLogo,
    orangeMoney,
    payDunyaLogo,
    opayLogo
};
</script>

<style scoped>
/* Custom checkbox styling */
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
    .checkout-summary {
        position: relative;
    }

    .sticky-summary {
        position: sticky;
        top: 6rem;
        height: fit-content;
        max-height: calc(100vh - 7rem);
        overflow-y: auto;
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
    }
}

.input-field {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s;
}

.input-field:focus {
    border-color: #24a6bb;
}
</style>
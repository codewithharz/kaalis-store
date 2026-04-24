<!-- frontend/src/views/CheckoutPage.vue -->
<template>
    <div class="container mx-auto p-4 checkout-container">
        <h1 class="text-2xl font-bold mb-6">{{ t('checkout.title') }}</h1>
        <div v-if="isLoading" class="text-center py-8">
            <p class="text-xl text-gray-600">{{ t('checkout.loading') }}</p>
        </div>
        <div v-else-if="error" class="text-center py-8">
            <p class="text-xl text-red-600">{{ error }}</p>
            <button @click="retryLoading" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">{{ t('checkout.retry') }}</button>
        </div>
        <div v-else class="flex flex-col lg:flex-row gap-8 checkout-content">
            <!-- Left Column (Scrollable Content) -->
            <div class="w-full lg:w-2/3 checkout-main-content">
                <!-- Shipping Address -->
                <div class="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
                    <h2 class="text-xl font-semibold mb-4">{{ t('checkout.shippingAddress') }}</h2>
                    <div v-if="selectedAddress">
                        <p>{{ selectedAddress.firstName }} {{ selectedAddress.lastName }}</p>
                        <p>{{ selectedAddress.phone }}</p>
                        <p>{{ selectedAddress.email }}</p>
                        <p>{{ selectedAddress.street }}, {{ selectedAddress.houseNo }}, {{ selectedAddress.postalCode }}
                        </p>
                        <p>{{ selectedAddress.city }}, {{ selectedAddress.state }}, {{ selectedAddress.country }}</p>
                        <button @click="editAddress" class="text-blue-500 mt-2">{{ t('checkout.edit') }}</button>
                    </div>
                    <form v-else @submit.prevent="saveAddress" class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input v-model="addressForm.firstName" :placeholder="t('checkout.firstName')" required
                                class="input-field">
                            <input v-model="addressForm.lastName" :placeholder="t('checkout.lastName')" required class="input-field">
                            <input v-model="addressForm.phone" :placeholder="t('checkout.phone')" required class="input-field">
                            <input v-model="addressForm.email" :placeholder="t('checkout.email')" type="email" class="input-field">
                            <input v-model="addressForm.street" :placeholder="t('checkout.street')" required class="input-field">
                            <input v-model="addressForm.houseNo" :placeholder="t('checkout.houseNumber')" required
                                class="input-field">
                            <input v-model="addressForm.city" :placeholder="t('checkout.city')" required class="input-field">
                            <input v-model="addressForm.state" :placeholder="t('checkout.state')" required class="input-field">
                            <input v-model="addressForm.country" :placeholder="t('checkout.country')" required class="input-field">
                            <input v-model="addressForm.postalCode" :placeholder="t('checkout.postalCode')" required
                                class="input-field">
                        </div>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                            {{ addressForm._id ? t('checkout.updateAddress') : t('checkout.addNewAddress') }}
                        </button>
                    </form>
                </div>

                <!-- Payment Methods -->
                <!-- Payment Methods moved to Summary -->

                <!-- Order Items -->
                <div class="bg-white shadow-md rounded-lg p-4 sm:p-6">
                    <h2 class="text-xl font-semibold mb-4">{{ t('checkout.orderItems') }} <span class="text-sm font-medium text-gray-500">({{ checkoutItems.length }})</span></h2>
                    <div v-if="checkoutItems.length === 0" class="text-center py-4">
                        <p class="text-gray-600">{{ t('checkout.noSelectedItems') }}</p>
                        <button
                            type="button"
                            @click="router.push({ name: 'Cart' })"
                            class="mt-3 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {{ t('checkout.returnToCart') }}
                        </button>
                    </div>
                    <div v-else v-for="(item, index) in checkoutItems"
                        :key="(item.product?._id || '') + (item.variant?._id || '') + index"
                        class="mb-4 rounded-lg border border-gray-100 p-3 sm:p-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-6">
                        <div class="flex min-w-0 items-start gap-3 sm:gap-4">
                            <img v-if="item.product?.images?.length > 0" :src="item.product.images[0]"
                                :alt="item.product?.name || 'Product image'" class="h-16 w-16 flex-shrink-0 rounded object-cover sm:h-20 sm:w-20">
                            <div v-else class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded bg-gray-200 sm:h-20 sm:w-20">
                                <span class="text-gray-400">{{ t('checkout.loadingItem') }}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-semibold"
                                    :title="item.product ? item.product.name : t('cart.productUnavailable')">
                                    {{ formatTitle(item.product ? item.product.name : t('cart.productUnavailable')) }}
                                </h3>
                                <!-- Add variant details -->
                                <div v-if="item.variant" class="text-sm text-gray-600 mb-1 flex flex-wrap gap-x-2">
                                    <span v-if="item.variant.color">
                                        {{ t('cart.color') }}: {{ typeof item.variant.color === 'object' ? item.variant.color.name :
                                        item.variant.color }}
                                    </span>
                                    <span v-for="(attr, attrIdx) in item.variant.attributes" :key="attrIdx">
                                        {{ attr.name }}: {{ attr.value }}
                                    </span>
                                    <!-- Fallback for legacy size field if not in attributes -->
                                    <span
                                        v-if="item.variant.size && (!item.variant.attributes || !item.variant.attributes.some(a => a.name.toLowerCase() === 'size'))">
                                        {{ t('cart.size') }}: {{ item.variant.size }}
                                    </span>
                                </div>
                                <div class="description-container">
                                    <p class="text-gray-600 text-sm"
                                        :class="{ 'expanded': item.product?.showFullDescription }">
                                        <span v-html="formatDescription(item.product)"></span>
                                    </p>
                                    <span v-if="item.product?.description && item.product.description.length > 100"
                                        @click="toggleDescription(item.product)"
                                        class="text-blue-500 cursor-pointer text-sm">
                                        {{ item.product?.showFullDescription ? t('cart.readLess') : t('cart.readMore') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3 flex w-full items-center justify-between gap-4 border-t border-gray-100 pt-3 sm:mt-4 lg:mt-0 lg:w-auto lg:min-w-[180px] lg:flex-col lg:items-end lg:justify-start lg:border-t-0 lg:border-l lg:border-gray-100 lg:pt-0 lg:pl-6">
                            <div class="flex items-center rounded-full bg-gray-100 px-2 py-1">
                                <button @click="decrementQuantity(item)" class="rounded-full bg-white p-1 shadow-sm"
                                    :disabled="loadingItems[item.product?._id] || !item.product?._id">
                                    <Minus class="w-3 h-3" />
                                </button>
                                <span class="mx-3 min-w-[24px] text-center text-sm font-medium">{{ item.quantity }}</span>
                                <button @click="incrementQuantity(item)" class="rounded-full bg-white p-1 shadow-sm"
                                    :disabled="loadingItems[item.product?._id] || !item.product?._id">
                                    <Plus class="w-3 h-3" />
                                </button>
                            </div>
                            <span class="text-right text-base font-semibold sm:text-lg">{{ formatMoney(item.product && item.product?.price ?
                                (item.product?.price * item.quantity) : 0) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column (Summary) -->
            <div class="w-full lg:w-1/3 checkout-summary mt-6 lg:mt-0">
                <div class="bg-white shadow-md rounded-lg p-4 sm:p-6 sticky-summary">
                    <h2 class="text-xl font-semibold mb-4">{{ t('checkout.summary') }}</h2>
                    <div class="flex justify-between mb-2">
                        <span>{{ t('checkout.summary') === t('cart.summary') ? t('cart.subtotal') : t('cart.subtotal') }}</span>
                        <span>{{ formatMoney(subtotal) }}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>{{ t('cart.shippingFee') }}</span>
                        <span>{{ shippingFee === 0 ? t('checkout.free') : formatMoney(shippingFee) }}</span>
                    </div>

                    <!-- Coupons -->
                    <div class="border-t my-4 pt-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium">{{ t('checkout.coupon') }}</span>
                            <span v-if="cartStore.coupon"
                                class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{{ t('checkout.applied') }}</span>
                        </div>
                        <div v-if="cartStore.coupon" class="bg-green-50 p-2 rounded text-sm">
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-green-700">{{ cartStore.coupon.code }}</span>
                                <button @click="removeCoupon"
                                    class="text-red-500 text-xs hover:underline">{{ t('checkout.remove') }}</button>
                            </div>
                            <div v-if="discount > 0" class="flex justify-between mt-1 text-green-600">
                                <span>{{ t('checkout.savings') }}</span>
                                <span>-{{ formatMoney(discount) }}</span>
                            </div>
                        </div>
                        <div v-else>
                            <div class="flex items-center gap-2">
                                <input v-model="promoCode" type="text" :placeholder="t('checkout.code')"
                                    class="w-full rounded border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#24a6bb]">
                                <button @click="applyPromoCode(promoCode)"
                                    class="bg-[#24a6bb] text-white px-3 py-1 rounded text-sm hover:bg-[#1c8a9e]">
                                    {{ t('cart.apply') }}
                                </button>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">{{ t('checkout.redeemPoints') }}</p>
                        </div>
                    </div>

                    <!-- CluesBucks -->
                    <div class="border-t my-4 pt-4">
                        <div class="flex justify-between mb-2 items-center">
                            <span class="font-medium">{{ t('checkout.cluesBucks') }}</span>
                            <span class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{{
                                availableCluesBucks }} pts</span>
                        </div>
                        <div class="flex items-center justify-between gap-2">
                            <input v-model="cluesBucksToUse" type="number" :max="cluesBucksBalance"
                                class="w-20 px-2 py-1 border rounded text-sm" :disabled="!cluesBucksBalance"
                                placeholder="0" />
                            <button @click="applyCluesBucks"
                                :disabled="!cluesBucksToUse || cluesBucksToUse > cluesBucksBalance"
                                class="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600 disabled:opacity-50">
                                {{ t('cart.apply') }}
                            </button>
                        </div>
                    <div v-if="cluesBucksDiscount > 0" class="flex justify-between mt-2 text-green-600 text-sm">
                        <span>{{ t('checkout.pointsDiscount') }}</span>
                        <span>-{{ formatMoney(cluesBucksDiscount) }}</span>
                    </div>
                    </div>

                    <!-- Store Credit -->
                    <div class="border-t my-4 pt-4">
                        <div class="flex justify-between mb-2 items-center">
                            <span class="font-medium">{{ t('checkout.storeCredit') }}</span>
                            <span class="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                                {{ formatMoney(storeCreditBalance) }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between gap-2">
                            <input v-model="storeCreditToUse" type="number" step="0.01" min="0" :max="storeCreditBalance"
                                class="w-28 px-2 py-1 border rounded text-sm" :disabled="!storeCreditBalance"
                                placeholder="0.00" />
                            <button @click="applyStoreCredit"
                                :disabled="!storeCreditToUse || Number(storeCreditToUse) > storeCreditBalance"
                                class="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 disabled:opacity-50">
                                {{ t('cart.apply') }}
                            </button>
                        </div>
                        <div v-if="storeCreditDiscount > 0" class="flex justify-between mt-2 text-green-600 text-sm">
                            <span>{{ t('checkout.storeCreditDiscount') }}</span>
                            <span>-{{ formatMoney(storeCreditDiscount) }}</span>
                        </div>
                    </div>

                    <!-- Special Offers -->
                    <div class="border-t my-4 pt-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium">{{ t('checkout.specialOffers') }}</span>
                            <span v-if="hasValidOfferAccess"
                                class="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">{{ t('checkout.active') }}</span>
                            <button v-else-if="cluesBucksBalance >= 500" @click="handleSpecialOfferRedeem"
                                class="text-xs text-[#24a6bb] hover:underline">{{ t('checkout.unlock') }}</button>
                        </div>

                        <div v-if="hasValidOfferAccess && availableOffers.length">
                            <div v-for="offer in availableOffers" :key="offer._id"
                                class="text-sm text-gray-600 flex justify-between py-1">
                                <span>{{ offer.title }}</span>
                                <span class="text-amber-600 font-medium">{{ offer.discount }}% off</span>
                            </div>
                            <div v-if="specialOfferDiscount > 0"
                                class="flex justify-between mt-1 text-green-600 font-medium text-sm">
                                <span>{{ t('checkout.offerSavings') }}</span>
                                <span>-{{ formatMoney(specialOfferDiscount) }}</span>
                            </div>
                        </div>
                        <p v-else-if="hasValidOfferAccess" class="text-xs text-gray-500">{{ t('checkout.noOffersForCart') }}</p>
                        <p v-else class="text-xs text-gray-500">{{ t('checkout.unlockExclusiveDeals') }}</p>
                    </div>

                    <!-- Payment Methods -->
                    <div class="border-t my-4 pt-4">
                        <h3 class="font-semibold mb-3">{{ t('checkout.paymentMethod') }}</h3>
                        <div class="space-y-3">
                            <label v-for="option in paymentOptions" :key="option.value"
                                class="flex items-center cursor-pointer p-2 border rounded-lg hover:border-[#24a6bb] transition"
                                :class="{ 'border-[#24a6bb] bg-cyan-50': paymentMethod === option.value }">
                                <input type="radio" :value="option.value" v-model="paymentMethod"
                                    class="w-4 h-4 text-[#24a6bb] focus:ring-[#24a6bb]">
                                <div class="ml-3 flex items-center gap-2">
                                    <img v-if="option.logo" :src="option.logo" :alt="option.label" class="h-4">
                                    <span v-else class="text-xs font-semibold px-2 py-1 rounded bg-gray-900 text-white">AFX</span>
                                    <span class="text-sm font-medium">{{ option.label }}</span>
                                </div>
                            </label>
                        </div>
                        <div v-if="paymentMethod === 'AfriExchange'" class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            <p class="font-medium">{{ afriExchangeCheckoutTitle }}</p>
                            <p class="mt-1 text-amber-800">{{ afriExchangeCheckoutBody }}</p>
                            <div class="mt-3 flex flex-wrap gap-2">
                                <button
                                    v-if="afriExchangeSignupUrl"
                                    type="button"
                                    @click="openAfriExchangeSignup"
                                    class="rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                                >
                                    {{ t('checkout.createAfriExchangeAccount') }}
                                </button>
                                <button
                                    type="button"
                                    @click="goToAfriExchangeLinking"
                                    class="rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-medium text-amber-900 hover:bg-amber-100"
                                >
                                    {{ hasLinkedAfriExchangeAccount ? t('checkout.updateAfriExchangeLink') : t('checkout.linkAfriExchangeAccount') }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="border-t pt-4 flex justify-between font-bold text-lg mb-4">
                        <span>{{ t('cart.total') }}</span>
                        <span>{{ formatMoney(total) }}</span>
                    </div>
                    <div v-if="checkoutCurrency === 'NGN'" class="text-right mb-4">
                        <span class="text-gray-600">US $ {{ ((Math.floor(total * exchangeRate) + Math.ceil((total *
                            exchangeRate % 1) * 100) / 100) * 1.01).toFixed(2) }}</span>
                    </div>
                    <button @click="placeOrder" :disabled="isPlaceOrderDisabled"
                        class="w-full bg-[#24a6bb] text-white py-3 rounded-lg hover:bg-[#1c8a9e] transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md">
                        {{ isProcessingPayment ? t('checkout.processing') : t('checkout.placeOrder') }}
                    </button>
                    <p v-if="isAfriExchangeBlocked" class="mt-2 text-center text-xs text-amber-700">
                        {{ t('checkout.afriExchangeCheckoutBlocked') }}
                    </p>
                    <p class="text-xs text-gray-500 mt-4 text-center">
                        {{ t('checkout.orderAgreement') }}
                    </p>
                    <div class="mt-4 flex justify-center opacity-70">
                        <div v-if="checkoutCurrency === 'NGN'" class="flex space-x-2">
                            <img :src="paymentImages.paystackLogo" alt="Paystack" class="h-5">
                            <img :src="paymentImages.opayLogo" alt="OPay" class="h-5">
                        </div>
                        <div v-else class="flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold tracking-wide text-white">
                            <span>AFX</span>
                            <span>AfriExchange</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCluesBucksStore } from '../store/cluesBucksStore.js';
import { useRouter } from 'vue-router';
import { useAddressStore } from '../store/addressStore.js';
import { useCartStore } from '../store/cart';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore.js';
import { usePaymentStore } from '../store/paymentStore.js';
import { useUserStore } from '../store/user.js';
import { useCountryStore } from '../store/countryStore.js';
import { toast } from 'vue-sonner';
import { CreditCard, Minus, Plus } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import apiClient from '../api/axios';
import axios from 'axios';
import { getCurrencySymbol, formatCurrencyAmount } from '../utils/countryCurrency.js';

// Import images
import paystackLogo from '../assets/images/paystack-p.svg';
import opayLogo from '../assets/images/opay-logo.jpeg';
import visaLogo from '../assets/images/visa-pay.png';
import mastercardLogo from '../assets/images/mastercard-pay.webp';
import applePay from '../assets/images/apple-pay.webp';
import googlePay from '../assets/images/google-pay.png';
import paypalLogo from '../assets/images/paypal-pay.webp';

const router = useRouter();
const { t } = useI18n();
const addressStore = useAddressStore();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const productStore = useProductStore();
const userStore = useUserStore();
const countryStore = useCountryStore();

const selectedAddress = ref(null);
const paymentMethod = ref('Paystack');
const customerPhone = ref('');
const isLoading = ref(true);
const error = ref(null);
const shippingFee = ref(0);
const exchangeRate = ref(0.0006);
const loadingItems = reactive({});
const promoCode = ref('');

const paymentStore = usePaymentStore();
const isProcessingPayment = ref(false);

const checkoutCurrency = computed(() => countryStore.currency || 'NGN');
const checkoutCurrencySymbol = computed(() => getCurrencySymbol(checkoutCurrency.value));
const formatMoney = (amount) => formatCurrencyAmount(amount, checkoutCurrency.value);
const afriExchangeSignupUrl = import.meta.env.VITE_AFRIEXCHANGE_WEB_URL || '';
const paymentOptions = computed(() =>
    checkoutCurrency.value === 'XOF'
        ? [
            {
                value: 'AfriExchange',
                label: 'AfriExchange',
                logo: null,
            },
        ]
        : [
            {
                value: 'Paystack',
                label: 'Paystack',
                logo: paymentImages.paystackLogo,
            },
            {
                value: 'OPay',
                label: 'OPay',
                logo: paymentImages.opayLogo,
            },
        ]
);

const hasLinkedAfriExchangeAccount = computed(() => {
    const afriExchange = userStore.user?.afriExchange;
    return Boolean(
        afriExchange?.userId ||
        afriExchange?.walletAddress ||
        afriExchange?.accountEmail
    );
});

const isAfriExchangeBlocked = computed(() =>
    paymentMethod.value === 'AfriExchange' && !hasLinkedAfriExchangeAccount.value
);

const isPlaceOrderDisabled = computed(() =>
    isProcessingPayment.value || isAfriExchangeBlocked.value
);

const afriExchangeCheckoutTitle = computed(() =>
    hasLinkedAfriExchangeAccount.value
        ? t('checkout.afriExchangeReadyTitle')
        : t('checkout.afriExchangeSetupRequiredTitle')
);

const afriExchangeCheckoutBody = computed(() =>
    hasLinkedAfriExchangeAccount.value
        ? t('checkout.afriExchangeReadyBody')
        : t('checkout.afriExchangeSetupRequiredBody')
);

watch(
    () => checkoutCurrency.value,
    () => {
        if (!paymentOptions.value.some((option) => option.value === paymentMethod.value)) {
            paymentMethod.value = paymentOptions.value[0]?.value || 'Paystack';
        }
    },
    { immediate: true }
);

const cluesBucksStore = useCluesBucksStore();
const { stats, isLoading: cluesBucksLoading } = storeToRefs(cluesBucksStore);

const cluesBucksToUse = ref(0);
const appliedCluesBucks = ref(0);
const storeCreditToUse = ref(0);
const appliedStoreCredit = ref(0);
const hasPersistedCartSelection = computed(() => {
    try {
        const selectionMap = JSON.parse(sessionStorage.getItem('cartSelection') || '{}');
        return Object.keys(selectionMap).length > 0;
    } catch (error) {
        console.error('Failed to read cart selection during checkout:', error);
        return false;
    }
});
const checkoutItems = computed(() =>
    hasPersistedCartSelection.value ? cartStore.selectedItems : cartStore.items
);
const selectedDiscount = computed(() => {
    if (!cartStore.discount || !cartStore.cartTotal) return 0;
    const proportionalDiscount = cartStore.discount * (subtotal.value / cartStore.cartTotal);
    return Math.min(proportionalDiscount, subtotal.value);
});

const total = computed(() => {
    const baseTotal = Math.max(0, subtotal.value - selectedDiscount.value) + shippingFee.value;
    const withCluesBucks = baseTotal - cluesBucksDiscount.value;
    const withOffers = withCluesBucks - specialOfferDiscount.value;
    return Math.max(0, withOffers - storeCreditDiscount.value);
});

const cluesBucksDiscount = computed(() => appliedCluesBucks.value);
const storeCreditDiscount = computed(() => appliedStoreCredit.value);
const subtotal = computed(() => cartStore.selectedItems.length ? cartStore.selectedCartTotal : cartStore.cartTotal);
const discount = computed(() => selectedDiscount.value);
const cluesBucksBalance = computed(() => stats.value?.currentBalance || 0);
const availableCluesBucks = computed(() => stats.value?.currentBalance || 0);
const storeCreditBalance = computed(() => stats.value?.storeCreditBalance || 0);

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
        checkoutItems.value
            .map(item => item.product?.category?._id || item.product?.category)
            .filter(Boolean)
            .map(String)
    );
    return cluesBucksStore.activeSpecialOffers.filter(offer => {
        if (!offer?.categoryPath) return false;
        const offerCategoryIds = offer.categoryPath
            .map(category => category?._id || category)
            .filter(Boolean)
            .map(String);
        return Array.from(cartCategories).some(category => offerCategoryIds.includes(category));
    });
});

const bestSpecialOffer = computed(() => {
    const offers = availableOffers.value;
    if (!offers || !offers.length) {
        return { discount: 0 };
    }
    return offers.reduce((max, offer) =>
        (offer?.discount || 0) > (max?.discount || 0) ? offer : max,
        { discount: 0 }
    );
});

const specialOfferDiscount = computed(() => {
    if (!bestSpecialOffer.value?.discount) return 0;
    const eligibleCategoryIds = (bestSpecialOffer.value.categoryPath || [])
        .map(category => category?._id || category)
        .filter(Boolean)
        .map(String);
    const eligibleTotal = checkoutItems.value.reduce((sum, item) => {
        const itemCategoryId = item.product?.category?._id || item.product?.category;
        const isEligible = itemCategoryId && eligibleCategoryIds.includes(String(itemCategoryId));
        const itemPrice = item.variant?.price || item.product?.price || 0;
        return sum + (isEligible ? itemPrice * item.quantity : 0);
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
                toast.success(t('checkout.specialOfferUnlocked'));
            }
        } catch (error) {
            console.error('Error redeeming points for Special Offer Access:', error);
            toast.error(t('checkout.failedUnlockOffer'));
        }
    } else {
        toast.error(t('checkout.insufficientPoints'));
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
        error.value = t('checkout.failedLoadCheckout');
    } finally {
        isLoading.value = false;
    }
};

const saveAddress = async () => {
    try {
        const wasEditing = Boolean(addressForm._id);
        const savedAddress = await addressStore.addOrUpdateAddress(addressForm);
        selectedAddress.value = savedAddress;
        addressForm._id = savedAddress._id;
        toast.success(wasEditing ? t('checkout.addressUpdated') : t('checkout.addressAdded'));
    } catch (error) {
        console.error('Error saving address:', error);
        toast.error(t('checkout.failedSaveAddress'));
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

watch(() => checkoutItems.value, (newItems) => {
    if (newItems) {
        updateShippingFee();
    }
}, { deep: true });

watch(() => stats.value?.currentBalance, (newBalance) => {
    if (newBalance < appliedCluesBucks.value) {
        appliedCluesBucks.value = 0;
        cluesBucksToUse.value = 0;
        toast.warning(t('checkout.cluesBucksReset'));
    }
});

watch(() => stats.value?.storeCreditBalance, (newBalance) => {
    if ((newBalance || 0) < appliedStoreCredit.value) {
        appliedStoreCredit.value = 0;
        storeCreditToUse.value = 0;
        toast.warning(t('checkout.storeCreditReset'));
    }
});

onMounted(async () => {
    try {
        if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
            console.error('Paystack public key not found in environment variables');
            toast.error(t('checkout.paymentConfigError'));
            return;
        }
        if (typeof PaystackPop === 'undefined') {
            console.error('Paystack script not loaded');
            toast.error(t('checkout.paymentNotInitialized'));
            return;
        }
        await loadCheckoutData();
        if (productStore && cartStore) {
            updateShippingFee();
        }
    } catch (error) {
        console.error('Error initializing checkout:', error);
        toast.error(t('checkout.failedInitializeCheckout'));
    }
});

const retryLoading = () => {
    loadCheckoutData();
};

const goToAfriExchangeLinking = async () => {
    await router.push('/account/profile/bank-details');
};

const openAfriExchangeSignup = () => {
    if (!afriExchangeSignupUrl) {
        toast.info(t('checkout.afriExchangeSignupUnavailable'));
        return;
    }

    window.open(afriExchangeSignupUrl, '_blank', 'noopener,noreferrer');
};

const updateShippingFee = () => {
    if (!productStore || !productStore.shippingRules) {
        console.warn('Shipping rules not available, using default fee');
        shippingFee.value = 5.99;
        return;
    }
    let fee = productStore.shippingRules.baseShippingFee || 0;
    if (subtotal.value > (productStore.shippingRules.freeShippingThreshold || 0)) {
        fee = 0;
    } else if (checkoutItems.value) {
        checkoutItems.value.forEach(item => {
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

const getCheckoutItemKey = (item) => `${item.product?._id || 'unknown'}-${item.variant?._id || 'default'}`;

const incrementQuantity = async (item) => {
    const itemKey = getCheckoutItemKey(item);
    if (loadingItems[itemKey] || !item.product?._id) return;
    loadingItems[itemKey] = true;
    try {
        await cartStore.updateQuantity(item.product._id, item.quantity + 1, item.variant?._id);
    } catch (error) {
        console.error('Error incrementing quantity:', error);
        toast.error(t('cart.failedUpdateQuantity'));
    } finally {
        loadingItems[itemKey] = false;
    }
};

const decrementQuantity = async (item) => {
    const itemKey = getCheckoutItemKey(item);
    if (loadingItems[itemKey] || !item.product?._id) return;
    loadingItems[itemKey] = true;
    try {
        if (item.quantity > 1) {
            await cartStore.updateQuantity(item.product._id, item.quantity - 1, item.variant?._id);
        } else {
            await cartStore.removeFromCart(item.product._id, item.variant?._id);
        }
    } catch (error) {
        console.error('Error decrementing quantity:', error);
        toast.error(t('cart.failedUpdateQuantity'));
    } finally {
        loadingItems[itemKey] = false;
    }
};

const refreshCart = async () => {
    try {
        await cartStore.fetchCart();
        updateShippingFee();
    } catch (error) {
        console.error('Error refreshing cart:', error);
        toast.error(t('checkout.failedRefreshCart'));
    }
};

const applyPromoCode = async () => {
    if (!promoCode.value) {
        toast.error(t('checkout.enterCouponCode'));
        return;
    }
    const code = promoCode.value;
    promoCode.value = '';
    try {
        await cartStore.applyCoupon(code);
        toast.success(t('checkout.couponApplied', { amount: cartStore.discount.toFixed(2) }));
    } catch (error) {
        console.error('Error applying coupon:', error);
        toast.error(error.response?.data?.message || t('checkout.failedApplyCoupon'));
    }
};

const removeCoupon = async () => {
    try {
        await cartStore.removeCoupon();
        await refreshCart();
        toast.success(t('checkout.couponRemoved'));
    } catch (error) {
        console.error('Error removing coupon:', error);
        toast.error(t('checkout.failedRemoveCoupon'));
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
            variant: item.variant,     // Include variant
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
        toast.error(t('checkout.notEnoughCluesBucks'));
        return;
    }
    if (points > total.value) {
        toast.error(t('checkout.cannotExceedTotal'));
        return;
    }
    appliedCluesBucks.value = points;
    toast.success(t('checkout.appliedCluesBucks', { points }));
    updateTotal();
};

const applyStoreCredit = () => {
    const amount = Number(storeCreditToUse.value);
    if (!amount) return;
    if (amount > storeCreditBalance.value) {
        toast.error(t('checkout.notEnoughStoreCredit'));
        return;
    }

    const maxApplicable = Math.max(
        0,
        subtotal.value - discount.value - cluesBucksDiscount.value - specialOfferDiscount.value + shippingFee.value
    );

    if (amount > maxApplicable) {
        toast.error(t('checkout.storeCreditCannotExceedTotal'));
        return;
    }

    appliedStoreCredit.value = Number(amount.toFixed(2));
    toast.success(t('checkout.appliedStoreCredit', { amount: appliedStoreCredit.value.toFixed(2) }));
};

const updateTotal = () => {};

const buildPurchasedCartItems = (items) => items.map((item) => ({
    productId: item.product?._id,
    variantId: item.variant?._id || null,
    quantity: item.quantity,
}));

const placeOrder = async () => {
    let createdOrder = null;

    // Initial validations
    if (!selectedAddress.value || !validateAddress(selectedAddress.value) || !checkoutItems.value?.length) {
        if (!selectedAddress.value) {
            toast.error(t('checkout.selectShippingAddress'));
        } else if (!validateAddress(selectedAddress.value)) {
            // validateAddress function already shows a toast
        } else if (!checkoutItems.value?.length) {
            toast.error(t('checkout.noSelectedItems'));
        }
        return;
    }

    if (paymentMethod.value === 'AfriExchange' && !hasLinkedAfriExchangeAccount.value) {
        toast.error(t('checkout.afriExchangeSetupRequiredToast'));
        return;
    }

    isProcessingPayment.value = true;

    try {
        // Calculate amounts
        const subtotalAmount = subtotal.value;
        const currentShippingFee = shippingFee.value;
        const couponDiscount = discount.value || 0;
        const cluesBucksDiscount = appliedCluesBucks.value || 0;
        const offerDiscount = specialOfferDiscount.value || 0;
        const storeCreditAmount = appliedStoreCredit.value || 0;
        const totalDiscount = couponDiscount + cluesBucksDiscount + offerDiscount + storeCreditAmount;
        const amountAfterDiscount = Math.max(0, subtotalAmount - totalDiscount);
        const preparedItems = prepareItemsForPayload(checkoutItems.value, totalDiscount, subtotalAmount);
        const totalVendorAmount = preparedItems.reduce((sum, item) => sum + item.vendorAmount, 0);
        const basePlatformFee = preparedItems.reduce((sum, item) => sum + item.platformFee, 0);
        const totalPlatformFee = basePlatformFee + currentShippingFee;
        const totalWithShipping = amountAfterDiscount + currentShippingFee;
        const pointsEarned = Math.floor(amountAfterDiscount / 100);
        const purchasedCartItems = buildPurchasedCartItems(checkoutItems.value);
        const purchasedEntireCart = checkoutItems.value.length === cartStore.items.length;

        // Create order
        const orderData = {
            address: selectedAddress.value,
            paymentMethod: paymentMethod.value,
            currency: checkoutCurrency.value,
            seller: checkoutItems.value[0].product.user,
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
            storeCredit: {
                amountUsed: storeCreditAmount,
            },
            couponDiscount: (discount.value || 0) + offerDiscount,
            ...(cartStore.coupon && { couponCode: cartStore.coupon.code }),
            metadata: {
                checkoutCountry: countryStore.selectedCountry,
                checkoutCurrency: checkoutCurrency.value,
                checkoutRail: paymentMethod.value,
                specialOfferId: bestSpecialOffer.value?._id || null,
                specialOfferDiscount: offerDiscount,
            },
        };

        console.log('Creating order with data:', orderData);
        createdOrder = await orderStore.createOrder(orderData);
        console.log('Order created:', createdOrder);

        // Handle different payment methods
        if (paymentMethod.value === 'Paystack') {
            if (!validatePaystackScript()) {
                toast.error(t('checkout.paymentNotInitialized'));
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

            localStorage.setItem('currentTransaction', JSON.stringify({
                orderId: createdOrder._id,
                timestamp: new Date().toISOString(),
                paymentMethod: 'Paystack',
                purchasedItems: purchasedCartItems,
                purchasedEntireCart,
                couponCode: cartStore.coupon?.code || null
            }));

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
                localStorage.setItem('currentTransaction', JSON.stringify({
                    orderId: createdOrder._id,
                    timestamp: new Date().toISOString(),
                    paymentMethod: 'OPay',
                    purchasedItems: purchasedCartItems,
                    purchasedEntireCart,
                    couponCode: cartStore.coupon?.code || null
                }));
                // Redirect to OPay payment page
                window.location.href = opayResponse.authorization_url;
            } else {
                throw new Error('OPay payment initialization failed');
            }
        } else if (paymentMethod.value === 'AfriExchange') {
            const paymentData = {
                orderId: createdOrder._id,
                email: selectedAddress.value.email,
                amount: totalWithShipping,
                paymentMethod: 'AfriExchange',
                metadata: {
                    orderId: createdOrder._id,
                    userId: userStore.user._id,
                    userEmail: selectedAddress.value.email,
                    customerName: `${selectedAddress.value.firstName} ${selectedAddress.value.lastName}`,
                    checkoutCountry: countryStore.selectedCountry,
                    checkoutCurrency: checkoutCurrency.value,
                    items: preparedItems.map(item => ({
                        productId: item.productId || item.product,
                        quantity: item.quantity,
                        price: item.price,
                        vendorAmount: item.vendorAmount,
                        platformFee: item.platformFee,
                        vendorId: item.vendorId
                    })),
                }
            };

            const afriExchangeResponse = await paymentStore.initializePayment(paymentData);
            const reference = afriExchangeResponse.reference;

            if (!reference) {
                throw new Error('AfriExchange payment confirmation failed');
            }

            localStorage.setItem('currentTransaction', JSON.stringify({
                orderId: createdOrder._id,
                reference,
                timestamp: new Date().toISOString(),
                paymentMethod: 'AfriExchange',
                purchasedItems: purchasedCartItems,
                purchasedEntireCart,
                couponCode: cartStore.coupon?.code || null
            }));

            await Promise.all([
                cartStore.removeCheckedOutItems(purchasedCartItems),
                cartStore.coupon?.code
                    ? cartStore.invalidateCoupon(cartStore.coupon.code)
                    : Promise.resolve()
            ]);

            toast.success(t('checkout.paymentSuccessful'));

            await router.push({
                name: 'PaymentSuccess',
                params: {
                    reference,
                    orderId: createdOrder._id
                }
            });
        } else {
            toast.error(t('checkout.validPaymentMethod'));
            throw new Error(t('checkout.validPaymentMethod'));
        }
    } catch (error) {
        console.error('Payment initialization error:', error);
        toast.error(error.response?.data?.message || error.message || t('checkout.paymentInitializationFailed'));

        if (createdOrder?._id) {
            try {
                await orderStore.cancelOrder(createdOrder._id, "Payment cancelled by user");
                toast.info(t('checkout.orderCancelledPaymentFailure'));
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
            throw new Error(t('checkout.paymentVerificationFailed'));
        }
        await orderStore.updateOrderStatus(orderId, {
            status: "Processing",
            transactionId: response.reference
        });

        await Promise.all([
            cluesBucksStore.fetchStats(),
            cluesBucksStore.fetchTransactions(),
            cluesBucksStore.checkOfferAccess(),
            cluesBucksStore.fetchSpecialOffers()
        ]);

        const transactionDetails = {
            orderId,
            reference: response.reference,
            timestamp: new Date().toISOString(),
            verificationId: verificationResult.data.verificationId,
            paymentMethod,
            purchasedItems: buildPurchasedCartItems(checkoutItems.value),
            purchasedEntireCart: checkoutItems.value.length === cartStore.items.length,
            couponCode: cartStore.coupon?.code || null
        };

        localStorage.setItem('currentTransaction', JSON.stringify(transactionDetails));

        await Promise.all([
            cartStore.removeCheckedOutItems(transactionDetails.purchasedItems),
            transactionDetails.couponCode
                ? cartStore.invalidateCoupon(transactionDetails.couponCode)
                : Promise.resolve()
        ]);

        toast.success(t('checkout.paymentSuccessful'));

        await router.push({
            name: 'PaymentSuccess',
            params: {
                reference: response.reference,
                orderId
            }
        });
    } catch (error) {
        console.error('Error processing successful payment:', error);
        toast.error(error.response?.data?.message || t('checkout.errorCompletingPayment'));
        try {
            await orderStore.cancelOrder(orderId, "Payment verification failed");
            toast.error(t('checkout.orderCancelledVerification'));
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
            toast.error(t('checkout.paymentCancelled'));
        }
    } catch (error) {
        console.error('Error handling payment cancellation:', error);
        toast.error(t('checkout.cancellationError'));
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
        toast.error(t('checkout.completeFields', { fields: missingFields.join(', ') }));
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
        toast.error(t('checkout.validEmailAddress'));
        return false;
    }
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(address.phone)) {
        toast.error(t('checkout.validPhoneNumber'));
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
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .sticky-summary::-webkit-scrollbar {
        display: none;
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

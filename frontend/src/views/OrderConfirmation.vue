<template>
    <div class="container mx-auto p-4 max-w-3xl">
        <div v-if="isLoading" class="text-center py-8">
            <p class="text-xl text-gray-600">{{ t('orderConfirmationPage.loading') }}</p>
        </div>
        <div v-else-if="error" class="text-center py-8">
            <p class="text-xl text-red-600">{{ error }}</p>
        </div>
        <div v-else class="bg-white shadow-md rounded-lg p-4 sm:p-8">
            <div class="flex justify-between">
                <h1 class="text-2xl font-bold mb-6">{{ t('orderConfirmationPage.title') }}</h1>
                <img src="../assets/images/logo.png" alt="logo" class=" h-14 pb-2 cursor-not-allowed">
            </div>
            <p class="mb-4 text-gray-700">
                {{ t('orderConfirmationPage.thankYou') }}
                <a href="/account/orders"
                    class="text-blue-500 hover:underline">{{ t('orderConfirmationPage.loginToAccount') }}</a>.
            </p>
            <p class="mb-6 text-gray-700">{{ t('orderConfirmationPage.questions') }} <a
                    href="mailto:brutholdigital@gmail.com"
                    class="text-blue-500 hover:underline">brutholdigital@gmail.com</a>.</p>

            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">{{ t('orderConfirmationPage.sellerInformation') }}</h2>
                <div v-if="sellerInfo">
                    <p><strong>{{ t('orderConfirmationPage.storeName') }}</strong> {{ sellerInfo.storeName }}</p>
                    <p><strong>{{ t('orderConfirmationPage.storeDescription') }}</strong> {{ sellerInfo.storeDescription }}</p>
                    <!-- Add more seller details as needed -->
                </div>
                <p v-else class="text-gray-600">{{ t('orderConfirmationPage.sellerUnavailable') }}</p>
            </div>

            <div class="border-t border-b border-gray-200 py-4 mb-6">
                <h2 class="text-xl font-semibold mb-2">{{ t('orderConfirmationPage.orderNumber', { id: order.orderId || order._id.slice(-8).toUpperCase() }) }}
                </h2>
                <p class="text-gray-600">{{ t('orderConfirmationPage.placedOn', { date: formatDate(order.createdAt) }) }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
                <div>
                    <h3 class="font-semibold mb-2">{{ t('orderConfirmationPage.billingInfo') }}</h3>
                    <p>{{ order.address.street }}</p>
                    <p>{{ order.address.city }}, {{ order.address.state }} {{ order.address.postalCode }}</p>
                    <p>{{ order.address.country }}</p>
                </div>
                <div>
                    <h3 class="font-semibold mb-2">{{ t('orderConfirmationPage.shippingInfo') }}</h3>
                    <p>{{ order.address.street }}</p>
                    <p>{{ order.address.city }}, {{ order.address.state }} {{ order.address.postalCode }}</p>
                    <p>{{ order.address.country }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
                <div>
                    <h3 class="font-semibold mb-2">{{ t('orderConfirmationPage.paymentMethod') }}</h3>
                    <p>{{ order.paymentMethod }}</p>
                    <p v-if="order.transactionId">{{ t('orderConfirmationPage.reference', { reference: order.transactionId }) }}</p>
                </div>
                <div>
                    <h3 class="font-semibold mb-2">{{ t('orderConfirmationPage.shippingMethod') }}</h3>
                    <p>{{ t('orderConfirmationPage.standardShipping') }}</p>
                </div>
            </div>


            <!-- CluesBucks earned after successful payment-->
            <div v-if="earnedPoints" class="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <div class="flex items-center gap-2">
                    <Coins class="w-5 h-5 text-green-500" />
                    <h3 class="text-lg font-semibold text-green-700">{{ t('orderConfirmationPage.cluesBucksEarned') }}</h3>
                </div>
                <p class="mt-2 text-green-600">
                    {{ t('orderConfirmationPage.cluesBucksMessage', { points: earnedPoints }) }}
                </p>
            </div>



            <div class="overflow-x-auto mb-6">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-2">{{ t('orderConfirmationPage.items') }}</th>
                            <th class="text-center py-2">{{ t('orderConfirmationPage.quantity') }}</th>
                            <th class="text-right py-2">{{ t('orderConfirmationPage.price') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in orderItems" :key="item.product" class="border-b border-gray-200">
                            <td class="py-2">
                                <div class="flex items-center">
                                    <img v-if="item.productDetails && item.productDetails.images && item.productDetails.images.length > 0"
                                        :src="item.productDetails.images[0]" :alt="item.productDetails.name"
                                        class="w-16 h-16 object-cover mr-4">
                                    <div className=" w-11/12">
                                        <p class="font-semibold">{{ item.productDetails ? item.productDetails.name :
                                            t('orderConfirmationPage.productNotFound') }}</p>
                                        <!-- Add variant details -->
                                        <div v-if="item.variant"
                                            class="text-xs text-gray-500 mb-1 flex flex-wrap gap-x-2">
                                            <span v-if="item.variant.color">
                                                {{ t('cart.color') }}: {{ typeof item.variant.color === 'object' ?
                                                item.variant.color.name : item.variant.color }}
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
                                        <p class="text-sm text-gray-600">{{ item.productDetails ?
                                            item.productDetails.description : t('orderConfirmationPage.notAvailable') }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center py-2">{{ item.quantity }}</td>
                            <td class="text-right py-2">{{ formatPrice(item.productDetails ? item.productDetails.price *
                                item.quantity : 0) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- <div class="flex justify-end">
                <div class="w-full sm:w-1/2">
                    <div class="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>{{ formatPrice(calculateSubtotal()) }}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Shipping & Handling</span>
                        <span>{{ formatPrice(order.totalAmount - calculateSubtotal()) }}</span>
                    </div>
                    <div class="flex justify-between font-semibold">
                        <span>Grand Total</span>
                        <span>{{ formatPrice(order.totalAmount) }}</span>
                    </div>
                </div>
            </div> -->

            <!-- In the order summary section -->
            <div class="flex justify-end">
                <div class="w-full sm:w-1/2">
                    <div class="flex justify-between mb-2">
                        <span>{{ t('cart.subtotal') }}</span>
                        <span>{{ formatPrice(order.subtotal) }}</span>
                    </div>

                    <!-- Show coupon discount if exists -->
                    <div v-if="order.discount > 0" class="flex justify-between mb-2 text-green-600">
                        <span>{{ t('orderConfirmationPage.couponDiscount', { amount: order.discount }) }}</span>
                        <span>-{{ formatPrice(order.discount) }}</span>
                    </div>

                    <!-- Show CluesBucks discount if used -->
                    <div v-if="order.cluesBucks?.pointsUsed" class="flex justify-between mb-2 text-green-600">
                        <span>{{ t('orderConfirmationPage.cluesBucksDiscount', { points: order.cluesBucks.pointsUsed }) }}</span>
                        <span>-{{ formatPrice(order.cluesBucks.discount) }}</span>
                    </div>

                    <div v-if="order.storeCredit?.amountUsed" class="flex justify-between mb-2 text-green-600">
                        <span>{{ t('orderConfirmationPage.storeCreditDiscount') }}</span>
                        <span>-{{ formatPrice(order.storeCredit.amountUsed) }}</span>
                    </div>

                    <!-- Show consolidated discount if no specific discounts -->
                    <div v-if="order.discount > 0 && !order.couponDiscount && !order.cluesBucks?.discount && !order.storeCredit?.amountUsed"
                        class="flex justify-between mb-2 text-green-600">
                        <span>{{ t('cart.discount') }}</span>
                        <span>-{{ formatPrice(order.discount) }}</span>
                    </div>

                    <div class="flex justify-between mb-2">
                        <span>{{ t('orderConfirmationPage.shippingHandling') }}</span>
                        <span>{{ formatPrice(order.shippingFee) }}</span>
                    </div>

                    <div class="flex justify-between font-semibold">
                        <span>{{ t('orderConfirmationPage.grandTotal') }}</span>
                        <span>{{ formatPrice(order.total) }}</span>
                    </div>
                </div>
            </div>

            <div class="text-center mt-8">
                <!-- <RouterLink to="/account/orders/profile-order" -->
                <RouterLink to="/"
                    class="block w-full sm:inline-block sm:w-auto bg-blue-500 text-white hover:text-gray-50 px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                    {{ t('searchPage.returnToShopping') }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCluesBucksStore } from '../store/cluesBucksStore';
import { useRoute, RouterLink } from 'vue-router';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { useSellerStore } from '../store/sellerStore.js';
import { toast } from 'vue-sonner';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const orderStore = useOrderStore();
const productStore = useProductStore();
const sellerStore = useSellerStore();
const order = ref(null);
const orderItems = ref([]);
const sellerInfo = ref(null);
const isLoading = ref(true);
const error = ref(null);
const cluesBucksStore = useCluesBucksStore();
const { t, locale } = useI18n();

console.log('orderStore:', orderStore);
console.log('productStore:', productStore);
console.log('sellerStore:', sellerStore);

const earnedPoints = computed(() => {
    if (!order.value?.cluesBucks) return 0;
    return order.value.cluesBucks.pointsEarned;
});

const formatDate = (dateString) => {
    const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US';
    return new Date(dateString).toLocaleString(activeLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
};

const formatPrice = (price) => {
    const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-NG';
    if (typeof price !== 'number' || isNaN(price)) {
        return new Intl.NumberFormat(activeLocale, {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(0);
    }
    return new Intl.NumberFormat(activeLocale, {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

const calculateSubtotal = () => order.value?.subtotal || 0;

const fetchProductDetails = async (productId) => {
    // Ensure we're passing a string ID
    const id = typeof productId === 'object' ? productId._id || productId.toString() : productId.toString();

    try {
        console.log('Fetching product with ID:', id);
        const product = await productStore.fetchProductById(id);
        console.log('Fetched product:', product);
        return product;
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        toast.error(t('orderConfirmationPage.failedProductDetails', { productId }));
        return null;
    }
};

const fetchSellerInfo = async (sellerId) => {
    if (!sellerId) {
        console.log('No seller ID provided');
        sellerInfo.value = null;
        return;
    }

    // Extract ID if it's an object
    const id = typeof sellerId === 'object' ? sellerId._id || sellerId.toString() : sellerId.toString();

    try {
        // First, fetch the user profile
        const userProfile = await sellerStore.fetchUserProfile(id);

        if (!userProfile) {
            console.log('User profile not found');
            sellerInfo.value = null;
            return;
        }

        if (!userProfile.sellerProfile) {
            console.log('User is not a seller');
            sellerInfo.value = null;
            return;
        }

        const seller = await sellerStore.fetchSellerProfile(userProfile.sellerProfile);
        sellerInfo.value = seller;
    } catch (error) {
        console.error('Error fetching seller info:', error);
        toast.error(t('orderConfirmationPage.failedSellerInfo'));
        sellerInfo.value = null;
    }
};

// Update the product details fetching logic
const loadProductDetails = async () => {
    try {
        const productDetails = await Promise.all(
            order.value.products.map(async (item) => {
                const product = await fetchProductDetails(item.product);
                return {
                    ...item,
                    productDetails: product || {
                        name: t('orderConfirmationPage.productNotFound'),
                        price: 0,
                        description: t('orderConfirmationPage.notAvailable'),
                        images: []
                    }
                };
            })
        );
        orderItems.value = productDetails;
    } catch (error) {
        console.error('Error loading product details:', error);
    }
};

onMounted(async () => {
    try {
        const orderId = route.params.orderId;
        // Fetch the specific order
        const orderData = await orderStore.fetchOrder(orderId);

        console.log('Fetching order:', orderId);

        if (!orderData) {
            throw new Error(t('orderConfirmationPage.orderNotFound'));
        }

        // Set the order data
        order.value = orderData;

        console.log('Fetched order:', order.value);

        // Fetch product details for each item in the order
        // Load all related data in parallel
        await Promise.all([
            // Fetch seller information if available
            order.value.seller ? fetchSellerInfo(order.value.seller) : Promise.resolve(),

            // Fetch all product details
            loadProductDetails()
        ]);

        // Calculate any derived values
        if (order.value.cluesBucks?.pointsEarned) {
            earnedPoints.value = order.value.cluesBucks.pointsEarned;
        }

        isLoading.value = false;

    } catch (err) {
        console.error('Error fetching order:', err);
        error.value = t('orderConfirmationPage.failedLoad');
        isLoading.value = false;
    }
});
</script>

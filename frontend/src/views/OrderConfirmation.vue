<template>
    <div class="container mx-auto p-4 max-w-3xl">
        <div v-if="isLoading" class="text-center py-8">
            <p class="text-xl text-gray-600">Loading order details...</p>
        </div>
        <div v-else-if="error" class="text-center py-8">
            <p class="text-xl text-red-600">{{ error }}</p>
        </div>
        <div v-else class="bg-white shadow-md rounded-lg p-4 sm:p-8">
            <div class="flex justify-between">
                <h1 class="text-2xl font-bold mb-6">Order Confirmation</h1>
                <img src="../assets/images/logo.png" alt="logo" class=" h-14 pb-2 cursor-not-allowed">
            </div>
            <p class="mb-4 text-gray-700">Thank you for your order from Bruthol Store. Once your package ships we
                will send you a tracking number. You can check the status of your order by <a href="/account/orders"
                    class="text-blue-500 hover:underline">logging into your account</a>.</p>
            <p class="mb-6 text-gray-700">If you have questions about your order, you can email us at <a
                    href="mailto:support@bruthol.com" class="text-blue-500 hover:underline">support@bruthol.com</a>.</p>

            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">Seller Information</h2>
                <div v-if="sellerInfo">
                    <p><strong>Store Name:</strong> {{ sellerInfo.storeName }}</p>
                    <p><strong>Store Description:</strong> {{ sellerInfo.storeDescription }}</p>
                    <!-- Add more seller details as needed -->
                </div>
                <p v-else class="text-gray-600">Seller information not available</p>
            </div>

            <div class="border-t border-b border-gray-200 py-4 mb-6">
                <h2 class="text-xl font-semibold mb-2">Order #{{ order.orderId || order._id.slice(-8).toUpperCase() }}
                </h2>
                <p class="text-gray-600">Placed on {{ formatDate(order.createdAt) }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
                <div>
                    <h3 class="font-semibold mb-2">Billing Info</h3>
                    <p>{{ order.address.street }}</p>
                    <p>{{ order.address.city }}, {{ order.address.state }} {{ order.address.postalCode }}</p>
                    <p>{{ order.address.country }}</p>
                </div>
                <div>
                    <h3 class="font-semibold mb-2">Shipping Info</h3>
                    <p>{{ order.address.street }}</p>
                    <p>{{ order.address.city }}, {{ order.address.state }} {{ order.address.postalCode }}</p>
                    <p>{{ order.address.country }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
                <div>
                    <h3 class="font-semibold mb-2">Payment Method</h3>
                    <p>{{ order.paymentMethod }}</p>
                    <p v-if="order.transactionId">Ref: {{ order.transactionId }}</p>
                </div>
                <div>
                    <h3 class="font-semibold mb-2">Shipping Method</h3>
                    <p>Standard Shipping</p>
                </div>
            </div>


            <!-- CluesBucks earned after successful payment-->
            <div v-if="earnedPoints" class="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <div class="flex items-center gap-2">
                    <Coins class="w-5 h-5 text-green-500" />
                    <h3 class="text-lg font-semibold text-green-700">CluesBucks Earned</h3>
                </div>
                <p class="mt-2 text-green-600">
                    You earned {{ earnedPoints }} CluesBucks from this purchase!
                </p>
            </div>



            <div class="overflow-x-auto mb-6">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-2">Items</th>
                            <th class="text-center py-2">Qty</th>
                            <th class="text-right py-2">Price</th>
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
                                            'Product not found' }}</p>
                                        <p class="text-sm text-gray-600">{{ item.productDetails ?
                                            item.productDetails.description : 'N/A' }}</p>
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
                        <span>Subtotal</span>
                        <span>{{ formatPrice(order.subtotal) }}</span>
                    </div>

                    <!-- Show coupon discount if exists -->
                    <div v-if="order.discount > 0" class="flex justify-between mb-2 text-green-600">
                        <span>Coupon Discount (₦{{ order.discount }})</span>
                        <span>-{{ formatPrice(order.discount) }}</span>
                    </div>

                    <!-- Show CluesBucks discount if used -->
                    <div v-if="order.cluesBucks?.pointsUsed" class="flex justify-between mb-2 text-green-600">
                        <span>CluesBucks Discount ({{ order.cluesBucks.pointsUsed }} points)</span>
                        <span>-{{ formatPrice(order.cluesBucks.discount) }}</span>
                    </div>

                    <!-- Show consolidated discount if no specific discounts -->
                    <div v-if="order.discount > 0 && !order.couponDiscount && !order.cluesBucks?.discount"
                        class="flex justify-between mb-2 text-green-600">
                        <span>Discount</span>
                        <span>-{{ formatPrice(order.discount) }}</span>
                    </div>

                    <div class="flex justify-between mb-2">
                        <span>Shipping & Handling</span>
                        <span>{{ formatPrice(order.shippingFee) }}</span>
                    </div>

                    <div class="flex justify-between font-semibold">
                        <span>Grand Total</span>
                        <span>{{ formatPrice(order.total) }}</span>
                    </div>
                </div>
            </div>

            <div class="text-center mt-8">
                <!-- <RouterLink to="/account/orders/profile-order" -->
                <RouterLink to="/"
                    class="block w-full sm:inline-block sm:w-auto bg-blue-500 text-white hover:text-gray-50 px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                    Continue Shopping
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

console.log('orderStore:', orderStore);
console.log('productStore:', productStore);
console.log('sellerStore:', sellerStore);

const earnedPoints = computed(() => {
    if (!order.value?.cluesBucks) return 0;
    return order.value.cluesBucks.pointsEarned;
});

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
};

const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(0);
    }
    return new Intl.NumberFormat('en-NG', {
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
        toast.error(`Failed to load details for product ${productId}`);
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
        toast.error('Failed to load seller information');
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
                        name: 'Product not found',
                        price: 0,
                        description: 'N/A',
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
            throw new Error('Order not found');
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
        error.value = 'Failed to load order details. Please try again.';
        isLoading.value = false;
    }
});
</script>
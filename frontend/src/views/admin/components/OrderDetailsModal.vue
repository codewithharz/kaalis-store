<!-- OrderDetailsModal.vue -->
<template>
    <div v-if="order" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl m-4">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h3 class="text-lg font-medium text-gray-900">
                        Order Details - #{{ order.orderId }}
                    </h3>
                    <p class="text-sm text-gray-500">
                        Placed on {{ formatDate(order.createdAt) }}
                    </p>
                    <p class="text-sm text-gray-500">
                        Email: {{ order.user?.email }}</p>
                    <p class="text-sm text-gray-500">
                        Buyer: {{ order.user?.username }}</p>
                </div>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
                    <XIcon class="h-6 w-6" />
                </button>
            </div>

            <!-- Order Summary -->
            <div class="grid grid-cols-2 gap-6 mb-6">
                <!-- Customer Info -->
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">Shipping Information</h4>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="mb-1"><span class="font-medium">Address:</span> {{ order.address.street }}</p>
                        <p class="mb-1">{{ order.address.city }}, {{ order.address.state }}</p>
                        <p>{{ order.address.country }} {{ order.address.postalCode }}</p>
                    </div>
                </div>

                <!-- Payment Info -->
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">Payment Information</h4>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="mb-1"><span class="font-medium">Method:</span> {{ order.paymentMethod }}</p>
                        <p class="mb-1"><span class="font-medium">Status:</span>
                            <span :class="[
                                'ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                getStatusClass(order.status)
                            ]">
                                {{ formatStatus(order.status) }}
                            </span>
                        </p>
                        <p v-if="order.transactionId"><span class="font-medium">Transaction ID:</span>
                            {{ order.transactionId }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Financial Summary -->
            <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">Platform Fee</p>
                    <p class="text-xl font-semibold">{{ formatCurrency(order.platformFee) }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">Vendor Amount</p>
                    <p class="text-xl font-semibold">{{ formatCurrency(order.vendorAmount) }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">CluesBucks Used</p>
                    <p class="text-xl font-semibold">{{ order.cluesBucks?.pointsUsed || 0 }}</p>
                </div>
            </div>

            <!-- Coupon Info -->
            <div v-if="order.appliedCoupon" class="mb-6">
                <h4 class="font-medium text-gray-900 mb-2">Coupon Applied</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p><span class="font-medium">Code:</span> {{ order.appliedCoupon.code }}</p>
                    <p><span class="font-medium">Discount:</span> {{ formatCurrency(order.discount) }}</p>
                </div>
            </div>

            <!-- Order Items -->
            <div class="mb-6">
                <h4 class="font-medium text-gray-900 mb-2">Order Items</h4>
                <div class="bg-white shadow overflow-hidden rounded-lg">
                    <!-- Loading state -->
                    <div v-if="isLoading" class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>

                    <!-- Table with products -->
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            </tr>
                        </thead>
                        <!-- Order Items -->
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="item in order.products" :key="item._id">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <template v-if="getProductImage(item)">
                                                <img :src="getProductImage(item)" :alt="getProductName(item)"
                                                    class="h-10 w-10 rounded object-cover">
                                            </template>
                                            <div v-else
                                                class="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                                <ImageIcon class="h-6 w-6 text-gray-400" />
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ getProductName(item) }}
                                            </div>

                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ item.quantity }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatCurrency(item.price) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatCurrency(item.price * item.quantity) }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            
                        </tfoot>
                        <tfoot class="bg-gray-50">
                            <tr>
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">Subtotal</td>
                                <td class="px-6 py-3 text-sm text-gray-900">{{ formatCurrency(order.subtotal) }}</td>
                            </tr>
                            <tr v-if="order.discount">
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">Discount</td>
                                <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(order.discount) }}</td>
                            </tr>
                            <tr>
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">Shipping</td>
                                <td class="px-6 py-3 text-sm text-gray-900">
                                    {{ formatCurrency(order.shippingFee || 0) }}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-900">Total</td>
                                <td class="px-6 py-3 text-sm font-bold text-gray-900">{{
                                    formatCurrency(order.totalAmount) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- Order Timeline -->
            <div>
                <h4 class="font-medium text-gray-900 mb-2">Order Timeline</h4>
                <div class="flow-root">
                    <ul role="list" class="-mb-5">
                        <li v-for="(event, eventIdx) in timeline" :key="eventIdx">
                            <div class="relative pb-3">
                                <div class="relative flex space-x-3">
                                    <div>
                                        <span
                                            class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                                            :class="getTimelineItemClass(event.type)">
                                            <component :is="getTimelineIcon(event.type)" class="h-5 w-5 text-white" />
                                        </span>
                                    </div>
                                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                        <div>
                                            <p class="text-sm text-gray-500">{{ event.message }}</p>
                                        </div>
                                        <div class="whitespace-nowrap text-right text-sm text-gray-500">
                                            {{ formatDate(event.timestamp) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import { useProductStore } from '../../../store/productStore.js';
import { XIcon, ShoppingCart, Truck, CheckCircle, XCircle, ImageIcon } from 'lucide-vue-next'

export default {
    name: 'OrderDetailsModal',

    components: {
        XIcon,
        ShoppingCart,
        Truck,
        CheckCircle,
        XCircle,
        ImageIcon
    },

    props: {
        order: {
            type: Object,
            required: true
        }
    },

    emits: ['close'],

    setup(props) {
        const productStore = useProductStore();
        const loadedProducts = ref([]);
        const isLoading = ref(true);

        const timeline = computed(() => {
            const events = [
                {
                    type: 'order_placed',
                    message: 'Order placed',
                    timestamp: props.order.createdAt
                }
            ]

            if (props.order.status === 'Processing') {
                events.push({
                    type: 'processing',
                    message: 'Order processing started',
                    timestamp: props.order.updatedAt
                })
            }

            if (props.order.status === 'Shipped') {
                events.push({
                    type: 'processing',
                    message: 'Order processing started',
                    timestamp: props.order.updatedAt
                }, {
                    type: 'shipped',
                    message: 'Order shipped',
                    timestamp: props.order.updatedAt
                })
            }

            if (props.order.status === 'Delivered') {
                events.push({
                    type: 'processing',
                    message: 'Order processing started',
                    timestamp: props.order.updatedAt
                }, {
                    type: 'shipped',
                    message: 'Order shipped',
                    timestamp: props.order.updatedAt
                }, {
                    type: 'completed',
                    message: 'Order delivered',
                    timestamp: props.order.updatedAt
                })
            }

            if (props.order.status === 'Cancelled') {
                events.push({
                    type: 'cancelled',
                    message: 'Order cancelled',
                    timestamp: props.order.updatedAt
                })
            }

            return events
        })

        const loadProductDetails = async () => {
            try {
                if (props.order?.products && props.order.products.length > 0) {
                    const products = await Promise.all(
                        props.order.products.map(async (item) => {
                            if (typeof item.product === 'string') {
                                try {
                                    const details = await productStore.fetchProductById(item.product);
                                    return { ...item, product: details };
                                } catch (error) {
                                    console.error(`Error fetching product ${item.product}:`, error);
                                    return item;
                                }
                            }
                            return item;
                        })
                    );
                    loadedProducts.value = products;
                }
            } catch (error) {
                console.error('Error loading product details:', error);
            } finally {
                isLoading.value = false;
            }
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        const formatStatus = (status) => {
            return status.charAt(0).toUpperCase() + status.slice(1)
        }

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2
            }).format(amount)
        }

        const getStatusClass = (status) => {
            const classes = {
                Pending: 'bg-yellow-100 text-yellow-800',
                Processing: 'bg-blue-100 text-blue-800',
                Shipped: 'bg-purple-100 text-purple-800',
                Delivered: 'bg-green-100 text-green-800',
                Cancelled: 'bg-red-100 text-red-800'
            }
            return classes[status] || 'bg-gray-100 text-gray-800'
        }

        const getTimelineIcon = (type) => {
            const icons = {
                order_placed: ShoppingCart,
                processing: Truck,
                shipped: Truck,
                completed: CheckCircle,
                cancelled: XCircle
            }
            return icons[type] || CheckCircle
        }

        const getTimelineItemClass = (type) => {
            const classes = {
                order_placed: 'bg-blue-500',
                processing: 'bg-yellow-500',
                shipped: 'bg-purple-500',
                completed: 'bg-green-500',
                cancelled: 'bg-red-500'
            }
            return classes[type] || 'bg-gray-500'
        }

        watchEffect(() => {
            if (props.order) {
                loadProductDetails();
            }
        });

        const getProductImage = (item) => {
            return item.product?.images?.[0] || '';
        };

        const getProductName = (item) => {
            if (typeof item.product === 'string') {
                return 'Loading product...';
            }
            return item.product?.name || 'Product name not available';
        };

        return {
            timeline,
            formatDate,
            formatStatus,
            formatCurrency,
            getStatusClass,
            getTimelineIcon,
            getTimelineItemClass,
            getProductImage,
            getProductName,

            isLoading,
            loadedProducts,
        }
    }
}
</script>
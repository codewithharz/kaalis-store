<!-- frontend/src/views/OrderDetails.vue -->
<template>
    <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <button @click="router.back()"
                    class="flex items-center text-gray-600 hover:text-gray-800 transition duration-150">
                    <ArrowLeft class="w-5 h-5 mr-2" />
                    <span class="text-sm sm:text-base">Back to Orders</span>
                </button>
                <div class="flex items-center gap-3">
                    <button @click="refreshOrder"
                        class="flex items-center justify-center px-4 py-2 bg-white border rounded-md text-gray-600 hover:bg-gray-50">
                        <RefreshCcw class="w-4 h-4 mr-2" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            <!-- Order Details Card -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div>
                            <h1 class="text-2xl font-semibold text-gray-900">
                                Order #{{ order?.id || orderId?.substring(orderId.length - 6).toUpperCase() }}
                            </h1>
                            <p class="text-sm text-gray-500 mt-1">{{ formatDate(order?.date) }}</p>
                        </div>
                        <div class="mt-4 sm:mt-0">
                            <span :class="[
                                'px-3 py-1 text-sm font-semibold rounded-full',
                                getStatusClass(order?.status?.toLowerCase() || '')
                            ]">
                                {{ order?.status }}
                            </span>
                        </div>
                    </div>

                    <!-- Customer Information -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Customer Information</h3>
                            <div class="mt-2">
                                <p class="text-sm font-medium text-gray-900">{{ order?.customer?.name }}</p>
                                <p class="text-sm text-gray-500">{{ order?.customer?.email }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product
                                    </th>
                                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Quantity</th>
                                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Original Price</th>
                                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Subtotal</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="item in order?.products" :key="item.id">
                                    <td class="px-4 py-4 text-sm text-gray-900">{{ item.name }}</td>
                                    <td class="px-4 py-4 text-sm text-gray-900 text-right">{{ item.quantity }}</td>
                                    <td class="px-4 py-4 text-sm text-gray-900 text-right">₦{{ formatAmount(item.price)
                                        }}</td>
                                    <td class="px-4 py-4 text-sm text-gray-900 text-right">₦{{ formatAmount(item.price *
                                        item.quantity) }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                                        Subtotal</td>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-900 text-right">₦{{
                                        formatAmount(calculateSubtotal) }}</td>
                                </tr>
                                <tr v-if="hasDiscount">
                                    <td colspan="3" class="px-4 py-4 text-sm font-medium text-green-600 text-right">
                                        Discount Applied</td>
                                    <td class="px-4 py-4 text-sm font-medium text-green-600 text-right">-₦{{
                                        formatAmount(discountAmount) }}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" class="px-4 py-4 text-base font-bold text-gray-900 text-right">Final
                                        Total</td>
                                    <td class="px-4 py-4 text-base font-bold text-gray-900 text-right">₦{{
                                        formatAmount(order?.total || 0) }}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <!-- Status Timeline -->
                <div class="px-6 py-4 border-t border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>
                    <div class="flex items-center space-x-4">
                        <div v-for="(status, index) in availableStatuses" :key="status"
                            class="flex items-center relative flex-1">
                            <div :class="[
                                'w-8 h-8 rounded-full flex items-center justify-center',
                                isStatusCompleted(status) ? 'bg-green-500' : 'bg-gray-200'
                            ]">
                                <Check v-if="isStatusCompleted(status)" class="w-5 h-5 text-white" />
                            </div>
                            <div v-if="index < availableStatuses.length - 1" :class="[
                                'h-1 flex-1',
                                isStatusCompleted(availableStatuses[index + 1]) ? 'bg-green-500' : 'bg-gray-200'
                            ]"></div>
                            <div class="absolute -bottom-6 left-0 text-xs text-gray-500 whitespace-nowrap">
                                {{ status }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="px-6 py-4 border-t border-gray-200">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center space-x-4">
                            <button @click="updateOrderStatus" :disabled="!canUpdateStatus"
                                class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-4 rounded-lg flex items-center space-x-3">
                <svg class="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <span class="text-gray-700">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, RefreshCcw, Check } from 'lucide-vue-next';
import { useSellerStore } from '../store/sellerStore';
import { useOrderStore } from '../store/orderStore';

import { toast } from 'vue-sonner';

export default {
    name: 'ManageOrderDetails',
    components: {
        ArrowLeft,
        RefreshCcw,
        Check
    },

    setup() {
        const router = useRouter();
        const route = useRoute();
        const sellerStore = useSellerStore();
        const orderStore = useOrderStore();
        const isLoading = ref(false);
        const order = ref(null);
        const orderId = route.params.id;

        // Available statuses array
        const availableStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        // Status class mapping
        const getStatusClass = (status) => {
            const classes = {
                pending: 'bg-yellow-100 text-yellow-800',
                processing: 'bg-blue-100 text-blue-800',
                shipped: 'bg-green-100 text-green-800',
                delivered: 'bg-purple-100 text-purple-800',
                cancelled: 'bg-red-100 text-red-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        };

        // Format date
        const formatDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        // Format amount
        const formatAmount = (amount) => {
            return Number(amount).toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        // Check if a status is completed
        const isStatusCompleted = (status) => {
            if (!order.value?.status) return false;
            const currentIndex = availableStatuses.indexOf(order.value.status);
            const statusIndex = availableStatuses.indexOf(status);
            return statusIndex <= currentIndex;
        };

        // Compute if status can be updated
        const canUpdateStatus = computed(() => {
            if (!order.value?.status) return false;
            const currentStatus = order.value.status;
            const currentIndex = availableStatuses.indexOf(currentStatus);
            return currentIndex < availableStatuses.length - 1 && currentStatus !== 'Cancelled' && currentStatus !== 'Delivered';
        });

        const calculateSubtotal = computed(() => {
            if (!order.value?.products) return 0;
            return order.value.products.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);
        });

        const hasDiscount = computed(() => {
            return calculateSubtotal.value > order.value?.total;
        });

        const discountAmount = computed(() => {
            if (!hasDiscount.value) return 0;
            return calculateSubtotal.value - order.value?.total;
        });

        // Load order data
        const loadOrder = async () => {
            try {
                isLoading.value = true;
                // Get all seller orders
                const allOrders = await sellerStore.fetchAllSellerOrders();

                // Find the specific order
                const orderData = Array.isArray(allOrders) ?
                    allOrders.find(o => o._id === orderId) : null;

                if (orderData) {
                    // Map products correctly
                    const mappedProducts = Array.isArray(orderData.products) ?
                        orderData.products.map(prod => ({
                            id: prod.product?._id || prod.id,
                            name: prod.product?.name || 'Product',
                            quantity: prod.quantity || 0,
                            price: prod.price || 0
                        })) : [];

                    order.value = {
                        id: orderData.orderNumber || orderData._id?.substring(orderData._id.length - 6).toUpperCase(),
                        _id: orderData._id,
                        customer: {
                            name: orderData.user?.username || orderData.user?.name || orderData.customerName || 'N/A',
                            email: orderData.user?.email || orderData.customerEmail || 'N/A'
                        },
                        date: orderData.createdAt || orderData.date,
                        status: orderData.status || 'Pending',
                        total: orderData.totalAmount || orderData.total || 0,
                        products: mappedProducts
                    };
                } else {
                    toast.error('Order not found');
                    router.back();
                }
            } catch (error) {
                console.error('Error loading order:', error);
                toast.error('Failed to load order details');
            } finally {
                isLoading.value = false;
            }
        };


        // Refresh order data
        const refreshOrder = async () => {
            try {
                await loadOrder();
                toast.success('Order details refreshed');
            } catch (error) {
                toast.error('Failed to refresh order details');
            }
        };

        // Update order status
        const updateOrderStatus = async () => {
            try {
                if (!order.value?._id) return;

                const currentIndex = availableStatuses.indexOf(order.value.status);
                const nextStatus = availableStatuses[currentIndex + 1];

                if (!nextStatus) {
                    toast.info('No next status available');
                    return;
                }

                // If moving from cancelled to pending, show confirmation
                if (order.value.status.toLowerCase() === 'cancelled') {
                    if (!window.confirm('Are you sure you want to reactivate this cancelled order?')) {
                        return;
                    }
                }

                isLoading.value = true;
                await sellerStore.updateOrderStatus(order.value._id, nextStatus);
                await loadOrder();

                const message = order.value.status.toLowerCase() === 'cancelled'
                    ? `Order reactivated and set to ${nextStatus}`
                    : `Order status updated to ${nextStatus}`;

                toast.success(message);
            } catch (error) {
                console.error('Error updating order status:', error);
                toast.error('Failed to update order status');
            } finally {
                isLoading.value = false;
            }
        };

        // Load initial data
        onMounted(loadOrder);

        return {
            router,
            isLoading,
            order,
            orderId,
            availableStatuses,
            getStatusClass,
            formatDate,
            formatAmount,
            refreshOrder,
            updateOrderStatus,
            isStatusCompleted,
            canUpdateStatus,
            calculateSubtotal,
            hasDiscount,
            discountAmount

        };
    }
};
</script>
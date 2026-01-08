<template>
    <div class="space-y-6">
        <!-- Enhanced Header with Modern Design -->
        <div v-if="!showReturnForm"
            class="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex items-center gap-4">
                    <div
                        class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <RotateCcw class="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">My Returns</h2>
                        <p class="text-sm text-gray-600">
                            {{ returns.length ? `${returns.length} return request${returns.length > 1 ? 's' : ''} found`
                                : 'No returns found' }}
                        </p>
                    </div>
                </div>
                <button @click="showReturnForm = true"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <Plus class="w-5 h-5" />
                    Request Return
                </button>
            </div>
        </div>

        <!-- Enhanced Return Request Form Modal -->
        <div v-if="showReturnForm"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
                <!-- Modal Header with Gradient -->
                <div class="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <RotateCcw class="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">Request a Return</h3>
                                <p class="text-amber-100 text-sm mt-1">Submit your return request quickly and easily</p>
                            </div>
                        </div>
                        <button @click="showReturnForm = false"
                            class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <X class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form @submit.prevent="submitReturnRequest" class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <!-- Order Selection Section -->
                    <div class="space-y-6">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Package class="w-4 h-4 text-white" />
                            </div>
                            <h4 class="text-lg font-semibold text-gray-900">Select Order to Return</h4>
                        </div>

                        <!-- Orders List with Modern Cards -->
                        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            <div v-if="!eligibleOrders.length"
                                class="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
                                <div
                                    class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package class="w-8 h-8 text-gray-400" />
                                </div>
                                <p class="text-lg font-medium text-gray-700 mb-2">No eligible orders found</p>
                                <p class="text-sm text-gray-500">Only delivered orders within the last 30 days are
                                    eligible for return</p>
                            </div>

                            <div v-for="order in eligibleOrders" :key="order._id"
                                class="group border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
                                :class="{
                                    'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg scale-[1.02]': returnForm.orderId === order._id,
                                    'border-gray-200 hover:border-gray-300 hover:bg-gray-50': returnForm.orderId !== order._id
                                }" @click="selectOrder(order)">

                                <!-- Order Header with Enhanced Design -->
                                <div class="flex justify-between items-start mb-6">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                            <Hash class="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p class="text-lg font-bold text-gray-900">Order #{{ order.orderId }}</p>
                                            <p class="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar class="w-4 h-4" />
                                                {{ formatDate(order.createdAt) }}
                                            </p>
                                        </div>
                                    </div>
                                    <span :class="getStatusClass(order.status)"
                                        class="px-3 py-1 text-sm font-medium rounded-full shadow-sm">
                                        {{ order.status }}
                                    </span>
                                </div>

                                <!-- Order Products with Modern Layout -->
                                <div class="space-y-4">
                                    <div v-for="product in order.products" :key="product._id"
                                        class="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <!-- Product Image with Modern Styling -->
                                        <div
                                            class="w-20 h-20 border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-shadow">
                                            <img :src="product.product?.images?.[0] || '/placeholder-image.jpg'"
                                                :alt="product.product?.name"
                                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                        </div>

                                        <!-- Product Details with Enhanced Typography -->
                                        <div class="flex-1">
                                            <h5 class="text-base font-semibold text-gray-900 mb-2 leading-tight">
                                                {{ product.product?.name || 'Unknown Product' }}
                                            </h5>
                                            <div class="grid grid-cols-2 gap-4 text-sm">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span class="text-gray-600">Qty:</span>
                                                    <span class="font-semibold text-gray-900">{{ product.quantity
                                                    }}</span>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span class="text-gray-600">Price:</span>
                                                    <span class="font-semibold text-gray-900">₦{{
                                                        formatAmount(product.product?.price || 0) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Order Total with Modern Design -->
                                <div class="mt-6 pt-4 border-t border-gray-200">
                                    <div
                                        class="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                                        <span class="text-lg font-medium text-gray-700">Total Amount:</span>
                                        <span class="text-xl font-bold text-gray-900">₦{{
                                            formatAmount(order.totalAmount) }}</span>
                                    </div>
                                </div>

                                <!-- Selection Indicator -->
                                <div v-if="returnForm.orderId === order._id"
                                    class="mt-4 flex items-center justify-center gap-2 text-amber-600 font-medium">
                                    <CheckCircle class="w-5 h-5" />
                                    <span>Selected for return</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Return Details Section (shown after order selection) -->
                    <div v-if="returnForm.orderId" class="mt-8 space-y-6">
                        <div class="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        <div class="flex items-center gap-3">
                            <div
                                class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <FileText class="w-4 h-4 text-white" />
                            </div>
                            <h4 class="text-lg font-semibold text-gray-900">Return Details</h4>
                        </div>

                        <!-- Reason Selection with Modern Design -->
                        <div class="space-y-3">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <AlertCircle class="w-4 h-4 text-amber-500" />
                                Reason for Return
                            </label>
                            <select v-model="returnForm.reason"
                                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white shadow-sm"
                                required>
                                <option value="">Select a reason for your return</option>
                                <option value="defective">🔧 Product is defective/damaged</option>
                                <option value="wrong_item">📦 Received wrong item</option>
                                <option value="not_as_described">📝 Item not as described</option>
                                <option value="size_issue">📏 Size/fit issue</option>
                                <option value="changed_mind">💭 Changed my mind</option>
                            </select>
                        </div>

                        <!-- Additional Comments with Enhanced Design -->
                        <div class="space-y-3">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <MessageSquare class="w-4 h-4 text-blue-500" />
                                Additional Comments
                            </label>
                            <textarea v-model="returnForm.comments" rows="4"
                                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white shadow-sm resize-none"
                                placeholder="Please provide any additional details about your return request (optional)"></textarea>
                            <p class="text-xs text-gray-500 flex items-center gap-1">
                                <Info class="w-3 h-3" />
                                Providing detailed information helps us process your return faster
                            </p>
                        </div>
                    </div>

                    <!-- Form Actions with Modern Buttons -->
                    <div class="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                        <button type="button" @click="showReturnForm = false"
                            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200 transform hover:scale-105">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                            :disabled="isSubmitting || !returnForm.orderId || !returnForm.reason">
                            <span v-if="isSubmitting" class="flex items-center gap-2">
                                <div
                                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                                </div>
                                Submitting...
                            </span>
                            <span v-else class="flex items-center gap-2">
                                <Send class="w-4 h-4" />
                                Submit Return Request
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Enhanced Returns List -->
        <div v-if="returns.length" class="space-y-6">
            <div v-for="returnRequest in returns" :key="returnRequest._id"
                class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">

                <!-- Return Header with Modern Design -->
                <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <RotateCcw class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p class="text-xl font-bold text-gray-900">Return #{{ returnRequest.returnId }}</p>
                                <p class="text-sm text-gray-600 flex items-center gap-1">
                                    <Package class="w-4 h-4" />
                                    Order #{{ returnRequest.orderId }}
                                </p>
                            </div>
                        </div>
                        <span :class="getReturnStatusClass(returnRequest.status)"
                            class="px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                            {{ returnRequest.status }}
                        </span>
                    </div>
                </div>

                <!-- Enhanced Return Timeline -->
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-6">
                        <div
                            class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <Clock class="w-4 h-4 text-white" />
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900">Return Timeline</h4>
                    </div>

                    <div class="space-y-4">
                        <div v-for="(status, index) in returnRequest.statusHistory" :key="index" class="flex gap-4">
                            <!-- Timeline Node -->
                            <div class="relative flex flex-col items-center">
                                <div class="w-4 h-4 rounded-full shadow-sm"
                                    :class="index === 0 ? 'bg-green-500' : 'bg-blue-500'">
                                </div>
                                <div v-if="index !== returnRequest.statusHistory.length - 1"
                                    class="absolute top-4 bottom-0 left-2 w-px bg-gray-200"></div>
                            </div>

                            <!-- Timeline Content -->
                            <div class="flex-1 pb-6">
                                <div
                                    class="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50">
                                    <p class="text-lg font-semibold text-gray-900 mb-1">{{ status.status }}</p>
                                    <p class="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                        <Calendar class="w-4 h-4" />
                                        {{ formatDate(status.timestamp) }}
                                    </p>
                                    <p v-if="status.comment"
                                        class="text-sm text-gray-700 mt-2 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                        {{ status.comment }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State for No Returns -->
        <div v-if="!returns.length && !showReturnForm"
            class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div
                class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <RotateCcw class="w-10 h-10 text-gray-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Returns Yet</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't made any return requests. If you need to return an item, you can easily request one.
            </p>
            <button @click="showReturnForm = true"
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                <Plus class="w-5 h-5" />
                Request Your First Return
            </button>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useUserStore } from '../store/user';
import {
    X, RotateCcw, Plus, Package, Hash, Calendar, CheckCircle,
    FileText, AlertCircle, MessageSquare, Info, Send, Clock
} from 'lucide-vue-next';

export default {
    name: 'ProfileReturnCard',
    components: {
        X, RotateCcw, Plus, Package, Hash, Calendar, CheckCircle,
        FileText, AlertCircle, MessageSquare, Info, Send, Clock
    },

    setup() {
        const userStore = useUserStore();
        const user = computed(() => userStore.user);

        const showReturnForm = ref(false);
        const isSubmitting = ref(false);
        const returns = ref([]); // This would come from your API

        const returnForm = ref({
            orderId: '',
            reason: '',
            comments: ''
        });

        const eligibleOrders = computed(() => {
            // Filter orders that are eligible for return (e.g., delivered within last 30 days)
            return user.value?.orders?.filter(order => {
                if (order.status !== 'Delivered') return false;
                const deliveryDate = new Date(order.deliveredAt || order.updatedAt);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return deliveryDate >= thirtyDaysAgo;
            }) || [];
        });

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        const formatAmount = (amount) => {
            return amount.toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        const getStatusClass = (status) => {
            const classes = {
                'Pending': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200',
                'Processing': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200',
                'Shipped': 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200',
                'Delivered': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
                'Cancelled': 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
            };
            return classes[status] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        };

        const getReturnStatusClass = (status) => {
            const classes = {
                'Pending': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200',
                'Approved': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
                'Processing': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200',
                'Completed': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
                'Rejected': 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
            };
            return classes[status] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
        };

        const selectOrder = (order) => {
            returnForm.value.orderId = order._id;
        };

        const submitReturnRequest = async () => {
            if (!returnForm.value.orderId || !returnForm.value.reason) return;

            try {
                isSubmitting.value = true;
                // Add your API call here
                // await returnStore.createReturn(returnForm.value);

                showReturnForm.value = false;
                returnForm.value = {
                    orderId: '',
                    reason: '',
                    comments: ''
                };
            } catch (error) {
                console.error('Error submitting return request:', error);
            } finally {
                isSubmitting.value = false;
            }
        };

        return {
            user,
            showReturnForm,
            returnForm,
            returns,
            isSubmitting,
            eligibleOrders,
            formatDate,
            formatAmount,
            getStatusClass,
            getReturnStatusClass,
            selectOrder,
            submitReturnRequest
        };
    }
};
</script>

<style scoped>
/* Enhanced custom scrollbar */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #fbbf24 #f9fafb;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f9fafb;
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #fbbf24, #f59e0b);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #f59e0b, #d97706);
}

/* Smooth animations */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Disable hover effects on mobile */
@media (max-width: 768px) {
    .transform {
        transform: none !important;
    }

    .hover\:scale-105:hover {
        transform: none !important;
    }

    .hover\:scale-\[1\.02\]:hover {
        transform: none !important;
    }
}
</style>
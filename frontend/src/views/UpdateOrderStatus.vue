<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-2 sm:p-4"
        @click="$emit('close')">
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full mx-2 sm:mx-4 flex flex-col overflow-hidden max-h-[95vh]"
            @click.stop>

            <!-- Enhanced Header -->
            <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6 lg:p-8 text-white">
                <div class="flex justify-between items-start sm:items-center gap-3">
                    <div class="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div
                            class="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                            <RefreshCw class="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <h2 class="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1">Update Order Status</h2>
                            <p class="text-purple-100 text-sm sm:text-base">Change the current status of this order</p>
                        </div>
                    </div>
                    <button @click="$emit('close')"
                        class="flex-shrink-0 p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors">
                        <X class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
                <!-- Current Status Display -->
                <div class="mb-6 sm:mb-8">
                    <div
                        class="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <Package class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Current Status</p>
                                <p class="text-lg sm:text-xl font-bold text-gray-900">{{ order.status }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Status Selection -->
                <div class="mb-6 sm:mb-8">
                    <label class="block text-sm font-bold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                        <div class="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Edit class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                        Select New Status
                    </label>

                    <div class="relative">
                        <select v-model="newStatus"
                            class="w-full appearance-none bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm">
                            <option v-for="status in orderStatuses" :key="status" :value="status"
                                :class="getStatusOptionClass(status)">
                                {{ getStatusEmoji(status) }} {{ status }}
                            </option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 sm:px-4">
                            <ChevronDown class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Status Preview -->
                <div v-if="newStatus !== order.status" class="mb-6 sm:mb-8">
                    <div
                        class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-200">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-xs sm:text-sm font-medium text-green-700 mb-1">New Status Preview</p>
                                <div class="flex items-center gap-2">
                                    <span class="text-base sm:text-lg font-bold text-green-900">{{
                                        getStatusEmoji(newStatus) }} {{ newStatus }}</span>
                                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Change Summary -->
                <div v-if="newStatus !== order.status" class="mb-6 sm:mb-8">
                    <div class="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                        <h4 class="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                            <Info class="w-3 h-3 sm:w-4 sm:h-4" />
                            Status Change Summary
                        </h4>
                        <div class="flex items-center justify-between text-xs sm:text-sm">
                            <span class="text-blue-700 truncate flex-1">{{ order.status }}</span>
                            <ArrowRight class="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mx-2 flex-shrink-0" />
                            <span class="text-blue-900 font-semibold truncate flex-1 text-right">{{ newStatus }}</span>
                        </div>
                        <p class="text-xs text-blue-600 mt-2">This change will be immediately visible to the customer
                        </p>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="p-4 sm:p-6 lg:p-8 border-t border-gray-200 bg-gray-50">
                <div class="flex flex-col gap-3">
                    <button @click="updateStatus" :disabled="newStatus === order.status"
                        class="w-full inline-flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                        <RefreshCw class="w-4 h-4 sm:w-5 sm:h-5" />
                        {{ newStatus === order.status ? 'No Changes to Update' : 'Update Order Status' }}
                    </button>

                    <button @click="$emit('close')"
                        class="w-full inline-flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-lg sm:rounded-xl font-semibold hover:from-gray-300 hover:to-gray-400 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                        <X class="w-4 h-4 sm:w-5 sm:h-5" />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import { useOrderStore } from '../store/orderStore';
import { useSellerStore } from '../store/sellerStore';
import { useUserStore } from '../store/user';
import { toast } from 'vue-sonner';
import {
    RefreshCw, X, Package, Edit, ChevronDown, ArrowRight, Info
} from 'lucide-vue-next';

export default {
    name: 'UpdateOrderStatus',
    components: {
        RefreshCw, X, Package, Edit, ChevronDown, ArrowRight, Info
    },
    props: {
        order: {
            type: Object,
            required: true
        }
    },
    emits: ['close', 'update'],
    setup(props, { emit }) {
        const orderStore = useOrderStore();
        const sellerStore = useSellerStore();
        const userStore = useUserStore();
        const newStatus = ref(props.order.status);
        const orderStatuses = ref([]);

        onMounted(async () => {
            try {
                await userStore.checkTokenExpiration();
                orderStatuses.value = await orderStore.fetchOrderStatuses();
            } catch (error) {
                console.error('Failed to fetch order statuses:', error);
                toast.error("Failed to load order statuses. Please try again.");
            }
        });

        const updateStatus = async () => {
            console.log('Order in updateStatus:', props.order);
            let orderId;
            if (typeof props.order === 'string') {
                orderId = props.order;
            } else if (props.order && props.order._id) {
                orderId = props.order._id;
            } else {
                console.error('Invalid order data:', props.order);
                toast.error("Unable to update order status. Invalid order data.");
                return;
            }

            if (newStatus.value !== (typeof props.order === 'string' ? props.order : props.order.status)) {
                try {
                    await userStore.checkTokenExpiration();
                    console.log('Updating order status for ID:', orderId);
                    await sellerStore.updateOrderStatus(orderId, newStatus.value);
                    toast.success("Order status updated successfully! 🎉");
                    emit('update', orderId, newStatus.value);
                    emit('close');
                } catch (error) {
                    console.error('Failed to update order status:', error);
                    if (error.message === 'Session expired. Please log in again.') {
                        userStore.logoutUser();
                    } else {
                        toast.error("Failed to update order status. Please try again.");
                    }
                }
            } else {
                emit('close');
            }
        };

        const getStatusEmoji = (status) => {
            const emojis = {
                'Pending': '⏳',
                'Processing': '⚙️',
                'Shipped': '🚚',
                'Delivered': '✅',
                'Cancelled': '❌'
            };
            return emojis[status] || '📦';
        };

        const getStatusOptionClass = (status) => {
            const classes = {
                'Pending': 'text-yellow-700',
                'Processing': 'text-blue-700',
                'Shipped': 'text-indigo-700',
                'Delivered': 'text-green-700',
                'Cancelled': 'text-red-700'
            };
            return classes[status] || 'text-gray-700';
        };

        return {
            newStatus,
            updateStatus,
            orderStatuses,
            getStatusEmoji,
            getStatusOptionClass
        };
    }
};
</script>

<style scoped>
/* Enhanced animations and transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile-first approach: Disable hover effects and transforms on mobile */
@media (max-width: 768px) {

    .transform,
    .hover\:scale-105:hover {
        transform: none !important;
        transition: none !important;
    }

    /* Better touch targets for mobile */
    button {
        min-height: 44px;
    }

    /* Prevent zoom on input focus for iOS */
    select {
        font-size: 16px;
    }

    /* Reduce motion for better mobile performance */
    * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
    }
}

/* Custom gradient backgrounds */
.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Modal backdrop blur effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Custom shadow effects - Mobile optimized */
.shadow-2xl {
    box-shadow: 0 15px 30px -6px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
    .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
}

/* Enhanced focus states */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Focus states for accessibility */
button:focus,
select:focus {
    outline: 2px solid #8B5CF6;
    outline-offset: 2px;
}

/* Dropdown styling */
select {
    background-image: none;
}

select:focus {
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

/* Status option styling */
option {
    padding: 8px 12px;
    font-weight: 600;
}

@media (min-width: 768px) {
    option {
        padding: 12px;
    }
}

/* Button hover effects - Desktop only */
@media (min-width: 769px) {
    button:hover {
        transition: all 0.2s ease-in-out;
        transform: scale(1.05);
    }

    .hover\:scale-105:hover {
        transform: scale(1.05);
    }
}

button:disabled {
    transform: none !important;
}

/* Pulse animation for status indicator */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Status preview animation - Desktop only */
@media (min-width: 769px) {
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .status-preview {
        animation: slideIn 0.3s ease-out;
    }
}

/* Custom scrollbar - Mobile optimized */
::-webkit-scrollbar {
    width: 4px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar {
        width: 6px;
    }
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #8b5cf6, #6366f1);
    border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #7c3aed, #4f46e5);
}

/* Responsive text handling */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Modal positioning improvements for mobile */
@media (max-width: 640px) {
    .max-h-\[95vh\] {
        max-height: 95vh;
    }

    /* Better spacing for small screens */
    .space-y-6>*+* {
        margin-top: 1rem;
    }

    .space-y-8>*+* {
        margin-top: 1.5rem;
    }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .border-gray-200 {
        border-color: #000000;
    }

    .text-gray-600 {
        color: #000000;
    }

    .bg-gray-50 {
        background-color: #ffffff;
    }
}

/* Better selection styles */
::selection {
    background-color: #8B5CF6;
    color: #ffffff;
}

::-moz-selection {
    background-color: #8B5CF6;
    color: #ffffff;
}
</style>
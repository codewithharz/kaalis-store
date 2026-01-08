<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-2 sm:p-4"
        @click="$emit('close')">
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full mx-2 sm:mx-4 flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            @click.stop>

            <!-- Enhanced Header -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6 lg:p-8 text-white">
                <div class="flex justify-between items-start sm:items-center gap-3">
                    <div class="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div
                            class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                            <Package class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Order Details</h2>
                            <p class="text-blue-100 text-sm sm:text-base hidden sm:block">Complete order information and
                                management</p>
                            <p class="text-blue-100 text-xs sm:hidden">Order information</p>
                        </div>
                    </div>
                    <button @click="$emit('close')"
                        class="flex-shrink-0 p-2 sm:p-3 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors">
                        <X class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                </div>

                <!-- Order Summary Bar -->
                <div
                    class="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/20">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div
                                class="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Hash class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-lg sm:text-xl font-bold text-white truncate">Order #{{ order.orderNumber
                                }}</p>
                                <p class="text-blue-100 text-xs sm:text-sm">{{ formatDate(order.date) }}</p>
                            </div>
                        </div>
                        <span
                            :class="`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 border border-${getStatusColor(order.status)}-200 flex-shrink-0`">
                            {{ order.status }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">

                    <!-- Enhanced Order Details Card -->
                    <div
                        class="bg-gradient-to-br from-white to-blue-50 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <div
                                class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <FileText class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span class="text-sm sm:text-base">Order Information</span>
                        </h3>

                        <div class="space-y-3 sm:space-y-4">
                            <div class="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                                <div
                                    class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-2">
                                    <span class="text-gray-600 font-medium text-sm sm:text-base">Total Amount:</span>
                                    <span class="text-xl sm:text-2xl font-bold text-green-600">₦{{
                                        formatCurrency(order.total) }}</span>
                                </div>
                                <p class="text-xs sm:text-sm text-gray-500 italic break-words">{{
                                    numberToWords(order.total) }}</p>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div
                                    class="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                                    <div class="flex items-center gap-2 mb-2">
                                        <Calendar class="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                        <span class="text-gray-600 font-medium text-sm sm:text-base">Order Date:</span>
                                    </div>
                                    <p class="text-gray-900 font-semibold text-sm sm:text-base break-words">{{
                                        formatDate(order.date) }}</p>
                                </div>

                                <div
                                    class="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                                    <div class="flex items-center gap-2 mb-2">
                                        <CreditCard class="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                        <span class="text-gray-600 font-medium text-sm sm:text-base">Payment:</span>
                                    </div>
                                    <p class="text-gray-900 font-semibold text-sm sm:text-base break-words">{{
                                        order.paymentMethod }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Customer Card -->
                    <div
                        class="bg-gradient-to-br from-white to-green-50 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <div
                                class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <User class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span class="text-sm sm:text-base">Customer Information</span>
                        </h3>

                        <div class="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                            <div class="space-y-2 sm:space-y-3">
                                <div>
                                    <p class="text-base sm:text-lg font-bold text-gray-900 break-words">{{
                                        order.customerName }}</p>
                                </div>
                                <div class="flex items-start gap-2 text-gray-600">
                                    <Mail class="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                                    <span class="text-xs sm:text-sm break-all">{{ order.customerEmail }}</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-600">
                                    <Phone class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span class="text-xs sm:text-sm">{{ order.customerPhone }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Shipping Address Card -->
                    <div
                        class="bg-gradient-to-br from-white to-purple-50 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <div
                                class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <MapPin class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span class="text-sm sm:text-base">Shipping Address</span>
                        </h3>

                        <div class="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                            <div class="space-y-1 sm:space-y-2">
                                <p class="font-semibold text-gray-900 text-sm sm:text-base break-words">{{
                                    order.address.street }}</p>
                                <p class="text-gray-600 text-xs sm:text-sm break-words">{{ order.address.city }}, {{
                                    order.address.state }} {{ order.address.postalCode }}</p>
                                <p class="text-gray-600 text-xs sm:text-sm">{{ order.address.country }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Products Card -->
                    <div
                        class="bg-gradient-to-br from-white to-orange-50 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <div
                                class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <ShoppingBag class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span class="text-sm sm:text-base">Products ({{ order.products?.length || 0 }})</span>
                        </h3>

                        <div class="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                            <div v-if="order.products && order.products.length > 0">
                                <div v-for="product in order.products" :key="product.name"
                                    class="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div
                                        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                                        <div class="min-w-0 flex-1">
                                            <p class="font-semibold text-gray-900 text-sm sm:text-base break-words">{{
                                                product.name }}</p>
                                            <p class="text-xs sm:text-sm text-gray-600">Quantity: {{ product.quantity }}
                                            </p>
                                        </div>
                                        <div class="text-left sm:text-right flex-shrink-0">
                                            <p class="text-base sm:text-lg font-bold text-green-600">₦{{
                                                formatCurrency(product.subtotal) }}</p>
                                            <p class="text-xs text-gray-500">per item: ₦{{
                                                formatCurrency(product.subtotal / product.quantity) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center py-6 sm:py-8">
                                <div
                                    class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                    <ShoppingBag class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                </div>
                                <p class="text-gray-500 text-sm sm:text-base">No product information available</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Timeline Section -->
                <div class="mb-6 sm:mb-8">
                    <div
                        class="bg-gradient-to-r from-white to-gray-50 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <div
                                class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <Clock class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span class="text-sm sm:text-base">Order Timeline</span>
                        </h3>

                        <div class="relative">
                            <div class="absolute left-3 sm:left-4 top-6 sm:top-8 bottom-0 w-px bg-gray-200"></div>
                            <div class="space-y-4 sm:space-y-6">
                                <div class="flex items-start gap-3 sm:gap-4">
                                    <div
                                        class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg relative z-10 flex-shrink-0">
                                        <Package class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    <div
                                        class="flex-1 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 min-w-0">
                                        <p class="font-semibold text-blue-900 text-sm sm:text-base">Order Placed</p>
                                        <p class="text-xs sm:text-sm text-blue-700 break-words">{{
                                            formatDate(order.date) }}</p>
                                    </div>
                                </div>

                                <div class="flex items-start gap-3 sm:gap-4"
                                    :class="{ 'opacity-50': order.status === 'Pending' }">
                                    <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg relative z-10 flex-shrink-0"
                                        :class="order.status !== 'Pending' ? 'bg-green-500' : 'bg-gray-300'">
                                        <Check class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    <div class="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl border min-w-0"
                                        :class="order.status !== 'Pending' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'">
                                        <p class="font-semibold text-sm sm:text-base"
                                            :class="order.status !== 'Pending' ? 'text-green-900' : 'text-gray-600'">
                                            Processing
                                        </p>
                                        <p class="text-xs sm:text-sm"
                                            :class="order.status !== 'Pending' ? 'text-green-700' : 'text-gray-500'">
                                            Order being prepared
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Action Buttons -->
            <div class="p-4 sm:p-6 lg:p-8 border-t border-gray-200 bg-gray-50">
                <div class="flex flex-col gap-3 sm:gap-4">
                    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button @click="openUpdateStatusModal"
                            class="flex-1 inline-flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                            <RefreshCw class="w-4 h-4 sm:w-5 sm:h-5" />
                            Update Status
                        </button>

                        <button @click="manageShipment"
                            class="flex-1 inline-flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                            <Truck class="w-4 h-4 sm:w-5 sm:h-5" />
                            Manage Shipment
                        </button>
                    </div>

                    <button @click="$emit('close')"
                        class="w-full inline-flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-lg sm:rounded-xl font-semibold hover:from-gray-300 hover:to-gray-400 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                        <X class="w-4 h-4 sm:w-5 sm:h-5" />
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useSellerStore } from '../store/sellerStore';
import {
    Package, X, Hash, FileText, Calendar, CreditCard, User, Mail, Phone,
    MapPin, ShoppingBag, Clock, Check, RefreshCw, Truck
} from 'lucide-vue-next';

export default {
    name: 'OrderDetails',
    components: {
        Package, X, Hash, FileText, Calendar, CreditCard, User, Mail, Phone,
        MapPin, ShoppingBag, Clock, Check, RefreshCw, Truck
    },
    props: ['order'],
    emits: ['close', 'open-update-status-modal'],
    setup(props, { emit }) {
        const sellerStore = useSellerStore();

        const openUpdateStatusModal = () => {
            if (props.order && props.order._id) {
                emit('open-update-status-modal', props.order._id);
            } else {
                console.error('Order ID is undefined');
                // You could add toast notification here if available
                // toast.error("Unable to update order status. Order information is missing.");
            }
        };

        const manageShipment = () => {
            console.log('Managing shipment for order:', props.order._id);
            // Add shipment management logic here
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
        };

        const formatCurrency = (amount) => {
            return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        };

        const getStatusColor = (status) => {
            const colors = {
                'Pending': 'yellow',
                'Shipped': 'blue',
                'Delivered': 'green',
                'Cancelled': 'red'
            };
            return colors[status] || 'gray';
        };

        function numberToWords(num) {
            if (num === 0) return "Zero Naira";

            num = Math.round(num);

            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

            function convertGroup(n) {
                let result = '';
                if (n >= 100) {
                    result += ones[Math.floor(n / 100)] + ' Hundred';
                    n %= 100;
                    if (n > 0) result += ' and ';
                }
                if (n >= 20) {
                    result += tens[Math.floor(n / 10)];
                    if (n % 10 > 0) result += '-' + ones[n % 10];
                } else if (n >= 10) {
                    result += teens[n - 10];
                } else if (n > 0) {
                    result += ones[n];
                }
                return result;
            }

            let result = '';
            let scaleIndex = 0;

            while (num > 0) {
                if (num % 1000 !== 0) {
                    let groupResult = convertGroup(num % 1000);
                    if (scaleIndex > 0) groupResult += ' ' + scales[scaleIndex];
                    if (result) groupResult += ', ' + result;
                    result = groupResult;
                }
                num = Math.floor(num / 1000);
                scaleIndex++;
            }

            return result + ' Naira';
        }

        return {
            openUpdateStatusModal,
            manageShipment,
            formatDate,
            formatCurrency,
            getStatusColor,
            numberToWords
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
    select,
    input {
        font-size: 16px;
    }

    /* Reduce motion for better mobile performance */
    * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
    }
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Enhanced scrollbar for products list - Mobile optimized */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
    /* Thinner on mobile */
}

@media (min-width: 768px) {
    .overflow-y-auto::-webkit-scrollbar {
        width: 6px;
        /* Slightly wider on desktop */
    }
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f7fafc;
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #1d4ed8, #1e40af);
}

/* Modal backdrop blur effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Custom shadow effects - Responsive */
.shadow-2xl {
    box-shadow: 0 15px 30px -6px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
    .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
}

/* Enhanced focus states for accessibility */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Focus states for better accessibility */
button:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
}

/* Timeline animation - Desktop only */
@media (min-width: 769px) {
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeInUp {
        animation: fadeInUp 0.3s ease-out;
    }
}

/* Button hover effects - Desktop only */
@media (min-width: 769px) {
    button:hover {
        transition: all 0.2s ease-in-out;
        transform: translateY(-1px);
    }

    .hover\:scale-105:hover {
        transform: scale(1.05);
    }
}

button:disabled {
    transform: none !important;
}

/* Status badge styling */
.status-badge {
    position: relative;
    overflow: hidden;
}

/* Card hover effects - Desktop only */
@media (min-width: 769px) {
    .card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
}

/* Mobile-specific improvements */
@media (max-width: 640px) {

    /* Better spacing for small screens */
    .space-y-6>*+* {
        margin-top: 1rem;
    }

    .space-y-4>*+* {
        margin-top: 0.75rem;
    }

    /* Ensure proper container spacing */
    .max-h-\[95vh\] {
        max-height: 95vh;
    }

    /* Better mobile scrolling */
    .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
    }

    /* Prevent horizontal overflow */
    .min-w-0 {
        min-width: 0;
    }

    /* Better text wrapping */
    .break-words {
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
    }

    .break-all {
        word-break: break-all;
    }
}

/* Responsive text sizing */
@media (max-width: 640px) {
    .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }

    .text-2xl {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }

    .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}

/* Print styles */
@media print {

    .shadow-xl,
    .shadow-2xl {
        box-shadow: none !important;
    }

    .bg-gradient-to-br,
    .bg-gradient-to-r {
        background: #ffffff !important;
    }

    .text-white {
        color: #000000 !important;
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

/* Dark mode support preparation */
@media (prefers-color-scheme: dark) {
    /* You can add dark mode styles here if needed */
}

/* Better selection styles */
::selection {
    background-color: #3B82F6;
    color: #ffffff;
}

::-moz-selection {
    background-color: #3B82F6;
    color: #ffffff;
}

/* Ensure proper stacking context */
.relative {
    position: relative;
    z-index: 1;
}

/* Better mobile modal positioning */
@media (max-width: 640px) {
    .fixed.inset-0 {
        padding: 0.5rem;
    }

    /* Improved card layouts for mobile */
    .grid {
        gap: 1rem;
    }

    .rounded-2xl {
        border-radius: 0.75rem;
    }

    .p-6 {
        padding: 1rem;
    }

    .p-8 {
        padding: 1.5rem;
    }

    /* Better button spacing */
    .gap-4 {
        gap: 0.75rem;
    }

    .gap-3 {
        gap: 0.5rem;
    }
}

/* Timeline improvements for mobile */
@media (max-width: 640px) {
    .absolute.left-3 {
        left: 0.75rem;
    }

    .gap-3 {
        gap: 0.75rem;
    }
}

/* Better mobile touch interactions */
@media (max-width: 768px) {

    /* Larger touch targets */
    button {
        min-height: 44px;
        min-width: 44px;
    }

    /* Better tap highlighting */
    button,
    .clickable {
        -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
    }

    /* Prevent text selection on interactive elements */
    button {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
}

/* Improved accessibility */
@media (max-width: 768px) {

    /* Better focus indicators for mobile */
    button:focus,
    select:focus {
        outline: 3px solid #3B82F6;
        outline-offset: 2px;
    }

    /* Ensure readable font sizes */
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
}

/* Custom modal animations for mobile */
@media (max-width: 768px) {
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }

        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-enter {
        animation: slideUp 0.3s ease-out;
    }
}

/* Optimized scrolling behavior */
.overflow-y-auto {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Mobile-specific grid improvements */
@media (max-width: 1024px) {
    .lg\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}

/* Better mobile spacing utilities */
@media (max-width: 640px) {
    .sm\:space-y-0>*+* {
        margin-top: 0 !important;
    }

    .sm\:gap-4 {
        gap: 1rem;
    }

    .sm\:gap-6 {
        gap: 1.5rem;
    }
}

/* Ensure consistent button heights on mobile */
@media (max-width: 640px) {

    .py-3,
    .py-4 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
}

/* Mobile-optimized shadows */
@media (max-width: 768px) {
    .shadow-lg {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .shadow-xl {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
}
</style>

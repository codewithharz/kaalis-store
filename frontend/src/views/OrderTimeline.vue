<template>
    <div class="w-full py-4 sm:py-6">
        <div class="relative">
            <!-- Enhanced Timeline Line with Gradient -->
            <div
                class="absolute left-[20px] sm:left-1/2 h-full w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-gray-200 rounded-full transform -translate-x-1/2 shadow-sm">
            </div>

            <!-- Timeline Items with Modern Design -->
            <div class="flex flex-col space-y-6 sm:space-y-8">
                <div v-for="(status, index) in timelineItems" :key="index"
                    class="flex flex-col sm:flex-row group items-start sm:items-center justify-start sm:justify-between sm:even:flex-row-reverse">

                    <!-- Enhanced Content Cards -->
                    <div class="flex-1 sm:w-[42%] ml-12 sm:ml-0">
                        <div :class="[
                            'p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden',
                            isCompleted(status) ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 shadow-green-100' :
                                isCurrent(status) ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300 shadow-blue-100' :
                                    'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300 shadow-gray-100'
                        ]">
                            <!-- Status Icon Background -->
                            <div :class="[
                                'absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 opacity-10 transform rotate-12 translate-x-3 sm:translate-x-4 -translate-y-3 sm:-translate-y-4',
                                isCompleted(status) ? 'text-green-500' :
                                    isCurrent(status) ? 'text-blue-500' : 'text-gray-400'
                            ]">
                                <Check v-if="isCompleted(status)" class="w-full h-full" />
                                <Clock v-else-if="isCurrent(status)" class="w-full h-full" />
                                <Circle v-else class="w-full h-full" />
                            </div>

                            <!-- Content -->
                            <div class="relative z-10">
                                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                    <div :class="[
                                        'w-2 h-2 sm:w-3 sm:h-3 rounded-full',
                                        isCompleted(status) ? 'bg-green-500' :
                                            isCurrent(status) ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                                    ]"></div>
                                    <h4 :class="[
                                        'font-bold text-base sm:text-lg',
                                        isCompleted(status) ? 'text-green-800' :
                                            isCurrent(status) ? 'text-blue-800' : 'text-gray-700'
                                    ]">{{ status.title }}</h4>
                                </div>

                                <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">{{
                                    status.description }}</p>

                                <div class="flex items-center gap-2">
                                    <div :class="[
                                        'p-1.5 sm:p-2 rounded-md sm:rounded-lg',
                                        isCompleted(status) ? 'bg-green-100' :
                                            isCurrent(status) ? 'bg-blue-100' : 'bg-gray-100'
                                    ]">
                                        <Clock :class="[
                                            'w-3 h-3 sm:w-4 sm:h-4',
                                            isCompleted(status) ? 'text-green-600' :
                                                isCurrent(status) ? 'text-blue-600' : 'text-gray-500'
                                        ]" />
                                    </div>
                                    <span :class="[
                                        'text-xs font-medium px-2 py-1 rounded-full',
                                        isCompleted(status) ? 'bg-green-100 text-green-700' :
                                            isCurrent(status) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                    ]">
                                        {{ formatDate(status.timestamp) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Timeline Point -->
                    <div class="absolute left-0 sm:relative sm:left-auto flex items-center justify-center z-20">
                        <div :class="[
                            'w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110',
                            isCompleted(status) ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 shadow-green-200' :
                                isCurrent(status) ? 'bg-gradient-to-br from-blue-400 to-indigo-500 border-blue-300 shadow-blue-200 animate-pulse' :
                                    'bg-gradient-to-br from-gray-300 to-slate-400 border-gray-200 shadow-gray-200'
                        ]">
                            <Check v-if="isCompleted(status)" class="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                            <Clock v-else-if="isCurrent(status)"
                                class="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                            <Circle v-else class="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                        </div>

                        <!-- Connecting Line to Content (Mobile Only) -->
                        <div class="sm:hidden absolute left-10 w-6 sm:w-8 h-0.5 z-10" :class="[
                            isCompleted(status) ? 'bg-gradient-to-r from-green-400 to-green-200' :
                                isCurrent(status) ? 'bg-gradient-to-r from-blue-400 to-blue-200' :
                                    'bg-gradient-to-r from-gray-300 to-gray-200'
                        ]"></div>
                    </div>

                    <!-- Spacer for even alignment -->
                    <div class="flex-1 sm:w-[42%] hidden sm:block"></div>
                </div>
            </div>
        </div>

        <!-- Enhanced Estimated Delivery Section - Mobile Responsive -->
        <div v-if="estimatedDelivery" class="mt-6 sm:mt-8 relative overflow-hidden">
            <div
                class="p-4 sm:p-6 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-5">
                    <svg class="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                        <pattern id="delivery-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="1" fill="currentColor" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#delivery-pattern)" />
                    </svg>
                </div>

                <div class="relative z-10">
                    <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div
                            class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <Truck class="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                        </div>
                        <div>
                            <span class="text-base sm:text-lg font-bold text-orange-800 block">Estimated Delivery</span>
                            <span class="text-xs sm:text-sm text-orange-600">Package is on the way</span>
                        </div>
                    </div>

                    <div class="bg-white/70 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-orange-200">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                                <span class="text-xs sm:text-sm font-medium text-orange-700">Expected arrival:</span>
                            </div>
                            <span class="text-base sm:text-lg font-bold text-orange-800">
                                {{ formatDate(estimatedDelivery) }}
                            </span>
                        </div>

                        <!-- Progress Bar -->
                        <div class="mt-3 bg-orange-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                            <div :class="[
                                'h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-1000',
                                getProgressWidth()
                            ]"></div>
                        </div>

                        <div class="flex justify-between mt-2 text-xs text-orange-600">
                            <span>Order Placed</span>
                            <span class="text-center">{{ getProgressText() }}</span>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Achievement Badges for Completed Orders - Mobile Responsive -->
        <div v-if="isOrderCompleted" class="mt-4 sm:mt-6 flex justify-center px-2 sm:px-0">
            <div
                class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg text-sm sm:text-base">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">Order Successfully Completed!</span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { Check, Circle, Clock, Truck } from 'lucide-vue-next';

export default {
    name: 'OrderTimeline',
    components: {
        Check,
        Circle,
        Clock,
        Truck
    },
    props: {
        order: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const statusOrder = [
            'Pending',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
        ];

        const getStatusTimestamp = (status) => {
            // In a real app, these would come from order status history
            const timestamps = {
                'Pending': props.order.createdAt,
                'Processing': props.order.updatedAt,
                'Shipped': null,
                'Delivered': null,
                'Cancelled': null
            };
            return timestamps[status] || null;
        };

        const getStatusDescription = (status) => {
            const descriptions = {
                'Pending': 'Your order has been received and is being reviewed by our team. Payment verification in progress.',
                'Processing': 'Order confirmed! Our warehouse team is carefully preparing your items for shipment.',
                'Shipped': 'Great news! Your package is now in transit and on its way to your delivery address.',
                'Delivered': 'Package delivered successfully! We hope you enjoy your purchase. Thank you for choosing us!',
                'Cancelled': 'This order has been cancelled as requested. Refund processing has been initiated.'
            };
            return descriptions[status] || '';
        };

        const timelineItems = computed(() => {
            if (props.order.status === 'Cancelled') {
                return [
                    {
                        title: 'Order Placed',
                        status: 'Pending',
                        description: getStatusDescription('Pending'),
                        timestamp: getStatusTimestamp('Pending')
                    },
                    {
                        title: 'Order Cancelled',
                        status: 'Cancelled',
                        description: getStatusDescription('Cancelled'),
                        timestamp: getStatusTimestamp('Cancelled') || props.order.updatedAt
                    }
                ];
            }

            return statusOrder
                .slice(0, statusOrder.indexOf('Cancelled'))
                .map(status => ({
                    title: status === 'Pending' ? 'Order Placed' : `Order ${status}`,
                    status,
                    description: getStatusDescription(status),
                    timestamp: getStatusTimestamp(status)
                }));
        });

        const estimatedDelivery = computed(() => {
            if (!props.order.createdAt || props.order.status === 'Cancelled') return null;

            // Calculate estimated delivery (3-5 business days from order date)
            const deliveryDate = new Date(props.order.createdAt);
            deliveryDate.setDate(deliveryDate.getDate() + 5);
            return deliveryDate;
        });

        const isCompleted = (item) => {
            const currentIndex = statusOrder.indexOf(props.order.status);
            const itemIndex = statusOrder.indexOf(item.status);
            return itemIndex < currentIndex;
        };

        const isCurrent = (item) => {
            return item.status === props.order.status;
        };

        const isOrderCompleted = computed(() => {
            return props.order.status === 'Delivered';
        });

        const getProgressWidth = () => {
            const currentIndex = statusOrder.indexOf(props.order.status);
            const totalSteps = statusOrder.indexOf('Cancelled'); // Exclude cancelled from progress
            const progressPercentage = Math.min((currentIndex + 1) / totalSteps * 100, 100);
            return `w-[${Math.round(progressPercentage)}%]`;
        };

        const getProgressText = () => {
            const statusMessages = {
                'Pending': 'Confirming...',
                'Processing': 'Preparing...',
                'Shipped': 'In Transit...',
                'Delivered': 'Complete!'
            };
            return statusMessages[props.order.status] || 'Processing...';
        };

        const formatDate = (date) => {
            if (!date) return 'Pending';
            return new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        return {
            timelineItems,
            estimatedDelivery,
            isCompleted,
            isCurrent,
            isOrderCompleted,
            getProgressWidth,
            getProgressText,
            formatDate
        };
    }
};
</script>

<style scoped>
/* Mobile-first responsive design */

/* Base mobile styles */
@media (max-width: 640px) {

    /* Disable hover effects on mobile for better performance */
    .transform {
        transform: none !important;
    }

    .hover\:scale-105:hover,
    .hover\:scale-110:hover {
        transform: none !important;
    }

    /* Better touch targets */
    button,
    select,
    input {
        min-height: 44px;
    }

    /* Prevent horizontal scrolling */
    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
    }

    /* Improved spacing for mobile */
    .ml-12 {
        margin-left: 2.5rem;
    }

    /* Better timeline positioning */
    .absolute.left-0 {
        left: 0;
    }

    .absolute.left-10 {
        left: 2.5rem;
    }

    /* Improved text sizing */
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }
}

/* Tablet styles */
@media (min-width: 641px) and (max-width: 1024px) {

    /* Re-enable some hover effects for tablets */
    .hover\:scale-105:hover {
        transform: scale(1.02) !important;
    }

    .hover\:scale-110:hover {
        transform: scale(1.05) !important;
    }
}

/* Desktop styles */
@media (min-width: 1025px) {

    /* Full hover effects for desktop */
    .hover\:scale-105:hover {
        transform: scale(1.05) !important;
    }

    .hover\:scale-110:hover {
        transform: scale(1.1) !important;
    }
}

/* Custom animations for enhanced visual appeal */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-5px);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Enhanced focus states for accessibility */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for better mobile experience */
::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Loading animation improvements */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

.animate-ping {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-bounce {
    animation: bounce 1s infinite;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}

/* Gradient text support */
.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-b {
    background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

/* Shadow utilities */
.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Better responsive timeline layout */
@media (max-width: 640px) {

    /* Ensure proper spacing for mobile timeline */
    .flex-1.sm\:w-\[42\%\] {
        margin-left: 2.5rem;
    }

    /* Better timeline point positioning */
    .absolute.left-\[20px\] {
        left: 20px;
    }

    /* Improved content spacing */
    .space-y-6> :not([hidden])~ :not([hidden]) {
        margin-top: 1.5rem;
    }

    /* Better border radius for mobile */
    .rounded-xl {
        border-radius: 0.75rem;
    }

    .rounded-lg {
        border-radius: 0.5rem;
    }

    /* Adjusted icon sizes for mobile */
    .w-10.h-10 {
        width: 2.5rem;
        height: 2.5rem;
    }

    .w-5.h-5 {
        width: 1.25rem;
        height: 1.25rem;
    }
}

/* Responsive progress bar styling */
.progress-bar {
    transition: width 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Better delivery section spacing */
@media (max-width: 640px) {
    .delivery-section {
        padding: 1rem;
    }

    .delivery-header {
        margin-bottom: 0.75rem;
    }

    .delivery-content {
        padding: 0.75rem;
    }
}

/* Achievement badge responsive styling */
@media (max-width: 640px) {
    .achievement-badge {
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
    }

    .achievement-icon {
        width: 1rem;
        height: 1rem;
    }
}
</style>
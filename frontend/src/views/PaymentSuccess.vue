<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div class="text-center">
                <!-- Success Icon -->
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p class="text-gray-600 mb-4">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>

                <!-- Transaction Details -->
                <div class="text-left bg-gray-50 p-4 rounded-lg mb-6">
                    <p class="text-sm text-gray-600 mb-2">
                        <span class="font-semibold">Transaction Reference:</span> {{ reference }}
                    </p>
                    <p class="text-sm text-gray-600">
                        <span class="font-semibold">Order ID:</span> #{{ order?.orderId || 'Loading...' }}
                    </p>
                </div>

                <!-- Loading State with Countdown -->
                <div v-if="isRedirecting" class="flex flex-col justify-center items-center space-y-2 mb-4">
                    <div class="flex items-center space-x-2">
                        <svg class="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span class="text-gray-600">Redirecting to order confirmation in {{ countdown }}
                            seconds...</span>
                    </div>
                    <div class="w-full max-w-xs bg-gray-200 rounded-full h-2">
                        <div class="bg-[#24a6bb] h-2 rounded-full transition-all duration-1000"
                            :style="{ width: `${(countdown / 5) * 100}%` }"></div>
                    </div>
                </div>

                <!-- Error State -->
                <div v-if="error" class="text-red-600 mb-4">
                    {{ error }}
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button @click="goToOrderConfirmation"
                        class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#24a6bb] hover:bg-[#1c8a9e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        View Order Details
                    </button>
                    <button @click="continueShopping"
                        class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../store/orderStore';
import { toast } from 'vue-sonner';

const props = defineProps({
    reference: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    }
});

const router = useRouter();
const orderStore = useOrderStore();
const isRedirecting = ref(false);
const error = ref('');
const order = ref(null);
const countdown = ref(5);

const startCountdown = () => {
    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer);
        }
    }, 1000);
};

onMounted(async () => {
    try {
        isRedirecting.value = true;
        startCountdown();

        // Fetch order details first
        const orderData = await orderStore.fetchOrder(props.orderId);
        order.value = orderData;

        // Update order status first
        await orderStore.updateOrderStatus(props.orderId, {
            status: "Processing",
            // transactionReference: props.reference
            transactionId: props.reference
        });

        // Add a small delay before redirect while showing countdown
        await new Promise(resolve => setTimeout(resolve, 5000));
        await goToOrderConfirmation();
    } catch (err) {
        // Only show error if the status update actually failed
        if (!err.response?.data?.status) {
            error.value = 'Error processing your request. Please try again.';
            toast.error('Error processing payment confirmation');
        }
    } finally {
        isRedirecting.value = false;
    }
});

const goToOrderConfirmation = async () => {
    try {
        await router.push({
            name: 'OrderConfirmation',
            params: { orderId: props.orderId }
        });
    } catch (err) {
        error.value = 'Error navigating to order confirmation. Please try again.';
        console.error('Navigation error:', err);
    }
};

const continueShopping = () => {
    router.push('/');
};
</script>
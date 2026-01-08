<!-- frontend/src/views/PaymentCallback.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
            <!-- Processing State -->
            <div v-if="isProcessing" class="text-center">
                <div class="mb-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24a6bb] mx-auto"></div>
                </div>
                <h2 class="text-xl font-semibold text-gray-700 mb-2">Verifying Payment</h2>
                <p class="text-gray-500">Please wait while we confirm your transaction...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center">
                <div class="mb-4 text-red-500">
                    <XCircle class="h-12 w-12 mx-auto" />
                </div>
                <h2 class="text-xl font-semibold text-gray-700 mb-2">Verification Failed</h2>
                <p class="text-gray-500 mb-4">{{ error }}</p>
                <div class="space-y-2">
                    <button @click="retryVerification"
                        class="w-full bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1c8a9e] transition duration-300">
                        Retry Verification
                    </button>
                    <button @click="contactSupport"
                        class="w-full border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition duration-300">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePaymentStore } from '../store/paymentStore';
import { useCartStore } from '../store/cart';
import { useOrderStore } from '../store/orderStore';
import { toast } from 'vue-sonner';
import { XCircle } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const isProcessing = ref(true);
const error = ref(null);

onMounted(async () => {
    const reference = route.query.reference;
    const trxref = route.query.trxref;

    // if (!reference || !trxref) {
    //     error.value = 'Invalid payment reference';
    //     isProcessing.value = false;
    //     return;
    // }

    if (reference && trxref) {

        try {
            // 1. Verify payment with Paystack
            const verificationResult = await paymentStore.verifyPayment(reference);

            if (!verificationResult.status) {
                throw new Error('Payment verification failed');
            }

            // 2. Get order details
            const orderId = verificationResult.data.orderId;
            const order = await orderStore.fetchOrder(orderId);

            // 3. Update order status
            await orderStore.updateOrderStatus(orderId, {
                status: "Processing",
                transactionId: reference
            });

            // 4. Clear cart and coupon
            await Promise.all([
                cartStore.clearCart(),
                cartStore.coupon ? cartStore.removeCoupon() : Promise.resolve()
            ]);

            // 5. Redirect to success page
            router.push({
                name: 'PaymentSuccess',
                params: {
                    reference: reference,
                    orderId: orderId
                }
            });

        } catch (err) {
            console.error('Payment verification error:', err);
            error.value = err.message || 'An error occurred while verifying your payment';
            toast.error(error.value);

            // Log the error for debugging
            console.error('Full error:', err);
        } finally {
            isProcessing.value = false;
        }
    } else {
        // If no reference or trxref, assume Orange Money handled the redirect
        error.value = 'Payment verification is handled by the server. If you were not redirected, please contact support.';
        isProcessing.value = false;
    }
});

const retryVerification = async () => {
    isProcessing.value = true;
    error.value = null;

    try {
        const reference = route.query.reference;
        await paymentStore.verifyPayment(reference);
    } catch (err) {
        error.value = 'Verification failed again. Please contact support.';
    } finally {
        isProcessing.value = false;
    }
};

const contactSupport = () => {
    // Implement your support contact logic
    window.location.href = `mailto:support@yoursite.com?subject=Payment%20Verification%20Issue&body=Reference:%20${route.query.reference}`;
};
</script>
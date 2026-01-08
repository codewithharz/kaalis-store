<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div class="text-center">
                <!-- Loading State -->
                <div v-if="isVerifying" class="flex flex-col items-center">
                    <svg class="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
                    <p class="text-gray-600">Please wait while we verify your payment...</p>
                </div>

                <!-- Success State -->
                <div v-else-if="verificationStatus === 'success'" class="flex flex-col items-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                            </path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                    <p class="text-gray-600 mb-4">Redirecting to order confirmation...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="verificationStatus === 'failed'" class="flex flex-col items-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                    <p class="text-gray-600 mb-4">{{ errorMessage }}</p>

                    <div class="flex flex-col sm:flex-row gap-4">
                        <button @click="retryVerification"
                            class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#24a6bb] hover:bg-[#1c8a9e]">
                            Retry Verification
                        </button>
                        <button @click="contactSupport"
                            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePaymentStore } from '../store/paymentStore';
import { useOrderStore } from '../store/orderStore';
import { useCartStore } from '../store/cart';
import { useCluesBucksStore } from '../store/cluesBucksStore';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();
const orderStore = useOrderStore();
const cartStore = useCartStore();
const cluesBucksStore = useCluesBucksStore();

const isVerifying = ref(true);
const verificationStatus = ref(null); // 'success', 'failed', null
const errorMessage = ref('');
const orderId = ref(null);
const reference = ref(null);
const paymentMethod = ref('Paystack'); // Default

onMounted(async () => {
    try {
        // Get reference from query params
        reference.value = route.query.reference || route.query.token;

        if (!reference.value) {
            throw new Error('No payment reference found');
        }

        console.log('Payment callback received:', {
            reference: reference.value,
            query: route.query
        });

        // Determine payment method from reference format or query params
        if (reference.value.startsWith('OPAY-')) {
            paymentMethod.value = 'OPay';
        } else if (reference.value.startsWith('PDW-')) {
            paymentMethod.value = 'PayDunya';
        } else if (reference.value.startsWith('OM-')) {
            paymentMethod.value = 'OrangeMoney';
        }

        console.log('Detected payment method:', paymentMethod.value);

        // Verify the payment
        const verificationResult = await paymentStore.verifyPayment(
            reference.value,
            paymentMethod.value
        );

        console.log('Verification result:', verificationResult);

        if (verificationResult.status) {
            // Extract orderId from verification data
            orderId.value = verificationResult.data.orderId ||
                verificationResult.data.payment?.orderId;

            if (!orderId.value) {
                throw new Error('Order ID not found in verification response');
            }

            // Update order status
            await orderStore.updateOrderStatus(orderId.value, {
                status: "Processing",
                transactionId: reference.value
            });

            // Refresh CluesBucks balance
            await cluesBucksStore.initialize();

            // Clear cart and invalidate coupon if used
            await Promise.all([
                cartStore.clearCart(),
                cartStore.coupon ? cartStore.invalidateCoupon(cartStore.coupon.code) : Promise.resolve()
            ]);

            // Store transaction details
            const transactionDetails = {
                orderId: orderId.value,
                reference: reference.value,
                timestamp: new Date().toISOString(),
                paymentMethod: paymentMethod.value,
                verificationId: verificationResult.data.verificationId
            };
            localStorage.setItem('currentTransaction', JSON.stringify(transactionDetails));

            // Set success status
            verificationStatus.value = 'success';
            toast.success('Payment verified successfully!');

            // Redirect to order confirmation after 2 seconds
            setTimeout(() => {
                router.push({
                    name: 'OrderConfirmation',
                    params: { orderId: orderId.value }
                });
            }, 2000);
        } else {
            throw new Error(verificationResult.message || 'Payment verification failed');
        }
    } catch (error) {
        console.error('Payment callback error:', error);
        verificationStatus.value = 'failed';
        errorMessage.value = error.message || 'Payment verification failed. Please contact support.';
        toast.error(errorMessage.value);
    } finally {
        isVerifying.value = false;
    }
});

const retryVerification = async () => {
    if (!reference.value) {
        toast.error('No payment reference found');
        return;
    }

    isVerifying.value = true;
    verificationStatus.value = null;
    errorMessage.value = '';

    try {
        const verificationResult = await paymentStore.verifyPayment(
            reference.value,
            paymentMethod.value
        );

        if (verificationResult.status) {
            orderId.value = verificationResult.data.orderId ||
                verificationResult.data.payment?.orderId;

            if (orderId.value) {
                await orderStore.updateOrderStatus(orderId.value, {
                    status: "Processing",
                    transactionId: reference.value
                });

                verificationStatus.value = 'success';
                toast.success('Payment verified successfully!');

                setTimeout(() => {
                    router.push({
                        name: 'OrderConfirmation',
                        params: { orderId: orderId.value }
                    });
                }, 2000);
            } else {
                throw new Error('Order ID not found');
            }
        } else {
            throw new Error('Verification failed');
        }
    } catch (error) {
        console.error('Retry verification error:', error);
        verificationStatus.value = 'failed';
        errorMessage.value = error.message || 'Verification failed again. Please contact support.';
        toast.error(errorMessage.value);
    } finally {
        isVerifying.value = false;
    }
};

const contactSupport = () => {
    // Redirect to support page or open email client
    window.location.href = 'mailto:support@bruthol.com?subject=Payment%20Verification%20Issue&body=Reference:%20' + reference.value;
};
</script>
<!-- frontend/src/views/PaymentCallback.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
            <!-- Processing State -->
            <div v-if="isProcessing" class="text-center">
                <div class="mb-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24a6bb] mx-auto"></div>
                </div>
                <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ t('paymentCallbackPage.verifyingTitle') }}</h2>
                <p class="text-gray-500">{{ t('paymentCallbackLegacyPage.verifyingDescription') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center">
                <div class="mb-4 text-red-500">
                    <XCircle class="h-12 w-12 mx-auto" />
                </div>
                <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ t('paymentCallbackPage.failedTitle') }}</h2>
                <p class="text-gray-500 mb-4">{{ error }}</p>
                <div class="space-y-2">
                    <button @click="retryVerification"
                        class="w-full bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1c8a9e] transition duration-300">
                        {{ t('paymentCallbackPage.retryVerification') }}
                    </button>
                    <button @click="contactSupport"
                        class="w-full border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition duration-300">
                        {{ t('paymentCallbackPage.contactSupport') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePaymentStore } from '../store/paymentStore';
import { useCartStore } from '../store/cart';
import { useOrderStore } from '../store/orderStore';
import { useCluesBucksStore } from '../store/cluesBucksStore';
import { toast } from 'vue-sonner';
import { XCircle } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const paymentStore = usePaymentStore();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const cluesBucksStore = useCluesBucksStore();

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
            const currentTransaction = JSON.parse(localStorage.getItem('currentTransaction') || 'null');
            // 1. Verify payment with Paystack
            const verificationResult = await paymentStore.verifyPayment(reference);

            if (!verificationResult.status) {
                throw new Error(t('paymentCallbackPage.errors.verificationFailed'));
            }

            // 2. Get order details
            const orderId = verificationResult.data.orderId;
            const order = await orderStore.fetchOrder(orderId);

            // 3. Update order status
            await orderStore.updateOrderStatus(orderId, {
                status: "Processing",
                transactionId: reference
            });

            await Promise.all([
                cluesBucksStore.fetchStats(),
                cluesBucksStore.fetchTransactions(),
                cluesBucksStore.checkOfferAccess(),
                cluesBucksStore.fetchSpecialOffers()
            ]);

            // 4. Remove only purchased cart items when available
            await Promise.all([
                currentTransaction?.purchasedItems?.length
                    ? cartStore.removeCheckedOutItems(currentTransaction.purchasedItems)
                    : cartStore.clearCart(),
                currentTransaction?.couponCode
                    ? cartStore.invalidateCoupon(currentTransaction.couponCode)
                    : Promise.resolve()
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
            error.value = err.message || t('paymentCallbackLegacyPage.errors.verificationError');
            toast.error(error.value);

            // Log the error for debugging
            console.error('Full error:', err);
        } finally {
            isProcessing.value = false;
        }
    } else {
        // If no reference or trxref, the payment provider handled the redirect server-side.
        error.value = t('paymentCallbackLegacyPage.errors.serverHandled');
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
        error.value = t('paymentCallbackPage.errors.retryFailedSupport');
    } finally {
        isProcessing.value = false;
    }
};

const contactSupport = () => {
    // Implement your support contact logic
    const subject = encodeURIComponent(t('paymentCallbackPage.supportEmail.subject'));
    const body = encodeURIComponent(`${t('paymentCallbackPage.supportEmail.referenceLabel')} ${route.query.reference}`);
    window.location.href = `mailto:brutholdigital@gmail.com?subject=${subject}&body=${body}`;
};
</script>

<!-- frontend/src/components/OrderHistory.vue -->
<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">{{ t('orderHistoryPage.title') }}</h1>
        <div v-if="orders.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-xl">{{ t('orderHistoryPage.noOrders') }}</p>
        </div>
        <div v-else class="space-y-6">
            <div v-for="order in orders" :key="order._id" class="bg-white shadow rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold">{{ t('orderHistoryPage.orderNumber', { id: order._id }) }}</h2>
                    <span class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</span>
                </div>
                <div class="space-y-4">
                    <div v-for="item in order.products" :key="item.product?._id"
                        class="flex justify-between items-center">
                        <div>
                            <p class="font-medium">{{ item.product.name }}</p>
                            <p class="text-sm text-gray-500">{{ t('orderHistoryPage.quantity', { count: item.quantity }) }}</p>
                        </div>
                        <div>
                            <p class="font-medium">₦{{ item.product?.price * item.quantity }}</p>
                            <button v-if="!item.rated" @click="openRatingModal(order._id, item.product)"
                                class="text-sm text-blue-600 hover:text-blue-800">
                                {{ t('orderHistoryPage.rateProduct') }}
                            </button>
                            <p v-else class="text-sm text-green-600">{{ t('orderHistoryPage.rated') }}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 text-right">
                    <p class="font-semibold">{{ t('orderHistoryPage.total', { amount: order.totalAmount }) }}</p>
                </div>
            </div>
        </div>

        <!-- Rating Modal -->
        <div v-if="showRatingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-96">
                <h2 class="text-xl font-bold mb-4">{{ t('orderHistoryPage.rateTitle', { name: currentProduct.name }) }}</h2>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">{{ t('orderHistoryPage.ratingLabel') }}</label>
                    <div class="flex items-center">
                        <Star v-for="star in 5" :key="star" @click="setRating(star)"
                            :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'"
                            class="w-6 h-6 cursor-pointer" />
                    </div>
                </div>
                <div class="mb-4">
                    <label for="review" class="block text-sm font-medium text-gray-700">{{ t('orderHistoryPage.reviewLabel') }}</label>
                    <textarea id="review" v-model="review" rows="3"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                </div>
                <div class="flex justify-end space-x-2">
                    <button @click="closeRatingModal"
                        class="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">{{ t('orderHistoryPage.cancel') }}</button>
                    <button @click="submitRating"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{{ t('orderHistoryPage.submit') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { Star } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

export default {
    name: 'OrderHistory',
    components: { Star },
    setup() {
        const { t, locale } = useI18n();
        const orderStore = useOrderStore();
        const productStore = useProductStore();
        const orders = ref([]);
        const showRatingModal = ref(false);
        const currentProduct = ref({});
        const currentOrderId = ref(null);
        const rating = ref(0);
        const review = ref('');

        const fetchOrders = async () => {
            orders.value = await orderStore.fetchUserOrdersWithProducts();
        };

        const formatDate = (dateString) => {
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US';
            return new Date(dateString).toLocaleDateString(activeLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const openRatingModal = (orderId, product) => {
            currentOrderId.value = orderId;
            currentProduct.value = product;
            showRatingModal.value = true;
        };

        const closeRatingModal = () => {
            showRatingModal.value = false;
            currentOrderId.value = null;
            currentProduct.value = {};
            rating.value = 0;
            review.value = '';
        };

        const setRating = (value) => {
            rating.value = value;
        };

        const submitRating = async () => {
            try {
                await productStore.rateProduct(currentProduct.value._id, rating.value, review.value);
                await orderStore.markProductAsRated(currentOrderId.value, currentProduct.value._id);
                closeRatingModal();
                // Refresh orders to reflect the new rating status
                await fetchOrders();
                toast.success(t('orderHistoryPage.toasts.ratingSubmitted'));
            } catch (error) {
                console.error('Failed to submit rating:', error);
                toast.error(t('orderHistoryPage.toasts.ratingFailed'));
                // Handle error (e.g., show error message to user)
            }
        };

        onMounted(fetchOrders);

        return {
            t,
            orders,
            formatDate,
            showRatingModal,
            currentProduct,
            rating,
            review,
            openRatingModal,
            closeRatingModal,
            setRating,
            submitRating
        };
    }
};
</script>

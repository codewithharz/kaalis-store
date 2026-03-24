<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">{{ t('managePromotionsPage.title') }}</h2>

        <!-- Create Coupon Form -->
        <form @submit.prevent="createCoupon" class="mb-8">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="code" class="block mb-2">{{ t('managePromotionsPage.couponCode') }}</label>
                    <input v-model="newCoupon.code" id="code" type="text" required class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="discountPercentage" class="block mb-2">{{ t('managePromotionsPage.discountPercentage') }}</label>
                    <input v-model.number="newCoupon.discountPercentage" id="discountPercentage" type="number" min="0"
                        max="100" required class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="expiryDate" class="block mb-2">{{ t('managePromotionsPage.expiryDate') }}</label>
                    <input v-model="newCoupon.expiryDate" id="expiryDate" type="date" required
                        class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="maxUsage" class="block mb-2">{{ t('managePromotionsPage.maxUsage') }}</label>
                    <input v-model.number="newCoupon.maxUsage" id="maxUsage" type="number" min="1" required
                        class="w-full p-2 border rounded">
                </div>
            </div>
            <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {{ t('managePromotionsPage.createCoupon') }}
            </button>
        </form>

        <!-- Active Coupons List -->
        <h3 class="text-xl font-semibold mb-4">{{ t('managePromotionsPage.activeCoupons') }}</h3>
        <div v-if="coupons.length === 0" class="text-gray-500">{{ t('managePromotionsPage.noActiveCoupons') }}</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="coupon in coupons" :key="coupon._id" class="border p-4 rounded">
                <h4 class="font-bold">{{ coupon.code }}</h4>
                <p>{{ t('managePromotionsPage.discount', { value: coupon.discountPercentage }) }}</p>
                <p>{{ t('managePromotionsPage.expires', { date: formatDate(coupon.expiryDate) }) }}</p>
                <p>{{ t('managePromotionsPage.uses', { used: coupon.usedCount, max: coupon.maxUsage }) }}</p>
                <button @click="deleteCoupon(coupon._id)" class="mt-2 text-red-500 hover:text-red-700">
                    {{ t('managePromotionsPage.delete') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSellerStore } from '../store/sellerStore';
import { useUserStore } from '../store/user';
import { toast } from 'vue-sonner';

export default {
    setup() {
        const { t, locale } = useI18n();
        const sellerStore = useSellerStore();
        const userStore = useUserStore();
        const coupons = ref([]);
        const newCoupon = ref({
            code: '',
            discountPercentage: 0,
            expiryDate: '',
            maxUsage: 1
        });

        const fetchCoupons = async () => {
            try {
                coupons.value = await sellerStore.fetchSellerCoupons();
            } catch (error) {
                toast.error(t('managePromotionsPage.toasts.fetchFailed'));
            }
        };

        const createCoupon = async () => {
            try {
                // Check if coupon code already exists locally
                if (coupons.value.some(coupon => coupon.code === newCoupon.value.code)) {
                    toast.error(t('managePromotionsPage.toasts.codeExists'));
                    return;
                }

                await sellerStore.createCoupon({
                    ...newCoupon.value,
                    sellerId: userStore.user._id
                });
                toast.success(t('managePromotionsPage.toasts.created'));
                newCoupon.value = { code: '', discountPercentage: 0, expiryDate: '', maxUsage: 1 };
                await fetchCoupons();
            } catch (error) {
                toast.error(t('managePromotionsPage.toasts.createFailed'));
            }
        };

        const deleteCoupon = async (couponId) => {
            try {
                await sellerStore.deleteCoupon(couponId);
                toast.success(t('managePromotionsPage.toasts.deleted'));
                await fetchCoupons();
            } catch (error) {
                toast.error(t('managePromotionsPage.toasts.deleteFailed'));
            }
        };

        const formatDate = (dateString) => {
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US';
            return new Date(dateString).toLocaleDateString(activeLocale);
        };

        onMounted(fetchCoupons);

        return {
            t,
            coupons,
            newCoupon,
            createCoupon,
            deleteCoupon,
            formatDate
        };
    }
};
</script>

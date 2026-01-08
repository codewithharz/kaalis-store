<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">Manage Promotions</h2>

        <!-- Create Coupon Form -->
        <form @submit.prevent="createCoupon" class="mb-8">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="code" class="block mb-2">Coupon Code</label>
                    <input v-model="newCoupon.code" id="code" type="text" required class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="discountPercentage" class="block mb-2">Discount Percentage</label>
                    <input v-model.number="newCoupon.discountPercentage" id="discountPercentage" type="number" min="0"
                        max="100" required class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="expiryDate" class="block mb-2">Expiry Date</label>
                    <input v-model="newCoupon.expiryDate" id="expiryDate" type="date" required
                        class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="maxUsage" class="block mb-2">Max Usage</label>
                    <input v-model.number="newCoupon.maxUsage" id="maxUsage" type="number" min="1" required
                        class="w-full p-2 border rounded">
                </div>
            </div>
            <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create
                Coupon</button>
        </form>

        <!-- Active Coupons List -->
        <h3 class="text-xl font-semibold mb-4">Active Coupons</h3>
        <div v-if="coupons.length === 0" class="text-gray-500">No active coupons</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="coupon in coupons" :key="coupon._id" class="border p-4 rounded">
                <h4 class="font-bold">{{ coupon.code }}</h4>
                <p>Discount: {{ coupon.discountPercentage }}%</p>
                <p>Expires: {{ formatDate(coupon.expiryDate) }}</p>
                <p>Uses: {{ coupon.usedCount }} / {{ coupon.maxUsage }}</p>
                <button @click="deleteCoupon(coupon._id)" class="mt-2 text-red-500 hover:text-red-700">Delete</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useSellerStore } from '../store/sellerStore';
import { useUserStore } from '../store/user';
import { toast } from 'vue-sonner';

export default {
    setup() {
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
                toast.error('Failed to fetch coupons');
            }
        };

        const createCoupon = async () => {
            try {
                // Check if coupon code already exists locally
                if (coupons.value.some(coupon => coupon.code === newCoupon.value.code)) {
                    toast.error('Coupon code already exists');
                    return;
                }

                await sellerStore.createCoupon({
                    ...newCoupon.value,
                    sellerId: userStore.user._id
                });
                toast.success('Coupon created successfully');
                newCoupon.value = { code: '', discountPercentage: 0, expiryDate: '', maxUsage: 1 };
                await fetchCoupons();
            } catch (error) {
                toast.error('Failed to create coupon');
            }
        };

        const deleteCoupon = async (couponId) => {
            try {
                await sellerStore.deleteCoupon(couponId);
                toast.success('Coupon deleted successfully');
                await fetchCoupons();
            } catch (error) {
                toast.error('Failed to delete coupon');
            }
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString();
        };

        onMounted(fetchCoupons);

        return {
            coupons,
            newCoupon,
            createCoupon,
            deleteCoupon,
            formatDate
        };
    }
};
</script>
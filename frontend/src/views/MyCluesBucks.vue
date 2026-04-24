<!-- frontend/src/views/MyCluesBucks.vue -->
<template>
    <div class=" mx-auto py-0">
        <!-- Balance Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">{{ t('myCluesBucksPage.availableBalance') }}</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.currentBalance }}</p>
                    </div>
                    <Coins class="w-8 h-8 text-amber-500" />
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ t('myCluesBucksPage.currentPointsBalance') }}</p>
            </div>

            <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">{{ t('myCluesBucksPage.lifetimePoints') }}</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.lifetimePoints }}</p>
                    </div>
                    <Award class="w-8 h-8 text-green-500" />
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ t('myCluesBucksPage.totalPointsEarned') }}</p>
            </div>



            <!-- Updated Special Offer Access Status card -->
            <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">{{ t('myCluesBucksPage.specialOffers') }}</p>
                        <p class="text-2xl font-bold text-gray-900">
                            <span v-if="hasValidOfferAccess" class="text-amber-600">{{ t('myCluesBucksPage.active') }}</span>
                            <span v-else class="text-gray-400">{{ t('myCluesBucksPage.inactive') }}</span>
                        </p>
                    </div>
                    <Tag class="w-8 h-8" :class="hasValidOfferAccess ? 'text-amber-500' : 'text-gray-400'" />
                </div>
                <div class="mt-2 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">{{ t('myCluesBucksPage.accessStatus') }}</span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="hasValidOfferAccess ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'">
                            {{ hasValidOfferAccess ? t('myCluesBucksPage.active') : t('myCluesBucksPage.inactive') }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <span>{{ t('myCluesBucksPage.totalRedeemed', { count: getSpecialOfferStats().totalRedeemed }) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>{{ t('myCluesBucksPage.totalUsed', { count: getSpecialOfferStats().totalRedeemed }) }}</span>
                        <span>{{ t('myCluesBucksPage.pointsUsed', { count: getSpecialOfferStats().pointsUsed }) }}</span>
                    </div>
                </div>
                <p v-if="!hasValidOfferAccess" class="text-xs text-gray-500 mt-2">
                    {{ t('myCluesBucksPage.specialOfferHint') }}
                </p>
            </div>


            <!-- Store Credit card -->
            <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">{{ t('myCluesBucksPage.storeCredit') }}</p>
                        <p class="text-2xl font-bold text-gray-900">
                            ₦{{ formatMoneyValue(stats.storeCreditBalance || 0) }}
                        </p>
                    </div>
                    <CreditCard class="w-8 h-8"
                        :class="(stats.storeCreditBalance || 0) > 0 ? 'text-amber-500' : 'text-gray-400'" />
                </div>
                <div class="mt-2 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">{{ t('myCluesBucksPage.creditStatus') }}</span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="(stats.storeCreditBalance || 0) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'">
                            {{ (stats.storeCreditBalance || 0) > 0 ? t('myCluesBucksPage.activeLower') : t('myCluesBucksPage.inactiveLower') }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <span>{{ t('myCluesBucksPage.totalStoreCredits', { count: getStoreCreditStats().totalRedeemed }) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>{{ t('myCluesBucksPage.totalUsed', { count: getStoreCreditStats().totalUsed }) }}</span>
                        <span>{{ t('myCluesBucksPage.storeCreditUsed', { amount: formatMoneyValue(getStoreCreditStats().amountUsed) }) }}</span>
                    </div>
                </div>
                <p v-if="!getStoreCreditStats().totalRedeemed" class="text-xs text-gray-500 mt-2">
                    {{ t('myCluesBucksPage.storeCreditHint') }}
                </p>
                <p v-else-if="getStoreCreditStats().lastRedeemedDate" class="text-xs text-gray-500 mt-2">
                    {{ t('myCluesBucksPage.lastRedeemedDate', { date: getStoreCreditStats().lastRedeemedDate }) }}
                </p>
            </div>


            <!-- New Discount Coupon Status card -->
            <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">{{ t('myCluesBucksPage.discountCoupon') }}</p>
                        <p class="text-2xl font-bold text-gray-900">
                            {{ getCouponTransactions().length ? '₦1000' : '0' }}
                        </p>
                    </div>
                    <Ticket class="w-8 h-8"
                        :class="getCouponTransactions().length ? 'text-amber-500' : 'text-gray-400'" />
                </div>
                <div v-if="getLatestCoupon()" class="mt-2 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">{{ t('myCluesBucksPage.code', { code: getLatestCoupon().code }) }}</span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                            {{ t('myCluesBucksPage.redeemed') }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <span>{{ t('myCluesBucksPage.totalRedeemedCoupons', { count: getCouponTransactions().length }) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>{{ t('myCluesBucksPage.totalUsed', { count: getCouponTransactions().length }) }}</span>
                        <span>{{ t('myCluesBucksPage.pointsUsed', { count: getCouponTransactions().length * 1000 }) }}</span>
                    </div>
                </div>
                <p v-else class="text-xs text-gray-500 mt-2">
                    {{ t('myCluesBucksPage.couponHint') }}
                </p>
            </div>



            <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">{{ t('myCluesBucksPage.expiringSoon') }}</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.pointsExpiringSoon }}</p>
                    </div>
                    <Clock class="w-8 h-8 text-red-500" />
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ t('myCluesBucksPage.useBeforeExpire') }}</p>
            </div>
        </div>

        <!-- Earn & Redeem Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <!-- Ways to Earn -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target class="w-5 h-5 text-amber-500" />
                    {{ t('myCluesBucksPage.waysToEarn') }}
                </h3>
                <div class="space-y-4">
                    <div class="flex items-start gap-3">
                        <ShoppingBag class="w-5 h-5 text-gray-400" />
                        <div>
                            <p class="font-medium">{{ t('myCluesBucksPage.earn.purchaseTitle') }}</p>
                            <p class="text-sm text-gray-600">{{ t('myCluesBucksPage.earn.purchaseDescription') }}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <Star class="w-5 h-5 text-gray-400" />
                        <div>
                            <p class="font-medium">{{ t('myCluesBucksPage.earn.reviewsTitle') }}</p>
                            <p class="text-sm text-gray-600">{{ t('myCluesBucksPage.earn.reviewsDescription') }}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <Users class="w-5 h-5 text-gray-400" />
                        <div>
                            <p class="font-medium">{{ t('myCluesBucksPage.earn.referralsTitle') }}</p>
                            <p class="text-sm text-gray-600">{{ t('myCluesBucksPage.earn.referralsDescription') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Redemption Options -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Gift class="w-5 h-5 text-amber-500" />
                    {{ t('myCluesBucksPage.redeemPoints') }}
                </h3>
                <div class="space-y-4">
                    <button v-for="option in redemptionOptions" :key="option.id" @click="handleRedeem(option)"
                        class="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                        :disabled="!hasEnoughPoints(option.points)"
                        :class="{ 'opacity-50 cursor-not-allowed': !hasEnoughPoints(option.points) }">
                        <div class="flex items-center gap-3">
                            <component :is="getIconComponent(option.type)" class="w-5 h-5 text-gray-400" />
                            <div>
                                <p class="font-medium">{{ getOptionText(option).title }}</p>
                                <p class="text-sm text-gray-600">{{ getOptionText(option).description }}</p>
                            </div>
                        </div>
                        <span class="text-amber-600 font-medium">{{ option.points }} pts</span>
                    </button>
                </div>
            </div>
        </div>



        <!-- Special Offers Section -->
        <!-- <div v-if="hasValidOfferAccess" class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag class="w-5 h-5 text-amber-500" />
                Active Special Offers
            </h3>
            <div class="grid gap-4 md:grid-cols-2">
                <div v-for="offer in activeSpecialOffers" :key="offer._id"
                    class="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div class="flex justify-between items-start">
                        <div class="space-y-2">
                            <h4 class="font-medium">{{ offer.title }}</h4>
                            <p class="text-sm text-gray-600">{{ offer.description }}</p>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                                    {{ offer.discount }}% off
                                </span>
                                <span class="text-sm text-gray-500">
                                    Expires {{ formatDate(offer.endDate) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!activeSpecialOffers.length" class="col-span-2 text-center py-8 text-gray-500">
                    No active special offers available
                </div>
            </div>
        </div> -->


        <div v-if="hasValidOfferAccess" class="bg-white rounded-lg shadow p-6 mb-3">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag class="w-5 h-5 text-amber-500" />
                {{ t('myCluesBucksPage.activeSpecialOffers') }}
            </h3>
            <div class="grid gap-4 md:grid-cols-2">
                <div v-for="offer in activeSpecialOffers" :key="offer._id"
                    class="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div class="flex justify-between items-start">
                        <div class="space-y-2">
                            <h4 class="font-medium">{{ offer.title }}</h4>
                            <p class="text-sm text-gray-600">{{ offer.description }}</p>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                                    {{ t('myCluesBucksPage.percentOff', { count: offer.discount }) }}
                                </span>
                                <!-- Add category badge -->
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                                    {{ getCategoryName(offer.category) }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between text-sm text-gray-500">
                                <span>
                                    {{ t('myCluesBucksPage.expiresDate', { date: formatDate(offer.endDate) }) }}
                                </span>
                                <!-- Add minimum purchase if exists -->
                                <span v-if="offer.minimumPurchase > 0">
                                    {{ t('myCluesBucksPage.minimumPurchase', { amount: offer.minimumPurchase }) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!activeSpecialOffers.length" class="col-span-2 text-center py-8 text-gray-500">
                    {{ t('myCluesBucksPage.noActiveOffers') }}
                </div>
            </div>
        </div>



        <!-- Transaction History -->
        <div class="bg-white rounded-lg shadow">
            <div class="p-4 border-b">
                <h3 class="text-lg font-semibold">{{ t('myCluesBucksPage.transactionHistory') }}</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('myCluesBucksPage.table.date') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('myCluesBucksPage.table.type') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('myCluesBucksPage.table.description') }}</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('myCluesBucksPage.table.points') }}</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="transaction in sortedTransactions" :key="transaction._id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(transaction.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2 py-1 text-xs font-medium rounded-full',
                                    transaction.type === 'earned' ? 'bg-green-100 text-green-800' :
                                        'bg-amber-100 text-amber-800'
                                ]">
                                    {{ getTransactionTypeLabel(transaction.type) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900">
                                {{ transaction.description }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium"
                                :class="transaction.type === 'earned' ? 'text-green-600' : 'text-amber-600'">
                                {{ transaction.type === 'earned' ? '+' : '-' }}{{ Math.abs(transaction.points) }}
                            </td>
                        </tr>
                        <tr v-if="!sortedTransactions.length">
                            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                                {{ t('myCluesBucksPage.noTransactions') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Redeem Confirmation Modal -->
        <Dialog :open="showRedeemModal" @update:open="showRedeemModal = $event">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ t('myCluesBucksPage.confirmRedemptionTitle') }}</DialogTitle>
                    <p id="dialogDescription" class="text-sm text-gray-500">
                        {{ t('myCluesBucksPage.confirmRedemptionDescription') }}
                    </p>
                </DialogHeader>
                <div class="space-y-4">
                    <p>{{ t('myCluesBucksPage.confirmRedeemText', { points: selectedOption?.points || 0 }) }}</p>
                    <p class="font-medium">{{ selectedOption ? getOptionText(selectedOption).title : '' }}</p>
                    <p class="text-sm text-gray-600">{{ selectedOption ? getOptionText(selectedOption).description : '' }}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showRedeemModal = false">
                        {{ t('myCluesBucksPage.cancel') }}
                    </Button>
                    <Button @click="confirmRedeem" :disabled="isLoading">
                        {{ isLoading ? t('myCluesBucksPage.processing') : t('myCluesBucksPage.confirm') }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useCluesBucksStore } from '../store/cluesBucksStore';
import { useProductStore } from '../store/productStore.js';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Coins, Award, Clock, Target, ShoppingBag,
    Star, Users, Gift, Ticket, CreditCard, Tag
} from 'lucide-vue-next';

const { t, locale } = useI18n();
const store = useCluesBucksStore();
const productStore = useProductStore();

// Update the destructuring of storeToRefs
const { stats, sortedTransactions, isLoading, redemptionOptions, hasValidOfferAccess, activeSpecialOffers } = storeToRefs(store);
const { hasEnoughPoints } = store;

const showRedeemModal = ref(false);
const selectedOption = ref(null);

// const getCategoryName = (categoryId) => {
//     if (!categoryId) return 'General';
//     if (!productStore.categories) return 'Loading...';
//     const category = productStore.categories.find(cat => cat._id === categoryId);
//     return category ? category.name : 'General';
// };

const getCategoryName = (category) => {
    if (!category || !category._id) return null;

    // Direct category name if available
    if (category.name) return category.name;

    // Look up in store if we only have ID
    if (productStore.categories) {
        const foundCategory = productStore.categories.find(cat => cat._id === category._id);
        if (foundCategory) return foundCategory.name;

        // Look through ancestors if available
        if (category.ancestors) {
            const ancestorCategory = productStore.categories.find(
                cat => category.ancestors.includes(cat._id)
            );
            if (ancestorCategory) return ancestorCategory.name;
        }
    }

    return null;
};

const getIconComponent = (type) => {
    const iconMap = {
        'coupon': Ticket,
        'credit': CreditCard,
        'offer': Tag
    };
    return iconMap[type] || Gift;
};

const getOptionText = (option) => {
    const optionMap = {
        coupon: {
            title: t('myCluesBucksPage.redemptionOptions.coupon.title'),
            description: t('myCluesBucksPage.redemptionOptions.coupon.description')
        },
        credit: {
            title: t('myCluesBucksPage.redemptionOptions.credit.title'),
            description: t('myCluesBucksPage.redemptionOptions.credit.description')
        },
        offer: {
            title: t('myCluesBucksPage.redemptionOptions.offer.title'),
            description: t('myCluesBucksPage.redemptionOptions.offer.description')
        }
    };

    return optionMap[option.type] || {
        title: option.title,
        description: option.description
    };
};

const getTransactionTypeLabel = (type) => {
    return type === 'earned'
        ? t('myCluesBucksPage.transactionTypes.earned')
        : t('myCluesBucksPage.transactionTypes.spent');
};

const formatDate = (date) => {
    const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US';
    return new Date(date).toLocaleDateString(activeLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatMoneyValue = (value) =>
    Number(value || 0).toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

const handleRedeem = (option) => {
    selectedOption.value = option;
    showRedeemModal.value = true;
};

const confirmRedeem = async () => {
    if (!selectedOption.value) return;

    const success = await store.redeemPoints(selectedOption.value.id);
    if (success) {
        showRedeemModal.value = false;
        selectedOption.value = null;
    }
};

const getSpecialOfferTransactions = () => {
    return sortedTransactions.value.filter(t =>
        t.type === 'spent' &&
        t.metadata?.type === 'offer'
    );
};

const getSpecialOfferStats = () => {
    const transactions = getSpecialOfferTransactions();
    return {
        totalRedeemed: transactions.length,
        pointsUsed: transactions.reduce((sum, transaction) => sum + Math.abs(transaction.points || 0), 0),
        isActive: hasValidOfferAccess.value
    };
};

const getStoreCreditTransactions = () => {
    return sortedTransactions.value.filter(t =>
        t.type === 'spent' &&
        t.metadata?.type === 'credit'
    );
};

const getStoreCreditStats = () => {
    const transactions = getStoreCreditTransactions();
    const redemptionTransactions = transactions.filter(t => t.metadata?.action === 'redeemed');
    const usageTransactions = transactions.filter(t => t.metadata?.action === 'used');
    const lastTransaction = redemptionTransactions[0];
    return {
        totalRedeemed: redemptionTransactions.length,
        totalUsed: usageTransactions.length,
        pointsUsed: redemptionTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.points || 0), 0),
        amountUsed: usageTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.metadata?.amount || 0), 0),
        isActive: (stats.value.storeCreditBalance || 0) > 0,
        lastTransaction,
        lastRedeemedDate: lastTransaction ? formatDate(lastTransaction.createdAt) : null,
    };
};

const getCouponTransactions = () => {
    return sortedTransactions.value.filter(t =>
        t.type === 'spent' &&
        t.description.includes('discount coupon')
    );
};

const getLatestCoupon = () => {
    const transaction = getCouponTransactions()[0];
    if (!transaction) return null;

    // Extract coupon code from description (e.g., "Redeemed for ₦1000 discount coupon (CBM57JR76J)")
    const match = transaction.description.match(/\(([^)]+)\)/);
    return match ? {
        code: match[1],
        date: transaction.createdAt
    } : null;
};

onMounted(async () => {
    store.initialize();
    await productStore.fetchCategories();
});

onUnmounted(() => {
    store.resetState();
});
</script>

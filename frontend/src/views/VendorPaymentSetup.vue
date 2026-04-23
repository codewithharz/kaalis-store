<!-- frontend/src/views/VendorPaymentSetup.vue -->
<template>
    <div class="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-8 lg:px-12">
        <!-- Stats Cards with Modern Design -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <!-- Pending Payout -->
            <div
                class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.pendingPayout') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(vendorPayoutStore.pendingAmount, activeCurrency) }}
                        </p>
                    </div>
                    <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <CircleDollarSign class="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    </div>
                </div>
            </div>

            <!-- Processed Payouts -->
            <div
                class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.processedPayouts') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.processedAmounts), activeCurrency) }}
                        </p>
                    </div>
                    <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <CircleDollarSign class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                </div>
            </div>

            <!-- Total Sales -->
            <div
                class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20 sm:col-span-2 lg:col-span-1">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.totalSales') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.salesAmounts), activeCurrency) }}
                        </p>
                    </div>
                    <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0">
                        <CreditCard class="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                    </div>
                </div>
            </div>

            <!-- Seller Earnings -->
            <div
                class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.sellerEarnings') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.vendorEarnings), activeCurrency) }}
                        </p>
                    </div>
                    <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <CircleDollarSign class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    </div>
                </div>
            </div>

            <!-- Order Count -->
            <div
                class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.completedOrders') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900">
                            {{ currencyStat(vendorPayoutStore.orderCounts) }}
                        </p>
                    </div>
                    <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <History class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                </div>
            </div>

            <!-- Platform Fees -->
            <div
                class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.platformFees') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.platformFeeAmounts), activeCurrency) }}
                        </p>
                    </div>
                    <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Percent class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                </div>
            </div>

            <!-- Next Payout -->
            <div
                class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20 sm:col-span-2 xl:col-span-3">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.nextPayout') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatDate(vendorPayoutStore.nextPayoutDate) || t('vendorPaymentSetupPage.notScheduled') }}
                        </p>
                    </div>
                    <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Calendar class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Bank Account Setup with Modern Design -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div class="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 class="text-xl sm:text-2xl font-semibold text-gray-900">{{ t('vendorPaymentSetupPage.title') }}</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ t('vendorPaymentSetupPage.subtitle') }}</p>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ t('vendorPaymentSetupPage.adminReleaseNote') }}</p>
                    </div>
                    <button v-if="!hasPayoutSetup" @click="redirectToBankSetup"
                        class="group w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-indigo-500/25 text-sm sm:text-base">
                        <span class="hidden sm:inline">{{ setupButtonText }}</span>
                        <span class="sm:hidden">{{ t('vendorPaymentSetupPage.setupAccount') }}</span>
                    </button>
                </div>

                <div v-if="hasPayoutSetup"
                    class="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl border border-gray-200">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                        <div
                            class="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                            <CreditCard class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-medium text-gray-900 text-sm sm:text-base">{{ connectedTitle }}</p>
                            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1.5">
                                <div v-if="!isAfriExchangeMode" class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                                    <Building2 class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span class="truncate">{{ userStore.user?.paystack?.bankName || t('vendorPaymentSetupPage.bankAccount')
                                    }}</span>
                                    <span>•••• {{ userStore.user?.paystack?.accountNumber?.slice(-4) }}</span>
                                </div>
                                <div v-else class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                                    <Building2 class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span class="truncate">{{ afriExchangeIdentifier }}</span>
                                </div>
                                <div v-if="!isAfriExchangeMode" class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                                    <UserCheckIcon class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span class="truncate">{{ displayAccountName(userStore.user?.paystack?.accountName)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payout History with Modern Design -->
            <div class="p-4 sm:p-6 lg:p-8">
                <div class="flex items-center justify-between mb-4 sm:mb-6">
                    <h4 class="text-xl sm:text-2xl font-semibold text-gray-900">{{ t('vendorPaymentSetupPage.recentPayouts') }}</h4>
                </div>

                <!-- Loading State -->
                <div v-if="vendorPayoutStore.isLoading" class="text-center py-8 sm:py-12">
                    <Loader2 class="w-8 h-8 sm:w-10 sm:h-10 animate-spin mx-auto text-indigo-600 mb-3 sm:mb-4" />
                    <p class="text-gray-500 text-sm sm:text-base">{{ t('vendorPaymentSetupPage.loadingPayouts') }}</p>
                </div>

                <!-- Payouts Table -->
                <div v-else-if="vendorPayoutStore.payouts.length" class="overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr class="text-left">
                                    <th scope="col"
                                        class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.date') }}</th>
                                    <th scope="col"
                                        class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.amount') }}
                                    </th>
                                    <th scope="col"
                                        class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.status') }}
                                    </th>
                                    <th scope="col"
                                        class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.reference') }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="payout in paginatedPayouts" :key="payout._id"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td
                                        class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                        {{ formatDate(payout.createdAt) }}
                                    </td>
                                    <td
                                        class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                                        {{ formatCurrency(payout.amount, payout.currency) }}
                                    </td>
                                    <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                        <span :class="getStatusClass(payout.status.toLowerCase())"
                                            class="inline-flex items-center">
                                            <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2" :class="{
                                                'bg-yellow-400': payout.status.toLowerCase() === 'pending',
                                                'bg-blue-400': payout.status.toLowerCase() === 'processing',
                                                'bg-green-400': payout.status.toLowerCase() === 'processed',
                                                'bg-red-400': payout.status.toLowerCase() === 'failed'
                                            }"></span>
                                            {{ getPayoutStatusLabel(payout) }}
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-gray-500">
                                        {{ payout.transactionReference || payout.reference }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-if="payoutTotalPages > 1"
                        class="flex items-center justify-between gap-3 border-t border-gray-100 px-2 py-4 sm:px-0">
                        <p class="text-xs sm:text-sm text-gray-500">
                            {{ payoutPaginationStart + 1 }}-{{ payoutPaginationEnd }} of {{ vendorPayoutStore.payouts.length }}
                        </p>
                        <div class="flex items-center gap-2">
                            <button @click="payoutCurrentPage--" :disabled="payoutCurrentPage === 1"
                                class="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Previous payouts page">
                                <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <span class="min-w-10 text-center text-xs sm:text-sm font-medium text-gray-600">
                                {{ payoutCurrentPage }} / {{ payoutTotalPages }}
                            </span>
                            <button @click="payoutCurrentPage++" :disabled="payoutCurrentPage >= payoutTotalPages"
                                class="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Next payouts page">
                                <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8 sm:py-12">
                    <History class="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">{{ t('vendorPaymentSetupPage.empty.title') }}</h3>
                    <p class="text-gray-500 text-sm sm:text-base">{{ t('vendorPaymentSetupPage.empty.subtitle') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
    CircleDollarSign,
    Calendar,
    Percent,
    CreditCard,
    Building2,
    UserCheckIcon,
    History,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-vue-next';
import { useVendorPayoutStore } from '../store/vendorPayoutStore';
import { useUserStore } from '../store/user';
import { useCountryStore } from '../store/countryStore';
import { toast } from 'vue-sonner';

const router = useRouter();
const { t, locale } = useI18n();
const vendorPayoutStore = useVendorPayoutStore();
const userStore = useUserStore();
const countryStore = useCountryStore();
const payoutCurrentPage = ref(1);
const payoutItemsPerPage = 5;

const hasPaystackSetup = computed(() => {
    return !!userStore.user?.paystack?.recipientCode;
});

const isAfriExchangeMode = computed(() => {
    return countryStore.isXofCountry || userStore.user?.currency === 'XOF' || userStore.user?.paymentMethod === 'AfriExchange';
});

const hasAfriExchangeSetup = computed(() => {
    return !!(
        userStore.user?.afriExchange?.userId ||
        userStore.user?.afriExchange?.walletAddress ||
        userStore.user?.afriExchange?.accountEmail
    );
});

const hasPayoutSetup = computed(() => {
    return isAfriExchangeMode.value ? hasAfriExchangeSetup.value : hasPaystackSetup.value;
});

const activeCurrency = computed(() => {
    return isAfriExchangeMode.value ? 'XOF' : 'NGN';
});

const currencyStat = (statsByCurrency = {}) => {
    return statsByCurrency?.[activeCurrency.value] || 0;
};

const payoutTotalPages = computed(() => Math.ceil(vendorPayoutStore.payouts.length / payoutItemsPerPage));

const payoutPaginationStart = computed(() => (payoutCurrentPage.value - 1) * payoutItemsPerPage);

const payoutPaginationEnd = computed(() => Math.min(
    payoutPaginationStart.value + payoutItemsPerPage,
    vendorPayoutStore.payouts.length
));

const paginatedPayouts = computed(() => {
    return vendorPayoutStore.payouts.slice(payoutPaginationStart.value, payoutPaginationEnd.value);
});

const setupButtonText = computed(() => {
    return isAfriExchangeMode.value ? t('vendorPaymentSetupPage.linkAfriExchange') : t('vendorPaymentSetupPage.setupBankAccount');
});

const connectedTitle = computed(() => {
    return isAfriExchangeMode.value ? t('vendorPaymentSetupPage.afriExchangeConnected') : t('vendorPaymentSetupPage.bankAccountConnected');
});

const afriExchangeIdentifier = computed(() => {
    return (
        userStore.user?.afriExchange?.accountEmail ||
        userStore.user?.afriExchange?.userId ||
        userStore.user?.afriExchange?.walletAddress ||
        t('vendorPaymentSetupPage.afriExchangeAccount')
    );
});

onMounted(async () => {
    try {
        await vendorPayoutStore.fetchPayoutHistory();
    } catch (error) {
        console.error('Failed to fetch payout history:', error);
        toast.error(t('vendorPaymentSetupPage.toasts.loadFailed'));
    }
});

const redirectToBankSetup = () => {
    router.push('/account/profile/bank-details');
};

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatCurrency = (amount, currency = activeCurrency.value) => {
    return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-NG', {
        style: 'currency',
        currency
    }).format(amount || 0);
};

const getStatusClass = (status) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    const statusClasses = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        processed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
    };
    return `${baseClasses} ${statusClasses[status.toLowerCase()] || statusClasses.pending}`;
};

const isPayoutReady = (payout) => {
    return payout.status?.toLowerCase() === 'pending' && payout.scheduledDate && new Date(payout.scheduledDate) <= new Date();
};

const getPayoutStatusLabel = (payout) => {
    if (isPayoutReady(payout)) {
        return t('vendorPaymentSetupPage.statuses.ready');
    }

    if (payout.status?.toLowerCase() === 'pending' && payout.scheduledDate) {
        return t('vendorPaymentSetupPage.statuses.scheduled');
    }

    return t(`vendorPaymentSetupPage.statuses.${payout.status.toLowerCase()}`);
};

const displayAccountName = (accountName) => {
    if (!accountName) return '';
    const capitalizedName = accountName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    return `${capitalizedName.slice(0, 3)} •••• ${capitalizedName.slice(-3)}`;
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
    input,
    select {
        font-size: 16px;
    }

    /* Reduce motion for better mobile performance */
    * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
    }
}

/* Enhanced focus states for accessibility */
button:focus {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
}

/* Enhanced shadow effects - Mobile optimized */
.shadow-xl {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
    .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
}

.shadow-lg {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@media (min-width: 768px) {
    .shadow-lg {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
}

/* Gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Custom scrollbar - Mobile optimized */
.overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
    -webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 4px;
}

@media (min-width: 768px) {
    .overflow-x-auto::-webkit-scrollbar {
        height: 6px;
    }
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f7fafc;
    border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(to right, #6366f1, #8b5cf6);
    border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to right, #4f46e5, #7c3aed);
}

/* Animation keyframes */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Table responsive improvements */
@media (max-width: 640px) {
    .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    table {
        min-width: 600px;
    }
}

/* Status badge styling */
.status-badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
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

    .space-y-3>*+* {
        margin-top: 0.5rem;
    }

    /* Better mobile scrolling */
    .overflow-x-auto {
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

    .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

/* Responsive text sizing */
@media (max-width: 640px) {
    .text-2xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }

    .text-xl {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }

    .text-lg {
        font-size: 1rem;
        line-height: 1.5rem;
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
    button {
        -webkit-tap-highlight-color: rgba(99, 102, 241, 0.1);
    }

    /* Better focus indicators for mobile */
    button:focus {
        outline: 3px solid #6366f1;
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

/* Ensure consistent button heights on mobile */
@media (max-width: 640px) {
    .py-2\.5 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
}

/* Mobile-specific grid improvements */
@media (max-width: 640px) {
    .sm\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .lg\:grid-cols-3 {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-3 {
        grid-template-columns: 1fr;
    }
}

/* Better mobile card layouts */
@media (max-width: 640px) {
    .rounded-2xl {
        border-radius: 0.75rem;
    }

    .rounded-xl {
        border-radius: 0.5rem;
    }

    .p-8 {
        padding: 1rem;
    }

    .p-6 {
        padding: 1rem;
    }

    /* Better spacing */
    .gap-6 {
        gap: 1rem;
    }

    .gap-4 {
        gap: 0.75rem;
    }

    .gap-3 {
        gap: 0.5rem;
    }
}

/* Table hover effects - Desktop only */
@media (min-width: 769px) {
    .hover\:bg-gray-50:hover {
        background-color: #f9fafb;
    }

    .hover\:bg-gray-100:hover {
        background-color: #f3f4f6;
    }

    .hover\:shadow-xl:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
}

/* Optimized scrolling behavior */
.overflow-x-auto,
.overflow-y-auto {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Enhanced mobile accessibility */
@media (max-width: 768px) {

    /* Better contrast for mobile */
    .text-gray-400 {
        color: #6b7280;
    }

    .text-gray-600 {
        color: #4b5563;
    }

    .text-gray-500 {
        color: #6b7280;
    }
}

/* Status classes for consistency */
.status-pending {
    background-color: #fef3c7;
    color: #92400e;
}

.status-processing {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-processed {
    background-color: #d1fae5;
    color: #065f46;
}

.status-failed {
    background-color: #fee2e2;
    color: #991b1b;
}

/* Print styles */
@media print {

    .shadow-xl,
    .shadow-lg {
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

/* Better selection styles */
::selection {
    background-color: #6366f1;
    color: #ffffff;
}

::-moz-selection {
    background-color: #6366f1;
    color: #ffffff;
}

/* Mobile payout cards enhancements */
@media (max-width: 640px) {
    .payout-card {
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 0.75rem;
    }

    .payout-amount {
        font-size: 0.875rem;
        font-weight: 500;
    }

    .payout-date {
        font-size: 0.75rem;
        color: #6b7280;
    }

    .payout-reference {
        font-size: 0.75rem;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    }
}

/* Ensure proper stacking context */
.relative {
    position: relative;
    z-index: 1;
}
</style>

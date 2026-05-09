<template>
    <div>
        <div class="flex flex-col gap-4 mb-3 px-4 py-4 rounded-b-lg bg-white sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ t('adminPayments.title') }}</h2>
                <p class="text-sm text-gray-500">{{ t('adminPayments.subtitle') }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <button @click="exportPayments" :disabled="isExporting"
                    class="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {{ isExporting ? t('adminPayments.exporting') : t('adminPayments.exportData') }}
                </button>
                <button @click="showFilters = !showFilters"
                    class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                    {{ showFilters ? t('adminPayments.hideFilters') : t('adminPayments.showFilters') }}
                </button>
            </div>
        </div>

        <div v-show="showFilters" class="bg-white p-4 rounded-lg shadow-sm mb-3">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('adminPayments.filters.dateRange') }}</label>
                    <div class="relative">
                        <select v-model="filters.dateRange"
                            class="appearance-none w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-7 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20"
                            @change="applyFilters">
                            <option value="today">{{ t('adminPayments.dateRanges.today') }}</option>
                            <option value="week">{{ t('adminPayments.dateRanges.week') }}</option>
                            <option value="month">{{ t('adminPayments.dateRanges.month') }}</option>
                            <option value="quarter">{{ t('adminPayments.dateRanges.quarter') }}</option>
                            <option value="year">{{ t('adminPayments.dateRanges.year') }}</option>
                            <option value="all">{{ t('adminPayments.dateRanges.all') }}</option>
                        </select>
                        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <ChevronDown class="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('adminPayments.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-7 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20"
                            @change="applyFilters">
                            <option value="">{{ t('adminPayments.statuses.all') }}</option>
                            <option value="success">{{ t('adminPayments.statuses.success') }}</option>
                            <option value="pending">{{ t('adminPayments.statuses.pending') }}</option>
                            <option value="failed">{{ t('adminPayments.statuses.failed') }}</option>
                        </select>
                        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <ChevronDown class="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('adminPayments.filters.paymentMethod') }}</label>
                    <div class="relative">
                        <select v-model="filters.paymentMethod"
                            class="appearance-none w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-7 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20"
                            @change="applyFilters">
                            <option value="">{{ t('adminPayments.methods.all') }}</option>
                            <option value="Paystack">{{ t('adminPayments.methods.paystack') }}</option>
                            <option value="OPay">{{ t('adminPayments.methods.opay') }}</option>
                            <option value="AfriExchange">{{ t('adminPayments.methods.afriexchange') }}</option>
                        </select>
                        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <ChevronDown class="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('adminPayments.filters.currency') }}</label>
                    <div class="relative">
                        <select v-model="filters.currency"
                            class="appearance-none w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-7 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20"
                            @change="applyFilters">
                            <option value="">{{ t('adminPayments.filters.allCurrencies') }}</option>
                            <option value="NGN">NGN</option>
                            <option value="XOF">XOF</option>
                        </select>
                        <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <ChevronDown class="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('adminPayments.filters.search') }}</label>
                    <input v-model="filters.search" type="text"
                        :placeholder="t('adminPayments.filters.searchPlaceholder')"
                        class="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20"
                        @input="handleSearch">
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
                <button type="button"
                    class="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    @click="clearFilters">
                    {{ t('adminPayments.filters.clear') }}
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-3 mb-3 sm:grid-cols-2 xl:grid-cols-4">
            <div v-for="stat in paymentStats" :key="stat.title" class="rounded-lg bg-white px-4 py-4 sm:p-6 shadow-sm">
                <div class="flex items-center gap-3">
                    <div class="rounded-full p-2.5 sm:p-3" :class="stat.bgColor">
                        <component :is="stat.icon" class="h-5 w-5 sm:h-6 sm:w-6" :class="stat.iconColor" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs text-gray-500 sm:text-sm">{{ stat.title }}</p>
                        <p class="text-xl font-semibold text-gray-900 sm:text-2xl break-words">{{ stat.value }}</p>
                        <p v-if="stat.detail" class="mt-1 text-xs text-gray-400">{{ stat.detail }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div v-if="isLoading" class="flex items-center justify-center p-12 text-gray-500">
                <Loader2 class="mr-2 h-5 w-5 animate-spin" />
                {{ t('adminPayments.loading') }}
            </div>

            <div v-else-if="!payments.length" class="p-12 text-center text-gray-500">
                {{ t('adminPayments.empty') }}
            </div>

            <template v-else>
                <div class="md:hidden divide-y divide-gray-200">
                    <div v-for="payment in payments" :key="`${payment.id}-mobile`" class="p-4 space-y-4">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <div class="text-sm font-semibold text-gray-900 break-all">
                                    {{ payment.paymentId }}
                                </div>
                                <div class="mt-1 text-sm text-gray-900 break-words">
                                    {{ payment.customerName }}
                                </div>
                                <div class="text-xs text-gray-500 break-all">
                                    {{ payment.customerEmail }}
                                </div>
                            </div>
                            <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap', getStatusClass(payment.status)]">
                                {{ formatStatusLabel(payment.status) }}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminPayments.table.amount') }}</div>
                                <div class="mt-1 font-medium text-gray-900">{{ formatCurrency(payment.amount, payment.currency) }}</div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminPayments.table.method') }}</div>
                                <div class="mt-1 text-gray-900">{{ formatPaymentMethod(payment.paymentMethod) }}</div>
                            </div>
                            <div class="col-span-2">
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminPayments.table.date') }}</div>
                                <div class="mt-1 text-gray-600 break-words">{{ formatDateTime(payment.createdAt) }}</div>
                            </div>
                            <div class="col-span-2">
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminPayments.details.orderId') }}</div>
                                <div class="mt-1 text-gray-900 break-words">{{ payment.orderNumber || t('adminPayments.notAvailable') }}</div>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                            <button
                                @click="viewPaymentDetails(payment)"
                                class="inline-flex items-center rounded-md bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100"
                            >
                                {{ t('adminPayments.actions.view') }}
                            </button>
                            <button
                                v-if="payment.orderNumber"
                                @click="goToOrder(payment.orderNumber)"
                                class="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                            >
                                {{ t('adminPayments.actions.viewOrder') }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="hidden md:block max-h-[70vh] overflow-auto">
                    <table class="min-w-[1120px] w-full divide-y divide-gray-200 table-fixed">
                        <thead class="sticky top-0 z-10 bg-gray-50 shadow-sm">
                            <tr>
                                <th class="w-[18%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ t('adminPayments.table.paymentId') }}</th>
                                <th class="w-[18%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ t('adminPayments.table.customer') }}</th>
                                <th class="w-[12%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ t('adminPayments.table.amount') }}</th>
                                <th class="w-[10%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ t('adminPayments.table.status') }}</th>
                                <th class="w-[12%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ t('adminPayments.table.method') }}</th>
                                <th class="w-[16%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ t('adminPayments.table.date') }}</th>
                                <th class="w-[8%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ t('adminPayments.table.currency') }}</th>
                                <th class="w-[12%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ t('adminPayments.table.actions') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="payment in payments" :key="payment.id">
                                <td class="px-6 py-4 align-top">
                                    <div class="text-sm font-medium text-gray-900 break-all">{{ payment.paymentId }}</div>
                                    <div class="text-sm text-gray-500 break-words">
                                        {{ payment.orderNumber ? t('adminPayments.orderNumber', { id: payment.orderNumber }) : t('adminPayments.notAvailable') }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-top">
                                    <div class="text-sm text-gray-900 break-words">{{ payment.customerName }}</div>
                                    <div class="text-sm text-gray-500 break-all">{{ payment.customerEmail }}</div>
                                </td>
                                <td class="px-6 py-4 align-top whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ formatCurrency(payment.amount, payment.currency) }}
                                </td>
                                <td class="px-6 py-4 align-top whitespace-nowrap">
                                    <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusClass(payment.status)]">
                                        {{ formatStatusLabel(payment.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 align-top text-sm text-gray-700 break-words">
                                    {{ formatPaymentMethod(payment.paymentMethod) }}
                                </td>
                                <td class="px-6 py-4 align-top text-sm text-gray-500">
                                    {{ formatDateTime(payment.createdAt) }}
                                </td>
                                <td class="px-6 py-4 align-top whitespace-nowrap text-sm text-gray-700">
                                    {{ payment.currency }}
                                </td>
                                <td class="px-6 py-4 align-top">
                                    <div class="flex flex-wrap gap-x-3 gap-y-2 text-sm font-medium">
                                        <button @click="viewPaymentDetails(payment)" class="text-blue-600 hover:text-blue-900">
                                            {{ t('adminPayments.actions.view') }}
                                        </button>
                                        <button v-if="payment.orderNumber" @click="goToOrder(payment.orderNumber)" class="text-indigo-600 hover:text-indigo-900">
                                            {{ t('adminPayments.actions.viewOrder') }}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <p class="text-sm text-gray-500">
                        {{ t('adminPayments.pagination.pageSummary', { page: pagination.page, pages: pagination.pages || 1, total: pagination.total }) }}
                    </p>
                    <div class="flex items-center gap-2">
                        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
                            class="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                            {{ t('adminPayments.pagination.previous') }}
                        </button>
                        <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.pages"
                            class="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                            {{ t('adminPayments.pagination.next') }}
                        </button>
                    </div>
                </div>
            </template>
        </div>

        <Dialog :open="Boolean(selectedPayment)" @update:open="handlePaymentDialogOpen">
            <DialogContent class="max-w-3xl p-0 overflow-hidden">
                <div v-if="selectedPayment" class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div class="min-w-0">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                                {{ t('adminPayments.details.recordLabel') }}
                            </p>
                            <h3 class="mt-1 break-all text-xl font-semibold">
                                {{ selectedPayment.paymentId }}
                            </h3>
                            <p class="mt-2 text-sm text-white/75">
                                {{ selectedPayment.customerName }} · {{ formatDateTime(selectedPayment.createdAt) }}
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span :class="['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', getStatusBadgeClass(selectedPayment.status)]">
                                {{ formatStatusLabel(selectedPayment.status) }}
                            </span>
                            <span class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                {{ formatPaymentMethod(selectedPayment.paymentMethod) }}
                            </span>
                        </div>
                    </div>
                </div>
                <DialogHeader>
                    <DialogTitle>{{ t('adminPayments.details.title') }}</DialogTitle>
                </DialogHeader>

                <div v-if="selectedPayment" class="space-y-6 px-6 pb-6">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div class="rounded-xl border border-gray-100 bg-slate-50 p-4">
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.amount') }}</p>
                            <p class="mt-2 text-2xl font-semibold text-slate-900">{{ formatCurrency(selectedPayment.amount, selectedPayment.currency) }}</p>
                            <p class="mt-1 text-xs text-slate-500">{{ selectedPayment.currency }}</p>
                        </div>
                        <div class="rounded-xl border border-gray-100 bg-slate-50 p-4">
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.method') }}</p>
                            <p class="mt-2 text-lg font-semibold text-slate-900">{{ formatPaymentMethod(selectedPayment.paymentMethod) }}</p>
                            <p class="mt-1 text-xs text-slate-500">{{ t('adminPayments.details.checkoutRail') }}</p>
                        </div>
                        <div class="rounded-xl border border-gray-100 bg-slate-50 p-4">
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.status') }}</p>
                            <p class="mt-2 text-lg font-semibold text-slate-900">{{ formatStatusLabel(selectedPayment.status) }}</p>
                            <p class="mt-1 text-xs text-slate-500">{{ t('adminPayments.details.lastRecordedState') }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div class="rounded-xl border border-gray-100 bg-white p-5">
                            <h4 class="text-sm font-semibold text-slate-900">{{ t('adminPayments.details.sections.paymentRecord') }}</h4>
                            <dl class="mt-4 space-y-4">
                                <div>
                                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.paymentId') }}</dt>
                                    <dd class="mt-1 break-all text-sm text-slate-900">{{ selectedPayment.paymentId }}</dd>
                                </div>
                                <div>
                                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.reference') }}</dt>
                                    <dd class="mt-1 break-all text-sm text-slate-900">{{ selectedPayment.reference || selectedPayment.paymentId }}</dd>
                                </div>
                                <div>
                                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.createdAt') }}</dt>
                                    <dd class="mt-1 text-sm text-slate-900">{{ formatDateTime(selectedPayment.createdAt) }}</dd>
                                </div>
                            </dl>
                        </div>

                        <div class="rounded-xl border border-gray-100 bg-white p-5">
                            <h4 class="text-sm font-semibold text-slate-900">{{ t('adminPayments.details.sections.customerOrder') }}</h4>
                            <dl class="mt-4 space-y-4">
                                <div>
                                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.customer') }}</dt>
                                    <dd class="mt-1 text-sm text-slate-900">{{ selectedPayment.customerName }}</dd>
                                </div>
                                <div>
                                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.customerEmail') }}</dt>
                                    <dd class="mt-1 break-all text-sm text-slate-900">{{ selectedPayment.customerEmail }}</dd>
                                </div>
                                <div>
                                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('adminPayments.details.orderId') }}</dt>
                                    <dd class="mt-1 text-sm text-slate-900">{{ selectedPayment.orderNumber || t('adminPayments.notAvailable') }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div class="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
                        <button
                            v-if="selectedPayment.orderNumber"
                            type="button"
                            @click="goToOrder(selectedPayment.orderNumber)"
                            class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            {{ t('adminPayments.actions.viewOrder') }}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';
import { toast } from 'vue-sonner';
import apiClient from '@/api/axios';
import { formatCurrencyAmount } from '@/utils/countryCurrency';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    AlertCircle,
    ArrowUpCircle,
    ChevronDown,
    CreditCard,
    DollarSign,
    Loader2,
} from 'lucide-vue-next';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();

const payments = ref([]);
const selectedPayment = ref(null);
const showFilters = ref(true);
const isLoading = ref(false);
const isExporting = ref(false);
const pagination = ref({ page: 1, limit: 20, total: 0, pages: 1 });
const summary = ref({ byStatus: {}, successTotalsByCurrency: {} });
const filters = ref({
    dateRange: 'month',
    status: '',
    paymentMethod: '',
    currency: '',
    search: '',
});

const getStatusCount = (status) => summary.value.byStatus?.[status]?.count || 0;

const formatCurrencyTotals = (totalsByCurrency = {}) => {
    const entries = Object.entries(totalsByCurrency).filter(([, amount]) => Number(amount || 0) > 0);
    if (!entries.length) {
        return formatCurrencyAmount(0, 'NGN');
    }
    return entries.map(([currency, amount]) => formatCurrencyAmount(amount, currency)).join(' / ');
};

const paymentStats = computed(() => [
    {
        title: t('adminPayments.stats.totalPayments'),
        value: formatCurrencyTotals(summary.value.successTotalsByCurrency),
        detail: t('adminPayments.stats.successVolumeDetail'),
        icon: DollarSign,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        title: t('adminPayments.stats.successfulPayments'),
        value: getStatusCount('success'),
        detail: t('adminPayments.stats.successCountDetail'),
        icon: ArrowUpCircle,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
    },
    {
        title: t('adminPayments.stats.pendingPayments'),
        value: getStatusCount('pending'),
        detail: t('adminPayments.stats.pendingCountDetail'),
        icon: CreditCard,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
    },
    {
        title: t('adminPayments.stats.failedPayments'),
        value: getStatusCount('failed'),
        detail: t('adminPayments.stats.failedCountDetail'),
        icon: AlertCircle,
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
    },
]);

const buildParams = () => ({
    page: pagination.value.page,
    limit: pagination.value.limit,
    dateRange: filters.value.dateRange,
    status: filters.value.status,
    paymentMethod: filters.value.paymentMethod,
    currency: filters.value.currency,
    search: filters.value.search,
});

const fetchPayments = async () => {
    isLoading.value = true;
    try {
        const response = await apiClient.get('/admin/payments', {
            params: buildParams(),
        });

        payments.value = response.data.payments || [];
        summary.value = response.data.summary || { byStatus: {}, successTotalsByCurrency: {} };
        pagination.value = response.data.pagination || { page: 1, limit: 20, total: 0, pages: 1 };
    } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error(error.response?.data?.message || t('adminPayments.toasts.fetchFailed'));
    } finally {
        isLoading.value = false;
    }
};

const applyFilters = () => {
    pagination.value.page = 1;
    fetchPayments();
};

const handleSearch = debounce(() => {
    pagination.value.page = 1;
    fetchPayments();
}, 300);

const clearFilters = () => {
    filters.value = {
        dateRange: 'month',
        status: '',
        paymentMethod: '',
        currency: '',
        search: '',
    };
    pagination.value.page = 1;
    fetchPayments();
};

const changePage = (page) => {
    if (page < 1 || page > (pagination.value.pages || 1)) {
        return;
    }
    pagination.value.page = page;
    fetchPayments();
};

const getStatusClass = (status) => {
    const classes = {
        success: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusBadgeClass = (status) => {
    const classes = {
        success: 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/20',
        pending: 'bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/20',
        failed: 'bg-rose-400/15 text-rose-100 ring-1 ring-rose-300/20',
    };
    return classes[status] || 'bg-white/10 text-white ring-1 ring-white/15';
};

const formatStatusLabel = (status) => {
    const labels = {
        success: t('adminPayments.statuses.success'),
        pending: t('adminPayments.statuses.pending'),
        failed: t('adminPayments.statuses.failed'),
    };
    return labels[status] || status;
};

const formatPaymentMethod = (method) => {
    const labels = {
        Paystack: t('adminPayments.methods.paystack'),
        OPay: t('adminPayments.methods.opay'),
        AfriExchange: t('adminPayments.methods.afriexchange'),
        Bank_transfer: t('adminPayments.methods.bankTransfer'),
        Cash: t('adminPayments.methods.cash'),
    };
    return labels[method] || method;
};

const formatCurrency = (amount, currency) => formatCurrencyAmount(amount, currency);

const formatDateTime = (date) => {
    if (!date) {
        return t('adminPayments.notAvailable');
    }

    return new Date(date).toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const viewPaymentDetails = (payment) => {
    selectedPayment.value = payment;
};

const goToOrder = (orderNumber) => {
    if (!orderNumber) return;
    router.push({
        name: 'AdminOrders',
        query: {
            search: orderNumber,
        },
    });
};

const handlePaymentDialogOpen = (open) => {
    if (!open) {
        selectedPayment.value = null;
    }
};

const exportPayments = async () => {
    isExporting.value = true;
    try {
        const response = await apiClient.get('/admin/payments/export', {
            params: {
                dateRange: filters.value.dateRange,
                status: filters.value.status,
                paymentMethod: filters.value.paymentMethod,
                currency: filters.value.currency,
                search: filters.value.search,
            },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(response.data);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        window.URL.revokeObjectURL(url);
        anchor.remove();
        toast.success(t('adminPayments.toasts.exportSuccess'));
    } catch (error) {
        console.error('Error exporting payments:', error);
        toast.error(error.response?.data?.message || t('adminPayments.toasts.exportFailed'));
    } finally {
        isExporting.value = false;
    }
};

onMounted(() => {
    if (typeof route.query.search === 'string') {
        filters.value.search = route.query.search;
    }
    if (typeof route.query.paymentMethod === 'string') {
        filters.value.paymentMethod = route.query.paymentMethod;
    }
    if (typeof route.query.currency === 'string') {
        filters.value.currency = route.query.currency;
    }
    fetchPayments();
});
</script>

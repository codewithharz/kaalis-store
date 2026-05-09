<template>
    <div>
        <div class="flex flex-col gap-4 mb-3 px-8 py-4 rounded-b-lg bg-white lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Vendor Payouts</h2>
                <p class="text-sm text-gray-500">Review scheduled payouts and release ready payouts to vendors.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <button @click="reconcileAfriExchange" :disabled="isReconciling"
                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                    <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': isReconciling }" />
                    <span>{{ isReconciling ? 'Reconciling...' : 'Reconcile AfriExchange' }}</span>
                </button>
                <button @click="processReadyPayouts" :disabled="isProcessing || readyCount === 0"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#24a3b5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1d8b9a] disabled:cursor-not-allowed disabled:opacity-50">
                    <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': isProcessing }" />
                    <span>{{ isProcessing ? 'Processing...' : `Process Ready Payouts (${readyCount})` }}</span>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mb-3 md:grid-cols-4">
            <div v-for="card in summaryCards" :key="card.title" class="rounded-lg bg-white p-4 shadow-sm">
                <p class="text-sm text-gray-500">{{ card.title }}</p>
                <p class="mt-1 text-2xl font-semibold text-gray-900">{{ card.value }}</p>
                <p class="mt-1 text-xs text-gray-400">{{ card.detail }}</p>
            </div>
        </div>

        <div class="mb-3 rounded-lg bg-white p-4 shadow-sm">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Status</label>
                    <select v-model="filters.status" @change="fetchPayouts"
                        class="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20">
                        <option value="">All</option>
                        <option value="ready">Ready for payout</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="processed">Processed</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Method</label>
                    <select v-model="filters.paymentMethod" @change="fetchPayouts"
                        class="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20">
                        <option value="">All</option>
                        <option value="AfriExchange">AfriExchange</option>
                        <option value="Paystack">Paystack</option>
                        <option value="OPay">OPay</option>
                    </select>
                </div>
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Currency</label>
                    <select v-model="filters.currency" @change="fetchPayouts"
                        class="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20">
                        <option value="">All</option>
                        <option value="XOF">XOF</option>
                        <option value="NGN">NGN</option>
                    </select>
                </div>
                <div class="md:col-span-2">
                    <label class="mb-1 block text-sm font-medium text-gray-700">Search vendor, order ID, or reference</label>
                    <input v-model="filters.search" @input="handleSearch" type="text"
                        class="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#24a3b5] focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/20"
                        placeholder="seller@email.com, 0000c6-moo3jqcd, payout reference">
                </div>
            </div>
            <div class="mt-4 flex justify-end">
                <button
                    @click="clearFilters"
                    class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    Clear Filters
                </button>
            </div>
        </div>

        <div class="overflow-hidden rounded-lg bg-white shadow-sm">
            <div v-if="isLoading" class="flex items-center justify-center p-12 text-gray-500">
                <Loader2 class="mr-2 h-5 w-5 animate-spin" />
                Loading payouts...
            </div>

            <div v-else-if="!payouts.length" class="p-12 text-center text-gray-500">
                No payouts match these filters.
            </div>

            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Vendor</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Method</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Scheduled</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reference</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="payout in payouts" :key="payout.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4">
                                <p class="text-sm font-medium text-gray-900">{{ vendorName(payout.vendor) }}</p>
                                <p class="text-xs text-gray-500">{{ payout.vendor?.email || 'No email' }}</p>
                                <p v-if="payout.vendor?.afriExchange?.accountEmail" class="text-xs text-gray-400">
                                    AfriExchange: {{ payout.vendor.afriExchange.accountEmail }}
                                </p>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-700">
                                {{ payout.order?.orderId || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                                {{ formatCurrency(payout.amount, payout.currency) }}
                            </td>
                            <td class="px-6 py-4">
                                <span :class="statusClass(payout)"
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium">
                                    {{ statusLabel(payout) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-700">{{ payout.paymentMethod }}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">{{ formatDate(payout.scheduledDate) }}</td>
                            <td class="px-6 py-4 text-xs font-mono text-gray-500">
                                {{ payout.transactionReference || payout.transferReference || payout.id }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col items-start gap-2">
                                    <button @click="selectedPayout = payout"
                                        class="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                                        View Details
                                    </button>
                                    <button v-if="payout.order?.orderId" @click="goToOrder(payout.order.orderId)"
                                        class="rounded-md border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50">
                                        View Order
                                    </button>
                                    <button @click="checkStatus(payout)" :disabled="!canCheckStatus(payout) || checkingPayoutId === payout.id"
                                        class="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                                        {{ checkingPayoutId === payout.id ? 'Checking...' : 'Check status' }}
                                    </button>
                                    <button v-if="canSimulateProcessing(payout)" @click="simulateProcessing(payout)"
                                        :disabled="simulatingPayoutId === payout.id"
                                        class="rounded-md border border-dashed border-cyan-300 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50">
                                        {{ simulatingPayoutId === payout.id ? 'Simulating...' : 'Simulate Processing' }}
                                    </button>
                                    <button v-if="canSimulateFailure(payout)" @click="simulateFailure(payout)"
                                        :disabled="failingPayoutId === payout.id"
                                        class="rounded-md border border-dashed border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">
                                        {{ failingPayoutId === payout.id ? 'Simulating...' : 'Simulate Failure' }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <p class="text-sm text-gray-500">
                    Page {{ pagination.page }} of {{ pagination.pages || 1 }} · {{ pagination.total }} payouts
                </p>
                <div class="flex items-center gap-2">
                    <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
                        class="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                        Previous
                    </button>
                    <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.pages"
                        class="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <Dialog :open="!!selectedPayout" @update:open="handleDialogOpenChange">
            <DialogContent class="max-w-3xl overflow-hidden p-0">
                <div v-if="selectedPayout" class="overflow-hidden rounded-2xl">
                    <div class="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 text-white">
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                                    Payout Record
                                </p>
                                <h3 class="mt-2 text-xl font-semibold text-white">
                                    {{ selectedPayout.transactionReference || selectedPayout.transferReference || selectedPayout.id }}
                                </h3>
                                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                                    <span>{{ vendorName(selectedPayout.vendor) }}</span>
                                    <span>{{ selectedPayout.vendor?.email || 'No email' }}</span>
                                    <span>{{ selectedPayout.order?.orderId || 'No order linked' }}</span>
                                </div>
                                <div class="mt-4 flex flex-wrap gap-2">
                                    <span class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                                        {{ selectedPayout.paymentMethod || 'Unknown method' }}
                                    </span>
                                    <span :class="statusClass(selectedPayout)" class="inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                                        {{ statusLabel(selectedPayout) }}
                                    </span>
                                    <span v-if="selectedPayout.providerStatus" class="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
                                        Provider {{ selectedPayout.providerStatus }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-50 px-6 py-6">
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">
                                    {{ formatCurrency(selectedPayout.amount, selectedPayout.currency) }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">{{ selectedPayout.currency }}</p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Scheduled</p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">
                                    {{ formatDate(selectedPayout.scheduledDate) }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">
                                    {{ selectedPayout.processedAt ? `Processed ${formatDate(selectedPayout.processedAt)}` : 'Awaiting processing' }}
                                </p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Vendor rail</p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">
                                    {{ selectedPayout.vendor?.afriExchange?.accountEmail || selectedPayout.vendor?.email || 'Not available' }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">
                                    {{ selectedPayout.vendor?.currency || selectedPayout.currency }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Payout Record</h4>
                                <div class="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p class="break-all"><span class="font-medium text-slate-900">Transfer reference</span> {{ selectedPayout.transferReference || 'Not available' }}</p>
                                    <p class="break-all"><span class="font-medium text-slate-900">Transaction reference</span> {{ selectedPayout.transactionReference || 'Not available' }}</p>
                                    <p class="break-all"><span class="font-medium text-slate-900">Provider payout ID</span> {{ selectedPayout.providerPayoutId || 'Not available' }}</p>
                                    <p><span class="font-medium text-slate-900">Provider status</span> {{ selectedPayout.providerStatus || 'Not available' }}</p>
                                    <p><span class="font-medium text-slate-900">Last checked</span> {{ selectedPayout.lastStatusCheckedAt ? formatDate(selectedPayout.lastStatusCheckedAt) : 'Not available' }}</p>
                                </div>
                            </div>

                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Vendor & Order</h4>
                                <div class="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p><span class="font-medium text-slate-900">Vendor</span> {{ vendorName(selectedPayout.vendor) }}</p>
                                    <p class="break-all"><span class="font-medium text-slate-900">Email</span> {{ selectedPayout.vendor?.email || 'Not available' }}</p>
                                    <p><span class="font-medium text-slate-900">Order ID</span> {{ selectedPayout.order?.orderId || 'Not available' }}</p>
                                    <p><span class="font-medium text-slate-900">Order status</span> {{ selectedPayout.order?.status || 'Not available' }}</p>
                                    <p v-if="selectedPayout.errorMessage" class="text-red-600"><span class="font-medium">Error</span> {{ selectedPayout.errorMessage }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex flex-wrap justify-end gap-3">
                            <button
                                v-if="selectedPayout.order?.orderId"
                                @click="goToOrder(selectedPayout.order.orderId)"
                                class="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                            >
                                View Order
                            </button>
                            <button
                                @click="selectedPayout = null"
                                class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api/axios';
import { toast } from 'vue-sonner';
import { Loader2, RefreshCcw } from 'lucide-vue-next';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';

const router = useRouter();
const route = useRoute();
const payouts = ref([]);
const summary = ref({ byStatus: {}, readyCount: 0 });
const pagination = ref({ page: 1, limit: 20, total: 0, pages: 1 });
const isLoading = ref(false);
const isProcessing = ref(false);
const isReconciling = ref(false);
const checkingPayoutId = ref(null);
const simulatingPayoutId = ref(null);
const failingPayoutId = ref(null);
const searchTimer = ref(null);
const selectedPayout = ref(null);
const filters = ref({
    status: 'ready',
    paymentMethod: '',
    currency: '',
    search: '',
});

const readyCount = computed(() => summary.value.readyCount || 0);

const summaryCards = computed(() => [
    {
        title: 'Ready Payouts',
        value: readyCount.value,
        detail: 'Pending payouts whose scheduled date has arrived',
    },
    {
        title: 'Pending XOF',
        value: formatCurrency(summaryAmount('pending', 'XOF'), 'XOF'),
        detail: `${summaryCount('pending', 'XOF')} pending XOF payouts`,
    },
    {
        title: 'Processing XOF',
        value: formatCurrency(summaryAmount('processing', 'XOF'), 'XOF'),
        detail: `${summaryCount('processing', 'XOF')} transfers in progress`,
    },
    {
        title: 'Processed XOF',
        value: formatCurrency(summaryAmount('processed', 'XOF'), 'XOF'),
        detail: `${summaryCount('processed', 'XOF')} processed payouts`,
    },
]);

const summaryAmount = (status, currency) => {
    return summary.value.byStatus?.[status]?.[currency]?.amount || 0;
};

const summaryCount = (status, currency) => {
    return summary.value.byStatus?.[status]?.[currency]?.count || 0;
};

const fetchPayouts = async (page = 1) => {
    isLoading.value = true;
    try {
        const response = await apiClient.get('/admin/payouts', {
            params: {
                page,
                limit: pagination.value.limit,
                ...filters.value,
            },
        });

        payouts.value = response.data.payouts || [];
        summary.value = response.data.summary || { byStatus: {}, readyCount: 0 };
        pagination.value = response.data.pagination || pagination.value;
    } catch (error) {
        console.error('Failed to fetch payouts:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch payouts');
    } finally {
        isLoading.value = false;
    }
};

const processReadyPayouts = async () => {
    isProcessing.value = true;
    try {
        const response = await apiClient.post('/admin/process-payouts');
        const results = response.data.results;
        toast.success(`Payout run complete: ${results?.processed || 0} processed, ${results?.failed || 0} failed`);
        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to process payouts:', error);
        toast.error(error.response?.data?.message || 'Failed to process payouts');
    } finally {
        isProcessing.value = false;
    }
};

const reconcileAfriExchange = async () => {
    isReconciling.value = true;
    try {
        const response = await apiClient.post('/admin/payouts/reconcile-afriexchange');
        const results = response.data.results;
        toast.success(`Reconciliation complete: ${results?.checked || 0} checked, ${results?.failed || 0} failed`);
        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to reconcile AfriExchange payouts:', error);
        toast.error(error.response?.data?.message || 'Failed to reconcile AfriExchange payouts');
    } finally {
        isReconciling.value = false;
    }
};

const canCheckStatus = (payout) => {
    return payout.status === 'processing' && !!(payout.transferReference || payout.transactionReference);
};

const canSimulateProcessing = (payout) => {
    return import.meta.env.DEV &&
        payout.paymentMethod === 'AfriExchange' &&
        payout.status === 'pending';
};

const canSimulateFailure = (payout) => {
    return import.meta.env.DEV &&
        payout.paymentMethod === 'AfriExchange' &&
        payout.status === 'pending';
};

const checkStatus = async (payout) => {
    checkingPayoutId.value = payout.id;
    try {
        const response = await apiClient.post(`/admin/payouts/${payout.id}/check-status`);
        const result = response.data.result || {};
        const nextStatus = result.currentStatus || result.status || 'checked';
        const previousStatus = result.previousStatus || payout.status;

        if (result.changed) {
            toast.success(result.message || `Payout moved from ${previousStatus} to ${nextStatus}`);
        } else if (nextStatus === 'processing') {
            toast.info(result.message || 'Payout is still processing');
        } else {
            toast.success(result.message || `Payout is already ${nextStatus}`);
        }

        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to check payout status:', error);
        toast.error(error.response?.data?.message || 'Failed to check payout status');
    } finally {
        checkingPayoutId.value = null;
    }
};

const simulateProcessing = async (payout) => {
    simulatingPayoutId.value = payout.id;
    try {
        const response = await apiClient.post(`/admin/payouts/${payout.id}/simulate-afriexchange-processing`);
        toast.success(response.data.message || 'AfriExchange processing simulation created');
        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to simulate AfriExchange processing payout:', error);
        toast.error(error.response?.data?.message || 'Failed to simulate AfriExchange processing payout');
    } finally {
        simulatingPayoutId.value = null;
    }
};

const simulateFailure = async (payout) => {
    failingPayoutId.value = payout.id;
    try {
        const response = await apiClient.post(`/admin/payouts/${payout.id}/simulate-afriexchange-failure`);
        toast.success(response.data.message || 'AfriExchange payout failure simulated');
        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to simulate AfriExchange payout failure:', error);
        toast.error(error.response?.data?.message || 'Failed to simulate AfriExchange payout failure');
    } finally {
        failingPayoutId.value = null;
    }
};

const changePage = (page) => {
    if (page < 1 || page > pagination.value.pages) return;
    fetchPayouts(page);
};

const handleSearch = () => {
    clearTimeout(searchTimer.value);
    if (filters.value.search.trim() && filters.value.status === 'ready') {
        filters.value.status = '';
    }
    searchTimer.value = setTimeout(() => fetchPayouts(1), 300);
};

const clearFilters = () => {
    filters.value = {
        status: 'ready',
        paymentMethod: '',
        currency: '',
        search: '',
    };
    fetchPayouts(1);
};

const handleDialogOpenChange = (open) => {
    if (!open) {
        selectedPayout.value = null;
    }
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

const vendorName = (vendor) => {
    const name = `${vendor?.firstName || ''} ${vendor?.lastName || ''}`.trim();
    return name || vendor?.email || 'Unknown vendor';
};

const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat(currency === 'XOF' ? 'fr-FR' : 'en-NG', {
        style: 'currency',
        currency,
    }).format(amount || 0);
};

const formatDate = (date) => {
    if (!date) return 'Not scheduled';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const statusLabel = (payout) => {
    if (payout.isReady) return 'Ready for payout';
    if (payout.status === 'pending' && payout.scheduledDate) return 'Scheduled';
    return payout.status;
};

const statusClass = (payout) => {
    if (payout.isReady) return 'bg-cyan-100 text-cyan-800';
    const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        processed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
    };
    return classes[payout.status] || classes.pending;
};

onMounted(() => {
    if (typeof route.query.search === 'string') {
        filters.value.search = route.query.search;
        if (!route.query.status && filters.value.status === 'ready') {
            filters.value.status = '';
        }
    }
    if (typeof route.query.status === 'string') {
        filters.value.status = route.query.status;
    }
    if (typeof route.query.currency === 'string') {
        filters.value.currency = route.query.currency;
    }
    if (typeof route.query.paymentMethod === 'string') {
        filters.value.paymentMethod = route.query.paymentMethod;
    }
    fetchPayouts();
});
</script>

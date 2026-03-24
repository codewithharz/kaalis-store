<!-- frontend/src/views/admin/AdminPayments.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="flex justify-between items-center mb-3 px-8 py-4 rounded-b-lg bg-white">
            <h2 class="text-2xl font-bold text-gray-800">{{ t('adminPayments.title') }}</h2>
            <div class="flex space-x-4">
                <button @click="exportPayments" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    {{ t('adminPayments.exportData') }}
                </button>
                <button @click="showFilters = !showFilters"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    {{ showFilters ? t('adminPayments.hideFilters') : t('adminPayments.showFilters') }}
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div v-if="showFilters" class="bg-white p-4 rounded-lg shadow-sm mb-3">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Date Range -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminPayments.filters.dateRange') }}</label>
                    <div class="relative">
                        <select v-model="filters.dateRange"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchPayments">
                            <option value="today">{{ t('adminPayments.dateRanges.today') }}</option>
                            <option value="week">{{ t('adminPayments.dateRanges.week') }}</option>
                            <option value="month">{{ t('adminPayments.dateRanges.month') }}</option>
                            <option value="quarter">{{ t('adminPayments.dateRanges.quarter') }}</option>
                            <option value="year">{{ t('adminPayments.dateRanges.year') }}</option>
                            <option value="all">{{ t('adminPayments.dateRanges.all') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminPayments.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchPayments">
                            <option value="">{{ t('adminPayments.statuses.all') }}</option>
                            <option value="completed">{{ t('adminPayments.statuses.completed') }}</option>
                            <option value="pending">{{ t('adminPayments.statuses.pending') }}</option>
                            <option value="failed">{{ t('adminPayments.statuses.failed') }}</option>
                            <option value="refunded">{{ t('adminPayments.statuses.refunded') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Payment Method -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminPayments.filters.paymentMethod') }}</label>
                    <div class="relative">
                        <select v-model="filters.paymentMethod"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchPayments">
                            <option value="">{{ t('adminPayments.methods.all') }}</option>
                            <option value="credit_card">{{ t('adminPayments.methods.creditCard') }}</option>
                            <option value="debit_card">{{ t('adminPayments.methods.debitCard') }}</option>
                            <option value="paypal">{{ t('adminPayments.methods.paypal') }}</option>
                            <option value="bank_transfer">{{ t('adminPayments.methods.bankTransfer') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Search -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminPayments.filters.search') }}</label>
                    <input type="text" v-model="filters.search" :placeholder="t('adminPayments.filters.searchPlaceholder')"
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
            <div v-for="stat in paymentStats" :key="stat.title" class="bg-white rounded-lg shadow-sm p-4">
                <div class="flex items-center">
                    <div class="p-3 rounded-full" :class="stat.bgColor">
                        <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">{{ stat.title }}</p>
                        <p class="text-2xl font-semibold">{{ stat.value }}</p>
                        <p class="text-sm" :class="stat.changeColor">
                            {{ t('adminPayments.fromLastPeriod', { change: stat.change }) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payments Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="min-w-full">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminPayments.table.paymentId') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminPayments.table.customer') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminPayments.table.amount') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminPayments.table.status') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminPayments.table.method') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminPayments.table.date') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminPayments.table.actions') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="payment in payments" :key="payment._id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ payment.paymentId }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ t('adminPayments.orderNumber', { id: payment.orderId }) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ payment.customerName }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ payment.customerEmail }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    ${{ payment.amount.toFixed(2) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    getStatusClass(payment.status)
                                ]">
                                    {{ t(`adminPayments.statuses.${payment.status}`) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatPaymentMethod(payment.paymentMethod) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    {{ formatDate(payment.createdAt) }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ formatTime(payment.createdAt) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button @click="viewPaymentDetails(payment)"
                                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                                    {{ t('adminPayments.actions.view') }}
                                </button>
                                <button v-if="payment.status === 'completed'" @click="initiateRefund(payment)"
                                    class="text-red-600 hover:text-red-900">
                                    {{ t('adminPayments.actions.refund') }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                        {{ t('adminPayments.pagination.previous') }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                        {{ t('adminPayments.pagination.next') }}
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            {{ t('adminPayments.pagination.showing') }}
                            <span class="font-medium">{{ startItem }}</span>
                            {{ t('adminPayments.pagination.to') }}
                            <span class="font-medium">{{ endItem }}</span>
                            {{ t('adminPayments.pagination.of') }}
                            <span class="font-medium">{{ totalItems }}</span>
                            {{ t('adminPayments.pagination.results') }}
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                {{ t('adminPayments.pagination.previous') }}
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                                {{ t('adminPayments.pagination.next') }}
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Details Modal -->
        <div v-if="selectedPayment" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ t('adminPayments.details.title') }}
                    </h3>
                    <button @click="selectedPayment = null" class="text-gray-400 hover:text-gray-500">
                        <XCircle class="w-6 h-6" />
                    </button>
                </div>
                <div class="space-y-4">
                    <!-- Payment details content -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm font-medium text-gray-500">{{ t('adminPayments.details.paymentId') }}</p>
                            <p class="mt-1">{{ selectedPayment.paymentId }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">{{ t('adminPayments.details.orderId') }}</p>
                            <p class="mt-1">{{ selectedPayment.orderId }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">{{ t('adminPayments.details.amount') }}</p>
                            <p class="mt-1">${{ selectedPayment.amount.toFixed(2) }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">{{ t('adminPayments.details.status') }}</p>
                            <p class="mt-1">{{ t(`adminPayments.statuses.${selectedPayment.status}`) }}</p>
                        </div>
                        <!-- Add more payment details as needed -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Refund Confirmation Modal -->
        <div v-if="showRefundModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    {{ t('adminPayments.refundModal.title') }}
                </h3>
                <p class="text-gray-500 mb-4">
                    {{ t('adminPayments.refundModal.message') }}
                </p>
                <div class="flex justify-end space-x-3">
                    <button @click="showRefundModal = false"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        {{ t('adminPayments.actions.cancel') }}
                    </button>
                    <button @click="processRefund" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        {{ t('adminPayments.refundModal.confirm') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';
import {
    DollarSign,
    CreditCard,
    AlertCircle,
    ArrowUpCircle,
    ArrowDownCircle,
    XCircle,
    ChevronDown
} from 'lucide-vue-next';

export default {
    name: 'AdminPayments',

    components: {
        DollarSign,
        CreditCard,
        AlertCircle,
        ArrowUpCircle,
        ArrowDownCircle,
        XCircle,
        ChevronDown
    },

    setup() {
        const { t, locale } = useI18n();
        const payments = ref([]);
        const selectedPayment = ref(null);
        const showRefundModal = ref(false);
        const showFilters = ref(false);
        const paymentToRefund = ref(null);
        const loading = ref(false);

        // Pagination
        const currentPage = ref(1);
        const totalItems = ref(0);
        const itemsPerPage = ref(10);
        const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
        const startItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1);
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

        // Filters
        const filters = ref({
            dateRange: 'month',
            status: '',
            paymentMethod: '',
            search: ''
        });

        // Payment Stats
        const paymentStats = ref([
            {
                title: t('adminPayments.stats.totalPayments'),
                value: '$0',
                change: 0,
                icon: DollarSign,
                bgColor: 'bg-blue-100',
                iconColor: 'text-blue-600',
                changeColor: 'text-green-500'
            },
            {
                title: t('adminPayments.stats.successfulPayments'),
                value: '0',
                change: 0,
                icon: ArrowUpCircle,
                bgColor: 'bg-green-100',
                iconColor: 'text-green-600',
                changeColor: 'text-green-500'
            },
            {
                title: t('adminPayments.stats.failedPayments'),
                value: '0',
                change: 0,
                icon: AlertCircle,
                bgColor: 'bg-red-100',
                iconColor: 'text-red-600',
                changeColor: 'text-red-500'
            },
            {
                title: t('adminPayments.stats.refunds'),
                value: '$0',
                change: 0,
                icon: ArrowDownCircle,
                bgColor: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
                changeColor: 'text-red-500'
            }
        ]);

        // Methods
        const fetchPayments = async () => {
            loading.value = true;
            try {
                const queryParams = new URLSearchParams({
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    ...filters.value
                });

                const response = await fetch(`/api/admin/payments?${queryParams}`);
                const data = await response.json();

                payments.value = data.payments;
                totalItems.value = data.pagination.total;
                updatePaymentStats(data.stats);
            } catch (error) {
                console.error('Error fetching payments:', error);
                toast.error(t('adminPayments.toasts.fetchFailed'));
            } finally {
                loading.value = false;
            }
        };

        const updatePaymentStats = (stats) => {
            if (!stats) return;

            paymentStats.value = [
                {
                    ...paymentStats.value[0],
                    value: `${stats.totalAmount.toFixed(2)}`,
                    change: stats.totalGrowth
                },
                {
                    ...paymentStats.value[1],
                    value: stats.successfulCount,
                    change: stats.successGrowth
                },
                {
                    ...paymentStats.value[2],
                    value: stats.failedCount,
                    change: stats.failureGrowth
                },
                {
                    ...paymentStats.value[3],
                    value: `${stats.refundAmount.toFixed(2)}`,
                    change: stats.refundGrowth
                }
            ];
        };

        const handleSearch = debounce(() => {
            currentPage.value = 1;
            fetchPayments();
        }, 300);

        const getStatusClass = (status) => {
            const classes = {
                completed: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                failed: 'bg-red-100 text-red-800',
                refunded: 'bg-gray-100 text-gray-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        };

        const formatPaymentMethod = (method) => {
            const formats = {
                credit_card: t('adminPayments.methods.creditCard'),
                debit_card: t('adminPayments.methods.debitCard'),
                paypal: t('adminPayments.methods.paypal'),
                bank_transfer: t('adminPayments.methods.bankTransfer')
            };
            return formats[method] || method;
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatTime = (date) => {
            return new Date(date).toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const viewPaymentDetails = (payment) => {
            selectedPayment.value = payment;
        };

        const initiateRefund = (payment) => {
            paymentToRefund.value = payment;
            showRefundModal.value = true;
        };

        const processRefund = async () => {
            try {
                await fetch(`/api/admin/payments/${paymentToRefund.value._id}/refund`, {
                    method: 'POST'
                });
                toast.success(t('adminPayments.toasts.refundSuccess'));
                showRefundModal.value = false;
                paymentToRefund.value = null;
                fetchPayments();
            } catch (error) {
                console.error('Error processing refund:', error);
                toast.error(t('adminPayments.toasts.refundFailed'));
            }
        };

        const exportPayments = async () => {
            try {
                const response = await fetch('/api/admin/payments/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                toast.success(t('adminPayments.toasts.exportSuccess'));
            } catch (error) {
                console.error('Error exporting payments:', error);
                toast.error(t('adminPayments.toasts.exportFailed'));
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchPayments();
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                fetchPayments();
            }
        };

        // Lifecycle hooks
        onMounted(() => {
            fetchPayments();
        });

        return {
            payments,
            selectedPayment,
            showRefundModal,
            showFilters,
            filters,
            paymentStats,
            currentPage,
            totalItems,
            totalPages,
            startItem,
            endItem,
            loading,
            handleSearch,
            getStatusClass,
            formatPaymentMethod,
            formatDate,
            formatTime,
            viewPaymentDetails,
            initiateRefund,
            processRefund,
            exportPayments,
            prevPage,
            nextPage,
            t
        };
    }
};

</script>

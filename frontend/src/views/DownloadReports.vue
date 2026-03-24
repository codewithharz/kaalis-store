<template>
    <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header with Back Button -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <button @click="router.back()"
                    class="flex items-center text-gray-600 hover:text-gray-800 transition duration-150">
                    <ArrowLeft class="w-5 h-5 mr-2" />
                    <span class="text-sm sm:text-base">{{ t('downloadReportsPage.backToDashboard') }}</span>
                </button>
                <div class="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                    <!-- Date Range Selector -->
                    <div class="relative">
                        <select
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-3 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            v-model="dateRange">
                            <option value="today">{{ t('downloadReportsPage.dateRanges.today') }}</option>
                            <option value="week">{{ t('downloadReportsPage.dateRanges.thisWeek') }}</option>
                            <option value="month">{{ t('downloadReportsPage.dateRanges.thisMonth') }}</option>
                            <option value="year">{{ t('downloadReportsPage.dateRanges.thisYear') }}</option>
                            <option value="custom">{{ t('downloadReportsPage.dateRanges.customRange') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Custom Date Range (shown when custom is selected) -->
            <div v-if="dateRange === 'custom'" class="mb-6 bg-white p-4 rounded-lg shadow">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('downloadReportsPage.startDate') }}</label>
                        <input type="date" v-model="customDateRange.startDate"
                            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('downloadReportsPage.endDate') }}</label>
                        <input type="date" v-model="customDateRange.endDate"
                            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    </div>
                </div>
            </div>

            <!-- Report Types Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <!-- Sales Report -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">{{ t('downloadReportsPage.reports.sales.title') }}</h3>
                            <p class="text-sm text-gray-600 mt-1">{{ t('downloadReportsPage.reports.sales.description') }}</p>
                        </div>
                        <button @click="downloadReport('sales')" :disabled="isLoading.sales"
                            class="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition duration-150 disabled:opacity-50">
                            <span v-if="isLoading.sales" class="mr-2">
                                <RefreshCcw class="w-4 h-4 animate-spin" />
                            </span>
                            <span v-else class="mr-2">
                                <Download class="w-4 h-4" />
                            </span>
                            {{ isLoading.sales ? t('downloadReportsPage.generating') : t('downloadReportsPage.download') }}
                        </button>
                    </div>
                </div>

                <!-- Inventory Report -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">{{ t('downloadReportsPage.reports.inventory.title') }}</h3>
                            <p class="text-sm text-gray-600 mt-1">{{ t('downloadReportsPage.reports.inventory.description') }}</p>
                        </div>
                        <button @click="downloadReport('inventory')" :disabled="isLoading.inventory"
                            class="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition duration-150 disabled:opacity-50">
                            <span v-if="isLoading.inventory" class="mr-2">
                                <RefreshCcw class="w-4 h-4 animate-spin" />
                            </span>
                            <span v-else class="mr-2">
                                <Download class="w-4 h-4" />
                            </span>
                            {{ isLoading.inventory ? t('downloadReportsPage.generating') : t('downloadReportsPage.download') }}
                        </button>
                    </div>
                </div>

                <!-- Customer Report -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">{{ t('downloadReportsPage.reports.customers.title') }}</h3>
                            <p class="text-sm text-gray-600 mt-1">{{ t('downloadReportsPage.reports.customers.description') }}</p>
                        </div>
                        <button @click="downloadReport('customers')" :disabled="isLoading.customers"
                            class="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition duration-150 disabled:opacity-50">
                            <span v-if="isLoading.customers" class="mr-2">
                                <RefreshCcw class="w-4 h-4 animate-spin" />
                            </span>
                            <span v-else class="mr-2">
                                <Download class="w-4 h-4" />
                            </span>
                            {{ isLoading.customers ? t('downloadReportsPage.generating') : t('downloadReportsPage.download') }}
                        </button>
                    </div>
                </div>

                <!-- Financial Report -->
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">{{ t('downloadReportsPage.reports.financial.title') }}</h3>
                            <p class="text-sm text-gray-600 mt-1">{{ t('downloadReportsPage.reports.financial.description') }}</p>
                        </div>
                        <button @click="downloadReport('financial')" :disabled="isLoading.financial"
                            class="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition duration-150 disabled:opacity-50">
                            <span v-if="isLoading.financial" class="mr-2">
                                <RefreshCcw class="w-4 h-4 animate-spin" />
                            </span>
                            <span v-else class="mr-2">
                                <Download class="w-4 h-4" />
                            </span>
                            {{ isLoading.financial ? t('downloadReportsPage.generating') : t('downloadReportsPage.download') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Report Preview -->
            <div v-if="currentReport" class="mt-8">
                <div class="bg-white rounded-lg shadow">
                    <ReportViewer :reportData="currentReport" :reportType="currentReportType"
                        :key="`${currentReportType}-${Date.now()}`" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSellerStore } from '../store/sellerStore';
import { ArrowLeft, Download, RefreshCcw, ChevronDown } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import ReportViewer from './ReportViewer.vue';

export default {
    name: 'DownloadReports',
    components: {
        ArrowLeft,
        Download,
        ReportViewer,
        RefreshCcw,
        ChevronDown
    },
    setup() {
        const { t } = useI18n();
        const router = useRouter();
        const sellerStore = useSellerStore();
        const dateRange = ref('month');
        const customDateRange = ref({
            startDate: '',
            endDate: ''
        });
        const isLoading = ref({
            sales: false,
            inventory: false,
            customers: false,
            financial: false
        });

        // Report preview state
        const currentReport = ref(null);
        const currentReportType = ref(null);

        // Add watchers for debugging
        watch(currentReport, (newVal) => {
            console.log('[Report Preview] Current report updated:', newVal);
        }, { deep: true });

        watch(currentReportType, (newVal) => {
            console.log('[Report Preview] Report type updated:', newVal);
        });

        const downloadReport = async (reportType) => {
            console.log(`[Report] Starting download for ${reportType} report`);
            isLoading.value[reportType] = true;

            try {
                const dateParams = dateRange.value === 'custom'
                    ? { startDate: customDateRange.value.startDate, endDate: customDateRange.value.endDate }
                    : { period: dateRange.value };

                console.log('[Report] Requesting report with params:', dateParams);
                const response = await sellerStore.downloadReport(reportType, dateParams);
                console.log('[Report] Received response:', response);

                if (!response.data) {
                    throw new Error(t('downloadReportsPage.toasts.noReportData'));
                }

                // Force clean state before setting new data
                currentReport.value = null;
                currentReportType.value = null;

                // Wait for next tick before setting new data
                await nextTick();

                // Update preview state with new data
                currentReport.value = response.data;
                currentReportType.value = reportType;

                console.log('[Report Preview] Setting report data:', {
                    type: reportType,
                    data: response.data
                });

                // Create download file
                const reportData = JSON.stringify(response.data, null, 2);
                const fileName = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
                const blob = new Blob([reportData], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success(t('downloadReportsPage.toasts.downloaded', {
                    reportType: t(`downloadReportsPage.reportTypeLabels.${reportType}`)
                }));
            } catch (error) {
                console.error(`[Report] Error:`, error);
                toast.error(error.message || t('downloadReportsPage.toasts.downloadFailed', {
                    reportType: t(`downloadReportsPage.reportTypeLabels.${reportType}`)
                }));
                currentReport.value = null;
                currentReportType.value = null;
            } finally {
                isLoading.value[reportType] = false;
            }
        };

        return {
            router,
            dateRange,
            customDateRange,
            isLoading,
            downloadReport,
            currentReport,
            currentReportType,
            t
        };
    }
};
</script>

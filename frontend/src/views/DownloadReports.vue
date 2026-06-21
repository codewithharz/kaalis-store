<template>
    <div class="min-h-screen bg-slate-50/50 py-6 sm:py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- Header with Back Button -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <button @click="router.back()"
                    class="flex items-center text-slate-600 hover:text-[#ff934b] hover:bg-[#ff934b]/5 px-3 py-2 rounded-xl transition-all duration-200 w-fit active:scale-95"
                >
                    <ArrowLeft class="w-4 h-4 mr-2" />
                    <span class="text-sm font-bold">{{ t('downloadReportsPage.backToDashboard') }}</span>
                </button>
                
                <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <!-- Date Range Selector -->
                    <div class="relative">
                        <select
                            class="appearance-none w-full sm:w-48 bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all cursor-pointer shadow-sm hover:bg-slate-50/50"
                            v-model="dateRange"
                        >
                            <option value="today">{{ t('downloadReportsPage.dateRanges.today') }}</option>
                            <option value="week">{{ t('downloadReportsPage.dateRanges.thisWeek') }}</option>
                            <option value="month">{{ t('downloadReportsPage.dateRanges.thisMonth') }}</option>
                            <option value="year">{{ t('downloadReportsPage.dateRanges.thisYear') }}</option>
                            <option value="custom">{{ t('downloadReportsPage.dateRanges.customRange') }}</option>
                        </select>
                        <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown class="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Custom Date Range (shown when custom is selected) -->
            <div v-if="dateRange === 'custom'" class="mb-6 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t('downloadReportsPage.startDate') }}</label>
                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                            <input type="date" v-model="customDateRange.startDate"
                                class="w-full px-4 py-2.5 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-semibold cursor-pointer" />
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t('downloadReportsPage.endDate') }}</label>
                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                            <input type="date" v-model="customDateRange.endDate"
                                class="w-full px-4 py-2.5 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-semibold cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Report Types Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Sales Report -->
                <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="flex items-start gap-4">
                        <div class="p-3 bg-[#ff934b]/10 text-[#ff934b] rounded-xl shrink-0 group-hover:bg-[#ff934b] group-hover:text-white transition-all duration-300">
                            <DollarSign class="w-6 h-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-base font-bold text-slate-800 tracking-tight">{{ t('downloadReportsPage.reports.sales.title') }}</h3>
                            <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ t('downloadReportsPage.reports.sales.description') }}</p>
                        </div>
                    </div>
                    <div class="mt-6 flex flex-wrap sm:flex-nowrap gap-3 justify-end">
                        <!-- Preview Button -->
                        <button @click="generateReport('sales', false)" :disabled="isPreviewing.sales || isLoading.sales"
                            class="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-[#ff934b] hover:border-[#ff934b] rounded-xl font-bold active:scale-95 transition-all duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span v-if="isPreviewing.sales" class="animate-spin">
                                <RefreshCcw class="w-3.5 h-3.5" />
                            </span>
                            <span v-else>
                                <Eye class="w-3.5 h-3.5" />
                            </span>
                            <span>{{ isPreviewing.sales ? t('downloadReportsPage.previewing') : t('downloadReportsPage.preview') }}</span>
                        </button>

                        <!-- Download Button -->
                        <button @click="generateReport('sales', true)" :disabled="isPreviewing.sales || isLoading.sales"
                            class="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span v-if="isLoading.sales" class="animate-spin">
                                <RefreshCcw class="w-3.5 h-3.5" />
                            </span>
                            <span v-else>
                                <Download class="w-3.5 h-3.5" />
                            </span>
                            <span>{{ isLoading.sales ? t('downloadReportsPage.generating') : t('downloadReportsPage.download') }}</span>
                        </button>
                    </div>
                </div>

                <!-- Inventory Report -->
                <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="flex items-start gap-4">
                        <div class="p-3 bg-[#ff934b]/10 text-[#ff934b] rounded-xl shrink-0 group-hover:bg-[#ff934b] group-hover:text-white transition-all duration-300">
                            <Package class="w-6 h-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-base font-bold text-slate-800 tracking-tight">{{ t('downloadReportsPage.reports.inventory.title') }}</h3>
                            <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ t('downloadReportsPage.reports.inventory.description') }}</p>
                        </div>
                    </div>
                    <div class="mt-6 flex flex-wrap sm:flex-nowrap gap-3 justify-end">
                        <!-- Preview Button -->
                        <button @click="generateReport('inventory', false)" :disabled="isPreviewing.inventory || isLoading.inventory"
                            class="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-[#ff934b] hover:border-[#ff934b] rounded-xl font-bold active:scale-95 transition-all duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span v-if="isPreviewing.inventory" class="animate-spin">
                                <RefreshCcw class="w-3.5 h-3.5" />
                            </span>
                            <span v-else>
                                <Eye class="w-3.5 h-3.5" />
                            </span>
                            <span>{{ isPreviewing.inventory ? t('downloadReportsPage.previewing') : t('downloadReportsPage.preview') }}</span>
                        </button>

                        <!-- Download Button -->
                        <button @click="generateReport('inventory', true)" :disabled="isPreviewing.inventory || isLoading.inventory"
                            class="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span v-if="isLoading.inventory" class="animate-spin">
                                <RefreshCcw class="w-3.5 h-3.5" />
                            </span>
                            <span v-else>
                                <Download class="w-3.5 h-3.5" />
                            </span>
                            <span>{{ isLoading.inventory ? t('downloadReportsPage.generating') : t('downloadReportsPage.download') }}</span>
                        </button>
                    </div>
                </div>

                <!-- Customer Report -->
                <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="flex items-start gap-4">
                        <div class="p-3 bg-[#ff934b]/10 text-[#ff934b] rounded-xl shrink-0 group-hover:bg-[#ff934b] group-hover:text-white transition-all duration-300">
                            <Users class="w-6 h-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-base font-bold text-slate-800 tracking-tight">{{ t('downloadReportsPage.reports.customers.title') }}</h3>
                            <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ t('downloadReportsPage.reports.customers.description') }}</p>
                        </div>
                    </div>
                    <div class="mt-6 flex flex-wrap sm:flex-nowrap gap-3 justify-end">
                        <!-- Preview Button -->
                        <button @click="generateReport('customers', false)" :disabled="isPreviewing.customers || isLoading.customers"
                            class="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-[#ff934b] hover:border-[#ff934b] rounded-xl font-bold active:scale-95 transition-all duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span v-if="isPreviewing.customers" class="animate-spin">
                                <RefreshCcw class="w-3.5 h-3.5" />
                            </span>
                            <span v-else>
                                <Eye class="w-3.5 h-3.5" />
                            </span>
                            <span>{{ isPreviewing.customers ? t('downloadReportsPage.previewing') : t('downloadReportsPage.preview') }}</span>
                        </button>

                        <!-- Download Button -->
                        <button @click="generateReport('customers', true)" :disabled="isPreviewing.customers || isLoading.customers"
                            class="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span v-if="isLoading.customers" class="animate-spin">
                                <RefreshCcw class="w-3.5 h-3.5" />
                            </span>
                            <span v-else>
                                <Download class="w-3.5 h-3.5" />
                            </span>
                            <span>{{ isLoading.customers ? t('downloadReportsPage.generating') : t('downloadReportsPage.download') }}</span>
                        </button>
                    </div>
                </div>

                <!-- Financial Report -->
                <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="flex items-start gap-4">
                        <div class="p-3 bg-[#ff934b]/10 text-[#ff934b] rounded-xl shrink-0 group-hover:bg-[#ff934b] group-hover:text-white transition-all duration-300">
                            <CreditCard class="w-6 h-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-base font-bold text-slate-800 tracking-tight">{{ t('downloadReportsPage.reports.financial.title') }}</h3>
                            <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ t('downloadReportsPage.reports.financial.description') }}</p>
                        </div>
                    </div>
                    <div class="mt-6 flex flex-wrap sm:flex-nowrap gap-3 justify-end">
                        <!-- Preview Button -->
                        <button @click="generateReport('financial', false)" :disabled="isPreviewing.financial || isLoading.financial"
                            class="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-[#ff934b] hover:border-[#ff934b] rounded-xl font-bold active:scale-95 transition-all duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span v-if="isPreviewing.financial" class="animate-spin">
                                <RefreshCcw class="w-3.5 h-3.5" />
                            </span>
                            <span v-else>
                                <Eye class="w-3.5 h-3.5" />
                            </span>
                            <span>{{ isPreviewing.financial ? t('downloadReportsPage.previewing') : t('downloadReportsPage.preview') }}</span>
                        </button>

                        <!-- Download Button -->
                        <button @click="generateReport('financial', true)" :disabled="isPreviewing.financial || isLoading.financial"
                            class="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-200 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span v-if="isLoading.financial" class="animate-spin">
                                <RefreshCcw class="w-3.5 h-3.5" />
                            </span>
                            <span v-else>
                                <Download class="w-3.5 h-3.5" />
                            </span>
                            <span>{{ isLoading.financial ? t('downloadReportsPage.generating') : t('downloadReportsPage.download') }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Report Preview -->
            <div v-if="currentReport" class="mt-8">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
import { ArrowLeft, Download, Eye, RefreshCcw, ChevronDown, DollarSign, Package, Users, CreditCard } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import ReportViewer from './ReportViewer.vue';

export default {
    name: 'DownloadReports',
    components: {
        ArrowLeft,
        Download,
        Eye,
        ReportViewer,
        RefreshCcw,
        ChevronDown,
        DollarSign,
        Package,
        Users,
        CreditCard
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
        const isPreviewing = ref({
            sales: false,
            inventory: false,
            customers: false,
            financial: false
        });

        // Report preview state
        const currentReport = ref(null);
        const currentReportType = ref(null);

        // Watchers for debugging
        watch(currentReport, (newVal) => {
            console.log('[Report Preview] Current report updated:', newVal);
        }, { deep: true });

        watch(currentReportType, (newVal) => {
            console.log('[Report Preview] Report type updated:', newVal);
        });

        const generateReport = async (reportType, forceDownload = false) => {
            console.log(`[Report] Starting ${forceDownload ? 'download' : 'preview'} for ${reportType} report`);
            if (forceDownload) {
                isLoading.value[reportType] = true;
            } else {
                isPreviewing.value[reportType] = true;
            }

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

                if (forceDownload) {
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
                } else {
                    toast.success(t('downloadReportsPage.toasts.previewLoaded', {
                        reportType: t(`downloadReportsPage.reportTypeLabels.${reportType}`)
                    }));
                }
            } catch (error) {
                console.error(`[Report] Error:`, error);
                const translationKey = forceDownload ? 'downloadFailed' : 'previewFailed';
                toast.error(error.message || t(`downloadReportsPage.toasts.${translationKey}`, {
                    reportType: t(`downloadReportsPage.reportTypeLabels.${reportType}`)
                }));
                currentReport.value = null;
                currentReportType.value = null;
            } finally {
                if (forceDownload) {
                    isLoading.value[reportType] = false;
                } else {
                    isPreviewing.value[reportType] = false;
                }
            }
        };

        return {
            router,
            dateRange,
            customDateRange,
            isLoading,
            isPreviewing,
            generateReport,
            currentReport,
            currentReportType,
            t
        };
    }
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera: hide date input default picker indicators */
input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 0.9;
}
</style>

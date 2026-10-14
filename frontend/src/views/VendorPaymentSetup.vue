<!-- frontend/src/views/VendorPaymentSetup.vue -->
<template>
    <div class="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-8 lg:px-12">

        <!-- ===== Currency Toggle ===== -->
        <div class="flex items-center justify-end gap-2">
            <span class="text-xs text-gray-500 font-medium">{{ t('vendorPaymentSetupPage.viewIn') }}</span>
            <div class="inline-flex bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                <button v-for="cur in availableCurrencies" :key="cur"
                    @click="activeCurrency = cur"
                    :class="[
                        'px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200',
                        activeCurrency === cur
                            ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100'
                            : 'text-gray-500 hover:text-gray-700'
                    ]">
                    {{ cur === 'XOF' ? 'XOF (CFA)' : 'NGN (₦)' }}
                </button>
            </div>
        </div>

        <!-- ===== Stats Cards ===== -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <!-- Pending Payout -->
            <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.pendingPayout') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.pendingAmounts) || vendorPayoutStore.pendingAmount, activeCurrency) }}
                        </p>
                    </div>
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <CircleDollarSign class="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    </div>
                </div>
            </div>

            <!-- Processed Payouts -->
            <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.processedPayouts') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.processedAmounts), activeCurrency) }}
                        </p>
                    </div>
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <CircleDollarSign class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                </div>
            </div>

            <!-- Total Sales -->
            <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20 sm:col-span-2 lg:col-span-1">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.totalSales') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.salesAmounts), activeCurrency) }}
                        </p>
                    </div>
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0">
                        <CreditCard class="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                    </div>
                </div>
            </div>

            <!-- Seller Earnings -->
            <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.sellerEarnings') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.vendorEarnings), activeCurrency) }}
                        </p>
                    </div>
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <CircleDollarSign class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    </div>
                </div>
            </div>

            <!-- Order Count -->
            <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.completedOrders') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900">
                            {{ currencyStat(vendorPayoutStore.orderCounts) }}
                        </p>
                    </div>
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <History class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                </div>
            </div>

            <!-- Platform Fees -->
            <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.platformFees') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                            {{ formatCurrency(currencyStat(vendorPayoutStore.platformFeeAmounts), activeCurrency) }}
                        </p>
                    </div>
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Percent class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                </div>
            </div>

            <!-- Next Payout -->
            <div class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20 sm:col-span-2 xl:col-span-3">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm text-gray-500">{{ t('vendorPaymentSetupPage.stats.nextPayout') }}</p>
                        <p class="text-base sm:text-lg font-medium text-gray-900 break-words">{{ nextPayoutText }}</p>
                    </div>
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Calendar class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== Failed Payout Remediation Banner ===== -->
        <div v-if="showFailedBanner"
            class="flex flex-col sm:flex-row items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl relative">
            <!-- Dismiss button -->
            <button @click="dismissFailedBanner"
                class="absolute top-3 right-3 p-1 text-red-300 hover:text-red-600 transition-colors rounded-full hover:bg-red-100"
                :title="t('vendorPaymentSetupPage.failedBanner.dismiss')">
                <X class="w-4 h-4" />
            </button>
            <AlertTriangle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div class="flex-1 min-w-0 pr-6">
                <p class="text-sm font-semibold text-red-800">{{ t('vendorPaymentSetupPage.failedBanner.title') }}</p>
                <p class="text-xs text-red-700 mt-0.5">{{ t('vendorPaymentSetupPage.failedBanner.subtitle') }}</p>
                <ul class="mt-2 space-y-1 text-xs text-red-700 list-disc list-inside">
                    <li>{{ t('vendorPaymentSetupPage.failedBanner.tip1') }}</li>
                    <li>{{ t('vendorPaymentSetupPage.failedBanner.tip2') }}</li>
                    <li>{{ t('vendorPaymentSetupPage.failedBanner.tip3') }}</li>
                </ul>
                <button @click="redirectToBankSetup" class="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-900 underline underline-offset-2 transition-colors">
                    <Settings2 class="w-3.5 h-3.5" />
                    {{ t('vendorPaymentSetupPage.failedBanner.cta') }}
                </button>
            </div>
        </div>

        <!-- ===== Bank Account Setup ===== -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div class="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 class="text-xl sm:text-2xl font-semibold text-gray-900">{{ t('vendorPaymentSetupPage.title') }}</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ t('vendorPaymentSetupPage.subtitle') }}</p>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ t('vendorPaymentSetupPage.adminReleaseNote') }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button v-if="!hasPayoutSetup" @click="redirectToBankSetup"
                            class="group w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-indigo-500/25 text-sm sm:text-base">
                            <span class="hidden sm:inline">{{ setupButtonText }}</span>
                            <span class="sm:hidden">{{ t('vendorPaymentSetupPage.setupAccount') }}</span>
                        </button>
                        <button v-else @click="redirectToBankSetup"
                            class="w-full sm:w-auto px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1.5 shadow-sm">
                            <Settings2 class="w-4 h-4 text-gray-500" />
                            <span>{{ t('vendorPaymentSetupPage.changeAccount') }}</span>
                        </button>
                    </div>
                </div>

                <div v-if="hasPayoutSetup"
                    class="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl border border-gray-200">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                        <div class="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                            <component :is="isAfriExchangeMode ? Wallet : CreditCard" class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-medium text-gray-900 text-sm sm:text-base">{{ connectedTitle }}</p>
                            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1.5">
                                <div v-if="!isAfriExchangeMode" class="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                                    <div class="flex items-center gap-1.5">
                                        <Building2 class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span class="truncate">{{ bankNameDisplay }}</span>
                                        <span v-if="bankAccountLast4">•••• {{ bankAccountLast4 }}</span>
                                    </div>
                                    <div v-if="bankAccountNameDisplay" class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                                        <UserCheckIcon class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span class="truncate">{{ displayAccountName(bankAccountNameDisplay) }}</span>
                                    </div>
                                </div>
                                <div v-else class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                    <div class="flex items-center gap-1.5">
                                        <Wallet class="w-3.5 h-3.5 flex-shrink-0 text-indigo-600" />
                                        <span class="font-medium text-gray-700 truncate">{{ afriExchangeIdentifier }}</span>
                                    </div>
                                    <div v-if="userStore.user?.afriExchange?.walletAddress" class="flex items-center gap-1.5 text-xs text-gray-500">
                                        <span class="text-gray-400 font-medium">{{ t('vendorPaymentSetupPage.walletAddress') }}:</span>
                                        <span class="font-mono text-gray-600 bg-white/70 px-1.5 py-0.5 rounded border border-gray-200/60">{{ formatTruncatedAddress(userStore.user.afriExchange.walletAddress) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== Payout History ===== -->
            <div class="p-4 sm:p-6 lg:p-8">
                <!-- Header: title + export + refresh -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                    <h4 class="text-xl sm:text-2xl font-semibold text-gray-900">{{ t('vendorPaymentSetupPage.recentPayouts') }}</h4>
                    <div class="flex items-center gap-2 flex-wrap">
                        <!-- Export CSV -->
                        <button v-if="vendorPayoutStore.payouts.length"
                            @click="exportCSV"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors">
                            <Download class="w-3.5 h-3.5" />
                            {{ t('vendorPaymentSetupPage.exportCsv') }}
                        </button>
                        <!-- Refresh -->
                        <button @click="refreshPayouts" :disabled="vendorPayoutStore.isLoading"
                            class="inline-flex items-center gap-1.5 text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50 transition-colors">
                            <RefreshCcw class="w-3.5 h-3.5" :class="{ 'animate-spin': vendorPayoutStore.isLoading }" />
                            <span>{{ t('vendorPaymentSetupPage.refresh') }}</span>
                        </button>
                    </div>
                </div>

                <!-- Status filters + search -->
                <div class="flex flex-col sm:flex-row gap-3 mb-4">
                    <!-- Status pills -->
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <button v-for="pill in statusFilters" :key="pill.value"
                            @click="activeStatusFilter = pill.value"
                            :class="[
                                'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                                activeStatusFilter === pill.value
                                    ? pill.activeClass
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            ]">
                            {{ pill.label }}
                            <span v-if="pill.count !== undefined" class="ml-1 opacity-70">({{ pill.count }})</span>
                        </button>
                    </div>
                    <!-- Search -->
                    <div class="relative flex-1 min-w-0 sm:max-w-xs ml-auto">
                        <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input v-model="searchQuery" type="text"
                            :placeholder="t('vendorPaymentSetupPage.searchPlaceholder')"
                            class="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 bg-white" />
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="vendorPayoutStore.isLoading" class="text-center py-8 sm:py-12">
                    <Loader2 class="w-8 h-8 sm:w-10 sm:h-10 animate-spin mx-auto text-indigo-600 mb-3 sm:mb-4" />
                    <p class="text-gray-500 text-sm sm:text-base">{{ t('vendorPaymentSetupPage.loadingPayouts') }}</p>
                </div>

                <!-- Payouts Table -->
                <div v-else-if="filteredPayouts.length" class="overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr class="text-left">
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.date') }}</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.amount') }}</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.currency') }}</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.status') }}</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.order') }}</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">{{ t('vendorPaymentSetupPage.columns.reference') }}</th>
                                    <th scope="col" class="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="payout in paginatedPayouts" :key="payout._id"
                                    class="hover:bg-gray-50 transition-colors cursor-pointer group"
                                    @click="openBreakdown(payout)">
                                    <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                        {{ formatDate(getPayoutDisplayDate(payout)) }}
                                    </td>
                                    <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                                        {{ formatCurrency(payout.amount, payout.currency) }}
                                    </td>
                                    <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                            :class="(payout.currency || 'NGN') === 'XOF' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'">
                                            {{ payout.currency || 'NGN' }}
                                        </span>
                                    </td>
                                    <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                        <span :class="getStatusClass(payout.status)" class="inline-flex items-center">
                                            <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2" :class="{
                                                'bg-yellow-400': String(payout.status || '').toLowerCase() === 'pending',
                                                'bg-purple-400': String(payout.status || '').toLowerCase() === 'aggregating',
                                                'bg-blue-400': String(payout.status || '').toLowerCase() === 'processing',
                                                'bg-green-400': ['processed', 'completed'].includes(String(payout.status || '').toLowerCase()),
                                                'bg-red-400': String(payout.status || '').toLowerCase() === 'failed'
                                            }"></span>
                                            {{ getPayoutStatusLabel(payout) }}
                                        </span>
                                        <!-- Failed: inline error hint -->
                                        <div v-if="String(payout.status || '').toLowerCase() === 'failed' && payout.errorMessage"
                                            class="text-xs text-red-500 mt-0.5 max-w-[160px] truncate" :title="payout.errorMessage">
                                            {{ payout.errorMessage }}
                                        </div>
                                    </td>
                                    <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                        <span v-if="payout.orderId" class="inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                                            <ShoppingBag class="w-3.5 h-3.5 flex-shrink-0" />
                                            <span class="truncate max-w-[80px]">{{ payout.orderId?.orderNumber || '—' }}</span>
                                        </span>
                                        <span v-else class="text-gray-400">—</span>
                                    </td>
                                    <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-gray-500">
                                        <div class="inline-flex items-center gap-1.5 group/ref">
                                            <span class="truncate max-w-[120px] sm:max-w-[180px]">{{ getPayoutReference(payout) }}</span>
                                            <button v-if="getPayoutReference(payout) !== '—'" @click.stop="copyReference(getPayoutReference(payout))"
                                                type="button"
                                                class="opacity-0 group-hover/ref:opacity-100 p-1 text-gray-400 hover:text-indigo-600 transition-opacity"
                                                :title="t('vendorPaymentSetupPage.toasts.copied')">
                                                <Copy class="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                                        <button @click.stop="openBreakdown(payout)"
                                            class="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-all">
                                            <BarChart2 class="w-3.5 h-3.5" />
                                            {{ t('vendorPaymentSetupPage.breakdown') }}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div v-if="payoutTotalPages > 1"
                        class="flex items-center justify-between gap-3 border-t border-gray-100 px-2 py-4 sm:px-0">
                        <p class="text-xs sm:text-sm text-gray-500">
                            {{ payoutPaginationStart + 1 }}-{{ payoutPaginationEnd }} of {{ filteredPayouts.length }}
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

                <!-- No results for filter -->
                <div v-else-if="vendorPayoutStore.payouts.length && !filteredPayouts.length" class="text-center py-8 sm:py-12">
                    <Search class="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">{{ t('vendorPaymentSetupPage.noResults.title') }}</h3>
                    <p class="text-gray-500 text-sm sm:text-base">{{ t('vendorPaymentSetupPage.noResults.subtitle') }}</p>
                    <button @click="clearFilters" class="mt-3 text-xs text-indigo-600 hover:underline">
                        {{ t('vendorPaymentSetupPage.clearFilters') }}
                    </button>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8 sm:py-12">
                    <History class="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">{{ t('vendorPaymentSetupPage.empty.title') }}</h3>
                    <p class="text-gray-500 text-sm sm:text-base">{{ t('vendorPaymentSetupPage.empty.subtitle') }}</p>
                </div>
            </div>
        </div>

        <!-- ===== Payout Breakdown Modal ===== -->
        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="breakdownPayout"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4"
                    @click.self="breakdownPayout = null">
                    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
                        <!-- Modal header -->
                        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                            <div>
                                <h3 class="font-semibold text-gray-900">{{ t('vendorPaymentSetupPage.modal.title') }}</h3>
                                <p v-if="breakdownPayout.orderId?.orderNumber" class="text-xs text-gray-500 mt-0.5">
                                    {{ t('vendorPaymentSetupPage.modal.order') }} #{{ breakdownPayout.orderId.orderNumber }}
                                </p>
                            </div>
                            <button @click="breakdownPayout = null"
                                class="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="px-6 py-5 space-y-4">
                            <!-- Status -->
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">{{ t('vendorPaymentSetupPage.columns.status') }}</span>
                                <span :class="getStatusClass(breakdownPayout.status)" class="inline-flex items-center">
                                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                                        'bg-yellow-400': String(breakdownPayout.status || '').toLowerCase() === 'pending',
                                        'bg-blue-400': String(breakdownPayout.status || '').toLowerCase() === 'processing',
                                        'bg-green-400': ['processed', 'completed'].includes(String(breakdownPayout.status || '').toLowerCase()),
                                        'bg-red-400': String(breakdownPayout.status || '').toLowerCase() === 'failed'
                                    }"></span>
                                    {{ getPayoutStatusLabel(breakdownPayout) }}
                                </span>
                            </div>

                            <!-- Date -->
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500">{{ t('vendorPaymentSetupPage.columns.date') }}</span>
                                <span class="text-sm font-medium text-gray-900">{{ formatDate(getPayoutDisplayDate(breakdownPayout)) }}</span>
                            </div>

                            <!-- Breakdown rows -->
                            <div class="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-600">{{ t('vendorPaymentSetupPage.modal.grossSale') }}</span>
                                    <span class="font-medium text-gray-900">{{ formatCurrency(breakdownGross, breakdownPayout.currency || activeCurrency) }}</span>
                                </div>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-600 flex items-center gap-1">
                                        <Percent class="w-3.5 h-3.5 text-gray-400" />
                                        {{ t('vendorPaymentSetupPage.modal.platformFee') }} ({{ vendorPayoutStore.platformFee }}%)
                                    </span>
                                    <span class="font-medium text-red-600">- {{ formatCurrency(breakdownFee, breakdownPayout.currency || activeCurrency) }}</span>
                                </div>
                                <div class="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between text-sm">
                                    <span class="font-semibold text-gray-800">{{ t('vendorPaymentSetupPage.modal.netPayout') }}</span>
                                    <span class="font-bold text-indigo-700 text-base">{{ formatCurrency(breakdownPayout.amount, breakdownPayout.currency || activeCurrency) }}</span>
                                </div>
                            </div>

                            <!-- Payment method -->
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-500">{{ t('vendorPaymentSetupPage.modal.method') }}</span>
                                <span class="font-medium text-gray-900 capitalize">{{ breakdownPayout.paymentMethod || '—' }}</span>
                            </div>

                            <!-- Reference -->
                            <div v-if="getPayoutReference(breakdownPayout) !== '—'" class="flex items-start justify-between gap-3 text-sm">
                                <span class="text-gray-500 flex-shrink-0">{{ t('vendorPaymentSetupPage.columns.reference') }}</span>
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <span class="font-mono text-xs text-gray-700 truncate">{{ getPayoutReference(breakdownPayout) }}</span>
                                    <button @click="copyReference(getPayoutReference(breakdownPayout))"
                                        class="flex-shrink-0 p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                                        <Copy class="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <!-- Error message for failed -->
                            <div v-if="String(breakdownPayout.status || '').toLowerCase() === 'failed' && breakdownPayout.errorMessage"
                                class="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
                                <p class="font-semibold mb-1">{{ t('vendorPaymentSetupPage.modal.failureReason') }}</p>
                                <p>{{ breakdownPayout.errorMessage }}</p>
                            </div>
                        </div>
                        <!-- Modal footer -->
                        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button @click="breakdownPayout = null"
                                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                                {{ t('vendorPaymentSetupPage.modal.close') }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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
    RefreshCcw,
    Wallet,
    Copy,
    Settings2,
    AlertTriangle,
    Download,
    Search,
    X,
    BarChart2,
    ShoppingBag,
} from 'lucide-vue-next';
import { useVendorPayoutStore } from '../store/vendorPayoutStore';
import { useUserStore } from '../store/user';
import { useCountryStore } from '../store/countryStore';
import { toast } from 'vue-sonner';

const router = useRouter();
const { t, te, locale } = useI18n();
const vendorPayoutStore = useVendorPayoutStore();
const userStore = useUserStore();
const countryStore = useCountryStore();

// ─── Currency toggle ──────────────────────────────────────────────────────────
const isAfriExchangeMode = computed(() => {
    return countryStore.isXofCountry || userStore.user?.currency === 'XOF' || userStore.user?.paymentMethod === 'AfriExchange';
});

// Derive available currencies from actual payout data + user mode
const availableCurrencies = computed(() => {
    const curs = new Set();
    // Always add user's home currency first
    curs.add(isAfriExchangeMode.value ? 'XOF' : 'NGN');
    // Add any currency present in stats
    const allStats = [
        vendorPayoutStore.pendingAmounts,
        vendorPayoutStore.processedAmounts,
        vendorPayoutStore.salesAmounts,
    ];
    allStats.forEach(s => Object.keys(s || {}).forEach(c => curs.add(c)));
    return [...curs];
});

const activeCurrency = ref(isAfriExchangeMode.value ? 'XOF' : 'NGN');

// Keep activeCurrency in sync if mode changes
watch(isAfriExchangeMode, (val) => {
    activeCurrency.value = val ? 'XOF' : 'NGN';
});

const currencyStat = (statsByCurrency = {}) => {
    return statsByCurrency?.[activeCurrency.value] || 0;
};

// ─── Payout account setup ─────────────────────────────────────────────────────
const hasPaystackSetup = computed(() => {
    return !!(
        userStore.user?.paystack?.recipientCode ||
        userStore.user?.paystack?.accountNumber ||
        (userStore.user?.bankDetails?.accountNumber && userStore.user?.bankDetails?.bankCode)
    );
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

const bankNameDisplay = computed(() => {
    return (
        userStore.user?.paystack?.bankName ||
        userStore.user?.bankDetails?.bankName ||
        t('vendorPaymentSetupPage.bankAccount')
    );
});

const bankAccountLast4 = computed(() => {
    const num = userStore.user?.paystack?.accountNumber || userStore.user?.bankDetails?.accountNumber;
    return num ? String(num).slice(-4) : '';
});

const bankAccountNameDisplay = computed(() => {
    return userStore.user?.paystack?.accountName || userStore.user?.bankDetails?.accountName || '';
});

const formatTruncatedAddress = (addr) => {
    if (!addr) return '';
    if (addr.length <= 14) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

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

// ─── Next payout ─────────────────────────────────────────────────────────────
const nextPayoutText = computed(() => {
    if (vendorPayoutStore.nextPayoutDate) {
        return formatDate(vendorPayoutStore.nextPayoutDate);
    }
    if (vendorPayoutStore.stats.nextPayoutStatus === 'aggregating') {
        return t('vendorPaymentSetupPage.aggregatingThreshold');
    }
    if (currencyStat(vendorPayoutStore.processingAmounts) > 0) {
        return `${t('vendorPaymentSetupPage.statuses.processing')} (${formatCurrency(currencyStat(vendorPayoutStore.processingAmounts), activeCurrency.value)})`;
    }
    return t('vendorPaymentSetupPage.notScheduled');
});

// ─── Failed payout banner ─────────────────────────────────────────────────────
// Gate on a session flag — banner can ONLY appear after OUR fetch resolves,
// never from stale Pinia state carried over from a previous page visit.
const dataFetchedThisSession = ref(false);

const hasFailedPayouts = computed(() => {
    if (!dataFetchedThisSession.value) return false; // not our data yet
    return vendorPayoutStore.payouts.some(p => String(p.status || '').toLowerCase() === 'failed');
});

const BANNER_DISMISS_KEY = 'kaalis_failed_payout_banner_dismissed';
const bannerDismissed = ref(false);

const initBannerDismiss = () => {
    bannerDismissed.value = localStorage.getItem(BANNER_DISMISS_KEY) === 'true';
};

const dismissFailedBanner = () => {
    bannerDismissed.value = true;
    localStorage.setItem(BANNER_DISMISS_KEY, 'true');
};

// showFailedBanner: only after data is loaded AND not dismissed
const showFailedBanner = computed(() => hasFailedPayouts.value && !bannerDismissed.value);


// ─── Status filters + search ──────────────────────────────────────────────────
const activeStatusFilter = ref('all');
const searchQuery = ref('');

const statusCountMap = computed(() => {
    const map = { all: vendorPayoutStore.payouts.length };
    vendorPayoutStore.payouts.forEach(p => {
        const s = String(p.status || '').toLowerCase();
        map[s] = (map[s] || 0) + 1;
    });
    return map;
});

const statusFilters = computed(() => [
    { value: 'all', label: t('vendorPaymentSetupPage.filters.all'), count: statusCountMap.value.all, activeClass: 'bg-gray-800 text-white border-gray-800' },
    { value: 'pending', label: t('vendorPaymentSetupPage.statuses.pending'), count: statusCountMap.value.pending, activeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'processing', label: t('vendorPaymentSetupPage.statuses.processing'), count: statusCountMap.value.processing, activeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'processed', label: t('vendorPaymentSetupPage.statuses.processed'), count: statusCountMap.value.processed, activeClass: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'failed', label: t('vendorPaymentSetupPage.statuses.failed'), count: statusCountMap.value.failed, activeClass: 'bg-red-100 text-red-800 border-red-200' },
].filter(f => f.value === 'all' || (f.count && f.count > 0)));

const filteredPayouts = computed(() => {
    let list = vendorPayoutStore.payouts;
    if (activeStatusFilter.value !== 'all') {
        list = list.filter(p => String(p.status || '').toLowerCase() === activeStatusFilter.value);
    }
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase();
        list = list.filter(p => {
            const ref = getPayoutReference(p).toLowerCase();
            const order = (p.orderId?.orderNumber || '').toLowerCase();
            const amount = String(p.amount || '');
            return ref.includes(q) || order.includes(q) || amount.includes(q);
        });
    }
    return list;
});

const clearFilters = () => {
    activeStatusFilter.value = 'all';
    searchQuery.value = '';
};

// Reset page when filter/search changes
watch([activeStatusFilter, searchQuery], () => {
    payoutCurrentPage.value = 1;
});

// ─── Pagination ───────────────────────────────────────────────────────────────
const payoutCurrentPage = ref(1);
const payoutItemsPerPage = 10;

const payoutTotalPages = computed(() => Math.ceil(filteredPayouts.value.length / payoutItemsPerPage));
const payoutPaginationStart = computed(() => (payoutCurrentPage.value - 1) * payoutItemsPerPage);
const payoutPaginationEnd = computed(() => Math.min(payoutPaginationStart.value + payoutItemsPerPage, filteredPayouts.value.length));

const paginatedPayouts = computed(() => {
    return filteredPayouts.value.slice(payoutPaginationStart.value, payoutPaginationEnd.value);
});

// ─── Breakdown modal ──────────────────────────────────────────────────────────
const breakdownPayout = ref(null);

const openBreakdown = (payout) => {
    breakdownPayout.value = payout;
};

const breakdownGross = computed(() => {
    if (!breakdownPayout.value) return 0;
    const p = breakdownPayout.value;
    // Try to use the linked order's total if populated
    if (p.orderId?.totalAmount) return p.orderId.totalAmount;
    // Otherwise reconstruct: net / (1 - feeRate)
    const feeRate = (vendorPayoutStore.platformFee || 8) / 100;
    return feeRate < 1 ? p.amount / (1 - feeRate) : p.amount;
});

const breakdownFee = computed(() => {
    if (!breakdownPayout.value) return 0;
    const p = breakdownPayout.value;
    if (p.orderId?.platformFee) return p.orderId.platformFee;
    return breakdownGross.value - p.amount;
});

// ─── CSV Export ───────────────────────────────────────────────────────────────
const exportCSV = () => {
    const rows = [
        ['Date', 'Amount', 'Currency', 'Status', 'Order #', 'Reference', 'Payment Method'],
    ];
    filteredPayouts.value.forEach(p => {
        rows.push([
            formatDate(getPayoutDisplayDate(p)),
            p.amount,
            p.currency || activeCurrency.value,
            p.status,
            p.orderId?.orderNumber || '',
            getPayoutReference(p),
            p.paymentMethod || '',
        ]);
    });

    const csvContent = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payout-statement-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t('vendorPaymentSetupPage.toasts.csvExported'));
};

// ─── Actions ──────────────────────────────────────────────────────────────────
const refreshPayouts = async () => {
    try {
        await vendorPayoutStore.fetchPayoutHistory();
    } catch (error) {
        console.error('Failed to refresh payout history:', error);
        toast.error(t('vendorPaymentSetupPage.toasts.loadFailed'));
    }
};

const copyReference = async (ref) => {
    if (!ref || ref === '—') return;
    try {
        await navigator.clipboard.writeText(ref);
        toast.success(t('vendorPaymentSetupPage.toasts.copied'));
    } catch {
        toast.error('Could not copy reference');
    }
};

onMounted(async () => {
    initBannerDismiss();
    try {
        await vendorPayoutStore.fetchPayoutHistory();
    } catch (error) {
        console.error('Failed to fetch payout history:', error);
        toast.error(t('vendorPaymentSetupPage.toasts.loadFailed'));
    } finally {
        // Only after OUR fetch resolves can the banner evaluate
        dataFetchedThisSession.value = true;
        // If the fresh data has real failures, clear any old dismiss so vendor sees it
        if (vendorPayoutStore.payouts.some(p => String(p.status || '').toLowerCase() === 'failed')) {
            bannerDismissed.value = false;
            localStorage.removeItem(BANNER_DISMISS_KEY);
        }
    }
});



const redirectToBankSetup = () => {
    router.push('/account/profile/payout-settings');
};

// ─── Formatters ───────────────────────────────────────────────────────────────
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
    const s = String(status || '').toLowerCase();
    const statusClasses = {
        pending: 'bg-yellow-100 text-yellow-800',
        aggregating: 'bg-purple-100 text-purple-800',
        processing: 'bg-blue-100 text-blue-800',
        processed: 'bg-green-100 text-green-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
    };
    return `${baseClasses} ${statusClasses[s] || statusClasses.pending}`;
};

const isPayoutReady = (payout) => {
    return String(payout?.status || '').toLowerCase() === 'pending' && payout?.scheduledDate && new Date(payout.scheduledDate) <= new Date();
};

const getPayoutStatusLabel = (payout) => {
    if (!payout) return '';
    const s = String(payout.status || '').toLowerCase();
    if (isPayoutReady(payout)) {
        return t('vendorPaymentSetupPage.statuses.ready');
    }
    if (s === 'pending' && payout.scheduledDate) {
        return t('vendorPaymentSetupPage.statuses.scheduled');
    }
    const key = `vendorPaymentSetupPage.statuses.${s}`;
    if (te && te(key)) {
        return t(key);
    }
    return t(key);
};

const getPayoutDisplayDate = (payout) => {
    if (!payout) return null;
    if (payout.status?.toLowerCase() === 'processed' && payout.processedAt) {
        return payout.processedAt;
    }
    if (payout.status?.toLowerCase() === 'processing' && payout.lastStatusCheckedAt) {
        return payout.lastStatusCheckedAt;
    }
    return payout.scheduledDate || payout.createdAt;
};

const getPayoutReference = (payout) => {
    return (
        payout?.transferReference ||
        payout?.transactionReference ||
        payout?.providerPayoutId ||
        payout?.reference ||
        '—'
    );
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
/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .relative {
    transform: translateY(-12px);
    opacity: 0;
}

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

/* Custom scrollbar */
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

/* Animation keyframes */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Table hover effects - Desktop only */
@media (min-width: 769px) {
    .hover\:bg-gray-50:hover {
        background-color: #f9fafb;
    }

    .hover\:shadow-xl:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
}

/* Status classes */
.status-pending { background-color: #fef3c7; color: #92400e; }
.status-processing { background-color: #dbeafe; color: #1e40af; }
.status-processed { background-color: #d1fae5; color: #065f46; }
.status-failed { background-color: #fee2e2; color: #991b1b; }

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Selection styles */
::selection { background-color: #6366f1; color: #ffffff; }

/* Mobile responsive */
@media (max-width: 640px) {
    .rounded-2xl { border-radius: 0.75rem; }
    .rounded-xl { border-radius: 0.5rem; }
    .p-8 { padding: 1rem; }
    .p-6 { padding: 1rem; }
    .gap-6 { gap: 1rem; }
    .gap-4 { gap: 0.75rem; }
    .gap-3 { gap: 0.5rem; }
    table { min-width: 640px; }
}
</style>

<template>
    <div>
        <!-- Header & Actions -->
        <div class="flex flex-col gap-4 mb-3 px-8 py-4 rounded-b-lg bg-white lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ t('adminPayments.title') }}</h2>
                <p class="text-sm text-gray-500">{{ t('adminPayments.subtitle') }}</p>
            </div>
            <div class="flex items-center gap-2">
                <button @click="exportPayments" :disabled="isExporting"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-700 shadow-sm shadow-emerald-100 disabled:cursor-not-allowed disabled:opacity-50">
                    <Download class="h-4 w-4" />
                    <span>{{ isExporting ? t('adminPayments.exporting') : t('adminPayments.exportData') }}</span>
                </button>
                <button @click="showFilters = !showFilters"
                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                    <component :is="showFilters ? FilterX : Filter" class="h-4 w-4 text-slate-500" />
                    <span>{{ showFilters ? t('adminPayments.hideFilters') : t('adminPayments.showFilters') }}</span>
                </button>
            </div>
        </div>

        <!-- Toggleable Filters -->
        <div v-show="showFilters" class="mb-4 rounded-xl bg-white p-5 border border-slate-100 shadow-sm">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <!-- Date Range -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayments.filters.dateRange') }}</label>
                    <div class="relative">
                        <select v-model="filters.dateRange"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="applyFilters">
                            <option value="today">{{ t('adminPayments.dateRanges.today') }}</option>
                            <option value="week">{{ t('adminPayments.dateRanges.week') }}</option>
                            <option value="month">{{ t('adminPayments.dateRanges.month') }}</option>
                            <option value="quarter">{{ t('adminPayments.dateRanges.quarter') }}</option>
                            <option value="year">{{ t('adminPayments.dateRanges.year') }}</option>
                            <option value="all">{{ t('adminPayments.dateRanges.all') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayments.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="applyFilters">
                            <option value="">{{ t('adminPayments.statuses.all') }}</option>
                            <option value="success">{{ t('adminPayments.statuses.success') }}</option>
                            <option value="pending">{{ t('adminPayments.statuses.pending') }}</option>
                            <option value="failed">{{ t('adminPayments.statuses.failed') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Payment Method -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayments.filters.paymentMethod') }}</label>
                    <div class="relative">
                        <select v-model="filters.paymentMethod"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="applyFilters">
                            <option value="">{{ t('adminPayments.methods.all') }}</option>
                            <option value="Paystack">{{ t('adminPayments.methods.paystack') }}</option>
                            <option value="OPay">{{ t('adminPayments.methods.opay') }}</option>
                            <option value="AfriExchange">{{ t('adminPayments.methods.afriexchange') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Currency -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayments.filters.currency') }}</label>
                    <div class="relative">
                        <select v-model="filters.currency"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="applyFilters">
                            <option value="">{{ t('adminPayments.filters.allCurrencies') }}</option>
                            <option value="NGN">NGN</option>
                            <option value="XOF">XOF</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Search -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayments.filters.search') }}</label>
                    <input v-model="filters.search" type="text"
                        :placeholder="t('adminPayments.filters.searchPlaceholder')"
                        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                        @input="handleSearch">
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
                <button type="button"
                    class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                    @click="clearFilters">
                    {{ t('adminPayments.filters.clear') }}
                </button>
            </div>
        </div>

        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="stat in paymentStats" :key="stat.title" 
                class="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">
                <div class="flex items-center gap-4">
                    <div class="rounded-xl p-3 shrink-0" :class="stat.bgColor">
                        <component :is="stat.icon" class="h-5 w-5" :class="stat.iconColor" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 leading-none">{{ stat.title }}</p>
                        <p class="mt-2 text-xl font-bold text-slate-800 break-words leading-none sm:text-2xl">
                            {{ stat.value }}
                        </p>
                        <p v-if="stat.detail" class="mt-1.5 text-[11px] text-slate-400 font-medium">
                            {{ stat.detail }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div v-if="isLoading" class="flex items-center justify-center p-12 text-slate-500">
                <Loader2 class="mr-2 h-5 w-5 animate-spin" />
                {{ t('adminPayments.loading') }}
            </div>

            <div v-else-if="!payments.length" class="p-12 text-center text-slate-500">
                {{ t('adminPayments.empty') }}
            </div>

            <template v-else>
                <!-- Mobile View -->
                <div class="md:hidden divide-y divide-slate-100">
                    <div v-for="payment in payments" :key="`${payment.id}-mobile`" class="p-5 space-y-4 hover:bg-slate-50/50 transition-colors">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase border border-slate-200 shrink-0">
                                    {{ getInitials(payment.customerName, payment.customerEmail) }}
                                </div>
                                <div class="min-w-0">
                                    <div class="text-[11px] text-slate-400 break-all font-mono">{{ payment.paymentId }}</div>
                                    <div class="text-sm font-semibold text-slate-800 break-words mt-0.5">{{ payment.customerName }}</div>
                                    <div class="text-xs text-slate-500 break-all">{{ payment.customerEmail }}</div>
                                </div>
                            </div>
                            <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border whitespace-nowrap', getStatusClass(payment.status)]">
                                <component :is="getStatusIcon(payment.status)" class="h-3.5 w-3.5" />
                                {{ formatStatusLabel(payment.status) }}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-xs border-t border-slate-50 pt-3">
                            <div>
                                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ t('adminPayments.table.amount') }}</span>
                                <span class="mt-1 block font-bold text-slate-800 text-sm">{{ formatCurrency(payment.amount, payment.currency) }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ t('adminPayments.table.method') }}</span>
                                <span class="mt-1 inline-flex items-center gap-1.5 text-slate-700 font-medium">
                                    <span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                    {{ formatPaymentMethod(payment.paymentMethod) }}
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ t('adminPayments.table.date') }}</span>
                                <span class="mt-1 block text-slate-600 font-medium flex items-center gap-1">
                                    <CalendarIcon class="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    <span>{{ formatJustDate(payment.createdAt) }} <span class="text-slate-400 text-[10px]">{{ formatJustTime(payment.createdAt) }}</span></span>
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ t('adminPayments.details.orderId') }}</span>
                                <div class="mt-1">
                                    <button v-if="payment.orderNumber" @click="goToOrder(payment.orderNumber)"
                                        class="inline-flex items-center gap-1 rounded bg-[#24a3b5]/5 border border-[#24a3b5]/20 px-2 py-0.5 text-xs font-semibold text-[#24a3b5] hover:bg-[#24a3b5]/10 transition-all">
                                        <span>#{{ payment.orderNumber }}</span>
                                        <ExternalLink class="h-3 w-3" />
                                    </button>
                                    <span v-else class="text-slate-400 font-medium">{{ t('adminPayments.notAvailable') }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between border-t border-slate-50 pt-3">
                            <span class="text-xs text-slate-400 font-mono">{{ payment.currency }}</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <button class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none">
                                        <MoreHorizontal class="h-4 w-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" class="w-48">
                                    <DropdownMenuLabel class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">Actions</DropdownMenuLabel>
                                    <DropdownMenuItem @click="viewPaymentDetails(payment)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                        <span>{{ t('adminPayments.actions.view') }}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem v-if="payment.orderNumber" @click="goToOrder(payment.orderNumber)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-indigo-600">
                                        <span>{{ t('adminPayments.actions.viewOrder') }}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <!-- Desktop Table View -->
                <div class="hidden md:block max-h-[70vh] overflow-auto">
                    <table class="min-w-[1120px] w-full divide-y divide-slate-100 table-fixed">
                        <thead class="sticky top-0 z-10 bg-slate-50 shadow-sm">
                            <tr>
                                <th class="w-[18%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminPayments.table.paymentId') }}</th>
                                <th class="w-[20%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminPayments.table.customer') }}</th>
                                <th class="w-[12%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminPayments.table.amount') }}</th>
                                <th class="w-[12%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminPayments.table.status') }}</th>
                                <th class="w-[12%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminPayments.table.method') }}</th>
                                <th class="w-[16%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminPayments.table.date') }}</th>
                                <th class="w-[8%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminPayments.table.currency') }}</th>
                                <th class="w-[8%] px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">{{ t('adminPayments.table.actions') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 bg-white">
                            <tr v-for="payment in payments" :key="payment.id" class="hover:bg-slate-50/50 transition-colors">
                                <td class="px-6 py-4 align-middle">
                                    <div class="text-xs font-mono text-slate-400 break-all">{{ payment.paymentId }}</div>
                                    <div class="mt-1">
                                        <button v-if="payment.orderNumber" @click="goToOrder(payment.orderNumber)"
                                            class="inline-flex items-center gap-1 rounded bg-[#24a3b5]/5 border border-[#24a3b5]/20 px-2 py-0.5 text-xs font-semibold text-[#24a3b5] hover:bg-[#24a3b5]/10 transition-all">
                                            <span>#{{ payment.orderNumber }}</span>
                                            <ExternalLink class="h-3 w-3" />
                                        </button>
                                        <span v-else class="text-xs text-slate-400">{{ t('adminPayments.notAvailable') }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <div class="flex items-center gap-3">
                                        <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase border border-slate-200 shrink-0">
                                            {{ getInitials(payment.customerName, payment.customerEmail) }}
                                        </div>
                                        <div class="min-w-0">
                                            <div class="text-sm font-semibold text-slate-800 break-words leading-tight">{{ payment.customerName }}</div>
                                            <div class="text-xs text-slate-500 break-all mt-0.5 leading-tight">{{ payment.customerEmail }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap text-sm font-bold text-slate-800">
                                    {{ formatCurrency(payment.amount, payment.currency) }}
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap">
                                    <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border whitespace-nowrap', getStatusClass(payment.status)]">
                                        <component :is="getStatusIcon(payment.status)" class="h-3.5 w-3.5" />
                                        {{ formatStatusLabel(payment.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <div class="inline-flex items-center gap-1.5 text-slate-700 font-medium text-sm">
                                        <span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                        {{ formatPaymentMethod(payment.paymentMethod) }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <div class="flex items-start gap-2 text-slate-600 text-sm font-medium">
                                        <CalendarIcon class="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                        <div class="flex flex-col">
                                            <span class="text-slate-700 leading-tight">{{ formatJustDate(payment.createdAt) }}</span>
                                            <span class="text-slate-400 text-xs mt-0.5 leading-tight">{{ formatJustTime(payment.createdAt) }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap text-sm font-semibold text-slate-600">
                                    {{ payment.currency }}
                                </td>
                                <td class="px-6 py-4 align-middle text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <button class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none">
                                                <MoreHorizontal class="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" class="w-48">
                                            <DropdownMenuLabel class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">Actions</DropdownMenuLabel>
                                            <DropdownMenuItem @click="viewPaymentDetails(payment)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700">
                                                <span>{{ t('adminPayments.actions.view') }}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem v-if="payment.orderNumber" @click="goToOrder(payment.orderNumber)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-indigo-600">
                                                <span>{{ t('adminPayments.actions.viewOrder') }}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination area -->
                <div class="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                    <p class="text-sm text-slate-500 font-medium">
                        {{ t('adminPayments.pagination.pageSummary', { page: pagination.page, pages: pagination.pages || 1, total: pagination.total }) }}
                    </p>
                    <div class="flex items-center gap-2">
                        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
                            class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ t('adminPayments.pagination.previous') }}
                        </button>
                        <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.pages"
                            class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ t('adminPayments.pagination.next') }}
                        </button>
                    </div>
                </div>
            </template>
        </div>

        <!-- Detail Dialog Modal -->
        <Dialog :open="Boolean(selectedPayment)" @update:open="handlePaymentDialogOpen">
            <DialogContent class="max-w-3xl p-0 overflow-hidden rounded-xl border border-slate-100 shadow-lg">
                <div v-if="selectedPayment" class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div class="min-w-0">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                                {{ t('adminPayments.details.recordLabel') }}
                            </p>
                            <h3 class="mt-1 break-all text-xl font-bold font-mono">
                                {{ selectedPayment.paymentId }}
                            </h3>
                            <p class="mt-2 text-sm text-white/75 flex items-center gap-1.5">
                                <span>{{ selectedPayment.customerName }}</span>
                                <span class="text-white/40">•</span>
                                <span class="flex items-center gap-1">
                                    <CalendarIcon class="h-3.5 w-3.5 text-white/55" />
                                    <span>{{ formatDateTime(selectedPayment.createdAt) }}</span>
                                </span>
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span :class="['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border', getStatusBadgeClass(selectedPayment.status)]">
                                {{ formatStatusLabel(selectedPayment.status) }}
                            </span>
                            <span class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                {{ formatPaymentMethod(selectedPayment.paymentMethod) }}
                            </span>
                        </div>
                    </div>
                </div>
                <DialogHeader class="hidden">
                    <DialogTitle>{{ t('adminPayments.details.title') }}</DialogTitle>
                </DialogHeader>

                <div v-if="selectedPayment" class="space-y-6 px-6 py-6">
                    <!-- Top stats cards -->
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayments.details.amount') }}</p>
                            <p class="mt-2 text-2xl font-bold text-slate-900">{{ formatCurrency(selectedPayment.amount, selectedPayment.currency) }}</p>
                            <p class="mt-1 text-xs text-slate-400 font-medium">{{ selectedPayment.currency }}</p>
                        </div>
                        <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayments.details.method') }}</p>
                            <p class="mt-2 text-lg font-bold text-slate-900">{{ formatPaymentMethod(selectedPayment.paymentMethod) }}</p>
                            <p class="mt-1 text-xs text-slate-400 font-medium">{{ t('adminPayments.details.checkoutRail') }}</p>
                        </div>
                        <div class="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayments.details.status') }}</p>
                            <p class="mt-2 text-lg font-bold text-slate-900">{{ formatStatusLabel(selectedPayment.status) }}</p>
                            <p class="mt-1 text-xs text-slate-400 font-medium">{{ t('adminPayments.details.lastRecordedState') }}</p>
                        </div>
                    </div>

                    <!-- Split sections -->
                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <!-- Record Details -->
                        <div class="rounded-xl border border-slate-100 bg-white p-5">
                            <h4 class="text-sm font-semibold text-slate-900">{{ t('adminPayments.details.sections.paymentRecord') }}</h4>
                            <dl class="mt-4 space-y-4">
                                <div>
                                    <dt class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('adminPayments.details.paymentId') }}</dt>
                                    <dd class="mt-1 break-all text-sm font-medium text-slate-900 font-mono">{{ selectedPayment.paymentId }}</dd>
                                </div>
                                <div>
                                    <dt class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('adminPayments.details.reference') }}</dt>
                                    <dd class="mt-1 break-all text-sm font-medium text-slate-900 font-mono">{{ selectedPayment.reference || selectedPayment.paymentId }}</dd>
                                </div>
                                <div>
                                    <dt class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('adminPayments.details.createdAt') }}</dt>
                                    <dd class="mt-1 text-sm font-medium text-slate-900">{{ formatDateTime(selectedPayment.createdAt) }}</dd>
                                </div>
                            </dl>
                        </div>

                        <!-- Customer Details -->
                        <div class="rounded-xl border border-slate-100 bg-white p-5">
                            <h4 class="text-sm font-semibold text-slate-900">{{ t('adminPayments.details.sections.customerOrder') }}</h4>
                            <dl class="mt-4 space-y-4">
                                <div>
                                    <dt class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('adminPayments.details.customer') }}</dt>
                                    <dd class="mt-1 text-sm font-medium text-slate-900">{{ selectedPayment.customerName }}</dd>
                                </div>
                                <div>
                                    <dt class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('adminPayments.details.customerEmail') }}</dt>
                                    <dd class="mt-1 break-all text-sm font-medium text-slate-900">{{ selectedPayment.customerEmail }}</dd>
                                </div>
                                <div>
                                    <dt class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('adminPayments.details.orderId') }}</dt>
                                    <dd class="mt-1 text-sm font-medium text-slate-900">
                                        <button v-if="selectedPayment.orderNumber" @click="goToOrder(selectedPayment.orderNumber)"
                                            class="inline-flex items-center gap-1 rounded bg-[#24a3b5]/5 border border-[#24a3b5]/20 px-2 py-0.5 text-xs font-semibold text-[#24a3b5] hover:bg-[#24a3b5]/10 transition-all">
                                            <span>#{{ selectedPayment.orderNumber }}</span>
                                            <ExternalLink class="h-3 w-3" />
                                        </button>
                                        <span v-else class="text-slate-400">{{ t('adminPayments.notAvailable') }}</span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div class="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            v-if="selectedPayment.orderNumber"
                            type="button"
                            @click="goToOrder(selectedPayment.orderNumber)"
                            class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-all"
                        >
                            <span>{{ t('adminPayments.actions.viewOrder') }}</span>
                            <ExternalLink class="h-4 w-4" />
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    AlertCircle,
    ArrowUpCircle,
    ChevronDown,
    CreditCard,
    DollarSign,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    MoreHorizontal,
    ExternalLink,
    Calendar as CalendarIcon,
    Download,
    Filter,
    FilterX
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
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        title: t('adminPayments.stats.successfulPayments'),
        value: getStatusCount('success'),
        detail: t('adminPayments.stats.successCountDetail'),
        icon: ArrowUpCircle,
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        title: t('adminPayments.stats.pendingPayments'),
        value: getStatusCount('pending'),
        detail: t('adminPayments.stats.pendingCountDetail'),
        icon: CreditCard,
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
    {
        title: t('adminPayments.stats.failedPayments'),
        value: getStatusCount('failed'),
        detail: t('adminPayments.stats.failedCountDetail'),
        icon: AlertCircle,
        bgColor: 'bg-rose-50',
        iconColor: 'text-rose-600',
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
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
        pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
        failed: 'bg-rose-50 text-rose-700 border-rose-200/50',
    };
    return classes[status] || 'bg-slate-50 text-slate-700 border-slate-200/50';
};

const getStatusBadgeClass = (status) => {
    const classes = {
        success: 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/20 border-emerald-300/20',
        pending: 'bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/20 border-amber-300/20',
        failed: 'bg-rose-400/15 text-rose-100 ring-1 ring-rose-300/20 border-rose-300/20',
    };
    return classes[status] || 'bg-white/10 text-white ring-1 ring-white/15 border-white/15';
};

const getStatusIcon = (status) => {
    const icons = {
        success: CheckCircle2,
        pending: Clock,
        failed: XCircle,
    };
    return icons[status] || AlertCircle;
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

const formatJustDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatJustTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : 'en-NG', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getInitials = (name, email) => {
    if (name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        if (parts.length === 1 && parts[0]) {
            return parts[0].substring(0, 2).toUpperCase();
        }
    }
    if (email) {
        return email.substring(0, 2).toUpperCase();
    }
    return '??';
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

<template>
    <div>
        <div class="flex flex-col gap-4 mb-3 px-8 py-4 rounded-b-lg bg-white lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ t('adminPayouts.title') }}</h2>
                <p class="text-sm text-gray-500">{{ t('adminPayouts.subtitle') }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <button @click="reconcileAfriExchange" :disabled="isReconciling"
                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                    <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': isReconciling }" />
                    <span>{{ isReconciling ? t('adminPayouts.reconciling') : t('adminPayouts.reconcileAfriExchange') }}</span>
                </button>
                <button @click="processReadyPayouts" :disabled="isProcessing || readyCount === 0"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#24a3b5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1d8b9a] disabled:cursor-not-allowed disabled:opacity-50">
                    <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': isProcessing }" />
                    <span>{{ isProcessing ? t('adminPayouts.processing') : t('adminPayouts.processReady', { count: readyCount }) }}</span>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
            <div v-for="card in summaryCards" :key="card.title" class="relative overflow-hidden rounded-xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between">
                <div class="min-w-0">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ card.title }}</p>
                    <p class="mt-2 text-2xl font-bold text-slate-800 break-words leading-none">{{ card.value }}</p>
                    <p class="mt-2.5 text-xs font-medium text-slate-500 line-clamp-1">{{ card.detail }}</p>
                </div>
                <div :class="card.iconClass" class="rounded-xl p-2.5 flex-shrink-0 flex items-center justify-center">
                    <component :is="card.icon" class="h-5 w-5" />
                </div>
            </div>
        </div>

        <div class="mb-4 rounded-xl bg-white p-5 border border-slate-100 shadow-sm">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.status" @change="fetchPayouts"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10">
                            <option value="">{{ t('adminPayouts.statuses.all') }}</option>
                            <option value="ready">{{ t('adminPayouts.statuses.ready') }}</option>
                            <option value="scheduled">{{ t('adminPayouts.statuses.scheduled') }}</option>
                            <option value="pending">{{ t('adminPayouts.statuses.pending') }}</option>
                            <option value="processing">{{ t('adminPayouts.statuses.processing') }}</option>
                            <option value="processed">{{ t('adminPayouts.statuses.processed') }}</option>
                            <option value="failed">{{ t('adminPayouts.statuses.failed') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.filters.method') }}</label>
                    <div class="relative">
                        <select v-model="filters.paymentMethod" @change="fetchPayouts"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10">
                            <option value="">{{ t('adminPayouts.statuses.all') }}</option>
                            <option value="AfriExchange">AfriExchange</option>
                            <option value="Paystack">Paystack</option>
                            <option value="OPay">OPay</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.filters.currency') }}</label>
                    <div class="relative">
                        <select v-model="filters.currency" @change="fetchPayouts"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10">
                            <option value="">{{ t('adminPayouts.statuses.all') }}</option>
                            <option value="XOF">XOF</option>
                            <option value="NGN">NGN</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.filters.search') }}</label>
                    <input v-model="filters.search" @input="handleSearch" type="text"
                        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                        :placeholder="t('adminPayouts.filters.searchPlaceholder')">
                </div>
            </div>
            <div class="mt-4 flex justify-end">
                <button
                    @click="clearFilters"
                    class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                >
                    {{ t('adminPayouts.clearFilters') }}
                </button>
            </div>
        </div>

        <div class="overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm">
            <div v-if="isLoading" class="flex flex-col items-center justify-center p-16 text-slate-400">
                <Loader2 class="h-8 w-8 animate-spin text-[#24a3b5] mb-2" />
                <span class="text-sm font-medium">{{ t('adminPayouts.loading') }}</span>
            </div>

            <div v-else-if="!payouts.length" class="p-16 text-center text-slate-400">
                <p class="text-sm font-medium">{{ t('adminPayouts.empty') }}</p>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-100">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.table.vendor') }}</th>
                            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.table.order') }}</th>
                            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.table.amount') }}</th>
                            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.table.status') }}</th>
                            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.table.method') }}</th>
                            <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminPayouts.table.scheduled') }}</th>
                            <th class="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-20">{{ t('adminPayouts.table.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        <tr v-for="payout in payouts" :key="payout.id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center gap-3">
                                    <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase border border-slate-200">
                                        {{ getVendorInitials(payout.vendor) }}
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-slate-800 leading-tight">{{ vendorName(payout.vendor) }}</p>
                                        <p class="text-xs text-slate-400 mt-0.5 leading-none">{{ payout.vendor?.email || 'No email' }}</p>
                                        <p v-if="payout.vendor?.afriExchange?.accountEmail" class="text-[10px] font-medium text-slate-400 mt-1 leading-none">
                                            AfriExchange: {{ payout.vendor.afriExchange.accountEmail }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                <button v-if="payout.order?.orderId" @click="goToOrder(payout.order.orderId)" 
                                    class="inline-flex items-center gap-1 text-xs font-semibold text-[#24a3b5] hover:text-[#1d8b9a] hover:underline bg-[#24a3b5]/5 px-2 py-0.5 rounded border border-[#24a3b5]/10">
                                    <span>#{{ payout.order.orderId }}</span>
                                    <ExternalLink class="h-3 w-3" />
                                </button>
                                <span v-else class="text-xs text-slate-400">N/A</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="font-mono text-sm font-bold text-slate-900">
                                    {{ formatCurrency(payout.amount, payout.currency) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="statusClass(payout)"
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm border">
                                    <component :is="statusIcon(payout)" class="h-3.5 w-3.5" :class="{ 'animate-spin': payout.status === 'processing' }" />
                                    <span>{{ statusLabel(payout) }}</span>
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex items-center gap-1.5 text-sm text-slate-600 font-medium bg-slate-50 border border-slate-200/50 rounded-lg px-2 py-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                    {{ payout.paymentMethod }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div v-if="payout.scheduledDate" class="flex items-center gap-2">
                                    <Calendar class="h-4 w-4 text-slate-400 flex-shrink-0" />
                                    <div>
                                        <p class="text-sm font-semibold text-slate-800 leading-tight">{{ formatJustDate(payout.scheduledDate) }}</p>
                                        <p class="text-xs text-slate-400 mt-0.5 leading-none">{{ formatJustTime(payout.scheduledDate) }}</p>
                                    </div>
                                </div>
                                <span v-else class="text-xs text-slate-400">{{ t('adminPayouts.details.awaitingProcessing') }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <button class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 focus:outline-none transition">
                                            <MoreHorizontal class="h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" class="w-48">
                                        <DropdownMenuLabel class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">Actions</DropdownMenuLabel>
                                        
                                        <DropdownMenuItem @click="selectedPayout = payout" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700 hover:bg-slate-50">
                                            <ExternalLink class="h-4 w-4 text-slate-400" />
                                            <span>{{ t('adminPayouts.actions.viewDetails') }}</span>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem v-if="payout.order?.orderId" @click="goToOrder(payout.order.orderId)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700 hover:bg-slate-50">
                                            <ExternalLink class="h-4 w-4 text-slate-400" />
                                            <span>{{ t('adminPayouts.actions.viewOrder') }}</span>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuSeparator v-if="canCheckStatus(payout) || canSimulateProcessing(payout) || canSimulateFailure(payout)" />
                                        
                                        <DropdownMenuItem v-if="canCheckStatus(payout)" @click="checkStatus(payout)" :disabled="checkingPayoutId === payout.id" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                                            <RefreshCcw class="h-4 w-4 text-slate-400" :class="{ 'animate-spin': checkingPayoutId === payout.id }" />
                                            <span>{{ checkingPayoutId === payout.id ? t('adminPayouts.actions.checking') : t('adminPayouts.actions.checkStatus') }}</span>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem v-if="canSimulateProcessing(payout)" @click="simulateProcessing(payout)" :disabled="simulatingPayoutId === payout.id" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-cyan-600 hover:bg-cyan-50 disabled:opacity-50 font-medium">
                                            <CheckCircle2 class="h-4 w-4 text-cyan-400" :class="{ 'animate-spin': simulatingPayoutId === payout.id }" />
                                            <span>{{ simulatingPayoutId === payout.id ? t('adminPayouts.actions.simulating') : t('adminPayouts.actions.simulateProcessing') }}</span>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem v-if="canSimulateFailure(payout)" @click="simulateFailure(payout)" :disabled="failingPayoutId === payout.id" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50 font-medium">
                                            <AlertCircle class="h-4 w-4 text-rose-400" :class="{ 'animate-spin': failingPayoutId === payout.id }" />
                                            <span>{{ failingPayoutId === payout.id ? t('adminPayouts.actions.simulating') : t('adminPayouts.actions.simulateFailure') }}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <p class="text-sm text-gray-500">
                    {{ t('adminPayouts.pagination.pageSummary', { page: pagination.page, pages: pagination.pages || 1, total: pagination.total }) }}
                </p>
                <div class="flex items-center gap-2">
                    <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
                        class="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                        {{ t('adminPayouts.pagination.previous') }}
                    </button>
                    <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.pages"
                        class="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                        {{ t('adminPayouts.pagination.next') }}
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
                                    {{ t('adminPayouts.details.recordLabel') }}
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
                                        {{ t('adminPayouts.details.providerStatus') }} {{ selectedPayout.providerStatus }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-50 px-6 py-6">
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminPayouts.details.amount') }}</p>
                                <p class="mt-2 text-2xl font-semibold text-slate-900">
                                    {{ formatCurrency(selectedPayout.amount, selectedPayout.currency) }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">{{ selectedPayout.currency }}</p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminPayouts.details.scheduled') }}</p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">
                                    {{ formatDate(selectedPayout.scheduledDate) }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">
                                    {{ selectedPayout.processedAt ? t('adminPayouts.details.processed', { date: formatDate(selectedPayout.processedAt) }) : t('adminPayouts.details.awaitingProcessing') }}
                                </p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminPayouts.details.vendorRail') }}</p>
                                <p class="mt-2 text-lg font-semibold text-slate-900">
                                    {{ selectedPayout.vendor?.afriExchange?.accountEmail || selectedPayout.vendor?.email || t('adminPayouts.details.notAvailable') }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">
                                    {{ selectedPayout.vendor?.currency || selectedPayout.currency }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminPayouts.details.recordLabel') }}</h4>
                                <div class="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p class="break-all"><span class="font-medium text-slate-900">{{ t('adminPayouts.details.transferReference') }}</span> {{ selectedPayout.transferReference || t('adminPayouts.details.notAvailable') }}</p>
                                    <p class="break-all"><span class="font-medium text-slate-900">{{ t('adminPayouts.details.transactionReference') }}</span> {{ selectedPayout.transactionReference || t('adminPayouts.details.notAvailable') }}</p>
                                    <p class="break-all"><span class="font-medium text-slate-900">{{ t('adminPayouts.details.providerPayoutId') }}</span> {{ selectedPayout.providerPayoutId || t('adminPayouts.details.notAvailable') }}</p>
                                    <p><span class="font-medium text-slate-900">{{ t('adminPayouts.details.providerStatus') }}</span> {{ selectedPayout.providerStatus || t('adminPayouts.details.notAvailable') }}</p>
                                    <p><span class="font-medium text-slate-900">{{ t('adminPayouts.details.lastChecked') }}</span> {{ selectedPayout.lastStatusCheckedAt ? formatDate(selectedPayout.lastStatusCheckedAt) : t('adminPayouts.details.notAvailable') }}</p>
                                </div>
                            </div>

                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminPayouts.details.vendor') }} &amp; {{ t('adminPayouts.table.order') }}</h4>
                                <div class="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p><span class="font-medium text-slate-900">{{ t('adminPayouts.details.vendor') }}</span> {{ vendorName(selectedPayout.vendor) }}</p>
                                    <p class="break-all"><span class="font-medium text-slate-900">{{ t('adminPayouts.details.email') }}</span> {{ selectedPayout.vendor?.email || t('adminPayouts.details.notAvailable') }}</p>
                                    <p><span class="font-medium text-slate-900">{{ t('adminPayouts.details.orderId') }}</span> {{ selectedPayout.order?.orderId || t('adminPayouts.details.notAvailable') }}</p>
                                    <p><span class="font-medium text-slate-900">{{ t('adminPayouts.details.orderStatus') }}</span> {{ selectedPayout.order?.status || t('adminPayouts.details.notAvailable') }}</p>
                                    <p v-if="selectedPayout.errorMessage" class="text-red-600"><span class="font-medium">{{ t('adminPayouts.details.error') }}</span> {{ selectedPayout.errorMessage }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex flex-wrap justify-end gap-3">
                            <button
                                v-if="selectedPayout.order?.orderId"
                                @click="goToOrder(selectedPayout.order.orderId)"
                                class="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                            >
                                {{ t('adminPayouts.actions.viewOrder') }}
                            </button>
                            <button
                                @click="selectedPayout = null"
                                class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                {{ t('adminPayouts.details.close') }}
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
import { useI18n } from 'vue-i18n';
import apiClient from '@/api/axios';
import { toast } from 'vue-sonner';
import { 
    Loader2, 
    RefreshCcw, 
    MoreHorizontal, 
    ExternalLink, 
    Calendar, 
    Copy, 
    Check, 
    User, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    XCircle, 
    ArrowUpRight, 
    CreditCard, 
    Wallet, 
    Banknote,
    ChevronDown
} from 'lucide-vue-next';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const payouts = ref([]);
const summary = ref({ byStatus: {}, readyCount: 0 });
const pagination = ref({ page: 1, limit: 10, total: 0, pages: 1 });
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

const copiedId = ref(null);
const copyText = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
        copiedId.value = id;
        toast.success(t('adminPayouts.toasts.copied') || 'Reference copied to clipboard!');
        setTimeout(() => {
            if (copiedId.value === id) {
                copiedId.value = null;
            }
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

const getVendorInitials = (vendor) => {
    if (!vendor) return 'UN';
    const first = vendor.firstName?.charAt(0) || '';
    const last = vendor.lastName?.charAt(0) || '';
    const initials = `${first}${last}`.trim();
    return initials || vendor.email?.slice(0, 2) || 'UN';
};

const readyCount = computed(() => summary.value.readyCount || 0);

const formatStatusSummary = (status) => {
    const statusData = summary.value.byStatus?.[status] || {};
    const entries = Object.entries(statusData).filter(([, data]) => Number(data.amount || 0) > 0);
    if (!entries.length) {
        return formatCurrency(0, filters.value.currency || 'XOF');
    }
    return entries.map(([currency, data]) => formatCurrency(data.amount, currency)).join(' / ');
};

const formatStatusCountDetail = (status) => {
    const statusData = summary.value.byStatus?.[status] || {};
    const entries = Object.entries(statusData).filter(([, data]) => Number(data.count || 0) > 0);
    if (!entries.length) {
        return t('adminPayouts.stats.noPayouts');
    }
    return entries.map(([currency, data]) => t('adminPayouts.stats.payoutsCount', { count: data.count }) + ` (${currency})`).join(', ');
};

const summaryCards = computed(() => [
    {
        title: t('adminPayouts.stats.readyPayouts'),
        value: readyCount.value,
        detail: t('adminPayouts.stats.readyPayoutsDetail'),
        icon: Wallet,
        iconClass: 'text-cyan-600 bg-cyan-50 border border-cyan-100',
    },
    {
        title: t('adminPayouts.stats.pendingPayouts'),
        value: formatStatusSummary('pending'),
        detail: formatStatusCountDetail('pending'),
        icon: Clock,
        iconClass: 'text-amber-600 bg-amber-50 border border-amber-100',
    },
    {
        title: t('adminPayouts.stats.processingPayouts'),
        value: formatStatusSummary('processing'),
        detail: formatStatusCountDetail('processing'),
        icon: ArrowUpRight,
        iconClass: 'text-blue-600 bg-blue-50 border border-blue-100',
    },
    {
        title: t('adminPayouts.stats.processedPayouts'),
        value: formatStatusSummary('processed'),
        detail: formatStatusCountDetail('processed'),
        icon: Banknote,
        iconClass: 'text-emerald-600 bg-emerald-50 border border-emerald-100',
    },
]);

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
        toast.error(error.response?.data?.message || t('adminPayouts.toasts.checkStatusFailed'));
    } finally {
        isLoading.value = false;
    }
};

const processReadyPayouts = async () => {
    isProcessing.value = true;
    try {
        const response = await apiClient.post('/admin/process-payouts');
        const results = response.data.results;
        toast.success(t('adminPayouts.toasts.payoutRunComplete', { processed: results?.processed || 0, failed: results?.failed || 0 }));
        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to process payouts:', error);
        toast.error(error.response?.data?.message || t('adminPayouts.toasts.payoutRunFailed'));
    } finally {
        isProcessing.value = false;
    }
};

const reconcileAfriExchange = async () => {
    isReconciling.value = true;
    try {
        const response = await apiClient.post('/admin/payouts/reconcile-afriexchange');
        const results = response.data.results;
        toast.success(t('adminPayouts.toasts.reconcileComplete', { checked: results?.checked || 0, failed: results?.failed || 0 }));
        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to reconcile AfriExchange payouts:', error);
        toast.error(error.response?.data?.message || t('adminPayouts.toasts.reconcileFailed'));
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
            toast.success(t('adminPayouts.toasts.statusChanged', { previous: previousStatus, current: nextStatus }));
        } else if (nextStatus === 'processing') {
            toast.info(t('adminPayouts.toasts.statusProcessing'));
        } else {
            toast.success(t('adminPayouts.toasts.statusUnchanged', { status: nextStatus }));
        }

        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to check payout status:', error);
        toast.error(error.response?.data?.message || t('adminPayouts.toasts.checkStatusFailed'));
    } finally {
        checkingPayoutId.value = null;
    }
};

const simulateProcessing = async (payout) => {
    simulatingPayoutId.value = payout.id;
    try {
        const response = await apiClient.post(`/admin/payouts/${payout.id}/simulate-afriexchange-processing`);
        toast.success(t('adminPayouts.toasts.simulateSuccess'));
        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to simulate AfriExchange processing payout:', error);
        toast.error(error.response?.data?.message || t('adminPayouts.toasts.simulateFailed'));
    } finally {
        simulatingPayoutId.value = null;
    }
};

const simulateFailure = async (payout) => {
    failingPayoutId.value = payout.id;
    try {
        const response = await apiClient.post(`/admin/payouts/${payout.id}/simulate-afriexchange-failure`);
        toast.success(t('adminPayouts.toasts.simulateSuccessFail'));
        await fetchPayouts(pagination.value.page);
    } catch (error) {
        console.error('Failed to simulate AfriExchange payout failure:', error);
        toast.error(error.response?.data?.message || t('adminPayouts.toasts.simulateFailed'));
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
    let formatted = new Intl.NumberFormat(currency === 'XOF' ? 'fr-FR' : 'en-NG', {
        style: 'currency',
        currency,
    }).format(amount || 0);

    if (currency === 'XOF') {
        formatted = formatted.replace(/F[\s\u202F\u00A0]*CFA/g, 'CFA');
    }
    return formatted;
};

const formatDate = (date) => {
    if (!date) return t('adminPayouts.details.awaitingProcessing');
    return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatJustDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatJustTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const statusLabel = (payout) => {
    if (payout.isReady) return t('adminPayouts.statuses.ready');
    if (payout.status === 'pending' && payout.scheduledDate) return t('adminPayouts.statuses.scheduled');
    return t(`adminPayouts.statuses.${payout.status}`) || payout.status;
};

const statusClass = (payout) => {
    if (payout.isReady) return 'bg-cyan-50 text-cyan-700 border border-cyan-200/50';
    if (payout.status === 'pending' && payout.scheduledDate) {
        return 'bg-purple-50 text-purple-700 border border-purple-200/50';
    }
    const classes = {
        pending: 'bg-amber-50 text-amber-700 border border-amber-200/50',
        processing: 'bg-blue-50 text-blue-700 border border-blue-200/50',
        processed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
        failed: 'bg-rose-50 text-rose-700 border border-rose-200/50',
    };
    return classes[payout.status] || classes.pending;
};

const statusIcon = (payout) => {
    if (payout.isReady) return Clock;
    if (payout.status === 'pending' && payout.scheduledDate) return Calendar;
    const icons = {
        pending: Clock,
        processing: Loader2,
        processed: CheckCircle2,
        failed: AlertCircle,
    };
    return icons[payout.status] || Clock;
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

<!-- OrderDetailsModal.vue -->
<template>
    <div
        v-if="order"
        class="fixed inset-0 z-[120] bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6"
        @click.self="$emit('close')"
    >
        <div class="mx-auto max-w-5xl">
            <div class="relative z-[121] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]">
                <div class="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 text-white sm:px-8">
                    <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                                {{ t('adminOrderDetailsModal.sections.orderItems') }}
                            </p>
                            <h3 class="mt-2 text-xl font-semibold text-white sm:text-2xl">
                                {{ t('adminOrderDetailsModal.title', { id: order.orderId }) }}
                            </h3>
                            <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                                <span>{{ t('adminOrderDetailsModal.placedOn', { date: formatDate(order.createdAt) }) }}</span>
                                <span class="break-all">{{ t('adminOrderDetailsModal.email', { value: order.user?.email }) }}</span>
                                <span>{{ t('adminOrderDetailsModal.buyer', { value: order.user?.username }) }}</span>
                            </div>
                            <div class="mt-4 flex flex-wrap gap-2">
                                <span :class="[
                                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                    getStatusClass(order.status),
                                ]">
                                    {{ formatStatus(order.status) }}
                                </span>
                                <span class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                                    {{ order.paymentMethod || t('adminOrderDetailsModal.labels.notAvailable') }}
                                </span>
                                <span
                                    v-if="order.payoutSummary?.status"
                                    :class="[
                                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                        getPayoutStatusClass(order.payoutSummary.status),
                                    ]"
                                >
                                    {{ formatPayoutStatus(order.payoutSummary.status) }}
                                </span>
                            </div>
                        </div>
                        <button
                            @click="$emit('close')"
                            class="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <XIcon class="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div class="bg-slate-50 px-6 py-6 sm:px-8 sm:py-8">
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {{ t('adminOrderDetailsModal.summary.total') }}
                            </p>
                            <p class="mt-2 text-2xl font-semibold text-slate-900">
                                {{ formatCurrency(order.totalAmount) }}
                            </p>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ t('adminOrderDetailsModal.summary.subtotal') }} {{ formatCurrency(order.subtotal) }}
                            </p>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {{ t('adminOrderDetailsModal.sections.orderItems') }}
                            </p>
                            <p class="mt-2 text-2xl font-semibold text-slate-900">
                                {{ order.products?.length || 0 }}
                            </p>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ t('adminOrderDetailsModal.labels.orderStatus') }} {{ formatStatus(order.status) }}
                            </p>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {{ t('adminOrderDetailsModal.sections.paymentInformation') }}
                            </p>
                            <p class="mt-2 text-xl font-semibold text-slate-900">
                                {{ order.paymentMethod || t('adminOrderDetailsModal.labels.notAvailable') }}
                            </p>
                            <p class="mt-1 break-all text-sm text-slate-500">
                                {{ order.paymentSummary?.reference || order.transactionId || t('adminOrderDetailsModal.labels.notAvailable') }}
                            </p>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {{ t('adminOrderDetailsModal.sections.payoutInformation') }}
                            </p>
                            <p class="mt-2 text-xl font-semibold text-slate-900">
                                {{ order.payoutSummary ? formatPayoutStatus(order.payoutSummary.status) : t('adminOrderDetailsModal.labels.notAvailable') }}
                            </p>
                            <p class="mt-1 break-all text-sm text-slate-500">
                                {{ order.payoutSummary?.transferReference || order.payoutSummary?.providerPayoutId || t('adminOrderDetailsModal.labels.notAvailable') }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-6 space-y-6">
                        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.sections.shippingInformation') }}</h4>
                                <div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p class="mb-1"><span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.address') }}</span> {{ order.address.street }}</p>
                                    <p class="mb-1">{{ order.address.city }}, {{ order.address.state }}</p>
                                    <p>{{ order.address.country }} {{ order.address.postalCode }}</p>
                                </div>
                            </div>

                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.sections.paymentInformation') }}</h4>
                                <div class="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                                    <p class="flex flex-wrap items-center gap-2">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.method') }}</span>
                                        <span>{{ order.paymentMethod }}</span>
                                    </p>
                                    <p class="flex flex-wrap items-center gap-2">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.orderStatus') }}</span>
                                        <span :class="[
                                            'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                                            getStatusClass(order.status)
                                        ]">
                                            {{ formatStatus(order.status) }}
                                        </span>
                                    </p>
                                    <p v-if="order.transactionId" class="break-all">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.transactionId') }}</span>
                                        {{ order.transactionId }}
                                    </p>
                                    <p v-if="order.paymentSummary?.reference" class="break-all">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.paymentReference') }}</span>
                                        {{ order.paymentSummary.reference }}
                                    </p>
                                    <p v-if="order.paymentSummary?.status">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.paymentStatus') }}</span>
                                        {{ order.paymentSummary.status }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.sections.sellerInformation') }}</h4>
                                <div class="mt-4 space-y-2 rounded-xl bg-slate-50 p-4">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <p class="font-medium text-slate-900">
                                            {{ sellerStoreName }}
                                        </p>
                                        <span
                                            v-if="order.seller?.sellerProfile?.isVerified"
                                            class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700"
                                        >
                                            {{ t('adminOrderDetailsModal.labels.verifiedSeller') }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-slate-600">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.sellerUsername') }}</span>
                                        {{ order.seller?.username || t('adminOrderDetailsModal.labels.notAvailable') }}
                                    </p>
                                    <p class="break-all text-sm text-slate-600">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.sellerEmail') }}</span>
                                        {{ order.seller?.email || t('adminOrderDetailsModal.labels.notAvailable') }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="order.payoutSummary" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.sections.payoutInformation') }}</h4>
                                <div class="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                                    <p>
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.payoutMethod') }}</span>
                                        {{ order.payoutSummary.paymentMethod || t('adminOrderDetailsModal.labels.notAvailable') }}
                                    </p>
                                    <p class="flex flex-wrap items-center gap-2">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.payoutStatus') }}</span>
                                        <span :class="[
                                            'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                                            getPayoutStatusClass(order.payoutSummary.status)
                                        ]">
                                            {{ formatPayoutStatus(order.payoutSummary.status) }}
                                        </span>
                                    </p>
                                    <p v-if="order.payoutSummary.providerStatus">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.providerStatus') }}</span>
                                        {{ formatPayoutStatus(order.payoutSummary.providerStatus) }}
                                    </p>
                                    <p v-if="order.payoutSummary.transferReference" class="break-all">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.transferReference') }}</span>
                                        {{ order.payoutSummary.transferReference }}
                                    </p>
                                    <p v-if="order.payoutSummary.providerPayoutId" class="break-all">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.providerPayoutId') }}</span>
                                        {{ order.payoutSummary.providerPayoutId }}
                                    </p>
                                    <p v-if="order.payoutSummary.scheduledDate">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.scheduledDate') }}</span>
                                        {{ formatDate(order.payoutSummary.scheduledDate) }}
                                    </p>
                                    <p v-if="order.payoutSummary.processedAt">
                                        <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.processedAt') }}</span>
                                        {{ formatDate(order.payoutSummary.processedAt) }}
                                    </p>
                                    <p v-if="order.payoutSummary.errorMessage" class="text-red-600">
                                        <span class="font-medium">{{ t('adminOrderDetailsModal.labels.payoutError') }}</span>
                                        {{ order.payoutSummary.errorMessage }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div v-if="order.status === 'Cancelled' || order.cancelReason || order.cancelledAt" class="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
                            <h4 class="text-sm font-semibold uppercase tracking-wide text-red-600">{{ t('adminOrderDetailsModal.sections.cancellationDetails') }}</h4>
                            <div class="mt-4 space-y-2 rounded-xl bg-red-50 p-4">
                                <p class="text-sm text-slate-700">
                                    <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.cancelledAt') }}</span>
                                    {{ order.cancelledAt ? formatDate(order.cancelledAt) : t('adminOrderDetailsModal.labels.notAvailable') }}
                                </p>
                                <p class="text-sm text-slate-700">
                                    <span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.cancelReason') }}</span>
                                    {{ order.cancelReason || t('adminOrderDetailsModal.labels.notAvailable') }}
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.financial.platformFee') }}</p>
                                <p class="mt-2 text-xl font-semibold text-slate-900">{{ formatCurrency(order.platformFee) }}</p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.financial.vendorAmount') }}</p>
                                <p class="mt-2 text-xl font-semibold text-slate-900">{{ formatCurrency(order.vendorAmount) }}</p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.financial.cluesBucksUsed') }}</p>
                                <p class="mt-2 text-xl font-semibold text-slate-900">{{ order.cluesBucks?.pointsUsed || 0 }}</p>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.financial.storeCreditUsed') }}</p>
                                <p class="mt-2 text-xl font-semibold text-slate-900">{{ formatCurrency(order.storeCredit?.amountUsed || 0) }}</p>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.sections.rewardBreakdown') }}</h4>
                            <div class="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span class="text-slate-500">{{ t('adminOrderDetailsModal.summary.couponDiscount') }}</span>
                                    <span class="font-medium text-slate-900">-{{ formatCurrency(rewardBreakdown.coupon) }}</span>
                                </div>
                                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span class="text-slate-500">{{ t('adminOrderDetailsModal.summary.specialOfferDiscount') }}</span>
                                    <span class="font-medium text-slate-900">-{{ formatCurrency(rewardBreakdown.specialOffer) }}</span>
                                </div>
                                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span class="text-slate-500">{{ t('adminOrderDetailsModal.summary.cluesBucksDiscount') }}</span>
                                    <span class="font-medium text-slate-900">-{{ formatCurrency(rewardBreakdown.cluesBucks) }}</span>
                                </div>
                                <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span class="text-slate-500">{{ t('adminOrderDetailsModal.summary.storeCredit') }}</span>
                                    <span class="font-medium text-slate-900">-{{ formatCurrency(rewardBreakdown.storeCredit) }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="order.appliedCoupon" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.sections.couponApplied') }}</h4>
                            <div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                                <p><span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.code') }}</span> {{ order.appliedCoupon.code }}</p>
                                <p class="mt-1"><span class="font-medium text-slate-900">{{ t('adminOrderDetailsModal.labels.discount') }}</span> {{ formatCurrency(order.discount) }}</p>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div class="flex items-center justify-between gap-3">
                                <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.sections.orderItems') }}</h4>
                                <span class="text-sm text-slate-500">
                                    {{ order.products?.length || 0 }} {{ t('adminOrderDetailsModal.table.product') }}
                                </span>
                            </div>
                            <div class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <div v-if="isLoading" class="flex justify-center py-8">
                                    <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                </div>

                                <table class="min-w-full divide-y divide-slate-200">
                                    <thead class="bg-slate-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.table.product') }}</th>
                                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.table.quantity') }}</th>
                                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.table.price') }}</th>
                                            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.table.total') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200 bg-white">
                                        <tr v-for="(item, itemIdx) in order.products" :key="item._id || `${getProductName(item)}-${itemIdx}`">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center">
                                                    <div class="h-10 w-10 flex-shrink-0">
                                                        <template v-if="getProductImage(item)">
                                                            <img :src="getProductImage(item)" :alt="getProductName(item)"
                                                                class="h-10 w-10 rounded-lg object-cover">
                                                        </template>
                                                        <div v-else
                                                            class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                            <ImageIcon class="h-6 w-6 text-slate-400" />
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-slate-900">
                                                            {{ getProductName(item) }}
                                                        </div>
                                                        <div v-if="getVariantDetails(item.variant).length" class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                                            <span v-for="detail in getVariantDetails(item.variant)" :key="detail">
                                                                {{ detail }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                {{ item.quantity }}
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                {{ formatCurrency(item.price) }}
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                {{ formatCurrency(item.price * item.quantity) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot class="bg-slate-50">
                                        <tr>
                                            <td colspan="3" class="px-6 py-3 text-right font-medium text-slate-500">{{ t('adminOrderDetailsModal.summary.subtotal') }}</td>
                                            <td class="px-6 py-3 text-sm text-slate-900">{{ formatCurrency(order.subtotal) }}</td>
                                        </tr>
                                        <tr v-if="rewardBreakdown.coupon">
                                            <td colspan="3" class="px-6 py-3 text-right font-medium text-slate-500">{{ t('adminOrderDetailsModal.summary.couponDiscount') }}</td>
                                            <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(rewardBreakdown.coupon) }}</td>
                                        </tr>
                                        <tr v-if="rewardBreakdown.specialOffer">
                                            <td colspan="3" class="px-6 py-3 text-right font-medium text-slate-500">{{ t('adminOrderDetailsModal.summary.specialOfferDiscount') }}</td>
                                            <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(rewardBreakdown.specialOffer) }}</td>
                                        </tr>
                                        <tr v-if="rewardBreakdown.cluesBucks">
                                            <td colspan="3" class="px-6 py-3 text-right font-medium text-slate-500">{{ t('adminOrderDetailsModal.summary.cluesBucksDiscount') }}</td>
                                            <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(rewardBreakdown.cluesBucks) }}</td>
                                        </tr>
                                        <tr v-if="rewardBreakdown.storeCredit">
                                            <td colspan="3" class="px-6 py-3 text-right font-medium text-slate-500">{{ t('adminOrderDetailsModal.summary.storeCredit') }}</td>
                                            <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(rewardBreakdown.storeCredit) }}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="px-6 py-3 text-right font-medium text-slate-500">{{ t('adminOrderDetailsModal.summary.shipping') }}</td>
                                            <td class="px-6 py-3 text-sm text-slate-900">
                                                {{ formatCurrency(order.shippingFee || 0) }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="px-6 py-3 text-right font-semibold text-slate-900">{{ t('adminOrderDetailsModal.summary.total') }}</td>
                                            <td class="px-6 py-3 text-sm font-bold text-slate-900">{{ formatCurrency(order.totalAmount) }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">{{ t('adminOrderDetailsModal.sections.orderTimeline') }}</h4>
                            <div class="mt-4 flow-root">
                                <ul role="list" class="-mb-5">
                                    <li v-for="(event, eventIdx) in timeline" :key="eventIdx">
                                        <div class="relative pb-4">
                                            <div class="relative flex space-x-3">
                                                <div>
                                                    <span
                                                        class="flex h-9 w-9 items-center justify-center rounded-full ring-8 ring-white"
                                                        :class="getTimelineItemClass(event.type)">
                                                        <component :is="getTimelineIcon(event.type)" class="h-5 w-5 text-white" />
                                                    </span>
                                                </div>
                                                <div class="flex min-w-0 flex-1 items-start justify-between gap-4 pt-1.5">
                                                    <div>
                                                        <p class="text-sm font-medium text-slate-800">{{ event.message }}</p>
                                                    </div>
                                                    <div class="whitespace-nowrap text-right text-sm text-slate-500">
                                                        {{ formatDate(event.timestamp) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../../../store/productStore.js';
import { XIcon, ShoppingCart, Truck, CheckCircle, XCircle, ImageIcon } from 'lucide-vue-next'

export default {
    name: 'OrderDetailsModal',

    components: {
        XIcon,
        ShoppingCart,
        Truck,
        CheckCircle,
        XCircle,
        ImageIcon
    },

    props: {
        order: {
            type: Object,
            required: true
        }
    },

    emits: ['close'],

    setup(props) {
        const { t, locale } = useI18n();
        const productStore = useProductStore();
        const loadedProducts = ref([]);
        const isLoading = ref(true);

        const sellerStoreName = computed(() => {
            return (
                props.order?.seller?.sellerProfile?.storeName ||
                props.order?.seller?.username ||
                t('adminOrderDetailsModal.labels.notAvailable')
            );
        });

        const timeline = computed(() => {
            const events = [
                {
                    type: 'order_placed',
                    message: t('adminOrderDetailsModal.timeline.orderPlaced'),
                    timestamp: props.order.createdAt
                }
            ]

            if (props.order.status === 'Processing') {
                events.push({
                    type: 'processing',
                    message: t('adminOrderDetailsModal.timeline.processingStarted'),
                    timestamp: props.order.updatedAt
                })
            }

            if (props.order.status === 'Shipped') {
                events.push({
                    type: 'processing',
                    message: t('adminOrderDetailsModal.timeline.processingStarted'),
                    timestamp: props.order.updatedAt
                }, {
                    type: 'shipped',
                    message: t('adminOrderDetailsModal.timeline.shipped'),
                    timestamp: props.order.updatedAt
                })
            }

            if (props.order.status === 'Delivered') {
                events.push({
                    type: 'processing',
                    message: t('adminOrderDetailsModal.timeline.processingStarted'),
                    timestamp: props.order.updatedAt
                }, {
                    type: 'shipped',
                    message: t('adminOrderDetailsModal.timeline.shipped'),
                    timestamp: props.order.updatedAt
                }, {
                    type: 'completed',
                    message: t('adminOrderDetailsModal.timeline.delivered'),
                    timestamp: props.order.updatedAt
                })
            }

            if (props.order.status === 'Cancelled') {
                events.push({
                    type: 'cancelled',
                    message: t('adminOrderDetailsModal.timeline.cancelled'),
                    timestamp: props.order.cancelledAt || props.order.updatedAt
                })
            }

            return events
        })

        const rewardBreakdown = computed(() => ({
            coupon: props.order?.discountBreakdown?.coupon || props.order?.discount || 0,
            specialOffer:
                props.order?.discountBreakdown?.specialOffer ||
                props.order?.metadata?.specialOfferDiscount ||
                0,
            cluesBucks:
                props.order?.discountBreakdown?.cluesBucks ||
                props.order?.cluesBucks?.discount ||
                0,
            storeCredit:
                props.order?.discountBreakdown?.storeCredit ||
                props.order?.storeCredit?.amountUsed ||
                0,
        }))

        const loadProductDetails = async () => {
            try {
                if (props.order?.products && props.order.products.length > 0) {
                    const products = await Promise.all(
                        props.order.products.map(async (item) => {
                            if (typeof item.product === 'string') {
                                try {
                                    const details = await productStore.fetchProductById(item.product);
                                    return { ...item, product: details };
                                } catch (error) {
                                    console.error(`Error fetching product ${item.product}:`, error);
                                    return item;
                                }
                            }
                            return item;
                        })
                    );
                    loadedProducts.value = products;
                }
            } catch (error) {
                console.error('Error loading product details:', error);
            } finally {
                isLoading.value = false;
            }
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        const formatStatus = (status) => {
            return t(`adminOrderDetailsModal.statuses.${status?.toLowerCase?.()}`, status)
        }

        const formatCurrency = (amount) => {
            const currency = props.order?.currency === 'XOF' ? 'XOF' : 'NGN';
            return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-NG', {
                style: 'currency',
                currency,
                minimumFractionDigits: 2
            }).format(amount)
        }

        const getStatusClass = (status) => {
            const classes = {
                Pending: 'bg-yellow-100 text-yellow-800',
                Processing: 'bg-blue-100 text-blue-800',
                Shipped: 'bg-purple-100 text-purple-800',
                Delivered: 'bg-green-100 text-green-800',
                Cancelled: 'bg-red-100 text-red-800'
            }
            return classes[status] || 'bg-gray-100 text-gray-800'
        }

        const getPayoutStatusClass = (status) => {
            const normalizedStatus = (status || '').toLowerCase();
            const classes = {
                pending: 'bg-yellow-100 text-yellow-800',
                processing: 'bg-blue-100 text-blue-800',
                processed: 'bg-green-100 text-green-800',
                failed: 'bg-red-100 text-red-800',
            };
            return classes[normalizedStatus] || 'bg-gray-100 text-gray-800';
        };

        const formatPayoutStatus = (status) => {
            if (!status) {
                return t('adminOrderDetailsModal.labels.notAvailable');
            }
            return status
                .toString()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase());
        };

        const getTimelineIcon = (type) => {
            const icons = {
                order_placed: ShoppingCart,
                processing: Truck,
                shipped: Truck,
                completed: CheckCircle,
                cancelled: XCircle
            }
            return icons[type] || CheckCircle
        }

        const getTimelineItemClass = (type) => {
            const classes = {
                order_placed: 'bg-blue-500',
                processing: 'bg-yellow-500',
                shipped: 'bg-purple-500',
                completed: 'bg-green-500',
                cancelled: 'bg-red-500'
            }
            return classes[type] || 'bg-gray-500'
        }

        watchEffect(() => {
            if (props.order) {
                loadProductDetails();
            }
        });

        const getProductImage = (item) => {
            return item.product?.images?.[0] || '';
        };

        const getProductName = (item) => {
            if (typeof item.product === 'string') {
                return t('adminOrderDetailsModal.product.loading');
            }
            return item.product?.name || t('adminOrderDetailsModal.product.unavailable');
        };

        const getVariantDetails = (variant) => {
            if (!variant) {
                return [];
            }

            const details = [];

            if (variant.color) {
                const colorName =
                    typeof variant.color === 'object' ? variant.color.name : variant.color;
                if (colorName) {
                    details.push(`${t('adminOrderDetailsModal.labels.color')} ${colorName}`);
                }
            }

            if (Array.isArray(variant.attributes)) {
                variant.attributes.forEach((attribute) => {
                    if (attribute?.name && attribute?.value) {
                        details.push(`${attribute.name}: ${attribute.value}`);
                    }
                });
            }

            const hasSizeAttribute = Array.isArray(variant.attributes)
                && variant.attributes.some((attribute) => attribute?.name?.toLowerCase() === 'size');

            if (variant.size && !hasSizeAttribute) {
                details.push(`${t('adminOrderDetailsModal.labels.size')} ${variant.size}`);
            }

            return details;
        };

        return {
            t,
            timeline,
            rewardBreakdown,
            sellerStoreName,
            formatDate,
            formatStatus,
            formatCurrency,
            getStatusClass,
            getPayoutStatusClass,
            formatPayoutStatus,
            getTimelineIcon,
            getTimelineItemClass,
            getProductImage,
            getProductName,
            getVariantDetails,

            isLoading,
            loadedProducts,
        }
    }
}
</script>

<!-- OrderDetailsModal.vue -->
<template>
    <div
        v-if="order"
        class="fixed inset-0 z-[120] bg-black/70 p-4 sm:p-6"
        @click.self="$emit('close')"
    >
        <div class="mx-auto max-w-5xl">
        <div class="relative z-[121] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg bg-white p-6 shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:p-8">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ t('adminOrderDetailsModal.title', { id: order.orderId }) }}
                    </h3>
                    <p class="text-sm text-gray-500">
                        {{ t('adminOrderDetailsModal.placedOn', { date: formatDate(order.createdAt) }) }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{ t('adminOrderDetailsModal.email', { value: order.user?.email }) }}</p>
                    <p class="text-sm text-gray-500">
                        {{ t('adminOrderDetailsModal.buyer', { value: order.user?.username }) }}</p>
                </div>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
                    <XIcon class="h-6 w-6" />
                </button>
            </div>

            <!-- Order Summary -->
            <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                <!-- Shipping Info -->
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminOrderDetailsModal.sections.shippingInformation') }}</h4>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="mb-1"><span class="font-medium">{{ t('adminOrderDetailsModal.labels.address') }}</span> {{ order.address.street }}</p>
                        <p class="mb-1">{{ order.address.city }}, {{ order.address.state }}</p>
                        <p>{{ order.address.country }} {{ order.address.postalCode }}</p>
                    </div>
                </div>

                <!-- Payment Info -->
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminOrderDetailsModal.sections.paymentInformation') }}</h4>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="mb-1"><span class="font-medium">{{ t('adminOrderDetailsModal.labels.method') }}</span> {{ order.paymentMethod }}</p>
                        <p class="mb-1"><span class="font-medium">{{ t('adminOrderDetailsModal.labels.orderStatus') }}</span>
                            <span :class="[
                                'ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                getStatusClass(order.status)
                            ]">
                                {{ formatStatus(order.status) }}
                            </span>
                        </p>
                        <p v-if="order.transactionId"><span class="font-medium">{{ t('adminOrderDetailsModal.labels.transactionId') }}</span>
                            {{ order.transactionId }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminOrderDetailsModal.sections.sellerInformation') }}</h4>
                    <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div class="flex flex-wrap items-center gap-2">
                            <p class="font-medium text-gray-900">
                                {{ sellerStoreName }}
                            </p>
                            <span
                                v-if="order.seller?.sellerProfile?.isVerified"
                                class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700"
                            >
                                {{ t('adminOrderDetailsModal.labels.verifiedSeller') }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.sellerUsername') }}</span>
                            {{ order.seller?.username || t('adminOrderDetailsModal.labels.notAvailable') }}
                        </p>
                        <p class="text-sm text-gray-600 break-all">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.sellerEmail') }}</span>
                            {{ order.seller?.email || t('adminOrderDetailsModal.labels.notAvailable') }}
                        </p>
                    </div>
                </div>

                <div v-if="order.payoutSummary">
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminOrderDetailsModal.sections.payoutInformation') }}</h4>
                    <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p class="text-sm text-gray-600">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.payoutMethod') }}</span>
                            {{ order.payoutSummary.paymentMethod || t('adminOrderDetailsModal.labels.notAvailable') }}
                        </p>
                        <p class="text-sm text-gray-600">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.payoutStatus') }}</span>
                            <span :class="[
                                'ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                getPayoutStatusClass(order.payoutSummary.status)
                            ]">
                                {{ formatPayoutStatus(order.payoutSummary.status) }}
                            </span>
                        </p>
                        <p v-if="order.payoutSummary.providerStatus" class="text-sm text-gray-600">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.providerStatus') }}</span>
                            {{ formatPayoutStatus(order.payoutSummary.providerStatus) }}
                        </p>
                        <p v-if="order.payoutSummary.transferReference" class="text-sm text-gray-600 break-all">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.transferReference') }}</span>
                            {{ order.payoutSummary.transferReference }}
                        </p>
                        <p v-if="order.payoutSummary.providerPayoutId" class="text-sm text-gray-600 break-all">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.providerPayoutId') }}</span>
                            {{ order.payoutSummary.providerPayoutId }}
                        </p>
                        <p v-if="order.payoutSummary.scheduledDate" class="text-sm text-gray-600">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.scheduledDate') }}</span>
                            {{ formatDate(order.payoutSummary.scheduledDate) }}
                        </p>
                        <p v-if="order.payoutSummary.processedAt" class="text-sm text-gray-600">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.processedAt') }}</span>
                            {{ formatDate(order.payoutSummary.processedAt) }}
                        </p>
                        <p v-if="order.payoutSummary.errorMessage" class="text-sm text-red-600">
                            <span class="font-medium">{{ t('adminOrderDetailsModal.labels.payoutError') }}</span>
                            {{ order.payoutSummary.errorMessage }}
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="order.status === 'Cancelled' || order.cancelReason || order.cancelledAt" class="mb-6">
                <h4 class="font-medium text-gray-900 mb-2">{{ t('adminOrderDetailsModal.sections.cancellationDetails') }}</h4>
                <div class="bg-red-50 p-4 rounded-lg space-y-2">
                    <p class="text-sm text-gray-700">
                        <span class="font-medium">{{ t('adminOrderDetailsModal.labels.cancelledAt') }}</span>
                        {{ order.cancelledAt ? formatDate(order.cancelledAt) : t('adminOrderDetailsModal.labels.notAvailable') }}
                    </p>
                    <p class="text-sm text-gray-700">
                        <span class="font-medium">{{ t('adminOrderDetailsModal.labels.cancelReason') }}</span>
                        {{ order.cancelReason || t('adminOrderDetailsModal.labels.notAvailable') }}
                    </p>
                </div>
            </div>

            <!-- Financial Summary -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">{{ t('adminOrderDetailsModal.financial.platformFee') }}</p>
                    <p class="text-xl font-semibold">{{ formatCurrency(order.platformFee) }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">{{ t('adminOrderDetailsModal.financial.vendorAmount') }}</p>
                    <p class="text-xl font-semibold">{{ formatCurrency(order.vendorAmount) }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">{{ t('adminOrderDetailsModal.financial.cluesBucksUsed') }}</p>
                    <p class="text-xl font-semibold">{{ order.cluesBucks?.pointsUsed || 0 }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">{{ t('adminOrderDetailsModal.financial.storeCreditUsed') }}</p>
                    <p class="text-xl font-semibold">{{ formatCurrency(order.storeCredit?.amountUsed || 0) }}</p>
                </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 class="font-medium text-gray-900 mb-3">{{ t('adminOrderDetailsModal.sections.rewardBreakdown') }}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">{{ t('adminOrderDetailsModal.summary.couponDiscount') }}</span>
                        <span class="font-medium text-gray-900">-{{ formatCurrency(rewardBreakdown.coupon) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">{{ t('adminOrderDetailsModal.summary.specialOfferDiscount') }}</span>
                        <span class="font-medium text-gray-900">-{{ formatCurrency(rewardBreakdown.specialOffer) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">{{ t('adminOrderDetailsModal.summary.cluesBucksDiscount') }}</span>
                        <span class="font-medium text-gray-900">-{{ formatCurrency(rewardBreakdown.cluesBucks) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">{{ t('adminOrderDetailsModal.summary.storeCredit') }}</span>
                        <span class="font-medium text-gray-900">-{{ formatCurrency(rewardBreakdown.storeCredit) }}</span>
                    </div>
                </div>
            </div>

            <!-- Coupon Info -->
            <div v-if="order.appliedCoupon" class="mb-6">
                <h4 class="font-medium text-gray-900 mb-2">{{ t('adminOrderDetailsModal.sections.couponApplied') }}</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p><span class="font-medium">{{ t('adminOrderDetailsModal.labels.code') }}</span> {{ order.appliedCoupon.code }}</p>
                    <p><span class="font-medium">{{ t('adminOrderDetailsModal.labels.discount') }}</span> {{ formatCurrency(order.discount) }}</p>
                </div>
            </div>

            <!-- Order Items -->
            <div class="mb-6">
                <h4 class="font-medium text-gray-900 mb-2">{{ t('adminOrderDetailsModal.sections.orderItems') }}</h4>
                <div class="bg-white shadow overflow-hidden rounded-lg">
                    <!-- Loading state -->
                    <div v-if="isLoading" class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>

                    <!-- Table with products -->
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ t('adminOrderDetailsModal.table.product') }}</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ t('adminOrderDetailsModal.table.quantity') }}
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ t('adminOrderDetailsModal.table.price') }}</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ t('adminOrderDetailsModal.table.total') }}</th>
                            </tr>
                        </thead>
                        <!-- Order Items -->
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(item, itemIdx) in order.products" :key="item._id || `${getProductName(item)}-${itemIdx}`">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <template v-if="getProductImage(item)">
                                                <img :src="getProductImage(item)" :alt="getProductName(item)"
                                                    class="h-10 w-10 rounded object-cover">
                                            </template>
                                            <div v-else
                                                class="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                                <ImageIcon class="h-6 w-6 text-gray-400" />
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ getProductName(item) }}
                                            </div>
                                            <div v-if="getVariantDetails(item.variant).length" class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                                                <span v-for="detail in getVariantDetails(item.variant)" :key="detail">
                                                    {{ detail }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ item.quantity }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatCurrency(item.price) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatCurrency(item.price * item.quantity) }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="bg-gray-50">
                            <tr>
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">{{ t('adminOrderDetailsModal.summary.subtotal') }}</td>
                                <td class="px-6 py-3 text-sm text-gray-900">{{ formatCurrency(order.subtotal) }}</td>
                            </tr>
                            <tr v-if="rewardBreakdown.coupon">
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">{{ t('adminOrderDetailsModal.summary.couponDiscount') }}</td>
                                <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(rewardBreakdown.coupon) }}</td>
                            </tr>
                            <tr v-if="rewardBreakdown.specialOffer">
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">{{ t('adminOrderDetailsModal.summary.specialOfferDiscount') }}</td>
                                <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(rewardBreakdown.specialOffer) }}</td>
                            </tr>
                            <tr v-if="rewardBreakdown.cluesBucks">
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">{{ t('adminOrderDetailsModal.summary.cluesBucksDiscount') }}</td>
                                <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(rewardBreakdown.cluesBucks) }}</td>
                            </tr>
                            <tr v-if="rewardBreakdown.storeCredit">
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">{{ t('adminOrderDetailsModal.summary.storeCredit') }}</td>
                                <td class="px-6 py-3 text-sm text-red-600">-{{ formatCurrency(rewardBreakdown.storeCredit) }}</td>
                            </tr>
                            <tr>
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-500">{{ t('adminOrderDetailsModal.summary.shipping') }}</td>
                                <td class="px-6 py-3 text-sm text-gray-900">
                                    {{ formatCurrency(order.shippingFee || 0) }}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" class="px-6 py-3 text-right font-medium text-gray-900">{{ t('adminOrderDetailsModal.summary.total') }}</td>
                                <td class="px-6 py-3 text-sm font-bold text-gray-900">{{
                                    formatCurrency(order.totalAmount) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- Order Timeline -->
            <div>
                <h4 class="font-medium text-gray-900 mb-2">{{ t('adminOrderDetailsModal.sections.orderTimeline') }}</h4>
                <div class="flow-root">
                    <ul role="list" class="-mb-5">
                        <li v-for="(event, eventIdx) in timeline" :key="eventIdx">
                            <div class="relative pb-3">
                                <div class="relative flex space-x-3">
                                    <div>
                                        <span
                                            class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                                            :class="getTimelineItemClass(event.type)">
                                            <component :is="getTimelineIcon(event.type)" class="h-5 w-5 text-white" />
                                        </span>
                                    </div>
                                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                        <div>
                                            <p class="text-sm text-gray-500">{{ event.message }}</p>
                                        </div>
                                        <div class="whitespace-nowrap text-right text-sm text-gray-500">
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

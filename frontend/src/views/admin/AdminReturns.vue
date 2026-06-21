<!-- frontend/src/views/admin/AdminReturns.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-4 bg-white px-4 py-6 sm:px-6 lg:px-8 shadow-sm rounded-2xl border border-slate-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-[#ff934b] to-[#ff5e62] rounded-xl flex items-center justify-center shadow-lg">
                        <RotateCcw class="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-slate-800 tracking-tight">Returns Management</h2>
                        <p class="text-xs text-slate-400 font-semibold mt-0.5">Manage and review buyer return requests</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Search -->
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Search</label>
                    <div class="relative">
                        <input type="text" v-model="filters.search" placeholder="Search by Return ID, Order ID, or User..."
                            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all text-sm"
                            @input="handleSearch">
                        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all text-sm font-medium cursor-pointer"
                            @change="applyFilters">
                            <option value="all">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown class="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <!-- Reset Filters -->
                <div class="flex items-end">
                    <button @click="clearFilters"
                        class="w-full sm:w-auto px-5 py-2 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw class="w-4 h-4" />
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Returns List -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <!-- Mobile View -->
            <div class="block lg:hidden divide-y divide-slate-100">
                <template v-if="loading">
                    <div class="px-6 py-12 text-center">
                        <div class="animate-spin h-8 w-8 border-3 border-[#ff934b] rounded-full border-t-transparent mx-auto"></div>
                    </div>
                </template>
                <template v-else-if="returns.length === 0">
                    <div class="px-6 py-12 text-center text-slate-500 font-semibold">
                        No return requests found.
                    </div>
                </template>
                <template v-else>
                    <div v-for="ret in returns" :key="ret._id" class="p-4 space-y-4">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <div class="text-sm font-bold text-slate-800">#{{ ret.returnId }}</div>
                                <div class="text-xs text-slate-400 font-semibold mt-0.5">Order #{{ ret.orderId }}</div>
                                <div class="text-sm text-slate-700 mt-2 font-medium">Buyer: {{ ret.user?.username || 'Unknown' }}</div>
                                <div class="text-xs text-slate-400 font-medium">{{ ret.user?.email }}</div>
                            </div>
                            <span :class="[
                                'px-3 py-1 text-xs font-bold rounded-full shadow-sm',
                                getStatusClass(ret.status)
                            ]">
                                {{ ret.status }}
                            </span>
                        </div>

                        <div class="text-sm border-t border-slate-50 pt-3">
                            <span class="font-bold text-slate-500 uppercase text-xs tracking-wider">Reason:</span>
                            <span class="ml-2 font-semibold text-slate-700">{{ formatReason(ret.reason) }}</span>
                        </div>

                        <div class="flex gap-2 border-t border-slate-50 pt-3">
                            <button @click="viewDetails(ret)"
                                class="flex-1 py-2 text-center text-xs font-bold text-[#ff934b] bg-[#ff934b]/5 hover:bg-[#ff934b]/10 rounded-xl transition-all">
                                View Details
                            </button>
                            <button @click="openStatusModal(ret)"
                                class="flex-1 py-2 text-center text-xs font-bold text-white bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] rounded-xl transition-all shadow-sm">
                                Update Status
                            </button>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Desktop View -->
            <div class="hidden lg:block overflow-x-auto">
                <table class="w-full divide-y divide-slate-100 text-left table-fixed">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="w-[18%] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Return ID</th>
                            <th class="w-[18%] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Order ID</th>
                            <th class="w-[20%] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</th>
                            <th class="w-[18%] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Reason</th>
                            <th class="w-[12%] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            <th class="w-[14%] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        <template v-if="loading">
                            <tr>
                                <td colspan="6" class="px-6 py-12 text-center">
                                    <div class="animate-spin h-8 w-8 border-3 border-[#ff934b] rounded-full border-t-transparent mx-auto"></div>
                                </td>
                            </tr>
                        </template>
                        <template v-else-if="returns.length === 0">
                            <tr>
                                <td colspan="6" class="px-6 py-12 text-center text-slate-500 font-semibold">
                                    No return requests found.
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="ret in returns" :key="ret._id" class="hover:bg-slate-50/50 transition-colors">
                                <td class="px-6 py-4 align-middle">
                                    <span class="text-sm font-bold text-slate-800">#{{ ret.returnId }}</span>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <span class="text-sm font-semibold text-slate-600">#{{ ret.orderId }}</span>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <div class="text-sm font-bold text-slate-700">{{ ret.user?.username || 'Unknown' }}</div>
                                    <div class="text-xs text-slate-400 font-medium">{{ ret.user?.email }}</div>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <span class="text-sm font-semibold text-slate-600">{{ formatReason(ret.reason) }}</span>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <span :class="[
                                        'px-3 py-1 text-xs font-bold rounded-full shadow-sm',
                                        getStatusClass(ret.status)
                                    ]">
                                        {{ ret.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 align-middle">
                                    <div class="flex items-center gap-3">
                                        <button @click="viewDetails(ret)" class="text-[#ff934b] hover:text-[#ff5e62] text-sm font-bold transition-colors">
                                            Details
                                        </button>
                                        <span class="text-slate-200">|</span>
                                        <button @click="openStatusModal(ret)" class="text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors">
                                            Update
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all">
                        Previous
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all">
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-slate-600">
                            Showing <span class="font-bold">{{ startItem }}</span> to <span class="font-bold">{{ endItem }}</span> of <span class="font-bold">{{ totalItems }}</span> requests
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="px-3.5 py-1.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Previous
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="px-3.5 py-1.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Details Modal -->
        <div
            v-if="showDetailsModal"
            class="fixed inset-0 z-[120] bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6 flex items-center justify-center"
            @click.self="showDetailsModal = false"
        >
            <div class="mx-auto max-w-3xl w-full">
                <!-- Modal Panel -->
                <div class="relative z-[121] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]">
                    <!-- Modal Header -->
                    <div class="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 text-white sm:px-8">
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                                    Return Request Details
                                </p>
                                <h3 class="mt-2 text-xl font-semibold text-white sm:text-2xl">
                                    #{{ selectedReturn.returnId }}
                                </h3>
                                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                                    <span class="flex items-center gap-1.5">
                                        <ShoppingBagIcon class="h-4 w-4 text-slate-400" />
                                        Order #{{ selectedReturn.orderId }}
                                    </span>
                                    <span class="flex items-center gap-1.5">
                                        <UserIcon class="h-4 w-4 text-slate-400" />
                                        {{ selectedReturn.user?.username || 'Unknown' }}
                                    </span>
                                    <span class="flex items-center gap-1.5 break-all">
                                        <MailIcon class="h-4 w-4 text-slate-400" />
                                        {{ selectedReturn.user?.email }}
                                    </span>
                                </div>
                            </div>
                            <button
                                @click="showDetailsModal = false"
                                class="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none"
                            >
                                <XIcon class="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div class="bg-slate-50 px-6 py-6 sm:px-8 sm:py-8 space-y-6">
                        <!-- Meta Info Cards -->
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <!-- Status Card -->
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Return Status
                                    </p>
                                    <div class="mt-2">
                                        <span :class="[
                                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border',
                                            getDetailsStatusClass(selectedReturn.status)
                                        ]">
                                            <component :is="getTimelineIcon(selectedReturn.status)" class="h-3.5 w-3.5" />
                                            {{ selectedReturn.status }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Reason Card -->
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                                <div class="p-2 bg-orange-50 rounded-xl text-[#ff934b]">
                                    <HelpCircleIcon class="h-5 w-5" />
                                </div>
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Reason for Return
                                    </p>
                                    <p class="mt-1 text-sm font-semibold text-slate-900 capitalize">
                                        {{ formatReason(selectedReturn.reason) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Customer Comments Card -->
                        <div v-if="selectedReturn.comments" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                            <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                                <MessageSquareIcon class="h-4 w-4 text-slate-400" />
                                Customer Comments
                            </h4>
                            <div class="rounded-xl bg-slate-50 p-4 text-sm text-slate-700 italic border border-slate-100">
                                "{{ selectedReturn.comments }}"
                            </div>
                        </div>

                        <!-- Products List Card -->
                        <div v-if="selectedReturn.products && selectedReturn.products.length" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div class="flex items-center justify-between gap-3 mb-4">
                                <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                                    <PackageIcon class="h-4 w-4 text-slate-400" />
                                    Items in Return Order
                                </h4>
                                <span class="text-xs font-semibold text-slate-400">
                                    {{ selectedReturn.products.length }} Item(s)
                                </span>
                            </div>
                            <div class="space-y-3">
                                <div v-for="item in selectedReturn.products" :key="item._id"
                                    class="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 items-center justify-between">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <div class="w-12 h-12 border border-slate-200 rounded-lg overflow-hidden bg-white shrink-0 shadow-sm">
                                            <img :src="item.product?.images?.[0] || '/placeholder-image.jpg'"
                                                class="w-full h-full object-cover">
                                        </div>
                                        <div class="min-w-0">
                                            <h5 class="text-sm font-bold text-slate-800 truncate leading-tight">{{ item.product?.name || 'Unknown Product' }}</h5>
                                            <p class="text-xs text-slate-400 mt-1 font-semibold">
                                                Price: {{ formatCurrency(item.price, selectedReturn.currency) }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="text-right shrink-0">
                                        <p class="text-xs font-semibold text-slate-500">Qty</p>
                                        <p class="text-sm font-bold text-slate-800 mt-0.5">{{ item.quantity }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Timeline Card -->
                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5 mb-4">
                                <CalendarIcon class="h-4 w-4 text-slate-400" />
                                Timeline & Activity History
                            </h4>
                            <div class="flow-root">
                                <ul role="list" class="-mb-5">
                                    <li v-for="(history, index) in selectedReturn.statusHistory" :key="index">
                                        <div class="relative pb-4">
                                            <div class="relative flex space-x-3">
                                                <div>
                                                    <span
                                                        class="flex h-8 w-8 items-center justify-center rounded-full ring-6 ring-white shadow-sm"
                                                        :class="getTimelineItemClass(history.status)">
                                                        <component :is="getTimelineIcon(history.status)" class="h-4 w-4 text-white" />
                                                    </span>
                                                </div>
                                                <div class="flex min-w-0 flex-1 items-start justify-between gap-4 pt-1">
                                                    <div>
                                                        <p class="text-sm font-bold text-slate-800">{{ history.status }}</p>
                                                        <p v-if="history.comment" class="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">{{ history.comment }}</p>
                                                    </div>
                                                    <div class="whitespace-nowrap text-right text-xs text-slate-400 font-semibold pt-0.5">
                                                        {{ new Date(history.timestamp).toLocaleString() }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer Actions -->
                    <div class="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3 sm:px-8">
                        <button 
                            type="button" 
                            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none"
                            @click="showDetailsModal = false"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Modal -->
        <div
            v-if="showStatusModal"
            class="fixed inset-0 z-[120] bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6 flex items-center justify-center"
            @click.self="showStatusModal = false"
        >
            <div class="mx-auto max-w-md w-full">
                <!-- Modal Panel -->
                <div class="relative z-[121] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
                    <!-- Modal Header -->
                    <div class="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex justify-between items-center">
                        <h3 class="text-lg font-bold">Update Return Status</h3>
                        <button
                            @click="showStatusModal = false"
                            class="rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none"
                        >
                            <XIcon class="h-4.5 w-4.5" />
                        </button>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="updateStatusSubmit">
                        <div class="bg-slate-50 p-6 space-y-4">
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">New Status</label>
                                <div class="relative">
                                    <select v-model="newStatus"
                                        class="appearance-none w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all text-sm font-semibold cursor-pointer"
                                        required>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved (Allow Return)</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Processing">Processing Return</option>
                                        <option value="Completed">Completed (Refund Issued)</option>
                                    </select>
                                    <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown class="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Note / Comment</label>
                                <textarea v-model="statusComment" rows="3"
                                    class="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all text-sm resize-none font-semibold"
                                    placeholder="Add explanation for this status update..."></textarea>
                            </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
                            <button type="button" @click="showStatusModal = false"
                                class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none">
                                Cancel
                            </button>
                            <button type="submit"
                                class="rounded-xl bg-gradient-to-r from-[#ff934b] to-[#ff5e62] text-white px-5 py-2 hover:from-[#ff5e62] hover:to-[#ff934b] font-bold text-sm transition-all shadow-sm focus:outline-none">
                                Submit Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useReturnStore } from '@/store/returnStore';
import { useI18n } from 'vue-i18n';
import {
    Search,
    ChevronDown,
    RotateCcw,
    RefreshCw,
    AlertCircle,
    User as UserIcon,
    Mail as MailIcon,
    ShoppingBag as ShoppingBagIcon,
    X as XIcon,
    CheckCircle2,
    Clock as ClockIcon,
    Check as CheckIcon,
    MessageSquare as MessageSquareIcon,
    Calendar as CalendarIcon,
    Package as PackageIcon,
    HelpCircle as HelpCircleIcon
} from 'lucide-vue-next';

export default {
    name: 'AdminReturns',
    components: {
        Search,
        ChevronDown,
        RotateCcw,
        RefreshCw,
        AlertCircle,
        UserIcon,
        MailIcon,
        ShoppingBagIcon,
        XIcon,
        CheckCircle2,
        ClockIcon,
        CheckIcon,
        MessageSquareIcon,
        CalendarIcon,
        PackageIcon,
        HelpCircleIcon
    },

    setup() {
        const { locale } = useI18n();
        const returnStore = useReturnStore();

        const formatCurrency = (amount, currency = 'NGN') => {
            const currencyCode = currency === 'XOF' ? 'XOF' : 'NGN';
            return new Intl.NumberFormat(locale.value === 'fr' ? 'fr-FR' : 'en-NG', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: currencyCode === 'XOF' ? 0 : 2
            }).format(amount);
        };

        const getDetailsStatusClass = (status) => {
            const classes = {
                Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200/50',
                Approved: 'bg-green-50 text-green-700 border-green-200/50',
                Rejected: 'bg-rose-50 text-rose-700 border-rose-200/50',
                Processing: 'bg-blue-50 text-blue-700 border-blue-200/50',
                Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
            };
            return classes[status] || 'bg-slate-50 text-slate-700 border-slate-200/50';
        };

        const getTimelineIcon = (status) => {
            const icons = {
                Pending: 'ClockIcon',
                Approved: 'CheckIcon',
                Rejected: 'XIcon',
                Processing: 'RotateCcw',
                Completed: 'CheckCircle2'
            };
            return icons[status] || 'ClockIcon';
        };

        const getTimelineItemClass = (status) => {
            const classes = {
                Pending: 'bg-yellow-500',
                Approved: 'bg-green-500',
                Rejected: 'bg-rose-500',
                Processing: 'bg-blue-500',
                Completed: 'bg-emerald-500'
            };
            return classes[status] || 'bg-slate-500';
        };

        // State
        const returns = ref([]);
        const loading = ref(false);
        const selectedReturn = ref(null);
        
        const showDetailsModal = ref(false);
        const showStatusModal = ref(false);

        const newStatus = ref('Pending');
        const statusComment = ref('');

        const currentPage = ref(1);
        const totalItems = ref(0);
        const totalPages = ref(1);
        const itemsPerPage = ref(10);

        const filters = ref({
            search: '',
            status: 'all'
        });

        // Computed
        const startItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1);
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

        // Load returns
        const fetchReturns = async () => {
            loading.value = true;
            try {
                const res = await returnStore.fetchAdminReturns({
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    status: filters.value.status,
                    search: filters.value.search
                });
                returns.value = res.returns;
                totalItems.value = res.pagination.total;
                totalPages.value = res.pagination.pages;
                currentPage.value = res.pagination.page;
            } catch (error) {
                console.error('Error fetching admin returns:', error);
            } finally {
                loading.value = false;
            }
        };

        const applyFilters = () => {
            currentPage.value = 1;
            fetchReturns();
        };

        const handleSearch = () => {
            currentPage.value = 1;
            fetchReturns();
        };

        const clearFilters = () => {
            filters.value = {
                search: '',
                status: 'all'
            };
            currentPage.value = 1;
            fetchReturns();
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchReturns();
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                fetchReturns();
            }
        };

        const formatReason = (reason) => {
            const reasons = {
                defective: 'Defective / Damaged',
                wrong_item: 'Wrong Item Received',
                not_as_described: 'Item Not as Described',
                size_issue: 'Size / Fit Issue',
                changed_mind: 'Changed Mind'
            };
            return reasons[reason] || reason;
        };

        const getStatusClass = (status) => {
            const classes = {
                Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                Approved: 'bg-green-100 text-green-800 border border-green-200',
                Rejected: 'bg-red-100 text-red-800 border border-red-200',
                Processing: 'bg-blue-100 text-blue-800 border border-blue-200',
                Completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            };
            return classes[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
        };

        const viewDetails = (ret) => {
            selectedReturn.value = ret;
            showDetailsModal.value = true;
        };

        const openStatusModal = (ret) => {
            selectedReturn.value = ret;
            newStatus.value = ret.status;
            statusComment.value = '';
            showStatusModal.value = true;
        };

        const updateStatusSubmit = async () => {
            if (!selectedReturn.value?._id) return;
            try {
                await returnStore.updateReturnStatus(
                    selectedReturn.value._id,
                    newStatus.value,
                    statusComment.value
                );
                showStatusModal.value = false;
                fetchReturns();
            } catch (error) {
                console.error('Error submitting status update:', error);
            }
        };

        onMounted(() => {
            fetchReturns();
        });

        return {
            returns,
            loading,
            selectedReturn,
            showDetailsModal,
            showStatusModal,
            newStatus,
            statusComment,
            currentPage,
            totalPages,
            totalItems,
            startItem,
            endItem,
            filters,
            applyFilters,
            handleSearch,
            clearFilters,
            prevPage,
            nextPage,
            formatReason,
            getStatusClass,
            viewDetails,
            openStatusModal,
            updateStatusSubmit,
            formatCurrency,
            getDetailsStatusClass,
            getTimelineIcon,
            getTimelineItemClass
        };
    }
};
</script>

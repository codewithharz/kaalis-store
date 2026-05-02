// frontend/src/views/admin/AdminProducts.vue
<template>
    <div>
        <!-- Header & Actions -->
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-3 px-4 sm:px-8 py-4 bg-white">
            <h2 class="text-2xl font-bold text-gray-800">{{ t('adminProducts.title') }}</h2>
            <div class="flex flex-col items-start sm:items-end gap-2">
                <button
                    type="button"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    @click="goToCreateProduct"
                >
                    {{ t('adminProducts.addNewProduct') }}
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
                <!-- Search -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminProducts.filters.search') }}</label>
                    <input type="text" v-model="filters.search" :placeholder="t('adminProducts.filters.searchPlaceholder')"
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>

                <!-- Category Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminProducts.filters.category') }}</label>
                    <div class="relative">
                        <select v-model="filters.category"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="applyFilters">
                            <option value="">{{ t('adminProducts.filters.allCategories') }}</option>
                            <option v-for="category in categories" :key="category._id" :value="category._id">
                                {{ category.name }}
                            </option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Stock Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminProducts.filters.stockStatus') }}</label>
                    <div class="relative">
                        <select v-model="filters.stock"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="applyFilters">
                            <option value="">{{ t('adminProducts.filters.all') }}</option>
                            <option value="in_stock">{{ t('adminProducts.stockStatuses.inStock') }}</option>
                            <option value="low_stock">{{ t('adminProducts.stockStatuses.lowStock') }}</option>
                            <option value="out_of_stock">{{ t('adminProducts.stockStatuses.outOfStock') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Seller Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminProducts.filters.seller') }}</label>
                    <div class="relative">
                        <select v-model="filters.seller"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="applyFilters">
                            <option value="">{{ t('adminProducts.filters.allSellers') }}</option>
                            <option v-for="seller in sellers" :key="seller._id" :value="seller._id">
                                {{ seller.storeName }}
                            </option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminProducts.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="applyFilters">
                            <option value="">{{ t('adminProducts.filters.all') }}</option>
                            <option value="active">{{ t('adminProducts.statuses.active') }}</option>
                            <option value="inactive">{{ t('adminProducts.statuses.inactive') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Created Date Range -->
                <div class="sm:col-span-2 xl:col-span-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminProducts.filters.createdDate') }}</label>
                    <div class="grid grid-cols-1 gap-2">
                        <Popover v-model:open="fromDateOpen">
                            <PopoverTrigger as-child>
                                <button
                                    type="button"
                                    class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                                    :aria-label="t('adminProducts.filters.createdFrom')"
                                >
                                    <span :class="filters.createdFrom ? 'text-gray-900' : 'text-gray-400'">
                                        {{ formatDateFilterLabel(filters.createdFrom, 'adminProducts.filters.createdFrom') }}
                                    </span>
                                    <CalendarDays class="h-4 w-4 text-gray-400" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" class="w-auto p-0">
                                <div class="border-b border-gray-100 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {{ t('adminProducts.filters.createdFrom') }}
                                </div>
                                <Calendar
                                    :model-value="calendarFromValue"
                                    :placeholder="calendarFromValue || calendarToValue || todayCalendarDate"
                                    @update:modelValue="setCreatedDate('from', $event)"
                                />
                                <div class="flex justify-end border-t border-gray-100 p-2">
                                    <button
                                        type="button"
                                        class="text-xs font-medium text-gray-500 hover:text-gray-700"
                                        @click="clearCreatedDate('from')"
                                    >
                                        {{ t('adminProducts.filters.clearDate') }}
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Popover v-model:open="toDateOpen">
                            <PopoverTrigger as-child>
                                <button
                                    type="button"
                                    class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                                    :aria-label="t('adminProducts.filters.createdTo')"
                                >
                                    <span :class="filters.createdTo ? 'text-gray-900' : 'text-gray-400'">
                                        {{ formatDateFilterLabel(filters.createdTo, 'adminProducts.filters.createdTo') }}
                                    </span>
                                    <CalendarDays class="h-4 w-4 text-gray-400" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" class="w-auto p-0">
                                <div class="border-b border-gray-100 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {{ t('adminProducts.filters.createdTo') }}
                                </div>
                                <Calendar
                                    :model-value="calendarToValue"
                                    :placeholder="calendarToValue || calendarFromValue || todayCalendarDate"
                                    @update:modelValue="setCreatedDate('to', $event)"
                                />
                                <div class="flex justify-end border-t border-gray-100 p-2">
                                    <button
                                        type="button"
                                        class="text-xs font-medium text-gray-500 hover:text-gray-700"
                                        @click="clearCreatedDate('to')"
                                    >
                                        {{ t('adminProducts.filters.clearDate') }}
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    class="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    @click="clearFilters"
                >
                    {{ t('adminProducts.filters.clear') }}
                </button>
                <div
                    v-if="filters.createdFrom || filters.createdTo"
                    class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                >
                    <CalendarDays class="h-4 w-4" />
                    <span>{{ t('adminProducts.filters.dateHint') }}</span>
                    <button
                        type="button"
                        class="inline-flex items-center text-slate-500 hover:text-slate-700"
                        @click="clearCreatedDateRange"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Products Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="md:hidden divide-y divide-gray-200">
                <div
                    v-for="product in products"
                    :key="`${product._id}-mobile`"
                    class="p-4 space-y-4"
                >
                    <div class="flex items-start gap-3">
                        <div class="h-14 w-14 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                            <img
                                v-if="product.images?.length"
                                :src="product.images[0]"
                                :alt="product.name"
                                class="h-full w-full object-cover"
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="text-sm font-semibold text-gray-900 break-words">
                                {{ product.name }}
                            </div>
                            <div class="text-xs text-gray-500 break-all">
                                {{ t('adminProducts.sku', { value: product.sku }) }}
                            </div>
                            <div class="mt-2 text-sm font-medium text-gray-900">
                                {{ formatPrice(product.price) }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div class="min-w-0">
                            <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {{ t('adminProducts.table.seller') }}
                            </div>
                            <div class="mt-1 text-gray-900 break-words">
                                {{ product.seller?.storeName || product.user?.username || t('adminProducts.form.unknownSeller') }}
                            </div>
                            <div class="text-xs text-gray-500 break-all">
                                {{ product.user?.email || t('adminProducts.table.noEmail') }}
                            </div>
                        </div>
                        <div class="min-w-0">
                            <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {{ t('adminProducts.table.category') }}
                            </div>
                            <div class="mt-1 text-gray-900 break-words">
                                {{ product.category?.name || t('adminProducts.uncategorized') }}
                            </div>
                        </div>
                        <div>
                            <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {{ t('adminProducts.table.stock') }}
                            </div>
                            <span :class="[
                                'mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                getStockStatusClass(product.stock)
                            ]">
                                {{ t('adminProducts.stockCount', { count: product.stock }) }}
                            </span>
                        </div>
                        <div>
                            <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {{ t('adminProducts.table.status') }}
                            </div>
                            <span :class="[
                                'mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            ]">
                                {{ t(`adminProducts.statuses.${product.status}`) }}
                            </span>
                        </div>
                        <div class="col-span-2">
                            <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {{ t('adminProducts.table.created') }}
                            </div>
                            <div class="mt-1 text-gray-600">
                                {{ formatDate(product.createdAt) }}
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                        <button
                            @click="goToEditProduct(product)"
                            class="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                        >
                            {{ t('adminProducts.actions.edit') }}
                        </button>
                        <button
                            @click="viewProduct(product)"
                            class="inline-flex items-center rounded-md bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100"
                        >
                            {{ t('adminProducts.actions.view') }}
                        </button>
                        <button
                            @click="confirmDelete(product)"
                            class="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                            {{ t('adminProducts.actions.delete') }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="hidden md:block max-h-[70vh] overflow-auto">
                <table class="min-w-[1100px] w-full divide-y divide-gray-200 table-fixed">
                    <thead class="sticky top-0 z-10 bg-gray-50 shadow-sm">
                        <tr>
                            <th class="w-[26%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.product') }}
                            </th>
                            <th class="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.seller') }}
                            </th>
                            <th class="w-[14%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.category') }}
                            </th>
                            <th class="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.price') }}
                            </th>
                            <th class="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.stock') }}
                            </th>
                            <th class="w-[8%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.status') }}
                            </th>
                            <th class="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.created') }}
                            </th>
                            <th class="w-[14%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.actions') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="product in products" :key="product._id">
                            <td class="px-6 py-4 align-top">
                                <div class="flex items-center min-w-0">
                                    <div class="h-10 w-10 rounded-lg bg-gray-200 flex-shrink-0">
                                        <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name"
                                            class="h-10 w-10 rounded-lg object-cover">
                                    </div>
                                    <div class="ml-4 min-w-0">
                                        <div class="text-sm font-medium text-gray-900 break-words">
                                            {{ product.name }}
                                        </div>
                                        <div class="text-sm text-gray-500 break-all">
                                            {{ t('adminProducts.sku', { value: product.sku }) }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <div class="text-sm text-gray-900 break-words">
                                    {{ product.seller?.storeName || product.user?.username || t('adminProducts.form.unknownSeller') }}
                                </div>
                                <div class="text-xs text-gray-500 break-all">
                                    {{ product.user?.email || t('adminProducts.table.noEmail') }}
                                </div>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <span class="text-sm text-gray-900 break-words">
                                    {{ product.category?.name || t('adminProducts.uncategorized') }}
                                </span>
                            </td>
                            <td class="px-6 py-4 align-top whitespace-nowrap">
                                <span class="text-sm font-medium text-gray-900">
                                    {{ formatPrice(product.price) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 align-top whitespace-nowrap">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    getStockStatusClass(product.stock)
                                ]">
                                    {{ t('adminProducts.stockCount', { count: product.stock }) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 align-top whitespace-nowrap">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                ]">
                                    {{ t(`adminProducts.statuses.${product.status}`) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 align-top whitespace-nowrap">
                                <span class="text-sm text-gray-600">
                                    {{ formatDate(product.createdAt) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 align-top">
                                <div class="flex flex-wrap gap-x-3 gap-y-2 text-sm font-medium">
                                <button @click="goToEditProduct(product)"
                                    class="text-indigo-600 hover:text-indigo-900">
                                    {{ t('adminProducts.actions.edit') }}
                                </button>
                                <button
                                    @click="viewProduct(product)"
                                    class="text-sky-600 hover:text-sky-800"
                                >
                                    {{ t('adminProducts.actions.view') }}
                                </button>
                                <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900">
                                    {{ t('adminProducts.actions.delete') }}
                                </button>
                                </div>
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
                        {{ t('adminProducts.pagination.previous') }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                        {{ t('adminProducts.pagination.next') }}
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            {{ t('adminProducts.pagination.showing') }}
                            <span class="font-medium">{{ startItem }}</span>
                            {{ t('adminProducts.pagination.to') }}
                            <span class="font-medium">{{ endItem }}</span>
                            {{ t('adminProducts.pagination.of') }}
                            <span class="font-medium">{{ totalItems }}</span>
                            {{ t('adminProducts.pagination.results') }}
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                {{ t('adminProducts.pagination.previous') }}
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                                {{ t('adminProducts.pagination.next') }}
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    {{ t('adminProducts.deleteModal.title') }}
                </h3>
                <p class="text-gray-500 mb-6">
                    {{ t('adminProducts.deleteModal.message') }}
                </p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                        {{ t('adminProducts.actions.cancel') }}
                    </button>
                    <button @click="deleteProduct" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                        {{ t('adminProducts.actions.delete') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { format as formatDateFns } from 'date-fns';
import { ChevronDown, CalendarDays, X } from 'lucide-vue-next';
import { debounce } from 'lodash';
import { CalendarDate } from '@internationalized/date';
import apiClient from '../../api/axios';
import { formatCurrencyAmount } from '../../utils/countryCurrency';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default {
    name: 'AdminProducts',

    components: {
        ChevronDown,
        CalendarDays,
        X,
        Calendar,
        Popover,
        PopoverContent,
        PopoverTrigger
    },

    setup() {
        const { t } = useI18n();
        const router = useRouter();
        const products = ref([]);
        const categories = ref([]);
        const sellers = ref([]);
        const showDeleteModal = ref(false);
        const productToDelete = ref(null);
        const fromDateOpen = ref(false);
        const toDateOpen = ref(false);

        // Pagination
        const currentPage = ref(1);
        const totalItems = ref(0);
        const itemsPerPage = ref(10);
        const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

        // Filters
        const filters = ref({
            search: '',
            category: '',
            seller: '',
            createdFrom: '',
            createdTo: '',
            stock: '',
            status: ''
        });

        const todayCalendarDate = new CalendarDate(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
        );

        const getErrorMessage = (error, fallbackKey) =>
            error?.response?.data?.message ||
            error?.message ||
            t(fallbackKey);

        // Computed
        const startItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1);
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));
        const createCalendarDate = (value) => {
            if (!value) return undefined;
            const [year, month, day] = value.split('-').map(Number);
            if (!year || !month || !day) return undefined;
            return new CalendarDate(year, month, day);
        };

        const formatDateFilterLabel = (value, fallbackKey) => {
            if (!value) return t(fallbackKey);
            try {
                return formatDateFns(new Date(`${value}T00:00:00`), 'MMM d, yyyy');
            } catch (_) {
                return value;
            }
        };

        const calendarFromValue = computed(() => createCalendarDate(filters.value.createdFrom));
        const calendarToValue = computed(() => createCalendarDate(filters.value.createdTo));

        // Methods
        const fetchProducts = async () => {
            try {
                const queryParams = new URLSearchParams({
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    ...filters.value
                });

                const { data } = await apiClient.get(`/admin/products?${queryParams.toString()}`);

                products.value = data.products;
                totalItems.value = data.pagination.total;
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error(getErrorMessage(error, 'adminProducts.toasts.fetchProductsFailed'));
            }
        };

        const applyFilters = () => {
            currentPage.value = 1;
            fetchProducts();
        };

        const fetchCategories = async () => {
            try {
                const { data } = await apiClient.get('/admin/categories');
                categories.value = data;
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error(getErrorMessage(error, 'adminProducts.toasts.fetchCategoriesFailed'));
            }
        };

        const fetchSellers = async () => {
            try {
                const { data } = await apiClient.get('/admin/sellers?limit=200');
                sellers.value = data.sellers || [];
            } catch (error) {
                console.error('Error fetching sellers:', error);
                toast.error(getErrorMessage(error, 'adminProducts.toasts.fetchSellersFailed'));
            }
        };

        const goToEditProduct = (product) => {
            router.push(`/admin/products/${product._id}/edit`);
        };

        const confirmDelete = (product) => {
            productToDelete.value = product;
            showDeleteModal.value = true;
        };

        const deleteProduct = async () => {
            try {
                await apiClient.delete(`/admin/products/${productToDelete.value._id}`);
                toast.success(t('adminProducts.toasts.deleted'));
                showDeleteModal.value = false;
                productToDelete.value = null;
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error(getErrorMessage(error, 'adminProducts.toasts.deleteFailed'));
            }
        };

        // Use debounce from lodash directly
        const handleSearch = debounce(() => {
            applyFilters();
        }, 300);

        const clearFilters = () => {
            filters.value = {
                search: '',
                category: '',
                seller: '',
                createdFrom: '',
                createdTo: '',
                stock: '',
                status: ''
            };
            currentPage.value = 1;
            fetchProducts();
        };

        const setCreatedDate = (field, value) => {
            filters.value[field === 'from' ? 'createdFrom' : 'createdTo'] = value?.toString?.() || '';
            if (field === 'from') {
                fromDateOpen.value = false;
            } else {
                toDateOpen.value = false;
            }
            applyFilters();
        };

        const clearCreatedDate = (field) => {
            filters.value[field === 'from' ? 'createdFrom' : 'createdTo'] = '';
            if (field === 'from') {
                fromDateOpen.value = false;
            } else {
                toDateOpen.value = false;
            }
            applyFilters();
        };

        const clearCreatedDateRange = () => {
            filters.value.createdFrom = '';
            filters.value.createdTo = '';
            fromDateOpen.value = false;
            toDateOpen.value = false;
            applyFilters();
        };

        const goToCreateProduct = () => {
            router.push('/admin/products/new');
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchProducts();
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                fetchProducts();
            }
        };

        const getStockStatusClass = (stock) => {
            if (stock === 0) return 'bg-red-100 text-red-800';
            if (stock < 10) return 'bg-yellow-100 text-yellow-800';
            return 'bg-green-100 text-green-800';
        };

        const formatPrice = (price) => formatCurrencyAmount(price, 'NGN');
        const formatDate = (value) => {
            if (!value) return '—';
            try {
                return new Date(value).toLocaleDateString();
            } catch (_) {
                return '—';
            }
        };

        const viewProduct = (product) => {
            router.push(`/product/${product._id}`);
        };

        // Lifecycle hooks
        onMounted(() => {
            fetchProducts();
            fetchCategories();
            fetchSellers();
        });

        return {
            products,
            categories,
            sellers,
            showDeleteModal,
            filters,
            fromDateOpen,
            toDateOpen,
            todayCalendarDate,
            calendarFromValue,
            calendarToValue,
            currentPage,
            totalItems,
            totalPages,
            startItem,
            endItem,
            formatPrice,
            formatDate,
            formatDateFilterLabel,
            goToEditProduct,
            viewProduct,
            confirmDelete,
            deleteProduct,
            handleSearch,
            goToCreateProduct,
            prevPage,
            nextPage,
            applyFilters,
            clearFilters,
            setCreatedDate,
            clearCreatedDate,
            clearCreatedDateRange,
            getStockStatusClass,
            fetchProducts,
            t
        };
    }
};

</script>

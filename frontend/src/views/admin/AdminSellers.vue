<!-- // frontend/src/views/admin/AdminSellers.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-3 px-8 py-4 bg-white">
            <h2 class="text-2xl font-bold text-gray-800">{{ t('adminSellers.title') }}</h2>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-3">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminSellers.filters.search') }}</label>
                    <input type="text" v-model="filters.search" :placeholder="t('adminSellers.filters.searchPlaceholder')"
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminSellers.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.verificationStatus"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchSellers">
                            <option value="">{{ t('adminSellers.filters.allStatus') }}</option>
                            <option value="not_submitted">{{ t('adminSellers.statusOptions.notSubmitted') }}</option>
                            <option value="submitted">{{ t('adminSellers.statusOptions.submitted') }}</option>
                            <option value="under_review">{{ t('adminSellers.statusOptions.underReview') }}</option>
                            <option value="approved">{{ t('adminSellers.statusOptions.approved') }}</option>
                            <option value="rejected">{{ t('adminSellers.statusOptions.rejected') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Sort By Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminSellers.filters.sortBy') }}</label>
                    <div class="relative">
                        <select v-model="filters.sortBy"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchSellers">
                            <option value="createdAt">{{ t('adminSellers.filters.dateJoined') }}</option>
                            <option value="totalSales">{{ t('adminSellers.filters.totalSales') }}</option>
                            <option value="rating">{{ t('adminSellers.filters.rating') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Order Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminSellers.filters.order') }}</label>
                    <div class="relative">
                        <select v-model="filters.order"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchSellers">
                            <option value="desc">{{ t('adminSellers.filters.descending') }}</option>
                            <option value="asc">{{ t('adminSellers.filters.ascending') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sellers Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="min-w-full">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.seller') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.store') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.status') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.products') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.sales') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.rating') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.actions') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <template v-if="loading">
                            <tr>
                                <td colspan="7" class="px-6 py-4 text-center">
                                    <div class="flex justify-center">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="seller in sellers" :key="seller._id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <div
                                                class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span class="text-sm font-medium text-gray-500">
                                                    {{ getInitials(seller.username) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ seller.username }}
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                {{ seller.email }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ seller.storeName }}</div>
                                    <div class="text-sm text-gray-500">
                                        {{ t('adminSellers.since', { date: formatDate(seller.createdAt) }) }}
                                    </div>
                                </td>


                                <td class="py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-1">
                                        <!-- debug -->
                                        <!-- <pre v-if="true">{{ JSON.stringify({
                                            status: seller.verificationStatus,
                                            verified: seller.isVerified,
                                            showBadge: seller.verificationStatus === 'approved'
                                        }, null, 2) }}</pre> -->

                                        <!-- Verification Application Status -->
                                        <span :class="[
                                            ' w-fit px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                            getStatusClass(seller?.verificationStatus)
                                        ]">
                                            {{ formatStatus(seller?.verificationStatus) }}
                                        </span>

                                        <!-- Verified Badge -->
                                        <!-- v-if="seller.verificationStatus === 'approved' && seller.isVerified === true" -->

                                        <span v-if="seller.verificationStatus === 'approved'"
                                            class="w-fit h-fit inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            <span class="flex items-center gap-1">
                                                <CheckCircle class="w-3 h-3" />
                                                <!-- <span>Verified Store</span> -->
                                            </span>
                                        </span>
                                    </div>
                                </td>


                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ seller.productCount || 0 }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">
                                        ${{ formatNumber(seller.totalSales || 0) }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ t('adminSellers.ordersCount', { count: seller.orderCount || 0 }) }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <Star :class="seller.rating >= 4 ? 'text-yellow-400' : 'text-gray-300'"
                                            class="h-5 w-5" />
                                        <span class="ml-1 text-sm text-gray-500">
                                            {{ seller.rating?.toFixed(1) || t('adminSellers.notAvailable') }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button @click="viewSellerDetails(seller)"
                                        class="text-blue-600 hover:text-blue-900 mr-3">
                                        {{ t('adminSellers.actions.view') }}
                                    </button>
                                    <button @click="showUpdateStatus(seller)"
                                        class="text-indigo-600 hover:text-indigo-900">
                                        {{ t('adminSellers.actions.status') }}
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        {{ t('adminSellers.pagination.previous') }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        {{ t('adminSellers.pagination.next') }}
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            {{ t('adminSellers.pagination.showing') }}
                            <span class="font-medium">{{ startItem }}</span>
                            {{ t('adminSellers.pagination.to') }}
                            <span class="font-medium">{{ endItem }}</span>
                            {{ t('adminSellers.pagination.of') }}
                            <span class="font-medium">{{ totalItems }}</span>
                            {{ t('adminSellers.pagination.results') }}
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                {{ t('adminSellers.pagination.previous') }}
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                {{ t('adminSellers.pagination.next') }}
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Seller Details Modal -->
        <div v-if="selectedSeller"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto">
            <div class="bg-white rounded-lg p-6 w-full max-w-4xl m-4">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900">
                            {{ t('adminSellers.details.title', { store: selectedSeller.storeName }) }}
                        </h3>
                        <p class="text-sm text-gray-500">
                            {{ t('adminSellers.details.memberSince', { date: formatDate(selectedSeller.createdAt) }) }}
                        </p>
                    </div>
                    <button @click="selectedSeller = null" class="text-gray-400 hover:text-gray-500">
                        <XIcon class="h-6 w-6" />
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- Basic Info -->
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.basicInformation') }}</h4>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p><span class="font-medium">{{ t('adminSellers.details.name') }}</span> {{ selectedSeller.username }}</p>
                            <p><span class="font-medium">{{ t('adminSellers.details.email') }}</span> {{ selectedSeller.email }}</p>
                            <p><span class="font-medium">{{ t('adminSellers.details.phone') }}</span> {{ selectedSeller.phone || t('adminSellers.details.notProvided') }}</p>
                        </div>
                    </div>

                    <!-- Store Info -->
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.storeInformation') }}</h4>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p><span class="font-medium">{{ t('adminSellers.details.storeName') }}</span> {{ selectedSeller.storeName }}</p>
                            <p><span class="font-medium">{{ t('adminSellers.details.applicationStatus') }}</span> {{
                                formatStatus(selectedSeller.verificationStatus) }}</p>
                            <p v-if="selectedSeller.isVerified" class="flex items-center gap-2">
                                <span class="font-medium">{{ t('adminSellers.details.verification') }}</span>
                                <span
                                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {{ t('adminSellers.details.verifiedStore') }}
                                </span>
                            </p>
                            <p><span class="font-medium">{{ t('adminSellers.details.rating') }}</span> {{ selectedSeller.rating?.toFixed(1) || t('adminSellers.notAvailable')
                                }}/5</p>
                        </div>
                    </div>
                </div>

                <!-- Performance Metrics -->
                <div class="mb-6">
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.performanceMetrics') }}</h4>
                    <div class="grid grid-cols-4 gap-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">{{ t('adminSellers.metrics.totalSales') }}</p>
                            <p class="text-xl font-semibold">${{ formatNumber(selectedSeller.totalSales || 0) }}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">{{ t('adminSellers.metrics.orders') }}</p>
                            <p class="text-xl font-semibold">{{ selectedSeller.orderCount || 0 }}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">{{ t('adminSellers.metrics.products') }}</p>
                            <p class="text-xl font-semibold">{{ selectedSeller.productCount || 0 }}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">{{ t('adminSellers.metrics.returnRate') }}</p>
                            <p class="text-xl font-semibold">{{ (selectedSeller.returnRate || 0).toFixed(1) }}%</p>
                        </div>
                    </div>
                </div>

                <!-- Recent Reviews -->
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.recentReviews') }}</h4>
                    <div class="space-y-4">
                        <div v-for="review in selectedSeller.recentReviews" :key="review._id"
                            class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="flex items-center">
                                        <Star :class="review.rating >= 4 ? 'text-yellow-400' : 'text-gray-300'"
                                            class="h-4 w-4" />
                                        <span class="ml-1 text-sm font-medium">{{ review.rating }}/5</span>
                                    </div>
                                    <p class="text-sm text-gray-600 mt-1">{{ review.comment }}</p>
                                </div>
                                <span class="text-sm text-gray-500">
                                    {{ formatDate(review.createdAt) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Update Status Modal -->
        <div v-if="showStatusModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    {{ t('adminSellers.statusModal.title') }}
                </h3>
                <form @submit.prevent="updateSellerStatus">
                    <!-- Verification Status -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ t('adminSellers.statusModal.applicationStatus') }}
                        </label>
                        <div class="relative">
                            <select v-model="newStatus"
                                class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                                <option value="not_submitted">{{ t('adminSellers.statusOptions.notSubmitted') }}</option>
                                <option value="submitted">{{ t('adminSellers.statusOptions.submitted') }}</option>
                                <option value="under_review">{{ t('adminSellers.statusOptions.underReview') }}</option>
                                <option value="approved">{{ t('adminSellers.statusOptions.approved') }}</option>
                                <option value="rejected">{{ t('adminSellers.statusOptions.rejected') }}</option>
                            </select>
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown class="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <!-- Reason for Change -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ t('adminSellers.statusModal.reasonForChange') }}
                        </label>
                        <div class="flex justify-end mb-1">
                            <button type="button" @click="statusNote = STATUS_TEMPLATES[newStatus]"
                                class="text-sm text-blue-600 hover:text-blue-800">
                                {{ t('adminSellers.statusModal.useTemplateMessage') }}
                            </button>
                        </div>
                        <textarea v-model="statusNote" rows="10" class="w-full p-2 border rounded-md"
                            :placeholder="t('adminSellers.statusModal.reasonPlaceholder')"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeStatusModal"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            {{ t('adminSellers.statusModal.cancel') }}
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            {{ t('adminSellers.statusModal.updateStatus') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { XIcon, Star, ChevronDown, CheckCircle } from 'lucide-vue-next';
import { useAdminStore } from '@/store/admin';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';

export default {
    name: 'AdminSellers',

    components: {
        XIcon,
        Star,
        ChevronDown,
        CheckCircle
    },

    setup() {
        const { t } = useI18n();
        const STATUS_TEMPLATES = {
            not_submitted:
                t('adminSellers.templates.notSubmitted'),

            submitted:
                t('adminSellers.templates.submitted'),

            under_review:
                t('adminSellers.templates.underReview'),

            approved:
                t('adminSellers.templates.approved'),

            rejected:
                t('adminSellers.templates.rejected')
        };
        // State
        const adminStore = useAdminStore();

        const loading = computed(() => adminStore.loading);
        const sellers = computed(() => adminStore.sellers);
        const selectedSeller = ref(null);
        const showStatusModal = ref(false);
        const newStatus = ref('');
        const statusNote = ref('');
        const isVerifiedStore = ref(false);

        // Filters
        const filters = ref({
            search: '',
            verificationStatus: '',
            sortBy: 'createdAt',
            order: 'desc'
        });

        // Pagination from admin store
        const currentPage = computed(() => adminStore.pagination.currentPage);
        const totalItems = computed(() => adminStore.pagination.total);
        const itemsPerPage = computed(() => adminStore.pagination.itemsPerPage);
        const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
        const startItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1);
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

        // Methods
        const fetchSellers = async () => {
            try {
                await adminStore.fetchSellers({
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    verificationStatus: filters.value.verificationStatus, // Changed from status
                    search: filters.value.search,
                    sortBy: filters.value.sortBy,
                    order: filters.value.order
                });
            } catch (error) {
                console.error('Error in fetchSellers:', error);
            }
        };

        const handleSearch = debounce(fetchSellers, 300);

        const viewSellerDetails = async (seller) => {
            try {
                selectedSeller.value = await adminStore.fetchSellerDetails(seller._id);
            } catch (error) {
                console.error('Error in viewSellerDetails:', error);
            }
        };

        const showUpdateStatus = (seller) => {
            selectedSeller.value = seller;
            newStatus.value = seller.verificationStatus;
            isVerifiedStore.value = seller.isVerified;
            statusNote.value = STATUS_TEMPLATES[seller.verificationStatus] || '';
            showStatusModal.value = true;
        };

        const updateSellerStatus = async () => {
            try {
                loading.value = true;

                // Automatically set isVerified to true when status is approved
                const isVerifiedStore = newStatus.value === 'approved';

                await adminStore.updateSellerStatus(
                    selectedSeller.value._id,
                    {
                        verificationStatus: newStatus.value,
                        isVerified: isVerifiedStore,
                        note: statusNote.value
                    }
                );
                toast.success(t('adminSellers.toasts.statusUpdated'));
                closeStatusModal();
                await fetchSellers();

                // If the updated seller was selected in the details modal, refresh that data too
                if (selectedSeller.value) {
                    const updatedSellerDetails = await adminStore.fetchSellerDetails(selectedSeller.value._id);
                    selectedSeller.value = updatedSellerDetails;
                }
            } catch (error) {
                console.error('Error in updateSellerStatus:', error);
                toast.error(t('adminSellers.toasts.statusUpdateFailed'));
            } finally {
                loading.value = false;
            }
        };

        const closeStatusModal = () => {
            showStatusModal.value = false;
            newStatus.value = '';
            statusNote.value = '';
            selectedSeller.value = null;
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                adminStore.pagination.currentPage--;
                fetchSellers();
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                adminStore.pagination.currentPage++;
                fetchSellers();
            }
        };

        // Helper functions
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatStatus = (verificationStatus) => {
            if (!verificationStatus) return t('adminSellers.statusOptions.notSubmitted');

            const statusDisplay = {
                'not_submitted': t('adminSellers.statusDisplay.notApplied'),
                'submitted': t('adminSellers.statusDisplay.applicationSubmitted'),
                'under_review': t('adminSellers.statusDisplay.applicationUnderReview'),
                'approved': t('adminSellers.statusDisplay.applicationApproved'),
                'rejected': t('adminSellers.statusDisplay.applicationRejected')
            };

            return statusDisplay[verificationStatus] || verificationStatus;
        };


        const formatNumber = (number) => {
            return number.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        const getInitials = (name) => {
            if (!name) return ''; // Return empty string if name is undefined or null

            return name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase();
        };

        const getStatusClass = (verificationStatus) => {
            if (!verificationStatus) return 'bg-gray-100 text-gray-800';

            const classes = {
                'not_submitted': 'bg-gray-100 text-gray-800',
                'submitted': 'bg-yellow-100 text-yellow-800',
                'under_review': 'bg-blue-50 text-blue-700',
                'approved': 'bg-green-100 text-green-800',
                'rejected': 'bg-red-100 text-red-800'
            };
            return classes[verificationStatus] || 'bg-gray-100 text-gray-800';
        };

        watch(newStatus, (newValue) => {
            statusNote.value = STATUS_TEMPLATES[newValue] || '';
        });

        // Lifecycle hooks
        onMounted(() => {
            fetchSellers();
        });

        return {
            sellers,
            selectedSeller,
            loading,
            showStatusModal,
            newStatus,
            statusNote,
            currentPage,
            totalItems,
            totalPages,
            startItem,
            endItem,
            filters,
            handleSearch,
            viewSellerDetails,
            showUpdateStatus,
            updateSellerStatus,
            closeStatusModal,
            prevPage,
            nextPage,
            formatDate,
            formatStatus,
            formatNumber,
            getInitials,
            getStatusClass,
            fetchSellers,
            STATUS_TEMPLATES,
            t
        };
    }
};
</script>

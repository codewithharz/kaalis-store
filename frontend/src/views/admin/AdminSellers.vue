<!-- // frontend/src/views/admin/AdminSellers.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-3 px-8 py-4 bg-white">
            <h2 class="text-2xl font-bold text-gray-800">Seller Management</h2>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-3">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input type="text" v-model="filters.search" placeholder="Search by name or email..."
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div class="relative">
                        <select v-model="filters.verificationStatus"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchSellers">
                            <option value="">All Status</option>
                            <option value="not_submitted">Not Submitted</option>
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Sort By Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <div class="relative">
                        <select v-model="filters.sortBy"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchSellers">
                            <option value="createdAt">Date Joined</option>
                            <option value="totalSales">Total Sales</option>
                            <option value="rating">Rating</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Order Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Order</label>
                    <div class="relative">
                        <select v-model="filters.order"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchSellers">
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
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
                                Seller
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Store
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Products
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Sales
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Rating
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
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
                                        Since {{ formatDate(seller.createdAt) }}
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
                                        {{ seller.orderCount || 0 }} orders
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <Star :class="seller.rating >= 4 ? 'text-yellow-400' : 'text-gray-300'"
                                            class="h-5 w-5" />
                                        <span class="ml-1 text-sm text-gray-500">
                                            {{ seller.rating?.toFixed(1) || 'N/A' }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button @click="viewSellerDetails(seller)"
                                        class="text-blue-600 hover:text-blue-900 mr-3">
                                        View
                                    </button>
                                    <button @click="showUpdateStatus(seller)"
                                        class="text-indigo-600 hover:text-indigo-900">
                                        Status
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
                        Previous
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Showing
                            <span class="font-medium">{{ startItem }}</span>
                            to
                            <span class="font-medium">{{ endItem }}</span>
                            of
                            <span class="font-medium">{{ totalItems }}</span>
                            results
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                Previous
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                Next
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
                            Seller Details - {{ selectedSeller.storeName }}
                        </h3>
                        <p class="text-sm text-gray-500">
                            Member since {{ formatDate(selectedSeller.createdAt) }}
                        </p>
                    </div>
                    <button @click="selectedSeller = null" class="text-gray-400 hover:text-gray-500">
                        <XIcon class="h-6 w-6" />
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- Basic Info -->
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">Basic Information</h4>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p><span class="font-medium">Name:</span> {{ selectedSeller.username }}</p>
                            <p><span class="font-medium">Email:</span> {{ selectedSeller.email }}</p>
                            <p><span class="font-medium">Phone:</span> {{ selectedSeller.phone || 'Not provided' }}</p>
                        </div>
                    </div>

                    <!-- Store Info -->
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">Store Information</h4>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p><span class="font-medium">Store Name:</span> {{ selectedSeller.storeName }}</p>
                            <p><span class="font-medium">Application Status:</span> {{
                                formatStatus(selectedSeller.verificationStatus) }}</p>
                            <p v-if="selectedSeller.isVerified" class="flex items-center gap-2">
                                <span class="font-medium">Verification:</span>
                                <span
                                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    Verified Store
                                </span>
                            </p>
                            <p><span class="font-medium">Rating:</span> {{ selectedSeller.rating?.toFixed(1) || 'N/A'
                                }}/5</p>
                        </div>
                    </div>
                </div>

                <!-- Performance Metrics -->
                <div class="mb-6">
                    <h4 class="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                    <div class="grid grid-cols-4 gap-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">Total Sales</p>
                            <p class="text-xl font-semibold">${{ formatNumber(selectedSeller.totalSales || 0) }}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">Orders</p>
                            <p class="text-xl font-semibold">{{ selectedSeller.orderCount || 0 }}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">Products</p>
                            <p class="text-xl font-semibold">{{ selectedSeller.productCount || 0 }}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">Return Rate</p>
                            <p class="text-xl font-semibold">{{ (selectedSeller.returnRate || 0).toFixed(1) }}%</p>
                        </div>
                    </div>
                </div>

                <!-- Recent Reviews -->
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">Recent Reviews</h4>
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
                    Update Verification Status
                </h3>
                <form @submit.prevent="updateSellerStatus">
                    <!-- Verification Status -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Application Status
                        </label>
                        <div class="relative">
                            <select v-model="newStatus"
                                class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                                <option value="not_submitted">Not Submitted</option>
                                <option value="submitted">Submitted</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown class="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <!-- Reason for Change -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Change
                        </label>
                        <div class="flex justify-end mb-1">
                            <button type="button" @click="statusNote = STATUS_TEMPLATES[newStatus]"
                                class="text-sm text-blue-600 hover:text-blue-800">
                                Use Template Message
                            </button>
                        </div>
                        <textarea v-model="statusNote" rows="10" class="w-full p-2 border rounded-md"
                            placeholder="Explain why you're changing the status..."></textarea>
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="closeStatusModal"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Update Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
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
        const STATUS_TEMPLATES = {
            not_submitted:
                `The seller's verification application has been reset to not submitted. This may be due to:
- Invalid or incomplete previous submission
- Seller requested to restart the verification process
- Administrative review found discrepancies in previous application`,

            submitted:
                `Acknowledging receipt of seller's verification application. Application will be reviewed for:
- Store information completeness
- Business credential verification
- Product quality standards
- Sales history and performance`,

            under_review:
                `Moving seller's application to active review process. Our team will verify:
- Business documentation
- Store performance metrics
- Customer feedback and ratings
- Compliance with platform policies
Please expect review to take 2-3 business days.`,

            approved:
                `Seller verification application has been approved based on:
- Successful verification of business credentials
- Consistent positive customer feedback
- High-quality product listings
- Good standing on platform
Seller now eligible for verified badge and associated benefits.`,

            rejected:
                `Application for seller verification has been declined due to:
- Insufficient documentation provided
- Unmet performance requirements
- Multiple customer complaints/issues
- Policy violations found during review

Seller may reapply after 30 days with improved metrics and resolved issues.`
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
                toast.success('Seller status updated successfully');
                closeStatusModal();
                await fetchSellers();

                // If the updated seller was selected in the details modal, refresh that data too
                if (selectedSeller.value) {
                    const updatedSellerDetails = await adminStore.fetchSellerDetails(selectedSeller.value._id);
                    selectedSeller.value = updatedSellerDetails;
                }
            } catch (error) {
                console.error('Error in updateSellerStatus:', error);
                toast.error('Failed to update seller status');
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
            if (!verificationStatus) return 'Not Submitted';

            const statusDisplay = {
                'not_submitted': 'Not Applied',
                'submitted': 'Application Submitted',
                'under_review': 'Application Under Review',
                'approved': 'Application Approved',
                'rejected': 'Application Rejected'
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
            STATUS_TEMPLATES
        };
    }
};
</script>
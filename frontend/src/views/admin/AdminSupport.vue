<!-- frontend/src/views/admin/AdminSupport.vue -->
<template>
    <div>
        <div class="px-8 py-4 bg-white flex justify-between items-center border-b border-gray-200">
            <h3 class="text-2xl font-semibold text-gray-800">{{ t('adminSupport.title') }}</h3>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow-sm m-6 mb-3 border border-gray-100">
            <div class="flex flex-wrap items-end gap-4">
                <!-- Search Input -->
                <div class="w-full sm:w-80">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('adminSupport.filters.search') }}
                    </label>
                    <div class="relative">
                        <input 
                            type="text" 
                            v-model="filters.search" 
                            :placeholder="t('adminSupport.filters.searchPlaceholder')"
                            class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent text-sm"
                            @input="resetPagination"
                        />
                        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <SearchIcon class="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Status Filter -->
                <div class="w-full sm:w-48">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('adminSupport.filters.status') }}
                    </label>
                    <div class="relative">
                        <select 
                            v-model="filters.status"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent text-sm"
                            @change="resetPagination"
                        >
                            <option value="">{{ t('adminSupport.filters.allStatus') }}</option>
                            <option value="pending">{{ t('adminSupport.filters.pending') }}</option>
                            <option value="resolved">{{ t('adminSupport.filters.resolved') }}</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Clear Filters Button -->
                <button 
                    v-if="filters.search || filters.status"
                    type="button"
                    class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition"
                    @click="clearFilters"
                >
                    {{ t('adminProducts.filters.clear') }}
                </button>
            </div>
        </div>

        <!-- Support Messages Table -->
        <div class="bg-white shadow rounded-lg overflow-hidden m-6 border border-gray-100">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                {{ t('adminSupport.table.name') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                {{ t('adminSupport.table.email') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                {{ t('adminSupport.table.subject') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {{ t('adminSupport.table.message') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                {{ t('adminSupport.table.status') }}
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                {{ t('adminSupport.table.date') }}
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                {{ t('adminSupport.table.actions') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="loading" class="text-center">
                            <td colspan="7" class="px-6 py-8 text-gray-500">
                                <span class="inline-block animate-spin mr-2">⏳</span> Loading support messages...
                            </td>
                        </tr>
                        <tr v-else-if="paginatedMessages.length === 0" class="text-center">
                            <td colspan="7" class="px-6 py-8 text-gray-500">
                                {{ t('adminSupport.noMessages') }}
                            </td>
                        </tr>
                        <tr v-for="msg in paginatedMessages" :key="msg._id" :class="{'bg-slate-50/50': msg.isResolved}">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ msg.name }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500">
                                    <a :href="`mailto:${msg.email}`" class="hover:underline text-[#24a3b5]">{{ msg.email }}</a>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 capitalize">
                                    {{ msg.subject }}
                                </span>
                            </td>
                            <td class="px-6 py-4 max-w-xs truncate text-sm text-gray-600">
                                {{ msg.message }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    msg.isResolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                ]">
                                    {{ msg.isResolved ? t('adminSupport.filters.resolved') : t('adminSupport.filters.pending') }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ new Date(msg.createdAt).toLocaleString() }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end space-x-3">
                                    <button @click="viewDetails(msg)" class="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                                        <EyeIcon class="w-4 h-4" />
                                        <span>{{ t('adminSupport.actions.viewDetails') }}</span>
                                    </button>
                                    <button 
                                        v-if="!msg.isResolved"
                                        @click="resolveMessage(msg._id)" 
                                        class="text-green-600 hover:text-green-800 inline-flex items-center gap-1"
                                    >
                                        <CheckIcon class="w-4 h-4" />
                                        <span>{{ t('adminSupport.actions.markResolved') }}</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ t('adminSellers.pagination.previous') }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
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
                                class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ t('adminSellers.pagination.previous') }}
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ t('adminSellers.pagination.next') }}
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detail Modal -->
        <div
            v-if="showModal"
            class="fixed inset-0 z-[120] bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6 flex items-center justify-center"
            @click.self="showModal = false"
        >
            <div class="mx-auto max-w-2xl w-full">
                <!-- Modal Panel -->
                <div class="relative z-[121] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]">
                    <!-- Modal Header -->
                    <div class="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 text-white sm:px-8">
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                                    {{ t('adminSupport.ticketDetails') }}
                                </p>
                                <h3 class="mt-2 text-xl font-semibold text-white sm:text-2xl capitalize">
                                    {{ selectedMessage.subject }}
                                </h3>
                                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                                    <span class="flex items-center gap-1.5">
                                        <UserIcon class="h-4 w-4 text-slate-400" />
                                        {{ selectedMessage.name }}
                                    </span>
                                    <span class="flex items-center gap-1.5 break-all">
                                        <MailIcon class="h-4 w-4 text-slate-400" />
                                        <a :href="`mailto:${selectedMessage.email}`" class="hover:underline text-[#24a3b5]">{{ selectedMessage.email }}</a>
                                    </span>
                                </div>
                            </div>
                            <button
                                @click="showModal = false"
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
                                        {{ t('adminSupport.statusLabel') }}
                                    </p>
                                    <div class="mt-2">
                                        <span :class="[
                                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border',
                                            selectedMessage.isResolved 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                                                : 'bg-amber-50 text-amber-700 border-amber-200/50'
                                        ]">
                                            <component :is="selectedMessage.isResolved ? 'CheckCircle2' : 'ClockIcon'" class="h-3.5 w-3.5" />
                                            {{ selectedMessage.isResolved ? t('adminSupport.filters.resolved') : t('adminSupport.filters.pending') }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Date Card -->
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                                <div class="p-2 bg-slate-100 rounded-xl text-slate-500">
                                    <CalendarIcon class="h-5 w-5" />
                                </div>
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {{ t('adminSupport.table.date') }}
                                    </p>
                                    <p class="mt-1 text-sm font-semibold text-slate-900">
                                        {{ formatJustDate(selectedMessage.createdAt) }}
                                    </p>
                                    <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <ClockIcon class="h-3 w-3" />
                                        {{ formatJustTime(selectedMessage.createdAt) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Ticket Message Card -->
                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                            <h4 class="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                                <AlertCircle class="h-4 w-4 text-slate-400" />
                                {{ t('adminSupport.table.message') }}
                            </h4>
                            <div class="rounded-xl bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                                {{ selectedMessage.message }}
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer Actions -->
                    <div class="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3 sm:px-8">
                        <button 
                            type="button" 
                            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none"
                            @click="showModal = false"
                        >
                            {{ t('adminSupport.actions.close') }}
                        </button>
                        <button 
                            v-if="!selectedMessage.isResolved"
                            type="button" 
                            class="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors focus:outline-none flex items-center gap-1.5 shadow-sm shadow-emerald-100"
                            @click="resolveMessage(selectedMessage._id)"
                        >
                            <CheckIcon class="h-4 w-4" />
                            {{ t('adminSupport.actions.markResolved') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    Search as SearchIcon,
    ChevronDown,
    Eye as EyeIcon,
    Check as CheckIcon,
    X as XIcon,
    User as UserIcon,
    Mail as MailIcon,
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    CheckCircle2,
    AlertCircle
} from 'lucide-vue-next'
import apiClient from '@/api/axios'
import { toast } from 'vue-sonner'

export default {
    name: 'AdminSupport',
    components: {
        SearchIcon,
        ChevronDown,
        EyeIcon,
        CheckIcon,
        XIcon,
        UserIcon,
        MailIcon,
        CalendarIcon,
        ClockIcon,
        CheckCircle2,
        AlertCircle
    },
    setup() {
        const { t, locale } = useI18n()
        const messages = ref([])
        const loading = ref(false)

        // Pagination
        const currentPage = ref(1)
        const itemsPerPage = ref(10)

        // Filters
        const filters = ref({
            search: '',
            status: ''
        })

        // Details Modal state
        const showModal = ref(false)
        const selectedMessage = ref(null)

        const formatJustDate = (date) => {
            if (!date) return ''
            return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }

        const formatJustTime = (date) => {
            if (!date) return ''
            return new Date(date).toLocaleTimeString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        }

        const resetPagination = () => {
            currentPage.value = 1
        }

        const clearFilters = () => {
            filters.value = {
                search: '',
                status: ''
            }
            currentPage.value = 1
        }

        const fetchMessages = async () => {
            loading.value = true
            try {
                const response = await apiClient.get('/admin/support')
                messages.value = response.data.messages || []
            } catch (error) {
                console.error("Error fetching support messages:", error)
                toast.error(t('adminSupport.toasts.fetchFailed'))
            } finally {
                loading.value = false
            }
        }

        const resolveMessage = async (id) => {
            try {
                await apiClient.patch(`/admin/support/${id}/resolve`)
                toast.success(t('adminSupport.toasts.resolveSuccess'))
                
                // Refresh local state lists
                const msgIndex = messages.value.findIndex(m => m._id === id)
                if (msgIndex !== -1) {
                    messages.value[msgIndex].isResolved = true
                }
                
                if (selectedMessage.value && selectedMessage.value._id === id) {
                    selectedMessage.value.isResolved = true
                }
            } catch (error) {
                console.error("Error resolving support message:", error)
                toast.error(t('adminSupport.toasts.resolveFailed'))
            }
        }

        const viewDetails = (msg) => {
            selectedMessage.value = msg
            showModal.value = true
        }

        const filteredMessages = computed(() => {
            let list = messages.value

            // Apply search filter
            if (filters.value.search) {
                const searchLower = filters.value.search.toLowerCase()
                list = list.filter(msg => 
                    msg.name?.toLowerCase().includes(searchLower) ||
                    msg.email?.toLowerCase().includes(searchLower) ||
                    msg.subject?.toLowerCase().includes(searchLower) ||
                    msg.message?.toLowerCase().includes(searchLower)
                )
            }

            // Apply status filter
            if (filters.value.status) {
                const isResolvedTarget = filters.value.status === 'resolved'
                list = list.filter(msg => msg.isResolved === isResolvedTarget)
            }

            return list
        })

        // Pagination computed values
        const totalItems = computed(() => filteredMessages.value.length)
        const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))
        const startItem = computed(() => totalItems.value === 0 ? 0 : ((currentPage.value - 1) * itemsPerPage.value) + 1)
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))

        const paginatedMessages = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value
            const end = start + itemsPerPage.value
            return filteredMessages.value.slice(start, end)
        })

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--
            }
        }

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++
            }
        }

        onMounted(() => {
            fetchMessages()
        })

        return {
            t,
            loading,
            messages,
            filters,
            showModal,
            selectedMessage,
            paginatedMessages,
            currentPage,
            totalPages,
            totalItems,
            startItem,
            endItem,
            prevPage,
            nextPage,
            resetPagination,
            clearFilters,
            resolveMessage,
            viewDetails,
            formatJustDate,
            formatJustTime
        }
    }
}
</script>

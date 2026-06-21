<!-- // frontend/src/views/admin/AdminSellers.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="flex flex-col gap-4 mb-3 px-8 py-4 rounded-b-lg bg-white lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ t('adminSellers.title') }}</h2>
                <p class="text-sm text-gray-500">Manage and verify platform sellers, store properties, fulfillment methods, and account security.</p>
            </div>
        </div>

        <!-- Filters -->
        <div class="mb-4 rounded-xl bg-white p-5 border border-slate-100 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminSellers.filters.search') }}</label>
                    <input type="text" v-model="filters.search" :placeholder="t('adminSellers.filters.searchPlaceholder')"
                        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10" @input="handleSearch">
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminSellers.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.verificationStatus"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="fetchSellers">
                            <option value="">{{ t('adminSellers.filters.allStatus') }}</option>
                            <option value="not_submitted">{{ t('adminSellers.statusOptions.notSubmitted') }}</option>
                            <option value="submitted">{{ t('adminSellers.statusOptions.submitted') }}</option>
                            <option value="under_review">{{ t('adminSellers.statusOptions.underReview') }}</option>
                            <option value="approved">{{ t('adminSellers.statusOptions.approved') }}</option>
                            <option value="rejected">{{ t('adminSellers.statusOptions.rejected') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Sort By Filter -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminSellers.filters.sortBy') }}</label>
                    <div class="relative">
                        <select v-model="filters.sortBy"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="fetchSellers">
                            <option value="createdAt">{{ t('adminSellers.filters.dateJoined') }}</option>
                            <option value="totalSales">{{ t('adminSellers.filters.totalSales') }}</option>
                            <option value="rating">{{ t('adminSellers.filters.rating') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                    <p v-if="filters.sortBy === 'rating'" class="mt-1 text-[10px] text-slate-400">
                        {{ t('adminSellers.filters.ratingHint') }}
                    </p>
                </div>

                <!-- Order Filter -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminSellers.filters.order') }}</label>
                    <div class="relative">
                        <select v-model="filters.order"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="fetchSellers">
                            <option value="desc">{{ t('adminSellers.filters.descending') }}</option>
                            <option value="asc">{{ t('adminSellers.filters.ascending') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sellers Table -->
        <div class="overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm">
            <div class="md:hidden divide-y divide-gray-200">
                <template v-if="loading">
                    <div class="px-6 py-10 text-center">
                        <div class="flex justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="seller in sellers" :key="seller._id" class="p-4 space-y-4">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0 flex items-center gap-3">
                                <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase border border-slate-200 flex-shrink-0">
                                    {{ getInitials(seller.username) }}
                                </div>
                                <div class="min-w-0">
                                    <div class="text-sm font-semibold text-slate-800 break-words">{{ seller.username }}</div>
                                    <div class="text-xs text-slate-400 mt-0.5 leading-none break-all">{{ seller.email }}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5 flex-wrap justify-end">
                                <span :class="getStatusClass(seller?.verificationStatus)"
                                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm border">
                                    <component :is="getStatusIcon(seller?.verificationStatus)" class="h-3.5 w-3.5" :class="{ 'animate-spin': seller?.verificationStatus === 'under_review' }" />
                                    <span>{{ formatStatus(seller?.verificationStatus) }}</span>
                                </span>
                                <span v-if="seller.verificationStatus === 'approved' && seller.isVerified"
                                    class="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50 px-2 py-0.5 text-xs font-semibold shadow-sm">
                                    <CheckCircle2 class="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminSellers.table.store') }}</div>
                                <div class="mt-1 text-gray-900 break-words font-semibold">{{ seller.storeName }}</div>
                                <div class="text-xs text-gray-500 mt-1">{{ t('adminSellers.since', { date: formatDate(seller.createdAt) }) }}</div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminSellers.table.products') }}</div>
                                <div class="mt-1 font-semibold text-gray-900 font-mono">{{ seller.productCount || 0 }}</div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminSellers.table.sales') }}</div>
                                <div class="mt-1 font-semibold text-gray-900 font-mono break-words">{{ formatSellerSales(seller) }}</div>
                                <div class="text-xs text-gray-500 mt-1">{{ t('adminSellers.ordersCount', { count: seller.orderCount || 0 }) }}</div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminSellers.table.rating') }}</div>
                                <div class="mt-1 flex items-center gap-1">
                                    <Star class="h-4 w-4 text-amber-400 fill-amber-400" />
                                    <span class="text-sm font-semibold text-slate-800">
                                        {{ formatRatingValue(getDisplayRating(seller)) }}
                                    </span>
                                </div>
                                <div class="mt-1 text-xs text-gray-500">
                                    {{ getRatingContextText(seller) }}
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                            <button @click="viewSellerDetails(seller)"
                                class="inline-flex items-center rounded-md bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100">
                                {{ t('adminSellers.actions.view') }}
                            </button>
                            <button @click="showUpdateStatus(seller)"
                                class="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
                                {{ t('adminSellers.actions.status') }}
                            </button>
                        </div>
                    </div>
                </template>
            </div>

            <div class="hidden md:block overflow-auto">
                <table class="min-w-[1100px] w-full divide-y divide-slate-100 table-fixed">
                    <thead class="sticky top-0 z-10 bg-slate-50 shadow-sm border-b border-slate-100">
                        <tr>
                            <th class="w-[23%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminSellers.table.seller') }}
                            </th>
                            <th class="w-[18%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminSellers.table.store') }}
                            </th>
                            <th class="w-[15%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminSellers.table.status') }}
                            </th>
                            <th class="w-[10%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminSellers.table.products') }}
                            </th>
                            <th class="w-[16%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminSellers.table.sales') }}
                            </th>
                            <th class="w-[8%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminSellers.table.rating') }}
                            </th>
                            <th class="w-[10%] px-6 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">
                                {{ t('adminSellers.table.actions') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-100">
                        <template v-if="loading">
                            <tr>
                                <td colspan="7" class="px-6 py-12 text-center">
                                    <div class="flex flex-col items-center justify-center text-slate-400">
                                        <Loader2 class="h-8 w-8 animate-spin text-[#24a3b5] mb-2" />
                                        <span class="text-sm font-medium">{{ t('adminPayouts.loading') }}</span>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="seller in sellers" :key="seller._id" class="hover:bg-slate-50/50 transition-colors">
                                <td class="px-6 py-4 align-middle whitespace-nowrap">
                                    <div class="flex items-center gap-3">
                                        <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase border border-slate-200 flex-shrink-0">
                                            {{ getInitials(seller.username) }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-semibold text-slate-800 leading-tight">{{ seller.username }}</p>
                                            <p class="text-xs text-slate-400 mt-0.5 leading-none break-all">{{ seller.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <Store class="h-4 w-4 text-slate-400 flex-shrink-0" />
                                        <div>
                                            <p class="text-sm font-semibold text-slate-800 leading-tight break-words">{{ seller.storeName }}</p>
                                            <p class="text-xs text-slate-400 mt-0.5 leading-none">{{ t('adminSellers.since', { date: formatDate(seller.createdAt) }) }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap">
                                    <div class="flex flex-wrap items-center gap-1.5">
                                        <span :class="getStatusClass(seller?.verificationStatus)"
                                            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm border">
                                            <component :is="getStatusIcon(seller?.verificationStatus)" class="h-3.5 w-3.5" :class="{ 'animate-spin': seller?.verificationStatus === 'under_review' }" />
                                            <span>{{ formatStatus(seller?.verificationStatus) }}</span>
                                        </span>
                                        
                                        <span v-if="seller.verificationStatus === 'approved' && seller.isVerified"
                                            class="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50 px-2 py-1 text-xs font-semibold shadow-sm">
                                            <CheckCircle2 class="h-3.5 w-3.5" />
                                            <span>Verified</span>
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap text-sm font-semibold text-slate-900">
                                    <span class="font-mono">{{ seller.productCount || 0 }}</span>
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap">
                                    <p class="text-sm font-bold text-slate-900 font-mono">{{ formatSellerSales(seller) }}</p>
                                    <p class="text-xs text-slate-400 mt-0.5 leading-none">{{ t('adminSellers.ordersCount', { count: seller.orderCount || 0 }) }}</p>
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <Star class="h-4 w-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                                        <div>
                                            <p class="text-sm font-semibold text-slate-800 leading-tight">{{ formatRatingValue(getDisplayRating(seller)) }}</p>
                                            <p class="text-xs text-slate-400 mt-0.5 leading-none">{{ getRatingContextText(seller) }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-middle whitespace-nowrap text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <button class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 focus:outline-none transition">
                                                <MoreHorizontal class="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" class="w-48">
                                            <DropdownMenuLabel class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">Actions</DropdownMenuLabel>
                                            
                                            <DropdownMenuItem @click="viewSellerDetails(seller)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700 hover:bg-slate-50">
                                                <ExternalLink class="h-4 w-4 text-slate-400" />
                                                <span>{{ t('adminSellers.actions.view') }}</span>
                                            </DropdownMenuItem>
                                            
                                            <DropdownMenuItem @click="showUpdateStatus(seller)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700 hover:bg-slate-50">
                                                <RefreshCcw class="h-4 w-4 text-slate-400" />
                                                <span>{{ t('adminSellers.actions.status') }}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                <div class="hidden md:flex-1 md:flex md:items-center md:justify-between">
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
            class="fixed inset-0 z-[120] bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6 flex items-center justify-center overflow-y-auto"
            @click.self="selectedSeller = null">
            <div class="mx-auto max-w-5xl w-full">
                <!-- Modal Panel -->
                <div class="relative z-[121] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]">
                    <!-- Modal Header -->
                    <div class="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 text-white sm:px-8">
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                                    Seller Store Details
                                </p>
                                <h3 class="mt-2 text-xl font-semibold text-white sm:text-2xl">
                                    {{ selectedSeller.storeName }}
                                </h3>
                                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                                    <span class="flex items-center gap-1.5">
                                        <Calendar class="h-4 w-4 text-slate-400" />
                                        {{ t('adminSellers.details.memberSince', { date: formatDate(selectedSeller.createdAt) }) }}
                                    </span>
                                </div>
                            </div>
                            <button
                                @click="selectedSeller = null"
                                class="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none"
                            >
                                <XIcon class="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div class="bg-slate-50 px-6 py-6 sm:px-8 sm:py-8 space-y-6">
                        <!-- Basic Info and Store Info Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Basic Info Card -->
                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                                <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <User class="h-4 w-4 text-[#24a3b5]" />
                                    {{ t('adminSellers.details.basicInformation') }}
                                </h4>
                                <div class="space-y-3 text-sm text-slate-600">
                                    <div>
                                        <span class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{{ t('adminSellers.details.name') }}</span>
                                        <span class="font-semibold text-slate-800">{{ selectedSeller.username || selectedSeller.user?.username || t('adminSellers.details.notProvided') }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{{ t('adminSellers.details.email') }}</span>
                                        <span class="font-semibold text-slate-800 break-all">{{ selectedSeller.email || selectedSeller.user?.email || t('adminSellers.details.notProvided') }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{{ t('adminSellers.details.phone') }}</span>
                                        <span class="font-semibold text-slate-800">{{ selectedSeller.phone || t('adminSellers.details.notProvided') }}</span>
                                    </div>
                                    <div>
                                        <span class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{{ t('adminSellers.details.lastLogin') }}</span>
                                        <span class="font-semibold text-slate-800">{{ selectedSeller.user?.lastLogin ? formatDateTime(selectedSeller.user.lastLogin) : t('adminSellers.details.notProvided') }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Store Info Card -->
                            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                                <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <Store class="h-4 w-4 text-[#24a3b5]" />
                                    {{ t('adminSellers.details.storeInformation') }}
                                </h4>
                                <div class="space-y-2.5 text-sm text-slate-600">
                                    <div class="flex justify-between items-center py-0.5">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.storeName') }}</span>
                                        <span class="font-semibold text-slate-800">{{ selectedSeller.storeName }}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-0.5">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.applicationStatus') }}</span>
                                        <span :class="[
                                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border',
                                            getStatusClass(selectedSeller.verificationStatus)
                                        ]">
                                            <component :is="getStatusIcon(selectedSeller.verificationStatus)" class="h-3.5 w-3.5" :class="{ 'animate-spin': selectedSeller.verificationStatus === 'under_review' }" />
                                            <span>{{ formatStatus(selectedSeller.verificationStatus) }}</span>
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-center py-0.5">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.accountStatus') }}</span>
                                        <span class="font-semibold text-slate-800">{{ getAccountStatusText(selectedSeller) }}</span>
                                    </div>
                                    <div class="flex justify-between items-center py-0.5">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.twoFactor') }}</span>
                                        <span :class="[
                                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border',
                                            selectedSeller.user?.twoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-slate-50 text-slate-600 border-slate-200/50'
                                        ]">
                                            {{ selectedSeller.user?.twoFactorEnabled ? t('adminSellers.details.enabled') : t('adminSellers.details.disabled') }}
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-center py-0.5">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.fulfillmentType') }}</span>
                                        <span class="font-semibold text-slate-800 capitalize font-medium">
                                            {{ selectedSeller.fulfillmentType === 'vendor' ? t('adminSellers.fulfillmentTypes.vendor') : t('adminSellers.fulfillmentTypes.platform') }}
                                        </span>
                                    </div>
                                    <div class="flex justify-between items-center py-0.5">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.selfShippingStatus') }}</span>
                                        <span :class="[
                                            'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border',
                                            selectedSeller.selfShippingApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 
                                            selectedSeller.selfShippingRequestStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
                                            selectedSeller.selfShippingRequestStatus === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200/50' : 'bg-slate-50 text-slate-600 border-slate-200/50'
                                        ]">
                                            {{ t(`adminSellers.selfShippingStatusOptions.${selectedSeller.selfShippingRequestStatus || 'none'}`) }}
                                        </span>
                                    </div>
                                    <div v-if="selectedSeller.isVerified" class="flex justify-between items-center py-0.5">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.verification') }}</span>
                                        <span class="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50 px-2.5 py-0.5 text-xs font-semibold">
                                            <CheckCircle2 class="h-3.5 w-3.5" />
                                            <span>{{ t('adminSellers.details.verifiedStore') }}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Performance Metrics -->
                        <div class="space-y-3">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.performanceMetrics') }}</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminSellers.metrics.totalSales') }}</p>
                                    <p class="mt-2 text-xl font-bold text-slate-900 font-mono break-all">{{ formatSellerSales(selectedSeller) }}</p>
                                </div>
                                <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminSellers.metrics.orders') }}</p>
                                    <p class="mt-2 text-2xl font-bold text-slate-900 font-mono">{{ selectedSeller.orderCount || 0 }}</p>
                                </div>
                                <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminSellers.metrics.products') }}</p>
                                    <p class="mt-2 text-2xl font-bold text-slate-900 font-mono">{{ selectedSeller.productCount || 0 }}</p>
                                </div>
                                <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminSellers.metrics.cancellationRate') }}</p>
                                    <p class="mt-2 text-2xl font-bold text-slate-900 font-mono">{{ (selectedSeller.cancellationRate || 0).toFixed(1) }}%</p>
                                </div>
                            </div>
                        </div>

                        <!-- Rating Metrics -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminSellers.details.portfolioRating') }}</p>
                                    <div class="mt-2 flex items-center gap-1.5">
                                        <Star class="h-5 w-5 text-amber-400 fill-amber-400" />
                                        <span class="text-lg font-bold text-slate-800">{{ formatRatingValue(selectedSeller.portfolioAverageRating) }}/5</span>
                                    </div>
                                </div>
                                <span class="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                                    {{ t('adminSellers.table.productRatingsCount', { count: selectedSeller.portfolioRatingsCount || 0 }) }}
                                </span>
                            </div>
                            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('adminSellers.details.sellerReviewRating') }}</p>
                                    <div class="mt-2 flex items-center gap-1.5">
                                        <Star class="h-5 w-5 text-amber-400 fill-amber-400" />
                                        <span class="text-lg font-bold text-slate-800">{{ formatRatingValue(selectedSeller.sellerReviewAverageRating) }}/5</span>
                                    </div>
                                </div>
                                <span class="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                                    {{ t('adminSellers.table.sellerReviewsCount', { count: selectedSeller.sellerReviewCount || 0 }) }}
                                </span>
                            </div>
                        </div>

                        <!-- Admin Actions -->
                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.adminActions') }}</h4>
                            <div class="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    class="rounded-xl bg-[#24a3b5] hover:bg-[#1d8b9a] text-white px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none shadow-sm shadow-[#24a3b5]/10"
                                    @click="handleResetSellerPassword"
                                >
                                    {{ t('adminSellers.actions.resetPassword') }}
                                </button>
                                <button
                                    type="button"
                                    class="rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none shadow-sm"
                                    @click="handleToggleSeller2FA"
                                >
                                    {{ selectedSeller.user?.twoFactorEnabled ? t('adminSellers.actions.disable2FA') : t('adminSellers.actions.enable2FA') }}
                                </button>
                                <button
                                    type="button"
                                    class="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none shadow-sm shadow-amber-100"
                                    @click="handleForceSellerLogout"
                                >
                                    {{ t('adminSellers.actions.forceLogout') }}
                                </button>
                                <button
                                    type="button"
                                    class="rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none shadow-sm shadow-sm"
                                    :class="selectedSeller.user?.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-50' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-50'"
                                    @click="handleToggleSellerBlock"
                                >
                                    {{ selectedSeller.user?.isBlocked ? t('adminSellers.actions.unblock') : t('adminSellers.actions.block') }}
                                </button>
                            </div>
                        </div>

                        <!-- Recent Reviews -->
                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.recentReviews') }}</h4>
                            <div v-if="selectedSeller.recentReviews?.length" class="space-y-3">
                                <div v-for="review in selectedSeller.recentReviews" :key="review._id"
                                    class="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-3">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-1">
                                            <Star :class="review.rating >= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'"
                                                class="h-4 w-4" />
                                            <span class="text-xs font-bold text-slate-700">{{ review.rating }}/5</span>
                                        </div>
                                        <p class="text-sm text-slate-600 italic">"{{ review.comment }}"</p>
                                    </div>
                                    <span class="text-xs font-semibold text-slate-400 whitespace-nowrap pt-1">
                                        {{ formatDate(review.createdAt) }}
                                    </span>
                                </div>
                            </div>
                            <div v-else class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 italic text-center">
                                {{ t('adminSellers.details.noRecentReviews') }}
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('adminSellers.details.recentActivity') }}</h4>
                            <div v-if="selectedSeller.recentActivity?.length" class="space-y-3">
                                <div
                                    v-for="activity in selectedSeller.recentActivity.slice(0, 5)"
                                    :key="activity.id"
                                    class="rounded-xl bg-slate-50 border border-slate-100 p-4 flex flex-col sm:flex-row justify-between gap-3"
                                >
                                    <div class="min-w-0">
                                        <p class="text-sm font-bold text-slate-800">{{ formatActivityAction(activity.action) }}</p>
                                        <p v-if="activity.details?.reason" class="mt-1 text-xs text-slate-500 leading-relaxed">{{ activity.details.reason }}</p>
                                    </div>
                                    <span class="text-xs font-semibold text-slate-400 whitespace-nowrap pt-0.5">{{ formatDateTime(activity.timestamp) }}</span>
                                </div>
                            </div>
                            <div v-else class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 italic text-center">
                                {{ t('adminSellers.details.noRecentActivity') }}
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer Actions -->
                    <div class="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3 sm:px-8">
                        <button 
                            type="button" 
                            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none"
                            @click="selectedSeller = null"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Update Status Modal -->
        <div v-if="showStatusModal" class="fixed inset-0 z-[120] bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6 flex items-center justify-center" @click.self="closeStatusModal">
            <div class="mx-auto max-w-md w-full">
                <!-- Modal Panel -->
                <div class="relative z-[121] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
                    <!-- Modal Header -->
                    <div class="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex justify-between items-center">
                        <h3 class="text-lg font-bold">
                            {{ t('adminSellers.statusModal.title') }}
                        </h3>
                        <button
                            @click="closeStatusModal"
                            class="rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none"
                        >
                            <XIcon class="h-4.5 w-4.5" />
                        </button>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="updateSellerStatus">
                        <div class="bg-slate-50 p-6 space-y-4">
                            <!-- Verification Status -->
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    {{ t('adminSellers.statusModal.applicationStatus') }}
                                </label>
                                <div class="relative">
                                    <select v-model="newStatus"
                                        class="appearance-none w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-4 focus:ring-[#24a3b5]/10 focus:border-[#24a3b5] transition-all text-sm font-semibold cursor-pointer">
                                        <option value="not_submitted">{{ t('adminSellers.statusOptions.notSubmitted') }}</option>
                                        <option value="submitted">{{ t('adminSellers.statusOptions.submitted') }}</option>
                                        <option value="under_review">{{ t('adminSellers.statusOptions.underReview') }}</option>
                                        <option value="approved">{{ t('adminSellers.statusOptions.approved') }}</option>
                                        <option value="rejected">{{ t('adminSellers.statusOptions.rejected') }}</option>
                                    </select>
                                    <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown class="w-4.5 h-4.5" />
                                    </div>
                                </div>
                            </div>

                            <!-- Fulfillment Type -->
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    {{ t('adminSellers.statusModal.fulfillmentType') }}
                                </label>
                                <div class="relative">
                                    <select v-model="newFulfillmentType"
                                        class="appearance-none w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-4 focus:ring-[#24a3b5]/10 focus:border-[#24a3b5] transition-all text-sm font-semibold cursor-pointer">
                                        <option value="platform">{{ t('adminSellers.fulfillmentTypes.platform') }}</option>
                                        <option value="vendor">{{ t('adminSellers.fulfillmentTypes.vendor') }}</option>
                                    </select>
                                    <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown class="w-4.5 h-4.5" />
                                    </div>
                                </div>
                            </div>

                            <!-- Self-Shipping Status -->
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    {{ t('adminSellers.statusModal.selfShippingApproval') }}
                                </label>
                                <div class="relative">
                                    <select v-model="newSelfShippingRequestStatus"
                                        class="appearance-none w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-4 focus:ring-[#24a3b5]/10 focus:border-[#24a3b5] transition-all text-sm font-semibold cursor-pointer">
                                        <option value="none">{{ t('adminSellers.selfShippingStatusOptions.none') }}</option>
                                        <option value="pending">{{ t('adminSellers.selfShippingStatusOptions.pending') }}</option>
                                        <option value="approved">{{ t('adminSellers.selfShippingStatusOptions.approved') }}</option>
                                        <option value="rejected">{{ t('adminSellers.selfShippingStatusOptions.rejected') }}</option>
                                    </select>
                                    <div class="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown class="w-4.5 h-4.5" />
                                    </div>
                                </div>
                            </div>

                            <!-- Reason for Change -->
                            <div>
                                <div class="flex justify-between items-center mb-2">
                                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        {{ t('adminSellers.statusModal.reasonForChange') }}
                                    </label>
                                    <button type="button" @click="statusNote = STATUS_TEMPLATES[newStatus]"
                                        class="text-xs font-bold text-[#24a3b5] hover:text-[#1d8b9a]">
                                        {{ t('adminSellers.statusModal.useTemplateMessage') }}
                                    </button>
                                </div>
                                <textarea v-model="statusNote" rows="6" 
                                    class="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-4 focus:ring-[#24a3b5]/10 focus:border-[#24a3b5] transition-all text-sm font-medium resize-none"
                                    :placeholder="t('adminSellers.statusModal.reasonPlaceholder')"></textarea>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
                            <button type="button" @click="closeStatusModal"
                                class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none">
                                {{ t('adminSellers.statusModal.cancel') }}
                            </button>
                            <button type="submit" 
                                class="rounded-xl bg-[#24a3b5] hover:bg-[#1d8b9a] text-white px-5 py-2 font-bold text-sm transition-all shadow-sm focus:outline-none">
                                {{ t('adminSellers.statusModal.updateStatus') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
    XIcon, 
    Star, 
    ChevronDown, 
    CheckCircle,
    MoreHorizontal,
    ExternalLink,
    Loader2,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Clock,
    User,
    Store,
    Calendar,
    RefreshCcw
} from 'lucide-vue-next';
import { useAdminStore } from '@/store/admin';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export default {
    name: 'AdminSellers',

    components: {
        XIcon,
        Star,
        ChevronDown,
        CheckCircle,
        MoreHorizontal,
        ExternalLink,
        Loader2,
        CheckCircle2,
        AlertCircle,
        XCircle,
        Clock,
        User,
        Store,
        Calendar,
        RefreshCcw,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
        DropdownMenuSeparator,
        DropdownMenuLabel,
    },

    setup() {
        const { t, locale } = useI18n();
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
        const statusTargetSeller = ref(null);
        const showStatusModal = ref(false);
        const newStatus = ref('');
        const newFulfillmentType = ref('platform');
        const newSelfShippingRequestStatus = ref('none');
        const statusNote = ref('');
        const isSubmittingStatus = ref(false);

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

        const refreshSelectedSeller = async (sellerId) => {
            await fetchSellers();
            selectedSeller.value = await adminStore.fetchSellerDetails(sellerId);
        };

        const showUpdateStatus = (seller) => {
            statusTargetSeller.value = seller;
            newStatus.value = seller.verificationStatus;
            newFulfillmentType.value = seller.fulfillmentType || 'platform';
            newSelfShippingRequestStatus.value = seller.selfShippingRequestStatus || 'none';
            statusNote.value = STATUS_TEMPLATES[seller.verificationStatus] || '';
            showStatusModal.value = true;
        };

        const updateSellerStatus = async () => {
            try {
                isSubmittingStatus.value = true;

                // Automatically set isVerified to true when status is approved
                const isVerifiedStore = newStatus.value === 'approved';

                await adminStore.updateSellerStatus(
                    statusTargetSeller.value._id,
                    {
                        verificationStatus: newStatus.value,
                        isVerified: isVerifiedStore,
                        note: statusNote.value,
                        fulfillmentType: newFulfillmentType.value,
                        selfShippingRequestStatus: newSelfShippingRequestStatus.value,
                        selfShippingApproved: newSelfShippingRequestStatus.value === 'approved'
                    }
                );
                toast.success(t('adminSellers.toasts.statusUpdated'));
                const sellerId = statusTargetSeller.value?._id;
                closeStatusModal();
                await fetchSellers();

                // If the updated seller was selected in the details modal, refresh that data too
                if (selectedSeller.value && sellerId && selectedSeller.value._id === sellerId) {
                    const updatedSellerDetails = await adminStore.fetchSellerDetails(sellerId);
                    selectedSeller.value = updatedSellerDetails;
                }
            } catch (error) {
                console.error('Error in updateSellerStatus:', error);
                toast.error(t('adminSellers.toasts.statusUpdateFailed'));
            } finally {
                isSubmittingStatus.value = false;
            }
        };

        const handleResetSellerPassword = async () => {
            if (!selectedSeller.value) return;
            try {
                await adminStore.resetUserPassword(selectedSeller.value._id, 'sellers');
                toast.success(t('adminSellers.toasts.passwordResetSent'));
            } catch (error) {
                console.error('Error resetting seller password:', error);
                toast.error(t('adminSellers.toasts.passwordResetFailed'));
            }
        };

        const handleToggleSeller2FA = async () => {
            if (!selectedSeller.value) return;
            try {
                const response = await adminStore.toggle2FA(selectedSeller.value._id, 'sellers');
                toast.success(
                    response.twoFactorEnabled
                        ? t('adminSellers.toasts.twoFactorEnabled')
                        : t('adminSellers.toasts.twoFactorDisabled')
                );
                await refreshSelectedSeller(selectedSeller.value._id);
            } catch (error) {
                console.error('Error toggling seller 2FA:', error);
                toast.error(t('adminSellers.toasts.twoFactorUpdateFailed'));
            }
        };

        const handleToggleSellerBlock = async () => {
            if (!selectedSeller.value) return;
            try {
                const response = await adminStore.toggleBlockStatus(selectedSeller.value._id, 'sellers');
                toast.success(
                    response.isBlocked
                        ? t('adminSellers.toasts.sellerBlocked')
                        : t('adminSellers.toasts.sellerUnblocked')
                );
                await refreshSelectedSeller(selectedSeller.value._id);
            } catch (error) {
                console.error('Error toggling seller block:', error);
                toast.error(t('adminSellers.toasts.blockUpdateFailed'));
            }
        };

        const handleForceSellerLogout = async () => {
            if (!selectedSeller.value) return;
            try {
                await adminStore.forceLogout(selectedSeller.value._id, 'sellers');
                toast.success(t('adminSellers.toasts.forceLogoutSuccess'));
                await refreshSelectedSeller(selectedSeller.value._id);
            } catch (error) {
                console.error('Error forcing seller logout:', error);
                toast.error(t('adminSellers.toasts.forceLogoutFailed'));
            }
        };

        const closeStatusModal = () => {
            showStatusModal.value = false;
            newStatus.value = '';
            newFulfillmentType.value = 'platform';
            newSelfShippingRequestStatus.value = 'none';
            statusNote.value = '';
            statusTargetSeller.value = null;
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
            return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatDateTime = (date) => {
            return new Date(date).toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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

        const getStatusIcon = (status) => {
            const icons = {
                'not_submitted': AlertCircle,
                'submitted': Clock,
                'under_review': Loader2,
                'approved': CheckCircle2,
                'rejected': XCircle
            };
            return icons[status] || AlertCircle;
        };


        const formatNumber = (number) => {
            return number.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        const formatCurrency = (amount, currency = 'NGN') => {
            const resolvedCurrency = currency === 'XOF' ? 'XOF' : 'NGN';
            let formatted = new Intl.NumberFormat(resolvedCurrency === 'XOF' ? 'fr-FR' : 'en-NG', {
                style: 'currency',
                currency: resolvedCurrency,
                minimumFractionDigits: resolvedCurrency === 'XOF' ? 0 : 2,
                maximumFractionDigits: resolvedCurrency === 'XOF' ? 0 : 2,
            }).format(Number(amount || 0));

            if (resolvedCurrency === 'XOF') {
                formatted = formatted.replace(/F[\s\u202F\u00A0]*CFA/g, 'CFA');
            }
            return formatted;
        };

        const formatCurrencyTotals = (totals, fallbackCurrency = 'NGN', fallbackAmount = 0) => {
            const entries = Object.entries(totals || {}).filter(([, amount]) => Math.abs(Number(amount || 0)) > 0.0001);
            if (!entries.length) {
                return formatCurrency(fallbackAmount, fallbackCurrency);
            }

            return entries
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([currency, amount]) => formatCurrency(amount, currency))
                .join(' / ');
        };

        const formatSellerSales = (seller) => {
            const fallbackCurrency = seller?.user?.currency || 'NGN';
            return formatCurrencyTotals(
                seller?.salesTotalsByCurrency,
                fallbackCurrency,
                seller?.totalSales || 0
            );
        };

        const getDisplayRating = (seller) => {
            if ((seller?.portfolioRatingsCount || 0) > 0) {
                return Number(seller?.portfolioAverageRating || 0);
            }

            return Number(
                seller?.sellerReviewAverageRating ??
                seller?.rating ??
                0
            );
        };

        const formatRatingValue = (rating) => {
            const numericRating = Number(rating || 0);
            return numericRating > 0 ? numericRating.toFixed(1) : '0.0';
        };

        const getRatingContextText = (seller) => {
            if ((seller?.portfolioRatingsCount || 0) > 0) {
                return t('adminSellers.table.productRatingsCount', {
                    count: seller?.portfolioRatingsCount || 0
                });
            }

            return t('adminSellers.table.sellerReviewsCount', {
                count: seller?.sellerReviewCount || 0
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
            if (!verificationStatus) return 'bg-slate-50 text-slate-600 border border-slate-200/50';

            const classes = {
                'not_submitted': 'bg-slate-50 text-slate-600 border border-slate-200/50',
                'submitted': 'bg-amber-50 text-amber-700 border border-amber-200/50',
                'under_review': 'bg-blue-50 text-blue-700 border border-blue-200/50',
                'approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
                'rejected': 'bg-rose-50 text-rose-700 border border-rose-200/50'
            };
            return classes[verificationStatus] || 'bg-slate-50 text-slate-600 border border-slate-200/50';
        };

        const getAccountStatusText = (seller) => {
            if (seller?.user?.isBlocked) return t('adminSellers.details.blocked');
            if (seller?.isVacationMode) return t('adminSellers.details.vacationMode');
            return t('adminSellers.details.active');
        };

        const formatActivityAction = (action) => {
            if (!action) return t('adminSellers.details.notProvided');
            return action
                .toString()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase());
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
            newFulfillmentType,
            newSelfShippingRequestStatus,
            statusNote,
            currentPage,
            totalItems,
            totalPages,
            startItem,
            endItem,
            filters,
            isSubmittingStatus,
            handleSearch,
            viewSellerDetails,
            showUpdateStatus,
            updateSellerStatus,
            handleResetSellerPassword,
            handleToggleSeller2FA,
            handleToggleSellerBlock,
            handleForceSellerLogout,
            closeStatusModal,
            prevPage,
            nextPage,
            formatDate,
            formatDateTime,
            formatStatus,
            formatNumber,
            formatSellerSales,
            getDisplayRating,
            formatRatingValue,
            getRatingContextText,
            getInitials,
            getStatusClass,
            getStatusIcon,
            getAccountStatusText,
            formatActivityAction,
            fetchSellers,
            STATUS_TEMPLATES,
            t,
            locale
        };
    }
};
</script>

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
                    <p v-if="filters.sortBy === 'rating'" class="mt-1 text-xs text-gray-500">
                        {{ t('adminSellers.filters.ratingHint') }}
                    </p>
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
            <div class="md:hidden divide-y divide-gray-200">
                <template v-if="loading">
                    <div class="px-6 py-8 text-center">
                        <div class="flex justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="seller in sellers" :key="seller._id" class="p-4 space-y-4">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0 flex items-center gap-3">
                                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <span class="text-sm font-medium text-gray-500">
                                        {{ getInitials(seller.username) }}
                                    </span>
                                </div>
                                <div class="min-w-0">
                                    <div class="text-sm font-medium text-gray-900 break-words">{{ seller.username }}</div>
                                    <div class="text-sm text-gray-500 break-all">{{ seller.email }}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-1 flex-wrap justify-end">
                                <span :class="[
                                    'w-fit px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    getStatusClass(seller?.verificationStatus)
                                ]">
                                    {{ formatStatus(seller?.verificationStatus) }}
                                </span>
                                <span v-if="seller.verificationStatus === 'approved' && seller.isVerified"
                                    class="w-fit h-fit inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    <span class="flex items-center gap-1">
                                        <CheckCircle class="w-3 h-3" />
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminSellers.table.store') }}</div>
                                <div class="mt-1 text-gray-900 break-words">{{ seller.storeName }}</div>
                                <div class="text-xs text-gray-500 mt-1">{{ t('adminSellers.since', { date: formatDate(seller.createdAt) }) }}</div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminSellers.table.products') }}</div>
                                <div class="mt-1 text-gray-900">{{ seller.productCount || 0 }}</div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminSellers.table.sales') }}</div>
                                <div class="mt-1 text-gray-900 break-words">{{ formatSellerSales(seller) }}</div>
                                <div class="text-xs text-gray-500 mt-1">{{ t('adminSellers.ordersCount', { count: seller.orderCount || 0 }) }}</div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">{{ t('adminSellers.table.rating') }}</div>
                                <div class="mt-1 flex items-center">
                                    <Star :class="getDisplayRating(seller) >= 4 ? 'text-yellow-400' : 'text-gray-300'" class="h-5 w-5" />
                                    <span class="ml-1 text-sm text-gray-500">
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
                <table class="min-w-[1100px] w-full divide-y divide-gray-200 table-fixed">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="w-[23%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.seller') }}
                            </th>
                            <th class="w-[18%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.store') }}
                            </th>
                            <th class="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.status') }}
                            </th>
                            <th class="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.products') }}
                            </th>
                            <th class="w-[16%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.sales') }}
                            </th>
                            <th class="w-[8%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminSellers.table.rating') }}
                            </th>
                            <th class="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                                <td class="px-6 py-4">
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
                                            <div class="text-sm font-medium text-gray-900 break-words">
                                                {{ seller.username }}
                                            </div>
                                            <div class="text-sm text-gray-500 break-all">
                                                {{ seller.email }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900 break-words">{{ seller.storeName }}</div>
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

                                        <span v-if="seller.verificationStatus === 'approved' && seller.isVerified"
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
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900">
                                        {{ formatSellerSales(seller) }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ t('adminSellers.ordersCount', { count: seller.orderCount || 0 }) }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <Star :class="getDisplayRating(seller) >= 4 ? 'text-yellow-400' : 'text-gray-300'"
                                            class="h-5 w-5" />
                                        <span class="ml-1 text-sm text-gray-500">
                                            {{ formatRatingValue(getDisplayRating(seller)) }}
                                        </span>
                                    </div>
                                    <div class="mt-1 text-xs text-gray-500">
                                        {{ getRatingContextText(seller) }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm font-medium">
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
            class="fixed inset-0 z-[120] bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto p-4"
            @click.self="selectedSeller = null">
            <div class="bg-white rounded-lg p-6 w-full max-w-5xl m-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
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

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- Basic Info -->
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.basicInformation') }}</h4>
                        <div class="bg-gray-50 p-4 rounded-lg space-y-1">
                            <p><span class="font-medium">{{ t('adminSellers.details.name') }}</span> {{ selectedSeller.username || selectedSeller.user?.username || t('adminSellers.details.notProvided') }}</p>
                            <p class="break-all"><span class="font-medium">{{ t('adminSellers.details.email') }}</span> {{ selectedSeller.email || selectedSeller.user?.email || t('adminSellers.details.notProvided') }}</p>
                            <p><span class="font-medium">{{ t('adminSellers.details.phone') }}</span> {{ selectedSeller.phone || t('adminSellers.details.notProvided') }}</p>
                            <p><span class="font-medium">{{ t('adminSellers.details.lastLogin') }}</span> {{ selectedSeller.user?.lastLogin ? formatDateTime(selectedSeller.user.lastLogin) : t('adminSellers.details.notProvided') }}</p>
                        </div>
                    </div>

                    <!-- Store Info -->
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.storeInformation') }}</h4>
                        <div class="bg-gray-50 p-4 rounded-lg space-y-1">
                            <p><span class="font-medium">{{ t('adminSellers.details.storeName') }}</span> {{ selectedSeller.storeName }}</p>
                            <p><span class="font-medium">{{ t('adminSellers.details.applicationStatus') }}</span> {{
                                formatStatus(selectedSeller.verificationStatus) }}</p>
                            <p><span class="font-medium">{{ t('adminSellers.details.accountStatus') }}</span> {{ getAccountStatusText(selectedSeller) }}</p>
                            <p><span class="font-medium">{{ t('adminSellers.details.twoFactor') }}</span> {{ selectedSeller.user?.twoFactorEnabled ? t('adminSellers.details.enabled') : t('adminSellers.details.disabled') }}</p>
                            <p v-if="selectedSeller.isVerified" class="flex items-center gap-2">
                                <span class="font-medium">{{ t('adminSellers.details.verification') }}</span>
                                <span
                                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {{ t('adminSellers.details.verifiedStore') }}
                                </span>
                            </p>
                            <p>
                                <span class="font-medium">{{ t('adminSellers.details.portfolioRating') }}</span>
                                {{ formatRatingValue(selectedSeller.portfolioAverageRating) }}/5
                                <span class="text-gray-500">
                                    ({{ t('adminSellers.table.productRatingsCount', { count: selectedSeller.portfolioRatingsCount || 0 }) }})
                                </span>
                            </p>
                            <p>
                                <span class="font-medium">{{ t('adminSellers.details.sellerReviewRating') }}</span>
                                {{ formatRatingValue(selectedSeller.sellerReviewAverageRating) }}/5
                                <span class="text-gray-500">
                                    ({{ t('adminSellers.table.sellerReviewsCount', { count: selectedSeller.sellerReviewCount || 0 }) }})
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Performance Metrics -->
                <div class="mb-6">
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.performanceMetrics') }}</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">{{ t('adminSellers.metrics.totalSales') }}</p>
                            <p class="text-xl font-semibold break-words">{{ formatSellerSales(selectedSeller) }}</p>
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
                            <p class="text-sm text-gray-500">{{ t('adminSellers.metrics.cancellationRate') }}</p>
                            <p class="text-xl font-semibold">{{ (selectedSeller.cancellationRate || 0).toFixed(1) }}%</p>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.adminActions') }}</h4>
                    <div class="flex flex-wrap gap-3">
                        <button
                            type="button"
                            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            @click="handleResetSellerPassword"
                        >
                            {{ t('adminSellers.actions.resetPassword') }}
                        </button>
                        <button
                            type="button"
                            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            @click="handleToggleSeller2FA"
                        >
                            {{ selectedSeller.user?.twoFactorEnabled ? t('adminSellers.actions.disable2FA') : t('adminSellers.actions.enable2FA') }}
                        </button>
                        <button
                            type="button"
                            class="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                            @click="handleForceSellerLogout"
                        >
                            {{ t('adminSellers.actions.forceLogout') }}
                        </button>
                        <button
                            type="button"
                            class="rounded-md px-4 py-2 text-sm font-medium text-white"
                            :class="selectedSeller.user?.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'"
                            @click="handleToggleSellerBlock"
                        >
                            {{ selectedSeller.user?.isBlocked ? t('adminSellers.actions.unblock') : t('adminSellers.actions.block') }}
                        </button>
                    </div>
                </div>

                <!-- Recent Reviews -->
                <div class="mb-6">
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.recentReviews') }}</h4>
                    <div v-if="selectedSeller.recentReviews?.length" class="space-y-4">
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
                    <div v-else class="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                        {{ t('adminSellers.details.noRecentReviews') }}
                    </div>
                </div>

                <div>
                    <h4 class="font-medium text-gray-900 mb-2">{{ t('adminSellers.details.recentActivity') }}</h4>
                    <div v-if="selectedSeller.recentActivity?.length" class="space-y-3">
                        <div
                            v-for="activity in selectedSeller.recentActivity.slice(0, 5)"
                            :key="activity.id"
                            class="rounded-lg bg-gray-50 p-4"
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <p class="text-sm font-medium text-gray-900">{{ formatActivityAction(activity.action) }}</p>
                                    <p v-if="activity.details?.reason" class="mt-1 text-sm text-gray-600">{{ activity.details.reason }}</p>
                                </div>
                                <span class="text-sm text-gray-500">{{ formatDateTime(activity.timestamp) }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                        {{ t('adminSellers.details.noRecentActivity') }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Update Status Modal -->
        <div v-if="showStatusModal" class="fixed inset-0 z-[130] bg-gray-500 bg-opacity-75 flex items-center justify-center">
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
        const statusTargetSeller = ref(null);
        const showStatusModal = ref(false);
        const newStatus = ref('');
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
                        note: statusNote.value
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
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatDateTime = (date) => {
            return new Date(date).toLocaleString('en-US', {
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


        const formatNumber = (number) => {
            return number.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        const formatCurrency = (amount, currency = 'NGN') => {
            const resolvedCurrency = currency === 'XOF' ? 'XOF' : 'NGN';
            return new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: resolvedCurrency,
                minimumFractionDigits: 2,
            }).format(Number(amount || 0));
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
            getAccountStatusText,
            formatActivityAction,
            fetchSellers,
            STATUS_TEMPLATES,
            t
        };
    }
};
</script>

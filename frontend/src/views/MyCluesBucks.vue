<!-- frontend/src/views/MyCluesBucks.vue -->
<template>
    <div class="mx-auto py-0 space-y-8">
        <!-- Balance Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Available Balance Card -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1.5">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('myCluesBucksPage.availableBalance') }}</p>
                        <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats.currentBalance }}</p>
                    </div>
                    <div class="p-3 bg-[#ff934b]/10 text-[#ff934b] rounded-xl shrink-0 group-hover:bg-[#ff934b] group-hover:text-white transition-all duration-300 shadow-sm">
                        <Coins class="w-6 h-6" />
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{{ t('myCluesBucksPage.currentPointsBalance') }}</span>
                </div>
            </div>

            <!-- Lifetime Points Card -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1.5">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('myCluesBucksPage.lifetimePoints') }}</p>
                        <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats.lifetimePoints }}</p>
                    </div>
                    <div class="p-3 bg-emerald-50 text-emerald-500 rounded-xl shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                        <Award class="w-6 h-6" />
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{{ t('myCluesBucksPage.totalPointsEarned') }}</span>
                </div>
            </div>

            <!-- Expiring Soon Card -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1.5">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('myCluesBucksPage.expiringSoon') }}</p>
                        <p class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ stats.pointsExpiringSoon }}</p>
                    </div>
                    <div class="p-3 bg-rose-50 text-rose-500 rounded-xl shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm">
                        <Clock class="w-6 h-6" />
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-rose-500/80 font-bold uppercase tracking-wider">
                    <span>{{ t('myCluesBucksPage.useBeforeExpire') }}</span>
                </div>
            </div>
        </div>

        <!-- Redemption Perks Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Special Offers Status -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="space-y-1">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('myCluesBucksPage.specialOffers') }}</p>
                        <p class="text-xl font-extrabold text-slate-800">
                            <span v-if="hasValidOfferAccess" class="text-emerald-600">{{ t('myCluesBucksPage.active') }}</span>
                            <span v-else class="text-slate-400">{{ t('myCluesBucksPage.inactive') }}</span>
                        </p>
                    </div>
                    <div class="p-3 rounded-xl shrink-0 transition-all duration-300 shadow-sm"
                        :class="hasValidOfferAccess ? 'bg-[#ff934b]/10 text-[#ff934b]' : 'bg-slate-100 text-slate-400'">
                        <Tag class="w-6 h-6" />
                    </div>
                </div>
                <div class="space-y-3 mt-2">
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-bold text-slate-500 uppercase tracking-wider">{{ t('myCluesBucksPage.accessStatus') }}</span>
                        <span class="px-2.5 py-0.5 text-xs font-bold rounded-full border"
                            :class="hasValidOfferAccess ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-150'">
                            {{ hasValidOfferAccess ? t('myCluesBucksPage.active') : t('myCluesBucksPage.inactive') }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                        <span>{{ t('myCluesBucksPage.totalUsed', { count: getSpecialOfferStats().totalRedeemed }) }}</span>
                        <span class="font-semibold text-slate-700">{{ t('myCluesBucksPage.pointsUsed', { count: getSpecialOfferStats().pointsUsed }) }}</span>
                    </div>
                </div>
                <p v-if="!hasValidOfferAccess" class="text-[11px] text-slate-400 font-semibold mt-4 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50">
                    {{ t('myCluesBucksPage.specialOfferHint') }}
                </p>
            </div>

            <!-- Store Credit Status -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="space-y-1">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('myCluesBucksPage.storeCredit') }}</p>
                        <p class="text-xl font-extrabold text-slate-800">
                            ₦{{ formatMoneyValue(stats.storeCreditBalance || 0) }}
                        </p>
                    </div>
                    <div class="p-3 rounded-xl shrink-0 transition-all duration-300 shadow-sm"
                        :class="(stats.storeCreditBalance || 0) > 0 ? 'bg-[#ff934b]/10 text-[#ff934b]' : 'bg-slate-100 text-slate-400'">
                        <CreditCard class="w-6 h-6" />
                    </div>
                </div>
                <div class="space-y-3 mt-2">
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-bold text-slate-500 uppercase tracking-wider">{{ t('myCluesBucksPage.creditStatus') }}</span>
                        <span class="px-2.5 py-0.5 text-xs font-bold rounded-full border"
                            :class="(stats.storeCreditBalance || 0) > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-150'">
                            {{ (stats.storeCreditBalance || 0) > 0 ? t('myCluesBucksPage.active') : t('myCluesBucksPage.inactive') }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                        <span>{{ t('myCluesBucksPage.totalUsed', { count: getStoreCreditStats().totalUsed }) }}</span>
                        <span class="font-semibold text-slate-700">{{ t('myCluesBucksPage.storeCreditUsed', { amount: formatMoneyValue(getStoreCreditStats().amountUsed) }) }}</span>
                    </div>
                </div>
                <p v-if="!getStoreCreditStats().totalRedeemed" class="text-[11px] text-slate-400 font-semibold mt-4 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50">
                    {{ t('myCluesBucksPage.storeCreditHint') }}
                </p>
                <p v-else-if="getStoreCreditStats().lastRedeemedDate" class="text-[11px] text-slate-400 font-semibold mt-4 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50 flex items-center justify-between">
                    <span>{{ t('myCluesBucksPage.lastRedeemedDate', { date: '' }) }}</span>
                    <span class="font-bold text-slate-600">{{ getStoreCreditStats().lastRedeemedDate }}</span>
                </p>
            </div>

            <!-- Discount Coupon Status -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="space-y-1">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('myCluesBucksPage.discountCoupon') }}</p>
                        <p class="text-xl font-extrabold text-slate-800">
                            {{ getCouponTransactions().length ? '₦1000' : '0' }}
                        </p>
                    </div>
                    <div class="p-3 rounded-xl shrink-0 transition-all duration-300 shadow-sm"
                        :class="getCouponTransactions().length ? 'bg-[#ff934b]/10 text-[#ff934b]' : 'bg-slate-100 text-slate-400'">
                        <Ticket class="w-6 h-6" />
                    </div>
                </div>
                <div class="space-y-3 mt-2">
                    <div v-if="getLatestCoupon()" class="space-y-3">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-slate-500 uppercase tracking-wider">{{ t('myCluesBucksPage.code', { code: '' }) }}</span>
                            <span class="px-2 py-0.5 text-xs font-extrabold rounded bg-amber-50 text-amber-700 border border-amber-100 tracking-wider uppercase font-mono">
                                {{ getLatestCoupon().code }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                            <span>{{ t('myCluesBucksPage.totalUsed', { count: getCouponTransactions().length }) }}</span>
                            <span class="font-semibold text-slate-700">{{ t('myCluesBucksPage.pointsUsed', { count: getCouponTransactions().length * 1000 }) }}</span>
                        </div>
                    </div>
                    <div v-else class="space-y-3">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-slate-500 uppercase tracking-wider">Status</span>
                            <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-50 text-slate-400 border border-slate-100">
                                {{ t('myCluesBucksPage.inactive') }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-50">
                            <span>{{ t('myCluesBucksPage.couponHint') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Earn & Redeem Content Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Ways to Earn -->
            <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 class="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                    <div class="p-2 bg-[#ff934b]/10 text-[#ff934b] rounded-lg">
                        <Target class="w-5 h-5" />
                    </div>
                    {{ t('myCluesBucksPage.waysToEarn') }}
                </h3>
                <div class="space-y-6">
                    <div class="flex items-start gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50/30 transition-all duration-300">
                        <div class="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                            <ShoppingBag class="w-5 h-5" />
                        </div>
                        <div class="space-y-1">
                            <p class="font-bold text-slate-800 text-sm sm:text-base leading-snug">{{ t('myCluesBucksPage.earn.purchaseTitle') }}</p>
                            <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ t('myCluesBucksPage.earn.purchaseDescription') }}</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50/30 transition-all duration-300">
                        <div class="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                            <Star class="w-5 h-5" />
                        </div>
                        <div class="space-y-1">
                            <p class="font-bold text-slate-800 text-sm sm:text-base leading-snug">{{ t('myCluesBucksPage.earn.reviewsTitle') }}</p>
                            <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ t('myCluesBucksPage.earn.reviewsDescription') }}</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50/30 transition-all duration-300">
                        <div class="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                            <Users class="w-5 h-5" />
                        </div>
                        <div class="space-y-1">
                            <p class="font-bold text-slate-800 text-sm sm:text-base leading-snug">{{ t('myCluesBucksPage.earn.referralsTitle') }}</p>
                            <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ t('myCluesBucksPage.earn.referralsDescription') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Redemption Options -->
            <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 class="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                    <div class="p-2 bg-[#ff934b]/10 text-[#ff934b] rounded-lg">
                        <Gift class="w-5 h-5" />
                    </div>
                    {{ t('myCluesBucksPage.redeemPoints') }}
                </h3>
                <div class="space-y-4">
                    <button v-for="option in redemptionOptions" :key="option.id" @click="handleRedeem(option)"
                        class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#ff934b] hover:bg-[#ff934b]/5 active:scale-[0.98] transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-100 disabled:hover:bg-transparent"
                        :disabled="!hasEnoughPoints(option.points)">
                        <div class="flex items-start gap-4">
                            <div class="p-2.5 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                                <component :is="getIconComponent(option.type)" class="w-5 h-5" />
                            </div>
                            <div class="space-y-1">
                                <p class="font-bold text-slate-800 text-sm leading-snug">{{ getOptionText(option).title }}</p>
                                <p class="text-xs text-slate-400 font-semibold leading-relaxed max-w-[280px]">{{ getOptionText(option).description }}</p>
                            </div>
                        </div>
                        <span class="text-xs sm:text-sm font-extrabold text-[#ff934b] shrink-0 ml-4 bg-[#ff934b]/10 px-2.5 py-1 rounded-lg">
                            {{ option.points }} pts
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Special Offers List -->
        <div v-if="hasValidOfferAccess" class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 class="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                <div class="p-2 bg-[#ff934b]/10 text-[#ff934b] rounded-lg">
                    <Tag class="w-5 h-5" />
                </div>
                {{ t('myCluesBucksPage.activeSpecialOffers') }}
            </h3>
            <div class="grid gap-6 md:grid-cols-2">
                <div v-for="offer in activeSpecialOffers" :key="offer._id"
                    class="p-5 border border-slate-100 rounded-2xl bg-white hover:border-[#ff934b]/60 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                    <div class="space-y-3">
                        <div class="flex justify-between items-start gap-4">
                            <h4 class="font-bold text-slate-800 text-sm sm:text-base tracking-tight leading-snug">{{ offer.title }}</h4>
                            <span class="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded border border-emerald-100 shrink-0">
                                {{ t('myCluesBucksPage.percentOff', { count: offer.discount }) }}
                            </span>
                        </div>
                        <p class="text-xs text-slate-400 font-semibold leading-relaxed">{{ offer.description }}</p>
                        
                        <div class="flex flex-wrap gap-2 pt-2">
                            <!-- Category Badge -->
                            <span v-if="getCategoryName(offer.category)" class="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                {{ getCategoryName(offer.category) }}
                            </span>
                            <!-- Minimum purchase requirement -->
                            <span v-if="offer.minimumPurchase > 0" class="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">
                                {{ t('myCluesBucksPage.minimumPurchase', { amount: offer.minimumPurchase }) }}
                            </span>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        <span>{{ t('myCluesBucksPage.expiresDate', { date: formatDate(offer.endDate) }) }}</span>
                    </div>
                </div>
                <div v-if="!activeSpecialOffers.length" class="col-span-2 text-center py-12 text-slate-400 font-semibold bg-slate-50/50 rounded-2xl border border-dashed border-slate-150">
                    {{ t('myCluesBucksPage.noActiveOffers') }}
                </div>
            </div>
        </div>

        <!-- Transaction History -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 class="text-base font-extrabold text-slate-800">{{ t('myCluesBucksPage.transactionHistory') }}</h3>
            </div>

            <!-- Filter Controls -->
            <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <!-- Search Bar -->
                <div class="relative w-full sm:w-72">
                    <input type="text" v-model="searchQuery" :placeholder="t('myCluesBucksPage.searchPlaceholder')"
                        class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#ff934b] focus:ring-4 focus:ring-[#ff934b]/10 transition-all shadow-sm" />
                    <div class="absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                        <Search class="w-4 h-4" />
                    </div>
                </div>

                <!-- Tabs (All, Earned, Spent) -->
                <div class="flex bg-slate-100 p-0.5 rounded-xl self-start sm:self-auto shadow-inner">
                    <button v-for="tab in ['all', 'earned', 'spent']" :key="tab" @click="activeTab = tab"
                        class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 uppercase tracking-wide"
                        :class="activeTab === tab
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'">
                        {{ t(`myCluesBucksPage.tabs.${tab}`) }}
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/70 border-b border-slate-100">
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {{ t('myCluesBucksPage.table.date') }}
                            </th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {{ t('myCluesBucksPage.table.type') }}
                            </th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {{ t('myCluesBucksPage.table.description') }}
                            </th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                {{ t('myCluesBucksPage.table.points') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        <tr v-for="transaction in paginatedTransactions" :key="transaction._id" class="hover:bg-slate-50/30 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                                {{ formatDate(transaction.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full border"
                                    :class="transaction.type === 'earned'
                                        ? 'bg-green-50 text-green-700 border-green-100'
                                        : 'bg-amber-50 text-amber-700 border-amber-100'">
                                    {{ getTransactionTypeLabel(transaction.type) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-slate-700 font-semibold max-w-sm truncate">
                                {{ transaction.description }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right font-extrabold"
                                :class="transaction.type === 'earned' ? 'text-green-600' : 'text-[#ff934b]'">
                                {{ transaction.type === 'earned' ? '+' : '-' }}{{ Math.abs(transaction.points) }}
                            </td>
                        </tr>
                        <tr v-if="!filteredTransactions.length">
                            <td colspan="4" class="px-6 py-12 text-center text-slate-400 font-semibold bg-slate-50/20">
                                {{ t('myCluesBucksPage.noTransactions') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
                <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {{ t('common.page', 'Page') }} {{ currentPage }} / {{ totalPages }}
                </div>
                <div class="flex gap-2">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#ff934b] hover:text-[#ff934b] rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-500 active:scale-95">
                        {{ t('common.prev', 'Previous') }}
                    </button>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#ff934b] hover:text-[#ff934b] rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-500 active:scale-95">
                        {{ t('common.next', 'Next') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Redeem Confirmation Modal (styled Dialog) -->
        <Dialog :open="showRedeemModal" @update:open="showRedeemModal = $event">
            <DialogContent class="max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 bg-white overflow-hidden">
                <DialogHeader class="mb-4">
                    <DialogTitle class="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <Gift class="w-5 h-5 text-[#ff934b]" />
                        {{ t('myCluesBucksPage.confirmRedemptionTitle') }}
                    </DialogTitle>
                </DialogHeader>
                
                <div class="space-y-4 my-2">
                    <p class="text-sm text-slate-500 leading-relaxed">
                        {{ t('myCluesBucksPage.confirmRedeemText', { points: selectedOption?.points || 0 }) }}
                    </p>
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <p class="font-extrabold text-slate-800 text-sm">{{ selectedOption ? getOptionText(selectedOption).title : '' }}</p>
                        <p class="text-xs text-slate-500 font-semibold leading-relaxed">{{ selectedOption ? getOptionText(selectedOption).description : '' }}</p>
                    </div>
                </div>

                <DialogFooter class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                    <Button variant="outline" @click="showRedeemModal = false"
                        class="w-full sm:w-auto px-4 py-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all text-xs active:scale-95">
                        {{ t('myCluesBucksPage.cancel') }}
                    </Button>
                    <Button @click="confirmRedeem" :disabled="isLoading"
                        class="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-sm hover:shadow transition-all text-xs active:scale-95 disabled:opacity-50">
                        {{ isLoading ? t('myCluesBucksPage.processing') : t('myCluesBucksPage.confirm') }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useCluesBucksStore } from '../store/cluesBucksStore';
import { useProductStore } from '../store/productStore.js';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Coins, Award, Clock, Target, ShoppingBag,
    Star, Users, Gift, Ticket, CreditCard, Tag, Search
} from 'lucide-vue-next';

const { t, locale } = useI18n();
const store = useCluesBucksStore();
const productStore = useProductStore();

// Update the destructuring of storeToRefs
const { stats, sortedTransactions, isLoading, redemptionOptions, hasValidOfferAccess, activeSpecialOffers } = storeToRefs(store);
const { hasEnoughPoints } = store;

const showRedeemModal = ref(false);
const selectedOption = ref(null);

const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref('');
const activeTab = ref('all');

const filteredTransactions = computed(() => {
    return sortedTransactions.value.filter(transaction => {
        // Filter by Tab
        if (activeTab.value !== 'all' && transaction.type !== activeTab.value) {
            return false;
        }
        // Filter by Search Query
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            const descMatch = transaction.description?.toLowerCase().includes(query);
            const typeMatch = transaction.type?.toLowerCase().includes(query);
            const sourceMatch = transaction.source?.toLowerCase().includes(query);
            return descMatch || typeMatch || sourceMatch;
        }
        return true;
    });
});

const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredTransactions.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(filteredTransactions.value.length / itemsPerPage.value) || 1;
});

watch([activeTab, searchQuery, sortedTransactions], () => {
    currentPage.value = 1;
});

const getCategoryName = (category) => {
    if (!category || !category._id) return null;

    // Direct category name if available
    if (category.name) return category.name;

    // Look up in store if we only have ID
    if (productStore.categories) {
        const foundCategory = productStore.categories.find(cat => cat._id === category._id);
        if (foundCategory) return foundCategory.name;

        // Look through ancestors if available
        if (category.ancestors) {
            const ancestorCategory = productStore.categories.find(
                cat => category.ancestors.includes(cat._id)
            );
            if (ancestorCategory) return ancestorCategory.name;
        }
    }

    return null;
};

const getIconComponent = (type) => {
    const iconMap = {
        'coupon': Ticket,
        'credit': CreditCard,
        'offer': Tag
    };
    return iconMap[type] || Gift;
};

const getOptionText = (option) => {
    const optionMap = {
        coupon: {
            title: t('myCluesBucksPage.redemptionOptions.coupon.title'),
            description: t('myCluesBucksPage.redemptionOptions.coupon.description')
        },
        credit: {
            title: t('myCluesBucksPage.redemptionOptions.credit.title'),
            description: t('myCluesBucksPage.redemptionOptions.credit.description')
        },
        offer: {
            title: t('myCluesBucksPage.redemptionOptions.offer.title'),
            description: t('myCluesBucksPage.redemptionOptions.offer.description')
        }
    };

    return optionMap[option.type] || {
        title: option.title,
        description: option.description
    };
};

const getTransactionTypeLabel = (type) => {
    return type === 'earned'
        ? t('myCluesBucksPage.transactionTypes.earned')
        : t('myCluesBucksPage.transactionTypes.spent');
};

const formatDate = (date) => {
    const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-NG';
    return new Date(date).toLocaleDateString(activeLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatMoneyValue = (value) =>
    Number(value || 0).toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-NG', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

const handleRedeem = (option) => {
    selectedOption.value = option;
    showRedeemModal.value = true;
};

const confirmRedeem = async () => {
    if (!selectedOption.value) return;

    const success = await store.redeemPoints(selectedOption.value.id);
    if (success) {
        showRedeemModal.value = false;
        selectedOption.value = null;
    }
};

const getSpecialOfferTransactions = () => {
    return sortedTransactions.value.filter(t =>
        t.type === 'spent' &&
        t.metadata?.type === 'offer'
    );
};

const getSpecialOfferStats = () => {
    const transactions = getSpecialOfferTransactions();
    return {
        totalRedeemed: transactions.length,
        pointsUsed: transactions.reduce((sum, transaction) => sum + Math.abs(transaction.points || 0), 0),
        isActive: hasValidOfferAccess.value
    };
};

const getStoreCreditTransactions = () => {
    return sortedTransactions.value.filter(t =>
        t.type === 'spent' &&
        t.metadata?.type === 'credit'
    );
};

const getStoreCreditStats = () => {
    const transactions = getStoreCreditTransactions();
    const redemptionTransactions = transactions.filter(t => t.metadata?.action === 'redeemed');
    const usageTransactions = transactions.filter(t => t.metadata?.action === 'used');
    const lastTransaction = redemptionTransactions[0];
    return {
        totalRedeemed: redemptionTransactions.length,
        totalUsed: usageTransactions.length,
        pointsUsed: redemptionTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.points || 0), 0),
        amountUsed: usageTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.metadata?.amount || 0), 0),
        isActive: (stats.value.storeCreditBalance || 0) > 0,
        lastTransaction,
        lastRedeemedDate: lastTransaction ? formatDate(lastTransaction.createdAt) : null,
    };
};

const getCouponTransactions = () => {
    return sortedTransactions.value.filter(t =>
        t.type === 'spent' &&
        t.description.includes('discount coupon')
    );
};

const getLatestCoupon = () => {
    const transaction = getCouponTransactions()[0];
    if (!transaction) return null;

    // Extract coupon code from description (e.g., "Redeemed for ₦1000 discount coupon (CBM57JR76J)")
    const match = transaction.description.match(/\(([^)]+)\)/);
    return match ? {
        code: match[1],
        date: transaction.createdAt
    } : null;
};

onMounted(async () => {
    store.initialize();
    await productStore.fetchCategories();
});

onUnmounted(() => {
    store.resetState();
});
</script>

<!-- // frontend/src/views/admin/AdminOrders.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-3 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="min-w-0">
                    <h2 class="text-2xl font-bold text-gray-800">{{ t('adminOrders.title') }}</h2>
                </div>
                <!-- Time Period Toggle -->
                <div class="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div class="inline-flex min-w-full rounded-xl bg-gray-100 p-1 sm:min-w-0">
                        <button v-for="period in ['Today', 'Week', 'Month', 'Year']" :key="period"
                            @click="selectedPeriod = period" :class="[
                                'flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none',
                                selectedPeriod === period
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            ]">
                            {{ t(`adminOrders.periods.${period.toLowerCase()}`) }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-3">

            <!-- Total Revenue -->
            <div class="bg-white rounded-lg shadow px-4 py-4 sm:p-6">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-green-100 p-2.5 sm:p-3">
                        <DollarSign class="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                    </div>
                    <!-- <div class="ml-4">
                        <p class="text-gray-500 text-sm">Total Revenue</p>
                        <p class="text-2xl font-semibold">{{ totalRevenueFormatted }}</p>
                    </div> -->

                    <div class="min-w-0">
                        <p class="text-xs text-gray-500 sm:text-sm">
                            {{ filters.status ? t('adminOrders.summary.filteredRevenue', { status: formatStatus(filters.status) }) : t('adminOrders.summary.totalRevenue') }}
                        </p>
                        <p class="text-xl font-semibold text-gray-900 sm:text-2xl break-words">{{ totalRevenueFormatted }}</p>
                        <p v-if="hasMixedCurrencies" class="mt-1 text-xs text-amber-600">
                            {{ t('adminOrders.summary.mixedCurrencyNotice', { currencies: currenciesLabel }) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- timeline Revenue -->
            <div class="bg-white rounded-lg shadow px-4 py-4 sm:p-6">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-green-100 p-2.5 sm:p-3">
                        <DollarSign class="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs text-gray-500 sm:text-sm">{{ t('adminOrders.summary.periodRevenue', { period: t(`adminOrders.periods.${selectedPeriod.toLowerCase()}`) }) }}</p>
                        <p class="text-xl font-semibold text-gray-900 sm:text-2xl break-words">{{ filteredRevenue }}</p>
                        <p v-if="hasMixedCurrencies" class="mt-1 text-xs text-amber-600">
                            {{ t('adminOrders.summary.mixedCurrencyNotice', { currencies: currenciesLabel }) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Orders Today -->
            <div class="bg-white rounded-lg shadow px-4 py-4 sm:p-6">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-purple-100 p-2.5 sm:p-3">
                        <CalendarClock class="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs text-gray-500 sm:text-sm">{{ t('adminOrders.summary.ordersToday') }}</p>
                        <p class="text-xl font-semibold text-gray-900 sm:text-2xl">{{ todayOrders }}</p>
                    </div>
                </div>
            </div>

            <!-- Total Orders -->
            <div class="bg-white rounded-lg shadow px-4 py-4 sm:p-6">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-blue-100 p-2.5 sm:p-3">
                        <ShoppingCartIcon class="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>
                    <div class="min-w-0">
                        <!-- <p class="text-gray-500 text-sm">Total Orders</p> -->
                        <p class="text-xs text-gray-500 sm:text-sm">
                            {{ filters.status ? t('adminOrders.summary.filteredOrders', { status: formatStatus(filters.status) }) : t('adminOrders.summary.totalOrders') }}
                        </p>
                        <p class="text-xl font-semibold text-gray-900 sm:text-2xl">{{ orderSummary.total }}</p>
                    </div>
                </div>
            </div>

            <!-- timeline Orders -->
            <div class="bg-white rounded-lg shadow px-4 py-4 sm:p-6">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-blue-100 p-2.5 sm:p-3">
                        <ShoppingCartIcon class="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs text-gray-500 sm:text-sm">
                            {{ t('adminOrders.summary.periodOrders', { period: t(`adminOrders.periods.${selectedPeriod.toLowerCase()}`) }) }}
                        </p>
                        <p class="text-xl font-semibold text-gray-900 sm:text-2xl">{{ filteredOrders }}</p>
                    </div>
                </div>
            </div>

            <!-- Processing Orders -->
            <div class="bg-white rounded-lg shadow px-4 py-4 sm:p-6">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-blue-100 p-2.5 sm:p-3">
                        <Clock class="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs text-gray-500 sm:text-sm">{{ t('adminOrders.summary.processingToday') }}</p>
                        <p class="text-xl font-semibold text-gray-900 sm:text-2xl">{{ processingToday }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <!-- Payment Methods Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('adminOrders.charts.paymentMethodsDistribution') }}</h3>
                <div class="h-44">
                    <Doughnut v-if="paymentMethodChartData.labels.length" :data="paymentMethodChartData"
                        :options="chartOptions" />
                </div>
            </div>

            <!-- Platform Fee Summary -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t('adminOrders.charts.platformPerformance') }}</h3>
                <p v-if="hasMixedCurrencies" class="mb-4 text-xs text-amber-600">
                    {{ t('adminOrders.charts.mixedCurrencyNotice', { currencies: currenciesLabel }) }}
                </p>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">{{ t('adminOrders.charts.totalPlatformFees') }}</span>
                        <span class="font-semibold">{{ totalPlatformFeesFormatted }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">{{ t('adminOrders.charts.averageOrderValue') }}</span>
                        <span class="font-semibold">{{ totalAverageOrderValue }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">{{ t('adminOrders.charts.totalShippingFees') }}</span>
                        <span class="font-semibold">{{ totalShippingFees }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <!-- Search -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminOrders.filters.search') }}</label>
                    <input type="text" v-model="filters.search" :placeholder="t('adminOrders.filters.searchPlaceholder')"
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminOrders.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="applyFilters">
                            <option value="">{{ t('adminOrders.filters.allStatus') }}</option>
                            <option v-for="status in orderStatuses" :key="status" :value="status">
                                {{ formatStatus(status) }}
                            </option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminOrders.filters.currency') }}</label>
                    <div class="relative">
                        <select v-model="filters.currency"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="applyFilters">
                            <option value="">{{ t('adminOrders.filters.allCurrencies') }}</option>
                            <option value="NGN">NGN</option>
                            <option value="XOF">XOF</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Date Range -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminOrders.filters.fromDate') }}</label>
                    <Popover v-model:open="fromDateOpen">
                        <PopoverTrigger as-child>
                            <button
                                type="button"
                                class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                                :aria-label="t('adminOrders.filters.fromDate')"
                            >
                                <span :class="filters.dateFrom ? 'text-gray-900' : 'text-gray-400'">
                                    {{ formatDateFilterLabel(filters.dateFrom, 'adminOrders.filters.fromDate') }}
                                </span>
                                <CalendarDays class="h-4 w-4 text-gray-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" class="w-auto p-0">
                            <div class="border-b border-gray-100 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                {{ t('adminOrders.filters.fromDate') }}
                            </div>
                            <Calendar
                                :model-value="calendarFromValue"
                                :placeholder="calendarFromValue || calendarToValue || todayCalendarDate"
                                @update:modelValue="setFilterDate('from', $event)"
                            />
                            <div class="flex justify-end border-t border-gray-100 p-2">
                                <button
                                    type="button"
                                    class="text-xs font-medium text-gray-500 hover:text-gray-700"
                                    @click="clearFilterDate('from')"
                                >
                                    {{ t('adminOrders.filters.clearDate') }}
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('adminOrders.filters.toDate') }}</label>
                    <Popover v-model:open="toDateOpen">
                        <PopoverTrigger as-child>
                            <button
                                type="button"
                                class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                                :aria-label="t('adminOrders.filters.toDate')"
                            >
                                <span :class="filters.dateTo ? 'text-gray-900' : 'text-gray-400'">
                                    {{ formatDateFilterLabel(filters.dateTo, 'adminOrders.filters.toDate') }}
                                </span>
                                <CalendarDays class="h-4 w-4 text-gray-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" class="w-auto p-0">
                            <div class="border-b border-gray-100 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                {{ t('adminOrders.filters.toDate') }}
                            </div>
                            <Calendar
                                :model-value="calendarToValue"
                                :placeholder="calendarToValue || calendarFromValue || todayCalendarDate"
                                @update:modelValue="setFilterDate('to', $event)"
                            />
                            <div class="flex justify-end border-t border-gray-100 p-2">
                                <button
                                    type="button"
                                    class="text-xs font-medium text-gray-500 hover:text-gray-700"
                                    @click="clearFilterDate('to')"
                                >
                                    {{ t('adminOrders.filters.clearDate') }}
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    class="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    @click="clearFilters"
                >
                    {{ t('adminOrders.filters.clear') }}
                </button>
                <div
                    v-if="filters.dateFrom || filters.dateTo"
                    class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                >
                    <CalendarDays class="h-4 w-4" />
                    <span>{{ t('adminOrders.filters.dateHint') }}</span>
                    <button
                        type="button"
                        class="inline-flex items-center text-slate-500 hover:text-slate-700"
                        @click="clearDateRange"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="md:hidden divide-y divide-gray-200">
                <template v-if="loading">
                    <div class="px-6 py-10 text-center">
                        <div class="flex justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div
                        v-for="order in orders"
                        :key="`${order._id}-mobile`"
                        class="p-4 space-y-4"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <div class="text-sm font-semibold text-gray-900 break-words">
                                    #{{ order.orderId }}
                                </div>
                                <div class="mt-1 text-sm text-gray-900 break-words">
                                    {{ order.user?.username || t('adminOrders.unknown') }}
                                </div>
                                <div class="text-xs text-gray-500 break-all">
                                    {{ order.user?.email }}
                                </div>
                            </div>
                            <span :class="[
                                'inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap',
                                getStatusClass(order.status)
                            ]">
                                {{ formatStatus(order.status) }}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {{ t('adminOrders.table.paymentMethod') }}
                                </div>
                                <div class="mt-1 text-gray-900 break-words">
                                    {{ order.paymentMethod }}
                                </div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {{ t('adminOrders.table.total') }}
                                </div>
                                <div class="mt-1 font-medium text-gray-900">
                                    {{ formatCurrency(order.totalAmount, order.currency) }}
                                </div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {{ t('adminOrders.table.platformFee') }}
                                </div>
                                <div class="mt-1 text-gray-900">
                                    {{ formatCurrency(order.platformFee, order.currency) }}
                                </div>
                            </div>
                            <div>
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {{ t('adminOrders.table.vendorAmount') }}
                                </div>
                                <div class="mt-1 text-gray-900">
                                    {{ formatCurrency(order.vendorAmount, order.currency) }}
                                </div>
                            </div>
                            <div class="col-span-2">
                                <div class="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {{ t('adminOrders.table.date') }}
                                </div>
                                <div class="mt-1 text-gray-600 break-words">
                                    {{ formatDate(order.createdAt) }}
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                            <button
                                @click="viewOrderDetails(order)"
                                class="inline-flex items-center rounded-md bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100"
                            >
                                {{ t('adminOrders.actions.view') }}
                            </button>
                            <button
                                v-if="order.paymentSummary?.reference"
                                @click="goToPayment(order.paymentSummary.reference)"
                                class="inline-flex items-center rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                                {{ t('adminOrders.actions.viewPayment') }}
                            </button>
                            <button
                                v-if="order.payoutSummary?.transferReference || order.payoutSummary?.transactionReference || order.orderId"
                                @click="goToPayout(order)"
                                class="inline-flex items-center rounded-md bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100"
                            >
                                {{ t('adminOrders.actions.viewPayout') }}
                            </button>
                            <button
                                @click="showUpdateStatus(order)"
                                class="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                            >
                                {{ t('adminOrders.actions.update') }}
                            </button>
                        </div>
                    </div>
                </template>
            </div>

            <div class="hidden md:block max-h-[70vh] overflow-auto">
                <table class="min-w-[1240px] w-full divide-y divide-gray-200 table-fixed">
                    <thead class="sticky top-0 z-10 bg-gray-50 shadow-sm">
                        <tr>
                            <th scope="col" class="w-[16%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                                {{ t('adminOrders.table.orderId') }}</th>
                            <th scope="col" class="w-[18%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                                {{ t('adminOrders.table.customer') }}</th>
                            <th scope="col" class="w-[13%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminOrders.table.paymentMethod') }}</th>
                            <th scope="col" class="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminOrders.table.platformFee') }}</th>
                            <th scope="col" class="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminOrders.table.vendorAmount') }}</th>
                            <th scope="col" class="w-[14%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                                {{ t('adminOrders.table.date') }}</th>
                            <th scope="col" class="w-[9%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminOrders.table.total') }}
                            </th>
                            <th scope="col" class="w-[8%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {{ t('adminOrders.table.status') }}</th>
                            <th scope="col" class="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                                {{ t('adminOrders.table.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <template v-if="loading">
                            <tr>
                                <td colspan="9" class="px-6 py-4 text-center">
                                    <div class="flex justify-center">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="order in orders" :key="order._id">
                                <td class="px-6 py-4 align-top">
                                    <div class="text-sm font-medium text-gray-900 break-all">
                                        #{{ order.orderId }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-top">
                                    <div class="text-sm text-gray-900 break-words">
                                        {{ order.user?.username || t('adminOrders.unknown') }}
                                    </div>
                                    <div class="text-sm text-gray-500 break-all">
                                        {{ order.user?.email }}
                                    </div>
                                </td>


                                <td class="px-6 py-4 align-top text-sm text-gray-500 break-words">{{ order.paymentMethod }}
                                </td>
                                <td class="px-6 py-4 align-top whitespace-nowrap text-sm text-gray-900">{{
                                    formatCurrency(order.platformFee, order.currency) }}</td>
                                <td class="px-6 py-4 align-top whitespace-nowrap text-sm text-gray-900">{{
                                    formatCurrency(order.vendorAmount, order.currency) }}</td>


                                <td class="px-6 py-4 align-top text-sm text-gray-500">
                                    {{ formatDate(order.createdAt) }}
                                </td>
                                <td class="px-6 py-4 align-top whitespace-nowrap text-sm text-gray-900">
                                    {{ formatCurrency(order.totalAmount, order.currency) }}
                                </td>

                                <td class="px-6 py-4 align-top whitespace-nowrap">
                                    <span :class="[
                                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                        getStatusClass(order.status)
                                    ]">
                                        {{ formatStatus(order.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 align-top">
                                    <div class="flex flex-wrap gap-x-3 gap-y-2 text-sm font-medium">
                                    <button @click="viewOrderDetails(order)"
                                        class="text-blue-600 hover:text-blue-900">
                                        {{ t('adminOrders.actions.view') }}
                                    </button>
                                    <button v-if="order.paymentSummary?.reference"
                                        @click="goToPayment(order.paymentSummary.reference)"
                                        class="text-emerald-600 hover:text-emerald-900">
                                        {{ t('adminOrders.actions.viewPayment') }}
                                    </button>
                                    <button v-if="order.payoutSummary?.transferReference || order.payoutSummary?.transactionReference || order.orderId"
                                        @click="goToPayout(order)"
                                        class="text-violet-600 hover:text-violet-900">
                                        {{ t('adminOrders.actions.viewPayout') }}
                                    </button>
                                    <button @click="showUpdateStatus(order)"
                                        class="text-indigo-600 hover:text-indigo-900">
                                        {{ t('adminOrders.actions.update') }}
                                    </button>
                                    </div>
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
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                        {{ t('adminOrders.pagination.previous') }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                        {{ t('adminOrders.pagination.next') }}
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            {{ t('adminOrders.pagination.showing') }}
                            <span class="font-medium">{{ startItem }}</span>
                            {{ t('adminOrders.pagination.to') }}
                            <span class="font-medium">{{ endItem }}</span>
                            {{ t('adminOrders.pagination.of') }}
                            <span class="font-medium">{{ totalItems }}</span>
                            {{ t('adminOrders.pagination.results') }}
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                {{ t('adminOrders.pagination.previous') }}
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                                {{ t('adminOrders.pagination.next') }}
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <Dialog :open="showStatusModal" @update:open="showStatusModal = $event">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>{{ t('adminOrders.updateStatus.title') }}</DialogTitle>
                </DialogHeader>

                <form @submit.prevent="updateOrderStatus" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ t('adminOrders.updateStatus.newStatus') }}
                        </label>
                        <div class="relative">
                            <select v-model="newStatus"
                                class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                                <option v-for="status in availableStatuses" :key="status" :value="status">
                                    {{ formatStatus(status) }}
                                </option>
                            </select>
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown class="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ t('adminOrders.updateStatus.noteOptional') }}
                        </label>
                        <textarea v-model="statusNote" rows="3" class="w-full rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent" :placeholder="t('adminOrders.updateStatus.notePlaceholder')"></textarea>
                    </div>

                    <DialogFooter class="gap-3 sm:gap-0">
                        <button type="button" @click="closeStatusModal"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            {{ t('adminOrders.actions.cancel') }}
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            {{ t('adminOrders.updateStatus.submit') }}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        <OrderDetailsModal v-if="showDetailsModal" :order="selectedOrder" @close="showDetailsModal = false" />
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/store/admin';
import { useProductStore } from '@/store/productStore';
import { format as formatDateFns } from 'date-fns';
import { CalendarDate } from '@internationalized/date';
import OrderDetailsModal from './components/OrderDetailsModal.vue'
import {
    XIcon,
    ShoppingCartIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronDown,
    DollarSign,
    Clock,
    CheckCircle,
    CalendarClock,
    CalendarDays,
    X
} from 'lucide-vue-next';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';

// Register Chart.js components // Not sure if it is gonna be in here
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title
);

import { Doughnut } from 'vue-chartjs';
import { toast } from 'vue-sonner';
import { debounce } from 'lodash';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default {
    name: 'AdminOrders',
    components: {
        XIcon,
        ShoppingCartIcon,
        TruckIcon,
        CheckCircleIcon,
        XCircleIcon,
        ChevronDown,
        DollarSign,
        Clock,
        CheckCircle,
        Doughnut,
        OrderDetailsModal,
        CalendarClock,
        CalendarDays,
        X,
        Calendar,
        Popover,
        PopoverContent,
        PopoverTrigger,
        Dialog,
        DialogContent,
        DialogFooter,
        DialogHeader,
        DialogTitle,
    },

    setup() {
        const { t, locale } = useI18n();
        const router = useRouter();
        const route = useRoute();
        // State
        const adminStore = useAdminStore();
        const productStore = useProductStore();
        const orders = ref([]);
        const selectedOrder = ref(null);
        const loading = ref(false);
        const showStatusModal = ref(false);
        const newStatus = ref('');
        const statusNote = ref('');
        const showDetailsModal = ref(false)
        const totalOrdersCount = ref(0);
        const selectedPeriod = ref('Today');
        const fromDateOpen = ref(false);
        const toDateOpen = ref(false);

        // Pagination
        const currentPage = ref(1);
        const totalItems = ref(0);
        const itemsPerPage = ref(10);

        // Filters
        const filters = ref({
            search: '',
            status: '',
            currency: '',
            dateFrom: '',
            dateTo: ''
        });

        const todayCalendarDate = new CalendarDate(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate()
        );

        const orderSummary = ref({
            total: 0,
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        });


        // Constants
        const orderStatuses = [
            'Pending',    // Note the capital first letter to match schema
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
        ];

        // Computed
        const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
        const startItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1);
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));
        const activeCurrencies = computed(() => {
            const currencies = new Set(
                (orders.value || []).map((order) => (order?.currency === 'XOF' ? 'XOF' : 'NGN'))
            );
            return Array.from(currencies).sort();
        });
        const hasMixedCurrencies = computed(() => activeCurrencies.value.length > 1);
        const currenciesLabel = computed(() => activeCurrencies.value.join(', '));
        const createCalendarDate = (value) => {
            if (!value) return undefined;
            const [year, month, day] = value.split('-').map(Number);
            if (!year || !month || !day) return undefined;
            return new CalendarDate(year, month, day);
        };

        const calendarFromValue = computed(() => createCalendarDate(filters.value.dateFrom));
        const calendarToValue = computed(() => createCalendarDate(filters.value.dateTo));

        const availableStatuses = computed(() => {
            const currentStatus = selectedOrder.value?.status;
            switch (currentStatus) {
                case 'pending':
                    return ['processing', 'cancelled'];
                case 'processing':
                    return ['shipped', 'cancelled'];
                case 'shipped':
                    return ['delivered', 'returned'];
                case 'delivered':
                    return ['returned'];
                default:
                    return orderStatuses;
            }
        });

        // const totalRevenue = computed(() => {
        //     return orders.value?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
        // });

        const totalRevenue = computed(() => {
            if (filters.value.status) {
                // Show filtered revenue when status filter is active
                return orders.value?.reduce((sum, order) =>
                    order.status.toLowerCase() === filters.value.status.toLowerCase() ?
                        sum + order.totalAmount : sum, 0) || 0;
            }
            return orders.value?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
        });

        const totalRevenueFormatted = computed(() =>
            formatCurrencyTotals(sumAmountsByCurrency(orders.value, (order) => order.totalAmount))
        );


        const paymentMethodStats = computed(() => {
            const stats = orders.value?.reduce((acc, order) => {
                acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
                return acc;
            }, {});

            return Object.entries(stats || {}).map(([name, value]) => ({
                name,
                value
            }));
        });

        const totalPlatformFees = computed(() => {
            return orders.value?.reduce((sum, order) => sum + order.platformFee, 0) || 0;
        });

        const totalPlatformFeesFormatted = computed(() =>
            formatCurrencyTotals(sumAmountsByCurrency(orders.value, (order) => order.platformFee))
        );

        const averageOrderValue = computed(() => {
            if (!orders.value?.length) return 0;
            return totalRevenue.value / orders.value.length;
        });

        const totalAverageOrderValue = computed(() =>
            formatAverageByCurrency(orders.value, (order) => order.totalAmount)
        );

        const shippingFees = computed(() => {
            return orders.value?.reduce((sum, order) => sum + order.shippingFee, 0) || 0;
        });

        const totalShippingFees = computed(() =>
            formatCurrencyTotals(sumAmountsByCurrency(orders.value, (order) => order.shippingFee || 0))
        );

        const todayOrders = computed(() => {
            const today = new Date().toISOString().split('T')[0];
            return orders.value.filter(order =>
                order.createdAt.split('T')[0] === today
            ).length;
        });

        // const processingToday = computed(() => {
        //     const today = new Date().toISOString().split('T')[0];
        //     return orders.value.filter(order =>
        //         order.createdAt.split('T')[0] === today &&
        //         order.status === 'Processing'
        //     ).length;
        // });

        const processingToday = computed(() => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            return orders.value.filter(order => {
                // Parse the order date
                const orderDate = new Date(order.createdAt);
                const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());

                // Compare dates and check status with proper capitalization
                return orderDay.getTime() === today.getTime() &&
                    order.status === 'Processing';
            }).length;
        });

        const paymentMethodChartData = computed(() => {
            const stats = orders.value?.reduce((acc, order) => {
                acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
                return acc;
            }, {});

            const labels = Object.keys(stats || {});
            const data = Object.values(stats || {});

            return {
                labels,
                datasets: [{
                    data,
                    backgroundColor: [
                        '#3b82f6', // blue
                        '#10b981', // green
                        '#f59e0b', // yellow
                        '#8b5cf6', // purple
                        '#ef4444'  // red
                    ],
                    borderWidth: 1
                }]
            };
        });

        const getDateRange = () => {
            const now = new Date();
            const startDate = new Date();

            switch (selectedPeriod.value) {
                case 'Week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'Month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'Year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    startDate.setHours(0, 0, 0, 0);
            }
            return { startDate, endDate: now };
        };

        const filteredOrders = computed(() => {
            const { startDate } = getDateRange();
            return orders.value.filter(order => new Date(order.createdAt) >= startDate).length;
        });

        const filteredRevenue = computed(() => {
            const { startDate } = getDateRange();
            const filtered = orders.value
                .filter(order => new Date(order.createdAt) >= startDate)
            return formatCurrencyTotals(sumAmountsByCurrency(filtered, (order) => order.totalAmount));
        });

        // const viewOrderDetails = async (order) => {
        //     try {
        //         selectedOrder.value = order
        //         showDetailsModal.value = true
        //     } catch (error) {
        //         console.error('Error showing order details:', error)
        //         toast.error('Failed to show order details')
        //     }
        // }

        const viewOrderDetails = async (order) => {
            try {
                loading.value = true;

                // Load full product details for each product in the order
                const productsWithDetails = await Promise.all(
                    order.products.map(async (item) => {
                        // Get the product ID correctly - it might be either a string or an object
                        const productId = typeof item.product === 'string' ?
                            item.product :
                            item.product?._id;

                        if (productId) {
                            try {
                                const details = await productStore.fetchProductById(productId);
                                return {
                                    ...item,
                                    product: details || {
                                        name: t('adminOrders.productNotFound'),
                                        images: []
                                    }
                                };
                            } catch (error) {
                                console.error(`Error fetching product ${productId}:`, error);
                                return {
                                    ...item,
                                    product: {
                                        name: t('adminOrders.productNotFound'),
                                        images: []
                                    }
                                };
                            }
                        }
                        return item;
                    })
                );

                // Transform the order data with loaded product details
                selectedOrder.value = {
                    ...order,
                    products: productsWithDetails
                };

                showDetailsModal.value = true;
            } catch (error) {
                console.error('Error showing order details:', error);
                toast.error(t('adminOrders.toasts.loadDetailsFailed'));
            } finally {
                loading.value = false;
            }
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#4b5563',
                    bodyColor: '#111827',
                    titleFont: {
                        size: 14,
                        weight: 'normal'
                    },
                    bodyFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: 12,
                    cornerRadius: 6,
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        };

        // Helper function to format numbers with commas
        const formatCurrency = (amount, currency = 'NGN') => {
            const resolvedCurrency = currency === 'XOF' ? 'XOF' : 'NGN';
            return new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: resolvedCurrency,
                minimumFractionDigits: 2
            }).format(amount);
        };

        const sumAmountsByCurrency = (list, selector) => {
            return (list || []).reduce((acc, item) => {
                const currency = item?.currency === 'XOF' ? 'XOF' : 'NGN';
                const amount = Number(selector(item) || 0);
                acc[currency] = (acc[currency] || 0) + amount;
                return acc;
            }, {});
        };

        const formatCurrencyTotals = (totals) => {
            const entries = Object.entries(totals || {}).filter(([, amount]) => Math.abs(amount) > 0.0001);
            if (!entries.length) {
                return formatCurrency(0, 'NGN');
            }

            return entries
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([currency, amount]) => formatCurrency(amount, currency))
                .join(' / ');
        };

        const formatAverageByCurrency = (list, selector) => {
            const stats = (list || []).reduce((acc, item) => {
                const currency = item?.currency === 'XOF' ? 'XOF' : 'NGN';
                const amount = Number(selector(item) || 0);
                if (!acc[currency]) {
                    acc[currency] = { total: 0, count: 0 };
                }
                acc[currency].total += amount;
                acc[currency].count += 1;
                return acc;
            }, {});

            const entries = Object.entries(stats).filter(([, value]) => value.count > 0);
            if (!entries.length) {
                return formatCurrency(0, 'NGN');
            }

            return entries
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([currency, value]) => formatCurrency(value.total / value.count, currency))
                .join(' / ');
        };

        const fetchOrders = async () => {
            loading.value = true;
            try {
                const result = await adminStore.fetchOrders({
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    status: filters.value.status,
                    currency: filters.value.currency,
                    search: filters.value.search,
                    dateFrom: filters.value.dateFrom,
                    dateTo: filters.value.dateTo
                });

                if (result.orders) {
                    // Update order summary with totals from API
                    orderSummary.value = {
                        total: result.pagination.total,
                        pending: filters.value.status.toLowerCase() === 'pending' ? result.pagination.total : 0,
                        processing: filters.value.status.toLowerCase() === 'processing' ? result.pagination.total : 0,
                        shipped: filters.value.status.toLowerCase() === 'shipped' ? result.pagination.total : 0,
                        delivered: filters.value.status.toLowerCase() === 'delivered' ? result.pagination.total : 0,
                        cancelled: filters.value.status.toLowerCase() === 'cancelled' ? result.pagination.total : 0
                    };

                    orders.value = result.orders;
                    totalItems.value = result.pagination.total;
                }
            } catch (error) {
                console.error('Error in fetchOrders:', error);
                toast.error(t('adminOrders.toasts.fetchFailed'));
            } finally {
                loading.value = false;
            }
        };

        const handleSearch = debounce(() => {
            currentPage.value = 1;
            fetchOrders();
        }, 300);

        const applyFilters = () => {
            currentPage.value = 1;
            fetchOrders();
        };

        const showUpdateStatus = (order) => {
            selectedOrder.value = order;
            newStatus.value = order.status;
            showStatusModal.value = true;
        };

        const goToPayment = (reference) => {
            if (!reference) return;
            router.push({
                name: 'AdminPayments',
                query: {
                    search: reference,
                },
            });
        };

        const goToPayout = (order) => {
            const searchValue =
                order?.payoutSummary?.transferReference ||
                order?.payoutSummary?.transactionReference ||
                order?.orderId ||
                '';
            if (!searchValue) return;
            router.push({
                name: 'AdminPayouts',
                query: {
                    search: searchValue,
                },
            });
        };

        // In AdminOrders.vue
        const updateOrderStatus = async () => {
            try {
                await adminStore.updateOrderStatus(selectedOrder.value._id, {
                    status: newStatus.value,
                    note: statusNote.value
                });
                closeStatusModal();
                fetchOrders();
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        };

        // const closeStatusModal = () => {
        //     showStatusModal.value = false;
        //     newStatus.value = '';
        //     statusNote.value = '';
        //     selectedOrder.value = null;
        // };

        const closeStatusModal = () => {
            showStatusModal.value = false
            showDetailsModal.value = false
            selectedOrder.value = null
            newStatus.value = ''
            statusNote.value = ''
        }

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchOrders();
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                fetchOrders();
            }
        };

        const formatDateFilterLabel = (value, fallbackKey) => {
            if (!value) return t(fallbackKey);
            try {
                return formatDateFns(new Date(`${value}T00:00:00`), 'MMM d, yyyy');
            } catch (_) {
                return value;
            }
        };

        const setFilterDate = (field, value) => {
            filters.value[field === 'from' ? 'dateFrom' : 'dateTo'] = value?.toString?.() || '';
            if (field === 'from') {
                fromDateOpen.value = false;
            } else {
                toDateOpen.value = false;
            }
            applyFilters();
        };

        const clearFilterDate = (field) => {
            filters.value[field === 'from' ? 'dateFrom' : 'dateTo'] = '';
            if (field === 'from') {
                fromDateOpen.value = false;
            } else {
                toDateOpen.value = false;
            }
            applyFilters();
        };

        const clearDateRange = () => {
            filters.value.dateFrom = '';
            filters.value.dateTo = '';
            fromDateOpen.value = false;
            toDateOpen.value = false;
            applyFilters();
        };

        const clearFilters = () => {
            filters.value = {
                search: '',
                status: '',
                currency: '',
                dateFrom: '',
                dateTo: ''
            };
            currentPage.value = 1;
            fetchOrders();
        };

        // Helper functions
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const formatStatus = (status) => {
            return t(`adminOrders.statuses.${status?.toLowerCase?.()}`, status);
        };

        const getStatusClass = (status) => {
            const classes = {
                Pending: 'bg-yellow-100 text-yellow-800',
                Processing: 'bg-blue-100 text-blue-800',
                Shipped: 'bg-purple-100 text-purple-800',
                Delivered: 'bg-green-100 text-green-800',
                Cancelled: 'bg-red-100 text-red-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        };

        const getTimelineIcon = (type) => {
            const icons = {
                'order_placed': ShoppingCartIcon,
                'processing': TruckIcon,
                'completed': CheckCircleIcon,
                'cancelled': XCircleIcon
            };
            return icons[type] || CheckCircleIcon;
        };

        const getTimelineItemClass = (type) => {
            const classes = {
                'order_placed': 'bg-blue-500',
                'processing': 'bg-yellow-500',
                'completed': 'bg-green-500',
                'cancelled': 'bg-red-500'
            };
            return classes[type] || 'bg-gray-500';
        };

        // Lifecycle hooks
        onMounted(() => {
            if (typeof route.query.search === 'string') {
                filters.value.search = route.query.search;
            }
            if (typeof route.query.status === 'string') {
                filters.value.status = route.query.status;
            }
            if (typeof route.query.currency === 'string') {
                filters.value.currency = route.query.currency;
            }
            fetchOrders();
        });

        return {
            orders,
            selectedOrder,
            loading,
            showStatusModal,
            newStatus,
            statusNote,
            currentPage,
            totalItems,
            totalPages,
            startItem,
            endItem,
            activeCurrencies,
            hasMixedCurrencies,
            currenciesLabel,
            orderSummary,
            formatCurrency,
            totalRevenueFormatted,
            paymentMethodStats,
            totalPlatformFeesFormatted,
            totalAverageOrderValue,
            totalShippingFees,
            todayOrders,
            processingToday,
            filters,
            fromDateOpen,
            toDateOpen,
            todayCalendarDate,
            calendarFromValue,
            calendarToValue,
            orderStatuses,
            availableStatuses,
            handleSearch,
            applyFilters,
            viewOrderDetails,
            goToPayment,
            goToPayout,
            showUpdateStatus,
            updateOrderStatus,
            closeStatusModal,
            prevPage,
            nextPage,
            formatDate,
            formatDateFilterLabel,
            formatStatus,
            getStatusClass,
            getTimelineIcon,
            getTimelineItemClass,
            fetchOrders,
            setFilterDate,
            clearFilterDate,
            clearDateRange,
            clearFilters,
            paymentMethodChartData,
            chartOptions,
            showDetailsModal,
            selectedPeriod,
            filteredOrders,
            filteredRevenue,
            t
        };
    }
};
</script>

<style scoped>
.timeline-line {
    @apply absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200;
}
</style>

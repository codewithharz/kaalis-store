// frontend/src/views/admin/AdminProducts.vue
<template>
    <div>
        <!-- Header & Actions -->
        <div class="flex flex-col gap-4 mb-3 px-8 py-4 rounded-b-lg bg-white lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ t('adminProducts.title') }}</h2>
                <p class="text-sm text-gray-500">Manage, edit, verify status, and control inventory levels of products on the platform.</p>
            </div>
            <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#24a3b5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1d8b9a]"
                    @click="goToCreateProduct"
                >
                    <span>{{ t('adminProducts.addNewProduct') }}</span>
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="mb-4 rounded-xl bg-white p-5 border border-slate-100 shadow-sm">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
                <!-- Search -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminProducts.filters.search') }}</label>
                    <input type="text" v-model="filters.search" :placeholder="t('adminProducts.filters.searchPlaceholder')"
                        class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10" @input="handleSearch">
                </div>

                <!-- Category Filter -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminProducts.filters.category') }}</label>
                    <div class="relative">
                        <select v-model="filters.category"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="applyFilters">
                            <option value="">{{ t('adminProducts.filters.allCategories') }}</option>
                            <option v-for="category in categories" :key="category._id" :value="category._id">
                                {{ category.name }}
                            </option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Stock Filter -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminProducts.filters.stockStatus') }}</label>
                    <div class="relative">
                        <select v-model="filters.stock"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="applyFilters">
                            <option value="">{{ t('adminProducts.filters.all') }}</option>
                            <option value="in_stock">{{ t('adminProducts.stockStatuses.inStock') }}</option>
                            <option value="low_stock">{{ t('adminProducts.stockStatuses.lowStock') }}</option>
                            <option value="out_of_stock">{{ t('adminProducts.stockStatuses.outOfStock') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Seller Filter -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminProducts.filters.seller') }}</label>
                    <div class="relative">
                        <select v-model="filters.seller"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="applyFilters">
                            <option value="">{{ t('adminProducts.filters.allSellers') }}</option>
                            <option v-for="seller in sellers" :key="seller._id" :value="seller._id">
                                {{ seller.storeName }}
                            </option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminProducts.filters.status') }}</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm text-slate-700 transition focus:border-[#24a3b5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                            @change="applyFilters">
                            <option value="">{{ t('adminProducts.filters.all') }}</option>
                            <option value="active">{{ t('adminProducts.statuses.active') }}</option>
                            <option value="inactive">{{ t('adminProducts.statuses.inactive') }}</option>
                        </select>
                        <div class="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <!-- Created Date Range -->
                <div class="sm:col-span-2 xl:col-span-1">
                    <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{{ t('adminProducts.filters.createdDate') }}</label>
                    <div class="grid grid-cols-1 gap-2">
                        <Popover v-model:open="fromDateOpen">
                            <PopoverTrigger as-child>
                                <button
                                    type="button"
                                    class="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                                    :aria-label="t('adminProducts.filters.createdFrom')"
                                >
                                    <span :class="filters.createdFrom ? 'text-slate-900' : 'text-slate-400'">
                                        {{ formatDateFilterLabel(filters.createdFrom, 'adminProducts.filters.createdFrom') }}
                                    </span>
                                    <CalendarDays class="h-4 w-4 text-slate-400" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" class="w-auto p-0">
                                <div class="border-b border-slate-100 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    {{ t('adminProducts.filters.createdFrom') }}
                                </div>
                                <Calendar
                                    :model-value="calendarFromValue"
                                    :placeholder="calendarFromValue || calendarToValue || todayCalendarDate"
                                    @update:modelValue="setCreatedDate('from', $event)"
                                />
                                <div class="flex justify-end border-t border-slate-100 p-2">
                                    <button
                                        type="button"
                                        class="text-xs font-medium text-slate-500 hover:text-slate-700"
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
                                    class="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#24a3b5]/10"
                                    :aria-label="t('adminProducts.filters.createdTo')"
                                >
                                    <span :class="filters.createdTo ? 'text-slate-900' : 'text-slate-400'">
                                        {{ formatDateFilterLabel(filters.createdTo, 'adminProducts.filters.createdTo') }}
                                    </span>
                                    <CalendarDays class="h-4 w-4 text-slate-400" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" class="w-auto p-0">
                                <div class="border-b border-slate-100 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    {{ t('adminProducts.filters.createdTo') }}
                                </div>
                                <Calendar
                                    :model-value="calendarToValue"
                                    :placeholder="calendarToValue || calendarFromValue || todayCalendarDate"
                                    @update:modelValue="setCreatedDate('to', $event)"
                                />
                                <div class="flex justify-end border-t border-slate-100 p-2">
                                    <button
                                        type="button"
                                        class="text-xs font-medium text-slate-500 hover:text-slate-700"
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
                    class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
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
        <div class="overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm">
            <div class="md:hidden divide-y divide-gray-200">
                <div
                    v-for="product in products"
                    :key="`${product._id}-mobile`"
                    class="p-4 space-y-4"
                >
                    <div class="flex items-start gap-3">
                        <div class="h-14 w-14 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden border border-slate-200">
                            <img
                                v-if="product.images?.length"
                                :src="product.images[0]"
                                :alt="product.name"
                                class="h-full w-full object-cover"
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="text-sm font-semibold text-slate-800 break-words">
                                {{ product.name }}
                            </div>
                            <div class="text-xs text-slate-400 mt-0.5 break-all">
                                {{ t('adminProducts.sku', { value: getProductSku(product) }) }}
                            </div>
                            <div class="mt-2 text-sm font-bold text-slate-900 font-mono">
                                {{ formatPrice(product.price, product.seller?.user?.currency || product.user?.currency) }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div class="min-w-0">
                            <div class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                {{ t('adminProducts.table.seller') }}
                            </div>
                            <div class="mt-1 text-slate-800 break-words font-semibold">
                                {{ product.seller?.storeName || product.user?.username || t('adminProducts.form.unknownSeller') }}
                            </div>
                            <div class="text-xs text-slate-400 mt-0.5 break-all">
                                {{ product.user?.email || t('adminProducts.table.noEmail') }}
                            </div>
                        </div>
                        <div class="min-w-0">
                            <div class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                {{ t('adminProducts.table.category') }}
                            </div>
                            <div class="mt-1 text-slate-800 break-words font-semibold">
                                {{ product.category?.name || t('adminProducts.uncategorized') }}
                            </div>
                        </div>
                        <div>
                            <div class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                {{ t('adminProducts.table.stock') }}
                            </div>
                            <span :class="getStockStatusClass(product.stock)"
                                class="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm border">
                                <component :is="getStockStatusIcon(product.stock)" class="h-3 w-3" />
                                <span>{{ t('adminProducts.stockCount', { count: product.stock }) }}</span>
                            </span>
                        </div>
                        <div>
                            <div class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                {{ t('adminProducts.table.status') }}
                            </div>
                            <span :class="product.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-rose-50 text-rose-700 border-rose-200/50'"
                                class="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm border">
                                <component :is="product.status === 'active' ? CheckCircle2 : XCircle" class="h-3 w-3" />
                                <span>{{ t(`adminProducts.statuses.${product.status}`) }}</span>
                            </span>
                        </div>
                        <div class="col-span-2">
                            <div class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                {{ t('adminProducts.table.created') }}
                            </div>
                            <div class="mt-1 text-slate-600">
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

            <div class="hidden md:block overflow-auto">
                <table class="min-w-[1100px] w-full divide-y divide-slate-100 table-fixed">
                    <thead class="sticky top-0 z-10 bg-slate-50 shadow-sm border-b border-slate-100">
                        <tr>
                            <th class="w-[26%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.product') }}
                            </th>
                            <th class="w-[20%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.seller') }}
                            </th>
                            <th class="w-[14%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.category') }}
                            </th>
                            <th class="w-[10%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.price') }}
                            </th>
                            <th class="w-[10%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.stock') }}
                            </th>
                            <th class="w-[8%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.status') }}
                            </th>
                            <th class="w-[12%] px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {{ t('adminProducts.table.created') }}
                            </th>
                            <th class="w-[10%] px-6 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">
                                {{ t('adminProducts.table.actions') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-100">
                        <tr v-for="product in products" :key="product._id" class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4 align-middle whitespace-nowrap">
                                <div class="flex items-center min-w-0">
                                    <div class="h-10 w-10 rounded-lg bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden flex items-center justify-center">
                                        <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name"
                                            class="h-full w-full object-cover">
                                        <Store v-else class="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div class="ml-4 min-w-0">
                                        <p class="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[200px]" :title="product.name">
                                            {{ product.name }}
                                        </p>
                                        <p class="text-xs text-slate-400 mt-0.5 leading-none">
                                            {{ t('adminProducts.sku', { value: getProductSku(product) }) }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 align-middle whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <Store class="h-4 w-4 text-slate-400 flex-shrink-0" />
                                    <div>
                                        <p class="text-sm font-semibold text-slate-800 leading-tight">
                                            {{ product.seller?.storeName || product.user?.username || t('adminProducts.form.unknownSeller') }}
                                        </p>
                                        <p class="text-xs text-slate-400 mt-0.5 leading-none break-all">
                                            {{ product.user?.email || t('adminProducts.table.noEmail') }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 align-middle whitespace-nowrap">
                                <span class="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 border border-slate-200/50 rounded-lg px-2.5 py-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#24a3b5]"></span>
                                    {{ product.category?.name || t('adminProducts.uncategorized') }}
                                </span>
                            </td>
                            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm font-bold text-slate-900 font-mono">
                                {{ formatPrice(product.price, product.seller?.user?.currency || product.user?.currency) }}
                            </td>
                            <td class="px-6 py-4 align-middle whitespace-nowrap">
                                <span :class="getStockStatusClass(product.stock)"
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm border">
                                    <component :is="getStockStatusIcon(product.stock)" class="h-3.5 w-3.5" />
                                    <span>{{ t('adminProducts.stockCount', { count: product.stock }) }}</span>
                                </span>
                            </td>
                            <td class="px-6 py-4 align-middle whitespace-nowrap">
                                <span :class="product.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-rose-50 text-rose-700 border-rose-200/50'"
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm border">
                                    <component :is="product.status === 'active' ? CheckCircle2 : XCircle" class="h-3.5 w-3.5" />
                                    <span>{{ t(`adminProducts.statuses.${product.status}`) }}</span>
                                </span>
                            </td>
                            <td class="px-6 py-4 align-middle whitespace-nowrap">
                                <div class="flex items-center gap-1.5 text-slate-600">
                                    <CalendarIcon class="h-3.5 w-3.5 text-slate-400" />
                                    <span class="text-xs">{{ formatDate(product.createdAt) }}</span>
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
                                        
                                        <DropdownMenuItem @click="viewProduct(product)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700 hover:bg-slate-50">
                                            <ExternalLink class="h-4 w-4 text-slate-400" />
                                            <span>{{ t('adminProducts.actions.view') }}</span>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem @click="goToEditProduct(product)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700 hover:bg-slate-50">
                                            <Edit3 class="h-4 w-4 text-slate-400" />
                                            <span>{{ t('adminProducts.actions.edit') }}</span>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuSeparator />
                                        
                                        <DropdownMenuItem @click="confirmDelete(product)" class="flex items-center gap-2 cursor-pointer py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium">
                                            <Trash2 class="h-4 w-4 text-rose-400" />
                                            <span>{{ t('adminProducts.actions.delete') }}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
import { 
    ChevronDown, 
    CalendarDays, 
    X,
    MoreHorizontal,
    ExternalLink,
    Loader2,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Store,
    Calendar as CalendarIcon,
    Edit3,
    Trash2
} from 'lucide-vue-next';
import { debounce } from 'lodash';
import { CalendarDate } from '@internationalized/date';
import apiClient from '../../api/axios';
import { formatCurrencyAmount } from '../../utils/countryCurrency';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export default {
    name: 'AdminProducts',

    components: {
        ChevronDown,
        CalendarDays,
        X,
        Calendar,
        Popover,
        PopoverContent,
        PopoverTrigger,
        MoreHorizontal,
        ExternalLink,
        Loader2,
        CheckCircle2,
        AlertCircle,
        XCircle,
        Store,
        CalendarIcon,
        Edit3,
        Trash2,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
        DropdownMenuSeparator,
        DropdownMenuLabel,
    },

    setup() {
        const { t, locale } = useI18n();
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
            if (stock === 0) return 'bg-rose-50 text-rose-700 border border-rose-200/50';
            if (stock < 10) return 'bg-amber-50 text-amber-700 border border-amber-200/50';
            return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
        };

        const getStockStatusIcon = (stock) => {
            if (stock === 0) return XCircle;
            if (stock < 10) return AlertCircle;
            return CheckCircle2;
        };

        const formatPrice = (price, currency) => formatCurrencyAmount(price, currency || 'NGN');
        const formatDate = (value) => {
            if (!value) return '—';
            try {
                return new Date(value).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (_) {
                return '—';
            }
        };

        const getProductSku = (product) => {
            if (product.sku && product.sku !== 'N/A') return product.sku;
            if (product.variants && product.variants.length > 0) {
                const variantWithSku = product.variants.find(v => v.sku);
                if (variantWithSku) return variantWithSku.sku;
            }
            return product.sku || 'N/A';
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
            getProductSku,
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
            getStockStatusIcon,
            fetchProducts,
            t,
            locale
        };
    }
};

</script>

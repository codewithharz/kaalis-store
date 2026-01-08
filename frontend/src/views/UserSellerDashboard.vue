<template>
    <div>
        <!-- Enhanced Loading State -->
        <div v-if="isLoading"
            class="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div class="text-center px-4">
                <div class="relative">
                    <div
                        class="animate-spin h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4">
                    </div>
                    <div
                        class="absolute inset-0 animate-ping h-12 w-12 sm:h-16 sm:w-16 border-2 border-blue-300 rounded-full opacity-75">
                    </div>
                </div>
                <p class="text-lg sm:text-xl font-medium text-gray-700">Loading Dashboard...</p>
                <p class="text-xs sm:text-sm text-gray-500 mt-2">Please wait while we prepare your seller dashboard</p>
            </div>
        </div>

        <!-- Non-Seller State with Modern Design -->
        <div v-else-if="!isSeller" class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 sm:py-12">
            <div class="max-w-4xl mx-auto px-4">
                <UserProfileCard :user="user" :address="address" />
                <div
                    class="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-8 py-4 sm:py-6">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div
                                class="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                <UserRound class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div class="text-white min-w-0">
                                <h3 class="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Become a Seller</h3>
                                <p class="text-indigo-100 text-sm sm:text-base">Start your journey as a seller on our
                                    platform</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 sm:p-8 text-center">
                        <p class="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">You are not a seller yet. Join
                            thousands of successful
                            sellers and start earning today!</p>
                        <button @click="navigateToBecomeSeller"
                            class="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                            <UserRound class="w-4 h-4 sm:w-5 sm:h-5" />
                            Become a Seller
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modern Seller Dashboard -->
        <div v-else class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div class="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <!-- Enhanced Header Section -->
                <header
                    class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-4 sm:mb-5">
                    <div class="relative bg-cover bg-center p-4 sm:p-6 lg:p-8"
                        :style="{ background: sellerProfile.backgroundImage || getDefaultBackground(user.value?._id) }">
                        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                        <div class="relative">
                            <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
                                <!-- Profile Section -->
                                <div class="flex items-center gap-3 sm:gap-6 text-white flex-1 min-w-0">
                                    <div class="relative flex-shrink-0">
                                        <img :src="randomAvatarUrl" alt="Seller Avatar"
                                            class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-4 border-white/30 shadow-lg">
                                        <div
                                            class="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center">
                                            <div class="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <h1 class="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate">Seller
                                            Dashboard</h1>
                                        <p class="text-white/90 text-base sm:text-lg truncate">Welcome back, {{
                                            sellerName }}</p>
                                        <div class="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
                                            <span
                                                class="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                                                {{ sellerProfile.isVacationMode ? '🏖️ On Vacation' : '🟢 Active' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                                    <button @click="showEditProfileModal = true"
                                        class="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 transform hover:scale-105 border border-white/30 text-sm sm:text-base justify-center">
                                        <Settings class="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    <button @click="toggleVacationMode" :class="{
                                        'bg-yellow-500/80 hover:bg-yellow-600/80 border-yellow-400/50': sellerProfile.isVacationMode,
                                        'bg-green-500/80 hover:bg-green-600/80 border-green-400/50': !sellerProfile.isVacationMode
                                    }"
                                        class="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 border text-sm sm:text-base justify-center">
                                        {{ sellerProfile.isVacationMode ? '🏖️ End Vacation' : '🌴 Start Vacation' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Enhanced Quick Stats -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <div v-for="stat in quickStats" :key="stat.label"
                        class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        :class="{ 'col-span-2': stat.label === 'Total Sales' }">
                        <div class="flex items-start gap-2 sm:gap-4">
                            <div class="flex-shrink-0">
                                <div
                                    :class="`bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 p-2 sm:p-4 rounded-lg sm:rounded-2xl shadow-lg`">
                                    <component :is="stat.icon" class="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">{{ stat.label }}</p>
                                <p class="text-lg sm:text-2xl font-bold text-gray-900 break-words">{{ stat.value }}</p>
                                <p v-if="stat.label === 'Total Sales'"
                                    class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed hidden sm:block">
                                    {{ stat.valueInWords }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Revenue Overview Card -->
                    <div
                        class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div class="flex items-start gap-2 sm:gap-4">
                            <div class="flex-shrink-0">
                                <div
                                    class="bg-gradient-to-br from-blue-400 to-blue-600 p-2 sm:p-4 rounded-lg sm:rounded-2xl shadow-lg">
                                    <TrendingUp class="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Revenue Growth</p>
                                <p class="text-lg sm:text-2xl font-bold text-gray-900 break-words">
                                    {{ revenueOverview.growth }}%
                                    <span v-if="revenueOverview.growth == 0"
                                        class="text-xs font-normal text-gray-500 hidden sm:inline">(No change)</span>
                                </p>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{{
                                    revenueOverview.comparisonPeriod }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Top Selling Products Card -->
                    <div
                        class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div class="flex items-start gap-2 sm:gap-4">
                            <div class="flex-shrink-0">
                                <div
                                    class="bg-gradient-to-br from-orange-400 to-orange-600 p-2 sm:p-4 rounded-lg sm:rounded-2xl shadow-lg">
                                    <Award class="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Top Selling Product</p>
                                <p class="text-sm sm:text-lg font-bold text-gray-900 break-words"
                                    :title="topSellingProduct.name">
                                    {{ topSellingProduct.truncatedName }}{{ topSellingProduct.name.length > 20 ? '...' :
                                        '' }}
                                </p>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                    {{ topSellingProduct.quantity > 0 ? `${topSellingProduct.quantity} units sold` : `No
                                    units sold yet` }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Pending Orders Card -->
                    <div
                        class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div class="flex items-start gap-2 sm:gap-4">
                            <div class="flex-shrink-0">
                                <div
                                    class="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 sm:p-4 rounded-lg sm:rounded-2xl shadow-lg">
                                    <Clock class="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pending Orders</p>
                                <p class="text-lg sm:text-2xl font-bold text-gray-900 break-words">{{ pendingOrders }}
                                </p>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Awaiting processing</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Main Content -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                    <!-- Enhanced Recent Orders Section -->
                    <div
                        class="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-6 border-b border-gray-200">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <ShoppingBag class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div>
                                    <h2 class="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h2>
                                    <p class="text-xs sm:text-sm text-gray-600">{{ recentOrders.length }} orders found
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="p-3 sm:p-6">
                            <div v-if="recentOrders.length > 0" class="space-y-3 sm:space-y-4">
                                <div v-for="order in paginatedOrders" :key="order.id"
                                    class="p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-300 hover:border-blue-300 bg-gradient-to-r from-white to-gray-50">

                                    <!-- Order Header -->
                                    <div class="flex justify-between items-center mb-3 sm:mb-4">
                                        <div class="flex items-center gap-2 sm:gap-3">
                                            <div
                                                class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <Package class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            </div>
                                            <div>
                                                <p class="font-bold text-gray-900 text-sm sm:text-base">#{{
                                                    order.orderNumber }}</p>
                                                <p class="text-xs sm:text-sm text-gray-500">{{ order.date }}</p>
                                            </div>
                                        </div>
                                        <span
                                            :class="`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getStatusColor(order.status)}`">
                                            {{ order.status }}
                                        </span>
                                    </div>

                                    <!-- Customer Info -->
                                    <div class="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
                                        <p class="text-xs sm:text-sm font-medium text-gray-900">Customer: {{
                                            order.customerName }}</p>
                                        <p class="text-xs sm:text-sm text-gray-600">Items: {{ order.products.length }}
                                        </p>
                                    </div>

                                    <!-- Products List -->
                                    <div class="space-y-2 mb-3 sm:mb-4">
                                        <div v-for="product in order.products" :key="product.name"
                                            class="flex justify-between items-center text-xs sm:text-sm bg-white p-2 sm:p-3 rounded-lg border border-gray-100">
                                            <span class="font-medium text-gray-900 truncate flex-1 mr-2">{{ product.name
                                            }}</span>
                                            <span class="text-gray-600 flex-shrink-0">x{{ product.quantity }} - ₦{{
                                                product.formattedSubtotal }}</span>
                                        </div>
                                    </div>

                                    <!-- Order Total -->
                                    <div class="pt-2 sm:pt-3 border-t border-gray-200">
                                        <div class="flex justify-between items-center">
                                            <span class="text-base sm:text-lg font-bold text-gray-900">Total:</span>
                                            <span class="text-base sm:text-lg font-bold text-green-600">₦{{
                                                order.formattedTotal }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="text-center py-8 sm:py-12">
                                <div
                                    class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                </div>
                                <p class="text-gray-500 text-base sm:text-lg font-medium">No recent orders</p>
                                <p class="text-gray-400 text-xs sm:text-sm mt-1">Orders will appear here once customers
                                    place them</p>
                            </div>
                        </div>

                        <!-- Enhanced Pagination -->
                        <div class="bg-gray-50 p-3 sm:p-4 flex justify-between items-center border-t border-gray-200">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-3 sm:px-4 py-2 text-indigo-600 hover:text-indigo-800 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base">
                                Previous
                            </button>
                            <span class="text-xs sm:text-sm text-gray-600 font-medium">Page {{ currentPage }} of {{
                                totalPages }}</span>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-3 sm:px-4 py-2 text-indigo-600 hover:text-indigo-800 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base">
                                Next
                            </button>
                        </div>

                        <!-- View All Orders Button -->
                        <div class="p-3 sm:p-4 bg-gray-50 text-center border-t border-gray-200">
                            <button @click="viewAllOrders"
                                class="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                                <ShoppingBag class="w-4 h-4" />
                                View All Orders
                            </button>
                        </div>
                    </div>

                    <!-- Enhanced Quick Actions Panel -->
                    <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div class="bg-gradient-to-r from-gray-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <Settings class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div>
                                    <h2 class="text-lg sm:text-xl font-bold text-gray-900">Quick Actions</h2>
                                    <p class="text-xs sm:text-sm text-gray-600">Manage your store efficiently</p>
                                </div>
                            </div>
                        </div>

                        <div class="p-3 sm:p-6">
                            <div class="space-y-2 sm:space-y-3">
                                <button @click="addNewProduct"
                                    class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                    <CirclePlus class="w-4 h-4 sm:w-5 sm:h-5" />
                                    Add New Product
                                </button>

                                <button @click="showUpdateInventory = true"
                                    class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                    <Boxes class="w-4 h-4 sm:w-5 sm:h-5" />
                                    Update Inventory
                                </button>

                                <button @click="showManagePromotions = true"
                                    class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                    <Tag class="w-4 h-4 sm:w-5 sm:h-5" />
                                    Manage Promotions
                                </button>

                                <button @click="viewAnalytics"
                                    class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                    <AlignEndHorizontal class="w-4 h-4 sm:w-5 sm:h-5" />
                                    View Analytics
                                </button>

                                <button @click="manageOrders"
                                    class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                    <ShoppingBag class="w-4 h-4 sm:w-5 sm:h-5" />
                                    Manage Orders
                                </button>

                                <button @click="downloadReports"
                                    class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                    <Download class="w-4 h-4 sm:w-5 sm:h-5" />
                                    Download Reports
                                </button>

                                <!-- Additional Action Buttons -->
                                <div class="pt-3 sm:pt-4 border-t border-gray-200 space-y-2 sm:space-y-3">
                                    <button @click="productCategories"
                                        class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-slate-500 to-gray-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-slate-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                        <FolderTree class="w-4 h-4 sm:w-5 sm:h-5" />
                                        Product Categories
                                    </button>

                                    <button @click="customerManagement"
                                        class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                        <Users class="w-4 h-4 sm:w-5 sm:h-5" />
                                        Customer Management
                                    </button>

                                    <button @click="supportTickets"
                                        class="w-full flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base">
                                        <TicketCheck class="w-4 h-4 sm:w-5 sm:h-5" />
                                        Support Tickets
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Sales Performance Chart -->
                <div
                    class="mt-4 sm:mt-5 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div class="bg-gradient-to-r from-gray-50 to-green-50 p-4 sm:p-6 border-b border-gray-200">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <TrendingUp class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <h2 class="text-lg sm:text-xl font-bold text-gray-900">Sales Performance</h2>
                                <p class="text-xs sm:text-sm text-gray-600">Track your sales over time</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 sm:p-6">
                        <canvas ref="salesChart" class="w-full h-48 sm:h-64"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Modals -->
        <!-- Update Inventory Modal -->
        <div v-show="showUpdateInventory"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div class="bg-white rounded-xl sm:rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
                <div class="p-3 sm:p-4 border-b bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <div class="flex justify-between items-center">
                        <h3 class="text-base sm:text-lg font-bold">Update Inventory</h3>
                        <button @click="showUpdateInventory = false"
                            class="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <XIcon class="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </div>
                </div>
                <div class="overflow-auto max-h-[calc(90vh-60px)] sm:max-h-[calc(90vh-80px)]">
                    <UpdateInventory @close="showUpdateInventory = false" />
                </div>
            </div>
        </div>

        <!-- Manage Promotions Modal -->
        <div v-if="showManagePromotions"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div class="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                <div class="p-3 sm:p-4 border-b bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                    <div class="flex justify-between items-center">
                        <h3 class="text-base sm:text-lg font-bold">Manage Promotions</h3>
                        <button @click="showManagePromotions = false"
                            class="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <XIcon class="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </div>
                </div>
                <div class="overflow-auto max-h-[calc(90vh-60px)] sm:max-h-[calc(90vh-80px)]">
                    <ManagePromotions @close="showManagePromotions = false" />
                </div>
            </div>
        </div>

        <!-- Edit Profile Modal -->
        <div v-if="showEditProfileModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div class="bg-white rounded-xl sm:rounded-2xl w-full max-w-md shadow-2xl">
                <EditSellerProfile @close="showEditProfileModal = false" @profile-updated="onProfileUpdated" />
            </div>
        </div>
    </div>
</template>

<script>
import UserProfileCard from './UserProfileCard.vue';
import UpdateInventory from './UpdateInventory.vue';
import ManagePromotions from './ManagePromotions.vue';
import EditSellerProfile from './EditSellerProfile.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { useSellerStore } from '../store/sellerStore';
import { useAddressStore } from '../store/addressStore';
import {
    UserRound, CirclePlus, Boxes, Tag, AlignEndHorizontal, Banknote, ShoppingCart, Package, Users, XIcon, TrendingUp, Award, Clock,
    ShoppingBag, Download, FolderTree, Settings, TicketCheck
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import Chart from 'chart.js/auto';

export default {
    name: 'UserSellerDashboard',
    components: {
        UserProfileCard,
        UpdateInventory,
        ManagePromotions,
        EditSellerProfile,
        UserRound, CirclePlus, Boxes, Tag, AlignEndHorizontal, Banknote, ShoppingCart, Package, Users, XIcon, TrendingUp, Award, Clock,
        ShoppingBag, Download, FolderTree, Settings, TicketCheck
    },
    setup() {
        const router = useRouter();
        const userStore = useUserStore();
        const sellerStore = useSellerStore();
        const addressStore = useAddressStore();
        const salesChart = ref(null);
        const showUpdateInventory = ref(false);
        const showManagePromotions = ref(false);
        const recentOrders = ref([]);
        const showEditProfileModal = ref(false);
        const isLoading = ref(true);

        const currentPage = ref(1);
        const ordersPerPage = 2;

        const user = computed(() => userStore.user);
        const addresses = computed(() => addressStore.addresses);

        const isSeller = computed(() => userStore.user && userStore.user.isSeller && sellerStore.sellerProfile !== null);

        const sellerProfile = computed(() => sellerStore.sellerProfile || {});
        const sellerName = computed(() => sellerProfile.value.storeName || user.value?.username);
        const sellerAvatar = computed(() => sellerProfile.value.profileImage || getDefaultAvatar(user.value?._id));

        const onProfileUpdated = async () => {
            await checkAuthAndLoadData();
        };

        const toggleVacationMode = async () => {
            try {
                await sellerStore.toggleVacationMode();
                const newStatus = sellerProfile.value.isVacationMode ? 'enabled' : 'disabled';
                const storeStatus = sellerProfile.value.isVacationMode ? 'closed' : 'opened';
                toast.success(`Vacation mode ${newStatus} and store ${storeStatus}`);
            } catch (error) {
                console.error('Error toggling vacation mode:', error);
                toast.error('Failed to toggle vacation mode. Please try again.');
            }
        };

        const toggleStoreOpen = async () => {
            try {
                await sellerStore.toggleStoreOpen();
                toast.success(`Store ${sellerProfile.value.storeOpen ? 'opened' : 'closed'}`);
            } catch (error) {
                console.error('Error toggling store open status:', error);
                toast.error('Failed to toggle store status. Please try again.');
            }
        };

        // Add this function to convert numbers to words
        function numberToWords(num) {
            if (num === 0) return "Zero Naira";

            // Round to the nearest whole number
            num = Math.round(num);

            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

            function convertGroup(n) {
                let result = '';
                if (n >= 100) {
                    result += ones[Math.floor(n / 100)] + ' Hundred';
                    n %= 100;
                    if (n > 0) result += ' and ';
                }
                if (n >= 20) {
                    result += tens[Math.floor(n / 10)];
                    if (n % 10 > 0) result += '-' + ones[n % 10];
                } else if (n >= 10) {
                    result += teens[n - 10];
                } else if (n > 0) {
                    result += ones[n];
                }
                return result;
            }

            let result = '';
            let scaleIndex = 0;

            while (num > 0) {
                if (num % 1000 !== 0) {
                    let groupResult = convertGroup(num % 1000);
                    if (scaleIndex > 0) groupResult += ' ' + scales[scaleIndex];
                    if (result) groupResult += ', ' + result;
                    result = groupResult;
                }
                num = Math.floor(num / 1000);
                scaleIndex++;
            }

            return result + ' Naira';
        };

        const quickStats = ref([
            { label: 'Total Sales', value: '₦0', valueInWords: '', icon: Banknote, color: 'green' },
            { label: 'Orders', value: '0', icon: ShoppingCart, color: 'blue' },
            { label: 'Products', value: '0', icon: Package, color: 'yellow' },
            { label: 'Customers', value: '0', icon: Users, color: 'gray' },
        ]);

        const revenueOverview = ref({
            growth: 0,
            comparisonPeriod: 'vs last 30 days'
        });

        const topSellingProduct = ref({
            name: '',
            quantity: 0
        });
        const pendingOrders = ref(0);

        const paginatedOrders = computed(() => {
            const start = (currentPage.value - 1) * ordersPerPage;
            const end = start + ordersPerPage;
            return recentOrders.value.slice(start, end);
        });

        const totalPages = computed(() => Math.ceil(recentOrders.value.length / ordersPerPage));

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const checkAuthAndLoadData = async () => {
            isLoading.value = true;
            try {
                if (!userStore.checkTokenExpiration()) {
                    console.error('User is not logged in or token is invalid');
                    toast.error('Please log in to access the dashboard.');
                    router.push('/login');
                    return;
                }

                await userStore.getUserProfile();

                if (userStore.user && userStore.user.isSeller) {
                    await sellerStore.loadSellerProfile();
                    if (sellerStore.sellerProfile) {
                        await loadDashboardData();
                    } else {
                        console.log('User is marked as seller but has no seller profile');
                        toast.error('You do not have seller privileges.');
                    }
                } else {
                    console.log('User is not a seller');
                    // Don't show a toast here, let the template handle the display
                }
            } catch (error) {
                console.error('Error in checkAuthAndLoadData:', error);
                toast.error('Failed to load dashboard. Please try again.');
            } finally {
                isLoading.value = false;
            }
        };

        const navigateToBecomeSeller = () => {
            router.push({ name: 'BecomeSeller' });
        };

        const loadDashboardData = async () => {
            try {
                console.log('Starting loadDashboardData');
                console.log('Current user:', userStore.user);
                console.log('Current seller ID:', userStore.user.sellerProfile);
                console.log('Is seller?', isSeller.value);
                console.log('Is sellerStore.isSellerProfileLoaded?', sellerStore.isSellerProfileLoaded);

                if (!sellerStore.isSellerProfileLoaded) {
                    console.log('Attempting to load seller profile');
                    await sellerStore.loadSellerProfile();
                    console.log('After loading seller profile:', sellerStore.sellerProfile);
                }

                if (sellerStore.sellerProfile) {
                    console.log('Fetching dashboard data');
                    const dashboardData = await sellerStore.fetchDashboardData();
                    console.log('Dashboard data:', dashboardData);

                    updateQuickStats(dashboardData);
                    recentOrders.value = dashboardData.recentOrders || [];
                    console.log('Recent orders:', recentOrders.value);

                    pendingOrders.value = dashboardData.pendingOrders || 0;
                    console.log('Pending orders:', pendingOrders.value);

                    console.log('Top selling product:', dashboardData.topSellingProduct);
                    topSellingProduct.value = dashboardData.topSellingProduct || { name: 'No products', quantity: 0 };

                    console.log('Revenue growth:', dashboardData.revenueGrowth);
                    updateRevenueOverview(dashboardData.revenueGrowth);

                    recentOrders.value = (dashboardData.recentOrders || []).map(order => ({
                        ...order,
                        formattedTotal: formatPrice(order.total),
                        products: order.products.map(product => ({
                            ...product,
                            formattedSubtotal: formatPrice(product.subtotal),
                            formattedUnitPrice: formatPrice(product.subtotal / product.quantity)
                        }))
                    }));

                    // Log the values for debugging
                    console.log('Revenue Overview:', revenueOverview.value);
                    console.log('Top Selling Product:', topSellingProduct.value);
                    console.log('Pending Orders:', pendingOrders.value);
                    console.log('Recent Orders:', recentOrders.value);

                    // Initialize chart after a short delay
                    setTimeout(() => {
                        initSalesChart();
                    }, 100);
                } else {
                    console.log('User is not a seller');
                    toast.error('You do not have seller privileges.');
                }
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                toast.error('Failed to load dashboard data. Please check your connection and try again.');
                if (error.response && error.response.status === 401) {
                    userStore.logoutUser();
                    router.push('/login');
                }
            }
        };

        const becomeSeller = async () => {
            try {
                await userStore.becomeSeller();
                toast.success('You are now a seller!');
                await checkAuthAndLoadData();
            } catch (error) {
                console.error('Failed to become a seller:', error);
                toast.error('Failed to become a seller. Please try again.');
            }
        };

        const formatPrice = (price) => {
            if (typeof price === 'string') {
                price = parseFloat(price);
            }
            if (typeof price !== 'number' || isNaN(price)) {
                console.log(`Invalid price value:`, price);
                return 'N/A';
            }
            return price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        const formatNumber = (num) => {
            return num.toLocaleString('en-NG');
        };

        const updateQuickStats = (data) => {
            console.log('Raw total sales:', data.totalSales);
            const formattedSales = formatPrice(data.totalSales);
            console.log('Formatted total sales:', formattedSales);
            quickStats.value = [
                { label: 'Total Sales', value: `₦${formattedSales}`, valueInWords: numberToWords(Math.floor(data.totalSales)), icon: Banknote, color: 'green' },
                { label: 'Orders', value: formatNumber(data.totalOrders), icon: ShoppingCart, color: 'blue' },
                { label: 'Products', value: formatNumber(data.totalProducts), icon: Package, color: 'yellow' },
                { label: 'Customers', value: formatNumber(data.totalCustomers), icon: Users, color: 'gray' },
            ];
        };

        const updateRevenueOverview = (growthPercentage) => {
            revenueOverview.value = {
                growth: growthPercentage !== undefined ? Number(growthPercentage).toFixed(2) : '0.00',
                comparisonPeriod: 'vs last 30 days'
            };
        };

        const initSalesChart = () => {
            console.log('Entering initSalesChart');
            console.log('recentOrders.value:', recentOrders.value);
            console.log('salesChart.value:', salesChart.value);

            if (!recentOrders.value || recentOrders.value.length === 0 || !salesChart.value) {
                console.log('No recent orders available');
                return;
            }

            if (!salesChart.value) {
                console.log('Canvas element not available');
                return;
            }

            const ctx = salesChart.value.getContext('2d');
            console.log('Chart context:', ctx);

            const labels = recentOrders.value.map(order => order.date);
            const data = recentOrders.value.map(order => order.total);

            console.log('Chart labels:', labels);
            console.log('Chart data:', data);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Recent Sales',
                        data: data,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Order Total (₦)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Order Date'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            console.log('Chart initialized');
        };

        const getStatusColor = (status) => {
            const colors = {
                'Pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                'Shipped': 'bg-blue-100 text-blue-800 border border-blue-200',
                'Delivered': 'bg-green-100 text-green-800 border border-green-200',
                'Cancelled': 'bg-red-100 text-red-800 border border-red-200'
            };
            return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
        };

        const editProfile = () => {
            router.push({ name: 'EditSellerProfile', params: { id: user.value._id } });
        };

        const toggleStoreStatus = async () => {
            try {
                await sellerStore.toggleStoreStatus(user.value._id);
                toast.success(`Store is now ${sellerProfile.value.storeOpen ? 'open' : 'closed'}`);
            } catch (error) {
                toast.error('Failed to update store status');
            }
        };

        const viewAllOrders = () => router.push({ name: 'SellerOrders' });
        const addNewProduct = () => router.push({ name: 'AddProduct', query: { from: 'dashboard' } });
        const managePromotions = () => router.push({ name: 'ManagePromotions' });
        const viewAnalytics = () => router.push({ name: 'SellerAnalytics' });
        const manageOrders = () => router.push({ name: 'SellerManageOrders' });
        const downloadReports = () => router.push({ name: 'DownloadReports' });
        const productCategories = () => router.push({ name: 'ProductCategories' });
        const customerManagement = () => router.push({ name: 'CustomerManagement' });
        const settings = () => router.push({ name: 'Settings' });
        const supportTickets = () => router.push({ name: 'SupportTickets' });

        const getDefaultAvatar = (userId, style = 'identicon') => {
            return `https://api.dicebear.com/6.x/${style}/svg?seed=${userId}`;
        };

        const randomAvatarUrl = computed(() => {
            const randomSeed = Math.random().toString(36).substring(7);
            return `https://api.dicebear.com/6.x/identicon/svg?seed=${randomSeed}`;
        });

        const getDefaultBackground = () => {
            return `linear-gradient(135deg, rgba(49, 49, 49, 0.03) 0%, rgba(49, 49, 49, 0.03) 50%,rgba(252, 252, 252, 0.03) 50%, rgba(252, 252, 252, 0.03) 100%), linear-gradient(45deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 50%,rgba(220, 220, 220, 0.03) 50%, rgba(220, 220, 220, 0.03) 100%), linear-gradient(135deg, rgba(54, 54, 54, 0.03) 0%, rgba(54, 54, 54, 0.03) 50%,rgba(209, 209, 209, 0.03) 50%, rgba(209, 209, 209, 0.03) 100%), linear-gradient(45deg, rgba(10, 10, 10, 0.03) 0%, rgba(10, 10, 10, 0.03) 50%,rgba(174, 174, 174, 0.03) 50%, rgba(174, 174, 174, 0.03) 100%), linear-gradient(90deg, rgb(13, 17, 158),rgb(49, 100, 233))`;
        };

        onMounted(() => {
            checkAuthAndLoadData();
        });

        watch(() => router.currentRoute.value.path, (newPath, oldPath) => {
            if (newPath === '/account/profile/profile-user/' && oldPath !== newPath) {
                checkAuthAndLoadData();
            }
        });

        return {
            user,
            isSeller,
            isLoading,
            sellerProfile,
            sellerName,
            sellerAvatar,
            quickStats,
            recentOrders,
            salesChart,
            showUpdateInventory,
            showManagePromotions,
            paginatedOrders,
            currentPage,
            totalPages,
            nextPage,
            prevPage,
            formatPrice,
            formatNumber,
            getStatusColor,
            editProfile,
            toggleStoreStatus,
            viewAllOrders,
            addNewProduct,
            managePromotions,
            viewAnalytics,
            manageOrders,
            downloadReports,
            productCategories,
            customerManagement,
            settings,
            supportTickets,
            becomeSeller,
            navigateToBecomeSeller,
            revenueOverview,
            topSellingProduct,
            pendingOrders,
            showEditProfileModal,
            onProfileUpdated,
            getDefaultAvatar,
            randomAvatarUrl,
            getDefaultBackground,
            toggleVacationMode,
            toggleStoreOpen
        };
    }
};
</script>

<style scoped>
/* Enhanced animations and transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Disable hover effects on mobile */
@media (max-width: 768px) {
    .transform {
        transform: none !important;
    }

    .hover\:scale-105:hover {
        transform: none !important;
    }

    .hover\:scale-\[1\.02\]:hover {
        transform: none !important;
    }
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Enhanced scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #1d4ed8, #1e40af);
}

/* Chart container styling */
canvas {
    border-radius: 8px;
}

/* Custom shadow effects */
.shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Mobile-specific optimizations */
@media (max-width: 640px) {

    /* Reduce motion for better performance on mobile */
    .transform,
    .transition-all {
        transform: none !important;
        transition: none !important;
    }

    /* Custom scrollbar for mobile */
    ::-webkit-scrollbar {
        width: 3px;
    }
}

/* Text truncation helpers */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Focus states for accessibility */
button:focus,
input:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
}
</style>
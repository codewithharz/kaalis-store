<!-- frontend/src/views/ProfileManagePaymentCard.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <!-- Modern Hero Header -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Payment Methods</h1>
                    <p class="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-white/90">Manage your payment methods
                        and saved cards</p>
                </div>
            </div>
        </div>

        <!-- Main Content Section -->
        <div class="container mx-auto px-4 -mt-12 sm:-mt-16 lg:-mt-20 relative z-10">
            <div class="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <!-- Default Payment Card -->
                    <div
                        class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs sm:text-sm text-gray-500">Default Payment</p>
                                <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                                    {{ defaultCard ? 'Credit Card' : 'Not Set' }}
                                </p>
                            </div>
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                <CreditCard class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <!-- Active Cards Stats -->
                    <div
                        class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs sm:text-sm text-gray-500">Active Cards</p>
                                <p class="text-base sm:text-lg font-medium text-gray-900">{{ savedCards.length }} Cards
                                </p>
                            </div>
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <CircleDollarSign class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <!-- Last Transaction -->
                    <div
                        class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20 sm:col-span-2 lg:col-span-1">
                        <div class="flex items-center justify-between">
                            <div class="min-w-0 flex-1">
                                <p class="text-xs sm:text-sm text-gray-500">Last Transaction</p>
                                <p class="text-base sm:text-lg font-medium text-gray-900 break-words">{{
                                    lastTransactionDate || 'No transactions' }}</p>
                            </div>
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                                <History class="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Card Section -->
                <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <!-- Navigation Tabs -->
                    <div class="border-b border-gray-100">
                        <div class="flex space-x-4 sm:space-x-8 px-4 sm:px-8 pt-4 sm:pt-6 overflow-x-auto">
                            <button @click="activeTab = 'cards'" :class="[
                                'pb-3 sm:pb-4 font-medium transition-all relative whitespace-nowrap',
                                activeTab === 'cards'
                                    ? 'text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            ]">
                                <span class="relative z-10 text-sm sm:text-base">Credit Cards</span>
                                <span v-if="activeTab === 'cards'"
                                    class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transition-all"></span>
                            </button>
                            <button @click="activeTab = 'transactions'" :class="[
                                'pb-3 sm:pb-4 font-medium transition-all relative whitespace-nowrap',
                                activeTab === 'transactions'
                                    ? 'text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            ]">
                                <span class="relative z-10 text-sm sm:text-base">Transaction History</span>
                                <span v-if="activeTab === 'transactions'"
                                    class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transition-all"></span>
                            </button>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="p-4 sm:p-6 lg:p-8">
                        <!-- Header with Search -->
                        <div class="flex flex-col gap-4 mb-6 sm:mb-8">
                            <div>
                                <h2 class="text-xl sm:text-2xl font-semibold text-gray-900">
                                    {{ activeTab === 'cards' ? 'Saved Cards' : 'Transactions' }}
                                </h2>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1">
                                    {{ activeTab === 'cards' ? `Manage your payment cards` : `View your transaction
                                    history` }}
                                </p>
                            </div>
                            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <!-- Modern Search Input -->
                                <div class="relative flex-1">
                                    <Search
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input type="text" v-model="searchQuery"
                                        :placeholder="activeTab === 'cards' ? 'Search cards...' : 'Search transactions...'"
                                        class="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm sm:text-base" />
                                </div>
                                <!-- Modern Add Card Button -->
                                <button v-if="activeTab === 'cards'" @click="handleAddCardClick"
                                    class="group w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-indigo-500/25 text-sm sm:text-base">
                                    <PlusCircle class="w-4 h-4 transition-transform group-hover:rotate-90" />
                                    <span class="hidden sm:inline">Add New Card</span>
                                    <span class="sm:hidden">Add Card</span>
                                </button>
                            </div>
                        </div>

                        <!-- Cards Tab Content -->
                        <div v-if="activeTab === 'cards'">
                            <!-- Cards Grid -->
                            <div v-if="filteredCards.length" class="space-y-3 sm:space-y-4">
                                <!-- Card Items -->
                                <div v-for="card in paginatedCards" :key="card.id"
                                    class="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
                                    <div class="flex flex-col gap-4 sm:gap-6">
                                        <!-- Card Info -->
                                        <div class="flex items-center gap-3 sm:gap-6">
                                            <div
                                                class="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                                                <img :src="getCardTypeIcon(card.type)"
                                                    class="w-8 h-8 sm:w-10 sm:h-10 object-contain" :alt="card.type" />
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                    <span class="font-medium text-base sm:text-lg text-gray-900">•••• {{
                                                        card.last4 }}</span>
                                                    <span v-if="card.isDefault"
                                                        class="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 text-xs rounded-full w-fit">
                                                        Default
                                                    </span>
                                                </div>
                                                <div
                                                    class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                                    <div
                                                        class="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                                        <Calendar class="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span>Expires {{ card.expiryMonth }}/{{ card.expiryYear
                                                        }}</span>
                                                    </div>
                                                    <div
                                                        class="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                                        <User class="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span class="truncate">{{ card.holderName }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Card Actions -->
                                        <div
                                            class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                                            <button v-if="!card.isDefault" @click="setDefaultCard(card.id)"
                                                class="w-full sm:w-auto text-center sm:text-left text-sm text-gray-500 hover:text-indigo-600 transition-colors py-2 sm:py-0">
                                                Set as Default
                                            </button>
                                            <button @click="showDeleteConfirmation(card.id)"
                                                class="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 text-gray-400 hover:text-red-500 transition-colors py-2 sm:py-0">
                                                <Trash2 class="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span class="sm:hidden text-sm">Delete Card</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Recent Transaction Preview -->
                                    <div v-if="card.lastTransaction"
                                        class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                                        <div
                                            class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                                            <p class="text-gray-500">Recent Transaction:</p>
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                <p class="text-gray-900 font-medium">
                                                    {{ card.lastTransaction.description }} -
                                                    ${{ card.lastTransaction.amount.toFixed(2) }}
                                                </p>
                                                <p class="text-gray-500">{{ card.lastTransaction.date }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div v-else
                                class="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-6 sm:p-8 border border-gray-200 text-center">
                                <div
                                    class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                                </div>
                                <h3 class="text-lg sm:text-xl font-medium text-gray-900 mb-2">No Cards Found</h3>
                                <p class="text-gray-500 text-sm sm:text-base">Add your first payment card to get started
                                </p>
                            </div>

                            <!-- Pagination -->
                            <div v-if="filteredCards.length"
                                class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                                <p class="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                                    Showing {{ paginationStart + 1 }}-{{ paginationEnd }} of {{ filteredCards.length }}
                                    cards
                                </p>
                                <div class="flex items-center gap-2">
                                    <button @click="currentPage--" :disabled="currentPage === 1"
                                        class="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button @click="currentPage++" :disabled="currentPage >= totalPages"
                                        class="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Transactions Tab Content -->
                        <div v-if="activeTab === 'transactions'">
                            <!-- Loading State -->
                            <div v-if="paymentStore.isLoading" class="text-center py-8 sm:py-12">
                                <Loader2
                                    class="w-8 h-8 sm:w-10 sm:h-10 animate-spin mx-auto text-indigo-600 mb-3 sm:mb-4" />
                                <p class="text-gray-500 text-sm sm:text-base">Loading your transactions...</p>
                            </div>

                            <!-- Transactions List -->
                            <div v-if="transactions.length" class="space-y-3 sm:space-y-4">
                                <div v-for="transaction in filteredTransactions" :key="transaction.reference"
                                    class="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                    <div
                                        class="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:justify-between sm:items-start">
                                        <div class="space-y-2">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span :class="[
                                                    'px-2 sm:px-3 py-1 text-xs rounded-full font-medium inline-flex items-center gap-1.5 w-fit',
                                                    transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                                                        transaction.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-red-100 text-red-800'
                                                ]">
                                                    <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" :class="[
                                                        transaction.status === 'success' ? 'bg-green-600' :
                                                            transaction.status === 'pending' ? 'bg-amber-600' :
                                                                'bg-red-600'
                                                    ]"></span>
                                                    {{ transaction.status === 'success' ? 'Success' :
                                                        transaction.status === 'pending' ? 'Pending' : 'Failed' }}
                                                </span>
                                                <p class="text-xs sm:text-sm font-mono text-gray-500 break-all">{{
                                                    transaction.reference }}</p>
                                            </div>
                                            <p class="font-medium text-gray-900 text-sm sm:text-base">Order #{{
                                                transaction.orderId || 'N/A' }}</p>
                                            <p class="text-xs sm:text-sm text-gray-600 break-all">{{ transaction.email
                                            }}</p>
                                            <p
                                                class="text-xs sm:text-sm text-gray-500 capitalize flex items-center gap-1.5">
                                                <CreditCard class="w-3 h-3 sm:w-4 sm:h-4" />
                                                {{ transaction.paymentMethod }}
                                            </p>
                                        </div>

                                        <div
                                            class="text-left sm:text-right border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 flex-shrink-0">
                                            <p class="text-lg sm:text-xl font-semibold text-gray-900">
                                                {{ formatCurrency(transaction.amount) }}
                                            </p>
                                            <div class="flex flex-col gap-1 mt-2">
                                                <div class="text-xs sm:text-sm text-gray-600">
                                                    <span>Vendor: </span>
                                                    <span class="font-medium">{{
                                                        formatCurrency(transaction.vendorAmount) }}</span>
                                                </div>
                                                <div class="text-xs sm:text-sm text-gray-600">
                                                    <span>Platform Fee: </span>
                                                    <span class="font-medium">{{ formatCurrency(transaction.platformFee)
                                                    }}</span>
                                                </div>
                                            </div>
                                            <p class="text-xs text-gray-400 mt-2 sm:mt-3">{{ transaction.formattedDate
                                            }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="text-center py-12 sm:py-16">
                                <div
                                    class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <History class="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                                </div>
                                <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
                                <p class="text-gray-500 text-sm sm:text-base">Your transaction history will appear here
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Digital Wallets Section - Moved outside of stats cards -->
                <div class="border-t border-gray-100 mt-6 sm:mt-8">
                    <div class="py-6 sm:py-8">
                        <div class="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                                <h2 class="text-xl sm:text-2xl font-semibold text-gray-900">Digital Wallets</h2>
                                <p class="text-xs sm:text-sm text-gray-500 mt-1">Coming soon to enhance your payment
                                    experience</p>
                            </div>
                        </div>

                        <div
                            class="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-6 sm:p-8 border border-gray-200 overflow-hidden">
                            <!-- Decorative background elements -->
                            <div
                                class="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2">
                            </div>
                            <div
                                class="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2">
                            </div>

                            <div
                                class="relative flex flex-col items-center text-center gap-6 sm:gap-8 md:flex-row md:text-left md:justify-between">
                                <div class="flex-1">
                                    <span
                                        class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-600 mb-3 sm:mb-4">
                                        Coming Soon
                                    </span>
                                    <h3 class="text-lg sm:text-xl font-medium text-gray-900 mb-2">Digital Wallet Support
                                    </h3>
                                    <p class="text-gray-500 text-sm sm:text-base">We're working on bringing you seamless
                                        digital wallet integration. Stay tuned for updates!</p>
                                </div>
                                <div class="relative">
                                    <div
                                        class="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full flex items-center justify-center shadow-inner">
                                        <Wallet class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
                                    </div>
                                    <div
                                        class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-indigo-500/10 rounded-full animate-pulse">
                                    </div>
                                    <div
                                        class="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-purple-500/10 rounded-full animate-pulse delay-150">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <!-- Add Card Modal -->
        <div v-if="showAddCardModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div
                class="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xl p-4 sm:p-6 lg:p-8 transform transition-all max-h-[95vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Add New Card</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">Enter your card details below</p>
                    </div>
                    <button @click="closeAddCardModal" class="text-gray-400 hover:text-gray-500 transition-colors p-1">
                        <X class="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <form @submit.prevent="handleAddCard" class="space-y-4 sm:space-y-6">
                    <!-- Card Number -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">Card Number</label>
                        <div
                            class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                            <CreditCard
                                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <input type="text" v-model="cardForm.number" @input="formatCardNumber" maxlength="19"
                                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 text-gray-700 bg-transparent border-none focus:outline-none text-sm sm:text-base"
                                placeholder="Enter your card number" />
                        </div>
                    </div>

                    <!-- Card Holder -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">Card Holder Name</label>
                        <div
                            class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                            <User
                                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <input type="text" v-model="cardForm.holderName"
                                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 text-gray-700 bg-transparent border-none focus:outline-none text-sm sm:text-base"
                                placeholder="Enter card holder name" />
                        </div>
                    </div>

                    <!-- Expiry and CVV -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Expiry Date</label>
                            <div
                                class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                <Lock
                                    class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                <input type="text" v-model="cardForm.cvv" maxlength="4"
                                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 text-gray-700 bg-transparent border-none focus:outline-none text-sm sm:text-base"
                                    placeholder="Enter CVV" />
                            </div>
                        </div>
                    </div>

                    <!-- Set as Default -->
                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="setDefault" v-model="cardForm.setAsDefault"
                            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20" />
                        <label for="setDefault" class="text-sm text-gray-700">Set as default payment method</label>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
                        <button type="button" @click="closeAddCardModal"
                            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors order-2 sm:order-1">
                            Cancel
                        </button>
                        <button type="submit" :disabled="isSubmitting"
                            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2">
                            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                            <span>{{ isSubmitting ? 'Adding Card...' : 'Add Card' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                class="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all">
                <div class="text-center">
                    <AlertCircle class="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 sm:mb-4" />
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Delete Card</h3>
                    <p class="text-gray-500 text-sm sm:text-base">Are you sure you want to delete this card? This action
                        cannot be undone.</p>
                </div>

                <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button @click="showDeleteModal = false"
                        class="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors order-2 sm:order-1">
                        Cancel
                    </button>
                    <button @click="confirmDelete" :disabled="isDeleting"
                        class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2">
                        <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
                        <span>{{ isDeleting ? 'Deleting...' : 'Delete Card' }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Card Limit Modal -->
        <div v-if="showCardLimitModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div
                class="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl p-4 sm:p-6 lg:p-8 transform transition-all max-h-[95vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Card Limit Reached</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">You have reached the maximum limit of 5 cards
                        </p>
                    </div>
                    <button @click="closeCardLimitModal"
                        class="text-gray-400 hover:text-gray-500 transition-colors p-1">
                        <X class="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div class="mt-4">
                    <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Please delete one of your existing cards
                        to add a new one:</p>
                    <!-- Existing Cards List -->
                    <div class="space-y-3 sm:space-y-4">
                        <div v-for="card in savedCards" :key="card.id"
                            class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all gap-3 sm:gap-4">
                            <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                <div
                                    class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                                    <img :src="getCardTypeIcon(card.type)" class="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                        :alt="card.type" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                        <span class="font-medium text-gray-900 text-sm sm:text-base">•••• {{ card.last4
                                        }}</span>
                                        <span v-if="card.isDefault"
                                            class="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 text-xs rounded-full w-fit">
                                            Default
                                        </span>
                                    </div>
                                    <p class="text-xs sm:text-sm text-gray-500">Expires {{ card.expMonth }}/{{
                                        card.expYear }}</p>
                                </div>
                            </div>
                            <button @click="handleDeleteAndReplace(card.id)" :disabled="card.isDefault" :class="[
                                'w-full sm:w-auto px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors',
                                card.isDefault
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                            ]">
                                {{ card.isDefault ? 'Default Card' : 'Delete & Replace' }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button @click="closeCardLimitModal"
                        class="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>

        <!-- Vendor Payment section if user is a vendor -->
        <div v-if="isSeller" class="mt-6 sm:mt-8 pb-8 sm:pb-10">
            <h2 class="text-xl sm:text-2xl font-bold mb-1 px-4 sm:px-8 lg:px-12">Vendor Payouts</h2>
            <p class="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 px-4 sm:px-8 lg:px-12">Manage your payout settings
                and view history</p>
            <VendorPaymentSetup />
        </div>
    </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue';
import VendorPaymentSetup from './VendorPaymentSetup.vue';
import {
    CreditCard, PlusCircle, Wallet, Trash2, X, Search, User,
    CircleDollarSign, History, Calendar, ChevronLeft, ChevronRight,
    Lock, Loader2, AlertCircle
} from 'lucide-vue-next';
import { useUserStore } from '../store/user';
import { usePaymentStore } from '../store/paymentStore';
import { useOrderStore } from '../store/orderStore.js';
import { toast } from 'vue-sonner';

// Store initialization
const userStore = useUserStore();
const paymentStore = usePaymentStore();

const user = computed(() => userStore.user);
const savedCards = computed(() => paymentStore.savedCards);

// const isSeller = computed(() => userStore.user?.role === 'seller');
const isSeller = computed(() => userStore.user?.isSeller === true);

// State
const activeTab = ref('cards');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;
const showAddCardModal = ref(false);
const showDeleteModal = ref(false);
const cardToDelete = ref(null);
// const isSubmitting = ref(false);
// const isDeleting = ref(false);

// Use store's loading states
const isSubmitting = computed(() => paymentStore.isProcessing);
const isDeleting = computed(() => paymentStore.isProcessing);

const cardForm = ref({
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
    setAsDefault: false
});
const showCardLimitModal = ref(false);
const showDeleteReplaceModal = ref(false);
const cardToDeleteAndReplace = ref(null);

// Computed
const filteredCards = computed(() => {
    const cards = paymentStore.savedCards;
    if (!searchQuery.value) return cards;

    const query = searchQuery.value.toLowerCase();
    return cards.filter(card =>
        card.holderName.toLowerCase().includes(query) ||
        card.last4.includes(query)
    );
});

const totalPages = computed(() => Math.ceil(filteredCards.value.length / itemsPerPage));

const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage);
const paginationEnd = computed(() => Math.min(paginationStart.value + itemsPerPage, filteredCards.value.length));

const formatCurrency = (amount) => {
    // Convert from Naira to Kobo if needed (divide by 100 if amount is in Kobo)
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '₦0.00';
    }

    // const amountInNaira = amount / 100;  // Convert kobo to naira no need for, backend handles this already

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};


const transactions = computed(() => {
    if (!paymentStore.paymentHistory?.length) {
        return [];
    }

    console.log('Raw payment history:', paymentStore.paymentHistory);
    console.log('Orders data:', paymentStore.orders);

    const orderStore = useOrderStore();

    return paymentStore.paymentHistory.map((transaction) => {
        const order = paymentStore.orders?.find(o => o.orderId === transaction.orderId);

        // Try to find matching order

        // Ensure all values have fallbacks
        const amount = transaction.amount || transaction.totalAmount || 0;
        // Calculate fees using the orderStore's method if they're not present
        let { vendorAmount, platformFee } = order || {};
        if (!vendorAmount || !platformFee) {
            const calculatedFees = orderStore.calculateFees(amount);
            vendorAmount = calculatedFees.vendorAmount;
            platformFee = calculatedFees.platformFee;
        }
        console.log('Found matching order:', order);

        console.log(`Processing transaction ${transaction.orderId}:`, {
            amount,
            vendorAmount,
            platformFee
        });

        return {
            reference: transaction.reference || transaction.transactionId || '',
            orderId: transaction.orderId || 'N/A',
            email: transaction.email || userStore.user?.email || 'N/A',
            status: transaction.status?.toLowerCase() || 'pending',
            amount,
            vendorAmount,
            platformFee,
            paymentMethod: transaction.paymentMethod ?
                transaction.paymentMethod.replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())
                : 'Paystack',
            formattedDate: transaction.createdAt ?
                new Date(transaction.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'N/A'
        };
    });
});

const paginatedCards = computed(() => {
    return filteredCards.value.slice(paginationStart.value, paginationEnd.value);
});

const defaultCard = computed(() =>
    paymentStore.savedCards.find(card => card.isDefault)
);

const lastTransactionDate = computed(() => {
    const latestTransaction = paymentStore.paymentHistory?.[0];
    if (!latestTransaction?.createdAt) {
        return 'No recent transactions';
    }

    return latestTransaction ? new Date(latestTransaction.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",

    })
        : 'No recent transactions';
});

const getCardIcon = computed(() => {
    const number = cardForm.value.number.replace(/\s/g, '');

    if (number.startsWith('4')) return '/icons/visa.svg';
    if (/^5[1-5]/.test(number)) return '/icons/mastercard.svg';
    if (/^506/.test(number)) return '/icons/verve.svg';
    return '/icons/generic-card.svg';
});

const filteredTransactions = computed(() => {
    if (!searchQuery.value) return transactions.value;

    const query = searchQuery.value.toLowerCase();
    return transactions.value.filter(transaction =>
        transaction.reference?.toLowerCase().includes(query) ||
        transaction.email?.toLowerCase().includes(query) ||
        transaction.status?.toLowerCase().includes(query)
    );
});


// Methods
const getDefaultBackground = () => {
    return `linear-gradient(135deg, rgba(49, 49, 49, 0.03) 0%, rgba(49, 49, 49, 0.03) 50%,rgba(252, 252, 252, 0.03) 50%, rgba(252, 252, 252, 0.03) 100%), linear-gradient(45deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 50%,rgba(220, 220, 220, 0.03) 50%, rgba(220, 220, 220, 0.03) 100%), linear-gradient(90deg, #ff934b, #ff5e62)`;
};

const getCardTypeIcon = (type) => {
    if (!type) return '/icons/generic-card.svg';
    return `/icons/${type.toLowerCase()}.svg`;
};

const closeAddCardModal = () => {
    showAddCardModal.value = false;
    cardForm.value = {
        number: '',
        holderName: '',
        expiry: '',
        cvv: '',
        setAsDefault: false
    };
};

// Format card number as user types
const fetchOrderDetails = async (orderId) => {
    const orderStore = useOrderStore();
    const order = await orderStore.getOrderById(orderId);
    return order?.paymentMethod || 'N/A';
};

onMounted(async () => {
    try {
        const orderStore = useOrderStore();
        // const userStore = useUserStore();

        // First load saved cards and payment history
        await Promise.all([
            paymentStore.loadSavedCards(),
            paymentStore.getPaymentHistory()
        ]);

        // Then fetch all orders if we have payment history
        if (paymentStore.paymentHistory?.length) {
            const orderIds = paymentStore.paymentHistory.map(t => t.orderId).filter(Boolean);

            // Use Promise.all to wait for all order fetches
            // const orders = await Promise.all(
            //     orderIds.map(orderId => orderStore.getOrderById(orderId))
            // );

            // Important: Use getOrderByOrderId instead of getOrderById
            const orders = await Promise.all(
                orderIds.map(orderId => orderStore.getOrderByOrderId(orderId))
            );


            // Filter out any null responses and save to payment store
            paymentStore.orders = orders.filter(Boolean);

            console.log('Loaded orders:', paymentStore.orders);
        }
    } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load payment data. Please refresh the page.');
    }
});

// Luhn algorithm implementation
const luhnCheck = (cardNumber) => {
    const digits = cardNumber.toString().split('').map(Number);
    let sum = 0;
    let isEven = false;

    // Loop from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};


// Card type patterns
const cardPatterns = {
    visa: {
        pattern: /^4[0-9]{12}(?:[0-9]{3})?$/,
        test: num => num.startsWith('4')
    },
    mastercard: {
        pattern: /^5[1-5][0-9]{14}$/,
        test: num => /^5[1-5]/.test(num)
    },
    verve: {
        pattern: /^506[0-9]{13,16}(?:[0-9]{3})?$/,  // Updated to handle longer Verve numbers
        test: num => /^506/.test(num)
    }
};

// Enhanced Luhn check with specific card validation
const validateCard = (number) => {
    const cleaned = number.replace(/\s/g, '');

    // Early validation for obvious issues
    if (!cleaned) {
        return {
            isValid: false,
            type: null,
            message: 'Card number is required'
        };
    }

    if (!/^\d+$/.test(cleaned)) {
        return {
            isValid: false,
            type: null,
            message: 'Card number can only contain digits'
        };
    }

    // Identify card type
    let cardType = null;
    for (const [type, { test }] of Object.entries(cardPatterns)) {
        if (test(cleaned)) {
            cardType = type;
            break;
        }
    }

    // Special handling for Verve cards
    if (cardType === 'verve') {
        // Verve cards can be longer, so we'll just verify it starts with 506
        // and has an acceptable length
        const isValidLength = cleaned.length >= 16 && cleaned.length <= 19;
        if (!isValidLength) {
            return {
                isValid: false,
                type: cardType,
                message: 'Invalid Verve card number length'
            };
        }

        // For Verve, we'll still do Luhn check but be more lenient with the pattern
        const luhnValid = luhnCheck(cleaned);
        return {
            isValid: luhnValid,
            type: cardType,
            message: luhnValid ? '' : 'Invalid card number (checksum failed)'
        };
    }

    // For other card types
    if (!cardType) {
        return {
            isValid: false,
            type: null,
            message: 'Unsupported card type. Please use Visa, Mastercard, or Verve'
        };
    }

    if (!cardPatterns[cardType].pattern.test(cleaned)) {
        return {
            isValid: false,
            type: cardType,
            message: 'Invalid card number length'
        };
    }

    return {
        isValid: luhnCheck(cleaned),
        type: cardType,
        message: luhnCheck(cleaned) ? '' : 'Invalid card number (checksum failed)'
    };
};

const validateExpiry = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return {
            isValid: false,
            message: 'Expiry date must be in MM/YY format'
        };
    }

    const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    // Check month validity
    if (month < 1 || month > 12) {
        return {
            isValid: false,
            message: 'Invalid month in expiry date'
        };
    }

    // Check if card is expired
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return {
            isValid: false,
            message: 'Card has expired'
        };
    }
    return {
        isValid: true,
        message: ''
    };
};

//CVV validation to handle different card types
const validateCVV = (cvv, cardType) => {
    const cvvLength = 3; // All our supported cards use 3-digit CVV
    const isValid = /^\d{3}$/.test(cvv);

    return {
        isValid,
        message: isValid ? '' : 'CVV must be 3 digits'
    };
};

// Update the formatCardNumber method
const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    // Handle different card types
    if (value.startsWith('506')) { // Verve
        value = value.slice(0, 19); // Allow up to 19 digits for Verve
    } else {
        value = value.slice(0, 16); // 16 digits for other cards
    }

    // Format with spaces
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    cardForm.value.number = value;

    // Validate in real-time if length is sufficient
    if (value.replace(/\s/g, '').length >= 16) {
        const validation = validateCard(value);
        if (!validation.isValid) {
            toast.error(validation.message);
        }
    }
};

// Update the validateForm method
const validateForm = () => {
    const errors = [];

    // Card number validation
    const cardValidation = validateCard(cardForm.value.number);
    if (!cardValidation.isValid) {
        errors.push(cardValidation.message);
    }

    // CVV validation
    const cvvValidation = validateCVV(cardForm.value.cvv, cardValidation.type);
    if (!cvvValidation.isValid) {
        errors.push(cvvValidation.message);
    }

    // Expiry validation
    const expiryValidation = validateExpiry(cardForm.value.expiry);
    if (!expiryValidation.isValid) {
        errors.push(expiryValidation.message);
    }

    // Card holder validation
    const holderName = cardForm.value.holderName.trim();
    if (!holderName) {
        errors.push('Cardholder name is required');
    } else if (!/^[a-zA-Z\s]+$/.test(holderName)) {
        errors.push('Cardholder name can only contain letters and spaces');
    }

    return errors;
};

// Sample test card numbers (add to your documentation)
const testCards = {
    visa: '4084084084084081',
    mastercard: '5531886652142950',
    verve: '5061460410120223210'
};

// Helper to format expiry date
const formatExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    cardForm.value.expiry = value;
};

// Updated handleAddCard method
const handleAddCard = async () => {
    try {
        const errors = validateForm();
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        const [month, year] = cardForm.value.expiry.split('/');
        const formattedCardData = {
            number: cardForm.value.number.replace(/\s/g, ''),
            holderName: cardForm.value.holderName.trim(),
            expiryMonth: month.padStart(2, '0'),
            expiryYear: year.length === 2 ? year : year.slice(-2),
            cvv: cardForm.value.cvv,
            setAsDefault: cardForm.value.setAsDefault,
            email: userStore.user.email
        };

        await paymentStore.addCard(formattedCardData);
        showAddCardModal.value = false;
        cardForm.value = {
            number: '',
            holderName: '',
            expiry: '',
            cvv: '',
            setAsDefault: false
        };
        toast.success('Card added successfully');
    } catch (error) {
        console.error('Error adding card:', error);
        const errorMessage = error.response?.data?.message || 'Failed to add card. Please try again.';
        toast.error(errorMessage);
    }
};

// confirmDelete method
const confirmDelete = async () => {
    try {
        if (!cardToDelete.value) {
            toast.error('Invalid card selected');
            return;
        }

        // Set loading state
        isDeleting.value = true;

        // Attempt deletion
        await paymentStore.deleteCard(cardToDelete.value);

        // Close modal and show success message
        showDeleteModal.value = false;
        toast.success('Card deleted successfully');
    } catch (error) {
        console.error('Error deleting card:', error);
        toast.error(error.response?.data?.message || 'Failed to delete card. Please try again.');
    } finally {
        // Clean up
        cardToDelete.value = null;
        isDeleting.value = false;
    }
};

const showDeleteConfirmation = (cardId) => {
    if (!cardId) {
        toast.error('Invalid card selected');
        return;
    }
    cardToDelete.value = cardId;
    showDeleteModal.value = true;
};

// setDefaultCard method
const setDefaultCard = async (cardId) => {
    try {
        await paymentStore.setDefaultCard(cardId);
        toast.success('Default card updated successfully');
    } catch (error) {
        console.error('Error setting default card:', error);
        toast.error(error.response?.data?.message || 'Failed to update default card. Please try again.');
    }
};

// Update the add card button click handler
const handleAddCardClick = () => {
    if (savedCards.value.length >= 5) {
        showCardLimitModal.value = true;
    } else {
        showAddCardModal.value = true;
    }
};

const closeCardLimitModal = () => {
    showCardLimitModal.value = false;
};

const handleDeleteAndReplace = (cardId) => {
    cardToDeleteAndReplace.value = cardId;
    showDeleteReplaceModal.value = true;
};

const deleteAndAddNew = async (cardId) => {
    try {
        await paymentStore.deleteCard(cardId);
        showDeleteReplaceModal.value = false;
        showCardLimitModal.value = false;
        showAddCardModal.value = true;
        toast.success('Card deleted. You can now add a new card.');
    } catch (error) {
        console.error('Error deleting card:', error);
        toast.error(error.response?.data?.message || 'Failed to delete card. Please try again.');
    } finally {
        cardToDeleteAndReplace.value = null;
    }
};

</script>

<!-- Visa: 4084084084084081
Mastercard: 5531886652142950
Verve: 5061460410120223210 -->

<style scoped>
/* Enhanced animations and transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile-first approach: Disable hover effects and transforms on mobile */
@media (max-width: 768px) {

    .transform,
    .hover\:scale-105:hover {
        transform: none !important;
        transition: none !important;
    }

    /* Better touch targets for mobile */
    button {
        min-height: 44px;
    }

    /* Prevent zoom on input focus for iOS */
    input,
    select {
        font-size: 16px;
    }

    /* Reduce motion for better mobile performance */
    * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
    }
}

/* Enhanced focus states for accessibility */
.focus-within\:ring-2:focus-within {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Focus states for better accessibility */
button:focus,
input:focus,
select:focus {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

.delay-150 {
    animation-delay: 150ms;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.5;
    }

    50% {
        opacity: 0.25;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Enhanced shadow effects - Mobile optimized */
.shadow-xl {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
    .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
}

.shadow-2xl {
    box-shadow: 0 15px 30px -6px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
    .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
}

/* Custom scrollbar - Mobile optimized */
::-webkit-scrollbar {
    width: 4px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar {
        width: 8px;
    }
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar-track {
        border-radius: 4px;
    }
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
    border-radius: 2px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
    }
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #4f46e5, #7c3aed);
}

/* Form Styles - Mobile optimized */
.form-group {
    @apply space-y-1.5;
}

.form-label {
    @apply block text-sm font-medium text-gray-700;
}

.form-input {
    @apply w-full px-3 sm:px-4 py-2.5 pl-9 sm:pl-11 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm sm:text-base transition-all duration-200;
}

.form-input:focus {
    @apply border-indigo-500 ring-2 ring-indigo-500/20 outline-none bg-white;
}

.icon-input {
    @apply relative;
}

.input-icon {
    @apply absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400;
}

/* Custom checkbox styles */
input[type="checkbox"] {
    @apply rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer;
}

/* Button loading state */
.button-loading {
    @apply opacity-75 cursor-not-allowed;
}

/* Modal backdrop */
.modal-backdrop {
    @apply fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm;
}

/* Card hover effects - Desktop only */
@media (min-width: 769px) {
    .card-hover {
        @apply transition-all duration-300 hover:shadow-lg hover:border-indigo-500;
    }
}

/* Gradient text */
.gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600;
}

/* Mobile-specific improvements */
@media (max-width: 640px) {

    /* Better spacing for small screens */
    .space-y-6>*+* {
        margin-top: 1rem;
    }

    .space-y-4>*+* {
        margin-top: 0.75rem;
    }

    .space-y-3>*+* {
        margin-top: 0.5rem;
    }

    /* Ensure proper container spacing */
    .max-h-\[95vh\] {
        max-height: 95vh;
    }

    /* Better mobile scrolling */
    .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
    }

    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
    }

    /* Prevent horizontal overflow */
    .min-w-0 {
        min-width: 0;
    }

    /* Better text wrapping */
    .break-words {
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
    }

    .break-all {
        word-break: break-all;
    }

    .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

/* Responsive text sizing */
@media (max-width: 640px) {
    .text-4xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }

    .text-3xl {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .text-2xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }

    .text-xl {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }

    .text-lg {
        font-size: 1rem;
        line-height: 1.5rem;
    }
}

/* Better mobile input styling */
@media (max-width: 640px) {
    .pl-9 {
        padding-left: 2.25rem;
    }

    .pl-11 {
        padding-left: 2.25rem;
    }

    /* Better icon positioning for mobile */
    .absolute.left-3 {
        left: 0.75rem;
    }
}

/* Better mobile touch interactions */
@media (max-width: 768px) {

    /* Larger touch targets */
    button {
        min-height: 44px;
        min-width: 44px;
    }

    /* Better tap highlighting */
    button,
    input,
    label {
        -webkit-tap-highlight-color: rgba(99, 102, 241, 0.1);
    }

    /* Prevent text selection on labels */
    label {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Better focus indicators for mobile */
    button:focus,
    input:focus {
        outline: 3px solid #6366f1;
        outline-offset: 2px;
    }

    /* Ensure readable font sizes */
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
}

/* Ensure consistent button heights on mobile */
@media (max-width: 640px) {

    .py-2\.5,
    .py-3 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
}

/* Mobile-specific grid improvements */
@media (max-width: 640px) {
    .sm\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .lg\:grid-cols-3 {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-3 {
        grid-template-columns: 1fr;
    }
}

/* Better mobile modal positioning */
@media (max-width: 640px) {
    .fixed.inset-0 {
        padding: 0.5rem;
    }

    /* Improved modal layouts for mobile */
    .rounded-2xl {
        border-radius: 0.75rem;
    }

    .rounded-xl {
        border-radius: 0.5rem;
    }

    .p-8 {
        padding: 1rem;
    }

    .p-6 {
        padding: 1rem;
    }

    /* Better button spacing */
    .gap-6 {
        gap: 1rem;
    }

    .gap-4 {
        gap: 0.75rem;
    }

    .gap-3 {
        gap: 0.5rem;
    }
}

/* Optimized scrolling behavior */
.overflow-y-auto {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Tab navigation improvements for mobile */
@media (max-width: 640px) {
    .tab-navigation {
        padding-bottom: 0.75rem;
    }

    .tab-button {
        font-size: 0.875rem;
        padding-bottom: 0.75rem;
    }
}

/* Enhanced mobile accessibility */
@media (max-width: 768px) {

    /* Ensure minimum touch target sizes */
    .card-action-button {
        min-height: 44px;
        padding: 0.5rem 1rem;
    }

    /* Better contrast for mobile */
    .text-gray-400 {
        color: #6b7280;
    }

    .text-gray-600 {
        color: #4b5563;
    }
}

/* Print styles */
@media print {

    .shadow-xl,
    .shadow-2xl {
        box-shadow: none !important;
    }

    .bg-gradient-to-br,
    .bg-gradient-to-r {
        background: #ffffff !important;
    }

    .text-white {
        color: #000000 !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .border-gray-200 {
        border-color: #000000;
    }

    .text-gray-600 {
        color: #000000;
    }

    .bg-gray-50 {
        background-color: #ffffff;
    }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Better selection styles */
::selection {
    background-color: #6366f1;
    color: #ffffff;
}

::-moz-selection {
    background-color: #6366f1;
    color: #ffffff;
}
</style>
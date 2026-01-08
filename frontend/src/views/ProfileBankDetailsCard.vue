<!-- frontend/src/views/ProfileBankDetailsCard.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <!-- Enhanced Hero Header -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <div class="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div
                            class="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <Building class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ headerText }}</h1>
                    </div>
                    <p class="text-sm sm:text-base lg:text-lg text-white/90">{{ subHeaderText }}</p>
                </div>
            </div>
        </div>

        <!-- Demo Mode Banner -->
        <div v-if="paymentStore.isDemoMode" class="container mx-auto px-4 mt-4 sm:mt-6">
            <div
                class="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="flex items-start sm:items-center space-x-3">
                    <div class="flex-shrink-0 bg-yellow-100 rounded-lg p-2">
                        <AlertCircle class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="text-sm font-semibold text-yellow-800">Demo Mode Active</h3>
                        <p class="text-xs sm:text-sm text-yellow-700 mt-1 break-words">
                            This is a demo environment using mock bank verification. Any 10-digit number can be used for
                            testing.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bank Details Content -->
        <div :class="[
            'container mx-auto px-4 relative z-10',
            paymentStore.isDemoMode ? '-mt-3 sm:-mt-5' : '-mt-20 sm:-mt-32 lg:-mt-44'
        ]">
            <div class="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <!-- Main Card with Enhanced Design -->
                <div
                    class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 backdrop-blur-lg bg-white/95">

                    <!-- Empty State -->
                    <div v-if="!hasBankDetails" class="p-4 sm:p-6 lg:p-8">
                        <div class="flex flex-col items-center py-8 sm:py-12 lg:py-16 space-y-6 sm:space-y-8">
                            <div class="relative">
                                <div
                                    class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                    <Landmark class="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
                                </div>
                                <div
                                    class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                    <PlusCircle class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                </div>
                            </div>
                            <div class="text-center space-y-2 sm:space-y-3 max-w-md px-4">
                                <h3 class="text-xl sm:text-2xl font-bold text-gray-900">{{ emptyStateTitle }}</h3>
                                <p class="text-gray-600 leading-relaxed text-sm sm:text-base">{{ emptyStateSubtitle }}
                                </p>
                            </div>
                            <button @click="openForm"
                                class="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                                <PlusCircle
                                    class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                                <span class="font-semibold">Add Bank Details</span>
                            </button>
                        </div>
                    </div>

                    <!-- Bank Details Display -->
                    <div v-else class="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                        <!-- Header Section -->
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                            <div class="flex items-center space-x-3 sm:space-x-4">
                                <div class="relative">
                                    <div
                                        class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                        <Building class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <div
                                        class="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <Check class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h2 class="text-lg sm:text-2xl font-bold text-gray-900">Your Bank Account</h2>
                                    <p class="text-gray-600 text-sm sm:text-base">Verified and ready for transactions
                                    </p>
                                </div>
                            </div>
                            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                <button @click="handleDelete"
                                    class="group px-3 sm:px-4 py-2 sm:py-2.5 text-red-600 font-medium hover:text-white hover:bg-red-600 rounded-lg sm:rounded-xl border-2 border-red-600 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base">
                                    <Trash2 class="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-pulse" />
                                    <span>Delete</span>
                                </button>
                                <button @click="handleEdit"
                                    class="group px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium hover:from-indigo-500 hover:to-purple-600 hover:text-white rounded-lg sm:rounded-xl border-2 border-indigo-200 hover:border-transparent transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base">
                                    <Edit
                                        class="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-200" />
                                    <span>Edit Details</span>
                                </button>
                            </div>
                        </div>

                        <!-- Bank Account Details with Modern Card Design -->
                        <div
                            class="bg-gradient-to-br from-gray-50 via-white to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-gray-100 shadow-inner">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                <div class="space-y-4 sm:space-y-6">
                                    <div class="group">
                                        <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                            <div
                                                class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <User class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                            </div>
                                            <p
                                                class="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                Account Name</p>
                                        </div>
                                        <p
                                            class="text-base sm:text-lg font-bold text-gray-900 ml-8 sm:ml-11 break-words">
                                            {{ user.paystack?.accountName || 'N/A' }}</p>
                                    </div>

                                    <div class="group">
                                        <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                            <div
                                                class="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Building class="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                            </div>
                                            <p
                                                class="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                Bank Name</p>
                                        </div>
                                        <p
                                            class="text-base sm:text-lg font-bold text-gray-900 ml-8 sm:ml-11 break-words">
                                            {{
                                                getBankName(user.paystack?.bankCode) || 'N/A' }}</p>
                                    </div>
                                </div>

                                <div class="space-y-4 sm:space-y-6">
                                    <div class="group">
                                        <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                            <div
                                                class="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <CreditCard class="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                                            </div>
                                            <p
                                                class="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                Account Number</p>
                                        </div>
                                        <p class="text-base sm:text-lg font-bold text-gray-900 font-mono ml-8 sm:ml-11">
                                            {{
                                                user.paystack?.accountNumber || 'N/A' }}</p>
                                    </div>

                                    <div v-if="user?.isSeller" class="group">
                                        <div class="flex items-center gap-2 sm:gap-3 mb-2">
                                            <div
                                                class="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <Calendar class="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                                            </div>
                                            <p
                                                class="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                                Payout Schedule</p>
                                        </div>
                                        <p
                                            class="text-base sm:text-lg font-bold text-gray-900 capitalize ml-8 sm:ml-11">
                                            {{
                                                user.paystack?.payoutSchedule || 'N/A' }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Additional Features for Sellers -->
                            <div v-if="user?.isSeller" class="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                                    <div class="flex items-center gap-2 sm:gap-3">
                                        <div
                                            class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                                            <Wallet class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-gray-900 text-sm sm:text-base">Payment
                                                Processing Active</h4>
                                            <p class="text-xs sm:text-sm text-gray-600">Ready to receive customer
                                                payments</p>
                                        </div>
                                    </div>
                                    <div
                                        class="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium text-center">
                                        ✓ Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Bank Details Form Modal -->
        <div v-if="showForm"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div
                class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden flex flex-col">
                <!-- Modern Modal Header -->
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6 lg:p-8 text-white flex-shrink-0">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                                <Building class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="text-lg sm:text-2xl font-bold">Add Bank Account</h3>
                                <p class="text-indigo-100 text-xs sm:text-sm mt-1 hidden sm:block">Enter your banking
                                    details securely</p>
                            </div>
                        </div>
                        <button @click="closeForm"
                            class="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors flex-shrink-0">
                            <X class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Enhanced Form Content -->
                <div class="flex-1 overflow-y-auto">
                    <form @submit.prevent="saveBankDetails" class="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                        <!-- Account Name -->
                        <div class="space-y-2 sm:space-y-3">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <User class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                Account Name
                            </label>
                            <div class="relative group">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <User
                                        class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input type="text" v-model="form.accountName"
                                    class="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-sm sm:text-base"
                                    placeholder="Enter account holder name">
                            </div>
                        </div>

                        <!-- payment method selection -->
                        <div class="space-y-2 sm:space-y-3">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <CreditCard class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                Payment Method
                            </label>
                            <div class="relative group">
                                <select v-model="form.paymentMethod"
                                    class="w-full px-3 sm:px-4 py-3 sm:py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 appearance-none text-sm sm:text-base">
                                    <option value="">Select Payment Method</option>
                                    <option value="Paystack">Paystack</option>
                                    <option value="OPay">OPay</option>
                                </select>
                            </div>
                        </div>

                        <!-- Bank Name -->
                        <div class="space-y-2 sm:space-y-3">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Building class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                Bank Name
                            </label>
                            <div class="relative group">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                                    <Building
                                        class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <select v-model="form.bankName"
                                    class="w-full pl-9 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 appearance-none text-sm sm:text-base">
                                    <option value="">Select Bank</option>
                                    <option v-for="bank in availableBanks" :key="bank.code" :value="bank.code">
                                        {{ bank.name }}
                                    </option>
                                </select>
                                <div
                                    class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                                    <ChevronDown class="h-4 h-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <!-- Account Number -->
                        <div class="space-y-2 sm:space-y-3">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <CreditCard class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                Account Number
                            </label>
                            <div class="relative group">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <CreditCard
                                        class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input type="text" :value="form.accountNumber" @input="handleAccountNumberChange"
                                    class="w-full pl-9 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-sm sm:text-base"
                                    placeholder="Enter 10-digit account number">
                                <div class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                                    <template v-if="verifying">
                                        <Loader2 class="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-indigo-500" />
                                    </template>
                                    <template v-else-if="verifiedAccount">
                                        <div
                                            class="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <Check class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- Payout Schedule -->
                        <div v-if="user?.isSeller" class="space-y-2 sm:space-y-3">
                            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Calendar class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                Payout Schedule
                            </label>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <label
                                    class="group flex items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer hover:bg-indigo-50 transition-all duration-200"
                                    :class="[form.payoutSchedule === 'daily' ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20' : 'border-gray-200 hover:border-indigo-300']">
                                    <input type="radio" v-model="form.payoutSchedule" value="daily" class="sr-only">
                                    <div class="text-center">
                                        <div class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 rounded-lg flex items-center justify-center"
                                            :class="[form.payoutSchedule === 'daily' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600']">
                                            <Calendar class="w-3 h-3 sm:w-4 sm:h-4" />
                                        </div>
                                        <span class="text-xs sm:text-sm font-medium text-gray-700">Daily</span>
                                    </div>
                                </label>
                                <label
                                    class="group flex items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer hover:bg-indigo-50 transition-all duration-200"
                                    :class="[form.payoutSchedule === 'weekly' ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20' : 'border-gray-200 hover:border-indigo-300']">
                                    <input type="radio" v-model="form.payoutSchedule" value="weekly" class="sr-only">
                                    <div class="text-center">
                                        <div class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 rounded-lg flex items-center justify-center"
                                            :class="[form.payoutSchedule === 'weekly' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600']">
                                            <Calendar class="w-3 h-3 sm:w-4 sm:h-4" />
                                        </div>
                                        <span class="text-xs sm:text-sm font-medium text-gray-700">Weekly</span>
                                    </div>
                                </label>
                                <label
                                    class="group flex items-center justify-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer hover:bg-indigo-50 transition-all duration-200"
                                    :class="[form.payoutSchedule === 'monthly' ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/20' : 'border-gray-200 hover:border-indigo-300']">
                                    <input type="radio" v-model="form.payoutSchedule" value="monthly" class="sr-only">
                                    <div class="text-center">
                                        <div class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 rounded-lg flex items-center justify-center"
                                            :class="[form.payoutSchedule === 'monthly' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600']">
                                            <Calendar class="w-3 h-3 sm:w-4 sm:h-4" />
                                        </div>
                                        <span class="text-xs sm:text-sm font-medium text-gray-700">Monthly</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </form>

                    <!-- Form Actions -->
                    <div
                        class="bg-gray-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 border-t border-gray-200">
                        <button type="button" @click="closeForm"
                            class="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1 text-sm sm:text-base">
                            Cancel
                        </button>
                        <button @click="saveBankDetails"
                            class="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 order-1 sm:order-2 text-sm sm:text-base">
                            <Wallet class="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Save Bank Details</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Delete Confirmation Modal -->
        <div v-if="showDeleteConfirm"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300">
                <!-- Modal Header -->
                <div class="p-4 sm:p-6 lg:p-8 text-center">
                    <div
                        class="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                        <AlertCircle class="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                    </div>
                    <h3 class="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Delete Bank Account</h3>
                    <p class="text-gray-600 leading-relaxed text-sm sm:text-base">
                        Are you sure you want to delete this bank account? This action cannot be undone and will affect
                        your
                        payment processing.
                    </p>
                </div>

                <!-- Modal Actions -->
                <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 pt-0">
                    <button @click="showDeleteConfirm = false"
                        class="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 order-2 sm:order-1 text-sm sm:text-base">
                        Cancel
                    </button>
                    <button @click="confirmDelete"
                        class="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 text-sm sm:text-base">
                        <Loader2 v-if="isDeleting" class="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        <Trash2 v-else class="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{{ isDeleting ? 'Deleting...' : 'Delete Account' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useUserStore } from '../store/user';
import { usePaymentStore } from '../store/paymentStore.js';
import { Landmark, PlusCircle, X, User, Building, CreditCard, Edit, Trash2, AlertCircle, Calendar, Wallet, Loader2, Check } from 'lucide-vue-next';

import { toast } from 'vue-sonner';

const userStore = useUserStore();
const user = computed(() => userStore.user);
const paymentStore = usePaymentStore();
const selectedPaymentMethod = ref('Paystack');
const showForm = ref(false);
const isEditing = ref(false);
const availableBanks = ref([]);
const hasBankDetails = computed(() => {
    return !!(user.value?.paystack?.accountNumber && user.value?.paystack?.bankCode);
});

const form = ref({
    accountName: '',
    bankName: '',
    accountNumber: '',
    payoutSchedule: 'weekly',
    paymentMethod: 'Paystack'
});

const verifying = ref(false);
const verifiedAccount = ref(null);
const isDemo = computed(() => paymentStore.isDemoMode);
const showDeleteConfirm = ref(false);

// Computed properties for conditional text
const headerText = computed(() => {
    return user.value?.isSeller ? 'Receive Payments' : 'Bank Details';
});

const subHeaderText = computed(() => {
    return user.value?.isSeller
        ? 'Manage your payment information for receiving customer payments'
        : 'Manage your bank account information';
});

const emptyStateTitle = computed(() => {
    return user.value?.isSeller
        ? "You haven't added your payment details"
        : "You haven't added any bank account yet";
});

const emptyStateSubtitle = computed(() => {
    return user.value?.isSeller
        ? 'Add your bank details to receive payments from customers'
        : 'Add your bank details to manage your banking information';
});

const getDefaultBackground = () => {
    return `linear-gradient(135deg, rgba(49, 49, 49, 0.03) 0%, rgba(49, 49, 49, 0.03) 50%,rgba(252, 252, 252, 0.03) 50%, rgba(252, 252, 252, 0.03) 100%), linear-gradient(45deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 50%,rgba(220, 220, 220, 0.03) 50%, rgba(220, 220, 220, 0.03) 100%), linear-gradient(90deg, #ff934b, #ff5e62)`;
};

// Convert bank code to display name
const getBankName = (bankCode) => {
    const bank = availableBanks.value.find(b => b.code === bankCode);
    return bank ? bank.name : (user.value?.paystack?.bankName || 'N/A');
};

const openForm = async () => {
    if (hasBankDetails.value) {
        // Pre-fill form if editing existing details
        form.value = {
            accountName: user.value.paystack?.accountName || '',
            bankName: user.value.paystack?.bankCode || '',
            accountNumber: user.value.paystack?.accountNumber || '',
            payoutSchedule: user.value.paystack?.payoutSchedule || 'weekly',
            paymentMethod: user.value.paystack?.paymentMethod || 'Paystack'
        };
        isEditing.value = true;
    } else {
        // Reset form for new entry
        form.value = {
            accountName: user.value.fullName || '',
            bankName: '',
            accountNumber: '',
            payoutSchedule: 'weekly',
            paymentMethod: 'Paystack'
        };
        isEditing.value = false;
    }
    // Reset verification state
    verifiedAccount.value = null;
    verifying.value = false;
    showForm.value = true;

    // Load banks based on payment method
    await loadBanks(form.value.paymentMethod);
};

// Add method to load banks based on payment method
const loadBanks = async (paymentMethod) => {
    try {
        if (paymentMethod === 'OPay') {
            const banks = await paymentStore.getOpayBanks();
            availableBanks.value = banks.map(bank => ({
                code: bank.code,
                name: bank.name
            }));
        } else {
            const banks = await paymentStore.fetchPaystackBanks();
            availableBanks.value = banks.map(bank => ({
                code: bank.code,
                name: bank.name
            }));
        }
    } catch (error) {
        console.error('Error loading banks:', error);
        // Fallback to minimal list if API fails
        availableBanks.value = [
            { code: '044', name: 'Access Bank' },
            { code: '058', name: 'GTBank' },
            { code: '057', name: 'Zenith Bank' }
        ];
    }
};

onMounted(async () => {
    // Initial bank load for Paystack
    await loadBanks('Paystack');
});

const closeForm = () => {
    showForm.value = false;
    isEditing.value = false;
    // Reset form and verification states
    form.value = {
        accountName: '',
        bankName: '',
        accountNumber: '',
        payoutSchedule: 'weekly',
        paymentMethod: 'Paystack'
    };
    verifiedAccount.value = null;
    verifying.value = false;
};

const verifyAccount = async () => {
    // Show different messages based on mode
    if (!form.value.accountNumber || !form.value.bankName) {
        toast.error(
            paymentStore.isDemoMode
                ? 'Please enter any 10 digits for demo'
                : 'Please enter account number and select bank'
        );
        return;
    }

    try {
        verifying.value = true;
        const response = await paymentStore.verifyBankAccount({
            accountNumber: form.value.accountNumber.trim(),
            bankCode: form.value.bankName,
            paymentMethod: form.value.paymentMethod
        });

        if (response.status) {
            verifiedAccount.value = response.data;
            // Always update accountName when verified, unless it's demo mode and we want to keep it simple
            if (!paymentStore.isDemoMode) {
                form.value.accountName = response.data.account_name;
            } else {
                // In demo mode, if backend doesn't return a name, use a placeholder
                form.value.accountName = response.data.account_name || 'Demo Account';
            }
            toast.success('Account verified successfully');
        }
    } catch (error) {
        console.error('Verification error:', error);
        toast.error(error.message || 'Failed to verify account');
        verifiedAccount.value = null;
    } finally {
        verifying.value = false;
    }
};

// Update account number input to trigger verification on complete input
const handleAccountNumberChange = (e) => {
    const value = formatAccountNumber(e.target.value);
    form.value.accountNumber = value;

    // Reset verification if number changes
    if (verifiedAccount.value) {
        verifiedAccount.value = null;
    }

    // Auto-verify when 10 digits are entered AND bank is selected
    if (value.length === 10 && form.value.bankName) {
        verifyAccount();
    }
};

// watch for bank selection to trigger verification if account number is complete
watch(() => form.value.bankName, (newBank) => {
    if (newBank && form.value.accountNumber.length === 10) {
        verifyAccount();
    }
});

// Watch for payment method changes
watch(() => form.value.paymentMethod, async (newMethod) => {
    await loadBanks(newMethod);
    form.value.bankName = '';
    verifiedAccount.value = null;
});

const formatAccountNumber = (value) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Truncate to 10 digits
    return cleaned.slice(0, 10);
};

const saveBankDetails = async () => {
    try {
        // Ensure account is verified before saving
        if (!verifiedAccount.value) {
            toast.error('Please verify account details first');
            return;
        }

        // Validate account number format again
        if (!/^\d{10}$/.test(form.value.accountNumber)) {
            toast.error('Invalid account number format');
            return;
        }

        // Show loading state
        const loadingToast = toast.loading('Saving bank details...');

        try {
            const bank = availableBanks.value.find(b => b.code === form.value.bankName);
            const bankDetails = {
                accountName: verifiedAccount.value.account_name || form.value.accountName,
                accountNumber: form.value.accountNumber.trim(),
                bankCode: form.value.bankName,
                bankName: bank ? bank.name : '',
                paymentMethod: form.value.paymentMethod,
                payoutSchedule: user.value?.isSeller ? form.value.payoutSchedule : undefined
            };

            const response = await paymentStore.updateBankDetails(bankDetails);

            if (response.status) {
                toast.dismiss(loadingToast);
                toast.success('Bank details saved successfully');
                showForm.value = false;
                await userStore.getUserProfile();
            } else {
                toast.dismiss(loadingToast);
                toast.error(response.message || 'Failed to save bank details');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save bank details';
            toast.error(errorMessage);
            console.error('Error saving bank details:', error);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred. Please try again.');
    }
};

const handleEdit = () => {
    form.value = {
        accountName: user.value.paystack?.accountName || '',
        bankName: user.value.paystack?.bankCode || '',
        accountNumber: user.value.paystack?.accountNumber || '',
        payoutSchedule: user.value.paystack?.payoutSchedule || 'weekly',
        paymentMethod: user.value.paystack?.paymentMethod || 'Paystack'
    };
    isEditing.value = true;
    showForm.value = true;
    loadBanks(form.value.paymentMethod);
};

const handleDelete = () => {
    showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
    const loadingToast = toast.loading('Removing bank account...');
    try {
        await paymentStore.deleteBankDetails();
        toast.dismiss(loadingToast);
        toast.success('Bank account removed successfully');
        showDeleteConfirm.value = false;
        await userStore.getUserProfile();
    } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(error.message || 'Failed to remove bank account');
    }
};

</script>

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
.focus\:ring-2:focus,
.focus\:ring-4:focus {
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

/* Gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Modal backdrop blur */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
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

/* Form input styling - Mobile optimized */
input,
select {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Better touch interaction for mobile forms */
@media (max-width: 768px) {

    input,
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    /* Better tap highlighting */
    button,
    input,
    select,
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
}

/* Radio button custom styling - Mobile optimized */
input[type="radio"] {
    appearance: none;
}

/* Mobile-specific improvements */
@media (max-width: 640px) {

    /* Better spacing for small screens */
    .space-y-8>*+* {
        margin-top: 1.5rem;
    }

    .space-y-6>*+* {
        margin-top: 1rem;
    }

    .space-y-4>*+* {
        margin-top: 0.75rem;
    }

    /* Ensure proper container spacing */
    .max-h-\[95vh\] {
        max-height: 95vh;
    }

    /* Better mobile scrolling */
    .overflow-y-auto {
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

/* Better mobile modal positioning */
@media (max-width: 640px) {
    .fixed.inset-0 {
        padding: 0.5rem;
    }

    /* Improved form layouts for mobile */
    .grid {
        gap: 0.75rem;
    }

    .rounded-3xl {
        border-radius: 1rem;
    }

    .rounded-2xl {
        border-radius: 0.75rem;
    }

    .p-8 {
        padding: 1rem;
    }

    .p-6 {
        padding: 1rem;
    }

    /* Better button spacing */
    .gap-4 {
        gap: 0.75rem;
    }

    .gap-3 {
        gap: 0.5rem;
    }
}

/* Payout schedule radio buttons - Mobile stacked layout */
@media (max-width: 640px) {
    .sm\:grid-cols-3 {
        grid-template-columns: 1fr;
    }
}

/* Better mobile touch interactions */
@media (max-width: 768px) {

    /* Larger touch targets */
    button {
        min-height: 44px;
        min-width: 44px;
    }

    /* Better focus indicators for mobile */
    button:focus,
    input:focus,
    select:focus {
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

/* Custom modal animations for mobile */
@media (max-width: 768px) {
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }

        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-enter {
        animation: slideUp 0.3s ease-out;
    }
}

/* Optimized scrolling behavior */
.overflow-y-auto {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Mobile-specific grid improvements */
@media (max-width: 768px) {
    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .lg\:grid-cols-3 {
        grid-template-columns: 1fr;
    }
}

/* Ensure consistent button heights on mobile */
@media (max-width: 640px) {

    .py-2\.5,
    .py-3,
    .py-4 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
}

/* Mobile form input improvements */
@media (max-width: 640px) {
    .pl-9 {
        padding-left: 2.25rem;
    }

    .pl-12 {
        padding-left: 2.25rem;
    }

    /* Better icon positioning for mobile */
    .absolute.left-0 {
        left: 0.75rem;
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

/* Ensure proper stacking context */
.relative {
    position: relative;
    z-index: 1;
}

/* Form group improvements */
.form-group {
    @apply space-y-1.5;
}

.form-label {
    @apply block text-sm font-medium text-gray-700;
}

.form-input {
    @apply w-full px-4 py-2.5 pl-11 bg-transparent border-none focus:outline-none text-gray-700;
}

.form-input:focus {
    @apply ring-2 ring-indigo-500/20;
}

.icon-input {
    @apply relative;
}

.input-icon {
    @apply absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400;
}

/* Custom radio styles */
.radio-container {
    @apply flex items-center space-x-6;
}

.radio-label {
    @apply flex items-center cursor-pointer;
}

.radio-button {
    @apply relative w-5 h-5 border-2 border-gray-300 rounded-full transition-all duration-200;
}

.radio-input:checked+.radio-button {
    @apply border-indigo-500;
}

.radio-button::after {
    content: '';
    @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-indigo-500 scale-0 transition-transform duration-200;
}

.radio-input:checked+.radio-button::after {
    @apply scale-100;
}

/* Button States */
.button-loading {
    @apply opacity-75 cursor-not-allowed;
}

/* Modal backdrop */
.modal-backdrop {
    @apply fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm;
}

/* Card hover effects */
.card-hover {
    @apply transition-all duration-300 hover:shadow-lg hover:border-indigo-500;
}

/* Gradient text */
.gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500;
}
</style>
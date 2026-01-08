<template>
  <div v-if="currentOrder"
    class="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
    <!-- Order Header with Gradient -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-4 sm:p-6">
      <div class="flex flex-col gap-4">
        <div class="flex-1">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span class="text-xs sm:text-sm font-semibold text-gray-600">Order ID:</span>
            </div>
            <a href="#"
              class="text-blue-600 hover:text-blue-700 font-mono text-xs sm:text-sm bg-blue-50 px-2 py-1 rounded-md transition-colors self-start">
              {{ currentOrder.orderId }}
            </a>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Order Placed on {{ formatDate(currentOrder.createdAt) }}
          </p>
        </div>

        <!-- Status and Actions - Mobile Layout -->
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <!-- Status Badge -->
          <span
            class="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm self-start"
            :class="getStatusClass(currentOrder.status)">
            <div class="w-2 h-2 rounded-full mr-2" :class="currentOrder.status === 'Delivered' ? 'bg-green-400' :
              currentOrder.status === 'Cancelled' ? 'bg-red-400' : 'bg-yellow-400'"></div>
            {{ currentOrder.status }}
          </span>

          <!-- Order Details Button -->
          <button @click="viewOrderDetails"
            class="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-white text-orange-600 hover:text-white hover:bg-orange-600 font-medium text-xs sm:text-sm border-2 border-orange-600 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
              </path>
            </svg>
            View Details
          </button>
        </div>
      </div>

      <!-- Enhanced Seller Information -->
      <div v-if="sellerInfo" class="mt-4 p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Store class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span class="font-semibold text-gray-900 text-sm sm:text-base">{{ sellerInfo.storeName }}</span>
                <div v-if="sellerInfo.isVerified"
                  class="flex items-center bg-blue-100 px-2 py-1 rounded-full self-start">
                  <BadgeCheck class="w-3 h-3 text-blue-600 mr-1" />
                  <span class="text-xs text-blue-600 font-medium">Verified</span>
                </div>
              </div>
              <div class="flex items-center text-amber-500 mt-1">
                <Star class="w-3 h-3 sm:w-4 sm:h-4 fill-current mr-1" />
                <span class="text-xs sm:text-sm font-medium">{{ sellerInfo.averageRating || 0 }}</span>
                <span class="text-xs text-gray-500 ml-1">({{ sellerInfo.totalReviews || 0 }} reviews)</span>
              </div>
            </div>
          </div>
          <button @click="contactSeller"
            class="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 self-start sm:self-auto">
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
              </path>
            </svg>
            Contact
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Timeline Component -->
    <div class="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
      <OrderTimeline :order="currentOrder" class="p-4 sm:p-6" />
    </div>

    <!-- Products Section with Modern Cards -->
    <div class="p-4 sm:p-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-6 sm:py-8">
        <div class="relative">
          <div class="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-3 border-blue-500 rounded-full border-t-transparent">
          </div>
          <div
            class="absolute inset-0 animate-ping h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-300 rounded-full opacity-75">
          </div>
        </div>
      </div>

      <!-- Multiple Products Display -->
      <div class="space-y-3 sm:space-y-4">
        <div v-for="(product, index) in orderProducts" :key="index"
          class="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg sm:rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">

          <!-- Product Image with Modern Styling -->
          <div class="w-full sm:w-24 lg:w-32 h-24 sm:h-24 lg:h-32 relative group">
            <div
              class="w-full h-full border-2 border-gray-200 rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-shadow">
              <img :src="product.product?.images?.[0] || '/placeholder-image.jpg'" :alt="product.product?.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg sm:rounded-xl">
              </div>
            </div>
          </div>

          <!-- Product Details with Enhanced Typography -->
          <div class="flex-1 space-y-2 sm:space-y-3">
            <div>
              <h3 class="font-semibold text-gray-900 text-sm sm:text-lg leading-tight">
                {{ product.product?.name || 'Product Name Not Available' }}
              </h3>
              <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span class="text-gray-600">Quantity:</span>
                  <span class="font-semibold text-gray-900">{{ product.quantity }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span class="text-gray-600">Unit Price:</span>
                  <span class="font-semibold text-gray-900">₦{{ formatAmount(product.product?.price || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions with Modern Buttons -->
            <div class="flex flex-wrap gap-2">
              <button v-if="currentOrder.status === 'Delivered'" @click="rateProduct(product)"
                class="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-md sm:rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-sm">
                <Star class="w-3 h-3 mr-1" />
                Rate Product
              </button>
              <button @click="reorderProduct(product)"
                class="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-md sm:rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-sm">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                  </path>
                </svg>
                Buy Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Order Summary -->
      <div
        class="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl border border-gray-200">
        <div class="flex flex-col gap-3 sm:gap-4">
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div class="flex items-center gap-2">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <span class="text-xs sm:text-sm text-gray-600">Payment Method:</span>
              </div>
              <span class="font-semibold text-gray-900 bg-white px-2 py-1 rounded-md text-xs sm:text-sm self-start">{{
                currentOrder.paymentMethod }}</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div class="flex items-center gap-2">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                  </path>
                </svg>
                <span class="text-xs sm:text-sm text-gray-600">Total Amount:</span>
              </div>
              <span class="font-bold text-base sm:text-lg text-gray-900">₦{{ formatAmount(currentOrder.totalAmount)
                }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Action Buttons -->
      <div class="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
        <button v-if="canModifyOrder" @click="handleModifyOrder"
          class="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm text-xs sm:text-sm">
          <Pencil class="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Modify Order</span>
        </button>

        <button @click="handleTrackOrder"
          class="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm text-xs sm:text-sm">
          <MapPin class="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Track Order</span>
        </button>

        <button @click="handlePrintOrder"
          class="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm text-xs sm:text-sm">
          <PrinterCheck class="w-3 h-3 sm:w-4 sm:h-4" />
          <span class="hidden sm:inline">Print Receipt</span>
          <span class="sm:hidden">Print</span>
        </button>

        <button v-if="canCancelOrder" @click="handleCancelOrder"
          class="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm text-xs sm:text-sm">
          <X class="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Cancel Order</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Enhanced Order Details Modal -->
  <div v-if="showOrderDetailsModal"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
    <div
      class="bg-white w-full max-w-4xl rounded-lg sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
      <!-- Modal Header with Gradient -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg sm:text-xl font-bold">Order Details</h3>
            <p class="text-blue-100 text-xs sm:text-sm mt-1">Complete order information</p>
          </div>
          <button @click="showOrderDetailsModal = false"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors close-button">
            <X class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <!-- Modal Content with Modern Styling -->
      <div class="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)]">
        <!-- Order ID and Date -->
        <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <p class="text-base sm:text-lg font-bold text-gray-900">Order #{{ currentOrder.orderId }}</p>
              <p class="text-xs sm:text-sm text-gray-600 flex items-center gap-2 mt-1">
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Placed on {{ formatDate(currentOrder.createdAt) }}
              </p>
            </div>
            <span :class="getStatusClass(currentOrder.status)"
              class="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium self-start">
              {{ currentOrder.status }}
            </span>
          </div>
        </div>

        <!-- Seller Info with Enhanced Design -->
        <div v-if="sellerInfo"
          class="mb-4 sm:mb-6 p-3 sm:p-4 bg-white border-2 border-gray-100 rounded-lg sm:rounded-xl">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Store class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span class="font-bold text-gray-900 text-sm sm:text-base">{{ sellerInfo.storeName }}</span>
                  <div v-if="sellerInfo.isVerified"
                    class="flex items-center bg-blue-100 px-2 py-1 rounded-full self-start">
                    <BadgeCheck class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-1" />
                    <span class="text-xs text-blue-600 font-medium">Verified</span>
                  </div>
                </div>
                <div class="flex items-center text-amber-500 mt-1">
                  <Star class="w-3 h-3 sm:w-4 sm:h-4 fill-current mr-1" />
                  <span class="text-xs sm:text-sm font-medium">{{ sellerInfo.averageRating || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products with Modern Cards -->
        <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <h4 class="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Order Items
          </h4>
          <div class="grid gap-3 sm:gap-4">
            <div v-for="product in orderProducts" :key="product._id"
              class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-md transition-all">
              <div
                class="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-200 rounded-lg sm:rounded-xl overflow-hidden bg-white">
                <img :src="product.product?.images?.[0] || '/placeholder-image.jpg'" :alt="product.product?.name"
                  class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900 text-sm sm:text-base">{{ product.product?.name }}</p>
                <div class="mt-2 space-y-1">
                  <div class="flex items-center gap-2 text-xs sm:text-sm">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span class="text-gray-600">Quantity:</span>
                    <span class="font-medium">{{ product.quantity }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs sm:text-sm">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span class="text-gray-600">Price:</span>
                    <span class="font-medium">₦{{ formatAmount(product.product?.price) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary with Modern Design -->
        <div
          class="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl border-2 border-gray-100">
          <h4 class="font-bold text-gray-900 mb-3 text-sm sm:text-base">Order Summary</h4>
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-1">
              <span class="text-gray-600">Payment Method</span>
              <span class="font-semibold bg-white px-2 py-1 rounded-md self-start sm:self-auto">{{
                currentOrder.paymentMethod }}</span>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-200 gap-1">
              <span class="text-gray-900">Total Amount</span>
              <span class="text-gray-900">₦{{ formatAmount(currentOrder.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Shipping Address with Enhanced Styling -->
        <div v-if="currentOrder.address"
          class="mt-4 sm:mt-6 p-3 sm:p-4 bg-white border-2 border-gray-100 rounded-lg sm:rounded-xl">
          <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Shipping Address
          </h4>
          <div class="text-xs sm:text-sm text-gray-700 space-y-1">
            <p class="font-medium">{{ currentOrder.address.street }}</p>
            <p>{{ currentOrder.address.city }}, {{ currentOrder.address.state }}</p>
            <p>{{ currentOrder.address.country }} {{ currentOrder.address.postalCode }}</p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 sm:p-6 border-t bg-gray-50 flex justify-end modal-footer">
        <button @click="showOrderDetailsModal = false"
          class="px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm sm:text-base">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Order Tracking Modal -->
  <div v-if="showTrackingModal"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
    <div class="bg-white w-full max-w-2xl rounded-lg sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white rounded-t-lg sm:rounded-t-2xl">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg sm:text-xl font-bold">Track Your Order</h3>
            <p class="text-blue-100 text-xs sm:text-sm mt-1">Real-time order tracking</p>
          </div>
          <button @click="showTrackingModal = false" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="p-4 sm:p-6">
        <!-- Order Info -->
        <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl">
          <p class="font-bold text-gray-900 text-sm sm:text-base">Order #{{ currentOrder.orderId }}</p>
          <p class="text-xs sm:text-sm text-gray-600">{{ formatDate(currentOrder.createdAt) }}</p>
        </div>

        <!-- Tracking Timeline -->
        <div class="space-y-4 sm:space-y-6">
          <div v-for="(status, index) in orderStatuses" :key="index" class="flex gap-3 sm:gap-4">
            <!-- Timeline Node -->
            <div class="relative flex flex-col items-center">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center shadow-sm"
                :class="getTimelineNodeClass(status)">
                <Check v-if="isCompleted(status)" class="w-4 h-4 sm:w-5 sm:h-5" />
                <Clock v-else-if="isCurrent(status)" class="w-4 h-4 sm:w-5 sm:h-5" />
                <div v-else class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
              </div>
              <div v-if="index !== orderStatuses.length - 1" class="w-px h-full bg-gray-200 absolute top-8 sm:top-10">
              </div>
            </div>

            <!-- Status Content -->
            <div class="flex-1 pb-4 sm:pb-6">
              <div class="p-3 rounded-lg"
                :class="isCurrent(status) ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'">
                <p class="font-semibold text-gray-900 text-sm sm:text-base">{{ status }}</p>
                <p class="text-xs sm:text-sm text-gray-600">{{ getStatusDescription(status) }}</p>
                <p v-if="getStatusTimestamp(status)" class="text-xs text-gray-500 mt-2">
                  {{ formatDate(getStatusTimestamp(status)) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Estimated Delivery -->
        <div v-if="currentOrder.status !== 'Cancelled'"
          class="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg sm:rounded-xl border border-orange-200">
          <div class="flex items-center gap-2">
            <Truck class="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            <span class="font-bold text-orange-800 text-sm sm:text-base">Estimated Delivery</span>
          </div>
          <p class="mt-1 text-xs sm:text-sm text-orange-700 font-medium">{{ getEstimatedDelivery() }}</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 sm:p-6 border-t bg-gray-50 flex justify-end rounded-b-lg sm:rounded-b-2xl">
        <button @click="showTrackingModal = false"
          class="px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm sm:text-base">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Enhanced Modify Order Modal -->
  <div v-if="showModifyModal"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
    <div
      class="bg-white w-full max-w-3xl rounded-lg sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-6 text-white">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg sm:text-xl font-bold">Modify Your Order</h3>
            <p class="text-green-100 text-xs sm:text-sm mt-1">Update quantities and shipping details</p>
          </div>
          <button @click="showModifyModal = false" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <!-- Modal Content -->
      <form @submit.prevent="submitModifyOrder"
        class="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-160px)] sm:max-h-[calc(90vh-180px)]">
        <!-- Products -->
        <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <h4 class="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Order Items
          </h4>
          <div v-for="(product, index) in orderProducts" :key="product._id"
            class="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg sm:rounded-xl">
            <div
              class="w-full sm:w-16 lg:w-20 h-16 sm:h-16 lg:h-20 border-2 border-gray-200 rounded-lg sm:rounded-xl overflow-hidden bg-white">
              <img :src="product.product?.images?.[0] || '/placeholder-image.jpg'" :alt="product.product?.name"
                class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900 mb-3 text-sm sm:text-base">{{ product.product?.name }}</p>
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label class="text-xs sm:text-sm font-medium text-gray-600">Quantity:</label>
                <div class="flex items-center gap-2">
                  <button type="button" @click="decrementQuantity(index)"
                    class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-sm">
                    <Minus class="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <input type="number" v-model.number="orderProducts[index].quantity" min="1"
                    class="w-12 sm:w-16 text-center border-2 border-gray-200 rounded-lg px-2 py-1 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-xs sm:text-sm"
                    @change="validateQuantity(index)">
                  <button type="button" @click="incrementQuantity(index)"
                    class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-sm">
                    <Plus class="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
              <p class="mt-2 text-xs sm:text-sm font-medium text-gray-700">
                Subtotal: <span class="text-green-600 font-bold">₦{{ formatAmount(product.product?.price *
                  product.quantity) }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="pt-4 sm:pt-6 border-t border-gray-200">
          <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Shipping Address
          </h4>
          <div class="space-y-3 sm:space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Street Address</label>
              <input type="text" v-model="modifyForm.address.street"
                class="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-sm">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">City</label>
                <input type="text" v-model="modifyForm.address.city"
                  class="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-sm">
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">State</label>
                <input type="text" v-model="modifyForm.address.state"
                  class="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-sm">
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Country</label>
                <input type="text" v-model="modifyForm.address.country"
                  class="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-sm">
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                <input type="text" v-model="modifyForm.address.postalCode"
                  class="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors text-sm">
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div
          class="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border-2 border-green-200">
          <h4 class="font-bold text-gray-900 mb-3 text-sm sm:text-base">Updated Order Summary</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-600">Total Items</span>
              <span class="font-semibold">{{ getTotalItems() }}</span>
            </div>
            <div class="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-green-200">
              <span class="text-gray-900">Total Amount</span>
              <span class="text-green-600">₦{{ formatAmount(calculateTotal()) }}</span>
            </div>
          </div>
        </div>
      </form>

      <!-- Modal Footer -->
      <div
        class="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 rounded-b-lg sm:rounded-b-2xl">
        <button @click="showModifyModal = false" type="button"
          class="px-4 sm:px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base order-2 sm:order-1">
          Cancel
        </button>
        <button @click="submitModifyOrder" :disabled="isSubmitting"
          class="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-sm text-sm sm:text-base order-1 sm:order-2">
          {{ isSubmitting ? 'Saving Changes...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Enhanced Print Order Modal -->
  <div v-if="showPrintModal"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
    <div
      class="bg-white w-full max-w-4xl rounded-lg sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div
        class="p-4 sm:p-6 border-b flex justify-between items-center no-print bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-t-lg sm:rounded-t-2xl">
        <div>
          <h3 class="text-lg sm:text-xl font-bold">Print Order Receipt</h3>
          <p class="text-gray-200 text-xs sm:text-sm mt-1">Professional order receipt</p>
        </div>
        <button @click="showPrintModal = false" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <X class="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <!-- Printable Content Area with Modern Design -->
      <div id="printableArea" class="py-6 sm:py-8 px-4 sm:px-10">
        <!-- Company Header with Modern Layout -->
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-gray-200">
          <div>
            <img src="../assets/images/logo.png" alt="logo" class="h-12 sm:h-16 mb-4">
            <div class="text-xs sm:text-sm text-gray-600">
              <p class="font-semibold">Bruthol Marketplace</p>
              <p>Professional E-commerce Platform</p>
              <p>support@bruthol.com | www.bruthol.com</p>
            </div>
          </div>
          <div class="text-center sm:text-right">
            <div class="bg-gray-100 p-3 sm:p-4 rounded-lg">
              <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${currentOrder.orderId}`"
                alt="Order QR Code" class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2" />
              <p class="text-xs text-gray-600">Scan for order details</p>
            </div>
          </div>
        </div>

        <!-- Order Information Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div class="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h3 class="text-gray-800 font-bold mb-3 flex items-center gap-2 text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
              Order Information
            </h3>
            <div class="space-y-2 text-xs sm:text-sm">
              <div class="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span class="text-gray-600">Order Date:</span>
                <span class="font-medium">{{ formatDate(currentOrder.createdAt) }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span class="text-gray-600">Order ID:</span>
                <span class="font-mono font-medium">#{{ currentOrder.orderId }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span class="text-gray-600">Payment Method:</span>
                <span class="font-medium">{{ currentOrder.paymentMethod }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium text-green-600">{{ currentOrder.status }}</span>
              </div>
            </div>
          </div>

          <div class="bg-green-50 p-3 sm:p-4 rounded-lg">
            <h3 class="text-gray-800 font-bold mb-3 flex items-center gap-2 text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Shipping Address
            </h3>
            <div class="space-y-1 text-xs sm:text-sm">
              <p class="font-medium">{{ currentOrder.address.street }}</p>
              <p>{{ currentOrder.address.city }}, {{ currentOrder.address.state }}</p>
              <p>{{ currentOrder.address.country }}, {{ currentOrder.address.postalCode }}</p>
            </div>
          </div>
        </div>

        <!-- Enhanced Products Table -->
        <div class="mb-6 sm:mb-8">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4">Order Items</h3>
          <div class="overflow-hidden border border-gray-200 rounded-lg">
            <!-- Mobile-friendly table -->
            <div class="block sm:hidden">
              <div v-for="product in orderProducts" :key="product._id" class="border-b border-gray-200 p-3 bg-white">
                <div class="font-medium text-gray-900 mb-2">{{ product.product?.name }}</div>
                <div class="text-xs text-gray-500 mb-2">SKU: {{ product.product?._id }}</div>
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span class="text-gray-600">Qty:</span>
                    <span class="font-medium ml-1">{{ product.quantity }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Price:</span>
                    <span class="font-medium ml-1">₦{{ formatAmount(product.product?.price) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Total:</span>
                    <span class="font-bold text-green-600 ml-1">₦{{ formatAmount(product.product?.price *
                      product.quantity) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Desktop table -->
            <table class="w-full hidden sm:table">
              <thead class="bg-gray-100">
                <tr>
                  <th class="py-3 px-4 text-left font-semibold text-gray-800 text-sm">Product</th>
                  <th class="py-3 px-4 text-center font-semibold text-gray-800 text-sm">Quantity</th>
                  <th class="py-3 px-4 text-right font-semibold text-gray-800 text-sm">Unit Price</th>
                  <th class="py-3 px-4 text-right font-semibold text-gray-800 text-sm">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in orderProducts" :key="product._id" class="hover:bg-gray-50">
                  <td class="py-4 px-4">
                    <div>
                      <p class="font-medium text-gray-900 text-sm">{{ product.product?.name }}</p>
                      <p class="text-xs text-gray-500">SKU: {{ product.product?._id }}</p>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-center font-medium text-sm">{{ product.quantity }}</td>
                  <td class="py-4 px-4 text-right font-medium text-sm">₦{{ formatAmount(product.product?.price) }}</td>
                  <td class="py-4 px-4 text-right font-bold text-green-600 text-sm">₦{{
                    formatAmount(product.product?.price * product.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Enhanced Totals Section -->
        <div class="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 mb-6 sm:mb-8">
          <div class="flex justify-between items-center text-lg sm:text-xl font-bold">
            <span class="text-gray-800">Total Amount:</span>
            <span class="text-green-600">₦{{ formatAmount(currentOrder.totalAmount) }}</span>
          </div>
        </div>

        <!-- Modern Footer -->
        <div class="text-center space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t-2 border-gray-200">
          <div class="bg-blue-50 p-4 sm:p-6 rounded-lg">
            <h4 class="text-lg sm:text-xl font-bold text-blue-800 mb-2">Thank you for choosing Bruthol!</h4>
            <p class="text-blue-700 text-sm sm:text-base">We appreciate your business and look forward to serving you
              again.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <div class="bg-white p-3 sm:p-4 rounded-lg border">
              <p class="font-semibold text-gray-800 mb-1">Customer Support</p>
              <p>support@bruthol.com</p>
              <p>+234 (0) 800-BRUTHOL</p>
            </div>
            <div class="bg-white p-3 sm:p-4 rounded-lg border">
              <p class="font-semibold text-gray-800 mb-1">Order Status</p>
              <p class="text-green-600 font-medium">{{ currentOrder.status }}</p>
            </div>
            <div class="bg-white p-3 sm:p-4 rounded-lg border">
              <p class="font-semibold text-gray-800 mb-1">Website</p>
              <p>www.bruthol.com</p>
            </div>
          </div>

          <!-- Barcode -->
          <div class="mt-6 sm:mt-8">
            <svg id="barcode" class="mx-auto"></svg>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div
        class="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50 no-print rounded-b-lg sm:rounded-b-2xl">
        <button type="button" @click="showPrintModal = false"
          class="px-4 sm:px-6 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base order-2 sm:order-1">
          Close
        </button>
        <button type="button" @click="printOrderDetails"
          class="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all transform hover:scale-105 shadow-sm text-sm sm:text-base order-1 sm:order-2">
          <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
            </path>
          </svg>
          Print Order
        </button>
      </div>
    </div>
  </div>

  <!-- Rating Modal -->
  <div v-if="showRatingModal"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
    <div class="bg-white w-full max-w-md rounded-lg sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 sm:p-6 text-white rounded-t-lg sm:rounded-t-2xl">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg sm:text-xl font-bold">Rate Product</h3>
            <p class="text-yellow-100 text-xs sm:text-sm mt-1">Share your experience</p>
          </div>
          <button @click="closeRatingModal" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="p-4 sm:p-6">
        <!-- Product Info -->
        <div v-if="selectedProductForRating" class="flex items-center gap-3 mb-4 sm:mb-6">
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-200 rounded-lg sm:rounded-xl overflow-hidden bg-white">
            <img :src="selectedProductForRating.product?.images?.[0] || '/placeholder-image.jpg'"
              :alt="selectedProductForRating.product?.name" class="w-full h-full object-cover">
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 text-sm sm:text-base">{{ selectedProductForRating.product?.name }}
            </h4>
            <p class="text-xs sm:text-sm text-gray-600">Rate this product</p>
          </div>
        </div>

        <!-- Rating Stars -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-3">Your Rating</label>
          <div class="flex gap-1 sm:gap-2 justify-center sm:justify-start">
            <button v-for="star in 5" :key="star" @click="rating = star"
              class="focus:outline-none transition-transform hover:scale-110">
              <svg class="w-8 h-8 sm:w-10 sm:h-10" :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </div>
          <div class="mt-2 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            {{ rating === 0 ? 'Select a rating' :
              rating === 1 ? 'Poor' :
                rating === 2 ? 'Fair' :
                  rating === 3 ? 'Good' :
                    rating === 4 ? 'Very Good' : 'Excellent' }}
          </div>
        </div>

        <!-- Review Text -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Your Review (Optional)</label>
          <textarea v-model="reviewText" rows="4"
            class="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-colors resize-none text-sm"
            placeholder="Share your thoughts about this product..."></textarea>
        </div>
      </div>

      <!-- Modal Footer -->
      <div
        class="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 rounded-b-lg sm:rounded-b-2xl">
        <button @click="closeRatingModal"
          class="px-4 sm:px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base order-2 sm:order-1">
          Cancel
        </button>
        <button @click="submitRating" :disabled="rating === 0 || isSubmittingRating"
          class="px-4 sm:px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-sm text-sm sm:text-base order-1 sm:order-2">
          {{ isSubmittingRating ? 'Submitting...' : 'Submit Rating' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore.js';
import { useUserStore } from '../store/user';
import { useSellerStore } from '../store/sellerStore';
import OrderTimeline from './OrderTimeline.vue';
import JsBarcode from 'jsbarcode';

import { computed, ref, onMounted, watch, nextTick } from 'vue';
import {
  Pencil, MapPin, Phone, PrinterCheck, X, Store,
  Star, BadgeCheck, Check, Clock, Truck, Minus, Plus
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

export default {
  name: 'ProfileOrderCard',
  components: {
    Pencil, MapPin, Phone, PrinterCheck, X, Store, Minus, Plus,
    Star, BadgeCheck, OrderTimeline, Check, Clock, Truck
  },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const orderStore = useOrderStore();
    const userStore = useUserStore();
    const productStore = useProductStore();
    const sellerStore = useSellerStore();

    const router = useRouter();
    const placeholderImage = '/placeholder-image.jpg';
    const productDetails = ref(null);

    const sellerInfo = ref(null);
    const orderProducts = ref([]);
    const isLoading = ref(false);

    const showOrderDetailsModal = ref(false);
    const showTrackingModal = ref(false);
    const showModifyModal = ref(false);
    const isSubmitting = ref(false);
    const showPrintModal = ref(false);

    const loadOrderDetails = async () => {
      try {
        // Load product details
        if (props.order.products && props.order.products.length > 0) {
          const products = await Promise.all(
            props.order.products.map(async (item) => {
              if (typeof item.product === 'string') {
                try {
                  const details = await productStore.fetchProductById(item.product);
                  return { ...item, product: details };
                } catch (error) {
                  console.error(`Error fetching product ${item.product}:`, error);
                  return item;
                }
              }
              return item;
            })
          );
          orderProducts.value = products;
        }

        // Load seller info - using the seller ID directly from the order
        if (props.order.seller) {
          try {
            // First try to fetch seller profile directly
            const seller = await sellerStore.fetchSellerByUserId(props.order.seller);
            if (seller) {
              sellerInfo.value = seller;
            }
          } catch (error) {
            console.error('Error fetching seller info:', error);
            // Provide fallback seller info
            sellerInfo.value = {
              storeName: 'Store',
              averageRating: 0,
              isVerified: false
            };
          }
        }
      } catch (error) {
        console.error('Error loading order details:', error);
      }
    };

    // Call this when the component mounts
    onMounted(loadOrderDetails);

    onMounted(() => {
      // Generate barcode when modal opens
      watch(showPrintModal, (isVisible) => {
        if (isVisible) {
          nextTick(() => {
            JsBarcode("#barcode", currentOrder.value.orderId, {
              format: "CODE128",
              width: 1.5,
              height: 50,
              displayValue: true
            });
          });
        }
      });
    });

    // Enhanced status styling with modern gradients
    const getStatusClass = (status) => {
      const classes = {
        'Pending': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200',
        'Processing': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200',
        'Shipped': 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200',
        'Delivered': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
        'Cancelled': 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
      };
      return classes[status] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
    };

    // Add new methods
    const contactSeller = () => {
      // Implement contact seller logic
      console.log('Contact seller clicked');
    };

    const showRatingModal = ref(false);
    const selectedProductForRating = ref(null);
    const rating = ref(0);
    const reviewText = ref('');
    const isSubmittingRating = ref(false);

    const rateProduct = (product) => {
      selectedProductForRating.value = product;
      rating.value = 0;
      reviewText.value = '';
      showRatingModal.value = true;
    };

    const closeRatingModal = () => {
      showRatingModal.value = false;
      selectedProductForRating.value = null;
      rating.value = 0;
      reviewText.value = '';
    };

    const submitRating = async () => {
      if (rating.value === 0 || !selectedProductForRating.value) {
        return;
      }

      try {
        isSubmittingRating.value = true;
        await productStore.rateProduct(
          selectedProductForRating.value.product._id,
          rating.value,
          reviewText.value
        );

        closeRatingModal();
        // You might want to emit an event to refresh the order data
        emit('order-updated');
      } catch (error) {
        console.error('Error submitting rating:', error);
      } finally {
        isSubmittingRating.value = false;
      }
    };

    const reorderProduct = (product) => {
      // Implement reorder logic
      router.push(`/product/${product.product._id}`);
    };

    // Computed properties
    const currentOrder = computed(() => {
      console.log('Full order data:', JSON.stringify(props.order, null, 2));
      return props.order;
    });

    const getFirstProduct = computed(async () => {
      if (!currentOrder.value?.products?.length) {
        console.log('No products found in order');
        return null;
      }

      const firstProduct = currentOrder.value.products[0];
      console.log('First product in order:', firstProduct);

      // If we don't have the full product data, fetch it
      if (firstProduct && firstProduct.product && typeof firstProduct.product === 'string') {
        try {
          // Fetch full product details using the ID
          const productDetails = await productStore.fetchProductById(firstProduct.product);
          return {
            ...firstProduct,
            product: productDetails
          };
        } catch (error) {
          console.error('Error fetching product details:', error);
          return firstProduct;
        }
      }

      return firstProduct;
    });

    const canModifyOrder = computed(() =>
      currentOrder.value?.status === 'Pending'
    );

    const canCancelOrder = computed(() =>
      ['Pending', 'Processing'].includes(currentOrder.value?.status)
    );

    // Methods
    const getProductImage = () => {
      try {
        return currentOrder.value?.products?.[0]?.product?.images?.[0] || placeholderImage;
      } catch (error) {
        console.error('Error getting product image:', error);
        return placeholderImage;
      }
    };

    const getProductName = () => {
      try {
        return currentOrder.value?.products?.[0]?.product?.name || 'Product Name Not Available';
      } catch (error) {
        console.error('Error getting product name:', error);
        return 'Product Name Not Available';
      }
    };

    const formatDate = (date) => {
      if (!date) return 'Date not available';
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const formatAmount = (amount) => {
      if (!amount) return '0.00';
      return amount.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const getTotalQuantity = (products) => {
      if (!Array.isArray(products)) return 0;
      return products.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const handleModifyOrder = () => {
      showModifyModal.value = true;
    };

    const viewOrderDetails = () => {
      showOrderDetailsModal.value = true;
    };

    const handleCancelOrder = async () => {
      if (!currentOrder.value?._id) return;
      if (confirm('Are you sure you want to cancel this order?')) {
        try {
          await orderStore.cancelOrder(currentOrder.value._id);
          emit('order-updated');
        } catch (error) {
          console.error('Error cancelling order:', error);
        }
      }
    };

    const handleTrackOrder = () => {
      showTrackingModal.value = true;
    };

    const handlePayNow = () => {
      if (!currentOrder.value?._id) return;
      router.push(`/checkout/${currentOrder.value._id}/payment`);
    };

    const handleSupport = () => {
      // Implement support logic
      console.log('Support clicked');
    };

    const handlePrintOrder = () => {
      showPrintModal.value = true;
    };

    const orderStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered'
    ];

    const getTimelineNodeClass = (status) => {
      if (isCompleted(status)) {
        return 'border-green-500 bg-green-100 text-green-600';
      }
      if (isCurrent(status)) {
        return 'border-blue-500 bg-blue-100 text-blue-600';
      }
      return 'border-gray-300 bg-gray-100 text-gray-400';
    };

    const isCompleted = (status) => {
      const currentIndex = orderStatuses.indexOf(currentOrder.value.status);
      const statusIndex = orderStatuses.indexOf(status);
      return statusIndex < currentIndex;
    };

    const isCurrent = (status) => {
      return status === currentOrder.value.status;
    };

    const getStatusDescription = (status) => {
      const descriptions = {
        'Pending': 'Order has been placed and is awaiting confirmation',
        'Processing': 'Order is being prepared for shipping',
        'Shipped': 'Order is on its way to you',
        'Delivered': 'Order has been delivered successfully'
      };
      return descriptions[status] || '';
    };

    const getStatusTimestamp = (status) => {
      // In a real app, you'd get these from your order history
      if (status === 'Pending') return currentOrder.value.createdAt;
      if (status === currentOrder.value.status) return currentOrder.value.updatedAt;
      return null;
    };

    const getEstimatedDelivery = () => {
      const orderDate = new Date(currentOrder.value.createdAt);
      const estimatedDays = 5; // Adjust based on your business logic
      const estimatedDate = new Date(orderDate);
      estimatedDate.setDate(orderDate.getDate() + estimatedDays);
      return formatDate(estimatedDate);
    };

    const modifyForm = ref({
      address: {
        street: currentOrder.value?.address?.street || '',
        city: currentOrder.value?.address?.city || '',
        state: currentOrder.value?.address?.state || '',
        country: currentOrder.value?.address?.country || '',
        postalCode: currentOrder.value?.address?.postalCode || ''
      }
    });

    const incrementQuantity = (index) => {
      orderProducts.value[index].quantity++;
    };

    const decrementQuantity = (index) => {
      if (orderProducts.value[index].quantity > 1) {
        orderProducts.value[index].quantity--;
      }
    };

    const validateQuantity = (index) => {
      const quantity = orderProducts.value[index].quantity;
      if (quantity < 1) orderProducts.value[index].quantity = 1;
      if (isNaN(quantity)) orderProducts.value[index].quantity = 1;
    };

    const getTotalItems = () => {
      return orderProducts.value.reduce((sum, item) => sum + item.quantity, 0);
    };

    const calculateTotal = () => {
      return orderProducts.value.reduce((sum, item) => {
        return sum + (item.quantity * (item.product?.price || 0));
      }, 0);
    };

    const submitModifyOrder = async () => {
      if (isSubmitting.value) return;

      try {
        isSubmitting.value = true;

        const updatedOrder = {
          orderId: currentOrder.value._id,
          products: orderProducts.value.map(item => ({
            product: item.product._id,
            quantity: item.quantity
          })),
          address: modifyForm.value.address
        };

        // Make sure this method exists in your orderStore
        await orderStore.updateOrder(updatedOrder);
        showModifyModal.value = false;
        emit('order-updated');
      } catch (error) {
        console.error('Error modifying order:', error);
        // Optionally add error handling here
      } finally {
        isSubmitting.value = false;
      }
    };

    const printOrderDetails = () => {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      const printContent = document.getElementById('printableArea');

      // Format the HTML content properly
      const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order #${currentOrder.value.orderId}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f8f9fa;
          }
          .no-print {
            display: none !important;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .mb-4 {
            margin-bottom: 1rem;
          }
          .mt-4 {
            margin-top: 1rem;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .border-t {
            border-top: 1px solid #ddd;
          }
          .pt-4 {
            padding-top: 1rem;
          }
          .bg-blue-50 {
            background-color: #eff6ff;
          }
          .bg-green-50 {
            background-color: #f0fdf4;
          }
          .bg-gray-50 {
            background-color: #f9fafb;
          }
          .p-4 {
            padding: 1rem;
          }
          .rounded-lg {
            border-radius: 0.5rem;
          }
          .font-bold {
            font-weight: bold;
          }
          .text-lg {
            font-size: 1.125rem;
          }
          .text-sm {
            font-size: 0.875rem;
          }
          .text-xs {
            font-size: 0.75rem;
          }
          .mb-2 {
            margin-bottom: 0.5rem;
          }
          .mb-3 {
            margin-bottom: 0.75rem;
          }
          .mb-4 {
            margin-bottom: 1rem;
          }
          .mb-8 {
            margin-bottom: 2rem;
          }
          .space-y-1 > * + * {
            margin-top: 0.25rem;
          }
          .space-y-2 > * + * {
            margin-top: 0.5rem;
          }
          .border {
            border: 1px solid #d1d5db;
          }
          .divide-y > * + * {
            border-top: 1px solid #d1d5db;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${printContent.innerHTML}
        </div>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
        <script>
          window.onload = function() {
            JsBarcode("#barcode", "${currentOrder.value.orderId}", {
              format: "CODE128",
              width: 1.5,
              height: 50,
              displayValue: true
            });
            setTimeout(() => {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 500);
          };
        <\/script>
      </body>
    </html>
  `;

      // Write the content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    };

    return {
      productDetails,
      currentOrder,
      getFirstProduct,
      user: computed(() => userStore.user),
      canModifyOrder,
      canCancelOrder,
      formatDate,
      formatAmount,
      getTotalQuantity,
      getProductImage,
      getProductName,
      handleCancelOrder,
      showOrderDetailsModal,
      viewOrderDetails,
      handleModifyOrder,
      handleTrackOrder,
      handlePayNow,
      handleSupport,
      handlePrintOrder,

      isLoading,
      sellerInfo,
      orderProducts,
      getStatusClass,
      contactSeller,
      rateProduct,
      reorderProduct,

      showTrackingModal,
      getTimelineNodeClass,
      isCompleted,
      isCurrent,
      getStatusDescription,
      getStatusTimestamp,
      getEstimatedDelivery,
      orderStatuses,

      showModifyModal,
      modifyForm,
      incrementQuantity,
      decrementQuantity,
      validateQuantity,
      getTotalItems,
      calculateTotal,
      submitModifyOrder,
      isSubmitting,

      showPrintModal,
      printOrderDetails,

      // Rating modal
      showRatingModal,
      selectedProductForRating,
      rating,
      reviewText,
      isSubmittingRating,
      closeRatingModal,
      submitRating
    };
  }
};
</script>

<style scoped>
/* Mobile-first responsive design */

/* Base mobile styles */
@media (max-width: 640px) {

  /* Disable hover effects on mobile for better performance */
  .transform {
    transform: none !important;
  }

  .hover\:scale-105:hover {
    transform: none !important;
  }

  /* Ensure text doesn't get too small on mobile */
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  /* Better touch targets */
  button,
  select,
  input {
    min-height: 44px;
  }

  /* Prevent horizontal scrolling */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }

  /* Better modal sizing on mobile */
  .max-h-\[95vh\] {
    max-height: 95vh;
  }

  /* Improved modal spacing */
  .p-2 {
    padding: 0.5rem;
  }
}

/* Tablet styles */
@media (min-width: 641px) and (max-width: 1024px) {

  /* Re-enable some hover effects for tablets */
  .hover\:scale-105:hover {
    transform: scale(1.02) !important;
  }
}

/* Desktop styles */
@media (min-width: 1025px) {

  /* Full hover effects for desktop */
  .hover\:scale-105:hover {
    transform: scale(1.05) !important;
  }
}

/* Enhanced focus states for accessibility */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for better mobile experience */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  body {
    font-size: 12pt;
    line-height: 1.4;
  }

  .text-sm {
    font-size: 10pt;
  }

  .text-xs {
    font-size: 9pt;
  }
}

/* Loading animation improvements */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ping {

  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Gradient text support */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Shadow utilities */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Form input improvements */
input:focus,
select:focus,
textarea:focus {
  outline: none;
}

/* Better button spacing on mobile */
@media (max-width: 640px) {
  .space-y-3> :not([hidden])~ :not([hidden]) {
    margin-top: 0.75rem;
  }

  .space-y-4> :not([hidden])~ :not([hidden]) {
    margin-top: 1rem;
  }

  /* Better grid gaps on mobile */
  .gap-2 {
    gap: 0.5rem;
  }

  .gap-3 {
    gap: 0.75rem;
  }

  /* Ensure adequate padding on containers */
  .p-3 {
    padding: 0.75rem;
  }

  .p-4 {
    padding: 1rem;
  }

  /* Better modal button layout - only apply to footer buttons */
  .modal-footer.flex-col button:not(.close-button) {
    width: 100%;
  }

  /* Alternative: target specific modal footer areas */
  .border-t.bg-gray-50.flex.flex-col button:not(.close-button) {
    width: 100%;
  }
}

/* Responsive grid improvements */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .sm\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .sm\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Better touch targets for mobile */
@media (max-width: 640px) {

  button,
  select,
  input[type="text"],
  input[type="number"],
  textarea {
    min-height: 44px;
    padding: 0.75rem;
  }

  /* Ensure buttons have adequate spacing */
  button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Better modal sizing */
  .max-w-md,
  .max-w-2xl,
  .max-w-3xl,
  .max-w-4xl {
    max-width: calc(100vw - 1rem);
  }
}

/* Enhanced modal backdrop */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Better rating stars layout */
.rating-stars {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

@media (min-width: 640px) {
  .rating-stars {
    justify-content: flex-start;
    gap: 0.5rem;
  }
}

/* Improved timeline styling */
.timeline-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-line {
  position: absolute;
  top: 2rem;
  width: 1px;
  height: 100%;
  background-color: #e5e7eb;
}

/* Better product card layout */
.product-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .product-card {
    flex-direction: row;
    gap: 1rem;
  }
}

/* Enhanced status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  align-self: flex-start;
}

@media (min-width: 640px) {
  .status-badge {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

/* Better action button layout */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .action-buttons {
    gap: 0.75rem;
  }
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.75rem;
  transition: all 0.2s;
}

@media (min-width: 640px) {
  .action-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

/* Improved form layouts */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

/* Enhanced order summary */
.order-summary {
  background: linear-gradient(to right, #f9fafb, #eff6ff);
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

@media (min-width: 640px) {
  .order-summary {
    padding: 1rem;
    border-radius: 0.75rem;
  }
}

/* Better seller info layout */
.seller-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .seller-info {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

/* Responsive text scaling */
@media (max-width: 640px) {
  .responsive-text-lg {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .responsive-text-xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

/* Enhanced modal animations */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  animation: modalSlideIn 0.3s ease-out;
}

/* Better print table styles */
@media print {
  .print-table {
    font-size: 10pt;
    border-collapse: collapse;
    width: 100%;
  }

  .print-table th,
  .print-table td {
    border: 1px solid #ddd;
    padding: 6px;
    text-align: left;
  }

  .print-table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
}
</style>

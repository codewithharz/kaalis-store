<template>
    <div class="min-h-screen bg-white">
        <!-- Mobile Layout (< lg) -->
        <div class="lg:hidden">
            <!-- Mobile Product Images Section -->
            <div class="bg-white shadow-sm">
                <AlertDialog>
                    <AlertDialogTrigger class="w-full flex justify-center">
                        <div class="relative group">
                            <img :src="hoveredImage || mainImage" alt="Product Image"
                                class="w-full h-64 sm:h-80 object-cover cursor-pointer"
                                :class="{ 'scale-150': isZoomed }" @mousemove="handleImageMove" />
                            <div class="absolute top-2 right-2 flex space-x-2">
                                <button @click.stop="toggleZoom"
                                    class="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none">
                                    <component :is="isZoomed ? ZoomOut : ZoomIn" class="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent class="bg-gray-200 max-w-xl w-[95%] mx-auto">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                <span class="text-[17px] font-medium">{{ product?.name }}</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                <div class="relative group">
                                    <div class="flex justify-center items-center">
                                        <img :src="hoveredImage || mainImage" alt="Product Image"
                                            class="w-full h-auto rounded-lg shadow-md"
                                            :style="{ transform: `scale(${zoomLevel})` }"
                                            @mousemove="handleImageMove" />
                                    </div>
                                    <div class="absolute top-2 right-2 flex space-x-2">
                                        <button v-if="!isZoomed" @click.stop="toggleZoom"
                                            class="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none">
                                            <ZoomIn class="w-6 h-6 text-gray-600" />
                                        </button>
                                        <button v-else @click.stop="toggleZoom"
                                            class="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none">
                                            <ZoomOut class="w-6 h-6 text-gray-600" />
                                        </button>
                                    </div>
                                    <!-- Carousel Controls -->
                                    <button v-if="!isZoomed" @click="prevImage"
                                        class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    <button v-if="!isZoomed" @click="nextImage"
                                        class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel class="hover:bg-[#24a6bb] hover:text-white">Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <!-- Mobile Thumbnail Images -->
                <div class="flex space-x-2 p-4 justify-start overflow-x-auto scrollbar-hide">
                    <img v-for="image in product?.images" :src="image" :key="image" @click="mainImage = image"
                        @mouseover="hoveredImage = image" @mouseleave="hoveredImage = null"
                        class="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg cursor-pointer object-cover border-2 transition-all"
                        :class="{ 'border-blue-500 shadow-lg': mainImage === image || hoveredImage === image }" />
                </div>
            </div>

            <!-- Mobile Product Info -->
            <div class="p-4 space-y-4">
                <!-- Mobile Product Title -->
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900" :title="product?.name">
                    {{ formatTitle(product?.name) }}
                </h1>

                <!-- Mobile Price Section -->
                <div v-if="product?.price" class="space-y-2">
                    <div class="flex items-baseline space-x-2">
                        <div>
                            <span class="text-lg">₦</span>
                            <span class="text-2xl sm:text-3xl font-bold text-gray-800">{{ product.price.toFixed(2)
                            }}</span>
                        </div>
                        <div class="space-x-1 text-sm text-gray-500">
                            <span class="line-through">₦{{ calculateOriginalPrice(product).toFixed(2) }}</span>
                            <span v-if="product.discount"
                                class="text-[#ff5e62] text-xs border border-[#ff5e62] rounded-sm px-1 font-medium">
                                -{{ product.discount }}%
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Mobile Lightning Deal Banner -->
                <div class="bg-[#24a3b5] text-white p-3 rounded-lg">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div class="flex items-center gap-2 text-sm">
                            <span class="font-bold">HAPPY</span>
                            <span class="font-bold">2025</span>
                            <div class="h-4 w-[1px] bg-white/30 hidden sm:block"></div>
                            <span>✓ Free shipping for you</span>
                        </div>
                        <span class="text-xs">Limited-time offer</span>
                    </div>
                </div>

                <!-- Mobile Provider and Ratings -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-3">
                    <div class="flex items-center space-x-1">
                        <div>
                            <span class="font-bold text-gray-800">Provided by</span>
                        </div>
                        <div v-if="product?.user" class="flex items-center cursor-pointer" @click="visitSellerStore">
                            <img :src="product.user?.sellerProfile?.profileImage || randomAvatarUrl"
                                :alt="product.user?.username" class="w-4 h-4 rounded-full mr-2">
                            <div>
                                <p class="font-medium">{{ product.user?.username }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Ratings Summary -->
                    <div v-if="product?.averageRating !== undefined" class="flex items-center space-x-2">
                        <div class="flex items-center">
                            <div class="flex">
                                <Star v-for="n in 5" :key="n" :class="[
                                    'w-4 h-4',
                                    n <= displayRating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                ]" />
                            </div>
                            <span class="text-sm font-bold ml-2">
                                {{ formatRating(product?.averageRating) }}
                            </span>
                        </div>
                        <span class="text-gray-600 text-xs">{{ product?.numberOfRatings || 0 }} ratings</span>
                    </div>
                </div>

                <!-- Mobile Description -->
                <p class="text-gray-600 leading-relaxed text-sm">
                    <span v-html="formatDescription(product)"></span>
                    <span v-if="product?.description?.length > 100" @click="toggleDescription"
                        class="text-blue-500 cursor-pointer">
                        {{ product?.showFullDescription ? ' Read less' : ' Read more' }}
                    </span>
                </p>

                <!-- Mobile Color Selection -->
                <div v-if="hasColors" class="space-y-3">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="font-medium text-gray-700">Color: {{ getSelectedColorName }}</h2>
                    </div>
                    <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        <div v-for="variant in product?.variants" :key="variant._id"
                            class="relative group cursor-pointer" :title="variant.color?.name">
                            <div class="border rounded-lg p-1" :class="[
                                'border-2',
                                selectedColor === variant.color?.hexCode
                                    ? 'border-[#24a6bb]'
                                    : 'border-gray-400',
                                !variant.color?.inStock && 'opacity-50 cursor-not-allowed'
                            ]" @click="selectVariantColor(variant)" @mouseenter="previewVariantImage(variant)"
                                @mouseleave="resetMainImage">
                                <!-- Show image if available, otherwise show color block -->
                                <div v-if="variant.images?.length"
                                    class="aspect-[11/12] w-full rounded-md overflow-hidden">
                                    <img :src="variant.images[0]" :alt="variant.color?.name"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div v-else class="aspect-[11/12] w-full rounded-md"
                                    :style="{ backgroundColor: variant.color?.hexCode }">
                                </div>
                                <span class="text-xs text-center block mt-1 truncate">
                                    {{ variant.color?.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mobile Size Selection -->
                <SizeSelector :product="product" v-model:selectedSize="selectedSize"
                    v-model:selectedColor="selectedColor" @update:availableColors="updateAvailableColors" />

                <!-- Mobile Quantity and Add to Cart -->
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <h2 class="font-medium text-gray-700">Quantity</h2>
                        <div class="inline-flex items-stretch rounded-lg border border-gray-200">
                            <button @click="decrementQuantity"
                                class="px-3 py-2 flex items-center justify-center hover:bg-gray-50 border-r border-gray-200"
                                :disabled="quantity <= 1">
                                <Minus class="w-3.5 h-3.5 text-gray-600" />
                            </button>
                            <input v-model.number="quantity" type="number" min="1"
                                class="w-14 text-center appearance-none focus:outline-none text-base [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                            <button @click="incrementQuantity"
                                class="px-3 py-2 flex items-center justify-center hover:bg-gray-50 border-l border-gray-200">
                                <Plus class="w-3.5 h-3.5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <!-- Mobile Social Proof -->
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <transition name="social-proof-transition">
                            <div v-if="currentSocialProof" class="flex items-center">
                                <component :is="currentSocialProof.icon" class="w-5 h-5 text-[#ff5e62] mr-2" />
                                <span class="text-sm" v-html="currentSocialProof.label"></span>
                            </div>
                        </transition>
                    </div>

                    <!-- Mobile Stock Alert -->
                    <Alert v-if="showStockAlert">
                        <AlertTitle>Low Stock Alert!</AlertTitle>
                        <AlertDescription>
                            Only {{ product?.stock }} items left. Order soon to avoid disappointment.
                        </AlertDescription>
                    </Alert>

                    <!-- Mobile Add to Cart and Wishlist -->
                    <div class="flex items-center space-x-3">
                        <button @click="addToCart"
                            class="flex-grow bg-[#24a3b5] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#26afc1] transition duration-300 text-sm sm:text-base">
                            Add to Cart
                            <span class="text-xs ml-2">{{ product?.discount }}% OFF</span>
                        </button>
                        <button @click="toggleWishlist"
                            class="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300">
                            <Heart :class="{ 'fill-current text-[#ff5e62]': isInWishlist }"
                                class="w-5 h-5 text-[#ff5e62] hover:text-[#ff5e62]" />
                        </button>
                    </div>
                </div>

                <!-- Mobile Delivery Info -->
                <div class="bg-white border border-gray-100 rounded-lg shadow-sm divide-y divide-gray-100">
                    <!-- Free Delivery Section -->
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 bg-blue-50 rounded-lg">
                                    <Package class="w-5 h-5 text-[#24a3b5]" />
                                </div>
                                <div>
                                    <span class="font-semibold block text-gray-900 text-sm">Free Delivery</span>
                                    <span class="text-xs text-gray-600">Estimated delivery within 3 days</span>
                                </div>
                            </div>
                            <span class="text-[#24a3b5] text-sm font-medium">Free</span>
                        </div>
                    </div>

                    <!-- Shopping Security Section -->
                    <div class="p-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 bg-green-50 rounded-lg">
                                    <Shield class="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <span class="font-semibold block text-gray-900 text-sm">Secure Shopping</span>
                                    <span class="text-xs text-gray-600">Money back guarantee</span>
                                </div>
                            </div>
                            <button class="text-xs text-[#24a3b5] hover:underline">Learn more</button>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 bg-orange-50 rounded-lg">
                                    <RefreshCcw class="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <span class="font-semibold block text-gray-900 text-sm">90-Day Returns</span>
                                    <span class="text-xs text-gray-600">With price adjustment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mobile Seller Information -->
                <div class="bg-white border border-gray-100 rounded-lg shadow-sm divide-y divide-gray-100">
                    <!-- Seller Header -->
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="font-semibold text-gray-900">Seller Information</h2>
                            <button v-if="product?.user?.sellerProfile" @click="visitSellerStore"
                                class="text-sm text-[#24a3b5] hover:underline flex items-center space-x-1">
                                <span>Visit Store</span>
                                <ArrowRight class="w-4 h-4" />
                            </button>
                        </div>

                        <!-- loading state -->
                        <div v-if="isLoading" class="animate-pulse">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div class="space-y-2">
                                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                                    <div class="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Show seller info when available -->
                        <div v-if="product?.user" class="flex items-center space-x-4">
                            <div class="relative">
                                <!-- Seller Profile Image -->
                                <img :src="product.user?.sellerProfile?.profileImage || randomAvatarUrl"
                                    :alt="product.user.storeName || product.user.username"
                                    class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />

                                <!-- Online/Vacation Indicator -->
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div v-if="product.user?.sellerProfile" :class="[
                                                'absolute bottom-5 -right-1 w-4 h-4 rounded-full border-2 border-white',
                                                !product.user.sellerProfile.isVacationMode ?
                                                    'bg-green-500'
                                                    : 'bg-orange-500'
                                            ]">
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{{ !product.user.sellerProfile.isVacationMode ?
                                                'Seller is Active' : 'Seller is on Vacation Mode' }}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <!-- Seller Details -->
                            <div class="flex-1">
                                <div class="flex items-center space-x-2">
                                    <p class="font-medium text-gray-900 text-sm">
                                        {{ product.user?.sellerProfile?.storeName || product.user.username }}
                                    </p>

                                    <!-- Verified Blue Ribbon Icon with Green White -->
                                    <svg v-if="product.user?.sellerProfile.verificationStatus === 'approved'"
                                        xmlns="http://www.w3.org/2000/svg" class="ml-2 w-4 h-4 text-[#24a3b5]"
                                        fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                        <path fill="none" stroke="currentColor" stroke-linecap="round"
                                            stroke-linejoin="round" stroke-width="2"
                                            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                        <path fill="currentColor"
                                            d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                                        <path fill="currentColor" stroke="currentColor" stroke-linecap="round"
                                            stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"
                                            class="text-white" />
                                    </svg>

                                    <div v-if="product.user?.sellerProfile.verificationStatus === 'approved'"
                                        class="text-xs w-fit px-2 font-medium rounded-full text-[#ff934b] bg-white border border-[#ff934b]">
                                        Verified
                                    </div>
                                </div>

                                <!-- Store Stats -->
                                <div class="flex items-center space-x-4 mt-1">
                                    <div class="flex items-center text-xs text-gray-600">
                                        <Package class="w-3 h-3 mr-1" />
                                        <span>{{ product.user?.sellerProfile?.deliveredOrders || 0 }}
                                            Sales</span>
                                    </div>
                                    <div class="flex items-center text-xs text-gray-600">
                                        <Users class="w-3 h-3 mr-1" />
                                        <span>{{ product.user?.sellerProfile?.followers?.length || 0 }}
                                            Followers</span>
                                    </div>
                                </div>

                                <!-- Ratings -->
                                <div class="flex items-center space-x-2 mt-2">
                                    <div class="flex items-center">
                                        <Star v-for="n in 5" :key="n"
                                            :class="['w-3 h-3', n <= (product.user?.sellerProfile?.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" />
                                    </div>
                                    <span class="text-xs text-gray-600">
                                        {{ product.user?.sellerProfile?.averageRating?.toFixed(1) || '0.0' }}
                                        ({{ product.user?.sellerProfile?.reviews?.length || 0 }} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Show message if no seller info -->
                        <div v-else class="text-gray-500 text-center py-4 text-sm">
                            Seller information not available
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div v-if="!isLoading && product?.user?.sellerProfile" class="p-4 grid grid-cols-3 gap-4">
                        <div class="text-center">
                            <span class="text-xs font-medium text-gray-900">Response Rate</span>
                            <p class="text-lg font-bold text-[#24a3b5]">98%</p>
                        </div>
                        <div class="text-center">
                            <span class="text-xs font-medium text-gray-900">Ship On Time</span>
                            <p class="text-lg font-bold text-[#24a3b5]">95%</p>
                        </div>
                        <div class="text-center">
                            <span class="text-xs font-medium text-gray-900">Products</span>
                            <p class="text-lg font-bold text-[#24a3b5]">
                                {{ product.user?.sellerProfile?.products?.length || 0 }}
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div v-if="!isLoading && product?.user?.sellerProfile" class="p-4 flex space-x-3">
                        <button @click="followSeller" class="flex-1 py-2 px-4 rounded-lg font-medium transition text-sm"
                            :class="[
                                isFollowing
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-[#24a3b5] text-white hover:bg-[#1f8f9e]'
                            ]">
                            {{ isFollowing ? 'Unfollow Store' : 'Follow Store' }}
                        </button>
                        <button @click="messageStore"
                            class="flex items-center justify-center w-12 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                            <MessageCircle class="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>

                <!-- Mobile Tabs Section -->
                <div class="bg-white shadow-sm rounded-lg">
                    <Tabs defaultValue="features" class="w-full">
                        <TabsList class="grid w-full grid-cols-3 sticky top-0 bg-white z-10 border-b">
                            <TabsTrigger value="features" class="text-xs sm:text-sm">Features</TabsTrigger>
                            <TabsTrigger value="specs" class="text-xs sm:text-sm">Specifications</TabsTrigger>
                            <TabsTrigger value="reviews" class="text-xs sm:text-sm">Reviews</TabsTrigger>
                        </TabsList>

                        <TabsContent value="features" class="mt-4 p-4">
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li v-for="(feature, index) in featuredFeatures" :key="index" class="flex items-start">
                                    <span class="inline-block w-2 h-2 mt-1.5 mr-2 bg-[#24a6bb] rounded-full"></span>
                                    <span v-html="feature"></span>
                                </li>
                            </ul>
                        </TabsContent>

                        <TabsContent value="specs" class="mt-4 p-4">
                            <div class="space-y-4">
                                <!-- Add your specifications content here -->
                                <div v-if="product?.specifications" class="grid grid-cols-1 gap-4">
                                    <div v-for="(spec, key) in product.specifications" :key="key" class="border-b pb-2">
                                        <span class="font-medium text-sm">{{ key }}:</span>
                                        <span class="text-gray-600 text-sm">{{ spec }}</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" class="mt-4 p-4">
                            <div class="space-y-4">
                                <!-- Review Summary -->
                                <div
                                    class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 class="text-lg font-semibold">Customer Reviews</h3>
                                        <div class="flex items-center">
                                            <Star v-for="star in 5" :key="star"
                                                :class="['w-4 h-4', star <= displayRating ? 'text-yellow-400' : 'text-gray-300']" />
                                            <span class="ml-2 text-sm">{{ product?.averageRating?.toFixed(1) }} out of
                                                5</span>
                                        </div>
                                        <p class="text-sm text-gray-600">{{ product?.numberOfRatings }} global ratings
                                        </p>
                                    </div>
                                    <button v-if="canReview" @click="openReviewModal"
                                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm w-full sm:w-auto">
                                        Write a review
                                    </button>
                                </div>

                                <!-- Review List -->
                                <div v-if="reviews.length > 0" class="space-y-4">
                                    <!-- Replace this entire div with the new ReviewSection component -->
                                    <ReviewSection :reviews="reviews" :itemReviewsCount="reviews.length"
                                        :storeReviewsCount="product?.user?.sellerProfile?.reviews?.length || 0"
                                        @see-all="handleSeeAll" />
                                </div>

                                <p v-else class="text-gray-600 text-sm">No reviews yet.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>

        <!-- Desktop Layout (>= lg) -->
        <div class="hidden lg:block min-h-screen bg-white mx-10">
            <div class="flex">
                <!-- Left scrollable section -->
                <div class="w-[50%] h-screen overflow-y-auto">
                    <!-- Product Images Section -->
                    <div class="p-6 space-y-6 bg-white shadow-sm rounded-lg mx-4 mt-4"
                        style="scroll-snap-align: start;">
                        <AlertDialog>
                            <AlertDialogTrigger class="w-full flex justify-center">
                                <div class="relative group">
                                    <img :src="hoveredImage || mainImage" alt="Product Image"
                                        class="w-full h-auto rounded-lg shadow-md cursor-pointer"
                                        :class="{ 'scale-150': isZoomed }" @mousemove="handleImageMove" />
                                    <div class="absolute top-2 right-2 flex space-x-2">
                                        <button @click.stop="toggleZoom"
                                            class="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none">
                                            <component :is="isZoomed ? ZoomOut : ZoomIn"
                                                class="w-6 h-6 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent class="bg-gray-200 max-w-xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        <span class="text-[17px] font-medium">{{ product?.name }}</span>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <div class="relative group">
                                            <div class="flex justify-center items-center">
                                                <img :src="hoveredImage || mainImage" alt="Product Image"
                                                    class="w-full h-auto rounded-lg shadow-md"
                                                    :style="{ transform: `scale(${zoomLevel})` }"
                                                    @mousemove="handleImageMove" />
                                            </div>
                                            <div class="absolute top-2 right-2 flex space-x-2">
                                                <button v-if="!isZoomed" @click.stop="toggleZoom"
                                                    class="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none">
                                                    <ZoomIn class="w-6 h-6 text-gray-600" />
                                                </button>
                                                <button v-else @click.stop="toggleZoom"
                                                    class="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none">
                                                    <ZoomOut class="w-6 h-6 text-gray-600" />
                                                </button>
                                            </div>
                                            <!-- Carousel Controls -->
                                            <button v-if="!isZoomed" @click="prevImage"
                                                class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                                </svg>
                                            </button>
                                            <button v-if="!isZoomed" @click="nextImage"
                                                class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel class="hover:bg-[#24a6bb] hover:text-white">Close
                                    </AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <!-- Thumbnail Images -->
                        <div class="flex space-x-2 mt-4 justify-center overflow-x-auto">
                            <img v-for="image in product?.images" :src="image" :key="image" @click="mainImage = image"
                                @mouseover="hoveredImage = image" @mouseleave="hoveredImage = null"
                                class="w-16 h-16 rounded-lg cursor-pointer object-cover border-2 transition-all"
                                :class="{ 'border-blue-500 shadow-lg': mainImage === image || hoveredImage === image }" />
                        </div>
                    </div>

                    <!-- Tabs Section -->
                    <div class="bg-white shadow-sm rounded-lg mx-14 mt-6 mb-8">
                        <Tabs defaultValue="features" class="w-full my-10">
                            <TabsList class="grid w-full grid-cols-3 sticky top-0 bg-white z-10 px-8 border-b">
                                <TabsTrigger value="features">Features</TabsTrigger>
                                <TabsTrigger value="specs">Specifications</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            </TabsList>

                            <TabsContent value="features" class="mt-4">
                                <ul class="space-y-2 text-sm text-gray-600">
                                    <li v-for="(feature, index) in featuredFeatures" :key="index"
                                        class="flex items-start">
                                        <span class="inline-block w-2 h-2 mt-1.5 mr-2 bg-[#24a6bb] rounded-full"></span>
                                        <span v-html="feature"></span>
                                    </li>
                                </ul>
                            </TabsContent>

                            <TabsContent value="specs" class="mt-4">
                                <div class="space-y-4">
                                    <!-- Add your specifications content here -->
                                    <div v-if="product?.specifications" class="grid grid-cols-2 gap-4">
                                        <div v-for="(spec, key) in product.specifications" :key="key"
                                            class="border-b pb-2">
                                            <span class="font-medium">{{ key }}:</span>
                                            <span class="text-gray-600">{{ spec }}</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" class="mt-4">
                                <div class="space-y-4">
                                    <!-- Review Summary -->
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h3 class="text-lg font-semibold">Customer Reviews</h3>
                                            <div class="flex items-center">
                                                <Star v-for="star in 5" :key="star"
                                                    :class="['w-4 h-4', star <= displayRating ? 'text-yellow-400' : 'text-gray-300']" />
                                                <span class="ml-2">{{ product?.averageRating?.toFixed(1) }} out of
                                                    5</span>
                                            </div>
                                            <p class="text-sm text-gray-600">{{ product?.numberOfRatings }} global
                                                ratings
                                            </p>
                                        </div>
                                        <button v-if="canReview" @click="openReviewModal"
                                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                            Write a review
                                        </button>
                                    </div>

                                    <!-- Review List -->
                                    <div v-if="reviews.length > 0" class="space-y-4">
                                        <!-- Replace this entire div with the new ReviewSection component -->
                                        <ReviewSection :reviews="reviews" :itemReviewsCount="reviews.length"
                                            :storeReviewsCount="product?.user?.sellerProfile?.reviews?.length || 0"
                                            @see-all="handleSeeAll" />
                                    </div>

                                    <p v-else class="text-gray-600">No reviews yet.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <!-- Right fixed section -->
                <div class="w-[50%] h-screen overflow-y-auto border-l">
                    <div class="p-6 space-y-6">

                        <!-- Product Title -->
                        <h1 class="text-2xl font-bold text-gray-900" :title="product?.name">
                            {{ formatTitle(product?.name) }}
                        </h1>

                        <!-- Description -->
                        <p class="text-gray-600 leading-relaxed">
                            <span v-html="formatDescription(product)"></span>
                            <span v-if="product?.description?.length > 100" @click="toggleDescription"
                                class="text-blue-500 cursor-pointer">
                                {{ product?.showFullDescription ? ' Read less' : ' Read more' }}
                            </span>
                        </p>

                        <!-- Lightning Deal Banner -->
                        <div class="bg-[#24a3b5] text-white p-4 rounded-lg">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="font-bold">HAPPY</span>
                                    <span class="font-bold">2025</span>
                                    <div class="h-5 w-[1px] bg-white/30"></div>
                                    <span>✓ Free shipping for you</span>
                                </div>
                                <span class="text-sm">Limited-time offer</span>
                            </div>
                        </div>

                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center space-x-1">
                                <div>
                                    <span class="font-bold text-gray-800">Provided by</span>
                                </div>
                                <div v-if="product?.user" class="flex items-center cursor-pointer"
                                    @click="visitSellerStore">
                                    <img :src="product.user?.sellerProfile?.profileImage || randomAvatarUrl"
                                        :alt="product.user?.username" class="w-4 h-4 rounded-full mr-2">
                                    <div>
                                        <p class="font-medium">{{ product.user?.username }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Ratings Summary -->
                            <div v-if="product?.averageRating !== undefined" class="flex items-center space-x-4">
                                <div class="flex items-center">
                                    <div class="flex">
                                        <Star v-for="n in 5" :key="n" :class="[
                                            'w-4 h-4',
                                            n <= displayRating
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        ]" />
                                    </div>
                                    <span class="text-lg font-bold ml-2">
                                        {{ formatRating(product?.averageRating) }}
                                    </span>
                                </div>
                                <span class="text-gray-600">{{ product?.numberOfRatings || 0 }} ratings</span>
                            </div>
                        </div>

                        <!-- Price Section -->
                        <div v-if="product?.price" class="space-y-2">
                            <div class="flex items-baseline space-x-2">
                                <div>
                                    <span class="text-lg">₦</span>
                                    <span class="text-2xl font-bold text-gray-800">{{ product.price.toFixed(2) }}</span>
                                </div>
                                <div class="space-x-1 text-sm text-gray-500">
                                    <span class="line-through">₦{{ calculateOriginalPrice(product).toFixed(2) }}</span>
                                    <span v-if="product.discount"
                                        class="text-[#ff5e62] text-xs border border-[#ff5e62] rounded-sm px-1 font-medium">
                                        -{{ product.discount }}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Color Selection -->
                        <div v-if="hasColors" class="space-y-4 w-3/4">
                            <div class="flex items-center justify-between mb-2">
                                <h2 class="font-medium text-gray-700">Color: {{ getSelectedColorName }}</h2>
                            </div>
                            <div class="grid grid-cols-4 gap-2">
                                <div v-for="variant in product?.variants" :key="variant._id"
                                    class="relative group cursor-pointer" :title="variant.color?.name">
                                    <div class="border rounded-lg p-1" :class="[
                                        'border-2',
                                        selectedColor === variant.color?.hexCode
                                            ? 'border-[#24a6bb]'
                                            : 'border-gray-400',
                                        !variant.color?.inStock && 'opacity-50 cursor-not-allowed'
                                    ]" @click="selectVariantColor(variant)" @mouseenter="previewVariantImage(variant)"
                                        @mouseleave="resetMainImage">
                                        <!-- Show image if available, otherwise show color block -->
                                        <div v-if="variant.images?.length"
                                            class="aspect-[11/12] w-full rounded-md overflow-hidden">
                                            <img :src="variant.images[0]" :alt="variant.color?.name"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div v-else class="aspect-[11/12] w-full rounded-md"
                                            :style="{ backgroundColor: variant.color?.hexCode }">
                                        </div>
                                        <span class="text-xs text-center block mt-1 truncate">
                                            {{ variant.color?.name }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Size Selection -->
                        <SizeSelector :product="product" v-model:selectedSize="selectedSize"
                            v-model:selectedColor="selectedColor" @update:availableColors="updateAvailableColors" />

                        <!-- Quantity -->
                        <div class="space-y-2 flex items-center gap-2">
                            <h2 class="font-medium text-gray-700">Quantity </h2>
                            <div class="inline-flex items-stretch rounded-lg border border-gray-200">
                                <button @click="decrementQuantity"
                                    class="px-3 py-2 flex items-center justify-center hover:bg-gray-50 border-r border-gray-200"
                                    :disabled="quantity <= 1">
                                    <Minus class="w-3.5 h-3.5 text-gray-600" />
                                </button>
                                <input v-model.number="quantity" type="number" min="1"
                                    class="w-14 text-center appearance-none focus:outline-none text-base [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                <button @click="incrementQuantity"
                                    class="px-3 py-2 flex items-center justify-center hover:bg-gray-50 border-l border-gray-200">
                                    <Plus class="w-3.5 h-3.5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <!-- Social Proof -->
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <transition name="social-proof-transition">
                                <div v-if="currentSocialProof" class="flex items-center">
                                    <component :is="currentSocialProof.icon" class="w-5 h-5 text-[#ff5e62] mr-2" />
                                    <span class="text-sm" v-html="currentSocialProof.label"></span>
                                </div>
                            </transition>
                        </div>

                        <!-- Stock Alert -->
                        <Alert v-if="showStockAlert">
                            <AlertTitle>Low Stock Alert!</AlertTitle>
                            <AlertDescription>
                                Only {{ product?.stock }} items left. Order soon to avoid disappointment.
                            </AlertDescription>
                        </Alert>

                        <!-- Add to Cart and Wishlist -->
                        <div class="flex items-center space-x-4">
                            <button @click="addToCart"
                                class="flex-grow bg-[#24a3b5] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#26afc1] transition duration-300">
                                Add to Cart
                                <span class="text-sm ml-2">{{ product?.discount }}% OFF</span>
                            </button>
                            <button @click="toggleWishlist"
                                class="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300">
                                <Heart :class="{ 'fill-current text-[#ff5e62]': isInWishlist }"
                                    class="w-6 h-6 text-[#ff5e62] hover:text-[#ff5e62]" />
                            </button>
                        </div>

                        <!-- Delivery Info -->
                        <div class="bg-white border border-gray-100 rounded-lg shadow-sm divide-y divide-gray-100">
                            <!-- Free Delivery Section -->
                            <div class="p-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <div class="p-2 bg-blue-50 rounded-lg">
                                            <Package class="w-5 h-5 text-[#24a3b5]" />
                                        </div>
                                        <div>
                                            <span class="font-semibold block text-gray-900">Free Delivery</span>
                                            <span class="text-sm text-gray-600">Estimated delivery within 3 days</span>
                                        </div>
                                    </div>
                                    <span class="text-[#24a3b5] text-sm font-medium">Free</span>
                                </div>
                            </div>

                            <!-- Shopping Security Section -->
                            <div class="p-4 space-y-3">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <div class="p-2 bg-green-50 rounded-lg">
                                            <Shield class="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <span class="font-semibold block text-gray-900">Secure Shopping</span>
                                            <span class="text-sm text-gray-600">Money back guarantee</span>
                                        </div>
                                    </div>
                                    <button class="text-sm text-[#24a3b5] hover:underline">Learn more</button>
                                </div>

                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <div class="p-2 bg-orange-50 rounded-lg">
                                            <RefreshCcw class="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <span class="font-semibold block text-gray-900">90-Day Returns</span>
                                            <span class="text-sm text-gray-600">With price adjustment</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Seller Information Section -->
                            <div class="bg-white border border-gray-100 rounded-lg shadow-sm divide-y divide-gray-100">
                                <!-- Seller Header -->
                                <div class="p-4">
                                    <div class="flex items-center justify-between mb-4">
                                        <h2 class="font-semibold text-gray-900">Seller Information</h2>
                                        <button v-if="product?.user?.sellerProfile" @click="visitSellerStore"
                                            class="text-sm text-[#24a3b5] hover:underline flex items-center space-x-1">
                                            <span>Visit Store</span>
                                            <ArrowRight class="w-4 h-4" />
                                        </button>
                                    </div>

                                    <!-- loading state -->
                                    <div v-if="isLoading" class="animate-pulse">
                                        <div class="flex items-center space-x-4">
                                            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                                            <div class="space-y-2">
                                                <div class="h-4 bg-gray-200 rounded w-24"></div>
                                                <div class="h-3 bg-gray-200 rounded w-32"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Show seller info when available -->
                                    <div v-if="product?.user" class="flex items-center space-x-4">
                                        <div class="relative">
                                            <!-- Seller Profile Image -->
                                            <img :src="product.user?.sellerProfile?.profileImage || randomAvatarUrl"
                                                :alt="product.user.storeName || product.user.username"
                                                class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />

                                            <!-- Online/Vacation Indicator -->
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <div v-if="product.user?.sellerProfile" :class="[
                                                            'absolute bottom-5 -right-1 w-4 h-4 rounded-full border-2 border-white',
                                                            !product.user.sellerProfile.isVacationMode ?
                                                                'bg-green-500'
                                                                : 'bg-orange-500'
                                                        ]">
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{{ !product.user.sellerProfile.isVacationMode ?
                                                            'Seller is Active' : 'Seller is on Vacation Mode' }}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        <!-- Seller Details -->
                                        <div class="flex-1">
                                            <div class="flex items-center space-x-2">
                                                <p class="font-medium text-gray-900">
                                                    {{ product.user?.sellerProfile?.storeName || product.user.username
                                                    }}
                                                </p>

                                                <!-- Verified Blue Ribbon Icon with Green White -->
                                                <svg v-if="product.user?.sellerProfile.verificationStatus === 'approved'"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="ml-2 w-4 h-4 text-[#24a3b5]" fill="currentColor"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path fill="none" stroke="currentColor" stroke-linecap="round"
                                                        stroke-linejoin="round" stroke-width="2"
                                                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                                    <path fill="currentColor"
                                                        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                                                    <path fill="currentColor" stroke="currentColor"
                                                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M9 12l2 2 4-4" class="text-white" />
                                                </svg>

                                                <div v-if="product.user?.sellerProfile.verificationStatus === 'approved'"
                                                    class="text-xs w-fit px-2 font-medium rounded-full text-[#ff934b] bg-white border border-[#ff934b]">
                                                    Verified
                                                </div>
                                            </div>

                                            <!-- Store Stats -->
                                            <div class="flex items-center space-x-4 mt-1">
                                                <div class="flex items-center text-sm text-gray-600">
                                                    <Package class="w-4 h-4 mr-1" />
                                                    <span>{{ product.user?.sellerProfile?.deliveredOrders || 0 }}
                                                        Sales</span>
                                                </div>
                                                <div class="flex items-center text-sm text-gray-600">
                                                    <Users class="w-4 h-4 mr-1" />
                                                    <span>{{ product.user?.sellerProfile?.followers?.length || 0 }}
                                                        Followers</span>
                                                </div>
                                            </div>

                                            <!-- Ratings -->
                                            <div class="flex items-center space-x-2 mt-2">
                                                <div class="flex items-center">
                                                    <Star v-for="n in 5" :key="n"
                                                        :class="['w-4 h-4', n <= (product.user?.sellerProfile?.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300']" />
                                                </div>
                                                <span class="text-sm text-gray-600">
                                                    {{ product.user?.sellerProfile?.averageRating?.toFixed(1) || '0.0'
                                                    }}
                                                    ({{ product.user?.sellerProfile?.reviews?.length || 0 }} reviews)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Show message if no seller info -->
                                    <div v-else class="text-gray-500 text-center py-4">
                                        Seller information not available
                                    </div>
                                </div>

                                <!-- Quick Stats -->
                                <div v-if="!isLoading && product?.user?.sellerProfile"
                                    class="p-4 grid grid-cols-3 gap-4">
                                    <div class="text-center">
                                        <span class="text-sm font-medium text-gray-900">Response Rate</span>
                                        <p class="text-2xl font-bold text-[#24a3b5]">98%</p>
                                    </div>
                                    <div class="text-center">
                                        <span class="text-sm font-medium text-gray-900">Ship On Time</span>
                                        <p class="text-2xl font-bold text-[#24a3b5]">95%</p>
                                    </div>
                                    <div class="text-center">
                                        <span class="text-sm font-medium text-gray-900">Products</span>
                                        <p class="text-2xl font-bold text-[#24a3b5]">
                                            {{ product.user?.sellerProfile?.products?.length || 0 }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div v-if="!isLoading && product?.user?.sellerProfile" class="p-4 flex space-x-3">
                                    <button @click="followSeller"
                                        class="flex-1 py-2 px-4 rounded-lg font-medium transition" :class="[
                                            isFollowing
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-[#24a3b5] text-white hover:bg-[#1f8f9e]'
                                        ]">
                                        {{ isFollowing ? 'Unfollow Store' : 'Follow Store' }}
                                    </button>
                                    <button @click="messageStore"
                                        class="flex items-center justify-center w-12 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                                        <MessageCircle class="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Review Modal -->
                        <AlertDialog v-model:open="showReviewModal">
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Write a Review</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Rating</label>
                                                <div class="flex items-center">
                                                    <Star v-for="star in 5" :key="star" @click="newReview.rating = star"
                                                        :class="['w-6 h-6 cursor-pointer', star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300']" />
                                                </div>
                                            </div>
                                            <div>
                                                <label for="review"
                                                    class="block text-sm font-medium text-gray-700">Review</label>
                                                <textarea id="review" v-model="newReview.review" rows="6"
                                                    class="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                                            </div>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel @click="closeReviewModal">Cancel</AlertDialogCancel>
                                    <AlertDialogAction @click="submitReview">Submit Review</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div>

        <!-- Related Products Section (scroll-snap) -->
        <RelatedProducts :display-products="displayProducts" />
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import apiClient from '../api/axios';
import { useUserStore } from '../store/user.js';
import { useAddressStore } from '../store/addressStore.js';
import { useSellerStore } from '../store/sellerStore.js';
import { useWishlistStore } from '../store/wishlistStore.js';
import { useProductStore } from '../store/productStore.js';
import { useCartStore } from '../store/cart.js';
import { useOrderStore } from '../store/orderStore';
import { useRouter } from 'vue-router';
import { toast } from "vue-sonner";
import CustomImage from './CustomImage.vue';
import SizeSelector from './SizeSelector.vue';
import RelatedProducts from './RelatedProducts.vue';
import ReviewSection from './ReviewSection.vue';

import ProductCard from './ProductCard.vue';

import {
    Shirt, ShoppingCart, Eye, Heart, Package, Star, ZoomIn, ZoomOut, Plus, Minus,
    Shield, RefreshCcw, ArrowRight, MapPin, Badge, Users, MessageCircle
} from 'lucide-vue-next';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default {
    name: 'ProductDetails',
    components: {
        Shirt,
        ShoppingCart,
        Eye,
        Heart,
        Package,
        Star,
        ZoomIn,
        ZoomOut,
        Minus,
        Plus, Shield, RefreshCcw, ArrowRight, MapPin, Star, Badge, Users, MessageCircle,
        CustomImage,
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger,
        Alert,
        AlertTitle,
        AlertDescription,
        Tabs,
        TabsList,
        TabsTrigger,
        TabsContent,
        SizeSelector,
        ProductCard,
        RelatedProducts,
        ReviewSection,
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        console.log("Product ID from props:", props.id);

        const router = useRouter();
        const zoomLevel = ref(1);
        const mainImageRef = ref(null);
        const isZoomed = computed(() => zoomLevel.value > 1);
        const mainImage = ref('');
        const hoveredImage = ref(null);
        const sizes = ref(['XS', 'S', 'M', 'L', 'XL', '10-12 Years']);
        const socialProof = ref([
            { label: "In the basket of <span class='text-[#ff5e62]'>5,027 people</span>, buy it before it runs out!", icon: ShoppingCart },
            { label: `Popular product! <span class='text-[#ff5e62]'>3,579 people</span> viewed in the last 24 hours!`, icon: Eye },
            { label: "Favorite product! <span class='text-[#ff5e62]'>112K people</span> favored!", icon: Heart }
        ]);

        const userStore = useUserStore();
        const addressStore = useAddressStore();
        const sellerStore = useSellerStore();
        const wishlistStore = useWishlistStore();
        const productStore = useProductStore();
        const cartStore = useCartStore();

        const orderStore = useOrderStore();
        const reviews = ref([]);
        const showReviewModal = ref(false);
        const newReview = ref({ rating: 0, review: '' });
        const canReview = ref(false);

        const product = ref(null);
        const relatedProducts = ref([]);
        const randomProducts = ref([]);
        const user = ref(null);
        const address = ref(null);
        const sellerId = ref(null);
        const isInWishlist = ref(false);
        const selectedColor = ref(null);
        const selectedSize = ref(null);
        const quantity = ref(1);
        const showStockAlert = ref(false);

        const originalImage = ref('');

        const showSizeGuide = ref(false);
        const lowStockThreshold = ref(5);

        const availableColors = ref([]);

        const isFollowing = computed(() => sellerStore.isFollowing);

        const isLoading = ref(true);

        const followLoading = ref(false);

        const hasSizes = computed(() => {
            return product.value?.variants?.some(variant =>
                variant.attributes?.some(attr => attr.name.toLowerCase() === 'size')
            );
        });

        const availableSizes = computed(() => {
            if (!product.value?.variants) return [];

            const sizeVariants = product.value.variants
                .filter(variant => variant.attributes?.some(attr =>
                    attr.name.toLowerCase() === 'size'
                ))
                .map(variant => ({
                    size: variant.attributes.find(attr =>
                        attr.name.toLowerCase() === 'size'
                    ).value,
                    stock: variant.stock,
                    inStock: variant.stock > 0,
                    color: variant.color,
                    price: variant.price
                }));

            return Object.values(sizeVariants.reduce((acc, variant) => {
                const size = variant.size;
                if (!acc[size]) {
                    acc[size] = {
                        size,
                        stock: 0,
                        inStock: false,
                        variants: []
                    };
                }
                acc[size].stock += variant.stock;
                acc[size].inStock = acc[size].inStock || variant.stock > 0;
                acc[size].variants.push(variant);
                return acc;
            }, {}));
        });

        const getSelectedVariantStock = computed(() => {
            if (!selectedSize.value || !selectedColor.value) return null;

            const variant = product.value?.variants?.find(v =>
                v.attributes?.some(attr =>
                    attr.name.toLowerCase() === 'size' &&
                    attr.value === selectedSize.value
                ) &&
                v.color?.hexCode === selectedColor.value
            );

            return variant?.stock || null;
        });

        const sizeGuideMetrics = computed(() => {
            const category = product.value?.category?.name?.toLowerCase() || '';
            if (category.includes('shoe')) {
                return ['US', 'UK', 'EU', 'CM'];
            }
            if (category.includes('clothing')) {
                return ['Chest', 'Waist', 'Length'];
            }
            return ['Size', 'Measurement'];
        });

        const getSizeGuideData = computed(() => {
            const category = product.value?.category?.name?.toLowerCase() || '';
            return getSizeGuideForCategory(category, availableSizes.value);
        });

        const followSeller = async () => {
            try {
                if (!userStore.isLoggedIn) {
                    toast.error('Please log in to follow this store');
                    return;
                }

                const sellerId = product.value?.user?.sellerProfile?._id;
                if (!sellerId) {
                    toast.error('Seller information not available');
                    return;
                }

                await sellerStore.toggleFollow(sellerId);

                if (product.value?.user?.sellerProfile) {
                    const currentFollowers = product.value.user.sellerProfile.followers || [];
                    if (isFollowing.value) {
                        if (!currentFollowers.includes(userStore.user._id)) {
                            currentFollowers.push(userStore.user._id);
                        }
                    } else {
                        const index = currentFollowers.indexOf(userStore.user._id);
                        if (index > -1) {
                            currentFollowers.splice(index, 1);
                        }
                    }
                    product.value.user.sellerProfile.followers = [...currentFollowers];
                }
            } catch (error) {
                console.error('Error following store:', error);
                toast.error('Failed to update follow status');
            }
        };

        const messageStore = () => {
            if (!userStore.isLoggedIn) {
                toast.error('Please log in to message the store');
                return;
            }
            toast.info('Messaging feature coming soon');
        };

        const selectSize = (sizeOption) => {
            if (!sizeOption.inStock) return;

            selectedSize.value = sizeOption.size;
            console.log('Size selected:', sizeOption.size);

            const sizeVariants = product.value.variants.filter(v => {
                const sizeAttribute = v.attributes.find(attr =>
                    (attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'shape')
                );
                return sizeAttribute?.value === sizeOption.size;
            });

            console.log('Available variants for size:', sizeVariants);

            let matchingVariant;
            if (selectedColor.value) {
                matchingVariant = sizeVariants.find(v => v.color?.hexCode === selectedColor.value);
            }

            if (!matchingVariant && sizeVariants.length > 0) {
                matchingVariant = sizeVariants[0];
                if (matchingVariant.color?.hexCode) {
                    selectedColor.value = matchingVariant.color.hexCode;
                    console.log('Updated color to match size variant:', matchingVariant.color.hexCode);
                }
            }

            if (matchingVariant) {
                console.log('Size selection - Found matching variant with price:', matchingVariant.price);
                product.value.price = matchingVariant.price;
            }

            const colors = sizeVariants
                .filter(v => v.stock > 0)
                .map(v => ({
                    hexCode: v.color?.hexCode,
                    name: v.color?.name,
                    inStock: v.stock > 0,
                    price: v.price
                }));

            availableColors.value = colors;
            console.log('Updated available colors for size:', colors);
        };

        const previewVariantImage = (variant) => {
            if (!variant) return;

            if (variant?.images?.length) {
                if (!originalImage.value) {
                    originalImage.value = mainImage.value || variant.images[0];
                }
                mainImage.value = variant.images[0];
                hoveredImage.value = variant.images[0];
            }
        };

        const resetMainImage = () => {
            if (originalImage.value) {
                mainImage.value = originalImage.value;
                hoveredImage.value = null;
            }
        };

        const updateAvailableColorsForSize = (size) => {
            if (!product.value?.variants) return;

            const variantsForSize = product.value.variants.filter(v =>
                v.attributes?.some(attr =>
                    (attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'shape') &&
                    attr.value === size
                )
            );

            availableColors.value = variantsForSize
                .filter(v => v.stock > 0)
                .map(v => ({
                    hexCode: v.color?.hexCode,
                    name: v.color?.name,
                    inStock: v.stock > 0,
                    price: v.price
                }))
                .filter((c, index, self) =>
                    index === self.findIndex(t => t.hexCode === c.hexCode)
                );

            if (selectedColor.value && !availableColors.value.some(c => c.hexCode === selectedColor.value)) {
                if (availableColors.value.length > 0) {
                    selectedColor.value = availableColors.value[0].hexCode;
                    const newVariant = variantsForSize.find(v => v.color?.hexCode === selectedColor.value);
                    if (newVariant) {
                        product.value.price = newVariant.price;
                    }
                }
            }
        };

        const updateAvailableColors = (colors) => {
            availableColors.value = colors;
        };

        const getSizeGuideForCategory = (category, sizes) => {
            const defaultSizes = sizes.map(s => ({
                size: s.size,
                measurement: `${s.size} standard measurement`
            }));

            const sizeGuides = {
                shoes: [
                    { size: 'S', us: '7', uk: '6', eu: '40', cm: '25' },
                    { size: 'M', us: '8', uk: '7', eu: '41', cm: '26' },
                    { size: 'L', us: '9', uk: '8', eu: '42', cm: '27' }
                ],
                clothing: [
                    { size: 'S', chest: '36-38', waist: '30-32', length: '28' },
                    { size: 'M', chest: '38-40', waist: '32-34', length: '29' },
                    { size: 'L', chest: '40-42', waist: '34-36', length: '30' }
                ]
            };

            return sizeGuides[category] || defaultSizes;
        };

        const formatRating = (rating) => {
            if (rating === undefined || rating === null) return '0.0';
            const numericRating = Number(rating);
            if (isNaN(numericRating)) return '0.0';
            return numericRating % 1 === 0 ? numericRating.toFixed(1) : numericRating.toFixed(1);
        };

        const displayRating = computed(() => {
            return product.value?.averageRating ? Math.round(product.value.averageRating) : 0;
        });

        const toggleWishlist = async () => {
            if (!userStore.isLoggedIn) {
                toast.error('Please log in to add items to your wishlist');
                return;
            }

            try {
                let wishlist = wishlistStore.wishlists[0];
                if (!wishlist) {
                    wishlist = await wishlistStore.createWishlist({
                        name: 'My Wishlist',
                        visibility: 'private',
                    });
                }

                if (isInWishlist.value) {
                    await wishlistStore.removeFromWishlist(wishlist._id, props.id);
                    isInWishlist.value = false;
                    toast.success('Removed from wishlist');
                } else {
                    await wishlistStore.addToWishlist(wishlist._id, props.id);
                    isInWishlist.value = true;
                    toast.success('Added to wishlist');
                }
            } catch (error) {
                console.error('Error toggling wishlist:', error);
                toast.error('Failed to update wishlist');
            }
        };

        const featuredFeatures = computed(() => [
            `This product is sold by <span class="text-[#ff5e62]">${product.value?.user?.username || 'the seller'}</span>`,
            `More than <span class="text-[#ff5e62]">${product.value?.stock || 'Zero'}</span> stocks available`,
            "Seller determines the price",
            `More than <span class="text-[#ff5e62]">${product.value?.variants?.[0]?.stock || 'Zero'}</span> variants have been offered to be sold at the campaign price.`,
            "The seller determines the sales price of the product you have examined.",
            "A product can be sold by multiple vendors. The sellers of the products offered for sale by more than one seller are listed according to the price they determine for the product, the seller points, delivery status, promotions on the products, whether the cargo is free and whether the products can be delivered with fast delivery, the stock and categories of the products.",
        ]);

        const randomAvatarUrl = computed(() => {
            const randomSeed = Math.random().toString(36).substring(7);
            return `https://api.dicebear.com/6.x/identicon/svg?seed=${randomSeed}`;
        });

        const formatTitle = (title) => {
            if (!title) return '';

            const capitalizedTitle = title.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            return capitalizedTitle.length <= 50 ? capitalizedTitle : capitalizedTitle.slice(0, 47) + '...';
        };

        const formatDescription = (product) => {
            if (!product || !product.description) return '';

            let description = product.description.toLowerCase();
            description = description.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
            return product.showFullDescription || description.length <= 100
                ? description
                : description.slice(0, 100) + '...';
        };

        const toggleDescription = () => {
            product.value.showFullDescription = !product.value.showFullDescription;
        };

        const hasColors = computed(() => {
            return product.value?.variants?.some(variant => variant?.color?.hexCode);
        });

        const getSelectedColorName = computed(() => {
            if (!selectedColor.value) return '';

            const variant = product.value?.variants?.find(
                v => v.color?.hexCode === selectedColor.value
            );
            return variant?.color?.name || 'Default';
        });

        const selectVariantColor = (variant) => {
            if (!variant?.color?.inStock) return;

            selectedColor.value = variant.color.hexCode;

            if (variant?.images?.length) {
                mainImage.value = variant.images[0];
                originalImage.value = variant.images[0];
                hoveredImage.value = null;
            }

            if (variant.price !== undefined && product.value) {
                product.value.price = variant.price;
            }

            const sizeAttribute = variant.attributes?.find(attr =>
                attr?.name?.toLowerCase() === 'shape' || attr?.name?.toLowerCase() === 'size'
            );
            if (sizeAttribute?.value) {
                selectedSize.value = sizeAttribute.value;
            }
        };

        const fetchProductDetails = async () => {
            isLoading.value = true;

            try {
                const response = await apiClient.get(`/products/${props.id}`);
                console.log('Single product endpoint response:', response.data);

                console.log('Rating Data:', {
                    averageRating: response.data.averageRating,
                    numberOfRatings: response.data.numberOfRatings
                });

                product.value = {
                    ...response.data,
                    showFullDescription: false
                };

                console.log('Product Color:', product.value.color);
                console.log('Product Variants:', product.value.variants);

                if (product.value?.user?.sellerProfile?._id) {
                    try {
                        const sellerResponse = await apiClient.get(
                            `/seller/${product.value.user.sellerProfile._id}`
                        );

                        if (sellerResponse.data) {
                            product.value.user.sellerProfile = {
                                ...product.value.user.sellerProfile,
                                ...sellerResponse.data,
                                deliveredOrders: sellerResponse.data.totalSales || 0
                            };
                        }

                    } catch (error) {
                        console.error("Error fetching seller stats:", error);
                    }
                }

                if (product.value?.variants?.length > 0) {
                    const firstAvailableColor = product.value.variants.find(
                        variant => variant?.color?.hexCode && variant?.color?.inStock
                    );
                    if (firstAvailableColor) {
                        selectedColor.value = firstAvailableColor.color.hexCode;
                    }
                }

                if (product.value && product.value.images && product.value.images.length > 0) {
                    mainImage.value = product.value.images[0];
                }
                console.log('product.value: ', product.value);
                if (product.value && product.value.user && product.value.user.address) {
                    console.log('user address city: ', product.value.user.address.city);
                    console.log('user address country: ', product.value.user.address.country);
                }

                if (product.value && product.value.seller) {
                    user.value = product.value.seller;
                    console.log('user.value: ', user.value);

                    if (user.value.address) {
                        address.value = user.value.address;
                        console.log('address.value: ', address.value);
                    }
                }

                if (product.value && product.value.seller) {
                    sellerId.value = product.value.seller._id;
                }

                showStockAlert.value = product.value.stock < 10;
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('Failed to load product details');
            }
            finally {
                isLoading.value = false;
            }
        };

        const visitSellerStore = async () => {
            if (!product.value) {
                toast.error('Product details not available');
                return;
            }

            const sellerId = product.value.user?.sellerProfile?._id;
            if (!sellerId) {
                toast.error('Seller store not available.');
                return;
            }

            try {
                await sellerStore.fetchSellerProfile(sellerId);
                router.push({ name: 'SellerProducts', params: { id: sellerId } });
            } catch (error) {
                console.error('Error fetching seller profile:', error);
                toast.error('Failed to load seller profile');
            }
        };

        const currentSocialProof = ref(socialProof.value[0]);
        let socialProofIndex = 0;
        let interval;

        const startSocialProofLoop = () => {
            interval = setInterval(() => {
                socialProofIndex = (socialProofIndex + 1) % socialProof.value.length;
                currentSocialProof.value = socialProof.value[socialProofIndex];
            }, 3000);
        };

        const prevImage = () => {
            const currentIndex = product.value.images.indexOf(mainImage.value);
            const prevIndex = (currentIndex - 1 + product.value.images.length) % product.value.images.length;
            mainImage.value = product.value.images[prevIndex];
        };

        const nextImage = () => {
            const currentIndex = product.value.images.indexOf(mainImage.value);
            const nextIndex = (currentIndex + 1) % product.value.images.length;
            mainImage.value = product.value.images[nextIndex];
        };

        const initWishlist = async () => {
            if (userStore.isLoggedIn) {
                console.log('Fetching wishlists for user:', userStore.user._id);
                await wishlistStore.fetchUserWishlists(userStore.user._id);
                isInWishlist.value = wishlistStore.wishlists.some(
                    wishlist => wishlist.products.includes(props.id)
                );
            }
        };

        const toggleZoom = () => {
            zoomLevel.value = isZoomed.value ? 1 : 1.6;
        };

        const handleImageMove = (e) => {
            if (isZoomed.value && mainImageRef.value) {
                const image = mainImageRef.value;
                const rect = image.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                image.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            }
        };

        const isInCart = computed(() => {
            return cartStore.items.some(item => item.product._id === product.value._id);
        });

        const cartItem = computed(() => {
            const item = cartStore.items.find(item => item.product._id === product.value._id);
            if (item && item.product.selectedVariant) {
                item.product.price = item.product.selectedVariant.price;
            }
            return item;
        });

        const decrementQuantity = async () => {
            if (isInCart.value) {
                if (cartItem.value.quantity > 1) {
                    await cartStore.updateQuantity(product.value._id, cartItem.value.quantity - 1);
                } else {
                    await cartStore.removeFromCart(product.value._id);
                }
            } else if (quantity.value > 1) {
                quantity.value--;
            }
        };

        const incrementQuantity = async () => {
            if (isInCart.value) {
                await cartStore.updateQuantity(product.value._id, cartItem.value.quantity + 1);
            } else {
                quantity.value++;
            }
        };

        const addToCart = async () => {
            if (!selectedColor.value) {
                toast.error('Please select a color before adding to cart');
                return;
            }
            if (!selectedSize.value) {
                toast.error('Please select a size before adding to cart');
                return;
            }

            const currentVariant = product.value.variants.find(v => {
                const sizeAttribute = v.attributes.find(attr =>
                    [
                        'size',
                        'measurement',
                        'length',
                        'width',
                        'height',
                        'shape',
                        'storage',
                        'capacity',
                        'volume'
                    ].includes(attr.name.toLowerCase()) &&
                    attr.value === selectedSize.value
                );
                return v.color?.hexCode === selectedColor.value && sizeAttribute;
            });

            if (!currentVariant) {
                toast.error('Selected combination is not available');
                return;
            }

            if (!currentVariant.stock) {
                toast.error('Selected variant is out of stock');
                return;
            }

            try {
                const addedQuantity = quantity.value;

                const payload = {
                    _id: product.value._id,
                    name: product.value.name,
                    price: currentVariant.price,
                    selectedVariant: currentVariant,
                    quantity: addedQuantity
                };

                await cartStore.addToCart(payload, addedQuantity, {
                    variant: {
                        _id: currentVariant._id,
                        color: selectedColor.value,
                        size: selectedSize.value,
                        price: currentVariant.price,
                        attributes: currentVariant.attributes
                    }
                });

                await cartStore.fetchCart();
                toast.success(`Added ${addedQuantity} item(s) to cart`);
                quantity.value = 1;

            } catch (error) {
                console.error('Error adding to cart:', error);
                toast.error('Failed to add item to cart, Please login');
            }
        };

        const cartCount = computed(() => cartStore.cartCount);

        const displayProducts = computed(() => {
            return relatedProducts.value.length > 0 ? relatedProducts.value : randomProducts.value;
        });

        const fetchRelatedProducts = async () => {
            try {
                relatedProducts.value = await productStore.fetchRelatedProducts(props.id);
                if (relatedProducts.value.length === 0) {
                    randomProducts.value = await productStore.fetchRandomProducts(4, props.id);
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
                toast.error('Failed to load related products');
            }
        };

        const truncateDescription = (description, maxLength = 100) => {
            return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
        };

        const calculateOriginalPrice = (product) => {
            return product.originalPrice || (product.discount ? Math.round(product.price / (1 - product.discount / 100)) : product.price);
        };

        const fetchReviews = async () => {
            try {
                const response = await apiClient.get(`/products/${props.id}/ratings`);
                reviews.value = response.data;
            } catch (error) {
                console.error('Error fetching reviews:', error);
                toast.error('Failed to load reviews');
            }
        };

        const checkCanReview = async () => {
            if (!userStore.isLoggedIn) {
                console.log("User is not logged in");
                canReview.value = false;
                return;
            }
            try {
                const orders = await orderStore.fetchUserOrders();

                const hasAlreadyReviewed = reviews.value.some(review =>
                    review.user._id === userStore.user._id
                );

                if (hasAlreadyReviewed) {
                    console.log("User has already reviewed this product");
                    canReview.value = false;
                    return;
                }

                canReview.value = orders.some(order => {
                    const productMatch = order.products.some(item => {
                        if (!item.product) return false;
                        const productId = typeof item.product === 'object' ? item.product._id : item.product;
                        return String(productId) === String(props.id);
                    });
                    return productMatch &&
                        order.status === 'Delivered' &&
                        !order.ratedProducts.some(p => String(p.product) === String(props.id));
                });
            } catch (error) {
                console.error('Error checking review eligibility:', error);
                canReview.value = false;
            }
        };

        const openReviewModal = () => {
            if (!userStore.isLoggedIn) {
                toast.error('Please log in to write a review');
                return;
            }
            if (canReview.value) {
                showReviewModal.value = true;
            } else {
                if (reviews.value.some(review => review.user._id === userStore.user._id)) {
                    toast.error('You have already reviewed this product');
                } else {
                    toast.error('You can only review products you have purchased and received');
                }
            }
        };

        const closeReviewModal = () => {
            showReviewModal.value = false;
            newReview.value = { rating: 0, review: '' };
        };

        const submitReview = async () => {
            try {
                await productStore.rateProduct(props.id, newReview.value.rating, newReview.value.review);
                await orderStore.updateProductRatedStatus(props.id);

                toast.success('Review submitted successfully');
                closeReviewModal();
                fetchReviews();
                canReview.value = false;

                fetchProductDetails();

            } catch (error) {
                console.error('Error submitting review:', error);
                toast.error('Failed to submit review');
            }
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        onMounted(async () => {
            await fetchProductDetails();
            initWishlist();
            await fetchRelatedProducts();

            if (product.value?.images?.length) {
                mainImage.value = product.value.images[0];
                originalImage.value = product.value.images[0];
            }

            startSocialProofLoop();
            if (isInCart.value) {
                quantity.value = cartItem.value.quantity;
            }

            fetchReviews();
            await checkCanReview();

            if (userStore.isLoggedIn && product.value?.user?.sellerProfile) {
                try {
                    await sellerStore.fetchFollowStatus(product.value.user.sellerProfile._id);
                } catch (error) {
                    console.error('Error fetching follow status:', error);
                }
            }
        });

        onUnmounted(() => {
            clearInterval(interval);
        });

        watch(() => product.value, (newProduct) => {
            if (newProduct) {
                if (newProduct.color) {
                    selectedColor.value = newProduct.color;
                } else if (newProduct.variants?.length > 0 && newProduct.variants[0]?.color?.hexCode) {
                    selectedColor.value = newProduct.variants[0].color.hexCode;
                }
                console.log('Selected Color:', selectedColor.value);
            }
        }, { immediate: true });

        watch(selectedSize, (newSize, oldSize) => {
            if (newSize !== oldSize) {
                console.log('Size changed from', oldSize, 'to', newSize);
                const variant = product.value?.variants?.find(v => {
                    const sizeAttribute = v.attributes.find(attr =>
                        (attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'shape')
                    );
                    return sizeAttribute?.value === newSize &&
                        (!selectedColor.value || v.color?.hexCode === selectedColor.value);
                });

                if (variant) {
                    console.log('Size watcher - Updating price to:', variant.price);
                    product.value.price = variant.price;
                }
            }
        });

        watch(selectedColor, (newColor, oldColor) => {
            if (newColor !== oldColor) {
                console.log('Color changed from', oldColor, 'to', newColor);
                const variant = product.value?.variants?.find(v => {
                    const sizeAttribute = v.attributes.find(attr =>
                        (attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'shape')
                    );
                    return v.color?.hexCode === newColor &&
                        (!selectedSize.value || sizeAttribute?.value === selectedSize.value);
                });

                if (variant) {
                    console.log('Color watcher - Updating price to:', variant.price);
                    product.value.price = variant.price;
                }
            }
        });

        watch(() => product.value?.averageRating, (newRating) => {
            console.log('Rating changed:', newRating);
            console.log('Display rating:', displayRating.value);
        });

        const navigateToProduct = (productId) => {
            if (props.id === productId) {
                window.location.reload();
            } else {
                router.push({ name: 'ProductDetails', params: { id: productId } });
            }
        };

        const handleSeeAll = () => {
            console.log('Showing all reviews');
        };

        return {
            product,
            mainImage,
            hoveredImage,
            sizes,
            socialProof,
            currentSocialProof,
            prevImage,
            nextImage,
            user,
            address,
            visitSellerStore,
            selectedColor,
            selectedSize,
            featuredFeatures,
            randomAvatarUrl,
            isInWishlist,
            toggleWishlist,
            zoomLevel,
            isZoomed,
            mainImageRef,
            toggleZoom,
            handleImageMove,
            quantity,
            decrementQuantity,
            incrementQuantity,
            addToCart,
            cartCount,
            showStockAlert,
            formatRating,
            displayRating,
            relatedProducts,
            randomProducts,
            displayProducts,
            navigateToProduct,
            truncateDescription,
            calculateOriginalPrice,
            reviews,
            showReviewModal,
            newReview,
            canReview,
            openReviewModal,
            closeReviewModal,
            submitReview,
            formatTitle,
            formatDescription,
            toggleDescription,
            formatDate,
            hasColors,
            getSelectedColorName,
            previewVariantImage,
            selectVariantColor,
            resetMainImage,
            showSizeGuide,
            hasSizes,
            availableSizes,
            getSelectedVariantStock,
            sizeGuideMetrics,
            getSizeGuideData,
            selectSize,
            SizeSelector,
            availableColors,
            updateAvailableColors,
            isLoading,
            isFollowing,
            followSeller,
            messageStore,
            handleSeeAll
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 1200px;
}

.social-proof-transition-enter-active,
.social-proof-transition-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.social-proof-transition-enter,
.social-proof-transition-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-spinner {
    -moz-appearance: textfield;
}

.color-tooltip {
    @apply invisible group-hover:visible absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-gray-900 text-white px-2 py-1 rounded-md;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Custom scrollbar hide for horizontal scroll */
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Mobile specific styles */
@media (max-width: 1023px) {
    .overflow-x-auto {
        scroll-behavior: smooth;
    }

    /* Ensure proper touch scrolling on mobile */
    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
    }
}

/* Responsive grid adjustments */
@media (max-width: 640px) {
    .grid-cols-4 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 480px) {
    .grid-cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
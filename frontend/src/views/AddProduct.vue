<template>
    <div class="min-h-screen bg-slate-50/50">
        <!-- Modern Hero Header -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-[#ff934b] to-[#ff5e62] py-16 sm:py-20 shadow-md">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-3xl mx-auto text-center space-y-4">
                    <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-none drop-shadow-sm">{{ pageTitle }}</h1>
                    <p class="text-sm sm:text-lg text-white/95 font-medium max-w-xl mx-auto">{{ pageSubtitle }}</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 -mt-12 sm:-mt-16 pb-20 relative z-10">
            <div class="max-w-4xl mx-auto">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    
                    <!-- Card: Category Selection -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div class="flex items-center gap-3 pb-3 border-b border-slate-50">
                            <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                <Tag class="w-5 h-5" />
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.category') }}</h3>
                                <p class="text-xs text-slate-500">{{ t('addProductPage.categorySubtitle', 'Select the primary classification for your product') }}</p>
                            </div>
                        </div>
                        
                        <div class="space-y-2">
                            <HierarchicalCategorySelector :categories="categories"
                                v-model="product.category"
                                v-model:selectedCategories="selectedCategories"
                                @update:selectedCategories="updateSelectedCategories"
                                class="focus:ring-2 focus:ring-[#ff934b]/20" />
                        </div>
                    </div>

                    <!-- Card: Seller Selection (Admin Only) -->
                    <div v-if="adminMode" class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
                        <div class="flex items-center gap-3 pb-3 border-b border-slate-50">
                            <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                <User class="w-5 h-5" />
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-800">{{ t('adminProducts.form.seller') }}</h3>
                                <p class="text-xs text-slate-500">{{ t('adminProducts.form.sellerHelpText', 'Assign this product to a verified store owner') }}</p>
                            </div>
                        </div>
                        
                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                            <User class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <select
                                v-model="selectedSellerId"
                                class="w-full bg-transparent px-4 py-3 pl-11 text-slate-700 focus:outline-none text-sm appearance-none"
                                required
                            >
                                <option value="">{{ t('adminProducts.form.selectSeller') }}</option>
                                <option v-for="seller in sellers" :key="seller._id" :value="seller._id">
                                    {{ seller.storeName }} - {{ seller.user?.email || seller.user?.username || t('adminProducts.form.unknownSeller') }}
                                </option>
                            </select>
                            <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <!-- Card: Basic Information -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div class="flex items-center gap-3 pb-3 border-b border-slate-50">
                            <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                <ShoppingBag class="w-5 h-5" />
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.basicInformation') }}</h3>
                                <p class="text-xs text-slate-500">{{ t('addProductPage.basicInformationHelpText', 'Enter the primary identity and visual attributes of your product') }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- Product Name -->
                            <div class="space-y-2 lg:col-span-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.productName') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <ShoppingBag class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="text" v-model="product.name"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        :placeholder="t('addProductPage.productNamePlaceholder')" required />
                                </div>
                            </div>

                            <!-- Brand -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.brand') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Award class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="text" v-model="product.brand"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        :placeholder="t('addProductPage.brandPlaceholder')" />
                                </div>
                            </div>

                            <!-- Main Color Picker -->
                            <div class="space-y-4 lg:col-span-3">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.primaryDisplayColor') }}</label>
                                
                                <!-- Scrollable Color Selection Grid -->
                                <div class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-inner">
                                    <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-y-4 gap-x-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        <div v-for="color in allColors" :key="color.hexCode"
                                            class="flex flex-col items-center gap-1 group/color cursor-pointer"
                                            @click="selectColorPreset(color)">
                                            <div :class="[
                                                'w-7 h-7 rounded-full border-2 transition-all duration-200 shadow-sm relative hover:scale-110 active:scale-95',
                                                product.color.toLowerCase() === color.hexCode.toLowerCase() && !isCustomColor
                                                    ? 'border-[#ff934b] scale-110 ring-4 ring-[#ff934b]/20'
                                                    : 'border-slate-200 hover:border-[#ff934b]/55'
                                            ]" :style="{ backgroundColor: color.hexCode }" :title="color.name">
                                                <div v-if="product.color.toLowerCase() === color.hexCode.toLowerCase() && !isCustomColor" 
                                                    class="absolute inset-0 flex items-center justify-center">
                                                    <div class="w-1.5 h-1.5 rounded-full bg-white shadow-sm ring-1 ring-black/10"></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- "Other" Option -->
                                        <div class="flex flex-col items-center gap-1 cursor-pointer" @click="toggleCustomColor()">
                                            <div :class="[
                                                'w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 bg-white',
                                                isCustomColor 
                                                    ? 'border-[#ff934b] scale-110 ring-4 ring-[#ff934b]/20' 
                                                    : 'border-slate-300 hover:border-[#ff934b]/55'
                                            ]">
                                                <Plus class="w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Custom Color Inputs (Visible when "Other" is selected) -->
                                <div v-if="isCustomColor" class="flex items-center gap-3 mt-4 p-4 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div class="relative group">
                                        <input type="color" v-model="product.color"
                                            class="h-11 w-11 rounded-xl border border-slate-200 cursor-pointer p-1 bg-white"
                                            @input="updateMainColor" />
                                    </div>
                                    <div class="flex-1 relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-white shadow-sm transition-all duration-300">
                                        <Palette class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input type="text" v-model="mainColorName" :placeholder="t('addProductPage.colorNamePlaceholder')"
                                            class="w-full px-4 py-2.5 pl-11 text-sm text-slate-700 bg-transparent border-none focus:outline-none" />
                                    </div>
                                </div>
                                <!-- Suggestion hint -->
                                <div v-else class="text-[11px] text-slate-400 font-medium px-1 flex items-center gap-1.5 bg-slate-50/50 py-1.5 px-3 rounded-lg w-max border border-slate-100/80">
                                    <Sparkles class="w-3 h-3 text-[#ff934b] animate-pulse" />
                                    <span>{{ t('addProductPage.selected') }}:</span>
                                    <span class="text-[#ff934b] font-bold">{{ mainColorName || t('addProductPage.none') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="space-y-2">
                            <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.description') }}</label>
                            <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                <FileText class="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                                <textarea v-model="product.description" rows="4"
                                    class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm resize-none"
                                    :placeholder="t('addProductPage.descriptionPlaceholder', 'Provide detailed specifications and descriptions for your product')"
                                    required></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Card: Images -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div class="flex items-center gap-3 pb-3 border-b border-slate-50">
                            <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                <Image class="w-5 h-5" />
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.productImages') }}</h3>
                                <p class="text-xs text-slate-500">{{ t('addProductPage.productImagesHelpText', 'Upload high-quality images of your product (Maximum 5 images, up to 5MB each)') }}</p>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="relative rounded-2xl border-2 border-dashed border-slate-200 p-8 hover:border-[#ff934b] hover:bg-slate-50/40 transition-all duration-300 group cursor-pointer flex flex-col items-center justify-center">
                                <input type="file" @change="handleImageUpload"
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple
                                    accept="image/*" />
                                <div class="text-center space-y-2">
                                    <div class="p-3 bg-slate-50 rounded-full w-max mx-auto group-hover:bg-[#ff934b]/10 transition-colors duration-300">
                                        <UploadCloud class="w-10 h-10 text-slate-400 group-hover:text-[#ff934b] transition-colors duration-300" />
                                    </div>
                                    <p class="text-sm font-semibold text-slate-600">{{ t('addProductPage.imageUploadPrompt') }}</p>
                                    <p class="text-xs text-slate-400">{{ t('addProductPage.imageUploadHint') }}</p>
                                </div>
                            </div>

                            <!-- Image Previews -->
                            <div v-if="imagePreviews.length" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
                                <div v-for="(preview, index) in imagePreviews" :key="index" class="relative group/img aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                                    <img :src="preview" alt="Product preview" class="w-full h-full object-cover" />
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button @click="removeImage(index)" type="button"
                                            class="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all hover:scale-105 active:scale-95 shadow-md">
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div class="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 text-white text-[9px] font-bold rounded backdrop-blur-sm">
                                        {{ index === 0 ? t('addProductPage.primaryImage', 'Primary') : `#${index + 1}` }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card: Pricing -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div class="flex items-center gap-3 pb-3 border-b border-slate-50">
                            <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                <Banknote class="w-5 h-5" />
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.pricing') }}</h3>
                                <p class="text-xs text-slate-500">{{ t('addProductPage.pricingHelpText', 'Configure the sale prices, comparison pricing, and discount details') }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Price -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.price') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">{{ currencySymbol }}</span>
                                    <input type="number" v-model.number="product.price"
                                        class="w-full px-4 py-3 pl-9 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        step="0.01" min="0" required />
                                </div>
                                <p class="text-xs font-semibold text-slate-500 pl-1">{{ formatPricePreview(product.price) }}</p>
                            </div>

                            <!-- Original Price -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.originalPrice') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">{{ currencySymbol }}</span>
                                    <input type="number" v-model.number="product.originalPrice"
                                        class="w-full px-4 py-3 pl-9 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        step="0.01" min="0" />
                                </div>
                                <p class="text-xs font-semibold text-slate-500 pl-1">{{ formatPricePreview(product.originalPrice) }}</p>
                            </div>

                            <!-- Discount -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.discount') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Percent class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="number" v-model.number="product.discount"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        min="0" max="100" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card: Inventory -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div class="flex items-center justify-between pb-3 border-b border-slate-50">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                    <Package class="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.inventory') }}</h3>
                                    <p class="text-xs text-slate-500">{{ t('addProductPage.inventoryHelpText', 'Manage your product stock counts and availability states') }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                <input type="checkbox" v-model="product.isAvailable" id="prodAvailable"
                                    class="rounded border-slate-300 text-[#ff934b] focus:ring-[#ff934b]/20 h-4 w-4 cursor-pointer" />
                                <label for="prodAvailable" class="text-xs font-semibold text-slate-700 cursor-pointer select-none">{{ t('addProductPage.availableForSale') }}</label>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Stock -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.stock') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Package class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="number" v-model.number="product.stock"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        min="0" required />
                                </div>
                            </div>

                            <!-- Reserved Stock -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.reservedLocked') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="number" v-model.number="product.reservedStock"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        min="0" />
                                </div>
                                <p class="text-[10px] text-slate-400 pl-1">{{ t('addProductPage.itemsInPendingOrders') }}</p>
                            </div>

                            <!-- Available For Sale -->
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-[#e8803c] block">{{ t('addProductPage.availableForSaleCount') }}</label>
                                <div class="relative rounded-xl border border-[#ff934b]/30 bg-[#ff934b]/5 flex items-center px-4 py-3 h-[46px]">
                                    <span class="text-base font-bold text-[#ff934b]">{{ availableStock }}</span>
                                </div>
                                <p class="text-[10px] text-[#ff934b]/80 pl-1">{{ t('addProductPage.availableForSaleFormula') }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Card: Unit Information -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div class="flex items-center justify-between pb-3 border-b border-slate-50">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                    <Scale class="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.unitInformation') }}</h3>
                                    <p class="text-xs text-slate-500">{{ t('addProductPage.unitInformationHelpText', 'Configure unit presets and package options') }}</p>
                                </div>
                            </div>
                            
                            <!-- Quick Setup Dropdown -->
                            <div class="relative">
                                <button type="button" @click="showSections.unitDropdown = !showSections.unitDropdown"
                                    class="flex items-center gap-2 px-3 py-1.5 bg-[#ff934b]/10 text-[#ff934b] rounded-lg text-xs font-semibold hover:bg-[#ff934b]/20 transition-all duration-200 active:scale-95 shadow-sm">
                                    <Sparkles class="w-3.5 h-3.5" />
                                    <span>{{ t('addProductPage.quickSetupUnits') }}</span>
                                    <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': showSections.unitDropdown }" />
                                </button>
                                <div v-if="showSections.unitDropdown"
                                    class="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button v-for="preset in unitPresets" :key="preset.label" type="button"
                                        @click="applyUnitPreset(preset); showSections.unitDropdown = false"
                                        class="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-[#ff934b]/10 hover:text-[#ff934b] transition-colors">
                                        {{ preset.label }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- Unit Category -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.unitCategory') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Sliders class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                    <select v-model="product.unit.category" @change="updateUnitOptions"
                                        class="w-full bg-transparent px-4 py-3 pl-11 text-slate-700 focus:outline-none text-sm appearance-none"
                                        required>
                                        <option value="">{{ t('addProductPage.selectCategory') }}</option>
                                        <option value="weight">{{ t('addProductPage.unitCategories.weight') }}</option>
                                        <option value="volume">{{ t('addProductPage.unitCategories.volume') }}</option>
                                        <option value="length">{{ t('addProductPage.unitCategories.length') }}</option>
                                        <option value="area">{{ t('addProductPage.unitCategories.area') }}</option>
                                        <option value="quantity">{{ t('addProductPage.unitCategories.quantity') }}</option>
                                        <option value="time">{{ t('addProductPage.unitCategories.time') }}</option>
                                        <option value="other">{{ t('addProductPage.unitCategories.other') }}</option>
                                    </select>
                                    <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <!-- Base Unit -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.baseUnit') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Scale class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="text" v-model="product.unit.baseUnit" :placeholder="t('addProductPage.baseUnitPlaceholder')"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        required />
                                </div>
                            </div>

                            <!-- Conversion Factor -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.conversionFactor') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <TrendingUp class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="number" v-model.number="product.unit.conversionFactor"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        step="0.01" min="0" required />
                                </div>
                            </div>

                            <!-- Unit Value -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.unitValue') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Activity class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="number" v-model.number="product.unit.value"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        step="0.01" min="0" required />
                                </div>
                            </div>

                            <!-- Display Unit -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.displayUnit') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Eye class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="text" v-model="product.unit.displayUnit" :placeholder="t('addProductPage.displayUnitPlaceholder')"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm" />
                                </div>
                            </div>

                            <!-- Packaging Unit -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.packagingUnit') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                    <Box class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="text" v-model="product.unit.packagingUnit"
                                        :placeholder="t('addProductPage.packagingUnitPlaceholder')"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Product Variants Card (Collapsible) -->
                    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <button @click="showSections.variants = !showSections.variants" type="button"
                            class="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50/50 transition-colors group">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                    <Layers class="w-5 h-5" />
                                </div>
                                <div class="text-left">
                                    <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.variants.title') }}</h3>
                                    <p class="text-xs text-slate-500">{{ t('addProductPage.variants.subtitle', 'Configure sizes, colors, capacities or custom SKU variations') }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-[#ff934b] font-bold group-hover:underline">{{
                                    showSections.variants ? t('addProductPage.variants.hide') : t('addProductPage.variants.show') }}</span>
                                <ChevronDown class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{ 'rotate-180': showSections.variants }" />
                            </div>
                        </button>

                        <div v-show="showSections.variants" class="p-6 sm:p-8 border-t border-slate-50 space-y-6 bg-slate-50/20 animate-in fade-in duration-300">
                            <div class="flex justify-end">
                                <button @click.stop="addVariant" type="button"
                                    class="px-4 py-2 text-sm bg-[#ff934b] hover:bg-[#e8803c] text-white rounded-xl font-semibold shadow-sm hover:shadow active:scale-95 transition-all duration-200 flex items-center gap-1.5">
                                    <Plus class="w-4 h-4" />
                                    <span>{{ t('addProductPage.variants.add') }}</span>
                                </button>
                            </div>

                            <div v-for="(variant, index) in product.variants" :key="index"
                                class="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative space-y-6">
                                <!-- Variant Header -->
                                <div class="flex justify-between items-center pb-4 border-b border-slate-50">
                                    <h4 class="font-bold text-slate-800 text-sm sm:text-base">{{ t('addProductPage.variants.variantNumber', { number: index + 1 }) }}</h4>
                                    <button @click="generateSku(index)" type="button"
                                        class="text-xs text-[#ff934b] font-bold hover:underline flex items-center gap-1 active:scale-95 transition-all duration-200">
                                        <Sparkles class="w-3.5 h-3.5" /> 
                                        <span>{{ t('addProductPage.variants.autoGenerateSku') }}</span>
                                    </button>
                                </div>
                                
                                <!-- Variant Attributes -->
                                <div class="space-y-4">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('addProductPage.variants.specsAndAttributes') }}</h4>
                                        <div class="flex flex-wrap gap-1.5">
                                            <button v-for="attr in variantAttributePresets"
                                                :key="attr.value" @click="addVariantAttribute(index, attr.value)" type="button"
                                                class="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg hover:border-[#ff934b]/55 hover:text-[#ff934b] active:scale-95 font-semibold transition-all duration-200">
                                                + {{ attr.label }}
                                            </button>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 gap-3">
                                        <div v-for="(attribute, attrIndex) in variant.attributes" :key="attrIndex"
                                            class="flex items-start gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-xl group/attr relative">
                                            <div class="w-1/3">
                                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Name</label>
                                                <input v-model="attribute.name"
                                                    class="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#ff934b] focus:outline-none"
                                                    :placeholder="t('addProductPage.variants.attributeNamePlaceholder')" />
                                            </div>
                                            <div class="flex-1">
                                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Value</label>
                                                <div v-if="attribute.name.toLowerCase() === 'color'"
                                                    class="flex flex-col gap-3">
                                                    <!-- Compact Color Picker for Variants -->
                                                    <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-white rounded-lg border border-slate-200 custom-scrollbar">
                                                        <div v-for="color in allColors" :key="color.hexCode"
                                                            @click="selectColorPreset(color, index)"
                                                            class="w-5 h-5 rounded-full border transition-all cursor-pointer relative hover:scale-110 active:scale-95"
                                                            :style="{ backgroundColor: color.hexCode }"
                                                            :title="color.name">
                                                            <div v-if="attribute.value.toLowerCase() === color.hexCode.toLowerCase()" 
                                                                class="absolute inset-0 flex items-center justify-center">
                                                                <div class="w-1 h-1 rounded-full bg-white shadow-sm ring-1 ring-black/10"></div>
                                                            </div>
                                                        </div>
                                                        <button @click="attribute.value = '#000000'" type="button" 
                                                            class="w-5 h-5 rounded-full border border-dashed border-slate-300 flex items-center justify-center bg-white hover:border-[#ff934b]/55 transition-colors">
                                                            <Plus class="w-2.5 h-2.5 text-slate-400" />
                                                        </button>
                                                    </div>
                                                    <!-- Hex/Name Input fallback -->
                                                    <div class="flex items-center gap-2">
                                                        <input type="color" v-model="attribute.value"
                                                            class="h-7 w-7 rounded border border-slate-200 p-0 cursor-pointer" />
                                                        <input v-model="attribute.value"
                                                            class="flex-1 text-[11px] text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg bg-white focus:border-[#ff934b] focus:outline-none"
                                                            :placeholder="t('addProductPage.variants.hexOrColorName')" />
                                                    </div>
                                                </div>
                                                <input v-else v-model="attribute.value"
                                                    class="w-full text-xs text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:border-[#ff934b] focus:outline-none"
                                                    :placeholder="t('addProductPage.variants.attributeValuePlaceholder')" />
                                            </div>
                                            <button @click="removeAttribute(index, attrIndex)" type="button"
                                                class="absolute right-2 top-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/attr:opacity-100">
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button @click="addVariantAttribute(index)" type="button"
                                            class="flex items-center justify-center gap-2 py-2 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 hover:border-[#ff934b]/55 hover:text-[#ff934b] transition-all">
                                            <Plus class="w-4 h-4" /> 
                                            <span>{{ t('addProductPage.variants.addCustomAttribute') }}</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Variant Details -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <label class="text-xs font-semibold text-slate-700 block">{{ t('addProductPage.variants.sku') }}</label>
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <Barcode class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input v-model="variant.sku"
                                                class="w-full px-4 py-2.5 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                :placeholder="t('addProductPage.variants.sku')" />
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-xs font-semibold text-slate-700 block">{{ t('addProductPage.price') }}</label>
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">{{ currencySymbol }}</span>
                                            <input type="number" v-model.number="variant.price"
                                                class="w-full px-4 py-2.5 pl-9 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                min="0" step="0.01" />
                                        </div>
                                        <p class="text-[10px] text-slate-400 pl-1">{{ formatPricePreview(variant.price) }}</p>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-xs font-semibold text-slate-700 block">{{ t('addProductPage.stock') }}</label>
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <Package class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input type="number" v-model.number="variant.stock"
                                                class="w-full px-4 py-2.5 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                min="0" />
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-xs font-semibold text-slate-700 block">{{ t('addProductPage.variants.weight') }}</label>
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <Scale class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input type="number" v-model.number="variant.weight"
                                                class="w-full px-4 py-2.5 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                step="0.01" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Variant Dimensions -->
                                <div class="space-y-2">
                                    <label class="text-xs font-semibold text-slate-700 block">{{ t('addProductPage.variants.dimensions') }}</label>
                                    <div class="grid grid-cols-3 gap-3">
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <input type="number" v-model.number="variant.dimensions.length"
                                                class="w-full px-3 py-2 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                :placeholder="t('addProductPage.unitCategories.length')" step="0.01" />
                                        </div>
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <input type="number" v-model.number="variant.dimensions.width"
                                                class="w-full px-3 py-2 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                :placeholder="t('addProductPage.variants.width')" step="0.01" />
                                        </div>
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <input type="number" v-model.number="variant.dimensions.height"
                                                class="w-full px-3 py-2 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                :placeholder="t('addProductPage.variants.height')" step="0.01" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Variant Images -->
                                <div class="space-y-4">
                                    <label class="text-xs font-semibold text-slate-700 block">{{ t('addProductPage.variants.images') }}</label>
                                    <div class="relative rounded-xl border border-dashed border-slate-200 p-4 hover:border-[#ff934b] hover:bg-slate-50/20 transition-all cursor-pointer flex flex-col items-center justify-center">
                                        <input type="file" @change="(e) => handleVariantImageUpload(e, index)"
                                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple
                                            accept="image/*" />
                                        <div class="flex items-center gap-2">
                                            <UploadCloud class="w-5 h-5 text-slate-400" />
                                            <span class="text-xs text-slate-500 font-semibold">{{ t('addProductPage.variants.uploadPrompt') }}</span>
                                        </div>
                                    </div>

                                    <!-- Variant Images Preview -->
                                    <div v-if="variant.images?.length" class="flex flex-wrap gap-2.5">
                                        <div v-for="(img, imgIndex) in variant.images" :key="imgIndex"
                                            class="relative w-16 h-16 group/vimg border border-slate-100 rounded-lg overflow-hidden bg-slate-50">
                                            <img :src="img" :alt="`Variant ${index + 1} image ${imgIndex + 1}`" class="w-full h-full object-cover" />
                                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/vimg:opacity-100 transition-opacity flex items-center justify-center">
                                                <button @click.stop.prevent="removeVariantImage(index, imgIndex)" type="button"
                                                    class="p-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-all shadow-sm">
                                                    <Trash2 class="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Remove Variant Button -->
                                <div class="flex justify-end pt-2 border-t border-slate-50">
                                    <button @click="removeVariant(index)" type="button"
                                        class="px-3.5 py-1.5 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 flex items-center gap-1 text-xs font-bold active:scale-95">
                                        <Trash2 class="w-3.5 h-3.5" />
                                        <span>{{ t('addProductPage.variants.removeVariant') }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bulk Pricing Card (Collapsible) -->
                    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <button @click="showSections.bulkPricing = !showSections.bulkPricing" type="button"
                            class="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50/50 transition-colors group">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                    <TrendingUp class="w-5 h-5" />
                                </div>
                                <div class="text-left">
                                    <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.bulkPricing.title') }}</h3>
                                    <p class="text-xs text-slate-500">{{ t('addProductPage.bulkPricing.subtitle', 'Provide tiered bulk discounts based on minimum quantities') }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-[#ff934b] font-bold group-hover:underline">{{
                                    showSections.bulkPricing ? t('addProductPage.bulkPricing.hide') : t('addProductPage.bulkPricing.show') }}</span>
                                <ChevronDown class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{ 'rotate-180': showSections.bulkPricing }" />
                            </div>
                        </button>

                        <div v-show="showSections.bulkPricing" class="p-6 sm:p-8 border-t border-slate-50 space-y-6 bg-slate-50/20 animate-in fade-in duration-300">
                            <div class="flex justify-end">
                                <button @click.stop="addBulkPricing" type="button"
                                    class="px-4 py-2 text-sm bg-[#ff934b] hover:bg-[#e8803c] text-white rounded-xl font-semibold shadow-sm hover:shadow active:scale-95 transition-all duration-200 flex items-center gap-1.5">
                                    <Plus class="w-4 h-4" />
                                    <span>{{ t('addProductPage.bulkPricing.addPriceBreak') }}</span>
                                </button>
                            </div>

                            <div class="space-y-4">
                                <div v-for="(pricing, index) in product.bulkPricing" :key="index"
                                    class="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm relative group/bulk">
                                    
                                    <div class="flex-1 space-y-1 min-w-[120px]">
                                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Min Quantity</label>
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <Layers class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input type="number" v-model.number="pricing.quantity"
                                                :placeholder="t('addProductPage.bulkPricing.minQuantityPlaceholder')"
                                                class="w-full px-3 py-2 pl-9 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                min="0" />
                                        </div>
                                    </div>

                                    <div class="flex-1 space-y-1 min-w-[120px]">
                                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price Per Unit</label>
                                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                            <span class="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">{{ currencySymbol }}</span>
                                            <input type="number" v-model.number="pricing.price" :placeholder="t('addProductPage.bulkPricing.pricePerUnitPlaceholder')"
                                                class="w-full px-3 py-2 pl-9 text-slate-700 bg-transparent border-none focus:outline-none text-xs"
                                                step="0.01" min="0" />
                                        </div>
                                    </div>

                                    <div class="w-full md:w-auto self-end flex justify-between items-center gap-4">
                                        <p class="text-[10px] font-bold text-[#ff934b]">{{ formatPricePreview(pricing.price) }}</p>
                                        <button @click="removeBulkPricing(index)" type="button"
                                            class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Meta Information Card (Collapsible) -->
                    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <button @click="showSections.seo = !showSections.seo" type="button"
                            class="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50/50 transition-colors group">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                    <Globe class="w-5 h-5" />
                                </div>
                                <div class="text-left">
                                    <h3 class="text-lg font-bold text-slate-800">{{ t('addProductPage.seo.title') }}</h3>
                                    <p class="text-xs text-slate-500">{{ t('addProductPage.seo.subtitle', 'Optimize search engine listing title, descriptions, and tags') }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-[10px] bg-[#ff934b]/10 text-[#ff934b] px-2.5 py-1 rounded-full font-bold border border-[#ff934b]/20"
                                    v-if="seoAutoMode">{{ t('addProductPage.seo.autoGenOn') }}</span>
                                <span class="text-xs text-[#ff934b] font-bold group-hover:underline ml-2">{{
                                    showSections.seo ? t('addProductPage.seo.hide') : t('addProductPage.seo.show') }}</span>
                                <ChevronDown class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{ 'rotate-180': showSections.seo }" />
                            </div>
                        </button>

                        <div v-show="showSections.seo" class="p-6 sm:p-8 border-t border-slate-50 space-y-6 bg-slate-50/20 animate-in fade-in duration-300">
                            <!-- Auto-gen Toggle -->
                            <div class="flex items-center gap-2 p-4 bg-[#ff934b]/5 rounded-xl border border-[#ff934b]/20">
                                <input type="checkbox" v-model="seoAutoMode" id="seoAuto"
                                    class="rounded border-slate-300 text-[#ff934b] focus:ring-[#ff934b]/20 h-4 w-4 cursor-pointer" />
                                <label for="seoAuto" class="text-xs font-bold text-[#e8803c] flex items-center gap-1.5 cursor-pointer select-none">
                                    <Sparkles class="w-3.5 h-3.5 animate-pulse" /> 
                                    <span>{{ t('addProductPage.seo.autoGenerate') }}</span>
                                </label>
                            </div>
                            
                            <!-- Meta Title -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.seo.metaTitle') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-white transition-all duration-300">
                                    <Globe class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="text" v-model="product.metaTitle"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        maxlength="60" />
                                </div>
                            </div>

                            <!-- Meta Description -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.seo.metaDescription') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-white transition-all duration-300">
                                    <FileText class="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                                    <textarea v-model="product.metaDescription"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm resize-none"
                                        rows="3" maxlength="160"></textarea>
                                </div>
                            </div>

                            <!-- Tags -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-slate-700 block">{{ t('addProductPage.seo.tags') }}</label>
                                <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-white transition-all duration-300">
                                    <Hash class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input type="text" v-model="tagsInput"
                                        class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                                        :placeholder="t('addProductPage.seo.tagsPlaceholder')" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                        <button type="button" @click="cancelAddProduct"
                            class="px-6 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl border border-slate-200 transition-all duration-200 active:scale-95">
                            {{ t('addProductPage.cancel') }}
                        </button>
                        <button type="submit"
                            class="px-6 py-3 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-lg shadow-[#ff934b]/20 hover:shadow-xl hover:shadow-[#ff934b]/30 active:scale-95 transition-all duration-300">
                            {{ submitLabel }}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useProductStore } from '../store/productStore.js';
import { useUserStore } from '../store/user.js';
import { useAddressStore } from '../store/addressStore.js';
import apiClient from '../api/axios';
import uploadService from '../services/uploadService';
import { toast } from 'vue-sonner';
import { 
    Trash2, UploadCloud, ChevronDown, ChevronRight, Sparkles, Settings2, Plus,
    Tag, User, ShoppingBag, Award, Palette, FileText, Image, Banknote, Percent,
    Package, Lock, Scale, Sliders, TrendingUp, Activity, Eye, Box, Layers, Barcode,
    Globe, Hash, X
} from 'lucide-vue-next';
import { parseColorValue, getColorName, getAllColors, isColorPreset } from '../utils/colorUtils.js';
import { formatCurrencyAmount, getCurrencyForCountry } from '../utils/countryCurrency.js';
import HierarchicalCategorySelector from './HierarchicalCategorySelector.vue';

export default {
    name: 'AddProduct',
    components: {
        HierarchicalCategorySelector, Trash2, UploadCloud, ChevronDown, ChevronRight, Sparkles, Settings2, Plus,
        Tag, User, ShoppingBag, Award, Palette, FileText, Image, Banknote, Percent,
        Package, Lock, Scale, Sliders, TrendingUp, Activity, Eye, Box, Layers, Barcode,
        Globe, Hash, X
    },

    props: {
        fromDashboard: {
            type: Boolean,
            default: false
        },
        adminMode: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const { t } = useI18n();
        const route = useRoute();
        const router = useRouter();
        const productStore = useProductStore();
        const userStore = useUserStore();
        const addressStore = useAddressStore();
        const categories = ref([]);
        const sellers = ref([]);
        const selectedSellerId = ref('');
        const isEditing = ref(false);
        const editingProductId = ref('');
        const product = reactive({
            name: '',
            description: '',
            price: 0,
            originalPrice: 0,
            stock: 0,
            reservedStock: 0,
            category: null,
            tags: [],
            images: [],
            brand: '',
            discount: 0,
            isAvailable: true,
            unit: {
                category: '',
                baseUnit: '',
                conversionFactor: 1,
                value: 1,
                displayUnit: '',
                packagingUnit: '',
                precision: 2,
                compoundUnit: {
                    numerator: '',
                    denominator: ''
                },
            },

            color: '#000000',
            availableColors: [],

            variants: [],
            bulkPricing: [],
            metaTitle: '',
            metaDescription: '',
        });

        const availableStock = computed(() => {
            return (product.stock || 0) - (product.reservedStock || 0);
        });

        const pageTitle = computed(() => {
            if (props.adminMode && isEditing.value) return t('adminProducts.modal.editTitle');
            if (props.adminMode) return t('adminProducts.modal.addTitle');
            return t('addProductPage.title');
        });

        const pageSubtitle = computed(() => {
            if (props.adminMode && isEditing.value) {
                return t('adminProducts.editPageSubtitle');
            }
            if (props.adminMode) {
                return t('adminProducts.createPageSubtitle');
            }
            return t('addProductPage.subtitle');
        });

        const submitLabel = computed(() => {
            if (props.adminMode && isEditing.value) return t('adminProducts.actions.update');
            if (props.adminMode) return t('adminProducts.actions.create');
            return t('addProductPage.submit');
        });

        const activeFormCurrency = computed(() => {
            if (props.adminMode) {
                const selectedSeller = sellers.value.find((seller) => seller._id === selectedSellerId.value);
                const currency = selectedSeller?.user?.currency;
                if (currency) return currency;
                
                const countryCode = selectedSeller?.user?.countryCode || selectedSeller?.countryCode;
                const xofCodes = ['BJ', 'BF', 'CI', 'GW', 'ML', 'NE', 'SN', 'TG'];
                if (countryCode && xofCodes.includes(countryCode.toUpperCase())) {
                    return 'XOF';
                }
                return 'NGN';
            }

            const userCurrency = userStore.user?.currency;
            if (userCurrency) return userCurrency;

            const userCountryCode = userStore.user?.countryCode;
            const xofCodes = ['BJ', 'BF', 'CI', 'GW', 'ML', 'NE', 'SN', 'TG'];
            if (userCountryCode && xofCodes.includes(userCountryCode.toUpperCase())) {
                return 'XOF';
            }
            return 'NGN';
        });

        const currencySymbol = computed(() => {
            return activeFormCurrency.value === 'XOF' ? 'CFA' : '₦';
        });

        const formatPricePreview = (value) => formatCurrencyAmount(value, activeFormCurrency.value);

        // Watchers for automatic discount calculation
        watch([() => product.price, () => product.originalPrice], ([newPrice, newOriginalPrice]) => {
            if (newOriginalPrice && newOriginalPrice > 0 && newPrice && newPrice > 0) {
                const discount = ((newOriginalPrice - newPrice) / newOriginalPrice) * 100;
                product.discount = Math.max(0, Math.min(100, Math.round(discount))); // Round to whole integer
            }
        });

        const tagsInput = ref('');
        const imagePreviews = ref([]);
        const selectedCategories = ref([]);

        const showSections = reactive({
            units: true,
            variants: false,
            bulkPricing: false,
            seo: false,
            unitDropdown: false
        });

        const seoAutoMode = ref(true);

        const unitPresets = [
            { label: 'Weight (kg)', category: 'weight', baseUnit: 'kilogram', factor: 1, display: 'kg' },
            { label: 'Weight (g)', category: 'weight', baseUnit: 'gram', factor: 1, display: 'g' },
            { label: 'Volume (L)', category: 'volume', baseUnit: 'liter', factor: 1, display: 'L' },
            { label: 'Volume (ml)', category: 'volume', baseUnit: 'milliliter', factor: 1, display: 'ml' },
            { label: 'Quantity (pcs)', category: 'quantity', baseUnit: 'piece', factor: 1, display: 'pcs' },
            { label: 'Quantity (pack)', category: 'quantity', baseUnit: 'pack', factor: 1, display: 'pack' },
        ];

        const variantAttributePresets = computed(() => ([
            { value: 'Color', label: t('addProductPage.variants.attributePresets.color') },
            { value: 'Size', label: t('addProductPage.variants.attributePresets.size') },
            { value: 'Capacity', label: t('addProductPage.variants.attributePresets.capacity') },
            { value: 'Material', label: t('addProductPage.variants.attributePresets.material') },
        ]));

        const applyUnitPreset = (preset) => {
            product.unit.category = preset.category;
            product.unit.baseUnit = preset.baseUnit;
            product.unit.conversionFactor = preset.factor;
            product.unit.value = preset.factor;
            product.unit.displayUnit = preset.display;
        };

        const generateSku = (index) => {
            const variant = product.variants[index];
            if (!variant) return;

            const namePart = product.name.substring(0, 3).toUpperCase();
            
            // Try to get color from attributes first, then fallback to variant.color.name
            const colorAttr = variant.attributes?.find(a => a.name.toLowerCase() === 'color');
            const colorName = colorAttr?.value || variant.color?.name || 'VAR';
            const colorPart = colorName.substring(0, 3).trim().toUpperCase();
            
            const randPart = Math.floor(1000 + Math.random() * 9000);
            variant.sku = `${namePart}-${colorPart}-${randPart}`;
        };

        // SEO Auto-generation watcher
        watch(seoAutoMode, (newVal) => {
            if (newVal) {
                updateSeo();
            }
        });

        const updateSeo = () => {
            if (!seoAutoMode.value) return;
            if (product.name) product.metaTitle = product.name.substring(0, 60);
            if (product.description) {
                const cleanDesc = product.description.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
                product.metaDescription = cleanDesc.substring(0, 160);
            }
            if (product.name && !tagsInput.value) {
                tagsInput.value = product.name.split(' ').slice(0, 3).join(', ');
            }
        };

        watch([() => product.name, () => product.description], () => {
            if (seoAutoMode.value) updateSeo();
        });

        const hydrateProductForm = (fetchedProduct) => {
            product.name = fetchedProduct.name || '';
            product.description = fetchedProduct.description || '';
            product.price = fetchedProduct.price || 0;
            product.originalPrice = fetchedProduct.originalPrice || 0;
            product.stock = fetchedProduct.stock || 0;
            product.reservedStock = fetchedProduct.reservedStock || 0;
            product.category = fetchedProduct.category?._id || fetchedProduct.category || null;
            product.tags = Array.isArray(fetchedProduct.tags) ? [...fetchedProduct.tags] : [];
            product.images = Array.isArray(fetchedProduct.images) ? [...fetchedProduct.images] : [];
            product.brand = fetchedProduct.brand || '';
            product.discount = fetchedProduct.discount || 0;
            product.isAvailable = fetchedProduct.isAvailable !== false;
            product.unit = fetchedProduct.unit ? JSON.parse(JSON.stringify(fetchedProduct.unit)) : {
                category: '',
                baseUnit: '',
                conversionFactor: 1,
                value: 1,
                displayUnit: '',
                packagingUnit: '',
                precision: 2,
                compoundUnit: { numerator: '', denominator: '' },
            };
            product.color = fetchedProduct.color || '#000000';
            product.availableColors = Array.isArray(fetchedProduct.availableColors)
                ? JSON.parse(JSON.stringify(fetchedProduct.availableColors))
                : [];
            product.variants = Array.isArray(fetchedProduct.variants)
                ? JSON.parse(JSON.stringify(fetchedProduct.variants))
                : [];
            product.bulkPricing = Array.isArray(fetchedProduct.bulkPricing)
                ? JSON.parse(JSON.stringify(fetchedProduct.bulkPricing))
                : [];
            product.metaTitle = fetchedProduct.metaTitle || '';
            product.metaDescription = fetchedProduct.metaDescription || '';

            tagsInput.value = product.tags.join(', ');
            imagePreviews.value = [...product.images];
            selectedSellerId.value = fetchedProduct.seller || fetchedProduct.user?.sellerProfile?._id || '';
        };

        onMounted(async () => {
            try {
                // Load latest user profile to ensure payout configuration is up to date
                if (userStore.isLoggedIn) {
                    await userStore.getUserProfile();
                }

                if (!props.adminMode) {
                    const user = userStore.user;
                    const paymentMethod = user?.paymentMethod || 'Paystack';
                    const hasPaystackDetails = user?.paystack?.accountNumber && user?.paystack?.bankCode;
                    const hasAfriExchangeDetails = user?.afriExchange?.walletAddress;
                    
                    const isPayoutConfigured = (paymentMethod === "AfriExchange" && hasAfriExchangeDetails) ||
                                               (paymentMethod === "Paystack" && hasPaystackDetails);
                                               
                    if (!isPayoutConfigured) {
                        toast.error("You must set up your payout bank details or link your AfriExchange wallet in Account settings before listing products.");
                        router.push('/account/profile/payout-settings');
                        return;
                    }

                    // Enforce dispatch address check
                    await addressStore.fetchUserAddresses();
                    const hasDispatchAddress = addressStore.addresses.some(addr => addr.isDispatch);
                    if (!hasDispatchAddress) {
                        toast.error("You must set up a seller dispatch address in your Address Book before listing products.");
                        router.push('/account/profile/address-book');
                        return;
                    }
                }

                categories.value = await productStore.fetchCategories();
                if (props.adminMode) {
                    const { data } = await apiClient.get('/admin/sellers?limit=200');
                    sellers.value = data.sellers || [];
                }

                if (props.adminMode && route.params.id) {
                    isEditing.value = true;
                    editingProductId.value = route.params.id;
                    const fetchedProduct = await productStore.fetchProductById(route.params.id);
                    hydrateProductForm(fetchedProduct);
                }

                // Initialize color selection state based on current product color
                const lowerColor = product.color?.toLowerCase();
                const matchesPreset = allColors.some(c => c.hexCode.toLowerCase() === lowerColor);
                isCustomColor.value = !matchesPreset && product.color !== '#000000';
                
                if (matchesPreset) {
                    const preset = allColors.find(c => c.hexCode.toLowerCase() === lowerColor);
                    mainColorName.value = preset.name;
                } else if (product.color) {
                    mainColorName.value = getColorName(product.color);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error(t('addProductPage.toasts.loadCategoriesFailed'));
                categories.value = [];
            }
        });

        const handleImageUpload = async (event) => {
            const files = event.target.files;
            if (!files.length) return;

            try {
                // Enforce 5-image limit
                const currentImagesCount = product.images ? product.images.length : 0;
                const remainingSlots = 5 - currentImagesCount;

                if (remainingSlots <= 0) {
                    toast.error(t('addProductPage.toasts.maxImagesReached'));
                    return;
                }

                const validFiles = Array.from(files).slice(0, remainingSlots).filter(file => {
                    if (!file.type.startsWith('image/')) {
                        toast.error(t('addProductPage.toasts.notImage', { fileName: file.name }));
                        return false;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                        toast.error(t('addProductPage.toasts.fileTooLarge', { fileName: file.name }));
                        return false;
                    }
                    return true;
                });

                if (validFiles.length === 0) {
                    if (Array.from(files).length > remainingSlots) {
                        toast.error(t('addProductPage.toasts.filesSkippedLimit'));
                    }
                    return;
                }

                // Set previews
                validFiles.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagePreviews.value.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                });

                // Upload to Cloudinary via Backend
                toast.loading(t('addProductPage.toasts.uploadingImages', { count: validFiles.length }));
                const urls = await uploadService.uploadImages(validFiles);
                console.log('Cloudinary URLs received:', urls);

                // Initialize images array if it doesn't exist
                if (!product.images) {
                    product.images = [];
                }

                // Add new URLs to existing ones
                product.images.push(...urls);
                toast.success(t('addProductPage.toasts.imagesUploaded'));

            } catch (error) {
                console.error('Error in image upload:', error);
                toast.error(t('addProductPage.toasts.uploadImagesFailed', { message: error.message }));
            }
        };

        const removeImage = (index) => {
            imagePreviews.value.splice(index, 1);
            if (product.images && product.images[index]) {
                product.images.splice(index, 1);
            }
        };

        const handleVariantImageUpload = async (event, variantIndex) => {
            const files = event.target.files;
            if (!files.length) return;

            console.log(`Uploading ${files.length} files for variant ${variantIndex}`);

            // Initialize images array if it doesn't exist
            if (!product.variants[variantIndex].images) {
                product.variants[variantIndex].images = [];
            }

            try {
                toast.loading(t('addProductPage.toasts.uploadingVariantImages', { count: files.length }));
                const urls = await uploadService.uploadImages(files);
                
                // Add new URLs to variant images
                product.variants[variantIndex].images.push(...urls);
                
                // Set preview for first image if not already set
                if (urls.length > 0 && !product.variants[variantIndex].preview) {
                    product.variants[variantIndex].preview = urls[0];
                }
                
                toast.success(t('addProductPage.toasts.variantImagesUploaded'));
            } catch (error) {
                console.error(`Error uploading variant images:`, error);
                toast.error(t('addProductPage.toasts.uploadVariantImagesFailed', { message: error.message }));
            }
        };

        const removeVariantImage = (variantIndex, imageIndex) => {
            if (product.variants[variantIndex]?.images) {
                product.variants[variantIndex].images = product.variants[variantIndex].images.filter(
                    (_, index) => index !== imageIndex
                );
            }
        };


        const updateSelectedCategories = (newSelectedCategories) => {
            selectedCategories.value = newSelectedCategories;
            if (selectedCategories.value.length > 0) {
                const lastCategory = selectedCategories.value[selectedCategories.value.length - 1];
                product.category = lastCategory._id;
            } else {
                product.category = null;
            }
        };

        // Add new ref for main color name
        const mainColorName = ref('');
        const allColors = getAllColors();
        const isCustomColor = ref(false);

        const selectColorPreset = (color, variantIndex = null) => {
            if (variantIndex !== null) {
                const colorAttr = product.variants[variantIndex].attributes.find(a => a.name.toLowerCase() === 'color');
                if (colorAttr) {
                    colorAttr.value = color.hexCode;
                    // Also update the variant's hidden color object for expansion
                    if (!product.variants[variantIndex].color) product.variants[variantIndex].color = {};
                    product.variants[variantIndex].color.name = color.name;
                    product.variants[variantIndex].color.hexCode = color.hexCode;
                }
            } else {
                product.color = color.hexCode.toLowerCase();
                mainColorName.value = color.name;
                isCustomColor.value = false;
            }
        };

        const toggleCustomColor = (variantIndex = null) => {
            if (variantIndex === null) {
                isCustomColor.value = true;
            }
            // For variants, we don't strictly need a toggle, just show the picker if not matched
        };

        const isVariantCustomColor = (variantIndex) => {
            const colorAttr = product.variants[variantIndex].attributes.find(a => a.name.toLowerCase() === 'color');
            if (!colorAttr || !colorAttr.value) return false;
            return !isColorPreset(colorAttr.value);
        };

        // Add these new methods
        const addColor = () => {
            product.availableColors.push({
                name: '',
                hexCode: '#000000',
                inStock: true
            });
        };

        const removeColor = (index) => {
            product.availableColors.splice(index, 1);
        };

        const updateMainColor = () => {
            // No longer used as selection handles this, but keep for fallback
            if (!mainColorName.value) {
                mainColorName.value = getColorName(product.color);
            }
        };

        const addVariant = () => {
            product.variants.push({
                attributes: [
                    { name: 'Color', value: product.color },
                    { name: 'Size', value: '' }
                ],
                // Don't initialize with primary color name to prevent leakage during expansion
                color: {
                    name: 'Variant Color',
                    hexCode: product.color,
                    inStock: true
                },
                sku: '',
                price: product.price,
                stock: 0,
                weight: 0,
                dimensions: { length: 0, width: 0, height: 0 },
                images: []
            });
        };

        const removeVariant = (index) => {
            product.variants.splice(index, 1);
        };

        const addVariantAttribute = (index, name = '') => {
            if (!product.variants[index].attributes) {
                product.variants[index].attributes = [];
            }
            product.variants[index].attributes.push({
                name: name,
                value: name.toLowerCase() === 'color' ? product.color : ''
            });
        };

        const removeAttribute = (variantIndex, attrIndex) => {
            product.variants[variantIndex].attributes.splice(attrIndex, 1);
        };

        const addBulkPricing = () => {
            event.preventDefault(); // Prevent form submission
            product.bulkPricing.push({ quantity: 0, price: 0 });
        };

        const removeBulkPricing = (index) => {
            product.bulkPricing.splice(index, 1);
        };

        const cancelAddProduct = () => {
            if (props.adminMode) {
                router.push('/admin/products');
            } else if (props.fromDashboard) {
                router.push('/account/profile/');
            } else {
                router.push('/account/profile/my-products');
            }
        };


        const handleSubmit = async () => {
            try {
                if (props.adminMode && !selectedSellerId.value) {
                    toast.error(t('adminProducts.toasts.selectSeller'));
                    return;
                }

                if (!product.category) {
                    toast.error(t('addProductPage.toasts.selectCategory'));
                    return;
                }

                if (!product.unit.category || !product.unit.baseUnit || !product.unit.value || !product.unit.conversionFactor) {
                    toast.error(t('addProductPage.toasts.fillUnitInfo'));
                    return;
                }

                // Derive colors for backend compatibility
                const colorsFromVariants = product.variants
                    .map(v => v.attributes.find(a => a.name.toLowerCase() === 'color'))
                    .filter(Boolean)
                    .map(attr => {
                        const isHex = attr.value && attr.value.startsWith('#');
                        return {
                            name: isHex ? 'Variant Color' : (attr.value || 'Default Color'),
                            hexCode: isHex ? attr.value : '#000000',
                            inStock: true
                        };
                    });

                // Create a deep clone of the product to avoid reactive issues
                const productData = JSON.parse(JSON.stringify({
                    ...product,
                    availableColors: colorsFromVariants.length > 0 ? colorsFromVariants : product.availableColors,
                    tags: tagsInput.value.split(',').map(tag => tag.trim()).slice(0, 3),
                }));

                // Image validation and processing
                console.log('Original images array:', product.images);

                // Ensure images is an array and contains valid URLs
                if (!productData.images || !Array.isArray(productData.images)) {
                    productData.images = [];
                }

                // Filter out any null, undefined, or empty strings
                productData.images = productData.images
                    .filter(url => url && typeof url === 'string' && url.trim() !== '')
                    .map(url => url.trim());

                console.log('Processed images array:', productData.images);

                // Expand variants: create separate variant for each color+size combination
                const expandedVariants = [];
                
                productData.variants.forEach(variant => {
                    // Extract all colors and sizes from attributes
                    const colors = variant.attributes?.filter(a => a.name.toLowerCase() === 'color') || [];
                    const sizes = variant.attributes?.filter(a => a.name.toLowerCase() === 'size') || [];
                    const otherAttrs = variant.attributes?.filter(a => 
                        a.name.toLowerCase() !== 'color' && a.name.toLowerCase() !== 'size'
                    ) || [];
                    
                    console.log('Variant expansion:', { colors, sizes, otherAttrs });
                    
                    // If no colors or sizes, keep the variant as-is
                    if (colors.length === 0 && sizes.length === 0) {
                        expandedVariants.push(variant);
                        return;
                    }
                    
                    // If only colors (no sizes), create one variant per color
                    if (colors.length > 0 && sizes.length === 0) {
                        colors.forEach((colorAttr, colorIndex) => {
                            const colorData = parseColorValue(colorAttr.value, variant.color?.name);
                            
                            // Smart Image Distribution: If image count matches color count, assign 1-to-1
                            let variantImages = variant.images || [];
                            if (colors.length > 1 && variant.images?.length === colors.length) {
                                variantImages = [variant.images[colorIndex]];
                            }

                            expandedVariants.push({
                                ...variant,
                                images: variantImages,
                                attributes: [colorAttr, ...otherAttrs],
                                color: {
                                    name: colorData.name,
                                    hexCode: colorData.hexCode,
                                    inStock: true
                                },
                                price: Number(variant.price) || 0,
                                stock: Number(variant.stock) || 0,
                                weight: Number(variant.weight) || 0,
                                dimensions: {
                                    length: Number(variant.dimensions?.length || 0),
                                    width: Number(variant.dimensions?.width || 0),
                                    height: Number(variant.dimensions?.height || 0)
                                }
                            });
                        });
                        return;
                    }
                    
                    // If only sizes (no colors), create one variant per size
                    if (sizes.length > 0 && colors.length === 0) {
                        sizes.forEach(sizeAttr => {
                            expandedVariants.push({
                                ...variant,
                                attributes: [sizeAttr, ...otherAttrs],
                                price: Number(variant.price) || 0,
                                stock: Number(variant.stock) || 0,
                                weight: Number(variant.weight) || 0,
                                dimensions: {
                                    length: Number(variant.dimensions?.length || 0),
                                    width: Number(variant.dimensions?.width || 0),
                                    height: Number(variant.dimensions?.height || 0)
                                }
                            });
                        });
                        return;
                    }
                    
                    // Create a variant for each color+size combination
                    colors.forEach((colorAttr, colorIndex) => {
                        sizes.forEach(sizeAttr => {
                            const colorData = parseColorValue(colorAttr.value, variant.color?.name);
                            
                            // Smart Image Distribution: If image count matches color count, assign 1-to-1
                            let variantImages = variant.images || [];
                            if (colors.length > 1 && variant.images?.length === colors.length) {
                                variantImages = [variant.images[colorIndex]];
                            }

                            expandedVariants.push({
                                ...variant,
                                images: variantImages,
                                attributes: [sizeAttr, ...otherAttrs], // Don't include color in attributes
                                color: {
                                    name: colorData.name,
                                    hexCode: colorData.hexCode,
                                    inStock: true
                                },
                                price: Number(variant.price) || 0,
                                stock: Number(variant.stock) || 0,
                                weight: Number(variant.weight) || 0,
                                dimensions: {
                                    length: Number(variant.dimensions?.length || 0),
                                    width: Number(variant.dimensions?.width || 0),
                                    height: Number(variant.dimensions?.height || 0)
                                }
                            });
                        });
                    });
                });
                
                productData.variants = expandedVariants;
                console.log('Expanded variants:', expandedVariants.length, expandedVariants);

                // Validate we have at least one image
                if (productData.images.length === 0) {
                    toast.error(t('addProductPage.toasts.imageRequired'));
                    return;
                }

                // Ensure unit information is properly set
                productData.unit = {
                    ...productData.unit,
                    packagingUnit: productData.unit.packagingUnit || '',
                    compoundUnit: productData.unit.compoundUnit.numerator || productData.unit.compoundUnit.denominator
                        ? {
                            numerator: productData.unit.compoundUnit.numerator,
                            denominator: productData.unit.compoundUnit.denominator
                        }
                        : undefined,
                    regionSpecificDisplay: undefined,
                };

                // Add color validation
                if (productData.availableColors.length > 0) {
                    for (const color of productData.availableColors) {
                        if (!color.name || !color.hexCode) {
                            toast.error(t('addProductPage.toasts.colorNameHexRequired'));
                            return;
                        }
                    }
                }


                // Send to API
                console.log('Sending product data to API:', productData);
                const newProduct = props.adminMode
                    ? await (isEditing.value
                        ? apiClient.put(`/admin/products/${editingProductId.value}`, {
                            ...productData,
                            status: productData.isAvailable ? 'active' : 'inactive',
                        })
                        : apiClient.post('/admin/products', {
                            ...productData,
                            sellerId: selectedSellerId.value,
                            status: productData.isAvailable ? 'active' : 'inactive',
                        })).then((response) => response.data)
                    : await productStore.createProduct(productData);

                // Validate response
                console.log('API Response - New product:', newProduct);

                if (!newProduct.images || newProduct.images.length === 0) {
                    console.warn('Warning: API response contains no images');
                    toast.warning(t('addProductPage.toasts.savedImagesWarning'));
                } else {
                    toast.success(t('addProductPage.toasts.productAdded'));
                    router.push(props.adminMode ? '/admin/products' : '/account/my-products');
                }
            } catch (error) {
                console.error('Error adding product:', error);
                if (error.response && error.response.data) {
                    console.error('Server error details:', error.response.data);
                }
                toast.error(t('addProductPage.toasts.addFailed', { message: error.response?.data?.error || error.message }));
            }
        };

        return {
            product,
            tagsInput,
            selectedCategories,
            categories,
            sellers,
            selectedSellerId,
            adminMode: props.adminMode,
            pageTitle,
            pageSubtitle,
            submitLabel,
            formatPricePreview,
            handleImageUpload,
            handleVariantImageUpload,
            handleSubmit,
            imagePreviews,
            removeImage,
            updateSelectedCategories,
            addVariant,
            removeVariant,
            addVariantAttribute,
            removeAttribute,
            addBulkPricing,
            removeBulkPricing,
            currencySymbol,
            cancelAddProduct,

            mainColorName,
            allColors,
            isCustomColor,
            selectColorPreset,
            toggleCustomColor,
            isVariantCustomColor,
            isColorPreset,
            addColor,
            removeColor,
            updateMainColor,
            availableStock,
            showSections,
            seoAutoMode,
            unitPresets,
            variantAttributePresets,
            applyUnitPreset,
            generateSku,
            handleVariantImageUpload,
            removeVariantImage,
            t,
        };
    },
};
</script>


<style scoped>
/* Add these styles to handle the multi-colored option */
input[type="color"] {
    -webkit-appearance: none;
    appearance: none;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
}

.multi-colored-bg {
    background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
}
</style>

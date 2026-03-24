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

            <div class="container mx-auto px-4 py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-4xl font-bold mb-4">{{ t('addProductPage.title') }}</h1>
                    <p class="text-lg mb-8 text-white/90">{{ t('addProductPage.subtitle') }}</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 -mt-20 relative z-10">
            <div class="max-w-4xl mx-auto space-y-6">
                <!-- Main Form Card -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
                        <!-- Category Selection -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.category') }}</label>
                            <HierarchicalCategorySelector :categories="categories"
                                v-model:selectedCategories="selectedCategories"
                                @update:selectedCategories="updateSelectedCategories"
                                class="focus:ring-2 focus:ring-indigo-500/20" />
                        </div>

                        <!-- Basic Information Section -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900">{{ t('addProductPage.basicInformation') }}</h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <!-- Product Name -->
                                <div class="space-y-2 lg:col-span-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.productName') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.name"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            :placeholder="t('addProductPage.productNamePlaceholder')" required />
                                    </div>
                                </div>

                                <!-- Main Color Picker -->
                                <div class="space-y-4 lg:col-span-3">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.primaryDisplayColor') }}</label>
                                    
                                    <!-- Scrollable Color Selection Grid -->
                                    <div class="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                        <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-y-4 gap-x-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                            <div v-for="color in allColors" :key="color.hexCode"
                                                class="flex flex-col items-center gap-1 group/color cursor-pointer"
                                                @click="selectColorPreset(color)">
                                                <div :class="[
                                                    'w-7 h-7 rounded-full border-2 transition-all duration-200 shadow-sm relative',
                                                    product.color.toLowerCase() === color.hexCode.toLowerCase() && !isCustomColor
                                                        ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/20'
                                                        : 'border-gray-200 hover:border-indigo-300'
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
                                                    'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-sm',
                                                    isCustomColor 
                                                        ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/20' 
                                                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                                                ]">
                                                    <Plus class="w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Custom Color Inputs (Visible when "Other" is selected) -->
                                    <div v-if="isCustomColor" class="flex items-center gap-3 mt-4 p-4 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div class="relative group">
                                            <input type="color" v-model="product.color"
                                                class="h-11 w-11 rounded-lg border border-gray-200 cursor-pointer p-1 bg-white"
                                                @input="updateMainColor" />
                                        </div>
                                        <div class="flex-1 relative rounded-lg border border-gray-200 focus-within:border-indigo-500 bg-white shadow-sm transition-all">
                                            <input type="text" v-model="mainColorName" :placeholder="t('addProductPage.colorNamePlaceholder')"
                                                class="w-full px-4 py-2.5 text-sm text-gray-700 bg-transparent border-none focus:outline-none" />
                                        </div>
                                    </div>
                                    <!-- Suggestion hint -->
                                    <div v-else class="text-[10px] text-gray-400 font-medium px-1 flex items-center gap-1">
                                        <Sparkles class="w-2.5 h-2.5" /> {{ t('addProductPage.selected') }}: <span class="text-indigo-600">{{ mainColorName || t('addProductPage.none') }}</span>
                                    </div>
                                </div>

                                <!-- Brand -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.brand') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.brand"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            :placeholder="t('addProductPage.brandPlaceholder')" />
                                    </div>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.description') }}</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <textarea v-model="product.description" rows="4"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        required></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Images Section -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900">{{ t('addProductPage.productImages') }}</h3>
                            <div class="space-y-4">
                                <div
                                    class="relative rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 transition-colors">
                                    <input type="file" @change="handleImageUpload"
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple
                                        accept="image/*" />
                                    <div class="text-center">
                                        <UploadCloud class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p class="text-sm text-gray-600">{{ t('addProductPage.imageUploadPrompt') }}
                                        </p>
                                        <p class="text-xs text-gray-500 mt-1">{{ t('addProductPage.imageUploadHint') }}</p>
                                    </div>
                                </div>

                                <!-- Image Previews -->
                                <div v-if="imagePreviews.length" class="flex flex-wrap gap-4">
                                    <div v-for="(preview, index) in imagePreviews" :key="index" class="relative w-32 h-32">
                                        <img :src="preview" alt="Product preview"
                                            class="w-full h-full object-cover rounded-lg shadow-sm" />
                                        <button @click="removeImage(index)" type="button"
                                            class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                                            <X class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pricing Section -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900">{{ t('addProductPage.pricing') }}</h3>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- Price -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.price') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.price"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            step="0.01" min="0" required />
                                    </div>
                                </div>

                                <!-- Original Price -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.originalPrice') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.originalPrice"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            step="0.01" min="0" />
                                    </div>
                                </div>

                                <!-- Discount -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.discount') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.discount"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            min="0" max="100" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <!-- Inventory Section -->
                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-gray-900">{{ t('addProductPage.inventory') }}</h3>
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" v-model="product.isAvailable"
                                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20" />
                                    <label class="text-sm text-gray-700">{{ t('addProductPage.availableForSale') }}</label>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- Stock -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.stock') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.stock"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            min="0" required />
                                    </div>
                                </div>

                                <!-- Reserved Stock -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.reservedLocked') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.reservedStock"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            min="0" />
                                    </div>
                                    <p class="text-[10px] text-gray-400">{{ t('addProductPage.itemsInPendingOrders') }}</p>
                                </div>

                                <!-- Available For Sale -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-indigo-700 font-bold">{{ t('addProductPage.availableForSaleCount') }}</label>
                                    <div
                                        class="relative rounded-lg border border-indigo-100 bg-indigo-50/30 transition-all flex items-center px-4 py-3">
                                        <span class="text-lg font-bold text-indigo-600">{{ availableStock }}</span>
                                    </div>
                                    <p class="text-[10px] text-indigo-400">{{ t('addProductPage.availableForSaleFormula') }}</p>
                                </div>
                            </div>
                        </div>




                        <!-- Unit Information Section -->
                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-gray-900">{{ t('addProductPage.unitInformation') }}</h3>
                                <!-- Quick Setup Dropdown -->
                                <div class="relative">
                                    <button type="button" @click="showSections.unitDropdown = !showSections.unitDropdown"
                                        class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors">
                                        <Sparkles class="w-3 h-3" />
                                        {{ t('addProductPage.quickSetupUnits') }}
                                        <ChevronDown class="w-3 h-3" />
                                    </button>
                                    <div v-if="showSections.unitDropdown"
                                        class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button v-for="preset in unitPresets" :key="preset.label" type="button"
                                            @click="applyUnitPreset(preset); showSections.unitDropdown = false"
                                            class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                            {{ preset.label }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <!-- Unit Category -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.unitCategory') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <select v-model="product.unit.category" @change="updateUnitOptions"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none appearance-none"
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
                                        <ChevronDown
                                            class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <!-- Base Unit -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.baseUnit') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.unit.baseUnit" :placeholder="t('addProductPage.baseUnitPlaceholder')"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            required />
                                    </div>
                                </div>

                                <!-- Conversion Factor -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.conversionFactor') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.unit.conversionFactor"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            step="0.01" min="0" required />
                                    </div>
                                </div>

                                <!-- Unit Value -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.unitValue') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.unit.value"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            step="0.01" min="0" required />
                                    </div>
                                </div>

                                <!-- Display Unit -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.displayUnit') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.unit.displayUnit" :placeholder="t('addProductPage.displayUnitPlaceholder')"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none" />
                                    </div>
                                </div>

                                <!-- Packaging Unit -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.packagingUnit') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.unit.packagingUnit"
                                            :placeholder="t('addProductPage.packagingUnitPlaceholder')"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Product Variants Section -->
                        <div class="space-y-6">
                            <button @click="showSections.variants = !showSections.variants" type="button"
                                class="w-full flex items-center justify-between group">
                                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <ChevronDown v-if="showSections.variants" class="w-5 h-5 text-gray-400" />
                                    <ChevronRight v-else class="w-5 h-5 text-gray-400" />
                                    {{ t('addProductPage.variants.title') }}
                                </h3>
                                <div class="flex items-center gap-3">
                                    <span class="text-xs text-indigo-500 font-medium group-hover:underline">{{
                                        showSections.variants ? t('addProductPage.variants.hide') : t('addProductPage.variants.show') }}</span>
                                    <button v-show="showSections.variants" @click.stop="addVariant" type="button"
                                        class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                        {{ t('addProductPage.variants.add') }}
                                    </button>
                                </div>
                            </button>

                            <div v-show="showSections.variants" class="space-y-4 pt-2">
                                <div v-for="(variant, index) in product.variants" :key="index"
                                    class="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                                    <!-- Variant Header / Quick Actions -->
                                    <div class="flex justify-between items-center mb-6">
                                        <h4 class="font-medium text-gray-900">{{ t('addProductPage.variants.variantNumber', { number: index + 1 }) }}</h4>
                                        <button @click="generateSku(index)" type="button"
                                            class="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                                            <Sparkles class="w-3 h-3" /> {{ t('addProductPage.variants.autoGenerateSku') }}
                                        </button>
                                    </div>
                                    <!-- Variant Attributes (Unified) -->
                                    <div class="space-y-4 mb-8">
                                        <div class="flex items-center justify-between">
                                            <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider">{{ t('addProductPage.variants.specsAndAttributes') }}</h4>
                                            <div class="flex gap-2">
                                                <button v-for="attr in variantAttributePresets"
                                                    :key="attr.value" @click="addVariantAttribute(index, attr.value)" type="button"
                                                    class="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-md hover:border-indigo-300 hover:text-indigo-600 transition-all">
                                                    + {{ attr.label }}
                                                </button>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 gap-3">
                                            <div v-for="(attribute, attrIndex) in variant.attributes" :key="attrIndex"
                                                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition-all group/attr">
                                                <div class="w-1/3">
                                                    <input v-model="attribute.name"
                                                        class="w-full text-xs font-semibold text-gray-900 border-none bg-transparent focus:outline-none"
                                                        :placeholder="t('addProductPage.variants.attributeNamePlaceholder')" />
                                                </div>
                                                <div class="flex-1 flex items-center gap-3">
                                                    <div v-if="attribute.name.toLowerCase() === 'color'"
                                                        class="flex flex-col gap-3 flex-1">
                                                        <!-- Compact Color Picker for Variants -->
                                                        <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-gray-50/50 rounded-lg border border-gray-100 custom-scrollbar">
                                                            <div v-for="color in allColors" :key="color.hexCode"
                                                                @click="selectColorPreset(color, index)"
                                                                class="w-5 h-5 rounded-full border transition-all cursor-pointer relative"
                                                                :style="{ backgroundColor: color.hexCode }"
                                                                :title="color.name">
                                                                <div v-if="attribute.value.toLowerCase() === color.hexCode.toLowerCase()" 
                                                                    class="absolute inset-0 flex items-center justify-center">
                                                                    <div class="w-1 h-1 rounded-full bg-white shadow-sm ring-1 ring-black/10"></div>
                                                                </div>
                                                            </div>
                                                            <!-- Custom Picker Toggle -->
                                                            <button @click="attribute.value = '#000000'" type="button" 
                                                                class="w-5 h-5 rounded-full border border-dashed border-gray-300 flex items-center justify-center bg-white hover:border-indigo-300">
                                                                <Plus class="w-2.5 h-2.5 text-gray-400" />
                                                            </button>
                                                        </div>
                                                        <!-- Hex/Name Input fallback -->
                                                        <div class="flex items-center gap-2">
                                                            <input type="color" v-model="attribute.value"
                                                                class="h-6 w-6 rounded border border-gray-200 p-0 cursor-pointer" />
                                                            <input v-model="attribute.value"
                                                                class="flex-1 text-[10px] text-gray-600 border border-gray-100 px-2 py-1 rounded bg-gray-50 focus:bg-white focus:outline-none"
                                                                :placeholder="t('addProductPage.variants.hexOrColorName')" />
                                                        </div>
                                                    </div>
                                                    <input v-else v-model="attribute.value"
                                                        class="flex-1 text-xs text-gray-600 border-none bg-transparent focus:outline-none"
                                                        :placeholder="t('addProductPage.variants.attributeValuePlaceholder')" />
                                                </div>
                                                <button @click="removeAttribute(index, attrIndex)" type="button"
                                                    class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/attr:opacity-100">
                                                    <Trash2 class="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button @click="addVariantAttribute(index)" type="button"
                                                class="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all">
                                                <Plus class="w-4 h-4" /> {{ t('addProductPage.variants.addCustomAttribute') }}
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Variant Details -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.variants.sku') }}</label>
                                            <input v-model="variant.sku"
                                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                :placeholder="t('addProductPage.variants.sku')" />
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.price') }}</label>
                                            <input type="number" v-model.number="variant.price"
                                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                :placeholder="t('addProductPage.price')" min="0" step="0.01" />
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.stock') }}</label>
                                            <input type="number" v-model.number="variant.stock"
                                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                :placeholder="t('addProductPage.stock')" min="0" />
                                        </div>


                                        <div class="space-y-2">
                                            <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.variants.weight') }}</label>
                                            <input type="number" v-model.number="variant.weight"
                                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                :placeholder="t('addProductPage.variants.weight')" step="0.01" />
                                        </div>


                                    </div>

                                    <!-- Variant Dimensions -->
                                    <div class="mt-6 space-y-4">
                                        <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.variants.dimensions') }}</label>
                                        <div class="grid grid-cols-3 gap-4">
                                            <div class="space-y-2">
                                                <input type="number" v-model.number="variant.dimensions.length"
                                                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    :placeholder="t('addProductPage.unitCategories.length')" step="0.01" />
                                            </div>
                                            <div class="space-y-2">
                                                <input type="number" v-model.number="variant.dimensions.width"
                                                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    :placeholder="t('addProductPage.variants.width')" step="0.01" />
                                            </div>
                                            <div class="space-y-2">
                                                <input type="number" v-model.number="variant.dimensions.height"
                                                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    :placeholder="t('addProductPage.variants.height')" step="0.01" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Variant Images -->
                                    <div class="mt-6 space-y-4">
                                        <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.variants.images') }}</label>
                                        <div
                                            class="relative rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 transition-colors">
                                            <input type="file" @change="(e) => handleVariantImageUpload(e, index)"
                                                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple
                                                accept="image/*" />
                                            <div class="text-center">
                                                <UploadCloud class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p class="text-sm text-gray-600">{{ t('addProductPage.variants.uploadPrompt') }}
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Variant Images Preview -->
                                        <div v-if="variant.images?.length" class="flex flex-wrap gap-4">
                                            <div v-for="(img, imgIndex) in variant.images" :key="imgIndex"
                                                class="relative w-24 h-24">
                                                <img :src="img" :alt="`Variant ${index + 1} image ${imgIndex + 1}`"
                                                    class="w-full h-full object-cover rounded-lg" />
                                                <button @click="removeVariantImage(index, imgIndex)"
                                                    class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                                                    <X class="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Remove Variant Button -->
                                    <div class="mt-6 flex justify-end">
                                        <button @click="removeVariant(index)" type="button"
                                            class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                                            <Trash2 class="w-4 h-4" />
                                            <span>{{ t('addProductPage.variants.removeVariant') }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bulk Pricing Section -->
                        <div class="space-y-6 border-t border-gray-50 pt-6">
                            <button @click="showSections.bulkPricing = !showSections.bulkPricing" type="button"
                                class="w-full flex items-center justify-between group">
                                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <ChevronDown v-if="showSections.bulkPricing" class="w-5 h-5 text-gray-400" />
                                    <ChevronRight v-else class="w-5 h-5 text-gray-400" />
                                    {{ t('addProductPage.bulkPricing.title') }}
                                </h3>
                                <div class="flex items-center gap-3">
                                    <span class="text-xs text-indigo-500 font-medium group-hover:underline">{{
                                        showSections.bulkPricing ? t('addProductPage.bulkPricing.hide') : t('addProductPage.bulkPricing.show') }}</span>
                                    <button v-show="showSections.bulkPricing" @click.stop="addBulkPricing" type="button"
                                        class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                        {{ t('addProductPage.bulkPricing.addPriceBreak') }}
                                    </button>
                                </div>
                            </button>

                            <div v-show="showSections.bulkPricing" class="space-y-4 pt-2">
                                <div v-for="(pricing, index) in product.bulkPricing" :key="index"
                                    class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <input type="number" v-model.number="pricing.quantity"
                                        :placeholder="t('addProductPage.bulkPricing.minQuantityPlaceholder')"
                                        class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        min="0" />
                                    <input type="number" v-model.number="pricing.price" :placeholder="t('addProductPage.bulkPricing.pricePerUnitPlaceholder')"
                                        class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        step="0.01" min="0" />
                                    <button @click="removeBulkPricing(index)" type="button"
                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 class="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Meta Information Section -->
                        <div class="space-y-6 border-t border-gray-50 pt-6">
                            <button @click="showSections.seo = !showSections.seo" type="button"
                                class="w-full flex items-center justify-between group">
                                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <ChevronDown v-if="showSections.seo" class="w-5 h-5 text-gray-400" />
                                    <ChevronRight v-else class="w-5 h-5 text-gray-400" />
                                    {{ t('addProductPage.seo.title') }}
                                </h3>
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full"
                                        v-if="seoAutoMode">{{ t('addProductPage.seo.autoGenOn') }}</span>
                                    <span class="text-xs text-indigo-500 font-medium group-hover:underline">{{
                                        showSections.seo ? t('addProductPage.seo.hide') : t('addProductPage.seo.show') }}</span>
                                </div>
                            </button>

                            <div v-show="showSections.seo" class="space-y-4 pt-2">
                                <!-- Auto-gen Toggle -->
                                <div class="flex items-center gap-2 mb-2 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                                    <input type="checkbox" v-model="seoAutoMode" id="seoAuto"
                                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20" />
                                    <label for="seoAuto" class="text-xs font-medium text-indigo-700 flex items-center gap-1 cursor-pointer">
                                        <Sparkles class="w-3 h-3" /> {{ t('addProductPage.seo.autoGenerate') }}
                                    </label>
                                </div>
                                <!-- Meta Title -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.seo.metaTitle') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.metaTitle"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            maxlength="60" />
                                    </div>
                                </div>

                                <!-- Meta Description -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.seo.metaDescription') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <textarea v-model="product.metaDescription"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            rows="3" maxlength="160"></textarea>
                                    </div>
                                </div>

                                <!-- Tags -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">{{ t('addProductPage.seo.tags') }}</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="tagsInput"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            :placeholder="t('addProductPage.seo.tagsPlaceholder')" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                            <button type="button" @click="cancelAddProduct"
                                class="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                                {{ t('addProductPage.cancel') }}
                            </button>
                            <button type="submit"
                                class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300">
                                {{ t('addProductPage.submit') }}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useProductStore } from '../store/productStore.js';
import { useUserStore } from '../store/user.js';
import uploadService from '../services/uploadService';
import { toast } from 'vue-sonner';
import { Trash2, UploadCloud, ChevronDown, ChevronRight, Sparkles, Settings2, Plus } from 'lucide-vue-next';
import { parseColorValue, getColorName, getAllColors, isColorPreset } from '../utils/colorUtils.js';
import HierarchicalCategorySelector from './HierarchicalCategorySelector.vue';

export default {
    name: 'AddProduct',
    components: {
        HierarchicalCategorySelector, Trash2, UploadCloud, ChevronDown, ChevronRight, Sparkles, Settings2, Plus
    },
    props: {
        fromDashboard: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const { t } = useI18n();
        const router = useRouter();
        const productStore = useProductStore();
        const userStore = useUserStore();
        const categories = ref([]);
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

        onMounted(async () => {
            try {
                categories.value = await productStore.fetchCategories();

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
                product.variants[variantIndex].images.splice(imageIndex, 1);
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

        // const addVariantAttribute = (variantIndex) => {
        //     product.variants[variantIndex].attributes.push({ name: '', value: '' });
        // };

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

        // const cancelAddProduct = () => {
        //     router.push('/account/profile/my-products');
        // };
        const cancelAddProduct = () => {
            if (props.fromDashboard) {
                router.push('/account/profile/');
            } else {
                router.push('/account/profile/my-products');
            }
        };


        const handleSubmit = async () => {
            try {
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

                // // If we have images in the original product, make sure they're included
                // if (product.images && Array.isArray(product.images)) {
                //     productData.images = [...product.images];
                // }

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
                const newProduct = await productStore.createProduct(productData);

                // Validate response
                console.log('API Response - New product:', newProduct);

                if (!newProduct.images || newProduct.images.length === 0) {
                    console.warn('Warning: API response contains no images');
                    toast.warning(t('addProductPage.toasts.savedImagesWarning'));
                } else {
                    toast.success(t('addProductPage.toasts.productAdded'));
                    router.push('/account/my-products');
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

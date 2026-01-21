<template>
    <!-- Modal Container with modern backdrop -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <div class="flex items-center justify-center min-h-screen px-4 py-8">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl transform transition-all">
                <!-- Modal Header with Gradient -->
                <div
                    class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-t-2xl">
                    <!-- Decorative Elements -->
                    <div class="absolute inset-0">
                        <div class="absolute inset-0 bg-black/10"></div>
                        <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                        <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                    </div>

                    <!-- Header Content -->
                    <div class="relative flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold">Edit Product</h2>
                            <p class="text-sm text-white/90 mt-1">Update your product information</p>
                        </div>
                        <button @click="closeModal" class="p-2 text-white/80 hover:text-white transition-colors">
                            <X class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Form Container -->
                <form @submit.prevent="saveProduct" class="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                    <!-- Category Selection -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">Category</label>
                        <HierarchicalCategorySelector :categories="categories" v-model="editingProduct.category"
                            v-model:selectedCategories="selectedCategories"
                            @update:selectedCategories="updateSelectedCategories"
                            class="focus:ring-2 focus:ring-indigo-500/20" />
                    </div>

                    <!-- Basic Information Section -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- Product Name -->
                            <div class="space-y-2 lg:col-span-2">
                                <label class="text-sm font-medium text-gray-700">Product Name</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="editingProduct.name"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        placeholder="e.g. Premium Wireless Headphones" required />
                                </div>
                            </div>

                            <!-- Main Color Picker -->
                            <div class="space-y-4 lg:col-span-3">
                                <label class="text-sm font-medium text-gray-700">Primary Display Color</label>

                                <!-- Scrollable Color Selection Grid -->
                                <div class="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                    <div
                                        class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-y-4 gap-x-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        <div v-for="color in allColors" :key="color.hexCode"
                                            class="flex flex-col items-center gap-1 group/color cursor-pointer"
                                            @click="selectColorPreset(color)">
                                            <div :class="[
                                                'w-7 h-7 rounded-full border-2 transition-all duration-200 shadow-sm relative',
                                                editingProduct.color.toLowerCase() === color.hexCode.toLowerCase() && !isCustomColor
                                                    ? 'border-indigo-500 scale-110 ring-2 ring-indigo-500/20'
                                                    : 'border-gray-200 hover:border-indigo-300'
                                            ]" :style="{ backgroundColor: color.hexCode }" :title="color.name">
                                                <div v-if="editingProduct.color.toLowerCase() === color.hexCode.toLowerCase() && !isCustomColor"
                                                    class="absolute inset-0 flex items-center justify-center">
                                                    <div
                                                        class="w-1.5 h-1.5 rounded-full bg-white shadow-sm ring-1 ring-black/10">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- "Other" Option -->
                                        <div class="flex flex-col items-center gap-1 cursor-pointer"
                                            @click="toggleCustomColor()">
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
                                <div v-if="isCustomColor"
                                    class="flex items-center gap-3 mt-4 p-4 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div class="relative group">
                                        <input type="color" v-model="editingProduct.color"
                                            class="h-11 w-11 rounded-lg border border-gray-200 cursor-pointer p-1 bg-white"
                                            @input="updateMainColor" />
                                    </div>
                                    <div
                                        class="flex-1 relative rounded-lg border border-gray-200 focus-within:border-indigo-500 bg-white shadow-sm transition-all">
                                        <input type="text" v-model="mainColorName" placeholder="e.g. Onyx Black"
                                            class="w-full px-4 py-2.5 text-sm text-gray-700 bg-transparent border-none focus:outline-none" />
                                    </div>
                                </div>
                                <!-- Suggestion hint -->
                                <div v-else class="text-[10px] text-gray-400 font-medium px-1 flex items-center gap-1">
                                    <Sparkles class="w-2.5 h-2.5" /> Selected: <span class="text-indigo-600">{{
                                        mainColorName || 'None' }}</span>
                                </div>
                            </div>

                            <!-- Brand -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Brand</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="editingProduct.brand"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        placeholder="e.g. Sony, Apple" />
                                </div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Description</label>
                            <div
                                class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                <textarea v-model="editingProduct.description" rows="4"
                                    class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                    required></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Pricing Section -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-semibold text-gray-900">Pricing</h3>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Price -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Price</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="number" v-model.number="editingProduct.price"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        step="0.01" min="0" required />
                                </div>
                            </div>

                            <!-- Original Price -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Original Price</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="number" v-model.number="editingProduct.originalPrice"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        step="0.01" min="0" />
                                </div>
                            </div>

                            <!-- Discount -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Discount (%)</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="number" v-model.number="editingProduct.discount"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        min="0" max="100" />
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- Images Section -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-semibold text-gray-900">Product Images</h3>
                        <div class="space-y-4">
                            <div
                                class="relative rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 transition-colors">
                                <input type="file" @change="handleImageUpload"
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple
                                    accept="image/*" />
                                <div class="text-center">
                                    <UploadCloud class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p class="text-sm text-gray-600">Drag and drop images here or click to browse</p>
                                    <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            </div>

                            <!-- Image Previews -->
                            <div v-if="editingProduct.images && editingProduct.images.length"
                                class="flex flex-wrap gap-4">
                                <div v-for="(img, index) in editingProduct.images" :key="index"
                                    class="relative w-32 h-32">
                                    <img :src="img" alt="Product image"
                                        class="w-full h-full object-cover rounded-lg shadow-sm" />
                                    <button @click="removeImage(index)" type="button"
                                        class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                                        <X class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Inventory Section -->
                    <div class="space-y-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">Inventory</h3>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" v-model="editingProduct.isAvailable"
                                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20" />
                                <label class="text-sm text-gray-700">Available for Sale</label>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Stock -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Stock</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="number" v-model.number="editingProduct.stock"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        min="0" required />
                                </div>
                            </div>

                            <!-- Reserved Stock -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Reserved (Locked)</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="number" v-model.number="editingProduct.reservedStock"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        min="0" />
                                </div>
                                <p class="text-[10px] text-gray-400">Items in pending orders</p>
                            </div>

                            <!-- Available For Sale -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-indigo-700 font-bold">Available For sale</label>
                                <div
                                    class="relative rounded-lg border border-indigo-100 bg-indigo-50/30 transition-all flex items-center px-4 py-3">
                                    <span class="text-lg font-bold text-indigo-600">{{ availableStock }}</span>
                                </div>
                                <p class="text-[10px] text-indigo-400">Formula: Stock - Reserved</p>
                            </div>
                        </div>
                    </div>



                    <!-- Unit Information Section -->
                    <div class="space-y-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">Unit Information</h3>
                            <div class="relative">
                                <button type="button" @click="showSections.unitDropdown = !showSections.unitDropdown"
                                    class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors">
                                    <Sparkles class="w-3 h-3" />
                                    Quick Setup
                                    <ChevronDown class="w-3 h-3" />
                                </button>
                                <div v-if="showSections.unitDropdown"
                                    class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button v-for="preset in unitPresets" :key="preset.label" type="button"
                                        @click="applyUnitPreset(preset); showSections.unitDropdown = false"
                                        class="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
                                        {{ preset.label }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- Unit Category -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Unit Category</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <select v-model="editingProduct.unit.category" @change="updateUnitOptions"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none appearance-none"
                                        required>
                                        <option value="">Select Category</option>
                                        <option value="weight">Weight</option>
                                        <option value="volume">Volume</option>
                                        <option value="length">Length</option>
                                        <option value="area">Area</option>
                                        <option value="quantity">Quantity</option>
                                        <option value="time">Time</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <ChevronDown
                                        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <!-- Base Unit -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Base Unit</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="editingProduct.unit.baseUnit" placeholder="kilogram"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        required />
                                </div>
                            </div>

                            <!-- Conversion Factor -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Conversion Factor</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="number" v-model.number="editingProduct.unit.conversionFactor"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        step="0.01" min="0" required />
                                </div>
                            </div>

                            <!-- Unit Value -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Unit Value</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="number" v-model.number="editingProduct.unit.value"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        step="0.01" min="0" required />
                                </div>
                            </div>

                            <!-- Display Unit -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Display Unit</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="editingProduct.unit.displayUnit" placeholder="kg"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none" />
                                </div>
                            </div>

                            <!-- Packaging Unit -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Packaging Unit</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="editingProduct.unit.packagingUnit"
                                        placeholder="pack, pieces, box, etc."
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Product Variants Section -->
                    <div class="space-y-6 pt-4">
                        <button @click="showSections.variants = !showSections.variants" type="button"
                            class="w-full flex items-center justify-between group">
                            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <ChevronDown v-if="showSections.variants" class="w-5 h-5 text-gray-400" />
                                <ChevronRight v-else class="w-5 h-5 text-gray-400" />
                                Product Variants
                            </h3>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-indigo-500 font-medium group-hover:underline">{{
                                    showSections.variants ? 'Hide variants' : 'Show variants' }}</span>
                                <button v-show="showSections.variants" @click.stop="addVariant" type="button"
                                    class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Add Variant
                                </button>
                            </div>
                        </button>

                        <div v-show="showSections.variants" class="space-y-4 pt-2">
                            <div v-for="(variant, index) in editingProduct.variants" :key="index"
                                class="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                                <div class="flex justify-between items-center mb-6">
                                    <h4 class="font-medium text-gray-900">Variant #{{ index + 1 }}</h4>
                                    <button @click="generateSku(index)" type="button"
                                        class="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                                        <Sparkles class="w-3 h-3" /> Auto-generate SKU
                                    </button>
                                </div>
                                <!-- Variant Attributes (Unified) -->
                                <div class="space-y-4 mb-8">
                                    <div class="flex items-center justify-between">
                                        <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Specs &
                                            Attributes</h4>
                                        <div class="flex gap-2">
                                            <button v-for="attr in ['Color', 'Size', 'Capacity', 'Material']"
                                                :key="attr" @click="addVariantAttribute(index, attr)" type="button"
                                                class="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-md hover:border-indigo-300 hover:text-indigo-600 transition-all">
                                                + {{ attr }}
                                            </button>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 gap-3">
                                        <div v-for="(attribute, attrIndex) in variant.attributes" :key="attrIndex"
                                            class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition-all group/attr">
                                            <div class="w-1/3">
                                                <input v-model="attribute.name"
                                                    class="w-full text-xs font-semibold text-gray-900 border-none bg-transparent focus:outline-none"
                                                    placeholder="Name (e.g. Size)" />
                                            </div>
                                            <div class="flex-1 flex items-center gap-3">
                                                <div v-if="attribute.name.toLowerCase() === 'color'"
                                                    class="flex flex-col gap-3 flex-1">
                                                    <!-- Compact Color Picker for Variants -->
                                                    <div
                                                        class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-gray-50/50 rounded-lg border border-gray-100 custom-scrollbar">
                                                        <div v-for="color in allColors" :key="color.hexCode"
                                                            @click="selectColorPreset(color, index)"
                                                            class="w-5 h-5 rounded-full border transition-all cursor-pointer relative"
                                                            :style="{ backgroundColor: color.hexCode }"
                                                            :title="color.name">
                                                            <div v-if="attribute.value.toLowerCase() === color.hexCode.toLowerCase()"
                                                                class="absolute inset-0 flex items-center justify-center">
                                                                <div
                                                                    class="w-1 h-1 rounded-full bg-white shadow-sm ring-1 ring-black/10">
                                                                </div>
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
                                                            placeholder="Hex or Color Name" />
                                                    </div>
                                                </div>
                                                <input v-else v-model="attribute.value"
                                                    class="flex-1 text-xs text-gray-600 border-none bg-transparent focus:outline-none"
                                                    placeholder="Value (e.g. XL, 40cm, 512GB)" />
                                            </div>
                                            <button @click="removeAttribute(index, attrIndex)" type="button"
                                                class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/attr:opacity-100">
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button @click="addVariantAttribute(index)" type="button"
                                            class="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all">
                                            <Plus class="w-4 h-4" /> Add custom attribute
                                        </button>
                                    </div>
                                </div>

                                <!-- Variant Details -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium text-gray-700">SKU</label>
                                        <input v-model="variant.sku"
                                            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            placeholder="SKU" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium text-gray-700">Price</label>
                                        <input type="number" v-model.number="variant.price"
                                            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            placeholder="Price" min="0" step="0.01" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium text-gray-700">Stock</label>
                                        <input type="number" v-model.number="variant.stock"
                                            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            placeholder="Stock" min="0" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-medium text-gray-700">Weight</label>
                                        <input type="number" v-model.number="variant.weight"
                                            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            placeholder="Weight" step="0.01" />
                                    </div>
                                </div>

                                <!-- Variant Dimensions -->
                                <div class="mt-6 space-y-4">
                                    <label class="text-sm font-medium text-gray-700">Dimensions</label>
                                    <div class="grid grid-cols-3 gap-4">
                                        <div class="space-y-2">
                                            <input type="number" v-model.number="variant.dimensions.length"
                                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                placeholder="Length" step="0.01" />
                                        </div>
                                        <div class="space-y-2">
                                            <input type="number" v-model.number="variant.dimensions.width"
                                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                placeholder="Width" step="0.01" />
                                        </div>
                                        <div class="space-y-2">
                                            <input type="number" v-model.number="variant.dimensions.height"
                                                class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                placeholder="Height" step="0.01" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Variant Images -->
                                <div class="mt-6 space-y-4">
                                    <label class="text-sm font-medium text-gray-700">Variant Images</label>
                                    <div
                                        class="relative rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 transition-colors">
                                        <input type="file" @change="(e) => handleVariantImageUpload(e, index)"
                                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple
                                            accept="image/*" />
                                        <div class="text-center">
                                            <UploadCloud class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p class="text-sm text-gray-600">Drag and drop images or click to browse
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
                                        <span>Remove Variant</span>
                                    </button>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium text-gray-700">Additional Variant</label>
                                <button @click="addVariant" type="button"
                                    class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Add Variant
                                </button>
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
                                Bulk Pricing
                            </h3>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-indigo-500 font-medium group-hover:underline">{{
                                    showSections.bulkPricing ? 'Hide' : 'Add wholesale pricing' }}</span>
                                <button v-show="showSections.bulkPricing" @click.stop="addBulkPricing" type="button"
                                    class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Add Price Break
                                </button>
                            </div>
                        </button>

                        <div v-show="showSections.bulkPricing" class="space-y-4 pt-2">
                            <div v-for="(pricing, index) in editingProduct.bulkPricing" :key="index"
                                class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <input type="number" v-model.number="pricing.quantity" placeholder="Min quantity"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                                    min="0" />
                                <input type="number" v-model.number="pricing.price" placeholder="Price per unit"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
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
                                SEO & Search
                            </h3>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full"
                                    v-if="seoAutoMode">Auto-gen ON</span>
                                <span class="text-xs text-indigo-500 font-medium group-hover:underline">{{
                                    showSections.seo ? 'Hide' : 'Optimize for Google' }}</span>
                            </div>
                        </button>

                        <div v-show="showSections.seo" class="space-y-4 pt-2">
                            <!-- Auto-gen Toggle -->
                            <div
                                class="flex items-center gap-2 mb-2 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                                <input type="checkbox" v-model="seoAutoMode" id="seoAutoEdit"
                                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20" />
                                <label for="seoAutoEdit"
                                    class="text-xs font-medium text-indigo-700 flex items-center gap-1 cursor-pointer">
                                    <Sparkles class="w-3 h-3" /> Auto-generate SEO from modifications
                                </label>
                            </div>
                            <!-- Meta Title -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Meta Title (max 60 characters)</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="editingProduct.metaTitle"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        maxlength="60" />
                                </div>
                            </div>

                            <!-- Meta Description -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Meta Description (max 160
                                    characters)</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <textarea v-model="editingProduct.metaDescription"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        rows="3" maxlength="160"></textarea>
                                </div>
                            </div>

                            <!-- Tags -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Tags (comma-separated, max 3)</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="tagsInput"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        placeholder="e.g., organic, natural, eco-friendly" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                        <button type="button" @click="closeModal"
                            class="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted, reactive, computed } from 'vue';
import { useProductStore } from '../store/productStore.js';
import { useUserStore } from '../store/user.js';
import { toast } from 'vue-sonner';
import { parseColorValue, getColorName, getAllColors } from '../utils/colorUtils.js';
import uploadService from '../services/uploadService';
import { X, UploadCloud, Trash2, ChevronDown, ChevronRight, Sparkles, Plus } from 'lucide-vue-next';
import HierarchicalCategorySelector from './HierarchicalCategorySelector.vue';

export default {
    name: 'EditWishlistProductModal',
    components: {
        HierarchicalCategorySelector, X, UploadCloud, Trash2, ChevronDown, ChevronRight, Sparkles, Plus
    },
    props: {
        isEditModalOpen: {
            type: Boolean,
            required: true
        },
        localEditingProduct: {
            type: Object,
            required: true,
            default: () => ({}) // Add default empty object
        },
        userId: {
            type: String,
            required: true
        }
    },
    setup(props, { emit }) {
        const productStore = useProductStore();
        const userStore = useUserStore();
        const mainColorName = ref('');
        const allColors = getAllColors();
        const isCustomColor = ref(false);
        const tagsInput = ref('');

        // Initialize the editing product with default values
        const editingProduct = reactive({
            ...props.localEditingProduct,
            // Provide default values and handle potentially undefined properties
            // name: '', // use this when wishlist link not working
            name: props.localEditingProduct.name || '',
            description: props.localEditingProduct.description || '',
            price: props.localEditingProduct.price || 0,
            originalPrice: props.localEditingProduct.originalPrice || 0,
            stock: props.localEditingProduct.stock || 0,
            brand: props.localEditingProduct.brand || '',
            discount: props.localEditingProduct.discount || 0,
            color: props.localEditingProduct.color || '#000000',
            availableColors: props.localEditingProduct.availableColors || [],
            category: props.localEditingProduct.category || '',
            variants: (props.localEditingProduct.variants || []).map(variant => ({
                ...variant,
                attributes: variant.attributes?.length ? variant.attributes : [
                    { name: 'Color', value: variant.color?.hexCode || props.localEditingProduct.color || '#000000' }
                ],
                sku: variant.sku || '',
                price: variant.price || 0,
                stock: variant.stock || 0,
                weight: variant.weight || 0,
                images: variant.images || []
            })),
            unit: {
                category: props.localEditingProduct.unit?.category || '',
                baseUnit: props.localEditingProduct.unit?.baseUnit || '',
                conversionFactor: props.localEditingProduct.unit?.conversionFactor || 1,
                value: props.localEditingProduct.unit?.value || 1,
                displayUnit: props.localEditingProduct.unit?.displayUnit || '',
                packagingUnit: props.localEditingProduct.unit?.packagingUnit || '',
                precision: props.localEditingProduct.unit?.precision || 2,
                compoundUnit: props.localEditingProduct.unit?.compoundUnit || {},
            },
            bulkPricing: props.localEditingProduct.bulkPricing || [],
            metaTitle: props.localEditingProduct.metaTitle || '',
            metaDescription: props.localEditingProduct.metaDescription || '',
            images: props.localEditingProduct.images || [],
            isAvailable: props.localEditingProduct.isAvailable ?? true,
            isNew: props.localEditingProduct.isNew ?? false,
        });

        const selectColorPreset = (color, variantIndex = null) => {
            if (variantIndex !== null) {
                const variant = editingProduct.variants[variantIndex];
                const colorAttr = variant.attributes?.find(a => a.name.toLowerCase() === 'color');
                if (colorAttr) {
                    colorAttr.value = color.hexCode;
                }
            } else {
                editingProduct.color = color.hexCode.toLowerCase();
                mainColorName.value = color.name;
                isCustomColor.value = false;
            }
        };

        const toggleCustomColor = () => {
            isCustomColor.value = true;
        };
        const categories = ref([]);
        const selectedCategories = ref([]);

        const showSections = reactive({
            units: false,
            variants: false,
            bulkPricing: false,
            seo: false,
            unitDropdown: false
        });

        const seoAutoMode = ref(false); // Default to false in edit mode to avoid overwriting existing data

        const unitPresets = [
            { label: 'Weight (kg)', category: 'weight', baseUnit: 'kilogram', factor: 1, display: 'kg' },
            { label: 'Weight (g)', category: 'weight', baseUnit: 'gram', factor: 1, display: 'g' },
            { label: 'Volume (L)', category: 'volume', baseUnit: 'liter', factor: 1, display: 'L' },
            { label: 'Volume (ml)', category: 'volume', baseUnit: 'milliliter', factor: 1, display: 'ml' },
            { label: 'Quantity (pcs)', category: 'quantity', baseUnit: 'piece', factor: 1, display: 'pcs' },
            { label: 'Quantity (pack)', category: 'quantity', baseUnit: 'pack', factor: 1, display: 'pack' },
        ];

        const applyUnitPreset = (preset) => {
            editingProduct.unit.category = preset.category;
            editingProduct.unit.baseUnit = preset.baseUnit;
            editingProduct.unit.conversionFactor = preset.factor;
            editingProduct.unit.value = preset.factor;
            editingProduct.unit.displayUnit = preset.display;
        };

        const generateSku = (index) => {
            const variant = editingProduct.variants[index];
            if (!variant) return;

            const namePart = editingProduct.name.substring(0, 3).toUpperCase();

            // Try to get color from attributes first
            const colorAttr = variant.attributes?.find(a => a.name.toLowerCase() === 'color');
            const colorName = colorAttr?.value || variant.color?.name || 'VAR';
            const colorPart = colorName.substring(0, 3).trim().toUpperCase();

            const randPart = Math.floor(1000 + Math.random() * 9000);
            variant.sku = `${namePart}-${colorPart}-${randPart}`;
        };

        const updateSeo = () => {
            if (!seoAutoMode.value) return;
            if (editingProduct.name) editingProduct.metaTitle = editingProduct.name.substring(0, 60);
            if (editingProduct.description) {
                const cleanDesc = editingProduct.description.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
                editingProduct.metaDescription = cleanDesc.substring(0, 160);
            }
            if (editingProduct.name && !tagsInput.value) {
                tagsInput.value = editingProduct.name.split(' ').slice(0, 3).join(', ');
            }
        };

        watch(seoAutoMode, (newVal) => {
            if (newVal) updateSeo();
        });

        watch([() => editingProduct.name, () => editingProduct.description], () => {
            if (seoAutoMode.value) updateSeo();
        });

        const availableStock = computed(() => {
            return (editingProduct.stock || 0) - (editingProduct.reservedStock || 0);
        });

        // Watchers for automatic discount calculation
        watch([() => editingProduct.price, () => editingProduct.originalPrice], ([newPrice, newOriginalPrice]) => {
            if (newOriginalPrice && newOriginalPrice > 0 && newPrice && newPrice > 0) {
                const discount = ((newOriginalPrice - newPrice) / newOriginalPrice) * 100;
                editingProduct.discount = Math.max(0, Math.min(100, Math.round(discount))); // Round to whole integer
            }
        });



        const handleImageUpload = async (event) => {
            const files = event.target.files;
            if (!files.length) return;

            try {
                // Enforce 5-image limit
                const currentImagesCount = editingProduct.images ? editingProduct.images.length : 0;
                const remainingSlots = 5 - currentImagesCount;

                if (remainingSlots <= 0) {
                    toast.error('Maximum limit of 5 images reached');
                    return;
                }

                const validFiles = Array.from(files).slice(0, remainingSlots).filter(file => {
                    if (!file.type.startsWith('image/')) {
                        toast.error(`${file.name} is not an image`);
                        return false;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                        toast.error(`${file.name} exceeds 5MB limit`);
                        return false;
                    }
                    return true;
                });

                if (validFiles.length === 0) {
                    if (Array.from(files).length > remainingSlots) {
                        toast.error('Some files were skipped as the limit of 5 images would be exceeded');
                    }
                    return;
                }

                toast.loading(`Uploading ${validFiles.length} images...`);
                const urls = await uploadService.uploadImages(validFiles);

                if (!editingProduct.images) {
                    editingProduct.images = [];
                }
                editingProduct.images.push(...urls);
                toast.success('Images uploaded successfully');
            } catch (error) {
                console.error('Error in image upload:', error);
                toast.error(`Failed to upload images: ${error.message}`);
            }
        };

        const removeImage = (index) => {
            if (editingProduct.images && editingProduct.images[index]) {
                editingProduct.images.splice(index, 1);
            }
        };

        const closeModal = () => {
            emit('update:isEditModalOpen', false);
        };

        // Add these new methods
        const addColor = () => {
            editingProduct.availableColors.push({
                name: '',
                hexCode: '#000000',
                inStock: true
            });
        };

        const removeColor = (index) => {
            editingProduct.availableColors.splice(index, 1);
        };

        const updateMainColor = () => {
            if (!mainColorName.value) {
                mainColorName.value = getColorName(editingProduct.color);
            }
        };

        const ensureVariantColor = (variant) => {
            if (!variant.color) {
                variant.color = {
                    name: '',
                    hexCode: '#000000',
                    inStock: true
                };
            }
        };

        const addVariant = () => {
            editingProduct.variants.push({
                attributes: [
                    { name: 'Color', value: editingProduct.color },
                    { name: 'Size', value: '' }
                ],
                // Don't initialize with primary color name to prevent leakage during expansion
                color: {
                    name: 'Variant Color',
                    hexCode: editingProduct.color,
                    inStock: true
                },
                sku: '',
                price: editingProduct.price,
                stock: 0,
                barcode: '',
                weight: 0,
                dimensions: { length: 0, width: 0, height: 0 },
                images: []
            });
        };

        const removeVariant = (index) => {
            editingProduct.variants.splice(index, 1);
        };

        const addVariantAttribute = (index, name = '') => {
            if (!editingProduct.variants[index].attributes) {
                editingProduct.variants[index].attributes = [];
            }
            editingProduct.variants[index].attributes.push({
                name: name,
                value: name.toLowerCase() === 'color' ? editingProduct.color : ''
            });
        };

        const removeAttribute = (variantIndex, attrIndex) => {
            editingProduct.variants[variantIndex].attributes.splice(attrIndex, 1);
        };


        const addBulkPricing = () => {
            event.preventDefault(); // Prevent form submission
            editingProduct.bulkPricing.push({ quantity: 0, price: 0 });
        };

        const removeBulkPricing = (index) => {
            editingProduct.bulkPricing.splice(index, 1);
        };


        // Update unit options based on selected category
        const updateSelectedCategories = (categoryInput) => {
            let categoryId = categoryInput;
            if (typeof categoryInput === 'object' && categoryInput !== null) {
                if (Array.isArray(categoryInput)) {
                    // If array, try to get ID from first item or use the item itself if string
                    categoryId = categoryInput[0]?._id || categoryInput[0];
                } else {
                    categoryId = categoryInput._id || categoryInput;
                }
            }

            if (categories.value && categories.value.length > 0 && categoryId) {
                const findCategoryPath = (categories, targetId, path = []) => {
                    for (const category of categories) {
                        if (category._id === targetId) {
                            return [...path, category];
                        }
                        if (category.children && category.children.length > 0) {
                            const result = findCategoryPath(category.children, targetId, [...path, category]);
                            if (result) return result;
                        }
                    }
                    return null;
                };

                const categoryPath = findCategoryPath(categories.value, categoryId);
                if (categoryPath) {
                    selectedCategories.value = categoryPath;
                } else {
                    console.warn(`Category with id ${categoryId} not found`);
                    selectedCategories.value = [];
                }
            }
        };

        const handleVariantImageUpload = async (event, variantIndex) => {
            const files = event.target.files;
            if (!files.length) return;

            // Initialize images array if it doesn't exist
            if (!editingProduct.variants[variantIndex].images) {
                editingProduct.variants[variantIndex].images = [];
            }

            try {
                toast.loading(`Uploading ${files.length} variant images...`);
                const urls = await uploadService.uploadImages(files);

                // Append instead of replace for consistency
                editingProduct.variants[variantIndex].images.push(...urls);

                toast.success('Variant images uploaded');
            } catch (error) {
                console.error('Error uploading variant images:', error);
                toast.error(`Failed to upload variant images`);
            }
        };

        const removeVariantImage = (variantIndex, imageIndex) => {
            if (editingProduct.variants[variantIndex]?.images) {
                editingProduct.variants[variantIndex].images.splice(imageIndex, 1);
            }
        };

        const validateVariants = (variants) => {
            // Centralized color parsing is now imported from utils/colorUtils.js

            // Expand variants: create separate variant for each color+size combination
            const expandedVariants = [];

            variants.forEach(variant => {
                // Extract all colors and sizes from attributes
                const colors = variant.attributes?.filter(a => a.name.toLowerCase() === 'color') || [];
                const sizes = variant.attributes?.filter(a => a.name.toLowerCase() === 'size') || [];
                const otherAttrs = variant.attributes?.filter(a =>
                    a.name.toLowerCase() !== 'color' && a.name.toLowerCase() !== 'size'
                ) || [];

                console.log('Edit modal - Variant expansion:', { colors, sizes, otherAttrs });

                // If no colors or sizes, keep the variant as-is
                if (colors.length === 0 && sizes.length === 0) {
                    expandedVariants.push({
                        ...variant,
                        price: Number(variant.price) || 0,
                        stock: Number(variant.stock) || 0,
                        weight: Number(variant.weight) || 0,
                        dimensions: {
                            length: Number(variant.dimensions?.length || 0),
                            width: Number(variant.dimensions?.width || 0),
                            height: Number(variant.dimensions?.height || 0)
                        }
                    });
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
                            color: variant.color,
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

            console.log('Edit modal - Expanded variants:', expandedVariants.length, expandedVariants);
            return expandedVariants;
        };
        const updateDimension = (variant, dimension, value) => {
            if (!variant.dimensions) {
                variant.dimensions = { length: 0, width: 0, height: 0 };
            }
            variant.dimensions[dimension] = Number(value) || 0;
        };

        const saveProduct = async () => {
            try {
                console.log('Starting saveProduct process...');

                const updatedProduct = JSON.parse(JSON.stringify(editingProduct));

                // Derive variants using expansion logic
                updatedProduct.variants = validateVariants(updatedProduct.variants);
                console.log('Processed variants:', updatedProduct.variants);

                // Derive availableColors for backend compatibility based on expanded variants
                if (updatedProduct.variants.length > 0) {
                    updatedProduct.availableColors = [...new Set(updatedProduct.variants
                        .map(v => JSON.stringify(v.color)))]
                        .map(s => JSON.parse(s));
                }

                // Process stock
                updatedProduct.stock = Number(updatedProduct.stock) || 0;
                console.log('Processed stock:', updatedProduct.stock);

                // Process categories
                if (selectedCategories.value.length > 0) {
                    console.log('Processing categories:', selectedCategories.value);
                    updatedProduct.category = selectedCategories.value[selectedCategories.value.length - 1]._id;
                }

                // Process tags
                updatedProduct.tags = tagsInput.value.split(',').map(tag => tag.trim()).slice(0, 3);
                console.log('Processed tags:', updatedProduct.tags);

                // Process unit information
                console.log('Processing unit information...');
                updatedProduct.unit = {
                    category: updatedProduct.unit.category || updatedProduct.unitCategory || '',
                    baseUnit: updatedProduct.unit.baseUnit || '',
                    conversionFactor: parseFloat(updatedProduct.unit.conversionFactor) || 1,
                    value: parseFloat(updatedProduct.unit.value) || 1,
                    displayUnit: updatedProduct.unit.displayUnit || '',
                    packagingUnit: updatedProduct.unit.packagingUnit || '',
                    precision: parseInt(updatedProduct.unit.precision) || 2,
                    compoundUnit: updatedProduct.unit.compoundUnit || {},
                    regionSpecificDisplay: undefined,
                };
                console.log('Processed unit information:', updatedProduct.unit);


                // Validate unit information
                const existingUnit = updatedProduct.unit || {};

                // Only validate and require unit information if it was previously set
                if (existingUnit.category || existingUnit.baseUnit) {
                    // If unit info existed before, require both fields
                    if (!existingUnit.category || !existingUnit.baseUnit) {
                        throw new Error('Both unit category and base unit must be provided when updating unit information.');
                    }
                }

                // Only validate non-empty values
                if (updatedProduct.unit.category || updatedProduct.unit.baseUnit) {
                    if (!updatedProduct.unit.category || !updatedProduct.unit.baseUnit) {
                        throw new Error('Both unit category and base unit must be provided when specifying unit information.');
                    }
                }


                console.log('Final product data being sent to API:', JSON.stringify(updatedProduct, null, 2));

                console.log('Sending update request to API...');
                const result = await productStore.updateProduct(updatedProduct._id, updatedProduct);
                console.log('API response:', result);

                emit('product-updated', result);
                closeModal();
                toast.success('Product updated successfully');
            } catch (err) {
                console.error('Error in saveProduct:', {
                    error: err,
                    message: err.message,
                    stack: err.stack
                });
                toast.error(err.message || 'Failed to update product');
            }
        };

        onMounted(async () => {
            try {
                categories.value = await productStore.fetchCategories();

                // If we have a category ID at this point, try to select it
                if (editingProduct.category) {
                    updateSelectedCategories(editingProduct.category);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
            }
        });



        // Add a watch effect to handle regionSpecificDisplay updates
        watch(() => props.localEditingProduct?.unit?.regionSpecificDisplay, (newValue) => {
            if (newValue) {
                editingProduct.unit.regionSpecificDisplay = { ...newValue };
            } else {
                editingProduct.unit.regionSpecificDisplay = {};
            }
        }, { deep: true });

        watch(() => props.localEditingProduct, (newProduct) => {
            if (newProduct) {
                Object.assign(editingProduct, newProduct);
                tagsInput.value = newProduct.tags?.join(', ') || '';

                // Initialize color selection state
                const lowerColor = (newProduct.color || '#000000').toLowerCase();
                const matchesPreset = allColors.some(c => c.hexCode.toLowerCase() === lowerColor);
                isCustomColor.value = !matchesPreset && newProduct.color && newProduct.color !== '#000000';

                if (matchesPreset) {
                    const preset = allColors.find(c => c.hexCode.toLowerCase() === lowerColor);
                    mainColorName.value = preset.name;
                } else {
                    mainColorName.value = getColorName(newProduct.color || '#000000');
                }
                // The category will be handled by the v-model binding

                // if (newProduct.category) {
                //     updateSelectedCategories(newProduct.category);
                // }
                // Wait for categories to be loaded before updating selection
                // if (newProduct.category && categories.value?.length > 0) {
                //     console.log('Setting category:', newProduct.category);
                //     updateSelectedCategories(newProduct.category);
                // }
            }
        }, { deep: true });

        // Add a separate watch for categories to handle the case where categories load after the product
        watch(() => categories.value, (newCategories) => {
            if (newCategories?.length > 0 && editingProduct.category) {
                // The HierarchicalCategorySelector will handle this automatically now

                console.log('Categories loaded, updating selection:', editingProduct.category);
                // updateSelectedCategories(editingProduct.category);
            }
        }, { immediate: true });

        return {
            editingProduct,
            closeModal,
            validateVariants,
            updateDimension,
            saveProduct,
            availableStock,
            tagsInput,
            showSections,
            seoAutoMode,
            unitPresets,
            applyUnitPreset,
            generateSku,
            handleImageUpload,
            removeImage,
            handleVariantImageUpload,
            categories,
            selectedCategories,
            updateSelectedCategories,
            addVariant,
            removeVariant,
            addVariantAttribute,
            removeAttribute,
            addBulkPricing,
            removeBulkPricing,
            tagsInput,

            mainColorName,
            allColors,
            isCustomColor,
            selectColorPreset,
            toggleCustomColor,
            addColor,
            removeColor,
            updateMainColor,
            ensureVariantColor
        };
    }
};
</script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Custom styles for input placeholders */
input::placeholder,
textarea::placeholder {
    color: #9CA3AF;
}

/* Custom styles for number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}

/* Add these styles to handle the multi-colored option */
.multi-colored-bg {
    background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
}

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
</style>
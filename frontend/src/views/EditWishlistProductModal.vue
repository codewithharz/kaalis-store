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

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Product Name -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Product Name</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="editingProduct.name"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        required />
                                </div>
                            </div>

                            <!-- Brand -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Brand</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="editingProduct.brand"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none" />
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

                            <!-- Image Preview -->
                            <div v-if="imagePreview" class="relative w-32 h-32">
                                <img :src="imagePreview" alt="Product preview"
                                    class="w-full h-full object-cover rounded-lg shadow-sm" />
                                <button @click="removeImage"
                                    class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                                    <X class="w-4 h-4" />
                                </button>
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

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <label class="text-sm font-medium text-gray-700">Reserved Stock</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="number" v-model.number="editingProduct.reservedStock"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        min="0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Colors and Variants Section -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-semibold text-gray-900">Colors & Variants</h3>

                        <!-- Main Color -->
                        <div class="space-y-4">
                            <label class="text-sm font-medium text-gray-700">Main Color</label>
                            <div class="flex items-center gap-4">
                                <input type="color" v-model="editingProduct.color"
                                    class="h-10 w-20 p-1 rounded-lg border border-gray-200" @input="updateMainColor" />
                                <input type="text" v-model="mainColorName" placeholder="Color name (e.g., Ruby Red)"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                            </div>
                        </div>

                        <!-- Available Colors -->
                        <div class="space-y-4">
                            <div class="space-y-3">
                                <div v-for="(color, index) in editingProduct.availableColors" :key="index"
                                    class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <input type="color" v-model="color.hexCode"
                                        class="h-10 w-20 p-1 rounded-lg border border-gray-200" />
                                    <input type="text" v-model="color.name" placeholder="Color name"
                                        class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                                    <div class="flex items-center gap-2">
                                        <input type="checkbox" v-model="color.inStock"
                                            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20" />
                                        <span class="text-sm text-gray-600">In Stock</span>
                                    </div>
                                    <button @click="removeColor(index)" type="button"
                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 class="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium text-gray-700">Additional Colors</label>
                                <button @click="addColor" type="button"
                                    class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Add Color
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Region Specific Display Section -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-semibold text-gray-900">Region Specific Display</h3>
                        <div class="space-y-4">
                            <!-- Existing Regions -->
                            <!-- <div v-for="(value, key) in editingProduct.unit.regionSpecificDisplay" :key="key"
                                class="flex items-center gap-4">
                                <input v-model="editingProduct.unit.regionSpecificDisplay[key]"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    :placeholder="key" />
                                <button @click="removeRegionSpecificDisplay(key)"
                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 class="w-5 h-5" />
                                </button>
                            </div> -->

                            <!-- Existing Regions -->
                            <div v-for="(value, key) in editingProduct.unit.regionSpecificDisplay" :key="key"
                                class="flex items-center gap-4">
                                <input :value="key" disabled
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
                                    placeholder="Region" />
                                <input v-model="editingProduct.unit.regionSpecificDisplay[key]"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Display Value" />
                                <button type="button" @click.prevent="removeRegionSpecificDisplay(key)"
                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 class="w-5 h-5" />
                                </button>
                            </div>

                            <!-- Add New Region -->
                            <div class="flex gap-4">
                                <input v-model="newRegionKey"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Region" />
                                <input v-model="newRegionValue"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Display" />
                                <button type="button" @click.prevent="addRegionSpecificDisplay"
                                    class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Add Region
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Unit Information Section -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-semibold text-gray-900">Unit Information</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <!-- Product Variants -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900">Product Variants</h3>
                        <div class="space-y-4">
                            <div v-for="(variant, index) in editingProduct.variants" :key="index"
                                class="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <!-- Variant Color -->
                                <div class="space-y-4 mb-6">
                                    <label class="text-sm font-medium text-gray-700">Variant Color</label>
                                    <div class="flex items-center gap-4">
                                        <input type="color" v-model="variant.color.hexCode"
                                            class="h-10 w-20 p-1 rounded-lg border border-gray-200" />
                                        <input type="text" v-model="variant.color.name" placeholder="Variant color name"
                                            class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                                    </div>
                                </div>

                                <!-- Variant Attributes -->
                                <div class="space-y-4 mb-6">
                                    <h4 class="text-md font-medium text-gray-700">Attributes</h4>
                                    <div class="space-y-3">
                                        <div v-for="(attribute, attrIndex) in variant.attributes" :key="attrIndex"
                                            class="flex items-center gap-4">
                                            <input v-model="attribute.name"
                                                class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                placeholder="Attribute Name (e.g., size, color, material)" />
                                            <input v-model="attribute.value"
                                                class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                placeholder="Attribute Value" />
                                            <button @click="removeAttribute(index, attrIndex)"
                                                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 class="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <label class="text-sm font-medium text-gray-700">Additional Attributes</label>
                                        <button @click="addVariantAttribute(index)" type="button"
                                            class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                            Add Attribute
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
                                        <label class="text-sm font-medium text-gray-700">Barcode</label>
                                        <input v-model="variant.barcode"
                                            class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            placeholder="Barcode" />
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
                    <div class="space-y-6">
                        <h3 class="text-lg font-semibold text-gray-900">Bulk Pricing</h3>
                        <div class="space-y-4">
                            <div v-for="(pricing, index) in editingProduct.bulkPricing" :key="index"
                                class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <input type="number" v-model.number="pricing.quantity" placeholder="Minimum quantity"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    min="0" />
                                <input type="number" v-model.number="pricing.price" placeholder="Price per unit"
                                    class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    step="0.01" min="0" />
                                <button @click="removeBulkPricing(index)" type="button"
                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <label class="text-sm font-medium text-gray-700">Additional Price Break</label>
                            <button @click="addBulkPricing" type="button"
                                class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                Add Price Break
                            </button>
                        </div>
                    </div>

                    <!-- Meta Information Section -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-semibold text-gray-900">SEO Information</h3>

                        <div class="space-y-4">
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
import { ref, watch, onMounted, reactive } from 'vue';
import { useProductStore } from '../store/productStore.js';
import { useUserStore } from '../store/user.js';
import { toast } from 'vue-sonner';
import { X, UploadCloud, Trash2 } from 'lucide-vue-next';
import { storage } from '../utils/firebase.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import HierarchicalCategorySelector from './HierarchicalCategorySelector.vue';

export default {
    name: 'EditWishlistProductModal',
    components: {
        HierarchicalCategorySelector, X, UploadCloud, Trash2
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
        const imageFile = ref(null);
        const imagePreview = ref(null);
        const categories = ref([]);
        const selectedCategories = ref([]);
        const tagsInput = ref('');
        const newRegionKey = ref('');
        const newRegionValue = ref('');
        const mainColorName = ref('');

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
                attributes: variant.attributes || [{ name: '', value: '' }],
                color: {
                    name: variant.color?.name || '',
                    hexCode: variant.color?.hexCode || '#000000',
                    inStock: variant.color?.inStock ?? true
                },
                dimensions: {
                    length: variant.dimensions?.length || 0,
                    width: variant.dimensions?.width || 0,
                    height: variant.dimensions?.height || 0
                },
                sku: variant.sku || '',
                price: variant.price || 0,
                stock: variant.stock || 0,
                barcode: variant.barcode || '',
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
                regionSpecificDisplay: props.localEditingProduct.unit?.regionSpecificDisplay || {},
            },
            bulkPricing: props.localEditingProduct.bulkPricing || [],
            metaTitle: props.localEditingProduct.metaTitle || '',
            metaDescription: props.localEditingProduct.metaDescription || '',
            images: props.localEditingProduct.images || [],
            isAvailable: props.localEditingProduct.isAvailable ?? true,
            reservedStock: props.localEditingProduct.reservedStock || 0,
        });


        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                imageFile.value = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        const uploadImage = async () => {
            if (!imageFile.value) {
                console.log('No image file to upload');
                return null;
            }

            try {
                console.log('Starting image upload...', {
                    fileName: imageFile.value.name,
                    fileSize: imageFile.value.size,
                    fileType: imageFile.value.type
                });

                const fileName = `${Date.now()}_${imageFile.value.name}`;
                console.log('Generated file name:', fileName);

                console.log('Creating storage reference...');
                const fileRef = storageRef(storage, `products/${fileName}`);
                console.log('Storage reference created:', fileRef);

                console.log('Initiating upload to Firebase...');
                const uploadResult = await uploadBytes(fileRef, imageFile.value);
                console.log('Upload completed:', uploadResult);

                console.log('Getting download URL...');
                const url = await getDownloadURL(fileRef);
                console.log('Download URL received:', url);

                return url;
            } catch (error) {
                console.error('Error in uploadImage:', {
                    errorCode: error.code,
                    errorMessage: error.message,
                    fullError: error
                });

                // More specific error messages based on Firebase error codes
                if (error.code === 'storage/unauthorized') {
                    throw new Error('Firebase storage permission denied. Check your security rules.');
                } else if (error.code === 'storage/canceled') {
                    throw new Error('Upload was canceled.');
                } else if (error.code === 'storage/unknown') {
                    throw new Error(`Unknown error occurred during upload: ${error.message}`);
                }

                throw error;
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
                const colorMap = {
                    '#ff0000': 'Red',
                    '#00ff00': 'Green',
                    '#0000ff': 'Blue',
                    '#ffff00': 'Yellow',
                    '#ff00ff': 'Magenta',
                    '#00ffff': 'Cyan',
                    '#000000': 'Black',
                    '#ffffff': 'White'
                };
                mainColorName.value = colorMap[editingProduct.color.toLowerCase()] || 'Custom Color';
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
                attributes: [{ name: '', value: '' }], // Initialize with one empty attribute
                color: {
                    name: '',
                    hexCode: '#000000',
                    inStock: true
                },
                sku: '',
                price: 0,
                stock: 0,
                barcode: '',
                weight: 0,
                dimensions: {
                    length: 0,
                    width: 0,
                    height: 0
                },
                images: []
            });
        };

        const removeVariant = (index) => {
            editingProduct.variants.splice(index, 1);
        };

        const addVariantAttribute = (variantIndex) => {
            editingProduct.variants[variantIndex].attributes.push({ name: '', value: '' });
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

        const addRegionSpecificDisplay = () => {
            if (newRegionKey.value && newRegionValue.value) {
                // Ensure regionSpecificDisplay is properly initialized
                if (!editingProduct.unit.regionSpecificDisplay) {
                    editingProduct.unit.regionSpecificDisplay = {};
                }

                // Add new key-value pair
                editingProduct.unit.regionSpecificDisplay = {
                    ...editingProduct.unit.regionSpecificDisplay,
                    [newRegionKey.value.trim()]: newRegionValue.value.trim()
                };

                // Reset input fields
                newRegionKey.value = '';
                newRegionValue.value = '';
            }
        };

        // Remove region specific display key
        const removeRegionSpecificDisplay = (key) => {
            if (editingProduct.unit.regionSpecificDisplay) {
                const updatedDisplay = { ...editingProduct.unit.regionSpecificDisplay };
                delete updatedDisplay[key];
                editingProduct.unit.regionSpecificDisplay = updatedDisplay;
            }
        };

        // Update unit options based on selected category
        const updateSelectedCategories = (categoryId) => {
            if (categories.value && categories.value.length > 0) {
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
            editingProduct.variants[variantIndex].images = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    const fileName = `${Date.now()}_variant_${variantIndex}_${file.name}`;
                    const fileRef = storageRef(storage, `products/${fileName}`);
                    await uploadBytes(fileRef, file);
                    const downloadURL = await getDownloadURL(fileRef);
                    editingProduct.variants[variantIndex].images.push(downloadURL);
                } catch (error) {
                    console.error('Error uploading variant image:', error);
                    toast.error(`Failed to upload variant image: ${file.name}`);
                }
            }
        };

        const validateVariants = (variants) => {
            return variants.map(variant => ({
                ...variant,
                dimensions: {
                    length: Number(variant.dimensions?.length || 0),
                    width: Number(variant.dimensions?.width || 0),
                    height: Number(variant.dimensions?.height || 0)
                }
            }));
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
                let imageUrl = null;

                // Debug log for image file
                console.log('Image file status:', {
                    exists: !!imageFile.value,
                    preview: !!imagePreview.value
                });

                if (imageFile.value) {
                    console.log('Attempting to upload image...');
                    try {
                        imageUrl = await uploadImage();
                        console.log('Image upload successful:', imageUrl);
                    } catch (uploadError) {
                        console.error('Image upload failed:', uploadError);
                        toast.error(`Image upload failed: ${uploadError.message}`);
                        return;
                    }
                }

                const updatedProduct = { ...editingProduct };
                console.log('Initial product data:', updatedProduct);

                // Color validation
                if (editingProduct.availableColors?.length > 0) {
                    console.log('Validating available colors:', editingProduct.availableColors);
                    for (const color of editingProduct.availableColors) {
                        if (!color.name || !color.hexCode) {
                            throw new Error('Each color must have both name and hex code');
                        }
                        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hexCode)) {
                            throw new Error(`Invalid hex code for color: ${color.name}`);
                        }
                    }
                }

                // Validate variant colors
                console.log('Validating variant colors:', editingProduct.variants);
                for (const variant of editingProduct.variants) {
                    if (variant.color && (!variant.color.name || !variant.color.hexCode)) {
                        throw new Error('Each variant color must have both name and hex code');
                    }
                    if (variant.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(variant.color.hexCode)) {
                        throw new Error(`Invalid hex code for variant color: ${variant.color.name}`);
                    }
                }

                // Process variants
                console.log('Processing variants...');
                updatedProduct.variants = validateVariants(updatedProduct.variants);
                console.log('Processed variants:', updatedProduct.variants);

                // Process stock
                updatedProduct.stock = Number(updatedProduct.stock) || 0;
                console.log('Processed stock:', updatedProduct.stock);

                // Handle image URL
                if (imageUrl) {
                    console.log('Adding new image URL to product');
                    updatedProduct.images = [...(updatedProduct.images || []), imageUrl];
                }

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
                    regionSpecificDisplay: updatedProduct.unit.regionSpecificDisplay || {},
                };
                console.log('Processed unit information:', updatedProduct.unit);

                // Convert regionSpecificDisplay to proper format if it's somehow become an array
                if (Array.isArray(updatedProduct.unit.regionSpecificDisplay)) {
                    const converted = {};
                    updatedProduct.unit.regionSpecificDisplay.forEach(item => {
                        if (item && typeof item === 'object' && item.key && item.value) {
                            converted[item.key] = item.value;
                        }
                    });
                    updatedProduct.unit.regionSpecificDisplay = converted;
                }

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

                // Validate variant barcodes
                console.log('Validating variant barcodes...');
                const barcodeRegex = /^[0-9]{12,14}$/;
                for (const variant of updatedProduct.variants) {
                    if (variant.barcode && !barcodeRegex.test(variant.barcode)) {
                        throw new Error(`Invalid barcode for variant: ${variant.sku}`);
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

        const getColorName = (hexColor) => {
            const colorMap = {
                '#ff0000': 'Red',
                '#00ff00': 'Green',
                '#0000ff': 'Blue',
                '#ffff00': 'Yellow',
                '#ff00ff': 'Magenta',
                '#00ffff': 'Cyan',
                '#000000': 'Black',
                '#ffffff': 'White'
            };
            return colorMap[hexColor.toLowerCase()] || 'Custom Color';
        };

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
                imagePreview.value = newProduct.images?.[0] || null;
                tagsInput.value = newProduct.tags?.join(', ') || '';
                mainColorName.value = getColorName(newProduct.color || '#000000');
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
            handleImageUpload,
            handleVariantImageUpload,
            imagePreview,
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
            newRegionKey,
            newRegionValue,
            addRegionSpecificDisplay,
            removeRegionSpecificDisplay,

            mainColorName,
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
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

/* Add these styles to handle the multi-colored option */
.multi-colored-bg {
    background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
}

input[type="color"] {
    -webkit-appearance: none;
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
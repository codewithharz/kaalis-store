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
                    <h1 class="text-4xl font-bold mb-4">Add New Product</h1>
                    <p class="text-lg mb-8 text-white/90">Create and customize your product listing</p>
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
                            <label class="text-sm font-medium text-gray-700">Category</label>
                            <HierarchicalCategorySelector :categories="categories"
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
                                        <input type="text" v-model="product.name"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            required />
                                    </div>
                                </div>

                                <!-- Brand -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Brand</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.brand"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Description</label>
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
                            <h3 class="text-lg font-semibold text-gray-900">Product Images</h3>
                            <div class="space-y-4">
                                <div
                                    class="relative rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 transition-colors">
                                    <input type="file" @change="handleImageUpload"
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple
                                        accept="image/*" />
                                    <div class="text-center">
                                        <UploadCloud class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p class="text-sm text-gray-600">Drag and drop images here or click to browse
                                        </p>
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

                        <!-- Pricing Section -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900">Pricing</h3>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- Price -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Price</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.price"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            step="0.01" min="0" required />
                                    </div>
                                </div>

                                <!-- Original Price -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Original Price</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.originalPrice"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            step="0.01" min="0" />
                                    </div>
                                </div>

                                <!-- Discount -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Discount (%)</label>
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
                                <h3 class="text-lg font-semibold text-gray-900">Inventory</h3>
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" v-model="product.isAvailable"
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
                                        <input type="number" v-model.number="product.stock"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            min="0" required />
                                    </div>
                                </div>

                                <!-- Reserved Stock -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Reserved Stock</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.reservedStock"
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
                                    <input type="color" v-model="product.color"
                                        class="h-10 w-20 p-1 rounded-lg border border-gray-200"
                                        @input="updateMainColor" />
                                    <input type="text" v-model="mainColorName" placeholder="Color name (e.g., Ruby Red)"
                                        class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                                </div>
                            </div>

                            <!-- Available Colors -->
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <label class="text-sm font-medium text-gray-700">Additional Colors</label>
                                    <button @click="addColor" type="button"
                                        class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                        Add Color
                                    </button>
                                </div>

                                <div class="space-y-3">
                                    <div v-for="(color, index) in product.availableColors" :key="index"
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
                            </div>
                        </div>

                        <!-- Region Specific Display Section -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900">Region Specific Display</h3>
                            <div class="space-y-4">
                                <!-- Existing Regions -->
                                <div v-for="(value, key) in product.unit.regionSpecificDisplay" :key="key"
                                    class="flex items-center gap-4">
                                    <input v-model="product.unit.regionSpecificDisplay[key]"
                                        class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        :placeholder="key" />
                                    <button @click="removeRegionSpecificDisplay(key)"
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
                                    <button @click="addRegionSpecificDisplay"
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
                                        <select v-model="product.unit.category" @change="updateUnitOptions"
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
                                        <input type="text" v-model="product.unit.baseUnit" placeholder="kilogram"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            required />
                                    </div>
                                </div>

                                <!-- Conversion Factor -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Conversion Factor</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.unit.conversionFactor"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            step="0.01" min="0" required />
                                    </div>
                                </div>

                                <!-- Unit Value -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Unit Value</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="number" v-model.number="product.unit.value"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            step="0.01" min="0" required />
                                    </div>
                                </div>

                                <!-- Display Unit -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Display Unit</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.unit.displayUnit" placeholder="kg"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none" />
                                    </div>
                                </div>

                                <!-- Packaging Unit -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Packaging Unit</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.unit.packagingUnit"
                                            placeholder="pack, pieces, box, etc."
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Product Variants Section -->
                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-gray-900">Product Variants</h3>
                                <button @click="addVariant" type="button"
                                    class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Add Variant
                                </button>
                            </div>

                            <div class="space-y-4">
                                <div v-for="(variant, index) in product.variants" :key="index"
                                    class="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <!-- Variant Color -->
                                    <div class="space-y-4 mb-6">
                                        <label class="text-sm font-medium text-gray-700">Variant Color</label>
                                        <div class="flex items-center gap-4">
                                            <input type="color" v-model="variant.color.hexCode"
                                                class="h-10 w-20 p-1 rounded-lg border border-gray-200" />
                                            <input type="text" v-model="variant.color.name"
                                                placeholder="Variant color name"
                                                class="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                                        </div>
                                    </div>

                                    <!-- Variant Attributes -->
                                    <div class="space-y-4 mb-6">
                                        <div class="flex items-center justify-between">
                                            <label class="text-sm font-medium text-gray-700">Attributes</label>
                                            <button @click="addVariantAttribute(index)" type="button"
                                                class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                                Add Attribute
                                            </button>
                                        </div>

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
                            </div>
                        </div>

                        <!-- Bulk Pricing Section -->
                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-gray-900">Bulk Pricing</h3>
                                <button @click="addBulkPricing" type="button"
                                    class="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Add Price Break
                                </button>
                            </div>

                            <div class="space-y-4">
                                <div v-for="(pricing, index) in product.bulkPricing" :key="index"
                                    class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <input type="number" v-model.number="pricing.quantity"
                                        placeholder="Minimum quantity"
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
                        </div>

                        <!-- Meta Information Section -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-gray-900">SEO Information</h3>

                            <div class="space-y-4">
                                <!-- Meta Title -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Meta Title (max 60
                                        characters)</label>
                                    <div
                                        class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                        <input type="text" v-model="product.metaTitle"
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
                                        <textarea v-model="product.metaDescription"
                                            class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                            rows="3" maxlength="160"></textarea>
                                    </div>
                                </div>

                                <!-- Tags -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium text-gray-700">Tags (comma-separated, max
                                        3)</label>
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
                            <button type="button" @click="cancelAddProduct"
                                class="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300">
                                Add Product
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../store/productStore.js';
import { useUserStore } from '../store/user.js';
import { storage } from '../utils/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'vue-sonner';
import { Trash2, UploadCloud, ChevronDown } from 'lucide-vue-next';
import HierarchicalCategorySelector from './HierarchicalCategorySelector.vue';

export default {
    name: 'AddProduct',
    components: {
        HierarchicalCategorySelector, Trash2, UploadCloud, ChevronDown
    },
    props: {
        fromDashboard: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
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
                regionSpecificDisplay: {},
            },

            color: '#000000',
            availableColors: [],

            variants: [],
            bulkPricing: [],
            metaTitle: '',
            metaDescription: '',
        });

        const tagsInput = ref('');
        const imagePreview = ref(null);
        const selectedCategories = ref([]);
        const newRegionKey = ref('');
        const newRegionValue = ref('');

        onMounted(async () => {
            try {
                categories.value = await productStore.fetchCategories();
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
                categories.value = [];
            }
        });

        const handleImageUpload = async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    console.log('Starting image upload...', {
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type
                    });

                    // Validate file
                    if (!file.type.startsWith('image/')) {
                        throw new Error('Selected file is not an image');
                    }

                    if (file.size > 5 * 1024 * 1024) {
                        throw new Error('File size exceeds 5MB limit');
                    }

                    // Set preview immediately using FileReader
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagePreview.value = e.target.result;
                        console.log('Preview image set');
                    };
                    reader.readAsDataURL(file);

                    // Upload to Firebase
                    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                    const fileRef = storageRef(storage, `products/${fileName}`);

                    console.log('Uploading to Firebase...');
                    await uploadBytes(fileRef, file);

                    const downloadURL = await getDownloadURL(fileRef);
                    console.log('Download URL received:', downloadURL);

                    // Initialize images array if it doesn't exist
                    if (!product.images) {
                        product.images = [];
                    }

                    // Replace existing images with new one
                    product.images = [downloadURL];
                    console.log('Updated product images:', product.images);

                } catch (error) {
                    console.error('Error in image upload:', {
                        errorCode: error.code,
                        errorMessage: error.message,
                        fullError: error
                    });
                    toast.error(`Failed to upload image: ${error.message}`);
                }
            } else {
                console.log('No file selected');
            }
        };

        const handleVariantImageUpload = async (event, variantIndex) => {
            const files = event.target.files;
            if (!files.length) {
                console.log('No files selected for variant');
                return;
            }

            console.log(`Uploading ${files.length} files for variant ${variantIndex}`);

            // Initialize images array if it doesn't exist
            if (!product.variants[variantIndex].images) {
                product.variants[variantIndex].images = [];
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                try {
                    // Validate file type and size
                    if (!file.type.startsWith('image/')) {
                        throw new Error(`File ${file.name} is not an image`);
                    }

                    if (file.size > 5 * 1024 * 1024) { // 5MB limit
                        throw new Error(`File ${file.name} exceeds 5MB size limit`);
                    }

                    console.log(`Processing file ${i + 1}/${files.length}:`, {
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type
                    });

                    // Set preview for first image
                    if (i === 0) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            product.variants[variantIndex].preview = e.target.result;
                            console.log('Variant preview image set');
                        };
                        reader.readAsDataURL(file);
                    }

                    // Generate unique filename
                    const fileName = `${Date.now()}_variant_${variantIndex}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                    console.log('Generated file name:', fileName);

                    // Upload to Firebase
                    const fileRef = storageRef(storage, `products/${fileName}`);
                    console.log('Uploading to Firebase...');

                    const uploadResult = await uploadBytes(fileRef, file);
                    console.log('Upload completed for variant image');

                    const downloadURL = await getDownloadURL(fileRef);
                    console.log('Download URL received:', downloadURL);

                    // Validate download URL before adding to array
                    if (!downloadURL || typeof downloadURL !== 'string' || !downloadURL.startsWith('https://')) {
                        throw new Error('Invalid download URL received from Firebase');
                    }

                    product.variants[variantIndex].images.push(downloadURL);
                    console.log(`Added image ${i + 1} to variant ${variantIndex}`);

                } catch (error) {
                    console.error(`Error uploading variant image ${i + 1}:`, {
                        errorCode: error.code,
                        errorMessage: error.message
                    });
                    toast.error(`Failed to upload image ${file.name}: ${error.message}`);
                }
            }

            console.log(`Completed upload for variant ${variantIndex}. Total images:`,
                product.variants[variantIndex].images.length
            );
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
                mainColorName.value = colorMap[product.color.toLowerCase()] || 'Custom Color';
            }
        };

        const addVariant = () => {
            product.variants.push({
                // attributes: [{ name: '', value: '' }], // Initialize with one empty attribute
                attributes: [], // Initialize with empty array instead of one attribute
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
            product.variants.splice(index, 1);
        };

        // const addVariantAttribute = (variantIndex) => {
        //     product.variants[variantIndex].attributes.push({ name: '', value: '' });
        // };

        const addVariantAttribute = (variantIndex) => {
            if (!product.variants[variantIndex].attributes) {
                product.variants[variantIndex].attributes = [];
            }
            product.variants[variantIndex].attributes.push({
                name: '',
                value: ''
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

        const addRegionSpecificDisplay = () => {
            if (newRegionKey.value && newRegionValue.value) {
                editingProduct.unit.regionSpecificDisplay[newRegionKey.value] = newRegionValue.value;
                newRegionKey.value = '';
                newRegionValue.value = '';
            }
        };

        const removeRegionSpecificDisplay = (key) => {
            delete editingProduct.unit.regionSpecificDisplay[key];
        };

        const handleSubmit = async () => {
            try {
                if (!product.category) {
                    toast.error('Please select a category');
                    return;
                }

                if (!product.unit.category || !product.unit.baseUnit || !product.unit.value || !product.unit.conversionFactor) {
                    toast.error('Please fill in all required unit information');
                    return;
                }

                // Create a deep clone of the product to avoid reactive issues
                const productData = JSON.parse(JSON.stringify({
                    ...product,
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

                // Validate we have at least one image
                if (productData.images.length === 0) {
                    toast.error('At least one product image is required');
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
                    regionSpecificDisplay: Object.keys(productData.unit.regionSpecificDisplay).length > 0
                        ? productData.unit.regionSpecificDisplay
                        : undefined,
                };

                // Add color validation
                if (productData.availableColors.length > 0) {
                    for (const color of productData.availableColors) {
                        if (!color.name || !color.hexCode) {
                            toast.error('Each color must have both name and hex code');
                            return;
                        }
                    }
                }

                // Validate variant barcodes
                const barcodeRegex = /^[0-9]{12,14}$/;
                for (const variant of productData.variants) {
                    if (variant.barcode && !barcodeRegex.test(variant.barcode)) {
                        toast.error(`Invalid barcode for variant: ${variant.sku}`);
                        return;
                    }
                }

                // Send to API
                console.log('Sending product data to API:', productData);
                const newProduct = await productStore.createProduct(productData);

                // Validate response
                console.log('API Response - New product:', newProduct);

                if (!newProduct.images || newProduct.images.length === 0) {
                    console.warn('Warning: API response contains no images');
                    toast.warning('Product saved but images may not have been properly processed');
                } else {
                    toast.success('Product added successfully');
                    router.push('/account/my-products');
                }
            } catch (error) {
                console.error('Error adding product:', error);
                if (error.response && error.response.data) {
                    console.error('Server error details:', error.response.data);
                }
                toast.error('Failed to add product: ' + (error.response?.data?.error || error.message));
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
            imagePreview,
            updateSelectedCategories,
            addVariant,
            removeVariant,
            addVariantAttribute,
            removeAttribute,
            addBulkPricing,
            removeBulkPricing,
            cancelAddProduct,
            newRegionKey,
            newRegionValue,
            addRegionSpecificDisplay,
            removeRegionSpecificDisplay,

            mainColorName,
            addColor,
            removeColor,
            updateMainColor,
        };
    },
};
</script>


<style scoped>
/* Add these styles to handle the multi-colored option */
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

.multi-colored-bg {
    background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
}
</style>

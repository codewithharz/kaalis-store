<template>
    <div class="filters-container">
        <!-- Related Categories -->


        <div class="border-b border-gray-200">
            <div @click="toggleSection('categories')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Related Categories</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.categories }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.categories" class="mt-2 p-2">
                <ul>
                    <li v-for="category in relatedCategories" :key="category" class="mb-2">
                        <a href="#" class="text-sm text-gray-600 hover:text-[#f27a1a] transition-colors duration-200">
                            {{ category }}
                        </a>
                    </li>
                </ul>
                <button class="text-sm text-[#f27a1a] mt-2 hover:underline">SHOW MORE</button>
            </div>
        </div>

        <!-- Brand Filter -->
        <div class="border-b border-gray-200">
            <div @click="toggleSection('brand')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Brand</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.brand }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.brand" class="mt-2 p-2">
                <div class="relative mb-4">
                    <input type="text" placeholder="Search brand"
                        class="w-full p-2 border rounded text-sm focus:border-[#f27a1a] focus:ring-1 focus:ring-[#f27a1a] outline-none"
                        v-model="brandSearch">
                    <Search class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div v-for="brand in filteredBrands" :key="brand" class="flex items-center mb-2">
                    <div class="w-5 h-5 border border-gray-300 rounded mr-2 flex items-center justify-center cursor-pointer"
                        :class="{ 'bg-[#f27a1a] border-[#f27a1a]': selectedFilters.brand.includes(brand) }"
                        @click="toggleBrand(brand)">
                        <Check v-if="selectedFilters.brand.includes(brand)" class="w-4 h-4 text-white" />
                    </div>
                    <label :for="'brand-' + brand" class="text-sm cursor-pointer"
                        :class="{ 'font-semibold': selectedFilters.brand.includes(brand) }">
                        {{ brand }}
                    </label>
                </div>
            </div>
        </div>

        <!-- Price Filter -->
        <div class="border-b border-gray-200">
            <div @click="toggleSection('price')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Price</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.price }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.price" class="mt-2 p-2">
                <div v-for="(range, index) in priceCounts" :key="index" class="flex items-center mb-2">
                    <input type="checkbox" :id="'price-' + index" v-model="selectedFilters.price" :value="range.value"
                        @change="updateFilters" class="mr-2 accent-[#f27a1a]">
                    <label :for="'price-' + index" class="text-sm">{{ range.label }} ({{ range.count }})</label>
                </div>
            </div>
        </div>

        <!-- Discount Filter -->
        <div class="border-b border-gray-200">
            <div @click="toggleSection('discount')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Discount</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.discount }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.discount" class="mt-2 p-2">
                <div v-for="(range, index) in discountCounts" :key="index" class="flex items-center mb-2">
                    <input type="checkbox" :id="'discount-' + index" v-model="selectedFilters.discount"
                        :value="range.value" @change="updateFilters" class="mr-2 accent-[#f27a1a]">
                    <label :for="'discount-' + index" class="text-sm">{{ range.label }} ({{ range.count }})</label>
                </div>
            </div>
        </div>

        <!-- Body Filter -->
        <div class="border-b border-gray-200">
            <div @click="toggleSection('body')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Body</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.body }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.body" class="mt-2 p-2">
                <div class="relative mb-4">
                    <input type="text" placeholder="Search size"
                        class="w-full p-2 border rounded text-sm focus:border-[#f27a1a] focus:ring-1 focus:ring-[#f27a1a] outline-none"
                        v-model="sizeSearch">
                    <Search class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div v-for="size in filteredSizes" :key="size" class="flex items-center mb-2">
                    <div class="w-5 h-5 border border-gray-300 rounded mr-2 flex items-center justify-center cursor-pointer"
                        :class="{ 'bg-[#f27a1a] border-[#f27a1a]': selectedFilters.body.includes(size) }"
                        @click="toggleSize(size)">
                        <Check v-if="selectedFilters.body.includes(size)" class="w-4 h-4 text-white" />
                    </div>
                    <label :for="'size-' + size" class="text-sm cursor-pointer"
                        :class="{ 'font-semibold': selectedFilters.body.includes(size) }">
                        {{ size }}
                    </label>
                </div>
            </div>
        </div>

        <!-- Sex Filter -->
        <div class="border-b border-gray-200">
            <div @click="toggleSection('sex')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Sex</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.sex }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.sex" class="mt-2 p-2">
                <div v-for="option in sexOptions" :key="option" class="flex items-center mb-2">
                    <div class="w-5 h-5 border border-gray-300 rounded mr-2 flex items-center justify-center cursor-pointer"
                        :class="{ 'bg-[#f27a1a] border-[#f27a1a]': selectedFilters.sex.includes(option) }"
                        @click="toggleSex(option)">
                        <Check v-if="selectedFilters.sex.includes(option)" class="w-4 h-4 text-white" />
                    </div>
                    <label :for="'sex-' + option" class="text-sm cursor-pointer"
                        :class="{ 'font-semibold': selectedFilters.sex.includes(option) }">
                        {{ option }}
                    </label>
                </div>
            </div>
        </div>

        <!-- Color Filter -->
        <div class="border-b border-gray-200 color-filter-section">
            <div @click="toggleSection('color')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Color</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.color }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.color" class="px-3 pb-2 color-grid-container">
                <div class="color-grid gap-x-0 -space-x-6 gap-y-2">
                    <div v-for="color in colorOptions" :key="color.value" class="flex flex-col items-center">
                        <div class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer relative"
                            :class="{ 'border-[#f27a1a]': selectedFilters.color.includes(color.value) }"
                            @click="toggleColor(color.value)">
                            <div class="w-5 h-5 rounded-full" :style="getColorStyle(color)"></div>
                            <Check v-if="selectedFilters.color.includes(color.value)"
                                class="w-4 h-4 text-white absolute"
                                :class="{ 'text-black': ['Yellow', 'Multi-Colored'].includes(color.label) }" />
                        </div>
                        <span class="text-[11px] mt-1">{{ color.label }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Unit Category Filter -->
        <div class="border-b border-gray-200">
            <div @click="toggleSection('unitCategory')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Unit Category</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.unitCategory }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.unitCategory" class="mt-2 p-2">
                <div v-for="category in unitCategories" :key="category" class="flex items-center mb-2">
                    <div class="w-5 h-5 border border-gray-300 rounded mr-2 flex items-center justify-center cursor-pointer"
                        :class="{ 'bg-[#f27a1a] border-[#f27a1a]': selectedFilters.unitCategory.includes(category) }"
                        @click="toggleUnitCategory(category)">
                        <Check v-if="selectedFilters.unitCategory.includes(category)" class="w-4 h-4 text-white" />
                    </div>
                    <label :for="'unitCategory-' + category" class="text-sm cursor-pointer"
                        :class="{ 'font-semibold': selectedFilters.unitCategory.includes(category) }">
                        {{ category }}
                    </label>
                </div>
            </div>
        </div>

        <!-- Unit Value Range Filter -->
        <div class="border-b border-gray-200">
            <div @click="toggleSection('unitValue')"
                class="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-100 transition-colors duration-200 group">
                <h2 class="text-sm font-semibold">Unit Value Range</h2>
                <ChevronDown :class="{ 'rotate-180': !collapsedSections.unitValue }"
                    class="w-5 h-5 transition-transform duration-200 group-hover:text-[#f27a1a]" />
            </div>
            <div v-show="!collapsedSections.unitValue" class="mt-2 p-2 space-y-2">
                <input v-model.number="selectedFilters.unitValue.min" type="number" placeholder="Min"
                    class="w-1/2 p-2 border rounded text-sm">
                <input v-model.number="selectedFilters.unitValue.max" type="number" placeholder="Max"
                    class="w-1/2 p-2 border rounded text-sm">
                <button @click="applyUnitValueRange"
                    class="mt-2 bg-[#f27a1a] text-white px-4 py-2 rounded">Apply</button>
            </div>
        </div>

        <!-- Clear All Filters Button -->
        <button @click="clearAllFilters" class="text-sm text-blue-500 hover:text-blue-700 transition duration-300">
            Clear All Filters
        </button>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { Search, ChevronDown, Check } from 'lucide-vue-next';

export default {
    name: 'ProductFilters',
    components: { Search, ChevronDown, Check },
    props: {
        priceCounts: Array,
        discountCounts: Array,
        brands: {
            type: Array,
            default: () => ['hummel', 'Nike', 'Puma', 'adidas', 'Lumberjack', 'Kinetix', 'Jump', 'Hammer Jack', 'U.S. Polo Assn.']
        },
        relatedCategories: {
            type: Array,
            default: () => ['Sneaker', 'Running & Training Shoes', 'Walking Shoes', 'Outdoor Shoes', 'Fitness Shoes', 'Crampon', 'Carpet Field Shoes']
        },
        sizes: {
            type: Array,
            default: () => ['23', '24', '25', '26', '29', '30', '37,5', '41', '41-42']
        },
        sexOptions: {
            type: Array,
            default: () => ['Man', 'Woman']
        }
    },
    emits: ['update:filters'],
    setup(props, { emit }) {
        const selectedFilters = ref({
            price: [],
            discount: [],
            brand: ['hummel'], // Pre-select 'hummel'
            body: [],
            sex: [],
            color: [],
            unitCategory: [],
            unitValue: { min: null, max: null },
        });

        const brandSearch = ref('');
        const sizeSearch = ref('');

        const collapsedSections = ref({
            // categories: false,
            // brand: false,
            // price: false,
            // discount: false,
            // body: false,
            // sex: false,
            // unitCategory: false,
            // unitValue: false,
            categories: false,
            brand: true,
            price: true,
            discount: true,
            body: true,
            sex: true,
            color: true,
            unitCategory: true,
            unitValue: true
        });

        const filteredBrands = computed(() => {
            return props.brands.filter(brand =>
                brand.toLowerCase().includes(brandSearch.value.toLowerCase())
            );
        });

        const filteredSizes = computed(() => {
            return props.sizes.filter(size =>
                size.toLowerCase().includes(sizeSearch.value.toLowerCase())
            );
        });

        const updateFilters = () => {
            emit('update:filters', selectedFilters.value);
        };

        const clearAllFilters = () => {
            Object.keys(selectedFilters.value).forEach(key => {
                selectedFilters.value[key] = [];
            });
            brandSearch.value = '';
            sizeSearch.value = '';
            updateFilters();
        };

        const toggleSection = (section) => {
            collapsedSections.value[section] = !collapsedSections.value[section];
        };

        const toggleBrand = (brand) => {
            const index = selectedFilters.value.brand.indexOf(brand);
            if (index === -1) {
                selectedFilters.value.brand.push(brand);
            } else {
                selectedFilters.value.brand.splice(index, 1);
            }
            updateFilters();
        };

        const toggleSize = (size) => {
            const index = selectedFilters.value.body.indexOf(size);
            if (index === -1) {
                selectedFilters.value.body.push(size);
            } else {
                selectedFilters.value.body.splice(index, 1);
            }
            updateFilters();
        };

        const toggleSex = (option) => {
            const index = selectedFilters.value.sex.indexOf(option);
            if (index === -1) {
                selectedFilters.value.sex.push(option);
            } else {
                selectedFilters.value.sex.splice(index, 1);
            }
            updateFilters();
        };

        const toggleColor = (color) => {
            const index = selectedFilters.value.color.indexOf(color);
            if (index === -1) {
                selectedFilters.value.color.push(color);
            } else {
                selectedFilters.value.color.splice(index, 1);
            }
            updateFilters();
        };

        const colorOptions = [
            { value: 'red', label: 'Red', hex: '#FF0000' },
            { value: 'dark-red', label: 'Dark Red', hex: '#8B0000' },
            { value: 'burgundy', label: 'Burgundy', hex: '#800020' },
            { value: 'pink', label: 'Pink', hex: '#FFC0CB' },
            { value: 'hot-pink', label: 'Hot Pink', hex: '#FF69B4' },
            { value: 'coral', label: 'Coral', hex: '#FF7F50' },
            { value: 'orange', label: 'Orange', hex: '#FFA500' },
            { value: 'yellow', label: 'Yellow', hex: '#FFFF00' },
            { value: 'gold', label: 'Gold', hex: '#FFD700' },
            { value: 'green', label: 'Green', hex: '#008000' },
            { value: 'olive', label: 'Olive', hex: '#808000' },
            { value: 'lime', label: 'Lime', hex: '#00FF00' },
            { value: 'teal', label: 'Teal', hex: '#008080' },
            { value: 'cyan', label: 'Cyan', hex: '#00FFFF' },
            { value: 'turquoise', label: 'Turquoise', hex: '#40E0D0' },
            { value: 'blue', label: 'Blue', hex: '#0000FF' },
            { value: 'navy-blue', label: 'Navy Blue', hex: '#000080' },
            { value: 'light-blue', label: 'Light Blue', hex: '#ADD8E6' },
            { value: 'purple', label: 'Purple', hex: '#800080' },
            { value: 'lavender', label: 'Lavender', hex: '#E6E6FA' },
            { value: 'indigo', label: 'Indigo', hex: '#4B0082' },
            { value: 'brown', label: 'Brown', hex: '#A52A2A' },
            { value: 'off-white', label: 'Off-White', hex: '#FAF9F6' },
            { value: 'tan', label: 'Tan', hex: '#D2B48C' },
            { value: 'khaki', label: 'Khaki', hex: '#C3B091' },
            { value: 'gray', label: 'Gray', hex: '#808080' },
            { value: 'light-gray', label: 'Light Gray', hex: '#D3D3D3' },
            { value: 'charcoal', label: 'Charcoal', hex: '#36454F' },
            { value: 'black', label: 'Black', hex: '#000000' },
            { value: 'white', label: 'White', hex: '#FFFFFF' },
            { value: 'beige', label: 'Beige', hex: '#F5F5DC' },
            { value: 'cream', label: 'Cream', hex: '#FFFDD0' },
            { value: 'silver', label: 'Silver', hex: '#C0C0C0' },
            { value: 'metallic', label: 'Metallic', hex: '#D3D3D3' },
            { value: 'ivory', label: 'Ivory', hex: '#FFFFF0' },
            { value: 'multi-colored', label: 'Multi-Colored', gradient: true },
        ];

        const getColorStyle = (color) => {
            if (color.gradient) {
                return {
                    background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
                };
            }
            return { backgroundColor: color.hex };
        };

        const unitCategories = ['weight', 'volume', 'length', 'quantity'];

        const toggleUnitCategory = (category) => {
            const index = selectedFilters.value.unitCategory.indexOf(category);
            if (index === -1) {
                selectedFilters.value.unitCategory.push(category);
            } else {
                selectedFilters.value.unitCategory.splice(index, 1);
            }
            updateFilters();
        };

        const applyUnitValueRange = () => {
            updateFilters();
        };

        onMounted(() => {
            updateFilters(); // Emit initial filters with 'hummel' selected
        });

        return {
            selectedFilters,
            updateFilters,
            clearAllFilters,
            brandSearch,
            sizeSearch,
            filteredBrands,
            filteredSizes,
            collapsedSections,
            toggleSection,
            toggleBrand,
            toggleSize,
            toggleSex,
            toggleColor,
            colorOptions,
            getColorStyle,
            unitCategories,
            toggleUnitCategory,
            applyUnitValueRange,
        };
    },
};
</script>

<style scoped>
.filters-container {
    width: 200px;
    /* Set a fixed width */
    min-width: 200px;
    /* Ensure minimum width */
    max-width: 200px;
    /* Ensure maximum width */
    overflow-x: hidden;
    /* Hide horizontal overflow */
    transition: all 0.3s ease;
    /* Smooth transition for any changes */
}

/* Style for filter sections to prevent overflow */
.filters-container>div {
    width: 95%;
    box-sizing: border-box;
}

/* Color filter specific styles */
.color-filter-section {
    width: 100%;
}

.color-grid-container {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 10px;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    width: max-content;
    min-width: 100%;
}

/* Style for input fields to fit within container */
.filters-container input[type="text"],
.filters-container input[type="number"] {
    width: 100%;
    box-sizing: border-box;
}

/* Adjust grid layout for color options */
.filters-container .grid {
    grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
    gap: 5px;
}

/* Ensure buttons don't overflow */
.filters-container button {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
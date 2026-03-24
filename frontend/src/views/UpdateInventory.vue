<template>
    <div class="container mx-auto px-4 py-8 bg-gray-50 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold mb-8 text-gray-800">{{ t('updateInventoryPage.title') }}</h1>

        <!-- Category Selection and Search -->
        <div class="mb-6 flex flex-wrap gap-4">
            <div class="relative">
                <select v-model="selectedCategory"
                    class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                    @change="loadProductsForCategory">
                    <option value="">{{ t('updateInventoryPage.selectCategory') }}</option>
                    <option v-for="category in flattenedCategories" :key="category._id" :value="category._id">
                        {{ category.displayName || category.name }}
                    </option>
                </select>
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown class="w-5 h-5 text-gray-400" />
                </div>
            </div>
            <input v-model="searchTerm" :placeholder="t('updateInventoryPage.searchProducts')"
                class="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @input="filterProducts" />
            <button @click="applyFilters"
                class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out">
                {{ t('updateInventoryPage.applyFilters') }}
            </button>
        </div>

        <!-- Product Table -->
        <div v-if="filteredProducts.length > 0" class="overflow-x-auto bg-white rounded-lg shadow hide-scrollbar">
            <table class="min-w-full">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"
                                class="rounded text-blue-600 focus:ring-blue-500" />
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{{ t('updateInventoryPage.columns.product') }}</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{{ t('updateInventoryPage.columns.variants') }}</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{{ t('updateInventoryPage.columns.price') }}</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            {{ t('updateInventoryPage.columns.originalPrice') }}</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{{ t('updateInventoryPage.columns.stock') }}</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            {{ t('updateInventoryPage.columns.discount') }}</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            {{ t('updateInventoryPage.columns.actions') }}</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <template v-for="product in filteredProducts" :key="product._id">
                        <tr :class="{ 'bg-blue-50': expandedProducts.includes(product._id) }">
                            <td class="px-4 py-4 whitespace-nowrap">
                                <input type="checkbox" v-model="selectedProducts" :value="product._id"
                                    class="rounded text-blue-600 focus:ring-blue-500" />
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <button v-if="product.variants?.length > 0" @click="toggleExpand(product._id)"
                                        class="p-1 hover:bg-gray-200 rounded transition">
                                        <ChevronDown
                                            :class="{ 'transform rotate-180': expandedProducts.includes(product._id) }"
                                            class="w-4 h-4 text-gray-600" />
                                    </button>
                                    <input v-model="product.name"
                                        class="p-1 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ t('updateInventoryPage.variantCount', { count: product.variants?.length || 0 }) }}
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap">
                                <input v-model.number="product.price" type="number"
                                    class="p-1 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap">
                                <input v-model.number="product.originalPrice" type="number"
                                    class="p-1 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap">
                                <input v-model.number="product.stock" type="number" min="0"
                                    class="p-1 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    :disabled="product.variants?.length > 0"
                                    :title="product.variants?.length > 0 ? t('updateInventoryPage.stockManagedPerVariant') : ''" />
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap">
                                <input v-model.number="product.discount" type="number" min="0" max="100"
                                    class="p-1 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </td>
                            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <button @click="updateProduct(product)"
                                    class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 mr-2 transition duration-300 ease-in-out">
                                    {{ t('updateInventoryPage.update') }}
                                </button>
                                <button @click="editProduct(product)"
                                    class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
                                    {{ t('updateInventoryPage.edit') }}
                                </button>
                            </td>
                        </tr>
                        <!-- Variants Table -->
                        <tr v-if="expandedProducts.includes(product._id)" class="bg-gray-50">
                            <td colspan="8" class="px-8 py-4">
                                <div class="border rounded-lg bg-white p-4 shadow-inner">
                                    <h4 class="font-bold text-sm mb-3 flex items-center gap-2">
                                        <Shirt class="w-4 h-4 text-blue-500" />
                                        {{ t('updateInventoryPage.variantsFor', { name: product.name }) }}
                                    </h4>
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th
                                                    class="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                                                    {{ t('updateInventoryPage.columns.attributes') }}</th>
                                                <th
                                                    class="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                                                    {{ t('updateInventoryPage.columns.color') }}</th>
                                                <th
                                                    class="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                                                    {{ t('updateInventoryPage.columns.price') }}</th>
                                                <th
                                                    class="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                                                    {{ t('updateInventoryPage.columns.stock') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-100">
                                            <tr v-for="variant in product.variants" :key="variant._id">
                                                <td class="px-2 py-2 text-xs">
                                                    <span v-for="attr in variant.attributes" :key="attr.name"
                                                        class="mr-2 inline-block bg-gray-100 px-1 py-0.5 rounded">
                                                        {{ attr.name }}: {{ attr.value }}
                                                    </span>
                                                </td>
                                                <td class="px-2 py-2 text-xs flex items-center gap-2">
                                                    <div v-if="variant.color?.hexCode"
                                                        class="w-4 h-4 rounded-full border border-gray-200"
                                                        :style="{ backgroundColor: variant.color.hexCode }"></div>
                                                    {{ variant.color?.name || t('updateInventoryPage.notAvailable') }}
                                                </td>
                                                <td class="px-2 py-2">
                                                    <input v-model.number="variant.price" type="number"
                                                        class="p-1 border rounded text-xs w-24 focus:ring-1 focus:ring-blue-500" />
                                                </td>
                                                <td class="px-2 py-2">
                                                    <input v-model.number="variant.stock" type="number" min="0"
                                                        @input="syncProductStock(product)"
                                                        class="p-1 border rounded text-xs w-24 focus:ring-1 focus:ring-blue-500" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div v-else-if="selectedCategory" class="text-center py-4 text-gray-600">
            {{ t('updateInventoryPage.noProductsInCategory') }}
        </div>
        <div v-else class="text-center py-4 text-gray-600">
            {{ t('updateInventoryPage.selectCategoryPrompt') }}
        </div>

        <!-- Bulk Update Section -->
        <div class="mt-12 bg-white p-6 rounded-lg shadow">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">{{ t('updateInventoryPage.bulkUpdateTitle') }}</h2>
            <div class="flex flex-col sm:flex-row items-center gap-4">
                <div class="relative">
                    <select v-model="bulkUpdateAction"
                        class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                        <option value="increase">{{ t('updateInventoryPage.bulkActions.increase') }}</option>
                        <option value="decrease">{{ t('updateInventoryPage.bulkActions.decrease') }}</option>
                        <option value="set">{{ t('updateInventoryPage.bulkActions.set') }}</option>
                    </select>
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown class="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <input v-model.number="bulkUpdateValue" type="number" min="0"
                    class="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-24"
                    :placeholder="t('updateInventoryPage.amount')" />
                <button @click="applyBulkUpdate"
                    class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out w-full sm:w-auto">
                    {{ t('updateInventoryPage.applyBulkUpdate') }}
                </button>
            </div>
        </div>

        <!-- CSV Import/Export -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <button @click="exportCSV"
                class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out w-full sm:w-auto">
                {{ t('updateInventoryPage.exportCsv') }}
            </button>
            <label
                class="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 cursor-pointer text-center w-full sm:w-auto transition duration-300 ease-in-out">
                {{ t('updateInventoryPage.importCsv') }}
                <input type="file" @change="importCSV" accept=".csv" class="hidden" />
            </label>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProductStore } from '../store/productStore';
import { storeToRefs } from 'pinia';
import { ChevronDown, Shirt } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

export default {
    name: 'UpdateInventory',
    components: { ChevronDown },
    setup() {
        const { t, locale } = useI18n();
        const productStore = useProductStore();
        const { flattenedCategories } = storeToRefs(productStore);

        const selectedCategory = ref('');
        const searchTerm = ref('');
        const products = ref([]);
        const filteredProducts = ref([]);
        const selectedProducts = ref([]);
        const selectAll = ref(false);
        const bulkUpdateAction = ref('increase');
        const bulkUpdateValue = ref(0);
        const expandedProducts = ref([]);

        const toggleExpand = (productId) => {
            const index = expandedProducts.value.indexOf(productId);
            if (index === -1) {
                expandedProducts.value.push(productId);
            } else {
                expandedProducts.value.splice(index, 1);
            }
        };

        const syncProductStock = (product) => {
            if (product.variants?.length > 0) {
                product.stock = product.variants.reduce((total, v) => total + (v.stock || 0), 0);
            }
        };

        const loadProductsForCategory = async () => {
            if (selectedCategory.value) {
                try {
                    products.value = await productStore.fetchProductsByCategory(selectedCategory.value);
                    filterProducts();
                } catch (error) {
                    console.error('Error fetching products:', error);
                    toast.error(t('updateInventoryPage.toasts.fetchProductsFailed'));
                    products.value = [];
                }
            } else {
                products.value = [];
                filteredProducts.value = [];
            }
        };

        const filterProducts = () => {
            filteredProducts.value = products.value.filter(product =>
                product.name.toLowerCase().includes(searchTerm.value.toLowerCase())
            );
        };

        const applyFilters = () => {
            filterProducts();
        };

        const formatPrice = (price) => {
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-NG';
            return new Intl.NumberFormat(activeLocale, { style: 'currency', currency: 'NGN' }).format(price);
        };

        const toggleSelectAll = () => {
            if (selectAll.value) {
                selectedProducts.value = filteredProducts.value.map(p => p._id);
            } else {
                selectedProducts.value = [];
            }
        };

        const updateProduct = async (product) => {
            try {
                await productStore.updateProduct(product._id, {
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    stock: product.stock,
                    discount: product.discount,
                    variants: product.variants
                });
                toast.success(t('updateInventoryPage.toasts.productUpdated'));
            } catch (error) {
                console.error('Error updating product:', error);
                toast.error(t('updateInventoryPage.toasts.productUpdateFailed'));
            }
        };

        const applyBulkUpdate = async () => {
            try {
                for (const productId of selectedProducts.value) {
                    const product = products.value.find(p => p._id === productId);
                    if (product) {
                        let newStock;
                        switch (bulkUpdateAction.value) {
                            case 'increase':
                                newStock = product.stock + bulkUpdateValue.value;
                                break;
                            case 'decrease':
                                newStock = Math.max(0, product.stock - bulkUpdateValue.value);
                                break;
                            case 'set':
                                newStock = bulkUpdateValue.value;
                                break;
                        }
                        await productStore.updateProduct(product._id, { stock: newStock });
                        product.stock = newStock;
                    }
                }
                toast.success(t('updateInventoryPage.toasts.bulkUpdateCompleted'));
                selectedProducts.value = [];
                selectAll.value = false;
            } catch (error) {
                console.error('Error applying bulk update:', error);
                toast.error(t('updateInventoryPage.toasts.bulkUpdateFailed'));
            }
        };

        const exportCSV = () => {
            const selectedProductsData = products.value.filter(p => selectedProducts.value.includes(p._id));
            const csvContent = [
                [
                    t('updateInventoryPage.csvHeaders.productId'),
                    t('updateInventoryPage.csvHeaders.name'),
                    t('updateInventoryPage.csvHeaders.price'),
                    t('updateInventoryPage.csvHeaders.stock'),
                    t('updateInventoryPage.csvHeaders.discount')
                ],
                ...selectedProductsData.map(product => [
                    product._id,
                    product.name,
                    product.price,
                    product.stock,
                    product.discount
                ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', t('updateInventoryPage.inventoryFilename'));
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        const importCSV = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target.result;
                const rows = text.split('\n').slice(1); // Skip header row
                for (const row of rows) {
                    const [id, , , stock] = row.split(',');
                    if (id && stock) {
                        try {
                            await productStore.updateProduct(id.trim(), { stock: parseInt(stock.trim(), 10) });
                        } catch (error) {
                            console.error(`Failed to update product ${id}:`, error);
                        }
                    }
                }
                await loadProductsForCategory();
                toast.success(t('updateInventoryPage.toasts.csvImportCompleted'));
            };
            reader.readAsText(file);
        };

        onMounted(async () => {
            try {
                await productStore.fetchCategories();
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error(t('updateInventoryPage.toasts.fetchCategoriesFailed'));
            }
        });

        return {
            t,
            selectedCategory,
            searchTerm,
            products,
            filteredProducts,
            selectedProducts,
            selectAll,
            bulkUpdateAction,
            bulkUpdateValue,
            flattenedCategories,
            loadProductsForCategory,
            filterProducts,
            applyFilters,
            formatPrice,
            toggleSelectAll,
            applyBulkUpdate,
            exportCSV,
            importCSV,
            updateProduct,
            expandedProducts,
            toggleExpand,
            syncProductStock,
            Shirt
        };
    }
};
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-x-auto::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-x-auto {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

/* Ensure the input background is white */
input[type="number"] {
    background-color: white;
}

/* Add hover effect to rows for better interactivity */
tbody tr:hover {
    background-color: #f0f4f8;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}
</style>

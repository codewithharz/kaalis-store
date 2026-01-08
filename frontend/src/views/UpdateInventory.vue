<template>
    <div class="container mx-auto px-4 py-8 bg-gray-50 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold mb-8 text-gray-800">Update Inventory</h1>

        <!-- Category Selection and Search -->
        <div class="mb-6 flex flex-wrap gap-4">
            <div class="relative">
                <select v-model="selectedCategory"
                    class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                    @change="loadProductsForCategory">
                    <option value="">Select Category</option>
                    <option v-for="category in flattenedCategories" :key="category._id" :value="category._id">
                        {{ category.name }}
                    </option>
                </select>
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown class="w-5 h-5 text-gray-400" />
                </div>
            </div>
            <input v-model="searchTerm" placeholder="Search products..."
                class="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @input="filterProducts" />
            <button @click="applyFilters"
                class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out">
                Apply Filters
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
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Product</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Original Price</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stock
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Discount</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="product in filteredProducts" :key="product._id">
                        <td class="px-4 py-4 whitespace-nowrap">
                            <input type="checkbox" v-model="selectedProducts" :value="product._id"
                                class="rounded text-blue-600 focus:ring-blue-500" />
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                            <input v-model="product.name"
                                class="p-1 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
                                class="p-1 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                            <input v-model.number="product.discount" type="number" min="0" max="100"
                                class="p-1 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button @click="updateProduct(product)"
                                class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 mr-2 transition duration-300 ease-in-out">
                                Update
                            </button>
                            <button @click="editProduct(product)"
                                class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
                                Edit
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="selectedCategory" class="text-center py-4 text-gray-600">
            No products found in this category
        </div>
        <div v-else class="text-center py-4 text-gray-600">
            Please select a category to view products
        </div>

        <!-- Bulk Update Section -->
        <div class="mt-12 bg-white p-6 rounded-lg shadow">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">Bulk Update Selected Products</h2>
            <div class="flex flex-col sm:flex-row items-center gap-4">
                <div class="relative">
                    <select v-model="bulkUpdateAction"
                        class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                        <option value="increase">Increase Stock</option>
                        <option value="decrease">Decrease Stock</option>
                        <option value="set">Set Stock</option>
                    </select>
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown class="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <input v-model.number="bulkUpdateValue" type="number" min="0"
                    class="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-24"
                    placeholder="Amount" />
                <button @click="applyBulkUpdate"
                    class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out w-full sm:w-auto">
                    Apply Bulk Update
                </button>
            </div>
        </div>

        <!-- CSV Import/Export -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <button @click="exportCSV"
                class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out w-full sm:w-auto">
                Export CSV
            </button>
            <label
                class="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 cursor-pointer text-center w-full sm:w-auto transition duration-300 ease-in-out">
                Import CSV
                <input type="file" @change="importCSV" accept=".csv" class="hidden" />
            </label>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '../store/productStore';
import { storeToRefs } from 'pinia';
import { ChevronDown } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

export default {
    name: 'UpdateInventory',
    components: { ChevronDown },
    setup() {
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

        const loadProductsForCategory = async () => {
            if (selectedCategory.value) {
                try {
                    products.value = await productStore.fetchProductsByCategory(selectedCategory.value);
                    filterProducts();
                } catch (error) {
                    console.error('Error fetching products:', error);
                    toast.error('Failed to fetch products for this category');
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
            return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
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
                    discount: product.discount
                });
                toast.success('Product updated successfully');
            } catch (error) {
                console.error('Error updating product:', error);
                toast.error('Failed to update product');
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
                toast.success('Bulk update completed');
                selectedProducts.value = [];
                selectAll.value = false;
            } catch (error) {
                console.error('Error applying bulk update:', error);
                toast.error('Failed to apply bulk update');
            }
        };

        const exportCSV = () => {
            const selectedProductsData = products.value.filter(p => selectedProducts.value.includes(p._id));
            const csvContent = [
                ['Product ID', 'Name', 'Price', 'Stock', 'Discount'],
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
                link.setAttribute('download', 'inventory.csv');
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
                toast.success('CSV import completed');
            };
            reader.readAsText(file);
        };

        onMounted(async () => {
            try {
                await productStore.fetchCategories();
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories');
            }
        });

        return {
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
            updateProduct
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

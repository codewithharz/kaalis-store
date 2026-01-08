// frontend/src/views/admin/AdminProducts.vue
<template>
    <div>
        <!-- Header & Actions -->
        <div class="flex justify-between items-center mb-3 px-8 py-4 bg-white">
            <h2 class="text-2xl font-bold text-gray-800">Products Management</h2>
            <button @click="showAddModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add New Product
            </button>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Search -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input type="text" v-model="filters.search" placeholder="Search products..."
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>

                <!-- Category Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div class="relative">
                        <select v-model="filters.category"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchProducts">
                            <option value="">All Categories</option>
                            <option v-for="category in categories" :key="category._id" :value="category._id">
                                {{ category.name }}
                            </option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Stock Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                    <div class="relative">
                        <select v-model="filters.stock"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchProducts">
                            <option value="">All</option>
                            <option value="in_stock">In Stock</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div class="relative">
                        <select v-model="filters.status"
                            class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent"
                            @change="fetchProducts">
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronDown class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Products Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="min-w-full">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="product in products" :key="product._id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 rounded-lg bg-gray-200 flex-shrink-0">
                                        <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name"
                                            class="h-10 w-10 rounded-lg object-cover">
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">
                                            {{ product.name }}
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            SKU: {{ product.sku }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm text-gray-900">
                                    {{ product.category?.name || 'Uncategorized' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm font-medium text-gray-900">
                                    ${{ product.price.toFixed(2) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    getStockStatusClass(product.stock)
                                ]">
                                    {{ product.stock }} in stock
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                ]">
                                    {{ product.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button @click="editProduct(product)"
                                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                                    Edit
                                </button>
                                <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                        Previous
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Showing
                            <span class="font-medium">{{ startItem }}</span>
                            to
                            <span class="font-medium">{{ endItem }}</span>
                            of
                            <span class="font-medium">{{ totalItems }}</span>
                            results
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                Previous
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Product Modal -->
        <div v-if="showAddModal || selectedProduct"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    {{ selectedProduct ? 'Edit Product' : 'Add New Product' }}
                </h3>
                <form @submit.prevent="handleSubmit">
                    <!-- Form fields -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" v-model="formData.name"
                                class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3" required>
                        </div>

                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea v-model="formData.description"
                                class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3" rows="3"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Price</label>
                            <input type="number" v-model="formData.price"
                                class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3" step="0.01" required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Stock</label>
                            <input type="number" v-model="formData.stock"
                                class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3" required>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Category</label>
                            <select v-model="formData.category"
                                class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3">
                                <option v-for="category in categories" :key="category._id" :value="category._id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select v-model="formData.status"
                                class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="closeModal"
                            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            {{ selectedProduct ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    Confirm Delete
                </h3>
                <p class="text-gray-500 mb-6">
                    Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                        Cancel
                    </button>
                    <button @click="deleteProduct" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { ChevronDown } from 'lucide-vue-next';
import { debounce } from 'lodash';

export default {
    name: 'AdminProducts',

    components: {
        ChevronDown
    },

    setup() {
        const router = useRouter();
        const products = ref([]);
        const categories = ref([]);
        const selectedProduct = ref(null);
        const showAddModal = ref(false);
        const showDeleteModal = ref(false);
        const productToDelete = ref(null);

        // Pagination
        const currentPage = ref(1);
        const totalItems = ref(0);
        const itemsPerPage = ref(10);
        const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

        // Filters
        const filters = ref({
            search: '',
            category: '',
            stock: '',
            status: ''
        });

        // Form data
        const formData = ref({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            category: '',
            status: 'active'
        });

        // Computed
        const startItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1);
        const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

        // Methods
        const fetchProducts = async () => {
            try {
                const queryParams = new URLSearchParams({
                    page: currentPage.value,
                    limit: itemsPerPage.value,
                    ...filters.value
                });

                const response = await fetch(`/api/admin/products?${queryParams}`);
                const data = await response.json();

                products.value = data.products;
                totalItems.value = data.pagination.total;
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to fetch products');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/admin/categories');
                const data = await response.json();
                categories.value = data;
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories');
            }
        };

        const handleSubmit = async () => {
            try {
                if (selectedProduct.value) {
                    await fetch(`/api/admin/products/${selectedProduct.value._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData.value)
                    });
                    toast.success('Product updated successfully');
                } else {
                    await fetch('/api/admin/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData.value)
                    });
                    toast.success('Product created successfully');
                }
                closeModal();
                fetchProducts();
            } catch (error) {
                console.error('Error submitting product:', error);
                toast.error('Failed to save product');
            }
        };

        const editProduct = (product) => {
            selectedProduct.value = product;
            formData.value = {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category?._id,
                status: product.status
            };
            showAddModal.value = true;
        };

        const confirmDelete = (product) => {
            productToDelete.value = product;
            showDeleteModal.value = true;
        };

        const deleteProduct = async () => {
            try {
                await fetch(`/api/admin/products/${productToDelete.value._id}`, {
                    method: 'DELETE'
                });
                toast.success('Product deleted successfully');
                showDeleteModal.value = false;
                productToDelete.value = null;
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        };

        // Use debounce from lodash directly
        const handleSearch = debounce(() => {
            currentPage.value = 1;
            fetchProducts();
        }, 300);

        const closeModal = () => {
            showAddModal.value = false;
            selectedProduct.value = null;
            formData.value = {
                name: '',
                description: '',
                price: 0,
                stock: 0,
                category: '',
                status: 'active'
            };
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchProducts();
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                fetchProducts();
            }
        };

        const getStockStatusClass = (stock) => {
            if (stock === 0) return 'bg-red-100 text-red-800';
            if (stock < 10) return 'bg-yellow-100 text-yellow-800';
            return 'bg-green-100 text-green-800';
        };

        // Lifecycle hooks
        onMounted(() => {
            fetchProducts();
            fetchCategories();
        });

        return {
            products,
            categories,
            selectedProduct,
            showAddModal,
            showDeleteModal,
            formData,
            filters,
            currentPage,
            totalItems,
            totalPages,
            startItem,
            endItem,
            handleSubmit,
            editProduct,
            confirmDelete,
            deleteProduct,
            handleSearch,
            closeModal,
            prevPage,
            nextPage,
            getStockStatusClass,
            fetchProducts
        };
    }
};

</script>

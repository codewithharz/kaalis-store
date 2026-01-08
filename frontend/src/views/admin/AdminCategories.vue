<!-- // frontend/src/views/admin/AdminCategories.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="flex justify-between items-center mb-3 px-8 py-4 bg-white">
            <h2 class="text-2xl font-bold text-gray-800">Category Management</h2>
            <button @click="showAddModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add New Category
            </button>
        </div>

        <!-- Category Tree and Details -->
        <div class="grid grid-cols-12 gap-6">
            <!-- Category Tree -->
            <div class="col-span-4 bg-white rounded-lg shadow-sm p-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Categories</h3>
                    <button @click="expandAll" class="text-blue-600 hover:text-blue-800 text-sm">
                        {{ allExpanded ? 'Collapse All' : 'Expand All' }}
                    </button>
                </div>

                <!-- Search Categories -->
                <div class="mb-4">
                    <input type="text" v-model="searchQuery" placeholder="Search categories..."
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>

                <!-- Category Tree View -->
                <div class="overflow-y-auto max-h-[600px]">
                    <div v-if="loading" class="flex justify-center py-4">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>

                    <div v-else-if="filteredCategories.length === 0" class="text-center py-4 text-gray-500">
                        No categories found
                    </div>

                    <div v-else class="space-y-2">
                        <template v-for="category in filteredCategories" :key="category._id">
                            <div v-if="!category.parent" class="category-item"
                                :class="{ 'border-blue-500': selectedCategory?._id === category._id }">
                                <CategoryTreeItem :category="category" :all-categories="categories"
                                    :selected-id="selectedCategory?._id" @select="selectCategory" />
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Category Details -->
            <div class="col-span-8 space-y-6">
                <!-- Selected Category Details -->
                <div v-if="selectedCategory" class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900">
                                {{ selectedCategory.name }}
                            </h3>
                            <p class="text-sm text-gray-500">
                                Created on {{ formatDate(selectedCategory.createdAt) }}
                            </p>
                        </div>
                        <div class="space-x-2">
                            <button @click="editCategory(selectedCategory)"
                                class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                Edit
                            </button>
                            <button @click="confirmDelete(selectedCategory)"
                                class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                                Delete
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Description</h4>
                            <p class="text-gray-600">
                                {{ selectedCategory.description || 'No description provided' }}
                            </p>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Parent Category</h4>
                            <p class="text-gray-600">
                                {{ getParentName(selectedCategory) }}
                            </p>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Status</h4>
                            <span :class="[
                                'px-2 py-1 text-sm rounded-full',
                                selectedCategory.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            ]">
                                {{ selectedCategory.active ? 'Active' : 'Inactive' }}
                            </span>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Products Count</h4>
                            <p class="text-gray-600">
                                {{ selectedCategory.productsCount || 0 }} products
                            </p>
                        </div>
                    </div>

                    <!-- Subcategories -->
                    <div class="mt-6">
                        <h4 class="font-medium text-gray-700 mb-2">Subcategories</h4>
                        <div class="grid grid-cols-3 gap-4">
                            <div v-for="subcategory in getSubcategories(selectedCategory._id)" :key="subcategory._id"
                                class="p-3 bg-gray-50 rounded-lg">
                                <p class="font-medium">{{ subcategory.name }}</p>
                                <p class="text-sm text-gray-500">
                                    {{ subcategory.productsCount || 0 }} products
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No Selection State -->
                <div v-else class="bg-white rounded-lg shadow-sm p-6 text-center">
                    <div class="text-gray-400">
                        <FolderOpen class="w-12 h-12 mx-auto mb-4" />
                        <p>Select a category to view details</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Category Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    {{ selectedCategory ? 'Edit Category' : 'Add New Category' }}
                </h3>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" v-model="formData.name"
                            class="mt-1 block w-full border rounded-md shadow-sm p-2" required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea v-model="formData.description"
                            class="mt-1 block w-full border rounded-md shadow-sm p-2" rows="3"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Parent Category</label>
                        <select v-model="formData.parent" class="mt-1 block w-full border rounded-md shadow-sm p-2">
                            <option value="">None (Top Level)</option>
                            <option v-for="cat in availableParents" :key="cat._id" :value="cat._id">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>

                    <div class="flex items-center">
                        <input type="checkbox" id="active" v-model="formData.active"
                            class="h-4 w-4 text-blue-600 rounded">
                        <label for="active" class="ml-2 block text-sm text-gray-900">
                            Active
                        </label>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            {{ selectedCategory ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
                <p class="text-gray-500 mb-4">
                    Are you sure you want to delete "{{ categoryToDelete?.name }}"?
                    {{ getSubcategories(categoryToDelete?._id).length > 0 ?
                        'This will also delete all subcategories.' : '' }}
                </p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        Cancel
                    </button>
                    <button @click="deleteCategory" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { FolderOpen } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import CategoryTreeItem from './components/CategoryTreeItem.vue';
import _ from 'lodash';

export default {
    name: 'AdminCategories',

    components: {
        CategoryTreeItem,
        FolderOpen
    },

    setup() {
        const categories = ref([]);
        const selectedCategory = ref(null);
        const showAddModal = ref(false);
        const showDeleteModal = ref(false);
        const categoryToDelete = ref(null);
        const loading = ref(false);
        const allExpanded = ref(false);
        const searchQuery = ref('');

        const formData = ref({
            name: '',
            description: '',
            parent: '',
            active: true
        });

        // Fetching categories
        const fetchCategories = async () => {
            loading.value = true;
            try {
                const response = await fetch('/api/admin/categories');
                const data = await response.json();
                categories.value = data;
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to fetch categories');
            } finally {
                loading.value = false;
            }
        };

        // Computed properties
        const filteredCategories = computed(() => {
            if (!searchQuery.value) return categories.value;

            return categories.value.filter(category =>
                category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        const availableParents = computed(() => {
            if (!selectedCategory.value) return categories.value;
            // Filter out the selected category and its children to prevent circular references
            return categories.value.filter(cat =>
                cat._id !== selectedCategory.value._id &&
                !isDescendant(cat, selectedCategory.value._id)
            );
        });

        // Helper functions
        const isDescendant = (category, parentId) => {
            if (!category.parent) return false;
            if (category.parent === parentId) return true;
            const parent = categories.value.find(c => c._id === category.parent);
            return parent ? isDescendant(parent, parentId) : false;
        };

        const getParentName = (category) => {
            if (!category.parent) return 'None (Top Level)';
            const parent = categories.value.find(c => c._id === category.parent);
            return parent ? parent.name : 'Unknown';
        };

        const getSubcategories = (parentId) => {
            return categories.value.filter(cat => cat.parent === parentId);
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        // Actions
        const handleSubmit = async () => {
            try {
                if (selectedCategory.value) {
                    await fetch(`/api/admin/categories/${selectedCategory.value._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData.value)
                    });
                    toast.success('Category updated successfully');
                } else {
                    await fetch('/api/admin/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData.value)
                    });
                    toast.success('Category created successfully');
                }
                closeModal();
                fetchCategories();
            } catch (error) {
                console.error('Error saving category:', error);
                toast.error('Failed to save category');
            }
        };

        const selectCategory = (category) => {
            selectedCategory.value = category;
        };

        const editCategory = (category) => {
            formData.value = {
                name: category.name,
                description: category.description,
                parent: category.parent || '',
                active: category.active
            };
            selectedCategory.value = category;
            showAddModal.value = true;
        };

        const confirmDelete = (category) => {
            categoryToDelete.value = category;
            showDeleteModal.value = true;
        };

        const deleteCategory = async () => {
            try {
                await fetch(`/api/admin/categories/${categoryToDelete.value._id}`, {
                    method: 'DELETE'
                });
                toast.success('Category deleted successfully');
                if (selectedCategory.value?._id === categoryToDelete.value._id) {
                    selectedCategory.value = null
                }
                showDeleteModal.value = false;
                categoryToDelete.value = null;
                await fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Failed to delete category');
            }
        };

        const closeModal = () => {
            showAddModal.value = false;
            selectedCategory.value = null;
            formData.value = {
                name: '',
                description: '',
                parent: '',
                active: true
            };
        };

        const handleSearch = _.debounce(() => {
            selectedCategory.value = null;
        }, 300);

        const expandAll = () => {
            allExpanded.value = !allExpanded.value;
        };

        // Lifecycle hooks
        onMounted(() => {
            fetchCategories();
        });

        return {
            categories,
            selectedCategory,
            showAddModal,
            showDeleteModal,
            categoryToDelete,
            formData,
            loading,
            searchQuery,
            allExpanded,
            filteredCategories,
            availableParents,
            handleSubmit,
            selectCategory,
            editCategory,
            confirmDelete,
            deleteCategory,
            closeModal,
            handleSearch,
            expandAll,
            getParentName,
            getSubcategories,
            formatDate
        };
    }
};
</script>

<style scoped>
.category-item {
    @apply border-l-4 border-transparent pl-2;
}
</style>
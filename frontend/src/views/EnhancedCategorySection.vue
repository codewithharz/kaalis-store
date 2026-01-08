<template>
    <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
            Category
        </label>
        <div class="relative">
            <input v-model="categorySearch" @input="searchCategories"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" placeholder="Search or select a category">
            <div v-if="filteredCategories.length > 0"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                <div v-for="category in filteredCategories" :key="category._id"
                    class="p-2 hover:bg-gray-100 cursor-pointer flex items-center" @click="selectCategory(category)">
                    <span v-if="category.icon" class="mr-2" v-html="category.icon"></span>
                    {{ category.name }}
                    <span v-if="category.description" class="text-xs text-gray-500 ml-2">{{ category.description
                        }}</span>
                </div>
            </div>
        </div>
        <div v-if="selectedCategories.length > 0" class="mt-2">
            <span v-for="cat in selectedCategories" :key="cat._id"
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {{ cat.name }}
                <button @click="removeCategory(cat)" class="ml-1 text-red-500">&times;</button>
            </span>
        </div>
        <button @click="showNewCategoryModal = true"
            class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Create New Category
        </button>
    </div>

    <!-- Modal for creating new category -->
    <div v-if="showNewCategoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 class="text-lg font-bold mb-4">Create New Category</h3>
            <input v-model="newCategory.name"
                class="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" placeholder="Category Name">
            <input v-model="newCategory.description"
                class="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" placeholder="Category Description">
            <button @click="createNewCategory"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create</button>
            <button @click="showNewCategoryModal = false"
                class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    props: {
        categories: {
            type: Array,
            required: true
        }
    },
    emits: ['update:category'],
    setup(props, { emit }) {
        const categorySearch = ref('');
        const selectedCategories = ref([]);
        const showNewCategoryModal = ref(false);
        const newCategory = ref({ name: '', description: '' });

        const filteredCategories = computed(() => {
            if (categorySearch.value === '') return props.categories;
            return props.categories.filter(category =>
                category.name.toLowerCase().includes(categorySearch.value.toLowerCase())
            );
        });

        const searchCategories = () => {
            // This function can be expanded if you want to fetch categories from an API based on search
        };

        const selectCategory = (category) => {
            if (!selectedCategories.value.some(cat => cat._id === category._id)) {
                selectedCategories.value.push(category);
                emit('update:category', selectedCategories.value.map(cat => cat._id));
            }
            categorySearch.value = '';
        };

        const removeCategory = (category) => {
            selectedCategories.value = selectedCategories.value.filter(cat => cat._id !== category._id);
            emit('update:category', selectedCategories.value.map(cat => cat._id));
        };

        const createNewCategory = async () => {
            // Here you would typically make an API call to create the new category
            // For now, we'll just add it to the local list
            const newCategoryId = Date.now().toString(); // This is a placeholder. In reality, the ID would come from your backend
            const createdCategory = {
                _id: newCategoryId,
                name: newCategory.value.name,
                description: newCategory.value.description
            };
            props.categories.push(createdCategory);
            selectCategory(createdCategory);
            showNewCategoryModal.value = false;
            newCategory.value = { name: '', description: '' };
        };

        return {
            categorySearch,
            filteredCategories,
            selectedCategories,
            showNewCategoryModal,
            newCategory,
            searchCategories,
            selectCategory,
            removeCategory,
            createNewCategory
        };
    }
};
</script>

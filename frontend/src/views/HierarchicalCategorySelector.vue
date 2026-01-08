<template>
    <div class="category-selector mb-4">
        <div v-for="(level, index) in categoryLevels" :key="index" class="mb-2">
            <!-- Updated label styling to match parent -->
            <label :for="`category-level-${index}`" class="text-sm font-medium text-gray-700 mb-2 block">
                {{ getCategoryLevelLabel(index) }}
            </label>
            <!-- Updated select styling to match parent's input style -->
            <div
                class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <select :id="`category-level-${index}`" v-model="selectedCategories[index]"
                    @change="updateCategories(index)"
                    class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none appearance-none">
                    <option value="">Select {{ getCategoryLevelLabel(index) }}</option>
                    <option v-for="category in availableCategories(index)" :key="category._id" :value="category">
                        {{ category.name }}
                    </option>
                </select>
                <!-- Added ChevronDown icon for consistency -->
                <div class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none">
                    <ChevronDown class="w-5 h-5" />
                </div>
            </div>
        </div>
        <!-- Updated selected category display styling -->
        <div v-if="selectedCategories.length > 0" class="mt-4">
            <p class="text-sm font-medium text-gray-700">Selected Category:</p>
            <p class="text-sm text-gray-600 mt-1">{{ getFullCategoryPath() }}</p>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

export default {
    name: 'HierarchicalCategorySelector',
    components: {
        ChevronDown,
    },
    props: {
        categories: {
            type: Array,
            required: true,
            default: () => []
        },
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:selectedCategories', 'update:modelValue'],
    setup(props, { emit }) {
        const selectedCategories = ref([]);

        // computed property to get the number of category levels
        const categoryLevels = computed(() => {
            return selectedCategories.value.length + 1 <= 3 ? selectedCategories.value.length + 1 : 3;
        });

        // function to get available categories based on the selected level
        const availableCategories = (level) => {
            if (level === 0) {
                return props.categories;
            } else if (selectedCategories.value[level - 1]) {
                return selectedCategories.value[level - 1].children || [];
            }
            return [];
        };

        // function to update the selected categories
        const updateCategories = (index) => {
            selectedCategories.value = selectedCategories.value.slice(0, index + 1);
            emit('update:selectedCategories', selectedCategories.value);

            // Also emit the ID of the last selected category
            const lastCategory = selectedCategories.value[selectedCategories.value.length - 1];
            if (lastCategory) {
                emit('update:modelValue', lastCategory._id);
            }
        };

        // function to get the category level label
        const getCategoryLevelLabel = (index) => {
            const labels = ['Main Category', 'Subcategory', 'Product Category'];
            return labels[index] || `Category Level ${index + 1}`;
        };

        // function to get the full category path
        const getFullCategoryPath = () => {
            return selectedCategories.value.map(cat => cat.name).join(' > ');
        };

        // function to find the category path
        const findCategoryPath = (categories, targetId, path = []) => {
            for (const category of categories) {
                if (category._id === targetId) {
                    return [...path, category];
                }
                if (category.children && category.children.length > 0) {
                    const subPath = findCategoryPath(category.children, targetId, [...path, category]);
                    if (subPath) return subPath;
                }
            }
            return null;
        };

        // method to initialize categories
        const initializeCategories = (categoryId) => {
            if (categoryId && props.categories.length > 0) {
                const path = findCategoryPath(props.categories, categoryId, []);
                if (path) {
                    selectedCategories.value = path;
                    emit('update:selectedCategories', path);
                }
            }
        };

        // watch for changes in the categories and model value
        watch(() => props.categories, (newCategories) => {
            if (newCategories.length > 0 && props.modelValue) {
                initializeCategories(props.modelValue);
            }
        }, { immediate: true });

        // watch for changes in the categories
        watch(selectedCategories, (newValue) => {
            emit('update:selectedCategories', newValue);
        }, { deep: true });

        return {
            selectedCategories,
            categoryLevels,
            availableCategories,
            updateCategories,
            getCategoryLevelLabel,
            getFullCategoryPath,
            initializeCategories
        };
    }
};
</script>

<style scoped>
/* Add any custom styles needed */
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

/* Optionally add a custom style for focused state */
select:focus {
    outline: none;
}
</style>
<!-- // frontend/src/views/admin/components/CategoryTreeItem.vue -->
<template>
    <div class="category-tree-item">
        <div class="flex items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
            :class="{ 'bg-blue-50': isSelected }" @click="$emit('select', category)">

            <button v-if="hasChildren" @click.stop="toggleExpand" class="mr-2 w-4 h-4 flex items-center justify-center">
                <ChevronRight v-if="!expanded" class="w-4 h-4" />
                <ChevronDown v-else class="w-4 h-4" />
            </button>
            <span v-else class="mr-6"></span>

            <div class="flex-1">
                <span class="font-medium">{{ category.name }}</span>
                <span class="text-sm text-gray-500 ml-2">
                    ({{ getSubcategoriesCount }} items)
                </span>
            </div>

            <span v-if="!category.active" class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                Inactive
            </span>
        </div>

        <!-- Subcategories -->
        <div v-if="hasChildren && expanded" class="ml-4">
            <CategoryTreeItem v-for="subcategory in subcategories" :key="subcategory._id" :category="subcategory"
                :all-categories="allCategories" :selected-id="selectedId" @select="$emit('select', $event)" />
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { ChevronRight, ChevronDown } from 'lucide-vue-next';

export default {
    name: 'CategoryTreeItem',

    components: {
        ChevronRight,
        ChevronDown
    },

    props: {
        category: {
            type: Object,
            required: true
        },
        allCategories: {
            type: Array,
            required: true
        },
        selectedId: {
            type: String,
            default: null
        }
    },

    emits: ['select'],

    setup(props) {
        const expanded = ref(false);

        const subcategories = computed(() => {
            return props.allCategories.filter(cat => cat.parent === props.category._id);
        });

        const hasChildren = computed(() => {
            return subcategories.value.length > 0;
        });

        const isSelected = computed(() => {
            return props.selectedId === props.category._id;
        });

        const getSubcategoriesCount = computed(() => {
            const directChildren = subcategories.value.length;
            const allDescendants = subcategories.value.reduce((count, subcat) => {
                const descendantCount = props.allCategories.filter(c =>
                    c.parent === subcat._id
                ).length;
                return count + descendantCount;
            }, directChildren);
            return allDescendants;
        });

        const toggleExpand = () => {
            expanded.value = !expanded.value;
        };

        // Watch for when category becomes selected and expand its parents
        watch(() => props.selectedId, (newVal) => {
            if (newVal && props.category._id === newVal) {
                expanded.value = true;
            }
        });

        return {
            expanded,
            subcategories,
            hasChildren,
            isSelected,
            getSubcategoriesCount,
            toggleExpand
        };
    }
};
</script>
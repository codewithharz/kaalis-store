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

            <div class="flex-1 min-w-0">
                <span class="font-medium truncate">{{ displayName }}</span>
                <span class="text-sm text-gray-500 ml-2">
                    {{ t('adminCategoryTree.itemsCount', { count: getSubcategoriesCount }) }}
                </span>
            </div>

            <span v-if="category.active === false" class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full ml-1 shrink-0">
                {{ t('adminCategoryTree.inactive') }}
            </span>
        </div>

        <!-- Subcategories -->
        <div v-if="hasChildren && expanded" class="ml-4">
            <CategoryTreeItem v-for="subcategory in subcategories" :key="subcategory._id" :category="subcategory"
                :all-categories="allCategories" :selected-id="selectedId" :locale="locale" @select="$emit('select', $event)" />
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
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
        },
        locale: {
            type: String,
            default: 'en'
        }
    },

    emits: ['select'],

    setup(props) {
        const { t } = useI18n();
        const expanded = ref(false);

        // Display the category name based on the active locale
        const displayName = computed(() => {
            if (props.locale === 'fr' && props.category.translations?.fr?.name) {
                return props.category.translations.fr.name;
            }
            return props.category.name || '';
        });

        const subcategories = computed(() => {
            return props.allCategories.filter(cat => String(cat.parent) === String(props.category._id));
        });

        const hasChildren = computed(() => {
            return subcategories.value.length > 0;
        });

        const isSelected = computed(() => {
            return String(props.selectedId) === String(props.category._id);
        });

        const getSubcategoriesCount = computed(() => {
            const directChildren = subcategories.value.length;
            const allDescendants = subcategories.value.reduce((count, subcat) => {
                const descendantCount = props.allCategories.filter(c =>
                    String(c.parent) === String(subcat._id)
                ).length;
                return count + descendantCount;
            }, directChildren);
            return allDescendants;
        });

        const toggleExpand = () => {
            expanded.value = !expanded.value;
        };

        // Watch for when category becomes selected and expand it
        watch(() => props.selectedId, (newVal) => {
            if (newVal && String(props.category._id) === String(newVal)) {
                expanded.value = true;
            }
        });

        return {
            expanded,
            displayName,
            subcategories,
            hasChildren,
            isSelected,
            getSubcategoriesCount,
            toggleExpand,
            t
        };
    }
};
</script>

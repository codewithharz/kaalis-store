<!-- // frontend/src/views/admin/AdminCategories.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="flex justify-between items-center mb-3 px-8 py-4 bg-white">
            <h2 class="text-2xl font-bold text-gray-800">{{ t('adminCategories.title') }}</h2>
            <button @click="openAddModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {{ t('adminCategories.addNewCategory') }}
            </button>
        </div>

        <!-- Category Tree and Details -->
        <div class="grid grid-cols-12 gap-6">
            <!-- Category Tree -->
            <div class="col-span-4 bg-white rounded-lg shadow-sm p-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">{{ t('adminCategories.categories') }}</h3>
                    <button @click="expandAll" class="text-blue-600 hover:text-blue-800 text-sm">
                        {{ allExpanded ? t('adminCategories.collapseAll') : t('adminCategories.expandAll') }}
                    </button>
                </div>

                <!-- Search Categories -->
                <div class="mb-4">
                    <input type="text" v-model="searchQuery" :placeholder="t('adminCategories.searchPlaceholder')"
                        class="w-full p-2 border rounded-md" @input="handleSearch">
                </div>

                <!-- Category Tree View -->
                <div class="overflow-y-auto max-h-[600px]">
                    <div v-if="loading" class="flex justify-center py-4">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>

                    <div v-else-if="rootFilteredCategories.length === 0" class="text-center py-4 text-gray-500">
                        {{ t('adminCategories.noCategoriesFound') }}
                    </div>

                    <div v-else class="space-y-2">
                        <template v-for="category in rootFilteredCategories" :key="category._id">
                            <div class="category-item"
                                :class="{ 'border-blue-500': selectedCategory?._id === category._id }">
                                <CategoryTreeItem :category="category" :all-categories="filteredCategories"
                                    :selected-id="selectedCategory?._id" :locale="locale" @select="selectCategory" />
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
                                {{ getCategoryDisplayName(selectedCategory) }}
                            </h3>
                            <p v-if="locale === 'fr' && selectedCategory.name" class="text-sm text-gray-400 italic">
                                EN: {{ selectedCategory.name }}
                            </p>
                            <!-- Breadcrumb path -->
                            <p class="text-sm text-gray-400 mt-1">
                                {{ getCategoryPath(selectedCategory) }}
                            </p>
                            <p class="text-sm text-gray-500 mt-1">
                                {{ t('adminCategories.createdOn', { date: formatDate(selectedCategory.createdAt) }) }}
                            </p>
                        </div>
                        <div class="space-x-2">
                            <button @click="editCategory(selectedCategory)"
                                class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                                {{ t('adminCategories.edit') }}
                            </button>
                            <button @click="confirmDelete(selectedCategory)"
                                class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                                {{ t('adminCategories.delete') }}
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">{{ t('adminCategories.description') }}</h4>
                            <p class="text-gray-600">
                                {{ getCategoryDisplayDescription(selectedCategory) || t('adminCategories.noDescription') }}
                            </p>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">{{ t('adminCategories.parentCategory') }}</h4>
                            <p class="text-gray-600">
                                {{ getParentName(selectedCategory) }}
                            </p>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">{{ t('adminCategories.status') }}</h4>
                            <span :class="[
                                'px-2 py-1 text-sm rounded-full',
                                selectedCategory.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            ]">
                                {{ selectedCategory.active !== false ? t('adminCategories.active') : t('adminCategories.inactive') }}
                            </span>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">{{ t('adminCategories.productsCount') }}</h4>
                            <p class="text-gray-600 font-semibold">
                                {{ t('adminCategories.productsCountValue', { count: selectedCategory.productsCount || 0 }) }}
                            </p>
                        </div>
                    </div>

                    <!-- Subcategories -->
                    <div class="mt-6" v-if="getSubcategories(selectedCategory._id).length > 0">
                        <h4 class="font-medium text-gray-700 mb-2">{{ t('adminCategories.subcategories') }}</h4>
                        <div class="grid grid-cols-3 gap-3">
                            <div v-for="subcategory in getSubcategories(selectedCategory._id)" :key="subcategory._id"
                                class="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
                                @click="selectCategory(subcategory)">
                                <p class="font-medium text-sm">{{ getCategoryDisplayName(subcategory) }}</p>
                                <p class="text-xs text-gray-500 mt-0.5">
                                    {{ t('adminCategories.productsCountValue', { count: subcategory.productsCount || 0 }) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- French Translation Info -->
                    <div v-if="selectedCategory.translations?.fr?.name" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 class="font-medium text-blue-700 mb-2">🇫🇷 Traduction</h4>
                        <p class="text-blue-800 font-medium">{{ selectedCategory.translations.fr.name }}</p>
                        <p v-if="selectedCategory.translations?.fr?.description" class="text-blue-700 text-sm mt-1">
                            {{ selectedCategory.translations.fr.description }}
                        </p>
                    </div>
                </div>

                <!-- No Selection State -->
                <div v-else class="bg-white rounded-lg shadow-sm p-6 text-center">
                    <div class="text-gray-400">
                        <FolderOpen class="w-12 h-12 mx-auto mb-4" />
                        <p>{{ t('adminCategories.selectCategoryPrompt') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Category Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-1">
                    {{ editingCategory ? t('adminCategories.editCategory') : t('adminCategories.addNewCategory') }}
                </h3>

                <!-- 3-Level Placement Section -->
                <div class="mb-5">
                    <p class="text-xs text-gray-500 mb-3">{{ t('adminCategories.placementLabel') }}</p>

                    <!-- Visual path display -->
                    <div class="flex items-center gap-1 text-sm mb-3 flex-wrap">
                        <span class="px-2 py-1 rounded text-xs font-medium"
                            :class="!selectedRootId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'">
                            {{ t('adminCategories.levelRoot') }}
                        </span>
                        <span class="text-gray-400">›</span>
                        <span class="px-2 py-1 rounded text-xs font-medium"
                            :class="selectedRootId && !selectedSubId ? 'bg-blue-600 text-white' : (selectedRootId ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-300')">
                            {{ t('adminCategories.levelSub') }}
                        </span>
                        <span class="text-gray-400">›</span>
                        <span class="px-2 py-1 rounded text-xs font-medium"
                            :class="selectedRootId && selectedSubId ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-300'">
                            {{ t('adminCategories.levelSubSub') }}
                        </span>
                    </div>

                    <!-- Step 1: Root category -->
                    <div class="mb-2">
                        <label class="block text-xs font-medium text-gray-500 mb-1">
                            {{ t('adminCategories.step1Label') }}
                        </label>
                        <select v-model="selectedRootId" @change="onRootChange"
                            class="block w-full border rounded-md shadow-sm p-2 text-sm">
                            <option value="">{{ t('adminCategories.newRootCategory') }}</option>
                            <option v-for="cat in rootCategories" :key="cat._id" :value="cat._id">
                                {{ getCategoryDisplayName(cat) }}
                            </option>
                        </select>
                    </div>

                    <!-- Step 2: Sub-category (visible when root is chosen) -->
                    <div v-if="selectedRootId" class="mb-2 ml-4 border-l-2 border-blue-200 pl-3">
                        <label class="block text-xs font-medium text-gray-500 mb-1">
                            {{ t('adminCategories.step2Label') }}
                        </label>
                        <select v-model="selectedSubId" @change="onSubChange"
                            class="block w-full border rounded-md shadow-sm p-2 text-sm">
                            <option value="">{{ t('adminCategories.newSubUnder', { name: getCategoryDisplayName(getRootById(selectedRootId)) }) }}</option>
                            <option v-for="cat in subCategoriesOf(selectedRootId)" :key="cat._id" :value="cat._id">
                                {{ getCategoryDisplayName(cat) }}
                            </option>
                        </select>
                    </div>

                    <!-- Step 3: Sub-sub-category (visible when sub is chosen) -->
                    <div v-if="selectedRootId && selectedSubId" class="mb-2 ml-8 border-l-2 border-blue-200 pl-3">
                        <label class="block text-xs font-medium text-gray-500 mb-1">
                            {{ t('adminCategories.step3Label') }}
                        </label>
                        <select v-model="selectedSubSubId"
                            class="block w-full border rounded-md shadow-sm p-2 text-sm">
                            <option value="">{{ t('adminCategories.newSubSubUnder', { name: getCategoryDisplayName(getSubById(selectedSubId)) }) }}</option>
                            <option v-for="cat in subCategoriesOf(selectedSubId)" :key="cat._id" :value="cat._id">
                                {{ getCategoryDisplayName(cat) }}
                            </option>
                        </select>
                    </div>

                    <!-- Resolved placement summary -->
                    <div class="mt-3 px-3 py-2 bg-gray-50 rounded text-xs text-gray-600">
                        📍 {{ placementSummary }}
                    </div>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- English Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">{{ t('adminCategories.name') }}</label>
                        <input type="text" v-model="formData.name"
                            class="mt-1 block w-full border rounded-md shadow-sm p-2" required>
                    </div>

                    <!-- English Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">{{ t('adminCategories.description') }}</label>
                        <textarea v-model="formData.description"
                            class="mt-1 block w-full border rounded-md shadow-sm p-2" rows="2"></textarea>
                    </div>

                    <!-- Active toggle -->
                    <div class="flex items-center">
                        <input type="checkbox" id="active" v-model="formData.active"
                            class="h-4 w-4 text-blue-600 rounded">
                        <label for="active" class="ml-2 block text-sm text-gray-900">
                            {{ t('adminCategories.active') }}
                        </label>
                    </div>

                    <!-- French Translations Section -->
                    <div class="border-t pt-4">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">🇫🇷 {{ t('adminCategories.translationsSection') }}</h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">{{ t('adminCategories.frenchName') }}</label>
                                <input type="text" v-model="formData.frName"
                                    class="mt-1 block w-full border rounded-md shadow-sm p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">{{ t('adminCategories.frenchDescription') }}</label>
                                <textarea v-model="formData.frDescription"
                                    class="mt-1 block w-full border rounded-md shadow-sm p-2" rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            {{ t('adminCategories.cancel') }}
                        </button>
                        <button type="submit" :disabled="saving"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60">
                            {{ saving ? '...' : (editingCategory ? t('adminCategories.update') : t('adminCategories.create')) }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('adminCategories.confirmDelete') }}</h3>
                <p class="text-gray-500 mb-4">
                    {{ t('adminCategories.deletePrompt', { name: getCategoryDisplayName(categoryToDelete) || '' }) }}
                    <span v-if="getSubcategories(categoryToDelete?._id).length > 0" class="block mt-2 text-red-500 text-sm font-medium">
                        ⚠ {{ t('adminCategories.deleteHasSubcategoriesError') }}
                    </span>
                </p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        {{ t('adminCategories.cancel') }}
                    </button>
                    <button @click="deleteCategory"
                        :disabled="getSubcategories(categoryToDelete?._id).length > 0"
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ t('adminCategories.delete') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { FolderOpen } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import CategoryTreeItem from './components/CategoryTreeItem.vue';
import apiClient from '@/api/axios';
import _ from 'lodash';

export default {
    name: 'AdminCategories',
    components: { CategoryTreeItem, FolderOpen },

    setup() {
        const { t, locale } = useI18n();
        const categories = ref([]);
        const selectedCategory = ref(null);
        const editingCategory = ref(null);
        const showAddModal = ref(false);
        const showDeleteModal = ref(false);
        const categoryToDelete = ref(null);
        const loading = ref(false);
        const saving = ref(false);
        const allExpanded = ref(false);
        const searchQuery = ref('');

        // 3-level placement state
        const selectedRootId = ref('');
        const selectedSubId = ref('');
        const selectedSubSubId = ref('');

        const formData = ref({
            name: '',
            description: '',
            active: true,
            frName: '',
            frDescription: '',
        });

        // ─── Locale helpers ─────────────────────────────────────────────
        const getCategoryDisplayName = (category) => {
            if (!category) return '';
            if (locale.value === 'fr' && category.translations?.fr?.name) {
                return category.translations.fr.name;
            }
            return category.name || '';
        };

        const getCategoryDisplayDescription = (category) => {
            if (!category) return '';
            if (locale.value === 'fr' && category.translations?.fr?.description) {
                return category.translations.fr.description;
            }
            return category.description || '';
        };

        const getCategoryPath = (category) => {
            if (!category) return '';
            const parts = [];
            let current = category;
            while (current) {
                parts.unshift(getCategoryDisplayName(current));
                if (!current.parent) break;
                current = categories.value.find(c => String(c._id) === String(current.parent));
            }
            return parts.join(' › ');
        };

        // ─── Hierarchy helpers ───────────────────────────────────────────
        const rootCategories = computed(() =>
            categories.value.filter(c => !c.parent)
        );

        const subCategoriesOf = (parentId) =>
            categories.value.filter(c => String(c.parent) === String(parentId));

        const getRootById = (id) => categories.value.find(c => String(c._id) === String(id));
        const getSubById = (id) => categories.value.find(c => String(c._id) === String(id));

        // Resolved parent from the 3-level selector
        const resolvedParentId = computed(() => {
            if (selectedSubSubId.value) return selectedSubSubId.value;
            if (selectedSubId.value) return selectedSubId.value;
            if (selectedRootId.value) return selectedRootId.value;
            return null;
        });

        const placementSummary = computed(() => {
            if (!selectedRootId.value) return t('adminCategories.placementRootLevel');
            const root = getRootById(selectedRootId.value);
            const rootName = getCategoryDisplayName(root);
            if (!selectedSubId.value) return t('adminCategories.placementUnder', { parent: rootName });
            const sub = getSubById(selectedSubId.value);
            const subName = getCategoryDisplayName(sub);
            if (!selectedSubSubId.value) return t('adminCategories.placementUnder', { parent: `${rootName} › ${subName}` });
            const subsub = getSubById(selectedSubSubId.value);
            return t('adminCategories.placementUnder', { parent: `${rootName} › ${subName} › ${getCategoryDisplayName(subsub)}` });
        });

        // Cascade reset handlers
        const onRootChange = () => {
            selectedSubId.value = '';
            selectedSubSubId.value = '';
        };
        const onSubChange = () => {
            selectedSubSubId.value = '';
        };

        // ─── Fetch ───────────────────────────────────────────────────────
        const fetchCategories = async () => {
            loading.value = true;
            try {
                const { data } = await apiClient.get('/admin/categories');
                categories.value = data;
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error(t('adminCategories.toasts.fetchFailed'));
            } finally {
                loading.value = false;
            }
        };

        // ─── Computed tree / search ──────────────────────────────────────
        const filteredCategories = computed(() => {
            if (!searchQuery.value) return categories.value;
            const q = searchQuery.value.toLowerCase();
            // When searching, include matching items + their ancestors so tree is complete
            const matched = new Set();
            categories.value.forEach(cat => {
                const matchEn = cat.name?.toLowerCase().includes(q);
                const matchFr = cat.translations?.fr?.name?.toLowerCase().includes(q);
                if (matchEn || matchFr) {
                    matched.add(String(cat._id));
                    // Add ancestors so the tree renders properly
                    (cat.ancestors || []).forEach(aid => matched.add(String(aid)));
                    if (cat.parent) matched.add(String(cat.parent));
                }
            });
            return categories.value.filter(c => matched.has(String(c._id)));
        });

        const rootFilteredCategories = computed(() =>
            filteredCategories.value.filter(c => !c.parent)
        );

        // ─── Actions ─────────────────────────────────────────────────────
        const getParentName = (category) => {
            if (!category?.parent) return t('adminCategories.noneTopLevel');
            const parent = categories.value.find(c => String(c._id) === String(category.parent));
            return parent ? getCategoryDisplayName(parent) : t('adminCategories.unknown');
        };

        const getSubcategories = (parentId) => {
            if (!parentId) return [];
            return categories.value.filter(cat => String(cat.parent) === String(parentId));
        };

        const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        const openAddModal = () => {
            editingCategory.value = null;
            selectedRootId.value = '';
            selectedSubId.value = '';
            selectedSubSubId.value = '';
            formData.value = { name: '', description: '', active: true, frName: '', frDescription: '' };
            showAddModal.value = true;
        };

        const editCategory = (category) => {
            editingCategory.value = category;

            // Pre-populate the 3-level selector based on ancestors
            const ancestors = category.ancestors || [];
            selectedRootId.value = ancestors[0] ? String(ancestors[0]) : (category.parent && category.level === 1 ? String(category.parent) : '');
            selectedSubId.value = ancestors[1] ? String(ancestors[1]) : (category.parent && category.level === 2 ? String(category.parent) : '');
            selectedSubSubId.value = category.parent && category.level === 3 ? String(category.parent) : '';

            // If editing a level-0 root category: clear all
            if (!category.parent) {
                selectedRootId.value = '';
                selectedSubId.value = '';
                selectedSubSubId.value = '';
            }

            formData.value = {
                name: category.name || '',
                description: category.description || '',
                active: category.active !== false,
                frName: category.translations?.fr?.name || '',
                frDescription: category.translations?.fr?.description || '',
            };
            showAddModal.value = true;
        };

        const selectCategory = (category) => {
            selectedCategory.value = category;
        };

        const handleSubmit = async () => {
            saving.value = true;
            try {
                const translations = {};
                if (formData.value.frName || formData.value.frDescription) {
                    translations.fr = {};
                    if (formData.value.frName) translations.fr.name = formData.value.frName;
                    if (formData.value.frDescription) translations.fr.description = formData.value.frDescription;
                }

                const payload = {
                    name: formData.value.name,
                    description: formData.value.description,
                    parent: resolvedParentId.value || null,
                    active: formData.value.active,
                    ...(Object.keys(translations).length ? { translations } : {}),
                };

                if (editingCategory.value) {
                    await apiClient.put(`/admin/categories/${editingCategory.value._id}`, payload);
                    toast.success(t('adminCategories.toasts.updated'));
                } else {
                    await apiClient.post('/admin/categories', payload);
                    toast.success(t('adminCategories.toasts.created'));
                }
                closeModal();
                await fetchCategories();
            } catch (error) {
                console.error('Error saving category:', error);
                const serverMsg = error.response?.data?.message;
                toast.error(serverMsg || t('adminCategories.toasts.saveFailed'));
            } finally {
                saving.value = false;
            }
        };

        const confirmDelete = (category) => {
            categoryToDelete.value = category;
            showDeleteModal.value = true;
        };

        const deleteCategory = async () => {
            try {
                await apiClient.delete(`/admin/categories/${categoryToDelete.value._id}`);
                toast.success(t('adminCategories.toasts.deleted'));
                if (selectedCategory.value?._id === categoryToDelete.value._id) {
                    selectedCategory.value = null;
                }
                showDeleteModal.value = false;
                categoryToDelete.value = null;
                await fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                const serverMsg = error.response?.data?.message || '';
                if (serverMsg.includes('subcategor')) {
                    toast.error(t('adminCategories.toasts.deleteHasSubcategories'));
                } else if (serverMsg.includes('product')) {
                    toast.error(t('adminCategories.toasts.deleteHasProducts'));
                } else {
                    toast.error(t('adminCategories.toasts.deleteFailed'));
                }
            }
        };

        const closeModal = () => {
            showAddModal.value = false;
            editingCategory.value = null;
            selectedRootId.value = '';
            selectedSubId.value = '';
            selectedSubSubId.value = '';
            formData.value = { name: '', description: '', active: true, frName: '', frDescription: '' };
        };

        const handleSearch = _.debounce(() => {
            selectedCategory.value = null;
        }, 300);

        const expandAll = () => { allExpanded.value = !allExpanded.value; };

        onMounted(fetchCategories);

        return {
            categories,
            selectedCategory,
            editingCategory,
            showAddModal,
            showDeleteModal,
            categoryToDelete,
            formData,
            loading,
            saving,
            searchQuery,
            allExpanded,
            locale,
            filteredCategories,
            rootFilteredCategories,
            rootCategories,
            selectedRootId,
            selectedSubId,
            selectedSubSubId,
            resolvedParentId,
            placementSummary,
            onRootChange,
            onSubChange,
            subCategoriesOf,
            getRootById,
            getSubById,
            handleSubmit,
            selectCategory,
            editCategory,
            openAddModal,
            confirmDelete,
            deleteCategory,
            closeModal,
            handleSearch,
            expandAll,
            getParentName,
            getSubcategories,
            getCategoryDisplayName,
            getCategoryDisplayDescription,
            getCategoryPath,
            formatDate,
            t
        };
    }
};
</script>

<style scoped>
.category-item {
    @apply border-l-4 border-transparent pl-2;
}
</style>

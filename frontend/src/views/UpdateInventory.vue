<template>
    <div class="p-6 sm:p-8 space-y-6 bg-slate-50/10">
        
        <!-- Search and Category Select Panel -->
        <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <!-- Category Selection -->
            <div class="flex-1 relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                <FolderTree class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select v-model="selectedCategory"
                    class="w-full bg-transparent px-4 py-3 pl-11 pr-10 text-slate-700 focus:outline-none text-sm appearance-none cursor-pointer"
                >
                    <option value="">{{ t('updateInventoryPage.selectCategory') }}</option>
                    <option v-for="category in vendorCategories" :key="category._id" :value="category._id">
                        {{ category.displayName || category.name }}
                    </option>
                </select>
                <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            <!-- Product Search -->
            <div class="flex-1 relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input v-model="searchTerm" :placeholder="t('updateInventoryPage.searchProducts')"
                    class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm"
                     />
            </div>

            <!-- Apply Filters Button -->
            <button @click="applyFilters"
                class="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2">
                <Search class="w-4 h-4" />
                {{ t('updateInventoryPage.applyFilters') }}
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff934b] mb-4"></div>
            <p class="text-sm font-semibold text-slate-500">{{ t('updateInventoryPage.loadingProducts', 'Loading inventory...') }}</p>
        </div>

        <!-- No Products at All Empty State -->
        <div v-else-if="products.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <Package class="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h4 class="text-lg font-bold text-slate-800 mb-2">{{ t('updateInventoryPage.noProductsTitle', 'No Products Found') }}</h4>
            <p class="text-sm text-slate-500 max-w-sm mx-auto mb-6">{{ t('updateInventoryPage.noProductsDescription', 'You do not have any products listed in your store yet. Add your first product to manage it here.') }}</p>
            <button @click="router.push('/profile/add-product'); emit('close');"
                class="px-5 py-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2 mx-auto">
                <PlusCircle class="w-4 h-4" />
                <span>{{ t('userProductsPage.addProduct') }}</span>
            </button>
        </div>

        <!-- Filtered Out Empty State -->
        <div v-else-if="filteredProducts.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <Package class="w-14 h-14 text-slate-300 mx-auto mb-3" />
            <p class="text-sm font-semibold text-slate-500">{{ t('updateInventoryPage.noMatchingProducts', 'No products match your search or selected category.') }}</p>
        </div>

        <!-- Product Table Card -->
        <div v-else class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="min-w-full divide-y divide-slate-100">
                    <thead class="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-100">
                        <tr>
                            <th class="px-5 py-4 text-left">
                                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"
                                    class="rounded border-slate-300 text-[#ff934b] focus:ring-[#ff934b]/30 h-4 w-4 transition duration-200" />
                            </th>
                            <th class="px-5 py-4 text-left uppercase tracking-wider">{{ t('updateInventoryPage.columns.product') }}</th>
                            <th class="px-5 py-4 text-left uppercase tracking-wider">{{ t('updateInventoryPage.columns.variants') }}</th>
                            <th class="px-5 py-4 text-left uppercase tracking-wider">{{ t('updateInventoryPage.columns.price') }}</th>
                            <th class="px-5 py-4 text-left uppercase tracking-wider">{{ t('updateInventoryPage.columns.originalPrice') }}</th>
                            <th class="px-5 py-4 text-left uppercase tracking-wider">{{ t('updateInventoryPage.columns.stock') }}</th>
                            <th class="px-5 py-4 text-left uppercase tracking-wider">{{ t('updateInventoryPage.columns.discount') }}</th>
                            <th class="px-5 py-4 text-left uppercase tracking-wider">{{ t('updateInventoryPage.columns.visible', 'Visible') }}</th>
                            <th class="px-5 py-4 text-right uppercase tracking-wider">{{ t('updateInventoryPage.columns.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <template v-for="product in filteredProducts" :key="product._id">
                            <tr :class="[
                                'transition-colors duration-200',
                                expandedProducts.includes(product._id) ? 'bg-[#ff934b]/5' : 'hover:bg-slate-50/60'
                            ]">
                                <td class="px-5 py-4 whitespace-nowrap">
                                    <input type="checkbox" v-model="selectedProducts" :value="product._id"
                                        class="rounded border-slate-300 text-[#ff934b] focus:ring-[#ff934b]/30 h-4 w-4 transition duration-200" />
                                </td>
                                <td class="px-5 py-4 min-w-[220px]">
                                    <div class="flex items-center gap-2">
                                        <button v-if="product.variants?.length > 0" @click="toggleExpand(product._id)"
                                            class="p-1 hover:bg-slate-100 active:scale-90 rounded-lg transition-all"
                                            type="button"
                                        >
                                            <ChevronDown
                                                :class="['w-4 h-4 text-slate-500 transition-transform duration-300', { 'transform rotate-180 text-[#ff934b]': expandedProducts.includes(product._id) }]" />
                                        </button>
                                        <div class="relative flex-1 rounded-lg border border-slate-200 focus-within:border-[#ff934b] bg-white transition-all">
                                            <input v-model="product.name"
                                                class="w-full px-3 py-1.5 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-medium" />
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                    <div v-if="product.variants?.length > 0" class="flex items-center gap-1.5">
                                        <span class="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full font-semibold">
                                            {{ product.variants.length }} {{ t('updateInventoryPage.columns.variants') }}
                                        </span>
                                    </div>
                                    <span v-else class="text-slate-400 italic text-xs">{{ t('updateInventoryPage.notAvailable', 'No variants') }}</span>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap w-32">
                                    <div class="relative rounded-lg border border-slate-200 focus-within:border-[#ff934b] bg-white transition-all">
                                        <DollarSign class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input v-model.number="product.price" type="number" @input="updateProductDiscount(product)"
                                            class="w-full pl-6 pr-2 py-1.5 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-bold" />
                                    </div>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap w-32">
                                    <div class="relative rounded-lg border border-slate-200 focus-within:border-[#ff934b] bg-white transition-all">
                                        <DollarSign class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input v-model.number="product.originalPrice" type="number" @input="updateProductDiscount(product)"
                                            class="w-full pl-6 pr-2 py-1.5 text-slate-700 bg-transparent border-none focus:outline-none text-sm text-slate-500 font-semibold" />
                                    </div>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap w-28">
                                    <div class="relative rounded-lg border border-slate-200 focus-within:border-[#ff934b] bg-white transition-all"
                                        :class="{ 'opacity-60 bg-slate-50 cursor-not-allowed': product.variants?.length > 0 }">
                                        <input v-model.number="product.stock" type="number" min="0"
                                            class="w-full px-3 py-1.5 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-semibold"
                                            :disabled="product.variants?.length > 0"
                                            :title="product.variants?.length > 0 ? t('updateInventoryPage.stockManagedPerVariant') : ''" />
                                    </div>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap w-24">
                                    <div class="relative rounded-lg border border-slate-200 bg-slate-50 opacity-75 cursor-not-allowed transition-all">
                                        <input v-model.number="product.discount" type="number" min="0" max="100" readonly
                                            class="w-full px-3 py-1.5 text-slate-500 bg-transparent border-none focus:outline-none text-sm font-semibold cursor-not-allowed" />
                                    </div>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap w-24">
                                    <div class="flex items-center">
                                        <button @click="product.isAvailable = !product.isAvailable" 
                                            :class="[
                                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff934b]/20 focus:ring-offset-2',
                                                product.isAvailable ? 'bg-[#ff934b]' : 'bg-slate-200'
                                            ]"
                                            type="button"
                                        >
                                            <span 
                                                :class="[
                                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                                    product.isAvailable ? 'translate-x-5' : 'translate-x-0'
                                                ]"
                                            />
                                        </button>
                                    </div>
                                </td>
                                <td class="px-5 py-4 whitespace-nowrap text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="updateProduct(product)"
                                            class="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-200 flex items-center gap-1"
                                            type="button"
                                        >
                                            <RefreshCw class="w-3.5 h-3.5" />
                                            <span>{{ t('updateInventoryPage.update') }}</span>
                                        </button>
                                        <button @click="editProduct(product)"
                                            class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-200 flex items-center gap-1"
                                            type="button"
                                        >
                                            <Edit class="w-3.5 h-3.5" />
                                            <span>{{ t('updateInventoryPage.edit') }}</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Variants Table Block -->
                            <tr v-if="expandedProducts.includes(product._id)" class="bg-slate-50/30">
                                <td colspan="8" class="px-8 py-5">
                                    <div class="border border-slate-100 rounded-2xl bg-white p-5 shadow-inner space-y-4">
                                        <div class="flex items-center gap-2 pb-2 border-b border-slate-50">
                                            <div class="p-1.5 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                                                <Shirt class="w-4 h-4" />
                                            </div>
                                            <h4 class="font-bold text-sm text-slate-800">
                                                {{ t('updateInventoryPage.variantsFor', { name: product.name }) }}
                                            </h4>
                                        </div>
                                        <div class="overflow-x-auto">
                                            <table class="min-w-full divide-y divide-slate-100">
                                                <thead>
                                                    <tr class="text-slate-400 text-xs font-semibold text-left">
                                                        <th class="px-3 py-2 uppercase tracking-wider">{{ t('updateInventoryPage.columns.attributes') }}</th>
                                                        <th class="px-3 py-2 uppercase tracking-wider">{{ t('updateInventoryPage.columns.color') }}</th>
                                                        <th class="px-3 py-2 uppercase tracking-wider">{{ t('updateInventoryPage.columns.price') }}</th>
                                                        <th class="px-3 py-2 uppercase tracking-wider">{{ t('updateInventoryPage.columns.stock') }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-slate-100">
                                                    <tr v-for="variant in product.variants" :key="variant._id" class="hover:bg-slate-50/40">
                                                        <td class="px-3 py-3 text-xs font-medium text-slate-600">
                                                            <div class="flex flex-wrap gap-1.5">
                                                                <span v-for="attr in variant.attributes" :key="attr.name"
                                                                    class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold">
                                                                    {{ attr.name }}: {{ attr.value }}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td class="px-3 py-3 text-xs flex items-center gap-2">
                                                            <div v-if="variant.color?.hexCode"
                                                                class="w-4 h-4 rounded-full border border-slate-200 shadow-sm"
                                                                :style="{ backgroundColor: variant.color.hexCode }"></div>
                                                            <span class="font-semibold text-slate-700">{{ variant.color?.name || t('updateInventoryPage.notAvailable') }}</span>
                                                        </td>
                                                        <td class="px-3 py-3 w-32">
                                                            <div class="relative rounded-lg border border-slate-200 focus-within:border-[#ff934b] bg-white transition-all">
                                                                <DollarSign class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                                                <input v-model.number="variant.price" type="number"
                                                                    class="w-full pl-5 pr-2 py-1 text-slate-700 bg-transparent border-none focus:outline-none text-xs font-bold" />
                                                            </div>
                                                        </td>
                                                        <td class="px-3 py-3 w-32">
                                                            <div class="relative rounded-lg border border-slate-200 focus-within:border-[#ff934b] bg-white transition-all">
                                                                <input v-model.number="variant.stock" type="number" min="0"
                                                                    @input="syncProductStock(product)"
                                                                    class="w-full px-3 py-1 text-slate-700 bg-transparent border-none focus:outline-none text-xs font-semibold" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Bulk Update Section -->
        <div v-if="products.length > 0" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div class="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                    <Layers class="w-5 h-5" />
                </div>
                <div>
                    <h3 class="text-lg font-bold text-slate-800">{{ t('updateInventoryPage.bulkUpdateTitle') }}</h3>
                    <p class="text-xs text-slate-500">{{ t('updateInventoryPage.bulkUpdateSubtitle', 'Modify stock levels for selected items simultaneously') }}</p>
                </div>
            </div>
            
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <!-- Action dropdown -->
                <div class="relative sm:w-48 rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                    <select v-model="bulkUpdateAction"
                        class="w-full bg-transparent px-4 py-3 pr-10 text-slate-700 focus:outline-none text-sm appearance-none cursor-pointer font-semibold"
                    >
                        <option value="increase">{{ t('updateInventoryPage.bulkActions.increase') }}</option>
                        <option value="decrease">{{ t('updateInventoryPage.bulkActions.decrease') }}</option>
                        <option value="set">{{ t('updateInventoryPage.bulkActions.set') }}</option>
                    </select>
                    <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
                
                <!-- Amount input -->
                <div class="relative sm:w-36 rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                    <input v-model.number="bulkUpdateValue" type="number" min="0"
                        class="w-full px-4 py-3 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-semibold"
                        :placeholder="t('updateInventoryPage.amount')" />
                </div>
                
                <!-- Button -->
                <button @click="applyBulkUpdate"
                    class="px-6 py-3 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2">
                    <Layers class="w-4 h-4" />
                    {{ t('updateInventoryPage.applyBulkUpdate') }}
                </button>
            </div>
        </div>

        <!-- CSV Import/Export -->
        <div v-if="products.length > 0" class="flex flex-col sm:flex-row gap-4 pt-2">
            <button @click="exportCSV"
                class="flex-1 sm:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2"
            >
                <Download class="w-4 h-4" />
                {{ t('updateInventoryPage.exportCsv') }}
            </button>
            
            <label
                class="flex-1 sm:flex-none px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold shadow-sm hover:shadow active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
                <Upload class="w-4 h-4" />
                {{ t('updateInventoryPage.importCsv') }}
                <input type="file" @change="importCSV" accept=".csv" class="hidden" />
            </label>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useProductStore } from '../store/productStore';
import { useUserStore } from '../store/user';
import apiClient from '../api/axios';
import { storeToRefs } from 'pinia';
import { 
    ChevronDown, Shirt, Search, FolderTree, Download, Upload, 
    Boxes, Package, RefreshCw, Edit, Layers, DollarSign, PlusCircle
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

export default {
    name: 'UpdateInventory',
    components: { 
        ChevronDown, Shirt, Search, FolderTree, Download, Upload, 
        Boxes, Package, RefreshCw, Edit, Layers, DollarSign, PlusCircle
    },
    setup(props, { emit }) {
        const { t, locale } = useI18n();
        const router = useRouter();
        const productStore = useProductStore();
        const userStore = useUserStore();
        const { flattenedCategories } = storeToRefs(productStore);

        const selectedCategory = ref('');
        const searchTerm = ref('');
        const products = ref([]);
        const loading = ref(true);
        const selectedProducts = ref([]);
        const selectAll = ref(false);
        const bulkUpdateAction = ref('increase');
        const bulkUpdateValue = ref(0);
        const expandedProducts = ref([]);

        const loadVendorProducts = async () => {
            try {
                loading.value = true;
                const response = await apiClient.get(`/products/${userStore.user._id}/products`, {
                    params: {
                        page: 1,
                        limit: 1000
                    }
                });
                products.value = response.data?.products || [];
            } catch (error) {
                console.error('Error fetching vendor products:', error);
                toast.error(t('updateInventoryPage.toasts.fetchProductsFailed', 'Failed to load products'));
            } finally {
                loading.value = false;
            }
        };

        const vendorCategories = computed(() => {
            const categoriesMap = new Map();
            products.value.forEach(p => {
                const catId = p.category?._id || p.category;
                if (catId) {
                    const found = flattenedCategories.value.find(c => c._id === catId);
                    if (found && !categoriesMap.has(catId)) {
                        categoriesMap.set(catId, found);
                    }
                }
            });
            return Array.from(categoriesMap.values());
        });

        const filteredProducts = computed(() => {
            return products.value.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.value.toLowerCase());
                const catId = product.category?._id || product.category;
                const matchesCategory = !selectedCategory.value || catId === selectedCategory.value;
                return matchesSearch && matchesCategory;
            });
        });

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

        const applyFilters = () => {
            // Live filters are automatic via computed property
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
                const updated = await productStore.updateProduct(product._id, {
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    stock: product.stock,
                    discount: product.discount,
                    variants: product.variants,
                    isAvailable: product.isAvailable
                });
                if (updated) {
                    const idx = products.value.findIndex(p => p._id === product._id);
                    if (idx !== -1) {
                        products.value[idx] = updated;
                    }
                    toast.success(t('updateInventoryPage.toasts.productUpdated'));
                }
            } catch (error) {
                console.error('Error updating product:', error);
                toast.error(t('updateInventoryPage.toasts.productUpdateFailed'));
            }
        };

        const editProduct = (product) => {
            router.push('/account/profile/my-products');
            emit('close');
        };

        const updateProductDiscount = (product) => {
            const originalPrice = Number(product.originalPrice) || 0;
            const price = Number(product.price) || 0;
            if (originalPrice > 0 && originalPrice > price) {
                const discount = ((originalPrice - price) / originalPrice) * 100;
                product.discount = Math.max(0, Math.min(100, Math.round(discount)));
            } else {
                product.discount = 0;
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
                        const updated = await productStore.updateProduct(product._id, { stock: newStock });
                        if (updated) {
                            const idx = products.value.findIndex(p => p._id === productId);
                            if (idx !== -1) {
                                products.value[idx] = updated;
                            }
                        }
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
                        const targetId = id.trim();
                        try {
                            const updated = await productStore.updateProduct(targetId, { stock: parseInt(stock.trim(), 10) });
                            if (updated) {
                                const idx = products.value.findIndex(p => p._id === targetId);
                                if (idx !== -1) {
                                    products.value[idx] = updated;
                                }
                            }
                        } catch (error) {
                            console.error(`Failed to update product ${targetId}:`, error);
                        }
                    }
                }
                toast.success(t('updateInventoryPage.toasts.csvImportCompleted'));
            };
            reader.readAsText(file);
        };

        onMounted(async () => {
            try {
                await productStore.fetchCategories();
                await loadVendorProducts();
            } catch (error) {
                console.error('Error in onMounted:', error);
            }
        });

        return {
            t,
            selectedCategory,
            searchTerm,
            products,
            loading,
            filteredProducts,
            selectedProducts,
            selectAll,
            bulkUpdateAction,
            bulkUpdateValue,
            vendorCategories,
            loadVendorProducts,
            applyFilters,
            formatPrice,
            toggleSelectAll,
            applyBulkUpdate,
            exportCSV,
            importCSV,
            updateProduct,
            editProduct,
            updateProductDiscount,
            expandedProducts,
            toggleExpand,
            syncProductStock,
            Shirt,
            PlusCircle,
            router,
            emit
        };
    }
};
</script>

<style scoped>
/* Custom styled thin scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    height: 6px;
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}

/* Ensure custom styling overrides for number input appearance */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
    -moz-appearance: textfield;
}
</style>

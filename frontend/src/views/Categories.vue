<template>
    <nav class="py-1 sm:py-2 bg-white relative">
        <!-- Mobile Categories Section -->
        <div class="lg:hidden">
            <!-- Mobile category toggle button -->
            <!-- <div class="px-3 sm:px-4 mb-2">
                <button @click="toggleMobileCategoryMenu"
                    class="flex items-center justify-between w-full py-2 px-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 touch-manipulation">
                    <div class="flex items-center space-x-2">
                        <Menu class="w-4 h-4 sm:w-5 sm:h-5" />
                        <span class="font-medium text-sm sm:text-base">Browse Categories</span>
                    </div>
                    <ChevronDown class="w-4 h-4 transition-transform duration-200"
                        :class="{ 'transform rotate-180': isMobileCategoryMenuOpen }" />
                </button>
            </div> -->

            <!-- Mobile categories grid -->
            <!-- <div v-if="isMobileCategoryMenuOpen" class="px-3 sm:px-4 mb-4">
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x divide-y divide-gray-200">
                        <router-link v-for="category in rootCategories.slice(0, 12)" :key="category._id"
                            :to="`/category/${category.slug}`" @click="closeMobileCategoryMenu"
                            class="p-3 sm:p-4 text-center hover:bg-gray-50 transition-colors duration-200 touch-manipulation">
                            <div class="text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">
                                {{ category.name }}
                            </div>
                        </router-link>
                    </div> -->

            <!-- View all categories button -->
            <!-- <div v-if="rootCategories.length > 12" class="border-t border-gray-200 p-3">
                        <button @click="showAllMobileCategories"
                            class="w-full py-2 text-sm font-medium text-[#24a6bb] hover:text-[#1f8f9e] transition-colors duration-200">
                            View All Categories ({{ rootCategories.length }})
                        </button>
                    </div> -->
            <!-- </div>
            </div> -->

            <!-- Mobile horizontal scroll categories -->
            <div class="px-3 sm:px-4">
                <div class="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                    <!-- <router-link v-for="category in rootCategories.slice(0, 8)" :key="category._id" -->
                    <router-link v-for="category in rootCategories.slice(7, 16)" :key="category._id"
                        :to="`/category/${category.slug}`"
                        class="flex-shrink-0 px-3 py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-[#24a6bb] hover:text-white transition-colors duration-200 whitespace-nowrap">
                        {{ category.name }}
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Desktop Categories Section -->
        <div class="hidden lg:block">
            <!-- Horizontal category list -->
            <div class="flex items-center mb-2 overflow-x-auto category-menu max-w-7xl mx-auto px-4">
                <button @click="toggleCategoryMenu" @mouseleave="startCloseTimer"
                    class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mr-4 flex-shrink-0 touch-manipulation">
                    <Menu class="w-6 h-6" />
                    <span class="font-medium text-[15px]">ALL CATEGORIES</span>
                    <ChevronDown class="w-4 h-4 transition-transform duration-200"
                        :class="{ 'transform rotate-180': isCategoryMenuOpen }" />
                </button>

                <!-- Scrollable category list -->
                <div class="flex overflow-x-auto category-scroll-container">
                    <!-- Root categories Side Panel -->
                    <div v-for="category in rootCategories.slice(7, 16)" :key="category._id" class="relative"
                        @mouseenter="showSubcategories(category)" @mouseleave="startHideTimer">
                        <router-link :to="`/category/${category.slug}`"
                            class="text-[14px] whitespace-nowrap px-3 py-2 text-gray-700 hover:text-[#24a6bb] flex-shrink-0 block transition-colors duration-200"
                            @click="closeDropdown">
                            {{ category.name }}
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- Desktop Category dropdown menu -->
            <div v-if="isCategoryMenuOpen" class="absolute w-full bg-white shadow-lg z-50 mt-1 border-t border-gray-200"
                @mouseenter="cancelCloseTimer" @mouseleave="startCloseTimer">
                <div class="max-w-7xl mx-auto">
                    <div class="flex">
                        <!-- Root categories Side Panel -->
                        <div class="flex flex-col items-start bg-gray-50 px-4 border-r border-gray-200 w-48">
                            <button v-for="category in rootCategories.slice(7, 16)" :key="category._id"
                                @mouseenter="showSubcategories(category)"
                                class="text-left w-full text-[14px] py-3 pl-3 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out rounded"
                                :class="{ 'bg-gray-100 text-[#24a6bb] font-medium': selectedCategory?._id === category._id }">
                                {{ category.name }}
                            </button>
                        </div>

                        <!-- Subcategories Panel -->
                        <div v-if="selectedCategory" class="flex-grow px-6 py-4 bg-white overflow-y-auto"
                            style="max-height: 75vh;">
                            <div class="grid grid-cols-6 gap-6">
                                <div v-for="subcategory in selectedCategory.children" :key="subcategory._id"
                                    class="space-y-2">
                                    <h3 class="font-semibold mb-3 text-[#24a6bb] text-sm border-b border-gray-100 pb-1">
                                        {{ subcategory.name }}
                                    </h3>
                                    <ul class="space-y-2">
                                        <li v-for="item in subcategory.children" :key="item._id">
                                            <router-link :to="`/category/${item.slug}`"
                                                class="text-[13px] text-gray-600 hover:text-[#24a6bb] transition duration-150 ease-in-out block py-1"
                                                @click="closeDropdown">
                                                {{ item.name }}
                                            </router-link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Desktop Subcategories panel (horizontal hover) -->
            <div v-if="selectedCategory && !isCategoryMenuOpen"
                class="subcategories-panel absolute left-0 w-full bg-white shadow-md z-40 border-t border-gray-200"
                @mouseenter="cancelHideSubcategories" @mouseleave="hideSubcategories">
                <div class="max-w-7xl mx-auto px-4 py-6">
                    <div class="grid grid-cols-6 gap-6">
                        <div v-for="subcategory in selectedCategory.children" :key="subcategory._id" class="space-y-2">
                            <h3 class="font-semibold text-sm text-gray-900 border-b border-gray-100 pb-2">
                                {{ subcategory.name }}
                            </h3>
                            <ul class="space-y-2">
                                <li v-for="item in subcategory.children" :key="item._id">
                                    <router-link :to="`/category/${item.slug}`"
                                        class="text-[13px] text-gray-600 hover:text-[#24a6bb] transition duration-150 ease-in-out block py-1"
                                        @click="closeDropdown">
                                        {{ item.name }}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Categories Modal (All Categories) -->
        <div v-if="showAllCategoriesModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div class="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">All Categories</h3>
                    <button @click="closeAllCategoriesModal" class="p-2 hover:bg-gray-100 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="overflow-y-auto max-h-[calc(80vh-80px)]">
                    <div class="grid grid-cols-2 gap-0 divide-x divide-y divide-gray-200">
                        <router-link v-for="category in rootCategories" :key="category._id"
                            :to="`/category/${category.slug}`" @click="closeAllCategoriesModal"
                            class="p-4 text-center hover:bg-gray-50 transition-colors duration-200">
                            <div class="text-sm font-medium text-gray-700">
                                {{ category.name }}
                            </div>
                            <div v-if="category.children?.length" class="text-xs text-gray-500 mt-1">
                                {{ category.children.length }} subcategories
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Menu, ChevronDown } from 'lucide-vue-next';
import { useProductStore } from '../store/productStore.js';
import { storeToRefs } from 'pinia';

export default {
    name: 'Categories',
    components: {
        Menu,
        ChevronDown
    },
    setup() {
        const productStore = useProductStore();
        const { categories } = storeToRefs(productStore);

        // Desktop states
        const isCategoryMenuOpen = ref(false);
        const selectedCategory = ref(null);
        let closeTimeout = null;
        let closeMenuTimeout = null;

        // Mobile states
        const isMobileCategoryMenuOpen = ref(false);
        const showAllCategoriesModal = ref(false);

        const rootCategories = computed(() => {
            return categories.value ? categories.value.filter(category => !category.parent) : [];
        });

        // Desktop category functions
        const toggleCategoryMenu = () => {
            isCategoryMenuOpen.value = !isCategoryMenuOpen.value;
            if (isCategoryMenuOpen.value && rootCategories.value.length > 0) {
                const defaultCategory = rootCategories.value.find(cat => cat.children && cat.children.length > 0);
                if (defaultCategory) {
                    showSubcategories(defaultCategory);
                }
            }
        };

        const showSubcategories = (category) => {
            if (category.children && category.children.length > 0) {
                selectedCategory.value = category;
                cancelHideSubcategories();
            } else {
                selectedCategory.value = null;
            }
        };

        const hideSubcategories = () => {
            closeTimeout = setTimeout(() => {
                selectedCategory.value = null;
            }, 300);
        };

        const cancelHideSubcategories = () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        };

        const startCloseTimer = () => {
            closeMenuTimeout = setTimeout(() => {
                isCategoryMenuOpen.value = false;
                selectedCategory.value = null;
            }, 300);
        };

        const startHideTimer = () => {
            closeTimeout = setTimeout(() => {
                selectedCategory.value = null;
            }, 300);
        };

        const cancelCloseTimer = () => {
            if (closeMenuTimeout) {
                clearTimeout(closeMenuTimeout);
                closeMenuTimeout = null;
            }
        };

        const closeDropdown = () => {
            isCategoryMenuOpen.value = false;
            selectedCategory.value = null;
        };

        // Mobile category functions
        const toggleMobileCategoryMenu = () => {
            isMobileCategoryMenuOpen.value = !isMobileCategoryMenuOpen.value;
        };

        const closeMobileCategoryMenu = () => {
            isMobileCategoryMenuOpen.value = false;
        };

        const showAllMobileCategories = () => {
            showAllCategoriesModal.value = true;
            closeMobileCategoryMenu();
        };

        const closeAllCategoriesModal = () => {
            showAllCategoriesModal.value = false;
        };

        const handleCategoryClick = (category, event) => {
            if (event) {
                event.preventDefault();
            }
            if (category.children && category.children.length > 0) {
                isCategoryMenuOpen.value = true;
                showSubcategories(category);
            } else {
                router.push(`/category/${category.slug}`);
                closeDropdown();
            }
        };

        // Close mobile menu when clicking outside
        const handleClickOutside = (event) => {
            if (!event.target.closest('.mobile-category-menu')) {
                closeMobileCategoryMenu();
            }
            if (!event.target.closest('.categories-modal') && showAllCategoriesModal.value) {
                closeAllCategoriesModal();
            }
        };

        onMounted(async () => {
            if (categories.value.length === 0) {
                await productStore.fetchCategories();
            }

            document.addEventListener('click', handleClickOutside);
        });

        onUnmounted(() => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
            }

            if (closeMenuTimeout) {
                clearTimeout(closeMenuTimeout);
            }

            document.removeEventListener('click', handleClickOutside);
        });

        return {
            rootCategories,
            isCategoryMenuOpen,
            selectedCategory,
            toggleCategoryMenu,
            showSubcategories,
            hideSubcategories,
            cancelHideSubcategories,
            startCloseTimer,
            startHideTimer,
            cancelCloseTimer,
            closeDropdown,
            handleCategoryClick,

            // Mobile states and functions
            isMobileCategoryMenuOpen,
            showAllCategoriesModal,
            toggleMobileCategoryMenu,
            closeMobileCategoryMenu,
            showAllMobileCategories,
            closeAllCategoriesModal
        };
    }
};
</script>

<style scoped>
/* Base styles */
.category-menu {
    width: 100%;
    overflow: hidden;
}

.category-scroll-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
}

.category-scroll-container::-webkit-scrollbar {
    display: none;
}

.subcategories-panel {
    max-height: 80vh;
    overflow-y: auto;
}

/* Mobile horizontal scroll */
.scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Line clamp utility */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Touch-friendly interactions */
.touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {

    /* Ensure minimum touch targets */
    button,
    a {
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Optimize grid spacing */
    .grid-cols-2>* {
        min-height: 60px;
    }
}

/* Enhanced hover effects for desktop */
@media (min-width: 1024px) {
    .category-scroll-container>div:hover {
        transform: translateY(-1px);
        transition: transform 0.2s ease-in-out;
    }

    .subcategories-panel h3 {
        position: sticky;
        top: 0;
        background: white;
        z-index: 10;
    }
}

/* Modal animations */
.categories-modal {
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

/* Better focus states */
button:focus-visible,
a:focus-visible {
    outline: 2px solid #24a6bb;
    outline-offset: 2px;
    border-radius: 4px;
}

/* Smooth transitions */
* {
    transition-property: color, background-color, border-color, transform, opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}

/* Mobile grid optimizations */
@media (max-width: 375px) {
    .grid-cols-2 {
        grid-template-columns: 1fr 1fr;
        gap: 0;
    }

    .p-3 {
        padding: 0.5rem;
    }
}

/* Desktop subcategory improvements */
@media (min-width: 1024px) {
    .subcategories-panel .grid-cols-6 {
        gap: 2rem;
    }

    .subcategories-panel h3:hover {
        color: #24a6bb;
    }

    .subcategories-panel ul li:hover {
        padding-left: 0.5rem;
        transition: padding-left 0.2s ease-in-out;
    }
}

/* Improved scrolling for mobile */
@media (max-width: 1023px) {
    .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
    }
}
</style>
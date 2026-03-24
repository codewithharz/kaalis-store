<template>
    <div
        :class="['relative flex flex-col lg:w-full border border-gray-300 rounded-lg overflow-hidden bg-white hover:shadow-md transition-transform transform max-w-xs mr-2 mt-4 group', customClass]">
        <div v-if="product && product._id">
            <router-link :to="productLink" class="flex flex-col flex-1 border-b">
                <img :src="product.images[0]" :alt="product.name"
                    class="product-list-img w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover button-hover" />
            </router-link>
        </div>
        <div class="absolute top-2 right-2 cursor-pointer bg-slate-100 rounded-full flex items-center justify-center h-8 w-8 p-2"
            @click="toggleHeart">
            <Heart :class="isHeartFilled ? 'text-red-500' : 'text-gray-500 product-list-favorite'" />
        </div>

        <div v-if="isUserProduct"
            class="absolute flex top-2 left-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button @click="editProduct"
                class="bg-blue-500 text-white rounded-full flex items-center h-8 w-8 p-2 hover:bg-blue-600 transition-colors">
                <Edit class="" />
            </button>
            <button @click="handleDeleteProduct"
                class="bg-red-500 text-white rounded-full flex items-center h-8 w-8 p-2 hover:bg-red-600 transition-colors">
                <Trash class="" />
            </button>
        </div>

        <div class="flex flex-col flex-1 p-4 hover:border-t-2 border-t-2 hover:border-[#ff934b]">
            <div class="space-y-2 flex-1">
                <div class="space-x-1">
                    <span class="text-[12px] font-bold">{{ product.metaTitle || product.name }}</span>
                    <span class="text-[12px] font-extralight text-[#363636]">
                        {{ truncatedDescription }}
                    </span>
                </div>
                <div class="flex items-center my-2">
                    <span v-if="product.averageRating > 0" class="flex gap-1 text-[10px]">
                        {{ formatRating(product.averageRating) }}
                        <Star class="size-4" v-for="star in 5" :key="star"
                            :class="star <= Math.round(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'" />
                    </span>
                    <span v-if="product.numberOfRatings > 0" class="ml-2 text-gray-500 text-[10px]">
                        ({{ product.numberOfRatings }}
                        {{ product.numberOfRatings === 1 ? t('productCardOld.review') : t('productCardOld.reviews') }})
                    </span>
                    <span v-else class="ml-2 text-gray-500 text-[10px]">
                        ({{ t('productCardOld.noReviewsYet') }})
                    </span>
                </div>
                <!-- <div class="text-[0.9rem] font-bold text-[#f47a24]">₦{{ product.price?.toFixed(2) }}</div> -->
                <div class="flex justify-between items-center text-[13px]">
                    <p v-if="product.price != null" class="text-[#f47a24] font-semibold">
                        ₦{{ product.price.toFixed(2) }}
                        <span v-if="product.unit" class="text-[10px] text-gray-500">
                            / {{ formatUnitDisplay(product.unit) }}
                        </span>
                    </p>
                    <p v-else class="text-[#f47a24] font-semibold">{{ t('productCardOld.priceNotAvailable') }}</p>

                    <p v-if="product.originalPrice" class="text-gray-500 line-through">
                        ₦{{ product.originalPrice.toFixed(2) }}
                    </p>
                </div>

                <p v-if="product.discount > 0" class="text-[13px] text-[#f47a24]">{{ t('productCardOld.percentOff', { discount: product.discount }) }}</p>

                <!-- Stock information -->
                <p class="text-[11px] text-gray-600">
                    {{ product.isAvailable ? t('productCardOld.inStock', { stock: product.stock }) : t('productCardOld.outOfStock') }}
                </p>

                <!-- Bulk pricing hint -->
                <p v-if="product.bulkPricing && product.bulkPricing.length > 0" class="text-[11px] text-green-600">
                    {{ t('productCardOld.bulkPricingAvailable') }}
                </p>

                <!-- Variant hint -->
                <p v-if="product.variants && product.variants.length > 0" class="text-[11px] text-blue-600">
                    {{ t('productCardOld.variantsAvailable', { count: product.variants.length }) }}
                </p>

                <!-- Brand -->
                <p v-if="product.brand" class="text-[11px] text-gray-600">
                    {{ t('productCardOld.brand', { brand: product.brand }) }}
                </p>

            </div>
            <div class="flex flex-wrap mt-4">
                <!-- Display a maximum of 3 tags, with null check -->
                <span v-for="tag in (product.tags || []).slice(0, 3)" :key="tag"
                    :class="[tagsButtonClass, 'bg-[#f47a24] text-white py-1 px-2 mr-2 mb-2 rounded text-[10px] button-hover']">
                    {{ tag }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { useProductStore } from '../store/productStore';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useI18n } from 'vue-i18n';
import { Star, Heart, Edit, Trash, Camera } from 'lucide-vue-next';
import { computed } from 'vue';

export default {
    name: 'ProductCard',
    components: {
        Star, Heart, Edit, Trash, Camera
    },
    props: {
        product: {
            type: Object,
            required: true,
            validator: (value) => {
                if (!value || !value._id) {
                    console.error('Invalid product prop:', value);
                    return false;
                }
                return true;
            }
        },
        isUserProduct: {
            type: Boolean,
            default: false
        },
        // used in ProductList.vue
        customClass: {
            type: String,
            default: ''
        },
        tagsButtonClass: {
            type: String,
            default: ''
        }
    },
    mounted() {
        console.log('Product in ProductCard:', this.product);
    },

    computed: {
        // truncate words
        truncatedDescription() {
            if (!this.product || !this.product.description) {
                return this.t('productCardOld.noDescriptionAvailable');
            }
            const words = this.product.description.split(' ');
            return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : this.product.description;
        },
        availableStock() {
            if (!this.product || typeof this.product.stock !== 'number') {
                return 0;
            }
            return this.product.stock - (this.product.reservedStock || 0);
        },
        productTags() {
            return this.product.tags || [];
        }
    },
    data() {
        return {
            isHeartFilled: false
        };
    },
    methods: {
        toggleHeart() {
            this.isHeartFilled = !this.isHeartFilled;
            // Here you could add logic to add/remove from user's wishlist
        },
        editProduct() {
            // Implement edit functionality
            console.log('Edit product:', this.product._id);
            // You might want to emit an event to the parent component
            this.$emit('edit', this.product._id);
        },
        formatRating(rating) {
            return rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);
        },
        formatUnitDisplay(unit) {
            if (!unit) return '';
            return unit.displayUnit || `${unit.value || ''} ${unit.baseUnit || ''}`.trim();
        }
    },
    // ... existing component options ...
    setup(props, { emit }) {
        const productStore = useProductStore();
        const router = useRouter();
        const { t } = useI18n();

        console.log('Product Props:', props.product);
        console.log('Is User Product:', props.isUserProduct);
        console.log('Custom Class:', props.customClass);
        console.log('Tags Button Class:', props.tagsButtonClass);

        const productLink = computed(() => {
            if (props.isUserProduct) {
                // For user products, link to the user's products page or profile
                return {
                    name: 'UserProductDetails',
                    params: { id: props.product._id }
                }; // or 'UserProfile', depending on your route structure
            } else {
                // For regular products, link to the product details page
                return { name: 'ProductDetails', params: { id: props.product._id } };
            }
        });

        const handleEditProduct = () => {
            // Instead of navigating, emit an event for editing
            emit('edit', props.product._id);
        };

        const handleDeleteProduct = async () => {
            if (confirm(t('productCardOld.confirmDelete'))) {
                try {
                    console.log("Deleting product with ID:", props.product._id);
                    await productStore.deleteProduct(props.product._id);
                    toast.success(t('productCardOld.toasts.productDeleted'));
                    emit('productDeleted', props.product._id);
                } catch (error) {
                    console.error('Error deleting product:', error);
                    toast.error(t('productCardOld.toasts.productDeleteFailed'));
                }
            }
        };

        const fetchProductDetails = async () => {
            await productStore.fetchProductById(props.product._id);
            router.push({ name: 'ProductDetails', params: { id: props.product._id } });
        };

        const calculateOriginalPrice = (product) => {
            return product.originalPrice || (product.discount ? Math.round(product.price / (1 - product.discount / 100)) : product.price);
        };

        return {
            productLink,
            handleEditProduct,
            handleDeleteProduct,
            fetchProductDetails,
            calculateOriginalPrice,
            t
        };
    },
};
</script>

<!-- <style scoped>
.product-list-card :deep(.product-list-container) {
    width: 20%;
}
</style> -->

<style scoped>
.product-list-card :deep(.product-list-container) {
    width: 100%;
}

@media (min-width: 640px) {
    .product-list-card :deep(.product-list-container) {
        width: 50%;
    }
}

@media (min-width: 768px) {
    .product-list-card :deep(.product-list-container) {
        width: 33.333%;
    }

    .product-list-card :deep(.product-list-img) {
        height: 250px;
    }
}

@media (min-width: 1024px) {
    .product-list-card :deep(.product-list-container) {
        width: 25%;
    }

    .product-list-card :deep(.product-list-img) {
        height: 300px;
    }
}

@media (min-width: 1280px) {
    .product-list-card :deep(.product-list-container) {
        width: 24.5%;
    }

    .product-list-card :deep(.product-list-img) {
        height: 330px;
    }
}

.product-list-card :deep(.product-list-favorite):hover {
    color: #ef4444;
}
</style>

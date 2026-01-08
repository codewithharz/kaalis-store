<!-- # Related Products Component -->
<template>
    <div v-if="processedProducts.length > 0" class="w-full bg-white py-8 border-t">
        <div class="max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 class="text-xl font-semibold mb-6">
                {{ processedProducts.length > 0 ? 'Related Products' : 'You May Also Like' }}
            </h2>
            <div class="flex justify-center">
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    <ProductCard v-for="product in processedProducts" :key="product._id" :product="product"
                        @click="navigateToProduct(product._id)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from './ProductCard.vue';

export default {
    name: 'RelatedProducts',
    components: {
        ProductCard
    },
    props: {
        displayProducts: {
            type: [Array, Object],
            default: () => []
        }
    },
    setup(props) {
        const router = useRouter();

        const processedProducts = computed(() => {
            // Handle case where displayProducts is an array
            if (Array.isArray(props.displayProducts)) {
                return props.displayProducts;
            }

            // Handle case where displayProducts is an object with products array
            if (props.displayProducts?.products && Array.isArray(props.displayProducts.products)) {
                return props.displayProducts.products;
            }

            // Default to empty array if neither condition is met
            return [];
        });

        const navigateToProduct = (productId) => {
            if (productId) {
                router.push({ name: 'ProductDetails', params: { id: productId } });
            }
        };

        return {
            processedProducts,
            navigateToProduct
        };
    }
};
</script>
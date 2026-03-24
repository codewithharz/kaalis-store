<!-- src/views/WishlistDetail.vue -->
<!-- not in use yet -->
<template>
  <div v-if="wishlist" class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ wishlist.name }}</h1>
    <p class="text-gray-600 mb-4">{{ wishlist.description }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="product in wishlist.products" :key="product._id" class="border rounded-lg p-4">
        <img :src="product.images[0]" :alt="product.name" class="w-full h-48 object-cover mb-2 rounded">
        <h2 class="text-lg font-semibold mb-2">{{ product.name }}</h2>
        <p class="text-gray-600 mb-2">{{ product.description }}</p>
        <p class="text-lg font-bold text-[#f47a24] mb-2">₦ {{ product.price.toFixed(2) }}</p>
        <button @click="viewProduct(product._id)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {{ t('wishlistDetailPage.viewProduct') }}
        </button>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto p-4">
    <p class="text-gray-600">{{ t('wishlistDetailPage.loading') }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useWishlistStore } from '../store/wishlistStore';

export default {
  name: 'WishlistDetail',
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const wishlistStore = useWishlistStore();
    const wishlist = ref(null);

    onMounted(async () => {
      const wishlistId = route.params.id;
      try {
        const response = await wishlistStore.getWishlistById(wishlistId);
        wishlist.value = response.data.wishlist;
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        wishlist.value = {
          name: t('wishlistDetailPage.failedLoad'),
          description: '',
          products: [],
        };
      }
    });

    const viewProduct = (productId) => {
      router.push({ name: 'ProductDetails', params: { id: productId } });
    };

    return {
      t,
      wishlist,
      viewProduct,
    };
  },
};
</script>

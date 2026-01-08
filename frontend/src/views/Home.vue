<template>
  <!-- <BrandCarousel /> -->
  <ProductList />
</template>

<script>
// import BrandCarousel from './BrandCarousel.vue';
import ProductList from './ProductList.vue';

import { UserRound, Heart, ShoppingCart, Search } from 'lucide-vue-next';

export default {
  name: 'Home',
  components: {
    // BrandCarousel,
    ProductList,
    UserRound,
    Heart,
    ShoppingCart,
    Search
  }
}
</script>

<style scoped>
/* Add global styles here if needed */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f7f7f7;
}
</style>

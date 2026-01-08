<template>
    <div>
        <SellerStoreHeader :sellerId="$route.params.id" />
        <!-- Pass the sellerId to the child components -->
        <router-view :sellerId="$route.params.id"></router-view>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import SellerStoreHeader from './SellerStoreHeader.vue';

export default {
    components: {
        SellerStoreHeader,
    },
    setup() {
        const route = useRoute();
        const sellerId = route.params.id;

        return {
            sellerId
        };
    }
}
</script>
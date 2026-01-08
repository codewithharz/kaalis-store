<template>
    <RatePurchaseHeader />
    <!-- Dynamic Content -->
    <router-view />
</template>


<script>
import RatePurchaseHeader from './RatePurchaseHeader.vue';

export default {
    name: 'MyRatePurchase',
    components: {
        RatePurchaseHeader,
    },
}
</script>

<style scoped>
/* Add any specific styles for this page */
</style>
<!-- MyOrders.vue -->
<template>
    <div>
        <OrderHeader />
        <router-view v-slot="{ Component }">
            <Suspense>
                <component :is="Component" />
                <template #fallback>
                    <div>Loading...</div>
                </template>
            </Suspense>
        </router-view>
    </div>
</template>

<script>
import OrderHeader from './OrderHeader.vue';

export default {
    name: 'MyOrders',
    components: {
        OrderHeader
    }
};
</script>
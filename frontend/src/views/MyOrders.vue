<!-- MyOrders.vue -->
<template>
    <div>
        <OrderHeader />
        <router-view v-slot="{ Component }">
            <Suspense>
                <component :is="Component" />
                <template #fallback>
                    <div>{{ t('accountShell.loading') }}</div>
                </template>
            </Suspense>
        </router-view>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import OrderHeader from './OrderHeader.vue';

export default {
    name: 'MyOrders',
    components: {
        OrderHeader
    },
    setup() {
        const { t } = useI18n();
        return { t };
    }
};
</script>

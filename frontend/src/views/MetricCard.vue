<template>
    <Card>
        <template #header>{{ title }}</template>
        <template #content>
            <div class="text-2xl font-bold">{{ value }}</div>
            <div :class="`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`">
                {{ change >= 0 ? '+' : '' }}{{ change }}%
            </div>
        </template>
    </Card>
</template>

<script>
import { Card } from '@/components/ui/card';

export default {
    name: 'MetricCard',
    components: { Card },
    props: {
        title: String,
        value: String,
        change: Number
    }
};
</script>
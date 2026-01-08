<!-- src/views/pages/components/campaigns/MembershipStatsCard.vue -->
<template>
    <div class="bg-gray-50 rounded-lg p-6">
        <div class="flex items-start justify-between mb-4">
            <div>
                <h3 class="text-gray-600 mb-1">{{ title }}</h3>
                <p class="text-3xl font-bold text-[#2d3642]">{{ value }}</p>
            </div>
            <div class="w-10 h-10 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                <component :is="iconComponent" class="w-5 h-5 text-[#24a6bb]" />
            </div>
        </div>
        <p class="text-gray-600 text-sm">{{ description }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Users, Wallet, Tag } from 'lucide-vue-next';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const iconComponent = computed(() => {
    const icons = { Users, Wallet, Tag };
    return icons[props.icon];
});
</script>
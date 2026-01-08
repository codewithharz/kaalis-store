<!-- src/views/pages/components/campaigns/EarnMethodCard.vue -->
<template>
    <div class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
            <component :is="iconComponent" class="w-6 h-6 text-[#24a6bb]" />
        </div>
        <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ title }}</h3>
        <p class="text-gray-600 text-sm">{{ description }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ShoppingCart, Star, UserPlus, Gift } from 'lucide-vue-next';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});

const iconComponent = computed(() => {
    const icons = { ShoppingCart, Star, UserPlus, Gift };
    return icons[props.icon];
});
</script>
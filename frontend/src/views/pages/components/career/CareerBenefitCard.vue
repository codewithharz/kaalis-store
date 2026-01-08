<!-- src/components/career/CareerBenefitCard.vue -->
<template>
    <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
            <component :is="iconComponent" class="w-6 h-6 text-[#24a6bb]" />
        </div>
        <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ title }}</h3>
        <p class="text-gray-600 text-sm">{{ description }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Heart, Book, Coffee, Sun, Plane, Leaf, Gift, Award } from 'lucide-vue-next';

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const iconComponent = computed(() => {
    const icons = { Heart, Book, Coffee, Sun, Plane, Leaf, Gift, Award };
    return icons[props.icon];
});
</script>
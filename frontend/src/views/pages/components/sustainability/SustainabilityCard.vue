<!-- src/components/sustainability/SustainabilityCard.vue -->
<template>
    <div class="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-6">
            <component :is="iconComponent" class="w-8 h-8 text-[#24a6bb]" />
        </div>
        <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ title }}</h3>
        <p class="text-gray-600">{{ description }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Leaf, Users, Shield } from 'lucide-vue-next';

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
    const icons = { Leaf, Users, Shield };
    return icons[props.icon];
});
</script>
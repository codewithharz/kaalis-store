<!-- src/components/career/CareerFeatureCard.vue -->
<template>
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center mb-4">
            <component :is="icon" class="w-8 h-8 text-[#24a6bb]" />
            <h3 class="text-xl font-semibold ml-3">{{ title }}</h3>
        </div>
        <p class="text-gray-600">{{ description }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Lightbulb, Users, TrendingUp } from 'lucide-vue-next';

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

const icon = computed(() => {
    const icons = { Lightbulb, Users, TrendingUp };
    return icons[props.icon];
});
</script>
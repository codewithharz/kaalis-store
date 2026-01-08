<!-- src/components/career/CareerCultureItem.vue -->
<template>
    <div class="flex items-start space-x-4">
        <div class="flex-shrink-0 mt-1">
            <component :is="iconComponent" class="w-6 h-6 text-[#24a6bb]" />
        </div>
        <div>
            <h4 class="text-lg font-semibold text-gray-800">{{ title }}</h4>
            <p class="text-gray-600">{{ description }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Heart, Target, Award } from 'lucide-vue-next';

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
    const icons = { Heart, Target, Award };
    return icons[props.icon];
});
</script>
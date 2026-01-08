<!-- src/views/pages/components/campaigns/ServiceCard.vue -->
<template>
    <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
            <component :is="iconComponent" class="w-6 h-6 text-[#24a6bb]" />
        </div>

        <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ title }}</h3>
        <p class="text-gray-600 mb-4">{{ description }}</p>

        <button class="text-[#24a6bb] hover:text-[#1a7f8f] font-medium flex items-center" @click="$emit('learnMore')">
            Learn More
            <ArrowRight class="w-4 h-4 ml-1" />
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Gift, MessageSquare, Truck, ArrowRight } from 'lucide-vue-next';

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
    const icons = { Gift, MessageSquare, Truck };
    return icons[props.icon];
});

defineEmits(['learnMore']);
</script>
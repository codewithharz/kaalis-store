<!-- src/views/pages/components/campaigns/PromotionCard.vue -->
<template>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-bold text-[#2d3642]">{{ title }}</h3>
                    <p class="text-gray-600">{{ description }}</p>
                </div>
                <div class="bg-[#e6f4f7] text-[#24a6bb] font-bold px-4 py-2 rounded-full text-lg">
                    {{ discount }}
                </div>
            </div>
            <div class="flex items-center justify-between mt-4">
                <div class="flex items-center text-gray-600">
                    <Clock class="w-4 h-4 mr-2" />
                    <span>Ends: {{ formatDate(endDate) }}</span>
                </div>
                <button class="text-[#24a6bb] hover:text-[#1a7f8f] font-medium">
                    Shop Now
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Clock } from 'lucide-vue-next';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    }
});

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>
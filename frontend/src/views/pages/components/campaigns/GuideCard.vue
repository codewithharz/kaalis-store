<!-- src/views/pages/components/campaigns/GuideCard.vue -->
<template>
    <div class="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div class="flex flex-col md:flex-row">
            <!-- Image -->
            <div class="md:w-1/2">
                <img :src="image" :alt="title" class="w-full h-48 md:h-full object-cover" />
            </div>

            <!-- Content -->
            <div class="p-6 md:w-1/2">
                <h3 class="text-xl font-bold text-[#2d3642] mb-2">{{ title }}</h3>
                <p class="text-gray-600 mb-4">{{ description }}</p>
                <div class="flex items-center justify-between">
                    <button class="text-[#24a6bb] hover:text-[#1a7f8f] font-medium flex items-center">
                        Read Guide
                        <ArrowRight class="w-4 h-4 ml-1" />
                    </button>
                    <span class="text-gray-500 text-sm">{{ readTime }} min read</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next';

defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    readTime: {
        type: Number,
        default: 5
    }
});
</script>
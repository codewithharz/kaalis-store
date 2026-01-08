<!-- src/components/career/CareerJobCard.vue -->
<template>
    <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-xl font-semibold text-[#2d3642]">{{ title }}</h3>
                <p class="text-[#24a6bb] font-medium">{{ department }}</p>
            </div>
            <span class="bg-[#e6f4f7] text-[#24a6bb] px-3 py-1 rounded-full text-sm font-medium">
                {{ type }}
            </span>
        </div>

        <div class="flex items-center text-gray-600 mb-6">
            <MapPin class="w-4 h-4 mr-2" />
            <span>{{ location }}</span>
        </div>

        <div class="flex justify-between items-center">
            <button class="text-[#24a6bb] hover:text-[#1a7f8f] font-medium flex items-center">
                Learn More
                <ArrowRight class="w-4 h-4 ml-2" />
            </button>
            <button class="bg-[#24a6bb] text-white px-4 py-2 rounded-lg hover:bg-[#1a7f8f] transition duration-300">
                Apply Now
            </button>
        </div>
    </div>
</template>

<script setup>
import { MapPin, ArrowRight } from 'lucide-vue-next';

defineProps({
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});
</script>
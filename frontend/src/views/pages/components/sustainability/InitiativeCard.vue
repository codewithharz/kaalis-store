<!-- src/components/sustainability/InitiativeCard.vue -->
<template>
    <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
        <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ title }}</h3>
        <ul class="space-y-3">
            <li v-for="(point, index) in points" :key="index" class="flex items-start">
                <CheckCircle2 class="w-5 h-5 text-[#24a6bb] mt-0.5 mr-2 flex-shrink-0" />
                <span class="text-gray-600">{{ point }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { CheckCircle2 } from 'lucide-vue-next';

defineProps({
    title: {
        type: String,
        required: true
    },
    points: {
        type: Array,
        required: true
    }
});
</script>
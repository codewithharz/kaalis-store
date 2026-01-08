<!-- src/views/pages/components/campaigns/StepCard.vue -->
<template>
    <div class="relative">
        <!-- Step Number Circle -->
        <div
            class="w-12 h-12 bg-[#24a6bb] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
            {{ step }}
        </div>

        <!-- Content -->
        <div>
            <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ title }}</h3>
            <p class="text-gray-600">{{ description }}</p>
        </div>

        <!-- Connecting Line -->
        <div v-if="!isLastStep" class="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gray-200 -z-10"></div>
    </div>
</template>

<script setup>
defineProps({
    step: {
        type: [String, Number],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isLastStep: {
        type: Boolean,
        default: false
    }
});
</script>
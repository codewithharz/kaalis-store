<!-- src/components/career/CareerProcessStep.vue -->
<template>
    <div class="flex relative w-full max-w-5xl mx-auto">
        <!-- Left Line -->
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-[#24a6bb] -z-10" :class="{ 'h-full': !isLastStep }"></div>

        <!-- Content -->
        <div class="flex items-start w-full">
            <!-- Step Circle -->
            <div
                class="w-12 h-12 bg-[#24a6bb] rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                {{ step }}
            </div>

            <!-- Text Content -->
            <div class="ml-6 bg-white p-6 rounded-lg shadow-lg w-full">
                <h4 class="text-lg font-semibold text-[#2d3642] mb-2">{{ title }}</h4>
                <p class="text-gray-600">{{ description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
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
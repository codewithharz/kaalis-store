<!-- src/components/sustainability/GoalProgress.vue -->
<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-xl font-semibold text-[#2d3642]">{{ title }}</h3>
                <p class="text-gray-600 text-sm">{{ description }}</p>
            </div>
            <div class="text-right">
                <span class="text-[#24a6bb] font-semibold">{{ targetYear }}</span>
                <p class="text-sm text-gray-500">Target Year</p>
            </div>
        </div>

        <div class="relative pt-1">
            <div class="flex items-center justify-between mb-2">
                <div>
                    <span class="text-xs font-semibold inline-block text-[#24a6bb]">
                        {{ currentValue }}% Complete
                    </span>
                </div>
                <div>
                    <span class="text-xs font-semibold inline-block text-gray-600">
                        Target: {{ target }}%
                    </span>
                </div>
            </div>
            <div class="flex h-2 mb-4 overflow-hidden bg-gray-100 rounded">
                <div class="flex flex-col justify-center overflow-hidden bg-[#24a6bb] transition-all duration-500"
                    :style="{ width: `${currentValue}%` }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    currentValue: {
        type: [Number, String],
        required: true
    },
    target: {
        type: [Number, String],
        required: true
    },
    targetYear: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
</script>
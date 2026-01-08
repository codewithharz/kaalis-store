<template>
    <div class="bg-white p-4 rounded-b-lg shadow-sm mb-3">
        <div class="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between gap-4">
            <!-- Period Selection Buttons -->
            <div class="flex flex-wrap gap-2 sm:gap-4">
                <button v-for="period in periods" :key="period.value" @click="$emit('update:modelValue', period.value)"
                    class="px-3 py-2 rounded-lg transition-colors text-sm"
                    :class="modelValue === period.value ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'">
                    {{ period.label }}
                </button>
            </div>

            <!-- Navigation Controls -->
            <div class="flex items-center space-x-2">
                <button @click="$emit('prev')" class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    :disabled="isLoading">
                    <ChevronLeft class="w-5 h-5" />
                </button>
                <span class="text-sm font-medium">{{ currentPeriodLabel }}</span>
                <button @click="$emit('next')"
                    class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isCurrentPeriod || isLoading">
                    <ChevronRight class="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
    modelValue: { type: String, required: true },
    currentDate: { type: Date, required: true },
    isCurrentPeriod: { type: Boolean, required: true },
    isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'prev', 'next'])

const periods = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: 'Year', value: '1y' }
]

const currentPeriodLabel = computed(() => {
    const date = props.currentDate
    const options = { year: 'numeric', month: 'short' }

    switch (props.modelValue) {
        case '7d':
        case '30d':
            return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - Present`
        case '90d':
            return `${date.toLocaleDateString(undefined, options)} - Present`
        case '1y':
            return date.getFullYear().toString()
        default:
            return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - Present`
    }
})
</script>

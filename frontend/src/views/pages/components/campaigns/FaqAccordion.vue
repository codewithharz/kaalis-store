<!-- src/views/pages/components/campaigns/FaqAccordion.vue -->
<template>
    <div class="border rounded-lg overflow-hidden">
        <!-- Header -->
        <button class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            @click="isOpen = !isOpen" :aria-expanded="isOpen">
            <span class="font-semibold text-[#2d3642]">{{ question }}</span>
            <ChevronDown class="w-5 h-5 text-gray-500 transition-transform"
                :class="{ 'transform rotate-180': isOpen }" />
        </button>

        <!-- Content -->
        <div v-show="isOpen" class="p-4 bg-gray-50 border-t">
            <p class="text-gray-600">{{ answer }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const isOpen = ref(false);
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: height 0.3s ease;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    height: 0;
}
</style>
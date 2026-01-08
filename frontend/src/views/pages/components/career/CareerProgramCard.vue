<!-- src/components/career/CareerProgramCard.vue -->
<template>
    <div
        class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
        <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                <component :is="iconComponent" class="w-6 h-6 text-[#24a6bb]" />
            </div>
            <h3 class="text-xl font-semibold text-[#2d3642] ml-4">{{ title }}</h3>
        </div>

        <p class="text-gray-600 flex-grow mb-6">{{ description }}</p>

        <button
            class="w-full bg-[#e6f4f7] text-[#24a6bb] py-2 rounded-lg hover:bg-[#24a6bb] hover:text-white transition duration-300 font-medium mt-auto">
            Learn More
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { GraduationCap, Code, Trophy } from 'lucide-vue-next';

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
    const icons = { GraduationCap, Code, Trophy };
    return icons[props.icon];
});
</script>
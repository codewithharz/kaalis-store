<template>
    <div class="flex items-start space-x-4 mb-8">
        <div class="flex-shrink-0">
            <component :is="Icon" class="w-12 h-12 text-[#24a6bb]" />
        </div>
        <!-- <p class="text-base leading-relaxed text-gray-700">{{ description }}</p> -->
        <!-- allows the passing of html elements -->
        <p class="text-base leading-relaxed text-gray-700" v-html="description"></p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ShoppingBag, TrendingUp, Dna, Globe } from 'lucide-vue-next';

const props = defineProps({
    icon: String,
    description: String
});

const Icon = computed(() => {
    const icons = { ShoppingBag, TrendingUp, Dna, Globe };
    return icons[props.icon];
});
</script>
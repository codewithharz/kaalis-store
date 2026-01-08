<template>
    <div class="flex items-start space-x-4 mb-8">
        <div class="flex-shrink-0">
            <component :is="Icon" class="w-12 h-12 text-[#24a6bb]" />
        </div>
        <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1 pl-2 border-l-4 border-gray-200">
                {{ title }} <span class="text-[#24a6bb] font-normal">{{
                    subtitle }}</span>
            </h3>
            <p class="text-sm leading-relaxed text-gray-700">{{ description }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ShoppingBag, ShirtIcon, Truck, Package } from 'lucide-vue-next';

const props = defineProps({
    icon: String,
    title: String,
    subtitle: String,
    description: String
});

const Icon = computed(() => {
    const icons = { ShoppingBag, ShirtIcon, Truck, Package };
    return icons[props.icon];
});
</script>
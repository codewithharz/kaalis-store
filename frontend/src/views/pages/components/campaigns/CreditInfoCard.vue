<!-- src/views/pages/components/campaigns/CreditInfoCard.vue -->
<template>
    <div class="bg-gray-50 rounded-lg p-6">
        <div class="flex items-start justify-between mb-4">
            <div>
                <h3 class="text-gray-600 mb-1">{{ title }}</h3>
                <p class="text-2xl font-bold text-[#2d3642]">{{ formattedAmount }}</p>
            </div>
            <div class="w-10 h-10 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                <component :is="iconComponent" class="w-5 h-5 text-[#24a6bb]" />
            </div>
        </div>
        <button
            class="w-full py-2 px-4 border border-[#24a6bb] text-[#24a6bb] rounded-lg hover:bg-[#24a6bb] hover:text-white transition-colors">
            {{ buttonText }}
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Coins, Clock, TrendingUp } from 'lucide-vue-next';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        required: true
    }
});

const iconComponent = computed(() => {
    const icons = { Coins, Clock, TrendingUp };
    return icons[props.icon];
});

const formattedAmount = computed(() => {
    return new Intl.NumberFormat().format(props.amount);
});
</script>
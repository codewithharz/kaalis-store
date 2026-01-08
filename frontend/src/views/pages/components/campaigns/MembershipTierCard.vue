<!-- src/views/pages/components/campaigns/MembershipTierCard.vue -->
<template>
    <div class="relative bg-white rounded-lg shadow-lg overflow-hidden"
        :class="{ 'ring-2 ring-[#24a6bb] transform scale-105': featured }">
        <div class="h-2 w-full" :class="{
            'bg-[#ffd700]': color === 'gold',
            'bg-[#e5e4e2]': color === 'platinum',
            'bg-[#b9f2ff]': color === 'diamond'
        }"></div>

        <div class="p-6">
            <h3 class="text-2xl font-bold text-[#2d3642] mb-2">{{ tier }}</h3>
            <div class="mb-6">
                <span class="text-3xl font-bold text-[#24a6bb]">{{ price }}</span>
                <span class="text-gray-600">/{{ period }}</span>
            </div>

            <ul class="space-y-3 mb-6">
                <li v-for="(feature, index) in features" :key="index" class="flex items-start">
                    <Check class="w-5 h-5 text-[#24a6bb] mt-0.5 mr-2 flex-shrink-0" />
                    <span class="text-gray-600">{{ feature }}</span>
                </li>
            </ul>

            <button class="w-full py-2 px-4 rounded-lg transition-colors" :class="{
                'bg-[#24a6bb] text-white hover:bg-[#1a7f8f]': featured,
                'border border-[#24a6bb] text-[#24a6bb] hover:bg-[#24a6bb] hover:text-white': !featured
            }">
                Get Started
            </button>
        </div>

        <div v-if="featured" class="absolute top-6 right-6 bg-[#24a6bb] text-white text-sm px-3 py-1 rounded-full">
            Popular
        </div>
    </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next';

defineProps({
    tier: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true
    },
    features: {
        type: Array,
        required: true
    },
    color: {
        type: String,
        required: true,
        validator: (value) => ['gold', 'platinum', 'diamond'].includes(value)
    },
    featured: {
        type: Boolean,
        default: false
    }
});
</script>
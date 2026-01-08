<!-- src/views/pages/components/campaigns/OccasionCard.vue -->
<template>
    <div class="relative rounded-lg overflow-hidden group cursor-pointer">
        <!-- Background Image -->
        <img :src="image" :alt="title"
            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />

        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
            <h3 class="text-xl font-bold text-white mb-2">{{ title }}</h3>
            <p class="text-white text-sm opacity-90">{{ description }}</p>

            <!-- Hover Button -->
            <button
                class="mt-4 bg-white text-[#24a6bb] px-4 py-2 rounded-lg opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Shop Now
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});
</script>
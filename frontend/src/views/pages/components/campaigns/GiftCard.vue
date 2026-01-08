<!-- src/views/pages/components/campaigns/GiftCard.vue -->
<template>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <!-- Image -->
        <div class="relative h-48">
            <img :src="image" :alt="name" class="w-full h-full object-cover" />
            <button
                class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                @click="toggleFavorite">
                <Heart class="w-5 h-5" :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'" />
            </button>
        </div>

        <!-- Content -->
        <div class="p-4">
            <h3 class="text-lg font-semibold text-[#2d3642] mb-1">{{ name }}</h3>
            <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center">
                    <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span class="text-sm text-gray-600 ml-1">{{ rating }}</span>
                </div>
                <span class="text-sm text-gray-500">({{ reviews }} reviews)</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-[#24a6bb]">{{ price }}</span>
                <button class="text-[#24a6bb] hover:text-[#1a7f8f] font-medium">
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Heart, Star } from 'lucide-vue-next';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    reviews: {
        type: Number,
        required: true
    }
});

const isFavorite = ref(false);

const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value;
};
</script>
<!-- src/views/pages/campaigns/GiftIdeas.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-gradient-to-r from-[#ff6b6b] to-[#ee5253]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Gift Ideas</h1>
                            <p class="text-lg opacity-90">Perfect presents for every occasion</p>
                        </div>
                        <Gift class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <!-- Categories -->
            <section class="mb-12">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-[#2d3642]">Gift Categories</h2>
                    <div class="flex gap-2">
                        <button v-for="category in categories" :key="category" @click="selectedCategory = category"
                            class="px-4 py-2 rounded-full transition-colors" :class="selectedCategory === category ?
                                'bg-[#24a6bb] text-white' :
                                'bg-white text-gray-600 hover:bg-gray-100'">
                            {{ category }}
                        </button>
                    </div>
                </div>

                <!-- Gift Items Grid -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <GiftCard v-for="gift in filteredGifts" :key="gift.id" v-bind="gift" />
                </div>
            </section>

            <!-- Gift Occasions -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Shop by Occasion</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <OccasionCard v-for="occasion in occasions" :key="occasion.id" v-bind="occasion" />
                </div>
            </section>

            <!-- Gift Guides -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Gift Guides</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GuideCard v-for="guide in giftGuides" :key="guide.id" v-bind="guide" />
                </div>
            </section>

            <!-- Gift Services -->
            <section class="mt-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Gift Services</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ServiceCard icon="Gift" title="Gift Wrapping"
                        description="Professional wrapping service with premium materials" />
                    <ServiceCard icon="MessageSquare" title="Gift Message"
                        description="Add a personal message to your gift" />
                    <ServiceCard icon="Truck" title="Gift Delivery"
                        description="Schedule delivery for special occasions" />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Gift } from 'lucide-vue-next';
import GiftCard from '../components/campaigns/GiftCard.vue';
import OccasionCard from '../components/campaigns/OccasionCard.vue';
import GuideCard from '../components/campaigns/GuideCard.vue';
import ServiceCard from '../components/campaigns/ServiceCard.vue';
import image from '../../../assets/images/Kyrian.png';

const categories = ['All', 'For Him', 'For Her', 'Kids', 'Tech'];
const selectedCategory = ref('All');

const gifts = ref([
    {
        id: 1,
        name: 'Smart Watch',
        price: '₦45,000',
        image: image,
        category: 'Tech',
        rating: 4.5,
        reviews: 128
    },
    // Add more gift items
]);

const occasions = ref([
    {
        id: 1,
        title: 'Birthday',
        image: image,
        description: 'Find the perfect birthday gift'
    },
    // Add more occasions
]);

const giftGuides = ref([
    {
        id: 1,
        title: 'Tech Lovers Guide',
        description: 'The best gadgets and accessories for tech enthusiasts',
        image: image,
    },
    // Add more guides
]);

const filteredGifts = computed(() => {
    if (selectedCategory.value === 'All') {
        return gifts.value;
    }
    return gifts.value.filter(gift => gift.category === selectedCategory.value);
});
</script>
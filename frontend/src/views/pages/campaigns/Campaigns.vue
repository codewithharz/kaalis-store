<!-- src/views/pages/campaigns/Campaigns.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Special Campaigns</h1>
                            <p class="text-lg opacity-90">Discover our exclusive offers and rewards</p>
                        </div>
                        <Sparkles class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <!-- Campaign Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Shopping Credit Card -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="h-48 bg-gradient-to-r from-[#24a6bb] to-[#1a7f8f] p-6 flex items-center">
                        <Wallet class="w-20 h-20 text-white opacity-20" />
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-[#2d3642] mb-2">Shopping Credit</h3>
                        <p class="text-gray-600 mb-4">Earn credits on purchases and save on your next shopping</p>
                        <router-link to="/page/campaigns/shopping-credit"
                            class="inline-block bg-[#24a6bb] text-white px-6 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                            Learn More
                        </router-link>
                    </div>
                </div>

                <!-- Elite Membership Card -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="h-48 bg-gradient-to-r from-[#ffd700] to-[#ffa500] p-6 flex items-center">
                        <Crown class="w-20 h-20 text-white opacity-20" />
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-[#2d3642] mb-2">Elite Membership</h3>
                        <p class="text-gray-600 mb-4">Exclusive benefits and premium services for our loyal customers
                        </p>
                        <router-link to="/page/campaigns/elite-membership"
                            class="inline-block bg-[#24a6bb] text-white px-6 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                            Learn More
                        </router-link>
                    </div>
                </div>

                <!-- Gift Ideas Card -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div class="h-48 bg-gradient-to-r from-[#ff6b6b] to-[#ee5253] p-6 flex items-center">
                        <Gift class="w-20 h-20 text-white opacity-20" />
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-[#2d3642] mb-2">Gift Ideas</h3>
                        <p class="text-gray-600 mb-4">Perfect presents for every occasion and budget</p>
                        <router-link to="/page/campaigns/gift-ideas"
                            class="inline-block bg-[#24a6bb] text-white px-6 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                            Learn More
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- Current Promotions -->
            <section class="mt-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Current Promotions</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PromotionCard v-for="promo in promotions" :key="promo.id" :title="promo.title"
                        :description="promo.description" :endDate="promo.endDate" :discount="promo.discount" />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Sparkles, Wallet, Crown, Gift } from 'lucide-vue-next';
import PromotionCard from '../components/campaigns/PromotionCard.vue';

const promotions = ref([
    {
        id: 1,
        title: "Summer Sale",
        description: "Up to 50% off on summer collection",
        endDate: "2025-02-28",
        discount: "50%"
    },
    {
        id: 2,
        title: "New User Special",
        description: "Get extra 10% off on your first purchase",
        endDate: "2025-03-15",
        discount: "10%"
    }
]);
</script>
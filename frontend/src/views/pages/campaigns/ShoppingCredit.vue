<!-- src/views/pages/campaigns/ShoppingCredit.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Shopping Credit</h1>
                            <p class="text-lg opacity-90">Earn and spend credits on your favorite items</p>
                        </div>
                        <Wallet class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
                <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CreditInfoCard title="Current Balance" :amount="1250" icon="Coins" buttonText="View History" />
                        <CreditInfoCard title="Pending Credits" :amount="350" icon="Clock" buttonText="View Details" />
                        <CreditInfoCard title="Total Earned" :amount="2500" icon="TrendingUp" buttonText="View Stats" />
                    </div>
                </div>
            </section>

            <!-- Ways to Earn -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Ways to Earn Credits</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EarnMethodCard title="Make Purchases" description="Earn 5% back in credits on every purchase"
                        icon="ShoppingCart" />
                    <EarnMethodCard title="Write Reviews" description="Earn 50 credits for each verified review"
                        icon="Star" />
                    <EarnMethodCard title="Refer Friends" description="Get 200 credits for each referral"
                        icon="UserPlus" />
                    <EarnMethodCard title="Special Events" description="Double credits during special promotions"
                        icon="Gift" />
                </div>
            </section>

            <!-- How to Use -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">How to Use Credits</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Shop</h3>
                        <p class="text-gray-600">Add items to your cart</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Apply</h3>
                        <p class="text-gray-600">Select credits at checkout</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <TagIcon class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Save</h3>
                        <p class="text-gray-600">Enjoy instant discounts</p>
                    </div>
                </div>
            </section>

            <!-- Terms -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Important Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Terms & Conditions</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li>• Credits expire after 12 months</li>
                            <li>• Maximum 500 credits per transaction</li>
                            <li>• Cannot be combined with other offers</li>
                            <li>• Non-transferable and non-refundable</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Restrictions</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li>• Not applicable on gift cards</li>
                            <li>• Minimum purchase amount applies</li>
                            <li>• Subject to availability</li>
                            <li>• May be limited to specific categories</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import {
    Wallet, ShoppingCart, TagIcon,
    Star, UserPlus, Gift, Coins, Clock, TrendingUp
} from 'lucide-vue-next';
import CreditInfoCard from '../components/campaigns/CreditInfoCard.vue';
import EarnMethodCard from '../components/campaigns/EarnMethodCard.vue';
</script>
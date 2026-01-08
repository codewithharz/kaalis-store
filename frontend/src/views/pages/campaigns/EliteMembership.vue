<!-- src/views/pages/campaigns/EliteMembership.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-gradient-to-r from-[#ffd700] to-[#ffa500]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Elite Membership</h1>
                            <p class="text-lg opacity-90">Exclusive benefits for our valued members</p>
                        </div>
                        <Crown class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
                <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MembershipStatsCard title="Active Members" value="50K+" icon="Users"
                            description="Satisfied elite members" />
                        <MembershipStatsCard title="Average Savings" value="₦25,000" icon="Wallet"
                            description="Monthly member savings" />
                        <MembershipStatsCard title="Exclusive Deals" value="100+" icon="Tag"
                            description="Monthly special offers" />
                    </div>
                </div>
            </section>

            <!-- Membership Tiers -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Membership Tiers</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MembershipTierCard tier="Gold" price="₦5,000" period="month" :features="[
                        'Free shipping on all orders',
                        'Priority customer support',
                        '5% cashback on purchases',
                        'Early access to sales',
                        'Member-only deals'
                    ]" color="gold" />
                    <MembershipTierCard tier="Platinum" price="₦10,000" period="month" :features="[
                        'All Gold benefits',
                        '10% cashback on purchases',
                        'Free returns',
                        'Personal shopper',
                        'Exclusive events access'
                    ]" color="platinum" featured="true" />
                    <MembershipTierCard tier="Diamond" price="₦20,000" period="month" :features="[
                        'All Platinum benefits',
                        '15% cashback on purchases',
                        'Same-day delivery',
                        'VIP concierge service',
                        'Premium gift rewards'
                    ]" color="diamond" />
                </div>
            </section>

            <!-- Member Benefits -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Elite Benefits</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <BenefitCard title="Early Access" description="Shop new collections before anyone else"
                        icon="Clock" />
                    <BenefitCard title="Free Shipping" description="Complimentary shipping on all orders"
                        icon="Truck" />
                    <BenefitCard title="Member Prices" description="Special discounts just for members" icon="Tag" />
                    <BenefitCard title="VIP Support" description="24/7 priority customer service" icon="Headphones" />
                </div>
            </section>

            <!-- How It Works -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">How It Works</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard step="1" title="Choose Your Tier"
                        description="Select the membership level that suits your needs" />
                    <StepCard step="2" title="Complete Registration"
                        description="Fill in your details and set up payment" />
                    <StepCard step="3" title="Start Enjoying"
                        description="Immediately access all your elite benefits" />
                </div>
            </section>

            <!-- FAQ Section -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <FaqAccordion v-for="(faq, index) in faqs" :key="index" :question="faq.question"
                        :answer="faq.answer" />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Crown } from 'lucide-vue-next';
import MembershipStatsCard from '../components/campaigns/MembershipStatsCard.vue';
import MembershipTierCard from '../components/campaigns/MembershipTierCard.vue';
import BenefitCard from '../components/campaigns/BenefitCard.vue';
import StepCard from '../components/campaigns/StepCard.vue';
import FaqAccordion from '../components/campaigns/FaqAccordion.vue';

const faqs = ref([
    {
        question: "How do I upgrade my membership?",
        answer: "You can upgrade your membership at any time from your account settings. The new benefits will be available immediately, and the price difference will be prorated."
    },
    {
        question: "Can I cancel my membership?",
        answer: "Yes, you can cancel your membership at any time. Your benefits will continue until the end of your current billing period."
    },
    {
        question: "How do I redeem member benefits?",
        answer: "Member benefits are automatically applied to your account. You'll see the discounts and perks applied at checkout or when accessing services."
    },
    {
        question: "Is there a minimum commitment period?",
        answer: "No, our memberships are month-to-month with no long-term commitment required."
    }
]);
</script>
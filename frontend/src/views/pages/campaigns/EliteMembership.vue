<!-- src/views/pages/campaigns/EliteMembership.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-gradient-to-r from-[#ffd700] to-[#ffa500]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">{{ t('eliteMembershipPage.title') }}</h1>
                            <p class="text-lg opacity-90">{{ t('eliteMembershipPage.subtitle') }}</p>
                        </div>
                        <Crown class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
                <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MembershipStatsCard :title="t('eliteMembershipPage.stat1Title')" value="50K+" icon="Users"
                            :description="t('eliteMembershipPage.stat1Body')" />
                        <MembershipStatsCard :title="t('eliteMembershipPage.stat2Title')" value="₦25,000" icon="Wallet"
                            :description="t('eliteMembershipPage.stat2Body')" />
                        <MembershipStatsCard :title="t('eliteMembershipPage.stat3Title')" value="100+" icon="Tag"
                            :description="t('eliteMembershipPage.stat3Body')" />
                    </div>
                </div>
            </section>

            <!-- Membership Tiers -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('eliteMembershipPage.tiersTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MembershipTierCard :tier="t('eliteMembershipPage.gold')" price="₦5,000" :period="t('eliteMembershipPage.month')" :features="[
                        t('eliteMembershipPage.gold1'),
                        t('eliteMembershipPage.gold2'),
                        t('eliteMembershipPage.gold3'),
                        t('eliteMembershipPage.gold4'),
                        t('eliteMembershipPage.gold5')
                    ]" color="gold" />
                    <MembershipTierCard :tier="t('eliteMembershipPage.platinum')" price="₦10,000" :period="t('eliteMembershipPage.month')" :features="[
                        t('eliteMembershipPage.platinum1'),
                        t('eliteMembershipPage.platinum2'),
                        t('eliteMembershipPage.platinum3'),
                        t('eliteMembershipPage.platinum4'),
                        t('eliteMembershipPage.platinum5')
                    ]" color="platinum" featured="true" />
                    <MembershipTierCard :tier="t('eliteMembershipPage.diamond')" price="₦20,000" :period="t('eliteMembershipPage.month')" :features="[
                        t('eliteMembershipPage.diamond1'),
                        t('eliteMembershipPage.diamond2'),
                        t('eliteMembershipPage.diamond3'),
                        t('eliteMembershipPage.diamond4'),
                        t('eliteMembershipPage.diamond5')
                    ]" color="diamond" />
                </div>
            </section>

            <!-- Member Benefits -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('eliteMembershipPage.benefitsTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <BenefitCard :title="t('eliteMembershipPage.benefit1Title')" :description="t('eliteMembershipPage.benefit1Body')"
                        icon="Clock" />
                    <BenefitCard :title="t('eliteMembershipPage.benefit2Title')" :description="t('eliteMembershipPage.benefit2Body')"
                        icon="Truck" />
                    <BenefitCard :title="t('eliteMembershipPage.benefit3Title')" :description="t('eliteMembershipPage.benefit3Body')" icon="Tag" />
                    <BenefitCard :title="t('eliteMembershipPage.benefit4Title')" :description="t('eliteMembershipPage.benefit4Body')" icon="Headphones" />
                </div>
            </section>

            <!-- How It Works -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('eliteMembershipPage.howItWorks') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard step="1" :title="t('eliteMembershipPage.step1Title')"
                        :description="t('eliteMembershipPage.step1Body')" />
                    <StepCard step="2" :title="t('eliteMembershipPage.step2Title')"
                        :description="t('eliteMembershipPage.step2Body')" />
                    <StepCard step="3" :title="t('eliteMembershipPage.step3Title')"
                        :description="t('eliteMembershipPage.step3Body')" />
                </div>
            </section>

            <!-- FAQ Section -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('faqPage.title') }}</h2>
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
import { useI18n } from 'vue-i18n';
import { Crown } from 'lucide-vue-next';
import MembershipStatsCard from '../components/campaigns/MembershipStatsCard.vue';
import MembershipTierCard from '../components/campaigns/MembershipTierCard.vue';
import BenefitCard from '../components/campaigns/BenefitCard.vue';
import StepCard from '../components/campaigns/StepCard.vue';
import FaqAccordion from '../components/campaigns/FaqAccordion.vue';
const { t } = useI18n();

const faqs = ref([
    {
        question: t('eliteMembershipPage.faq1Question'),
        answer: t('eliteMembershipPage.faq1Answer')
    },
    {
        question: t('eliteMembershipPage.faq2Question'),
        answer: t('eliteMembershipPage.faq2Answer')
    },
    {
        question: t('eliteMembershipPage.faq3Question'),
        answer: t('eliteMembershipPage.faq3Answer')
    },
    {
        question: t('eliteMembershipPage.faq4Question'),
        answer: t('eliteMembershipPage.faq4Answer')
    }
]);
</script>

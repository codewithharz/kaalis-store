<!-- src/views/pages/campaigns/ShoppingCredit.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">{{ t('shoppingCreditPage.title') }}</h1>
                            <p class="text-lg opacity-90">{{ t('shoppingCreditPage.subtitle') }}</p>
                        </div>
                        <Wallet class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
                <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CreditInfoCard :title="t('shoppingCreditPage.balanceTitle')" :amount="1250" icon="Coins" :buttonText="t('shoppingCreditPage.viewHistory')" />
                        <CreditInfoCard :title="t('shoppingCreditPage.pendingTitle')" :amount="350" icon="Clock" :buttonText="t('shoppingCreditPage.viewDetails')" />
                        <CreditInfoCard :title="t('shoppingCreditPage.totalEarnedTitle')" :amount="2500" icon="TrendingUp" :buttonText="t('shoppingCreditPage.viewStats')" />
                    </div>
                </div>
            </section>

            <!-- Ways to Earn -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('shoppingCreditPage.waysToEarn') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EarnMethodCard :title="t('shoppingCreditPage.earn1Title')" :description="t('shoppingCreditPage.earn1Body')"
                        icon="ShoppingCart" />
                    <EarnMethodCard :title="t('shoppingCreditPage.earn2Title')" :description="t('shoppingCreditPage.earn2Body')"
                        icon="Star" />
                    <EarnMethodCard :title="t('shoppingCreditPage.earn3Title')" :description="t('shoppingCreditPage.earn3Body')"
                        icon="UserPlus" />
                    <EarnMethodCard :title="t('shoppingCreditPage.earn4Title')" :description="t('shoppingCreditPage.earn4Body')"
                        icon="Gift" />
                </div>
            </section>

            <!-- How to Use -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('shoppingCreditPage.howToUse') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">{{ t('shoppingCreditPage.use1Title') }}</h3>
                        <p class="text-gray-600">{{ t('shoppingCreditPage.use1Body') }}</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">{{ t('shoppingCreditPage.use2Title') }}</h3>
                        <p class="text-gray-600">{{ t('shoppingCreditPage.use2Body') }}</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <TagIcon class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">{{ t('shoppingCreditPage.use3Title') }}</h3>
                        <p class="text-gray-600">{{ t('shoppingCreditPage.use3Body') }}</p>
                    </div>
                </div>
            </section>

            <!-- Terms -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('shoppingCreditPage.infoTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('shoppingCreditPage.termsTitle') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li>• {{ t('shoppingCreditPage.term1') }}</li>
                            <li>• {{ t('shoppingCreditPage.term2') }}</li>
                            <li>• {{ t('shoppingCreditPage.term3') }}</li>
                            <li>• {{ t('shoppingCreditPage.term4') }}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('shoppingCreditPage.restrictionsTitle') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li>• {{ t('shoppingCreditPage.restriction1') }}</li>
                            <li>• {{ t('shoppingCreditPage.restriction2') }}</li>
                            <li>• {{ t('shoppingCreditPage.restriction3') }}</li>
                            <li>• {{ t('shoppingCreditPage.restriction4') }}</li>
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
import { useI18n } from 'vue-i18n';
import CreditInfoCard from '../components/campaigns/CreditInfoCard.vue';
import EarnMethodCard from '../components/campaigns/EarnMethodCard.vue';
const { t } = useI18n();
</script>

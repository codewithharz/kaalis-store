<!-- src/views/CareerSustainability.vue -->
<template>
    <div class="career-sustainability">
        <!-- Hero Section -->
        <header class="relative h-[20vh] max-h-[200px] overflow-hidden">
            <img src="../../assets/images/Kyrian.png" :alt="t('careerSustainabilityPage.heroAlt')"
                class="w-full h-[400px] object-cover object-center" />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center">
                <div class="container mx-auto px-4">
                    <h1 class="text-3xl md:text-4xl text-white font-bold mb-2">{{ t('careerSustainabilityPage.heroTitle') }}</h1>
                    <p class="text-lg text-white max-w-2xl">{{ t('careerSustainabilityPage.heroBody') }}</p>
                </div>
            </div>
        </header>

        <div class="container mx-auto px-4 py-12">
            <!-- Our Commitment Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerSustainabilityPage.commitmentTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SustainabilityCard icon="Leaf" :title="t('careerSustainabilityPage.card1Title')"
                        :description="t('careerSustainabilityPage.card1Body')" />
                    <SustainabilityCard icon="Users" :title="t('careerSustainabilityPage.card2Title')"
                        :description="t('careerSustainabilityPage.card2Body')" />
                    <SustainabilityCard icon="Shield" :title="t('careerSustainabilityPage.card3Title')"
                        :description="t('careerSustainabilityPage.card3Body')" />
                </div>
            </section>

            <!-- Key Initiatives -->
            <section class="mb-16 bg-gray-50 p-8 rounded-lg">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerSustainabilityPage.keyInitiatives') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InitiativeCard :title="t('careerSustainabilityPage.initiative1Title')" :points="[
                        t('careerSustainabilityPage.initiative1Point1'),
                        t('careerSustainabilityPage.initiative1Point2'),
                        t('careerSustainabilityPage.initiative1Point3'),
                        t('careerSustainabilityPage.initiative1Point4')
                    ]" />
                    <InitiativeCard :title="t('careerSustainabilityPage.initiative2Title')" :points='[
                        t("careerSustainabilityPage.initiative2Point1"),
                        t("careerSustainabilityPage.initiative2Point2"),
                        t("careerSustainabilityPage.initiative2Point3"),
                        t("careerSustainabilityPage.initiative2Point4")
                    ]' />
                    <InitiativeCard :title="t('careerSustainabilityPage.initiative3Title')" :points="[
                        t('careerSustainabilityPage.initiative3Point1'),
                        t('careerSustainabilityPage.initiative3Point2'),
                        t('careerSustainabilityPage.initiative3Point3'),
                        t('careerSustainabilityPage.initiative3Point4')
                    ]" />
                    <InitiativeCard :title="t('careerSustainabilityPage.initiative4Title')" :points='[
                        t("careerSustainabilityPage.initiative4Point1"),
                        t("careerSustainabilityPage.initiative4Point2"),
                        t("careerSustainabilityPage.initiative4Point3"),
                        t("careerSustainabilityPage.initiative4Point4")
                    ]' />
                </div>
            </section>

            <!-- Environmental Goals -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerSustainabilityPage.goalsTitle') }}</h2>
                <div class="space-y-8">
                    <GoalProgress :title="t('careerSustainabilityPage.goal1Title')" currentValue="60" target="100" targetYear="2025"
                        :description="t('careerSustainabilityPage.goal1Body')" />
                    <GoalProgress :title="t('careerSustainabilityPage.goal2Title')" currentValue="75" target="100" targetYear="2024"
                        :description="t('careerSustainabilityPage.goal2Body')" />
                    <GoalProgress :title="t('careerSustainabilityPage.goal3Title')" currentValue="80" target="100" targetYear="2023"
                        :description="t('careerSustainabilityPage.goal3Body')" />
                </div>
            </section>

            <!-- Join Our Mission -->
            <section class="text-center py-16 bg-[#e6f4f7] rounded-lg">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-4">{{ t('careerSustainabilityPage.ctaTitle') }}</h2>
                <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{{ t('careerSustainabilityPage.ctaBody') }}</p>
                <div class="flex justify-center gap-4">
                    <button
                        class="bg-[#24a6bb] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1a7f8f] transition duration-300">
                        {{ t('careerSustainabilityPage.viewOpenPositions') }}
                    </button>
                    <button
                        class="border-2 border-[#24a6bb] text-[#24a6bb] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#24a6bb] hover:text-white transition duration-300">
                        {{ t('careerSustainabilityPage.learnMore') }}
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import SustainabilityCard from './components/sustainability/SustainabilityCard.vue';
import InitiativeCard from './components/sustainability/InitiativeCard.vue';
import GoalProgress from './components/sustainability/GoalProgress.vue';
const { t } = useI18n();
</script>

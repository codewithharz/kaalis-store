<!-- src/views/CareerPage.vue -->
<template>
    <div class="career-page">
        <!-- Hero Section -->
        <header class="relative h-[60vh] overflow-hidden">
            <img src="../../assets/images/workers.jpg" :alt="t('careerPage.heroAlt')" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center">
                <div class="container mx-auto px-4">
                    <h1 class="text-4xl md:text-6xl text-white font-bold mb-4">{{ t('careerPage.heroTitle') }}</h1>
                    <p class="text-xl text-white mb-8 max-w-2xl">{{ t('careerPage.heroBody') }}</p>
                    <button
                        class="bg-[#24a6bb] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1a7f8f] transition duration-300">
                        {{ t('careerPage.viewOpenPositions') }}
                    </button>
                </div>
            </div>
        </header>

        <div class="container mx-auto px-4 py-12">
            <!-- Why Join Us Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerPage.whyJoinTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CareerFeatureCard icon="Lightbulb" :title="t('careerPage.feature1Title')"
                        :description="t('careerPage.feature1Body')" />
                    <CareerFeatureCard icon="Users" :title="t('careerPage.feature2Title')"
                        :description="t('careerPage.feature2Body')" />
                    <CareerFeatureCard icon="TrendingUp" :title="t('careerPage.feature3Title')"
                        :description="t('careerPage.feature3Body')" />
                </div>
            </section>

            <!-- Life at Bruthol Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerPage.lifeTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <h3 class="text-2xl font-semibold mb-4">{{ t('careerPage.cultureTitle') }}</h3>
                        <ul class="space-y-4">
                            <CareerCultureItem icon="Heart" :title="t('careerPage.culture1Title')"
                                :description="t('careerPage.culture1Body')" />
                            <CareerCultureItem icon="Target" :title="t('careerPage.culture2Title')"
                                :description="t('careerPage.culture2Body')" />
                            <CareerCultureItem icon="Award" :title="t('careerPage.culture3Title')"
                                :description="t('careerPage.culture3Body')" />
                        </ul>
                    </div>
                    <div class="relative h-[400px] rounded-lg overflow-hidden">
                        <img src="../../assets/images/Kyrian.png" :alt="t('careerPage.lifeImageAlt')"
                            class="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            <!-- Current Opportunities Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerPage.currentOpportunities') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CareerJobCard v-for="job in currentJobs" :key="job.id" :title="job.title"
                        :department="job.department" :location="job.location" :type="job.type" />
                </div>
            </section>

            <!-- Benefits Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerPage.benefitsTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <CareerBenefitCard v-for="benefit in benefits" :key="benefit.id" :icon="benefit.icon"
                        :title="benefit.title" :description="benefit.description" />
                </div>
            </section>

            <!-- Development Programs -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerPage.developmentPrograms') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CareerProgramCard :title="t('careerPage.program1Title')"
                        :description="t('careerPage.program1Body')"
                        icon="GraduationCap" />
                    <CareerProgramCard :title="t('careerPage.program2Title')"
                        :description="t('careerPage.program2Body')"
                        icon="Code" />
                    <CareerProgramCard :title="t('careerPage.program3Title')"
                        :description="t('careerPage.program3Body')"
                        icon="Trophy" />
                </div>
            </section>

            <!-- Application Process -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('careerPage.applicationProcess') }}</h2>
                <div class="relative">
                    <div class="absolute left-1/2 top-0 h-full w-px bg-[#24a6bb] transform -translate-x-1/2"></div>
                    <div class="space-y-12 relative">
                        <CareerProcessStep step="1" :title="t('careerPage.step1Title')"
                            :description="t('careerPage.step1Body')" />
                        <CareerProcessStep step="2" :title="t('careerPage.step2Title')"
                            :description="t('careerPage.step2Body')" />
                        <CareerProcessStep step="3" :title="t('careerPage.step3Title')"
                            :description="t('careerPage.step3Body')" />
                        <CareerProcessStep step="4" :title="t('careerPage.step4Title')"
                            :description="t('careerPage.step4Body')" />
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="text-center py-16 bg-gray-50 rounded-lg">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-4">{{ t('careerPage.ctaTitle') }}</h2>
                <p class="text-lg text-gray-600 mb-8">{{ t('careerPage.ctaBody') }}</p>
                <button
                    class="bg-[#24a6bb] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1a7f8f] transition duration-300">
                    {{ t('careerPage.browsePositions') }}
                </button>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CareerFeatureCard from './components/career/CareerFeatureCard.vue';
import CareerCultureItem from './components/career/CareerCultureItem.vue';
import CareerJobCard from './components/career/CareerJobCard.vue';
import CareerBenefitCard from './components/career/CareerBenefitCard.vue';
import CareerProgramCard from './components/career/CareerProgramCard.vue';
import CareerProcessStep from './components/career/CareerProcessStep.vue';
const { t } = useI18n();

const currentJobs = ref([
    {
        id: 1,
        title: t('careerPage.job1Title'),
        department: t('careerPage.job1Department'),
        location: t('careerPage.job1Location'),
        type: t('careerPage.jobTypeFullTime')
    },
    {
        id: 2,
        title: t('careerPage.job2Title'),
        department: t('careerPage.job2Department'),
        location: t('careerPage.job2Location'),
        type: t('careerPage.jobTypeFullTime')
    }
]);

const benefits = ref([
    {
        id: 1,
        icon: "Heart",
        title: t('careerPage.benefit1Title'),
        description: t('careerPage.benefit1Body')
    },
    {
        id: 2,
        icon: "Book",
        title: t('careerPage.benefit2Title'),
        description: t('careerPage.benefit2Body')
    }
]);
</script>

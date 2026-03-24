<!-- frontend/src/views/pages/seller/BasicConcepts.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">{{ t('sellerBasicConceptsPage.heroTitle') }}</h1>
                            <p class="text-lg opacity-90">{{ t('sellerBasicConceptsPage.heroSubtitle') }}</p>
                        </div>
                        <BookOpen class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <!-- Quick Navigation -->
            <section class="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div class="flex flex-wrap gap-4">
                    <button v-for="section in sections" :key="section.id" @click="scrollToSection(section.id)"
                        class="px-4 py-2 rounded-full text-sm transition-colors" :class="activeSection === section.id ?
                            'bg-[#24a6bb] text-white' :
                            'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                        {{ section.name }}
                    </button>
                </div>
            </section>

            <!-- Account Types -->
            <section id="account-types" class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('sellerBasicConceptsPage.accountTypesTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="type in accountTypes" :key="type.id"
                        class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
                            <component :is="type.icon" class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ type.name }}</h3>
                        <p class="text-gray-600 mb-4">{{ type.description }}</p>
                        <ul class="space-y-2">
                            <li v-for="feature in type.features" :key="feature" class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                <span class="text-gray-600 text-sm">{{ feature }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Selling Process -->
            <section id="selling-process" class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('sellerBasicConceptsPage.sellingProcessTitle') }}</h2>
                <div class="space-y-8">
                    <div v-for="(step, index) in sellingSteps" :key="index" class="flex">
                        <div class="flex-shrink-0 mr-6">
                            <div class="w-10 h-10 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                                <span class="text-[#24a6bb] font-bold">{{ index + 1 }}</span>
                            </div>
                            <div v-if="index < sellingSteps.length - 1" class="w-0.5 h-24 bg-gray-200 mx-auto mt-2">
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ step.title }}</h3>
                            <p class="text-gray-600 mb-3">{{ step.description }}</p>
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-[#24a6bb] mb-2">{{ t('sellerBasicConceptsPage.bestPracticesTitle') }}</h4>
                                <ul class="space-y-2">
                                    <li v-for="practice in step.bestPractices" :key="practice" class="flex items-start">
                                        <Lightbulb class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                        <span class="text-gray-600 text-sm">{{ practice }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Fees and Pricing -->
            <section id="fees-pricing" class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('sellerBasicConceptsPage.feesAndPricingTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('sellerBasicConceptsPage.feeStructureTitle') }}</h3>
                        <div class="space-y-4">
                            <div v-for="fee in fees" :key="fee.name" class="border-b pb-4 last:border-b-0">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 class="font-medium text-[#2d3642]">{{ fee.name }}</h4>
                                        <p class="text-gray-600 text-sm">{{ fee.description }}</p>
                                    </div>
                                    <span class="text-[#24a6bb] font-semibold">{{ fee.rate }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('sellerBasicConceptsPage.pricingTipsTitle') }}</h3>
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <ul class="space-y-4">
                                <li v-for="tip in pricingTips" :key="tip" class="flex items-start">
                                    <AlertCircle class="w-5 h-5 text-[#24a6bb] mr-3 flex-shrink-0 mt-0.5" />
                                    <span class="text-gray-600 text-sm">{{ tip }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Policies and Guidelines -->
            <section id="policies" class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('sellerBasicConceptsPage.policiesTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div v-for="policy in policies" :key="policy.title">
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ policy.title }}</h3>
                        <ul class="space-y-3">
                            <li v-for="(item, index) in policy.items" :key="index" class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                <span class="text-gray-600">{{ item }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Help Box -->
                <div class="mt-8 bg-[#e6f4f7] p-6 rounded-lg">
                    <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('sellerBasicConceptsPage.helpTitle') }}</h3>
                    <p class="text-gray-600 mb-4">{{ t('sellerBasicConceptsPage.helpBody') }}</p>
                    <div class="flex space-x-4">
                        <router-link to="/seller/academy"
                            class="bg-[#24a6bb] text-white px-4 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                            {{ t('sellerBasicConceptsPage.visitAcademy') }}
                        </router-link>
                        <router-link to="/help/live-help"
                            class="border border-[#24a6bb] text-[#24a6bb] px-4 py-2 rounded-lg hover:bg-[#24a6bb] hover:text-white transition-colors">
                            {{ t('sellerBasicConceptsPage.contactSupport') }}
                        </router-link>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    BookOpen,
    Check,
    Lightbulb,
    AlertCircle,
    Store,
    Building2,
    User
} from 'lucide-vue-next';

const { t } = useI18n();
const activeSection = ref('account-types');

const sections = [
    { id: 'account-types', name: t('sellerBasicConceptsPage.nav.accountTypes') },
    { id: 'selling-process', name: t('sellerBasicConceptsPage.nav.sellingProcess') },
    { id: 'fees-pricing', name: t('sellerBasicConceptsPage.nav.feesPricing') },
    { id: 'policies', name: t('sellerBasicConceptsPage.nav.policies') }
];

const accountTypes = [
    {
        id: 1,
        name: t('sellerBasicConceptsPage.accountTypes.individual.name'),
        icon: User,
        description: t('sellerBasicConceptsPage.accountTypes.individual.description'),
        features: [
            t('sellerBasicConceptsPage.accountTypes.individual.feature1'),
            t('sellerBasicConceptsPage.accountTypes.individual.feature2'),
            t('sellerBasicConceptsPage.accountTypes.individual.feature3'),
            t('sellerBasicConceptsPage.accountTypes.individual.feature4')
        ]
    },
    {
        id: 2,
        name: t('sellerBasicConceptsPage.accountTypes.business.name'),
        icon: Store,
        description: t('sellerBasicConceptsPage.accountTypes.business.description'),
        features: [
            t('sellerBasicConceptsPage.accountTypes.business.feature1'),
            t('sellerBasicConceptsPage.accountTypes.business.feature2'),
            t('sellerBasicConceptsPage.accountTypes.business.feature3'),
            t('sellerBasicConceptsPage.accountTypes.business.feature4')
        ]
    },
    {
        id: 3,
        name: t('sellerBasicConceptsPage.accountTypes.enterprise.name'),
        icon: Building2,
        description: t('sellerBasicConceptsPage.accountTypes.enterprise.description'),
        features: [
            t('sellerBasicConceptsPage.accountTypes.enterprise.feature1'),
            t('sellerBasicConceptsPage.accountTypes.enterprise.feature2'),
            t('sellerBasicConceptsPage.accountTypes.enterprise.feature3'),
            t('sellerBasicConceptsPage.accountTypes.enterprise.feature4')
        ]
    }
];

const sellingSteps = [
    {
        title: t('sellerBasicConceptsPage.sellingSteps.step1.title'),
        description: t('sellerBasicConceptsPage.sellingSteps.step1.description'),
        bestPractices: [
            t('sellerBasicConceptsPage.sellingSteps.step1.practice1'),
            t('sellerBasicConceptsPage.sellingSteps.step1.practice2'),
            t('sellerBasicConceptsPage.sellingSteps.step1.practice3')
        ]
    },
    {
        title: t('sellerBasicConceptsPage.sellingSteps.step2.title'),
        description: t('sellerBasicConceptsPage.sellingSteps.step2.description'),
        bestPractices: [
            t('sellerBasicConceptsPage.sellingSteps.step2.practice1'),
            t('sellerBasicConceptsPage.sellingSteps.step2.practice2'),
            t('sellerBasicConceptsPage.sellingSteps.step2.practice3'),
            t('sellerBasicConceptsPage.sellingSteps.step2.practice4')
        ]
    },
    {
        title: t('sellerBasicConceptsPage.sellingSteps.step3.title'),
        description: t('sellerBasicConceptsPage.sellingSteps.step3.description'),
        bestPractices: [
            t('sellerBasicConceptsPage.sellingSteps.step3.practice1'),
            t('sellerBasicConceptsPage.sellingSteps.step3.practice2'),
            t('sellerBasicConceptsPage.sellingSteps.step3.practice3'),
            t('sellerBasicConceptsPage.sellingSteps.step3.practice4')
        ]
    },
    {
        title: t('sellerBasicConceptsPage.sellingSteps.step4.title'),
        description: t('sellerBasicConceptsPage.sellingSteps.step4.description'),
        bestPractices: [
            t('sellerBasicConceptsPage.sellingSteps.step4.practice1'),
            t('sellerBasicConceptsPage.sellingSteps.step4.practice2'),
            t('sellerBasicConceptsPage.sellingSteps.step4.practice3'),
            t('sellerBasicConceptsPage.sellingSteps.step4.practice4')
        ]
    }
];

const fees = [
    {
        name: t('sellerBasicConceptsPage.fees.listing.name'),
        description: t('sellerBasicConceptsPage.fees.listing.description'),
        rate: t('sellerBasicConceptsPage.fees.listing.rate')
    },
    {
        name: t('sellerBasicConceptsPage.fees.commission.name'),
        description: t('sellerBasicConceptsPage.fees.commission.description'),
        rate: t('sellerBasicConceptsPage.fees.commission.rate')
    },
    {
        name: t('sellerBasicConceptsPage.fees.paymentProcessing.name'),
        description: t('sellerBasicConceptsPage.fees.paymentProcessing.description'),
        rate: t('sellerBasicConceptsPage.fees.paymentProcessing.rate')
    },
    {
        name: t('sellerBasicConceptsPage.fees.subscription.name'),
        description: t('sellerBasicConceptsPage.fees.subscription.description'),
        rate: t('sellerBasicConceptsPage.fees.subscription.rate')
    }
];

const pricingTips = [
    t('sellerBasicConceptsPage.pricingTips.tip1'),
    t('sellerBasicConceptsPage.pricingTips.tip2'),
    t('sellerBasicConceptsPage.pricingTips.tip3'),
    t('sellerBasicConceptsPage.pricingTips.tip4'),
    t('sellerBasicConceptsPage.pricingTips.tip5')
];

const policies = [
    {
        title: t('sellerBasicConceptsPage.policies.productGuidelines.title'),
        items: [
            t('sellerBasicConceptsPage.policies.productGuidelines.item1'),
            t('sellerBasicConceptsPage.policies.productGuidelines.item2'),
            t('sellerBasicConceptsPage.policies.productGuidelines.item3'),
            t('sellerBasicConceptsPage.policies.productGuidelines.item4'),
            t('sellerBasicConceptsPage.policies.productGuidelines.item5')
        ]
    },
    {
        title: t('sellerBasicConceptsPage.policies.performanceStandards.title'),
        items: [
            t('sellerBasicConceptsPage.policies.performanceStandards.item1'),
            t('sellerBasicConceptsPage.policies.performanceStandards.item2'),
            t('sellerBasicConceptsPage.policies.performanceStandards.item3'),
            t('sellerBasicConceptsPage.policies.performanceStandards.item4'),
            t('sellerBasicConceptsPage.policies.performanceStandards.item5')
        ]
    }
];

const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        activeSection.value = sectionId;
    }
};

// Intersection Observer for section highlighting
const observeHeaders = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeSection.value = entry.target.id;
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) observer.observe(element);
    });

    return observer;
};

let observer;
onMounted(() => {
    observer = observeHeaders();
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>

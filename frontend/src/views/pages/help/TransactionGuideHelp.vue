<!-- src/views/pages/help/TransactionGuide.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">{{ t('transactionGuidePage.title') }}</h1>
                            <p class="text-lg opacity-90">{{ t('transactionGuidePage.subtitle') }}</p>
                        </div>
                        <ShieldCheck class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <!-- Quick Navigation -->
            <section class="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 class="text-lg font-semibold text-[#2d3642] mb-4">{{ t('transactionGuidePage.quickNavigation') }}</h2>
                <div class="flex flex-wrap gap-4">
                    <button v-for="section in sections" :key="section.id" @click="scrollToSection(section.id)"
                        class="px-4 py-2 rounded-full text-sm transition-colors" :class="activeSection === section.id ?
                            'bg-[#24a6bb] text-white' :
                            'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                        {{ section.name }}
                    </button>
                </div>
            </section>

            <!-- Purchase Process -->
            <section id="purchase-process" class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('transactionGuidePage.purchaseProcess') }}</h2>
                <div class="space-y-8">
                    <div v-for="(step, index) in purchaseSteps" :key="index" class="flex">
                        <div class="flex-shrink-0 mr-6">
                            <div class="w-10 h-10 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                                <span class="text-[#24a6bb] font-bold">{{ index + 1 }}</span>
                            </div>
                            <div v-if="index < purchaseSteps.length - 1" class="w-0.5 h-16 bg-gray-200 mx-auto mt-2">
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ step.title }}</h3>
                            <p class="text-gray-600 mb-3">{{ step.description }}</p>
                            <div v-if="step.tips" class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-[#24a6bb] mb-2">{{ t('transactionGuidePage.tips') }}</h4>
                                <ul class="space-y-2">
                                    <li v-for="(tip, tipIndex) in step.tips" :key="tipIndex" class="flex items-start">
                                        <Lightbulb class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                        <span class="text-gray-600">{{ tip }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Payment Methods -->
            <section id="payment-methods" class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('transactionGuidePage.paymentMethods') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="method in paymentMethods" :key="method.id" class="p-6 border rounded-lg">
                        <div class="flex items-start mb-4">
                            <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mr-4">
                                <component :is="method.icon" class="w-6 h-6 text-[#24a6bb]" />
                            </div>
                            <div>
                                <h3 class="font-semibold text-[#2d3642]">{{ method.name }}</h3>
                                <p class="text-gray-600 text-sm">{{ method.description }}</p>
                            </div>
                        </div>
                        <ul class="space-y-2">
                            <li v-for="(feature, index) in method.features" :key="index" class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                <span class="text-gray-600 text-sm">{{ feature }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Security Measures -->
            <section id="security" class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('transactionGuidePage.transactionSecurity') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('transactionGuidePage.securityMeasures') }}</h3>
                        <ul class="space-y-4">
                            <li v-for="(measure, index) in securityMeasures" :key="index" class="flex items-start">
                                <Shield class="w-5 h-5 text-[#24a6bb] mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 class="font-medium text-[#2d3642] mb-1">{{ measure.title }}</h4>
                                    <p class="text-gray-600 text-sm">{{ measure.description }}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('transactionGuidePage.safetyTips') }}</h3>
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <ul class="space-y-4">
                                <li v-for="(tip, index) in safetyTips" :key="index" class="flex items-start">
                                    <AlertCircle class="w-5 h-5 text-[#24a6bb] mr-3 flex-shrink-0 mt-0.5" />
                                    <span class="text-gray-600 text-sm">{{ tip }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Buyer Protection -->
            <section id="protection" class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('transactionGuidePage.buyerProtection') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('transactionGuidePage.whatsCovered') }}</h3>
                        <ul class="space-y-3">
                            <li v-for="(item, index) in protectionCoverage" :key="index" class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                <span class="text-gray-600">{{ item }}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div class="bg-[#e6f4f7] p-6 rounded-lg">
                            <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('transactionGuidePage.needHelp') }}</h3>
                            <p class="text-gray-600 mb-4">{{ t('transactionGuidePage.needHelpBody') }}</p>
                            <div class="flex space-x-4">
                                <router-link to="/help/live-help"
                                    class="bg-[#24a6bb] text-white px-4 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                                    {{ t('transactionGuidePage.contactSupport') }}
                                </router-link>
                                <router-link to="/help/faq"
                                    class="border border-[#24a6bb] text-[#24a6bb] px-4 py-2 rounded-lg hover:bg-[#24a6bb] hover:text-white transition-colors">
                                    {{ t('transactionGuidePage.viewFaqs') }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    ShieldCheck,
    Lightbulb,
    Check,
    Shield,
    AlertCircle,
    CreditCard,
    Wallet,
    Smartphone,
    // Bank
} from 'lucide-vue-next';

const { t } = useI18n();
const activeSection = ref('purchase-process');

const sections = computed(() => [
    { id: 'purchase-process', name: t('transactionGuidePage.navPurchaseProcess') },
    { id: 'payment-methods', name: t('transactionGuidePage.navPaymentMethods') },
    { id: 'security', name: t('transactionGuidePage.navSecurity') },
    { id: 'protection', name: t('transactionGuidePage.navBuyerProtection') }
]);

const purchaseSteps = computed(() => [
    {
        title: t('transactionGuidePage.step1Title'),
        description: t('transactionGuidePage.step1Body'),
        tips: [
            t('transactionGuidePage.step1Tip1'),
            t('transactionGuidePage.step1Tip2'),
            t('transactionGuidePage.step1Tip3')
        ]
    },
    {
        title: t('transactionGuidePage.step2Title'),
        description: t('transactionGuidePage.step2Body'),
        tips: [
            t('transactionGuidePage.step2Tip1'),
            t('transactionGuidePage.step2Tip2'),
            t('transactionGuidePage.step2Tip3')
        ]
    },
    {
        title: t('transactionGuidePage.step3Title'),
        description: t('transactionGuidePage.step3Body'),
        tips: [
            t('transactionGuidePage.step3Tip1'),
            t('transactionGuidePage.step3Tip2'),
            t('transactionGuidePage.step3Tip3')
        ]
    },
    {
        title: t('transactionGuidePage.step4Title'),
        description: t('transactionGuidePage.step4Body'),
        tips: [
            t('transactionGuidePage.step4Tip1'),
            t('transactionGuidePage.step4Tip2'),
            t('transactionGuidePage.step4Tip3')
        ]
    }
]);

const paymentMethods = computed(() => [
    {
        id: 1,
        name: t('transactionGuidePage.method1Name'),
        icon: CreditCard,
        description: t('transactionGuidePage.method1Body'),
        features: [
            t('transactionGuidePage.method1Feature1'),
            t('transactionGuidePage.method1Feature2'),
            t('transactionGuidePage.method1Feature3')
        ]
    },
    {
        id: 2,
        name: t('transactionGuidePage.method2Name'),
        icon: Wallet,
        description: t('transactionGuidePage.method2Body'),
        features: [
            t('transactionGuidePage.method2Feature1'),
            t('transactionGuidePage.method2Feature2'),
            t('transactionGuidePage.method2Feature3')
        ]
    },
    {
        id: 3,
        name: t('transactionGuidePage.method3Name'),
        icon: Smartphone,
        description: t('transactionGuidePage.method3Body'),
        features: [
            t('transactionGuidePage.method3Feature1'),
            t('transactionGuidePage.method3Feature2'),
            t('transactionGuidePage.method3Feature3')
        ]
    }
]);

const securityMeasures = computed(() => [
    {
        title: t('transactionGuidePage.security1Title'),
        description: t('transactionGuidePage.security1Body')
    },
    {
        title: t('transactionGuidePage.security2Title'),
        description: t('transactionGuidePage.security2Body')
    },
    {
        title: t('transactionGuidePage.security3Title'),
        description: t('transactionGuidePage.security3Body')
    },
    {
        title: t('transactionGuidePage.security4Title'),
        description: t('transactionGuidePage.security4Body')
    }
]);

const safetyTips = computed(() => [
    t('transactionGuidePage.safetyTip1'),
    t('transactionGuidePage.safetyTip2'),
    t('transactionGuidePage.safetyTip3'),
    t('transactionGuidePage.safetyTip4'),
    t('transactionGuidePage.safetyTip5')
]);

const protectionCoverage = computed(() => [
    t('transactionGuidePage.coverage1'),
    t('transactionGuidePage.coverage2'),
    t('transactionGuidePage.coverage3'),
    t('transactionGuidePage.coverage4'),
    t('transactionGuidePage.coverage5')
]);

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

    sections.value.forEach(section => {
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

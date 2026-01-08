<!-- frontend/src/views/pages/seller/BasicConcepts.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Seller Basic Concepts</h1>
                            <p class="text-lg opacity-90">Essential knowledge for successful selling on Bruthol
                            </p>
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
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Account Types</h2>
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
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Selling Process</h2>
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
                                <h4 class="font-semibold text-[#24a6bb] mb-2">Best Practices:</h4>
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
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Fees and Pricing</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-4">Fee Structure</h3>
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
                        <h3 class="font-semibold text-[#24a6bb] mb-4">Pricing Tips</h3>
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
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Policies and Guidelines</h2>
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
                    <h3 class="font-semibold text-[#24a6bb] mb-4">Need More Help?</h3>
                    <p class="text-gray-600 mb-4">Still have questions about selling on Bruthol?</p>
                    <div class="flex space-x-4">
                        <router-link to="/seller/academy"
                            class="bg-[#24a6bb] text-white px-4 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                            Visit Seller Academy
                        </router-link>
                        <router-link to="/help/live-help"
                            class="border border-[#24a6bb] text-[#24a6bb] px-4 py-2 rounded-lg hover:bg-[#24a6bb] hover:text-white transition-colors">
                            Contact Support
                        </router-link>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
    BookOpen,
    Check,
    Lightbulb,
    AlertCircle,
    Store,
    Building2,
    User
} from 'lucide-vue-next';

const activeSection = ref('account-types');

const sections = [
    { id: 'account-types', name: 'Account Types' },
    { id: 'selling-process', name: 'Selling Process' },
    { id: 'fees-pricing', name: 'Fees & Pricing' },
    { id: 'policies', name: 'Policies' }
];

const accountTypes = [
    {
        id: 1,
        name: 'Individual Seller',
        icon: User,
        description: 'Perfect for small-scale sellers and personal businesses',
        features: [
            'Up to 50 listings per month',
            'Basic analytics',
            'Standard support',
            'Manual order processing'
        ]
    },
    {
        id: 2,
        name: 'Business Seller',
        icon: Store,
        description: 'Ideal for established businesses and high-volume sellers',
        features: [
            'Unlimited listings',
            'Advanced analytics',
            'Priority support',
            'Bulk order processing'
        ]
    },
    {
        id: 3,
        name: 'Enterprise Seller',
        icon: Building2,
        description: 'For large businesses and corporate sellers',
        features: [
            'Custom solutions',
            'API access',
            'Dedicated account manager',
            'Advanced integrations'
        ]
    }
];

const sellingSteps = [
    {
        title: 'Account Setup',
        description: 'Create and verify your seller account with required documentation.',
        bestPractices: [
            'Prepare all necessary business documents',
            'Use a professional email address',
            'Set up secure payment information'
        ]
    },
    {
        title: 'Product Listing',
        description: 'Create detailed product listings with high-quality images and descriptions.',
        bestPractices: [
            'Use clear, high-resolution photos',
            'Write detailed product descriptions',
            'Set competitive prices',
            'Keep inventory updated'
        ]
    },
    {
        title: 'Order Management',
        description: 'Process orders efficiently and maintain good customer service.',
        bestPractices: [
            'Process orders within 24 hours',
            'Communicate with buyers promptly',
            'Use proper packaging materials',
            'Provide tracking information'
        ]
    },
    {
        title: 'Growth and Optimization',
        description: 'Monitor performance and optimize your selling strategy.',
        bestPractices: [
            'Track analytics regularly',
            'Respond to customer feedback',
            'Update listings based on performance',
            'Participate in promotions'
        ]
    }
];

const fees = [
    {
        name: 'Listing Fee',
        description: 'Fee charged per item listed on the platform',
        rate: 'Free - ₦100/item'
    },
    {
        name: 'Commission',
        description: 'Percentage of sale price charged on successful sales',
        rate: '5% - 15%'
    },
    {
        name: 'Payment Processing',
        description: 'Fee for processing payment transactions',
        rate: '1.5% + ₦100'
    },
    {
        name: 'Subscription Fee',
        description: 'Monthly fee for business and enterprise accounts',
        rate: 'From ₦5,000/month'
    }
];

const pricingTips = [
    'Research competitor prices for similar items',
    'Consider all costs when setting prices (fees, shipping, etc.)',
    'Use promotional pricing strategically',
    'Set competitive prices while maintaining profit margins',
    'Update prices regularly based on market trends'
];

const policies = [
    {
        title: 'Product Guidelines',
        items: [
            'All products must be legal and authentic',
            'Accurate product descriptions required',
            'High-quality images mandatory',
            'Proper categorization of items',
            'Clear return policy statement'
        ]
    },
    {
        title: 'Seller Performance Standards',
        items: [
            'Maintain 95% positive feedback',
            'Process orders within 24 hours',
            'Respond to messages within 12 hours',
            'Keep cancellation rate below 5%',
            'Regular inventory updates required'
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
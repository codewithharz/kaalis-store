<!-- src/views/pages/help/TransactionGuide.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Transaction Guide</h1>
                            <p class="text-lg opacity-90">Learn how to make secure purchases on Bruthol</p>
                        </div>
                        <ShieldCheck class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <!-- Quick Navigation -->
            <section class="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 class="text-lg font-semibold text-[#2d3642] mb-4">Quick Navigation</h2>
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
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Purchase Process</h2>
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
                                <h4 class="font-semibold text-[#24a6bb] mb-2">Tips:</h4>
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
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Payment Methods</h2>
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
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Transaction Security</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-4">Our Security Measures</h3>
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
                        <h3 class="font-semibold text-[#24a6bb] mb-4">Safety Tips</h3>
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
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Buyer Protection</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-4">What's Covered</h3>
                        <ul class="space-y-3">
                            <li v-for="(item, index) in protectionCoverage" :key="index" class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                <span class="text-gray-600">{{ item }}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div class="bg-[#e6f4f7] p-6 rounded-lg">
                            <h3 class="font-semibold text-[#24a6bb] mb-4">Need Help?</h3>
                            <p class="text-gray-600 mb-4">If you encounter any issues with your transaction, our support
                                team is here to help.</p>
                            <div class="flex space-x-4">
                                <router-link to="/help/live-help"
                                    class="bg-[#24a6bb] text-white px-4 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                                    Contact Support
                                </router-link>
                                <router-link to="/help/faq"
                                    class="border border-[#24a6bb] text-[#24a6bb] px-4 py-2 rounded-lg hover:bg-[#24a6bb] hover:text-white transition-colors">
                                    View FAQs
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
import { ref, onMounted, onUnmounted } from 'vue';
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

const activeSection = ref('purchase-process');

const sections = [
    { id: 'purchase-process', name: 'Purchase Process' },
    { id: 'payment-methods', name: 'Payment Methods' },
    { id: 'security', name: 'Security' },
    { id: 'protection', name: 'Buyer Protection' }
];

const purchaseSteps = [
    {
        title: 'Browse and Add to Cart',
        description: 'Find the items you want to purchase and add them to your shopping cart.',
        tips: [
            'Use filters to narrow down your search',
            'Check seller ratings and reviews',
            'Compare prices across different sellers'
        ]
    },
    {
        title: 'Review Cart and Checkout',
        description: 'Review your cart contents and proceed to checkout when ready.',
        tips: [
            'Verify item quantities and specifications',
            'Check for available discounts or promotions',
            'Ensure delivery address is correct'
        ]
    },
    {
        title: 'Choose Payment Method',
        description: 'Select your preferred payment method and complete the payment.',
        tips: [
            'Use secure payment methods',
            'Keep payment confirmation for reference',
            'Check for payment processing fees'
        ]
    },
    {
        title: 'Track Order',
        description: 'Monitor your order status and track delivery progress.',
        tips: [
            'Save tracking number for reference',
            'Enable notifications for updates',
            'Contact support if delivery is delayed'
        ]
    }
];

const paymentMethods = [
    {
        id: 1,
        name: 'Credit/Debit Cards',
        icon: CreditCard,
        description: 'Pay securely with your card',
        features: [
            'All major cards accepted',
            'Encrypted transactions',
            'Instant processing'
        ]
    },
    {
        id: 2,
        name: 'Digital Wallet',
        icon: Wallet,
        description: 'Use your digital wallet',
        features: [
            'Quick checkout',
            'Multiple cards storage',
            'Enhanced security'
        ]
    },
    {
        id: 3,
        name: 'Mobile Payment',
        icon: Smartphone,
        description: 'Pay using mobile money',
        features: [
            'Convenient mobile payments',
            'Wide network coverage',
            'Low transaction fees'
        ]
    }
];

const securityMeasures = [
    {
        title: 'SSL Encryption',
        description: 'All transactions are protected with industry-standard SSL encryption.'
    },
    {
        title: 'Secure Payment Gateway',
        description: 'We use trusted payment gateways with advanced security features.'
    },
    {
        title: 'Fraud Protection',
        description: 'Advanced fraud detection systems to protect your transactions.'
    },
    {
        title: 'Data Protection',
        description: 'Your personal and payment information is securely stored and protected.'
    }
];

const safetyTips = [
    'Always check the seller\'s ratings and reviews before purchasing',
    'Keep your account credentials secure and never share them',
    'Use strong passwords and enable two-factor authentication',
    'Monitor your transaction history regularly',
    'Report any suspicious activity immediately'
];

const protectionCoverage = [
    'Item not received or significantly different from description',
    'Damaged items during shipping',
    'Unauthorized transactions',
    'Refund protection for returned items',
    'Protection against counterfeit products'
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
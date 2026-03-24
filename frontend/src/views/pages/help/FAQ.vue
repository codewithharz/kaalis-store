<!-- src/views/pages/help/FAQ.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">{{ t('faqPage.title') }}</h1>
                            <p class="text-lg opacity-90">{{ t('faqPage.subtitle') }}</p>
                        </div>
                        <HelpCircle class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="p-8">
                    <div class="relative max-w-2xl mx-auto">
                        <input v-model="searchQuery" type="text" :placeholder="t('faqPage.searchPlaceholder')"
                            class="w-full p-4 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-[#24a6bb] focus:border-transparent" />
                        <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </section>

            <!-- FAQ Categories -->
            <section class="mb-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <button v-for="category in categories" :key="category.id" @click="selectedCategory = category.id"
                        class="p-4 rounded-lg text-left transition-colors" :class="selectedCategory === category.id ?
                            'bg-[#24a6bb] text-white shadow-lg scale-[1.02] transform' :
                            'bg-white hover:bg-gray-100 text-gray-600'">
                        <div class="flex items-start space-x-3">
                            <component :is="category.icon" class="w-6 h-6"
                                :class="selectedCategory === category.id ? 'text-white' : 'text-[#24a6bb]'" />
                            <div>
                                <h3 class="font-semibold">{{ category.name }}</h3>
                                <p class="text-sm"
                                    :class="selectedCategory === category.id ? 'text-white/90' : 'text-gray-500'">
                                    {{ category.description }}
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            <!-- FAQ Questions -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <div v-if="filteredFaqs.length > 0" class="space-y-4">
                    <div v-for="faq in filteredFaqs" :key="faq.id" class="border-b last:border-b-0">
                        <button
                            class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
                            @click="toggleFaq(faq.id)" :aria-expanded="openFaqs.includes(faq.id)">
                            <span class="font-semibold text-[#2d3642] pr-8">{{ faq.question }}</span>
                            <ChevronDown class="w-5 h-5 text-gray-500 transition-transform flex-shrink-0"
                                :class="{ 'transform rotate-180': openFaqs.includes(faq.id) }" />
                        </button>
                        <div v-show="openFaqs.includes(faq.id)" class="px-4 pb-4">
                            <p class="text-gray-600 mb-4">{{ faq.answer }}</p>
                            <div v-if="faq.links" class="mt-4 bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-[#24a6bb] mb-2">{{ t('faqPage.relatedResources') }}</h4>
                                <ul class="space-y-2">
                                    <li v-for="link in faq.links" :key="link.url" class="flex items-center">
                                        <ArrowRight class="w-4 h-4 text-[#24a6bb] mr-2" />
                                        <router-link :to="link.url" class="text-[#24a6bb] hover:underline">
                                            {{ link.text }}
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-8">
                    <FileQuestion class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">{{ t('faqPage.noFaqsFound') }}</h3>
                    <p class="text-gray-500">{{ t('faqPage.noFaqsBody') }}</p>
                </div>
            </section>

            <!-- Still Need Help Section -->
            <section class="mt-8 bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('faqPage.stillNeedHelp') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                            <MessageCircle class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">{{ t('faqPage.liveChat') }}</h3>
                            <p class="text-gray-600 text-sm">{{ t('faqPage.available247') }}</p>
                            <router-link to="/help/live-help" class="text-[#24a6bb] hover:underline text-sm">
                                {{ t('faqPage.startChat') }} ->
                            </router-link>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                            <Mail class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">{{ t('faqPage.emailSupport') }}</h3>
                            <p class="text-gray-600 text-sm">{{ t('faqPage.responseWithin24h') }}</p>
                            <a href="mailto:brutholdigital@gmail.com" class="text-[#24a6bb] hover:underline text-sm">
                                {{ t('faqPage.sendEmail') }} ->
                            </a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                            <Phone class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">{{ t('faqPage.phoneSupport') }}</h3>
                            <p class="text-gray-600 text-sm">{{ t('faqPage.phoneHours') }}</p>
                            <a href="tel:1-800-Bruthol" class="text-[#24a6bb] hover:underline text-sm">
                                {{ t('faqPage.callNow') }} ->
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    HelpCircle,
    ChevronDown,
    MessageCircle,
    Mail,
    Phone,
    ShoppingCart,
    CreditCard,
    Truck,
    RefreshCw,
    Search,
    ArrowRight,
    FileQuestion
} from 'lucide-vue-next';

const { t } = useI18n();
const searchQuery = ref('');
const selectedCategory = ref('orders');
const openFaqs = ref([]);

const categories = computed(() => [
    {
        id: 'orders',
        name: t('faqPage.categories.orders.name'),
        icon: ShoppingCart,
        description: t('faqPage.categories.orders.description')
    },
    {
        id: 'payments',
        name: t('faqPage.categories.payments.name'),
        icon: CreditCard,
        description: t('faqPage.categories.payments.description')
    },
    {
        id: 'shipping',
        name: t('faqPage.categories.shipping.name'),
        icon: Truck,
        description: t('faqPage.categories.shipping.description')
    },
    {
        id: 'returns',
        name: t('faqPage.categories.returns.name'),
        icon: RefreshCw,
        description: t('faqPage.categories.returns.description')
    }
]);

const faqs = computed(() => [
    {
        id: 1,
        category: 'orders',
        question: t('faqPage.faqs.trackOrder.question'),
        answer: t('faqPage.faqs.trackOrder.answer'),
        links: [
            { url: '/account/orders', text: t('faqPage.faqs.trackOrder.linkOrders') },
            { url: '/help/order-tracking', text: t('faqPage.faqs.trackOrder.linkGuide') }
        ]
    },
    {
        id: 2,
        category: 'orders',
        question: t('faqPage.faqs.cancelOrder.question'),
        answer: t('faqPage.faqs.cancelOrder.answer'),
        links: [
            { url: '/account/orders', text: t('faqPage.faqs.cancelOrder.linkManage') }
        ]
    },
    {
        id: 3,
        category: 'payments',
        question: t('faqPage.faqs.paymentMethods.question'),
        answer: t('faqPage.faqs.paymentMethods.answer'),
        links: [
            { url: '/help/payment-methods', text: t('faqPage.faqs.paymentMethods.linkMethods') },
            { url: '/help/payment-security', text: t('faqPage.faqs.paymentMethods.linkSecurity') }
        ]
    },
    {
        id: 4,
        category: 'payments',
        question: t('faqPage.faqs.refund.question'),
        answer: t('faqPage.faqs.refund.answer'),
        links: [
            { url: '/help/refund-policy', text: t('faqPage.faqs.refund.linkPolicy') },
            { url: '/help/how-to-return', text: t('faqPage.faqs.refund.linkProcess') }
        ]
    },
    {
        id: 5,
        category: 'shipping',
        question: t('faqPage.faqs.shippingCosts.question'),
        answer: t('faqPage.faqs.shippingCosts.answer'),
        links: [
            { url: '/help/shipping-rates', text: t('faqPage.faqs.shippingCosts.linkRates') }
        ]
    },
    {
        id: 6,
        category: 'shipping',
        question: t('faqPage.faqs.deliveryTime.question'),
        answer: t('faqPage.faqs.deliveryTime.answer'),
        links: [
            { url: '/help/delivery-times', text: t('faqPage.faqs.deliveryTime.linkTimeframes') }
        ]
    },
    {
        id: 7,
        category: 'returns',
        question: t('faqPage.faqs.returnPolicy.question'),
        answer: t('faqPage.faqs.returnPolicy.answer'),
        links: [
            { url: '/help/how-to-return', text: t('faqPage.faqs.returnPolicy.linkInstructions') },
            { url: '/help/return-policy', text: t('faqPage.faqs.returnPolicy.linkFullPolicy') }
        ]
    },
    {
        id: 8,
        category: 'returns',
        question: t('faqPage.faqs.returnItem.question'),
        answer: t('faqPage.faqs.returnItem.answer'),
        links: [
            { url: '/account/orders', text: t('faqPage.faqs.returnItem.linkStart') },
            { url: '/help/return-guide', text: t('faqPage.faqs.returnItem.linkGuide') }
        ]
    }
]);

const filteredFaqs = computed(() => {
    return faqs.value
        .filter(faq =>
            faq.category === selectedCategory.value &&
            (searchQuery.value === '' ||
                faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase()))
        );
});

const toggleFaq = (id) => {
    const index = openFaqs.value.indexOf(id);
    if (index === -1) {
        openFaqs.value.push(id);
    } else {
        openFaqs.value.splice(index, 1);
    }
};
</script>

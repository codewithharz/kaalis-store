<!-- src/views/pages/help/FAQ.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
                            <p class="text-lg opacity-90">Find answers to common questions about our services</p>
                        </div>
                        <HelpCircle class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="p-8">
                    <div class="relative max-w-2xl mx-auto">
                        <input v-model="searchQuery" type="text" placeholder="Search FAQs..."
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
                                <h4 class="font-semibold text-[#24a6bb] mb-2">Related Resources:</h4>
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
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">No FAQs Found</h3>
                    <p class="text-gray-500">Try adjusting your search or category selection</p>
                </div>
            </section>

            <!-- Still Need Help Section -->
            <section class="mt-8 bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Still Need Help?</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                            <MessageCircle class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">Live Chat</h3>
                            <p class="text-gray-600 text-sm">Available 24/7</p>
                            <router-link to="/help/live-help" class="text-[#24a6bb] hover:underline text-sm">
                                Start Chat →
                            </router-link>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                            <Mail class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">Email Support</h3>
                            <p class="text-gray-600 text-sm">Response within 24h</p>
                            <a href="mailto:support@bruthol.com" class="text-[#24a6bb] hover:underline text-sm">
                                Send Email →
                            </a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center">
                            <Phone class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">Phone Support</h3>
                            <p class="text-gray-600 text-sm">Mon-Fri, 9AM-6PM</p>
                            <a href="tel:1-800-Bruthol" class="text-[#24a6bb] hover:underline text-sm">
                                Call Now →
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

const searchQuery = ref('');
const selectedCategory = ref('orders');
const openFaqs = ref([]);

const categories = [
    {
        id: 'orders',
        name: 'Orders',
        icon: ShoppingCart,
        description: 'Order tracking and management'
    },
    {
        id: 'payments',
        name: 'Payments',
        icon: CreditCard,
        description: 'Payment methods and issues'
    },
    {
        id: 'shipping',
        name: 'Shipping',
        icon: Truck,
        description: 'Delivery and shipping info'
    },
    {
        id: 'returns',
        name: 'Returns',
        icon: RefreshCw,
        description: 'Returns and refunds'
    }
];

const faqs = [
    {
        id: 1,
        category: 'orders',
        question: 'How can I track my order?',
        answer: 'You can track your order by logging into your account and visiting the "My Orders" section. There you\'ll find real-time updates on your order status, including tracking information once your package has been shipped.',
        links: [
            { url: '/account/orders', text: 'View My Orders' },
            { url: '/help/order-tracking', text: 'Order Tracking Guide' }
        ]
    },
    {
        id: 2,
        category: 'orders',
        question: 'How do I cancel my order?',
        answer: 'Orders can be cancelled within 1 hour of placement if they haven\'t been processed yet. Go to "My Orders," find the order you want to cancel, and click the "Cancel Order" button if it\'s available.',
        links: [
            { url: '/account/orders', text: 'Manage Orders' }
        ]
    },
    {
        id: 3,
        category: 'payments',
        question: 'What payment methods do you accept?',
        answer: 'We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), bank transfers, and mobile money. All transactions are secure and encrypted.',
        links: [
            { url: '/help/payment-methods', text: 'View Payment Methods' },
            { url: '/help/payment-security', text: 'Payment Security' }
        ]
    },
    {
        id: 4,
        category: 'payments',
        question: 'How do I get a refund?',
        answer: 'Refunds are processed automatically when a return is approved. The refund will be issued to your original payment method and typically takes 3-5 business days to appear in your account.',
        links: [
            { url: '/help/refund-policy', text: 'Refund Policy' },
            { url: '/help/how-to-return', text: 'Return Process' }
        ]
    },
    {
        id: 5,
        category: 'shipping',
        question: 'What are the shipping costs?',
        answer: 'Shipping costs vary based on your location and the delivery method chosen. Free shipping is available for orders above ₦10,000. You can see exact shipping costs at checkout.',
        links: [
            { url: '/help/shipping-rates', text: 'Shipping Rates' }
        ]
    },
    {
        id: 6,
        category: 'shipping',
        question: 'How long will delivery take?',
        answer: 'Standard delivery typically takes 2-5 business days within major cities and 5-8 business days for other locations. Express delivery options are available for faster delivery.',
        links: [
            { url: '/help/delivery-times', text: 'Delivery Timeframes' }
        ]
    },
    {
        id: 7,
        category: 'returns',
        question: 'What is your return policy?',
        answer: 'Most items can be returned within 30 days of delivery. Items must be unused and in their original packaging. Some items, like perishables and personalized products, are not eligible for return.',
        links: [
            { url: '/help/how-to-return', text: 'Return Instructions' },
            { url: '/help/return-policy', text: 'Full Return Policy' }
        ]
    },
    {
        id: 8,
        category: 'returns',
        question: 'How do I return an item?',
        answer: 'To return an item, go to "My Orders," select the order containing the item, and click "Return Item." Follow the instructions to print your return label and ship the item back.',
        links: [
            { url: '/account/orders', text: 'Start Return' },
            { url: '/help/return-guide', text: 'Return Guide' }
        ]
    }
];

const filteredFaqs = computed(() => {
    return faqs
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
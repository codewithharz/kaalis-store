<!-- // frontend/src/views/HelpAndSupport.vue -->
<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <div class="text-white" :style="{ background: getDefaultBackground() }">
            <div class="container mx-auto px-4 py-16">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-4xl font-bold mb-4">How can we help you?</h1>
                    <p class="text-lg mb-8 text-white/90">Find answers to your questions about Bruthol</p>

                    <!-- Search Bar -->
                    <div class="relative max-w-2xl mx-auto">
                        <input type="text" v-model="searchQuery" placeholder="Search for help..."
                            class="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                                   text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" />
                        <Search class="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/70" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Help Cards -->
        <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16">
                <!-- Orders & Shipping -->
                <div
                    class="bg-white overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                    <div class="flex items-start space-x-4">
                        <div class="bg-blue-100 p-3 rounded-lg">
                            <Package class="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-2">Orders & Shipping</h3>
                            <p class="text-gray-600 text-sm mb-4">Track orders, shipping info, and returns</p>
                            <button @click="selectCategory('orders')"
                                class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Learn more →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Account & Payments -->
                <div
                    class="bg-white overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                    <div class="flex items-start space-x-4">
                        <div class="bg-green-100 p-3 rounded-lg">
                            <CreditCard class="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-2">Account & Payments</h3>
                            <p class="text-gray-600 text-sm mb-4">Manage your account and payment methods</p>
                            <button @click="selectCategory('account')"
                                class="text-green-600 hover:text-green-700 text-sm font-medium">
                                Learn more →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Shop & Products -->
                <div
                    class="bg-white overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                    <div class="flex items-start space-x-4">
                        <div class="bg-purple-100 p-3 rounded-lg">
                            <ShoppingBag class="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-2">Shop & Products</h3>
                            <p class="text-gray-600 text-sm mb-4">Information about products and shopping</p>
                            <button @click="selectCategory('products')"
                                class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                Learn more →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <!-- FAQ Section -->
        <div class="relative bg-gray-50">
            <!-- Greek Key Pattern Background -->
            <div class="absolute inset-0 opacity-15">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="greek-key" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M0,10 h20 v10 h-10 v-10 h10 v10" stroke="#9CA3AF" stroke-width="2" fill="none" />
                            <path d="M40,30 h-20 v-10 h10 v10 h-10 v-10" stroke="#9CA3AF" stroke-width="2"
                                fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#greek-key)" />
                </svg>
            </div>

            <!-- Border Pattern Top -->
            <div class="absolute top-0 left-0 right-0 h-8 overflow-hidden opacity-55 ">
                <svg width="100%" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <pattern id="greek-border" x="0" y="0" width="40" height="32" patternUnits="userSpaceOnUse">
                            <path d="M0,16 h12 v-8 h8 v8 h8 v-8 h8 v8 h4" stroke="#ff934b" stroke-width="2"
                                fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="32" fill="url(#greek-border)" />
                </svg>
            </div>

            <!-- Border Pattern Bottom -->
            <div class="absolute bottom-0 left-0 right-0 h-8 overflow-hidden transform rotate-180 opacity-55">
                <svg width="100%" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                    <rect width="100%" height="32" fill="url(#greek-border)" />
                </svg>
            </div>

            <!-- Content -->
            <div class="container mx-auto px-4 py-16 relative">
                <div class="max-w-4xl mx-auto">
                    <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center justify-center">
                        <div class="h-8 w-24 overflow-hidden opacity-55">
                            <svg width="100%" height="32" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="32" fill="url(#greek-border)" />
                            </svg>
                        </div>
                        <span class="mx-4">Frequently Asked Questions</span>
                        <div class="h-8 w-24 overflow-hidden transform rotate-180 opacity-55">
                            <svg width="100%" height="32" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="32" fill="url(#greek-border)" />
                            </svg>
                        </div>
                    </h2>

                    <div class="space-y-4">
                        <div v-for="(faq, index) in filteredFaqs" :key="index"
                            class="bg-gray-50 hover:bg-gray-100 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg border border-white/20">
                            <button @click="toggleFaq(index)"
                                class="w-full px-6 py-4 flex justify-between items-center">
                                <span class="font-medium text-gray-900 text-left">{{ faq.question }}</span>
                                <ChevronDown class="w-5 h-5 text-gray-500 transition-transform duration-200"
                                    :class="{ 'transform rotate-180': faq.isOpen }" />
                            </button>
                            <div v-show="faq.isOpen" class="px-6 pb-4 text-gray-600"
                                :class="{ 'animate-fadeIn': faq.isOpen }">
                                <p>{{ faq.answer }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <!-- Contact Section -->
        <div class="bg-white border-t border-gray-200">
            <div class="container mx-auto px-4 py-12">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
                    <p class="text-gray-600 mb-8">Our support team is here to assist you</p>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Email Support -->
                        <!-- <div class="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"> -->
                        <div
                            class="bg-gray-50 hover:bg-gray-100 overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg border border-white/20">
                            <Mail class="w-6 h-6 text-gray-700 mx-auto mb-4" />
                            <h3 class="font-semibold text-gray-900 mb-2">Email Support</h3>
                            <p class="text-gray-600 text-sm mb-4">Get help via email</p>
                            <a href="mailto:support@bruthol.com"
                                class="text-[#ff934b] hover:text-[#ff8331] font-medium">
                                Contact Us
                            </a>
                        </div>

                        <!-- Live Chat -->
                        <div
                            class="bg-gray-50 hover:bg-gray-100 overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg border border-white/20">
                            <MessageCircle class="w-6 h-6 text-gray-700 mx-auto mb-4" />
                            <h3 class="font-semibold text-gray-900 mb-2">Live Chat</h3>
                            <p class="text-gray-600 text-sm mb-4">Chat with our team</p>
                            <button @click="startChat" class="text-[#ff934b] hover:text-[#ff8331] font-medium">
                                Start Chat
                            </button>
                        </div>

                        <!-- Phone Support -->
                        <div
                            class="bg-gray-50 hover:bg-gray-100 overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg border border-white/20">
                            <Phone class="w-6 h-6 text-gray-700 mx-auto mb-4" />
                            <h3 class="font-semibold text-gray-900 mb-2">Phone Support</h3>
                            <p class="text-gray-600 text-sm mb-4">Call us directly</p>
                            <a href="tel:+1234567890" class="text-[#ff934b] hover:text-[#ff8331] font-medium">
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, Package, CreditCard, ShoppingBag, ChevronDown, Mail, MessageCircle, Phone } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const router = useRouter();
const searchQuery = ref('');
const faqs = ref([
    {
        question: "How do I track my order?",
        answer: "You can track your order by logging into your account and visiting the Orders section. There you will find real-time updates on your shipment.",
        category: "orders",
        isOpen: false
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including credit/debit cards, PayPal, and bank transfers. All payments are securely processed.",
        category: "account",
        isOpen: false
    },
    {
        question: "How can I return a product?",
        answer: "To return a product, go to your order history, select the item you want to return, and follow the return instructions. Returns must be initiated within 30 days of delivery.",
        category: "orders",
        isOpen: false
    },
    {
        question: "How do I change my account password?",
        answer: "You can change your password by going to Account Settings > Security > Change Password. Follow the prompts to set your new password.",
        category: "account",
        isOpen: false
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we offer international shipping to most countries. Shipping rates and delivery times vary by location.",
        category: "orders",
        isOpen: false
    }
]);

const getDefaultBackground = () => {
    return `linear-gradient(135deg, rgba(49, 49, 49, 0.03) 0%, rgba(49, 49, 49, 0.03) 50%,rgba(252, 252, 252, 0.03) 50%, rgba(252, 252, 252, 0.03) 100%), linear-gradient(45deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 50%,rgba(220, 220, 220, 0.03) 50%, rgba(220, 220, 220, 0.03) 100%), linear-gradient(135deg, rgba(54, 54, 54, 0.03) 0%, rgba(54, 54, 54, 0.03) 50%,rgba(209, 209, 209, 0.03) 50%, rgba(209, 209, 209, 0.03) 100%), linear-gradient(45deg, rgba(10, 10, 10, 0.03) 0%, rgba(10, 10, 10, 0.03) 50%,rgba(174, 174, 174, 0.03) 50%, rgba(174, 174, 174, 0.03) 100%), linear-gradient(90deg, rgb(13, 17, 158),rgb(49, 100, 233))`;
};

const filteredFaqs = computed(() => {
    if (!searchQuery.value) return faqs.value;
    const query = searchQuery.value.toLowerCase();
    return faqs.value.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
});

const toggleFaq = (index) => {
    faqs.value[index].isOpen = !faqs.value[index].isOpen;
};

const selectCategory = (category) => {
    searchQuery.value = "";
    faqs.value.forEach(faq => {
        faq.isOpen = faq.category === category;
    });
};

const startChat = () => {
    toast.success("Live chat feature coming soon!");
};
</script>

<style scoped>
.transform {
    transform-origin: center;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
}
</style>
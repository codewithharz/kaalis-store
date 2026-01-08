<!-- src/views/pages/help/LiveHelp.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Live Help & Support</h1>
                            <p class="text-lg opacity-90">Get immediate assistance from our team</p>
                        </div>
                        <Headphones class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <!-- Contact Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <!-- Live Chat -->
                <section class="bg-white rounded-lg shadow-lg p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mr-4">
                            <MessageSquare class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-[#2d3642]">Live Chat</h2>
                            <p class="text-gray-600">Chat with our support team</p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="flex items-center text-sm text-gray-600 mb-2">
                            <Clock class="w-4 h-4 mr-2" />
                            <span>Available 24/7</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <Clock class="w-4 h-4 mr-2" />
                            <span>Average response time: 2 minutes</span>
                        </div>
                    </div>
                    <button
                        class="w-full bg-[#24a6bb] text-white py-2 px-4 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                        Start Chat
                    </button>
                </section>

                <!-- Phone Support -->
                <section class="bg-white rounded-lg shadow-lg p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mr-4">
                            <Phone class="w-6 h-6 text-[#24a6bb]" />
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-[#2d3642]">Phone Support</h2>
                            <p class="text-gray-600">Talk to our representatives</p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="flex items-center text-sm text-gray-600 mb-2">
                            <Clock class="w-4 h-4 mr-2" />
                            <span>Monday - Friday: 9AM - 6PM</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <Phone class="w-4 h-4 mr-2" />
                            <span>Toll-free: 1-800-Bruthol</span>
                        </div>
                    </div>
                    <button
                        class="w-full border border-[#24a6bb] text-[#24a6bb] py-2 px-4 rounded-lg hover:bg-[#24a6bb] hover:text-white transition-colors">
                        Call Now
                    </button>
                </section>
            </div>

            <!-- Email Support -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Email Support</h2>
                <form @submit.prevent="submitEmailSupport" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-gray-700 mb-2">Name</label>
                            <input v-model="form.name" type="text"
                                class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#24a6bb] focus:border-transparent"
                                required />
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Email</label>
                            <input v-model="form.email" type="email"
                                class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#24a6bb] focus:border-transparent"
                                required />
                        </div>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Subject</label>
                        <select v-model="form.subject"
                            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#24a6bb] focus:border-transparent"
                            required>
                            <option value="">Select a subject</option>
                            <option value="order">Order Issue</option>
                            <option value="payment">Payment Problem</option>
                            <option value="shipping">Shipping Question</option>
                            <option value="return">Return Request</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Message</label>
                        <textarea v-model="form.message" rows="4"
                            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#24a6bb] focus:border-transparent"
                            required></textarea>
                    </div>
                    <div>
                        <button type="submit"
                            class="w-full bg-[#24a6bb] text-white py-3 px-4 rounded-lg hover:bg-[#1a7f8f] transition-colors"
                            :disabled="loading">
                            {{ loading ? 'Sending...' : 'Send Message' }}
                        </button>
                    </div>
                </form>
            </section>

            <!-- FAQ Section -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Quick Solutions</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="(solution, index) in quickSolutions" :key="index">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ solution.title }}</h3>
                        <p class="text-gray-600 mb-3">{{ solution.description }}</p>
                        <router-link :to="solution.link" class="text-[#24a6bb] hover:underline text-sm">
                            Learn more →
                        </router-link>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    Headphones,
    MessageSquare,
    Phone,
    Clock,
} from 'lucide-vue-next';

const loading = ref(false);
const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
});

const quickSolutions = [
    {
        title: 'Track Your Order',
        description: 'Get real-time updates on your order status and tracking information.',
        link: '/account/orders'
    },
    {
        title: 'Returns & Refunds',
        description: 'Learn about our return policy and how to initiate a return.',
        link: '/help/how-to-return'
    },
    {
        title: 'Payment Issues',
        description: 'Find solutions to common payment problems and accepted methods.',
        link: '/help/payment-guide'
    },
    {
        title: 'Shipping Information',
        description: 'Get details about shipping methods, times, and costs.',
        link: '/help/shipping-info'
    }
];

const submitEmailSupport = async () => {
    loading.value = true;
    try {
        // Implement API call to submit support request
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
        // Reset form
        form.value = {
            name: '',
            email: '',
            subject: '',
            message: ''
        };
        // Show success message (implement your preferred notification system)
        alert('Your message has been sent successfully. We will get back to you soon.');
    } catch (error) {
        // Handle error (implement your preferred error handling)
        alert('Failed to send message. Please try again.');
    } finally {
        loading.value = false;
    }
};
</script>
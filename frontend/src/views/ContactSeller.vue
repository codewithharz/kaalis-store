<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <!-- Modern Hero Header -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-4xl font-bold mb-4">{{ t('contactSellerPage.title') }}</h1>
                    <p class="text-lg mb-8 text-white/90">{{ t('contactSellerPage.subtitle', { seller: sellerProfile?.storeName || t('contactSellerPage.theSeller') }) }}</p>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column - Contact Form -->
                <div class="-mt-20 relative z-10">
                    <div
                        class="bg-white overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                        <!-- Seller Info -->
                        <div class="p-4 bg-indigo-50 rounded-lg">
                            <div class="flex items-start gap-4">
                                <div
                                    class="w-20 h-20 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <img v-if="sellerProfile?.profileImage" :src="sellerProfile.profileImage"
                                        :alt="sellerProfile.storeName" class="w-20 h-20 rounded-full object-cover">
                                    <Store v-else class="w-10 h-10 text-indigo-600" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-semibold text-gray-900 text-lg mb-1">{{ sellerProfile?.storeName }}
                                    </h3>
                                    <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{
                                        sellerProfile?.storeDescription }}</p>
                                    <div class="flex items-center">
                                        <div class="flex items-center">
                                            <Star v-for="i in 5" :key="i" class="w-4 h-4"
                                                :class="i <= Math.round(sellerProfile?.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'" />
                                            <span class="ml-2 text-sm text-gray-600">
                                                {{ sellerProfile?.averageRating?.toFixed(1) || '0.0' }}
                                            </span>
                                        </div>
                                        <span class="mx-2 text-gray-300">•</span>
                                        <span class="text-sm text-gray-600">
                                            {{ t('contactSellerPage.reviewsCount', { count: sellerProfile?.reviews?.length || 0 }) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Message Form -->
                        <form @submit.prevent="sendMessage" class="space-y-6 mt-6">
                            <!-- Subject -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">{{ t('contactSellerPage.subjectLabel') }}</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <MessageCircle
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input v-model="messageForm.subject" type="text"
                                        class="w-full px-4 py-3 pl-11 text-gray-700 bg-transparent border-none focus:outline-none"
                                        :placeholder="t('contactSellerPage.subjectPlaceholder')" required />
                                </div>
                            </div>

                            <!-- Message -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">{{ t('contactSellerPage.messageLabel') }}</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <textarea v-model="messageForm.message" rows="5"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none resize-none"
                                        :placeholder="t('contactSellerPage.messagePlaceholder')" required></textarea>
                                </div>
                            </div>

                            <!-- Send Button -->
                            <div class="flex justify-end gap-4">
                                <button type="button" @click="handleBackToStore"
                                    class="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium shadow-sm transition-all duration-300 flex items-center gap-2">
                                    <ArrowLeft class="w-4 h-4" />
                                    {{ t('contactSellerPage.backToStore') }}
                                </button>
                                <button type="submit" :disabled="isLoading"
                                    class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span v-if="isLoading">{{ t('contactSellerPage.sending') }}</span>
                                    <span v-else>{{ t('contactSellerPage.sendMessage') }}</span>
                                    <Send v-if="!isLoading" class="w-4 h-4" />
                                    <Loader2 v-else class="w-4 h-4 animate-spin" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Right Column - Additional Info -->
                <div class="space-y-6 lg:-mt-20 relative z-10">
                    <!-- FAQ Section -->
                    <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <h3 class="text-xl font-semibold mb-4">{{ t('contactSellerPage.haveAQuestion') }}</h3>
                        <div class="space-y-4">
                            <div v-for="(faq, index) in commonQuestions" :key="index"
                                class="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <h4 class="font-medium text-gray-900">{{ faq.question }}</h4>
                                <p class="text-sm text-gray-600 mt-2">{{ faq.answer }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Social Media -->
                    <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <h3 class="text-xl font-semibold mb-4">{{ t('contactSellerPage.connectWithUs') }}</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank"
                                class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <component :is="social.icon" class="w-5 h-5 text-gray-600" />
                                <span class="text-sm font-medium text-gray-700">{{ social.name }}</span>
                            </a>
                        </div>
                    </div>

                    <!-- Additional Support -->
                    <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg">
                        <h3 class="text-xl font-semibold mb-4">{{ t('contactSellerPage.needMoreHelp') }}</h3>
                        <p class="text-gray-600 mb-4">{{ t('contactSellerPage.supportBody') }}</p>
                        <div class="flex items-center gap-4">
                            <HelpCircle class="w-6 h-6 text-indigo-600" />
                            <div>
                                <p class="text-sm text-gray-600">{{ t('contactSellerPage.supportHoursLabel') }}</p>
                                <p class="font-medium text-gray-900">{{ t('contactSellerPage.supportHoursValue') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <div v-if="showSuccessModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle class="w-8 h-8 text-green-500" />
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ t('contactSellerPage.successTitle') }}</h3>
                    <p class="text-gray-600 mb-6">{{ t('contactSellerPage.successBody', { seller: sellerProfile?.storeName }) }}</p>
                    <div class="text-sm text-gray-500 mb-4">
                        {{ t('contactSellerPage.redirectingCountdown', { count: countdown }) }}
                    </div>
                    <button @click="handleRedirectNow"
                        class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300">
                        {{ t('contactSellerPage.returnNow') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useSellerStore } from '../store/sellerStore';
import {
    Store, Star, MessageCircle, Send, Loader2,
    Facebook, Twitter, Instagram, Youtube, HelpCircle, CheckCircle, ArrowLeft
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const sellerStore = useSellerStore();

const sellerProfile = ref(null);
const isLoading = ref(false);
const messageForm = ref({
    subject: '',
    message: ''
});

const showSuccessModal = ref(false);
const countdown = ref(5);
let countdownInterval = null;

const startCountdown = () => {
    countdown.value = 5;
    showSuccessModal.value = true;

    countdownInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            handleRedirectNow();
        }
    }, 1000);
};

const handleRedirectNow = () => {
    clearInterval(countdownInterval);
    router.push(`/seller-store/${route.params.sellerId}/home`);
};

const handleBackToStore = () => {
    // Show confirmation if form has content
    if (messageForm.value.subject.trim() || messageForm.value.message.trim()) {
        if (confirm(t('contactSellerPage.leaveConfirm'))) {
            router.push(`/seller-store/${route.params.sellerId}/home`);
        }
    } else {
        router.push(`/seller-store/${route.params.sellerId}/home`);
    }
};

// Common Questions
const commonQuestions = [
    {
        question: t('contactSellerPage.faq1Question'),
        answer: t('contactSellerPage.faq1Answer')
    },
    {
        question: t('contactSellerPage.faq2Question'),
        answer: t('contactSellerPage.faq2Answer')
    },
    {
        question: t('contactSellerPage.faq3Question'),
        answer: t('contactSellerPage.faq3Answer')
    }
];

// Social Media Links
const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'YouTube', icon: Youtube, url: '#' }
];

onMounted(async () => {
    try {
        if (!route.params.sellerId) {
            toast.error(t('contactSellerPage.errors.sellerNotFound'));
            router.push('/');
            return;
        }
        sellerProfile.value = await sellerStore.fetchSellerProfile(route.params.sellerId);
    } catch (error) {
        console.error('Error loading seller profile:', error);
        toast.error(t('contactSellerPage.errors.loadSellerFailed'));
    }
});

onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

const sendMessage = async () => {
    try {
        isLoading.value = true;
        await sellerStore.sendMessageToSeller(route.params.sellerId, messageForm.value);
        startCountdown(); // Start countdown instead of immediate redirect

        toast.success(t('contactSellerPage.toasts.sent'));
        // router.push(`/seller-store/${route.params.sellerId}/home`);
    } catch (error) {
        console.error('Error sending message:', error);
        toast.error(t('contactSellerPage.errors.sendFailed'));
    } finally {
        isLoading.value = false;
    }
};
</script>

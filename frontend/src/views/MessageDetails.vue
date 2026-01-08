<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <!-- Modern Hero Header - Matching Payment Methods style -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <button @click="goBack" class="absolute left-4 text-white hover:text-gray-200 transition-colors">
                        <ArrowLeft class="w-6 h-6" />
                    </button>
                    <h1 class="text-4xl font-bold mb-4">Message Details</h1>
                </div>
            </div>
        </div>

        <!-- Main Content Section -->
        <div class="container mx-auto px-4 -mt-12 relative z-10">
            <div class="max-w-3xl mx-auto">
                <!-- Loading State -->
                <div v-if="isLoading"
                    class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                    <div class="animate-pulse space-y-6">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-4 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                <!-- Message Display -->
                <div v-else-if="message" class="space-y-4">
                    <!-- Main Message Card - Matching Payment Methods card style -->
                    <div
                        class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                        <!-- User Info -->
                        <div class="flex items-start mb-6">
                            <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                                <User v-if="!message.sender?.profileImage" class="w-6 h-6 text-indigo-600" />
                                <img v-else :src="message.sender.profileImage" :alt="message.sender.username"
                                    class="w-12 h-12 rounded-full object-cover" />
                            </div>
                            <div class="ml-4">
                                <div class="flex items-center gap-2">
                                    <h3 class="font-semibold text-gray-900">
                                        {{ message.sender?.username }}
                                    </h3>
                                    <span v-if="message.isSellerMessage"
                                        class="px-2 py-1 text-xs bg-indigo-500/10 text-indigo-600 rounded-full">
                                        Seller
                                    </span>
                                </div>
                                <p class="text-sm text-gray-500">{{ formatDate(message.createdAt) }}</p>
                                <p v-if="message.relatedSeller?.storeName" class="text-sm text-indigo-600 mt-1">
                                    {{ message.relatedSeller.storeName }}
                                </p>
                            </div>
                        </div>

                        <!-- Reply Context -->
                        <div v-if="message.parentMessage" class="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
                            <div class="text-sm text-gray-500 mb-2">
                                Replying to message from {{ formatDate(message.parentMessage.createdAt) }}:
                            </div>
                            <div class="space-y-1">
                                <p class="font-medium text-gray-900">{{ stripRePrefix(message.parentMessage.subject) }}
                                </p>
                                <p class="text-gray-600 line-clamp-2">{{ message.parentMessage.message }}</p>
                            </div>
                        </div>

                        <!-- Message Content -->
                        <div v-if="messageThread.length" class="space-y-4">
                            <!-- Display each message in the thread -->
                            <div v-for="(msg, index) in messageThread" :key="msg._id"
                                class="bg-white rounded-xl p-6 shadow-lg" :class="{ 'ml-8': index > 0 }">
                                <!-- Message content -->
                                <div class="flex items-start">
                                    <!-- User avatar -->
                                    <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <User v-if="!msg.sender?.profileImage" class="w-5 h-5 text-indigo-600" />
                                        <img v-else :src="msg.sender.profileImage" :alt="msg.sender.username"
                                            class="w-10 h-10 rounded-full object-cover" />
                                    </div>

                                    <!-- Message details -->
                                    <div class="ml-4 flex-1">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <span class="font-medium text-gray-900">{{ msg.sender?.username
                                                    }}</span>
                                                <span v-if="msg.isSellerMessage"
                                                    class="ml-2 px-2 py-1 text-xs bg-indigo-500/10 text-indigo-600 rounded-full">
                                                    Seller
                                                </span>
                                            </div>
                                            <span class="text-sm text-gray-500">{{ formatDate(msg.createdAt) }}</span>
                                        </div>

                                        <div class="mt-2">
                                            <h3 class="text-lg font-medium text-gray-900">
                                                {{ msg.parentMessage ? 'Re: ' : '' }}{{ stripRePrefix(msg.subject || '')
                                                }}
                                            </h3>
                                            <p class="mt-2 text-gray-700 whitespace-pre-wrap">{{ msg.message }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="mt-8 flex justify-end gap-4">
                            <button @click="goBack" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 
                                           hover:bg-gray-50 transition-colors">
                                Back
                            </button>
                            <button v-if="canReplyToMessage" @click="replyToMessage" class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                                           hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg 
                                           shadow-lg transition-all duration-300">
                                Reply
                            </button>
                        </div>
                    </div>

                    <!-- Parent Message -->
                    <!-- <div v-if="message.parentMessage" class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow 
                                backdrop-blur-lg bg-white/80 border border-white/20">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                <User v-if="!message.parentMessage.sender?.profileImage"
                                    class="w-5 h-5 text-indigo-600" />
                                <img v-else :src="message.parentMessage.sender.profileImage"
                                    :alt="message.parentMessage.sender.username"
                                    class="w-10 h-10 rounded-full object-cover" />
                            </div>
                            <div class="ml-4">
                                <div class="font-medium text-gray-900">
                                    {{ message.parentMessage.sender?.username }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ formatDate(message.parentMessage.createdAt) }}
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 space-y-2">
                            <h3 class="text-lg font-medium text-gray-900">
                                {{ message.parentMessage ? 'Re: ' : '' }}{{ stripRePrefix(message.subject || '') }}
                            </h3>
                            <p class="text-gray-700">{{ message.parentMessage.message }}</p>
                        </div>
                    </div> -->

                </div>
            </div>
        </div>

        <!-- Reply Modal - Matching Payment Methods modal style -->
        <Dialog :open="showReplyModal" @close="closeReplyModal">
            <DialogContent class="sm:max-w-lg p-8">
                <DialogHeader>
                    <DialogTitle class="text-2xl font-bold text-gray-900">Reply to Message</DialogTitle>
                </DialogHeader>

                <div class="mt-6 space-y-6">
                    <div class="space-y-2">
                        <Label for="subject" class="text-sm font-medium text-gray-700">Subject</Label>
                        <Input id="subject" v-model="replyForm.subject"
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="Re: Original Subject" />
                    </div>
                    <div class="space-y-2">
                        <Label for="message" class="text-sm font-medium text-gray-700">Message</Label>
                        <Textarea id="message" v-model="replyForm.message" rows="4"
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="Type your reply..." />
                    </div>
                </div>

                <DialogFooter class="mt-8">
                    <Button variant="outline" @click="closeReplyModal" class="mr-3">
                        Cancel
                    </Button>
                    <Button type="submit" @click="sendReply" :disabled="isSending"
                        class="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                        <Loader2 v-if="isSending" class="w-4 h-4 mr-2 animate-spin" />
                        {{ isSending ? 'Sending...' : 'Send Reply' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { User, XCircle, ArrowLeft, Loader2 } from 'lucide-vue-next';
import { format } from 'date-fns';
import { useNotificationStore } from '../store/notificationStore';
import { useUserStore } from '../store/user';
import { toast } from 'vue-sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const message = ref(null);
const isLoading = ref(true);
const error = ref(null);
const showReplyModal = ref(false);
const isSending = ref(false);
const canReply = ref(true); // You might want to add logic to determine if user can reply
const messageThread = ref([]);

const replyForm = ref({
    subject: '',
    message: ''
});

const canReplyToMessage = computed(() => {
    if (!message.value?.sender || !userStore.user) return false;

    // If it's a seller message, only allow reply if user is the customer
    if (message.value.isSellerMessage) {
        return message.value.sender._id !== userStore.user._id;
    }

    // For regular messages, allow reply if user is part of the conversation
    return message.value.receiver._id === userStore.user._id;
});

const formatDate = (date) => {
    if (!date) return 'Date not available';

    try {
        // Check if it's a valid date
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }

        // Format the date using date-fns
        return format(dateObj, 'PPP p');
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

const goBack = () => {
    if (window.history.length > 2) {
        router.back();
    } else {
        router.push('/'); // or wherever your messages list is
    }
};

const stripRePrefix = (subject) => {
    // Return empty string or placeholder if subject is undefined/null
    if (!subject) return '';

    // Remove any number of "Re: " prefixes
    return subject.replace(/^(Re: )+/i, '');
};



const replyToMessage = () => {
    if (message.value?.sender?._id) {
        // Strip any existing Re: prefixes and add just one
        const baseSubject = stripRePrefix(message.value.subject);
        replyForm.value.subject = `Re: ${baseSubject}`;
        showReplyModal.value = true;
    } else {
        toast.error('Cannot reply to this message');
    }
};

const closeReplyModal = () => {
    showReplyModal.value = false;
    replyForm.value = {
        subject: '',
        message: ''
    };
};

const sendReply = async () => {
    if (!replyForm.value.message.trim()) {
        toast.error('Please enter a message');
        return;
    }

    isSending.value = true;
    try {
        await notificationStore.sendMessageReply({
            recipientId: message.value.sender._id,
            subject: replyForm.value.subject,
            message: replyForm.value.message,
            originalMessageId: message.value._id,
            relatedSeller: message.value.relatedSeller?._id
        });

        toast.success('Reply sent successfully');
        closeReplyModal();

        // Reload the message to show the update
        await loadMessage(message.value._id);
    } catch (error) {
        console.error('Error sending reply:', error);
        toast.error('Failed to send reply');
    } finally {
        isSending.value = false;
    }
};

// Update the loadMessage function in MessageDetails.vue
const loadMessage = async (messageId) => {
    try {
        isLoading.value = true;
        error.value = null;
        message.value = null;

        // Fetch message details and thread
        const data = await notificationStore.fetchMessageDetails(messageId);
        message.value = data.currentMessage;
        messageThread.value = data.thread;

    } catch (err) {
        console.error('Error loading message:', err);
        error.value = 'Failed to load message details';
        toast.error('Failed to load message');
    } finally {
        isLoading.value = false;
    }
};

// Watch for route changes to reload message when messageId changes
watch(
    () => route.params.messageId,
    (newMessageId) => {
        if (newMessageId) {
            loadMessage(newMessageId);
        }
    }
);

onMounted(() => {
    const { messageId } = route.params;
    if (messageId) {
        loadMessage(messageId);
    }
});
</script>
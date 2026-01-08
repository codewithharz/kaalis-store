<!-- frontend/src/views/ProfileChangePasswordCard.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <!-- Enhanced Hero Header -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <div class="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div
                            class="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <KeyRound class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold">Security Settings</h1>
                    </div>
                    <p class="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-white/90">Update your password to keep
                        your account secure</p>
                </div>
            </div>
        </div>

        <!-- Password Change Content -->
        <div class="container mx-auto px-4 -mt-12 sm:-mt-16 lg:-mt-20 relative z-10">
            <div class="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <!-- Main Card with Enhanced Design -->
                <div
                    class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 backdrop-blur-lg bg-white/95">
                    <!-- Card Content -->
                    <div class="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                        <!-- Enhanced Card Header -->
                        <div class="flex items-center gap-3 sm:gap-4 lg:gap-6">
                            <div class="relative">
                                <div
                                    class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                    <KeyRound class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div
                                    class="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Lock class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 class="text-lg sm:text-2xl font-bold text-gray-900">Change Password</h2>
                                <p class="text-gray-600 text-sm sm:text-base">Ensure your account is secure with a
                                    strong password</p>
                            </div>
                        </div>

                        <!-- Enhanced Success/Error Message -->
                        <div v-if="message" :class="[
                            'p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl border-2 flex items-start sm:items-center gap-3 sm:gap-4 shadow-sm backdrop-blur-sm transition-all duration-300',
                            error
                                ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 shadow-red-100'
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 shadow-green-100'
                        ]">
                            <div class="flex-shrink-0">
                                <div :class="[
                                    'w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center',
                                    error ? 'bg-red-100' : 'bg-green-100'
                                ]">
                                    <CheckCircle v-if="!error" class="w-4 h-4 sm:w-5 sm:h-5" />
                                    <AlertCircle v-else class="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                            </div>
                            <div>
                                <p class="font-medium text-sm sm:text-base">{{ !error ? 'Success!' : 'Error' }}</p>
                                <p class="text-xs sm:text-sm opacity-90 break-words">{{ message }}</p>
                            </div>
                        </div>

                        <!-- Enhanced Password Form -->
                        <form @submit.prevent="changePassword" class="space-y-6 sm:space-y-8">
                            <!-- Current Password -->
                            <div class="space-y-2 sm:space-y-3">
                                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Lock class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                    Current Password
                                </label>
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Lock
                                            class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input type="password" v-model="form.currentPassword"
                                        class="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-sm sm:text-base"
                                        placeholder="Enter your current password" />
                                </div>
                            </div>

                            <!-- New Password -->
                            <div class="space-y-2 sm:space-y-3">
                                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Key class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                    New Password
                                </label>
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Key
                                            class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input type="password" v-model="form.newPassword"
                                        class="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-sm sm:text-base"
                                        placeholder="Enter your new password" />
                                </div>
                            </div>

                            <!-- Confirm Password -->
                            <div class="space-y-2 sm:space-y-3">
                                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <KeyRound class="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                                    Confirm New Password
                                </label>
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <KeyRound
                                            class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input type="password" v-model="form.confirmPassword"
                                        class="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-sm sm:text-base"
                                        placeholder="Confirm your new password" />
                                </div>
                            </div>

                            <!-- Enhanced Submit Button -->
                            <div class="flex justify-center sm:justify-end pt-4 sm:pt-6 border-t border-gray-200">
                                <button type="submit"
                                    class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                                    <KeyRound class="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Update Password</span>
                                </button>
                            </div>
                        </form>

                        <!-- Enhanced Password Requirements -->
                        <div
                            class="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-gray-100 overflow-hidden shadow-inner">
                            <!-- Enhanced decorative background elements -->
                            <div class="absolute inset-0">
                                <div
                                    class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl">
                                </div>
                                <div
                                    class="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl">
                                </div>
                                <div
                                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-full blur-lg">
                                </div>
                            </div>

                            <div class="relative">
                                <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    <div
                                        class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                                        <Lock class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 class="text-base sm:text-lg font-bold text-indigo-900">Password Requirements
                                        </h3>
                                        <p class="text-xs sm:text-sm text-indigo-700/80 hidden sm:block">Follow these
                                            guidelines for a secure password</p>
                                        <p class="text-xs text-indigo-700/80 sm:hidden">Security guidelines</p>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div
                                        class="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/60 rounded-lg border border-indigo-100">
                                        <div
                                            class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex-shrink-0">
                                        </div>
                                        <span class="text-xs sm:text-sm font-medium text-indigo-800">At least 8
                                            characters long</span>
                                    </div>
                                    <div
                                        class="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/60 rounded-lg border border-indigo-100">
                                        <div
                                            class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex-shrink-0">
                                        </div>
                                        <span class="text-xs sm:text-sm font-medium text-indigo-800">Contains uppercase
                                            and lowercase letters</span>
                                    </div>
                                    <div
                                        class="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/60 rounded-lg border border-indigo-100">
                                        <div
                                            class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex-shrink-0">
                                        </div>
                                        <span class="text-xs sm:text-sm font-medium text-indigo-800">Includes numbers
                                            and special characters</span>
                                    </div>
                                    <div
                                        class="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/60 rounded-lg border border-indigo-100">
                                        <div
                                            class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex-shrink-0">
                                        </div>
                                        <span class="text-xs sm:text-sm font-medium text-indigo-800">Different from your
                                            current password</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref } from 'vue';
import { useUserStore } from '../store/user';
import apiClient from '../api/axios';
import { KeyRound, Lock, Key, CheckCircle, AlertCircle } from 'lucide-vue-next';

export default {
    name: 'ProfileChangePasswordCard',
    components: {
        KeyRound,
        Lock,
        Key,
        CheckCircle,
        AlertCircle
    },
    setup() {
        const userStore = useUserStore();
        const form = ref({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        const message = ref('');
        const error = ref(false);

        const getDefaultBackground = () => {
            return `linear-gradient(135deg, rgba(49, 49, 49, 0.03) 0%, rgba(49, 49, 49, 0.03) 50%,rgba(252, 252, 252, 0.03) 50%, rgba(252, 252, 252, 0.03) 100%), linear-gradient(45deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 50%,rgba(220, 220, 220, 0.03) 50%, rgba(220, 220, 220, 0.03) 100%), linear-gradient(90deg, #ff934b, #ff5e62)`;
        };

        const changePassword = async () => {
            if (form.value.newPassword !== form.value.confirmPassword) {
                message.value = 'New passwords do not match.';
                error.value = true;
                return;
            }

            try {
                const response = await apiClient.post('/users/change-password', {
                    currentPassword: form.value.currentPassword,
                    newPassword: form.value.newPassword
                }, {
                    headers: { Authorization: `Bearer ${userStore.token}` }
                });

                message.value = 'Password changed successfully.';
                error.value = false;
                form.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
            } catch (err) {
                message.value = err.response?.data?.message || 'An error occurred while changing the password.';
                error.value = true;
            }
        };

        return {
            form,
            changePassword,
            message,
            error,
            getDefaultBackground
        };
    }
};
</script>

<style scoped>
/* Enhanced animations and transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile-first approach: Disable hover effects and transforms on mobile */
@media (max-width: 768px) {

    .transform,
    .hover\:scale-105:hover {
        transform: none !important;
        transition: none !important;
    }

    /* Better touch targets for mobile */
    button {
        min-height: 44px;
    }

    /* Prevent zoom on input focus for iOS */
    input {
        font-size: 16px;
    }

    /* Reduce motion for better mobile performance */
    * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
    }
}

/* Enhanced focus states for accessibility */
.focus\:ring-4:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Focus states for better accessibility */
button:focus,
input:focus {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
}

/* Smooth backdrop blur effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Custom input focus styles */
input:focus {
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* Enhanced button hover effects - Desktop only */
@media (min-width: 769px) {
    button:hover {
        transform: translateY(-1px);
    }

    .hover\:scale-105:hover {
        transform: scale(1.05);
    }
}

/* Custom scrollbar - Mobile optimized */
::-webkit-scrollbar {
    width: 4px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar {
        width: 8px;
    }
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar-track {
        border-radius: 4px;
    }
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
    border-radius: 2px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
    }
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #4f46e5, #7c3aed);
}

/* Enhanced gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Custom shadow effects - Mobile optimized */
.shadow-inner {
    box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
    .shadow-inner {
        box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    }
}

.shadow-xl {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
    .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
}

/* Animation keyframes */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Mobile-specific improvements */
@media (max-width: 640px) {

    /* Better spacing for small screens */
    .space-y-8>*+* {
        margin-top: 1.5rem;
    }

    .space-y-6>*+* {
        margin-top: 1rem;
    }

    .space-y-4>*+* {
        margin-top: 0.75rem;
    }

    /* Better mobile scrolling */
    .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
    }

    /* Prevent horizontal overflow */
    .min-w-0 {
        min-width: 0;
    }

    /* Better text wrapping */
    .break-words {
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
    }
}

/* Responsive text sizing */
@media (max-width: 640px) {
    .text-4xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }

    .text-3xl {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .text-2xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }

    .text-xl {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }

    .text-lg {
        font-size: 1rem;
        line-height: 1.5rem;
    }
}

/* Better mobile input styling */
@media (max-width: 640px) {
    .pl-9 {
        padding-left: 2.25rem;
    }

    .pl-12 {
        padding-left: 2.25rem;
    }

    /* Better icon positioning for mobile */
    .absolute.left-0 {
        left: 0.75rem;
    }
}

/* Better mobile touch interactions */
@media (max-width: 768px) {

    /* Larger touch targets */
    button {
        min-height: 44px;
        min-width: 44px;
    }

    /* Better tap highlighting */
    button,
    input,
    label {
        -webkit-tap-highlight-color: rgba(99, 102, 241, 0.1);
    }

    /* Prevent text selection on labels */
    label {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Better focus indicators for mobile */
    button:focus,
    input:focus {
        outline: 3px solid #6366f1;
        outline-offset: 2px;
    }

    /* Ensure readable font sizes */
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
}

/* Ensure consistent button heights on mobile */
@media (max-width: 640px) {

    .py-3,
    .py-4 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
}

/* Mobile-specific grid improvements */
@media (max-width: 640px) {
    .sm\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}

/* Form styling enhancements */
.form-input {
    @apply w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200;
}

/* Button styling */
.btn-primary {
    @apply px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105;
}

/* Card styling */
.card {
    @apply bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300;
}

/* Icon styling */
.icon-container {
    @apply w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg;
}

/* Text styling */
.text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600;
}

/* Layout improvements */
.container-custom {
    @apply container mx-auto px-4 relative z-10;
}

.section-spacing {
    @apply space-y-4 sm:space-y-6;
}

/* Enhanced focus states */
.focus-ring {
    @apply focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500;
}

/* Print styles */
@media print {
    .no-print {
        display: none !important;
    }

    .shadow-xl,
    .shadow-2xl {
        box-shadow: none !important;
    }

    .bg-gradient-to-br,
    .bg-gradient-to-r {
        background: #ffffff !important;
    }

    .text-white {
        color: #000000 !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .border-gray-200 {
        border-color: #000000;
    }

    .text-gray-600 {
        color: #000000;
    }

    .bg-gray-50 {
        background-color: #ffffff;
    }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Better selection styles */
::selection {
    background-color: #6366f1;
    color: #ffffff;
}

::-moz-selection {
    background-color: #6366f1;
    color: #ffffff;
}

/* Ensure proper stacking context */
.relative {
    position: relative;
    z-index: 1;
}

/* Better mobile container spacing */
@media (max-width: 640px) {
    .container {
        max-width: 100%;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    /* Better form field spacing */
    .space-y-2>*+* {
        margin-top: 0.5rem;
    }

    .space-y-3>*+* {
        margin-top: 0.75rem;
    }
}

/* Better mobile modal positioning */
@media (max-width: 640px) {

    /* Improved layouts for mobile */
    .rounded-2xl {
        border-radius: 0.75rem;
    }

    .rounded-xl {
        border-radius: 0.5rem;
    }

    .p-8 {
        padding: 1rem;
    }

    .p-6 {
        padding: 1rem;
    }

    /* Better button spacing */
    .gap-6 {
        gap: 1rem;
    }

    .gap-4 {
        gap: 0.75rem;
    }

    .gap-3 {
        gap: 0.5rem;
    }
}

/* Optimized scrolling behavior */
.overflow-y-auto {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Mobile password requirements improvements */
@media (max-width: 640px) {
    .password-requirements {
        padding: 1rem;
    }

    .requirement-item {
        padding: 0.625rem;
        font-size: 0.75rem;
    }

    .requirement-dot {
        width: 6px;
        height: 6px;
    }
}

/* Better mobile form validation styles */
@media (max-width: 768px) {
    .error-message {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .success-message {
        font-size: 0.75rem;
        line-height: 1rem;
    }
}

/* Enhanced mobile accessibility */
@media (max-width: 768px) {

    /* Ensure minimum touch target sizes */
    input[type="password"] {
        min-height: 44px;
    }

    /* Better contrast for mobile */
    .text-gray-400 {
        color: #6b7280;
    }

    .text-gray-600 {
        color: #4b5563;
    }
}

/* Mobile-specific password input improvements */
@media (max-width: 640px) {
    input[type="password"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-clip: padding-box;
    }

    /* Prevent password managers from interfering with layout */
    input[type="password"]::-webkit-credentials-auto-fill-button {
        visibility: hidden;
        display: none !important;
        pointer-events: none;
        height: 0;
        width: 0;
        margin: 0;
    }
}

/* Better mobile header responsive design */
@media (max-width: 480px) {
    .hero-header {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }

    .hero-title {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .hero-subtitle {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
}

/* Mobile-optimized decorative elements */
@media (max-width: 640px) {
    .decorative-blur {
        width: 64px;
        height: 64px;
    }

    .decorative-blur-lg {
        width: 96px;
        height: 96px;
    }
}
</style>
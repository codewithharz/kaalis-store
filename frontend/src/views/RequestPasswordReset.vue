<!-- frontend/src/views/RequestPasswordReset.vue -->
<template>
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] bg-[#242424] text-gray-50">
        <div class="w-full max-w-md">
            <h1 class="text-3xl font-bold mb-6 text-center">{{ t('passwordRecovery.requestTitle') }}</h1>
            <form @submit.prevent="requestReset" class="space-y-4">
                <div>
                    <label for="email" class="block text-lg font-semibold text-gray-300 mb-2">{{ t('auth.email') }}</label>
                    <input type="email" id="email" v-model="email"
                        class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required />
                </div>
                <button type="submit"
                    class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] rounded-r focus:outline-none">
                    {{ t('passwordRecovery.requestButton') }}
                </button>
            </form>
            <p v-if="message" class="mt-4 text-center" :class="{ 'text-green-500': !error, 'text-red-500': error }">
                {{ message }}
            </p>
        </div>
    </div>
</template>

<script>
import apiClient from '../api/axios';
import { toast } from 'vue-sonner';
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        const { t } = useI18n();
        return { t };
    },
    data() {
        return {
            email: '',
            message: '',
            error: false,
        };
    },
    methods: {
        async requestReset() {
            try {
                await apiClient.post('/users/request-password-reset', {
                    email: this.email,
                    locale: localStorage.getItem('locale') || 'en',
                });
                this.message = this.t('passwordRecovery.requestSuccess');
                this.error = false;
                toast.success(this.message);
            } catch (error) {
                console.error('Error requesting password reset:', error);
                this.message = error.response?.data?.message || this.t('auth.genericError');
                this.error = true;
                toast.error(this.message);
            }
        },
    },
};
</script>

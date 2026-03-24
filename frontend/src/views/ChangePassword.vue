<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-3xl font-bold">{{ t('changePasswordPage.title') }}</h1>
        <form @submit.prevent="changePassword">
            <input v-model="currentPassword" type="password" :placeholder="t('changePasswordPage.currentPassword')"
                class="mt-2 p-2 border border-gray-300 rounded" required />
            <input v-model="newPassword" type="password" :placeholder="t('changePasswordPage.newPassword')"
                class="mt-2 p-2 border border-gray-300 rounded" required />
            <input v-model="confirmNewPassword" type="password" :placeholder="t('changePasswordPage.confirmNewPassword')"
                class="mt-2 p-2 border border-gray-300 rounded" required />
            <button type="submit" class="mt-4 p-2 bg-blue-500 text-white rounded">
                {{ t('changePasswordPage.submit') }}
            </button>
            <p v-if="message" class="mt-2">{{ message }}</p>
        </form>
    </div>
</template>

<script>
import apiClient from '../api/axios'; // Import the Axios client for API requests
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        const { t } = useI18n();
        return { t };
    },
    data() {
        return {
            currentPassword: '', // Current password
            newPassword: '', // New password
            confirmNewPassword: '', // Confirm new password
            message: '' // Message to display
        };
    },
    methods: {
        async changePassword() {
            if (this.newPassword !== this.confirmNewPassword) {
                this.message = this.t('changePasswordPage.passwordMismatch');
                return;
            }

            try {
                await apiClient.post('/users/change-password', {
                    currentPassword: this.currentPassword,
                    newPassword: this.newPassword
                });
                this.message = this.t('changePasswordPage.success');
            } catch (error) {
                this.message = error.response?.data?.message || this.t('auth.genericError');
            }
        }
    }
};
</script>

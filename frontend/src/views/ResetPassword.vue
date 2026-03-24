<!-- frontend/src/views/ResetPassword.vue -->
<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] bg-[#242424] text-gray-50">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold mb-6 text-center">{{ t('passwordRecovery.resetTitle') }}</h1>
      <form @submit.prevent="resetPassword" class="space-y-4">
        <div>
          <label for="password" class="block text-lg font-semibold text-gray-300 mb-2">{{ t('passwordRecovery.newPassword') }}</label>
          <input type="password" id="password" v-model="password"
            class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required />
        </div>
        <div>
          <label for="confirmPassword" class="block text-lg font-semibold text-gray-300 mb-2">{{ t('passwordRecovery.confirmNewPassword') }}</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword"
            class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required />
        </div>
        <button type="submit"
          class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] rounded-r focus:outline-none">
          {{ t('passwordRecovery.resetButton') }}
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
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      message: '',
      error: false
    };
  },
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    return { router, t };
  },
  methods: {
    async resetPassword() {
      if (this.password !== this.confirmPassword) {
        this.message = this.t('passwordRecovery.passwordMismatch');
        this.error = true;
        toast.error(this.message);
        return;
      }

      try {
        const token = this.$route.params.token;
        await apiClient.post(`/users/reset-password/${token}`, {
          password: this.password
        });

        toast.success(this.t('passwordRecovery.resetSuccess'));
        this.router.push('/login');
      } catch (error) {
        console.error('Error resetting password:', error);
        this.message = error.response?.data?.message || this.t('auth.genericError');
        this.error = true;
        toast.error(this.message);
      }
    }
  }
};
</script>

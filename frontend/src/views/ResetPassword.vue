<!-- frontend/src/views/ResetPassword.vue -->
<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] bg-[#242424] text-gray-50">
    <div class="w-full max-w-md px-4">
      <h1 class="text-3xl font-bold mb-6 text-center">{{ t('passwordRecovery.resetTitle') }}</h1>

      <div v-if="checkingToken" class="text-center py-8 text-gray-400">
        <p class="text-sm animate-pulse">Verifying reset link...</p>
      </div>

      <div v-else-if="tokenInvalid" class="bg-[#2d2d2d] border border-red-500/40 rounded-lg p-6 text-center space-y-4">
        <p class="text-red-400 font-semibold">{{ message || 'This password reset link is invalid or has expired.' }}</p>
        <p class="text-xs text-gray-400">Please request a new reset link to continue.</p>
        <router-link
          to="/request-password-reset"
          class="inline-block mt-2 px-5 py-2 rounded text-white text-sm font-semibold bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:opacity-90">
          Request New Link
        </router-link>
      </div>

      <form v-else @submit.prevent="resetPassword" class="space-y-4">
        <div>
          <label for="password" class="block text-lg font-semibold text-gray-300 mb-2">{{ t('passwordRecovery.newPassword') }}</label>
          <input type="password" id="password" v-model="password"
            class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :disabled="loading"
            minlength="6"
            required />
        </div>
        <div>
          <label for="confirmPassword" class="block text-lg font-semibold text-gray-300 mb-2">{{ t('passwordRecovery.confirmNewPassword') }}</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword"
            class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :disabled="loading"
            minlength="6"
            required />
        </div>
        <button type="submit"
          :disabled="loading"
          class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Resetting...' : t('passwordRecovery.resetButton') }}
        </button>
      </form>

      <p v-if="message && !tokenInvalid" class="mt-4 text-center" :class="{ 'text-green-500': !error, 'text-red-500': error }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import apiClient from '../api/axios';
import { toast } from 'vue-sonner';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      message: '',
      error: false,
      loading: false,
      checkingToken: false,
      tokenInvalid: false,
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    return { router, route, t };
  },
  computed: {
    cleanToken() {
      const raw = this.route?.params?.token || this.$route?.params?.token || '';
      return String(raw).trim().replace(/\/+$/, '');
    },
  },
  async mounted() {
    if (!this.cleanToken) {
      this.tokenInvalid = true;
      this.message = 'No reset token provided in link.';
      return;
    }

    try {
      this.checkingToken = true;
      await apiClient.get(`/users/reset-password/${encodeURIComponent(this.cleanToken)}/verify`);
      this.tokenInvalid = false;
    } catch (err) {
      console.warn('Reset token verification response:', err.response?.data);
      if (err.response?.status === 400) {
        this.tokenInvalid = true;
        this.message = err.response?.data?.message || 'Password reset token is invalid or has expired';
      }
    } finally {
      this.checkingToken = false;
    }
  },
  methods: {
    async resetPassword() {
      if (this.loading) return;

      if (!this.cleanToken) {
        this.message = 'Invalid reset token';
        this.error = true;
        toast.error(this.message);
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.message = this.t('passwordRecovery.passwordMismatch');
        this.error = true;
        toast.error(this.message);
        return;
      }

      if (this.password.length < 6) {
        this.message = 'Password must be at least 6 characters long';
        this.error = true;
        toast.error(this.message);
        return;
      }

      this.loading = true;
      this.error = false;
      this.message = '';

      try {
        await apiClient.post(`/users/reset-password/${encodeURIComponent(this.cleanToken)}`, {
          password: this.password,
        });

        toast.success(this.t('passwordRecovery.resetSuccess') || 'Password reset successfully!');
        this.router.push('/login');
      } catch (error) {
        console.error('Error resetting password:', error);
        this.message = error.response?.data?.message || this.t('auth.genericError');
        this.error = true;
        toast.error(this.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<!-- frontend/src/components/TwoFactorSettings.vue -->
<template>
    <div class="bg-gray-800 rounded-lg p-6 mt-6">
        <h2 class="text-2xl font-bold mb-4 text-white">Two-Factor Authentication</h2>

        <div v-if="!user.twoFactorEnabled" class="mb-6">
            <p class="text-gray-300 mb-4">
                Enhance your account security by enabling two-factor authentication. Once enabled,
                you'll need to enter a verification code sent to your phone each time you log in.
            </p>

            <div v-if="!setupMode">
                <button @click="startSetup"
                    class="bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white font-semibold py-2 px-4 rounded">
                    Enable Two-Factor Authentication
                </button>
            </div>

            <div v-else>
                <form @submit.prevent="sendVerificationCode" class="space-y-4">
                    <div class="space-y-2">
                        <label for="phoneNumber" class="block text-gray-300">Phone Number</label>
                        <input type="tel" id="phoneNumber" v-model="phoneNumber"
                            class="w-full text-gray-800 px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+12345678900" required />
                        <p class="text-xs text-gray-400">Format: +[country code][number], e.g. +1234567890</p>
                    </div>

                    <div class="flex space-x-2">
                        <button type="submit"
                            class="bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white font-semibold py-2 px-4 rounded"
                            :disabled="isLoading">
                            {{ codeSent ? 'Resend Code' : 'Send Verification Code' }}
                        </button>
                        <button type="button" @click="cancelSetup"
                            class="bg-gray-700 text-gray-300 py-2 px-4 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>

                <div v-if="codeSent" class="mt-6">
                    <form @submit.prevent="verifyCode" class="space-y-4">
                        <div class="space-y-2">
                            <label for="verificationCode" class="block text-gray-300">Verification Code</label>
                            <input type="text" id="verificationCode" v-model="verificationCode"
                                class="w-full text-gray-800 px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                maxlength="6" required autocomplete="one-time-code" />
                        </div>

                        <button type="submit"
                            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                            :disabled="isLoading">
                            Verify & Enable 2FA
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <div v-else class="mb-6">
            <div class="bg-green-900 bg-opacity-40 border border-green-800 rounded-lg p-4 mb-4">
                <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-2" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                        <p class="font-medium text-green-400">Two-factor authentication is enabled</p>
                        <p class="text-green-300 text-sm mt-1">Your account has an extra layer of security.</p>
                    </div>
                </div>
            </div>

            <p class="text-gray-300 mb-4">
                Your phone number: <span class="font-medium">{{ user.phoneNumber || 'Not visible for security' }}</span>
            </p>

            <button @click="disableTwoFactor"
                class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" :disabled="isLoading">
                Disable Two-Factor Authentication
            </button>
        </div>

        <div v-if="errorMessage" class="mt-4 p-3 bg-red-900 bg-opacity-40 border border-red-800 rounded text-red-300">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../store/user';
import { toast } from 'vue-sonner';

export default {
    name: 'TwoFactorSettings',

    setup() {
        const userStore = useUserStore();
        const user = computed(() => userStore.user);

        const setupMode = ref(false);
        const phoneNumber = ref('');
        const verificationCode = ref('');
        const codeSent = ref(false);
        const isLoading = ref(false);
        const errorMessage = ref('');

        onMounted(() => {
            // Pre-fill phone number if it exists in user profile
            if (user.value && user.value.phoneNumber) {
                phoneNumber.value = user.value.phoneNumber;
            }
        });

        const startSetup = () => {
            setupMode.value = true;
            errorMessage.value = '';
        };

        const cancelSetup = () => {
            setupMode.value = false;
            codeSent.value = false;
            verificationCode.value = '';
            errorMessage.value = '';
        };

        const sendVerificationCode = async () => {
            // Validate phone number format
            if (!phoneNumber.value.match(/^\+[1-9]\d{1,14}$/)) {
                errorMessage.value = 'Please enter a valid phone number in international format (e.g., +1234567890)';
                return;
            }

            errorMessage.value = '';
            isLoading.value = true;

            try {
                await userStore.enableTwoFactor(user.value._id, phoneNumber.value);
                codeSent.value = true;
                toast.success('Verification code sent to your phone');
            } catch (error) {
                errorMessage.value = error.message || 'Failed to send verification code';
                toast.error(errorMessage.value);
            } finally {
                isLoading.value = false;
            }
        };

        const verifyCode = async () => {
            if (!verificationCode.value) {
                errorMessage.value = 'Please enter the verification code';
                return;
            }

            errorMessage.value = '';
            isLoading.value = true;

            try {
                await userStore.verifyTwoFactorCode(user.value._id, phoneNumber.value, verificationCode.value);

                // Reset state after successful verification
                setupMode.value = false;
                codeSent.value = false;
                verificationCode.value = '';

                toast.success('Two-factor authentication has been enabled');
            } catch (error) {
                errorMessage.value = error.message || 'Failed to verify code';
            } finally {
                isLoading.value = false;
            }
        };

        const disableTwoFactor = async () => {
            if (!confirm('Are you sure you want to disable two-factor authentication? This will reduce the security of your account.')) {
                return;
            }

            errorMessage.value = '';
            isLoading.value = true;

            try {
                await userStore.disableTwoFactor(user.value._id);
                toast.success('Two-factor authentication has been disabled');
            } catch (error) {
                errorMessage.value = error.message || 'Failed to disable two-factor authentication';
                toast.error(errorMessage.value);
            } finally {
                isLoading.value = false;
            }
        };

        return {
            user,
            setupMode,
            phoneNumber,
            verificationCode,
            codeSent,
            isLoading,
            errorMessage,
            startSetup,
            cancelSetup,
            sendVerificationCode,
            verifyCode,
            disableTwoFactor
        };
    }
};
</script>
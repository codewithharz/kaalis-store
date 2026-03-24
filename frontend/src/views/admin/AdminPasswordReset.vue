<!-- frontend/src/views/admin/AdminPasswordReset.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <!-- Hero Header -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600">
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-4xl font-bold mb-4">{{ t('adminPasswordReset.title') }}</h1>
                    <p class="text-lg mb-8 text-white/90">{{ t('adminPasswordReset.subtitle') }}</p>
                </div>
            </div>
        </div>

        <!-- Password Reset Form -->
        <div class="container mx-auto px-4 -mt-20 relative z-10">
            <div class="max-w-4xl mx-auto space-y-6">
                <div
                    class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                    <div class="p-8 space-y-6">
                        <!-- Header -->
                        <div class="flex items-center gap-6">
                            <div class="p-3 bg-indigo-50 rounded-xl">
                                <KeyRound class="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 class="text-2xl font-semibold text-gray-900">{{ t('adminPasswordReset.formTitle') }}</h2>
                                <p class="text-sm text-gray-500 mt-1">{{ t('adminPasswordReset.formSubtitle') }}</p>
                            </div>
                        </div>

                        <!-- Form -->
                        <form @submit.prevent="resetPassword" class="space-y-6">
                            <!-- Current Password -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">{{ t('adminPasswordReset.fields.currentPassword') }}</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input :type="showPassword.current ? 'text' : 'password'"
                                        v-model="form.currentPassword"
                                        class="w-full px-4 py-3 pl-11 pr-10 text-gray-700 bg-transparent border-none focus:outline-none"
                                        :placeholder="t('adminPasswordReset.placeholders.currentPassword')" />
                                    <button type="button" @click="showPassword.current = !showPassword.current"
                                        class="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Eye v-if="!showPassword.current" class="h-5 w-5 text-gray-400" />
                                        <EyeOff v-else class="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>
                                <div v-if="form.errors.currentPassword" class="mt-1 text-sm text-red-600">
                                    {{ form.errors.currentPassword }}
                                </div>
                            </div>

                            <!-- New Password -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">{{ t('adminPasswordReset.fields.newPassword') }}</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <Key class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input :type="showPassword.new ? 'text' : 'password'" v-model="form.newPassword"
                                        class="w-full px-4 py-3 pl-11 pr-10 text-gray-700 bg-transparent border-none focus:outline-none"
                                        :placeholder="t('adminPasswordReset.placeholders.newPassword')" @input="checkPasswordStrength" />
                                    <button type="button" @click="showPassword.new = !showPassword.new"
                                        class="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Eye v-if="!showPassword.new" class="h-5 w-5 text-gray-400" />
                                        <EyeOff v-else class="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>

                                <!-- Password Strength Indicator -->
                                <div class="mt-2">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-sm text-gray-500">{{ t('adminPasswordReset.passwordStrength.label') }}</span>
                                        <span class="text-sm" :class="{
                                            'text-red-500': passwordStrength === 'weak',
                                            'text-yellow-500': passwordStrength === 'medium',
                                            'text-green-500': passwordStrength === 'strong'
                                        }">{{ t(`adminPasswordReset.passwordStrength.${passwordStrength}`) }}</span>
                                    </div>
                                    <div class="h-2 bg-gray-200 rounded-full">
                                        <div class="h-full rounded-full transition-all duration-300" :class="{
                                            'bg-red-500': passwordStrength === 'weak',
                                            'bg-yellow-500': passwordStrength === 'medium',
                                            'bg-green-500': passwordStrength === 'strong'
                                        }" :style="`width: ${passwordStrengthPercentage}%`"></div>
                                    </div>
                                </div>

                                <!-- Password Requirements -->
                                <ul class="text-sm text-gray-500 mt-2 space-y-1">
                                    <li class="flex items-center"
                                        :class="{ 'text-green-500': form.newPassword.length >= 8 }">
                                        <Check v-if="form.newPassword.length >= 8" class="w-4 h-4 mr-2" />
                                        <X v-else class="w-4 h-4 mr-2" />
                                        {{ t('adminPasswordReset.requirements.minLength') }}
                                    </li>
                                    <li class="flex items-center"
                                        :class="{ 'text-green-500': /[A-Z]/.test(form.newPassword) }">
                                        <Check v-if="/[A-Z]/.test(form.newPassword)" class="w-4 h-4 mr-2" />
                                        <X v-else class="w-4 h-4 mr-2" />
                                        {{ t('adminPasswordReset.requirements.uppercase') }}
                                    </li>
                                    <li class="flex items-center"
                                        :class="{ 'text-green-500': /[a-z]/.test(form.newPassword) }">
                                        <Check v-if="/[a-z]/.test(form.newPassword)" class="w-4 h-4 mr-2" />
                                        <X v-else class="w-4 h-4 mr-2" />
                                        {{ t('adminPasswordReset.requirements.lowercase') }}
                                    </li>
                                    <li class="flex items-center"
                                        :class="{ 'text-green-500': /\d/.test(form.newPassword) }">
                                        <Check v-if="/\d/.test(form.newPassword)" class="w-4 h-4 mr-2" />
                                        <X v-else class="w-4 h-4 mr-2" />
                                        {{ t('adminPasswordReset.requirements.number') }}
                                    </li>
                                    <li class="flex items-center"
                                        :class="{ 'text-green-500': specialCharRegex.test(form.newPassword) }">
                                        <Check v-if="specialCharRegex.test(form.newPassword)" class="w-4 h-4 mr-2" />
                                        <X v-else class="w-4 h-4 mr-2" />
                                        {{ t('adminPasswordReset.requirements.specialCharacter') }}
                                    </li>

                                </ul>

                                <div v-if="form.errors.newPassword" class="mt-1 text-sm text-red-600">
                                    {{ form.errors.newPassword }}
                                </div>
                            </div>

                            <!-- Confirm Password -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">{{ t('adminPasswordReset.fields.confirmNewPassword') }}</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input :type="showPassword.confirm ? 'text' : 'password'"
                                        v-model="form.confirmPassword"
                                        class="w-full px-4 py-3 pl-11 pr-10 text-gray-700 bg-transparent border-none focus:outline-none"
                                        :placeholder="t('adminPasswordReset.placeholders.confirmPassword')" />
                                    <button type="button" @click="showPassword.confirm = !showPassword.confirm"
                                        class="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Eye v-if="!showPassword.confirm" class="h-5 w-5 text-gray-400" />
                                        <EyeOff v-else class="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>
                                <div v-if="form.errors.confirmPassword" class="mt-1 text-sm text-red-600">
                                    {{ form.errors.confirmPassword }}
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex justify-end pt-4">
                                <button type="submit" :disabled="isLoading || !isFormValid"
                                    class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50">
                                    <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
                                    <span>{{ isLoading ? t('adminPasswordReset.actions.updating') : t('adminPasswordReset.actions.updatePassword') }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '@/store/admin';
import { toast } from 'vue-sonner';
import {
    Lock,
    Key,
    KeyRound,
    Eye,
    EyeOff,
    Check,
    X,
    Loader2
} from 'lucide-vue-next';

export default {
    name: 'AdminPasswordReset',
    components: {
        Lock,
        Key,
        KeyRound,
        Eye,
        EyeOff,
        Check,
        X,
        Loader2
    },
    setup() {
        const { t } = useI18n();
        const adminStore = useAdminStore();
        const isLoading = ref(false);
        const passwordStrength = ref('weak');
        const passwordStrengthPercentage = ref(0);
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;


        const showPassword = reactive({
            current: false,
            new: false,
            confirm: false
        });

        const form = reactive({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            errors: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        });

        const checkPasswordStrength = () => {
            const password = form.newPassword;
            let strength = 0;

            // Length check
            if (password.length >= 8) strength += 20;
            // Uppercase check
            if (/[A-Z]/.test(password)) strength += 20;
            // Lowercase check
            if (/[a-z]/.test(password)) strength += 20;
            // Number check
            if (/\d/.test(password)) strength += 20;
            // Special character check
            if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;

            passwordStrengthPercentage.value = strength;

            if (strength <= 40) passwordStrength.value = 'weak';
            else if (strength <= 80) passwordStrength.value = 'medium';
            else passwordStrength.value = 'strong';
        };

        const validatePassword = (password) => {
            const minLength = 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = specialCharRegex.test(password);

            const errors = [];
            if (password.length < minLength) {
                errors.push(t('adminPasswordReset.validation.minLength', { count: minLength }));
            }
            if (!hasUpperCase) errors.push(t('adminPasswordReset.validation.uppercase'));
            if (!hasLowerCase) errors.push(t('adminPasswordReset.validation.lowercase'));
            if (!hasNumbers) errors.push(t('adminPasswordReset.validation.number'));
            if (!hasSpecialChar) errors.push(t('adminPasswordReset.validation.specialCharacter'));

            return errors;
        };

        const resetForm = () => {
            form.currentPassword = '';
            form.newPassword = '';
            form.confirmPassword = '';
            form.errors.currentPassword = '';
            form.errors.newPassword = '';
            form.errors.confirmPassword = '';
            passwordStrength.value = 'weak';
            passwordStrengthPercentage.value = 0;
        };

        const validateForm = () => {
            let isValid = true;
            form.errors.currentPassword = '';
            form.errors.newPassword = '';
            form.errors.confirmPassword = '';

            if (!form.currentPassword) {
                form.errors.currentPassword = t('adminPasswordReset.validation.currentPasswordRequired');
                isValid = false;
            }

            if (!form.newPassword) {
                form.errors.newPassword = t('adminPasswordReset.validation.newPasswordRequired');
                isValid = false;
            } else {
                const passwordErrors = validatePassword(form.newPassword);
                if (passwordErrors.length > 0) {
                    form.errors.newPassword = passwordErrors.join(', ');
                    isValid = false;
                }
            }

            if (!form.confirmPassword) {
                form.errors.confirmPassword = t('adminPasswordReset.validation.confirmPasswordRequired');
                isValid = false;
            } else if (form.newPassword !== form.confirmPassword) {
                form.errors.confirmPassword = t('adminPasswordReset.validation.passwordsDoNotMatch');
                isValid = false;
            }

            if (form.currentPassword === form.newPassword) {
                form.errors.newPassword = t('adminPasswordReset.validation.mustBeDifferent');
                isValid = false;
            }

            return isValid;
        };

        const isFormValid = computed(() => {
            return form.currentPassword &&
                form.newPassword &&
                form.confirmPassword &&
                passwordStrength.value !== 'weak' &&
                form.newPassword === form.confirmPassword;
        });

        const resetPassword = async () => {
            if (!validateForm()) {
                return;
            }

            isLoading.value = true;
            try {
                await adminStore.changePassword({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                });

                toast.success(t('adminPasswordReset.toasts.updated'));
                resetForm();
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || t('adminPasswordReset.toasts.updateFailed');

                if (errorMessage.toLowerCase().includes('current password')) {
                    form.errors.currentPassword = errorMessage;
                } else if (errorMessage.toLowerCase().includes('validation')) {
                    form.errors.newPassword = errorMessage;
                } else {
                    toast.error(errorMessage);
                }
            } finally {
                isLoading.value = false;
            }
        };

        return {
            form,
            showPassword,
            isLoading,
            resetPassword,
            passwordStrength,
            passwordStrengthPercentage,
            checkPasswordStrength,
            isFormValid,
            specialCharRegex,
            t
        };
    }
};
</script>

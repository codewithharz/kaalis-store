<!-- frontend/src/views/admin/AdminPasswordReset.vue -->
<template>
    <div class="space-y-6">
        <!-- Header Card -->
        <div class="flex flex-col gap-4 px-8 py-4 rounded-b-lg bg-white lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ t('adminPasswordReset.title') }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ t('adminPasswordReset.subtitle') }}</p>
            </div>
        </div>

        <!-- Form Container -->
        <div class="max-w-2xl">
            <div class="rounded-lg bg-white p-6 shadow-sm border border-slate-100">
                <div class="space-y-6">
                    <!-- Form Title Header -->
                    <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <div class="p-3 bg-[#24a3b5]/10 rounded-xl">
                            <KeyRound class="w-6 h-6 text-[#24a3b5]" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">{{ t('adminPasswordReset.formTitle') }}</h3>
                            <p class="text-xs text-gray-500 mt-0.5">{{ t('adminPasswordReset.formSubtitle') }}</p>
                        </div>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="resetPassword" class="space-y-6">
                        <!-- Current Password -->
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-gray-700">{{ t('adminPasswordReset.fields.currentPassword') }}</label>
                            <div
                                class="relative rounded-lg border border-gray-200 focus-within:border-[#24a3b5] focus-within:ring-2 focus-within:ring-[#24a3b5]/20 transition-all bg-white">
                                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input :type="showPassword.current ? 'text' : 'password'"
                                    v-model="form.currentPassword"
                                    class="w-full px-4 py-2.5 pl-11 pr-10 text-sm text-gray-700 bg-transparent border-none focus:outline-none"
                                    :placeholder="t('adminPasswordReset.placeholders.currentPassword')" />
                                <button type="button" @click="showPassword.current = !showPassword.current"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 rounded-full hover:bg-slate-100 transition-colors">
                                    <Eye v-if="!showPassword.current" class="h-4 w-4 text-gray-400" />
                                    <EyeOff v-else class="h-4 w-4 text-gray-400" />
                                </button>
                            </div>
                            <div v-if="form.errors.currentPassword" class="mt-1 text-xs text-red-600">
                                {{ form.errors.currentPassword }}
                            </div>
                        </div>

                        <!-- New Password -->
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-gray-700">{{ t('adminPasswordReset.fields.newPassword') }}</label>
                            <div
                                class="relative rounded-lg border border-gray-200 focus-within:border-[#24a3b5] focus-within:ring-2 focus-within:ring-[#24a3b5]/20 transition-all bg-white">
                                <Key class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input :type="showPassword.new ? 'text' : 'password'" v-model="form.newPassword"
                                    class="w-full px-4 py-2.5 pl-11 pr-10 text-sm text-gray-700 bg-transparent border-none focus:outline-none"
                                    :placeholder="t('adminPasswordReset.placeholders.newPassword')" @input="checkPasswordStrength" />
                                <button type="button" @click="showPassword.new = !showPassword.new"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 rounded-full hover:bg-slate-100 transition-colors">
                                    <Eye v-if="!showPassword.new" class="h-4 w-4 text-gray-400" />
                                    <EyeOff v-else class="h-4 w-4 text-gray-400" />
                                </button>
                            </div>

                            <!-- Password Strength Indicator -->
                            <div class="mt-2.5">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs text-gray-500 font-medium">{{ t('adminPasswordReset.passwordStrength.label') }}</span>
                                    <span class="text-xs font-semibold uppercase tracking-wider" :class="{
                                        'text-red-500': passwordStrength === 'weak',
                                        'text-amber-500': passwordStrength === 'medium',
                                        'text-emerald-500': passwordStrength === 'strong'
                                    }">{{ t(`adminPasswordReset.passwordStrength.${passwordStrength}`) }}</span>
                                </div>
                                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-300" :class="{
                                        'bg-red-500': passwordStrength === 'weak',
                                        'bg-amber-500': passwordStrength === 'medium',
                                        'bg-emerald-500': passwordStrength === 'strong'
                                    }" :style="`width: ${passwordStrengthPercentage}%`"></div>
                                </div>
                            </div>

                            <!-- Password Requirements -->
                            <ul class="text-xs text-gray-500 mt-3.5 space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                                <li class="flex items-center animate-fade-in"
                                    :class="{ 'text-emerald-600 font-medium': form.newPassword.length >= 8 }">
                                    <Check v-if="form.newPassword.length >= 8" class="w-4 h-4 mr-2 text-emerald-500" />
                                    <X v-else class="w-4 h-4 mr-2 text-slate-400" />
                                    {{ t('adminPasswordReset.requirements.minLength') }}
                                </li>
                                <li class="flex items-center animate-fade-in"
                                    :class="{ 'text-emerald-600 font-medium': /[A-Z]/.test(form.newPassword) }">
                                    <Check v-if="/[A-Z]/.test(form.newPassword)" class="w-4 h-4 mr-2 text-emerald-500" />
                                    <X v-else class="w-4 h-4 mr-2 text-slate-400" />
                                    {{ t('adminPasswordReset.requirements.uppercase') }}
                                </li>
                                <li class="flex items-center animate-fade-in"
                                    :class="{ 'text-emerald-600 font-medium': /[a-z]/.test(form.newPassword) }">
                                    <Check v-if="/[a-z]/.test(form.newPassword)" class="w-4 h-4 mr-2 text-emerald-500" />
                                    <X v-else class="w-4 h-4 mr-2 text-slate-400" />
                                    {{ t('adminPasswordReset.requirements.lowercase') }}
                                </li>
                                <li class="flex items-center animate-fade-in"
                                    :class="{ 'text-emerald-600 font-medium': /\d/.test(form.newPassword) }">
                                    <Check v-if="/\d/.test(form.newPassword)" class="w-4 h-4 mr-2 text-emerald-500" />
                                    <X v-else class="w-4 h-4 mr-2 text-slate-400" />
                                    {{ t('adminPasswordReset.requirements.number') }}
                                </li>
                                <li class="flex items-center animate-fade-in"
                                    :class="{ 'text-emerald-600 font-medium': specialCharRegex.test(form.newPassword) }">
                                    <Check v-if="specialCharRegex.test(form.newPassword)" class="w-4 h-4 mr-2 text-emerald-500" />
                                    <X v-else class="w-4 h-4 mr-2 text-slate-400" />
                                    {{ t('adminPasswordReset.requirements.specialCharacter') }}
                                </li>
                            </ul>

                            <div v-if="form.errors.newPassword" class="mt-1 text-xs text-red-600">
                                {{ form.errors.newPassword }}
                            </div>
                        </div>

                        <!-- Confirm Password -->
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-gray-700">{{ t('adminPasswordReset.fields.confirmNewPassword') }}</label>
                            <div
                                class="relative rounded-lg border border-gray-200 focus-within:border-[#24a3b5] focus-within:ring-2 focus-within:ring-[#24a3b5]/20 transition-all bg-white">
                                <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input :type="showPassword.confirm ? 'text' : 'password'"
                                    v-model="form.confirmPassword"
                                    class="w-full px-4 py-2.5 pl-11 pr-10 text-sm text-gray-700 bg-transparent border-none focus:outline-none"
                                    :placeholder="t('adminPasswordReset.placeholders.confirmPassword')" />
                                <button type="button" @click="showPassword.confirm = !showPassword.confirm"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 rounded-full hover:bg-slate-100 transition-colors">
                                    <Eye v-if="!showPassword.confirm" class="h-4 w-4 text-gray-400" />
                                    <EyeOff v-else class="h-4 w-4 text-gray-400" />
                                </button>
                            </div>
                            <div v-if="form.errors.confirmPassword" class="mt-1 text-xs text-red-600">
                                {{ form.errors.confirmPassword }}
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end pt-4">
                            <button type="submit" :disabled="isLoading || !isFormValid"
                                class="px-6 py-2.5 bg-[#24a3b5] hover:bg-[#1d8b9a] text-white rounded-lg text-sm font-semibold shadow-sm transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                                <span>{{ isLoading ? t('adminPasswordReset.actions.updating') : t('adminPasswordReset.actions.updatePassword') }}</span>
                            </button>
                        </div>
                    </form>
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

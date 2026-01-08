<!-- frontend/src/views/Register.vue -->
<template>
    <div
        class="flex flex-col items-center justify-between min-h-[calc(100vh-96px)] bg-[#242424] text-gray-50 mt-1 -mb-11">
        <div class="w-full grid min-h-[calc(100vh-96px)] grid-cols-1 lg:grid-cols-2">
            <!-- Left Section: Form -->
            <div class="flex items-center justify-center py-12">
                <div class="mx-auto grid w-[350px] gap-6">
                    <div class="grid gap-2 text-center">
                        <h1 class="text-3xl font-bold">Register</h1>
                        <p class="text-balance text-muted-foreground text-gray-300">
                            {{ verificationStep ? 'Verify Your Phone Number' : 'Create your account' }}
                        </p>
                    </div>

                    <!-- Registration Form - Step 1 -->
                    <form v-if="!verificationStep" @submit.prevent="register">
                        <div class="grid gap-4">
                            <div class="grid gap-2">
                                <label for="username"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">Username</label>
                                <input type="text" id="username" v-model="username"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <div class="grid gap-2">
                                <label for="email"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">Email</label>
                                <input type="email" id="email" v-model="email"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <div class="grid gap-2">
                                <label for="phoneNumber"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">Phone
                                    Number</label>
                                <input type="tel" id="phoneNumber" v-model="phoneNumber"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+12345678900" required />
                                <p class="text-xs text-gray-400 mt-1">Format: +[country code][number], e.g. +1234567890
                                </p>
                            </div>
                            <div class="grid gap-2">
                                <label for="password"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">Password</label>
                                <input type="password" id="password" v-model="password"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <button type="submit"
                                class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white font-bold py-2 px-4 rounded-r focus:outline-none mt-4"
                                :disabled="isLoading">
                                {{ isLoading ? 'Processing...' : 'Register' }}
                            </button>
                            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
                        </div>
                    </form>

                    <!-- Verification Form - Step 2 -->
                    <form v-else @submit.prevent="verifyPhone">
                        <div class="grid gap-4">
                            <div class="bg-gray-700 p-4 rounded-lg mb-2">
                                <p class="text-sm text-gray-300">
                                    We've sent a verification code to your phone <span class="font-semibold">{{
                                        phoneNumber }}</span>.
                                    Please enter it below to verify your account.
                                </p>
                            </div>

                            <div class="grid gap-2">
                                <label for="verificationCode"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">Verification
                                    Code</label>
                                <input type="text" id="verificationCode" v-model="verificationCode"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required maxlength="6" inputmode="numeric" autocomplete="one-time-code" />
                            </div>

                            <button type="submit"
                                class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white font-bold py-2 px-4 rounded-r focus:outline-none mt-4"
                                :disabled="isLoading">
                                {{ isLoading ? 'Verifying...' : 'Verify & Complete Registration' }}
                            </button>

                            <button type="button" @click="resendCode"
                                class="w-full bg-transparent border border-[#ff934b] text-[#ff934b] py-2 px-4 rounded-r hover:bg-[#ff934b] hover:bg-opacity-10 focus:outline-none mt-2"
                                :disabled="isLoading || resendCooldown > 0">
                                {{ resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code' }}
                            </button>

                            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
                        </div>
                    </form>

                    <div class="mt-4 text-center text-sm">
                        Already have an account? <router-link to="/login" class="underline">Login</router-link>
                    </div>
                </div>
            </div>
            <!-- Right Section: Image -->
            <div class="relative hidden lg:block overflow-hidden">
                <img src="https://wallpapercave.com/wp/wp7969113.jpg" alt="Image"
                    class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
                <div
                    class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-8">
                    <h2 class="text-5xl font-extrabold mb-4 animate-pulse">Join Us Today!</h2>
                    <p class="text-lg mb-4 animate-fade-in">Become a member and enjoy exclusive benefits.</p>
                    <p class="text-md">Already have an account? Login and explore more!</p>
                    <router-link to="/login"
                        class=" text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white hover:text-white rounded-r focus:outline-none mt-4">Login</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import apiClient from '../api/axios';
import { useUserStore } from '../store/user';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const userStore = useUserStore();

        const state = reactive({
            username: '',
            email: '',
            password: '',
            phoneNumber: '',
            errorMessage: '',
            isLoading: false,

            // Phone verification
            verificationStep: false,
            verificationCode: '',
            userId: null,
            tempToken: null,
            resendCooldown: 0,
            cooldownInterval: null
        });

        const register = async () => {
            state.errorMessage = '';

            if (!state.username || !state.email || !state.password || !state.phoneNumber) {
                state.errorMessage = 'Please fill in all required fields';
                return;
            }

            // Validate phone number format
            if (!state.phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
                state.errorMessage = 'Please enter a valid phone number in international format (e.g., +1234567890)';
                return;
            }

            state.isLoading = true;

            try {
                const response = await apiClient.post('/users/register', {
                    username: state.username,
                    email: state.email,
                    password: state.password,
                    phoneNumber: state.phoneNumber
                });

                // If registration succeeded and requires verification
                if (response.data.success && response.data.requiresVerification) {
                    state.userId = response.data.userId;
                    state.tempToken = response.data.tempToken;
                    state.verificationStep = true;
                    toast.success("Account created! Please verify your phone number to continue");

                    // Set up resend cooldown
                    startResendCooldown();
                } else {
                    // Older behavior (shouldn't happen with new flow)
                    toast.success("Registration successful!");
                    router.push('/login');
                }
            } catch (error) {
                console.error('Registration failed:', error);
                state.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                toast.error(state.errorMessage);
            } finally {
                state.isLoading = false;
            }
        };

        const verifyPhone = async () => {
            state.errorMessage = '';

            if (!state.verificationCode) {
                state.errorMessage = 'Please enter the verification code';
                return;
            }

            state.isLoading = true;

            try {
                const response = await apiClient.post('/users/verify-phone', {
                    userId: state.userId,
                    code: state.verificationCode
                });

                if (response.data.success) {
                    // Store user data
                    userStore.setUser(
                        { userId: response.data.userId },
                        response.data.token
                    );

                    toast.success("Phone verified and account activated successfully!");
                    router.push('/');
                } else {
                    state.errorMessage = response.data.message || 'Verification failed. Please try again.';
                }
            } catch (error) {
                console.error('Verification failed:', error);
                state.errorMessage = error.response?.data?.message || 'Invalid verification code. Please try again.';
                toast.error(state.errorMessage);
            } finally {
                state.isLoading = false;
            }
        };

        const resendCode = async () => {
            if (state.resendCooldown > 0) return;

            state.isLoading = true;
            state.errorMessage = '';

            try {
                const response = await apiClient.post(`/users/resend-verification/${state.userId}`);

                if (response.data.success) {
                    toast.success("Verification code resent successfully");
                    startResendCooldown();
                } else {
                    state.errorMessage = response.data.message || 'Failed to resend code. Please try again.';
                }
            } catch (error) {
                console.error('Failed to resend code:', error);
                state.errorMessage = error.response?.data?.message || 'Failed to resend code. Please try again.';
                toast.error(state.errorMessage);
            } finally {
                state.isLoading = false;
            }
        };

        const startResendCooldown = () => {
            // 60 second cooldown before allowing resend
            state.resendCooldown = 60;

            clearInterval(state.cooldownInterval);
            state.cooldownInterval = setInterval(() => {
                if (state.resendCooldown > 0) {
                    state.resendCooldown--;
                } else {
                    clearInterval(state.cooldownInterval);
                }
            }, 1000);
        };

        return {
            ...state,
            register,
            verifyPhone,
            resendCode
        };
    },

    beforeUnmount() {
        // Clear any intervals when component is destroyed
        if (this.cooldownInterval) {
            clearInterval(this.cooldownInterval);
        }
    }
};
</script>

<style scoped>
@keyframes fade-in {
    0% {
        opacity: 0;
    }

    5% {
        opacity: 0.5;
    }

    100% {
        opacity: 0.8;
    }
}

.animate-fade-in {
    animation: fade-in 1s ease-in-out;
}

.backdrop-blur-md {
    backdrop-filter: blur(10px);
}
</style>



<!--  -->
<!--  -->
<!--  -->

<!-- frontend/src/views/Login.vue -->
<template>
    <div
        class=" flex flex-col items-center justify-between min-h-[calc(100vh-96px)] bg-[#242424] text-gray-50 mt-1 -mb-11">
        <div class="w-full grid min-h-[calc(100vh-96px)] grid-cols-1 lg:grid-cols-2">
            <div class="flex items-center justify-center py-12">
                <div class="mx-auto grid w-[350px] gap-6">
                    <div class="grid gap-2 text-center">
                        <h1 class="text-3xl font-bold">Login</h1>
                        <p class="text-balance text-muted-foreground text-gray-300">
                            <span v-if="accountVerificationRequired">Verify Your Account</span>
                            <span v-else-if="twoFactorRequired">Two-Factor Authentication</span>
                            <span v-else>Enter your email below to login to your account</span>
                        </p>
                    </div>

                    <!-- Normal Login Form -->
                    <form @submit.prevent="login" v-if="!twoFactorRequired && !accountVerificationRequired">
                        <div class="grid gap-4">
                            <div class="grid gap-2">
                                <label for="text" class="block text-lg font-semibold text-gray-300 mb-2 text-left">Email
                                    or Username</label>
                                <input type="text" id="email" v-model="identifier"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <div class="grid gap-2">
                                <div class="flex items-center">
                                    <label for="password"
                                        class="block text-lg font-semibold text-gray-300 mb-2 text-left">Password</label>
                                    <a href="/request-password-reset"
                                        class="ml-auto inline-block text-sm underline">Forgot
                                        your password?</a>
                                </div>
                                <input id="password" v-model="password" type="password"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <button type="submit"
                                class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white font-bold py-2 px-4 rounded-r focus:outline-none mt-4"
                                :disabled="isLoading">
                                {{ isLoading ? 'Processing...' : 'Login' }}
                            </button>
                            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
                        </div>
                    </form>

                    <!-- Account Verification Form (for users who registered but didn't verify) -->
                    <form @submit.prevent="verifyAccount" v-else-if="accountVerificationRequired">
                        <div class="grid gap-4">
                            <div class="bg-blue-800 bg-opacity-30 p-4 rounded-lg mb-4 border border-blue-700">
                                <p class="text-sm text-blue-200 text-center">
                                    Your account requires verification. We've sent a new code to your phone.
                                    Please enter it below to activate your account.
                                </p>
                            </div>

                            <div class="grid gap-2">
                                <label for="accountVerificationCode"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">
                                    Verification Code
                                </label>
                                <input type="text" id="accountVerificationCode" v-model="verificationCode"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required maxlength="6" inputmode="numeric" autocomplete="one-time-code" />
                            </div>

                            <button type="submit"
                                class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white font-bold py-2 px-4 rounded-r focus:outline-none mt-4"
                                :disabled="isLoading">
                                {{ isLoading ? 'Verifying...' : 'Verify & Activate Account' }}
                            </button>

                            <button type="button" @click="resendActivationCode"
                                class="w-full bg-transparent border border-[#ff934b] text-[#ff934b] py-2 px-4 rounded-r hover:bg-[#ff934b] hover:bg-opacity-10 focus:outline-none mt-2"
                                :disabled="isLoading || resendCooldown > 0">
                                {{ resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code' }}
                            </button>

                            <button type="button" @click="cancelVerification"
                                class="text-gray-400 hover:text-gray-300 text-sm mt-2 text-center">
                                Cancel and try again
                            </button>

                            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
                        </div>
                    </form>

                    <!-- 2FA Verification Form -->
                    <form @submit.prevent="verifyTwoFactor" v-else>
                        <div class="grid gap-4">
                            <div class="bg-gray-700 p-4 rounded-lg mb-4">
                                <p class="text-sm text-gray-300 text-center">
                                    A verification code has been sent to your phone.
                                    Please enter the code below to complete your login.
                                </p>
                            </div>
                            <div class="grid gap-2">
                                <label for="verificationCode"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">
                                    Verification Code
                                </label>
                                <input type="text" id="verificationCode" v-model="verificationCode"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required maxlength="6" inputmode="numeric" autocomplete="one-time-code" />
                            </div>
                            <button type="submit"
                                class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white font-bold py-2 px-4 rounded-r focus:outline-none mt-4"
                                :disabled="isLoading">
                                {{ isLoading ? 'Verifying...' : 'Verify' }}
                            </button>
                            <button type="button" @click="resendCode"
                                class="w-full bg-transparent border border-[#ff934b] text-[#ff934b] py-2 px-4 rounded-r hover:bg-[#ff934b] hover:bg-opacity-10 focus:outline-none mt-2"
                                :disabled="isLoading || resendCooldown > 0">
                                {{ resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code' }}
                            </button>
                            <button type="button" @click="cancelTwoFactor"
                                class="text-gray-400 hover:text-gray-300 text-sm mt-2 text-center">
                                Cancel and try again
                            </button>
                            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
                        </div>
                    </form>

                    <div class="mt-4 text-center text-sm">
                        Don't have an account? <router-link to="/register" class="underline">Sign up</router-link>
                    </div>
                </div>
            </div>
            <!-- Right Section: Image -->
            <div class="relative hidden lg:block overflow-hidden">
                <img src="https://wallpapercave.com/wp/wp7969113.jpg" alt="Image" width="1920" height="1080"
                    class="h-full w-full object-cover" />
                <div
                    class="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-black via-transparent to-black">
                    <div
                        class="text-center px-8 py-4 text-white backdrop-blur-md bg-black bg-opacity-50 rounded-lg shadow-lg">
                        <h2 class="text-5xl font-extrabold mb-4 animate-pulse">Welcome Back!</h2>
                        <p class="text-lg mb-4 animate-fade-in">We're glad to see you again. Please login to access your
                            account.</p>
                        <p class="text-md  mb-5">New here? Sign up and join us today!</p>
                        <router-link to="/register"
                            class=" text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white hover:text-white rounded-r focus:outline-none">Sign
                            Up</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useUserStore } from '../store/user';
import apiClient from '../api/axios';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const userStore = useUserStore();
        const router = useRouter();

        const state = reactive({
            identifier: '',
            password: '',
            errorMessage: '',
            isLoading: false,

            // Authentication states
            twoFactorRequired: false,
            accountVerificationRequired: false, // New state for unverified accounts

            // Verification
            verificationCode: '',
            userId: '',
            tempToken: '',
            phoneNumber: '',

            // Cooldown timer
            resendCooldown: 0,
            cooldownInterval: null
        });

        const login = async () => {
            console.log('Login attempt started');
            state.errorMessage = '';
            state.isLoading = true;

            if (!state.identifier || !state.password) {
                state.errorMessage = 'Please fill in all fields';
                state.isLoading = false;
                return;
            }

            try {
                console.log('Sending login request');
                const response = await apiClient.post('/users/login', {
                    identifier: state.identifier,
                    password: state.password,
                });

                console.log('Login response:', response.data);

                if (response.data.error) {
                    state.errorMessage = response.data.message;
                    console.error('Login error:', response.data.message);
                } else if (response.data.requiresActivation) {
                    // Handle account that needs verification
                    console.log('Account requires activation');
                    state.accountVerificationRequired = true;
                    state.userId = response.data.userId;
                    state.tempToken = response.data.tempToken;
                    state.phoneNumber = response.data.phoneNumber;

                    toast.info("Your account needs to be verified. We've sent a verification code to your phone.");
                    startResendCooldown();
                } else if (response.data.requiresTwoFactor) {
                    // Handle 2FA requirement
                    console.log('Two-factor authentication required');
                    state.twoFactorRequired = true;
                    state.userId = response.data.userId;
                    state.tempToken = response.data.tempToken;

                    // Store temporary token and user data for 2FA
                    userStore.setTwoFactorPending({
                        userId: response.data.userId
                    }, response.data.tempToken);

                    toast.info("Please enter the verification code sent to your phone");
                    startResendCooldown();
                } else {
                    // Normal login without 2FA
                    toast.success("Logged in Successfully");
                    const userData = {
                        success: response.data.success,
                        token: response.data.token,
                        userId: response.data.userId,
                        twoFactorEnabled: response.data.twoFactorEnabled || false
                    };
                    console.log('User data to be stored:', userData);

                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', response.data.token);

                    userStore.setUser(userData, response.data.token);

                    console.log('UserStore after login:', userStore.user, userStore.token);

                    // Fetch user profile immediately after login
                    await userStore.getUserProfile();

                    state.identifier = '';
                    state.password = '';

                    console.log('Redirecting to home page');
                    router.push('/');
                }
            } catch (error) {
                console.error('Error during login:', error);
                console.error('Error response:', error.response?.data);
                state.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                toast.error(state.errorMessage);
            } finally {
                state.isLoading = false;
            }
        };

        const verifyAccount = async () => {
            state.errorMessage = '';
            state.isLoading = true;

            if (!state.verificationCode) {
                state.errorMessage = 'Please enter the verification code';
                state.isLoading = false;
                return;
            }

            try {
                // Use the same endpoint as registration verification
                const response = await apiClient.post('/users/verify-phone', {
                    userId: state.userId,
                    code: state.verificationCode
                });

                if (response.data.success) {
                    // Store user data
                    userStore.setUser(
                        { userId: response.data.userId },
                        response.data.token
                    );

                    toast.success("Account verified and activated successfully!");

                    // Fetch user profile
                    await userStore.getUserProfile();

                    // Reset form state
                    state.accountVerificationRequired = false;
                    state.verificationCode = '';

                    // Redirect to home page
                    router.push('/');
                } else {
                    state.errorMessage = response.data.message || 'Verification failed. Please try again.';
                }
            } catch (error) {
                console.error('Account verification failed:', error);
                state.errorMessage = error.response?.data?.message || 'Invalid verification code. Please try again.';
                toast.error(state.errorMessage);
            } finally {
                state.isLoading = false;
            }
        };

        const verifyTwoFactor = async () => {
            state.errorMessage = '';
            state.isLoading = true;

            if (!state.verificationCode) {
                state.errorMessage = 'Please enter the verification code';
                state.isLoading = false;
                return;
            }

            try {
                const success = await userStore.verifyTwoFactorLogin(state.userId, state.verificationCode);

                if (success) {
                    // Fetch user profile after successful 2FA
                    await userStore.getUserProfile();
                    state.twoFactorRequired = false;
                    state.verificationCode = '';
                    router.push('/');
                } else {
                    state.errorMessage = 'Invalid verification code. Please try again.';
                }
            } catch (error) {
                console.error('Error during 2FA verification:', error);
                state.errorMessage = error.message || 'Verification failed. Please try again.';
            } finally {
                state.isLoading = false;
            }
        };

        const resendCode = async () => {
            if (state.resendCooldown > 0) return;

            state.isLoading = true;
            state.errorMessage = '';

            try {
                await apiClient.post('/users/2fa/init-login', {
                    userId: state.userId
                });

                toast.info("A new verification code has been sent to your phone");
                startResendCooldown();
            } catch (error) {
                console.error('Error resending code:', error);
                state.errorMessage = error.response?.data?.message || 'Failed to resend verification code';
            } finally {
                state.isLoading = false;
            }
        };

        const resendActivationCode = async () => {
            if (state.resendCooldown > 0) return;

            state.isLoading = true;
            state.errorMessage = '';

            try {
                await apiClient.post(`/users/resend-verification/${state.userId}`);

                toast.info("A new verification code has been sent to your phone");
                startResendCooldown();
            } catch (error) {
                console.error('Failed to resend activation code:', error);
                state.errorMessage = error.response?.data?.message || 'Failed to resend verification code';
            } finally {
                state.isLoading = false;
            }
        };

        const cancelTwoFactor = () => {
            state.twoFactorRequired = false;
            userStore.clearTwoFactorPending();
            state.userId = '';
            state.verificationCode = '';
            clearInterval(state.cooldownInterval);
        };

        const cancelVerification = () => {
            state.accountVerificationRequired = false;
            state.userId = '';
            state.verificationCode = '';
            clearInterval(state.cooldownInterval);
        };

        const startResendCooldown = () => {
            // 60 second cooldown before allowing resend
            state.resendCooldown = 60;

            clearInterval(state.cooldownInterval);
            state.cooldownInterval = setInterval(() => {
                if (state.resendCooldown > 0) {
                    state.resendCooldown--;
                } else {
                    clearInterval(state.cooldownInterval);
                }
            }, 1000);
        };

        return {
            ...state,
            login,
            verifyAccount,
            verifyTwoFactor,
            resendCode,
            resendActivationCode,
            cancelTwoFactor,
            cancelVerification
        };
    },

    beforeUnmount() {
        // Clear any intervals when component is destroyed
        if (this.cooldownInterval) {
            clearInterval(this.cooldownInterval);
        }
    }
};
</script>

<style scoped>
@keyframes fade-in {
    0% {
        opacity: 0;
    }

    5% {
        opacity: 0.5;
    }

    100% {
        opacity: 0.8;
    }
}

.animate-fade-in {
    animation: fade-in 1s ease-in-out;
}
</style>
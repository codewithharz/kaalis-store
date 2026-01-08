<!-- frontend/src/views/Login.vue -->
<template>
    <div
        class="flex flex-col items-center justify-between min-h-[calc(100vh-96px)] bg-[#242424] text-gray-50 mt-1 -mb-11">
        <div class="w-full grid min-h-[calc(100vh-96px)] grid-cols-1 lg:grid-cols-2">
            <div class="flex items-center justify-center py-12">
                <div class="mx-auto grid w-[350px] gap-6">
                    <div class="grid gap-2 text-center">
                        <h1 class="text-3xl font-bold">Login</h1>
                        <p class="text-balance text-muted-foreground text-gray-300">
                            Enter your email below to login to your account
                        </p>
                    </div>

                    <!-- Unverified Email Warning -->
                    <div v-if="showResendOption"
                        class="bg-yellow-900 bg-opacity-50 border-l-4 border-yellow-500 text-yellow-100 p-4 rounded">
                        <p class="font-bold">📧 Email Not Verified</p>
                        <p class="text-sm mb-2">Please verify your email before logging in.</p>
                        <button @click="resendVerification" :disabled="isResending"
                            class="text-sm underline hover:no-underline disabled:opacity-50 mt-2 text-yellow-300">
                            {{ isResending ? '📤 Sending...' : '🔄 Resend verification email' }}
                        </button>
                    </div>

                    <form @submit.prevent="login">
                        <div class="grid gap-4">
                            <div class="grid gap-2">
                                <label for="text" class="block text-lg font-semibold text-gray-300 mb-2 text-left">
                                    Email or Username
                                </label>
                                <input type="text" id="email" v-model="identifier"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <div class="grid gap-2">
                                <div class="flex items-center">
                                    <label for="password"
                                        class="block text-lg font-semibold text-gray-300 mb-2 text-left">
                                        Password
                                    </label>
                                    <a href="/request-password-reset" class="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </a>
                                </div>
                                <input id="password" v-model="password" type="password"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <button type="submit"
                                class="w-full text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] rounded-r focus:outline-none mt-4">
                                Login
                            </button>
                            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
                        </div>
                    </form>
                    <div class="mt-4 text-center text-sm">
                        Don't have an account?
                        <router-link to="/register" class="underline">Sign up</router-link>
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
                        <p class="text-lg mb-4 animate-fade-in">
                            We're glad to see you again. Please login to access your account.
                        </p>
                        <p class="text-md mb-5">New here? Sign up and join us today!</p>
                        <router-link to="/register"
                            class="text-white font-bold py-2 px-4 button-hover bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] rounded-r focus:outline-none">
                            Sign Up
                        </router-link>
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
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const userStore = useUserStore();
        const router = useRouter();

        const identifier = ref('');
        const password = ref('');
        const errorMessage = ref('');
        const showResendOption = ref(false);
        const isResending = ref(false);
        const userEmail = ref('');

        const login = async () => {
            console.log('Login attempt started');
            errorMessage.value = '';
            showResendOption.value = false;

            if (!identifier.value || !password.value) {
                errorMessage.value = 'Please fill in all fields';
                return;
            }

            try {
                console.log('Sending login request');
                const response = await apiClient.post('/users/login', {
                    identifier: identifier.value,
                    password: password.value,
                });

                console.log('Login response:', response.data);

                if (response.data.success) {
                    toast.success("Logged in Successfully");
                    const userData = {
                        success: response.data.success,
                        token: response.data.token,
                        userId: response.data.userId,
                    };
                    console.log('User data to be stored:', userData);

                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('token', response.data.token);

                    userStore.setUser(userData, response.data.token);

                    console.log('UserStore after login:', userStore.user, userStore.token);

                    // Fetch user profile immediately after login
                    await userStore.getUserProfile();

                    identifier.value = '';
                    password.value = '';

                    console.log('Redirecting to home page');
                    router.push('/');
                }
            } catch (error) {
                console.error('Error during login:', error);
                console.error('Error response:', error.response?.data);

                const responseData = error.response?.data;
                errorMessage.value = responseData?.message || 'An error occurred. Please try again.';

                // Show resend option if email not verified
                if (responseData?.resendVerification) {
                    showResendOption.value = true;
                    userEmail.value = identifier.value;
                }

                toast.error(errorMessage.value);
            }
        };

        const resendVerification = async () => {
            isResending.value = true;
            try {
                await apiClient.post('/users/resend-verification', {
                    email: userEmail.value
                });
                toast.success('✅ Verification email sent! Please check your inbox.');
                showResendOption.value = false;
            } catch (error) {
                toast.error('❌ Failed to resend email. Please try again.');
            } finally {
                isResending.value = false;
            }
        };

        return {
            identifier,
            password,
            errorMessage,
            showResendOption,
            isResending,
            login,
            resendVerification,
        };
    },
};
</script>

<style scoped></style>
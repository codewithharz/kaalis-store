<!-- frontend/src/views/EmailVerified.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center px-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">

            <!-- Loading State -->
            <div v-if="isVerifying" class="space-y-4">
                <div
                    class="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <svg class="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('emailVerifiedPage.verifyingTitle') }}</h2>
                <p class="text-gray-600">{{ t('emailVerifiedPage.verifyingDescription') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="hasError" class="space-y-4">
                <div class="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ t('emailVerifiedPage.failedTitle') }}</h1>
                <p class="text-lg text-gray-600 mb-8">{{ errorMessage }}</p>
                <button @click="router.push('/register')"
                    class="w-full py-4 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] text-white font-bold text-lg rounded-xl hover:scale-105 transition transform">
                    {{ t('emailVerifiedPage.registerAgain') }}
                </button>
            </div>

            <!-- Success State -->
            <div v-else class="space-y-4">
                <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ t('emailVerifiedPage.successTitle') }}</h1>
                <p class="text-lg text-gray-600 mb-8">
                    {{ t('emailVerifiedPage.successBody', { username: username || t('emailVerifiedPage.friend') }) }}
                </p>
                <button @click="goToDashboard"
                    class="w-full py-4 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] text-white font-bold text-lg rounded-xl hover:scale-105 transition transform">
                    {{ t('emailVerifiedPage.continueToDashboard') }}
                </button>
                <p class="text-sm text-gray-500">
                    {{ t('emailVerifiedPage.redirectingCountdown', { count: countdown }) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store/user'
import { toast } from 'vue-sonner'
import apiClient from '../api/axios'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const username = ref('')
const countdown = ref(5)
const isVerifying = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

onMounted(async () => {
    const token = route.params.token

    console.log('EmailVerified component mounted')
    console.log('Token from route:', token)

    if (!token) {
        hasError.value = true
        errorMessage.value = t('emailVerifiedPage.errors.invalidLink')
        isVerifying.value = false
        return
    }

    try {
        console.log('Calling backend verification endpoint...')
        // Call backend verification endpoint
        const response = await apiClient.get(`/users/verify-email/${token}`)

        console.log('Verification response:', response.data)

        if (response.data.success) {
            // Store auth data
            const userData = {
                userId: response.data.userId,
                token: response.data.token,
                success: true
            }

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(userData))

            console.log('Stored user data:', userData)

            // Update user store
            userStore.setUser(userData, response.data.token)

            console.log('Fetching user profile...')
            // Fetch full profile
            await userStore.getUserProfile()

            username.value = response.data.username || userStore.user?.username || t('emailVerifiedPage.friend')
            isVerifying.value = false

            toast.success(t('emailVerifiedPage.toasts.verified'))

            // Auto redirect countdown
            const timer = setInterval(() => {
                countdown.value--
                if (countdown.value <= 0) {
                    clearInterval(timer)
                    router.push('/')
                }
            }, 1000)
        }
    } catch (error) {
        console.error('Verification error:', error)
        console.error('Error response:', error.response?.data)
        isVerifying.value = false
        hasError.value = true

        errorMessage.value = error.response?.data?.message ||
            t('emailVerifiedPage.errors.expiredLink')

        toast.error(errorMessage.value)
    }
})

const goToDashboard = () => {
    router.push('/')
}
</script>

<style scoped>
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

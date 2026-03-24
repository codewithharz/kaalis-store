<!-- // frontend/src/views/admin/AdminLogin.vue -->
<template>
    <div class="flex min-h-screen bg-gray-100">
        <div class="m-auto w-full max-w-md">
            <div class="bg-white p-8 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">{{ t('adminLogin.title') }}</h2>
                <form @submit.prevent="handleLogin">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">{{ t('adminLogin.identifierLabel') }}</label>
                            <input v-model="identifier" type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                :placeholder="t('adminLogin.identifierPlaceholder')"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">{{ t('adminLogin.passwordLabel') }}</label>
                            <input v-model="password" type="password"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                :placeholder="t('adminLogin.passwordPlaceholder')"
                                required />
                        </div>
                        <div>
                            <button type="submit"
                                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                :disabled="isLoading">
                                {{ isLoading ? t('adminLogin.loggingIn') : t('adminLogin.loginButton') }}
                            </button>
                        </div>
                    </div>
                    <p v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAdminStore } from '../../store/admin'

export default {
    setup() {
        const router = useRouter()
        const { t } = useI18n()
        const adminStore = useAdminStore()
        const identifier = ref('')
        const password = ref('')
        const error = ref('')
        const isLoading = ref(false)

        const handleLogin = async () => {
            error.value = ''
            isLoading.value = true

            try {
                await adminStore.loginAdmin({
                    identifier: identifier.value,
                    password: password.value
                })

                // Get the redirect path from query or default to dashboard
                const redirectPath = router.currentRoute.value.query.redirect || '/admin/dashboard'
                router.push(redirectPath)
            } catch (err) {
                error.value = err.response?.data?.message || t('adminLogin.loginFailed')
            } finally {
                isLoading.value = false
            }
        }

        // Redirect to dashboard if already logged in
        onMounted(() => {
            if (adminStore.isAdminLoggedIn) {
                const redirectPath = router.currentRoute.value.query.redirect || '/admin/dashboard'
                router.push(redirectPath)
            }
        })


        return {
            identifier,
            password,
            error,
            handleLogin,
            isLoading,
            t
        }
    }
}
</script>

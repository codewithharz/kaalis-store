<template>
    <div class="flex flex-col min-h-screen bg-gray-300">
        <!-- Breadcrumb Navigation -->
        <div class="py-3 text-gray-600 text-sm ml-4">
            <p>{{ t('accountShell.home') }} > {{ currentSection }}</p>
        </div>
        <!-- Main Content -->
        <div class="flex flex-col lg:flex-row lg:flex-1 overflow-hidden">
            <Sidebar class="w-full lg:w-auto" />
            <div class="flex-1 flex flex-col">
                <!-- Dynamic Content -->
                <main class="flex-1 overflow-y-auto px-4 pb-4">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import { onMounted, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '../store/user';
import { useRoute } from 'vue-router';


export default {
    name: 'MyAccount',
    components: {
        Sidebar,
    },
    setup() {
        const { t } = useI18n();
        const route = useRoute();
        const userStore = useUserStore();
        const user = computed(() => userStore.user);
        const errorMessage = computed(() => userStore.errorMessage);
        const sidebarOpen = ref(true);

        const currentSection = computed(() => {
            const routeMap = {
                '/account/orders': t('account.myOrders'),
                '/account/clues-bucks': t('account.myCluesBucks'),
                '/account/profile': t('account.myProfile'),
                '/account/my-products': t('account.myProducts'),
                '/account/rate-purchase': t('account.rateYourPurchase'),
                '/account/wishlist': t('account.myWishlist'),
                '/account/favorites': t('account.myFavoriteStores'),
                '/account/help-and-support': t('account.helpSupport')
            };
            return routeMap[route.path] || t('accountShell.myAccount');
        });


        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token available');
                }

                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (!storedUser || !storedUser.userId) {
                    throw new Error('User ID not found in local storage');
                }

                await userStore.fetchUserProfile(storedUser.userId);
            } catch (error) {
                userStore.errorMessage = t('accountShell.profileFetchError', { message: error.message });
            }
        };

        onMounted(async () => {
            const token = localStorage.getItem('token');
            if (token) {
                await fetchProfile();
            } else {
                // Handle the case where token is not available
                console.error('Token is not available on mount');
            }
        });

        return {
            t,
            user,
            errorMessage,
            sidebarOpen,
            currentSection
        };
    },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>

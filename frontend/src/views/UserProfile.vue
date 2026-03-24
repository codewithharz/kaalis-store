<template>
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] bg-gray-100 py-6">
        <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">{{ t('basicUserProfilePage.title') }}</h1>

            <!-- Display user details if available -->
            <div v-if="user" class="space-y-4">
                <p class="text-gray-600"><span class="font-semibold">{{ t('basicUserProfilePage.userId') }}</span> {{ user._id }}</p>
                <p class="text-gray-600"><span class="font-semibold">{{ t('basicUserProfilePage.username') }}</span> {{ user.username }}</p>
                <p class="text-gray-600"><span class="font-semibold">{{ t('basicUserProfilePage.email') }}</span> {{ user.email }}</p>
                <p class="text-gray-600" v-if="!user.profileCompleted">
                    <span class="font-semibold">{{ t('basicUserProfilePage.profileStatus') }}</span> <span class="text-red-500">{{ t('basicUserProfilePage.incomplete') }}</span>
                </p>
                <p class="text-gray-600" v-else>
                    <span class="font-semibold">{{ t('basicUserProfilePage.profileStatus') }}</span> <span class="text-green-500">{{ t('basicUserProfilePage.completed') }}</span>
                </p>
            </div>

            <!-- Toggle Show/Hide Form -->
            <button v-if="user && !showForm" @click="showForm = true"
                class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring">
                {{ t('basicUserProfilePage.editProfile') }}
            </button>

            <!-- Profile Update Form -->
            <form v-if="user && showForm" @submit.prevent="updateProfile" class="mt-6 space-y-4">
                <div>
                    <label for="firstName" class="block text-gray-700">{{ t('basicUserProfilePage.firstName') }}</label>
                    <input type="text" v-model="form.firstName" id="firstName"
                        class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <div>
                    <label for="lastName" class="block text-gray-700">{{ t('basicUserProfilePage.lastName') }}</label>
                    <input type="text" v-model="form.lastName" id="lastName"
                        class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <div>
                    <label for="address" class="block text-gray-700">{{ t('basicUserProfilePage.address') }}</label>
                    <input type="text" v-model="form.address.street" :placeholder="t('checkout.street')"
                        class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300" />
                    <input type="text" v-model="form.address.city" :placeholder="t('checkout.city')"
                        class="w-full mt-2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300" />
                    <input type="text" v-model="form.address.state" :placeholder="t('checkout.state')"
                        class="w-full mt-2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300" />
                    <input type="text" v-model="form.address.country" :placeholder="t('checkout.country')"
                        class="w-full mt-2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <div>
                    <label for="phone" class="block text-gray-700">{{ t('checkout.phone') }}</label>
                    <input type="text" v-model="form.phone" id="phone"
                        class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300" />
                </div>
                <button type="submit"
                    class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring">{{ t('basicUserProfilePage.updateProfile') }}</button>
            </form>

            <!-- Clear Profile Button -->
            <button v-if="user && !showForm" @click="confirmClearProfile"
                class="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring">
                {{ t('basicUserProfilePage.clearProfile') }}
            </button>

            <!-- Display error message if any -->
            <div v-if="errorMessage" class="mt-4">
                <p class="text-red-500 text-center">{{ errorMessage }}</p>
            </div>
        </div>
    </div>
</template>


<script>
import { onMounted, computed, ref, reactive, watch } from 'vue'; // Import necessary functions from Vue
import { useUserStore } from '../store/user'; // Import the user store
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        const { t } = useI18n();
        const userStore = useUserStore();
        const user = computed(() => userStore.user);
        const errorMessage = computed(() => userStore.errorMessage);

        const form = reactive({
            firstName: '',
            lastName: '',
            address: {
                street: '',
                city: '',
                state: '',
                country: '',
            },
            phone: '',
            profileCompleted: false,
        });

        const showForm = ref(false);

        // Watch user to pre-fill form fields when user data is available
        watch(user, (newUser) => {
            if (newUser) {
                form.firstName = newUser.firstName || '';
                form.lastName = newUser.lastName || '';
                form.address = newUser.address || {
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                };
                form.phone = newUser.phone || '';
                form.profileCompleted = newUser.profileCompleted || false;
            }
        });

        onMounted(async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (!storedUser || !storedUser.userId) {
                    throw new Error(t('basicUserProfilePage.missingUserId'));
                }
                await userStore.fetchUserProfile(storedUser.userId);
            } catch (error) {
                userStore.errorMessage = t('basicUserProfilePage.failedLoad');
            }
        });

        const isFormComplete = () => {
            return (
                form.firstName &&
                form.lastName &&
                form.address.street &&
                form.address.city &&
                form.address.state &&
                form.address.country &&
                form.phone
            );
        };

        const updateProfile = async () => {
            try {
                if (isFormComplete()) {
                    form.profileCompleted = true;
                }

                const updatedUser = {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    address: form.address,
                    phone: form.phone,
                    profileCompleted: form.profileCompleted,
                };

                await userStore.completeUserProfile(user.value._id, updatedUser);

                form.firstName = '';
                form.lastName = '';
                form.address = {
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                };
                form.phone = '';

                userStore.user = { ...userStore.user, ...form };
                showForm.value = false;
            } catch (error) {
                userStore.errorMessage = t('basicUserProfilePage.failedUpdate');
            }
        };

        const confirmClearProfile = () => {
            if (confirm(t('basicUserProfilePage.clearConfirm'))) {
                clearProfile();
            }
        };

        const clearProfile = async () => {
            try {
                await userStore.clearUserProfile(user.value._id);

                form.firstName = '';
                form.lastName = '';
                form.address = {
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                };
                form.phone = '';
                form.profileCompleted = false;
            } catch (error) {
                userStore.errorMessage = t('basicUserProfilePage.failedClear');
            }
        };

        return {
            t,
            user,
            errorMessage,
            form,
            showForm,
            updateProfile,
            confirmClearProfile,
        };
    }
};
</script>

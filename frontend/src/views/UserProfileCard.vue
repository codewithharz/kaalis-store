<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <!-- Modern Hero Header -->
        <div class="relative text-white overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="absolute -left-32 -top-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            <div class="container mx-auto px-4 py-16 relative">
                <div class="max-w-3xl mx-auto text-center">
                    <h1 class="text-4xl font-bold mb-4">Profile Settings</h1>
                    <p class="text-lg mb-8 text-white/90">Manage your account information</p>
                </div>
            </div>
        </div>

        <!-- Profile Content -->
        <div class="container mx-auto px-4 -mt-20 relative z-10">
            <div class="max-w-4xl mx-auto space-y-6">
                <!-- Main Profile Card -->
                <div
                    class="bg-white overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-lg bg-white/80 border border-white/20">
                    <!-- Profile Header -->
                    <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <div class="relative">
                            <div
                                class="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                                <UserRound class="w-16 h-16 text-indigo-600" />
                            </div>
                            <button
                                class="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 transition-colors shadow-md">
                                <Camera class="w-5 h-5" />
                            </button>
                        </div>
                        <div class="text-center md:text-left">
                            <h2 class="text-2xl font-bold text-gray-900">
                                <span v-if="user.firstName && user.lastName">
                                    {{ user.firstName }} {{ user.lastName }}
                                </span>
                                <span v-else>{{ user.username }}</span>
                            </h2>
                            <p class="text-gray-500">{{ user.email }}</p>
                        </div>
                    </div>

                    <!-- Success Message -->
                    <div v-if="showSuccess"
                        class="mb-6 p-4 rounded-xl border flex items-center gap-3 bg-green-50 text-green-700 border-green-200">
                        <CheckCircle class="w-5 h-5 flex-shrink-0" />
                        <p class="text-sm">Profile updated successfully!</p>
                    </div>

                    <!-- Profile Form -->
                    <form @submit.prevent="updateProfile" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- First Name -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">First Name</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="form.firstName"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        placeholder="Enter your first name" />
                                </div>
                            </div>

                            <!-- Last Name -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Last Name</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <input type="text" v-model="form.lastName"
                                        class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        placeholder="Enter your last name" />
                                </div>
                            </div>

                            <!-- Phone -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Phone Number</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <Phone class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="tel" v-model="form.phone"
                                        class="w-full pl-11 pr-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        placeholder="Enter your phone number" />
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Email Address</label>
                                <div
                                    class="relative rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="email" v-model="form.email"
                                        class="w-full pl-11 pr-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none"
                                        placeholder="Enter your email address" />
                                </div>
                            </div>
                        </div>

                        <!-- Gender Selection -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Gender</label>
                            <div class="flex gap-6">
                                <label class="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" v-model="form.gender" value="male"
                                        class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                                    <span class="text-gray-700">Male</span>
                                </label>
                                <label class="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" v-model="form.gender" value="female"
                                        class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                                    <span class="text-gray-700">Female</span>
                                </label>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end pt-4">
                            <button type="submit" :disabled="isLoading"
                                class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="isLoading">Updating...</span>
                                <span v-else>Update Profile</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Additional Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Password Settings -->
                    <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer backdrop-blur-lg bg-white/80 border border-white/20"
                        @click="navigateToPasswordSettings">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-semibold text-gray-900">Password Settings</h3>
                                <p class="text-sm text-gray-500">Update your password</p>
                            </div>
                            <ChevronRight class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <!-- Notification Preferences -->
                    <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer backdrop-blur-lg bg-white/80 border border-white/20"
                        @click="navigateToNotifications">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-semibold text-gray-900">Notification Preferences</h3>
                                <p class="text-sm text-gray-500">Manage your notifications</p>
                            </div>
                            <ChevronRight class="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useUserStore } from '../store/user';
import { useAddressStore } from '../store/addressStore';
import { UserRound, Camera, Mail, Phone, ChevronRight, CheckCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const addressStore = useAddressStore();

const user = computed(() => userStore.user);
const addresses = computed(() => addressStore.addresses);
const form = ref({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: ''
});

const isLoading = ref(false);
const showSuccess = ref(false);
const isDataLoaded = ref(false);

const getDefaultBackground = () => {
    return `linear-gradient(135deg, rgba(49, 49, 49, 0.03) 0%, rgba(49, 49, 49, 0.03) 50%,rgba(252, 252, 252, 0.03) 50%, rgba(252, 252, 252, 0.03) 100%), linear-gradient(45deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 50%,rgba(220, 220, 220, 0.03) 50%, rgba(220, 220, 220, 0.03) 100%), linear-gradient(90deg, #ff934b, #ff5e62)`;
};

const updateProfile = async () => {
    try {
        isLoading.value = true;
        if (!user.value._id) {
            throw new Error('User ID is missing.');
        }

        // Update user gender first
        const userData = { gender: form.value.gender };
        const userResponse = await userStore.completeUserProfile(user.value._id, userData);

        // Prepare address data with user ID
        const addressData = {
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            phone: form.value.phone,
            email: form.value.email,
            userId: user.value._id
        };

        // Add address ID if exists
        if (addresses.value.length > 0) {
            addressData._id = addresses.value[0]._id;
        }

        // Update/create address
        await addressStore.addOrUpdateAddress(addressData);

        // Show success state
        showSuccess.value = true;
        setTimeout(() => {
            showSuccess.value = false;
        }, 3000);

        // Load fresh data sequentially to ensure proper order
        await userStore.getUserProfile();  // Get fresh user data first
        await nextTick();                 // Wait for Vue to update
        await addressStore.fetchUserAddresses();  // Then get fresh address data

        // Update form with fresh data
        if (addresses.value.length > 0) {
            form.value = {
                firstName: addresses.value[0].firstName || '',
                lastName: addresses.value[0].lastName || '',
                phone: addresses.value[0].phone || '',
                email: addresses.value[0].email || '',
                gender: user.value.gender || ''
            };
        }

        toast.success('Profile updated successfully');
    } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
    } finally {
        isLoading.value = false;
    }
};

// Watch for changes in addresses and user
watch(
    [
        () => addresses.value?.[0]?.firstName,
        () => addresses.value?.[0]?.lastName,
        () => addresses.value?.[0]?.phone,
        () => addresses.value?.[0]?.email,
        () => user.value?.gender
    ],
    ([firstName, lastName, phone, email, gender]) => {
        form.value = {
            firstName: firstName || '',
            lastName: lastName || '',
            phone: phone || '',
            email: email || '',
            gender: gender || ''
        };
    },
    { immediate: true }
);

const navigateToPasswordSettings = () => {
    router.push('/account/profile/change-password');
};

const navigateToNotifications = () => {
    router.push('/settings/notifications');
};

// Create a function to update form data
const updateFormData = () => {
    if (addresses.value.length > 0 && user.value) {
        form.value = {
            firstName: addresses.value[0].firstName || '',
            lastName: addresses.value[0].lastName || '',
            phone: addresses.value[0].phone || '',
            email: addresses.value[0].email || '',
            gender: user.value.gender || ''
        };
    }
};

// Add onMounted hook to load initial data
onMounted(async () => {
    try {
        isLoading.value = true;
        // Load data sequentially to ensure proper order
        await userStore.getUserProfile();
        await nextTick();
        await addressStore.fetchUserAddresses();
    } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load profile data');
    } finally {
        isLoading.value = false;
    }
});

</script>

<style scoped>
.transform {
    transform-origin: center;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-enter-active {
    animation: fadeIn 0.3s ease-out forwards;
}
</style>

<style scoped>
.custom-radio-container {
    display: flex;
    align-items: center;
    margin-top: 1rem;
}

.custom-radio-container input[type="radio"] {
    position: absolute;
    opacity: 0;
    /* Hide default radio button */
}

.custom-radio-container label {
    position: relative;
    padding-left: 2.4rem;
    /* Space for custom radio button */
    cursor: pointer;
    font-size: 13px;
    color: #555;
}

.custom-radio-container label::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1.5rem;
    /* Custom radio button width */
    height: 1.5rem;
    /* Custom radio button height */
    border-radius: 50%;
    border: 2px solid #24a3b5;
    /* Radio button border color */
    background-color: #fff;
    /* Background color */
    transition: background-color 0.3s, border-color 0.3s;
}

.custom-radio-container input[type="radio"]:checked+label::before {
    background-color: #24a3b5;
    /* Checked background color */
    border-color: #24a3b5;
    /* Checked border color */
}

.custom-radio-container input[type="radio"]:checked+label::after {
    content: '';
    position: absolute;
    left: 0;
    /* Center horizontally */
    top: 50%;
    /* Center vertically */
    transform: translate(50%, -50%);
    /* Center the inner dot */
    width: 0.75rem;
    /* Inner dot width */
    height: 0.75rem;
    /* Inner dot height */
    border-radius: 50%;
    background-color: #fff;
    /* Inner dot color */
}

.custom-border-animation {
    position: relative;
    border-bottom: 1px solid transparent;
    transition: border-color 1s ease;
}

.custom-border-animation:focus {
    outline: none;
    border-bottom: 1px solid #24a3b5;
}

.custom-border-animation:focus::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    height: 1px;
    width: 0;
    background: #24a3b5;
    transition: width 20s ease, left 20s ease;
}

.custom-border-animation:focus::after {
    content: '';
    position: absolute;
    right: 50%;
    bottom: 0;
    height: 1px;
    width: 0;
    background: #24a3b5;
    transition: width 20s ease, right 20s ease;
}

.custom-border-animation:focus:valid::before,
.custom-border-animation:focus:valid::after {
    width: 50%;
}

.custom-border-animation:focus:valid {
    border-bottom: 2px solid #24a3b5;
}
</style>
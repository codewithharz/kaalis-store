<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-3xl font-bold">Change Password</h1>
        <form @submit.prevent="changePassword">
            <input v-model="currentPassword" type="password" placeholder="Current password"
                class="mt-2 p-2 border border-gray-300 rounded" required />
            <input v-model="newPassword" type="password" placeholder="New password"
                class="mt-2 p-2 border border-gray-300 rounded" required />
            <input v-model="confirmNewPassword" type="password" placeholder="Confirm new password"
                class="mt-2 p-2 border border-gray-300 rounded" required />
            <button type="submit" class="mt-4 p-2 bg-blue-500 text-white rounded">
                Change Password
            </button>
            <p v-if="message" class="mt-2">{{ message }}</p>
        </form>
    </div>
</template>

<script>
import apiClient from '../api/axios'; // Import the Axios client for API requests

export default {
    data() {
        return {
            currentPassword: '', // Current password
            newPassword: '', // New password
            confirmNewPassword: '', // Confirm new password
            message: '' // Message to display
        };
    },
    methods: {
        async changePassword() {
            if (this.newPassword !== this.confirmNewPassword) {
                this.message = 'Passwords do not match.';
                return;
            }

            try {
                await apiClient.post('/users/change-password', {
                    currentPassword: this.currentPassword,
                    newPassword: this.newPassword
                });
                this.message = 'Password has been changed successfully.';
            } catch (error) {
                this.message = 'An error occurred. Please try again.';
            }
        }
    }
};
</script>
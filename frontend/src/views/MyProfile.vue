<template>
    <ProfileHeader />
    <!-- Dynamic Content -->
    <router-view />
</template>


<script>
import ProfileHeader from './ProfileHeader.vue';
// import { onMounted, computed, ref, reactive, watch } from 'vue'; // Import necessary functions from Vue
// import { useUserStore } from '../store/user'; // Import the user store

export default {
    name: 'MyProfile',
    components: {
        ProfileHeader,
    },

    // setup() {
    //     const userStore = useUserStore();
    //     const user = computed(() => userStore.user);
    //     const errorMessage = computed(() => userStore.errorMessage);

    //     const form = reactive({
    //         fullName: '',
    //         address: {
    //             street: '',
    //             city: '',
    //             state: '',
    //             country: '',
    //         },
    //         phone: '',
    //         profileCompleted: false,
    //     });

    //     const showForm = ref(false);

    //     // Watch user to pre-fill form fields when user data is available
    //     watch(user, (newUser) => {
    //         if (newUser) {
    //             form.fullName = newUser.fullName || '';
    //             form.address = newUser.address || {
    //                 street: '',
    //                 city: '',
    //                 state: '',
    //                 country: '',
    //             };
    //             form.phone = newUser.phone || '';
    //             form.profileCompleted = newUser.profileCompleted || false;
    //         }
    //     });

    //     onMounted(async () => {
    //         try {
    //             const storedUser = JSON.parse(localStorage.getItem('user'));
    //             if (!storedUser || !storedUser.userId) {
    //                 throw new Error('User ID not found in local storage');
    //             }
    //             await userStore.fetchUserProfile(storedUser.userId);
    //         } catch (error) {
    //             userStore.errorMessage = 'Error fetching user profile';
    //         }
    //     });

    //     const isFormComplete = () => {
    //         return (
    //             form.fullName &&
    //             form.address.street &&
    //             form.address.city &&
    //             form.address.state &&
    //             form.address.country &&
    //             form.phone
    //         );
    //     };

    //     const updateProfile = async () => {
    //         try {
    //             if (isFormComplete()) {
    //                 form.profileCompleted = true;
    //             }

    //             const updatedUser = {
    //                 fullName: form.fullName,
    //                 address: form.address,
    //                 phone: form.phone,
    //                 profileCompleted: form.profileCompleted,
    //             };

    //             await userStore.completeUserProfile(user.value._id, updatedUser);

    //             form.fullName = '';
    //             form.address = {
    //                 street: '',
    //                 city: '',
    //                 state: '',
    //                 country: '',
    //             };
    //             form.phone = '';

    //             userStore.user = { ...userStore.user, ...form };
    //             showForm.value = false;
    //         } catch (error) {
    //             userStore.errorMessage = 'Error updating profile';
    //         }
    //     };

    //     const confirmClearProfile = () => {
    //         if (confirm('Are you sure you want to clear your profile? This action cannot be undone.')) {
    //             clearProfile();
    //         }
    //     };

    //     const clearProfile = async () => {
    //         try {
    //             await userStore.clearUserProfile(user.value._id);

    //             form.fullName = '';
    //             form.address = {
    //                 street: '',
    //                 city: '',
    //                 state: '',
    //                 country: '',
    //             };
    //             form.phone = '';
    //             form.profileCompleted = false;
    //         } catch (error) {
    //             userStore.errorMessage = 'Error clearing profile';
    //         }
    //     };

    //     return {
    //         user,
    //         errorMessage,
    //         form,
    //         showForm,
    //         updateProfile,
    //         confirmClearProfile,
    //     };
    // }
};

</script>

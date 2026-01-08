<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto transform transition-all">
            <!-- Header Section -->
            <div
                class="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl sm:rounded-t-2xl">
                <div class="flex-1 pr-4">
                    <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Edit Seller Profile</h3>
                    <p class="text-xs sm:text-sm text-gray-500 mt-1">Update your store information below</p>
                </div>
                <button @click="$emit('close')"
                    class="flex-shrink-0 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <X class="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            <!-- Form Section -->
            <div class="p-4 sm:p-6 pt-4">
                <form @submit.prevent="updateProfile" class="space-y-4 sm:space-y-6">
                    <!-- Store Name -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700 block">Store Name</label>
                        <div
                            class="relative rounded-lg border border-gray-200 focus-within:border-[#ff934b] focus-within:ring-2 focus-within:ring-[#ff934b]/20 transition-all">
                            <Store
                                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <input type="text" v-model="formData.storeName"
                                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 text-sm sm:text-base text-gray-700 bg-transparent border-none focus:outline-none"
                                placeholder="Enter your store name">
                        </div>
                    </div>

                    <!-- Store Description -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700 block">Store Description</label>
                        <div
                            class="relative rounded-lg border border-gray-200 focus-within:border-[#ff934b] focus-within:ring-2 focus-within:ring-[#ff934b]/20 transition-all">
                            <FileText class="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <textarea v-model="formData.storeDescription" :rows="6"
                                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 text-sm sm:text-base text-gray-700 bg-transparent border-none focus:outline-none resize-none"
                                placeholder="Describe your store">
                            </textarea>
                        </div>
                    </div>

                    <!-- Profile Image -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700 block">Profile Image</label>
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <div
                                class="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <img v-if="formData.profileImage" :src="formData.profileImage" alt="Profile"
                                    class="h-full w-full object-cover">
                                <UserCircle v-else class="h-full w-full text-gray-400" />
                            </div>
                            <div class="flex-1 w-full sm:w-auto">
                                <button type="button" @click="$refs.profileImageInput.click()"
                                    class="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-lg font-medium shadow-md transition-all duration-300 text-sm sm:text-base">
                                    {{ formData.profileImage ? 'Change Image' : 'Upload Image' }}
                                </button>
                                <input type="file" @change="handleProfileImageUpload" accept="image/*" class="hidden"
                                    ref="profileImageInput">
                            </div>
                        </div>
                    </div>

                    <!-- Background Image -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700 block">Background Image</label>
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <div
                                class="relative h-12 w-20 sm:h-20 sm:w-32 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <img v-if="formData.backgroundImage" :src="formData.backgroundImage" alt="Background"
                                    class="h-full w-full object-cover">
                                <Image v-else class="h-full w-full p-2 sm:p-4 text-gray-400" />
                            </div>
                            <div class="flex-1 w-full sm:w-auto">
                                <button type="button" @click="$refs.backgroundImageInput.click()"
                                    class="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-lg font-medium shadow-md transition-all duration-300 text-sm sm:text-base">
                                    {{ formData.backgroundImage ? 'Change Image' : 'Upload Image' }}
                                </button>
                                <input type="file" @change="handleBackgroundImageUpload" accept="image/*" class="hidden"
                                    ref="backgroundImageInput">
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div
                        class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100">
                        <button type="button" @click="$emit('close')"
                            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-sm sm:text-base order-2 sm:order-1">
                            Cancel
                        </button>
                        <button type="submit" :disabled="isSubmitting"
                            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-lg font-medium shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2">
                            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                            <span>{{ isSubmitting ? 'Updating Profile...' : 'Update Profile' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useSellerStore } from '../store/sellerStore';
import { toast } from 'vue-sonner';
import { storage } from '../utils/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, Store, FileText, UserCircle, Image, Loader2 } from 'lucide-vue-next';

export default {
    name: 'EditSellerProfile',
    components: {
        X,
        Store,
        FileText,
        UserCircle,
        Image,
        Loader2
    },
    emits: ['close', 'profile-updated'],
    setup(props, { emit }) {
        const sellerStore = useSellerStore();
        const isSubmitting = ref(false);

        const formData = ref({
            storeName: sellerStore.sellerProfile.storeName || '',
            storeDescription: sellerStore.sellerProfile.storeDescription || '',
            profileImage: sellerStore.sellerProfile.profileImage || '',
            backgroundImage: sellerStore.sellerProfile.backgroundImage || '',
        });

        const uploadImage = async (file, path) => {
            const imageRef = storageRef(storage, `${path}/${file.name}`);
            await uploadBytes(imageRef, file);
            return await getDownloadURL(imageRef);
        };

        const handleProfileImageUpload = async (event) => {
            const file = event.target.files[0];
            if (file) {
                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('Profile image must be less than 5MB');
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    toast.error('Please select a valid image file');
                    return;
                }

                try {
                    toast.loading('Uploading profile image...');
                    const url = await uploadImage(file, 'profile-images');
                    formData.value.profileImage = url;
                    toast.success('Profile image uploaded successfully');
                } catch (error) {
                    console.error('Error uploading profile image:', error);
                    toast.error('Failed to upload profile image');
                }
            }
        };

        const handleBackgroundImageUpload = async (event) => {
            const file = event.target.files[0];
            if (file) {
                // Validate file size (10MB limit for background images)
                if (file.size > 10 * 1024 * 1024) {
                    toast.error('Background image must be less than 10MB');
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    toast.error('Please select a valid image file');
                    return;
                }

                try {
                    toast.loading('Uploading background image...');
                    const url = await uploadImage(file, 'background-images');
                    formData.value.backgroundImage = url;
                    toast.success('Background image uploaded successfully');
                } catch (error) {
                    console.error('Error uploading background image:', error);
                    toast.error('Failed to upload background image');
                }
            }
        };

        const updateProfile = async () => {
            // Validate form data
            if (!formData.value.storeName.trim()) {
                toast.error('Store name is required');
                return;
            }

            if (formData.value.storeName.trim().length < 3) {
                toast.error('Store name must be at least 3 characters');
                return;
            }

            if (formData.value.storeDescription.trim().length > 500) {
                toast.error('Store description must be less than 500 characters');
                return;
            }

            try {
                isSubmitting.value = true;
                await sellerStore.updateSellerProfile(sellerStore.sellerProfile._id, formData.value);
                toast.success('Profile updated successfully');
                emit('profile-updated');
                emit('close');
            } catch (error) {
                console.error('Error updating profile:', error);
                toast.error('Failed to update profile. Please try again.');
            } finally {
                isSubmitting.value = false;
            }
        };

        return {
            formData,
            isSubmitting,
            updateProfile,
            handleProfileImageUpload,
            handleBackgroundImageUpload,
        };
    },
};
</script>

<style scoped>
/* Custom scrollbar for modal content */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Smooth transitions */
* {
    transition: all 0.2s ease-in-out;
}

/* Focus states for accessibility */
input:focus,
textarea:focus,
button:focus {
    outline: 2px solid #ff934b;
    outline-offset: 2px;
}

/* Loading spinner animation */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Mobile-specific optimizations */
@media (max-width: 640px) {

    /* Ensure modal fits on small screens */
    .max-h-\[95vh\] {
        max-height: 95vh;
    }

    /* Better touch targets */
    button {
        min-height: 44px;
    }

    /* Prevent zoom on input focus */
    input,
    textarea {
        font-size: 16px;
    }
}

/* Enhanced hover effects for desktop */
@media (min-width: 640px) {
    button:hover {
        transform: translateY(-1px);
    }

    .hover\:bg-gray-50:hover {
        background-color: #f9fafb;
    }
}

/* File input button styling */
input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
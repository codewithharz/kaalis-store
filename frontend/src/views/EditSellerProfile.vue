<template>
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300">
        <div
            class="bg-white/95 border border-slate-100 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto transform transition-all duration-300 flex flex-col scrollbar-thin">
            
            <!-- Header Section -->
            <div
                class="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/95 rounded-t-2xl sm:rounded-t-3xl sticky top-0 z-10 backdrop-blur-md">
                <div>
                    <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-[#ff934b] bg-clip-text text-transparent">
                        {{ t('editSellerProfileModal.title') }}
                    </h3>
                    <p class="text-xs sm:text-sm text-slate-500 mt-1">
                        {{ t('editSellerProfileModal.subtitle') }}
                    </p>
                </div>
                <button @click="$emit('close')"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-300 hover:rotate-90">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- Form Section -->
            <div class="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                <form @submit.prevent="updateProfile" class="space-y-6">
                    
                    <!-- Media Assets Visual Preview Card -->
                    <div class="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 sm:p-5 space-y-4">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {{ t('editSellerProfileModal.mediaSectionTitle') }}
                        </h4>
                        
                        <!-- Header Preview Container -->
                        <div class="relative rounded-xl overflow-hidden h-32 sm:h-40 bg-slate-200 border border-slate-200 shadow-inner group">
                            <!-- Background Image -->
                            <img v-if="formData.backgroundImage" :src="formData.backgroundImage" alt="Banner" class="w-full h-full object-cover">
                            <div v-else class="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <Image class="w-8 h-8 text-slate-300" />
                            </div>
                            
                            <!-- Banner Upload Button Trigger -->
                            <button type="button" @click="$refs.backgroundImageInput.click()"
                                class="absolute right-3 bottom-3 p-2 bg-slate-900/70 hover:bg-slate-900/90 text-white rounded-lg transition-all backdrop-blur-sm flex items-center gap-1.5 text-xs font-semibold shadow-md active:scale-95">
                                <Camera class="w-3.5 h-3.5" />
                                <span>{{ t('editSellerProfileModal.changeImage') }}</span>
                            </button>
                            <input type="file" @change="handleBackgroundImageUpload" accept="image/*" class="hidden" ref="backgroundImageInput">

                            <!-- Avatar Container overlapping banner -->
                            <div class="absolute left-4 bottom-[-1.5rem] sm:bottom-[-2rem] z-10">
                                <div class="relative group/avatar">
                                    <div class="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-4 border-white bg-slate-100 shadow-md">
                                        <img v-if="formData.profileImage" :src="formData.profileImage" alt="Avatar" class="h-full w-full object-cover">
                                        <UserCircle v-else class="h-full w-full text-slate-300" />
                                    </div>
                                    <button type="button" @click="$refs.profileImageInput.click()"
                                        class="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 active:scale-95">
                                        <Camera class="w-6 h-6 text-white" />
                                    </button>
                                    <input type="file" @change="handleProfileImageUpload" accept="image/*" class="hidden" ref="profileImageInput">
                                </div>
                            </div>
                        </div>

                        <!-- Spacing fix for floating avatar -->
                        <div class="h-6 sm:h-8"></div>
                        <p class="text-xs text-slate-400 text-center sm:text-left pl-0 sm:pl-4">
                            {{ t('editSellerProfileModal.mediaHelperText') }}
                        </p>
                    </div>

                    <!-- Store Details Card -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
                        <!-- Store Name -->
                        <div class="space-y-2">
                            <label class="text-sm font-semibold text-slate-700 block">{{ t('editSellerProfileModal.storeName') }}</label>
                            <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                <Store class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors duration-300 focus-within:text-[#ff934b]" />
                                <input type="text" v-model="formData.storeName"
                                    class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm sm:text-base"
                                    :placeholder="t('editSellerProfileModal.storeNamePlaceholder')">
                            </div>
                        </div>

                        <!-- Store Description -->
                        <div class="space-y-2">
                            <label class="text-sm font-semibold text-slate-700 block">{{ t('editSellerProfileModal.storeDescription') }}</label>
                            <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                                <FileText class="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                <textarea v-model="formData.storeDescription" :rows="4"
                                    class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm sm:text-base resize-none"
                                    :placeholder="t('editSellerProfileModal.storeDescriptionPlaceholder')">
                                </textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Store Verification Status -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div class="flex items-center gap-2 pb-1 border-b border-slate-50">
                            <Shield class="w-5 h-5 text-slate-400" />
                            <h4 class="text-sm font-bold text-slate-700">
                                {{ t('editSellerProfileModal.verificationSection') }}
                            </h4>
                        </div>

                        <!-- Case 1: Approved -> Show Verified badge -->
                        <div v-if="sellerProfile.verificationStatus === 'approved'"
                            class="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-800 flex items-start gap-3 transition-all duration-300">
                            <CheckCircle class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p class="text-sm font-bold">{{ t('adminSellers.statusOptions.approved') }}</p>
                                <p class="text-xs text-emerald-700 mt-0.5">{{ t('editSellerProfileModal.verificationApprovedMsg') }}</p>
                            </div>
                        </div>

                        <!-- Case 2: Under Review / Submitted -> Show Pending/Review banner -->
                        <div v-else-if="sellerProfile.verificationStatus === 'submitted' || sellerProfile.verificationStatus === 'under_review'"
                            class="p-4 bg-sky-50/70 border border-sky-100 rounded-xl text-sky-800 flex items-start gap-3 transition-all duration-300">
                            <Loader2 class="w-5 h-5 text-sky-600 mt-0.5 animate-spin flex-shrink-0" />
                            <div>
                                <p class="text-sm font-bold">{{ sellerProfile.verificationStatus === 'under_review' ? t('adminSellers.statusDisplay.applicationUnderReview') : t('adminSellers.statusDisplay.applicationSubmitted') }}</p>
                                <p class="text-xs text-sky-700 mt-0.5">{{ t('editSellerProfileModal.verificationPendingMsg') }}</p>
                            </div>
                        </div>

                        <!-- Case 3: Rejected -> Show Rejected and request button -->
                        <div v-else-if="sellerProfile.verificationStatus === 'rejected'" class="space-y-3">
                            <div class="p-4 bg-rose-50/70 border border-rose-100 rounded-xl text-rose-800 flex items-start gap-3 transition-all duration-300">
                                <Info class="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p class="text-sm font-bold">{{ t('adminSellers.statusOptions.rejected') }}</p>
                                    <p class="text-xs text-rose-700 mt-0.5">{{ t('editSellerProfileModal.verificationRejectedMsg') }}</p>
                                </div>
                            </div>
                            <button type="button" @click="applyForStoreVerification" :disabled="isSubmittingVerification || isCooldownActive"
                                class="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-98">
                                <Loader2 v-if="isSubmittingVerification" class="w-4 h-4 animate-spin" />
                                <span>{{ t('editSellerProfileModal.verificationReRequestBtn') }}</span>
                            </button>
                        </div>

                        <!-- Case 4: Not Submitted / Falsy -> Show Request Button -->
                        <div v-else class="space-y-3">
                            <div class="p-4 bg-slate-50 rounded-xl text-slate-600 flex items-start gap-3 border border-slate-100">
                                <Info class="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <p class="text-xs leading-relaxed">
                                    {{ t('editSellerProfileModal.verificationNotSubmittedMsg') }}
                                </p>
                            </div>
                            <button type="button" @click="applyForStoreVerification" :disabled="isSubmittingVerification || isCooldownActive"
                                class="w-full px-4 py-3 bg-[#ff934b] hover:bg-[#e8803c] text-white disabled:opacity-50 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98">
                                <Loader2 v-if="isSubmittingVerification" class="w-4 h-4 animate-spin" />
                                <span>{{ t('editSellerProfileModal.verificationRequestBtn') }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Self-Shipping & Fulfillment Settings -->
                    <div class="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div class="flex items-center gap-2 pb-1 border-b border-slate-50">
                            <Truck class="w-5 h-5 text-slate-400" />
                            <h4 class="text-sm font-bold text-slate-700">
                                {{ t('editSellerProfileModal.selfShippingSection') }}
                            </h4>
                        </div>

                        <!-- Case 1: Approved -> Show fulfillmentType dropdown -->
                        <div v-if="sellerProfile.selfShippingApproved" class="space-y-2">
                            <label class="text-sm font-semibold text-slate-600 block">
                                {{ t('editSellerProfileModal.fulfillmentTypeLabel') }}
                            </label>
                            <div class="relative bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 transition-all duration-300">
                                <select v-model="formData.fulfillmentType"
                                    class="w-full bg-transparent px-4 py-3 text-sm text-slate-700 focus:outline-none">
                                    <option value="platform">{{ t('editSellerProfileModal.fulfillmentPlatformOpt') }}</option>
                                    <option value="vendor">{{ t('editSellerProfileModal.fulfillmentVendorOpt') }}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Case 2: Not requested or Rejected -> Show Request Button -->
                        <div v-else-if="sellerProfile.selfShippingRequestStatus === 'none' || sellerProfile.selfShippingRequestStatus === 'rejected'" class="space-y-3">
                            <div v-if="sellerProfile.selfShippingRequestStatus === 'rejected'" 
                                class="p-4 bg-rose-50/70 border border-rose-100 rounded-xl text-rose-800 flex items-start gap-3 transition-all duration-300">
                                <Info class="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p class="text-sm font-bold">{{ t('adminSellers.selfShippingStatusOptions.rejected') }}</p>
                                    <p class="text-xs text-rose-700 mt-0.5">{{ t('editSellerProfileModal.selfShippingRejectedMsg') }}</p>
                                </div>
                            </div>
                            <button type="button" @click="requestSelfShipping" :disabled="isSubmittingRequest"
                                class="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-98">
                                <Loader2 v-if="isSubmittingRequest" class="w-4 h-4 animate-spin" />
                                <span>
                                    {{ sellerProfile.selfShippingRequestStatus === 'rejected' ? t('editSellerProfileModal.selfShippingReRequestBtn') : t('editSellerProfileModal.selfShippingRequestBtn') }}
                                </span>
                            </button>
                        </div>

                        <!-- Case 3: Pending Approval -> Show Pending Review Status -->
                        <div v-else-if="sellerProfile.selfShippingRequestStatus === 'pending'" 
                            class="p-4 bg-amber-50/70 border border-amber-100 rounded-xl text-amber-800 flex items-start gap-3 transition-all duration-300">
                            <Loader2 class="w-5 h-5 text-amber-600 mt-0.5 animate-spin flex-shrink-0" />
                            <div>
                                <p class="text-sm font-bold">{{ t('adminSellers.selfShippingStatusOptions.pending') }}</p>
                                <p class="text-xs text-amber-700 mt-0.5">{{ t('editSellerProfileModal.selfShippingPendingMsg') }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" @click="$emit('close')"
                            class="w-full sm:w-auto px-6 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors text-sm sm:text-base order-2 sm:order-1 active:scale-98">
                            {{ t('editSellerProfileModal.cancel') }}
                        </button>
                        <button type="submit" :disabled="isSubmitting"
                            class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-lg shadow-[#ff934b]/20 hover:shadow-xl hover:shadow-[#ff934b]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2 active:scale-95">
                            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                            <span>{{ isSubmitting ? t('editSellerProfileModal.updatingProfile') : t('editSellerProfileModal.updateProfile') }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSellerStore } from '../store/sellerStore';
import { toast } from 'vue-sonner';
import uploadService from '../services/uploadService';
import { X, Store, FileText, UserCircle, Image, Loader2, CheckCircle, Camera, Shield, Truck, Info } from 'lucide-vue-next';

export default {
    name: 'EditSellerProfile',
    components: {
        X,
        Store,
        FileText,
        UserCircle,
        Image,
        Loader2,
        CheckCircle,
        Camera,
        Shield,
        Truck,
        Info
    },
    emits: ['close', 'profile-updated'],
    setup(props, { emit }) {
        const { t } = useI18n();
        const sellerStore = useSellerStore();
        const isSubmitting = ref(false);

        const formData = ref({
            storeName: sellerStore.sellerProfile.storeName || '',
            storeDescription: sellerStore.sellerProfile.storeDescription || '',
            profileImage: sellerStore.sellerProfile.profileImage || '',
            backgroundImage: sellerStore.sellerProfile.backgroundImage || '',
            fulfillmentType: sellerStore.sellerProfile.fulfillmentType || 'platform',
        });


        const handleProfileImageUpload = async (event) => {
            const file = event.target.files[0];
            if (file) {
                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(t('editSellerProfileModal.toasts.profileImageTooLarge'));
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    toast.error(t('editSellerProfileModal.toasts.invalidImageFile'));
                    return;
                }

                try {
                    toast.loading(t('editSellerProfileModal.toasts.uploadingProfileImage'));
                    const url = await uploadService.uploadImage(file);
                    formData.value.profileImage = url;
                    toast.success(t('editSellerProfileModal.toasts.profileImageUploaded'));
                } catch (error) {
                    console.error('Error uploading profile image:', error);
                    toast.error(t('editSellerProfileModal.toasts.profileImageUploadFailed'));
                }
            }
        };

        const handleBackgroundImageUpload = async (event) => {
            const file = event.target.files[0];
            if (file) {
                // Validate file size (10MB limit for background images)
                if (file.size > 10 * 1024 * 1024) {
                    toast.error(t('editSellerProfileModal.toasts.backgroundImageTooLarge'));
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    toast.error(t('editSellerProfileModal.toasts.invalidImageFile'));
                    return;
                }

                try {
                    toast.loading(t('editSellerProfileModal.toasts.uploadingBackgroundImage'));
                    const url = await uploadService.uploadImage(file);
                    formData.value.backgroundImage = url;
                    toast.success(t('editSellerProfileModal.toasts.backgroundImageUploaded'));
                } catch (error) {
                    console.error('Error uploading background image:', error);
                    toast.error(t('editSellerProfileModal.toasts.backgroundImageUploadFailed'));
                }
            }
        };

        const updateProfile = async () => {
            // Validate form data
            if (!formData.value.storeName.trim()) {
                toast.error(t('editSellerProfileModal.toasts.storeNameRequired'));
                return;
            }

            if (formData.value.storeName.trim().length < 3) {
                toast.error(t('editSellerProfileModal.toasts.storeNameTooShort'));
                return;
            }

            if (formData.value.storeDescription.trim().length > 500) {
                toast.error(t('editSellerProfileModal.toasts.storeDescriptionTooLong'));
                return;
            }

            try {
                isSubmitting.value = true;
                await sellerStore.updateSellerProfile(sellerStore.sellerProfile._id, formData.value);
                toast.success(t('editSellerProfileModal.toasts.profileUpdated'));
                emit('profile-updated');
                emit('close');
            } catch (error) {
                console.error('Error updating profile:', error);
                toast.error(t('editSellerProfileModal.toasts.profileUpdateFailed'));
            } finally {
                isSubmitting.value = false;
            }
        };

        const sellerProfile = computed(() => sellerStore.sellerProfile || {});
        const isSubmittingRequest = ref(false);

        const requestSelfShipping = async () => {
            try {
                isSubmittingRequest.value = true;
                await sellerStore.updateSellerProfile(sellerStore.sellerProfile._id, {
                    selfShippingRequestStatus: 'pending'
                });
                emit('profile-updated');
            } catch (error) {
                console.error('Error requesting self shipping:', error);
            } finally {
                isSubmittingRequest.value = false;
            }
        };

        const isSubmittingVerification = ref(false);

        const isCooldownActive = computed(() => {
            const cooldownEndTime = sellerStore.cooldownEndTime;
            return cooldownEndTime && new Date(cooldownEndTime) > new Date();
        });

        const applyForStoreVerification = async () => {
            try {
                isSubmittingVerification.value = true;
                await sellerStore.requestVerification();
                await sellerStore.fetchVerificationStatus(sellerStore.sellerProfile._id);
                toast.success(t('sellerStoreHeader.statuses.submitted'));
                emit('profile-updated');
            } catch (error) {
                console.error('Error applying for verification:', error);
                toast.error(error.message || 'Failed to request verification');
            } finally {
                isSubmittingVerification.value = false;
            }
        };

        return {
            t,
            formData,
            isSubmitting,
            sellerProfile,
            isSubmittingRequest,
            requestSelfShipping,
            updateProfile,
            handleProfileImageUpload,
            handleBackgroundImageUpload,
            isSubmittingVerification,
            isCooldownActive,
            applyForStoreVerification
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

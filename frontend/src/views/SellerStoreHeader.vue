<template>
    <div class="rounded-sm">
        <!-- Background Image with Overlay -->
        <div class="relative bg-seller-store h-28 sm:h-32 md:h-36 bg-white w-11/12 mt-5 mx-auto rounded-t-sm"
            :style="{ backgroundImage: `url(${sellerProfile.backgroundImage || defaultBackground})` }">
            <div class="absolute inset-0 bg-black opacity-60 rounded-t-sm"></div>
            <div
                class="relative flex flex-col sm:flex-row items-start sm:items-center justify-between text-white py-3 sm:py-5 px-3 sm:px-6 h-full">
                <!-- Profile Section -->
                <div class="flex-1 w-full sm:w-auto">
                    <div class="flex items-center">
                        <!-- Seller Profile Avatar -->
                        <img v-if="sellerProfile.profileImage" :src="sellerProfile.profileImage"
                            alt="Seller Profile Avatar"
                            class="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 sm:mr-4 flex-shrink-0" />
                        <img v-else :src="'../src/assets/images/Kyrian.png'" alt="Default Avatar"
                            class="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 sm:mr-4 flex-shrink-0" />
                        <!-- Verification Badge Section -->
                        <div class="min-w-0 flex-1">
                            <h1 class="text-lg sm:text-2xl font-semibold flex items-center flex-wrap">
                                <span class="truncate">{{ sellerProfile.storeName }}</span>
                                <!-- Verified Badge - Now checking only verificationStatus -->
                                <svg v-if="sellerProfile.verificationStatus === 'approved'"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="ml-2 w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" fill="currentColor"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round"
                                        stroke-linejoin="round" stroke-width="2"
                                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                    <path fill="currentColor"
                                        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                                    <path fill="currentColor" stroke="currentColor" stroke-linecap="round"
                                        stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" class="text-white" />
                                </svg>
                            </h1>
                            <div v-if="sellerProfile.verificationStatus === 'approved'" class="text-xs w-fit px-2 mt-1 sm:mt-2 font-medium rounded-full
                            text-[#ff934b] bg-white border border-[#ff934b]">
                                Verified
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Follow Section -->
                <div
                    class="flex items-center sm:flex-col sm:items-center mt-3 sm:mt-0 sm:text-center w-full sm:w-auto justify-between sm:justify-center">
                    <button @click="handleFollowToggle" :class="[
                        'button-hover font-semibold text-xs sm:text-sm shadow-md px-4 sm:px-10 py-1 rounded-sm flex-shrink-0',
                        isFollowing
                            ? 'text-white bg-[#ff934b] hover:bg-white hover:text-[#ff934b] border-[1px] border-[#ff934b]'
                            : 'text-[#ff934b] hover:text-white bg-white hover:bg-[#ff934b] border-[1px] border-[#ff934b]'
                    ]">
                        {{ isFollowing ? 'Unfollow' : 'Follow' }}
                    </button>
                    <div class="ml-3 sm:ml-0 sm:mt-1">
                        <span class="text-xs font-semibold">{{ followersCount }}</span>
                        <span class="text-xs"> Followers</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation and Search -->
        <div class="w-11/12 pt-3 sm:pt-5 px-3 sm:px-6 mb-5 mx-auto border rounded-b-sm">
            <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between space-y-3 sm:space-y-0">
                <!-- Navigation Items -->
                <div class="overflow-x-auto">
                    <ul class="flex items-baseline space-x-4 sm:space-x-10 px-2 sm:px-6 min-w-max">
                        <li v-for="item in sellerItems" :key="item.label"
                            class="border-b-2 border-white hover:border-b-2 hover:border-[#24a3b5] flex-shrink-0">
                            <router-link active-class="active-link" :to="item.link"
                                class="flex items-center space-x-2 text-gray-500 hover:text-[#24a3b5] transition-all duration-300 ease-in-out">
                                <span class="font-medium text-sm whitespace-nowrap">{{ item.label }}</span>
                            </router-link>
                        </li>

                        <!-- Request Verification Button -->
                        <li v-if="isOwnProfile && canRequestVerification" class="flex-shrink-0">
                            <button @click="requestVerification" :disabled="isLoading" class="button-hover font-semibold text-xs sm:text-sm shadow-md px-4 sm:px-10 py-1 rounded-sm text-[#ff934b] hover:text-white 
                                bg-white hover:bg-[#ff934b] border-[1px] border-[#ff934b] whitespace-nowrap">
                                {{ isLoading ? 'Submitting...' : 'Request Verification' }}
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Verification Status Section -->
                <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 px-2 sm:px-0">
                    <!-- Dynamic Status Message -->
                    <span v-if="showStatusMessage" :class="getStatusClass">
                        {{ statusMessage }}
                    </span>

                    <!-- Cooldown Timer -->
                    <p v-if="showCooldownTimer" class="text-xs sm:text-sm text-red-500 text-center sm:text-left">
                        Please wait {{ formatCooldownTime(cooldownTimeRemaining) }} before requesting verification
                        again.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useSellerStore } from '../store/sellerStore';
import { useUserStore } from '../store/user';
import { sellerItems } from '../utils/sellerItems.js';
import defaultBackground from '../assets/images/Kyrian.png';

export default {
    setup() {
        const sellerStore = useSellerStore();
        const userStore = useUserStore();
        const isLoading = ref(false);

        const isOwnProfile = computed(() => {
            return userStore.user?.sellerProfile === sellerStore.sellerProfile?._id;
        });

        const handleFollowToggle = async () => {
            if (userStore.isLoggedIn) {
                await sellerStore.toggleFollow(sellerStore.sellerProfile._id);
            } else {
                // Handle case when user is not logged in (e.g., redirect to login page)
                console.log('User needs to log in to follow');
            }
        };

        // count down timer for cooldown time remaining
        const canRequestVerification = computed(() => {
            if (!sellerStore.sellerProfile) return false;

            const status = sellerStore.sellerProfile.verificationStatus;
            const cooldownEndTime = sellerStore.cooldownEndTime;

            console.log('Verification Check:', {
                status,
                cooldownEndTime,
                currentTime: new Date(),
                timeDiff: cooldownEndTime ? new Date(cooldownEndTime) - new Date() : 'No cooldown'
            });

            // Check if status is eligible (including null/undefined status)
            const isEligibleStatus = !status || status === 'not_submitted' || status === 'rejected';

            // Check if cooldown is complete
            const isCooldownComplete = !cooldownEndTime || new Date(cooldownEndTime) <= new Date();

            return isEligibleStatus && isCooldownComplete;
        });

        const cooldownTimeRemaining = computed(() => {
            const cooldownEndTime = sellerStore.cooldownEndTime;
            if (!cooldownEndTime) return null;

            const remaining = new Date(cooldownEndTime) - new Date();
            return remaining > 0 ? remaining : null;
        });

        const showCooldownTimer = computed(() => {
            if (!sellerStore.sellerProfile) return false;

            const status = sellerStore.sellerProfile.verificationStatus;
            const remaining = cooldownTimeRemaining.value;

            // Show timer if in cooldown and status is appropriate
            return (status === 'not_submitted' || status === 'rejected') && remaining > 0;
        });

        // Format cooldown time in minutes and seconds
        const formatCooldownTime = (ms) => {
            const minutes = Math.floor(ms / (1000 * 60));
            const seconds = Math.floor((ms % (1000 * 60)) / 1000);
            return `${minutes}m ${seconds}s`;
        };

        const requestVerification = async () => {
            if (!canRequestVerification.value) {
                console.log('Cannot request verification:', {
                    verificationStatus: sellerStore.sellerProfile?.verificationStatus,
                    cooldownEndTime: sellerStore.cooldownEndTime,
                    currentTime: Date.now()
                });
                return;
            }

            isLoading.value = true;
            try {
                await sellerStore.requestVerification();
                await sellerStore.fetchVerificationStatus(sellerStore.sellerProfile._id);
                console.log('Verification request completed. New status:', sellerStore.sellerProfile.verificationStatus);
            } catch (error) {
                console.error('Error requesting verification:', error);
            } finally {
                isLoading.value = false;
            }
        };

        const showStatusMessage = computed(() => {
            return sellerStore.sellerProfile.verificationStatus !== 'not_submitted';
        });

        const getStatusClass = computed(() => {
            const status = sellerStore.sellerProfile.verificationStatus;
            const baseClasses = 'px-2 py-1 rounded-full text-xs sm:text-sm font-medium';

            const statusClasses = {
                'submitted': 'bg-yellow-50 text-yellow-600',
                'under_review': 'bg-blue-50 text-blue-600',
                'rejected': 'bg-red-50 text-red-600',
                'approved': 'bg-green-50 text-green-600'
            };

            return `${baseClasses} ${statusClasses[status] || ''}`;
        });

        const statusMessage = computed(() => {
            switch (sellerStore.sellerProfile.verificationStatus) {
                case 'submitted':
                    return 'Verification in Progress';
                case 'under_review':
                    return 'Under Review';
                case 'rejected':
                    return 'Verification Rejected';
                case 'approved':
                    return 'Verified Store';
                default:
                    return '';
            }
        });

        onMounted(async () => {
            if (sellerStore.sellerProfile) {
                await sellerStore.fetchVerificationStatus(sellerStore.sellerProfile._id);
                await sellerStore.fetchFollowStatus(sellerStore.sellerProfile._id);
                console.log('sellerProfile.verificationStatus: ', sellerStore.sellerProfile.verificationStatus)
            }
        });

        return {
            isOwnProfile,
            sellerItems,
            defaultBackground,
            sellerProfile: computed(() => sellerStore.sellerProfile),
            isFollowing: computed(() => sellerStore.isFollowing),
            followersCount: computed(() => sellerStore.followersCount),
            handleFollowToggle,
            requestVerification,
            isLoading,
            showStatusMessage,
            getStatusClass,
            statusMessage,
            canRequestVerification,
            cooldownTimeRemaining,
            formatCooldownTime,
            showCooldownTimer
        };
    },
};
</script>

<style scoped>
.bg-seller-store {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.active-link {
    border-bottom-width: 1px;
    border-color: #24a3b5;
    padding-bottom: 0.5rem
}

.status-badge {
    @apply px-2 py-1 rounded-full text-sm font-medium;
}

.status-submitted {
    @apply bg-yellow-50 text-yellow-600;
}

.status-under-review {
    @apply bg-blue-50 text-blue-600;
}

.status-rejected {
    @apply bg-red-50 text-red-600;
}

.status-approved {
    @apply bg-green-50 text-green-600;
}

/* Custom scrollbar for horizontal navigation on mobile */
@media (max-width: 640px) {
    .overflow-x-auto::-webkit-scrollbar {
        height: 2px;
    }

    .overflow-x-auto::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    .overflow-x-auto::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }

    .overflow-x-auto::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
}
</style>
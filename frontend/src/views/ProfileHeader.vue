<template>
    <div class="bg-white px-4 sm:px-5 pt-5 pb-0 mb-2">
        <h1 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">My Profile</h1>
        <div class="overflow-x-auto hide-scrollbar">
            <ul class="flex space-x-6 sm:space-x-10 px-2 sm:px-6 pb-2">
                <li v-for="item in profileItems" :key="item.label"
                    class="border-b-2 border-white hover:border-b-2 hover:border-[#24a3b5] whitespace-nowrap">
                    <router-link active-class="active-link" :to="item.link"
                        class="flex items-center space-x-2 text-gray-500 hover:text-[#24a3b5] transition-all duration-300 ease-in-out">
                        <span class="font-medium text-xs sm:text-sm">{{ item.label }}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { profileItems } from '../utils/profileItems.js';

export default {
    data() {
        return {
            profileItems: profileItems,
        };
    },
};
</script>

<style scoped>
.active-link {
    border-bottom-width: 2px;
    border-color: #24a3b5;
    padding-bottom: 0.5rem;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}
</style>
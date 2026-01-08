<template>
    <div class="bg-white px-5 pt-5 pb-0 mb-2">
        <h1 class="text-2xl font-semibold lg:mb-6">{{ sidebarOpen ? 'My Account' : '' }}</h1>
        <div class="overflow-x-auto hide-scrollbar lg:overflow-x-visible">
            <ul class="flex lg:flex-col space-x-10 lg:space-x-0 lg:space-y-4 px-6 lg:px-0 whitespace-nowrap">
                <li v-for="item in menuItems" :key="item.label"
                    class="border-b-2 border-white hover:border-b-2 hover:border-[#24a3b5] lg:border-b-0 lg:hover:border-b-0">
                    <router-link active-class="active-link" :to="item.link"
                        class="flex items-center space-x-2 pr-2 text-gray-500 hover:text-[#24a3b5] transition-all duration-300 ease-in-out py-2 lg:py-1 lg:pl-2 lg:rounded-md lg:hover:bg-[#24a3b5] lg:hover:text-white">
                        <component :is="item.icon"
                            class="w-6 h-6 text-gray-500 lg:hover:text-white transition-colors duration-300 ease-in-out" />
                        <span class="font-medium text-sm">{{ item.label }}</span>
                        <span v-if="item.count !== undefined"
                            class="ml-auto bg-gray-200 text-gray-600 text-[11px] px-2 py-1 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
                            {{ item.count }}
                        </span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { menuItems } from '../utils/menuItems.js';
import {
    PackageOpen,
    Wallet,
    User,
    Box,
    Star,
    Heart,
    Store,
    HelpCircle
} from 'lucide-vue-next';

export default {
    components: {
        PackageOpen,
        Wallet,
        User,
        Box,
        Star,
        Heart,
        Store,
        HelpCircle
    },
    data() {
        return {
            sidebarOpen: true,
            menuItems: menuItems,
        };
    },
};
</script>

<style scoped>
.active-link {
    border-bottom-width: 2px;
    border-color: #24a3b5;
    padding-bottom: 0.5rem;
    color: #24a3b5;
}

@media (min-width: 1024px) {
    .active-link {
        border-bottom-width: 0;
        background-color: #24a3b5;
        color: white !important;
    }
}

.hide-scrollbar {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* WebKit */
}
</style>

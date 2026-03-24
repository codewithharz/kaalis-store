<!-- SidebarNavigation.vue -->
<template>
    <nav>
        <ul class="space-y-1">
            <li v-for="item in menuItems" :key="item.path">
                <router-link :to="item.path" :class="[
                    'block px-4 py-2 text-sm rounded-md transition-colors duration-150 ease-in-out',
                    isActive(item.path)
                        ? 'bg-teal-500 hover:text-gray-100 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-teal-500'
                ]">
                    {{ item.name }}
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
    name: 'SidebarNavigation',
    setup() {
        const { t } = useI18n();
        return { t };
    },
    computed: {
        menuItems() {
            return [
                { name: this.t('pageComponentsSidebar.communication'), path: '/page/communication' },
                { name: this.t('pageComponentsSidebar.security'), path: '/page/security' },
                { name: this.t('pageComponentsSidebar.privacy'), path: '/page/protection-of-personal-data' },
                { name: this.t('pageComponentsSidebar.membership'), path: '/page/membership-agreement' },
                { name: this.t('pageComponentsSidebar.cookiePolicy'), path: '/page/cookie-policy' },
                { name: this.t('pageComponentsSidebar.communicationInfo'), path: '/page/communication-information-text' },
                { name: this.t('pageComponentsSidebar.terms'), path: '/page/terms-of-use' },
                { name: this.t('pageComponentsSidebar.transactionGuide'), path: '/page/transaction-guide' },
                { name: this.t('pageComponentsSidebar.businessPartnership'), path: '/page/business-partnership' }
            ];
        }
    },
    methods: {
        isActive(path) {
            return this.$route.path === path;
        }
    }
};
</script>

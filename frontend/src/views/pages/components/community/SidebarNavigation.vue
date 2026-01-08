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
export default {
    name: 'SidebarNavigation',
    data() {
        return {
            menuItems: [
                { name: 'Communication', path: '/page/communication' },
                { name: 'Security', path: '/page/security' },
                { name: 'Protection of Personal Data', path: '/page/protection-of-personal-data' },
                { name: 'Membership Agreement', path: '/page/membership-agreement' },
                { name: 'Cookie Policy', path: '/page/cookie-policy' },
                { name: 'Communication Information Text', path: '/page/communication-information-text' },
                { name: 'Terms of Use', path: '/page/terms-of-use' },
                { name: 'Transaction Guide', path: '/page/transaction-guide' },
                { name: 'Business Partnership', path: '/page/business-partnership' }
            ]
        };
    },
    methods: {
        isActive(path) {
            return this.$route.path === path;
        }
    }
}
</script>
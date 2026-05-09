<template>
    <div class="mb-4 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-sm sm:mb-6 sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#24a3b5]">
                    {{ t('account.profileWorkspace') }}
                </p>
                <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    {{ t('account.myProfile') }}
                </h1>
                <p class="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                    {{ profileWorkspaceSubtitle }}
                </p>
            </div>

            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {{ t('account.profileWorkspaceCardOne') }}
                    </p>
                    <p class="mt-2 text-sm font-semibold text-slate-900">
                        {{ t('account.profileWorkspaceCardOneValue') }}
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {{ t('account.profileWorkspaceCardTwo') }}
                    </p>
                    <p class="mt-2 text-sm font-semibold text-slate-900">
                        {{ t('account.profileWorkspaceCardTwoValue') }}
                    </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 col-span-2 sm:col-span-1">
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {{ t('account.profileWorkspaceCardThree') }}
                    </p>
                    <p class="mt-2 text-sm font-semibold text-slate-900">
                        {{ roleAwareWorkspaceValue }}
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-5 overflow-x-auto hide-scrollbar">
            <ul class="flex min-w-max gap-3 pb-1">
                <li v-for="item in translatedProfileItems" :key="item.link">
                    <router-link
                        :to="item.link"
                        class="group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
                        :class="isActive(item.link)
                            ? 'border-[#24a3b5] bg-[#24a3b5] text-white shadow-md'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#24a3b5]/40 hover:bg-white hover:text-slate-900'"
                    >
                        <component
                            :is="item.icon"
                            class="h-4 w-4 flex-shrink-0"
                            :class="isActive(item.link) ? 'text-white' : 'text-[#24a3b5]'"
                        />
                        <span class="text-sm font-medium whitespace-nowrap">{{ item.label }}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useUserStore } from '../store/user';
import { useCountryStore } from '../store/countryStore';
import { getProfileItems } from '../utils/profileItems.js';
import {
    User,
    MapPinned,
    Wallet,
    Landmark,
    KeyRound,
    CreditCard,
    Box
} from 'lucide-vue-next';

const { t } = useI18n();
const route = useRoute();
const userStore = useUserStore();
const countryStore = useCountryStore();

const itemIcons = {
    'account.myProfile': User,
    'account.myAddressBook': MapPinned,
    'account.checkoutWallet': Wallet,
    'account.payoutSettings': Landmark,
    'account.bankDetails': Landmark,
    'account.changePassword': KeyRound,
    'account.managePayment': CreditCard,
    'account.myProducts': Box,
};

const profileItems = computed(() =>
    getProfileItems({
        user: userStore.user,
        isXofCountry: countryStore.isXofCountry,
    })
);

const translatedProfileItems = computed(() =>
    profileItems.value.map((item) => ({
        ...item,
        label: t(item.labelKey),
        icon: itemIcons[item.labelKey] || User,
    }))
);

const isSeller = computed(() => Boolean(userStore.user?.isSeller));

const profileWorkspaceSubtitle = computed(() =>
    isSeller.value
        ? t('account.profileWorkspaceSellerSubtitle')
        : t('account.profileWorkspaceBuyerSubtitle')
);

const roleAwareWorkspaceValue = computed(() =>
    isSeller.value ? t('account.payoutSettings') : t('account.checkoutWallet')
);

const isActive = (link) => {
    if (link === '/account/profile/' || link === '/account/profile') {
        return route.path === '/account/profile/' || route.path === '/account/profile';
    }
    return route.path.startsWith(link);
};
</script>

<style scoped>
.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

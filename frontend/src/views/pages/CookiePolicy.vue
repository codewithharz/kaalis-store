<!-- src/views/pages/CookiePolicy.vue -->
<template>
    <CommunityLayout :title="t('cookiePolicyPage.pageTitle')">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('cookiePolicyPage.title') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('cookiePolicyPage.intro') }}
                </p>
            </section>

            <!-- Types of Cookies -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('cookiePolicyPage.typesTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('cookiePolicyPage.essentialTitle') }}</h3>
                        <p class="text-gray-600 mb-3">{{ t('cookiePolicyPage.essentialBody') }}</p>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>{{ t('cookiePolicyPage.essential1') }}</li>
                            <li>{{ t('cookiePolicyPage.essential2') }}</li>
                            <li>{{ t('cookiePolicyPage.essential3') }}</li>
                            <li>{{ t('cookiePolicyPage.essential4') }}</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('cookiePolicyPage.analyticsTitle') }}</h3>
                        <p class="text-gray-600 mb-3">{{ t('cookiePolicyPage.analyticsBody') }}</p>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>{{ t('cookiePolicyPage.analytics1') }}</li>
                            <li>{{ t('cookiePolicyPage.analytics2') }}</li>
                            <li>{{ t('cookiePolicyPage.analytics3') }}</li>
                            <li>{{ t('cookiePolicyPage.analytics4') }}</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('cookiePolicyPage.functionalTitle') }}</h3>
                        <p class="text-gray-600 mb-3">{{ t('cookiePolicyPage.functionalBody') }}</p>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>{{ t('cookiePolicyPage.functional1') }}</li>
                            <li>{{ t('cookiePolicyPage.functional2') }}</li>
                            <li>{{ t('cookiePolicyPage.functional3') }}</li>
                            <li>{{ t('cookiePolicyPage.functional4') }}</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('cookiePolicyPage.marketingTitle') }}</h3>
                        <p class="text-gray-600 mb-3">{{ t('cookiePolicyPage.marketingBody') }}</p>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>{{ t('cookiePolicyPage.marketing1') }}</li>
                            <li>{{ t('cookiePolicyPage.marketing2') }}</li>
                            <li>{{ t('cookiePolicyPage.marketing3') }}</li>
                            <li>{{ t('cookiePolicyPage.marketing4') }}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Cookie Management -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('cookiePolicyPage.manageTitle') }}</h2>
                <div class="space-y-4">
                    <p class="text-gray-600">
                        {{ t('cookiePolicyPage.manageBody') }}
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('cookiePolicyPage.browserSettings') }}</h3>
                            <p class="text-gray-600">
                                {{ t('cookiePolicyPage.browserSettingsBody') }}
                            </p>
                        </div>
                        <div class="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('cookiePolicyPage.cookiePreferences') }}</h3>
                            <p class="text-gray-600">
                                {{ t('cookiePolicyPage.cookiePreferencesBody') }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Cookie Controls -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('cookiePolicyPage.controlsTitle') }}</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">{{ t('cookiePolicyPage.essentialTitle') }}</h3>
                            <p class="text-sm text-gray-600">{{ t('cookiePolicyPage.essentialRequired') }}</p>
                        </div>
                        <Switch disabled checked />
                    </div>
                    <div class="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">{{ t('cookiePolicyPage.analyticsTitle') }}</h3>
                            <p class="text-sm text-gray-600">{{ t('cookiePolicyPage.analyticsImprove') }}</p>
                        </div>
                        <Switch v-model="analyticsEnabled" />
                    </div>
                    <div class="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">{{ t('cookiePolicyPage.marketingTitle') }}</h3>
                            <p class="text-sm text-gray-600">{{ t('cookiePolicyPage.marketingPersonalized') }}</p>
                        </div>
                        <Switch v-model="marketingEnabled" />
                    </div>
                </div>
                <div class="mt-6 flex justify-end">
                    <Button class="bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1a7f8f] transition-colors">
                        {{ t('cookiePolicyPage.savePreferences') }}
                    </Button>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const analyticsEnabled = ref(true);
const marketingEnabled = ref(false);
const { t } = useI18n();
</script>

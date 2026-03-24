<!-- src/views/pages/Security.vue -->
<template>
    <CommunityLayout :title="t('securityInfoPage.pageTitle')">
        <div class="space-y-8">
            <!-- Payment Security -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('securityInfoPage.paymentTitle') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('securityInfoPage.paymentBody') }}
                </p>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('securityInfoPage.featuresTitle') }}</h3>
                    <ul class="list-disc list-inside space-y-2 text-gray-600">
                        <li>{{ t('securityInfoPage.feature1') }}</li>
                        <li>{{ t('securityInfoPage.feature2') }}</li>
                        <li>{{ t('securityInfoPage.feature3') }}</li>
                        <li>{{ t('securityInfoPage.feature4') }}</li>
                        <li>{{ t('securityInfoPage.feature5') }}</li>
                    </ul>
                </div>
            </section>

            <!-- Account Security -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('securityInfoPage.accountTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('securityInfoPage.passwordGuidelines') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li>{{ t('securityInfoPage.password1') }}</li>
                            <li>{{ t('securityInfoPage.password2') }}</li>
                            <li>{{ t('securityInfoPage.password3') }}</li>
                            <li>{{ t('securityInfoPage.password4') }}</li>
                        </ul>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('securityInfoPage.shoppingTips') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li>{{ t('securityInfoPage.shopping1') }}</li>
                            <li>{{ t('securityInfoPage.shopping2') }}</li>
                            <li>{{ t('securityInfoPage.shopping3') }}</li>
                            <li>{{ t('securityInfoPage.shopping4') }}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('securityInfoPage.needHelp') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('securityInfoPage.needHelpBody') }}
                </p>
                <div class="flex items-center gap-4">
                    <a href="mailto:security@bruthol.com"
                        class="inline-flex items-center bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1a7f8f] transition-colors">
                        <Mail class="w-4 h-4 mr-2" />
                        {{ t('securityInfoPage.contactTeam') }}
                    </a>
                    <a href="#" class="text-[#24a6bb] hover:underline">{{ t('securityInfoPage.viewFaq') }}</a>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { Mail } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import CommunityLayout from './components/layouts/CommunityLayout.vue';

const { t } = useI18n();
</script>

<!-- src/views/pages/ProtectionOfPersonalData.vue -->
<template>
    <CommunityLayout :title="t('privacyPage.pageTitle')">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('privacyPage.title') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('privacyPage.intro') }}
                </p>
            </section>

            <!-- Data Collection -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('privacyPage.collectTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('privacyPage.personalInfo') }}</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>{{ t('privacyPage.personal1') }}</li>
                            <li>{{ t('privacyPage.personal2') }}</li>
                            <li>{{ t('privacyPage.personal3') }}</li>
                            <li>{{ t('privacyPage.personal4') }}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('privacyPage.usageInfo') }}</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>{{ t('privacyPage.usage1') }}</li>
                            <li>{{ t('privacyPage.usage2') }}</li>
                            <li>{{ t('privacyPage.usage3') }}</li>
                            <li>{{ t('privacyPage.usage4') }}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Data Usage -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('privacyPage.useTitle') }}</h2>
                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('privacyPage.essentialServices') }}</h3>
                        <p class="text-gray-600">{{ t('privacyPage.essentialServicesBody') }}
                        </p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('privacyPage.personalization') }}</h3>
                        <p class="text-gray-600">{{ t('privacyPage.personalizationBody') }}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('privacyPage.communication') }}</h3>
                        <p class="text-gray-600">{{ t('privacyPage.communicationBody') }}
                        </p>
                    </div>
                </div>
            </section>

            <!-- Your Rights -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('privacyPage.rightsTitle') }}</h2>
                <div class="bg-gray-50 p-6 rounded-lg">
                    <ul class="space-y-3 text-gray-600">
                        <li><span class="font-semibold">{{ t('privacyPage.rightAccess') }}</span> {{ t('privacyPage.rightAccessBody') }}</li>
                        <li><span class="font-semibold">{{ t('privacyPage.rightRectification') }}</span> {{ t('privacyPage.rightRectificationBody') }}</li>
                        <li><span class="font-semibold">{{ t('privacyPage.rightErasure') }}</span> {{ t('privacyPage.rightErasureBody') }}</li>
                        <li><span class="font-semibold">{{ t('privacyPage.rightRestriction') }}</span> {{ t('privacyPage.rightRestrictionBody') }}</li>
                        <li><span class="font-semibold">{{ t('privacyPage.rightPortability') }}</span> {{ t('privacyPage.rightPortabilityBody') }}</li>
                    </ul>
                </div>
            </section>

            <!-- Contact -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('privacyPage.inquiriesTitle') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('privacyPage.inquiriesBody') }}
                </p>
                <div class="flex items-center gap-4">
                    <a href="mailto:privacy@bruthol.com"
                        class="bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1a7f8f] transition-colors">
                        {{ t('privacyPage.contactOfficer') }}
                    </a>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import CommunityLayout from './components/layouts/CommunityLayout.vue';

const { t } = useI18n();
</script>

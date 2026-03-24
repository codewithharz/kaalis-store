<!-- src/views/pages/MembershipAgreement.vue -->
<template>
    <CommunityLayout :title="t('membershipPage.pageTitle')">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('membershipPage.title') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('membershipPage.intro') }}
                </p>
            </section>

            <!-- Agreement Sections -->
            <section class="space-y-6">
                <!-- Account Terms -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-3">{{ t('membershipPage.section1Title') }}</h3>
                    <ul class="space-y-3 text-gray-600">
                        <li>{{ t('membershipPage.section1Item1') }}</li>
                        <li>{{ t('membershipPage.section1Item2') }}</li>
                        <li>{{ t('membershipPage.section1Item3') }}</li>
                        <li>{{ t('membershipPage.section1Item4') }}</li>
                    </ul>
                </div>

                <!-- Member Responsibilities -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-3">{{ t('membershipPage.section2Title') }}</h3>
                    <ul class="space-y-3 text-gray-600">
                        <li>{{ t('membershipPage.section2Item1') }}</li>
                        <li>{{ t('membershipPage.section2Item2') }}</li>
                        <li>{{ t('membershipPage.section2Item3') }}</li>
                        <li>{{ t('membershipPage.section2Item4') }}</li>
                    </ul>
                </div>

                <!-- Payment Terms -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-3">{{ t('membershipPage.section3Title') }}</h3>
                    <ul class="space-y-3 text-gray-600">
                        <li>{{ t('membershipPage.section3Item1') }}</li>
                        <li>{{ t('membershipPage.section3Item2') }}</li>
                        <li>{{ t('membershipPage.section3Item3') }}</li>
                        <li>{{ t('membershipPage.section3Item4') }}</li>
                    </ul>
                </div>

                <!-- Privacy and Data -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-3">{{ t('membershipPage.section4Title') }}</h3>
                    <ul class="space-y-3 text-gray-600">
                        <li>{{ t('membershipPage.section4Item1') }}</li>
                        <li>{{ t('membershipPage.section4Item2') }}</li>
                        <li>{{ t('membershipPage.section4Item3') }}</li>
                        <li>{{ t('membershipPage.section4Item4') }}</li>
                    </ul>
                </div>
            </section>

            <!-- Termination -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-3">{{ t('membershipPage.terminationTitle') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('membershipPage.terminationBody') }}
                </p>
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 class="font-semibold text-[#24a6bb] mb-2">{{ t('membershipPage.groundsTitle') }}</h4>
                    <ul class="list-disc list-inside space-y-2 text-gray-600">
                        <li>{{ t('membershipPage.ground1') }}</li>
                        <li>{{ t('membershipPage.ground2') }}</li>
                        <li>{{ t('membershipPage.ground3') }}</li>
                        <li>{{ t('membershipPage.ground4') }}</li>
                    </ul>
                </div>
            </section>

            <!-- Updates and Changes -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-3">{{ t('membershipPage.updatesTitle') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('membershipPage.updatesBody') }}
                </p>
                <div class="flex items-center gap-4">
                    <Button class="bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1a7f8f] transition-colors">
                        {{ t('membershipPage.viewAgreement') }}
                    </Button>
                    <a href="#" class="text-[#24a6bb] hover:underline">{{ t('membershipPage.downloadPdf') }}</a>
                </div>
            </section>

            <!-- Contact Information -->
            <section class="border-t pt-6">
                <p class="text-gray-600">
                    {{ t('membershipPage.contactIntro') }}
                    <a href="mailto:legal@bruthol.com" class="text-[#24a6bb] hover:underline">
                        legal@bruthol.com
                    </a>
                </p>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';

const { t } = useI18n();
</script>

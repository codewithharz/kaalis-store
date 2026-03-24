<!-- src/views/pages/TermsOfUse.vue -->
<template>
    <CommunityLayout :title="t('termsPage.pageTitle')">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('termsPage.title') }}</h2>
                <p class="text-gray-600">
                    {{ t('termsPage.intro') }}
                </p>
                <div class="mt-4 p-4 bg-[#e6f4f7] rounded-lg text-gray-600">
                    <strong>{{ t('termsPage.lastUpdated') }}</strong> January 14, 2025
                </div>
            </section>

            <!-- Main Terms -->
            <div class="space-y-6">
                <!-- Usage Terms -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('termsPage.section1Title') }}</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>{{ t('termsPage.section1Intro') }}</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>{{ t('termsPage.section1Item1') }}</li>
                            <li>{{ t('termsPage.section1Item2') }}</li>
                            <li>{{ t('termsPage.section1Item3') }}</li>
                            <li>{{ t('termsPage.section1Item4') }}</li>
                        </ul>
                    </div>
                </section>

                <!-- User Conduct -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('termsPage.section2Title') }}</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>{{ t('termsPage.section2Intro') }}</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>{{ t('termsPage.section2Item1') }}</li>
                            <li>{{ t('termsPage.section2Item2') }}</li>
                            <li>{{ t('termsPage.section2Item3') }}</li>
                            <li>{{ t('termsPage.section2Item4') }}</li>
                        </ul>
                    </div>
                </section>

                <!-- Intellectual Property -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('termsPage.section3Title') }}</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>{{ t('termsPage.section3Intro') }}</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>{{ t('termsPage.section3Item1') }}</li>
                            <li>{{ t('termsPage.section3Item2') }}</li>
                            <li>{{ t('termsPage.section3Item3') }}</li>
                        </ul>
                    </div>
                </section>

                <!-- Privacy and Data -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('termsPage.section4Title') }}</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>{{ t('termsPage.section4Intro') }}</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>{{ t('termsPage.section4Item1') }}</li>
                            <li>{{ t('termsPage.section4Item2') }}</li>
                            <li>{{ t('termsPage.section4Item3') }}</li>
                        </ul>
                    </div>
                </section>

                <!-- Content Guidelines -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('termsPage.section5Title') }}</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>{{ t('termsPage.section5Intro') }}</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>{{ t('termsPage.section5Item1') }}</li>
                            <li>{{ t('termsPage.section5Item2') }}</li>
                            <li>{{ t('termsPage.section5Item3') }}</li>
                            <li>{{ t('termsPage.section5Item4') }}</li>
                        </ul>
                    </div>
                </section>
            </div>

            <!-- Disclaimer -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('termsPage.disclaimerTitle') }}</h3>
                <p class="text-gray-600">
                    {{ t('termsPage.disclaimerBody') }}
                </p>
            </section>

            <!-- Actions -->
            <section class="flex justify-between items-center border-t pt-6">
                <a href="#" class="text-[#24a6bb] hover:underline flex items-center">
                    <Download class="w-4 h-4 mr-2" />
                    {{ t('termsPage.downloadPdf') }}
                </a>
                <Button class="bg-[#24a6bb] text-white">{{ t('termsPage.acceptTerms') }}</Button>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { Download } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';

const { t } = useI18n();
</script>

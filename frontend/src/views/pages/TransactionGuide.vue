<!-- src/views/pages/TransactionGuide.vue -->
<template>
    <CommunityLayout :title="t('transactionGuideOverviewPage.title')">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('transactionGuideOverviewPage.howToShopTitle') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('transactionGuideOverviewPage.intro') }}
                </p>
            </section>

            <!-- Shopping Steps -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-6">{{ t('transactionGuideOverviewPage.shoppingProcessTitle') }}</h2>
                <div class="space-y-4">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="flex items-start space-x-4">
                            <div
                                class="w-8 h-8 bg-[#24a6bb] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('transactionGuideOverviewPage.step1Title') }}</h3>
                                <ul class="space-y-2 text-gray-600">
                                    <li>{{ t('transactionGuideOverviewPage.step1Item1') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step1Item2') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step1Item3') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step1Item4') }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="flex items-start space-x-4">
                            <div
                                class="w-8 h-8 bg-[#24a6bb] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('transactionGuideOverviewPage.step2Title') }}</h3>
                                <ul class="space-y-2 text-gray-600">
                                    <li>{{ t('transactionGuideOverviewPage.step2Item1') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step2Item2') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step2Item3') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step2Item4') }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="flex items-start space-x-4">
                            <div
                                class="w-8 h-8 bg-[#24a6bb] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('transactionGuideOverviewPage.step3Title') }}</h3>
                                <ul class="space-y-2 text-gray-600">
                                    <li>{{ t('transactionGuideOverviewPage.step3Item1') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step3Item2') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step3Item3') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step3Item4') }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="flex items-start space-x-4">
                            <div
                                class="w-8 h-8 bg-[#24a6bb] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                4
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('transactionGuideOverviewPage.step4Title') }}</h3>
                                <ul class="space-y-2 text-gray-600">
                                    <li>{{ t('transactionGuideOverviewPage.step4Item1') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step4Item2') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step4Item3') }}</li>
                                    <li>{{ t('transactionGuideOverviewPage.step4Item4') }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Payment Methods -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('transactionGuideOverviewPage.paymentMethodsTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white p-4 rounded border border-gray-200">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('transactionGuideOverviewPage.cardMethodsTitle') }}</h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>{{ t('transactionGuideOverviewPage.cardMethodVisa') }}</li>
                            <li>{{ t('transactionGuideOverviewPage.cardMethodMastercard') }}</li>
                            <li>{{ t('transactionGuideOverviewPage.cardMethodAmex') }}</li>
                        </ul>
                    </div>
                    <div class="bg-white p-4 rounded border border-gray-200">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('transactionGuideOverviewPage.digitalPaymentsTitle') }}</h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>{{ t('transactionGuideOverviewPage.digitalPayment1') }}</li>
                            <li>{{ t('transactionGuideOverviewPage.digitalPayment2') }}</li>
                            <li>{{ t('transactionGuideOverviewPage.digitalPayment3') }}</li>
                        </ul>
                    </div>
                    <div class="bg-white p-4 rounded border border-gray-200">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('transactionGuideOverviewPage.otherMethodsTitle') }}</h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>{{ t('transactionGuideOverviewPage.otherMethod1') }}</li>
                            <li>{{ t('transactionGuideOverviewPage.otherMethod2') }}</li>
                            <li>{{ t('transactionGuideOverviewPage.otherMethod3') }}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Security Tips -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('transactionGuideOverviewPage.securityTipsTitle') }}</h2>
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <ShieldCheck class="w-5 h-5 text-[#24a6bb]" />
                        <p class="text-gray-600">{{ t('transactionGuideOverviewPage.securityTip1') }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <ShieldCheck class="w-5 h-5 text-[#24a6bb]" />
                        <p class="text-gray-600">{{ t('transactionGuideOverviewPage.securityTip2') }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <ShieldCheck class="w-5 h-5 text-[#24a6bb]" />
                        <p class="text-gray-600">{{ t('transactionGuideOverviewPage.securityTip3') }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <ShieldCheck class="w-5 h-5 text-[#24a6bb]" />
                        <p class="text-gray-600">{{ t('transactionGuideOverviewPage.securityTip4') }}</p>
                    </div>
                </div>
            </section>

            <!-- Need Help -->
            <section class="border-t pt-6">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('transactionGuideOverviewPage.needHelpTitle') }}</h2>
                <div class="flex space-x-4">
                    <Button class="bg-[#24a6bb] text-white">{{ t('transactionGuideOverviewPage.contactSupport') }}</Button>
                    <Button variant="outline" class="border-[#24a6bb] text-[#24a6bb]">{{ t('transactionGuideOverviewPage.viewFaqs') }}</Button>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { ShieldCheck } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';

const { t } = useI18n();
</script>

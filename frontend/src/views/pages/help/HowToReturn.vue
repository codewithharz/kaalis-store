<!-- src/views/pages/help/HowToReturn.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">{{ t('returnsHelpPage.title') }}</h1>
                            <p class="text-lg opacity-90">{{ t('returnsHelpPage.subtitle') }}</p>
                        </div>
                        <RefreshCw class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <!-- Return Steps -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('returnsHelpPage.howToReturn') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <PackageOpen class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">{{ t('returnsHelpPage.step1Title') }}</h3>
                        <p class="text-gray-600">{{ t('returnsHelpPage.step1Body') }}
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Printer class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">{{ t('returnsHelpPage.step2Title') }}</h3>
                        <p class="text-gray-600">{{ t('returnsHelpPage.step2Body') }}</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">{{ t('returnsHelpPage.step3Title') }}</h3>
                        <p class="text-gray-600">{{ t('returnsHelpPage.step3Body') }}</p>
                    </div>
                </div>
            </section>

            <!-- Return Policy -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('returnsHelpPage.policyTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('returnsHelpPage.eligibleItems') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                {{ t('returnsHelpPage.eligible1') }}
                            </li>
                            <li class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                {{ t('returnsHelpPage.eligible2') }}
                            </li>
                            <li class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                {{ t('returnsHelpPage.eligible3') }}
                            </li>
                            <li class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                {{ t('returnsHelpPage.eligible4') }}
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('returnsHelpPage.nonReturnableItems') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-start">
                                <X class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                {{ t('returnsHelpPage.nonReturnable1') }}
                            </li>
                            <li class="flex items-start">
                                <X class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                {{ t('returnsHelpPage.nonReturnable2') }}
                            </li>
                            <li class="flex items-start">
                                <X class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                {{ t('returnsHelpPage.nonReturnable3') }}
                            </li>
                            <li class="flex items-start">
                                <X class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                {{ t('returnsHelpPage.nonReturnable4') }}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Refund Information -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('returnsHelpPage.refundProcess') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('returnsHelpPage.processingTime') }}</h3>
                        <p class="text-gray-600 mb-4">
                            {{ t('returnsHelpPage.processingIntro') }}
                        </p>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-center">
                                <Clock class="w-5 h-5 text-[#24a6bb] mr-2" />
                                {{ t('returnsHelpPage.processing1') }}
                            </li>
                            <li class="flex items-center">
                                <CreditCard class="w-5 h-5 text-[#24a6bb] mr-2" />
                                {{ t('returnsHelpPage.processing2') }}
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">{{ t('returnsHelpPage.refundMethods') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-center">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2" />
                                {{ t('returnsHelpPage.refundMethod1') }}
                            </li>
                            <li class="flex items-center">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2" />
                                {{ t('returnsHelpPage.refundMethod2') }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="mt-8 p-4 bg-[#e6f4f7] rounded-lg">
                    <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('returnsHelpPage.needHelp') }}</h3>
                    <p class="text-gray-600 mb-4">{{ t('returnsHelpPage.needHelpBody') }}</p>
                    <div class="flex space-x-4">
                        <router-link to="/help/live-help"
                            class="bg-[#24a6bb] text-white px-4 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                            {{ t('returnsHelpPage.contactSupport') }}
                        </router-link>
                        <router-link to="/help/faq"
                            class="border border-[#24a6bb] text-[#24a6bb] px-4 py-2 rounded-lg hover:bg-[#24a6bb] hover:text-white transition-colors">
                            {{ t('returnsHelpPage.viewFaqs') }}
                        </router-link>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import {
    RefreshCw,
    PackageOpen,
    Printer,
    Truck,
    Check,
    X,
    Clock,
    CreditCard
} from 'lucide-vue-next';

const { t } = useI18n();
</script>

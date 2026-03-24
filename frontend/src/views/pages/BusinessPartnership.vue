<!-- src/views/pages/BusinessPartnership.vue -->
<template>
    <CommunityLayout :title="t('businessPartnershipPage.pageTitle')">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('businessPartnershipPage.title') }}</h2>
                <p class="text-gray-600 mb-6">
                    {{ t('businessPartnershipPage.intro') }}
                </p>
                <Button class="bg-[#24a6bb] text-white">{{ t('businessPartnershipPage.becomePartner') }}</Button>
            </section>

            <!-- Partnership Types -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="h-12 w-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
                        <Store class="w-6 h-6 text-[#24a6bb]" />
                    </div>
                    <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('businessPartnershipPage.card1Title') }}</h3>
                    <p class="text-gray-600 mb-4">{{ t('businessPartnershipPage.card1Body') }}</p>
                    <Button variant="outline" class="w-full border-[#24a6bb] text-[#24a6bb]">{{ t('careerSustainabilityPage.learnMore') }}</Button>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="h-12 w-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
                        <Truck class="w-6 h-6 text-[#24a6bb]" />
                    </div>
                    <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('businessPartnershipPage.card2Title') }}</h3>
                    <p class="text-gray-600 mb-4">{{ t('businessPartnershipPage.card2Body') }}</p>
                    <Button variant="outline" class="w-full border-[#24a6bb] text-[#24a6bb]">{{ t('careerSustainabilityPage.learnMore') }}</Button>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="h-12 w-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
                        <Handshake class="w-6 h-6 text-[#24a6bb]" />
                    </div>
                    <h3 class="text-lg font-semibold text-[#2d3642] mb-2">{{ t('businessPartnershipPage.card3Title') }}</h3>
                    <p class="text-gray-600 mb-4">{{ t('businessPartnershipPage.card3Body') }}</p>
                    <Button variant="outline" class="w-full border-[#24a6bb] text-[#24a6bb]">{{ t('careerSustainabilityPage.learnMore') }}</Button>
                </div>
            </section>

            <!-- Benefits -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-6">{{ t('businessPartnershipPage.benefitsTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h3 class="font-semibold text-[#24a6bb]">{{ t('businessPartnershipPage.forSellers') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>{{ t('businessPartnershipPage.sellerBenefit1') }}</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>{{ t('businessPartnershipPage.sellerBenefit2') }}</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>{{ t('businessPartnershipPage.sellerBenefit3') }}</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>{{ t('businessPartnershipPage.sellerBenefit4') }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="space-y-4">
                        <h3 class="font-semibold text-[#24a6bb]">{{ t('businessPartnershipPage.forLogistics') }}</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>{{ t('businessPartnershipPage.logisticsBenefit1') }}</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>{{ t('businessPartnershipPage.logisticsBenefit2') }}</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>{{ t('businessPartnershipPage.logisticsBenefit3') }}</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>{{ t('businessPartnershipPage.logisticsBenefit4') }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Requirements -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-6">{{ t('businessPartnershipPage.requirementsTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('businessPartnershipPage.forSellers') }}</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.sellerReq1') }}</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.sellerReq2') }}</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.sellerReq3') }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('businessPartnershipPage.forLogisticsShort') }}</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.logisticsReq1') }}</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.logisticsReq2') }}</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.logisticsReq3') }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-4">{{ t('businessPartnershipPage.forBrands') }}</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.brandReq1') }}</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.brandReq2') }}</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>{{ t('businessPartnershipPage.brandReq3') }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Application Process -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-6">{{ t('careerPage.applicationProcess') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white p-4 rounded-lg">
                        <div class="text-[#24a6bb] font-bold text-xl mb-2">01</div>
                        <h3 class="font-semibold mb-2">{{ t('businessPartnershipPage.step1Title') }}</h3>
                        <p class="text-sm text-gray-600">{{ t('businessPartnershipPage.step1Body') }}</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg">
                        <div class="text-[#24a6bb] font-bold text-xl mb-2">02</div>
                        <h3 class="font-semibold mb-2">{{ t('businessPartnershipPage.step2Title') }}</h3>
                        <p class="text-sm text-gray-600">{{ t('businessPartnershipPage.step2Body') }}</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg">
                        <div class="text-[#24a6bb] font-bold text-xl mb-2">03</div>
                        <h3 class="font-semibold mb-2">{{ t('businessPartnershipPage.step3Title') }}</h3>
                        <p class="text-sm text-gray-600">{{ t('businessPartnershipPage.step3Body') }}</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg">
                        <div class="text-[#24a6bb] font-bold text-xl mb-2">04</div>
                        <h3 class="font-semibold mb-2">{{ t('businessPartnershipPage.step4Title') }}</h3>
                        <p class="text-sm text-gray-600">{{ t('businessPartnershipPage.step4Body') }}</p>
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section class="border-t pt-6">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('businessPartnershipPage.readyTitle') }}</h2>
                <div class="flex flex-wrap gap-4">
                    <Button class="bg-[#24a6bb] text-white">{{ t('businessPartnershipPage.applyNow') }}</Button>
                    <Button variant="outline" class="border-[#24a6bb] text-[#24a6bb]">{{ t('businessPartnershipPage.downloadGuide') }}</Button>
                    <Button variant="outline" class="border-[#24a6bb] text-[#24a6bb]">{{ t('businessPartnershipPage.contactTeam') }}</Button>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { Store, Truck, Handshake, CheckCircle2, CircleDot } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';
const { t } = useI18n();
</script>

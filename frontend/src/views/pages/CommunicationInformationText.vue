<!-- src/views/pages/CommunicationInformationText.vue -->
<template>
    <CommunityLayout :title="t('communicationInfoPage.title')">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('communicationInfoPage.channelsTitle') }}</h2>
                <p class="text-gray-600 mb-4">
                    {{ t('communicationInfoPage.intro') }}
                </p>
            </section>

            <!-- Contact Methods -->
            <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-start space-x-4">
                        <Phone class="w-6 h-6 text-[#24a6bb] mt-1" />
                        <div>
                            <h3 class="text-xl font-semibold text-[#2d3642] mb-2">{{ t('communicationInfoPage.phoneTitle') }}</h3>
                            <ul class="space-y-2 text-gray-600">
                                <li>{{ t('communicationInfoPage.phoneCustomerService') }}</li>
                                <li>{{ t('communicationInfoPage.phoneTechnicalSupport') }}</li>
                                <li>{{ t('communicationInfoPage.phoneBusinessInquiries') }}</li>
                                <li>{{ t('communicationInfoPage.phoneHours') }}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-start space-x-4">
                        <Mail class="w-6 h-6 text-[#24a6bb] mt-1" />
                        <div>
                            <h3 class="text-xl font-semibold text-[#2d3642] mb-2">{{ t('communicationInfoPage.emailTitle') }}</h3>
                            <ul class="space-y-2 text-gray-600">
                                <li>{{ t('communicationInfoPage.emailGeneral') }}</li>
                                <li>{{ t('communicationInfoPage.emailSupport') }}</li>
                                <li>{{ t('communicationInfoPage.emailBusiness') }}</li>
                                <li>{{ t('communicationInfoPage.emailPress') }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Office Locations -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('communicationInfoPage.locationsTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('communicationInfoPage.headquartersTitle') }}</h3>
                        <address class="text-gray-600 not-italic">
                            123 E-commerce Street<br />
                            Technology Park<br />
                            Digital City 12345<br />
                            Nigeria
                        </address>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('communicationInfoPage.supportCenterTitle') }}</h3>
                        <address class="text-gray-600 not-italic">
                            456 Customer Care Avenue<br />
                            Service District<br />
                            Support City 67890<br />
                            Nigeria
                        </address>
                    </div>
                </div>
            </section>

            <!-- Digital Channels -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('communicationInfoPage.digitalChannelsTitle') }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('communicationInfoPage.liveChatTitle') }}</h3>
                        <p class="text-gray-600 mb-3">{{ t('communicationInfoPage.liveChatBody') }}</p>
                        <Button class="w-full bg-[#24a6bb] text-white">{{ t('communicationInfoPage.startChat') }}</Button>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('communicationInfoPage.helpCenterTitle') }}</h3>
                        <p class="text-gray-600 mb-3">{{ t('communicationInfoPage.helpCenterBody') }}</p>
                        <Button class="w-full bg-[#24a6bb] text-white">{{ t('communicationInfoPage.visitHelpCenter') }}</Button>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">{{ t('communicationInfoPage.communityForumTitle') }}</h3>
                        <p class="text-gray-600 mb-3">{{ t('communicationInfoPage.communityForumBody') }}</p>
                        <Button class="w-full bg-[#24a6bb] text-white">{{ t('communicationInfoPage.joinCommunity') }}</Button>
                    </div>
                </div>
            </section>

            <!-- Social Media -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('communicationInfoPage.socialMediaTitle') }}</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-[#24a6bb]">
                        <Facebook class="w-5 h-5" />
                        <span>{{ t('communicationInfoPage.facebook') }}</span>
                    </a>
                    <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-[#24a6bb]">
                        <Twitter class="w-5 h-5" />
                        <span>{{ t('communicationInfoPage.twitter') }}</span>
                    </a>
                    <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-[#24a6bb]">
                        <Instagram class="w-5 h-5" />
                        <span>{{ t('communicationInfoPage.instagram') }}</span>
                    </a>
                    <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-[#24a6bb]">
                        <Linkedin class="w-5 h-5" />
                        <span>{{ t('communicationInfoPage.linkedin') }}</span>
                    </a>
                </div>
            </section>

            <!-- Response Times -->
            <section class="border-t pt-6">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('communicationInfoPage.responseTimesTitle') }}</h2>
                <div class="space-y-3 text-gray-600">
                    <p>{{ t('communicationInfoPage.responsePhone') }}</p>
                    <p>{{ t('communicationInfoPage.responseChat') }}</p>
                    <p>{{ t('communicationInfoPage.responseEmail') }}</p>
                    <p>{{ t('communicationInfoPage.responseSocial') }}</p>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';

const { t } = useI18n();
</script>

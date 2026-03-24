Security<!-- src/views/pages/Communication.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <div class="max-w-7xl mx-auto">
                <h1 class="text-3xl font-bold text-[#2d3642] mb-8">{{ t('communicationPage.title') }}</h1>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <!-- Left sidebar -->
                    <div class="col-span-1">
                        <div class="bg-white rounded-lg shadow">
                            <SidebarNavigation />
                        </div>
                    </div>

                    <!-- Main content -->
                    <div class="col-span-1 md:col-span-3">
                        <div class="bg-white rounded-lg shadow p-6">
                            <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">{{ t('communicationPage.infoTitle') }}</h2>
                            <p class="text-gray-600 mb-8">{{ t('communicationPage.infoBody') }}</p>

                            <div class="space-y-8">
                                <!-- Phone Section -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <div class="flex items-start">
                                        <Phone class="w-6 h-6 text-[#24a6bb] mt-1 mr-4" />
                                        <div>
                                            <h3 class="text-xl font-semibold text-[#2d3642] mb-2">{{ t('communicationPage.phone') }}</h3>
                                            <p class="text-gray-600">
                                                {{ t('communicationPage.customerService') }}
                                                <a href="tel:+1234567890" class="text-[#24a6bb] hover:text-[#1a7f8f]">
                                                    +1 (234) 567-890
                                                </a>
                                            </p>
                                            <p class="text-gray-600">{{ t('communicationPage.available247') }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Email Section -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <div class="flex items-start">
                                        <Mail class="w-6 h-6 text-[#24a6bb] mt-1 mr-4" />
                                        <div>
                                            <h3 class="text-xl font-semibold text-[#2d3642] mb-2">{{ t('communicationPage.email') }}</h3>
                                            <p class="text-gray-600 mb-2">
                                                {{ t('communicationPage.generalInquiries') }}
                                                <a href="mailto:info@bruthol.com"
                                                    class="text-[#24a6bb] hover:text-[#1a7f8f]">
                                                    info@bruthol.com
                                                </a>
                                            </p>
                                            <p class="text-gray-600">
                                                {{ t('communicationPage.customerSupport') }}
                                                <a href="mailto:brutholdigital@gmail.com"
                                                    class="text-[#24a6bb] hover:text-[#1a7f8f]">
                                                    brutholdigital@gmail.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Address Section -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <div class="flex items-start">
                                        <MapPin class="w-6 h-6 text-[#24a6bb] mt-1 mr-4" />
                                        <div>
                                            <h3 class="text-xl font-semibold text-[#2d3642] mb-2">{{ t('communicationPage.address') }}</h3>
                                            <div class="text-gray-600 space-y-1">
                                                <p>{{ t('communicationPage.headquarters') }}</p>
                                                <p>{{ t('communicationPage.street') }}</p>
                                                <p>{{ t('communicationPage.cityLine') }}</p>
                                                <p>{{ t('communicationPage.country') }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Social Media Section -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <div class="flex items-start">
                                        <Share2 class="w-6 h-6 text-[#24a6bb] mt-1 mr-4" />
                                        <div>
                                            <h3 class="text-xl font-semibold text-[#2d3642] mb-4">{{ t('communicationPage.socialMedia') }}</h3>
                                            <div class="flex space-x-6">
                                                <a href="#"
                                                    class="flex items-center text-gray-600 hover:text-[#24a6bb] transition-colors">
                                                    <Facebook class="w-6 h-6" />
                                                    <span class="ml-2">{{ t('communicationPage.facebook') }}</span>
                                                </a>
                                                <a href="#"
                                                    class="flex items-center text-gray-600 hover:text-[#24a6bb] transition-colors">
                                                    <Twitter class="w-6 h-6" />
                                                    <span class="ml-2">{{ t('communicationPage.twitter') }}</span>
                                                </a>
                                                <a href="#"
                                                    class="flex items-center text-gray-600 hover:text-[#24a6bb] transition-colors">
                                                    <Instagram class="w-6 h-6" />
                                                    <span class="ml-2">{{ t('communicationPage.instagram') }}</span>
                                                </a>
                                                <a href="#"
                                                    class="flex items-center text-gray-600 hover:text-[#24a6bb] transition-colors">
                                                    <Linkedin class="w-6 h-6" />
                                                    <span class="ml-2">{{ t('communicationPage.linkedin') }}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { Phone, Mail, MapPin, Share2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-vue-next';
import SidebarNavigation from './components/community/SidebarNavigation.vue';

const { t } = useI18n();
</script>

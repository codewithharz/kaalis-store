<!-- src/views/pages/CookiePolicy.vue -->
<template>
    <CommunityLayout title="Cookie Policy">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Our Cookie Policy</h2>
                <p class="text-gray-600 mb-4">
                    This Cookie Policy explains how Bruthol uses cookies and similar technologies
                    to provide, customize, evaluate, improve, promote and protect our services.
                </p>
            </section>

            <!-- Types of Cookies -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Types of Cookies We Use</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Essential Cookies</h3>
                        <p class="text-gray-600 mb-3">Required for the operation of our website:</p>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Authentication and security</li>
                            <li>Shopping cart functionality</li>
                            <li>Account preferences</li>
                            <li>Session management</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Analytics Cookies</h3>
                        <p class="text-gray-600 mb-3">Help us understand how visitors use our site:</p>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Page visit statistics</li>
                            <li>User behavior tracking</li>
                            <li>Performance monitoring</li>
                            <li>Traffic analysis</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Functional Cookies</h3>
                        <p class="text-gray-600 mb-3">Enable enhanced functionality:</p>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Language preferences</li>
                            <li>Personalized recommendations</li>
                            <li>User interface customization</li>
                            <li>Social media features</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Marketing Cookies</h3>
                        <p class="text-gray-600 mb-3">Used for advertising purposes:</p>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Ad targeting</li>
                            <li>Campaign measurement</li>
                            <li>Interest-based advertising</li>
                            <li>Retargeting</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Cookie Management -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Managing Your Cookie Preferences</h2>
                <div class="space-y-4">
                    <p class="text-gray-600">
                        You can control and manage cookies in various ways:
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 class="font-semibold text-[#24a6bb] mb-2">Browser Settings</h3>
                            <p class="text-gray-600">
                                Manage cookies through your browser settings. You can block or delete cookies.
                            </p>
                        </div>
                        <div class="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 class="font-semibold text-[#24a6bb] mb-2">Cookie Preferences</h3>
                            <p class="text-gray-600">
                                Adjust your cookie preferences through our cookie consent manager.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Cookie Controls -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Cookie Controls</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">Essential Cookies</h3>
                            <p class="text-sm text-gray-600">Required for basic functionality</p>
                        </div>
                        <Switch disabled checked />
                    </div>
                    <div class="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">Analytics Cookies</h3>
                            <p class="text-sm text-gray-600">Help improve our services</p>
                        </div>
                        <Switch v-model="analyticsEnabled" />
                    </div>
                    <div class="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                            <h3 class="font-semibold text-[#2d3642]">Marketing Cookies</h3>
                            <p class="text-sm text-gray-600">Used for personalized advertising</p>
                        </div>
                        <Switch v-model="marketingEnabled" />
                    </div>
                </div>
                <div class="mt-6 flex justify-end">
                    <Button class="bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1a7f8f] transition-colors">
                        Save Preferences
                    </Button>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { ref } from 'vue';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const analyticsEnabled = ref(true);
const marketingEnabled = ref(false);
</script>
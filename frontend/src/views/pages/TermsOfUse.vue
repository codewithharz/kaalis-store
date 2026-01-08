<!-- src/views/pages/TermsOfUse.vue -->
<template>
    <CommunityLayout title="Terms of Use">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Terms and Conditions</h2>
                <p class="text-gray-600">
                    By accessing and using Bruthol's platform, you agree to comply with and be bound by these
                    terms and conditions. Please read them carefully.
                </p>
                <div class="mt-4 p-4 bg-[#e6f4f7] rounded-lg text-gray-600">
                    <strong>Last Updated:</strong> January 14, 2025
                </div>
            </section>

            <!-- Main Terms -->
            <div class="space-y-6">
                <!-- Usage Terms -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">1. Platform Usage</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>Users must:</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>Be at least 18 years old</li>
                            <li>Provide accurate registration information</li>
                            <li>Maintain account security</li>
                            <li>Use the platform legally and responsibly</li>
                        </ul>
                    </div>
                </section>

                <!-- User Conduct -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">2. User Conduct</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>Prohibited activities include:</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>Unauthorized access or use</li>
                            <li>Fraudulent or deceptive practices</li>
                            <li>Harassment or abuse</li>
                            <li>Content violation</li>
                        </ul>
                    </div>
                </section>

                <!-- Intellectual Property -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">3. Intellectual Property</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>All content on the platform is protected by:</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>Copyright laws</li>
                            <li>Trademark rights</li>
                            <li>Intellectual property regulations</li>
                        </ul>
                    </div>
                </section>

                <!-- Privacy and Data -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">4. Privacy & Data Protection</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>We are committed to protecting your privacy:</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>Data collection and usage policies</li>
                            <li>Information security measures</li>
                            <li>User rights and controls</li>
                        </ul>
                    </div>
                </section>

                <!-- Content Guidelines -->
                <section class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-4">5. Content Guidelines</h3>
                    <div class="space-y-4 text-gray-600">
                        <p>User-generated content must be:</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li>Accurate and truthful</li>
                            <li>Free from harmful material</li>
                            <li>Respectful of others' rights</li>
                            <li>Compliant with local laws</li>
                        </ul>
                    </div>
                </section>
            </div>

            <!-- Disclaimer -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-[#2d3642] mb-4">Disclaimer</h3>
                <p class="text-gray-600">
                    Bruthol provides the platform "as is" and makes no warranties, express or implied.
                    We reserve the right to modify these terms at any time.
                </p>
            </section>

            <!-- Actions -->
            <section class="flex justify-between items-center border-t pt-6">
                <a href="#" class="text-[#24a6bb] hover:underline flex items-center">
                    <Download class="w-4 h-4 mr-2" />
                    Download PDF version
                </a>
                <Button class="bg-[#24a6bb] text-white">Accept Terms</Button>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { Download } from 'lucide-vue-next';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';
</script>
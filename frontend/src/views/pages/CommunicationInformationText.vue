<!-- src/views/pages/CommunicationInformationText.vue -->
<template>
    <CommunityLayout title="Communication Information">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Communication Channels</h2>
                <p class="text-gray-600 mb-4">
                    At Bruthol, we maintain various communication channels to ensure effective
                    interaction with our customers, sellers, and partners.
                </p>
            </section>

            <!-- Contact Methods -->
            <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-start space-x-4">
                        <Phone class="w-6 h-6 text-[#24a6bb] mt-1" />
                        <div>
                            <h3 class="text-xl font-semibold text-[#2d3642] mb-2">Phone Support</h3>
                            <ul class="space-y-2 text-gray-600">
                                <li>Customer Service: +1 (234) 567-890</li>
                                <li>Technical Support: +1 (234) 567-891</li>
                                <li>Business Inquiries: +1 (234) 567-892</li>
                                <li>Hours: 24/7 for Customer Service</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-start space-x-4">
                        <Mail class="w-6 h-6 text-[#24a6bb] mt-1" />
                        <div>
                            <h3 class="text-xl font-semibold text-[#2d3642] mb-2">Email Contacts</h3>
                            <ul class="space-y-2 text-gray-600">
                                <li>General: info@bruthol.com</li>
                                <li>Support: support@bruthol.com</li>
                                <li>Business: business@bruthol.com</li>
                                <li>Press: press@bruthol.com</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Office Locations -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Office Locations</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Headquarters</h3>
                        <address class="text-gray-600 not-italic">
                            123 E-commerce Street<br />
                            Technology Park<br />
                            Digital City 12345<br />
                            Nigeria
                        </address>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Support Center</h3>
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
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Digital Channels</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Live Chat</h3>
                        <p class="text-gray-600 mb-3">Available 24/7 through our website and mobile app.</p>
                        <Button class="w-full bg-[#24a6bb] text-white">Start Chat</Button>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Help Center</h3>
                        <p class="text-gray-600 mb-3">Browse our comprehensive knowledge base.</p>
                        <Button class="w-full bg-[#24a6bb] text-white">Visit Help Center</Button>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Community Forum</h3>
                        <p class="text-gray-600 mb-3">Connect with other users and share experiences.</p>
                        <Button class="w-full bg-[#24a6bb] text-white">Join Community</Button>
                    </div>
                </div>
            </section>

            <!-- Social Media -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Social Media</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-[#24a6bb]">
                        <Facebook class="w-5 h-5" />
                        <span>Facebook</span>
                    </a>
                    <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-[#24a6bb]">
                        <Twitter class="w-5 h-5" />
                        <span>Twitter</span>
                    </a>
                    <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-[#24a6bb]">
                        <Instagram class="w-5 h-5" />
                        <span>Instagram</span>
                    </a>
                    <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-[#24a6bb]">
                        <Linkedin class="w-5 h-5" />
                        <span>LinkedIn</span>
                    </a>
                </div>
            </section>

            <!-- Response Times -->
            <section class="border-t pt-6">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Expected Response Times</h2>
                <div class="space-y-3 text-gray-600">
                    <p>• Phone Support: Immediate to 5 minutes</p>
                    <p>• Live Chat: Within 2 minutes</p>
                    <p>• Emails: Within 24 hours</p>
                    <p>• Social Media: Within 4 hours</p>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-vue-next';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';
</script>
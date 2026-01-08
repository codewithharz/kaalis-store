<!-- src/views/pages/ProtectionOfPersonalData.vue -->
<template>
    <CommunityLayout title="Protection of Personal Data">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Data Protection Policy</h2>
                <p class="text-gray-600 mb-4">
                    Bruthol is committed to protecting your personal data. This policy explains how we collect,
                    use, and safeguard your information.
                </p>
            </section>

            <!-- Data Collection -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Information We Collect</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Personal Information</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Name and contact details</li>
                            <li>Billing and delivery address</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Usage Information</h3>
                        <ul class="list-disc list-inside space-y-2 text-gray-600">
                            <li>Shopping preferences</li>
                            <li>Order history</li>
                            <li>Website activity</li>
                            <li>Device information</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Data Usage -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">How We Use Your Data</h2>
                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Essential Services</h3>
                        <p class="text-gray-600">Processing orders, delivering products, and providing customer support.
                        </p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Personalization</h3>
                        <p class="text-gray-600">Customizing your shopping experience and product recommendations.</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Communication</h3>
                        <p class="text-gray-600">Sending order updates, promotional offers, and important notifications.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Your Rights -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Your Rights</h2>
                <div class="bg-gray-50 p-6 rounded-lg">
                    <ul class="space-y-3 text-gray-600">
                        <li><span class="font-semibold">Access:</span> Request a copy of your personal data</li>
                        <li><span class="font-semibold">Rectification:</span> Update or correct your personal
                            information</li>
                        <li><span class="font-semibold">Erasure:</span> Request deletion of your data</li>
                        <li><span class="font-semibold">Restriction:</span> Limit how we use your data</li>
                        <li><span class="font-semibold">Portability:</span> Transfer your data to another service</li>
                    </ul>
                </div>
            </section>

            <!-- Contact -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Data Protection Inquiries</h2>
                <p class="text-gray-600 mb-4">
                    For any questions about your personal data or to exercise your rights:
                </p>
                <div class="flex items-center gap-4">
                    <a href="mailto:privacy@bruthol.com"
                        class="bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1a7f8f] transition-colors">
                        Contact Data Protection Officer
                    </a>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import CommunityLayout from './components/layouts/CommunityLayout.vue';
</script>
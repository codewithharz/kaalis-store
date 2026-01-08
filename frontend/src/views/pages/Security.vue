<!-- src/views/pages/Security.vue -->
<template>
    <CommunityLayout title="Security">
        <div class="space-y-8">
            <!-- Payment Security -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Payment Security</h2>
                <p class="text-gray-600 mb-4">
                    At Bruthol, we prioritize the security of your payments and personal information.
                    Our platform uses industry-standard encryption and security protocols to protect all transactions.
                </p>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Security Features:</h3>
                    <ul class="list-disc list-inside space-y-2 text-gray-600">
                        <li>SSL encryption for all transactions</li>
                        <li>PCI DSS compliance</li>
                        <li>Two-factor authentication</li>
                        <li>Fraud detection systems</li>
                        <li>Regular security audits</li>
                    </ul>
                </div>
            </section>

            <!-- Account Security -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Account Security</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Password Guidelines</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li>Use unique, complex passwords</li>
                            <li>Enable two-factor authentication</li>
                            <li>Avoid sharing login credentials</li>
                            <li>Log out from shared devices</li>
                        </ul>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Safe Shopping Tips</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li>Verify seller ratings and reviews</li>
                            <li>Use secure payment methods</li>
                            <li>Keep order records</li>
                            <li>Report suspicious activity</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Need Help?</h2>
                <p class="text-gray-600 mb-4">
                    If you notice any security concerns or have questions, contact our security team:
                </p>
                <div class="flex items-center gap-4">
                    <a href="mailto:security@bruthol.com"
                        class="inline-flex items-center bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1a7f8f] transition-colors">
                        <Mail class="w-4 h-4 mr-2" />
                        Contact Security Team
                    </a>
                    <a href="#" class="text-[#24a6bb] hover:underline">View Security FAQ</a>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { Mail } from 'lucide-vue-next';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
</script>
<!-- src/views/pages/MembershipAgreement.vue -->
<template>
    <CommunityLayout title="Membership Agreement">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Terms of Membership</h2>
                <p class="text-gray-600 mb-4">
                    This Membership Agreement ("Agreement") is between you and Bruthol. By registering for an
                    account,
                    you agree to these terms and conditions.
                </p>
            </section>

            <!-- Agreement Sections -->
            <section class="space-y-6">
                <!-- Account Terms -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-3">1. Account Terms</h3>
                    <ul class="space-y-3 text-gray-600">
                        <li>Must be at least 18 years old to create an account</li>
                        <li>Provide accurate and complete registration information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Notify us immediately of any unauthorized account access</li>
                    </ul>
                </div>

                <!-- Member Responsibilities -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-3">2. Member Responsibilities</h3>
                    <ul class="space-y-3 text-gray-600">
                        <li>Comply with all applicable laws and regulations</li>
                        <li>Maintain accurate account and payment information</li>
                        <li>Use the platform responsibly and ethically</li>
                        <li>Respect the rights of other users and sellers</li>
                    </ul>
                </div>

                <!-- Payment Terms -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-3">3. Payment Terms</h3>
                    <ul class="space-y-3 text-gray-600">
                        <li>All payments must be made through approved platform methods</li>
                        <li>Prices are in designated currency and include applicable taxes</li>
                        <li>Payment information must be kept current and valid</li>
                        <li>Refunds are subject to our return policy</li>
                    </ul>
                </div>

                <!-- Privacy and Data -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-[#2d3642] mb-3">4. Privacy and Data</h3>
                    <ul class="space-y-3 text-gray-600">
                        <li>Collection and use of personal data as per Privacy Policy</li>
                        <li>Security measures to protect user information</li>
                        <li>Cookie usage and tracking technologies</li>
                        <li>Data sharing with third-party service providers</li>
                    </ul>
                </div>
            </section>

            <!-- Termination -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-3">Account Termination</h2>
                <p class="text-gray-600 mb-4">
                    We reserve the right to suspend or terminate accounts that violate our terms or engage in
                    prohibited activities. Members may also terminate their accounts at any time.
                </p>
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 class="font-semibold text-[#24a6bb] mb-2">Grounds for Termination:</h4>
                    <ul class="list-disc list-inside space-y-2 text-gray-600">
                        <li>Violation of terms and conditions</li>
                        <li>Fraudulent activities</li>
                        <li>Abuse of platform features</li>
                        <li>Non-payment of fees or charges</li>
                    </ul>
                </div>
            </section>

            <!-- Updates and Changes -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-3">Agreement Updates</h2>
                <p class="text-gray-600 mb-4">
                    We may update this Agreement from time to time. Significant changes will be notified to members
                    via email or platform notifications.
                </p>
                <div class="flex items-center gap-4">
                    <Button class="bg-[#24a6bb] text-white px-4 py-2 rounded hover:bg-[#1a7f8f] transition-colors">
                        View Full Agreement
                    </Button>
                    <a href="#" class="text-[#24a6bb] hover:underline">Download PDF version</a>
                </div>
            </section>

            <!-- Contact Information -->
            <section class="border-t pt-6">
                <p class="text-gray-600">
                    For questions about this agreement, contact us at:
                    <a href="mailto:legal@bruthol.com" class="text-[#24a6bb] hover:underline">
                        legal@bruthol.com
                    </a>
                </p>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';
</script>
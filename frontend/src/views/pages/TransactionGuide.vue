<!-- src/views/pages/TransactionGuide.vue -->
<template>
    <CommunityLayout title="Transaction Guide">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">How to Shop on Bruthol</h2>
                <p class="text-gray-600 mb-4">
                    Follow this comprehensive guide to ensure safe and successful transactions on our platform.
                </p>
            </section>

            <!-- Shopping Steps -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-6">Shopping Process</h2>
                <div class="space-y-4">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="flex items-start space-x-4">
                            <div
                                class="w-8 h-8 bg-[#24a6bb] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Browse & Select</h3>
                                <ul class="space-y-2 text-gray-600">
                                    <li>Search for products using filters</li>
                                    <li>Compare prices and reviews</li>
                                    <li>Check product details and specifications</li>
                                    <li>Verify seller ratings and reviews</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="flex items-start space-x-4">
                            <div
                                class="w-8 h-8 bg-[#24a6bb] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Add to Cart</h3>
                                <ul class="space-y-2 text-gray-600">
                                    <li>Select product variations (size, color, etc.)</li>
                                    <li>Choose quantity</li>
                                    <li>Review shipping options</li>
                                    <li>Add to shopping cart</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="flex items-start space-x-4">
                            <div
                                class="w-8 h-8 bg-[#24a6bb] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Checkout</h3>
                                <ul class="space-y-2 text-gray-600">
                                    <li>Review cart items</li>
                                    <li>Enter shipping address</li>
                                    <li>Select delivery method</li>
                                    <li>Choose payment option</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="flex items-start space-x-4">
                            <div
                                class="w-8 h-8 bg-[#24a6bb] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                4
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Track Order</h3>
                                <ul class="space-y-2 text-gray-600">
                                    <li>Receive order confirmation</li>
                                    <li>Track shipping status</li>
                                    <li>Get delivery updates</li>
                                    <li>Confirm receipt</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Payment Methods -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Payment Methods</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white p-4 rounded border border-gray-200">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Credit/Debit Cards</h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>Visa</li>
                            <li>Mastercard</li>
                            <li>American Express</li>
                        </ul>
                    </div>
                    <div class="bg-white p-4 rounded border border-gray-200">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Digital Payments</h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>Mobile Money</li>
                            <li>Bank Transfer</li>
                            <li>Digital Wallets</li>
                        </ul>
                    </div>
                    <div class="bg-white p-4 rounded border border-gray-200">
                        <h3 class="font-semibold text-[#24a6bb] mb-2">Other Methods</h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li>Pay on Delivery</li>
                            <li>Installment Payment</li>
                            <li>Gift Cards</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Security Tips -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Security Tips</h2>
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <ShieldCheck class="w-5 h-5 text-[#24a6bb]" />
                        <p class="text-gray-600">Always verify seller ratings and reviews</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <ShieldCheck class="w-5 h-5 text-[#24a6bb]" />
                        <p class="text-gray-600">Use secure payment methods only</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <ShieldCheck class="w-5 h-5 text-[#24a6bb]" />
                        <p class="text-gray-600">Keep transaction records</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <ShieldCheck class="w-5 h-5 text-[#24a6bb]" />
                        <p class="text-gray-600">Report suspicious activities immediately</p>
                    </div>
                </div>
            </section>

            <!-- Need Help -->
            <section class="border-t pt-6">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Need Help?</h2>
                <div class="flex space-x-4">
                    <Button class="bg-[#24a6bb] text-white">Contact Support</Button>
                    <Button variant="outline" class="border-[#24a6bb] text-[#24a6bb]">View FAQs</Button>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { ShieldCheck } from 'lucide-vue-next';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';
</script>
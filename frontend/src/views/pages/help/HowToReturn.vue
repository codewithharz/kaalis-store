<!-- src/views/pages/help/HowToReturn.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <!-- Hero Section -->
            <section class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div class="relative h-[200px] bg-[#24a6bb]">
                    <div class="absolute inset-0 flex items-center justify-between px-8">
                        <div class="text-white">
                            <h1 class="text-3xl font-bold mb-2">Returns & Refunds</h1>
                            <p class="text-lg opacity-90">Easy steps to return your items</p>
                        </div>
                        <RefreshCw class="w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <!-- Return Steps -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">How to Return an Item</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <PackageOpen class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">1. Initiate Return</h3>
                        <p class="text-gray-600">Go to your orders and select 'Return Item' within 30 days of delivery
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Printer class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">2. Print Label</h3>
                        <p class="text-gray-600">Print the return shipping label provided</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-[#e6f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck class="w-8 h-8 text-[#24a6bb]" />
                        </div>
                        <h3 class="text-lg font-semibold mb-2">3. Ship Item</h3>
                        <p class="text-gray-600">Drop off the package at any designated return point</p>
                    </div>
                </div>
            </section>

            <!-- Return Policy -->
            <section class="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Return Policy</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Eligible Items</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                Unused and in original packaging
                            </li>
                            <li class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                Tags attached (for clothing)
                            </li>
                            <li class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                Within 30 days of delivery
                            </li>
                            <li class="flex items-start">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2 flex-shrink-0 mt-0.5" />
                                In resalable condition
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Non-Returnable Items</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-start">
                                <X class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                Personalized items
                            </li>
                            <li class="flex items-start">
                                <X class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                Perishable goods
                            </li>
                            <li class="flex items-start">
                                <X class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                Intimate items
                            </li>
                            <li class="flex items-start">
                                <X class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                Digital products
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Refund Information -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Refund Process</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Processing Time</h3>
                        <p class="text-gray-600 mb-4">
                            Once we receive your return, it typically takes:
                        </p>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-center">
                                <Clock class="w-5 h-5 text-[#24a6bb] mr-2" />
                                2-3 days for inspection
                            </li>
                            <li class="flex items-center">
                                <CreditCard class="w-5 h-5 text-[#24a6bb] mr-2" />
                                3-5 business days for refund
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-[#24a6bb] mb-3">Refund Methods</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-center">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2" />
                                Original payment method
                            </li>
                            <li class="flex items-center">
                                <Check class="w-5 h-5 text-[#24a6bb] mr-2" />
                                Store credit (faster processing)
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="mt-8 p-4 bg-[#e6f4f7] rounded-lg">
                    <h3 class="font-semibold text-[#24a6bb] mb-2">Need Help?</h3>
                    <p class="text-gray-600 mb-4">Having trouble with your return? Our support team is here to help.</p>
                    <div class="flex space-x-4">
                        <router-link to="/help/live-help"
                            class="bg-[#24a6bb] text-white px-4 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                            Contact Support
                        </router-link>
                        <router-link to="/help/faq"
                            class="border border-[#24a6bb] text-[#24a6bb] px-4 py-2 rounded-lg hover:bg-[#24a6bb] hover:text-white transition-colors">
                            View FAQs
                        </router-link>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import {
    RefreshCw,
    PackageOpen,
    Printer,
    Truck,
    Check,
    X,
    Clock,
    CreditCard
} from 'lucide-vue-next';
</script>
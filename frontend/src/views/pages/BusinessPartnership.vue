<!-- src/views/pages/BusinessPartnership.vue -->
<template>
    <CommunityLayout title="Business Partnership">
        <div class="space-y-8">
            <!-- Introduction -->
            <section>
                <h2 class="text-2xl font-semibold text-[#2d3642] mb-4">Partner With Bruthol</h2>
                <p class="text-gray-600 mb-6">
                    Join Africa's leading e-commerce platform and grow your business with our comprehensive
                    partnership program.
                </p>
                <Button class="bg-[#24a6bb] text-white">Become a Partner</Button>
            </section>

            <!-- Partnership Types -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="h-12 w-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
                        <Store class="w-6 h-6 text-[#24a6bb]" />
                    </div>
                    <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Seller Partnership</h3>
                    <p class="text-gray-600 mb-4">Start selling your products on our platform and reach millions of
                        customers.</p>
                    <Button variant="outline" class="w-full border-[#24a6bb] text-[#24a6bb]">Learn More</Button>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="h-12 w-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
                        <Truck class="w-6 h-6 text-[#24a6bb]" />
                    </div>
                    <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Logistics Partnership</h3>
                    <p class="text-gray-600 mb-4">Join our delivery network and help us serve customers nationwide.</p>
                    <Button variant="outline" class="w-full border-[#24a6bb] text-[#24a6bb]">Learn More</Button>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="h-12 w-12 bg-[#e6f4f7] rounded-full flex items-center justify-center mb-4">
                        <Handshake class="w-6 h-6 text-[#24a6bb]" />
                    </div>
                    <h3 class="text-lg font-semibold text-[#2d3642] mb-2">Brand Partnership</h3>
                    <p class="text-gray-600 mb-4">Collaborate with us for marketing and promotional opportunities.</p>
                    <Button variant="outline" class="w-full border-[#24a6bb] text-[#24a6bb]">Learn More</Button>
                </div>
            </section>

            <!-- Benefits -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-6">Partnership Benefits</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h3 class="font-semibold text-[#24a6bb]">For Sellers</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>Access to millions of customers</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>Secure payment processing</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>Marketing support</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>Logistics solutions</span>
                            </li>
                        </ul>
                    </div>
                    <div class="space-y-4">
                        <h3 class="font-semibold text-[#24a6bb]">For Logistics Partners</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>Steady order volume</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>Route optimization</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>Technology integration</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <CheckCircle2 class="w-5 h-5 text-[#24a6bb]" />
                                <span>Growth opportunities</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Requirements -->
            <section>
                <h2 class="text-xl font-semibold text-[#2d3642] mb-6">Partnership Requirements</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-4">For Sellers</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Valid business registration</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Quality product inventory</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Dedicated customer service</span>
                            </li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-4">For Logistics</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Delivery fleet availability</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Tracking system integration</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Insurance coverage</span>
                            </li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="font-semibold text-[#24a6bb] mb-4">For Brands</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Established market presence</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Quality brand standards</span>
                            </li>
                            <li class="flex items-start space-x-2">
                                <CircleDot class="w-5 h-5 text-[#24a6bb] mt-0.5" />
                                <span>Marketing resources</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Application Process -->
            <section class="bg-[#e6f4f7] p-6 rounded-lg">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-6">Application Process</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white p-4 rounded-lg">
                        <div class="text-[#24a6bb] font-bold text-xl mb-2">01</div>
                        <h3 class="font-semibold mb-2">Submit Application</h3>
                        <p class="text-sm text-gray-600">Complete the online partnership application form</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg">
                        <div class="text-[#24a6bb] font-bold text-xl mb-2">02</div>
                        <h3 class="font-semibold mb-2">Document Review</h3>
                        <p class="text-sm text-gray-600">We'll verify your business documentation</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg">
                        <div class="text-[#24a6bb] font-bold text-xl mb-2">03</div>
                        <h3 class="font-semibold mb-2">Partnership Meeting</h3>
                        <p class="text-sm text-gray-600">Discussion of terms and requirements</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg">
                        <div class="text-[#24a6bb] font-bold text-xl mb-2">04</div>
                        <h3 class="font-semibold mb-2">Integration</h3>
                        <p class="text-sm text-gray-600">Platform onboarding and training</p>
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section class="border-t pt-6">
                <h2 class="text-xl font-semibold text-[#2d3642] mb-4">Ready to Partner?</h2>
                <div class="flex flex-wrap gap-4">
                    <Button class="bg-[#24a6bb] text-white">Apply Now</Button>
                    <Button variant="outline" class="border-[#24a6bb] text-[#24a6bb]">Download Partnership
                        Guide</Button>
                    <Button variant="outline" class="border-[#24a6bb] text-[#24a6bb]">Contact Partnership Team</Button>
                </div>
            </section>
        </div>
    </CommunityLayout>
</template>

<script setup>
import { Store, Truck, Handshake, CheckCircle2, CircleDot } from 'lucide-vue-next';
import CommunityLayout from './components/layouts/CommunityLayout.vue';
import { Button } from '@/components/ui/button';
</script>
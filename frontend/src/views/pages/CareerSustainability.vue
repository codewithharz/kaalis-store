<!-- src/views/CareerSustainability.vue -->
<template>
    <div class="career-sustainability">
        <!-- Hero Section -->
        <header class="relative h-[20vh] max-h-[200px] overflow-hidden">
            <img src="../../assets/images/Kyrian.png" alt="Sustainability at Bruthol"
                class="w-full h-[400px] object-cover object-center" />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center">
                <div class="container mx-auto px-4">
                    <h1 class="text-3xl md:text-4xl text-white font-bold mb-2">Sustainability at Bruthol</h1>
                    <p class="text-lg text-white max-w-2xl">Building a sustainable future for e-commerce in Africa</p>
                </div>
            </div>
        </header>

        <div class="container mx-auto px-4 py-12">
            <!-- Our Commitment Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Our Commitment</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SustainabilityCard icon="Leaf" title="Environmental Impact"
                        description="We're committed to reducing our carbon footprint and promoting sustainable practices across our operations." />
                    <SustainabilityCard icon="Users" title="Social Responsibility"
                        description="Creating positive impact in communities through education, empowerment, and economic opportunities." />
                    <SustainabilityCard icon="Shield" title="Ethical Business"
                        description="Maintaining the highest standards of transparency, fairness, and ethical business practices." />
                </div>
            </section>

            <!-- Key Initiatives -->
            <section class="mb-16 bg-gray-50 p-8 rounded-lg">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Key Initiatives</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InitiativeCard title="Carbon Reduction" :points="[
                        '100% renewable energy in our operations by 2025',
                        'Electric vehicle delivery fleet implementation',
                        'Energy-efficient warehouses and offices',
                        'Carbon offset programs for deliveries'
                    ]" />
                    <InitiativeCard title="Waste Management" :points='[
                        "Zero waste to landfill goal by 2024",
                        "Sustainable packaging initiatives",
                        "Recycling programs across all facilities",
                        "E-waste management solutions"
                    ]' />
                    <InitiativeCard title="Community Impact" :points="[
                        'Digital literacy programs',
                        'Small business empowerment',
                        'Youth entrepreneurship support',
                        'Local community partnerships'
                    ]" />
                    <InitiativeCard title="Sustainable Supply Chain" :points='[
                        "Eco-friendly vendor certification",
                        "Local sourcing priorities",
                        "Fair trade practices",
                        "Sustainable logistics optimization"
                    ]' />
                </div>
            </section>

            <!-- Environmental Goals -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Environmental Goals</h2>
                <div class="space-y-8">
                    <GoalProgress title="Carbon Footprint Reduction" currentValue="60" target="100" targetYear="2025"
                        description="Percentage reduction in carbon emissions" />
                    <GoalProgress title="Renewable Energy Usage" currentValue="75" target="100" targetYear="2024"
                        description="Percentage of operations powered by renewable energy" />
                    <GoalProgress title="Sustainable Packaging" currentValue="80" target="100" targetYear="2023"
                        description="Percentage of recyclable packaging materials" />
                </div>
            </section>

            <!-- Join Our Mission -->
            <section class="text-center py-16 bg-[#e6f4f7] rounded-lg">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-4">Join Our Mission</h2>
                <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Be part of a team that's committed to making a positive impact on the environment
                    and communities across Africa.
                </p>
                <div class="flex justify-center gap-4">
                    <button
                        class="bg-[#24a6bb] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1a7f8f] transition duration-300">
                        View Open Positions
                    </button>
                    <button
                        class="border-2 border-[#24a6bb] text-[#24a6bb] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#24a6bb] hover:text-white transition duration-300">
                        Learn More
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SustainabilityCard from './components/sustainability/SustainabilityCard.vue';
import InitiativeCard from './components/sustainability/InitiativeCard.vue';
import GoalProgress from './components/sustainability/GoalProgress.vue';
</script>
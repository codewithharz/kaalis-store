<!-- src/views/CareerPage.vue -->
<template>
    <div class="career-page">
        <!-- Hero Section -->
        <header class="relative h-[60vh] overflow-hidden">
            <img src="../../assets/images/workers.jpg" alt="Bruthol Career" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center">
                <div class="container mx-auto px-4">
                    <h1 class="text-4xl md:text-6xl text-white font-bold mb-4">Join Our Journey</h1>
                    <p class="text-xl text-white mb-8 max-w-2xl">Shape the future of e-commerce in Africa with
                        innovative solutions and meaningful impact.</p>
                    <button
                        class="bg-[#24a6bb] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1a7f8f] transition duration-300">
                        View Open Positions
                    </button>
                </div>
            </div>
        </header>

        <div class="container mx-auto px-4 py-12">
            <!-- Why Join Us Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Why Join Bruthol?</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CareerFeatureCard icon="Lightbulb" title="Innovation First"
                        description="Work with cutting-edge technologies and shape the future of e-commerce in Africa." />
                    <CareerFeatureCard icon="Users" title="Diverse & Inclusive"
                        description="Join a team that celebrates diversity and creates an inclusive environment for all." />
                    <CareerFeatureCard icon="TrendingUp" title="Growth Opportunities"
                        description="Accelerate your career with continuous learning and development programs." />
                </div>
            </section>

            <!-- Life at Bruthol Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Life at Bruthol</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <h3 class="text-2xl font-semibold mb-4">Our Culture</h3>
                        <ul class="space-y-4">
                            <CareerCultureItem icon="Heart" title="Work-Life Balance"
                                description="Flexible working hours and remote work options to help you maintain a healthy balance." />
                            <CareerCultureItem icon="Target" title="Impact-Driven"
                                description="Your work directly impacts millions of customers and vendors across Africa." />
                            <CareerCultureItem icon="Award" title="Recognition"
                                description="Regular recognition programs and rewards for outstanding contributions." />
                        </ul>
                    </div>
                    <div class="relative h-[400px] rounded-lg overflow-hidden">
                        <img src="../../assets/images/Kyrian.png" alt="Life at Bruthol"
                            class="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            <!-- Current Opportunities Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Current Opportunities</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CareerJobCard v-for="job in currentJobs" :key="job.id" :title="job.title"
                        :department="job.department" :location="job.location" :type="job.type" />
                </div>
            </section>

            <!-- Benefits Section -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Benefits & Perks</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <CareerBenefitCard v-for="benefit in benefits" :key="benefit.id" :icon="benefit.icon"
                        :title="benefit.title" :description="benefit.description" />
                </div>
            </section>

            <!-- Development Programs -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Development Programs</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CareerProgramCard title="Graduate Program"
                        description="12-month rotational program for fresh graduates to explore different areas of our business."
                        icon="GraduationCap" />
                    <CareerProgramCard title="Tech Academy"
                        description="Intensive training programs in software development, data science, and product management."
                        icon="Code" />
                    <CareerProgramCard title="Leadership Track"
                        description="Structured development path for future leaders with mentorship and training."
                        icon="Trophy" />
                </div>
            </section>

            <!-- Application Process -->
            <section class="mb-16">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-8">Application Process</h2>
                <div class="relative">
                    <div class="absolute left-1/2 top-0 h-full w-px bg-[#24a6bb] transform -translate-x-1/2"></div>
                    <div class="space-y-12 relative">
                        <CareerProcessStep step="1" title="Apply Online"
                            description="Submit your application through our careers portal" />
                        <CareerProcessStep step="2" title="Initial Assessment"
                            description="Complete online assessments relevant to your role" />
                        <CareerProcessStep step="3" title="Interviews"
                            description="Meet with our team through virtual or in-person interviews" />
                        <CareerProcessStep step="4" title="Final Decision"
                            description="Receive our decision and potential offer" />
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="text-center py-16 bg-gray-50 rounded-lg">
                <h2 class="text-3xl font-bold text-[#2d3642] mb-4">Ready to Join Us?</h2>
                <p class="text-lg text-gray-600 mb-8">Take the first step towards an exciting career at Bruthol</p>
                <button
                    class="bg-[#24a6bb] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1a7f8f] transition duration-300">
                    Browse Open Positions
                </button>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import CareerFeatureCard from './components/career/CareerFeatureCard.vue';
import CareerCultureItem from './components/career/CareerCultureItem.vue';
import CareerJobCard from './components/career/CareerJobCard.vue';
import CareerBenefitCard from './components/career/CareerBenefitCard.vue';
import CareerProgramCard from './components/career/CareerProgramCard.vue';
import CareerProcessStep from './components/career/CareerProcessStep.vue';

const currentJobs = ref([
    {
        id: 1,
        title: "Senior Software Engineer",
        department: "Engineering",
        location: "Lagos, Nigeria",
        type: "Full-time"
    },
    {
        id: 2,
        title: "Product Manager",
        department: "Product",
        location: "Remote",
        type: "Full-time"
    }
]);

const benefits = ref([
    {
        id: 1,
        icon: "Heart",
        title: "Health Insurance",
        description: "Comprehensive health coverage for you and your family"
    },
    {
        id: 2,
        icon: "Book",
        title: "Learning Budget",
        description: "Annual budget for courses and conferences"
    }
]);
</script>
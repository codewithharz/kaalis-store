<!-- frontend/src/views/pages/seller/BrutholAcademy.vue -->
<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Hero Section -->
        <section class="bg-[#24a6bb] text-white py-12">
            <div class="container mx-auto px-4">
                <div class="flex flex-col md:flex-row items-center justify-between">
                    <div class="md:w-1/2 mb-8 md:mb-0">
                        <h1 class="text-4xl font-bold mb-4">Bruthol Academy</h1>
                        <p class="text-xl opacity-90 mb-6">Master e-commerce and grow your business with our expert-led
                            courses</p>
                        <div class="flex flex-wrap gap-4">
                            <button @click="startLearning"
                                class="bg-white text-[#24a6bb] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                Start Learning
                            </button>
                            <button @click="showCertifications"
                                class="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                View Certifications
                            </button>
                        </div>
                    </div>
                    <div class="md:w-1/2 flex justify-center">
                        <GraduationCap class="w-48 h-48 text-white opacity-20" />
                    </div>
                </div>
            </div>
        </section>

        <div class="container mx-auto px-4 py-8">
            <!-- Learning Paths -->
            <section class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-[#2d3642]">Learning Paths</h2>
                    <button @click="viewAllPaths" class="text-[#24a6bb] hover:underline flex items-center">
                        View All
                        <ArrowRight class="w-4 h-4 ml-1" />
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="path in learningPaths" :key="path.id"
                        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div class="h-3 bg-[#24a6bb]"></div>
                        <div class="p-6">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h3 class="text-xl font-bold text-[#2d3642] mb-2">{{ path.title }}</h3>
                                    <p class="text-gray-600">{{ path.description }}</p>
                                </div>
                                <component :is="path.icon" class="w-8 h-8 text-[#24a6bb]" />
                            </div>
                            <div class="space-y-4 mb-6">
                                <div class="flex items-center text-sm text-gray-600">
                                    <Clock class="w-4 h-4 mr-2" />
                                    <span>{{ path.duration }}</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-600">
                                    <BookOpen class="w-4 h-4 mr-2" />
                                    <span>{{ path.coursesCount }} Courses</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-600">
                                    <Award class="w-4 h-4 mr-2" />
                                    <span>{{ path.certificationType }}</span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-600">Progress</span>
                                    <span class="text-[#24a6bb] font-medium">{{ path.progress }}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-[#24a6bb] h-2 rounded-full" :style="{ width: path.progress + '%' }">
                                    </div>
                                </div>
                            </div>
                            <button @click="continuePath(path.id)"
                                class="w-full mt-6 bg-[#24a6bb] text-white py-2 px-4 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                                Continue Learning
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Courses -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Featured Courses</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="course in featuredCourses" :key="course.id"
                        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <img :src="course.thumbnail" :alt="course.title" class="w-full h-48 object-cover" />
                        <div class="p-6">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-lg font-bold text-[#2d3642]">{{ course.title }}</h3>
                                <span :class="[
                                    'px-2 py-1 rounded-full text-xs font-medium',
                                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                                        course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                ]">
                                    {{ course.level }}
                                </span>
                            </div>
                            <p class="text-gray-600 text-sm mb-4">{{ course.description }}</p>
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center text-sm text-gray-600">
                                    <Clock class="w-4 h-4 mr-1" />
                                    <span>{{ course.duration }}</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-600">
                                    <Users class="w-4 h-4 mr-1" />
                                    <span>{{ course.enrollments }}+ enrolled</span>
                                </div>
                            </div>
                            <button @click="startCourse(course.id)"
                                class="w-full bg-[#24a6bb] text-white py-2 px-4 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                                Start Course
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Live Workshops -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Upcoming Live Workshops</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="workshop in workshops" :key="workshop.id"
                        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-lg font-bold text-[#2d3642] mb-2">{{ workshop.title }}</h3>
                                <p class="text-gray-600 text-sm">{{ workshop.description }}</p>
                            </div>
                            <span class="bg-[#e6f4f7] text-[#24a6bb] px-3 py-1 rounded-full text-sm font-medium">
                                {{ workshop.category }}
                            </span>
                        </div>
                        <div class="flex items-center space-x-6 mb-4">
                            <div class="flex items-center text-sm text-gray-600">
                                <Calendar class="w-4 h-4 mr-2" />
                                <span>{{ workshop.date }}</span>
                            </div>
                            <div class="flex items-center text-sm text-gray-600">
                                <Clock class="w-4 h-4 mr-2" />
                                <span>{{ workshop.time }}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex -space-x-2">
                                <img v-for="speaker in workshop.speakers" :key="speaker.id" :src="speaker.avatar"
                                    :alt="speaker.name" class="w-8 h-8 rounded-full border-2 border-white"
                                    :title="speaker.name" />
                            </div>
                            <button @click="registerWorkshop(workshop.id)"
                                class="bg-[#24a6bb] text-white px-4 py-2 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                                Register Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Success Stories -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">Success Stories</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="story in successStories" :key="story.id" class="bg-gray-50 rounded-lg p-6">
                        <div class="flex items-center mb-4">
                            <img :src="story.avatar" :alt="story.name" class="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <h3 class="font-semibold text-[#2d3642]">{{ story.name }}</h3>
                                <p class="text-gray-600 text-sm">{{ story.business }}</p>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-4">{{ story.quote }}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center text-sm text-gray-600">
                                <TrendingUp class="w-4 h-4 mr-2 text-[#24a6bb]" />
                                <span>{{ story.achievement }}</span>
                            </div>
                            <button @click="readStory(story.id)"
                                class="text-[#24a6bb] hover:underline text-sm flex items-center">
                                Read More
                                <ArrowRight class="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    GraduationCap,
    ArrowRight,
    Clock,
    BookOpen,
    Award,
    Users,
    Calendar,
    TrendingUp,
    Store,
    // ShoppingBag,
    Target,
    // TrendingDown,
    // ChartBar,
    // Box
} from 'lucide-vue-next';
import image from '../../../assets/images/Kyrian.png';

const learningPaths = [
    {
        id: 1,
        title: 'Getting Started',
        description: 'Essential knowledge for new sellers',
        icon: Store,
        duration: '10 hours',
        coursesCount: 5,
        certificationType: 'Beginner Certificate',
        progress: 65
    },
    {
        id: 2,
        title: 'Business Growth',
        description: 'Scale your online business',
        icon: TrendingUp,
        duration: '15 hours',
        coursesCount: 8,
        certificationType: 'Advanced Certificate',
        progress: 30
    },
    {
        id: 3,
        title: 'Marketing Master',
        description: 'Advanced marketing strategies',
        icon: Target,
        duration: '12 hours',
        coursesCount: 6,
        certificationType: 'Expert Certificate',
        progress: 0
    }
];

const featuredCourses = [
    {
        id: 1,
        title: 'Product Photography Essentials',
        description: 'Learn to take professional product photos',
        thumbnail: image,
        level: 'Beginner',
        duration: '2.5 hours',
        enrollments: 1250
    },
    {
        id: 2,
        title: 'Pricing Strategies',
        description: 'Optimize your pricing for maximum profit',
        thumbnail: image,
        level: 'Intermediate',
        duration: '3 hours',
        enrollments: 980
    },
    {
        id: 3,
        title: 'Inventory Management',
        description: 'Master inventory and stock control',
        thumbnail: image,
        level: 'Advanced',
        duration: '4 hours',
        enrollments: 750
    }
];

const workshops = [
    {
        id: 1,
        title: 'Mastering Customer Service',
        description: 'Learn how to provide exceptional customer service and handle difficult situations',
        category: 'Customer Support',
        date: 'March 15, 2025',
        time: '2:00 PM WAT',
        speakers: [
            { id: 1, name: 'John Doe', avatar: image },
            { id: 2, name: 'Jane Smith', avatar: image }
        ]
    },
    {
        id: 2,
        title: 'Q1 2025 E-commerce Trends',
        description: 'Stay ahead of the curve with latest e-commerce trends and strategies',
        category: 'Market Insights',
        date: 'March 20, 2025',
        time: '3:00 PM WAT',
        speakers: [
            { id: 3, name: 'Mike Johnson', avatar: image },
            { id: 4, name: 'Sarah Wilson', avatar: image }
        ]
    }
];

const successStories = [
    {
        id: 1,
        name: 'Amina Ibrahim',
        business: 'Fashion Haven',
        avatar: image,
        quote: 'The Academy helped me transform my small fashion business into a thriving online store. Sales increased by 300% in just 6 months!',
        achievement: '300% growth in 6 months'
    },
    {
        id: 2,
        name: 'Chidi Okonkwo',
        business: 'Tech Gadgets Plus',
        avatar: image,
        quote: 'The marketing strategies I learned here completely changed my approach to selling. My customer base has grown exponentially.',
        achievement: '5000+ new customers'
    },
    {
        id: 3,
        name: 'Folake Adebayo',
        business: 'Beauty Essentials',
        avatar: image,
        quote: 'From a beginner to a power seller - the Academy guided me every step of the way. Now I\'m mentoring others!',
        achievement: 'Top 100 Seller'
    }
];

// Navigation Functions
const startLearning = () => {
    // Implement navigation to first course or learning path
};

const showCertifications = () => {
    // Implement navigation to certifications page
};

const viewAllPaths = () => {
    // Implement navigation to all learning paths
};

const continuePath = (pathId) => {
    // Implement continue learning for specific path
    console.log('Continuing path:', pathId);
};

const startCourse = (courseId) => {
    // Implement course start functionality
    console.log('Starting course:', courseId);
};

const registerWorkshop = (workshopId) => {
    // Implement workshop registration
    console.log('Registering for workshop:', workshopId);
};

const readStory = (storyId) => {
    // Implement navigation to full success story
    console.log('Reading story:', storyId);
};
</script>
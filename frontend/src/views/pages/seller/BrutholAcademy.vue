<!-- frontend/src/views/pages/seller/BrutholAcademy.vue -->
<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Hero Section -->
        <section class="bg-[#24a6bb] text-white py-12">
            <div class="container mx-auto px-4">
                <div class="flex flex-col md:flex-row items-center justify-between">
                    <div class="md:w-1/2 mb-8 md:mb-0">
                        <h1 class="text-4xl font-bold mb-4">{{ t('brutholAcademyPage.heroTitle') }}</h1>
                        <p class="text-xl opacity-90 mb-6">{{ t('brutholAcademyPage.heroSubtitle') }}</p>
                        <div class="flex flex-wrap gap-4">
                            <button @click="startLearning"
                                class="bg-white text-[#24a6bb] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                {{ t('brutholAcademyPage.startLearning') }}
                            </button>
                            <button @click="showCertifications"
                                class="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                {{ t('brutholAcademyPage.viewCertifications') }}
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
                    <h2 class="text-2xl font-bold text-[#2d3642]">{{ t('brutholAcademyPage.learningPathsTitle') }}</h2>
                    <button @click="viewAllPaths" class="text-[#24a6bb] hover:underline flex items-center">
                        {{ t('brutholAcademyPage.viewAll') }}
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
                                    <span>{{ t('brutholAcademyPage.coursesCount', { count: path.coursesCount }) }}</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-600">
                                    <Award class="w-4 h-4 mr-2" />
                                    <span>{{ path.certificationType }}</span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-gray-600">{{ t('brutholAcademyPage.progress') }}</span>
                                    <span class="text-[#24a6bb] font-medium">{{ path.progress }}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-[#24a6bb] h-2 rounded-full" :style="{ width: path.progress + '%' }">
                                    </div>
                                </div>
                            </div>
                            <button @click="continuePath(path.id)"
                                class="w-full mt-6 bg-[#24a6bb] text-white py-2 px-4 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                                {{ t('brutholAcademyPage.continueLearning') }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Courses -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('brutholAcademyPage.featuredCoursesTitle') }}</h2>
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
                                    <span>{{ t('brutholAcademyPage.enrolledCount', { count: course.enrollments }) }}</span>
                                </div>
                            </div>
                            <button @click="startCourse(course.id)"
                                class="w-full bg-[#24a6bb] text-white py-2 px-4 rounded-lg hover:bg-[#1a7f8f] transition-colors">
                                {{ t('brutholAcademyPage.startCourse') }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Live Workshops -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('brutholAcademyPage.liveWorkshopsTitle') }}</h2>
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
                                {{ t('brutholAcademyPage.registerNow') }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Success Stories -->
            <section class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-[#2d3642] mb-6">{{ t('brutholAcademyPage.successStoriesTitle') }}</h2>
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
                                {{ t('brutholAcademyPage.readMore') }}
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
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();

const learningPaths = [
    {
        id: 1,
        title: t('brutholAcademyPage.learningPaths.path1.title'),
        description: t('brutholAcademyPage.learningPaths.path1.description'),
        icon: Store,
        duration: t('brutholAcademyPage.learningPaths.path1.duration'),
        coursesCount: 5,
        certificationType: t('brutholAcademyPage.learningPaths.path1.certificationType'),
        progress: 65
    },
    {
        id: 2,
        title: t('brutholAcademyPage.learningPaths.path2.title'),
        description: t('brutholAcademyPage.learningPaths.path2.description'),
        icon: TrendingUp,
        duration: t('brutholAcademyPage.learningPaths.path2.duration'),
        coursesCount: 8,
        certificationType: t('brutholAcademyPage.learningPaths.path2.certificationType'),
        progress: 30
    },
    {
        id: 3,
        title: t('brutholAcademyPage.learningPaths.path3.title'),
        description: t('brutholAcademyPage.learningPaths.path3.description'),
        icon: Target,
        duration: t('brutholAcademyPage.learningPaths.path3.duration'),
        coursesCount: 6,
        certificationType: t('brutholAcademyPage.learningPaths.path3.certificationType'),
        progress: 0
    }
];

const featuredCourses = [
    {
        id: 1,
        title: t('brutholAcademyPage.featuredCourses.course1.title'),
        description: t('brutholAcademyPage.featuredCourses.course1.description'),
        thumbnail: image,
        level: t('brutholAcademyPage.levels.beginner'),
        duration: t('brutholAcademyPage.featuredCourses.course1.duration'),
        enrollments: 1250
    },
    {
        id: 2,
        title: t('brutholAcademyPage.featuredCourses.course2.title'),
        description: t('brutholAcademyPage.featuredCourses.course2.description'),
        thumbnail: image,
        level: t('brutholAcademyPage.levels.intermediate'),
        duration: t('brutholAcademyPage.featuredCourses.course2.duration'),
        enrollments: 980
    },
    {
        id: 3,
        title: t('brutholAcademyPage.featuredCourses.course3.title'),
        description: t('brutholAcademyPage.featuredCourses.course3.description'),
        thumbnail: image,
        level: t('brutholAcademyPage.levels.advanced'),
        duration: t('brutholAcademyPage.featuredCourses.course3.duration'),
        enrollments: 750
    }
];

const workshops = [
    {
        id: 1,
        title: t('brutholAcademyPage.workshops.workshop1.title'),
        description: t('brutholAcademyPage.workshops.workshop1.description'),
        category: t('brutholAcademyPage.workshops.workshop1.category'),
        date: t('brutholAcademyPage.workshops.workshop1.date'),
        time: '2:00 PM WAT',
        speakers: [
            { id: 1, name: 'John Doe', avatar: image },
            { id: 2, name: 'Jane Smith', avatar: image }
        ]
    },
    {
        id: 2,
        title: t('brutholAcademyPage.workshops.workshop2.title'),
        description: t('brutholAcademyPage.workshops.workshop2.description'),
        category: t('brutholAcademyPage.workshops.workshop2.category'),
        date: t('brutholAcademyPage.workshops.workshop2.date'),
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
        business: t('brutholAcademyPage.successStories.story1.business'),
        avatar: image,
        quote: t('brutholAcademyPage.successStories.story1.quote'),
        achievement: t('brutholAcademyPage.successStories.story1.achievement')
    },
    {
        id: 2,
        name: 'Chidi Okonkwo',
        business: t('brutholAcademyPage.successStories.story2.business'),
        avatar: image,
        quote: t('brutholAcademyPage.successStories.story2.quote'),
        achievement: t('brutholAcademyPage.successStories.story2.achievement')
    },
    {
        id: 3,
        name: 'Folake Adebayo',
        business: t('brutholAcademyPage.successStories.story3.business'),
        avatar: image,
        quote: t('brutholAcademyPage.successStories.story3.quote'),
        achievement: t('brutholAcademyPage.successStories.story3.achievement')
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

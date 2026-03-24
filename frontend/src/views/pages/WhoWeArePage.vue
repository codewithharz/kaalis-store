<template>
    <div class="who-we-are-page">
        <header class=" bg-[#24a6bb] text-white py-4 px-40 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Bruthol</h1>
            <nav class="space-x-4">
                <a @click.prevent="scrollToSection('who-are-we')" href="#who-are-we"
                    class="hover:underline text-gray-50 hover:text-gray-50">{{ t('whoWeArePage.navWho') }}</a>
                <a @click.prevent="scrollToSection('what-we-do')" href="#what-we-do"
                    class="hover:underline text-gray-50 hover:text-gray-50">{{ t('whoWeArePage.navWhat') }}</a>
                <a @click.prevent="scrollToSection('career-opportunities')" href="#career-opportunities"
                    class="hover:underline text-gray-50 hover:text-gray-50">{{ t('whoWeArePage.navCareer') }}</a>
                <a @click.prevent="scrollToSection('contact-us')" href="#contact-us"
                    class="hover:underline text-gray-50 hover:text-gray-50">{{ t('whoWeArePage.navContact') }}</a>
            </nav>
        </header>

        <section class="h-auto">
            <img src="../../assets/images/workers.jpg" :alt="t('whoWeArePage.teamAlt')" class=" object-cover w-full md:h-[23rem]" />
        </section>

        <div class="who-we-are-page max-w-5xl mx-auto px-4 py-8">
            <section id="who-are-we">
                <h1 class="text-4xl font-bold text-[#2d3642] mb-8">{{ t('whoWeArePage.navWho') }}</h1>

                <div class="fields-of-activity mb-12">
                    <h2 class="inline-block bg-[#24a6bb] text-white font-bold px-4 py-2 mb-6">{{ t('whoWeArePage.fieldsTitle') }}</h2>
                    <div class="space-y-8">
                        <ActivityItem icon="ShoppingBag"
                            :description="t('whoWeArePage.activity1')" />
                        <ActivityItem icon="TrendingUp"
                            :description="t('whoWeArePage.activity2')" />
                        <ActivityItem icon="Dna"
                            :description="t('whoWeArePage.activity3')" />
                        <ActivityItem icon="Globe"
                            :description="t('whoWeArePage.activity4')" />
                    </div>
                    <p class="mt-8 text-lg">{{ t('whoWeArePage.fieldsClosing') }}</p>
                </div>
            </section>

            <section class="mb-12">
                <h2 class="inline-block bg-[#24a6bb] text-white font-bold px-4 py-2 mb-6">{{ t('whoWeArePage.visionTitle') }}</h2>
                <ol class="space-y-4">
                    <li class="text-2xl text-gray-400"><span class="text-[#24a6bb] font-bold">#1</span> {{ t('whoWeArePage.vision1') }}</li>
                    <li class="text-2xl text-gray-400"><span class="text-[#24a6bb] font-bold">#2</span> {{ t('whoWeArePage.vision2') }}</li>
                    <li class="text-2xl text-gray-400"><span class="text-[#24a6bb] font-bold">#3</span> {{ t('whoWeArePage.vision3') }}</li>
                </ol>
            </section>

            <section class="pt-16" id="what-we-do">
                <div class="mb-12">
                    <h2 class="text-4xl font-bold text-[#2d3642] mb-8">{{ t('whoWeArePage.navWhat') }}</h2>
                    <h3 class="inline-block bg-[#24a6bb] text-white font-bold px-4 py-2 mb-6">{{ t('whoWeArePage.forCustomers') }}</h3>
                    <div class="flex flex-col md:flex-row items-start gap-8 mb-8">
                        <img src="../../assets/images/Kyrian.png" :alt="t('whoWeArePage.collectionAlt')"
                            class="w-full h-[9rem] md:h-[24rem] md:w-1/2 object-cover rounded-lg" />
                        <div>
                            <h4 class="text-2xl font-bold mb-2">{{ t('whoWeArePage.collectionTitle') }}</h4>
                            <p class="text-xl text-[#24a6bb] font-semibold mb-4">{{ t('whoWeArePage.collectionSubtitle') }}</p>
                            <p class="mb-4">{{ t('whoWeArePage.collectionBody') }}</p>
                            <p class="font-bold">{{ t('whoWeArePage.collectionFollow') }}</p>
                        </div>
                    </div>
                    <h4 class="text-2xl font-bold mb-4">{{ t('whoWeArePage.multiBrandTitle') }}</h4>
                    <h5 class="text-xl font-bold mb-2">{{ t('whoWeArePage.multiBrandSubtitle') }}</h5>
                    <p class="mb-4">{{ t('whoWeArePage.multiBrandBody') }}</p>
                </div>
            </section>

            <section class="pt-16" id="career-opportunities">
                <h2 class="text-4xl font-bold text-[#2d3642] mb-8">{{ t('whoWeArePage.navCareer') }}</h2>

                <div class="mb-8 relative rounded-lg overflow-hidden">
                    <img src="../../assets/images/Kyrian.png" :alt="t('whoWeArePage.campusAlt')"
                        class="w-full h-[9rem] md:h-56 object-cover" />
                    <div class="absolute bottom-4 left-4">
                        <p class="text-white text-2xl font-bold">{{ t('whoWeArePage.campusTitle') }}</p>
                        <p class="text-white text-xl">{{ t('whoWeArePage.campusSubtitle') }}</p>
                    </div>
                </div>

                <div class="text-center mb-10">
                    <button
                        class="bg-[#ff6000] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#ff7f00] transition duration-300">{{ t('whoWeArePage.joinUs') }}</button>
                </div>

                <h2 class="text-4xl font-bold text-[#2d3642] mb-8 text-center">{{ t('whoWeArePage.milestonesTitle') }}</h2>

                <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                    <div v-for="(milestone, index) in companyMilestones" :key="index"
                        class="bg-gray-100 p-4 rounded-lg text-center">
                        <h3 class="text-4xl font-[500] py-8">{{ milestone.year }}</h3>
                        <p class="text-sm bg-white rounded-md p-1 h-24 flex items-center justify-center">{{
                            milestone.description }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-100 p-6 rounded-lg">
                        <h3 class="text-xl font-bold mb-2">{{ t('whoWeArePage.whyWorkTitle') }}</h3>
                        <ul class="list-disc list-inside space-y-2 marker-red">
                            <li>{{ t('whoWeArePage.work1') }}</li>
                            <li>{{ t('whoWeArePage.work2') }}</li>
                            <li>{{ t('whoWeArePage.work3') }}</li>
                            <li>{{ t('whoWeArePage.work4') }}</li>
                            <li>{{ t('whoWeArePage.work5') }}</li>
                            <li>{{ t('whoWeArePage.work6') }}</li>
                            <li>{{ t('whoWeArePage.work7') }}</li>
                            <li>{{ t('whoWeArePage.work8') }}</li>
                            <li>{{ t('whoWeArePage.work9') }}</li>
                            <li>{{ t('whoWeArePage.work10') }}</li>
                            <li>{{ t('whoWeArePage.work11') }}</li>
                            <li>{{ t('whoWeArePage.work12') }}</li>
                        </ul>
                    </div>
                    <CompanyValues />
                </div>
            </section>

            <!-- New Sustainable Impact Plan section -->
            <div class="my-3">
                <button class="w-full p-4 text-left flex justify-between items-center bg-[#F3F3F3] "
                    @click="toggleSection('world')">
                    <span class="text-2xl font-bold flex items-center">
                        <span
                            class="bg-[#bda47f] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">1</span>
                        {{ t('whoWeArePage.worldTitle') }}
                    </span>
                    <span>{{ worldExpanded ? '−' : '+' }}</span>
                </button>
                <div v-if="worldExpanded"
                    class="py-4 px-20 bg-white rounded-b-lg bg-[#F3F3F3] shadow-xm border-t border-[#bda47f]">
                    <p class="mb-4">{{ t('whoWeArePage.worldIntro') }}</p>
                    <h3 class="text-xl font-bold mb-2">{{ t('whoWeArePage.world1Title') }}</h3>
                    <p class="mb-4">{{ t('whoWeArePage.world1Body') }}</p>
                    <h3 class="text-xl font-bold mb-2">{{ t('whoWeArePage.world2Title') }}</h3>
                    <p class="mb-4">{{ t('whoWeArePage.world2Body') }}</p>
                    <h3 class="text-xl font-bold mb-2">{{ t('whoWeArePage.world3Title') }}</h3>
                    <p>{{ t('whoWeArePage.world3Body') }}</p>
                </div>
            </div>

            <div class="mb-9">
                <button class="w-full p-4 text-left flex justify-between items-center bg-[#dff0f9]"
                    @click="toggleSection('human')">
                    <span class="text-2xl font-bold flex items-center">
                        <span
                            class="bg-[#19465F] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">2</span>
                        {{ t('whoWeArePage.humanTitle') }}
                    </span>
                    <span>{{ humanExpanded ? '−' : '+' }}</span>
                </button>
                <div v-if="humanExpanded"
                    class="py-4 px-20 bg-[#dff0f9] rounded-b-lg shadow-xm border-t border-[#19465F]">
                    <p class="mb-4">{{ t('whoWeArePage.humanIntro') }}</p>
                    <h3 class="text-xl font-bold mb-2">{{ t('whoWeArePage.human1Title') }}</h3>
                    <p class="mb-4">{{ t('whoWeArePage.human1Body') }}</p>
                    <h3 class="text-xl font-bold mb-2">{{ t('whoWeArePage.human2Title') }}</h3>
                    <p class="mb-4">{{ t('whoWeArePage.human2Body') }}</p>
                    <h3 class="text-xl font-bold mb-2">{{ t('whoWeArePage.human3Title') }}</h3>
                    <p class="mb-4">{{ t('whoWeArePage.human3Body') }}</p>
                    <h3 class="text-xl font-bold mb-2">{{ t('whoWeArePage.human4Title') }}</h3>
                    <p class="mb-4">{{ t('whoWeArePage.human4Body') }}</p>
                </div>
            </div>

            <section class="services mb-12">
                <h2 class="text-3xl font-bold text-[#2d3642] my-14">{{ t('whoWeArePage.servicesTitle') }}</h2>
                <div class="border border-[#24a6bb] rounded-lg p-6 space-y-8">
                    <ServiceItem icon="ShoppingBag" :title="t('whoWeArePage.service1Title')"
                        :subtitle="t('whoWeArePage.service1Subtitle')"
                        :description="t('whoWeArePage.service1Body')" />
                    <ServiceItem icon="ShirtIcon" :title="t('whoWeArePage.service2Title')" :subtitle="t('whoWeArePage.service2Subtitle')"
                        :description="t('whoWeArePage.service2Body')" />
                    <ServiceItem icon="Truck" :title="t('whoWeArePage.service3Title')" :subtitle="t('whoWeArePage.service3Subtitle')"
                        :description="t('whoWeArePage.service3Body')" />
                    <ServiceItem icon="Package" :title="t('whoWeArePage.service4Title')" :subtitle="t('whoWeArePage.service4Subtitle')"
                        :description="t('whoWeArePage.service4Body')" />
                    <p class="text-right text-sm text-gray-500">{{ t('whoWeArePage.servicesFootnote') }}</p>
                </div>
            </section>

            <!-- New Contact Us section -->
            <section class="pt-16" id="contact-us">
                <div className="mt-8 text-center">
                    <h2 className="text-4xl font-bold my-8">{{ t('whoWeArePage.navContact') }}</h2>
                    <div className="flex items-center justify-center mb-9">
                        <div className=" w-[70%] grid grid-cols-1 md:grid-cols-2 gap-20">
                            <div className=" text-center border rounded-lg p-4">
                                <h3 className="text-xl font-bold mb-2">{{ t('whoWeArePage.customer') }}</h3>
                                <h3 className="text-xl font-medium mb-2">{{ t('whoWeArePage.support') }}</h3>
                                <button className="w-full bg-[#24a6bb] text-white p-2 rounded mb-2">{{ t('whoWeArePage.liveChatEn') }}</button>
                                <button className="w-full border border-[#24a6bb] text-[#24a6bb] p-2 rounded">{{ t('whoWeArePage.liveChatFr') }}</button>
                            </div>
                            <div className="text-center border rounded-lg p-4">
                                <h3 className="text-xl font-medium mb-2">{{ t('whoWeArePage.seller') }}</h3>
                                <h3 className="text-xl font-bold mb-2">{{ t('whoWeArePage.support') }}</h3>
                                <button className="w-full bg-[#24a6bb] text-white p-2 rounded mb-2">{{ t('whoWeArePage.applicationFr') }}</button>
                                <button
                                    className="w-full border border-[#24a6bb] text-[#24a6bb] p-2 rounded">{{ t('whoWeArePage.applicationEn') }}</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <div className="border rounded-lg p-4 mb-4 hover:border-[#24a6bb] ">
                                <h3 className="text-xl font-bold mb-2">{{ t('whoWeArePage.officeBerlin') }}</h3>
                                <p>TOG Kontorhaus, Kronenstraße 63, 10117</p>
                                <p>Berlin</p>
                            </div>
                            <div className="border rounded-lg p-4 mb-4 hover:border-[#24a6bb]">
                                <h3 className="text-xl font-bold mb-2">{{ t('whoWeArePage.officeAnkara') }}</h3>
                                <p>Mustafa Kemal District 2118 Street Maidan A</p>
                                <p>Block 6th floor Çankaya</p>
                            </div>
                        </div>
                        <div>
                            <div className="border rounded-lg p-4 mb-4 hover:border-[#24a6bb]">
                                <h3 className="text-xl font-bold mb-2">{{ t('whoWeArePage.officeMaslak') }}</h3>
                                <p>Maslak, Bruthol Campus Büyükdere St.</p>
                                <p>No:243 Spine Tower, 34485 Sarıyer/Istanbul</p>
                            </div>
                            <div className="border rounded-lg p-4 mb-4 hover:border-[#24a6bb]">
                                <h3 className="text-xl font-bold mb-2">{{ t('whoWeArePage.officeErguvan') }}</h3>
                                <p>Maslak, Bruthol Campus Büyükdere St.</p>
                                <p>Akse District 553. St. No: 11 Çayırova/Kocaeli</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <img src="../../assets/images/map.jpg" :alt="t('whoWeArePage.mapAlt')"
                            className="w-full h-40 object-cover rounded" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import ActivityItem from './components/whoWeAre/ActivityItem.vue'
import ServiceItem from './components/whoWeAre/ServiceItem.vue'
import CompanyValues from './components/whoWeAre/CompanyValues.vue'

export default {
    name: 'WhoWeArePage',
    setup() {
        const { t } = useI18n()
        return { t }
    },
    components: {
        ActivityItem,
        ServiceItem,
        CompanyValues
    },

    data() {
        return {
            worldExpanded: false,
            humanExpanded: false,
        }
    },

    computed: {
        companyMilestones() {
            return [
                { year: 2010, description: this.t('whoWeArePage.milestone1') },
                { year: 2015, description: this.t('whoWeArePage.milestone2') },
                { year: 2018, description: this.t('whoWeArePage.milestone3') },
                { year: 2020, description: this.t('whoWeArePage.milestone4') },
                { year: 2023, description: this.t('whoWeArePage.milestone5') }
            ]
        },
    },

    methods: {
        toggleSection(section) {
            if (section === 'world') {
                this.worldExpanded = !this.worldExpanded;
                this.humanExpanded = false;
            } else if (section === 'human') {
                this.humanExpanded = !this.humanExpanded;
                this.worldExpanded = false;
            }
        },

        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId)
            if (element) {
                const headerOffset = 80 // Adjust this value based on your header height
                const elementPosition = element.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                })
            }
        },
    }
}
</script>


<style scoped>
.marker-red li::marker {
    color: #24a6bb;
    /* Tailwind's red-500 */
}

html {
    scroll-behavior: smooth;
}

.marker-red li::marker {
    color: #24a6bb;
}
</style>

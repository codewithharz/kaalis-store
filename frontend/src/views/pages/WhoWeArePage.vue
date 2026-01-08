<template>
    <div class="who-we-are-page">
        <header class=" bg-[#24a6bb] text-white py-4 px-40 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Bruthol</h1>
            <nav class="space-x-4">
                <a @click.prevent="scrollToSection('who-are-we')" href="#who-are-we"
                    class="hover:underline text-gray-50 hover:text-gray-50">Who Are We?</a>
                <a @click.prevent="scrollToSection('what-we-do')" href="#what-we-do"
                    class="hover:underline text-gray-50 hover:text-gray-50">What We Do</a>
                <a @click.prevent="scrollToSection('career-opportunities')" href="#career-opportunities"
                    class="hover:underline text-gray-50 hover:text-gray-50">Career Opportunities</a>
                <a @click.prevent="scrollToSection('contact-us')" href="#contact-us"
                    class="hover:underline text-gray-50 hover:text-gray-50">Contact Us</a>
            </nav>
        </header>

        <section class="h-auto">
            <img src="../../assets/images/workers.jpg" alt="Bruthol Team" class=" object-cover w-full md:h-[23rem]" />
        </section>

        <div class="who-we-are-page max-w-5xl mx-auto px-4 py-8">
            <section id="who-are-we">
                <h1 class="text-4xl font-bold text-[#2d3642] mb-8">Who Are We?</h1>

                <div class="fields-of-activity mb-12">
                    <h2 class="inline-block bg-[#24a6bb] text-white font-bold px-4 py-2 mb-6">Fields of Activity</h2>
                    <div class="space-y-8">
                        <ActivityItem icon="ShoppingBag"
                            description="Since 2010, our mission has been to make a positive impact by providing <strong>a seamless e-commerce experience to</strong> customers and vendors." />
                        <ActivityItem icon="TrendingUp"
                            description="The trust of our more than 30 million customers and 250 thousand business partners has made us <strong>the first decacorn in Nigeria</strong> and one of the best e-commerce platforms in the world." />
                        <ActivityItem icon="Dna"
                            description="Contributing to society is in our DNA. We implement this by supporting the digitalization of our vendors, empowering local manufacturers and advocating for women's participation in the digital economy and production." />
                        <ActivityItem icon="Globe"
                            description="With Bruthol Tech, we have the leading R&D center in our ecosystem. We operate one of the fastest growing logistics networks with Bruthol Express. Bruthol Go, our fast food and grocery service, takes us beyond fashion in Nigeria. Dolap is one of the largest used product platforms that enables us to contribute to the circular economy and sustainability." />
                    </div>
                    <p class="mt-8 text-lg">We have long-term goals in the areas we operate. We want to see you with us
                        on
                        this journey.</p>
                </div>
            </section>

            <section class="mb-12">
                <h2 class="inline-block bg-[#24a6bb] text-white font-bold px-4 py-2 mb-6">Our Vision</h2>
                <ol class="space-y-4">
                    <li class="text-2xl text-gray-400"><span class="text-[#24a6bb] font-bold">#1</span> To be the most
                        preferred platform by customers</li>
                    <li class="text-2xl text-gray-400"><span class="text-[#24a6bb] font-bold">#2</span> To be the most
                        preferred platform of sellers</li>
                    <li class="text-2xl text-gray-400"><span class="text-[#24a6bb] font-bold">#3</span> To be the
                        company most preferred by teams</li>
                </ol>
            </section>

            <section class="pt-16" id="what-we-do">
                <div class="mb-12">
                    <h2 class="text-4xl font-bold text-[#2d3642] mb-8">What We Do</h2>
                    <h3 class="inline-block bg-[#24a6bb] text-white font-bold px-4 py-2 mb-6">For our customers</h3>
                    <div class="flex flex-col md:flex-row items-start gap-8 mb-8">
                        <img src="../../assets/images/Kyrian.png" alt="Bruthol Collection"
                            class="w-full h-[9rem] md:h-[24rem] md:w-1/2 object-cover rounded-lg" />
                        <div>
                            <h4 class="text-2xl font-bold mb-2">Bruthol COLLECTION</h4>
                            <p class="text-xl text-[#24a6bb] font-semibold mb-4">Trends suitable for every style and
                                budget
                            </p>
                            <p class="mb-4">Our goal is to make fashion accessible to everyone by combining trends at an
                                affordable price. With our wide range of clothing, shoes and accessories, Bruthol
                                Collection transforms the latest catwalk trends into clothes suitable for every style,
                                occasion and budget. We offer rich collections ranging from our eye-catching party
                                collection (Bruthol Party) to casual jeans (Bruthol Denim), from hijab clothing (Bruthol
                                Modest) to plus size options (Bruthol Curve). Bruthol Collection; With trendy pieces
                                designed for women, men and children, it helps everyone to highlight their own unique
                                style,
                                whether casual and comfortable or elegant.</p>
                            <p class="font-bold">Follow @bruthol for inspiration and current trends.</p>
                        </div>
                    </div>
                    <h4 class="text-2xl font-bold mb-4">Multi-Brand Online Fashion Store</h4>
                    <h5 class="text-xl font-bold mb-2">Latest trends from popular brands</h5>
                    <p class="mb-4">Our Multi-Brand Online Fashion Store in Germany and Europe brings the trending
                        products
                        of Bruthol Collection and its sub-brands, as well as the most up-to-date women's, men's and
                        children's collections of well-known brands such as NA-KD, Converse and Jack & Jones. On
                        Bruthol,
                        you can shop from your favorite brands, discover emerging brands and find the latest trends
                        interpreted by our own designers, as well as the ever-increasing number of global fashion
                        brands.
                    </p>
                </div>
            </section>

            <section class="pt-16" id="career-opportunities">
                <h2 class="text-4xl font-bold text-[#2d3642] mb-8">Career Opportunities</h2>

                <div class="mb-8 relative rounded-lg overflow-hidden">
                    <img src="../../assets/images/Kyrian.png" alt="bruthol Campus"
                        class="w-full h-[9rem] md:h-56 object-cover" />
                    <div class="absolute bottom-4 left-4">
                        <p class="text-white text-2xl font-bold">Bruthol campus</p>
                        <p class="text-white text-xl"># one dream one team</p>
                    </div>
                </div>

                <div class="text-center mb-10">
                    <button
                        class="bg-[#ff6000] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#ff7f00] transition duration-300">Join
                        Us</button>
                </div>

                <h2 class="text-4xl font-bold text-[#2d3642] mb-8 text-center">Company Milestones</h2>

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
                        <h3 class="text-xl font-bold mb-2">Why Work at Bruthol?</h3>
                        <ul class="list-disc list-inside space-y-2 marker-red">
                            <!-- <li className=" marker:text-red-400">Innovative and dynamic work environment</li> -->
                            <li>Innovative and dynamic work environment</li>
                            <li>Opportunities for professional growth</li>
                            <li>Collaborative and inclusive culture</li>
                            <li>Competitive compensation and benefits</li>
                            <li>Flexible work arrangements</li>
                            <li>Continuous learning and development programs</li>
                            <li>Diverse and multicultural team</li>
                            <li>Sustainability-focused initiatives</li>
                            <li>Mentorship and leadership opportunities</li>
                            <li>Work on exciting projects across various domains</li>
                            <li>Regular team-building and social events</li>
                            <li>Opportunity to shape the future of e-commerce</li>
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
                        World
                    </span>
                    <span>{{ worldExpanded ? '−' : '+' }}</span>
                </button>
                <div v-if="worldExpanded"
                    class="py-4 px-20 bg-white rounded-b-lg bg-[#F3F3F3] shadow-xm border-t border-[#bda47f]">
                    <p class="mb-4">We are committed to making transformations in our operations and protecting our
                        planet. We have identified three areas where we can have a significant impact:</p>
                    <h3 class="text-xl font-bold mb-2">1.1 Carbon Reduction:</h3>
                    <p class="mb-4">We aim to reduce greenhouse gas emissions in all our operations.</p>
                    <h3 class="text-xl font-bold mb-2">1.2 Packaging and Waste:</h3>
                    <p class="mb-4">We are working on a cyclical system that uses more sustainable materials and new
                        designs to minimize packaging waste.</p>
                    <h3 class="text-xl font-bold mb-2">1.3 Sustainable Production:</h3>
                    <p>As Bruthol, we aim for sustainable and traceable production through innovation and design. We
                        work in the direction of protecting universal standards and business ethics values throughout
                        the value chain.</p>
                </div>
            </div>

            <div class="mb-9">
                <button class="w-full p-4 text-left flex justify-between items-center bg-[#dff0f9]"
                    @click="toggleSection('human')">
                    <span class="text-2xl font-bold flex items-center">
                        <span
                            class="bg-[#19465F] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">2</span>
                        Human
                    </span>
                    <span>{{ humanExpanded ? '−' : '+' }}</span>
                </button>
                <div v-if="humanExpanded"
                    class="py-4 px-20 bg-[#dff0f9] rounded-b-lg shadow-xm border-t border-[#19465F]">
                    <p class="mb-4">
                        We are committed to making a positive impact in our team, business partners and the
                        communities in which we operate.
                    </p>
                    <h3 class="text-xl font-bold mb-2">2.1 Team:</h3>
                    <p class="mb-4">We support our teams, vendors, partners and customers with our commitment to
                        diversity, equity and inclusion. As a company with diversity serving a rich customer and
                        vendor base, we believe that a diverse team is crucial to developing different perspectives
                        and unique solutions to our ecosystem.</p>
                    <h3 class="text-xl font-bold mb-2">2.2 Business Partners: </h3>
                    <p class="mb-4">As part of a large business ecosystem, we care about the success of small and
                        medium-sized enterprises, women entrepreneurs and cooperatives and develop programs and
                        services to support their growth.</p>
                    <h3 class="text-xl font-bold mb-2">2.3 Society:</h3>
                    <p class="mb-4">We believe that companies have a moral responsibility to support the communities
                        within which they operate. We aim to address the challenges experienced by communities
                        through thought-out, useful and effective projects with stakeholders and society.</p>
                    <h3 class="text-xl font-bold mb-2">2.4 Governance:</h3>
                    <p class="mb-4">We establish efficient, transparent and dynamic systems to strengthen our
                        sustainability strategy. We support these systems by creating and implementing policies for
                        each of the areas we prioritize.</p>
                </div>
            </div>

            <section class="services mb-12">
                <h2 class="text-3xl font-bold text-[#2d3642] my-14">Services We Offer in Nigeria</h2>
                <div class="border border-[#24a6bb] rounded-lg p-6 space-y-8">
                    <ServiceItem icon="ShoppingBag" title="Bruthol Marketplace"
                        subtitle="Everything you are looking for is here"
                        description="We offer a wide range of categories from fashion and beauty to household goods and electronics on our platform. Customers enjoy a seamless e-commerce experience on our platform where they can find everything they're looking for. We are constantly working to add value to your experience while offering you an easy, smooth and enjoyable shopping journey." />
                    <ServiceItem icon="ShirtIcon" title="Wardrobe" subtitle="Circular and Sustainable Economy"
                        description="Do you like to discover unique pieces? We also enjoy it very much. That's why Dolap, one of the largest second-hand goods platforms in Nigeria, is one of our great passions. Users contribute sustainably to the circular economy by buying and selling second-hand goods." />
                    <ServiceItem icon="Truck" title="Bruthol GO" subtitle="Instant Delivery"
                        description="Easy, fast and reliable – our instant grocery and food delivery service Bruthol Go brings your daily needs to your doorstep in minutes. We are constantly expanding our network of drivers, restaurants and partners in our rapidly growing delivery platform." />
                    <ServiceItem icon="Package" title="Bruthol Express" subtitle="Reliable Logistics"
                        description="Bruthol Express is our delivery solution that offers a high-quality experience by combining the power of technology with expert teams." />
                    <p class="text-right text-sm text-gray-500">For now, it is only available in Nigeria.</p>
                </div>
            </section>

            <!-- New Contact Us section -->
            <section class="pt-16" id="contact-us">
                <div className="mt-8 text-center">
                    <h2 className="text-4xl font-bold my-8">Contact Us</h2>
                    <div className="flex items-center justify-center mb-9">
                        <div className=" w-[70%] grid grid-cols-1 md:grid-cols-2 gap-20">
                            <div className=" text-center border rounded-lg p-4">
                                <h3 className="text-xl font-bold mb-2">Customer</h3>
                                <h3 className="text-xl font-medium mb-2">Support</h3>
                                <button className="w-full bg-[#24a6bb] text-white p-2 rounded mb-2">Live Chat -
                                    EN</button>
                                <button className="w-full border border-[#24a6bb] text-[#24a6bb] p-2 rounded">Live Chat
                                    -
                                    EN</button>
                            </div>
                            <div className="text-center border rounded-lg p-4">
                                <h3 className="text-xl font-medium mb-2">Seller</h3>
                                <h3 className="text-xl font-bold mb-2">Support</h3>
                                <button className="w-full bg-[#24a6bb] text-white p-2 rounded mb-2">Application Form -
                                    FR</button>
                                <button
                                    className="w-full border border-[#24a6bb] text-[#24a6bb] p-2 rounded">Application
                                    Form - EN</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <div className="border rounded-lg p-4 mb-4 hover:border-[#24a6bb] ">
                                <h3 className="text-xl font-bold mb-2">Berlin Office</h3>
                                <p>TOG Kontorhaus, Kronenstraße 63, 10117</p>
                                <p>Berlin</p>
                            </div>
                            <div className="border rounded-lg p-4 mb-4 hover:border-[#24a6bb]">
                                <h3 className="text-xl font-bold mb-2">Ankara Office</h3>
                                <p>Mustafa Kemal District 2118 Street Maidan A</p>
                                <p>Block 6th floor Çankaya</p>
                            </div>
                        </div>
                        <div>
                            <div className="border rounded-lg p-4 mb-4 hover:border-[#24a6bb]">
                                <h3 className="text-xl font-bold mb-2">Maslak Campus</h3>
                                <p>Maslak, Bruthol Campus Büyükdere St.</p>
                                <p>No:243 Spine Tower, 34485 Sarıyer/Istanbul</p>
                            </div>
                            <div className="border rounded-lg p-4 mb-4 hover:border-[#24a6bb]">
                                <h3 className="text-xl font-bold mb-2">Erguvan Operation Center</h3>
                                <p>Maslak, Bruthol Campus Büyükdere St.</p>
                                <p>Akse District 553. St. No: 11 Çayırova/Kocaeli</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <img src="../../assets/images/map.jpg" alt="Map placeholder"
                            className="w-full h-40 object-cover rounded" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import ActivityItem from './components/whoWeAre/ActivityItem.vue'
import ServiceItem from './components/whoWeAre/ServiceItem.vue'
import CompanyValues from './components/whoWeAre/CompanyValues.vue'

export default {
    name: 'WhoWeArePage',
    components: {
        ActivityItem,
        ServiceItem,
        CompanyValues
    },

    data() {
        return {
            worldExpanded: false,
            humanExpanded: false,

            companyMilestones: [
                { year: 2010, description: "Bruthol founded" },
                { year: 2015, description: "Reached 10 million customers" },
                { year: 2018, description: "Expanded to 5 new countries" },
                { year: 2020, description: "Launched Bruthol Express delivery service" },
                { year: 2023, description: "Became Nigeria's first Decacorn" }
            ],
        }
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
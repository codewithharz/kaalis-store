<template>
    <footer class="bg-gray-100 flex flex-col min-h-[50vh] pt-8 md:pt-16">
        <div class="w-[90%] md:w-[80%] mx-auto px-4 flex-grow">
            <div
                class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 text-base md:text-lg">
                <!-- Bruthol Column -->
                <div class="mb-6 md:mb-0 w-fit ">
                    <router-link to="/" class="w-auto">
                        <img src="../assets/images/logo.png" alt="logo" class="h-16 pb-2 cursor-pointer">
                    </router-link>
                    <ul class="space-y-1 md:space-y-2">
                        <li>
                            <router-link to="/page/who-we-are"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Who We Are
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/career-page"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Career
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/career-sustainability"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Career Sustainability
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/Communication"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Communication
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Campaigns Column -->
                <div class="mb-6 md:mb-0">
                    <h3 class="font-semibold mb-2 md:mb-4 text-base md:text-lg">
                        <router-link to="/page/campaigns" class="text-black hover:text-[#24a6bb]">
                            Campaigns
                        </router-link>
                    </h3>
                    <ul class="space-y-1 md:space-y-2">
                        <li>
                            <router-link to="/page/campaigns"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Campaigns
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/campaigns/shopping-credit"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Shopping Credit
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/campaigns/elite-membership"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Elite Membership
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/campaigns/gift-ideas"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Gift Ideas
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Seller Column -->
                <div class="mb-6 md:mb-0">
                    <h3 class="font-medium mb-2 md:mb-4 text-base md:text-lg">
                        <button @click="navigateToBecomeSeller" class="text-black hover:text-[#24a6bb]">Seller</button>
                    </h3>
                    <ul class="space-y-1 md:space-y-2">
                        <li>
                            <button @click="navigateToBecomeSeller"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">Sell on
                                Bruthol</button>
                        </li>
                        <li>
                            <router-link to="/page/seller/basic-concepts"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Basic Concepts
                            </router-link>
                        </li>
                        <li><a href="/page/seller/bruthol-academy"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">Bruthol
                                Academy</a></li>
                    </ul>
                </div>

                <!-- Help Column -->
                <div class="mb-6 md:mb-0">
                    <h3 class="font-semibold mb-2 md:mb-4 text-base md:text-lg">
                        <router-link to="/page/help/live-help" class="text-black hover:text-[#24a6bb]">
                            Help
                        </router-link>
                    </h3>
                    <ul class="space-y-1 md:space-y-2">
                        <li>
                            <router-link to="/page/help/live-help"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Live Help / Assistant
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/help/frequently-asked-questions"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Frequently Asked Questions
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/help/how-to-return"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                How Can I Return
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/page/help/transaction-guide-help"
                                class="text-xs md:text-sm text-gray-600 hover:text-[#24a6bb]">
                                Transaction Guide
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Change Country Column -->
                <div class="mb-6 md:mb-0">
                    <h3 class="font-semibold mb-2 md:mb-4 text-base md:text-lg">Change Country</h3>
                    <div class="relative w-full md:w-48">
                        <a @click.prevent="openCountryModal" href="#"
                            class="block w-full p-1 pr-10 pl-3 bg-white border hover:border-[#24a6bb] rounded-lg text-[13px] hover:text-[#24a6bb] text-gray-600">
                            {{ selectedCountry || 'Select Country' }}
                        </a>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#24a6bb]">
                            <ChevronRight class="h-5 w-5" />
                        </div>
                    </div>

                    <!-- Social Media -->
                    <h3 class="font-semibold mt-6 md:mt-8 mb-2 md:mb-4 text-base md:text-lg">Connect with Bruthol</h3>
                    <div class="flex space-x-4">
                        <a href="#"><img src="../assets/images/footer-facebook.png.webp" alt="facebook"
                                class="h-8 md:h-10 hover:shadow-xl rounded-full hover:scale-105"></a>
                        <a href="#"><img src="../assets/images/footer-instagram.png.webp" alt="instagram"
                                class="h-8 md:h-10 hover:shadow-xl rounded-full hover:scale-105"></a>
                        <a href="#"><img src="../assets/images/footer-youtube.png.webp" alt="youtube"
                                class="h-8 md:h-10 hover:shadow-xl rounded-full hover:scale-105"></a>
                        <a href="#"><img src="../assets/images/footer-x.png.webp" alt="twitter"
                                class="h-8 md:h-10 hover:shadow-xl rounded-full hover:scale-105"></a>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between mt-8 md:mt-12 space-y-6 md:space-y-0">
                <!-- Security Certificate Section -->
                <div class="w-full md:w-1/3 mb-4 md:mb-0">
                    <h3 class="font-semibold mb-2 md:mb-4 text-base md:text-lg">Security Certificate</h3>
                    <div class="flex flex-wrap space-x-2 md:space-x-4">
                        <img :src="cacImage" alt="CAC" class="h-8 md:h-12 mb-2">
                        <img :src="sonImage" alt="SON" class="h-8 md:h-12 mb-2">
                        <img :src="isoImage" alt="ISO" class="h-8 md:h-12 mb-2">
                        <img :src="nitdaImage" alt="NITDA" class="h-8 md:h-12 mb-2">
                    </div>
                </div>

                <!-- Secure Shopping Section -->
                <div class="w-full md:w-1/3 mb-4 md:mb-0">
                    <h3 class="font-semibold mb-2 md:mb-4 text-base md:text-lg">We accept</h3>
                    <div class="flex flex-wrap space-x-2 md:space-x-4">
                        <img :src="troyImage" alt="Troy" class="h-8 md:h-12 mb-2">
                        <img :src="mastercardImage" alt="Mastercard" class="h-8 md:h-12 mb-2">
                        <img :src="visaImage" alt="Visa" class="h-8 md:h-12 mb-2">
                        <img :src="amexImage" alt="American Express" class="h-8 md:h-12 mb-2">
                        <img :src="orangeImage" alt="Orange Money" class="h-8 md:h-12 mb-2">
                    </div>
                </div>

                <!-- Mobile Applications Section -->
                <div class="w-full md:w-1/3">
                    <h3 class="font-semibold mb-2 md:mb-4 text-base md:text-lg">Download the Bruthol App Coming Soon
                    </h3>
                    <div class="flex space-x-2 md:space-x-4">
                        <a href="#"
                            class="bg-black text-[10px] md:text-xs text-white hover:bg-[#24a6bb] hover:text-white hover:shadow-xl hover:scale-105 px-3 md:px-4 py-2 md:py-[10px] rounded-full">App
                            Store</a>
                        <a href="#"
                            class="bg-black text-[10px] md:text-xs text-white hover:bg-[#24a6bb] hover:text-white hover:shadow-xl hover:scale-105 px-3 md:px-4 py-2 md:py-[10px] rounded-full">Google
                            Play</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Copyright Section -->
        <div class="w-full bg-[#262626] mt-8 md:mt-12">
            <div
                class="w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between py-3 space-y-2 md:space-y-0">
                <div>
                    <p class="text-[10px] md:text-[11px] text-white text-center md:text-left">©{{ currentYear }}
                        Bruthol Group and Sales Trade. Inc. All rights reserved.</p>
                </div>
                <div class="flex flex-wrap justify-center md:justify-end">
                    <a href="#"
                        class="text-white text-[10px] md:text-[11px] mx-2 hover:text-white hover:underline">Cookie
                        Preferences</a>
                    <a href="#"
                        class="text-white text-[10px] md:text-[11px] mx-2 hover:text-white hover:underline">Privacy
                        Policy</a>
                    <a href="#"
                        class="text-white text-[10px] md:text-[11px] mx-2 hover:text-white hover:underline">Bruthol
                        Group</a>
                    <a href="#"
                        class="text-white text-[10px] md:text-[11px] mx-2 hover:text-white hover:underline">Terms of
                        Use</a>
                </div>
            </div>
        </div>
    </footer>

    <CountrySelectionModal :is-open="isCountryModalOpen" @close="closeCountryModal"
        @country-selected="onCountrySelected" />
</template>

<script>
import { ChevronRight } from 'lucide-vue-next';
import CountrySelectionModal from './CountrySelectionModal.vue';
import { useCountryStore } from '../store/countryStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
// Import images
import sonImage from '../assets/images/son-nigeria.png';
import cacImage from '../assets/images/cac-nigeria.jpeg';
import troyImage from '../assets/images/footer-troy.png';
import isoImage from '../assets/images/iso-certiffy.jpeg';
import nitdaImage from '../assets/images/NITDA-nigeria.jpeg';
import mastercardImage from '../assets/images/footer-mastercard.png';
import visaImage from '../assets/images/footer-visa.png';
import amexImage from '../assets/images/footer-american-express.png';
import orangeImage from '../assets/images/orange-p.jpeg';

// Import social media images
import facebookImage from '../assets/images/footer-facebook.png.webp';
import instagramImage from '../assets/images/footer-instagram.png.webp';
import youtubeImage from '../assets/images/footer-youtube.png.webp';
import xImage from '../assets/images/footer-x.png.webp';


export default {
    name: 'Footer',
    components: {
        ChevronRight,
        CountrySelectionModal,
    },
    setup() {
        const router = useRouter();
        const countryStore = useCountryStore();
        const selectedCountry = computed(() => countryStore.selectedCountry);

        const navigateToBecomeSeller = () => {
            router.push({ name: 'BecomeSeller' });
        };

        return {
            selectedCountry,
            currentYear: new Date().getFullYear(),

            // Make imported images available in the template
            cacImage: new URL(cacImage, import.meta.url).href,
            sonImage: new URL(sonImage, import.meta.url).href,
            isoImage: new URL(isoImage, import.meta.url).href,
            nitdaImage: new URL(nitdaImage, import.meta.url).href,

            troyImage: new URL(troyImage, import.meta.url).href,
            mastercardImage: new URL(mastercardImage, import.meta.url).href,
            visaImage: new URL(visaImage, import.meta.url).href,
            amexImage: new URL(amexImage, import.meta.url).href,
            orangeImage: new URL(orangeImage, import.meta.url).href,
            // Social media images

            facebookImage,
            instagramImage,
            youtubeImage,
            xImage,
            navigateToBecomeSeller,
        };
    },
    data() {
        return {
            isCountryModalOpen: false
        }
    },
    methods: {
        openCountryModal() {
            this.isCountryModalOpen = true;
        },
        closeCountryModal() {
            this.isCountryModalOpen = false;
        },
        onCountrySelected(country) {
            const countryStore = useCountryStore();
            countryStore.setCountry(country);
            this.closeCountryModal();
            // You can add any additional logic here, such as updating the store or making an API call
        }
    }
}
</script>

<!-- frontend/src/views/CountrySelectionModal.vue -->
<template>
    <div v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 flex">
            <!-- Left side image -->
            <div class="w-1/2 hidden md:block">
                <img :src="fashionImage" alt="Fashion models" class="w-full h-full object-cover rounded-l-lg" />
            </div>

            <!-- Right side content -->
            <div class="w-full md:w-1/2 p-8 flex flex-col justify-between">
                <div class="text-center">
                    <div>
                        <div class="flex flex-col items-center">
                            <h2 class="text-3xl font-bold mb-0">Welcome to </h2>
                            <!-- <h2 class="text-3xl font-bold mb-2">Bruthol</h2> -->
                            <div>
                                <img src="../assets/images/logo.png" alt="logo" class=" h-14 pb-2 cursor-not-allowed">
                            </div>
                        </div>
                        <p class="text-gray-600 mb-6">Please select your country for shopping</p>
                    </div>
                    <div class="relative mb-6">
                        <select v-model="selectedCountry"
                            class="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-400">
                            <option value="" disabled selected>Please select a country</option>
                            <option v-for="country in countries" :key="country" :value="country">
                                {{ country }}
                            </option>
                        </select>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    <div class="bg-gray-100 p-4 rounded-lg mb-6">
                        <h3 class="font-bold mb-2">FREE SHIPPING & RETURNS</h3>
                        <div class="flex items-center justify-center flex-wrap gap-2">
                            <img :src="paymentImages.mastercard" alt="MasterCard" class="h-8" />
                            <img :src="paymentImages.applePay" alt="Apple Pay" class="h-8" />
                            <img :src="paymentImages.googlePay" alt="Google Pay" class="h-8" />
                            <img :src="paymentImages.paypal" alt="PayPal" class="h-8" />
                            <img :src="paymentImages.orangeMoney" alt="Orange Money" class="h-8" />
                            <img :src="paymentImages.paystack" alt="Paystack" class="h-8" />
                            <img :src="paymentImages.opay" alt="OPay" class="h-8" />
                        </div>
                    </div>
                </div>

                <div class="flex flex-col space-y-2">
                    <button @click="selectCountry"
                        class="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600">
                        SELECT
                    </button>
                    <button @click="close"
                        class="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Import images
import fashionImage from '../assets/images/Kyrian.png';
import mastercardLogo from '../assets/images/mastercard-pay.webp';
import applePay from '../assets/images/apple-pay.webp';
import googlePay from '../assets/images/google-pay.png';
import paypalLogo from '../assets/images/paypal-pay.webp';
import orangeMoney from '../assets/images/orange-p.jpeg';
import paystackLogo from '../assets/images/paystack-c.png';
import opayLogo from '../assets/images/opay-logo.jpeg';

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits(['country-selected', 'close']);

const selectedCountry = ref('');

const countries = [
    // West African Countries
    'Nigeria', 'Ghana', 'Côte d\'Ivoire', 'Senegal', 'Mali', 'Burkina Faso',
    'Guinea', 'Benin', 'Sierra Leone', 'Togo', 'Liberia', 'Mauritania',
    'Niger', 'Gambia', 'Guinea-Bissau', 'Cape Verde',

    // // Eastern Countries (Assuming Eastern Asia and some South-Eastern Asian countries)
    // 'China', 'Japan', 'South Korea', 'North Korea', 'Mongolia', 'Taiwan',
    // 'Vietnam', 'Thailand', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines',
    // 'Cambodia', 'Laos', 'Myanmar', 'Brunei', 'Timor-Leste',

    // // Adding some Middle Eastern countries as they can be considered "Eastern"
    // 'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan',
    // 'Afghanistan', 'Iran', 'Iraq', 'Saudi Arabia', 'UAE', 'Oman', 'Yemen',
    // 'Syria', 'Lebanon', 'Jordan', 'Israel', 'Palestine', 'Turkey'
]

const paymentImages = {
    mastercard: mastercardLogo,
    applePay: applePay,
    googlePay: googlePay,
    paypal: paypalLogo,
    orangeMoney: orangeMoney,
    paystack: paystackLogo,
    opay: opayLogo,
};

const selectCountry = () => {
    if (selectedCountry.value) {
        emit('country-selected', selectedCountry.value);
        close();
    }
};

const close = () => {
    emit('close');
    selectedCountry.value = ''; // Reset selection when closing
};

// This function is not needed in <script setup>, but keeping it for clarity
// const setup = () => {
//     return {
//         paymentImages,
//         // ... other returned values ...
//     };
// };
</script>
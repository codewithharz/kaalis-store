<template>
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:px-8 lg:py-8">
            <!-- Enhanced Header -->
            <div
                class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-4 sm:mb-6 lg:mb-8 hover:shadow-2xl transition-all duration-300">
                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                        <div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <div
                                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <MapPin class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Address Book</h2>
                                <p class="text-xs sm:text-sm text-gray-600 hidden sm:block">Manage your delivery
                                    addresses and contact information</p>
                                <p class="text-xs text-gray-600 sm:hidden">Manage delivery addresses</p>
                            </div>
                        </div>
                        <button @click="openForm"
                            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                            <PlusCircle class="w-4 h-4 transition-transform group-hover:rotate-90" />
                            <span class="hidden sm:inline">Add New Address</span>
                            <span class="sm:hidden">Add Address</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Enhanced Address Grid -->
            <div v-if="addresses.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <AddressCard v-for="address in addresses" :key="address.id || address._id" :address="address"
                    @edit="openForm" @delete="confirmDelete"
                    class="transform hover:scale-[1.02] transition-all duration-300" />
            </div>

            <!-- Enhanced Empty State -->
            <div v-else
                class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-12 text-center">
                <div
                    class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MapPin class="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
                </div>
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Addresses Yet</h3>
                <p class="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                    Add your first delivery address to make checkout faster and easier.
                </p>
                <button @click="openForm"
                    class="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                    <PlusCircle class="w-4 h-4 sm:w-5 sm:h-5" />
                    Add Your First Address
                </button>
            </div>
        </div>

        <!-- Enhanced Address Form Modal -->
        <div v-if="showForm"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div
                class="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6 text-white flex-shrink-0">
                    <div class="flex justify-between items-start gap-3">
                        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div
                                class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <MapPin class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="text-lg sm:text-xl font-bold">
                                    {{ form.id ? 'Edit Address' : 'Add New Address' }}
                                </h3>
                                <p class="text-indigo-100 text-xs sm:text-sm mt-1 hidden sm:block">{{ form.id ? `Update
                                    your address details` :
                                    `Enter your delivery address information` }}</p>
                            </div>
                        </div>
                        <button @click="closeForm"
                            class="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0">
                            <X class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Modal Content -->
                <div class="flex-1 overflow-y-auto">
                    <form @submit.prevent="saveAddress" class="p-3 sm:p-4 lg:p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <!-- Personal Information Section -->
                            <div class="md:col-span-2">
                                <div class="flex items-center gap-2 mb-3 sm:mb-4">
                                    <div
                                        class="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <UserRound class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                    </div>
                                    <h4 class="text-base sm:text-lg font-bold text-gray-900">Personal Information</h4>
                                </div>
                            </div>

                            <!-- First Name -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">First Name *</label>
                                <div class="relative">
                                    <UserRound
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input type="text" v-model="form.firstName" required
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium text-sm sm:text-base"
                                        placeholder="Enter first name">
                                </div>
                            </div>

                            <!-- Last Name -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">Last Name *</label>
                                <div class="relative">
                                    <UserRound
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input type="text" v-model="form.lastName" required
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium text-sm sm:text-base"
                                        placeholder="Enter last name">
                                </div>
                            </div>

                            <!-- Phone -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">Phone Number *</label>
                                <div class="relative">
                                    <Phone
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input type="tel" v-model="form.phone" required
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium text-sm sm:text-base"
                                        placeholder="Enter phone number">
                                </div>
                            </div>

                            <!-- Address Type -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">Address Type *</label>
                                <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <label
                                        class="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-colors">
                                        <input type="radio" v-model="form.place" value="home" class="sr-only peer">
                                        <div
                                            class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full peer-checked:border-indigo-500 flex items-center justify-center">
                                            <div
                                                class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500 scale-0 peer-checked:scale-100 transition-transform">
                                            </div>
                                        </div>
                                        <span class="ml-2 text-xs sm:text-sm font-medium text-gray-700">🏠 Home</span>
                                    </label>
                                    <label
                                        class="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-colors">
                                        <input type="radio" v-model="form.place" value="office" class="sr-only peer">
                                        <div
                                            class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full peer-checked:border-indigo-500 flex items-center justify-center">
                                            <div
                                                class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500 scale-0 peer-checked:scale-100 transition-transform">
                                            </div>
                                        </div>
                                        <span class="ml-2 text-xs sm:text-sm font-medium text-gray-700">🏢 Office</span>
                                    </label>
                                    <label
                                        class="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-colors">
                                        <input type="radio" v-model="form.place" value="other" class="sr-only peer">
                                        <div
                                            class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full peer-checked:border-indigo-500 flex items-center justify-center">
                                            <div
                                                class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500 scale-0 peer-checked:scale-100 transition-transform">
                                            </div>
                                        </div>
                                        <span class="ml-2 text-xs sm:text-sm font-medium text-gray-700">📍 Other</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Address Details Section -->
                            <div class="md:col-span-2 mt-4 sm:mt-6">
                                <div class="flex items-center gap-2 mb-3 sm:mb-4">
                                    <div
                                        class="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPinned class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                    </div>
                                    <h4 class="text-base sm:text-lg font-bold text-gray-900">Address Details</h4>
                                </div>
                            </div>

                            <!-- House No -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">House/Plot No. *</label>
                                <div class="relative">
                                    <Home
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input type="text" v-model="form.houseNo" required
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium text-sm sm:text-base"
                                        placeholder="Enter house/plot number">
                                </div>
                            </div>

                            <!-- Street -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">Street/Area *</label>
                                <div class="relative">
                                    <MapPinned
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input type="text" v-model="form.street" required
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium text-sm sm:text-base"
                                        placeholder="Enter street name or area">
                                </div>
                            </div>

                            <!-- City -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">City *</label>
                                <div class="relative">
                                    <Building2
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input type="text" v-model="form.city" required
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium text-sm sm:text-base"
                                        placeholder="Enter city name">
                                </div>
                            </div>

                            <!-- State -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">State *</label>
                                <div class="relative">
                                    <Map
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 z-10" />
                                    <select v-model="form.state" required
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 pr-8 sm:pr-10 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium appearance-none text-sm sm:text-base">
                                        <option value="">Select state</option>
                                        <option value="Lagos">Lagos</option>
                                        <option value="Abuja">Abuja</option>
                                        <option value="Rivers">Rivers</option>
                                        <option value="Kano">Kano</option>
                                        <option value="Oyo">Oyo</option>
                                        <option value="Delta">Delta</option>
                                    </select>
                                    <div
                                        class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Country -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">Country *</label>
                                <div class="relative">
                                    <Globe
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 z-10" />
                                    <select v-model="form.country" required
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 pr-8 sm:pr-10 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium appearance-none text-sm sm:text-base">
                                        <option value="">Select Country</option>
                                        <option value="Nigeria">🇳🇬 Nigeria</option>
                                        <option value="Ghana">🇬🇭 Ghana</option>
                                        <option value="Mali">🇲🇱 Mali</option>
                                        <option value="Senegal">🇸🇳 Senegal</option>
                                        <option value="Burkina Faso">🇧🇫 Burkina Faso</option>
                                    </select>
                                    <div
                                        class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Post/ZIP Code -->
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">Post/ZIP Code</label>
                                <div class="relative">
                                    <MapPin
                                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    <input type="text" v-model="form.post"
                                        class="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white font-medium text-sm sm:text-base"
                                        placeholder="Enter postal code (optional)">
                                </div>
                            </div>
                        </div>

                        <!-- Tips Section -->
                        <div
                            class="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                            <h5 class="text-xs sm:text-sm font-bold text-blue-800 mb-2">💡 Address Tips</h5>
                            <ul class="text-xs text-blue-700 space-y-1">
                                <li class="hidden sm:block">• Double-check your address details to ensure accurate
                                    deliveries</li>
                                <li class="hidden sm:block">• Include landmarks or additional directions in the street
                                    field if helpful</li>
                                <li>• Make sure your phone number is active for delivery coordination</li>
                                <li class="hidden sm:block">• Choose the appropriate address type for better
                                    organization</li>
                                <li class="sm:hidden">• Double-check all details for accurate delivery</li>
                            </ul>
                        </div>
                    </form>

                    <!-- Modal Footer -->
                    <div
                        class="bg-gray-50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-200">
                        <button type="button" @click="closeForm"
                            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 border-2 border-gray-300 rounded-lg sm:rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-all text-sm sm:text-base">
                            Cancel
                        </button>
                        <button @click="saveAddress" :disabled="isLoading"
                            class="w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
                            :class="{ 'animate-pulse': isLoading }">
                            <span v-if="isLoading" class="flex items-center justify-center gap-2">
                                <div
                                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                                </div>
                                {{ form.id ? 'Updating...' : 'Saving...' }}
                            </span>
                            <span v-else class="flex items-center justify-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7"></path>
                                </svg>
                                {{ form.id ? 'Update Address' : 'Save Address' }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useAddressStore } from '../store/addressStore';
import AddressCard from './AddressCard.vue';
import {
    PlusCircle, X, UserRound, Phone, MapPin, Home, MapPinned, Building2, Map, Globe, Loader2
} from 'lucide-vue-next';

export default {
    name: 'ProfileAddressBookCard',
    components: {
        AddressCard,
        PlusCircle,
        X,
        UserRound,
        Phone,
        MapPin,
        Home,
        MapPinned,
        Building2,
        Map,
        Globe,
        Loader2
    },
    setup() {
        const addressStore = useAddressStore();
        const addresses = computed(() => addressStore.addresses);
        const isLoading = ref(false);

        const form = ref({
            firstName: '',
            lastName: '',
            phone: '',
            post: '',
            houseNo: '',
            street: '',
            city: '',
            state: '',
            country: '',
            place: '',
            id: null
        });

        const showForm = ref(false);

        onMounted(() => {
            addressStore.fetchUserAddresses();
        });

        const openForm = (address = null) => {
            if (address) {
                form.value = { ...address };
                form.value.id = address._id;
            } else {
                form.value = {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    post: '',
                    houseNo: '',
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                    place: '',
                    id: null
                };
            }
            showForm.value = true;
        };

        const closeForm = () => {
            showForm.value = false;
        };

        const saveAddress = async () => {
            try {
                isLoading.value = true;

                const addressData = {
                    firstName: form.value.firstName,
                    lastName: form.value.lastName,
                    street: form.value.street,
                    city: form.value.city,
                    state: form.value.state,
                    country: form.value.country,
                    post: form.value.post,
                    houseNo: form.value.houseNo,
                    place: form.value.place,
                    phone: form.value.phone,
                };

                if (form.value.id) {
                    await addressStore.updateAddress(form.value.id, addressData);
                } else {
                    await addressStore.addAddress(addressData);
                }
                closeForm();
            } catch (error) {
                console.error('Error saving address:', error);
            } finally {
                isLoading.value = false;
            }
        };

        const confirmDelete = (address) => {
            if (confirm('Are you sure you want to delete this address?')) {
                addressStore.deleteAddress(address._id);
            }
        };

        return {
            addresses,
            form,
            showForm,
            isLoading,
            openForm,
            closeForm,
            saveAddress,
            confirmDelete
        };
    }
};
</script>

<style scoped>
/* Enhanced animations and transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile-first approach: Disable hover effects and transforms on mobile */
@media (max-width: 768px) {

    .transform,
    .hover\:scale-105:hover,
    .hover\:scale-\[1\.02\]:hover {
        transform: none !important;
        transition: none !important;
    }

    /* Better touch targets for mobile */
    button {
        min-height: 44px;
    }

    /* Prevent zoom on input focus for iOS */
    input,
    select {
        font-size: 16px;
    }

    /* Reduce motion for better mobile performance */
    * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
    }
}

/* Enhanced focus states for accessibility */
.focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Focus states for better accessibility */
button:focus,
input:focus,
select:focus {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
}

/* Custom animations */
.animate-spin {
    animation: spin 1s linear infinite;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}

/* Enhanced shadow effects - Mobile optimized */
.shadow-xl {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
    .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
}

.shadow-2xl {
    box-shadow: 0 15px 30px -6px rgba(0, 0, 0, 0.15);
}

@media (min-width: 768px) {
    .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
}

/* Gradient backgrounds */
.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Modal backdrop blur */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Custom scrollbar - Mobile optimized */
::-webkit-scrollbar {
    width: 4px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar {
        width: 8px;
    }
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar-track {
        border-radius: 4px;
    }
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #6366f1, #8b5cf6);
    border-radius: 2px;
}

@media (min-width: 768px) {
    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
    }
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #4f46e5, #7c3aed);
}

/* Form input styling - Mobile optimized */
input,
select {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Better touch interaction for mobile forms */
@media (max-width: 768px) {

    input,
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    /* Better tap highlighting */
    button,
    input,
    select,
    label {
        -webkit-tap-highlight-color: rgba(99, 102, 241, 0.1);
    }

    /* Prevent text selection on labels */
    label {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
}

/* Radio button custom styling - Mobile optimized */
input[type="radio"] {
    appearance: none;
}

/* Section dividers */
.section-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
}

/* Mobile-specific improvements */
@media (max-width: 640px) {

    /* Better spacing for small screens */
    .space-y-6>*+* {
        margin-top: 1rem;
    }

    .space-y-4>*+* {
        margin-top: 0.75rem;
    }

    /* Ensure proper container spacing */
    .max-h-\[95vh\] {
        max-height: 95vh;
    }

    /* Better mobile scrolling */
    .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
    }

    /* Prevent horizontal overflow */
    .min-w-0 {
        min-width: 0;
    }

    /* Better text wrapping */
    .break-words {
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
    }
}

/* Responsive text sizing */
@media (max-width: 640px) {
    .text-2xl {
        font-size: 1.5rem;
        line-height: 2rem;
    }

    .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }

    .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}

/* Better mobile modal positioning */
@media (max-width: 640px) {
    .fixed.inset-0 {
        padding: 0.5rem;
    }

    /* Improved form layouts for mobile */
    .grid {
        gap: 1rem;
    }

    .rounded-2xl {
        border-radius: 0.75rem;
    }

    .p-6 {
        padding: 1rem;
    }

    .p-8 {
        padding: 1.5rem;
    }

    /* Better button spacing */
    .gap-4 {
        gap: 0.75rem;
    }

    .gap-3 {
        gap: 0.5rem;
    }
}

/* Address type radio buttons - Mobile stacked layout */
@media (max-width: 640px) {
    .address-type-container {
        flex-direction: column;
    }

    .address-type-option {
        width: 100%;
        justify-content: flex-start;
    }
}

/* Better mobile touch interactions */
@media (max-width: 768px) {

    /* Larger touch targets */
    button {
        min-height: 44px;
        min-width: 44px;
    }

    /* Better focus indicators for mobile */
    button:focus,
    input:focus,
    select:focus {
        outline: 3px solid #6366f1;
        outline-offset: 2px;
    }

    /* Ensure readable font sizes */
    .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
}

/* Custom modal animations for mobile */
@media (max-width: 768px) {
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }

        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-enter {
        animation: slideUp 0.3s ease-out;
    }
}

/* Optimized scrolling behavior */
.overflow-y-auto {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

/* Mobile-specific grid improvements */
@media (max-width: 768px) {
    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .sm\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .lg\:grid-cols-3 {
        grid-template-columns: 1fr;
    }
}

/* Ensure consistent button heights on mobile */
@media (max-width: 640px) {

    .py-2\.5,
    .py-3 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
}

/* Mobile form input improvements */
@media (max-width: 640px) {
    .pl-9 {
        padding-left: 2.25rem;
    }

    .pl-11 {
        padding-left: 2.25rem;
    }

    /* Better icon positioning for mobile */
    .absolute.left-3 {
        left: 0.75rem;
    }
}

/* Print styles */
@media print {

    .shadow-xl,
    .shadow-2xl {
        box-shadow: none !important;
    }

    .bg-gradient-to-br,
    .bg-gradient-to-r {
        background: #ffffff !important;
    }

    .text-white {
        color: #000000 !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .border-gray-200 {
        border-color: #000000;
    }

    .text-gray-600 {
        color: #000000;
    }

    .bg-gray-50 {
        background-color: #ffffff;
    }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Better selection styles */
::selection {
    background-color: #6366f1;
    color: #ffffff;
}

::-moz-selection {
    background-color: #6366f1;
    color: #ffffff;
}

/* Ensure proper stacking context */
.relative {
    position: relative;
    z-index: 1;
}

/* Mobile-optimized form field spacing */
@media (max-width: 640px) {
    .space-y-2>*+* {
        margin-top: 0.5rem;
    }
}

/* Better mobile tips section */
@media (max-width: 640px) {
    .tips-section {
        margin-top: 1rem;
        padding: 0.75rem;
    }

    .tips-list {
        font-size: 0.75rem;
        line-height: 1rem;
    }
}
</style>

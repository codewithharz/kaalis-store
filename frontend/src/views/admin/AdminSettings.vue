<!-- // frontend/src/views/admin/AdminSettings.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-3 px-8 py-4 bg-white">
            <h2 class="text-2xl font-bold text-gray-800">Platform Settings</h2>
        </div>

        <!-- Settings Navigation -->
        <div class="grid grid-cols-12 gap-6">
            <!-- Settings Menu -->
            <div class="col-span-3">
                <div class="bg-white rounded-lg shadow-sm p-4">
                    <nav class="space-y-1">
                        <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" :class="[
                            'w-full flex items-center px-4 py-2 text-sm rounded-md',
                            currentTab === tab.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50'
                        ]">
                            <component :is="tab.icon" class="h-5 w-5 mr-3" />
                            {{ tab.name }}
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Settings Content -->
            <div class="col-span-9">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <!-- General Settings -->
                    <div v-if="currentTab === 'general'" class="space-y-6">
                        <h3 class="text-lg font-medium text-gray-900">General Settings</h3>

                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block pb-1 text-sm font-medium text-gray-700">Platform Name</label>
                                <input type="text" v-model="settings.platformName"
                                    class="mt-1 block w-full border rounded-md shadow-sm p-2">
                            </div>

                            <div>
                                <label class="block pb-1 text-sm font-medium text-gray-700">Support Email</label>
                                <input type="email" v-model="settings.supportEmail"
                                    class="mt-1 block w-full border rounded-md shadow-sm p-2">
                            </div>

                            <div>
                                <label class="block pb-1 text-sm font-medium text-gray-700">Currency</label>
                                <div class="relative">
                                    <select v-model="settings.currency"
                                        class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="NGN">NGN (₦)</option>
                                    </select>
                                    <div
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <ChevronDown class="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label class="block pb-1 text-sm font-medium text-gray-700">Timezone</label>
                                <div class="relative">
                                    <select v-model="settings.timezone"
                                        class="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-[#24a3b5] focus:border-transparent">
                                        <option value="UTC">UTC</option>
                                        <option value="WAT">West Africa Time</option>
                                        <option value="GMT">GMT</option>
                                    </select>
                                    <div
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <ChevronDown class="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center space-x-2">
                            <input type="checkbox" id="maintenanceMode" v-model="settings.maintenanceMode">
                            <label for="maintenanceMode" class="text-sm text-gray-700">
                                Enable Maintenance Mode
                            </label>
                        </div>
                    </div>

                    <!-- Payment Settings -->
                    <div v-if="currentTab === 'payment'" class="space-y-6">
                        <h3 class="text-lg font-medium text-gray-900">Payment Settings</h3>

                        <div class="space-y-6">
                            <!-- Paystack Configuration -->
                            <div class="border rounded-lg p-4">
                                <div class="flex items-center justify-between mb-4">
                                    <h4 class="font-medium text-gray-900">Paystack</h4>
                                    <div class="flex items-center">
                                        <input type="checkbox" id="paystackEnabled"
                                            v-model="settings.payment.paystack.enabled" class="mr-2">
                                        <label for="paystackEnabled" class="text-sm text-gray-700">
                                            Enable Paystack
                                        </label>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block pb-1 text-sm font-medium text-gray-700">
                                            Public Key
                                        </label>
                                        <input type="text" v-model="settings.payment.paystack.publicKey"
                                            :disabled="!settings.payment.paystack.enabled"
                                            class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                    </div>

                                    <div>
                                        <label class="block pb-1 text-sm font-medium text-gray-700">
                                            Secret Key
                                        </label>
                                        <input type="password" v-model="settings.payment.paystack.secretKey"
                                            :disabled="!settings.payment.paystack.enabled"
                                            class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                    </div>
                                </div>
                            </div>

                            <!-- Commission Settings -->
                            <div class="border rounded-lg p-4">
                                <h4 class="font-medium text-gray-900 mb-4">Commission Settings</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block pb-1 text-sm font-medium text-gray-700">
                                            Platform Fee (%)
                                        </label>
                                        <input type="number" v-model="settings.payment.platformFee" min="0" max="100"
                                            class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                    </div>

                                    <div>
                                        <label class="block pb-1 text-sm font-medium text-gray-700">
                                            Minimum Payout Amount
                                        </label>
                                        <input type="number" v-model="settings.payment.minimumPayout" min="0"
                                            class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Email Settings -->
                    <div v-if="currentTab === 'email'" class="space-y-6">
                        <h3 class="text-lg font-medium text-gray-900">Email Settings</h3>

                        <div class="space-y-6">
                            <!-- SMTP Configuration -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block pb-1 text-sm font-medium text-gray-700">SMTP Host</label>
                                    <input type="text" v-model="settings.email.smtp.host"
                                        class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                </div>

                                <div>
                                    <label class="block pb-1 text-sm font-medium text-gray-700">SMTP Port</label>
                                    <input type="number" v-model="settings.email.smtp.port"
                                        class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                </div>

                                <div>
                                    <label class="block pb-1 text-sm font-medium text-gray-700">Username</label>
                                    <input type="text" v-model="settings.email.smtp.username"
                                        class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                </div>

                                <div>
                                    <label class="block pb-1 text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" v-model="settings.email.smtp.password"
                                        class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                </div>
                            </div>

                            <!-- Test Email -->
                            <div class="border-t pt-4">
                                <button @click="sendTestEmail"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Send Test Email
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Settings -->
                    <div v-if="currentTab === 'shipping'" class="space-y-6">
                        <h3 class="text-lg font-medium text-gray-900">Shipping Settings</h3>

                        <div class="space-y-6">
                            <!-- Default Shipping Rules -->
                            <div class="border rounded-lg p-4">
                                <h4 class="font-medium text-gray-900 mb-4">Default Shipping Rules</h4>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block pb-1 text-sm font-medium text-gray-700">
                                            Base Shipping Cost
                                        </label>
                                        <input type="number" v-model="settings.shipping.baseCost" min="0"
                                            class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                    </div>

                                    <div>
                                        <label class="block pb-1 text-sm font-medium text-gray-700">
                                            Free Shipping Threshold
                                        </label>
                                        <input type="number" v-model="settings.shipping.freeThreshold" min="0"
                                            class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                    </div>
                                </div>
                            </div>

                            <!-- Shipping Zones -->
                            <div class="border rounded-lg p-4">
                                <div class="flex justify-between items-center">
                                    <h4 class="font-medium text-gray-900">Shipping Zones</h4>
                                    <button @click="addShippingZone" class="text-blue-600 hover:text-blue-800">
                                        Add Zone
                                    </button>
                                </div>

                                <div class="space-y-4">
                                    <div v-for="(zone, index) in settings.shipping.zones" :key="index"
                                        class="border rounded p-3">
                                        <div class="grid grid-cols-3 gap-4">
                                            <div>
                                                <label class="block pb-1 text-sm font-medium text-gray-700">
                                                    Zone Name
                                                </label>
                                                <input type="text" v-model="zone.name"
                                                    class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                            </div>

                                            <div>
                                                <label class="block pb-1 text-sm font-medium text-gray-700">
                                                    Regions
                                                </label>
                                                <input type="text" v-model="zone.regions"
                                                    class="mt-1 block w-full border rounded-md shadow-sm p-2"
                                                    placeholder="Comma-separated regions">
                                            </div>

                                            <div>
                                                <label class="block pb-1 text-sm font-medium text-gray-700">
                                                    Rate
                                                </label>
                                                <input type="number" v-model="zone.rate" min="0"
                                                    class="mt-1 block w-full border rounded-md shadow-sm p-2">
                                            </div>
                                        </div>
                                        <button @click="removeShippingZone(index)"
                                            class="text-red-600 hover:text-red-800 text-sm mt-2">
                                            Remove Zone
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="mt-6 flex justify-end">
                        <button @click="saveSettings"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import {
    Settings as SettingsIcon,
    CreditCard,
    Mail,
    Truck,
    Globe,
    ChevronDown
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

export default {
    name: 'AdminSettings',
    components: {
        SettingsIcon,
        CreditCard,
        Mail,
        Truck,
        Globe,
        ChevronDown
    },

    setup() {
        const currentTab = ref('general');
        const loading = ref(false);

        const tabs = [
            { id: 'general', name: 'General', icon: Globe },
            { id: 'payment', name: 'Payment', icon: CreditCard },
            { id: 'email', name: 'Email', icon: Mail },
            { id: 'shipping', name: 'Shipping', icon: Truck }
        ];

        const settings = ref({
            platformName: '',
            supportEmail: '',
            currency: 'USD',
            timezone: 'UTC',
            maintenanceMode: false,
            payment: {
                paystack: {
                    enabled: false,
                    publicKey: '',
                    secretKey: ''
                },
                platformFee: 5,
                minimumPayout: 100
            },
            email: {
                smtp: {
                    host: '',
                    port: 587,
                    username: '',
                    password: ''
                }
            },
            shipping: {
                baseCost: 10,
                freeThreshold: 100,
                zones: []
            }
        });

        const fetchSettings = async () => {
            loading.value = true;
            try {
                const response = await fetch('/api/admin/settings');
                const data = await response.json();
                settings.value = { ...settings.value, ...data };
            } catch (error) {
                console.error('Error fetching settings:', error);
                toast.error('Failed to fetch settings');
            } finally {
                loading.value = false;
            }
        };

        const saveSettings = async () => {
            loading.value = true;
            try {
                await fetch('/api/admin/settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(settings.value)
                });
                toast.success('Settings saved successfully');
            } catch (error) {
                console.error('Error saving settings:', error);
                toast.error('Failed to save settings');
            } finally {
                loading.value = false;
            }
        };

        const sendTestEmail = async () => {
            try {
                await fetch('/api/admin/settings/test-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(settings.value.email)
                });
                toast.success('Test email sent successfully');
            } catch (error) {
                console.error('Error sending test email:', error);
                toast.error('Failed to send test email');
            }
        };

        const addShippingZone = () => {
            settings.value.shipping.zones.push({
                name: '',
                regions: '',
                rate: 0
            });
        };

        const removeShippingZone = (index) => {
            settings.value.shipping.zones.splice(index, 1);
        };

        // Lifecycle hooks
        onMounted(() => {
            fetchSettings();
        });

        return {
            currentTab,
            tabs,
            settings,
            loading,
            saveSettings,
            sendTestEmail,
            addShippingZone,
            removeShippingZone
        };
    }
};
</script>

<style scoped>
.settings-tab {
    @apply flex items-center px-4 py-2 text-sm font-medium rounded-md;
}

.settings-tab.active {
    @apply bg-blue-50 text-blue-700;
}

.settings-tab:not(.active) {
    @apply text-gray-700 hover:bg-gray-50;
}
</style>
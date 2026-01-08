<template>
    <div
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-indigo-500 p-6 relative group">
        <!-- Type Badge -->
        <div class="absolute -top-3 left-4">
            <span :class="[
                'px-3 py-1 text-xs font-medium rounded-full capitalize flex items-center gap-1.5',
                address.place === 'home' ? 'bg-indigo-100 text-indigo-800' :
                    address.place === 'office' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
            ]">
                <span class="w-1.5 h-1.5 rounded-full" :class="[
                    address.place === 'home' ? 'bg-indigo-500' :
                        address.place === 'office' ? 'bg-emerald-500' :
                            'bg-amber-500'
                ]"></span>
                {{ address.place }}
            </span>
        </div>

        <!-- Content -->
        <div class="space-y-4 pt-2">
            <!-- Name and Contact -->
            <div>
                <h3 class="text-lg font-semibold text-gray-900">
                    {{ address.firstName }} {{ address.lastName }}
                </h3>
                <p class="text-gray-600 flex items-center gap-1.5 mt-1">
                    <Phone class="w-4 h-4 text-gray-400" />
                    {{ address.phone }}
                </p>
            </div>

            <!-- Address Details -->
            <div class="text-gray-600 space-y-1.5 text-sm">
                <p class="flex items-start gap-2">
                    <MapPin class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span>
                        {{ address.houseNo }}, {{ address.street }}<br>
                        {{ address.city }}, {{ address.state }}<br>
                        {{ address.country }}
                        <span v-if="address.post" class="block mt-1 text-gray-500">Post Code: {{ address.post }}</span>
                    </span>
                </p>
            </div>

            <!-- Action Buttons with Modern Hover Effect -->
            <div class="flex justify-end gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button @click="editAddress"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit3 class="w-4 h-4" />
                    Edit
                </button>
                <button @click="deleteAddress"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 class="w-4 h-4" />
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { Edit3, Trash2, MapPin, Phone } from 'lucide-vue-next';

export default {
    name: 'AddressCard',
    components: {
        Edit3,
        Trash2,
        MapPin,
        Phone
    },
    props: {
        address: {
            type: Object,
            required: true
        }
    },
    methods: {
        editAddress() {
            this.$emit('edit', this.address);
        },
        deleteAddress() {
            this.$emit('delete', this.address);
        }
    }
};
</script>
<!-- src/components/layouts/CommunityLayout.vue -->
<template>
    <div class="bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
            <div class="max-w-7xl mx-auto">
                <h1 class="text-3xl font-bold text-[#2d3642] mb-8">{{ title }}</h1>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <!-- Left sidebar -->
                    <div class="col-span-1">
                        <div class="bg-white rounded-lg shadow">
                            <SidebarNavigation />
                        </div>
                    </div>

                    <!-- Main content -->
                    <div class="col-span-1 md:col-span-3">
                        <div class="bg-white rounded-lg shadow p-6">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SidebarNavigation from '../community/SidebarNavigation.vue';

defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>
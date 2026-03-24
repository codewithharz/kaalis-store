<template>
    <div class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8">{{ t('legacyTermsOfUsePage.pageTitle') }}</h1>

            <div class="grid grid-cols-1 md:grid-cols-4">
                <!-- Left sidebar -->
                <div class="col-span-1 w-[90%]">
                    <SidebarNavigation />
                </div>

                <!-- Main content -->
                <div class="col-span-1 md:col-span-3    ">
                    <h2 class="text-2xl font-semibold mb-4 border px-3 py-1 rounded-md border-gray-300">{{ t('legacyTermsOfUsePage.sectionTitle') }}
                    </h2>

                    <div class="space-y-6 border px-3 py-1 rounded-md border-gray-300">
                        <p class="mb-4">{{ t('legacyTermsOfUsePage.paragraph1') }}</p>

                        <div>
                            <p>{{ t('legacyTermsOfUsePage.paragraph2') }}</p>
                        </div>

                        <div>
                            <p>{{ t('legacyTermsOfUsePage.paragraph3') }}</p>
                        </div>

                        <div>
                            <p>{{ t('legacyTermsOfUsePage.paragraph4') }}</p>
                        </div>

                        <div>
                            <p>{{ t('legacyTermsOfUsePage.paragraph5') }}</p>
                        </div>

                        <div>
                            <p>{{ t('legacyTermsOfUsePage.paragraph6') }}</p>
                        </div>

                        <div>
                            <p>{{ t('legacyTermsOfUsePage.paragraph7') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import SidebarNavigation from './pages/components/community/SidebarNavigation.vue'

export default {
    name: 'TermsOfUsePage',
    // Add any necessary component logic here

    components: {
        SidebarNavigation
    },
    setup() {
        const { t } = useI18n();
        return { t };
    }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

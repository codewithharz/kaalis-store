<template>
    <div class="bg-white p-4 rounded-b-lg shadow-sm mb-3">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <!-- Left: Period Selection Buttons & Navigation Controls -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex flex-wrap gap-2">
                    <button v-for="period in periods" :key="period.value" @click="$emit('update:modelValue', period.value)"
                        class="px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                        :class="modelValue === period.value ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
                        {{ period.label }}
                    </button>
                </div>

                <!-- Navigation Controls -->
                <div class="flex items-center space-x-1 pl-2 border-l border-gray-200">
                    <button @click="$emit('prev')" class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        :disabled="isLoading">
                        <ChevronLeft class="w-4 h-4 text-gray-600" />
                    </button>
                    <span class="text-xs font-semibold text-gray-600 px-1 whitespace-nowrap">{{ currentPeriodLabel }}</span>
                    <button @click="$emit('next')"
                        class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="isCurrentPeriod || isLoading">
                        <ChevronRight class="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            <!-- Right: Currency Filter Segmented Controls -->
            <div class="flex items-center gap-2 self-start lg:self-auto">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 hidden sm:inline">
                    {{ t('adminDashboard.currencyFilter.label') }}:
                </span>
                <div class="inline-flex rounded-lg bg-gray-100 p-1 border border-gray-200/80">
                    <button v-for="curr in currencies" :key="curr.value"
                        @click="$emit('update:currency', curr.value)"
                        :title="curr.title"
                        class="px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1.5"
                        :class="currency === curr.value ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900 font-medium'">
                        <span>{{ curr.label }}</span>
                        <span v-if="curr.badge" class="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                            :class="currency === curr.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'">
                            {{ curr.badge }}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
    modelValue: { type: String, required: true },
    currency: { type: String, default: 'all' },
    currentDate: { type: Date, required: true },
    isCurrentPeriod: { type: Boolean, required: true },
    isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'update:currency', 'prev', 'next'])
const { t, locale } = useI18n()

const periods = computed(() => [
    { label: t('adminTimePeriodSelector.periods.7d'), value: '7d' },
    { label: t('adminTimePeriodSelector.periods.30d'), value: '30d' },
    { label: t('adminTimePeriodSelector.periods.90d'), value: '90d' },
    { label: t('adminTimePeriodSelector.periods.1y'), value: '1y' }
])

const currencies = computed(() => [
    {
        label: t('adminDashboard.currencyFilter.all') || 'All (₦)',
        title: t('adminDashboard.currencyFilter.allTitle') || 'All currencies converted to Naira',
        value: 'all'
    },
    {
        label: t('adminDashboard.currencyFilter.ngn') || 'NGN',
        badge: '₦',
        title: 'Nigerian Naira only',
        value: 'NGN'
    },
    {
        label: t('adminDashboard.currencyFilter.xof') || 'XOF / CT',
        badge: 'CFA',
        title: 'Franc CFA / CT only',
        value: 'XOF'
    }
])

const currentPeriodLabel = computed(() => {
    const date = props.currentDate
    const options = { year: 'numeric', month: 'short' }
    const currentLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US'

    switch (props.modelValue) {
        case '7d':
        case '30d':
            return t('adminTimePeriodSelector.currentPeriod.rangeToPresent', {
                date: date.toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' })
            })
        case '90d':
            return t('adminTimePeriodSelector.currentPeriod.rangeToPresent', {
                date: date.toLocaleDateString(currentLocale, options)
            })
        case '1y':
            return date.getFullYear().toString()
        default:
            return t('adminTimePeriodSelector.currentPeriod.rangeToPresent', {
                date: date.toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' })
            })
    }
})
</script>

<template>
    <div class="p-6 sm:p-8 space-y-8 bg-slate-50/10">
        
        <!-- Create Coupon Form Card -->
        <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div class="flex items-center gap-3 pb-3 border-b border-slate-50">
                <div class="p-2 bg-[#ff934b]/10 rounded-lg text-[#ff934b]">
                    <TicketPercent class="w-5 h-5" />
                </div>
                <div>
                    <h3 class="text-lg font-bold text-slate-800">{{ t('managePromotionsPage.createCoupon', 'Create New Coupon') }}</h3>
                    <p class="text-xs text-slate-500">{{ t('managePromotionsPage.createCouponSubtitle', 'Set code, discount rate, expiry date, and limit restrictions') }}</p>
                </div>
            </div>

            <form @submit.prevent="createCoupon" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <!-- Coupon Code -->
                    <div class="space-y-2">
                        <label for="code" class="text-sm font-semibold text-slate-700 block">{{ t('managePromotionsPage.couponCode') }}</label>
                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                            <Tag class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input v-model="newCoupon.code" id="code" type="text" required
                                class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-bold uppercase placeholder:normal-case"
                                :placeholder="t('managePromotionsPage.couponCodePlaceholder', 'e.g. SUMMER50')" />
                        </div>
                    </div>

                    <!-- Discount Percentage -->
                    <div class="space-y-2">
                        <label for="discountPercentage" class="text-sm font-semibold text-slate-700 block">{{ t('managePromotionsPage.discountPercentage') }}</label>
                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                            <Percent class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input v-model.number="newCoupon.discountPercentage" id="discountPercentage" type="number" min="1" max="100" required
                                class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-semibold"
                                :placeholder="t('managePromotionsPage.discountPercentagePlaceholder', 'e.g. 15')" />
                        </div>
                    </div>

                    <!-- Expiry Date (Custom Calendar) -->
                    <div class="space-y-2 relative" ref="datePickerContainer">
                        <label for="expiryDate" class="text-sm font-semibold text-slate-700 block">{{ t('managePromotionsPage.expiryDate') }}</label>
                        <div @click="toggleDatePicker"
                            class="relative rounded-xl border bg-slate-50/30 hover:bg-white transition-all duration-300 cursor-pointer flex items-center select-none"
                            :class="[
                                showDatePicker 
                                    ? 'border-[#ff934b] ring-4 ring-[#ff934b]/10 bg-white' 
                                    : 'border-slate-200'
                            ]"
                        >
                            <Calendar class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <div class="w-full px-4 py-3 pl-11 text-slate-700 text-sm font-semibold">
                                {{ formattedExpiryDisplay || t('managePromotionsPage.selectDatePlaceholder', 'Select Expiry Date') }}
                            </div>
                        </div>

                        <!-- Custom Date Picker Popover -->
                        <div v-if="showDatePicker"
                            class="absolute top-full mt-2 left-0 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                            <!-- Datepicker Header -->
                            <div class="flex items-center justify-between">
                                <button type="button" @click="prevMonth"
                                    class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    <ChevronLeft class="w-5 h-5" />
                                </button>
                                <span class="text-sm font-bold text-slate-800 tracking-wide select-none capitalize">
                                    {{ currentMonthYearLabel }}
                                </span>
                                <button type="button" @click="nextMonth"
                                    class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    <ChevronRight class="w-5 h-5" />
                                </button>
                            </div>

                            <!-- Weekday Headers -->
                            <div class="grid grid-cols-7 gap-1 text-center">
                                <span v-for="day in weekdays" :key="day" class="text-xs font-semibold text-slate-400 select-none">
                                    {{ day }}
                                </span>
                            </div>

                            <!-- Days Grid -->
                            <div class="grid grid-cols-7 gap-1">
                                <button v-for="(dayItem, idx) in daysInMonth" :key="idx"
                                    type="button"
                                    :disabled="dayItem.disabled"
                                    @click="selectDate(dayItem)"
                                    class="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-200 relative"
                                    :class="[
                                        dayItem.isCurrentMonth 
                                            ? (dayItem.disabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900') 
                                            : 'text-slate-300/60 cursor-not-allowed',
                                        isDateSelected(dayItem)
                                            ? 'bg-gradient-to-r from-[#ff934b] to-[#ff5e62] text-white shadow-md hover:from-[#ff5e62] hover:to-[#ff934b]'
                                            : '',
                                        isDateToday(dayItem) && !isDateSelected(dayItem)
                                            ? 'border border-[#ff934b] text-[#ff934b]'
                                            : ''
                                    ]"
                                >
                                    {{ dayItem.day }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Max Usage -->
                    <div class="space-y-2">
                        <label for="maxUsage" class="text-sm font-semibold text-slate-700 block">{{ t('managePromotionsPage.maxUsage') }}</label>
                        <div class="relative rounded-xl border border-slate-200 focus-within:border-[#ff934b] focus-within:ring-4 focus-within:ring-[#ff934b]/10 bg-slate-50/30 transition-all duration-300">
                            <Hash class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input v-model.number="newCoupon.maxUsage" id="maxUsage" type="number" min="1" required
                                class="w-full px-4 py-3 pl-11 text-slate-700 bg-transparent border-none focus:outline-none text-sm font-semibold"
                                :placeholder="t('managePromotionsPage.maxUsagePlaceholder', 'e.g. 100')" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-2">
                    <button type="submit"
                        class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#ff934b] to-[#ff5e62] hover:from-[#ff5e62] hover:to-[#ff934b] text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                    >
                        <PlusCircle class="w-4 h-4" />
                        <span>{{ t('managePromotionsPage.createCoupon') }}</span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Active Coupons Panel -->
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div class="flex items-center gap-2 text-slate-800">
                    <Ticket class="w-5 h-5 text-slate-500" />
                    <h3 class="text-lg font-bold">{{ t('managePromotionsPage.activeCoupons') }}</h3>
                </div>

                <!-- Text Search and Status Tabs -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <!-- Search Field -->
                    <div class="relative min-w-[200px]">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input v-model="searchQuery" type="text" :placeholder="t('managePromotionsPage.searchPlaceholder', 'Search code...')"
                            class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#ff934b] focus:ring-2 focus:ring-[#ff934b]/20 transition-all bg-white" />
                    </div>

                    <!-- Status Tabs -->
                    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        <button v-for="tab in filterTabs" :key="tab.id" @click="activeTab = tab.id"
                            type="button"
                            class="px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                            :class="[
                                activeTab === tab.id
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'bg-white border border-slate-200/60 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            ]"
                        >
                            {{ tab.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredCoupons.length === 0" class="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <Package class="w-12 h-12 text-slate-350 mx-auto mb-3" />
                <p class="text-sm font-semibold text-slate-500">
                    {{ searchQuery || activeTab !== 'all' ? t('managePromotionsPage.noMatchingCoupons', 'No coupons match your filter criteria') : t('managePromotionsPage.noActiveCoupons') }}
                </p>
            </div>

            <!-- Tickets Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="coupon in filteredCoupons" :key="coupon._id"
                    class="bg-white border border-slate-100 hover:border-[#ff934b]/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
                >
                    <!-- Coupon Card Top Section -->
                    <div class="p-5 pb-4 space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="px-3 py-1 bg-[#ff934b]/10 text-[#ff934b] text-xs font-black rounded-lg tracking-wider uppercase select-all">
                                {{ coupon.code }}
                            </span>
                            <div class="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-[#ff934b] group-hover:bg-[#ff934b]/5 transition-all duration-200">
                                <Ticket class="w-4.5 h-4.5" />
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <div class="text-3xl font-black text-slate-800 tracking-tight">
                                {{ coupon.discountPercentage }}% <span class="text-sm font-bold text-slate-450">OFF</span>
                            </div>
                            <p class="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                                <Calendar class="w-3.5 h-3.5 text-slate-400" />
                                <span>{{ t('managePromotionsPage.expires', { date: formatDate(coupon.expiryDate) }) }}</span>
                            </p>
                        </div>
                    </div>

                    <!-- Perforation Line with Side Notches -->
                    <div class="relative flex items-center justify-between my-1">
                        <!-- Left Notch -->
                        <div class="absolute -left-2.5 w-5 h-5 rounded-full bg-slate-50 border border-slate-100 shadow-inner z-10"></div>
                        <!-- Perforation Line -->
                        <div class="w-full border-t border-dashed border-slate-200 mx-3"></div>
                        <!-- Right Notch -->
                        <div class="absolute -right-2.5 w-5 h-5 rounded-full bg-slate-50 border border-slate-100 shadow-inner z-10"></div>
                    </div>

                    <!-- Coupon Card Bottom Section -->
                    <div class="p-5 pt-3 space-y-4">
                        <!-- Usages Progress bar -->
                        <div class="flex flex-col gap-1.5 text-xs text-slate-400 font-semibold">
                            <div class="flex justify-between items-center">
                                <span class="text-slate-500 font-semibold">{{ t('managePromotionsPage.uses', { used: coupon.usedCount, max: coupon.maxUsage }) }}</span>
                                <span class="text-[#ff934b] font-bold">{{ Math.round((coupon.usedCount / coupon.maxUsage) * 100) }}%</span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div class="bg-gradient-to-r from-[#ff934b] to-[#ff5e62] h-full transition-all duration-500"
                                    :style="{ width: `${Math.min(100, (coupon.usedCount / coupon.maxUsage) * 100)}%` }"></div>
                            </div>
                        </div>

                        <div class="flex justify-end pt-1">
                            <button @click="deleteCoupon(coupon._id)"
                                class="px-3 py-1.5 text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-100 hover:border-transparent rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 active:scale-95"
                                type="button"
                            >
                                <Trash2 class="w-3.5 h-3.5" />
                                <span>{{ t('managePromotionsPage.delete') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSellerStore } from '../store/sellerStore';
import { useUserStore } from '../store/user';
import { onClickOutside } from '@vueuse/core';
import { 
    Tag, Percent, Calendar, Ticket, Trash2, TicketPercent, PlusCircle, Package, Hash, ChevronLeft, ChevronRight, Search 
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

export default {
    name: 'ManagePromotions',
    components: { 
        Tag, Percent, Calendar, Ticket, Trash2, TicketPercent, PlusCircle, Package, Hash, ChevronLeft, ChevronRight, Search 
    },
    setup() {
        const { t, locale } = useI18n();
        const sellerStore = useSellerStore();
        const userStore = useUserStore();
        const coupons = ref([]);
        const newCoupon = ref({
            code: '',
            discountPercentage: 0,
            expiryDate: '',
            maxUsage: 1
        });

        // Search & Filter Status
        const searchQuery = ref('');
        const activeTab = ref('all');

        // Custom Datepicker state
        const showDatePicker = ref(false);
        const calendarYear = ref(new Date().getFullYear());
        const calendarMonth = ref(new Date().getMonth());
        const datePickerContainer = ref(null);

        const filterTabs = computed(() => [
            { id: 'all', label: t('managePromotionsPage.tabs.all', 'All') },
            { id: 'active', label: t('managePromotionsPage.tabs.active', 'Active') },
            { id: 'expired', label: t('managePromotionsPage.tabs.expired', 'Expired') },
            { id: 'used', label: t('managePromotionsPage.tabs.used', 'Fully Used') }
        ]);

        const weekdays = computed(() => {
            return locale.value === 'fr' 
                ? ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'] 
                : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        });

        const currentMonthYearLabel = computed(() => {
            const date = new Date(calendarYear.value, calendarMonth.value);
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US';
            return date.toLocaleDateString(activeLocale, { month: 'long', year: 'numeric' });
        });

        const formattedExpiryDisplay = computed(() => {
            if (!newCoupon.value.expiryDate) return '';
            return formatDate(newCoupon.value.expiryDate);
        });

        const daysInMonth = computed(() => {
            const year = calendarYear.value;
            const month = calendarMonth.value;
            
            // Total days in current month
            const total = new Date(year, month + 1, 0).getDate();
            // Weekday index of 1st day of the month
            const startDay = new Date(year, month, 1).getDay(); 
            
            const list = [];
            
            // Pad previous month days
            const prevTotal = new Date(year, month, 0).getDate();
            for (let i = startDay - 1; i >= 0; i--) {
                list.push({
                    day: prevTotal - i,
                    month: month === 0 ? 11 : month - 1,
                    year: month === 0 ? year - 1 : year,
                    isCurrentMonth: false,
                    disabled: true
                });
            }
            
            // Current month days
            const today = new Date();
            today.setHours(0,0,0,0);
            
            for (let i = 1; i <= total; i++) {
                const date = new Date(year, month, i);
                date.setHours(0,0,0,0);
                list.push({
                    day: i,
                    month: month,
                    year: year,
                    isCurrentMonth: true,
                    disabled: date < today
                });
            }
            
            // Complete the grid to a multiple of 7
            const currentCount = list.length;
            const remaining = (7 - (currentCount % 7)) % 7;
            for (let i = 1; i <= remaining; i++) {
                list.push({
                    day: i,
                    month: month === 11 ? 0 : month + 1,
                    year: month === 11 ? year + 1 : year,
                    isCurrentMonth: false,
                    disabled: true
                });
            }
            
            return list;
        });

        const toggleDatePicker = () => {
            showDatePicker.value = !showDatePicker.value;
            if (showDatePicker.value) {
                const baseDate = newCoupon.value.expiryDate ? new Date(newCoupon.value.expiryDate) : new Date();
                calendarYear.value = baseDate.getFullYear();
                calendarMonth.value = baseDate.getMonth();
            }
        };

        const prevMonth = () => {
            if (calendarMonth.value === 0) {
                calendarMonth.value = 11;
                calendarYear.value -= 1;
            } else {
                calendarMonth.value -= 1;
            }
        };

        const nextMonth = () => {
            if (calendarMonth.value === 11) {
                calendarMonth.value = 0;
                calendarYear.value += 1;
            } else {
                calendarMonth.value += 1;
            }
        };

        const selectDate = (dayItem) => {
            if (dayItem.disabled || !dayItem.isCurrentMonth) return;
            const monthStr = String(dayItem.month + 1).padStart(2, '0');
            const dayStr = String(dayItem.day).padStart(2, '0');
            newCoupon.value.expiryDate = `${dayItem.year}-${monthStr}-${dayStr}`;
            showDatePicker.value = false;
        };

        const isDateSelected = (dayItem) => {
            if (!newCoupon.value.expiryDate) return false;
            const selDate = new Date(newCoupon.value.expiryDate);
            return selDate.getFullYear() === dayItem.year &&
                   selDate.getMonth() === dayItem.month &&
                   selDate.getDate() === dayItem.day;
        };

        const isDateToday = (dayItem) => {
            const today = new Date();
            return today.getFullYear() === dayItem.year &&
                   today.getMonth() === dayItem.month &&
                   today.getDate() === dayItem.day;
        };

        onClickOutside(datePickerContainer, () => {
            showDatePicker.value = false;
        });

        const fetchCoupons = async () => {
            try {
                coupons.value = await sellerStore.fetchSellerCoupons();
            } catch (error) {
                toast.error(t('managePromotionsPage.toasts.fetchFailed'));
            }
        };

        const createCoupon = async () => {
            try {
                if (coupons.value.some(coupon => coupon.code.toUpperCase() === newCoupon.value.code.toUpperCase())) {
                    toast.error(t('managePromotionsPage.toasts.codeExists'));
                    return;
                }

                await sellerStore.createCoupon({
                    ...newCoupon.value,
                    code: newCoupon.value.code.toUpperCase(),
                    sellerId: userStore.user._id
                });
                toast.success(t('managePromotionsPage.toasts.created'));
                newCoupon.value = { code: '', discountPercentage: 0, expiryDate: '', maxUsage: 1 };
                await fetchCoupons();
            } catch (error) {
                toast.error(t('managePromotionsPage.toasts.createFailed'));
            }
        };

        const deleteCoupon = async (couponId) => {
            try {
                await sellerStore.deleteCoupon(couponId);
                toast.success(t('managePromotionsPage.toasts.deleted'));
                await fetchCoupons();
            } catch (error) {
                toast.error(t('managePromotionsPage.toasts.deleteFailed'));
            }
        };

        const formatDate = (dateString) => {
            const activeLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US';
            return new Date(dateString).toLocaleDateString(activeLocale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        // Reactive filter computation
        const filteredCoupons = computed(() => {
            let result = coupons.value;

            // 1. Text Search Filter
            if (searchQuery.value) {
                const query = searchQuery.value.toUpperCase();
                result = result.filter(coupon => coupon.code.includes(query));
            }

            // 2. Status Tab Filter
            const today = new Date();
            today.setHours(0,0,0,0);

            if (activeTab.value === 'active') {
                result = result.filter(coupon => {
                    const expiry = new Date(coupon.expiryDate);
                    expiry.setHours(0,0,0,0);
                    return expiry >= today && coupon.usedCount < coupon.maxUsage && coupon.active !== false;
                });
            } else if (activeTab.value === 'expired') {
                result = result.filter(coupon => {
                    const expiry = new Date(coupon.expiryDate);
                    expiry.setHours(0,0,0,0);
                    return expiry < today;
                });
            } else if (activeTab.value === 'used') {
                result = result.filter(coupon => coupon.usedCount >= coupon.maxUsage || coupon.active === false);
            }

            return result;
        });

        onMounted(fetchCoupons);

        return {
            t,
            coupons,
            newCoupon,
            searchQuery,
            activeTab,
            filterTabs,
            showDatePicker,
            calendarYear,
            calendarMonth,
            datePickerContainer,
            weekdays,
            currentMonthYearLabel,
            formattedExpiryDisplay,
            daysInMonth,
            toggleDatePicker,
            prevMonth,
            nextMonth,
            selectDate,
            isDateSelected,
            isDateToday,
            createCoupon,
            deleteCoupon,
            formatDate,
            filteredCoupons
        };
    }
};
</script>

<style scoped>
/* Custom scrollbar hiding for horizontal scroll tabs */
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
.scrollbar-none {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>

<template>
    <div class=" bg-white px-5 pt-5 pb-0 mb-2">
        <h1 class="text-2xl font-semibold mb-6">Rate and Reviews</h1>
        <div class="">
            <ul class="flex space-x-10 px-6">
                <li v-for="item in rateReviewItems" :key="item.label"
                    class="border-b-2 border-white hover:border-b-2 hover:border-[#24a3b5]">
                    <router-link active-class="active-link" :to="item.link"
                        class="flex items-center space-x-2 text-gray-500 hover:text-[#24a3b5] transition-all duration-300 ease-in-out">
                        <span class="font-medium text-sm">{{ item.label }}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { rateReviewItems } from '../utils/rateReviewItems.js';
export default {
    data() {
        return {
            rateReviewItems: rateReviewItems,
        };
    },
};
</script>

<style scoped>
.active-link {
    border-bottom-width: 2px;
    border-color: #24a3b5;
    padding-bottom: 0.5rem
}
</style>
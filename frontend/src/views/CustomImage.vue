<template>
    <div class="relative border-b">
        <img :src="src" :alt="alt" @click="handleClick" class="w-full h-[300px] object-cover cursor-pointer">
        <button v-if="showButton"
            class="absolute top-2 right-2 text-gray-500 hover:text-[#ff5e62] duration-300 bg-white rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            required: true,
        },
        alt: {
            type: String,
            default: '',
        },
        showButton: {
            type: Boolean,
            default: false,
        },
        onClick: {
            type: Function,
            default: null,
        },
    },
    methods: {
        handleClick() {
            if (this.onClick) {
                this.onClick();
            }
        },
    },
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
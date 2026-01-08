<template>
  <div class="flex flex-col min-h-screen">
    <!-- <Navbar :isMenuOpen="isMenuOpen" @toggleSidebar="toggleSidebar" @closeMenu="closeMenu" /> -->
    <Navbar :isMenuOpen="isMenuOpen" @toggleSidebar="toggleSidebar" @closeMenu="closeMenu" class="sticky top-0 z-50" />
    <section className="w-[82%] mx-auto ">
      <Categories />
    </section>
    <!-- <router-view class="flex-1 overflow-y-auto" /> -->
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
    <Footer />
    <Toaster richColors />
  </div>
</template>

<script>
import { ref } from 'vue';
import Navbar from './views/Navbar.vue';
import Categories from './views/Categories.vue';
import Footer from './views/Footer.vue';
import { Toaster } from '@/components/ui/sonner';
import { clickOutside } from './utils/clickOutside.js';

export default {
  components: {
    Navbar,
    Categories,
    Footer,
    Toaster,
  },
  directives: {
    clickOutside
  },
  setup() {
    const isMenuOpen = ref(false);

    const toggleSidebar = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    return {
      isMenuOpen,
      toggleSidebar,
      closeMenu
    };
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar
      v-if="!isAdminRoute"
      :isMenuOpen="isMenuOpen"
      @toggleSidebar="toggleSidebar"
      @closeMenu="closeMenu"
      class="sticky top-0 z-50"
    />
    <section v-if="!isAdminRoute" className="w-[82%] mx-auto ">
      <Categories />
    </section>
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
    <Footer v-if="!isAdminRoute" />
    <Toaster richColors />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
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
    const route = useRoute();
    const isMenuOpen = ref(false);
    const isAdminRoute = computed(() => route.path.startsWith('/admin'));

    const toggleSidebar = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    return {
      isAdminRoute,
      isMenuOpen,
      toggleSidebar,
      closeMenu
    };
  }
};
</script>

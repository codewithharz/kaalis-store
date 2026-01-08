import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import { createPinia } from "pinia";
import "./assets/index.css";
import { Toaster } from "@/components/ui/sonner";
import "@fortawesome/fontawesome-free/css/all.css";

createApp(App).use(router).use(createPinia()).use(Toaster).mount("#app");
// createApp(App).use(createPinia()).use(Toaster).mount("#app");

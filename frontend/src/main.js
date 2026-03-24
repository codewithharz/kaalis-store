import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import { createPinia } from "pinia";
import "./assets/index.css";
import { Toaster } from "@/components/ui/sonner";
import "@fortawesome/fontawesome-free/css/all.css";
import i18n from "./i18n";
import { useLanguageStore } from "./store/languageStore";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const languageStore = useLanguageStore(pinia);
i18n.global.locale.value = languageStore.locale;

app.use(i18n).use(router).use(Toaster).mount("#app");
// createApp(App).use(createPinia()).use(Toaster).mount("#app");

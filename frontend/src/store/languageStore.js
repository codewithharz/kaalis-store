import { defineStore } from "pinia";
import { defaultLocale } from "../i18n";

export const useLanguageStore = defineStore("language", {
  state: () => ({
    locale: localStorage.getItem("locale") || defaultLocale,
  }),
  actions: {
    setLocale(locale) {
      this.locale = locale;
      localStorage.setItem("locale", locale);
    },
  },
});

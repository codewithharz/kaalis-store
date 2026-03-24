import { createI18n } from "vue-i18n";
import en from "./locales/en";
import fr from "./locales/fr";

export const supportedLocales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Francais" },
];

export const defaultLocale = "en";

export const messages = {
  en,
  fr,
};

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
});

export default i18n;

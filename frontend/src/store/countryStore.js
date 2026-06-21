import { defineStore } from "pinia";
import {
  getCountryCode,
  getCurrencyForCountry,
  getPaymentRailForCountry,
} from "../utils/countryCurrency";
import { getCachedPlatformRuntimeSettings } from "../utils/platformSettings";

export const useCountryStore = defineStore("country", {
  state: () => ({
    selectedCountry: localStorage.getItem("selectedCountry") || null,
  }),
  getters: {
    countryCode: (state) => getCountryCode(state.selectedCountry),
    currency: (state) => getCurrencyForCountry(state.selectedCountry),
    paymentRail: (state) => getPaymentRailForCountry(state.selectedCountry),
    isXofCountry: (state) => getCurrencyForCountry(state.selectedCountry) === "XOF",
  },
  actions: {
    setCountry(country) {
      this.selectedCountry = country;
      localStorage.setItem("selectedCountry", country);
    },
    clearCountry() {
      this.selectedCountry = null;
      localStorage.removeItem("selectedCountry");
    },
    convertPrice(amount, fromCurrency) {
      const targetCurrency = this.currency || "NGN";
      if (!fromCurrency || fromCurrency === targetCurrency) {
        return amount;
      }

      const settings = getCachedPlatformRuntimeSettings();
      const rates = settings.currencyConversion || { ngnToXofRate: 0.42, xofToNgnRate: 2.38 };

      if (fromCurrency === "NGN" && targetCurrency === "XOF") {
        return amount * (rates.ngnToXofRate || 0.42);
      }
      if (fromCurrency === "XOF" && targetCurrency === "NGN") {
        return amount * (rates.xofToNgnRate || 2.38);
      }

      return amount;
    },
  },
});

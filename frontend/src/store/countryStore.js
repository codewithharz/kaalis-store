import { defineStore } from "pinia";
import {
  getCountryCode,
  getCurrencyForCountry,
  getPaymentRailForCountry,
} from "../utils/countryCurrency";

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
  },
});

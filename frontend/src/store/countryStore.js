import { defineStore } from "pinia";

export const useCountryStore = defineStore("country", {
  state: () => ({
    selectedCountry: localStorage.getItem("selectedCountry") || null,
  }),
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

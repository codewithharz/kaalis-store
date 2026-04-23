export const XOF_COUNTRIES = new Set([
  "Benin",
  "Burkina Faso",
  "Côte d'Ivoire",
  "Guinea-Bissau",
  "Mali",
  "Niger",
  "Senegal",
  "Togo",
]);

export const COUNTRY_CODES = {
  Nigeria: "NG",
  Benin: "BJ",
  "Burkina Faso": "BF",
  "Côte d'Ivoire": "CI",
  "Guinea-Bissau": "GW",
  Mali: "ML",
  Niger: "NE",
  Senegal: "SN",
  Togo: "TG",
};

export const getCountryCode = (country) => COUNTRY_CODES[country] || "NG";

export const getCurrencyForCountry = (country) =>
  XOF_COUNTRIES.has(country) ? "XOF" : "NGN";

export const getPaymentRailForCountry = (country) =>
  getCurrencyForCountry(country) === "XOF" ? "AfriExchange" : "Paystack";

export const getCurrencySymbol = (currency) =>
  currency === "XOF" ? "CFA" : "₦";

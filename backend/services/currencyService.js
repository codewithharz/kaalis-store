// backend/services/currencyService.js
const logger = require("../utils/logger");

class CurrencyService {
  constructor() {
    // Fixed exchange rates - in production, you'd fetch these from an API
    this.exchangeRates = {
      NGN_TO_XOF: 0.4, // 1 Naira = 0.4 XOF
      XOF_TO_NGN: 2.5, // 1 XOF = 2.5 Naira
    };

    // Supported currencies
    this.supportedCurrencies = ["NGN", "XOF"];

    logger.info(
      "CurrencyService initialized with fixed exchange rates",
      this.exchangeRates
    );
  }

  /**
   * Convert amount from one currency to another
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency code
   * @param {string} toCurrency - Target currency code
   * @returns {number} Converted amount
   */
  convertAmount(amount, fromCurrency, toCurrency) {
    if (!amount || isNaN(amount) || amount < 0) {
      throw new Error("Invalid amount for currency conversion");
    }

    if (fromCurrency === toCurrency) {
      return amount; // No conversion needed
    }

    if (
      !this.supportedCurrencies.includes(fromCurrency) ||
      !this.supportedCurrencies.includes(toCurrency)
    ) {
      throw new Error(
        `Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`
      );
    }

    let rate;
    if (fromCurrency === "NGN" && toCurrency === "XOF") {
      rate = this.exchangeRates.NGN_TO_XOF;
    } else if (fromCurrency === "XOF" && toCurrency === "NGN") {
      rate = this.exchangeRates.XOF_TO_NGN;
    } else {
      throw new Error(
        `Currency conversion not supported: ${fromCurrency} to ${toCurrency}`
      );
    }

    const convertedAmount = parseFloat((amount * rate).toFixed(2));

    logger.info(
      `Currency conversion: ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`
    );
    return convertedAmount;
  }

  /**
   * Convert NGN to XOF
   * @param {number} amount - Amount in NGN
   * @returns {number} Amount in XOF
   */
  convertNGNtoXOF(amount) {
    return this.convertAmount(amount, "NGN", "XOF");
  }

  /**
   * Convert XOF to NGN
   * @param {number} amount - Amount in XOF
   * @returns {number} Amount in NGN
   */
  convertXOFtoNGN(amount) {
    return this.convertAmount(amount, "XOF", "NGN");
  }

  /**
   * Format amount for display with currency symbol
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} Formatted amount with currency symbol
   */
  formatAmount(amount, currency) {
    if (!amount && amount !== 0) return "";

    const formatOptions = {
      NGN: { symbol: "₦", decimalPlaces: 2 },
      XOF: { symbol: "CFA", decimalPlaces: 0 },
    };

    const options = formatOptions[currency] || {
      symbol: currency,
      decimalPlaces: 2,
    };
    const formattedAmount = amount.toFixed(options.decimalPlaces);

    return `${options.symbol}${formattedAmount}`;
  }

  /**
   * Get currency by country code
   * @param {string} countryCode - ISO country code
   * @returns {string} Currency code
   */
  getCurrencyByCountry(countryCode) {
    const currencyMap = {
      NG: "NGN",
      SN: "XOF",
      CI: "XOF", // Ivory Coast
      BJ: "XOF", // Benin
      BF: "XOF", // Burkina Faso
      ML: "XOF", // Mali
      NE: "XOF", // Niger
      TG: "XOF", // Togo
      GW: "XOF", // Guinea-Bissau
    };

    return currencyMap[countryCode] || "NGN"; // Default to NGN if not found
  }

  /**
   * Determine appropriate payment gateway based on currency
   * @param {string} currency - Currency code
   * @returns {string} Payment gateway name
   */
  getPaymentGatewayForCurrency(currency) {
    const gatewayMap = {
      NGN: "Paystack",
      XOF: "PayDunya", // Default XOF gateway, could also be OrangeMoney
    };

    return gatewayMap[currency] || "Paystack"; // Default to Paystack
  }
}

module.exports = new CurrencyService();

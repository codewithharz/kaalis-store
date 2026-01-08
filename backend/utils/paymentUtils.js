// backend/utils/paymentUtils.js
const VENDOR_SHARE_PERCENTAGE = 0.92; // 92% for vendor
const PLATFORM_FEE_PERCENTAGE = 0.08; // 8% platform fee
const DECIMAL_PLACES = 2;

// Hard-coded exchange rate for NGN to XOF (as of April 2025, approximate)
const NGN_TO_XOF_RATE = 0.4; // 1 NGN ≈ 0.4 XOF (fetch dynamically in production)
const XOF_TO_NGN_RATE = 1 / NGN_TO_XOF_RATE;

/**
 * Convert NGN to XOF for Orange Money or PayDunya payments
 * @param {number} amount - Amount in NGN
 * @returns {number} Amount in XOF
 */
exports.convertNGNToXOF = (amount) => {
  if (isNaN(amount) || amount < 0) {
    throw new Error("Invalid amount for NGN to XOF conversion");
  }

  // Use a more accurate exchange rate - This rate should be updated regularly in production
  const NGN_TO_XOF_RATE = 0.4; // 1 NGN ≈ 0.4 XOF

  // Convert to XOF and round to whole number (PayDunya requires integer amounts)
  const amountInXOF = Math.round(parseFloat(amount) * NGN_TO_XOF_RATE);

  // Log the conversion for debugging
  console.log(
    `Converting ${amount} NGN to ${amountInXOF} XOF (rate: ${NGN_TO_XOF_RATE})`
  );

  return amountInXOF;
};

/**
 * Convert XOF to NGN
 * @param {number} amount - Amount in XOF
 * @returns {number} Amount in NGN
 */
exports.convertXOFToNGN = (amount) => {
  if (isNaN(amount) || amount < 0) {
    throw new Error("Invalid amount for XOF to NGN conversion");
  }
  return parseFloat((amount * XOF_TO_NGN_RATE).toFixed(DECIMAL_PLACES));
};

/**
 * Calculate vendor and platform fees from total amount
 * @param {number} amount - Total amount in base currency units
 * @returns {Object} Object containing vendorAmount, platformFee, and total
 */
exports.calculateFees = (amount) => {
  const safeAmount = parseFloat(
    Math.abs(Number(amount)).toFixed(DECIMAL_PLACES)
  );

  const vendorAmount = parseFloat(
    (safeAmount * VENDOR_SHARE_PERCENTAGE).toFixed(DECIMAL_PLACES)
  );
  const platformFee = parseFloat(
    (safeAmount * PLATFORM_FEE_PERCENTAGE).toFixed(DECIMAL_PLACES)
  );

  const calculatedTotal = vendorAmount + platformFee;
  const difference = parseFloat(
    (safeAmount - calculatedTotal).toFixed(DECIMAL_PLACES)
  );

  return {
    vendorAmount: vendorAmount + difference,
    platformFee,
    total: safeAmount,
    originalAmount: amount,
  };
};

/**
 * Validate payment amounts with tolerance for floating-point arithmetic
 * @param {number} amount - Total amount
 * @param {number} vendorAmount - Vendor's portion
 * @param {number} platformFee - Platform's fee
 * @returns {boolean} True if amounts match within acceptable tolerance
 */
exports.validatePaymentAmount = (amount, vendorAmount, platformFee) => {
  const EPSILON = 0.00001;

  const total = parseFloat(amount.toFixed(DECIMAL_PLACES));
  const sum = parseFloat((vendorAmount + platformFee).toFixed(DECIMAL_PLACES));

  return Math.abs(total - sum) < EPSILON;
};

/**
 * Convert amount to Paystack's kobo format
 * @param {number} amount - Amount in Naira
 * @returns {number} Amount in kobo
 */
exports.toKobo = (amount) => {
  if (isNaN(amount) || amount < 0) {
    throw new Error("Invalid amount provided");
  }
  return Math.round(parseFloat(amount) * 100);
};

/**
 * Convert amount from Paystack's kobo format to Naira
 * @param {number} amount - Amount in kobo
 * @returns {number} Amount in Naira
 */
exports.fromKobo = (amount) => {
  if (isNaN(amount) || amount < 0) {
    throw new Error("Invalid kobo amount provided");
  }
  return parseFloat((amount / 100).toFixed(DECIMAL_PLACES));
};

/**
 * Calculate transaction amounts including fees
 * @param {number} baseAmount - Base amount before fees
 * @param {number} shippingFee - Shipping fee amount
 * @param {string} paymentMethod - Payment method ("Paystack", "OrangeMoney", "PayDunya")
 * @returns {Object} Calculated amounts including fees
 */
exports.calculateTransactionAmounts = (
  baseAmount,
  shippingFee = 0,
  paymentMethod = "Paystack"
) => {
  const subTotal = parseFloat(baseAmount.toFixed(DECIMAL_PLACES));
  const shipping = parseFloat(shippingFee.toFixed(DECIMAL_PLACES));
  const totalBeforeFees = subTotal + shipping;

  const { vendorAmount, platformFee } = exports.calculateFees(subTotal);

  let amounts = {
    subTotal,
    shippingFee: shipping,
    vendorAmount,
    platformFee: platformFee + shipping, // Platform keeps shipping fee
    total: totalBeforeFees,
  };

  if (paymentMethod === "Paystack") {
    amounts.totalInKobo = exports.toKobo(totalBeforeFees);
  } else if (paymentMethod === "OrangeMoney" || paymentMethod === "PayDunya") {
    amounts.totalInXOF = exports.convertNGNToXOF(totalBeforeFees);
  }

  return amounts;
};

/**
 * Validate Paystack payment amounts
 * @param {Object} amounts - Object containing payment amounts
 * @returns {boolean} True if amounts are valid
 */
exports.validatePaystackAmounts = (amounts) => {
  const { amount, vendorAmount, platformFee, shippingFee = 0 } = amounts;

  const validAmounts = [amount, vendorAmount, platformFee, shippingFee].every(
    (amt) => typeof amt === "number" && amt >= 0
  );

  if (!validAmounts) return false;

  return exports.validatePaymentAmount(
    amount,
    vendorAmount,
    platformFee + shippingFee
  );
};

/**
 * Validate Orange Money payment amounts
 * @param {Object} amounts - Object containing payment amounts
 * @returns {boolean} True if amounts are valid
 */
exports.validateOrangeMoneyAmounts = (amounts) => {
  const { amount, vendorAmount, platformFee, shippingFee = 0 } = amounts;
  const validAmounts = [amount, vendorAmount, platformFee, shippingFee].every(
    (amt) => typeof amt === "number" && amt >= 0
  );
  if (!validAmounts) return false;
  return exports.validatePaymentAmount(amount, vendorAmount, platformFee);
};

/**
 * Validate PayDunya payment amounts
 * @param {Object} amounts - Object containing payment amounts
 * @returns {boolean} True if amounts are valid
 */
exports.validatePayDunyaAmounts = (amounts) => {
  const { amount, vendorAmount, platformFee, shippingFee = 0 } = amounts;
  const validAmounts = [amount, vendorAmount, platformFee, shippingFee].every(
    (amt) => typeof amt === "number" && amt >= 0
  );
  if (!validAmounts) return false;
  return exports.validatePaymentAmount(amount, vendorAmount, platformFee);
};

/**
 * Format amount for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: NGN)
 * @returns {string} Formatted amount string
 */
exports.formatAmount = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: DECIMAL_PLACES,
  }).format(amount);
};

/**
 * Generate payment reference
 * @param {string} prefix - Reference prefix
 * @returns {string} Unique payment reference
 */
exports.generatePaymentReference = (prefix = "PAY") => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${random}`;
};

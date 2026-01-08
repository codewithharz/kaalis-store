// models/shippingRulesModel.js
const mongoose = require("mongoose");

const shippingRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    freeShippingThreshold: { type: Number, default: 50 },
    baseShippingFee: { type: Number, default: 5.99 },
    categoryFees: { type: Map, of: Number },
    perWeightUnitFee: { type: Number, default: 0.1 },
    currentPromotion: {
      code: String,
      discount: Number,
      startDate: Date,
      endDate: Date,
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ShippingRule = mongoose.model("ShippingRule", shippingRuleSchema);
module.exports = ShippingRule;

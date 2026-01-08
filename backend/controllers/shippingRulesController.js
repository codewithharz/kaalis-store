// controllers/shippingRulesController.js
const ShippingRule = require("../models/shippingRulesModel");

exports.getShippingRules = async (req, res) => {
  try {
    const shippingRules = await ShippingRule.findOne({ isDefault: true });
    if (!shippingRules) {
      return res
        .status(404)
        .json({ message: "No default shipping rules found" });
    }
    res.status(200).json(shippingRules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

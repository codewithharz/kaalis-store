// routes/shippingRules.js
const express = require("express");

const { getShippingRules } = require("../controllers/shippingRulesController");

const router = express.Router();

router.get("/", getShippingRules);

module.exports = router;

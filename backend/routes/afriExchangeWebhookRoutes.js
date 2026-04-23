const express = require("express");
const afriExchangeWebhookController = require("../controllers/afriExchangeWebhookController");

const router = express.Router();

router.post("/webhooks", afriExchangeWebhookController.handleAfriExchangeWebhook);

module.exports = router;

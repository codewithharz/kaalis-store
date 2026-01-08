const express = require("express");
const router = express.Router();
const orangeMoneyController = require("../controllers/orangeMoneyController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

router.post(
  "/initialize",
  userAuthMiddleware,
  orangeMoneyController.initializePayment
);

router.post("/callback", orangeMoneyController.handleCallback);

module.exports = router;

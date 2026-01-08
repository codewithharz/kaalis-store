// backend/middleware/paystackWebhook.js
const crypto = require("crypto");
require("dotenv").config();

module.exports = (req, res, next) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === req.headers["x-paystack-signature"]) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Invalid webhook signature",
    });
  }
};

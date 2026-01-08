const OrangeMoneyService = require("../services/orangeMoneyService");
const Order = require("../models/orderModels");
const logger = require("../utils/logger");

class OrangeMoneyController {
  async initializePayment(req, res) {
    try {
      const { email, orderId, customerPhone } = req.body;

      if (!email || !orderId || !customerPhone) {
        return res.status(400).json({
          status: false,
          message: "Email, order ID, and customer phone are required",
        });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          status: false,
          message: "Order not found",
        });
      }

      if (order.status !== "Pending") {
        return res.status(400).json({
          status: false,
          message: "Order is not in a payable state",
        });
      }

      // Update order metadata with customerPhone
      order.metadata = { ...order.metadata, customerPhone };
      await order.save();

      const paymentData = {
        email,
        orderId: order.orderId,
        amount: order.totalAmount,
        shippingFee: order.shippingFee,
        customerPhone,
        userId: req.user._id,
        userEmail: email,
        customerName: `${req.user.firstName} ${req.user.lastName}`,
      };

      const response = await OrangeMoneyService.initializeTransaction(
        paymentData
      );

      return res.status(200).json({
        status: true,
        message: "Orange Money payment initialized",
        data: {
          authorization_url: response.payment_url,
          payment_id: response.payment_id,
        },
      });
    } catch (error) {
      logger.error("Orange Money payment initialization error:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not initialize payment",
      });
    }
  }

  async handleCallback(req, res) {
    try {
      const { notif_token, status, pay_token, order_id, amount } = req.body;

      if (!notif_token || !status || !pay_token || !order_id) {
        logger.error("Invalid Orange Money callback data:", req.body);
        return res.status(400).json({
          status: false,
          message: "Invalid callback data",
        });
      }

      const order = await Order.findOne({ orderId: order_id });
      if (!order) {
        logger.error(`Order not found for orderId: ${order_id}`);
        return res.status(404).json({
          status: false,
          message: "Order not found",
        });
      }

      if (status === "SUCCESS") {
        order.status = "Processing";
        order.transactionId = pay_token;
        await order.save();

        logger.info(`Orange Money payment successful for order ${order_id}`);

        // Redirect to success page
        res.redirect(
          `${process.env.FRONTEND_URL}/payment/success?reference=${pay_token}&orderId=${order._id}`
        );
      } else {
        order.status = "Cancelled";
        await order.save();

        logger.info(
          `Orange Money payment failed for order ${order_id}, status: ${status}`
        );

        res.redirect(
          `${process.env.FRONTEND_URL}/payment/cancel?orderId=${order._id}`
        );
      }
    } catch (error) {
      logger.error("Orange Money callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
    }
  }
}

module.exports = new OrangeMoneyController();

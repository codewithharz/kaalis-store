// backend/controllers/orderController.js
const Order = require("../models/orderModels");
const Product = require("../models/productModels");
// const Seller = require("../models/sellerModels");
const CluesBucks = require("../models/cluesBucksModel");
const Coupon = require("../models/couponModels");
const Cart = require("../models/cartModels");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const {
      address,
      paymentMethod,
      seller,
      products,
      subtotal,
      shippingFee = 0,
      total,
      totalAmount,
      vendorAmount,
      platformFee,
      couponCode,
      couponDiscount,
      cluesBucks,
    } = req.body;
    const userId = req.user._id;

    // Log the values
    console.log("Order creation values:", {
      subtotal,
      shippingFee,
      total,
      totalAmount,
      vendorAmount,
      platformFee,
    });

    // Validate seller exists
    if (!seller) {
      return res.status(400).json({
        message: "Seller ID is required",
      });
    }

    // Validate products array
    if (!products || !products.length) {
      // Changed from items
      return res.status(400).json({
        message: "Products are required",
      });
    }

    // Validate product and seller
    const firstProduct = await Product.findById(products[0].product).populate(
      // Changed from items
      "user"
    );

    console.log("Raw products from request:", products);

    // Handle coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });

      if (!coupon) {
        return res.status(400).json({ message: "Coupon not found" });
      }

      // For CluesBucks coupons, only check if it exists
      if (couponCode.startsWith("CBM")) {
        appliedCoupon = coupon;
      } else {
        // For regular coupons, check validity
        if (!coupon.isValid()) {
          return res
            .status(400)
            .json({ message: "Coupon has expired or reached maximum usage" });
        }
        appliedCoupon = coupon;
      }

      // Increment usage count
      coupon.usedCount += 1;
      await coupon.save();
    }

    // Handle CluesBucks
    if (cluesBucks?.pointsUsed) {
      const userCluesBucks = await CluesBucks.findOne({ user: userId });
      if (!userCluesBucks || userCluesBucks.balance < cluesBucks.pointsUsed) {
        return res
          .status(400)
          .json({ message: "Insufficient CluesBucks balance" });
      }
    }

    const calculatedTotal =
      subtotal - (couponDiscount || 0) - (cluesBucks?.discount || 0);

    // Verify total amount
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      throw new Error("Total amount mismatch");
    }

    // Verify final total including shipping
    const finalTotal = totalAmount + (shippingFee || 0);
    if (Math.abs(finalTotal - total) > 0.01) {
      throw new Error("Final total mismatch");
    }

    // Validate fee split
    if (Math.abs(vendorAmount + platformFee - total) > 0.01) {
      // Calculate the base platform fee (8% of subtotal)
      const basePlatformFee = products.reduce(
        (sum, item) => sum + item.platformFee,
        0
      );
      // Expected platform fee is base fee plus shipping
      const expectedPlatformFee = basePlatformFee + shippingFee;

      console.log("Fee split mismatch:", {
        vendorAmount,
        platformFee,
        expectedPlatformFee,
        basePlatformFee,
        shippingFee,
        total,
        sum: vendorAmount + platformFee,
      });
      return res.status(400).json({
        message: "Fee split mismatch with total amount",
        debug: {
          vendorAmount,
          platformFee,
          expectedPlatformFee,
          basePlatformFee,
          shippingFee,
          total,
          sum: vendorAmount + platformFee,
        },
      });
    }

    // Calculate final amount
    const cluesBucksDiscount = cluesBucks?.discount || 0;
    const totalDiscount = (couponDiscount || 0) + cluesBucksDiscount;
    const finalAmount = subtotal - totalDiscount;

    // Create order
    const newOrder = new Order({
      user: userId,
      seller,
      products,
      subtotal,
      totalAmount: total, // Use total here
      shippingFee,
      vendorAmount,
      platformFee,
      status: "Pending",
      address,
      paymentMethod,
      appliedCoupon: couponCode
        ? await Coupon.findOne({ code: couponCode })
        : null,
      discount: couponDiscount || 0,
      cluesBucks: {
        pointsEarned: cluesBucks?.pointsEarned || 0,
        pointsUsed: cluesBucks?.pointsUsed || 0,
        discount: cluesBucksDiscount,
      },
    });

    // Log the values
    console.log("Order creation values:", {
      subtotal,
      shippingFee,
      total,
      totalAmount,
      vendorAmount,
      platformFee,
    });

    await newOrder.save();
    console.log("Order saved successfully:", newOrder._id);

    // Handle CluesBucks transactions
    if (cluesBucks?.pointsUsed || cluesBucks?.pointsEarned) {
      await CluesBucks.findOneAndUpdate(
        { user: userId },
        {
          $inc: {
            balance:
              (cluesBucks.pointsEarned || 0) - (cluesBucks.pointsUsed || 0),
            lifetimePoints: cluesBucks.pointsEarned || 0,
          },
          $push: {
            transactions: [
              cluesBucks.pointsUsed && {
                type: "spent",
                points: cluesBucks.pointsUsed,
                description: `Used for order #${newOrder.orderId}`,
                source: "order_discount",
                orderId: newOrder._id,
              },
              {
                type: "earned",
                points: cluesBucks.pointsEarned || 0,
                description: `Earned from order #${newOrder.orderId}`,
                source: "purchase",
                orderId: newOrder._id,
              },
            ].filter(Boolean),
          },
        }
      );
    }

    // Update products and clear cart
    await Promise.all([
      ...products.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity },
        })
      ),
      Cart.findOneAndUpdate({ user: userId }, { $set: { products: [] } }),
    ]);

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// Get order by ID (modified to check if the requester is the seller)
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const { status, transactionId } = req.body;

  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "products.product",
        model: "Product",
        select: "name images price description brand",
      })
      .populate("user", "username email")
      .populate("seller", "name email");
    // .lean(); //Removed .lean() since we need to modify and save the document

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Debug log to verify populated data
    console.log(
      "Populated products:",
      order.products.map((p) => ({
        id: p.product?._id,
        name: p.product?.name,
        hasImages: Boolean(p.product?.images?.length),
      }))
    );

    // Check if the requester is the seller, the user, or an admin
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== order.user._id.toString() &&
      req.user._id.toString() !== order.seller._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    // Update order status and transaction ID if provided
    order.status = status;
    if (transactionId) {
      order.transactionId = transactionId;
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      status: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

const getOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId: orderId })
      .populate({
        path: "products.product", // Changed from items to products and product to product (from the schema)
        model: "Product", // Explicitly specify the model
        select: "name images price description brand", // Add any other fields you need for the product details here
      })
      .populate("user", "username email") // Populate user details for the order
      .populate("seller", "name email") // Populate seller details for the order
      .lean(); // Convert to plain JS object for modification (if needed)

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Add debug logging
    console.log(
      "Fetched order products:",
      order.products.map((p) => ({
        id: p.product?._id,
        name: p.product?.name,
        hasImages: p.product?.images?.length > 0,
      }))
    );

    // Check if the requester is authorized to view this order
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== order.user.toString() &&
      req.user._id.toString() !== order.seller.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.product",
        select: "name images price description", // Add any other fields you need
      })
      .populate("ratedProducts.product")
      .sort("-createdAt");

    console.log("Fetched orders with products:", orders); // Debug log

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New function: Get orders by seller ID
const getOrdersBySeller = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const orders = await Order.find({ seller: sellerId });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all orders (admin route)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "products.product",
        model: "Product",
        select: "name images price description brand",
      })
      .populate("user", "username email")
      .populate("seller", "name email")
      .sort("-createdAt")
      .lean();

    // Add debug logging
    console.log(
      "Fetched orders with populated products:",
      orders.map((order) => ({
        orderId: order.orderId,
        products: order.products.map((p) => ({
          id: p.product?._id,
          name: p.product?.name,
          hasImages: Boolean(p.product?.images?.length),
        })),
      }))
    );

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all possible order statuses
const getOrderStatuses = async (req, res) => {
  try {
    const statuses = Order.schema.path("status").enumValues;
    res.status(200).json({ statuses });
  } catch (error) {
    console.error("Error fetching order statuses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  const { products, address } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    // Verify user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to modify this order",
      });
    }

    // Only allow modifications for pending orders
    if (order.status !== "Pending") {
      return res.status(400).json({
        status: false,
        message: "Can only modify pending orders",
      });
    }

    // Update products if provided
    if (products) {
      order.products = products;
      // Recalculate total amount if needed
      const newTotalAmount = await calculateOrderTotal(products);
      order.totalAmount = newTotalAmount;
    }

    // Update address if provided
    if (address) {
      // Validate required address fields
      const requiredFields = [
        "street",
        "city",
        "state",
        "country",
        "postalCode",
      ];
      const missingFields = requiredFields.filter((field) => !address[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          status: false,
          message: `Missing required address fields: ${missingFields.join(
            ", "
          )}`,
        });
      }

      order.address = address;
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      status: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Helper function to calculate order total
const calculateOrderTotal = async (products) => {
  let total = 0;
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
};

// Update order status (modified to allow seller access)
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, transactionId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only verify that the user is authorized to update this order
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== order.seller.toString() &&
      req.user._id.toString() !== order.user.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    // Allow payment status updates for the order owner
    if (req.user._id.toString() === order.user.toString()) {
      if (status === "Processing" && transactionId) {
        order.status = status;
        order.transactionId = transactionId;
      } else if (status === "Cancelled") {
        order.status = status;
      } else {
        return res.status(403).json({
          message:
            "Users can only update payment status or cancel their orders",
        });
      }
    }
    // Allow sellers to update fulfillment status
    else if (req.user._id.toString() === order.seller.toString()) {
      order.status = status;
    }
    // Allow admins to update any status
    else if (req.user.role === "admin") {
      order.status = status;
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      status: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Payment status updates (handled by user/system)
const updatePaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { transactionId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update payment-related fields
    order.status = "Processing"; // Move from Pending to Processing
    order.transactionId = transactionId;
    await order.save();

    res.json({ message: "Payment status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment status" });
  }
};

// Fulfillment status updates (handled by seller)
const updateFulfillmentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify seller owns this order
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Validate status transition
    if (!["Processing", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
};

// In orderController.js, update the cancelOrder function:

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  try {
    // Find the order first to check its current status
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    // Only allow cancellation of pending or processing orders
    if (!["Pending", "Processing"].includes(order.status)) {
      return res.status(400).json({
        status: false,
        message: "Can only cancel pending or processing orders",
      });
    }

    // Verify user owns this order or is an admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to cancel this order",
      });
    }

    // If it's a payment cancellation and status is Pending, delete the order
    if (order.status === "Pending" && reason === "Payment cancelled by user") {
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      return res.status(200).json({
        status: true,
        message: "Order deleted successfully",
        order: deletedOrder,
      });
    }

    // Otherwise just mark as cancelled
    const cancelledOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "Cancelled",
        cancelReason: reason || "Cancelled by user",
        cancelledAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Order cancelled successfully",
      order: cancelledOrder,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrderByOrderId,
  updateOrderDetails,
  getOrdersByUser,
  getOrdersBySeller,
  getAllOrders,
  getOrderStatuses,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  updatePaymentStatus,
  updateFulfillmentStatus,
};

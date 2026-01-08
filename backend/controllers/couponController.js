// backend/controllers/couponController.js
const Coupon = require("../models/couponModels");
const Cart = require("../models/cartModels");
const User = require("../models/userModels");
const crypto = require("crypto");
const mongoose = require("mongoose");
require("dotenv").config();

// Create Coupon
const createCoupon = async (req, res) => {
  const { code, discountPercentage, expiryDate, maxUsage } = req.body;
  const sellerId = req.user._id;

  try {
    if (!process.env.COUPON_SECRET) {
      throw new Error("COUPON_SECRET is not set in environment variables");
    }

    const existingCoupon = await Coupon.findOne({ code, sellerId });
    if (existingCoupon) {
      return res
        .status(400)
        .json({ message: "Coupon code already exists for this seller" });
    }

    const formattedExpiryDate = new Date(expiryDate)
      .toISOString()
      .split("T")[0];
    const dataToSign = `${code}${discountPercentage}${formattedExpiryDate}${maxUsage}`;

    let signature;
    try {
      signature = crypto
        .createHmac("sha256", process.env.COUPON_SECRET)
        .update(dataToSign)
        .digest("hex");
    } catch (cryptoError) {
      console.error("Error creating signature:", cryptoError);
      return res.status(500).json({
        message: "Error creating coupon signature",
        error: cryptoError.message,
      });
    }

    const newCoupon = new Coupon({
      code,
      discountPercentage,
      expiryDate: formattedExpiryDate,
      maxUsage,
      signature,
      sellerId,
    });

    await newCoupon.save();

    res
      .status(201)
      .json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    if (error.message === "COUPON_SECRET is not set in environment variables") {
      return res
        .status(500)
        .json({ message: "Server configuration error", error: error.message });
    }
    res.status(500).json({
      message: "Server error",
      error: error.message || "An unexpected error occurred",
    });
  }
};

// Validate Coupon
const validateCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const formattedExpiryDate = new Date(coupon.expiryDate)
      .toISOString()
      .split("T")[0];
    const dataToSign = `${coupon.code}${coupon.discountPercentage}${formattedExpiryDate}${coupon.maxUsage}`;
    const recomputedSignature = crypto
      .createHmac("sha256", process.env.COUPON_SECRET)
      .update(dataToSign)
      .digest("hex");

    // Debugging log
    // console.log("Data to Sign:", dataToSign);
    // console.log("Recomputed Signature:", recomputedSignature);
    // console.log("Original Signature:", coupon.signature);

    if (recomputedSignature !== coupon.signature) {
      return res.status(400).json({ message: "Invalid coupon signature" });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({ message: "Coupon is not valid" });
    }

    res.status(200).json({
      message: "Coupon is valid",
      discount: coupon.discountPercentage,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Using the Coupon
const applyCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({ message: "Coupon is not valid" });
    }

    // Increment the used count
    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      },
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const invalidateCoupon = async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    coupon.usedCount += 1;
    if (coupon.usedCount >= coupon.maxUsage) {
      coupon.active = false;
    }
    await coupon.save();
    res.status(200).json({ message: "Coupon invalidated successfully" });
  } catch (error) {
    console.error("Error invalidating coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Seller Coupons
const getSellerCoupons = async (req, res) => {
  const sellerId = req.user._id;
  try {
    const coupons = await Coupon.find({ sellerId });
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching seller coupons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// getAllCoupons function to handle both admin and seller requests
const getAllCoupons = async (req, res) => {
  try {
    let coupons;
    if (req.user.isAdmin) {
      // If admin, fetch all coupons
      coupons = await Coupon.find().populate("sellerId", "username storeName");
    } else {
      // If seller, fetch only their coupons
      coupons = await Coupon.find({ sellerId: req.user._id });
    }
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Coupon by couponId
const getCouponById = async (req, res) => {
  const { couponId } = req.params;

  if (!couponId || !mongoose.Types.ObjectId.isValid(couponId)) {
    return res.status(400).json({ message: "Invalid coupon ID" });
  }

  try {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Coupon by couponId
const updateCoupon = async (req, res) => {
  const { couponId } = req.params;
  const sellerId = req.user._id;
  const { code, discountPercentage, expiryDate, maxUsage, active } = req.body;

  //   console.log("Request params:", req.params); //verify the incoming request parameters
  //   console.log("Request body:", req.body); //incoming request body

  if (!couponId || !mongoose.Types.ObjectId.isValid(couponId)) {
    return res.status(400).json({ message: "Invalid coupon ID" });
  }

  try {
    const coupon = await Coupon.findOne({ _id: couponId, sellerId });
    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found or you're not authorized to update it",
      });
    }

    // Only update fields if they are provided
    coupon.code = code !== undefined ? code : coupon.code;
    coupon.discountPercentage =
      discountPercentage !== undefined
        ? discountPercentage
        : coupon.discountPercentage;
    coupon.expiryDate =
      expiryDate !== undefined ? new Date(expiryDate) : coupon.expiryDate;
    coupon.maxUsage = maxUsage !== undefined ? maxUsage : coupon.maxUsage;
    coupon.active = active !== undefined ? active : coupon.active;

    // Regenerate signature
    const formattedExpiryDate = coupon.expiryDate.toISOString().split("T")[0];
    const dataToSign = `${coupon.code}${coupon.discountPercentage}${formattedExpiryDate}${coupon.maxUsage}`;
    coupon.signature = crypto
      .createHmac("sha256", process.env.COUPON_SECRET)
      .update(dataToSign)
      .digest("hex");

    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully", coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Coupon by couponId
const deleteCoupon = async (req, res) => {
  const { couponId } = req.params;
  const sellerId = req.user._id;

  try {
    const coupon = await Coupon.findOneAndDelete({ _id: couponId, sellerId });
    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found or you're not authorized to delete it",
      });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeCoupon = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate current cart total
    const cartTotal = cart.products.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );

    // Find the applied coupon for this user (checking both methods)
    const appliedCoupon = await Coupon.findOne({
      $or: [{ appliedBy: userId }, { code: cart.couponCode }],
    });

    if (!appliedCoupon) {
      return res.status(200).json({
        message: "No coupon was applied to remove",
        cart: {
          totalAmount: cartTotal,
          previousDiscount: 0,
        },
      });
    }

    // Update appliedBy array if it exists
    if (Array.isArray(appliedCoupon.appliedBy)) {
      appliedCoupon.appliedBy = appliedCoupon.appliedBy.filter(
        (id) => !id.equals(userId)
      );
    } else {
      appliedCoupon.appliedBy = [];
    }

    // Decrement the usedCount
    if (appliedCoupon.usedCount > 0) {
      appliedCoupon.usedCount -= 1;
    }

    // Remove coupon from cart
    cart.couponCode = null;

    // Save both changes
    await Promise.all([
      appliedCoupon.save().catch((err) => {
        console.warn("Failed to update coupon, but continuing:", err);
        // Continue even if coupon update fails
      }),
      cart.save(),
    ]);

    // Calculate the previous discount
    const previousDiscount =
      (cartTotal * appliedCoupon.discountPercentage) / 100;

    res.status(200).json({
      message: "Coupon removed successfully",
      cart: {
        totalAmount: cartTotal,
        previousDiscount: previousDiscount,
      },
    });
  } catch (error) {
    console.error("Error removing coupon:", error);
    res.status(500).json({
      message: "Failed to remove coupon",
      error: error.message,
    });
  }
};

module.exports = {
  createCoupon,
  validateCoupon,
  applyCoupon,
  invalidateCoupon,
  getSellerCoupons,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  removeCoupon,
};

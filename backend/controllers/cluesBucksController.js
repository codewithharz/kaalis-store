// backend/controllers/cluesBucksController.js
const CluesBucks = require("../models/cluesBucksModel");
const SpecialOffer = require("../models/specialOfferModel");
const Coupon = require("../models/couponModels");
const crypto = require("crypto");

exports.getCluesBucksStats = async (req, res) => {
  try {
    let cluesBucks = await CluesBucks.findOne({ user: req.user._id });

    if (!cluesBucks) {
      cluesBucks = await CluesBucks.create({
        user: req.user._id,
        balance: 0,
        lifetimePoints: 0,
        transactions: [],
      });
    }

    console.log("CluesBucks data:", cluesBucks);
    const pointsExpiringSoon = cluesBucks.transactions
      .filter((t) => t.expiryDate && new Date(t.expiryDate) > new Date())
      .reduce((sum, t) => sum + t.points, 0);

    res.json({
      currentBalance: cluesBucks.balance,
      lifetimePoints: cluesBucks.lifetimePoints,
      pointsExpiringSoon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCluesBucksTransactions = async (req, res) => {
  try {
    const cluesBucks = await CluesBucks.findOne({ user: req.user._id })
      .populate("transactions.orderId")
      .sort({ "transactions.createdAt": -1 });

    if (!cluesBucks) {
      return res.json({ transactions: [] });
    }

    res.json({
      success: true,
      transactions: cluesBucks.transactions.map((t) => ({
        _id: t._id,
        type: t.type,
        points: t.points,
        description: t.description,
        source: t.source,
        createdAt: t.createdAt,
        metadata: t.metadata,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// exports.redeemPoints = async (req, res) => {
//   try {
//     const { optionId, points, type } = req.body;
//     const userId = req.user._id;

//     const cluesBucks = await CluesBucks.findOne({ user: userId });

//     if (!cluesBucks || cluesBucks.balance < points) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient points balance",
//       });
//     }

//     // Generate a unique coupon code
//     const couponCode = `CB${Date.now().toString(36).toUpperCase()}`;

//     // Calculate expiry date (30 days from now)
//     const expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + 30);
//     const formattedExpiryDate = expiryDate.toISOString().split("T")[0];

//     // Create signature for the coupon
//     const dataToSign = `${couponCode}${1}${formattedExpiryDate}${1}`; // Use 1 for discountPercentage
//     const signature = crypto
//       .createHmac("sha256", process.env.COUPON_SECRET)
//       .update(dataToSign)
//       .digest("hex");

//     // Create a new coupon with required discountPercentage
//     const newCoupon = await Coupon.create({
//       code: couponCode,
//       discountPercentage: 1,
//       expiryDate: formattedExpiryDate,
//       maxUsage: 1,
//       signature,
//       sellerId: userId,
//       active: true,
//     });

//     // Add redemption transaction
//     cluesBucks.balance -= points;
//     cluesBucks.transactions.push({
//       type: "spent",
//       points,
//       description: `Redeemed for ₦1000 discount coupon (${couponCode})`,
//       source: "redemption",
//       metadata: {
//         couponCode,
//         isCluesBucks: true,
//         fixedAmount: 1000, // Store the fixed amount in metadata
//       },
//     });

//     await cluesBucks.save();

//     res.json({
//       success: true,
//       message:
//         "Points redeemed successfully. Your coupon code is: " + couponCode,
//       newBalance: cluesBucks.balance,
//       coupon: {
//         code: couponCode,
//         discountAmount: 1000, // For display purposes
//         expiryDate: formattedExpiryDate,
//       },
//     });
//   } catch (error) {
//     console.error("Error redeeming points:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

exports.redeemPoints = async (req, res) => {
  try {
    const { optionId, points, type } = req.body;
    const userId = req.user._id;

    const cluesBucks = await CluesBucks.findOne({ user: userId });

    if (!cluesBucks || cluesBucks.balance < points) {
      return res.status(400).json({
        success: false,
        message: "Insufficient points balance",
      });
    }

    // Deduct points first (common for all redemption types)
    cluesBucks.balance -= points;

    // Handle different redemption types
    if (type === "offer") {
      // Handle special offer access
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      // Create the transaction object
      const transaction = {
        type: "spent",
        points,
        description: "Redeemed for Special Offer Access",
        source: "redemption",
        metadata: {
          type: "offer",
          validUntil,
          offerAccess: true,
        },
      };

      // Create a temporary document for validation with required user field
      const tempDoc = new CluesBucks({
        user: userId, // Set the required user field
        transactions: [transaction],
      });

      // Validate just the new transaction
      await tempDoc.validate();

      // If validation passed, add to the real document
      cluesBucks.transactions.push(transaction);
      await cluesBucks.save();

      return res.json({
        success: true,
        message: "Special Offer Access unlocked successfully",
        newBalance: cluesBucks.balance,
        offerAccess: {
          validUntil,
        },
      });
    } else if (type === "credit") {
      // Handle store credit redemption
      cluesBucks.transactions.push({
        type: "spent",
        points,
        description: "Convert points to store credit",
        source: "redemption",
        metadata: {
          type: "credit",
          isStoreCredit: true,
          amount: 2000,
        },
      });

      await cluesBucks.save();

      return res.json({
        success: true,
        message: "Points converted to store credit successfully",
        newBalance: cluesBucks.balance,
        storeCredit: {
          amount: 2000,
        },
      });
    } else {
      // Original coupon redemption logic
      const couponCode = `CB${Date.now().toString(36).toUpperCase()}`;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      const formattedExpiryDate = expiryDate.toISOString().split("T")[0];

      const dataToSign = `${couponCode}${1}${formattedExpiryDate}${1}`;
      const signature = crypto
        .createHmac("sha256", process.env.COUPON_SECRET)
        .update(dataToSign)
        .digest("hex");

      const newCoupon = await Coupon.create({
        code: couponCode,
        discountPercentage: 1,
        expiryDate: formattedExpiryDate,
        maxUsage: 1,
        signature,
        sellerId: userId,
        active: true,
      });

      cluesBucks.transactions.push({
        type: "spent",
        points,
        description: `Redeemed for ₦1000 discount coupon (${couponCode})`,
        source: "redemption",
        metadata: {
          type: "coupon",
          couponCode,
          isCluesBucks: true,
          fixedAmount: 1000,
          validUntil: expiryDate,
        },
      });

      await cluesBucks.save();

      return res.json({
        success: true,
        message:
          "Points redeemed successfully. Your coupon code is: " + couponCode,
        newBalance: cluesBucks.balance,
        coupon: {
          code: couponCode,
          discountAmount: 1000,
          expiryDate: formattedExpiryDate,
        },
      });
    }
  } catch (error) {
    console.error("Error redeeming points:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.earnPoints = async (req, res) => {
  try {
    const { points, source } = req.body;
    let cluesBucks = await CluesBucks.findOne({ user: req.user._id });

    if (!cluesBucks) {
      cluesBucks = new CluesBucks({ user: req.user._id });
    }

    // Add earnings to balance and lifetime points
    cluesBucks.balance += points;
    cluesBucks.lifetimePoints += points;

    // Add transaction record
    cluesBucks.transactions.push({
      type: "earned",
      points,
      description: `Earned from ${source}`,
      source,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
    });

    await cluesBucks.save();

    res.json({
      success: true,
      newBalance: cluesBucks.balance,
      lifetimePoints: cluesBucks.lifetimePoints,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.checkOfferAccess = async (req, res) => {
  try {
    const userId = req.user._id;
    const cluesBucks = await CluesBucks.findOne({ user: userId });

    if (!cluesBucks) {
      return res.json({ hasAccess: false });
    }

    // Find the latest valid offer access from transactions
    const latestOfferAccess = cluesBucks.transactions
      .filter(
        (t) =>
          t.type === "spent" &&
          ((t.metadata?.type === "offer" &&
            t.metadata.validUntil &&
            new Date(t.metadata.validUntil) > new Date()) ||
            (t.metadata?.type === "credit" &&
              t.description.includes("Convert points to store credit")))
      )
      .sort(
        (a, b) =>
          new Date(b.metadata.validUntil || b.createdAt) -
          new Date(a.metadata.validUntil || a.createdAt)
      )[0];

    res.json({
      hasAccess: !!latestOfferAccess,
      validUntil:
        latestOfferAccess?.metadata?.validUntil ||
        (latestOfferAccess?.createdAt
          ? new Date(
              new Date(latestOfferAccess.createdAt).getTime() +
                30 * 24 * 60 * 60 * 1000
            )
          : null),
    });
  } catch (error) {
    console.error("Error checking offer access:", error);
    res.status(500).json({
      message: "Error checking offer access",
      error: error.message,
    });
  }
};

exports.getSpecialOffers = async (req, res) => {
  try {
    const userId = req.user._id;
    const cluesBucks = await CluesBucks.findOne({ user: userId });

    // // Check if user has valid offer access
    // const hasValidAccess = cluesBucks?.transactions.some(
    //   (t) =>
    //     t.type === "spent" &&
    //     ((t.metadata?.type === "offer" &&
    //       t.metadata.validUntil &&
    //       new Date(t.metadata.validUntil) > new Date()) ||
    //       (t.metadata?.type === "credit" &&
    //         t.description.includes("Convert points to store credit")))
    // );

    // Check if user has valid offer access
    const hasValidAccess = cluesBucks?.transactions.some((t) => {
      // Check transactions with metadata
      if (
        t.metadata?.type === "offer" &&
        t.metadata.validUntil &&
        new Date(t.metadata.validUntil) > new Date()
      ) {
        return true;
      }

      // Check transactions with store credit
      if (
        t.metadata?.type === "credit" &&
        t.description.includes("Convert points to store credit")
      ) {
        return true;
      }

      // Also check legacy transactions without metadata
      if (
        t.type === "spent" &&
        t.description.includes("Special Offer Access")
      ) {
        return true;
      }

      return false;
    });

    // Get active special offers
    const offers = await SpecialOffer.find({
      startDate: { $lte: new Date() },
      endDate: { $gt: new Date() },
      status: "active",
      // If requiresAccess is true, only return if user has valid access
      $or: [
        { requiresAccess: false },
        { requiresAccess: { $eq: !hasValidAccess } },
      ],
    }).sort({ startDate: -1 });

    console.log("Found active offers:", offers);

    res.json({
      success: true,
      hasAccess: hasValidAccess,
      offers: offers.map((offer) => ({
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        startDate: offer.startDate,
        endDate: offer.endDate,
        category: offer.category,
        requiresAccess: offer.requiresAccess,
        minimumPurchase: offer.minimumPurchase || 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching special offers:", error);
    res.status(500).json({
      message: "Error fetching special offers",
      error: error.message,
    });
  }
};

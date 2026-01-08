// backend/controllers/specialOfferController.js
const SpecialOffer = require("../models/specialOfferModel");
const CluesBucks = require("../models/cluesBucksModel");
const Category = require("../models/categoryModels");
const mongoose = require("mongoose");

exports.createOffer = async (req, res) => {
  try {
    // Validate category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const offer = await SpecialOffer.create(req.body);

    // Populate category information in response
    await offer.populate("category", "name slug");
    await offer.populate("categoryPath", "name slug");

    res.status(201).json({
      success: true,
      offer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create special offer",
      error: error.message,
    });
  }
};

exports.getOffers = async (req, res) => {
  try {
    const cluesBucks = await CluesBucks.findOne({ user: req.user._id });
    const hasValidAccess = cluesBucks?.transactions.some(
      (t) =>
        t.type === "spent" &&
        ((t.metadata?.type === "offer" &&
          t.metadata.validUntil &&
          new Date(t.metadata.validUntil) > new Date()) ||
          (t.metadata?.type === "credit" &&
            t.description.includes("Convert points to store credit")))
    );

    // Get all active offers - no need for additional populate calls
    const offers = await SpecialOffer.findActiveOffers(hasValidAccess);

    res.json({
      success: true,
      hasAccess: hasValidAccess,
      offers: offers.map((offer) => ({
        _id: offer._id,
        title: offer.title || "",
        description: offer.description || "",
        discount: offer.discount || 0,
        startDate: offer.startDate,
        endDate: offer.endDate,
        category: offer.category,
        categoryPath: offer.categoryPath || [],
        requiresAccess: offer?.requiresAccess ?? false,
        minimumPurchase: offer?.minimumPurchase || 0,
      })),
    });
  } catch (error) {
    console.error("Error in getOffers:", error); // Add detailed logging
    res.status(500).json({
      success: false,
      message: "Error fetching special offers",
      error: error.message,
    });
  }
};

exports.getOffersByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const cluesBucks = await CluesBucks.findOne({ user: req.user._id });
    const hasValidAccess = cluesBucks?.transactions.some(
      (t) =>
        t.type === "spent" &&
        ((t.metadata?.type === "offer" &&
          t.metadata.validUntil &&
          new Date(t.metadata.validUntil) > new Date()) ||
          (t.metadata?.type === "credit" &&
            t.description.includes("Convert points to store credit")))
    );

    const offers = await SpecialOffer.findActiveOffersByCategory(
      categoryId,
      hasValidAccess
    )
      .populate("category", "name slug")
      .populate("categoryPath", "name slug");

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
        category: {
          _id: offer.category._id,
          name: offer.category.name,
          slug: offer.category.slug,
        },
        categoryPath: offer.categoryPath.map((cat) => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
        })),
        requiresAccess: offer.requiresAccess,
        minimumPurchase: offer.minimumPurchase,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category offers",
      error: error.message,
    });
  }
};

exports.validateOffer = async (req, res) => {
  try {
    const { offerId, productId, cartTotal } = req.body;

    const offer = await SpecialOffer.findById(offerId)
      .populate("category", "name slug")
      .populate("categoryPath", "name slug");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Check if offer is active
    if (!offer.isActive) {
      return res.status(400).json({
        success: false,
        message: "Offer has expired",
      });
    }

    // Check minimum purchase requirement
    if (cartTotal < offer.minimumPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount of ₦${offer.minimumPurchase} required`,
      });
    }

    // Check if user has valid access if required
    if (offer.requiresAccess) {
      const cluesBucks = await CluesBucks.findOne({ user: req.user._id });
      const hasValidAccess = cluesBucks?.transactions.some(
        (t) =>
          t.type === "spent" &&
          ((t.metadata?.type === "offer" &&
            t.metadata.validUntil &&
            new Date(t.metadata.validUntil) > new Date()) ||
            (t.metadata?.type === "credit" &&
              t.description.includes("Convert points to store credit")))
      );

      if (!hasValidAccess) {
        return res.status(403).json({
          success: false,
          message: "Special offer access required",
        });
      }
    }

    res.json({
      success: true,
      offer: {
        _id: offer._id,
        title: offer.title,
        discount: offer.discount,
        category: offer.category,
        categoryPath: offer.categoryPath,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validating offer",
      error: error.message,
    });
  }
};

// Keep other controller methods...
exports.getOffer = async (req, res) => {
  try {
    const offer = await SpecialOffer.findById(req.params.id)
      .populate("category", "name slug")
      .populate("categoryPath", "name slug");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.json({
      success: true,
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching offer",
      error: error.message,
    });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    // If category is being updated, validate it exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
    }

    const offer = await SpecialOffer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("category", "name slug")
      .populate("categoryPath", "name slug");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.json({
      success: true,
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating offer",
      error: error.message,
    });
  }
};

// Add these to specialOfferController.js

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await SpecialOffer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting offer",
      error: error.message,
    });
  }
};

exports.useOffer = async (req, res) => {
  try {
    const offer = await SpecialOffer.findById(req.params.id)
      .populate("category", "name slug")
      .populate("categoryPath", "name slug");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Check if offer is still active
    if (!offer.isActive) {
      return res.status(400).json({
        success: false,
        message: "Offer has expired",
      });
    }

    // Check if user has valid access if required
    if (offer.requiresAccess) {
      const cluesBucks = await CluesBucks.findOne({ user: req.user._id });
      const hasValidAccess = cluesBucks?.transactions.some(
        (t) =>
          t.type === "spent" &&
          ((t.metadata?.type === "offer" &&
            t.metadata.validUntil &&
            new Date(t.metadata.validUntil) > new Date()) ||
            (t.metadata?.type === "credit" &&
              t.description.includes("Convert points to store credit")))
      );

      if (!hasValidAccess) {
        return res.status(403).json({
          success: false,
          message: "Special offer access required",
        });
      }
    }

    // Record the usage
    await offer.recordUsage(req.user._id);

    res.json({
      success: true,
      message: "Offer used successfully",
      offer: {
        _id: offer._id,
        title: offer.title,
        discount: offer.discount,
        category: offer.category,
        categoryPath: offer.categoryPath,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error using offer",
      error: error.message,
    });
  }
};

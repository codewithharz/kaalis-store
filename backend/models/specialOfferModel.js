// backend/models/specialOfferModel.js
const mongoose = require("mongoose");

const specialOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      validate: {
        validator: Number.isInteger,
        message: "Discount must be a whole number",
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    requiresAccess: {
      type: Boolean,
      default: true,
    },
    // Updated category field to reference Category model
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // Add categoryPath to store full category ancestry
    categoryPath: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    minimumPurchase: {
      type: Number,
      default: 0,
    },
    maxUsagePerUser: {
      type: Number,
      default: null,
    },
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to populate categoryPath
specialOfferSchema.pre("save", async function (next) {
  if (this.isModified("category")) {
    try {
      const Category = mongoose.model("Category");
      const category = await Category.findById(this.category);
      if (category) {
        // Get ancestors including the category itself
        this.categoryPath = [...(category.ancestors || []), category._id];
      }
    } catch (error) {
      next(error);
    }
  }

  // Handle expiration
  if (this.endDate < new Date()) {
    this.status = "expired";
  }

  next();
});

// Index for efficient querying
specialOfferSchema.index({
  status: 1,
  startDate: 1,
  endDate: 1,
  requiresAccess: 1,
  category: 1,
  categoryPath: 1,
});

// Static method to find active offers by category
specialOfferSchema.statics.findActiveOffersByCategory = async function (
  categoryId,
  hasAccess = false
) {
  const Category = mongoose.model("Category");
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const now = new Date();

  // Find offers that apply to this category or any of its ancestors
  return this.find({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gt: now },
    categoryPath: { $in: [...(category.ancestors || []), category._id] },
    $or: [{ requiresAccess: false }, { requiresAccess: { $eq: hasAccess } }],
  })
    .populate("category", "name slug")
    .sort({ discount: -1 }); // Highest discount first
};

specialOfferSchema.statics.findActiveOffers = async function (
  hasAccess = false
) {
  try {
    const now = new Date();

    // Return a Query object instead of executing the find immediately
    const query = this.find({
      status: "active",
      startDate: { $lte: now },
      endDate: { $gt: now },
      $or: [{ requiresAccess: false }, { requiresAccess: { $eq: hasAccess } }],
    });

    // Find all active offers
    const offers = await this.find(query)
      .populate({
        path: "category",
        select: "name slug ancestors",
      })
      .populate({
        path: "categoryPath",
        select: "name slug ancestors",
      })
      .sort({ discount: -1 })
      .lean();

    // Only transform if category is missing, but don't default to "general"
    return offers
      .map((offer) => {
        // If the offer has a valid category, return as is
        if (offer.category && offer.category._id) {
          return offer;
        }

        // If no category, find the most relevant parent category
        const categoryPath = offer.categoryPath || [];
        const firstValidCategory = categoryPath.find((cat) => cat && cat._id);

        return {
          ...offer,
          category: firstValidCategory || null,
          categoryPath: categoryPath.filter((cat) => cat && cat._id),
        };
      })
      .filter((offer) => offer.category !== null); // Filter out offers without any valid category
  } catch (error) {
    console.error("Error in findActiveOffers:", error);
    return []; // Return empty array on error
  }
};

// Method to check if offer applies to a product
specialOfferSchema.methods.appliesToProduct = function (product) {
  return this.categoryPath.some(
    (catId) =>
      catId.equals(product.category) ||
      (product.categoryPath && product.categoryPath.includes(catId))
  );
};

// Add other methods from previous version...
specialOfferSchema.methods.hasUserUsedOffer = function (userId) {
  return this.usedBy.some(
    (usage) => usage.user.toString() === userId.toString()
  );
};

specialOfferSchema.methods.recordUsage = function (userId) {
  if (this.maxUsagePerUser && this.hasUserUsedOffer(userId)) {
    throw new Error(
      "User has already used this offer the maximum number of times"
    );
  }

  this.usedBy.push({ user: userId });
  return this.save();
};

specialOfferSchema.virtual("isActive").get(function () {
  const now = new Date();
  return (
    this.status === "active" && this.startDate <= now && this.endDate > now
  );
});

const SpecialOffer = mongoose.model("SpecialOffer", specialOfferSchema);
module.exports = SpecialOffer;

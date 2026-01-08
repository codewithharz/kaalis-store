const mongoose = require("mongoose");

// Enhanced Unit Schema
const unitSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["weight", "volume", "length", "area", "quantity", "time", "other"],
  },
  baseUnit: {
    type: String,
    required: true,
  },
  conversionFactor: {
    type: Number,
    required: true,
    min: 0,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  displayUnit: String,
  packagingUnit: String,
  precision: {
    type: Number,
    default: 2,
    min: 0,
    max: 10,
  },
  compoundUnit: {
    numerator: String,
    denominator: String,
  },
  regionSpecificDisplay: {
    type: Map,
    of: String,
  },
});

// New Color Schema
const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  hexCode: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: (props) => `${props.value} is not a valid hex color code!`,
    },
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    images: [{ type: String, required: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // New color fields
    color: {
      type: String,
      trim: true,
    },
    availableColors: [colorSchema],
    stock: { type: Number, default: 0, min: 0 },
    reservedStock: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    isAvailable: { type: Boolean, default: true },
    variants: [
      {
        attributes: [
          {
            name: { type: String },
            value: { type: String },
          },
        ],
        // Add color to variants
        color: {
          type: colorSchema,
          required: false,
        },
        price: { type: Number },
        stock: { type: Number },
        sku: { type: String, unique: true },
        barcode: {
          type: String,
          validate: {
            validator: function (v) {
              return /^[0-9]{12,14}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid barcode!`,
          },
        },
        weight: { type: Number },
        dimensions: {
          length: { type: Number },
          width: { type: Number },
          height: { type: Number },
        },
        images: [{ type: String }],
      },
    ],
    averageRating: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 },
    brand: { type: String },
    unit: unitSchema,
    bulkPricing: [
      {
        quantity: Number,
        price: Number,
      },
    ],
    tags: {
      type: [{ type: String }],
      validate: {
        validator: function (v) {
          return v.length <= 3;
        },
        message: "You can specify up to 3 tags only.",
      },
    },
    metaTitle: { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
  },
  {
    timestamps: true,
  }
);

// Indexes to improve search performance
productSchema.index({ name: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ "variants.sku": 1 });

// New indexes for color search
productSchema.index({ color: 1 });
productSchema.index({ "availableColors.name": 1 });

// Pre-save hook to generate slug from name if not provided
productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  next();
});

// Virtual for available stock
productSchema.virtual("availableStock").get(function () {
  return this.stock - this.reservedStock;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function () {
  return this.availableStock > 0;
};

// Static method to find products by tag
productSchema.statics.findByTag = function (tag) {
  return this.find({ tags: tag });
};

// New color-related methods
productSchema.methods.isColorAvailable = function (colorName) {
  if (!this.availableColors || this.availableColors.length === 0) {
    return false;
  }
  const color = this.availableColors.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase()
  );
  return color ? color.inStock : false;
};

productSchema.statics.findByColor = function (colorName) {
  return this.find({
    $or: [
      { color: new RegExp(colorName, "i") },
      { "availableColors.name": new RegExp(colorName, "i") },
      { "variants.color.name": new RegExp(colorName, "i") },
    ],
  });
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

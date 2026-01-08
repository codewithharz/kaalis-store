const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    shipmentStatus: {
      type: String,
      enum: ["Pending", "Shipped", "In Transit", "Delivered", "Returned"],
      default: "Pending",
    },
    carrier: { type: String },
    trackingNumber: { type: String },
    estimatedDeliveryDate: { type: Date },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    shippingCost: { type: Number },
    deliveryNotes: { type: String },
    returnStatus: {
      type: String,
      enum: ["Pending", "Initiated", "Received"],
      default: "Pending",
    },
    returnTrackingNumber: { type: String },
    returnShippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    // Integration with external shipping APIs
    shippingAPIResponse: { type: mongoose.Schema.Types.Mixed },
    // Additional fields as needed
  },
  {
    timestamps: true,
  }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);
module.exports = Shipment;

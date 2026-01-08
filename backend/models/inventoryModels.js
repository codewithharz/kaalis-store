const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  warehouseLocation: { type: String },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true }, // 1
    lastName: { type: String, required: true }, // 2
    street: { type: String }, // 6
    city: { type: String }, // 7
    state: { type: String }, // 8
    country: { type: String },
    postalCode: { type: String }, // 4
    houseNo: { type: String }, // 5
    place: { type: String }, // 9
    email: { type: String },
    phone: { type: String, required: true }, // 3
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;

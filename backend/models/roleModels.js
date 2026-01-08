// backend/models/roleModel.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String }, // Optional description for the role
    permissions: [{ type: String }],
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;

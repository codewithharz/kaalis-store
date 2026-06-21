const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);
module.exports = SupportMessage;

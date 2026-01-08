const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    details: { type: String },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
    type: {
      type: String,
      enum: ["Product", "User", "Order", "Other"],
      required: true,
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId, refPath: "type" }, // reference to the reported entity
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // reference to the admin who resolved it
    resolutionNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;

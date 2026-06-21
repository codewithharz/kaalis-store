// backend/scripts/approveHandyHarz.js
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Seller = require("../models/sellerModels");

async function approveHandyHarz() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const seller = await Seller.findOne({ storeName: "Handy Harz" });
    if (!seller) {
      console.log("Seller 'Handy Harz' not found!");
      await mongoose.connection.close();
      return;
    }

    seller.verificationStatus = "approved";
    seller.isVerified = true;
    await seller.save();

    console.log("Successfully approved Handy Harz!");
    console.log("Updated record:", {
      storeName: seller.storeName,
      isVerified: seller.isVerified,
      verificationStatus: seller.verificationStatus,
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

approveHandyHarz();

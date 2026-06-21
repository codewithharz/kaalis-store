// backend/scripts/listAllSellers.js
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Seller = require("../models/sellerModels");
const User = require("../models/userModels");

async function listAllSellers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const sellers = await Seller.find({}).populate("user");
    console.log(`Found ${sellers.length} total sellers:`);
    sellers.forEach((s) => {
      console.log(`- Store: ${s.storeName} (${s.user?.username || 'no user'}) | isVerified: ${s.isVerified} | status: ${s.verificationStatus} | selfShipping: ${s.selfShippingApproved} (${s.selfShippingRequestStatus})`);
    });

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

listAllSellers();

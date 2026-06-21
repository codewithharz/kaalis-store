// backend/scripts/inspectSeller.js
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Seller = require("../models/sellerModels");
const User = require("../models/userModels");

async function inspectSeller() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const seller = await Seller.findOne({ storeName: /Handy Harz/i }).populate("user");
    if (!seller) {
      console.log("Seller 'Handy Harz' not found!");
    } else {
      console.log("Seller profile:", {
        _id: seller._id,
        storeName: seller.storeName,
        isVerified: seller.isVerified,
        verificationStatus: seller.verificationStatus,
        selfShippingApproved: seller.selfShippingApproved,
        selfShippingRequestStatus: seller.selfShippingRequestStatus,
        user: seller.user ? {
          _id: seller.user._id,
          username: seller.user.username,
          email: seller.user.email,
          isSeller: seller.user.isSeller
        } : null
      });

      if (seller.user) {
        const Address = require("../models/addressModels");
        const addresses = await Address.find({ user: seller.user._id });
        console.log(`\nAddresses for ${seller.storeName} (${addresses.length}):`);
        addresses.forEach((addr) => {
          console.log(`- Type: ${addr.isDispatch ? 'Dispatch' : 'Regular'} | Default: ${addr.isDefault} | Phone: ${addr.phone} | Name: ${addr.firstName} ${addr.lastName}`);
        });
      }
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

inspectSeller();

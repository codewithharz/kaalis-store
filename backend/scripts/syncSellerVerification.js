// backend/scripts/syncSellerVerification.js
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Import Seller model
const Seller = require("../models/sellerModels");

async function syncSellerVerification() {
  try {
    console.log("🚀 Starting Seller status synchronization...");
    console.log("📡 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");
    console.log("📊 Database:", mongoose.connection.name);

    // Find all sellers
    const sellers = await Seller.find({});
    console.log(`📋 Found ${sellers.length} total sellers`);

    let updatedCount = 0;
    for (const seller of sellers) {
      let modified = false;

      // Rule 1: If isVerified is true and status is not approved, set it to approved
      if (seller.isVerified && seller.verificationStatus !== "approved") {
        console.log(`   * Updating '${seller.storeName}': isVerified=true, status='${seller.verificationStatus}' -> 'approved'`);
        seller.verificationStatus = "approved";
        modified = true;
      }
      // Rule 2: If status is approved and isVerified is not true, set it to true
      else if (seller.verificationStatus === "approved" && !seller.isVerified) {
        console.log(`   * Updating '${seller.storeName}': status='approved', isVerified='${seller.isVerified}' -> true`);
        seller.isVerified = true;
        modified = true;
      }

      if (modified) {
        await seller.save();
        updatedCount++;
      }
    }

    console.log(`\n✅ Reconciled ${updatedCount} sellers!`);
    await mongoose.connection.close();
    console.log("\n🎉 Synchronization complete! Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Synchronization failed!");
    console.error("Error:", error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

syncSellerVerification();

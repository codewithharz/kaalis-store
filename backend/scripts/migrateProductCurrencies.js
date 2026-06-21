// backend/scripts/migrateProductCurrencies.js
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/productModels");
const User = require("../models/userModels");
const connectDB = require("../utils/db");

async function migrate() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected successfully!");

    console.log("Fetching all products...");
    const products = await Product.find({});
    console.log(`Found ${products.length} products.`);

    let updatedCount = 0;
    for (const product of products) {
      const vendor = await User.findById(product.user);
      const vendorCurrency = vendor?.currency || "NGN";
      
      if (product.currency !== vendorCurrency) {
        await Product.updateOne(
          { _id: product._id },
          { $set: { currency: vendorCurrency } }
        );
        console.log(`- Updated product "${product.name}" (${product._id}) currency from ${product.currency} to ${vendorCurrency}`);
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} products.`);
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

migrate();

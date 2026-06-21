const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const VendorPayout = require("../models/vendorPayoutModels");

async function check() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    const now = new Date();
    
    // Test Ready filter
    console.log("\n=== TESTING READY FILTER ===");
    const readyQuery = {
      status: "pending",
      scheduledDate: { $lte: now }
    };
    const ready = await VendorPayout.find(readyQuery);
    console.log(`Matched ready payouts: ${ready.length}`);
    ready.forEach(p => {
      console.log(`- ID: ${p._id}, amount: ${p.amount}, scheduledDate: ${p.scheduledDate}`);
    });

    // Test Scheduled filter
    console.log("\n=== TESTING SCHEDULED FILTER ===");
    const scheduledQuery = {
      status: "pending",
      scheduledDate: { $gt: now }
    };
    const scheduled = await VendorPayout.find(scheduledQuery);
    console.log(`Matched scheduled payouts: ${scheduled.length}`);
    scheduled.forEach(p => {
      console.log(`- ID: ${p._id}, amount: ${p.amount}, scheduledDate: ${p.scheduledDate}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

check();

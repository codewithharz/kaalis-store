const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const VendorPayout = require("../models/vendorPayoutModels");

async function check() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    const counts = await VendorPayout.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    console.log("Payout counts by status:", counts);

    const pendingPayouts = await VendorPayout.find({ status: "pending" });
    console.log(`Found ${pendingPayouts.length} pending payouts:`);
    pendingPayouts.forEach(p => {
      console.log(`- ID: ${p._id}
        amount: ${p.amount}
        scheduledDate: ${p.scheduledDate}
        now: ${new Date()}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

check();

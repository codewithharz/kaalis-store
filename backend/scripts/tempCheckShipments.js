const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Order = require("../models/orderModels");
const Shipment = require("../models/shipmentModels");

async function check() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    const orderIdCode = "0000c8-mqgzjxm7";
    const order = await Order.findOne({ orderId: orderIdCode });
    if (!order) {
      console.log(`Order ${orderIdCode} not found.`);
      return;
    }

    console.log(`\nOrder: ${order._id} (${order.orderId})`);
    console.log(`Order Status: ${order.status}`);

    const shipments = await Shipment.find({ order: order._id });
    console.log(`Found ${shipments.length} shipments:`);
    shipments.forEach(s => {
      console.log(`- ID: ${s._id}
        shipmentStatus: ${s.shipmentStatus}
        carrier: ${s.carrier}
        trackingNumber: ${s.trackingNumber}
        createdAt: ${s.createdAt}
        updatedAt: ${s.updatedAt}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

check();

// backend/utils/db.js
const mongoose = require("mongoose");
require("dotenv").config();

let cachedConnection = null;
let indexSyncInProgress = false;

const connectDB = async () => {
  if (cachedConnection) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    mongoose.set("strictQuery", true);

    // Enhanced connection options
    const options = {
      serverSelectionTimeoutMS: 60000, // 1 minute
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      autoIndex: false, // Disable automatic indexing
      retryWrites: true,
      w: "majority",
      family: 4, // Force IPv4
      connectTimeoutMS: 60000,
      heartbeatFrequencyMS: 10000,
    };

    console.log("Attempting to connect to MongoDB...");
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI?.substring(0, 20) + "..."
    ); // Log partial URI for debugging

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    cachedConnection = conn;

    // Log connection success
    console.log("MongoDB Connected:", {
      host: conn.connection.host,
      database: conn.connection.name,
      state: ["disconnected", "connected", "connecting", "disconnecting"][
        conn.connection.readyState
      ],
    });

    // Handle indexes after connection is established
    if (!indexSyncInProgress) {
      indexSyncInProgress = true;
      setTimeout(() => {
        syncIndexes(conn).catch((err) => {
          console.warn("Index sync warning:", err.message);
          indexSyncInProgress = false;
        });
      }, 15000);
    }

    return conn;
  } catch (error) {
    console.error("MongoDB Connection Error Details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      // stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });

    cachedConnection = null;
    throw error;
  }
};

// Separate function to handle index synchronization
async function syncIndexes(conn) {
  try {
    const Payment = require("../models/paymentModels");
    const Category = require("../models/categoryModels");

    // Create indexes without dropping
    await Promise.all([
      Payment.collection.createIndex(
        { reference: 1 },
        {
          sparse: true,
          background: true,
          name: "reference_sparse",
          timeout: 60000,
        }
      ),
      Category.collection.createIndex(
        { name: 1 },
        {
          background: true,
          timeout: 60000,
        }
      ),
    ]);

    console.log("Indexes synchronized successfully");
  } catch (error) {
    console.warn("Index synchronization warning:", error.message);
  } finally {
    indexSyncInProgress = false;
  }
}

// Connection event handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
  cachedConnection = null;
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
  cachedConnection = null;
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("MongoDB disconnected through app termination");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});

module.exports = connectDB;

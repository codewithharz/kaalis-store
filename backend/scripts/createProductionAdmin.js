// we don't need this page since we are using the /init endpoint approach

// backend/scripts/createProductionAdmin.js
require("dotenv").config();
const AdminUser = require("../models/adminUserModels");
const connectDB = require("../utils/db");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createProductionAdmin = async () => {
  try {
    await connectDB();

    // Prompt for admin details
    const email = await new Promise((resolve) => {
      rl.question("Enter admin email: ", resolve);
    });

    const username = await new Promise((resolve) => {
      rl.question("Enter admin username: ", resolve);
    });

    const password = await new Promise((resolve) => {
      rl.question("Enter admin password: ", resolve);
    });

    const adminUser = new AdminUser({
      username,
      email,
      password,
      role: "SuperAdmin",
    });

    await adminUser.save();
    console.log("Production admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createProductionAdmin();

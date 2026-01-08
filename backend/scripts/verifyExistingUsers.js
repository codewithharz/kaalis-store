// backend/scripts/verifyExistingUsers.js
// Run this once to verify all existing users

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Import User model
const User = require("../models/userModels");

async function verifyExistingUsers() {
  try {
    console.log("🚀 Starting migration...");
    console.log("📡 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");
    console.log("📊 Database:", mongoose.connection.name);

    // Find all users who are not verified
    const unverifiedUsers = await User.find({ emailVerified: { $ne: true } });

    console.log(`\n📋 Found ${unverifiedUsers.length} unverified users`);

    if (unverifiedUsers.length === 0) {
      console.log("✨ All users are already verified!");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Show sample of users to be updated
    console.log("\n👥 Sample of users to be verified:");
    unverifiedUsers.slice(0, 5).forEach((user) => {
      console.log(`   - ${user.username} (${user.email})`);
    });

    if (unverifiedUsers.length > 5) {
      console.log(`   ... and ${unverifiedUsers.length - 5} more`);
    }

    console.log("\n🔄 Updating users...");

    // Update all unverified users
    const result = await User.updateMany(
      { emailVerified: { $ne: true } },
      {
        $set: {
          emailVerified: true,
          emailVerificationToken: undefined,
          emailVerificationExpires: undefined,
        },
      }
    );

    console.log(`\n✅ Successfully verified ${result.modifiedCount} users!`);
    console.log(`📊 Matched: ${result.matchedCount}`);
    console.log(`🔄 Modified: ${result.modifiedCount}`);

    // Verify the update
    const stillUnverified = await User.countDocuments({ emailVerified: false });
    console.log(`\n✨ Remaining unverified users: ${stillUnverified}`);

    await mongoose.connection.close();
    console.log("\n🎉 Migration complete! Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed!");
    console.error("Error:", error.message);
    console.error("\nFull error:", error);

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

// Run the migration
verifyExistingUsers();

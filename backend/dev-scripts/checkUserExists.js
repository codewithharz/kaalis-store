const mongoose = require("mongoose");
const User = require("./models/userModels");
require("dotenv").config();

const checkUserExists = async (userId) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = await User.findById(userId);
    if (user) {
      console.log("User found:", user);
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    mongoose.connection.close();
  }
};

checkUserExists("6691efabc0a898c9e2f5f38b");

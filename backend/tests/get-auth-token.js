// get-auth-token.js
const axios = require("axios");

async function login() {
  try {
    const response = await axios.post("http://localhost:7788/api/users/login", {
      email: "testuser@example.com",
      password: "123"
    });
    
    console.log("\n✅ Login successful!");
    console.log("\n📋 Copy this token:\n");
    console.log(response.data.token);
    console.log("\n");
    
    return response.data.token;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
  }
}

login();
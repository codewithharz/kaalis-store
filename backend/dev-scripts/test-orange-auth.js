// Create a file called test-orange-auth.js
const axios = require("axios");
require("dotenv").config();

async function testAuth() {
  try {
    const body = new URLSearchParams();
    body.append("grant_type", "client_credentials");

    // Try with the header directly from the portal
    const directAuthHeader =
      "Basic QVdKNmx0TmwzTFdRUWtqZWhOT0ptT1J0NDY5eGZmbUQ6U1lIc0ZLUWNLQWRYS2x1RVl0eHZzR3Jld3VwWGd3enRKOGo0blRub2NOVXE=";

    console.log("Testing authentication...");
    console.log("Auth header length:", directAuthHeader.length);

    const response = await axios.post(
      "https://api.orange.com/oauth/v3/token",
      body,
      {
        headers: {
          Authorization: directAuthHeader,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    console.log("Success! Token received.");
    // Don't log the full token for security reasons
    console.log("Token type:", response.data.token_type);
    console.log("Expires in:", response.data.expires_in);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Status text:", error.response.statusText);
      console.error("Response data:", error.response.data);
    }
  }
}

testAuth();

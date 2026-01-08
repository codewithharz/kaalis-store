// backend/twilio-test.js
const twilio = require("twilio");

// Replace these with your actual Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Twilio Auth Token
const serviceSid = process.env.TWILIO_SERVICE_SID; // Your Twilio Verify Service SID

// Initialize the Twilio client
const client = new twilio(accountSid, authToken);

// Define the verification request parameters
const phoneNumber = "+2348107060160"; // The phone number you're sending the verification to (must be in E.164 format)

// Send the verification request using the v2 API
client.verify.v2
  .services(serviceSid)
  .verifications.create({
    to: phoneNumber,
    channel: "sms", // Use 'sms' for text messages or 'call' for voice calls
  })
  .then((verification) => {
    console.log(`Verification sent to ${phoneNumber}`);
    console.log("Verification SID:", verification.sid);
  })
  .catch((error) => {
    console.error("Error sending verification:", error);
  });

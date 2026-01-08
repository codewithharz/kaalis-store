// backend/verify-code.js
const twilio = require("twilio");

// Replace these with your actual Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Twilio Auth Token
const serviceSid = process.env.TWILIO_SERVICE_SID; // Your Twilio Verify Service SID

// Initialize the Twilio client
const client = new twilio(accountSid, authToken);

// Define the phone number to send the verification to
const phoneNumber = "+2348107060160"; // The phone number you're sending the verification to (must be in E.164 format)

// Step 1: Send the verification request
client.verify.v2
  .services(serviceSid)
  .verifications.create({
    to: phoneNumber,
    channel: "sms", // Use 'sms' for text messages or 'call' for voice calls
  })
  .then((verification) => {
    console.log(`Verification sent to ${phoneNumber}`);
    console.log("Verification SID:", verification.sid);

    // Step 2: Verify the code (example)
    const verificationSid = verification.sid; // Use the Verification SID from the response
    const code = "483472"; // Replace with the actual code the user receives

    // Verify the code
    client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code, // User-entered verification code
      })
      .then((verification_check) => {
        if (verification_check.status === "approved") {
          console.log("Verification successful!");
        } else {
          console.log("Verification failed.");
        }
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
      });
  })
  .catch((error) => {
    console.error("Error sending verification:", error);
  });

const twilio = require("twilio");

// Replace these with your actual Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

// Initialize the Twilio client
const client = twilio(accountSid, authToken);

module.exports = { client, serviceSid };

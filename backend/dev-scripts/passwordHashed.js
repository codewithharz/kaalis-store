const bcrypt = require("bcryptjs");

const newPassword = "4E5uepNMG8v##lwUaa"; // The entered password
const storedHash =
  "$2b$10$bNZAYdkjviCQXiojkewWQuurzYGKzicZiw9xJQYkCSMtPXc.V/u1W"; // The hash stored in DB

async function testHash() {
  console.log("New Password:", newPassword); // Log password to check for any discrepancies
  console.log("Stored Hash:", storedHash); // Log stored hash

  const isMatch = await bcrypt.compare(newPassword, storedHash); // Compare entered password with stored hash
  console.log("Password Match:", isMatch ? "✅ Yes" : "❌ No");
}

testHash();

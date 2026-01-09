const bcrypt = require("bcrypt");

// // const saltRounds = 10;
// // const plainTextPassword = "newPassword123";

// // bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
// //   if (err) throw err;
// //   // Store hash in your password DB.
// //   console.log("Hashed password::", hash);

// //   // Now compare the plainTextPassword with the hashed one
// //   bcrypt.compare(plainTextPassword, hash, (err, isMatch) => {
// //     if (err) throw err;
// //     console.log("Password match::", isMatch); // isMatch is a boolean indicating if the passwords match
// //   });
// // });

// // Here’s a simple script to test password hashing and comparison:
// const password = "newPassword123"; // Password used for resetting
// const hashedPassword =
//   "$2b$10$bWc9nCD6RMXG1J6mig3IbeQ6I02ebFmsGgvaRLRpe6iIAh4iXDY3."; // Hash from logs

// // Hashing
// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) throw err;
//   console.log("Hashed Password:", hash);

//   // Comparing
//   bcrypt.compare(password, hashedPassword, (err, result) => {
//     if (err) throw err;
//     console.log("Password Match:", result); // Should be true if correct
//   });
// });

// Simulate storing the hashed password
let storedHashedPassword;

// Function to simulate registration
async function registerUser(plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    storedHashedPassword = hashedPassword;
    console.log("Password successfully hashed and stored:", hashedPassword);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

// Function to simulate login
async function loginUser(plainPassword) {
  try {
    if (!storedHashedPassword) {
      throw new Error("No user registered");
    }

    const isMatch = await bcrypt.compare(plainPassword, storedHashedPassword);
    if (isMatch) {
      console.log("Login successful: Passwords match.");
    } else {
      console.log("Login failed: Passwords do not match.");
    }
  } catch (error) {
    console.error("Error comparing passwords:", error);
  }
}

// Simulate the process
(async () => {
  const password = "mySecret123";
  await registerUser(password); // Register user with a password

  // Simulate login attempt
  await loginUser("mySecret123"); // Correct password
  await loginUser("123"); // Incorrect password
})();

//  =================================================================================================

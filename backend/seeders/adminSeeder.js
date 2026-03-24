// backend/seeders/adminSeeder.js
const AdminUser = require("../models/adminUserModels");
const crypto = require("crypto");
const { sendAdminCreatedEmail } = require("../services/emailService");

const createInitialAdmin = async () => {
  try {
    console.log("[ADMIN SETUP] Starting admin initialization...");

    const existingAdmin = await AdminUser.findOne({ role: "SuperAdmin" });
    if (existingAdmin) {
      console.log("[ADMIN SETUP] SuperAdmin already exists, skipping creation");
      return;
    }

    console.log(
      "[ADMIN SETUP] No existing SuperAdmin found, creating new admin..."
    );

    const generateSecurePassword = () => {
      const length = 16;
      const numbers = "0123456789";
      const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lowerCase = "abcdefghijklmnopqrstuvwxyz";

      let password = "";
      // Ensure at least one of each type
      password += getRandomChar(upperCase);
      password += getRandomChar(lowerCase);
      password += getRandomChar(numbers);
      password += getRandomChar(symbols);

      const allChars = upperCase + lowerCase + numbers + symbols;
      while (password.length < length) {
        password += getRandomChar(allChars);
      }

      return password
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
    };

    const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];

    const generatedPassword = generateSecurePassword();
    const username = `admin_${crypto.randomBytes(4).toString("hex")}`;
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      console.error(
        "[ADMIN SETUP] ERROR: ADMIN_EMAIL not set in environment variables"
      );
      return;
    }

    console.log("[ADMIN SETUP] Creating admin with email:", email);
    console.log("[ADMIN SETUP] Generated username:", username);

    const adminUser = new AdminUser({
      username,
      email,
      password: generatedPassword,
      role: "SuperAdmin",
      requiresMFA: true,
      passwordLastChanged: new Date(),
      lastLogin: new Date(),
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      lockoutPeriod: 30,
    });

    await adminUser.save();
    console.log("[ADMIN SETUP] Admin user saved to database successfully");

    console.log("[ADMIN SETUP] Attempting to send credentials email...");

    await sendAdminCreatedEmail({
      to: email,
      username,
      tempPassword: generatedPassword,
      locale: "en",
    });
    console.log(
      "[ADMIN SETUP] ✅ Credentials email sent successfully to:",
      email
    );

    console.log("\n===========================================");
    console.log("🔐 ADMIN ACCOUNT CREATED SUCCESSFULLY 🔐");
    console.log("===========================================");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Check email for login credentials");
    console.log("===========================================\n");
  } catch (error) {
    console.error("[ADMIN SETUP] ❌ Error during admin creation:", error);
    console.error("[ADMIN SETUP] Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });
  }
};

module.exports = createInitialAdmin;

// // backend/seeders/adminSeeder.js
// const AdminUser = require("../models/adminUserModels");
// const crypto = require("crypto");

// const createInitialAdmin = async () => {
//   try {
//     console.log("Starting admin initialization...");
//     console.log("Environment:", process.env.NODE_ENV);

//     // Check for existing SuperAdmin
//     const existingAdmin = await AdminUser.findOne({ role: "SuperAdmin" });

//     if (existingAdmin) {
//       console.log("SuperAdmin already exists:", {
//         email: existingAdmin.email,
//         username: existingAdmin.username,
//         role: existingAdmin.role,
//       });
//       return;
//     }

//     console.log("No existing SuperAdmin found, creating new admin...");

//     let adminUser;
//     if (process.env.NODE_ENV === "production") {
//       // Production: Generate secure random credentials
//       const generatedPassword = crypto.randomBytes(16).toString("hex");
//       // const randomId = crypto.randomBytes(8).toString("hex");
//       const adjectives = ["fast", "bold", "dark", "bright", "sharp"];
//       const roles = ["kaalis"]; // Fixed role
//       const randomSuffix = Date.now().toString().slice(-4); // Unique based on current time

//       // Helper to pick a random element from an array
//       const randomChoice = (array) =>
//         array[Math.floor(Math.random() * array.length)];

//       // Generate compact username and email
//       const username = `${randomChoice(adjectives)}_${randomChoice(
//         roles
//       )}_${randomSuffix}`;
//       const email = `${username}@kaalis.com`.toLowerCase();

//       console.log("Generated Password:", generatedPassword);

//       adminUser = new AdminUser({
//         // username: `admin_${randomId}`,
//         // email: `admin_${randomId}@kaalis.com`,
//         username: username,
//         email: email,
//         password: generatedPassword,
//         role: "SuperAdmin",
//         lastLogin: new Date(),
//         sessionTimeout: 3600,
//       });

//       console.log("\n===========================================");
//       console.log("🔐 INITIAL ADMIN CREDENTIALS CREATED 🔐");
//       console.log("===========================================");
//       console.log("Email:", adminUser.email);
//       console.log("Password:", generatedPassword);
//       console.log("===========================================");
//       console.log("⚠️  IMPORTANT:");
//       console.log("1. Save these credentials immediately");
//       console.log("2. Change password after first login");
//       console.log("3. These credentials will only be shown once");
//       console.log("===========================================\n");
//     } else {
//       // Development: Use environment variables
//       console.log("Creating development admin with env variables");

//       adminUser = new AdminUser({
//         username: process.env.INITIAL_ADMIN_USERNAME,
//         email: process.env.INITIAL_ADMIN_EMAIL,
//         password: process.env.INITIAL_ADMIN_PASSWORD,
//         role: "SuperAdmin",
//         lastLogin: new Date(),
//         sessionTimeout: 3600,
//       });
//     }

//     await adminUser.save();
//     console.log("Admin user created successfully:", {
//       email: adminUser.email,
//       username: adminUser.username,
//       role: adminUser.role,
//     });
//   } catch (error) {
//     console.error("Admin seeder error:", error);
//     console.error("Error details:", {
//       name: error.name,
//       message: error.message,
//       code: error.code,
//     });
//     if (error.code === 11000) {
//       console.error("Duplicate key error - admin might already exist");
//     }
//   }
// };

// module.exports = createInitialAdmin;

// // const AdminUser = require("../models/adminUserModels");

// // const createInitialAdmin = async () => {
// //   try {
// //     const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL;
// //     const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;
// //     const ADMIN_USERNAME = process.env.INITIAL_ADMIN_USERNAME;

// //     if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_USERNAME) {
// //       console.log("Admin credentials not found in environment");
// //       return;
// //     }

// //     const existingAdmin = await AdminUser.findOne({ email: ADMIN_EMAIL });

// //     // Allow creation in both dev and prod if no admin exists
// //     if (!existingAdmin) {
// //       const adminUser = new AdminUser({
// //         username: ADMIN_USERNAME,
// //         email: ADMIN_EMAIL,
// //         password: ADMIN_PASSWORD,
// //         role: "SuperAdmin",
// //         lastLogin: new Date(),
// //         sessionTimeout: 3600,
// //         // allowedIPs: process.env.ALLOWED_ADMIN_IPS?.split(",") || ["*"],
// //       });

// //       await adminUser.save();
// //       console.log(`Admin user created in ${process.env.NODE_ENV} environment`);
// //     }
// //   } catch (error) {
// //     console.error("Admin seeder error:", error);
// //   }
// // };

// // module.exports = createInitialAdmin;

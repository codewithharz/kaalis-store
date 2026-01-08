const admin = require("firebase-admin");

let bucket = null;

try {
  // Try to load service account from file (local development)
  const serviceAccount = require("../config/serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "kaalis-store.appspot.com",
  });

  bucket = admin.storage().bucket();
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.warn("⚠️  Firebase service account not found - Firebase features will be disabled");
  console.warn("   This is normal for Vercel deployments without Firebase configured");
}

module.exports = { admin, bucket };

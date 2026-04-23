cd /Users/harz/Documents/backUps/izmir/kaalis-store/backend

read -s "ADMIN_RESET_PASSWORD?New SuperAdmin password: "
echo

ADMIN_RESET_EMAIL="harzkane@gmail.com" ADMIN_RESET_PASSWORD="$ADMIN_RESET_PASSWORD" node -e '
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./utils/db");
const AdminUser = require("./models/adminUserModels");

(async () => {
  await connectDB();

  const admin = await AdminUser.findOne({
    email: process.env.ADMIN_RESET_EMAIL,
    role: "SuperAdmin"
  });

  if (!admin) {
    throw new Error("SuperAdmin not found for " + process.env.ADMIN_RESET_EMAIL);
  }

  admin.password = process.env.ADMIN_RESET_PASSWORD;
  admin.failedLoginAttempts = 0;
  admin.isBlocked = false;
  admin.sessionId = undefined;

  await admin.save();

  console.log("SuperAdmin password reset for:", admin.email);
  await mongoose.connection.close();
})().catch(async (err) => {
  console.error(err.message);
  try { await mongoose.connection.close(); } catch (_) {}
  process.exit(1);
});
'

unset ADMIN_RESET_PASSWORD



Email: harzkane@gmail.com
Username: admin_382261b6
Temporary password: kXuJL7m26br5=Vp9f+

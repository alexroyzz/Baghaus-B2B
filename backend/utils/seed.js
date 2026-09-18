// Run with: npm run seed
// Creates ONLY the default admin account and default settings, if they do not
// already exist. Safe to re-run.
//
// IMPORTANT: This project intentionally does NOT seed any categories or
// products. Categories and Products are fully admin-controlled and must be
// created manually from the Admin Panel — nothing here (or anywhere else in
// the app) should auto-create, insert, or generate catalog data.

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Settings from "../models/Settings.js";

dotenv.config();

const run = async () => {
  await connectDB();

  // 1. Admin account
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@baghaus.com").toLowerCase();
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "BagHaus Admin",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || "ChangeMe@123",
      role: "superadmin",
    });
    console.log(`✔ Admin created: ${adminEmail}`);
  } else {
    console.log(`• Admin already exists: ${adminEmail}`);
  }

  // 2. Settings
  const existingSettings = await Settings.findOne({ key: "site_settings" });
  if (!existingSettings) {
    await Settings.create({ key: "site_settings" });
    console.log("✔ Default settings created");
  } else {
    console.log("• Settings already exist");
  }

  // NOTE: No categories or products are created here on purpose. They must
  // be added manually from the Admin Panel (Category Management / Product
  // Management). The admin will see an empty state on the site and in the
  // Admin Panel until they add their own categories and products.

  console.log("\nSeed complete. No categories or products were created — add them from the Admin Panel.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

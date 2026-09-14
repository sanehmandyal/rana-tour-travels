const mongoose = require("mongoose");
const User = require("../models/User");

async function ensureAdminUser() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@ranatourandtravels.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "RanaTravels@2026";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: process.env.ADMIN_NAME || "Rana Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      await admin.save();
      console.log(`[db] Cloud auto-seed: Admin account ready (${adminEmail})`);
    }
  } catch (err) {
    console.error("[db] Error ensuring admin account:", err.message);
  }
}

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rana_tour_travels";
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[db] connected -> ${maskedUri}`);
    await ensureAdminUser();
  } catch (err) {
    console.error("[db] connection error:", err.message);
    console.error("[db] If running on Render, check that:");
    console.error("  1. MONGO_URI is set in Render Environment Variables.");
    console.error("  2. In MongoDB Atlas -> Network Access, IP 0.0.0.0/0 (Allow Anywhere) is added.");
    console.error("  3. Your database username and password in MONGO_URI are correct.");
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
}

module.exports = connectDB;

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("[db] MONGODB_URI is not set. Check backend/.env");
    process.exit(1);
  }
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("[db] MongoDB connected");
  } catch (err) {
    console.error("[db] Connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;

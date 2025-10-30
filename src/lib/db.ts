// src/lib/db.ts
import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://apartmentChatbot:PRYH1BHeXDW6Fkzy@cluster0.piiq8kc.mongodb.net/ecommerce_assigment?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in environment variables");
}

let isConnected = false; // Track connection

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    throw err;
  }
}

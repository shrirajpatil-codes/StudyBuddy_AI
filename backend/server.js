// ============================================
// STEP 1 — Load Environment Variables FIRST
// Must be before any other imports that need .env
// ============================================
require("dotenv").config();

// ============================================
// STEP 2 — Import Core Packages
// ============================================
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ============================================
// STEP 3 — Import Internal Config Files
// ============================================
const connectDB = require("./config/db");
const { testGeminiConnection } = require("./config/gemini");

// ============================================
// STEP 4 — Import Route Files
// ============================================
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

// ============================================
// STEP 5 — Initialize Express App
// ============================================
const app = express();

// ============================================
// STEP 6 — Setup Middleware
// ============================================

// Enable CORS — allows React frontend to talk to backend
// In development, allows all origins
// In production, replace * with your actual frontend URL
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming JSON requests
// Required to read req.body in controllers
app.use(express.json());

// Parse URL encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// ============================================
// STEP 7 — Request Logger (Development Only)
// Logs every incoming request to terminal
// ============================================
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`📌 ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ============================================
// STEP 8 — Health Check Route
// Test if server is running without Postman
// Visit: http://localhost:5000/api/health
// ============================================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StudyBuddy AI Server is running",
    environment: process.env.NODE_ENV || "development",
    mongoStatus:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// STEP 9 — Register All API Routes
// ============================================

// Auth routes — /api/auth/register, /api/auth/login, /api/auth/profile
app.use("/api/auth", authRoutes);

// Chat routes — /api/chat, /api/chat/history, /api/chat/verify
app.use("/api/chat", chatRoutes);

// ============================================
// STEP 10 — Handle Unknown Routes (404)
// Catches any request that doesn't match above routes
// ============================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found — ${req.method} ${req.originalUrl}`,
  });
});

// ============================================
// STEP 11 — Global Error Handler
// Catches any error thrown anywhere in the app
// Must have 4 parameters — (err, req, res, next)
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join(", "),
    });
  }

  // Mongoose duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} already exists — please use a different ${field}`,
    });
  }

  // Mongoose bad ObjectId error
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token — please login again",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired — please login again",
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// ============================================
// STEP 12 — Start Server
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log("===========================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
      console.log("===========================================");

      // Test Gemini connection after server starts
      testGeminiConnection();
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

// ============================================
// STEP 13 — Handle Unexpected Crashes
// Prevents server from dying silently
// ============================================

// Unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
  process.exit(1);
});

// Uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error.message);
  process.exit(1);
});

// Graceful shutdown on CTRL+C
process.on("SIGINT", async () => {
  console.log("\n⚠️  Server shutting down gracefully...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});

// ============================================
// STEP 14 — Run the Server
// ============================================
startServer();
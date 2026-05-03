const express = require("express");
const router = express.Router();

// ✅ Import auth controller functions
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

// ✅ Import auth middleware
const { protect } = require("../middleware/authMiddleware");

// ============================================
// PUBLIC ROUTES — No token required
// ============================================

// POST /api/auth/register
// Body: { name, email, password }
// Creates a new user account
router.post("/register", registerUser);

// POST /api/auth/login
// Body: { email, password }
// Returns JWT token on success
router.post("/login", loginUser);

// ============================================
// PROTECTED ROUTES — Token required
// ============================================

// GET /api/auth/profile
// Headers: Authorization: Bearer <token>
// Returns logged in user's profile
router.get("/profile", protect, getProfile);

module.exports = router;
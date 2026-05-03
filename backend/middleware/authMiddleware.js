const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// ✅ PROTECT MIDDLEWARE — verifies JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Step 1 — Check if token exists in request headers
    // Frontend must send: Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
    }

    // Step 2 — If no token found, reject request
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied — no token provided",
      });
    }

    // Step 3 — Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4 — Find user from decoded token id
    const user = await User.findById(decoded.id).select("-password");

    // Step 5 — If user no longer exists in DB
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Access denied — user no longer exists",
      });
    }

    // Step 6 — Attach user to request object
    // Now any controller can access req.user
    req.user = user;

    console.log(`🔐 Auth verified for user: ${user.email}`);

    // Step 7 — Move to next middleware or controller
    next();

  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token — please login again",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired — please login again",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error in authentication",
    });
  }
};

// ✅ OPTIONAL — Admin only middleware
// Use this if you want admin-only routes in future
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: "Access denied — admin only",
    });
  }
};

module.exports = { protect, adminOnly };
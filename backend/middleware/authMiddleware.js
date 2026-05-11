const jwt = require("jsonwebtoken")
const User = require("../models/User")
require("dotenv").config()

const protect = async (req, res, next) => {
  try {
    let token

    // Step 1 — Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    // Step 2 — No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied — no token provided",
        code: "NO_TOKEN"
      })
    }

    // Step 3 — Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (jwtError) {
      // Token expired
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Token expired — please login again",
          code: "TOKEN_EXPIRED"    // ← frontend uses this code
        })
      }
      // Token invalid
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          error: "Invalid token — please login again",
          code: "INVALID_TOKEN"
        })
      }
    }

    // Step 4 — Find user
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found — please login again",
        code: "USER_NOT_FOUND"
      })
    }

    // Step 5 — Attach user to request
    req.user = user
    console.log(`🔐 Auth verified for user: ${user.email}`)
    next()

  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message)
    res.status(500).json({
      success: false,
      error: "Server error in authentication",
      code: "SERVER_ERROR"
    })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({
      success: false,
      error: "Access denied — admin only",
      code: "ADMIN_ONLY"
    })
  }
}

module.exports = { protect, adminOnly }
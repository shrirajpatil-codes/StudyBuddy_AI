const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ REGISTER — POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email",
      });
    }

    // Create new user
    // Password is auto-hashed by User model pre-save hook
    const user = await User.create({
      name,
      email,
      password: password,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log(`✅ New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);

    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already exists — please use a different email",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error during registration",
    });
  }
};

// ✅ LOGIN — POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Compare password using model method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });

  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error during login",
    });
  }
};

// ✅ GET PROFILE — GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("❌ Profile Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error fetching profile",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
const express = require("express");
const router = express.Router();

// ✅ Import chat controller functions
const {
  sendMessage,
  getChatHistory,
  deleteChat,
  verifyChats,
} = require("../controllers/chatController");

// ✅ Import auth middleware
const { protect } = require("../middleware/authMiddleware");

// ============================================
// PROTECTED ROUTES — Token required
// ============================================

// POST /api/chat
// Headers: Authorization: Bearer <token>
// Body: { message, userId }
// Sends message to Gemini and saves to MongoDB
router.post("/", protect, sendMessage);

// GET /api/chat/history
// Headers: Authorization: Bearer <token>
// Query: ?userId=<userId>
// Returns chat history for a user
router.get("/history", protect, getChatHistory);

// DELETE /api/chat/:id
// Headers: Authorization: Bearer <token>
// Params: id = chat document _id
// Deletes a specific chat message
router.delete("/:id", protect, deleteChat);

// ============================================
// TEMPORARY TEST ROUTE — Remove in production
// ============================================

// GET /api/chat/verify
// No auth needed — only for testing DB storage
router.get("/verify", verifyChats);

module.exports = router;
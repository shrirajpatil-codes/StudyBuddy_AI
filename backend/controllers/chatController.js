const { geminiModel } = require("../config/gemini");
const Chat = require("../models/Chat");

// ✅ Helper — cleans Gemini markdown from response
const cleanResponse = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")  // Remove **bold**
    .replace(/\*(.*?)\*/g, "$1")       // Remove *italic*
    .replace(/##\s?/g, "")            // Remove ## headings
    .replace(/\n{3,}/g, "\n\n")       // Max 2 line breaks
    .trim();
};

// ✅ SEND MESSAGE — POST /api/chat
const sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message cannot be empty",
      });
    }

    console.log("📩 User Message Received:", message);

    // Build study assistant prompt
    const studyPrompt = `
      You are StudyBuddy AI — a smart, friendly study assistant
      specifically designed for engineering students.

      STRICT RULES:
      - Never use **, ##, or * symbols
      - Use plain text only
      - Use numbered lists like 1. 2. 3.
      - Use simple section labels like "Definition:" or "Example:"
      - Keep answers structured and easy to read
      - Always give a real example after explaining a concept
      - If asked something non-academic, politely redirect to studies

      RESPONSE FORMAT:
      1. Start with a one-line simple definition
      2. Explain in 2-3 sentences
      3. Give a real world example
      4. End with one quick tip or fun fact

      Student's question: ${message}
    `;

    // Send to Gemini
    console.log("🤖 Sending message to Gemini...");
    const result = await geminiModel.generateContent(studyPrompt);
    const rawResponse = result.response.text();
    const aiResponse = cleanResponse(rawResponse);
    console.log("✅ Gemini Response Ready");

    // Save to MongoDB
    const savedChat = await Chat.create({
      userId: userId || "guest",
      userMessage: message,
      aiResponse: aiResponse,
      model: "gemini-2.5-flash",
      timestamp: new Date(),
    });

    console.log("💾 Chat saved to MongoDB, ID:", savedChat._id);

    // Send response to frontend
    res.status(200).json({
      success: true,
      data: {
        chatId: savedChat._id,
        userMessage: message,
        aiResponse: aiResponse,
        timestamp: savedChat.timestamp,
        model: "gemini-2.5-flash",
      },
    });

  } catch (error) {
    console.error("❌ Chat Controller Error:", error.message);

    if (error.message.includes("API_KEY")) {
      return res.status(401).json({
        success: false,
        error: "Invalid Gemini API Key",
      });
    }

    if (error.message.includes("quota")) {
      return res.status(429).json({
        success: false,
        error: "Gemini free tier quota exceeded — try again later",
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅ GET CHAT HISTORY — GET /api/chat/history
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const chats = await Chat.find(
      userId ? { userId } : {}
    )
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats,
    });

  } catch (error) {
    console.error("❌ History Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Could not fetch chat history",
    });
  }
};

// ✅ DELETE CHAT — DELETE /api/chat/:id
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat not found",
      });
    }

    console.log("🗑️ Chat deleted, ID:", req.params.id);

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });

  } catch (error) {
    console.error("❌ Delete Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Could not delete chat",
    });
  }
};

// ✅ VERIFY DB — GET /api/chat/verify (temporary testing route)
const verifyChats = async (req, res) => {
  try {
    const recentChats = await Chat.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("userId userMessage aiResponse model timestamp");

    res.status(200).json({
      success: true,
      message: `Found ${recentChats.length} chats in database`,
      data: recentChats,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database verification failed: " + error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  deleteChat,
  verifyChats,
};
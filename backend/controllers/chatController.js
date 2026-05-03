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
    // Build study assistant prompt
    const studyPrompt = `
    You are StudyBuddy AI — a caring, smart, and dedicated academic companion 
    specifically built for engineering students who are motivated but lack 
    proper guidance and resources.

    Your mission is to be that ONE friend who:
    - Explains everything clearly, like a senior student who truly wants to help
    - Never makes the student feel stupid for asking basic questions
    - Breaks down even the most complex engineering concepts into simple language
    - Gives complete, satisfying answers that leave no confusion behind

    ════════════════════════════════════════
    STUDENT PROFILE YOU ARE HELPING:
    ════════════════════════════════════════
    - Average engineering student who is motivated but struggles
    - May not have access to good teachers or resources
    - Feels stressed, panicked, or lost with difficult concepts
    - Needs clear, simple, complete explanations to build confidence
    - Deserves the same quality guidance as students with expensive coaching

    ════════════════════════════════════════
    YOUR STRICT RESPONSE RULES:
    ════════════════════════════════════════
    FORMATTING:
    - Can use **, ##, or * symbols if required anywhere
    - Can use bold or italic formatting if want to specifically highlight something important
    - Use numbered lists like 1. 2. 3. for steps
    - Use labels like "Definition:", "Example:", "Formula:", "Remember:"
    - Leave a blank line between each section for easy reading

    CONTENT RULES:
    - Always give a COMPLETE answer — never cut short
    - Start with the simplest possible one-line explanation
    - Then go deeper step by step
    - Always include a real world example the student can relate to
    - If there is a formula, explain every variable in it
    - If it is a process, explain every step clearly
    - End with a quick tip or memory trick to remember it easily
    - If the student seems stressed or confused, add an encouraging line

    TONE RULES:
    - Talk like a helpful senior student, not a textbook
    - Be warm, friendly, and encouraging
    - Never be robotic or cold
    - Make the student feel: "Oh! Now I finally understand this!"
    - If a question is very basic, still answer it with full respect
      because basic doubts deserve complete answers too

    ════════════════════════════════════════
    RESPONSE STRUCTURE TO ALWAYS FOLLOW:
    ════════════════════════════════════════

    Simple Answer:
    [1-2 line — the simplest possible explanation]

    What It Actually Means:
    [2 to 3 sentences expanding the concept clearly]

    Breaking It Down Step by Step:
    [Numbered steps explaining the concept in detail]

    Real World Example:
    [A relatable, practical example from daily life or engineering]

    Formula or Key Points (if applicable):
    [Formula with every term explained simply]

    Common Mistakes Students Make:
    [1 or 2 common errors to avoid]

    Quick Memory Trick:
    [A simple trick, analogy, or tip to never forget this concept]

    You've Got This:
    [One short encouraging line to boost the student's confidence]

    ════════════════════════════════════════
    SPECIAL INSTRUCTIONS:
    ════════════════════════════════════════
    - If asked about exam preparation: give most important topics and tips
    - If asked for viva questions: give questions with their ideal answers
    - If asked something outside academics: politely say you are here 
      specifically to help with studies and redirect warmly
    - If the question is very long or has multiple parts: answer each 
      part separately and completely
    - Never say "I cannot help with that" for any valid academic question
    - Never give a lazy one paragraph answer for a concept that deserves more

    ════════════════════════════════════════
    Student's Question: ${message}
    ════════════════════════════════════════

    Remember: This student might be sitting alone at night, stressed about 
    their exam tomorrow, with no one to ask. Be the guidance they deserve.
    Give them a complete, clear, and confidence-building answer right now.
    `

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
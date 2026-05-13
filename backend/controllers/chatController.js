// backend/controllers/chatController.js
const { geminiModel } = require("../config/gemini");
const Chat     = require("../models/Chat");
const Document = require("../models/Document");

// ============================================
// HELPER — Clean Gemini markdown from response
// ============================================
const cleanResponse = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/##\s?/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// ============================================
// HELPER — Trim document context
// Keeps Gemini prompt within safe token limits
// ============================================
const trimContext = (text, maxChars = 12000) => {
  if (!text || text.length <= maxChars) return text;
  return (
    text.substring(0, maxChars) +
    "\n\n[Document continues — showing first portion only]"
  );
};

// ============================================
// HELPER — Build prompt without document context
// This is your original study assistant prompt
// Completely unchanged from what you had before
// ============================================
const buildStudyPrompt = (message) => `
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
- Needs clear, simple, complete and easy to understand explanations to build confidence
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
- Always include a easy to understand real world example(if required) the student can relate to
- If there is a formula, explain every variable in it
- If it is a process, explain every step clearly and use flow diagram(if needed)
- End with a quick tip or memory trick to remember it easily
- If the student seems stressed or confused, add an encouraging line

TONE RULES:
- Talk like a helpful and caring senior student, not a textbook
- Be warm, friendly, and encouraging
- Never be robotic or cold
- Make the student feel: "Oh! Now I finally understand this!"

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
[A simple trick, analogy, or trick or tip to never forget this concept]

You've Got This:
[One short encouraging line to boost the student's confidence]

════════════════════════════════════════
Student's Question: ${message}
════════════════════════════════════════

Remember: This student might be sitting alone at night, stressed about
their exam tomorrow, with no one to ask. Be the guidance they deserve.
`;

// ============================================
// HELPER — Build prompt WITH document context
// Used when user is chatting about a specific document
// ============================================
const buildDocumentPrompt = (message, documentTitle, documentContext) => `
You are StudyBuddy AI — a dedicated academic companion helping an engineering student
understand their own study material clearly.

The student has uploaded a document titled "${documentTitle}".
Your job is to answer their question using this document as your primary reference and can add addiational revelent data to it(if and only if required).

════════════════════════════════════════
DOCUMENT CONTENT:
════════════════════════════════════════
${documentContext}

════════════════════════════════════════
YOUR RULES FOR DOCUMENT-BASED ANSWERS:
════════════════════════════════════════
- Always ground your answer in the document content above
- If the answer is clearly in the document, explain it thoroughly
- If the document partially covers it, use the document first then expand from the valid and relevnt resources and knowledge you have
- If the question is completely outside the document, say so honestly
  and still try to help from your general knowledge
- Keep your tone warm, clear, and student-friendly
- Use simple language — explain like a helpful senior student
- Structure your answer with clear sections
- If relevant, point out which part of the document the answer comes from

════════════════════════════════════════
Student's Question: ${message}
════════════════════════════════════════

Give a complete, clear answer the student can actually use for their exam.
`;

// ============================================
// SEND MESSAGE — POST /api/chat
// Handles both normal chat AND document-aware chat
// Body: { message, userId, documentId? }
// ============================================
const sendMessage = async (req, res) => {
  try {
    const { message, documentId } = req.body;
    const userId = req.user?.id || req.body.userId || "guest";

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message cannot be empty",
      });
    }

    console.log("📩 Message received:", message);

    let prompt         = "";
    let documentTitle  = null;
    let documentIdSaved = null;

    // ── Decide which prompt to build ──
    if (documentId) {
      // Document-aware mode
      console.log("📄 Document context requested, ID:", documentId);

      const document = await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: "Document not found. It may have been deleted.",
        });
      }

      if (document.status !== "ready") {
        return res.status(400).json({
          success: false,
          error: "Document is still processing. Please wait a moment.",
        });
      }

      if (!document.extractedText) {
        return res.status(400).json({
          success: false,
          error: "No text content found in this document.",
        });
      }

      const context = trimContext(document.extractedText);
      prompt        = buildDocumentPrompt(message, document.title, context);
      documentTitle = document.title;
      documentIdSaved = document._id;

      console.log("📄 Using document context:", document.title);

    } else {
      // Normal study chat mode — original behaviour
      prompt = buildStudyPrompt(message);
      console.log("💬 Using standard study prompt");
    }

    // ── Send to Gemini ──
    console.log("🤖 Sending to Gemini...");
    const result      = await geminiModel.generateContent(prompt);
    const rawResponse = result.response.text();
    const aiResponse  = cleanResponse(rawResponse);
    console.log("✅ Gemini response ready");

    // ── Save to MongoDB ──
    const savedChat = await Chat.create({
      userId,
      userMessage:  message,
      aiResponse,
      model:        "gemini-2.5-flash",
      topic:        documentTitle || "general",
      timestamp:    new Date(),
    });

    console.log("💾 Chat saved, ID:", savedChat._id);

    // ── Send response ──
    res.status(200).json({
      success: true,
      data: {
        chatId:       savedChat._id,
        userMessage:  message,
        aiResponse,
        timestamp:    savedChat.timestamp,
        model:        "gemini-2.5-flash",
        // Tell frontend if this was document-aware
        documentId:   documentIdSaved || null,
        documentTitle: documentTitle  || null,
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
        error: "Gemini quota exceeded — try again later",
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ============================================
// GET CHAT HISTORY — GET /api/chat/history
// ============================================
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const chats = await Chat.find(userId ? { userId } : {})
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: chats.length,
      data:  chats,
    });

  } catch (error) {
    console.error("❌ History Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Could not fetch chat history",
    });
  }
};

// ============================================
// DELETE CHAT — DELETE /api/chat/:id
// ============================================
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

// ============================================
// VERIFY DB — GET /api/chat/verify
// ============================================
const verifyChats = async (req, res) => {
  try {
    const recentChats = await Chat.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("userId userMessage aiResponse model topic timestamp");

    res.status(200).json({
      success: true,
      message: `Found ${recentChats.length} chats in database`,
      data:    recentChats,
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
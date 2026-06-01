// backend/controllers/chatController.js
const { geminiModel } = require("../config/gemini");
const Chat     = require("../models/Chat");
const Document = require("../models/Document");

// ============================================
// HELPER — Preserve markdown, only clean excess whitespace
// ============================================
const cleanResponse = (text) => {
  return text
    .replace(/\n{3,}/g, "\n\n")  // collapse 3+ blank lines into 2
    .trim();
};

// ============================================
// HELPER — Trim document context
// ============================================
const trimContext = (text, maxChars = 12000) => {
  if (!text || text.length <= maxChars) return text;
  return (
    text.substring(0, maxChars) +
    "\n\n[Document continues — showing first portion only]"
  );
};

// ============================================
// HELPER — Study / Doubt mode prompt
// ============================================
const buildStudyPrompt = (message) => `
You are StudyBuddy AI — a caring, smart academic companion for engineering students.

════════════════════════════════════════
CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
════════════════════════════════════════

You MUST use rich markdown formatting in every response:

- Use ## for every section heading (e.g. ## Simple Answer)
- Use **bold** for every key term, concept name, formula, or important word
- Use *italic* for emphasis, examples, or analogies
- Use numbered lists (1. 2. 3.) for steps and sequences
- Use bullet points (- ) for lists of points or features
- Use \`inline code\` for formulas, variables, or technical terms
- Use --- to separate major sections
- Every section must have a ## heading
- Never write a wall of plain text — break everything into structured sections

════════════════════════════════════════
RESPONSE STRUCTURE — USE EXACTLY THIS:
════════════════════════════════════════

## 💡 Simple Answer
[1-2 lines — the simplest possible explanation in plain language]

---

## 🔍 What It Actually Means
[2-3 sentences expanding the concept. Use **bold** for key terms.]

---

## 📋 Breaking It Down Step by Step
[Numbered steps. Bold the action word in each step.]

---

## 🌍 Real World Example
[A relatable, practical example. Use *italic* for the analogy.]

---

## 📐 Formula or Key Points
[If applicable — use \`code formatting\` for formulas. Explain every variable with **bold**.]

---

## ⚠️ Common Mistakes Students Make
[1-2 bullet points of errors to avoid]

---

## 🧠 Quick Memory Trick
[A simple trick or analogy. Make it memorable and fun.]

---

## ✅ You've Got This!
[One short encouraging line]

════════════════════════════════════════
TONE: Warm, friendly senior student. Never robotic. Never a wall of text.
════════════════════════════════════════

Student's Question: ${message}
`;

// ============================================
// HELPER — 1-Day Exam Blast prompt
// ============================================
const buildExamBlastPrompt = (message) => `
You are StudyBuddy AI in ONE-DAY-BEFORE-EXAM MODE.

════════════════════════════════════════
CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
════════════════════════════════════════

You MUST use rich markdown formatting:

- Use ## for every section heading
- Use **bold** for every topic name, concept, or key term
- Use *italic* for definitions or quick explanations
- Use numbered lists for ranked topics and roadmaps
- Use bullet points (- ) for notes and tips
- Use \`inline code\` for formulas or technical terms
- Use --- between every major section
- NEVER write paragraphs — only structured, scannable content

════════════════════════════════════════
RESPONSE STRUCTURE — USE EXACTLY THIS:
════════════════════════════════════════

## 🎯 Top 10 Most Important Topics
[Numbered list. **Bold** every topic name.]

---

## ⚡ 80/20 Concepts — Must Know
[Bullet points. **Bold** concept name, then *italic* 1-line explanation.]

---

## 📝 Fast Revision Notes
[Ultra-short bullet notes per topic. Bold the topic, then the key fact.]

---

## ❓ Expected Exam Questions
[Numbered list of 5-7 questions. Bold each question, then one-line answer.]

---

## 🎤 Viva Questions to Prepare
[5 questions with crisp answers. Bold each question.]

---

## 🗺️ Study Roadmap for Tonight
[Hour-by-hour numbered plan. Bold the time slot.]

---

## ⚠️ Common Mistakes to Avoid
[Bullet points. Bold the mistake.]

---

## ✅ Last Minute Tips
[3-4 bullet points. Bold the key tip word.]

════════════════════════════════════════
Subject: ${message}
════════════════════════════════════════
`;

// ============================================
// HELPER — Viva mode prompt
// ============================================
const buildVivaPrompt = (message) => `
You are StudyBuddy AI in VIVA PRACTICE MODE.

════════════════════════════════════════
CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
════════════════════════════════════════

- Use ## for every section heading
- Use **bold** for question text and key terms in answers
- Use *italic* for tips and examiner expectations
- Use numbered lists for questions
- Use bullet points for answer points
- Use --- between sections
- NEVER write plain paragraphs

════════════════════════════════════════
RESPONSE STRUCTURE:
════════════════════════════════════════

## 🎤 Viva Questions on This Topic
[5-7 numbered questions. **Bold** each question.]

---

## ✅ Model Answers
[For each question — bullet point the answer. Bold key terms.]

---

## 💡 How to Impress the Examiner
[3-4 bullet tips. Bold the tip keyword.]

---

## ⚠️ What NOT to Say
[2-3 bullet points of common viva mistakes. Bold the mistake.]

---

## 🧠 Quick Revision Before You Walk In
[5-7 bullet points of the most important points to remember. Bold each point.]

════════════════════════════════════════
Topic: ${message}
════════════════════════════════════════
`;

// ============================================
// HELPER — Document-aware prompt
// ============================================
const buildDocumentPrompt = (message, documentTitle, documentContext) => `
You are StudyBuddy AI helping a student understand their uploaded document.

Document title: "${documentTitle}"

════════════════════════════════════════
CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
════════════════════════════════════════

- Use ## for every section heading
- Use **bold** for every key term, concept, or important fact
- Use *italic* for definitions and examples
- Use numbered lists for steps or sequences
- Use bullet points for lists of features or points
- Use \`inline code\` for formulas or technical terms
- Use --- between major sections
- NEVER write a wall of plain text

════════════════════════════════════════
DOCUMENT CONTENT:
════════════════════════════════════════
${documentContext}

════════════════════════════════════════
RESPONSE STRUCTURE:
════════════════════════════════════════

## 📄 Answer from Your Document
[Direct answer grounded in the document. Use **bold** for key terms.]

---

## 🔍 Explanation
[Expand the concept clearly. Structure with bullets or numbered steps.]

---

## 💡 Additional Context
[Only if needed — add relevant knowledge beyond the document.]

---

## ✅ Key Takeaway
[1-2 line summary the student can remember for their exam.]

════════════════════════════════════════
Student's Question: ${message}
════════════════════════════════════════
`;

// ============================================
// SEND MESSAGE — POST /api/chat
// ============================================
const sendMessage = async (req, res) => {
  try {
    const { message, documentId } = req.body;
    const userId = req.user?.id || req.body.userId || "guest";

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, error: "Message cannot be empty" });
    }

    console.log("📩 Message received:", message);

    let prompt          = "";
    let documentTitle   = null;
    let documentIdSaved = null;

    if (documentId) {
      console.log("📄 Document context requested, ID:", documentId);
      const document = await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({ success: false, error: "Document not found." });
      }
      if (document.status !== "ready") {
        return res.status(400).json({ success: false, error: "Document is still processing." });
      }
      if (!document.extractedText) {
        return res.status(400).json({ success: false, error: "No text content found in this document." });
      }

      const context   = trimContext(document.extractedText);
      prompt          = buildDocumentPrompt(message, document.title, context);
      documentTitle   = document.title;
      documentIdSaved = document._id;
      console.log("📄 Using document context:", document.title);

    } else if (req.body.mode === 'exam_blast') {
      prompt = buildExamBlastPrompt(message);
      console.log("🔥 Using Exam Blast prompt");

    } else if (req.body.mode === 'viva') {
      prompt = buildVivaPrompt(message);
      console.log("🎤 Using Viva prompt");

    } else {
      prompt = buildStudyPrompt(message);
      console.log("💬 Using standard study prompt");
    }

    console.log("🤖 Sending to Gemini...");
    const result      = await geminiModel.generateContent(prompt);
    const rawResponse = result.response.text();
    const aiResponse  = cleanResponse(rawResponse);
    console.log("✅ Gemini response ready");

    const savedChat = await Chat.create({
      userId,
      userMessage: message,
      aiResponse,
      model:       "gemini-2.5-flash",
      topic:       documentTitle || "general",
      timestamp:   new Date(),
    });

    console.log("💾 Chat saved, ID:", savedChat._id);

    res.status(200).json({
      success: true,
      data: {
        chatId:        savedChat._id,
        userMessage:   message,
        aiResponse,
        timestamp:     savedChat.timestamp,
        model:         "gemini-2.5-flash",
        documentId:    documentIdSaved || null,
        documentTitle: documentTitle   || null,
      },
    });

  } catch (error) {
    console.error("❌ Chat Controller Error:", error.message);

    if (error.message.includes("API_KEY")) {
      return res.status(401).json({ success: false, error: "Invalid Gemini API Key" });
    }
    if (error.message.includes("quota")) {
      return res.status(429).json({ success: false, error: "Gemini quota exceeded — try again later" });
    }

    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ============================================
// GET CHAT HISTORY
// ============================================
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const chats = await Chat.find(userId ? { userId } : {})
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({ success: true, count: chats.length, data: chats });
  } catch (error) {
    console.error("❌ History Error:", error.message);
    res.status(500).json({ success: false, error: "Could not fetch chat history" });
  }
};

// ============================================
// DELETE CHAT
// ============================================
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }
    console.log("🗑️ Chat deleted, ID:", req.params.id);
    res.status(200).json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error.message);
    res.status(500).json({ success: false, error: "Could not delete chat" });
  }
};

// ============================================
// VERIFY DB
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
    res.status(500).json({ success: false, error: "Database verification failed: " + error.message });
  }
};

module.exports = { sendMessage, getChatHistory, deleteChat, verifyChats };
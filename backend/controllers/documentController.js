// backend/controllers/documentController.js
const path = require("path");
const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// Suppress canvas warnings — we only need text extraction, not rendering
const PDFJS_WARNINGS_SUPPRESSED = true;
const { geminiModel } = require("../config/gemini");
const Document = require("../models/Document");

// ============================================
// HELPER — Trim extracted text safely
// PDF text extraction can return massive strings
// We limit context sent to Gemini to avoid token limits
// ============================================
const trimContext = (text, maxChars = 12000) => {
  if (!text || text.length <= maxChars) return text;
  return text.substring(0, maxChars) + "\n\n[Document continues — showing first portion only]";
};

// ============================================
// HELPER — Clean Gemini markdown response
// Same pattern as your chatController
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
// 1. UPLOAD DOCUMENT — POST /api/documents/upload
// Receives file, extracts text, saves to MongoDB
// ============================================
const uploadDocument = async (req, res) => {
  try {
    // req.file is attached by Multer middleware
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file received. Please select a PDF to upload.",
      });
    }

    const userId = req.user?.id || req.body.userId || "guest";

    console.log("📄 File received:", req.file.originalname);
    console.log("📦 Size:", (req.file.size / 1024).toFixed(1), "KB");

    // ── Save initial record to DB with status "processing" ──
    const document = await Document.create({
      userId,
      originalName: req.file.originalname,
      storedName:   req.file.filename,
      filePath:     req.file.path,
      fileSize:     req.file.size,
      mimeType:     req.file.mimetype,
      title:        req.body.title || req.file.originalname.replace(".pdf", ""),
      status:       "processing",
    });

    console.log("💾 Document record created, ID:", document._id);

    // ── Extract text from PDF ──
    let extractedText = "";
    let pageCount = 0;

   try {
  const fileBuffer = fs.readFileSync(req.file.path);

  // Load PDF using pdfjs-dist (handles a much wider range of PDFs)
  const pdfData = await pdfjsLib.getDocument({
    data: new Uint8Array(fileBuffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  pageCount = pdfData.numPages;
  console.log("📄 PDF loaded —", pageCount, "pages");

  // Extract text from every page
  const textParts = [];
  for (let i = 1; i <= pageCount; i++) {
    const page    = await pdfData.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map(item => item.str)
      .join(" ")
      .trim();
    if (pageText) textParts.push(pageText);
  }

  extractedText = textParts.join("\n\n").trim();
  console.log("✅ Text extracted —", extractedText.length, "characters,", pageCount, "pages");

} catch (parseError) {
  console.error("❌ PDF parse error:", parseError.message);
  await Document.findByIdAndUpdate(document._id, { status: "failed" });
  return res.status(422).json({
    success: false,
    error: "Could not read this PDF. Please make sure it is a valid PDF file.",
    code: "PDF_PARSE_FAILED",
  });
}

    // ── Validate we got usable text ──
    if (!extractedText || extractedText.length < 50) {
      await Document.findByIdAndUpdate(document._id, { status: "failed" });
      return res.status(422).json({
        success: false,
        error: "This PDF appears to be a scanned image. Only text-based PDFs are supported right now.",
        code: "NO_TEXT_FOUND",
      });
    }

    // ── Update document record with extracted text ──
    await Document.findByIdAndUpdate(document._id, {
      extractedText,
      pageCount,
      status: "ready",
    });

    console.log("✅ Document ready:", document._id);

    res.status(201).json({
      success: true,
      message: "Document uploaded and processed successfully.",
      data: {
        documentId:   document._id,
        title:        document.title,
        originalName: document.originalName,
        fileSize:     document.fileSize,
        pageCount,
        charCount:    extractedText.length,
        status:       "ready",
      },
    });

  } catch (error) {
    console.error("❌ Upload Controller Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Document upload failed. Please try again.",
    });
  }
};

// ============================================
// 2. GET ALL DOCUMENTS — GET /api/documents
// Returns all documents uploaded by this user
// ============================================
const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user?.id || "guest";

    const documents = await Document.getUserDocuments(userId);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });

  } catch (error) {
    console.error("❌ Get Documents Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Could not fetch documents.",
    });
  }
};

// ============================================
// 3. GET SINGLE DOCUMENT — GET /api/documents/:id
// Returns one document's metadata (not the full text)
// ============================================
const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .select("-extractedText"); // Don't send full text — too heavy

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });

  } catch (error) {
    console.error("❌ Get Document Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Could not fetch document.",
    });
  }
};

// ============================================
// 4. DELETE DOCUMENT — DELETE /api/documents/:id
// Removes from MongoDB and deletes file from disk
// ============================================
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found.",
      });
    }

    // Delete file from disk
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
      console.log("🗑️ File deleted from disk:", document.storedName);
    }

    // Delete record from MongoDB
    await Document.findByIdAndDelete(req.params.id);
    console.log("🗑️ Document record deleted:", req.params.id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });

  } catch (error) {
    console.error("❌ Delete Document Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Could not delete document.",
    });
  }
};

// ============================================
// 5. AI ACTIONS — POST /api/documents/:id/action
// The core intelligence endpoint
// action can be: summarize | questions | viva | quiz | explain
// ============================================
const documentAction = async (req, res) => {
  try {
    const { action, userQuestion } = req.body;

    // Validate action type
    const validActions = ["summarize", "questions", "viva", "quiz", "explain"];
    if (!action || !validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        error: `Invalid action. Valid actions: ${validActions.join(", ")}`,
      });
    }

    // Fetch document with extracted text
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found.",
      });
    }

    if (document.status !== "ready") {
      return res.status(400).json({
        success: false,
        error: "Document is not ready yet. Please wait for processing to complete.",
      });
    }

    if (!document.extractedText) {
      return res.status(400).json({
        success: false,
        error: "No text content found in this document.",
      });
    }

    // Trim context to stay within Gemini's token limits
    const context = trimContext(document.extractedText);

    console.log(`🤖 Running action "${action}" on document: ${document.originalName}`);

    // ── Build prompt based on action ──
    let prompt = "";

    if (action === "summarize") {
      prompt = `
You are StudyBuddy AI helping an engineering student understand their study material.

Below is the content of a document titled "${document.title}".

DOCUMENT CONTENT:
${context}

Your task: Write a clear, structured summary of this document for a student.

Your summary must include:
1. What this document is about (1-2 sentences)
2. Main topics covered (as a numbered list)
3. Key concepts explained simply (explain each important concept in 2-3 lines)
4. Most important points to remember for exams

Keep the tone friendly and helpful. Write as if explaining to a classmate.
      `;
    }

    else if (action === "questions") {
      prompt = `
You are StudyBuddy AI helping an engineering student prepare for exams.

Below is the content of a document titled "${document.title}".

DOCUMENT CONTENT:
${context}

Your task: Generate the 10 most important exam questions from this document.

For each question:
- Write the question clearly
- Write a complete model answer (6-8 lines) that covers all key points and in easy to understand form.

Format:
Q1. [Question]
Answer: [complete answer]

Focus on questions that are most likely to appear in engineering university exams.
      `;
    }

    else if (action === "viva") {
      prompt = `
You are StudyBuddy AI helping an engineering student prepare for their viva exam.

Below is the content of a document titled "${document.title}".

DOCUMENT CONTENT:
${context}

Your task: Generate 10 to 15 viva voce questions from this document.

These should be:
- Short direct questions a professor would ask face-to-face
- Testing conceptual understanding, not just memory
- Ranging from basic to advanced

For each question provide:
Q: [question]
A: [short ideal answer — 2 to 4 lines max]

Also add a "Tricky Follow-up:" after 3 of the questions that a professor might ask to go deeper.
      `;
    }

    else if (action === "quiz") {
      prompt = `
You are StudyBuddy AI creating a quiz for an engineering student.

Below is the content of a document titled "${document.title}".

DOCUMENT CONTENT:
${context}

Your task: Create 10 to 15 multiple choice questions (MCQs) from this document.

Format for each question:
Q1. [question]
A) [option]
B) [option]
C) [option]
D) [option]
Correct Answer: [letter]
Explanation: [1-2 line explanation of why this is correct]

Make sure all 4 options are plausible. Avoid high trick questions.
Cover a range of topics from the document.
      `;
    }

    else if (action === "explain") {
      if (!userQuestion || userQuestion.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "Please provide a question to explain from the document.",
        });
      }

      prompt = `
You are StudyBuddy AI helping an engineering student understand their document.

Below is the content of a document titled "${document.title}".

DOCUMENT CONTENT:
${context}

The student is asking: "${userQuestion}"

Answer this question using the document content as your primary reference.
If the answer is directly in the document, explain it clearly and in detail in simple understanable form.
If the document only partially covers it, answer from the document first then expand from valid knowledge and resources.
If it is completely outside the document, say so honestly and still try to help and guide the student.

Keep your answer clear, friendly, and complete.
      `;
    }

    // ── Call Gemini ──
    const result = await geminiModel.generateContent(prompt);
    const rawResponse = result.response.text();
    const aiResponse = cleanResponse(rawResponse);

    console.log("✅ AI response ready for action:", action);

    res.status(200).json({
      success: true,
      data: {
        action,
        documentId:   document._id,
        documentTitle: document.title,
        response:     aiResponse,
      },
    });

  } catch (error) {
    console.error("❌ Document Action Error:", error.message);

    if (error.message.includes("quota")) {
      return res.status(429).json({
        success: false,
        error: "Gemini quota exceeded. Please try again later.",
      });
    }

    res.status(500).json({
      success: false,
      error: "AI action failed. Please try again.",
    });
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  getDocument,
  deleteDocument,
  documentAction,
};
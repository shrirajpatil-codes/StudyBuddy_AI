// backend/routes/documents.js
const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getUserDocuments,
  getDocument,
  deleteDocument,
  documentAction,
} = require("../controllers/documentController");

const { protect }       = require("../middleware/authMiddleware");
const { handleUpload }  = require("../middleware/uploadMiddleware");

// ============================================
// ALL ROUTES ARE PROTECTED
// User must be logged in to upload/view documents
// ============================================

// POST /api/documents/upload
// Flow: protect → handleUpload (Multer) → uploadDocument
// protect runs first — no point saving a file if user isn't authenticated
// handleUpload runs second — saves file to disk, adds req.file
// uploadDocument runs last — extracts text, saves to MongoDB
router.post("/upload", protect, handleUpload, uploadDocument);

// GET /api/documents
// Returns all documents for the logged-in user
router.get("/", protect, getUserDocuments);

// GET /api/documents/:id
// Returns metadata for one specific document
router.get("/:id", protect, getDocument);

// DELETE /api/documents/:id
// Deletes file from disk and record from MongoDB
router.delete("/:id", protect, deleteDocument);

// POST /api/documents/:id/action
// Body: { action: "summarize" | "questions" | "viva" | "quiz" | "explain", userQuestion? }
// Runs AI analysis on the document
router.post("/:id/action", protect, documentAction);

module.exports = router;
// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// ============================================
// STORAGE CONFIGURATION
// Tells Multer WHERE to save files and WHAT to name them
// ============================================
const storage = multer.diskStorage({

  // Where to save the file on disk
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },

  // What to name the saved file
  // We generate a unique name to avoid collisions
  // Format: timestamp-randomhex-originalname
  // Example: 1714500000000-a3f9b2c1-myresume.pdf
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${timestamp}-${uniqueSuffix}${ext}`;
    cb(null, safeName);
  },
});

// ============================================
// FILE FILTER
// Reject anything that is not a PDF
// ============================================
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf"];
  const allowedExtensions = [".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject with a clear error message
    cb(
      new Error("Only PDF files are allowed. Please upload a .pdf file."),
      false
    );
  }
};

// ============================================
// MULTER INSTANCE
// Combines storage + filter + size limit
// ============================================
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max
  },
});

// ============================================
// EXPORT
// uploadSingle — for uploading one PDF at a time
// "document" is the field name the frontend must use
// ============================================
const uploadSingle = upload.single("document");

// ============================================
// WRAPPED MIDDLEWARE
// Multer errors don't reach Express global error handler by default
// This wrapper catches Multer-specific errors and formats them properly
// ============================================
const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (!err) {
      // No error — file accepted, move to controller
      return next();
    }

    // Multer-specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum allowed size is 100MB.",
        code: "FILE_TOO_LARGE",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: 'Unexpected field name. Use "document" as the field name.',
        code: "WRONG_FIELD_NAME",
      });
    }

    // Our custom fileFilter error (wrong file type)
    if (err.message.includes("Only PDF files are allowed")) {
      return res.status(400).json({
        success: false,
        error: err.message,
        code: "INVALID_FILE_TYPE",
      });
    }

    // Any other Multer or unknown error
    return res.status(500).json({
      success: false,
      error: "File upload failed. Please try again.",
      code: "UPLOAD_FAILED",
    });
  });
};

module.exports = { handleUpload };
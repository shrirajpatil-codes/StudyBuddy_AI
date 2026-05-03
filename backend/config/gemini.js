const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Updated to 2026 free tier model
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const testGeminiConnection = async () => {
  try {
    const result = await geminiModel.generateContent(
      "Say exactly: Gemini connected successfully!"
    );
    const response = result.response.text();
    console.log("✅ Gemini Connected:", response);
  } catch (error) {
    console.error("❌ Gemini Connection Failed:", error.message);
  }
};

module.exports = { geminiModel, testGeminiConnection };
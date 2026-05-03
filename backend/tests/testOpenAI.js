const path = require('path');
// This finds the .env file relative to THIS script file
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const openai = require("../config/openai");


async function testConnection() {
  try {
    console.log("🔄 Testing OpenAI connection...");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say hello in one sentence.",
        },
      ],
      max_tokens: 50,
    });

    console.log("✅ OpenAI Connected Successfully!");
    console.log("🤖 Response:", response.choices[0].message.content);

  } catch (error) {
    console.error("❌ Connection Failed!");
    console.error("Error:", error.message);
  }
}

testConnection();
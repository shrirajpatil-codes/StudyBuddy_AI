const OpenAI = require('openai');
const Chat = require('../models/Chat');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // System prompt for engineering students
    const systemPrompt = `You are StudyBuddy AI, a helpful assistant for 
    engineering students. Explain concepts clearly and simply.`;

    // Get AI response
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });

    const aiReply = response.choices[0].message.content;

    // Save to database
    let chatSession = await Chat.findOne({ userId });

    if (!chatSession) {
      chatSession = new Chat({ userId, messages: [] });
    }

    chatSession.messages.push({ role: 'user', content: message });
    chatSession.messages.push({ role: 'assistant', content: aiReply });
    await chatSession.save();

    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get chat history
const getHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user._id });
    res.status(200).json({ messages: chat ? chat.messages : [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { chat, getHistory };
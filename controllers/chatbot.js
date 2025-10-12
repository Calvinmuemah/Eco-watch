import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatSession from "../models/chatSession.model.js"; // MongoDB model
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Chat with Bot ---
export const chatWithBot = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message)
      return res.status(400).json({ error: "Message is required." });

    if (!sessionId)
      return res.status(400).json({ error: "sessionId is required." });

    // 1️⃣ Get chat history from MongoDB
    let chatSession = await ChatSession.findOne({ sessionId });

    if (!chatSession) {
      chatSession = await ChatSession.create({
        sessionId,
        messages: [],
      });
    }

    // 2️⃣ Add user message
    chatSession.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Keep last 12 messages for context
    const trimmedHistory = chatSession.messages.slice(-12);

    // 3️⃣ Build conversation context
    const conversationContext = trimmedHistory
      .map((m) => `${m.role === "user" ? "User" : "EcoBot"}: ${m.content}`)
      .join("\n");

    // 4️⃣ Create AI prompt
    const prompt = `
      You are **EcoBot**, a funny but wise AI environmental assistant 🌿💧.
      You help users understand:
      - Water pollution, pH, turbidity, nitrates, phosphates, and water safety.

      Guidelines:
      - Keep replies short and friendly (max 5 sentences).
      - Detect and reply in Swahili or English depending on the user’s language.
      - If greeted ("Hi", "Habari", "Mambo", etc.), respond warmly and introduce yourself.
      - Add a light sense of humor — sound like a cheerful eco friend.
      - Use past context to make responses relevant.

      Chat so far:
      ${conversationContext}

      Reply to the latest user message only.
    `;

    // 5️⃣ Generate response using Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // 6️⃣ Add bot reply to MongoDB
    chatSession.messages.push({
      role: "bot",
      content: reply,
      timestamp: new Date(),
    });

    await chatSession.save();

    res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Failed to generate chatbot response" });
  }
};

// --- Get chat history ---
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId)
      return res.status(400).json({ error: "sessionId is required." });

    const chatSession = await ChatSession.findOne({ sessionId });

    if (!chatSession)
      return res
        .status(404)
        .json({ message: "No chat history found for this session." });

    res.status(200).json({
      success: true,
      count: chatSession.messages.length,
      history: chatSession.messages,
    });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// controllers/chatbot.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { firebaseDB } from "../config/firebase.js";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithBot = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message)
      return res.status(400).json({ error: "Message is required." });

    if (!sessionId)
      return res.status(400).json({ error: "sessionId is required." });

    const sessionRef = firebaseDB.ref(`chat_sessions/${sessionId}`);

    // 1 Fetch previous chat history from Firebase
    const snapshot = await sessionRef.once("value");
    const chatHistory = snapshot.val() || [];

    // 2 Add user message
    chatHistory.push({ role: "user", content: message, timestamp: Date.now() });

    // Keep only the last 12 messages
    const trimmedHistory = chatHistory.slice(-12);

    // 3 Build conversation context
    const conversationContext = trimmedHistory
      .map((m) => `${m.role === "user" ? "User" : "EcoBot"}: ${m.content}`)
      .join("\n");

    // 4 Create AI prompt
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

    // 5 Generate response from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // 6 Add bot reply to chat history
    trimmedHistory.push({
      role: "bot",
      content: reply,
      timestamp: Date.now(),
    });

    // 7 Save updated chat to Firebase
    await sessionRef.set(trimmedHistory);

    res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Failed to generate chatbot response" });
  }
};

// --- New function to fetch chat history ---
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId)
      return res.status(400).json({ error: "sessionId is required." });

    const sessionRef = firebaseDB.ref(`chat_sessions/${sessionId}`);
    const snapshot = await sessionRef.once("value");
    const history = snapshot.val();

    if (!history)
      return res.status(404).json({ message: "No chat history found for this user." });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};


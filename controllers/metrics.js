import { firebaseDB } from "../config/firebase.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getRealtimeMetrics = async (req, res) => {
  try {
    // 1 Fetch sensor data from Firebase
    const snapshot = await firebaseDB.ref("sensors").once("value");
    const data = snapshot.val();

    if (!data) {
      return res.status(404).json({ message: "No data found in Firebase." });
    }

    // 2 Convert Firebase object to array
    const sensorsArray = Object.entries(data).map(([deviceId, sensorData]) => ({
      deviceId,
      ...sensorData,
    }));

    // 3 Prepare AI prompt (short and focused)
    const prompt = `
      You are an environmental assistant. 
      Analyze this real-time water sensor data and give a **brief summary** (max 5 sentences).

      Include:
      - Water quality rating (Good / Moderate / Poor)
      - Algae bloom risk (Low / Medium / High)
      - 1–2 short recommendations only
      - What to monitor next (in few words)

      Keep it **concise and direct**, no long explanations.

      Data:
      ${JSON.stringify(sensorsArray, null, 2)}
    `;

    // 4 Generate AI-based concise analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const ai_analysis = result.response.text();

    // 5 Return Firebase data + AI insights
    res.status(200).json({
      success: true,
      count: sensorsArray.length,
      data: sensorsArray,
      ai_analysis,
    });
  } catch (err) {
    console.error("Error fetching realtime metrics:", err);
    res.status(500).json({ error: "Failed to fetch or analyze realtime data" });
  }
};

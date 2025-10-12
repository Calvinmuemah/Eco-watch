import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Sensor from "../models/Sensor.js"; // your Mongo model for IoT data

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getRealtimeMetrics = async (req, res) => {
  try {
    // 1️⃣ Fetch latest IoT sensor data from MongoDB
    // (fetch last 10 records, adjust as needed)
    const sensors = await Sensor.find().sort({ createdAt: -1 }).limit(10);

    if (!sensors || sensors.length === 0) {
      return res.status(404).json({ message: "No sensor data found in MongoDB." });
    }

    // 2️⃣ Prepare AI prompt for analysis
    const prompt = `
      You are an environmental assistant.
      Analyze this real-time water sensor data and give a **brief summary** (max 5 sentences).

      Include:
      - Water quality rating (Good / Moderate / Poor)
      - Algae bloom risk (Low / Medium / High)
      - 1–2 short recommendations only
      - What to monitor next (in few words)

      Keep it concise and direct, no long explanations.

      Data:
      ${JSON.stringify(sensors, null, 2)}
    `;

    // 3️⃣ Use Gemini AI for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const ai_analysis = result.response.text();

    // 4️⃣ Send data + AI insight
    res.status(200).json({
      success: true,
      count: sensors.length,
      data: sensors,
      ai_analysis,
    });
  } catch (err) {
    console.error("Error fetching realtime metrics:", err);
    res.status(500).json({ error: "Failed to fetch or analyze realtime data" });
  }
};

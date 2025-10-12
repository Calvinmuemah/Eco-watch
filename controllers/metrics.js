import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Sensor from "../models/Sensor.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getRealtimeMetrics = async (req, res) => {
  try {
    // 1️⃣ Fetch latest IoT sensor data
    const sensors = await Sensor.find().sort({ createdAt: -1 }).limit(10);

    if (!sensors || sensors.length === 0) {
      return res.status(404).json({ message: "No sensor data found in MongoDB." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2️⃣ Analyze each record individually
    const analyzedSensors = await Promise.all(
      sensors.map(async (sensor) => {
        const prompt = `
          You are an environmental AI assistant.
          Analyze the following single water sensor reading and give a **short 3–5 sentence summary**.

          Include:
          - Water quality rating (Good / Moderate / Poor)
          - Algae bloom risk (Low / Medium / High)
          - 1 short recommendation
          - What to monitor next

          Keep it concise and friendly.

          Data:
          ${JSON.stringify(sensor.parameters, null, 2)}
        `;

        try {
          const result = await model.generateContent(prompt);
          const ai_analysis = result.response.text();
          return { ...sensor._doc, ai_analysis };
        } catch (err) {
          console.error("AI error for record:", sensor._id, err.message);
          return { ...sensor._doc, ai_analysis: "Error analyzing this record." };
        }
      })
    );

    // 3️⃣ Return array of individually analyzed results
    res.status(200).json({
      success: true,
      count: analyzedSensors.length,
      analyzedSensors,
    });
  } catch (err) {
    console.error("Error fetching realtime metrics:", err);
    res.status(500).json({ error: "Failed to fetch or analyze realtime data" });
  }
};

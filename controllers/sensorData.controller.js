import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SensorData from "../models/sensorData.model.js";

dotenv.config();

// 🧠 Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 🌿 Bloom risk estimation
function estimateBloomRisk({ temperature, pH, turbidity, nitrate, phosphate }) {
  if (
    temperature > 26 &&
    pH > 8 &&
    turbidity > 60 &&
    nitrate > 10 &&
    phosphate > 0.1
  )
    return "High";
  if (
    temperature > 22 &&
    pH > 7.5 &&
    (turbidity > 40 || nitrate > 5 || phosphate > 0.05)
  )
    return "Medium";
  return "Low";
}

// 🟢 Add new sensor data (short, smart AI analysis)
export const addSensorData = async (req, res) => {
  try {
    const data = req.body;

    if (!data.deviceId || !data.parameters) {
      return res.status(400).json({
        error: "Missing deviceId or parameters in the request body.",
      });
    }

    // 1️⃣ Estimate bloom risk
    const bloomRisk = estimateBloomRisk(data.parameters);

    // 2️⃣ Short and friendly AI prompt
    const prompt = `
      You are AquaSense, an environmental AI. 
      Give a short, clear 3–5 line summary of the water quality below.

      Readings:
      ${JSON.stringify(data.parameters, null, 2)}

      Include:
      - Water Quality (Good / Moderate / Poor)
      - Bloom Risk (Low / Medium / High)
      - One quick tip for improvement
      - Keep it casual but professional (no long paragraphs).
    `;

    // 3️⃣ Generate short AI analysis
    let analysis = "AI analysis unavailable (Gemini error or network issue).";
    try {
      const result = await model.generateContent(prompt);
      analysis = result.response.text().trim();
    } catch (err) {
      console.error("Gemini API error:", err.message);
    }

    // 4️⃣ Save data + AI analysis
    const newRecord = await SensorData.create({
      ...data,
      bloomRisk,
      analysis,
      timestamp: new Date(),
    });

    // 5️⃣ Send response
    res.status(201).json({
      success: true,
      message: "Sensor data saved and analyzed successfully ✅",
      record: newRecord,
    });
  } catch (err) {
    console.error("Error saving sensor data:", err);
    res.status(500).json({
      error: "Server error while saving or analyzing sensor data.",
      details: err.message,
    });
  }
};

// 🟡 Get all sensor data
export const getAllData = async (req, res) => {
  try {
    const records = await SensorData.find().sort({ timestamp: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Server error fetching sensor data." });
  }
};

// 🔵 Get latest data
export const getLatestData = async (req, res) => {
  try {
    const latestRecord = await SensorData.findOne().sort({ timestamp: -1 });
    if (!latestRecord)
      return res.status(404).json({ message: "No sensor data found." });

    res.status(200).json(latestRecord);
  } catch (err) {
    console.error("Error fetching latest record:", err);
    res.status(500).json({ error: "Server error fetching latest record." });
  }
};

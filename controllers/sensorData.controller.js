import SensorData from "../models/sensorData.model.js";

// Helper: simple bloom prediction logic
function estimateBloomRisk({ temperature, pH, turbidity }) {
  if (temperature > 25 && pH > 8 && turbidity > 50) return "High";
  if (temperature > 20 && pH > 7.5) return "Medium";
  return "Low";
}

// Add new sensor data
export const addSensorData = async (req, res) => {
  try {
    const data = req.body;

    if (!data.deviceId || !data.parameters) {
      return res.status(400).json({ error: "Missing deviceId or parameters" });
    }

    // 1️⃣ Calculate bloom risk
    const bloomRisk = estimateBloomRisk(data.parameters);

    // 2️⃣ Save in MongoDB
    const newRecord = await SensorData.create({
      ...data,
      bloomRisk,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Sensor data saved successfully",
      newRecord,
    });
  } catch (err) {
    console.error("Error saving sensor data:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all sensor data (latest first)
export const getAllData = async (req, res) => {
  try {
    const records = await SensorData.find().sort({ timestamp: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get latest sensor data (for dashboard refresh every 3s)
export const getLatestData = async (req, res) => {
  try {
    const latestRecord = await SensorData.findOne().sort({ timestamp: -1 });
    if (!latestRecord) {
      return res.status(404).json({ message: "No sensor data found" });
    }
    res.status(200).json(latestRecord);
  } catch (err) {
    console.error("Error fetching latest data:", err);
    res.status(500).json({ error: err.message });
  }
};

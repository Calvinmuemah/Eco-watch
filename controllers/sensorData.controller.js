import SensorData from "../models/sensorData.model.js";
import { firebaseDB } from "../config/firebase.js";

// helper: simple bloom prediction logic
function estimateBloomRisk({ temperature, pH, turbidity }) {
  if (temperature > 25 && pH > 8 && turbidity > 50) return "High";
  if (temperature > 20 && pH > 7.5) return "Medium";
  return "Low";
}

export const addSensorData = async (req, res) => {
  try {
    const data = req.body;

    // 1 calculate risk
    const bloomRisk = estimateBloomRisk(data.parameters);

    // 2  save in MongoDB
    const newRecord = await SensorData.create({ ...data, bloomRisk });

    // 3  update Firebase Realtime DB for live dashboards
    await firebaseDB.ref(`sensors/${data.deviceId}`).set({
      ...data,
      bloomRisk,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ success: true, newRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// from MongoDB
export const getAllData = async (req, res) => {
  try {
    const records = await SensorData.find().sort({ timestamp: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Get all current sensor data from Firebase
// export const getRealtimeMetrics = async (req, res) => {
//   try {
//     const snapshot = await firebaseDB.ref("sensors").once("value");
//     const data = snapshot.val();

//     if (!data) {
//       return res.status(404).json({ message: "No data found in Firebase." });
//     }

//     // Convert Firebase object to array
//     const sensorsArray = Object.entries(data).map(([deviceId, sensorData]) => ({
//       deviceId,
//       ...sensorData,
//     }));

//     res.status(200).json({
//       success: true,
//       count: sensorsArray.length,
//       data: sensorsArray,
//     });
//   } catch (err) {
//     console.error("Error fetching realtime metrics:", err);
//     res.status(500).json({ error: "Failed to fetch realtime data" });
//   }
// };
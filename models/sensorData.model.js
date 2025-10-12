import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, index: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  parameters: {
    temperature: { type: Number, required: true },
    pH: { type: Number, required: true },
    turbidity: { type: Number, required: true },
    dissolvedOxygen: { type: Number, required: true },
    nitrate: { type: Number, required: true },
    phosphate: { type: Number, required: true },
  },
  bloomRisk: { type: String, default: "Low" },
  timestamp: { type: Date, default: Date.now, index: true }});

// Geo index for spatial queries
sensorDataSchema.index({ "location": "2dsphere" });

// Compound index for fast "latest by device" queries
sensorDataSchema.index({ deviceId: 1, timestamp: -1 });

export default mongoose.model("SensorData", sensorDataSchema);

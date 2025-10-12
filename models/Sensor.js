import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
  {
    deviceId: String,
    temperature: Number,
    turbidity: Number,
    ph: Number,
    dissolvedOxygen: Number,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Sensor", sensorSchema);

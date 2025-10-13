import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    coords: { type: String },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;

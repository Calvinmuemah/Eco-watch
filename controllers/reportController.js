import Report from "../models/Report.js";
import cloudinary from "cloudinary";
import multer from "multer";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// POST /api/reports
export const createReport = async (req, res) => {
  try {
    const { location, description, severity, coords } = req.body;
    let imageUrl;

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload_stream(
        { folder: "ecowatch_reports" },
        (error, result) => {
          if (error) throw error;
          imageUrl = result.secure_url;
          saveReport();
        }
      ).end(req.file.buffer);
    } else {
      saveReport();
    }

    async function saveReport() {
      const report = await Report.create({
        location,
        description,
        severity,
        coords,
        imageUrl,
      });
      res.status(201).json({ success: true, report });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// GET /api/reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /api/reports/:id
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report)
      return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

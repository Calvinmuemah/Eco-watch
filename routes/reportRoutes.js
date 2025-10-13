import express from "express";
import { createReport, getReports, getReportById, upload } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", upload.single("image"), createReport);
router.get("/", getReports);
router.get("/:id", getReportById);

export default router;

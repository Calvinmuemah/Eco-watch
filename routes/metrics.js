import express from "express";
import { getRealtimeMetrics } from "../controllers/metrics.js";

const router = express.Router();
router.get("/data", getRealtimeMetrics);

export default router;

import express from "express";
import { getRealtimeMetrics } from "../controllers/metrics.js";

const router = express.Router();
router.get("/metrics", getRealtimeMetrics);

export default router;

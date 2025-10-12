import express from "express";
import { addSensorData, getAllData } from "../controllers/sensorData.controller.js";

const router = express.Router();

router.post("/", addSensorData);
router.get("/", getAllData);
// router.get("/realtime-metrics", getRealtimeMetrics);

export default router;


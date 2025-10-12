import express from "express";
import { addSensorData, getAllData, getLatestData } from "../controllers/sensorData.controller.js";

const router = express.Router();

router.post("/", addSensorData);       // IoT device POSTs data here
router.get("/", getAllData);           // Get all sensor data
router.get("/latest", getLatestData);  // Get most recent record

export default router;

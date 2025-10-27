import express from "express";
import { addSensorData, getAllData, getLatestData } from "../controllers/sensorData.controller.js";

const router = express.Router();

router.post("/", addSensorData);
router.get("/", getAllData);
router.get("/latest", getLatestData);

export default router;

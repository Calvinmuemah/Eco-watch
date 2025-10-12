import express from "express";
import { chatWithBot, getChatHistory } from "../controllers/chatbot.js";

const router = express.Router();

router.post("/", chatWithBot);
router.get("/history/:sessionId", getChatHistory);

export default router;

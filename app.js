import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import dotenv from "dotenv";

import "./config/passport.js";
import { limiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Routes
import sensorDataRoutes from "./routes/sensorData.routes.js";
import metricsRoutes from "./routes/metrics.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// --- Middleware setup ---
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(passport.initialize());
app.use("/api", limiter);

// --- Health check ---
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Eco Watch backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

// --- API routes ---
app.use("/api/sensor-data", sensorDataRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// --- Global error handler ---
app.use(errorHandler);

export default app;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";

// Config & DB
import { connectDB } from "./config/db.js";
import "./config/passport.js";

// Routes
import sensorDataRoutes from "./routes/sensorData.routes.js";
import metricsRoutes from "./routes/metrics.js";
import chatRoutes from "./routes/chat.js";
import authRouter from "./routes/auth.routes.js";

// Middlewares
import { errorHandler } from "./middlewares/errorHandler.js";
import { limiter } from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Passport initialization
app.use(passport.initialize());

// Rate limiting
app.use("/api", limiter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "eco watch backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/sensor-data", sensorDataRoutes);
app.use("/api", metricsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// Connect to database
connectDB();

export default app;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { requestTimeout } from "./middleware/requestTimeout.js";
import { publicCache } from "./middleware/publicCache.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "dist");
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 5000;
const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS) || 30_000;
const startedAt = Date.now();
let shuttingDown = false;

// Set this only when the app is behind a trusted reverse proxy/load balancer.
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      // Cloudinary is the only external host used for site media assets.
      // Helmet retains its other default CSP directives.
      "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
      "media-src": ["'self'", "https://res.cloudinary.com"],
    },
  },
}));

const allowedOrigins = (process.env.CLIENT_URL)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server and same-origin requests without an Origin header.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      const error = new Error("Origin is not allowed by CORS");
      error.statusCode = 403;
      return callback(error);
    },
    credentials: true,
  })
);

app.use(requestTimeout(timeoutMs));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

if (!isProduction) app.use(morgan("dev"));

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.INQUIRY_RATE_LIMIT_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many inquiries. Please try again later." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication requests. Please try again later." },
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/inquiries", inquiryLimiter);

// Browser/CDN cache for public catalog and site data. Express ETags provide
// conditional 304 responses; admin reads and all=true bypass shared caching.
app.use("/api/products", publicCache(Number(process.env.PRODUCT_CACHE_SECONDS) || 60));
app.use("/api/categories", publicCache(Number(process.env.CATEGORY_CACHE_SECONDS) || 300));
app.use("/api/settings", publicCache(Number(process.env.SETTINGS_CACHE_SECONDS) || 300));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/testimonials", testimonialRoutes);

const healthHandler = (req, res) => {
  const database = ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState];
  const ready = !shuttingDown && database === "connected";
  res.status(ready ? 200 : 503).json({
    success: ready,
    status: shuttingDown ? "shutting_down" : ready ? "ok" : "degraded",
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    database,
    process: {
      pid: process.pid,
      memoryUsageBytes: process.memoryUsage().rss,
    },
  });
};
// Keep both paths for existing monitors and common hosting platform defaults.
app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use(express.static(frontendDistPath, {
  setHeaders(res, filePath) {
    const normalizedPath = filePath.replaceAll("\\", "/");
    if (/\/assets\/.*-[A-Za-z0-9_-]{8,}\./.test(normalizedPath)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else if (normalizedPath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache");
    } else {
      res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    }
  },
}));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/") || req.path === "/health") return next();
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
server.requestTimeout = timeoutMs;
server.headersTimeout = Math.max(timeoutMs + 5_000, 60_000);
server.keepAliveTimeout = 5_000;

async function startServer() {
  // Keep retrying while MongoDB is unavailable; Mongoose also reconnects after
  // a successful initial connection when the network drops later.
  await connectDB();
  server.listen(port, () => {
    console.log(`BagHaus API listening on ${port} [${process.env.NODE_ENV || "development"}]`);
  });
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; starting graceful shutdown`);

  const forcedExit = setTimeout(() => {
    console.error("Graceful shutdown timed out; forcing exit");
    process.exit(1);
  }, Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10_000);
  forcedExit.unref();

  if (server.listening) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
  clearTimeout(forcedExit);
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  void shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  void shutdown("uncaughtException");
});

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});

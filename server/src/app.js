import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { existsSync } from "fs";
import helmet from "helmet";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { createStore } from "./data/store.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";
import forumRouter from "./routes/forum.js";
import jobsRouter from "./routes/jobs.js";
import reportsRouter from "./routes/reports.js";
import searchRouter from "./routes/search.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();
const allowedOrigins = createAllowedOrigins(process.env.CLIENT_ORIGIN);
const staticRoot = resolveStaticRoot(process.env.STATIC_ROOT);
const mobileAppOrigins = [
  "http://localhost",
  "https://localhost",
  "http://127.0.0.1",
  "https://127.0.0.1",
  "capacitor://localhost",
  "ionic://localhost"
];

function createAllowedOrigins(value) {
  const entries = String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const origins = new Set(entries);

  for (const origin of mobileAppOrigins) {
    origins.add(origin);
  }

  for (const entry of entries) {
    try {
      const url = new URL(entry);
      if (url.hostname === "localhost") {
        origins.add(`${url.protocol}//127.0.0.1${url.port ? `:${url.port}` : ""}`);
      }
      if (url.hostname === "127.0.0.1") {
        origins.add(`${url.protocol}//localhost${url.port ? `:${url.port}` : ""}`);
      }
    } catch {
      // Ignore invalid entries.
    }
  }
  return origins;
}

function resolveStaticRoot(value) {
  const requested = String(value || "").trim();
  if (requested) {
    const candidate = resolve(requested);
    return existsSync(join(candidate, "index.html")) ? candidate : null;
  }

  const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
  return existsSync(join(defaultRoot, "index.html")) ? defaultRoot : null;
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    }
  })
);
app.use(helmet());
app.use(express.json({ limit: "15mb" }));
app.locals.store = createStore();
app.use((req, res, next) => {
  req.store = app.locals.store;
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "wes-fsm-api",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", authRouter);
app.use("/api", dashboardRouter);
app.use("/api", jobsRouter);
app.use("/api", reportsRouter);
app.use("/api", searchRouter);
app.use("/api", usersRouter);
app.use("/api", forumRouter);

if (staticRoot) {
  app.use(express.static(staticRoot));
  app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
    res.sendFile(join(staticRoot, "index.html"));
  });
}

app.use(errorHandler);

export default app;

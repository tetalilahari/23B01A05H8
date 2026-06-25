import express from "express";
import cors from "cors";
import { CONFIG } from "./config/env";
import { requestLoggerMiddleware } from "./middleware/requestLogger";
import routes from "./routes/index";
import { Log, setLoggerToken } from "../../logging-middleware/src/index";

const app = express();

// Init logger
setLoggerToken(CONFIG.BEARER_TOKEN);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(requestLoggerMiddleware);
app.use("/api", routes);

// Health check
app.get("/health", async (_req, res) => {
  await Log("backend", "info", "route", "Health check endpoint called");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
// Debug: print all registered routes
app.use((req, _res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});
app.use(async (_req, res) => {
  await Log("backend", "warn", "handler", `404 - Route not found`);
  res.status(404).json({ error: "Route not found" });
});

app.listen(CONFIG.PORT, async () => {
  await Log("backend", "info", "config",
    `Backend server running on http://localhost:${CONFIG.PORT}`
  );
  console.log(`✅ Backend running on http://localhost:${CONFIG.PORT}`);
});
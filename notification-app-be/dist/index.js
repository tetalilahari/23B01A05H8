"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const requestLogger_1 = require("./middleware/requestLogger");
const index_1 = __importDefault(require("./routes/index"));
const index_2 = require("../../logging-middleware/src/index");
const app = (0, express_1.default)();
// Init logger
(0, index_2.setLoggerToken)(env_1.CONFIG.BEARER_TOKEN);
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
app.use(express_1.default.json());
app.use(requestLogger_1.requestLoggerMiddleware);
app.use("/api", index_1.default);
// Health check
app.get("/health", async (_req, res) => {
    await (0, index_2.Log)("backend", "info", "route", "Health check endpoint called");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// 404 handler
app.use(async (_req, res) => {
    await (0, index_2.Log)("backend", "warn", "handler", `404 - Route not found`);
    res.status(404).json({ error: "Route not found" });
});
app.listen(env_1.CONFIG.PORT, async () => {
    await (0, index_2.Log)("backend", "info", "config", `Backend server running on http://localhost:${env_1.CONFIG.PORT}`);
    console.log(`✅ Backend running on http://localhost:${env_1.CONFIG.PORT}`);
});

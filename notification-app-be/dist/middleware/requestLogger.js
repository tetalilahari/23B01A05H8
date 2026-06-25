"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = requestLoggerMiddleware;
const index_1 = require("../../../logging-middleware/src/index");
function requestLoggerMiddleware(req, res, next) {
    const start = Date.now();
    (0, index_1.Log)("backend", "info", "middleware", `→ ${req.method} ${req.path} - Query: ${JSON.stringify(req.query)}`);
    res.on("finish", () => {
        const ms = Date.now() - start;
        const level = res.statusCode >= 500 ? "error"
            : res.statusCode >= 400 ? "warn" : "info";
        (0, index_1.Log)("backend", level, "middleware", `← ${req.method} ${req.path} ${res.statusCode} - ${ms}ms`);
    });
    next();
}

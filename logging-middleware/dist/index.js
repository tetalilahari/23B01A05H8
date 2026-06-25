"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoggerToken = setLoggerToken;
exports.Log = Log;
// ✅ Update log URL too
const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
let authToken = "";
function setLoggerToken(token) {
    authToken = token;
}
async function Log(stack, level, pkg, message) {
    if (!authToken)
        return;
    const safeMessage = message.slice(0, 48);
    try {
        const response = await fetch(LOG_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message: safeMessage,
            }),
        });
        if (!response.ok) {
            console.error(`[Logger] Failed: ${response.status} - ${await response.text()}`);
        }
    }
    catch (err) {
        console.error("[Logger] Network error:", err);
    }
}

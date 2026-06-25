"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNotifications = fetchNotifications;
exports.computePriority = computePriority;
exports.getTopN = getTopN;
const index_1 = require("../../../logging-middleware/src/index");
const env_1 = require("../config/env");
// Initialize logger with token
(0, index_1.setLoggerToken)(env_1.CONFIG.BEARER_TOKEN);
async function fetchNotifications(limit, page, notification_type) {
    await (0, index_1.Log)("backend", "info", "service", `fetchNotifications called - limit:${limit} page:${page} type:${notification_type}`);
    const params = new URLSearchParams();
    if (limit)
        params.append("limit", String(limit));
    if (page)
        params.append("page", String(page));
    if (notification_type)
        params.append("notification_type", notification_type);
    const url = `${env_1.CONFIG.TEST_SERVER}/notifications?${params.toString()}`;
    try {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${env_1.CONFIG.BEARER_TOKEN}` },
        });
        if (!res.ok) {
            await (0, index_1.Log)("backend", "error", "service", `Test server returned ${res.status} when fetching notifications`);
            throw new Error(`Server error: ${res.status}`);
        }
        const data = await res.json();
        await (0, index_1.Log)("backend", "info", "service", `Fetched ${data.notifications.length} notifications successfully`);
        return data.notifications;
    }
    catch (err) {
        await (0, index_1.Log)("backend", "fatal", "service", `Failed to fetch notifications: ${err.message}`);
        throw err;
    }
}
// Priority: Placement=3, Result=2, Event=1 + recency bonus
function computePriority(n) {
    const weights = { Placement: 3, Result: 2, Event: 1 };
    const weight = weights[n.Type] || 0;
    const ageMs = Date.now() - new Date(n.Timestamp).getTime();
    const recency = Math.max(0, 1 - ageMs / (7 * 24 * 60 * 60 * 1000));
    return weight + recency;
}
function getTopN(notifications, n) {
    return [...notifications]
        .sort((a, b) => computePriority(b) - computePriority(a))
        .slice(0, n);
}

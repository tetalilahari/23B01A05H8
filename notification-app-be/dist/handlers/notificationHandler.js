"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNotifications = getAllNotifications;
exports.getPriorityNotifications = getPriorityNotifications;
const index_1 = require("../../../logging-middleware/src/index");
const notificationService_1 = require("../services/notificationService");
async function getAllNotifications(req, res) {
    await (0, index_1.Log)("backend", "info", "handler", "getAllNotifications handler invoked");
    try {
        const { limit, page, notification_type } = req.query;
        const notifications = await (0, notificationService_1.fetchNotifications)(limit ? Number(limit) : undefined, page ? Number(page) : undefined, notification_type);
        await (0, index_1.Log)("backend", "info", "handler", `Responding with ${notifications.length} notifications`);
        res.status(200).json({ notifications });
    }
    catch (err) {
        await (0, index_1.Log)("backend", "error", "handler", `getAllNotifications error: ${err.message}`);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
}
async function getPriorityNotifications(req, res) {
    await (0, index_1.Log)("backend", "info", "handler", "getPriorityNotifications handler invoked");
    try {
        const n = req.query.n ? Number(req.query.n) : 10;
        const { notification_type } = req.query;
        if (isNaN(n) || n < 1) {
            await (0, index_1.Log)("backend", "warn", "handler", `Invalid n value received: ${req.query.n}`);
            res.status(400).json({ error: "n must be a positive number" });
            return;
        }
        const all = await (0, notificationService_1.fetchNotifications)(undefined, undefined, notification_type);
        const top = (0, notificationService_1.getTopN)(all, n);
        await (0, index_1.Log)("backend", "info", "handler", `Responding with top ${top.length} priority notifications`);
        res.status(200).json({ notifications: top, total: top.length });
    }
    catch (err) {
        await (0, index_1.Log)("backend", "error", "handler", `getPriorityNotifications error: ${err.message}`);
        res.status(500).json({ error: "Failed to fetch priority notifications" });
    }
}

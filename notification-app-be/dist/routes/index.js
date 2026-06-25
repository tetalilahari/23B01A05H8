"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../../logging-middleware/src/index");
const notificationHandler_1 = require("../handlers/notificationHandler");
const router = (0, express_1.Router)();
(0, index_1.Log)("backend", "info", "route", "Registering notification routes");
// GET /api/notifications?limit=10&page=1&notification_type=Placement
router.get("/notifications", notificationHandler_1.getAllNotifications);
// GET /api/notifications/priority?n=10&notification_type=Placement
router.get("/notifications/priority", notificationHandler_1.getPriorityNotifications);
exports.default = router;

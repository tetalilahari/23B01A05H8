import { Router } from "express";
import { Log } from "../../../logging-middleware/src/index";
import { getAllNotifications, getPriorityNotifications } from "../handlers/notificationHandler";

const router = Router();

Log("backend", "info", "route", "Registering notification routes");

// GET /api/notifications?limit=10&page=1&notification_type=Placement
router.get("/notifications", getAllNotifications);

// GET /api/notifications/priority?n=10&notification_type=Placement
router.get("/notifications/priority", getPriorityNotifications);

export default router;
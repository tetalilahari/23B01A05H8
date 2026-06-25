import { Request, Response } from "express";
import { Log } from "../../../logging-middleware/src/index";
import { fetchNotifications, getTopN } from "../services/notificationService";

export async function getAllNotifications(req: Request, res: Response): Promise<void> {
  await Log("backend", "info", "handler", "getAllNotifications handler invoked");
  try {
    const { limit, page, notification_type } = req.query;
    const notifications = await fetchNotifications(
      limit ? Number(limit) : undefined,
      page ? Number(page) : undefined,
      notification_type as string | undefined
    );
    await Log("backend", "info", "handler",
      `Responding with ${notifications.length} notifications`
    );
    res.status(200).json({ notifications });
  } catch (err) {
    await Log("backend", "error", "handler",
      `getAllNotifications error: ${(err as Error).message}`
    );
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

export async function getPriorityNotifications(req: Request, res: Response): Promise<void> {
  await Log("backend", "info", "handler", "getPriorityNotifications handler invoked");
  try {
    const n = req.query.n ? Number(req.query.n) : 10;
    const { notification_type } = req.query;

    if (isNaN(n) || n < 1) {
      await Log("backend", "warn", "handler", `Invalid n value received: ${req.query.n}`);
      res.status(400).json({ error: "n must be a positive number" });
      return;
    }

    const all = await fetchNotifications(
      undefined, undefined,
      notification_type as string | undefined
    );
    const top = getTopN(all, n);

    await Log("backend", "info", "handler",
      `Responding with top ${top.length} priority notifications`
    );
    res.status(200).json({ notifications: top, total: top.length });
  } catch (err) {
    await Log("backend", "error", "handler",
      `getPriorityNotifications error: ${(err as Error).message}`
    );
    res.status(500).json({ error: "Failed to fetch priority notifications" });
  }
}
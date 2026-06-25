import { Log, setLoggerToken } from "../../../logging-middleware/src/index";
import { CONFIG } from "../config/env";

setLoggerToken(CONFIG.BEARER_TOKEN);

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

interface NotificationsResponse {
  notifications: Notification[];
}

export async function fetchNotifications(
  limit?: number,
  page?: number,
  notification_type?: string
): Promise<Notification[]> {
  await Log("backend", "info", "service", `Fetching notifications`);

  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (page) params.append("page", String(page));
  if (notification_type) params.append("notification_type", notification_type);

  const url = `${CONFIG.TEST_SERVER}/notifications?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${CONFIG.BEARER_TOKEN}` },
    });

    if (!res.ok) {
      await Log("backend", "error", "service", `Server returned ${res.status}`);
      throw new Error(`Server error: ${res.status}`);
    }

    // ✅ Fix: cast to known type
    const data = await res.json() as NotificationsResponse;
    await Log("backend", "info", "service", `Fetched ${data.notifications.length} items`);
    return data.notifications;
  } catch (err) {
    await Log("backend", "fatal", "service", `Fetch failed: ${(err as Error).message}`);
    throw err;
  }
}

export function computePriority(n: Notification): number {
  const weights: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };
  const weight = weights[n.Type] || 0;
  const ageMs = Date.now() - new Date(n.Timestamp).getTime();
  const recency = Math.max(0, 1 - ageMs / (7 * 24 * 60 * 60 * 1000));
  return weight + recency;
}

export function getTopN(notifications: Notification[], n: number): Notification[] {
  return [...notifications]
    .sort((a, b) => computePriority(b) - computePriority(a))
    .slice(0, n);
}
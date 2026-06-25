import { Log, setLoggerToken } from "../logger.js";

const BASE_URL = "http://localhost:4000/api";
const TOKEN = import.meta.env.VITE_BEARER_TOKEN || "";

// Set token for logger
setLoggerToken(TOKEN);

export async function fetchAllNotifications({ limit, page, notification_type } = {}) {
  await Log("frontend", "info", "api",
    `fetchAllNotifications - limit:${limit} page:${page} type:${notification_type}`
  );

  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (page) params.append("page", String(page));
  if (notification_type) params.append("notification_type", notification_type);

  try {
    const res = await fetch(`${BASE_URL}/notifications?${params}`);
    if (!res.ok) {
      await Log("frontend", "error", "api",
        `fetchAllNotifications failed with status ${res.status}`
      );
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    await Log("frontend", "info", "api",
      `fetchAllNotifications success - received ${data.notifications.length} items`
    );
    return data;
  } catch (err) {
    await Log("frontend", "fatal", "api",
      `fetchAllNotifications network error: ${err.message}`
    );
    throw err;
  }
}

export async function fetchPriorityNotifications({ n = 10, notification_type } = {}) {
  await Log("frontend", "info", "api",
    `fetchPriorityNotifications - n:${n} type:${notification_type}`
  );

  const params = new URLSearchParams();
  params.append("n", String(n));
  if (notification_type) params.append("notification_type", notification_type);

  try {
    const res = await fetch(`${BASE_URL}/notifications/priority?${params}`);
    if (!res.ok) {
      await Log("frontend", "error", "api",
        `fetchPriorityNotifications failed with status ${res.status}`
      );
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    await Log("frontend", "info", "api",
      `fetchPriorityNotifications success - received ${data.notifications.length} items`
    );
    return data;
  } catch (err) {
    await Log("frontend", "fatal", "api",
      `fetchPriorityNotifications network error: ${err.message}`
    );
    throw err;
  }
}
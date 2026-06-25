import { useState, useEffect, useCallback } from "react";
import { Log, setLoggerToken } from "../logger.js";
import { fetchAllNotifications, fetchPriorityNotifications } from "../api/notifications";

// Track viewed notification IDs in localStorage
const VIEWED_KEY = "viewed_notification_ids";

function getViewedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(VIEWED_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function markAsViewed(ids) {
  const existing = getViewedIds();
  ids.forEach((id) => existing.add(id));
  localStorage.setItem(VIEWED_KEY, JSON.stringify([...existing]));
}

export function useAllNotifications(filters = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedIds, setViewedIds] = useState(getViewedIds());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Log("frontend", "info", "hook", "useAllNotifications: loading started");
    try {
      const data = await fetchAllNotifications(filters);
      setNotifications(data.notifications);

      // Mark all fetched as viewed after a short delay (simulate "seen")
      setTimeout(() => {
        markAsViewed(data.notifications.map((n) => n.ID));
        setViewedIds(getViewedIds());
      }, 3000);

      await Log("frontend", "info", "hook",
        `useAllNotifications: loaded ${data.notifications.length} notifications`
      );
    } catch (err) {
      setError(err.message);
      await Log("frontend", "error", "hook",
        `useAllNotifications: failed - ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  return { notifications, loading, error, viewedIds, refetch: load };
}

export function usePriorityNotifications(filters = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedIds, setViewedIds] = useState(getViewedIds());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Log("frontend", "info", "hook", "usePriorityNotifications: loading started");
    try {
      const data = await fetchPriorityNotifications(filters);
      setNotifications(data.notifications);

      setTimeout(() => {
        markAsViewed(data.notifications.map((n) => n.ID));
        setViewedIds(getViewedIds());
      }, 3000);

      await Log("frontend", "info", "hook",
        `usePriorityNotifications: loaded ${data.notifications.length} notifications`
      );
    } catch (err) {
      setError(err.message);
      await Log("frontend", "error", "hook",
        `usePriorityNotifications: failed - ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  return { notifications, loading, error, viewedIds, refetch: load };
}
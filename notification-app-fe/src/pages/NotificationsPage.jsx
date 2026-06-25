import { useState, useEffect } from "react";
import {
  Container, Typography, Box, CircularProgress,
  Alert, Divider, Badge
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAllNotifications } from "../hooks/useNotifications";
import NotificationCard from "../components/NotificationCard";
import NotificationFilter from "../components/NotificationFilter";
import { Log, setLoggerToken } from "../logger.js";

export default function NotificationsPage() {
  const [filters, setFilters] = useState({});
  const { notifications, loading, error, viewedIds } = useAllNotifications(filters);

  useEffect(() => {
    Log("frontend", "info", "page", "NotificationsPage mounted");
  }, []);

  const newCount = notifications.filter((n) => !viewedIds.has(n.ID)).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Badge badgeContent={newCount} color="primary">
          <NotificationsIcon fontSize="large" color="action" />
        </Badge>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            All Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {notifications.length} total · {newCount} new
          </Typography>
        </Box>
      </Box>

      <NotificationFilter filters={filters} onChange={setFilters} />

      <Divider sx={{ mb: 2 }} />

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load notifications: {error}
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && notifications.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isNew={!viewedIds.has(n.ID)}
        />
      ))}
    </Container>
  );
}
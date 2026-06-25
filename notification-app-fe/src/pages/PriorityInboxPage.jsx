import { useState, useEffect } from "react";
import {
  Container, Typography, Box, CircularProgress,
  Alert, Divider, Slider, FormControl,
  InputLabel, Select, MenuItem, Stack
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { usePriorityNotifications } from "../hooks/useNotifications";
import NotificationCard from "../components/NotificationCard";
import { Log, setLoggerToken } from "../logger.js";

export default function PriorityInboxPage() {
  const [n, setN] = useState(10);
  const [type, setType] = useState("");
  const { notifications, loading, error, viewedIds } =
    usePriorityNotifications({ n, notification_type: type || undefined });

  useEffect(() => {
    Log("frontend", "info", "page", "PriorityInboxPage mounted");
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <StarIcon fontSize="large" sx={{ color: "#f59e0b" }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Priority Inbox
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Top {n} most important notifications
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 3, p: 2, bgcolor: "#fff8e1", borderRadius: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" gutterBottom>
              Show top <strong>{n}</strong> notifications
            </Typography>
            <Slider
              value={n}
              min={5}
              max={50}
              step={5}
              marks
              valueLabelDisplay="auto"
              onChange={async (_, val) => {
                await Log("frontend", "info", "component",
                  `Priority n changed to ${val}`
                );
                setN(val);
              }}
              sx={{ maxWidth: 300 }}
            />
          </Box>

          <FormControl size="small" sx={{ maxWidth: 200 }}>
            <InputLabel>Filter Type</InputLabel>
            <Select
              value={type}
              label="Filter Type"
              onChange={async (e) => {
                await Log("frontend", "info", "component",
                  `Priority type filter changed to ${e.target.value}`
                );
                setType(e.target.value);
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress sx={{ color: "#f59e0b" }} />
        </Box>
      )}

      {error && (
        <Alert severity="error">Failed to load: {error}</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No priority notifications found.</Alert>
      )}

      {!loading && notifications.map((n, index) => (
        <Box key={n.ID} display="flex" alignItems="flex-start" gap={1}>
          <Typography
            variant="body2"
            sx={{
              minWidth: 28, fontWeight: 700, color: "#f59e0b",
              mt: 2.5, textAlign: "right"
            }}
          >
            #{index + 1}
          </Typography>
          <Box flex={1}>
            <NotificationCard
              notification={n}
              isNew={!viewedIds.has(n.ID)}
            />
          </Box>
        </Box>
      ))}
    </Container>
  );
}
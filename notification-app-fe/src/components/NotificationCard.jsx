import {
  Card, CardContent, Typography, Chip, Box, Tooltip
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import { Log, setLoggerToken } from "../logger.js";

const typeConfig = {
  Placement: { color: "success", icon: <WorkIcon fontSize="small" /> },
  Result:    { color: "warning", icon: <EmojiEventsIcon fontSize="small" /> },
  Event:     { color: "info",    icon: <EventIcon fontSize="small" /> },
};

export default function NotificationCard({ notification, isNew }) {
  const { ID, Type, Message, Timestamp } = notification;
  const config = typeConfig[Type] || { color: "default", icon: null };

  const handleClick = async () => {
    await Log("frontend", "info", "component",
      `NotificationCard clicked - ID:${ID} Type:${Type}`
    );
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 1.5,
        border: isNew ? "2px solid #1976d2" : "1px solid #e0e0e0",
        borderRadius: 2,
        boxShadow: isNew ? 3 : 1,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 4, cursor: "pointer" },
        backgroundColor: isNew ? "#f0f7ff" : "#fff",
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {isNew && (
              <Tooltip title="New">
                <CircleIcon sx={{ fontSize: 10, color: "#1976d2" }} />
              </Tooltip>
            )}
            <Chip
              icon={config.icon}
              label={Type}
              color={config.color}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {new Date(Timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 1, fontWeight: isNew ? 600 : 400 }}>
          {Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
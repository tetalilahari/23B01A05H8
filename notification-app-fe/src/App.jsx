import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, Box, Container
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import NotificationsPage from "./pages/NotificationsPage";
import PriorityInboxPage from "./pages/PriorityInboxPage";
// CORRECT
import { Log, setLoggerToken } from "./logger.js";

// Set token for frontend logger
const TOKEN = import.meta.env.VITE_BEARER_TOKEN || "";
setLoggerToken(TOKEN);
Log("frontend", "info", "config", "Frontend app initialised with logger token");

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="sticky" elevation={2} sx={{ bgcolor: "#1a237e" }}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button
            color="inherit"
            component={NavLink}
            to="/"
            startIcon={<NotificationsIcon />}
            sx={{ mr: 1 }}
          >
            All
          </Button>
          <Button
            color="inherit"
            component={NavLink}
            to="/priority"
            startIcon={<StarIcon />}
          >
            Priority
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Routes>
          <Route path="/" element={<NotificationsPage />} />
          <Route path="/priority" element={<PriorityInboxPage />} />
        </Routes>
      </Box>

      <Box
        component="footer"
        sx={{ textAlign: "center", py: 2, bgcolor: "#1a237e", color: "white", mt: 4 }}
      >
        <Typography variant="caption">
          Campus Notification Platform © 2024
        </Typography>
      </Box>
    </BrowserRouter>
  );
}
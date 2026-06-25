import {
  Box, FormControl, InputLabel, Select, MenuItem,
  TextField, Button, Stack
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Log, setLoggerToken } from "../logger.js";

export default function NotificationFilter({ filters, onChange }) {
  const handleChange = async (field, value) => {
    await Log("frontend", "info", "component",
      `Filter changed - field:${field} value:${value}`
    );
    onChange({ ...filters, [field]: value });
  };

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <FilterListIcon color="action" />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.notification_type || ""}
            label="Type"
            onChange={(e) => handleChange("notification_type", e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Limit"
          type="number"
          value={filters.limit || ""}
          onChange={(e) => handleChange("limit", e.target.value)}
          sx={{ width: 100 }}
          inputProps={{ min: 1, max: 100 }}
        />

        <TextField
          size="small"
          label="Page"
          type="number"
          value={filters.page || ""}
          onChange={(e) => handleChange("page", e.target.value)}
          sx={{ width: 100 }}
          inputProps={{ min: 1 }}
        />

        <Button
          variant="outlined"
          size="small"
          onClick={async () => {
            await Log("frontend", "info", "component", "Filters cleared by user");
            onChange({});
          }}
        >
          Clear
        </Button>
      </Stack>
    </Box>
  );
}
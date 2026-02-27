import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
  InputAdornment,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";

export default function Filters({
  filters,
  setFilters,
  filterOptions,
  isLoading,
}) {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  useEffect(() => {
    if (!filters.search && searchInput) setSearchInput("");
  }, [filters.search]);

  const handleChange = (key) => (e) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleReset = () => {
    setSearchInput("");
    setFilters({
      startDate: "",
      endDate: "",
      category: "",
      region: "",
      granularity: "monthly",
      minRating: "",
      search: "",
    });
  };

  const activeFiltersCount = [
    filters.startDate,
    filters.endDate,
    filters.category,
    filters.region,
    filters.minRating,
    filters.search,
  ].filter(Boolean).length;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      bgcolor: "rgba(255,255,255,0.04)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
      "&:hover fieldset": { borderColor: "rgba(102,126,234,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#667eea" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
    "& input": { color: "#fff" },
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.3s",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            background:
              "linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FilterAltIcon sx={{ color: "#667eea", fontSize: 18 }} />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="#fff">
          Filters
        </Typography>
        {activeFiltersCount > 0 && (
          <Chip
            label={`${activeFiltersCount} active`}
            size="small"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 600,
              bgcolor: "rgba(102,126,234,0.15)",
              color: "#667eea",
              border: "1px solid rgba(102,126,234,0.3)",
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <TextField
          label="Search Product"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          size="small"
          placeholder="Product name..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: "rgba(255,255,255,0.85)", fontSize: 18 }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: { xs: "100%", sm: 200 }, flex: 1.2, ...inputSx }}
        />
        <TextField
          type="date"
          label="Start Date"
          value={filters.startDate}
          onChange={handleChange("startDate")}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 150 }, flex: 1, ...inputSx }}
        />
        <TextField
          type="date"
          label="End Date"
          value={filters.endDate}
          onChange={handleChange("endDate")}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 150 }, flex: 1, ...inputSx }}
        />
        <FormControl
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 140 }, flex: 1, ...inputSx }}
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={handleChange("category")}
            label="Category"
            sx={{ color: "#fff" }}
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions?.categories?.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 140 }, flex: 1, ...inputSx }}
        >
          <InputLabel>Region</InputLabel>
          <Select
            value={filters.region}
            onChange={handleChange("region")}
            label="Region"
            sx={{ color: "#fff" }}
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions?.regions?.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 130 }, flex: 1, ...inputSx }}
        >
          <InputLabel>Min Rating</InputLabel>
          <Select
            value={filters.minRating}
            onChange={handleChange("minRating")}
            label="Min Rating"
            sx={{ color: "#fff" }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">1+ Stars</MenuItem>
            <MenuItem value="2">2+ Stars</MenuItem>
            <MenuItem value="3">3+ Stars</MenuItem>
            <MenuItem value="4">4+ Stars</MenuItem>
            <MenuItem value="4.5">4.5+ Stars</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 140 }, flex: 1, ...inputSx }}
        >
          <InputLabel>Granularity</InputLabel>
          <Select
            value={filters.granularity}
            onChange={handleChange("granularity")}
            label="Granularity"
            sx={{ color: "#fff" }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 500,
            borderColor: "rgba(255,255,255,0.25)",
            color: "rgba(255,255,255,0.9)",
            "&:hover": {
              borderColor: "rgba(255,255,255,0.3)",
              bgcolor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Reset
        </Button>
      </Box>
    </Paper>
  );
}

import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  Skeleton,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useGetTableDataQuery } from "../store/analyticsApi";

const columns = [
  { id: "product_name", label: "Product", minWidth: 200, sortable: true },
  { id: "category", label: "Category", minWidth: 140, sortable: true },
  {
    id: "discounted_price",
    label: "Price",
    minWidth: 100,
    sortable: true,
    align: "right",
    format: (v) => "\u20B9" + Number(v).toLocaleString("en-IN"),
  },
  {
    id: "actual_price",
    label: "MRP",
    minWidth: 100,
    sortable: true,
    align: "right",
    format: (v) => "\u20B9" + Number(v).toLocaleString("en-IN"),
  },
  {
    id: "discount_percentage",
    label: "Discount",
    minWidth: 90,
    sortable: true,
    align: "right",
    format: (v) => (Number(v) * 100).toFixed(1) + "%",
  },
  {
    id: "rating",
    label: "Rating",
    minWidth: 80,
    sortable: true,
    align: "center",
    format: (v) => Number(v).toFixed(1),
  },
  {
    id: "rating_count",
    label: "Reviews",
    minWidth: 90,
    sortable: true,
    align: "right",
    format: (v) => Number(v).toLocaleString(),
  },
  {
    id: "quantity",
    label: "Qty",
    minWidth: 60,
    sortable: true,
    align: "right",
  },
  { id: "region", label: "Region", minWidth: 80, sortable: true },
  {
    id: "sale_date",
    label: "Date",
    minWidth: 100,
    sortable: true,
    format: (v) =>
      new Date(v).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

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

export default function DataTable({ filters }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState("sale_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = {
    page: page + 1,
    limit: rowsPerPage,
    sortBy,
    sortOrder,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters?.category && { category: filters.category }),
    ...(filters?.region && { region: filters.region }),
    ...(filters?.minRating && { minRating: filters.minRating }),
    ...(filters?.startDate && { startDate: filters.startDate }),
    ...(filters?.endDate && { endDate: filters.endDate }),
  };

  const { data, isLoading } = useGetTableDataQuery(queryParams);

  const handleSort = (columnId) => {
    if (sortBy === columnId) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(columnId);
      setSortOrder("asc");
    }
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const ratingColor = (val) => {
    const n = Number(val);
    if (n >= 4) return "#43e97b";
    if (n >= 3) return "#fee140";
    return "#f5576c";
  };

  return (
    <Paper
      sx={{
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header & Search */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="h6" fontWeight={600} color="#fff">
            Sales Records
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.65)">
            {data
              ? `${data.total.toLocaleString()} total records`
              : "Loading..."}
          </Typography>
        </Box>
        <TextField
          label="Search products"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          size="small"
          placeholder="Type to search..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: "rgba(255,255,255,0.55)", fontSize: 18 }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: "100%", sm: 280 }, ...inputSx }}
        />
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 620 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  sx={{
                    bgcolor: "rgba(12, 12, 24, 0.95)",
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    minWidth: col.minWidth,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : "asc"}
                      onClick={() => handleSort(col.id)}
                      sx={{
                        color: "rgba(255,255,255,0.85) !important",
                        "&.Mui-active": { color: "#667eea !important" },
                        "& .MuiTableSortLabel-icon": {
                          color: "#667eea !important",
                        },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.id}>
                        <Skeleton
                          variant="text"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.06)",
                            width: "80%",
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.data?.length === 0
                ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        sx={{
                          textAlign: "center",
                          py: 8,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        <Typography variant="body1" sx={{ mb: 0.5 }}>
                          No records found
                        </Typography>
                        <Typography variant="caption">
                          Try adjusting your search or filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                : data?.data?.map((row, rowIdx) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        bgcolor:
                          rowIdx % 2 === 0
                            ? "transparent"
                            : "rgba(255,255,255,0.015)",
                        "&:hover": {
                          bgcolor: "rgba(102,126,234,0.06) !important",
                        },
                        transition: "background-color 0.15s",
                      }}
                    >
                      {columns.map((col) => {
                        const value = row[col.id];
                        let display = col.format ? col.format(value) : value;

                        if (col.id === "product_name") {
                          display =
                            value && value.length > 50
                              ? value.slice(0, 50) + "\u2026"
                              : value;
                        }

                        if (col.id === "rating") {
                          return (
                            <TableCell
                              key={col.id}
                              align={col.align || "left"}
                              sx={{
                                color: "#fff",
                                borderBottom:
                                  "1px solid rgba(255,255,255,0.04)",
                                fontSize: 13,
                              }}
                            >
                              <Chip
                                label={`${Number(value).toFixed(1)} \u2605`}
                                size="small"
                                sx={{
                                  height: 24,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  bgcolor: `${ratingColor(value)}18`,
                                  color: ratingColor(value),
                                  border: `1px solid ${ratingColor(value)}30`,
                                }}
                              />
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell
                            key={col.id}
                            align={col.align || "left"}
                            sx={{
                              color: "rgba(255,255,255,0.85)",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              fontSize: 13,
                              maxWidth: col.id === "product_name" ? 280 : "auto",
                            }}
                            title={
                              col.id === "product_name" ? value : undefined
                            }
                          >
                            {display}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={data?.total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.7)",
          "& .MuiTablePagination-selectIcon": {
            color: "rgba(255,255,255,0.55)",
          },
          "& .MuiTablePagination-actions button": {
            color: "rgba(255,255,255,0.7)",
            "&:hover": { color: "#667eea" },
            "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
          },
        }}
      />
    </Paper>
  );
}

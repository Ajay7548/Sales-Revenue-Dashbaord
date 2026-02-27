import { Paper, Typography, Box, Skeleton } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#f5576c",
  "#4facfe",
  "#00f2fe",
  "#43e97b",
  "#38f9d7",
  "#fa709a",
  "#fee140",
];

const truncate = (str, len = 20) =>
  str && str.length > len ? str.slice(0, len) + "\u2026" : str;

export default function TopReviewedChart({ data, isLoading }) {
  const chartData =
    data?.map((d) => ({
      name: truncate(d.product_name),
      fullName: d.product_name,
      reviews: Number(d.rating_count),
      rating: Number(d.rating),
    })) || [];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 1,
        "&:hover": { zIndex: 10 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" fontWeight={600} color="#fff" gutterBottom>
        Top Reviewed Products
      </Typography>
      <Typography
        variant="caption"
        color="rgba(255,255,255,0.65)"
        sx={{ mb: 2 }}
      >
        Products with the highest number of customer reviews
      </Typography>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          height={400}
          sx={{
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.06)",
            flexGrow: 1,
          }}
        />
      ) : chartData.length === 0 ? (
        <Box
          sx={{
            flexGrow: 1,
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">No data available.</Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, minHeight: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 10, right: 30, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 11 }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                stroke="rgba(255,255,255,0.5)"
                tick={{
                  fill: "rgba(255,255,255,0.75)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
              <Tooltip
                wrapperStyle={{ zIndex: 1000 }}
                contentStyle={{
                  backgroundColor: "#1e1e2f",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
                formatter={(val) => [
                  Number(val).toLocaleString(),
                  "Reviews",
                ]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName || ""
                }
              />
              <Bar dataKey="reviews" radius={[0, 6, 6, 0]} barSize={22}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

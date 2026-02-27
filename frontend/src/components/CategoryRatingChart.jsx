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
  ReferenceLine,
} from "recharts";

const COLORS = [
  "#43e97b",
  "#4facfe",
  "#667eea",
  "#f093fb",
  "#f5576c",
  "#fa709a",
  "#fee140",
  "#38f9d7",
  "#764ba2",
  "#00f2fe",
];

export default function CategoryRatingChart({ data, isLoading }) {
  const chartData =
    data
      ?.map((d) => ({
        name: d.category,
        rating: Number(Number(d.avg_rating).toFixed(2)),
      }))
      .sort((a, b) => b.rating - a.rating) || [];

  const avgOverall =
    chartData.length > 0
      ? chartData.reduce((sum, d) => sum + d.rating, 0) / chartData.length
      : 0;

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
        Average Rating by Category
      </Typography>
      <Typography
        variant="caption"
        color="rgba(255,255,255,0.65)"
        sx={{ mb: 2 }}
      >
        Mean customer rating across product categories
      </Typography>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          height={350}
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
            minHeight: 350,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">No data available.</Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, minHeight: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ bottom: 70, right: 10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.5)"
                tick={{
                  fill: "rgba(255,255,255,0.75)",
                  fontSize: 11,
                }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                domain={[0, 5]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }}
                tickCount={6}
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
                formatter={(val) => [val.toFixed(2) + " / 5.0", "Avg Rating"]}
              />
              <ReferenceLine
                y={avgOverall}
                stroke="rgba(255,255,255,0.4)"
                strokeDasharray="5 5"
                label={{
                  value: `Avg: ${avgOverall.toFixed(2)}`,
                  fill: "rgba(255,255,255,0.7)",
                  fontSize: 11,
                  position: "right",
                }}
              />
              <Bar dataKey="rating" radius={[6, 6, 0, 0]} barSize={32}>
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

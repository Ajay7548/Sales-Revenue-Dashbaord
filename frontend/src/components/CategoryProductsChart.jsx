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

export default function CategoryProductsChart({ data, isLoading }) {
  const chartData =
    data
      ?.map((d) => ({
        name: d.category,
        count: Number(d.product_count),
      }))
      .sort((a, b) => b.count - a.count) || [];

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
        Products per Category
      </Typography>
      <Typography
        variant="caption"
        color="rgba(255,255,255,0.65)"
        sx={{ mb: 2 }}
      >
        Number of products listed in each category
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
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }}
                allowDecimals={false}
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
                  "Products",
                ]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={32}>
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

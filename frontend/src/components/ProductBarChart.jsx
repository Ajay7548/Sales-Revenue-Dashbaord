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
  "#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe",
  "#00f2fe", "#43e97b", "#38f9d7", "#fa709a", "#fee140",
];

const formatRevenue = (val) => {
  if (val >= 100000) return "₹" + (val / 100000).toFixed(1) + "L";
  if (val >= 1000) return "₹" + (val / 1000).toFixed(1) + "K";
  return "₹" + val;
};

const truncate = (str, len = 18) =>
  str && str.length > len ? str.slice(0, len) + "…" : str;

export default function ProductBarChart({ data, isLoading }) {
  const chartData = data?.map((d) => ({
    name: truncate(d.product_name),
    fullName: d.product_name,
    revenue: Number(d.total_revenue),
    quantity: d.total_quantity,
  })) || [];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        height: "100%", // Fill container height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" fontWeight={600} color="#fff" gutterBottom>
        📊 Top Products by Revenue
      </Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.06)", flexGrow: 1 }} />
      ) : chartData.length === 0 ? (
        <Box sx={{ flexGrow: 1, minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography color="text.secondary">No data available.</Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, minHeight: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={formatRevenue}
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={180} // Increased width for product names
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e2f",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  color: "#fff",
                }}
                formatter={(val) => ["₹" + Number(val).toLocaleString("en-IN"), "Revenue"]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ""}
              />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={24}>
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

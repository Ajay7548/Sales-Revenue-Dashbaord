import { Paper, Typography, Box, Skeleton } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
};

const formatRevenue = (val) => {
  if (val >= 100000) return "₹" + (val / 100000).toFixed(1) + "L";
  if (val >= 1000) return "₹" + (val / 1000).toFixed(1) + "K";
  return "₹" + val;
};

export default function RevenueLineChart({ data, isLoading }) {
  const chartData = data?.map((d) => ({
    date: formatDate(d.date),
    revenue: Number(d.revenue),
    sales: d.sales_count,
  })) || [];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Typography variant="h6" fontWeight={600} color="#fff" gutterBottom>
        📈 Revenue Trends
      </Typography>
      {isLoading ? (
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.06)" }} />
      ) : chartData.length === 0 ? (
        <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography color="text.secondary">No data available. Upload a file to get started.</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatRevenue}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }}
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
              formatter={(val) => ["₹" + Number(val).toLocaleString("en-IN"), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#667eea"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
              dot={{ r: 3, fill: "#667eea" }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

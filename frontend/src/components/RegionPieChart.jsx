import { Paper, Typography, Box, Skeleton } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#667eea", "#f093fb", "#4facfe", "#43e97b", "#fa709a"];

export default function RegionPieChart({ data, isLoading }) {
  const chartData = data?.map((d) => ({
    name: d.region,
    value: Number(d.total_revenue),
  })) || [];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const renderLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

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
        🗺️ Revenue by Region
      </Typography>
      {isLoading ? (
        <Skeleton variant="circular" width={240} height={240} sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.06)" }} />
      ) : chartData.length === 0 ? (
        <Box sx={{ flexGrow: 1, minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography color="text.secondary">No data available.</Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, minHeight: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={4}
                dataKey="value"
                label={renderLabel}
                labelLine={{ stroke: "rgba(255,255,255,0.55)" }}
              >
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
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
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

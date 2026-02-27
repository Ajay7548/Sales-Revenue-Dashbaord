import { Paper, Typography, Box, Skeleton } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DiscountHistogram({ data, isLoading }) {
  const chartData = data || [];

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
        Discount Distribution
      </Typography>
      <Typography
        variant="caption"
        color="rgba(255,255,255,0.65)"
        sx={{ mb: 2 }}
      >
        How discounts are distributed across all products
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
            <BarChart data={chartData} margin={{ bottom: 10, right: 10 }}>
              <defs>
                <linearGradient
                  id="histogramGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#667eea" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#764ba2" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="bucket"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 11 }}
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
              <Bar
                dataKey="count"
                fill="url(#histogramGrad)"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

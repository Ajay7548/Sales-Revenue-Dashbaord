import { Box, Card, CardContent, Typography, Skeleton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const cards = [
  {
    key: "total_revenue",
    label: "Total Revenue",
    icon: TrendingUpIcon,
    format: (v) => "₹" + Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 }),
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    shadow: "rgba(102,126,234,0.35)",
  },
  {
    key: "total_quantity",
    label: "Units Sold",
    icon: ShoppingCartIcon,
    format: (v) => Number(v).toLocaleString(),
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    shadow: "rgba(240,147,251,0.3)",
  },
  {
    key: "avg_rating",
    label: "Avg Rating",
    icon: StarIcon,
    format: (v) => Number(v).toFixed(1) + " ★",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    shadow: "rgba(79,172,254,0.3)",
  },
  {
    key: "avg_discount",
    label: "Avg Discount",
    icon: LocalOfferIcon,
    format: (v) => (Number(v) * 100).toFixed(1) + "%",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    shadow: "rgba(67,233,123,0.3)",
  },
];

export default function SummaryCards({ data, isLoading }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr 1fr",
        },
        gap: 3,
      }}
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.key}
            sx={{
              background: card.gradient,
              color: "#fff",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
              "@keyframes fadeInUp": {
                "0%": { opacity: 0, transform: "translateY(20px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
              "&:hover": {
                transform: "translateY(-6px) scale(1.02)",
                boxShadow: `0 20px 40px ${card.shadow}`,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: "-50%",
                right: "-50%",
                width: "100%",
                height: "100%",
                background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              },
            }}
          >
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 }, position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5, fontWeight: 500, letterSpacing: 0.5 }}>
                    {card.label}
                  </Typography>
                  {isLoading ? (
                    <Skeleton variant="text" width={100} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                  ) : (
                    <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
                      {data ? card.format(data[card.key]) : "—"}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Icon sx={{ fontSize: 26 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

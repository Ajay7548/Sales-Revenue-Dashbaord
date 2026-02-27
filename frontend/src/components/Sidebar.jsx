import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TableChartIcon from "@mui/icons-material/TableChart";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, id: "dashboard" },
  { label: "Upload Data", icon: <UploadFileIcon />, id: "upload" },
  { label: "Product Sales", icon: <BarChartIcon />, id: "products" },
  { label: "Analytics", icon: <AnalyticsIcon />, id: "analytics" },
  { label: "Data Explorer", icon: <TableChartIcon />, id: "explorer" },
];

export default function Sidebar({ activeSection, onNavigate, isMobile }) {
  const currentWidth = isMobile ? 80 : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: currentWidth,
          boxSizing: "border-box",
          bgcolor: "rgba(12, 12, 24, 0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          color: "#fff",
          overflowX: "hidden",
          transition: "width 0.3s ease",
        },
      }}
    >
      {/* Logo & Brand */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "flex-start",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 18,
            boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
            position: "relative",
            flexShrink: 0,
            "&::after": {
              content: '""',
              position: "absolute",
              inset: -2,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              opacity: 0.3,
              filter: "blur(8px)",
              zIndex: -1,
            },
          }}
        >
          <InsightsIcon sx={{ fontSize: 22 }} />
        </Box>
        {!isMobile && (
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              lineHeight={1.2}
              sx={{
                background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.8))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Sales Analytics
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: 0.5 }}
            >
              Revenue Dashboard
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2 }} />

      {/* Nav Label */}
      {!isMobile && (
        <Typography
          variant="overline"
          sx={{
            px: 3,
            pt: 2.5,
            pb: 1,
            display: "block",
            color: "rgba(255,255,255,0.5)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 1.5,
          }}
        >
          MENU
        </Typography>
      )}

      {/* Navigation */}
      <List sx={{ px: 1.5, mt: isMobile ? 2 : 0 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={activeSection === item.id}
            onClick={() => onNavigate(item.id)}
            sx={{
              borderRadius: 2.5,
              mb: 0.5,
              py: 1.2,
              px: isMobile ? 1 : 2,
              justifyContent: isMobile ? "center" : "flex-start",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              "&.Mui-selected": {
                bgcolor: "rgba(102,126,234,0.12)",
                color: "#667eea",
                "& .MuiListItemIcon-root": { color: "#667eea" },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  bottom: "20%",
                  width: 3,
                  borderRadius: 2,
                  background: "linear-gradient(180deg, #667eea, #764ba2)",
                  display: isMobile ? "none" : "block",
                },
                "&:hover": {
                  bgcolor: "rgba(102,126,234,0.18)",
                },
              },
              "&:not(.Mui-selected):hover": {
                bgcolor: "rgba(255,255,255,0.04)",
                "& .MuiListItemIcon-root": { color: "rgba(255,255,255,0.9)" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "rgba(255,255,255,0.8)",
                minWidth: isMobile ? 0 : 38,
                transition: "color 0.2s",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isMobile && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: activeSection === item.id ? 600 : 450,
                  letterSpacing: 0.2,
                }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      {/* Bottom decorative element */}
      <Box sx={{ flexGrow: 1 }} />
      {!isMobile && (
        <Box
          sx={{
            m: 2,
            p: 2.5,
            borderRadius: 3,
            background: "linear-gradient(145deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))",
            border: "1px solid rgba(102,126,234,0.12)",
          }}
        >
          <Typography variant="caption" fontWeight={600} color="rgba(255,255,255,0.7)" display="block" gutterBottom>
            💡 Quick Tip
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.55)" sx={{ lineHeight: 1.5 }}>
            Upload your Excel/CSV file to see interactive analytics and charts.
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}

export { DRAWER_WIDTH };

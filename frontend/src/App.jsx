import { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Sidebar, { DRAWER_WIDTH } from "./components/Sidebar";
import SummaryCards from "./components/SummaryCards";
import Filters from "./components/Filters";
import RevenueLineChart from "./components/RevenueLineChart";
import ProductBarChart from "./components/ProductBarChart";
import RegionPieChart from "./components/RegionPieChart";
import FileUpload from "./components/FileUpload";
import CategoryProductsChart from "./components/CategoryProductsChart";
import TopReviewedChart from "./components/TopReviewedChart";
import DiscountHistogram from "./components/DiscountHistogram";
import CategoryRatingChart from "./components/CategoryRatingChart";
import DataTable from "./components/DataTable";
import {
  useGetSummaryQuery,
  useGetTrendsQuery,
  useGetProductsQuery,
  useGetRegionsQuery,
  useGetCategoriesQuery,
  useGetFiltersQuery,
  useGetTopReviewedQuery,
  useGetDiscountDistributionQuery,
} from "./store/analyticsApi";

const SECTION_META = {
  dashboard: {
    title: "Sales Analytics",
    subtitle: "Track revenue, sales trends, and product performance",
  },
  upload: {
    title: "Upload Data",
    subtitle: "Upload your Excel/CSV files to analyze sales data",
  },
  products: {
    title: "Product Sales",
    subtitle: "Analyze top selling products and regional distribution",
  },
  analytics: {
    title: "Analytics",
    subtitle:
      "Deep-dive into category, discount, and review insights",
  },
  explorer: {
    title: "Data Explorer",
    subtitle: "Browse, search, and sort all sales records",
  },
};

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [activeSection, setActiveSection] = useState("dashboard");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    region: "",
    granularity: "monthly",
    minRating: "",
    search: "",
  });

  const queryParams = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== ""),
  );

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useGetSummaryQuery(queryParams);
  const { data: trends, isLoading: trendsLoading } =
    useGetTrendsQuery(queryParams);
  const { data: products, isLoading: productsLoading } =
    useGetProductsQuery(queryParams);
  const { data: regions, isLoading: regionsLoading } =
    useGetRegionsQuery(queryParams);
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery(queryParams);
  const { data: topReviewed, isLoading: topReviewedLoading } =
    useGetTopReviewedQuery(queryParams);
  const { data: discountDist, isLoading: discountDistLoading } =
    useGetDiscountDistributionQuery(queryParams);
  const { data: filterOptions } = useGetFiltersQuery();

  const meta = SECTION_META[activeSection] || SECTION_META.dashboard;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#0a0a14" }}>
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        isMobile={isMobile}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3, lg: 4 },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Fade in timeout={600} key={activeSection}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 1600,
              mx: "auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background:
                    "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                  textTransform: "capitalize",
                }}
              >
                {meta.title}
              </Typography>
              <Typography
                variant="body2"
                color="rgba(255,255,255,0.65)"
                fontWeight={400}
              >
                {meta.subtitle}
              </Typography>
            </Box>

            {/* Global Error Banner */}
            {summaryError && (
              <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                {summaryError.error?.includes("fetch")
                  ? "Cannot connect to backend. Make sure the server is running on port 5000."
                  : summaryError.data?.error || "Error loading data"}
              </Alert>
            )}

            {/* Upload Data View */}
            {activeSection === "upload" && (
              <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
                <FileUpload />
              </Box>
            )}

            {/* Dashboard View */}
            {activeSection === "dashboard" && (
              <>
                <Box sx={{ mb: 4 }}>
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    filterOptions={filterOptions}
                  />
                </Box>
                <Box sx={{ mb: 4 }}>
                  <SummaryCards data={summary} isLoading={summaryLoading} />
                </Box>
                <Box sx={{ mb: 4 }}>
                  <RevenueLineChart
                    data={trends}
                    isLoading={trendsLoading}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", xl: "1.5fr 1fr" },
                    gap: 3,
                    alignItems: "stretch",
                  }}
                >
                  <ProductBarChart
                    data={products}
                    isLoading={productsLoading}
                  />
                  <RegionPieChart
                    data={regions}
                    isLoading={regionsLoading}
                  />
                </Box>
              </>
            )}

            {/* Product Sales View */}
            {activeSection === "products" && (
              <>
                <Box sx={{ mb: 4 }}>
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    filterOptions={filterOptions}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "1.5fr 1fr" },
                    gap: 3,
                    alignItems: "stretch",
                  }}
                >
                  <ProductBarChart
                    data={products}
                    isLoading={productsLoading}
                  />
                  <RegionPieChart
                    data={regions}
                    isLoading={regionsLoading}
                  />
                </Box>
              </>
            )}

            {/* Analytics View */}
            {activeSection === "analytics" && (
              <>
                <Box sx={{ mb: 4 }}>
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    filterOptions={filterOptions}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                    gap: 3,
                    alignItems: "stretch",
                  }}
                >
                  <CategoryProductsChart
                    data={categories}
                    isLoading={categoriesLoading}
                  />
                  <TopReviewedChart
                    data={topReviewed}
                    isLoading={topReviewedLoading}
                  />
                  <DiscountHistogram
                    data={discountDist}
                    isLoading={discountDistLoading}
                  />
                  <CategoryRatingChart
                    data={categories}
                    isLoading={categoriesLoading}
                  />
                </Box>
              </>
            )}

            {/* Data Explorer View */}
            {activeSection === "explorer" && (
              <DataTable filters={filters} />
            )}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}

export default App;

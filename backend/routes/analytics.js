import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/** Build WHERE clause from query params */
function buildFilters(query) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (query.startDate) {
    conditions.push(`sale_date >= $${idx++}`);
    params.push(query.startDate);
  }
  if (query.endDate) {
    conditions.push(`sale_date <= $${idx++}`);
    params.push(query.endDate);
  }
  if (query.category) {
    conditions.push(`category = $${idx++}`);
    params.push(query.category);
  }
  if (query.region) {
    conditions.push(`region = $${idx++}`);
    params.push(query.region);
  }

  const where =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
  return { where, params };
}

// GET /api/analytics/summary
router.get("/summary", async (req, res) => {
  try {
    const { where, params } = buildFilters(req.query);
    const result = await pool.query(
      `SELECT 
         COUNT(*)::int AS total_sales,
         COALESCE(SUM(discounted_price * quantity), 0) AS total_revenue,
         COALESCE(AVG(discount_percentage), 0) AS avg_discount,
         COALESCE(AVG(rating), 0) AS avg_rating,
         COALESCE(SUM(quantity), 0)::int AS total_quantity
       FROM sales ${where}`,
      params,
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/trends?granularity=daily|weekly|monthly
router.get("/trends", async (req, res) => {
  try {
    const granularity = req.query.granularity || "monthly";
    const { where, params } = buildFilters(req.query);

    let dateExpr;
    switch (granularity) {
      case "daily":
        dateExpr = "sale_date";
        break;
      case "weekly":
        dateExpr = "DATE_TRUNC('week', sale_date)::date";
        break;
      case "monthly":
      default:
        dateExpr = "DATE_TRUNC('month', sale_date)::date";
        break;
    }

    const result = await pool.query(
      `SELECT 
         ${dateExpr} AS date,
         SUM(discounted_price * quantity) AS revenue,
         SUM(quantity)::int AS sales_count
       FROM sales ${where}
       GROUP BY ${dateExpr}
       ORDER BY ${dateExpr}`,
      params,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Trends error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/products?limit=10
router.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { where, params } = buildFilters(req.query);
    params.push(limit);

    const result = await pool.query(
      `SELECT 
         product_name,
         SUM(quantity)::int AS total_quantity,
         SUM(discounted_price * quantity) AS total_revenue,
         AVG(rating) AS avg_rating
       FROM sales ${where}
       GROUP BY product_name
       ORDER BY total_revenue DESC
       LIMIT $${params.length}`,
      params,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Products error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/regions
router.get("/regions", async (req, res) => {
  try {
    const { where, params } = buildFilters(req.query);
    const result = await pool.query(
      `SELECT 
         region,
         SUM(discounted_price * quantity) AS total_revenue,
         SUM(quantity)::int AS total_quantity
       FROM sales ${where}
       GROUP BY region
       ORDER BY total_revenue DESC`,
      params,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Regions error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/categories
router.get("/categories", async (req, res) => {
  try {
    const { where, params } = buildFilters(req.query);
    const result = await pool.query(
      `SELECT 
         category,
         SUM(discounted_price * quantity) AS total_revenue,
         SUM(quantity)::int AS total_quantity
       FROM sales ${where}
       GROUP BY category
       ORDER BY total_revenue DESC`,
      params,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Categories error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/filters — available filter options
router.get("/filters", async (req, res) => {
  try {
    const categories = await pool.query(
      "SELECT DISTINCT category FROM sales ORDER BY category",
    );
    const regions = await pool.query(
      "SELECT DISTINCT region FROM sales ORDER BY region",
    );
    const dateRange = await pool.query(
      "SELECT MIN(sale_date) AS min_date, MAX(sale_date) AS max_date FROM sales",
    );
    res.json({
      categories: categories.rows.map((r) => r.category),
      regions: regions.rows.map((r) => r.region),
      dateRange: dateRange.rows[0],
    });
  } catch (err) {
    console.error("Filters error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

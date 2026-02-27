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
  if (query.minRating) {
    conditions.push(`rating >= $${idx++}`);
    params.push(parseFloat(query.minRating));
  }
  if (query.search) {
    conditions.push(`product_name ILIKE $${idx++}`);
    params.push(`%${query.search}%`);
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
         SUM(quantity)::int AS total_quantity,
         COUNT(*)::int AS product_count,
         AVG(rating) AS avg_rating
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

// GET /api/analytics/top-reviewed?limit=10
router.get("/top-reviewed", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { where, params } = buildFilters(req.query);
    params.push(limit);

    const result = await pool.query(
      `SELECT
         product_name,
         rating_count,
         rating,
         category
       FROM sales ${where}
       ORDER BY rating_count DESC
       LIMIT $${params.length}`,
      params,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Top-reviewed error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/discount-distribution
router.get("/discount-distribution", async (req, res) => {
  try {
    const { where, params } = buildFilters(req.query);
    const result = await pool.query(
      `SELECT
         CASE
           WHEN discount_percentage <= 0.10 THEN '0-10%'
           WHEN discount_percentage <= 0.20 THEN '10-20%'
           WHEN discount_percentage <= 0.30 THEN '20-30%'
           WHEN discount_percentage <= 0.40 THEN '30-40%'
           WHEN discount_percentage <= 0.50 THEN '40-50%'
           WHEN discount_percentage <= 0.60 THEN '50-60%'
           WHEN discount_percentage <= 0.70 THEN '60-70%'
           WHEN discount_percentage <= 0.80 THEN '70-80%'
           WHEN discount_percentage <= 0.90 THEN '80-90%'
           ELSE '90-100%'
         END AS bucket,
         COUNT(*)::int AS count
       FROM sales ${where}
       GROUP BY bucket
       ORDER BY MIN(discount_percentage)`,
      params,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Discount distribution error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/table?page=1&limit=25&sortBy=sale_date&sortOrder=desc
router.get("/table", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
    const offset = (page - 1) * limit;

    const allowedSortColumns = [
      "product_name", "category", "discounted_price", "actual_price",
      "discount_percentage", "rating", "rating_count", "quantity",
      "region", "sale_date",
    ];
    const sortBy = allowedSortColumns.includes(req.query.sortBy)
      ? req.query.sortBy
      : "sale_date";
    const sortOrder = req.query.sortOrder === "asc" ? "ASC" : "DESC";

    const { where, params } = buildFilters(req.query);

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM sales ${where}`,
      params,
    );
    const total = countResult.rows[0].total;

    const dataParams = [...params, limit, offset];
    const result = await pool.query(
      `SELECT
         id, product_id, product_name, category,
         discounted_price, actual_price, discount_percentage,
         rating, rating_count, quantity, region, sale_date
       FROM sales ${where}
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams,
    );

    res.json({
      data: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (err) {
    console.error("Table error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

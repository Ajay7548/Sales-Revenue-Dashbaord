const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
const { pool } = require("../db");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".xlsx", ".xls", ".csv"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx, .xls, and .csv files are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const REGIONS = ["North", "South", "East", "West", "Central"];

function randomDate() {
  const now = new Date();
  const past = new Date(now);
  past.setMonth(past.getMonth() - 12);
  const diff = now.getTime() - past.getTime();
  return new Date(past.getTime() + Math.random() * diff)
    .toISOString()
    .split("T")[0];
}

function randomRegion() {
  return REGIONS[Math.floor(Math.random() * REGIONS.length)];
}

function parsePrice(val) {
  if (val == null) return 0;
  const str = String(val).replace(/[₹,\s]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function parseDiscount(val) {
  if (val == null) return 0;
  const str = String(val).replace(/%/g, "");
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return num > 1 ? num / 100 : num; // normalize to 0-1
}

// POST /api/upload
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      return res.status(400).json({ error: "File contains no data rows" });
    }

    // Process all rows into arrays for batch insert
    const BATCH_SIZE = 50;
    let inserted = 0;
    let errors = [];

    for (
      let batchStart = 0;
      batchStart < data.length;
      batchStart += BATCH_SIZE
    ) {
      const batch = data.slice(batchStart, batchStart + BATCH_SIZE);
      const values = [];
      const placeholders = [];

      for (let j = 0; j < batch.length; j++) {
        const row = batch[j];
        const i = batchStart + j;

        try {
          const discountedPrice = parsePrice(row.discounted_price);
          const actualPrice = parsePrice(row.actual_price);
          const discountPct = parseDiscount(row.discount_percentage);
          const rating = parseFloat(row.rating) || 0;
          const ratingCount = parseInt(row.rating_count) || 0;
          const quantity = Math.max(1, Math.floor(ratingCount / 100) || 1);
          const region = row.region || randomRegion();
          const saleDate = row.sale_date || randomDate();
          const category = row.category
            ? row.category.split("|")[0].trim()
            : "Uncategorized";

          const offset = values.length;
          values.push(
            row.product_id || `PROD-${i}`,
            row.product_name || "Unknown Product",
            category,
            discountedPrice,
            actualPrice,
            discountPct,
            rating,
            ratingCount,
            quantity,
            region,
            saleDate,
          );

          const idx = (n) => `$${offset + n}`;
          placeholders.push(
            `(${idx(1)},${idx(2)},${idx(3)},${idx(4)},${idx(5)},${idx(6)},${idx(7)},${idx(8)},${idx(9)},${idx(10)},${idx(11)})`,
          );
        } catch (rowErr) {
          errors.push({ row: i + 2, error: rowErr.message });
        }
      }

      if (placeholders.length > 0) {
        try {
          await pool.query(
            `INSERT INTO sales 
              (product_id, product_name, category, discounted_price, actual_price, 
               discount_percentage, rating, rating_count, quantity, region, sale_date)
             VALUES ${placeholders.join(",")}`,
            values,
          );
          inserted += placeholders.length;
        } catch (batchErr) {
          // If batch fails, log error for those rows
          for (let k = 0; k < batch.length; k++) {
            errors.push({ row: batchStart + k + 2, error: batchErr.message });
          }
        }
      }
    }

    res.json({
      message: `Import complete: ${inserted} rows inserted`,
      inserted,
      total: data.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process file: " + err.message });
  }
});

module.exports = router;

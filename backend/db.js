import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const initDB = async () => {
  const createTable = `
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      product_id VARCHAR(50),
      product_name TEXT,
      category TEXT,
      discounted_price NUMERIC(12,2),
      actual_price NUMERIC(12,2),
      discount_percentage NUMERIC(5,2),
      rating NUMERIC(3,1),
      rating_count INTEGER,
      quantity INTEGER DEFAULT 1,
      region VARCHAR(20),
      sale_date DATE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  try {
    await pool.query(createTable);
    console.log("✅ Database table 'sales' is ready");
    // Simple health check
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connection healthy:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Error initializing database:", err.message);
  }
};

export { pool };

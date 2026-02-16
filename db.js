import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "ca_yps",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: test connection once at startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL pool connected!");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err);
  }
})();

const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER,   // 👈 bắt buộc có
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("----------------------- SQL Server connected");
    return pool;
  } catch (err) {
    console.error("----------------------- Database connection failed:", err);
    throw err;
  }
};

module.exports = { sql, pool, connectDB };

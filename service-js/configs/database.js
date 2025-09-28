const sql = require("mssql/msnodesqlv8");

let config;

if (process.env.DB_USER && process.env.DB_PASSWORD) {
  // SQL Authentication
  config = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
} else {
  // Windows Authentication
  config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    driver: "msnodesqlv8",
    options: {
      trustedConnection: true,
      trustServerCertificate: true,
    },
  };
}

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
// ✅ Thêm hàm này để các model dùng thống nhất
let poolPromise = null;
async function getPool() {
  if (!poolPromise) poolPromise = connectDB();
  return poolPromise;
}

module.exports = { sql, pool, connectDB };
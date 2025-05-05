// config/db.js
import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";

// Create optimized connection pool with better error handling and higher limits
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "cua_hang_sach",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 25, // Increase connection limit for better concurrency
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds connection timeout
  acquireTimeout: 10000, // 10 seconds acquire connection timeout
  idleTimeout: 60000, // How long a connection can be idle before being closed
  // Enable connection debugging to help troubleshoot connections
  debug: process.env.NODE_ENV === 'development',
});

// Create a robust connection handler
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Kết nối MySQL thất bại:", err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Mất kết nối đến cơ sở dữ liệu');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Cơ sở dữ liệu có quá nhiều kết nối');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Yêu cầu kết nối cơ sở dữ liệu bị từ chối');
    }
  } else {
    console.log("Kết nối MySQL thành công!");
    connection.release();
  }
});

// Add event listeners to handle connection errors
pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('error', function (err) {
  console.error('Unexpected database error:', err);
  // Auto-reconnect logic can be implemented here
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect to database...');
    // Reconnection logic if needed
  }
});

export default pool.promise();

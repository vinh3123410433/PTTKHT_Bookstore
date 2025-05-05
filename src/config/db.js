// config/db.js\
import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   port: process.env.DB_PORT || 3307,
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: "cua_hang_sach",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "cua_hang_sach",
  port: 3306,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Kết nối MySQL thất bại:", err);
  } else {
    console.log("Kết nối MySQL thành công!");
    connection.release();
  }
});

export default pool.promise();

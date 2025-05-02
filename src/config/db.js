// config/db.js
import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  // port: 3307,
  user: "root",
  password: "mysql1009",
  database: "cua_hang_sach",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Kết nối MySQL thất bại:', err);
//     } else {
//         console.log('Kết nối MySQL thành công!');
//         connection.release();
//     }
// });

export default pool.promise();

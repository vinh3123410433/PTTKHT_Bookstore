const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "kkkk",
  database: "cua_hang_sach",
});
module.exports = pool;

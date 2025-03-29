const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'cua_hang_sach',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Kết nối MySQL thất bại:', err);
//     } else {
//         console.log('Kết nối MySQL thành công!');
//         connection.release();
//     }
// });

module.exports = pool.promise();
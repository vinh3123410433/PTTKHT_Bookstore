// const db = require('../../config/db');



// // Hàm lấy dữ liệu từ database
// const getBooks = async () => {
//     try {
//         const [rows] = await db.query('SELECT * FROM books'); // Truy vấn bảng "books"
//         return rows;
//     } catch (error) {
//         console.error('Error fetching books:', error);
//         throw error;
//     }
// };

// class HomeController {
//     index(req, res) {
//         res.render('home')
//     }

//     showDetail(req, res) {
//         // res.render('pdDetail')
//         console.log("hi")
//         res.send('<p>hi</p>')
//     }
// }

// module.exports = { getBooks };

// module.exports = new HomeController
const bookModel = require('../model/bookModel');
const categoryModel = require('../model/categoryModel');

async function index(req, res) {
    try {
        const categoryId = req.params.id || null; // Lấy ID danh mục nếu có
        const currentPage = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
        const perPage = 16; // Số sản phẩm mỗi trang

        // Lấy toàn bộ sách để tính tổng số trang
        const allBooks = await bookModel.getAllBooks(categoryId);
        const { totalPages, offset } = bookModel.paginate(allBooks.length, currentPage, perPage);

        // Lấy sách theo trang
        const books = await bookModel.getAllBooks(categoryId, offset, perPage);
        const categories=await categoryModel.getAllCategories();
        const category= await categoryModel.getCategoryById(categoryId)
        const categoryName= category ? category.TenDanhMuc: "Tất cả sách"
        // console.log(category)

        res.render('category', {
            books,
            totalPages,
            currentPage,
            categoryId,
            categories,
            categoryName
        });

    } catch (error) {
        console.error('Error in BookController:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { index };  

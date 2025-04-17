const bookModel = require('../model/bookModel');
const categoryModel = require('../model/categoryModel');
class ProductsController {
    // [GET] /pd
    async index(req, res) {
        try {
            const productid = req.query.id;

            // Lấy chi tiết sản phẩm
            const productDetail = await bookModel.getProductDetail(productid);
            if (!productDetail) {
                return res.status(404).send('Sản phẩm không tồn tại');
            }

            // Lấy danh mục và các sản phẩm khác có cùng danh mục
            const categories = await categoryModel.getAllCategories();
            const danhMucList = productDetail.DanhMucs.map(dm => Number(dm.id));

            // Tạo bộ lọc cho giá nếu có
            const filter = {};
            if (req.query.minPrice) {
                filter.minPrice = parseInt(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filter.maxPrice = parseInt(req.query.maxPrice);
            }

            // Lấy các sản phẩm khác theo danh mục và áp dụng bộ lọc giá (nếu có)
            const otherbook = await bookModel.getListProducts(danhMucList, filter);
            console.log('Các sản phẩm cùng danh mục:', otherbook);

            // Lấy danh sách hình ảnh của sản phẩm
            const images = await bookModel.getProductImages(productid);
            console.log('Chi tiết sản phẩm:', productDetail);

            // Truyền dữ liệu vào view
            res.render('pdDetail', {
                productDetail,
                danhMucList,
                categories,
                otherbook,
                images,  
                query: req.query
            });
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            res.status(500).send('Đã có lỗi xảy ra, vui lòng thử lại sau.');
        }
    }
}
module.exports = new ProductsController();
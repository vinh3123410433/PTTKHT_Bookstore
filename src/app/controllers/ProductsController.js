
const bookModel = require('../model/bookModel')
const categoryModel = require('../model/categoryModel')
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
            const danhMucList = productDetail.DanhMucs.map(dm => Number(dm.id))

            // Lấy các sản phẩm khác theo danh mụcg()
            const otherbook = await bookModel.getListProducts(danhMucList);
            console.log('Các sản phẩm cùng danh mục:', otherbook);
            // Lấy danh sách hình ảnh của sản phẩm
            const images = await bookModel.getProductImages(productid);
            // console.log('Hình ảnh của sản phẩm:', images);

            // Truyền dữ liệu vào view
            res.render('pdDetail', {
                productDetail,
                danhMucList,
                categories,
                otherbook,
                images,  
            });
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            res.status(500).send('Đã có lỗi xảy ra, vui lòng thử lại sau.');
        }
    }

}

module.exports = new ProductsController();

// Danh sách sách
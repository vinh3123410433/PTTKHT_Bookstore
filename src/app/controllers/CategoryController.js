
const bookModel = require('../model/bookModel')
const categoryModel = require('../model/categoryModel')
class CategoryController {
    // [GET] /pd
    async index(req, res) {
       try {
                  
                  const books = await bookModel.getAllBooks(); // Lấy dữ liệu từ Model
                  const categories = await categoryModel.getAllCategories()
                  const popularCategories = await categoryModel.getfiveCategoriespopular()
                  const popularproducts = await bookModel.getBooksinPopularCategory()
      
                  // console.log(popularproducts)
                  res.render('category', { books, categories, popularCategories, popularproducts }); // Truyền dữ liệu vào View
              } catch (error) {
                  console.error('Error in SiteController:', error);
                  res.status(500).send('Internal Server Error');
              }
    }
    showDetail(req, res) {
        res.send('<h1>Trang chi tiết sản phẩm</h1>')
    }
}

module.exports = new CategoryController();
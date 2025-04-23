import bookModel from "../model/bookModel.js";
import categoryModel from "../model/categoryModel.js";
// import category from "../model/warehouse/category.js";

class SiteController {
  // Hiển thị trang chủ
  async index(req, res) {
    try {
      const books = await bookModel.getAllBooks();
      const categories = await categoryModel.getAllCategories();
      // Đổi theo tên hàm thực tế trong bookModel
      const popularCategories = await categoryModel.getfiveCategoriespopular();
      const popularProducts = await bookModel.getBooksinPopularCategory();

      const isLoggedIn = !!req.session.user_id;

      res.render("home", {
        books,
        categories,
        popularCategories,
        popularProducts,
        query: req.query,
        session: req.session,
        isLoggedIn,
      });
    } catch (error) {
      console.error("Error in SiteController:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // Xử lý tìm kiếm
  async search(req, res) {
    try {
      const { q: keywordRaw, maxPrice, categories: categoryIDs } = req.query;
      const categories = await categoryModel.getAllCategories();
      const keyword = keywordRaw?.trim();
      let baseList = [];

      if (keyword) {
        const matched = await bookModel.searchBooksByKeyword(keyword);
        const ids = matched.map((b) => Number(b.SanPhamID));
        baseList = await bookModel.getBooksByIds(ids);
      } else if (categoryIDs) {
        const categoryArray = Array.isArray(categoryIDs)
          ? categoryIDs.map(Number)
          : [Number(categoryIDs)];
        baseList = await bookModel.getListProducts(categoryArray);
      } else {
        // Không có keyword và category, quay về trang chủ
        return res.redirect("/");
      }

      // Lọc theo giá nếu có
      let filteredList = baseList;
      if (maxPrice && baseList.length) {
        filteredList = baseList.filter((book) => book.Gia <= Number(maxPrice));
      }

      res.render("searchResults", {
        keyword: keyword || "",
        categories,
        listbook: filteredList,
        hasResults: filteredList.length > 0,
        currentPage: 1,
        totalPages: 1,
        query: req.query,
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default new SiteController();

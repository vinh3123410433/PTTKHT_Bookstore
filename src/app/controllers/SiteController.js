const bookModel = require("../model/bookModel");
const categoryModel = require("../model/categoryModel");

class SiteController {
  async index(req, res) {
    try {
      const books = await bookModel.getAllBooks();
      const categories = await categoryModel.getAllCategories();
      const popularCategories = await categoryModel.getfiveCategoriespopular();
      const popularproducts = await bookModel.getBooksinPopularCategory();
      console.log("popularproducts", popularproducts);
      console.log("Danh mục: ", categories);
      const isLoggedIn = req.session.user_id ? true : false;
      res.render("home", {
        books,
        categories,
        popularCategories,
        popularproducts,
        query: req.query,
        session: req.session,
        isLoggedIn,
      });
    } catch (error) {
      console.error("Error in SiteController:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async search(req, res) {
    try {
      const { q, maxPrice, categories: categoryIDs } = req.query;
      const categories = await categoryModel.getAllCategories();
      const keyword = q?.trim();
      let baseList = [];

      if (keyword) {
        const matched = await bookModel.searchBooksByKeyword(keyword);
        const ids = matched.map((b) => Number(b.SanPhamID));
        baseList = await bookModel.getBooksByIds(ids);
      }

      if (!keyword && categoryIDs) {
        const categoryArray = Array.isArray(categoryIDs)
          ? categoryIDs
          : [categoryIDs];
        baseList = await bookModel.getListProducts(categoryArray);
      }

      let filteredList = baseList;
      if (maxPrice && baseList.length > 0) {
        filteredList = baseList.filter((book) => book.Gia <= Number(maxPrice));
      }

      if (!keyword && !categoryIDs) {
        return res.redirect("/");
      }

      res.render("searchResults", {
        keyword: keyword || "",
        categories,
        listbook: filteredList,
        hasResults: filteredList.length > 0,
        currentPage: 1,
        totalPages: 1,
        query: req.query, // 🔥 truyền lại giá trị filter
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new SiteController();

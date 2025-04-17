const bookModel = require("../model/bookModel");
const categoryModel = require("../model/categoryModel");

async function index(req, res) {
  try {
    const categoryId = req.params.id || null;
    console.log("hiiii: " + categoryId);
    const currentPage = parseInt(req.query.page) || 1;
    const perPage = 16;

    // Lấy filter từ query
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : null;
    let filterCategoryIDs = [];

    if (req.query.categories) {
      if (Array.isArray(req.query.categories)) {
        filterCategoryIDs = req.query.categories.map(Number);
      } else {
        filterCategoryIDs = req.query.categories.split(",").map(Number);
      }
    }

    // Gộp categoryId từ params vào filter (nếu chưa có)
    if (categoryId && !filterCategoryIDs.includes(Number(categoryId))) {
      filterCategoryIDs.unshift(Number(categoryId));
    }

    const filters = {
      minPrice,
      maxPrice,
      categoryIDs: filterCategoryIDs,
    };

    const allBooks = await bookModel.getAllBooks(
      categoryId,
      null,
      null,
      filters
    );
    const { totalPages, offset } = bookModel.paginate(
      allBooks.length,
      currentPage,
      perPage
    );

    const books = await bookModel.getAllBooks(
      categoryId,
      offset,
      perPage,
      filters
    );
    const categories = await categoryModel.getAllCategories();
    const category = await categoryModel.getCategoryById(categoryId);
    const categoryName = category ? category.TenDanhMuc : "Tất cả sách";

    res.render("category", {
      books,
      totalPages,
      currentPage,
      categoryId,
      categories,
      categoryName,
      query: req.query,
    });
  } catch (error) {
    console.error("Error in BookController:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { index };

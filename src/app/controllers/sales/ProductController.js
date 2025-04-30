import Dashboard from "../../model/sales/Dashboard";

export class ProductController {
  async showTopProductsByDateRange(req, res) {
    try {
      const startDate = req.query.startDate || req.body.startDate;
      const endDate = req.query.endDate || req.body.endDate || null;

      if (!startDate) {
        return res.status(400).json({
          success: false,
          message: "Ngày bắt đầu không được cung cấp",
        });
      }

      const productModel = new Dashboard();
      const products = await productModel.getTopProductsByDateRange(
        startDate,
        endDate
      );

      res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách sản phẩm",
      });
    }
  }
}

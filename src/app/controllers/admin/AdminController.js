// app/controllers/admin/AdminController.js
import AdminModel from "../../model/admin/adminModel.js";

class AdminController {
  showLogin(req, res) {
    res.render("admin/login", { layout: "admin" });
  }

  async handleLogin(req, res) {
    const { id, password } = req.body;
    const user = await AdminModel.findByID(id);
    console.log("Tài khoản:", user);

    if (!user || user.MatKhau !== password) {
      console.log(user.MatKhau);
      console.log(password);
      return res.render("admin/login", {
        layout: "admin",
        error: "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.",
      });
    }
    // // Lưu session
    req.session.user = {
      id: user.ID_TK,
      TenNhomQuyen: user.TenNhomQuyen.toLowerCase(), // ví dụ: "Admin", "Sale" → chuyển về "admin", "sale"
    };
    console.log("Tên nhóm quyền: hiiii" + req.session.user.TenNhomQuyen);

    // Điều hướng theo nhóm quyền
    switch (req.session.user.TenNhomQuyen) {
      case "admin":
        return res.redirect("/admin/dashboard");
      case "quản lý bán hàng":
        return res.redirect("/admin/sale");
      case "người quản lý doanh nghiệp":
        return res.redirect("/admin");
      case "quản lý kho":
        return res.redirect("/admin/warehouse");
      default:
        return res.redirect("/admin/login");
    }
    console.log("hiiiii");
  }
}

export default new AdminController();

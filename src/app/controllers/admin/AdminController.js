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

    // Điều hướng theo nhóm quyền
    switch (req.session.user.TenNhomQuyen) {
      case "admin":
        return res.redirect("/admin/dashboard");
      case "sales_manager":
        return res.redirect("/admin/sale");
      case "manager":
        return res.redirect("/admin");
      case "warehouse_manager":
        return res.redirect("/admin/warehouse");
      default:
        return res.redirect("/admin/login");
    }
    console.log("hiiiii");
  }
}

export default new AdminController();

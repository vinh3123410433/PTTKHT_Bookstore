// app/controllers/admin/AdminController.js
import AdminModel from "../../model/admin/adminModel.js";
import phanquyen from "../../model/admin/phanquyenModel.js";

class AdminController {
  showLogin(req, res) {
    res.render("admin/login", { layout: false });
  }

  async handleLogin(req, res) {
    try {
      const { id, password } = req.body;
      const user = await AdminModel.findByID(id);

      if (!user || user.MatKhau !== password) {
        return res.render("admin/login", {
          layout: "admin",
          error: "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.",
        });
      }

      // Get all permissions in a single batch to improve performance
      const accessPermissions = await phanquyen.findPAccessIdNhomQuyen(
        user.ID_NhomQuyen,
        "access"
      );

      // Prepare user session data
      req.session.user = {
        id: user.ID_TK,
        idNQ: user.ID_NhomQuyen,
        TenNhomQuyen: user.TenNhomQuyen.toLowerCase(),
        accessList: accessPermissions.map((item) => item.ChucNang),
      };

      // Pre-cache permissions to avoid redundant database queries
      const viewPermissions = await phanquyen.findPAccessIdNhomQuyen(
        user.ID_NhomQuyen, 
        "view"
      );
      
      const allPermissions = await phanquyen.findPAccessIdNhomQuyen(
        user.ID_NhomQuyen, 
        "all"
      );

      req.session.cachedPermissions = [
        ...viewPermissions.map(p => p.ChucNang),
        ...allPermissions.map(p => p.ChucNang)
      ];

      // Save session with error handling
      req.session.save((err) => {
        if (err) {
          console.error("Lỗi lưu session:", err);
          return res.status(500).render("errors/500", {
            message: "Lỗi hệ thống khi đăng nhập.",
            layout: false
          });
        }

        const accessRedirectMap = {
          admin: "/admin/",
          qlkho: "/admin/warehouse",
          qlbanhang: "/admin/sales",
          qldoanhnghiep: "/admin/dashboard",
        };

        if (req.session.user.accessList.length === 1) {
          const onlyAccess = req.session.user.accessList[0];
          const redirectURL = accessRedirectMap[onlyAccess] || "/admin/dashboard";
          return res.redirect(redirectURL);
        } else if (req.session.user.accessList.length > 1) {
          return res.redirect("/admin/dashboard");
        } else {
          return res.render("errors/403", {
            layout: false,
            error: "Không tìm thấy quyền truy cập.",
          });
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).render("errors/500", {
        message: "Lỗi hệ thống khi đăng nhập.",
        layout: false
      });
    }
  }
}

export default new AdminController();

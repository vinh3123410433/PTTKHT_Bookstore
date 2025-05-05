import phanquyen from "../../model/admin/phanquyenModel.js";

class DashboardController {
  async show(req, res) {
    try {
      // Use cached permissions if available
      let permissions;
      
      if (req.session.cachedPermissions) {
        permissions = req.session.cachedPermissions;
      } else {
        // If not cached, query permissions and cache them for future use
        const viewPermissions = await phanquyen.findPAccessIdNhomQuyen(
          req.session.user.idNQ, 
          "view"
        );
        
        const allPermissions = await phanquyen.findPAccessIdNhomQuyen(
          req.session.user.idNQ, 
          "all"
        );

        permissions = [
          ...viewPermissions.map(p => p.ChucNang),
          ...allPermissions.map(p => p.ChucNang)
        ];
        
        // Cache the permissions in the session
        req.session.cachedPermissions = permissions;
      }

      res.render("admin/dashboard", {
        title: "Dashboard",
        layout: "admin",
        permissions,
      });
    } catch (error) {
      console.error("Dashboard render error:", error);
      res.status(500).render("errors/500", {
        message: "Lỗi khi hiển thị trang quản trị.",
        layout: false
      });
    }
  }
}

export default new DashboardController();

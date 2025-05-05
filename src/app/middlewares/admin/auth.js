// middlewares/auth.js
import phanquyen from "../../model/admin/phanquyenModel.js";

export const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/admin/login");
};

export function redirectByRole(req, res) {
  const role = req.session.user?.TenNhomQuyen;
  
  if (role === "admin") return res.redirect("/admin/dashboard");
  if (role === "sales") return res.redirect("/admin/sales");
  if (role === "warehouse") return res.redirect("/admin/warehouse");

  res.redirect("/admin/login");
}

export function checkRole(allowedRoles) {
  return (req, res, next) => {
    const roles = Array.isArray(allowedRoles[0])
      ? allowedRoles[0]
      : allowedRoles;

    const accessList = req.session.user?.accessList || [];
    const hasAccess = roles.some((access) => accessList.includes(access));

    if (hasAccess) return next();

    return res.status(403).render("errors/403", { layout: false });
  };
}

export function checkPermission(requiredPermission) {
  return async (req, res, next) => {
    try {
      const idNQ = req.session.user?.idNQ;
      if (!idNQ) {
        return res.redirect("/admin/login");
      }

      // Cache permissions in session if not already present
      if (!req.session.cachedPermissions) {
        const viewPermissions = await phanquyen.findPAccessIdNhomQuyen(idNQ, "view");
        const allPermissions = await phanquyen.findPAccessIdNhomQuyen(idNQ, "all");
        
        req.session.cachedPermissions = [
          ...viewPermissions.map(p => p.ChucNang),
          ...allPermissions.map(p => p.ChucNang)
        ];
      }
      
      const userPermissions = req.session.cachedPermissions;
      const hasPermission = userPermissions.some((perm) =>
        requiredPermission.includes(perm)
      );
      
      if (!hasPermission) {
        return res.status(403).render("errors/403", {
          message: "Không có quyền truy cập!",
          layout: false,
        });
      }

      next();
    } catch (err) {
      console.error("Permission check failed:", err);
      return res.status(500).render("errors/500", {
        message: "Lỗi hệ thống khi kiểm tra quyền.",
        layout: false
      });
    }
  };
}

export function checkAction(require, yc) {
  return async (req, res, next) => {
    try {
      // Cache actions in session if not already present for this function
      const cacheKey = `actions_${yc}`;
      
      if (!req.session[cacheKey]) {
        const actions = await phanquyen.action(req.session.user.idNQ, yc);
        req.session[cacheKey] = actions;
      }
      
      const actions = req.session[cacheKey];
      const hasPermission = actions.some((action) => require.includes(action));

      if (hasPermission) {
        return next();
      } else {
        return res.status(403).render("errors/403", {
          message: "Bạn không có quyền thực hiện chức năng này.",
          layout: false,
        });
      }
    } catch (error) {
      console.error("Lỗi kiểm tra quyền:", error);
      return res.status(500).render("errors/500", {
        message: "Lỗi máy chủ khi kiểm tra quyền hành động.",
        layout: false
      });
    }
  };
}

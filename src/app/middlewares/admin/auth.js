// middlewares/auth.js
import phanquyen from "../../model/admin/phanquyenModel.js";
export const isLoggedIn = (req, res, next) => {
  console.log(">> Kiểm tra session:", req.session);
  if (req.session && req.session.user) {
    console.log(">> Đã đăng nhập:", req.session.user);
    return next();
  }
  console.log(">> Chưa đăng nhập");
  return res.redirect("/admin/login");
};

export function redirectByRole(req, res) {
  const role = req.session.user?.role;

  if (role === "admin") return res.redirect("/admin/dashboard");
  if (role === "sale") return res.redirect("/admin/sale");
  if (role === "manager") return res.redirect("/admin/manager");

  res.redirect("/admin/login");
}
// middleware/authMiddleware.js
export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    // allowedRoles = allowedRoles[0];

    let tmp = allowedRoles[0];
    allowedRoles = tmp;

    console.log(allowedRoles);
    const accessList = req.session.user?.accessList || [];
    const hasAccess = allowedRoles.some((access) =>
      accessList.includes(access)
    );

    if (hasAccess) return next();

    return res.status(403).render("errors/403", { layout: false });
  };
}
// middlewares/checkPermission.js
export function checkPermission(requiredPermission) {
  // console.log(requiredPermission);
  return async (req, res, next) => {
    try {
      console.log(">> [checkPermission] Session user:", req.session.user); // 👈 thêm dòng này

      const idNQ = req.session.user?.idNQ;
      if (!idNQ) {
        console.log(">> Không có idNQ trong session");
        return res.redirect("/admin/login");
      }

      const tmp = await phanquyen.findPAccessIdNhomQuyen(idNQ, "view");

      // Thêm quyền "all" vào danh sách permissions
      const allPermissions = (
        await phanquyen.findPAccessIdNhomQuyen(idNQ, "all")
      ).map((p) => p.ChucNang);
      const permissions = [...tmp, ...allPermissions];
      console.log(allPermissions);
      console.log(permissions);
      // permissions = permissions.concat(allPermissions);
      const userPermissions = permissions;
      console.log(
        ">> [checkPermission] Các quyền người dùng:",
        userPermissions
      );
      console.log(userPermissions);
      console.log(requiredPermission);
      const hasPermission = requiredPermission.some((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        return res.status(403).render("errors/403", {
          message: "Không có quyền truy cập!",
          layout: false,
        });
      }

      console.log(
        ">> [checkPermission] Được phép truy cập:",
        requiredPermission
      );
      next();
    } catch (err) {
      console.error("Permission check failed:", err);
      return res.status(500).send("Lỗi hệ thống.");
    }
  };
}

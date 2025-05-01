// middlewares/auth.js
export function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/admin/login");
}

export function redirectByRole(req, res) {
  const role = req.session.user?.role;

  if (role === "admin") return res.redirect("/admin/dashboard");
  if (role === "sale") return res.redirect("/admin/sale");
  if (role === "manager") return res.redirect("/admin/manager");

  res.redirect("/admin/login");
}
export function checkRole(...allowedRoles) {
  const normalizedRoles = allowedRoles.map((role) => role.toLowerCase());

  return (req, res, next) => {
    const userGroup = req.session.user?.TenNhomQuyen?.toLowerCase();
    console.log("Nhóm quyền:", userGroup);
    if (normalizedRoles.includes(userGroup)) {
      return next(); // Có quyền
    }
    return res.status(403).render("errors/403", { layout: false });
  };
}

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

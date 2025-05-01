class DashboardController {
  async show(req, res) {
    try {
      res.render("admin/dashboard", {
        title: "Dashboard",
        cssFiles: [],
        layout: "admin",
      });
    } catch (error) {}
  }
}

export default new DashboardController();

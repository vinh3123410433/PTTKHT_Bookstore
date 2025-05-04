import phanquyen from "../../model/admin/phanquyenModel.js";
import perModel from "../../model/admin/permissionsModel.js";
class Permissions {
  async show(req, res) {
    let permissions = (
      await phanquyen.findPAccessIdNhomQuyen(req.session.user.idNQ, "view")
    ).map((p) => p.ChucNang);

    const allPermissions = (
      await phanquyen.findPAccessIdNhomQuyen(req.session.user.idNQ, "all")
    ).map((p) => p.ChucNang);

    permissions = permissions.concat(allPermissions);
    let action = await phanquyen.action(req.session.user.idNQ, "admin");
    console.log("NÈ" + action);
    try {
      console.log("Vào per nè");
      const listper = await perModel.getAll();
      console.log(listper);
      res.render("admin/permissions", {
        title: "Permissions",
        cssFiles: ["admin/style"],
        layout: "admin",
        listper,
        permissions,
        action,
      });
    } catch (error) {}
  }
}

export default new Permissions();

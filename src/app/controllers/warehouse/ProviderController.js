// const providerConfig = require('../db/provider');
import providerConfig from "../../model/warehouse/provider.js";
import ExcelJS from "exceljs";

class ProviderController {
  // show all providers
  async index(req, res) {
    try {
      const provider = await providerConfig.getAll();
      res.render("warehouse/provider", { provider, layout: "warehouse" });
    } catch (error) {
      console.log(error);
    }
  }

  // search provider
  async search(req, res) {
    try {
      const query = req.query.search || "";
      const provider = await providerConfig.search_provider(query);
      res.render("warehouse/provider", { provider, layout: "warehouse" });
    } catch (error) {
      console.log(error);
    }
  }

  // create new provider form
  async create(req, res) {
    try {
      res.render("warehouse/create_provider", { layout: "warehouse" });
    } catch (error) {
      console.log(error);
    }
  }

  // create excel
  async create_excel(req, res) {
    try {
      const data = await providerConfig.getAll(); // Lấy dữ liệu từ DB
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách sản phẩm");

      // Định nghĩa các cột
      worksheet.columns = [
        { header: "Mã NCC", key: "ID_NCC", width: 10 },
        { header: "Tên Nhà Cung Cấp", key: "TenNCC", width: 30 },
        { header: "SĐT", key: "SDT", width: 15 },
        { header: "Email", key: "Email", width: 30 },
        { header: "Số Nhà / Đường", key: "SoNhaDuong", width: 25 },
        { header: "Phường / Xã", key: "PhuongXa", width: 25 },
        { header: "Quận / Huyện", key: "QuanHuyen", width: 25 },
        { header: "Tỉnh / Thành Phố", key: "TinhThanhPho", width: 25 },
      ];

      // Thêm dữ liệu
      data.forEach((item, index) => {
        worksheet.addRow({
          ...item,
        });
      });

      // Xuất file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=ds_nhacungcap.xlsx"
      );
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.log(error);
    }
  }

  // get data from create form and create new provider
  async store(req, res) {
    try {
      const { name, phone, email, street, ward, district, city } = req.body;
      await providerConfig.insert(
        name,
        phone,
        email,
        street,
        ward,
        district,
        city
      );
      res.redirect("/provider");
    } catch (error) {
      console.log(error);
    }
  }

  // update data form
  async update(req, res) {
    try {
      const { id } = req.params;
      const edit_provider = (await providerConfig.search(id))[0];
      res.render("warehouse/update_provider", {
        edit_provider,
        layout: "warehouse",
      });
    } catch (error) {
      console.log(error);
    }
  }

  // get data from update and edit provider
  async edit(req, res) {
    try {
      const { id, name, phone, email, street, ward, district, city } = req.body;
      await providerConfig.update(
        id,
        name,
        phone,
        email,
        street,
        ward,
        district,
        city
      );
      res.redirect("/provider");
    } catch (error) {
      console.log(error);
    }
  }

  // delete provider
  async delete(req, res) {
    try {
      await providerConfig.delete(req.params.id);
      res.redirect("/provider");
    } catch (error) {
      console.log(error);
    }
  }

  async delete_opt(req, res) {
    try {
      const provider = await providerConfig.getAll_delete();
      res.render("warehouse/provider", { provider, layout: "warehouse" });
    } catch (error) {
      console.log(error);
    }
  }

  async on_cooperate(req, res) {
    try {
      const provider = await providerConfig.getAll();
      res.render("warehouse/provider", { provider, layout: "warehouse" });
    } catch (error) {
      console.log(error);
    }
  }
}

// module.exports = new ProviderController();
export default new ProviderController();

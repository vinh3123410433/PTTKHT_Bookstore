import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateOrdersExcel(orders) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Mã Đơn", key: "id", width: 15 },
      { header: "Ngày Đặt", key: "date", width: 20 },
      { header: "Khách Hàng", key: "customer", width: 25 },
      { header: "Địa Chỉ", key: "address", width: 30 },
      { header: "Số Điện Thoại", key: "phone", width: 15 },
      { header: "Tổng Tiền", key: "total", width: 15 },
      { header: "Trạng Thái", key: "status", width: 20 },
      { header: "Phương Thức Thanh Toán", key: "paymentMethod", width: 25 },
    ];

    // Thêm dữ liệu từng dòng
    orders.forEach((order) => {
      worksheet.addRow({
        id: order.ID,
        date: new Date(order.NgayDat).toLocaleDateString("vi-VN"),
        customer: order.TenKH,
        address: `${order.DiaChi}, ${order.PhuongXa}, ${order.QuanHuyen}, ${order.TinhTP}`,
        phone: order.SDT,
        total: order.TongTien,
        status: order.TinhTrangDon,
        paymentMethod: order.PhuongThucThanhToan,
      });
    });

    // Format the total column to show as currency
    worksheet.getColumn("total").numFmt = "#,##0 VND";

    // Create a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    return buffer;
  } catch (error) {
    console.error("Error generating Excel file:", error);
    throw error;
  }
}

export async function generateRevenueExcel(data, title, type) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Revenue Statistics");

    worksheet.mergeCells("A1:D1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = title;
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: "center" };
    titleRow.height = 30;

    worksheet.mergeCells("A2:D2");
    const dateRow = worksheet.getRow(2);
    dateRow.getCell(
      1
    ).value = `Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}`;
    dateRow.getCell(1).alignment = { horizontal: "center" };
    dateRow.height = 20;

    worksheet.addRow([]);
    const headerRow = worksheet.addRow([
      "Thời gian",
      "Doanh thu",
      "Vốn",
      "Lợi nhuận",
    ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCCCCC" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    let timeLabel = "";
    switch (type) {
      case "day":
        timeLabel = "Ngày";
        break;
      case "month":
        timeLabel = "Tháng";
        break;
      case "year":
        timeLabel = "Năm";
        break;
      default:
        timeLabel = "Ngày";
    }

    data.forEach((item) => {
      let timeValue;

      if (item.Ngay) {
        const date = new Date(item.Ngay);
        timeValue = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
      } else if (item.Thang) {
        timeValue = `Tháng ${item.Thang}`;
      } else if (item.Nam) {
        timeValue = `Năm ${item.Nam}`;
      }

      worksheet.addRow([timeValue, item.DoanhThu, item.Von, item.LoiNhuan]);
    });

    const totals = data.reduce(
      (acc, item) => {
        acc.DoanhThu += parseFloat(item.DoanhThu || 0);
        acc.Von += parseFloat(item.Von || 0);
        acc.LoiNhuan += parseFloat(item.LoiNhuan || 0);
        return acc;
      },
      { DoanhThu: 0, Von: 0, LoiNhuan: 0 }
    );

    const totalRow = worksheet.addRow([
      "Tổng",
      totals.DoanhThu,
      totals.Von,
      totals.LoiNhuan,
    ]);
    totalRow.font = { bold: true };
    totalRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    worksheet.getColumn(2).numFmt = "#,##0 ₫";
    worksheet.getColumn(3).numFmt = "#,##0 ₫";
    worksheet.getColumn(4).numFmt = "#,##0 ₫";

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `revenue_stats_${timestamp}.xlsx`;

    const exportsDir = path.join(__dirname, "..", "public", "exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const filePath = path.join(exportsDir, fileName);
    await workbook.xlsx.writeFile(filePath);

    return {
      success: true,
      fileName,
      filePath,
    };
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

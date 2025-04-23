// const pool = require('../config/index');
import pool from "../../../config/db.js";

class Statistic {
  // Xem tất cả thông tin thống kê
  async getAll() {
    const query = `SELECT HoaDonNhap.IDHoaDonNhap, NCC.TenNCC, NhanVien.TenNhanVien, NgayNhap, TongTien, TinhTrangThanhToan
        FROM HoaDonNhap 
        LEFT JOIN NCC ON HoaDonNhap.ID_NCC = NCC.ID_NCC
        LEFT JOIN NhanVien ON HoaDonNhap.IDNhanVien = NhanVien.IDNhanVien`;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Lấy hóa đơn theo thời gian
  async getReceiptsByDateRange(from, to) {
    const query = `SELECT HoaDonNhap.IDHoaDonNhap, NCC.TenNCC, NhanVien.TenNhanVien, NgayNhap, TongTien, TinhTrangThanhToan
        FROM HoaDonNhap
        LEFT JOIN NCC ON HoaDonNhap.ID_NCC = NCC.ID_NCC
        LEFT JOIN NhanVien ON HoaDonNhap.IDNhanVien = NhanVien.IDNhanVien
        WHERE DATE(NgayNhap) BETWEEN ? AND ?
        ORDER BY NgayNhap`;
    const [rows] = await pool.execute(query, [from, to]);
    return rows;
  }
}

// module.exports = new Statistic();
export default new Statistic();

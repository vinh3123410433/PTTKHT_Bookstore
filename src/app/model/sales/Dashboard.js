import db from "../../../config/db.js";
import { BaseModel } from "./BaseModel.js";

class Dashboard extends BaseModel {
  constructor() {
    super("SanPham", "SanPhamID");
  }

  async getTopProductsByDateRange(startDate, endDate) {
    try {
      let sql = `SELECT GROUP_CONCAT(tg.TenTacGia SEPARATOR ', ') as DSTG , sp.*, SUM(cthdx.SoLuong) as DaBan,  SUM(cthdn.SoLuong) AS TongSL, anhsp.Anh
               FROM sanpham sp
               INNER JOIN chitiethoadonxuat cthdx ON cthdx.IDSanPham = sp.SanPhamID
               INNER JOIN hoadonxuat hdx ON hdx.IDHoaDonXuat = cthdx.IDHoaDonXuat
               INNER JOIN chitiethoadonnhap cthdn ON cthdn.IDSanPham = sp.SanPhamID
               INNER JOIN giaohang gh ON gh.ID_HDX = hdx.IDHoaDonXuat
               INNER JOIN anhsp ON anhsp.ID_SP = sp.SanPhamID
               INNER JOIN sp_tg ON sp_tg.SanPhamID = sp.SanPhamID
               INNER JOIN tacgia tg ON tg.IDTacGia = sp_tg.IDTacGia
               WHERE anhsp.STT = 1
               `;

      if (startDate && endDate) sql += ` AND gh.NgayGiaoHang BETWEEN ? AND ?`;
      else sql += ` AND gh.NgayGiaoHang = ?`;

      sql += `
      AND gh.TinhTrangDon = 'Đã giao'
      GROUP BY sp.SanPhamID, anhsp.Anh
      ORDER BY DaBan DESC
      LIMIT 5
    `;

      const [product] = await db.query(
        sql,
        startDate && endDate ? [startDate, endDate] : [startDate]
      );

      return product;
    } catch (error) {
      console.error("Error fetching top products:", error);
      throw error;
    }
  }

  async getDashboard(startDate, endDate) {
    try {
      let sql = `SELECT SUM(cthdx.SoLuong) as DaBan, SUM(cthdx.ThanhTien) AS TongTien, COUNT(DISTINCT hdx.IDHoaDonXuat) AS SoHDX, 
                        COUNT(DISTINCT hdx.ID_KH) AS SoKH
                 FROM chitiethoadonxuat cthdx
                 INNER JOIN hoadonxuat hdx ON hdx.IDHoaDonXuat = cthdx.IDHoaDonXuat
                 INNER JOIN giaohang gh ON gh.ID_HDX = hdx.IDHoaDonXuat
                 WHERE gh.TinhTrangDon = 'Đã giao'
              `;

      if (startDate && endDate) sql += ` AND gh.NgayGiaoHang BETWEEN ? AND ?`;
      else sql += ` AND gh.NgayGiaoHang = ?`;

      const [dashboard] = await db.query(
        sql,
        startDate && endDate ? [startDate, endDate] : [startDate]
      );

      return dashboard;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }

  async getRevenueCurrentMonth() {
    try {
      const sql = `SELECT 
                        DATE(gh.NgayGiaoHang) AS Ngay,
                        SUM(cthdx.ThanhTien) AS DoanhThu,
                        SUM(cthdx.SoLuong * 
                            (SELECT AVG(cthdn_sub.GiaNhap) 
                            FROM chitiethoadonnhap cthdn_sub 
                            WHERE cthdn_sub.IDSanPham = cthdx.IDSanPham)
                        ) AS Von,
                        SUM(cthdx.ThanhTien - 
                            (cthdx.SoLuong * 
                                (SELECT AVG(cthdn_sub.GiaNhap) 
                                FROM chitiethoadonnhap cthdn_sub 
                                WHERE cthdn_sub.IDSanPham = cthdx.IDSanPham)
                            )
                        ) AS LoiNhuan
                    FROM chitiethoadonxuat cthdx
                    INNER JOIN hoadonxuat hdx ON hdx.IDHoaDonXuat = cthdx.IDHoaDonXuat
                    INNER JOIN giaohang gh ON gh.ID_HDX = hdx.IDHoaDonXuat
                    INNER JOIN sanpham sp ON sp.SanPhamID = cthdx.IDSanPham
                    WHERE gh.TinhTrangDon = 'Đã giao'
                    AND gh.NgayGiaoHang BETWEEN DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01') AND CURRENT_DATE()
                    GROUP BY DATE(gh.NgayGiaoHang)
                    ORDER BY DATE(gh.NgayGiaoHang)`;

      const [revenueData] = await db.query(sql);
      return revenueData;
    } catch (error) {
      console.error("Error fetching current month revenue data:", error);
      throw error;
    }
  }
}

export default Dashboard;

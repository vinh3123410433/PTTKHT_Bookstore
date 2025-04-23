// const pool = require('../config/index');
import pool from "../../../config/db.js";

class Category {
  // Xem tất cả danh mục
  async getAll() {
    const query = `SELECT * FROM danhmuc 
        WHERE tinhTrang = 1`;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // search danh mục
  async search(id) {
    const query = `SELECT * FROM danhmuc 
        WHERE DanhMucID = ?
        AND tinhTrang = 1`;
    const [rows] = await pool.execute(query, [id]);
    return rows;
  }

  // Xem các sản phẩm có trong danh mục
  async viewProduct(id) {
    const query = `SELECT sanpham.SanPhamID, TenSanPham, tacgia.TenTacGia, nxb.TenNXB, anhsp.Anh, Gia, SoLuongTon, SoTrang, MoTa
        FROM danhmuc 
        LEFT JOIN sp_dm ON sp_dm.DanhMucID = danhmuc.DanhMucID
        LEFT JOIN sanpham ON sanpham.SanPhamID = sp_dm.SanPhamID AND sanpham.tinhTrang = 1
        LEFT JOIN nxb ON sanpham.ID_NXB = nxb.ID_NXB
        LEFT JOIN sp_tg ON sanpham.SanPhamID = sp_tg.SanPhamID
        LEFT JOIN anhsp ON sanpham.SanPhamID = anhsp.ID_SP AND anhsp.STT = 1
        LEFT JOIN tacgia ON sp_tg.IDTacGia = tacgia.IDTacGia
        WHERE danhmuc.DanhMucID = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows;
  }

  // Hiển thị header của danh mục trong chi tiết danh mục
  async detailHeader(id) {
    const query = `SELECT TenDanhMuc 
        FROM danhmuc 
        WHERE DanhMucID = ?
        AND tinhTrang = 1`;
    const [rows] = await pool.execute(query, [id]);
    return rows;
  }

  // Thêm một danh mục mới
  async insert(name) {
    const query = `INSERT INTO danhmuc (TenDanhMuc) VALUES (?)`;
    await pool.execute(query, [name]);
  }

  // sửa danh mục
  async update(id, name) {
    const query = `UPDATE danhmuc  
        SET TenDanhMuc = ?
        WHERE DanhMucID = ?;`;
    await pool.execute(query, [name, id]);
  }

  // xoá danh mục
  async delete(id) {
    await pool.execute(
      `UPDATE danhmuc  
            SET tinhTrang = 0
            WHERE DanhMucID = ?;`,
      [id]
    );
  }
}

// module.exports = new Category();
export default new Category();

import db from "../../../config/db.js";

async function findPermissionbyQuyenCha(name) {
  try {
    let query = "";
    let params = [];

    if (name === null || name === undefined) {
      query = "SELECT * FROM danhmucchucnang WHERE QuyenCha IS NULL";
    } else {
      query = "SELECT * FROM danhmucchucnang WHERE QuyenCha = ?";
      params = [name];
    }

    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Lỗi khi truy vấn:", error);
    return [];
  }
}
async function findPAccessIdNhomQuyen(id, action) {
  try {
    const [rows] = await db.execute(
      `SELECT ChucNang FROM ChiTietQuyen WHERE ID_NhomQuyen = ? AND HanhDong = ?`,
      [id, action]
    );
    return rows;
  } catch (error) {
    console.error("Lỗi khi truy vấn quyền:", error);
    return [];
  }
}

export default {
  findPermissionbyQuyenCha,
  findPAccessIdNhomQuyen,
};

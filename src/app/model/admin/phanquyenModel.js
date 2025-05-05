import db from "../../../config/db.js";

// Add caching mechanism
const permissionsCache = {
  byRole: new Map(),
  byQuyenCha: new Map(),
  actions: new Map(),
  timeout: 300000, // 5 minutes cache timeout
};

// Clear cache after timeout
setInterval(() => {
  permissionsCache.byRole.clear();
  permissionsCache.byQuyenCha.clear();
  permissionsCache.actions.clear();
}, permissionsCache.timeout);

async function findPermissionbyQuyenCha(name) {
  try {
    // Check cache first
    const cacheKey = name === null || name === undefined ? 'null' : name;
    if (permissionsCache.byQuyenCha.has(cacheKey)) {
      return permissionsCache.byQuyenCha.get(cacheKey);
    }

    let query = "";
    let params = [];

    if (name === null || name === undefined) {
      query = "SELECT * FROM danhmucchucnang WHERE QuyenCha IS NULL";
    } else {
      query = "SELECT * FROM danhmucchucnang WHERE QuyenCha = ?";
      params = [name];
    }

    const [rows] = await db.execute(query, params);
    
    // Store in cache
    permissionsCache.byQuyenCha.set(cacheKey, rows);
    return rows;
  } catch (error) {
    console.error("Lỗi khi truy vấn findPermissionbyQuyenCha:", error);
    return [];
  }
}

async function findQuyenChaFromPermissions(permissions) {
  if (!permissions || permissions.length === 0) return "qldoanhnghiep";

  try {
    // Bước 1: lấy các chức năng không trùng
    const dsChucNang = Array.from(new Set(permissions.map((p) => p.ChucNang)));
    
    // Bước 2: query quyền cha từ bảng danhsachchucnang
    const placeholders = dsChucNang.map(() => "?").join(",");
    const sql = `SELECT DISTINCT quyencha FROM danhmucchucnang WHERE ChucNang IN (${placeholders})`;
    const [rows] = await db.query(sql, dsChucNang);

    return rows.length === 1 ? rows[0].quyencha : "qldoanhnghiep";
  } catch (error) {
    console.error("Lỗi khi truy vấn findQuyenChaFromPermissions:", error);
    return "qldoanhnghiep";
  }
}

async function findPAccessIdNhomQuyen(id, action) {
  try {
    // Check cache first
    const cacheKey = `${id}_${action}`;
    if (permissionsCache.byRole.has(cacheKey)) {
      return permissionsCache.byRole.get(cacheKey);
    }

    const [rows] = await db.execute(
      `SELECT ChucNang FROM ChiTietQuyen WHERE ID_NhomQuyen = ? AND HanhDong = ?`,
      [id, action]
    );

    // Store in cache
    permissionsCache.byRole.set(cacheKey, rows);
    return rows;
  } catch (error) {
    console.error("Lỗi khi truy vấn quyền findPAccessIdNhomQuyen:", error);
    return [];
  }
}

async function action(id, ChucNang) {
  try {
    // Check cache first
    const cacheKey = `${id}_${ChucNang}`;
    if (permissionsCache.actions.has(cacheKey)) {
      return permissionsCache.actions.get(cacheKey);
    }

    const [rows] = await db.execute(
      `SELECT HanhDong FROM ChiTietQuyen WHERE ID_NhomQuyen = ? AND ChucNang = ?`,
      [id, ChucNang]
    );

    const actions = rows.map((p) => p.HanhDong);
    
    // Store in cache
    permissionsCache.actions.set(cacheKey, actions);
    return actions;
  } catch (error) {
    console.error("Lỗi khi truy vấn quyền:", error);
    return [];
  }
}

async function addRoleToTable(TenNhomQuyen) {
  try {
    const query = `
      INSERT INTO nhomquyen (TenNhomQuyen)
      VALUES (?)
    `;
    const [result] = await db.execute(query, [TenNhomQuyen]);

    // Clear permission caches since data has changed
    permissionsCache.byRole.clear();
    return result.insertId;
  } catch (err) {
    console.error("Lỗi khi thêm vai trò:", err);
    throw err;
  }
}

async function deleteRoleById(ID_NhomQuyen) {
  try {
    // Xóa quyền chi tiết trước
    await deletePermissionsByRoleId(ID_NhomQuyen);

    // Kiểm tra xem nhóm quyền có đang được sử dụng không
    const checkQuery = `SELECT COUNT(*) as count FROM TaiKhoan WHERE ID_NhomQuyen = ?`;
    const [checkResult] = await db.execute(checkQuery, [ID_NhomQuyen]);

    if (checkResult[0].count > 0) {
      // Nếu có tài khoản đang sử dụng nhóm quyền này
      const updateQuery = `UPDATE TaiKhoan SET ID_NhomQuyen = NULL WHERE ID_NhomQuyen = ?`;
      await db.execute(updateQuery, [ID_NhomQuyen]);
    }

    // Xóa nhóm quyền
    const query = `DELETE FROM NhomQuyen WHERE ID_NhomQuyen = ?`;
    const [result] = await db.execute(query, [ID_NhomQuyen]);

    // Clear permission caches since data has changed
    permissionsCache.byRole.clear();
    return result;
  } catch (err) {
    console.error("Lỗi khi xóa nhóm quyền:", err);
    throw err;
  }
}

// Hàm xóa quyền chi tiết (ChiTietQuyen)
async function deletePermissionsByRoleId(ID_NhomQuyen) {
  try {
    const query = `DELETE FROM ChiTietQuyen WHERE ID_NhomQuyen = ?`;
    await db.execute(query, [ID_NhomQuyen]);
    
    // Clear permission caches since data has changed
    permissionsCache.byRole.clear();
    permissionsCache.actions.clear();
  } catch (err) {
    console.error("Lỗi khi xóa chi tiết quyền:", err);
    throw err;
  }
}

async function addPermissionsToTable(ID_NhomQuyen, ChucNang, HanhDong) {
  try {
    const query = `
      INSERT INTO ChiTietQuyen (ID_NhomQuyen, ChucNang, HanhDong)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      ID_NhomQuyen,
      ChucNang,
      HanhDong,
    ]);

    // Clear permission caches since data has changed
    permissionsCache.byRole.clear();
    permissionsCache.actions.clear();

    return result;
  } catch (err) {
    console.error("Lỗi khi thêm quyền:", err);
    throw err;
  }
}

export default {
  findPermissionbyQuyenCha,
  findPAccessIdNhomQuyen,
  action,
  addRoleToTable,
  addPermissionsToTable,
  deletePermissionsByRoleId,
  deleteRoleById,
  findQuyenChaFromPermissions,
};

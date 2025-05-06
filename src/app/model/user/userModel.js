import database from "../../../config/db.js";

const getInforUser = async (id) => {
  const [rows] = await database.query("select * from KhachHang where ID_KH=?", [
    id,
  ]);
  return rows;
};

const getResultFromQuery = async (query) => {
  const [rows] = await database.query(query);
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await database.query(
    "SELECT * FROM KhachHang WHERE ID_KH = ?",
    [id]
  );
  return rows[0];
};

const updateUserInfo = async (ID_KH, { TenKH, SDT, NgaySinh }) => {
  const query = `UPDATE KhachHang SET NgaySinh = ?, TenKH = ?, SDT = ? WHERE ID_KH = ?`;
  await database.query(query, [NgaySinh, TenKH, SDT, ID_KH]);
};

const updateUserInfoNoPhone = async (ID_KH, { TenKH, NgaySinh }) => {
  const query = `UPDATE KhachHang SET NgaySinh = ?, TenKH = ? WHERE ID_KH = ?`;
  await database.query(query, [NgaySinh, TenKH, ID_KH]);
};

const findUserByPhone = async (phone) => {
  const [rows] = await database.query("SELECT * FROM KhachHang WHERE SDT = ?", [
    phone,
  ]);
  return rows[0]; // trả về user hoặc undefined
};

const findUserByIdAndPassword = async (id, password) => {
  const [rows] = await database.query(
    "SELECT * FROM KhachHang WHERE ID_KH = ? AND MatKhau = ?",
    [id, password]
  );
  return rows[0]; // trả về user nếu đúng mật khẩu
};

const updatePassword = async (id, newPassword) => {
  await database.query("UPDATE KhachHang SET MatKhau = ? WHERE ID_KH = ?", [
    newPassword,
    id,
  ]);
};

const getMaxCustomerId = async () => {
  try {
    const [rows] = await database.query("SELECT MAX(ID_KH) AS maxId FROM KhachHang");
    return rows[0].maxId || 0; // Trả về ID lớn nhất hoặc 0 nếu bảng trống
  } catch (error) {
    console.error("Lỗi khi lấy ID khách hàng lớn nhất:", error);
    return 0;
  }
};

const createUser = async ({
  user_account_name,
  user_name,
  user_telephone,
  user_password,
}) => {
  try {
    console.log("Đang thực hiện tạo tài khoản với thông tin:", {
      TenTK: user_account_name,
      TenKH: user_name,
      SDT: user_telephone,
      MatKhau: '****' // Che dấu mật khẩu trong log
    });
    
    // Lấy ID lớn nhất và tăng thêm 1
    const maxId = await getMaxCustomerId();
    const newId = maxId + 1;
    
    console.log("ID khách hàng mới sẽ là:", newId);
    
    // Thêm trường ID_KH vào câu lệnh INSERT
    const query = `INSERT INTO KhachHang (ID_KH, TenTK, TenKH, SDT, MatKhau) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await database.query(query, [
      newId,
      user_account_name,
      user_name,
      user_telephone,
      user_password,
    ]);
    
    console.log("Kết quả tạo tài khoản:", result);
    return {
      success: true,
      insertId: newId, // Trả về ID mới
      affectedRows: result.affectedRows
    };
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản:", error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

export default {
  getInforUser,
  getResultFromQuery,
  getUserById,
  updateUserInfo,
  updateUserInfoNoPhone,
  findUserByPhone,
  updatePassword,
  findUserByIdAndPassword,
  createUser,
  getMaxCustomerId, // Xuất hàm mới
};

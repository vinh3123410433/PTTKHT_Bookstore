// adminModel.js
import db from "../../../config/db.js";

async function findByID(id) {
  try {
    const [rows] = await db.execute(
      `SELECT *
       FROM taikhoan tk 
       JOIN nhomquyen nq ON tk.ID_NhomQuyen = nq.ID_NhomQuyen
       WHERE tk.ID_TK = ?`,
      [id]
    );
    return rows[0];
  } catch (err) {
    console.error("Lỗi truy vấn findByID:", err);
    return null;
  }
}

export default {
  findByID,
};

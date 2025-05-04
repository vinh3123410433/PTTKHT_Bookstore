import db from "../../../config/db.js";
class Permission {
  async getAll() {
    const query = `SELECT * FROM nhomquyen
        WHERE tinhTrang = 1`;
    const [rows] = await db.execute(query);
    return rows;
  }
}
export default new Permission();

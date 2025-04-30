import database from "../../../config/db.js";

const getProductById = async (SanPhamID) => {
  const query = `
        SELECT * 
        FROM SanPham
        WHERE SanPhamID = ?
    `;
  const [rows] = await database.query(query, [SanPhamID]);
  return rows[0];
};

export default { getProductById };

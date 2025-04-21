const database = require("../../config/db");

const getProductById = async (SanPhamID) => {
  const query = `
        SELECT * 
        FROM SanPham
        WHERE SanPhamID = ?
    `;
  const [rows] = await database.query(query, [SanPhamID]);
  return rows[0];
};
module.exports = {
  getProductById,
};

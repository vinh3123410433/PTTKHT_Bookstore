const database=require('../../config/database')

const getCartByUserId = async (userId) => {
    const query = `
        SELECT * 
        FROM KhachHang
        JOIN GioHang ON KhachHang.ID_KH = GioHang.ID_KH
        JOIN SanPham ON SanPham.SanPhamID = GioHang.ID_SP
        JOIN AnhSP ON AnhSP.ID_SP = SanPham.SanPhamID
        WHERE KhachHang.ID_KH = ?
    `;
    const [rows] = await database.query(query, [userId]);
    return rows;
};
module.exports = {
    getCartByUserId,
};
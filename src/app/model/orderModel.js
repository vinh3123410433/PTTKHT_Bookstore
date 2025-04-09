// src/models/orderModel.js
const database = require('../../db');

const createOrder = async (userId, tongTien) => {
    const [result] = await database.query(
        'INSERT INTO DonHang (ID_KH, TongTien, NgayTao) VALUES (?, ?, NOW())',
        [userId, tongTien]
    );
    return result.insertId; // ID đơn hàng vừa tạo
};

const addOrderDetails = async (orderId, items) => {
    const query = 'INSERT INTO ChiTietDonHang (ID_DH, ID_SP, SoLuong) VALUES ?';
    const values = items.map(item => [orderId, item.idSanPham, item.soLuong]);
    await database.query(query, [values]);
};

module.exports = {
    createOrder,
    addOrderDetails
};

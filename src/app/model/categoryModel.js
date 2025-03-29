const db = require('../../config/db');

// Hàm lấy tất cả danh mục
const getAllCategories = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM danhmuc');
        return rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Hàm lấy 5 danh mục phổ biến
const getfiveCategoriespopular = async () => {
    try {
        const [rows] = await db.query(`
            SELECT sp_dm.DanhMucID, danhmuc.TenDanhMuc, COUNT(sp_dm.SanPhamID) AS SoLuongSanPham
            FROM sp_dm
            JOIN danhmuc ON sp_dm.DanhMucID = danhmuc.DanhMucID
            GROUP BY sp_dm.DanhMucID, danhmuc.TenDanhMuc
            ORDER BY SoLuongSanPham DESC
            LIMIT 5;
        `);
        return rows;
    } catch (error) {
        console.error('Error fetching popular categories:', error);
        throw error;
    }
};




// Xuất các hàm
module.exports = {
    getAllCategories,
    getfiveCategoriespopular,  
};


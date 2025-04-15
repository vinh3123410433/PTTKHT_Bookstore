const db = require('../../config/db');
const categoryModel = require('../model/categoryModel')
// Hàm lấy danh sách sách
const getAllBooks = async (categoryId = null) => {
    try {
        let query = `
            SELECT sp.SanPhamID, sp.SanPhamID, sp.TenSanPham, sp.ID_NXB, sp.MoTa, sp.Gia, sp.SoLuongTon, sp.SoTrang,
                   GROUP_CONCAT(DISTINCT tg.TenTacGia SEPARATOR ', ') AS TacGia,
                   dm.DanhMucID,
                   dm.TenDanhMuc,
                   a.Anh AS Anh
            FROM sanpham sp
            JOIN sp_dm ON sp.SanPhamID = sp_dm.SanPhamID
            JOIN danhmuc dm ON sp_dm.DanhMucID = dm.DanhMucID
            LEFT JOIN sp_tg ON sp.SanPhamID = sp_tg.SanPhamID
            LEFT JOIN tacgia tg ON sp_tg.IDTacGia = tg.IDTacGia
            LEFT JOIN anhsp a ON sp.SanPhamID = a.ID_SP AND a.STT = 1
        `;

        // Nếu có truyền vào categoryId thì thêm điều kiện WHERE
        if (categoryId) {
            query += ` WHERE dm.DanhMucID = ? `;
        }

        query += `
            GROUP BY sp.SanPhamID, sp.TenSanPham, sp.MoTa, sp.Gia, sp.SoLuongTon, sp.SoTrang, dm.DanhMucID, dm.TenDanhMuc
        `;

        const [rows] = categoryId ? await db.query(query, [categoryId]) : await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

// Hàm lấy sản phẩm theo danh mục phổ biển
const getBooksinPopularCategory=async()=>{
  const  popularCategories=   await categoryModel.getfiveCategoriespopular()
  books=[]
    for (const i of popularCategories) {
        tmp={
            "DanhMuc": i,
            "SanPham": await getAllBooks(i.DanhMucID)
        }
        books.push(await tmp);
    }
    return books
    
}

module.exports = { getAllBooks , getBooksinPopularCategory};
const db = require('../../config/db');
const categoryModel = require('../model/categoryModel')


// Hàm tính toán phân trang
const paginate = (totalItems, currentPage, perPage) => {
    const totalPages = Math.ceil(totalItems / perPage);
    const offset = (currentPage - 1) * perPage;
    
    return {
        totalPages,
        offset,
        perPage
    };
};

// Hàm lấy danh sách sách (có hoặc không có phân trang)
const getAllBooks = async (categoryId = null, offset = null, perPage = null) => {
    try {
        let query = `
            SELECT sp.SanPhamID, sp.TenSanPham, sp.ID_NXB, sp.MoTa, sp.Gia, sp.SoLuongTon, sp.SoTrang,
                   GROUP_CONCAT(DISTINCT tg.TenTacGia SEPARATOR ', ') AS TacGia,
                   GROUP_CONCAT(DISTINCT dm.TenDanhMuc SEPARATOR ', ') AS DanhMuc,
                   a.Anh AS Anh
            FROM sanpham sp
            JOIN sp_dm ON sp.SanPhamID = sp_dm.SanPhamID
            JOIN danhmuc dm ON sp_dm.DanhMucID = dm.DanhMucID
            LEFT JOIN sp_tg ON sp.SanPhamID = sp_tg.SanPhamID
            LEFT JOIN tacgia tg ON sp_tg.IDTacGia = tg.IDTacGia
            LEFT JOIN anhsp a ON sp.SanPhamID = a.ID_SP AND a.STT = 1
        `;

        if (categoryId) {
            query += ` WHERE dm.DanhMucID = ? `;
        }

        query += ` GROUP BY sp.SanPhamID, sp.TenSanPham, sp.MoTa, sp.Gia, sp.SoLuongTon, sp.SoTrang, a.Anh `;

        if (offset !== null && perPage !== null) {
            query += ` LIMIT ? OFFSET ? `;
        }

        const params = categoryId ? [categoryId] : [];
        if (offset !== null && perPage !== null) {
            params.push(perPage, offset);
        }

        const [rows] = await db.query(query, params);
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



const getProductDetail = async (id = null) => {
    if (id == null) return null;
  
    const query = `
      SELECT 
        sanpham.SanPhamID, 
        MoTa, 
        TenSanPham, 
        sp_tg.IDTacGia, 
        TenTacGia, 
        Gia, 
        TenNXB,
        GROUP_CONCAT(DISTINCT CONCAT(danhmuc.DanhMucID, ':', danhmuc.TenDanhMuc)) AS DanhMucInfo
      FROM sanpham
      JOIN sp_tg ON sanpham.SanPhamID = sp_tg.SanPhamID
      JOIN tacgia ON tacgia.IDTacGia = sp_tg.IDTacGia
      JOIN nxb ON sanpham.ID_NXB = nxb.ID_NXB
      JOIN sp_dm ON sanpham.SanPhamID = sp_dm.SanPhamID
      JOIN danhmuc ON sp_dm.DanhMucID = danhmuc.DanhMucID
      WHERE sanpham.SanPhamID = ?
      GROUP BY sanpham.SanPhamID
    `;
  
    try {
      const [rows] = await db.execute(query, [id]);
      const product = rows[0];
  
      if (!product) return null;
  
      // Parse DanhMucInfo: "1:Kinh tế,2:Tâm lý"
      product.DanhMucs = product.DanhMucInfo
        ? product.DanhMucInfo.split(',').map(item => {
            const [id, name] = item.split(':');
            return { id, name };
          })
        : [];
  
      delete product.DanhMucInfo; // Xoá chuỗi gốc nếu không cần
  
      return product;
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
      throw err;
    }
  };
  
const getProductImages = async (productId) => {
    try {
        const query = `
            SELECT Anh FROM anhsp WHERE ID_SP = ?;
        `;
        
        const [rows] = await db.execute(query, [productId]);

        // Nếu không có hình ảnh, trả về mảng rỗng
        if (!rows.length) {
            return [];
        }

        // Trả về danh sách các hình ảnh dưới dạng mảng
        const images = rows.map(row => row.Anh);  // `Anh` chứa đường dẫn hoặc base64
        return images;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
};


const getListProducts = async (danhMucIDs = []) => {
    if (!Array.isArray(danhMucIDs) || danhMucIDs.length === 0) {
        return [];
    }

    const placeholders = danhMucIDs.map(() => '?').join(',');

    const query = `
        SELECT 
            sanpham.SanPhamID, MoTa, TenSanPham, sp_tg.IDTacGia, TenTacGia, Gia, TenNXB,
            danhmuc.DanhMucID, danhmuc.TenDanhMuc,
            a.Anh AS Anh
        FROM sanpham
        JOIN sp_tg ON sanpham.SanPhamID = sp_tg.SanPhamID
        JOIN tacgia ON tacgia.IDTacGia = sp_tg.IDTacGia
        JOIN nxb ON sanpham.ID_NXB = nxb.ID_NXB
        JOIN sp_dm ON sanpham.SanPhamID = sp_dm.SanPhamID
        JOIN danhmuc ON sp_dm.DanhMucID = danhmuc.DanhMucID
        LEFT JOIN anhsp a ON sanpham.SanPhamID = a.ID_SP AND a.STT = 1
        WHERE sp_dm.DanhMucID IN (${placeholders})
        ORDER BY sanpham.SanPhamID
    `;

    try {
        const [rows] = await db.execute(query, danhMucIDs);

        const productMap = {};

        for (const row of rows) {
            if (!productMap[row.SanPhamID]) {
                productMap[row.SanPhamID] = {
                    SanPhamID: row.SanPhamID,
                    TenSanPham: row.TenSanPham,
                    MoTa: row.MoTa,
                    Gia: row.Gia,
                    TenNXB: row.TenNXB,
                    IDTacGia: row.IDTacGia,
                    TenTacGia: row.TenTacGia,
                    DanhMucs: [],
                    Anh: row.Anh || null // chỉ lấy 1 ảnh chính thôi
                };
            }

            // Thêm danh mục nếu chưa có
            const exists = productMap[row.SanPhamID].DanhMucs.find(dm => dm.DanhMucID === row.DanhMucID);
            if (!exists) {
                productMap[row.SanPhamID].DanhMucs.push({
                    DanhMucID: row.DanhMucID,
                    TenDanhMuc: row.TenDanhMuc
                });
            }
        }

        return Object.values(productMap);
    } catch (err) {
        console.error("Lỗi khi truy vấn sản phẩm theo danh mục:", err);
        throw err;
    }
};






module.exports = { getAllBooks , getBooksinPopularCategory,  paginate,  getProductDetail,getListProducts,getProductImages};

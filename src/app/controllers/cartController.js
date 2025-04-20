const CartModel = require('../model/cartModel');
const ProductModel = require('../model/productModel');
const OrderModel = require('../model/orderModel');

const renderCartPage = async (req, res, next) => {
    try {
        console.log("✅ Đã vào renderCartPage");
        const cartItems = await CartModel.getCartByUserId(req.session.user_id);
        console.log("Cart data:", cartItems); 

        res.render('cart', { cart: cartItems, session: req.session });
    } catch (error) {
        res.redirect('/user/errorPage?error=' + encodeURIComponent('Lỗi khi tải giỏ hàng'));
    }
};     

const thanhtoan1 = async (req, res) => {
    try {
        const { idSanPham, soluong, tongTien } = req.body;
        const userId = req.session.user_id;

        if (!userId) {
            return res.redirect('user/account?error=' + encodeURIComponent('Chưa đăng nhập'));
        }

        console.log('Sản phẩm:', idSanPham);
        console.log('Số lượng:', soluong);
        console.log('Tổng tiền:', tongTien);


        res.render('thanhtoan',{session: req.session});
    } catch (error) {
        console.error('Lỗi xulicart:', error);
        res.redirect('user/errorPage?error=' + encodeURIComponent('Lỗi xử lý giỏ hàng'));
    }
};
const thanhtoan = async (req, res) => {
    try{

        const { idSanPham, soluong, tongTien } = req.body;

        const cart = [];
      
        for (let i = 0; i < idSanPham.length; i++) {
          const soLuong = parseInt(soluong[i]);
          if (soLuong > 0) {
            const product = await ProductModel.getProductById(idSanPham[i]);

            cart.push({
              SanPhamID: idSanPham[i],
              TenSanPham: product.TenSanPham,
              Gia: product.Gia,
              SoLuong: soLuong,
              Tong: product.Gia * soLuong
            });
          }
        }
      
        req.session.cartCheckout = cart;
        req.session.cartTotal = tongTien;
      
        console.log("🛒 Giỏ hàng trong session:", req.session.cartData);
        console.log("💰 Tổng tiền:", req.session.cartTotal);
        console.log("🛒 Giỏ hàng:", cart);
       
    
        res.render('thanhtoan', {cart, total: tongTien, session: req.session }); 
    }
    catch (error) {
        console.error('Lỗi xulicart:', error);
        res.redirect('user/errorPage?error=' + encodeURIComponent('Lỗi xử lý giỏ hàng'));
    }

}; 
const addToCart = async (req, res) => {
    try {
      const productId = parseInt(req.body.productId);
      const userId = req.session.user_id;
      console.log("🛒 ID sản phẩm:", productId);
        console.log("🛒 ID người dùng:", userId);
  
      if (!userId || !productId) {
        return res.status(400).send('Thiếu thông tin người dùng hoặc sản phẩm');
      }
  
      await CartModel.themVaoGio(userId, productId);
  
    //   res.redirect('/cart'); 
    } catch (error) {
      console.error('❌ Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      res.status(500).send('Lỗi server khi thêm vào giỏ hàng');
    }
  };
const afterpayment = async (req, res) => {
    try {
      const cart = req.session.cartCheckout;
      const total = parseFloat(req.session.cartTotal);
      const userId = req.session.user_id;
      console.log('cart:', JSON.stringify(cart, null, 2));

      if (!cart || cart.length === 0) {
        return res.redirect('/cart');
      }
  
      const {
        TenKH,
        SDT,
        address,
        phuong,
        quan,
        thanhpho,
        payment
      } = req.body;
      console.log("🛒đài chỉiiiii:", );
      console.log(payment)
      console.log(quan)

      await OrderModel.capNhatDiaChi({
        ID_KH: userId,
        TenNguoiNhan: TenKH,
        SoDienThoai: SDT,
        DiaChiNhanHang: address,
        PhuongXa: phuong,
        QuanHuyen: quan,
        TinhThanhPho: thanhpho
      });
  

      let tinhtrangthanhtoan = 'Chua thanh toan';
      if (payment === 'Chuyen khoan' || payment === 'Credit card') {
        tinhtrangthanhtoan = 'Da thanh toan';
      }
      const validStatuses = ['Da thanh toan', 'Chua thanh toan', 'Đa hoan tien', 'Chua hoan tien'];
    if (!validStatuses.includes(tinhtrangthanhtoan)) {
    throw new Error('Giá trị TinhTrangThanhToan không hợp lệ.');  
    }

      console.log(tinhtrangthanhtoan)
      console.log("payment: "+ payment)

    //   const validPayments = ['Tiền mặt', 'Chuyển khoản', 'Credit card'];
    //   if (!validPayments.includes(tinhtrangthanhtoan)) {
    //     return res.status(400).send('Phương thức thanh toán không hợp lệ.');
    //   }
      // Tạo hóa đơn
      const hoaDonId = await OrderModel.createHoaDonXuat({
        ID_KH: userId,
        PhuongThucThanhToan: payment,
        Thue: 0,
        TongTien: total,
        TinhTrangThanhToan: tinhtrangthanhtoan
      });

      console.log("✅ Đã tạo hoá đơn:", hoaDonId);
      for (const item of cart) {
        await CartModel.xoaSanPhamTrongGio(userId, item.SanPhamID);
      }
      req.session.cartCheckout = null;
      req.session.cartTotal = 0;
  
      res.redirect('/cart/confirm'); 
      //
  
    } catch (error) {
      console.error("❌ Lỗi khi lưu hoá đơn:", error);
      res.redirect('/user/errorPage?error=' + encodeURIComponent("Lỗi khi lưu hoá đơn"));
    }
  };
  
  
const renderThankYouPage = (req, res) => {
    try{
        const cart = req.session.cartData || [];
        const total = req.session.cartTotal || 0;
        const {}=req.body
        res.render('confirm', {
            layout: 'main',
             cart, total });
      }
    catch (error) {
        console.error('Lỗi xulicart:', error);
        res.redirect('user/errorPage?error=' + encodeURIComponent('Lỗi xử lý giỏ hàng'));
    }
};

    
module.exports = { 
    renderCartPage,
    thanhtoan,
    afterpayment,
    renderThankYouPage,
    addToCart
};
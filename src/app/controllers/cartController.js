const CartModel = require('../model/cartModel');

const renderCartPage = async (req, res, next) => {
    try {
        const cartItems = await CartModel.getCartByUserId(req.session.user_id);
        res.render('cart', { cart: cartItems, session: req.session });
    } catch (error) {
        res.redirect('/errorPage?error=' + encodeURIComponent('Lỗi khi tải giỏ hàng'));
    }
};

const thanhtoan = async (req, res) => {
    try {
        const { idSanPham, soluong, tongTien } = req.body;
        const userId = req.session.user_id;

        if (!userId) {
            return res.redirect('/account?error=' + encodeURIComponent('Chưa đăng nhập'));
        }

        console.log('Sản phẩm:', idSanPham);
        console.log('Số lượng:', soluong);
        console.log('Tổng tiền:', tongTien);


        res.render('thanhtoan');
    } catch (error) {
        console.error('Lỗi xulicart:', error);
        res.redirect('/errorPage?error=' + encodeURIComponent('Lỗi xử lý giỏ hàng'));
    }
};
module.exports = { 
    renderCartPage,
    thanhtoan
};
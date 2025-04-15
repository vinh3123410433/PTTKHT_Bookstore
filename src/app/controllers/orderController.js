
const OrderModel = require('../model/orderModel');

const handleCheckout = async (req, res, next) => {
    const { idSanPham, soluong, tongTien } = req.body;
    const userId = req.session.user_id;

    if (!userId) {
        return res.redirect('user/account?error=' + encodeURIComponent('Bạn chưa đăng nhập'));
    }

    if (!idSanPham || !soluong || !tongTien) {
        return res.redirect('cart/cart?error=' + encodeURIComponent('Thiếu thông tin thanh toán'));
    }

    try {
        const items = [];

        if (Array.isArray(idSanPham)) {
            for (let i = 0; i < idSanPham.length; i++) {
                items.push({
                    idSanPham: parseInt(idSanPham[i]),
                    soLuong: parseInt(soluong[i])
                });
            }
        } else {

            items.push({
                idSanPham: parseInt(idSanPham),
                soLuong: parseInt(soluong)
            });
        }
        

        // const orderId = await OrderModel.createOrder(userId, tongTien);
        // await OrderModel.addOrderDetails(orderId, items);

        res.redirect('/success?message=' + encodeURIComponent('Đặt hàng thành công!'));
    } catch (error) {
        console.error('Lỗi thanh toán:', error);
        res.redirect('user/errorPage?error=' + encodeURIComponent('Lỗi khi xử lý thanh toán'));
    }
};

module.exports = {
    handleCheckout
};

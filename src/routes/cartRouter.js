
const express=require('express')
const router=express.Router()
const cartController=require('../app/controllers/cartController')
router.get('/', cartController.renderCartPage);
router.post('/thanhtoan', cartController.thanhtoan);

router.post('/confirm', cartController.afterpayment);
router.get('/confirm', cartController.renderThankYouPage);
router.post('/addToCart', cartController.addToCart);

module.exports=router

const express=require('express')
const router=express.Router()
const cartController=require('../app/controllers/cartController')
router.get('/cart', cartController.renderCartPage);
router.post('/thanhtoan', cartController.thanhtoan);
module.exports=router
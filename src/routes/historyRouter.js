const express=require('express')
const router=express.Router()   

const historyController=require('../app/controllers/historyController') 
router.get('/', historyController.renderHistoryPage);

module.exports=router

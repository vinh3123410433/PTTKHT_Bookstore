import express from "express";
import orderController from "../../app/controllers/user/orderController.js";

const router = express.Router();

router.post("/thanhtoan", orderController.handleCheckout);
router.post("/huyDonHang", orderController.huyDonHang);

export default router;

import express from "express";
import orderController from "../app/controllers/orderController.js";

const router = express.Router();

router.post("/thanhtoan", orderController.handleCheckout);
router.post("/huyDonHang", orderController.huyDonHang);

export default router;

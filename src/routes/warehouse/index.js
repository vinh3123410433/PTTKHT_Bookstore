// const productRouter = require('./product');
// const providerRouter = require('./provider');
// const categoryRouter = require('./category');
// const receiptRouter = require('./receipt');
// const dashboardRouter = require('./dashboard');
// const statisticRouter = require('./statistic');
import express from "express";
import {
  isLoggedIn,
  redirectByRole,
  checkRole,
  checkPermission,
} from "../../app/middlewares/admin/auth.js";
import productRouter from "./product.js";
import providerRouter from "./provider.js";
import categoryRouter from "./category.js";
import receiptRouter from "./receipt.js";
import dashboardRouter from "./dashboard.js";
import statisticRouter from "./statistic.js";
const router = express.Router();

router.use("/product", isLoggedIn, checkPermission("qlsanpham"), productRouter);

router.use(
  "/category",
  isLoggedIn,
  checkPermission("qldanhmuc"),
  categoryRouter
); // trang category

router.use("/provider", isLoggedIn, checkPermission("qlncc"), providerRouter); // trang provider

router.use("/receipt", isLoggedIn, checkPermission("qlhdn"), receiptRouter); // trang hóa đơn

router.use(
  "/statistic",
  isLoggedIn,
  checkPermission("qlthongke"),
  statisticRouter
); // trang thống kê
router.use("/", isLoggedIn, dashboardRouter); // trang dáhboard

// module.exports = router;
export default router;

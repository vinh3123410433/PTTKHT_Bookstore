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
} from "../app/middlewares/admin/auth.js";

import providerRouter from "./warehouse/provider.js";
import receiptRouter from "./warehouse/receipt.js";
import dashboardRouter from "./warehouse/dashboard.js";
import statisticRouter from "./warehouse/statistic.js";
const router = express.Router();

// router.use(
//   "/product",
//   isLoggedIn,
//   checkPermission(["qlsanpham", "qlkho"]),
//   productRouter
// );

// router.use(
//   "/category",
//   console.log("Vào"),
//   isLoggedIn,
//   checkPermission(["qlkho", "qldanhmuc"]),
//   categoryRouter
// ); // trang category

router.use(
  "/provider",
  isLoggedIn,
  checkPermission(["qlncc", "qlkho"]),
  providerRouter
); // trang provider

router.use(
  "/receipt",
  isLoggedIn,
  checkPermission(["qlhdn", "qlkho"]),
  receiptRouter
); // trang hóa đơn

router.use(
  "/statistic",
  isLoggedIn,
  checkPermission(["qlthongke", "qlkho"]),
  statisticRouter
); // trang thống kê
router.use("/", isLoggedIn, dashboardRouter); // trang dáhboard

// module.exports = router;
export default router;

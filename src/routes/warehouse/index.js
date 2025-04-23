// const productRouter = require('./product');
// const providerRouter = require('./provider');
// const categoryRouter = require('./category');
// const receiptRouter = require('./receipt');
// const dashboardRouter = require('./dashboard');
// const statisticRouter = require('./statistic');
import express from "express";

import productRouter from "./product.js";
import providerRouter from "./provider.js";
import categoryRouter from "./category.js";
import receiptRouter from "./receipt.js";
import dashboardRouter from "./dashboard.js";
import statisticRouter from "./statistic.js";
const router = express.Router();

router.use("/product", productRouter); // trang product

router.use("/category", categoryRouter); // trang category

router.use("/provider", providerRouter); // trang provider

router.use("/receipt", receiptRouter); // trang hóa đơn

router.use("/statistic", statisticRouter); // trang thống kê
router.use("/", dashboardRouter); // trang dáhboard

// module.exports = router;
export default router;

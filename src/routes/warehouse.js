// const productRouter = require("./warehouse/product");
// const providerRouter = require("./warehouse/provider");
// const categoryRouter = require("./warehouse/category");
// const receiptRouter = require("./receipt");
// const dashboardRouter = require("./warehouse/dashboard");
// const statisticRouter = require("./warehouse/statistic");
import express from "express";

import productRouter from "./warehouse/product.js";
import providerRouter from "./warehouse/provider.js";
import categoryRouter from "./warehouse/category.js";
import receiptRouter from "./warehouse/receipt.js";
import dashboardRouter from "./warehouse/dashboard.js";
import statisticRouter from "./warehouse/statistic.js";

const router = express.Router();

router.use("/product", productRouter); // trang product

router.use("/category", categoryRouter); // trang category

router.use("/provider", providerRouter); // trang provider

router.use("/receipt", receiptRouter); // trang hóa đơn

router.use("/statistic", statisticRouter); // trang thống kê
router.use("/", dashboardRouter); // trang dáhboard

// module.exports = router;
export default router;

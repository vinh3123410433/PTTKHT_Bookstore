import express from "express";
import orderRouter from "./sales/orders.js";
import DashboardController from "../app/controllers/sales/DashboardController.js";
import statisticRouter from "./sales/statistic.js"; // Corrected import path

const router = express.Router();

router.use("/orders", orderRouter);
router.use("/statistic", statisticRouter); // Corrected import path
router.get("/", DashboardController.show);

export default router;

import express from "express";
import orderRouter from "./sales/orders.js";
import DashboardController from "../app/controllers/sales/DashboardController.js";
import statisticRouter from "./sales/statistic.js";
import {
  isLoggedIn,
  redirectByRole,
  checkRole,
  checkPermission,
} from "../app/middlewares/admin/auth.js";

const router = express.Router();

router.use(
  "/orders",
  isLoggedIn,
  checkPermission(["qldhx", "qlbanhang"]),
  orderRouter
);
router.use(
  "/statistic",
  isLoggedIn,
  checkPermission(["qlthongkexuat", "qlbanhang"]),
  statisticRouter
);
router.get("/", DashboardController.show);

export default router;

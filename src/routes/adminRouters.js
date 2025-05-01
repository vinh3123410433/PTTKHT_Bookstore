// routes/adminRouters.js
import express from "express";
const router = express.Router();

import AdminController from "../app/controllers/admin/AdminController.js";
import {
  isLoggedIn,
  redirectByRole,
  checkRole,
} from "../app/middlewares/admin/auth.js";

// Import các router phụ bằng ES module
import warehouseRouter from "./warehouse.js";
import salesRouter from "./salesRouter.js";
import dashboardRouter from "./dashboardRouter.js";
// import saleRouter from "./sale.js";

// Trang đăng nhập
router.get("/login", AdminController.showLogin);
router.post("/login", AdminController.handleLogin);

router.use(
  "/warehouse",
  isLoggedIn,
  checkRole("admin", "quản lý kho"),
  warehouseRouter
);
router.use(
  "/sales",
  isLoggedIn,
  checkRole("admin", "quản lý bán hàng"),
  salesRouter
);
router.use("/dashboard", isLoggedIn, dashboardRouter);

// Trang chủ admin (chuyển hướng theo vai trò)
router.get("/", isLoggedIn, redirectByRole);

export default router;

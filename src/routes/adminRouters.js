// routes/adminRouters.js
import express from "express";
const router = express.Router();

import AdminController from "../app/controllers/admin/AdminController.js";
import { isLoggedIn, redirectByRole } from "../app/middlewares/admin/auth.js";

// Import các router phụ bằng ES module
import warehouseRouter from "./warehouse.js";
import salesRouter from "./salesRouter.js";
// import dashboardRouter from "./dashboardRouter.js";
// import saleRouter from "./sale.js";

// Trang đăng nhập
router.get("/login", AdminController.showLogin);
router.post("/login", AdminController.handleLogin);

// Các route phân hệ (bật khi cần)
router.use("/sales", isLoggedIn, salesRouter);
router.use("/warehouse", isLoggedIn, warehouseRouter);
// router.use("/dashboard", isLoggedIn, dashboardRouter);

// Trang chủ admin (chuyển hướng theo vai trò)
router.get("/", isLoggedIn, redirectByRole);

export default router;
